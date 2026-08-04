/**
 * Search Module - Combined GeoJSON & OpenStreetMap Geocoding Search (Clean UX)
 */
export function initSearch(onSearch, mapEngine) {
  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  let timeout = null;

  const searchBox = document.querySelector('.search-box');
  let resultsList = document.createElement('ul');
  resultsList.id = 'search-results-dropdown';
  resultsList.className = 'search-dropdown hidden';
  searchBox.appendChild(resultsList);

  // Функция за пълно изчистване и връщане в начално състояние
  const resetSearchState = () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    resultsList.classList.add('hidden');
    onSearch('');
  };

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    if (query.length > 0) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
      resultsList.classList.add('hidden');
    }

    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      onSearch(query.toLowerCase());

      if (query.length >= 3) {
        await fetchOSMLocations(query, mapEngine, resultsList, resetSearchState);
      } else {
        resultsList.classList.add('hidden');
      }
    }, 350);
  });

  clearBtn.addEventListener('click', () => {
    resetSearchState();
    if (window.currentSearchMarker && mapEngine.map) {
      mapEngine.map.removeLayer(window.currentSearchMarker);
      window.currentSearchMarker = null;
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchBox.contains(e.target)) {
      resultsList.classList.add('hidden');
    }
  });
}

/**
 * Извиква OpenStreetMap Nominatim API за села/градове/улици
 */
async function fetchOSMLocations(query, mapEngine, resultsList, resetSearchState) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=bg&limit=5&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: { 'User-Agent': 'RhodopeInteractiveMap/1.0' }
    });
    const data = await response.json();

    resultsList.innerHTML = '';

    if (data && data.length > 0) {
      resultsList.classList.remove('hidden');

      data.forEach(place => {
        const li = document.createElement('li');
        li.className = 'search-dropdown-item';
        
        const mainName = place.display_name.split(',')[0];
        const secondaryText = place.display_name.split(',').slice(1, 3).join(',');

        li.innerHTML = `
          <i class="fa-solid fa-location-dot"></i>
          <div>
            <strong>${mainName}</strong>
            <small>${secondaryText}</small>
          </div>
        `;

        li.addEventListener('click', () => {
          const lat = parseFloat(place.lat);
          const lon = parseFloat(place.lon);

          // 1. Прелитаме плавно до намереното село
          mapEngine.map.flyTo([lat, lon], 14, { duration: 1.5 });

          // 2. Премахваме предишен временен маркер, ако има такъв
          if (window.currentSearchMarker) {
            mapEngine.map.removeLayer(window.currentSearchMarker);
          }

          // 3. Добавяме нов маркер
          const marker = L.marker([lat, lon])
            .addTo(mapEngine.map)
            .bindPopup(`<b>${mainName}</b><br>${secondaryText}`)
            .openPopup();

          window.currentSearchMarker = marker;

          // 4. Автоматично почистваме маркера, когато попъпът бъде затворен
          marker.on('popupclose', () => {
            if (window.currentSearchMarker) {
              mapEngine.map.removeLayer(window.currentSearchMarker);
              window.currentSearchMarker = null;
            }
          });

          // 5. Връщаме търсачката в чист начален вид
          resetSearchState();
        });

        resultsList.appendChild(li);
      });
    } else {
      resultsList.classList.add('hidden');
    }
  } catch (err) {
    console.error('Грешка при търсене:', err);
  }
}