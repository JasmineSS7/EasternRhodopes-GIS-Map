/**
 * Routes GeoJSON Loader & Layer Controller
 */
export async function loadRoutes(mapEngine) {
  try {
    const res = await fetch('data/routes.geojson');
    const data = await res.json();

    L.geoJSON(data, {
      style: (feature) => ({
        color: feature.properties.color || '#0288d1',
        weight: 5,
        opacity: 0.8,
        dashArray: feature.properties.type === 'biking' ? '5, 10' : null
      }),
      onEachFeature: (feature, layer) => {
        layer.bindTooltip(`<b>${feature.properties.name}</b><br>${feature.properties.distance} (${feature.properties.duration})`);
      }
    }).addTo(mapEngine.routesGroup);
  } catch (e) {
    console.error('Failed loading routes GeoJSON:', e);
  }
}