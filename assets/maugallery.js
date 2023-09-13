document.addEventListener("DOMContentLoaded", function() {
  const galleries = document.querySelectorAll(".gallery");

  galleries.forEach(function(gallery) {
    mauGallery(gallery, {
      columns: {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 3
      },
      lightBox: true,
      lightboxId: "myAwesomeLightbox",
      showTags: true,
      tagsPosition: "top"
    });
  });
});

function mauGallery(gallery, options) {
  const defaultOptions = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };

  options = { ...defaultOptions, ...options };

  function createRowWrapper(element) {
    if (!element.firstElementChild.classList.contains("row")) {
      const rowWrapper = document.createElement("div");
      rowWrapper.classList.add("gallery-items-row", "row");
      element.appendChild(rowWrapper);
    }
  }

  function wrapItemInColumn(element, columns) {
    const columnClasses = [];
    if (typeof columns === "number") {
      columnClasses.push(`col-${Math.ceil(12 / columns)}`);
    } else if (typeof columns === "object") {
      if (columns.xs) columnClasses.push(`col-${Math.ceil(12 / columns.xs)}`);
      if (columns.sm) columnClasses.push(`col-sm-${Math.ceil(12 / columns.sm)}`);
      if (columns.md) columnClasses.push(`col-md-${Math.ceil(12 / columns.md)}`);
      if (columns.lg) columnClasses.push(`col-lg-${Math.ceil(12 / columns.lg)}`);
      if (columns.xl) columnClasses.push(`col-xl-${Math.ceil(12 / columns.xl)}`);
    }

    const columnWrapper = document.createElement("div");
    columnWrapper.classList.add("item-column", "mb-4", ...columnClasses);
    element.parentElement.appendChild(columnWrapper);
    columnWrapper.appendChild(element);
  }

  function moveItemInRowWrapper(element) {
    gallery.querySelector(".gallery-items-row").appendChild(element);
  }

  function responsiveImageItem(element) {
    if (element.tagName === "IMG") {
      element.classList.add("img-fluid");
    }
  }

  function openLightBox(element, lightboxId) {
    const lightbox = document.getElementById(lightboxId || "galleryLightbox");
    const lightboxImage = lightbox.querySelector(".lightboxImage");
    lightboxImage.src = element.src;
    lightbox.style.display = "block";
  }

  function prevImage() {
    const activeImage = document.querySelector("img.gallery-item[src='" + document.querySelector(".lightboxImage").src + "']");
    const activeTag = document.querySelector(".tags-bar span.active-tag").getAttribute("data-images-toggle");
    const imagesCollection = [];
    let index = 0;
    let next = null;

    if (activeTag === "all") {
      document.querySelectorAll(".item-column img").forEach(function(image) {
        imagesCollection.push(image);
      });
    } else {
      document.querySelectorAll(".item-column img[data-gallery-tag='" + activeTag + "']").forEach(function(image) {
        imagesCollection.push(image);
      });
    }

    imagesCollection.forEach(function(image, i) {
      if (image.src === activeImage.src) {
        index = i - 1;
      }
    });

    next = imagesCollection[index] || imagesCollection[imagesCollection.length - 1];
    document.querySelector(".lightboxImage").src = next.src;
  }

  function nextImage() {
    const activeImage = document.querySelector("img.gallery-item[src='" + document.querySelector(".lightboxImage").src + "']");
    const activeTag = document.querySelector(".tags-bar span.active-tag").getAttribute("data-images-toggle");
    const imagesCollection = [];
    let index = 0;
    let next = null;

    if (activeTag === "all") {
      document.querySelectorAll(".item-column img").forEach(function(image) {
        imagesCollection.push(image);
      });
    } else {
      document.querySelectorAll(".item-column img[data-gallery-tag='" + activeTag + "']").forEach(function(image) {
        imagesCollection.push(image);
      });
    }

    imagesCollection.forEach(function(image, i) {
      if (image.src === activeImage.src) {
        index = i + 1;
      }
    });

    next = imagesCollection[index] || imagesCollection[0];
    document.querySelector(".lightboxImage").src = next.src;
  }

  function createLightBox(gallery, lightboxId, navigation) {
    const lightboxHtml = `
      <div class="modal fade" id="${lightboxId || "galleryLightbox"}" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-body">
              ${navigation ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>' : '<span style="display:none;" />'}
              <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clique"/>
              ${navigation ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>' : '<span style="display:none;" />'}
            </div>
          </div>
        </div>
      </div>`;
    gallery.insertAdjacentHTML("beforeend", lightboxHtml);
  }

  function showItemTags(gallery, position, tags) {
    let tagItems = `<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>`;
    tags.forEach(function(tag) {
      tagItems += `<li class="nav-item active">
                    <span class="nav-link"  data-images-toggle="${tag}">${tag}</span>
                  </li>`;
    });
    const tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

    if (position === "bottom") {
      gallery.insertAdjacentHTML("beforeend", tagsRow);
    } else if (position === "top") {
      gallery.insertAdjacentHTML("afterbegin", tagsRow);
    } else {
      console.error(`Unknown tags position: ${position}`);
    }
  }

  function filterByTag() {
    if (this.classList.contains("active-tag")) {
      return;
    }

    document.querySelector(".active.active-tag").classList.remove("active", "active-tag");
    this.classList.add("active-tag", "active");

    const tag = this.getAttribute("data-images-toggle");

    document.querySelectorAll(".gallery-item").forEach(function(item) {
      item.closest(".item-column").style.display = "none";
      if (tag === "all" || item.getAttribute("data-gallery-tag") === tag) {
        item.closest(".item-column").style.display = "block";
      }
    });
  }

  createRowWrapper(gallery);

  if (options.lightBox) {
    createLightBox(gallery, options.lightboxId, options.navigation);
  }

  const tagsCollection = [];

  gallery.querySelectorAll(".gallery-item").forEach(function(item) {
    responsiveImageItem(item);
    moveItemInRowWrapper(item);
    wrapItemInColumn(item, options.columns);
    const theTag = item.getAttribute("data-gallery-tag");
    if (options.showTags && theTag !== undefined && tagsCollection.indexOf(theTag) === -1) {
      tagsCollection.push(theTag);
    }
  });

  if (options.showTags) {
    showItemTags(gallery, options.tagsPosition, tagsCollection);
  }

  gallery.style.display = "block";

  gallery.querySelectorAll(".gallery-item").forEach(function(item) {
    item.addEventListener("click", function() {
      if (options.lightBox && item.tagName === "IMG") {
        openLightBox(item, options.lightboxId);
      } else {
        return;
      }
    });
  });

  gallery.querySelector(".tags-bar").addEventListener("click", function(event) {
    if (event.target.classList.contains("nav-link")) {
      filterByTag.call(event.target);
    }
  });

  if (options.navigation) {
    gallery.querySelector(".mg-prev").addEventListener("click", prevImage);
    gallery.querySelector(".mg-next").addEventListener("click", nextImage);
  }
}
