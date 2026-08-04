/**
 * Popup Module - Renders custom Glassmorphism popup cards for GeoJSON entities.
 */
export function createPopupContent(properties, isFavorite = false) {
  const { id, title, category, city, description, fact, image, support } = properties;

  return `
    <div class="popup-card">
      <div class="popup-image-container">
        <img src="${image}" alt="${title}" loading="lazy" />
        <span class="popup-badge">${city}</span>
        <button class="popup-fav-btn" data-id="${id}">
          <i class="${isFavorite ? 'fa-solid' : 'fa-regular'} fa-star"></i>
        </button>
      </div>
      <div class="popup-body">
        <h3 class="popup-title">${title}</h3>
        <p class="popup-desc">${description}</p>
        
        ${fact ? `<div class="popup-fact"><i class="fa-solid fa-lightbulb"></i> ${fact}</div>` : ''}
        ${support ? `<div class="popup-support-box"><i class="fa-solid fa-hand-holding-heart"></i> <strong>Как да помогнеш:</strong> ${support}</div>` : ''}

        <div class="popup-actions">
          <button class="popup-btn btn-nav" data-lat="${properties.lat}" data-lng="${properties.lng}">
            <i class="fa-solid fa-location-arrow"></i> Навигация
          </button>
          <button class="popup-btn btn-gallery" data-id="${id}">
            <i class="fa-solid fa-images"></i> Галерия
          </button>
          <button class="popup-btn btn-share" data-title="${title}">
            <i class="fa-solid fa-share-nodes"></i> Сподели
          </button>
        </div>
      </div>
    </div>
  `;
}