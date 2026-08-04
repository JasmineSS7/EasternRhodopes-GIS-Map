/**
 * "Surprise Me" Module - Picks a random place feature and flies map smoothly.
 */
export function initRandom(places, mapEngine) {
  const btn = document.getElementById('btn-random-place');
  
  btn.addEventListener('click', () => {
    if (!places || places.length === 0) return;
    const randomIndex = Math.floor(Math.random() * places.length);
    const target = places[randomIndex];
    
    mapEngine.flyTo(target.geometry.coordinates, 15);
    
    setTimeout(() => {
      if (target.markerRef) {
        target.markerRef.openPopup();
      }
    }, 1600);
  });
}