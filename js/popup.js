export function createPopupContent(properties, isFavorite = false) {
  const { id, title, city, description, fact, image, gallery, support, story, narrator } = properties;

  const imageBlock = image
    ? `
      <div class="popup-image-container">
        <img src="${image}" alt="${title}" loading="lazy" />
        <span class="popup-badge">${city}</span>
        <button class="popup-fav-btn" data-id="${id}" title="Любими">
          <i class="${isFavorite ? 'fa-solid' : 'fa-regular'} fa-star"></i>
        </button>
      </div>`
    : `
      <div class="popup-header-no-img">
        <span class="popup-badge-static"><i class="fa-solid fa-location-dot"></i> ${city}</span>
        <button class="popup-fav-btn static-pos" data-id="${id}" title="Любими">
          <i class="${isFavorite ? 'fa-solid' : 'fa-regular'} fa-star"></i>
        </button>
      </div>`;

  const storyBlock = story
    ? `
      <div class="popup-story-box">
        <i class="fa-solid fa-quote-left quote-icon"></i>
        <p class="story-quote">„${story}“</p>
        ${narrator ? `<small class="story-narrator">— ${narrator}</small>` : ''}
      </div>`
    : '';

  const hasPhotos = (gallery && gallery.length > 0) || Boolean(image);
  const galleryBtn = hasPhotos
    ? `<button class="popup-btn btn-gallery" data-id="${id}">
        <i class="fa-solid fa-images"></i> Галерия
       </button>`
    : '';

  return `
    <div class="popup-card ${!image ? 'no-image' : ''}">
      ${imageBlock}
      <div class="popup-body">
        <h3 class="popup-title">${title}</h3>
        
        ${storyBlock}

        <p class="popup-desc">${description}</p>
        
        ${fact ? `<div class="popup-fact"><i class="fa-solid fa-lightbulb"></i> ${fact}</div>` : ''}
        ${support ? `<div class="popup-support-box"><i class="fa-solid fa-hand-holding-heart"></i> <strong>Как да помогнеш:</strong> ${support}</div>` : ''}

        <div class="popup-actions">
          <button class="popup-btn btn-nav" data-lat="${properties.lat}" data-lng="${properties.lng}">
            <i class="fa-solid fa-location-arrow"></i> Навигация
          </button>
          ${galleryBtn}
          <button class="popup-btn btn-share" data-title="${title}">
            <i class="fa-solid fa-share-nodes"></i> Сподели
          </button>
        </div>
      </div>
    </div>
  `;
}