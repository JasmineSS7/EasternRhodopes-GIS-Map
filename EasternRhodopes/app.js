/**
 * Main Application Orchestrator & GeoJSON Data Pipeline
 */
import { MapEngine } from './js/map.js';
import { createPopupContent } from './js/popup.js';
import { FilterEngine } from './js/filters.js';
import { initSearch } from './js/search.js';
import { initSidebar } from './js/sidebar.js';
import { loadRoutes } from './js/routes.js';
import { Gallery } from './js/gallery.js';
import { initRandom } from './js/random.js';
import { initThemeToggle } from './js/animations.js';

class App {
  constructor() {
    this.mapEngine = new MapEngine('map');
    this.gallery = new Gallery();
    this.placesData = [];
    this.categories = [];
    this.favorites = JSON.parse(localStorage.getItem('rhodope_favs') || '[]');
    this.activeFilter = 'all';
    this.searchQuery = '';
  }

  async run() {
    // 1. Initialize UI Elements
    this.initHero();
    initSidebar();
    initThemeToggle();
    this.mapEngine.init();

    // 2. Fetch GeoJSON and Category Meta Data
    await this.loadData();

    // 3. Initialize Filters & Search
    this.filterEngine = new FilterEngine(this.categories, (catId) => {
      this.activeFilter = catId;
      this.renderMarkers();
    });

    initSearch((query) => {
    this.searchQuery = query;
    this.renderMarkers();
    }, this.mapEngine);

    initRandom(this.placesData, this.mapEngine);
    await loadRoutes(this.mapEngine);

    // 4. Initial Render
    this.updateCategoryCountsUI();
    this.renderMarkers();
  }

  initHero() {
    const btn = document.getElementById('btn-start-adventure');
    const hero = document.getElementById('hero-screen');
    const appContainer = document.getElementById('app-container');

    btn.addEventListener('click', () => {
      hero.classList.add('fade-out');
      appContainer.classList.remove('hidden');
      setTimeout(() => {
        hero.style.display = 'none';
        this.mapEngine.map.invalidateSize();
      }, 400);
    });
  }

  async loadData() {
    try {
      const [placesRes, catRes] = await Promise.all([
        fetch('data/places.geojson'),
        fetch('data/categories.json')
      ]);

      const placesGeoJson = await placesRes.json();
      this.placesData = placesGeoJson.features;
      this.categories = await catRes.json();
    } catch (e) {
      console.error('Error loading GeoJSON data:', e);
    }
  }

  updateCategoryCountsUI() {
    const counts = {};
    this.placesData.forEach(f => {
      const c = f.properties.category;
      counts[c] = (counts[c] || 0) + 1;
    });
    this.filterEngine.renderCategoriesUI('categories-list', counts);
  }

  renderMarkers() {
    this.mapEngine.clearMarkers();

    const filtered = this.placesData.filter(feature => {
      const props = feature.properties;
      
      // Favorites filter logic
      if (this.activeFilter === 'favorites') {
        if (!this.favorites.includes(props.id)) return false;
      } else if (this.activeFilter !== 'all' && props.category !== this.activeFilter) {
        return false;
      }

      // Search Query Logic
      if (this.searchQuery) {
        const q = this.searchQuery;
        const matchName = props.title.toLowerCase().includes(q);
        const matchCity = props.city.toLowerCase().includes(q);
        const matchDesc = props.description.toLowerCase().includes(q);
        const matchKeys = props.keywords && props.keywords.some(k => k.toLowerCase().includes(q));
        
        return matchName || matchCity || matchDesc || matchKeys;
      }

      return true;
    });

    filtered.forEach(feature => {
      const [lng, lat] = feature.geometry.coordinates;
      const props = feature.properties;
      props.lat = lat;
      props.lng = lng;

      // Custom SVG Marker Icon Pin
      const catObj = this.categories.find(c => c.id === props.category) || {};
      const color = catObj.color || '#1B3B2B';
      const iconClass = catObj.icon || 'fa-location-dot';

      const customIcon = L.divIcon({
        className: 'custom-pin-wrapper',
        html: `<div class="custom-pin" style="background-color: ${color};">
                <i class="fa-solid ${iconClass}"></i>
               </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });
      feature.markerRef = marker;

      // Bind Custom Popup Card
      const isFav = this.favorites.includes(props.id);
      const popupHtml = createPopupContent(props, isFav);
      marker.bindPopup(popupHtml, { className: 'custom-leaflet-popup' });

      // Event Delegation inside popup open
      marker.on('popupopen', () => {
        const popupEl = marker.getPopup().getElement();
        
        // Navigation Button Click
        popupEl.querySelector('.btn-nav')?.addEventListener('click', () => {
          window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
        });

        // Gallery Modal Button
        popupEl.querySelector('.btn-gallery')?.addEventListener('click', () => {
          this.gallery.open(props.gallery || [props.image], props.title);
        });

        // Share Button
        popupEl.querySelector('.btn-share')?.addEventListener('click', () => {
          if (navigator.share) {
            navigator.share({ title: props.title, text: props.description, url: window.location.href });
          } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Линкът е копиран!');
          }
        });

        // Favorite Toggle Button
        popupEl.querySelector('.popup-fav-btn')?.addEventListener('click', (e) => {
          const btn = e.currentTarget;
          const id = props.id;
          if (this.favorites.includes(id)) {
            this.favorites = this.favorites.filter(item => item !== id);
            btn.querySelector('i').className = 'fa-regular fa-star';
          } else {
            this.favorites.push(id);
            btn.querySelector('i').className = 'fa-solid fa-star';
          }
          localStorage.setItem('rhodope_favs', JSON.stringify(this.favorites));
          this.updateCategoryCountsUI();
        });
      });

      this.mapEngine.markersGroup.addLayer(marker);
    });
  }
}

// Bootstrap Application on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.run();
});