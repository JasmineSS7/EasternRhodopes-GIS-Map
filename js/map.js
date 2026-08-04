/**
 * Map Module - Handles Leaflet initialization, GeoJSON layers, tile providers, and cluster overlays.
 */
export class MapEngine {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.markersGroup = null;
    this.routesGroup = null;
  }

  init() {
    // Initial coordinates centered on Eastern Rhodopes (Kardzhali Region)
    this.map = L.map(this.containerId, {
      center: [41.6000, 25.5000],
      zoom: 10,
      zoomControl: false
    });

    // Tile Layer - OpenStreetMap Standard Mapnik
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | Източни Родопи'
    }).addTo(this.map);

    // Add UI Controls
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);
    
    if (L.control.fullscreen) {
      this.map.addControl(new L.Control.Fullscreen({ position: 'bottomright' }));
    }

    // Initialize Cluster Layer
    this.markersGroup = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true
    });
    this.map.addLayer(this.markersGroup);

    this.routesGroup = L.layerGroup().addTo(this.map);
  }

  flyTo(coords, zoom = 14) {
    this.map.flyTo([coords[1], coords[0]], zoom, {
      duration: 1.5
    });
  }

  clearMarkers() {
    this.markersGroup.clearLayers();
  }
}