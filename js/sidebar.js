/**
 * Sidebar & Actions Controller
 */
export function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('btn-toggle-sidebar');
  const suggestBtn = document.getElementById('btn-suggest-place');

  // Логика за свиване и разгъване на менюто
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  // Логика за отваряне на Google формата при клик на бутона "Предложи място"
  if (suggestBtn) {
    suggestBtn.addEventListener('click', () => {
      // ЗАМЕНИ ТУК С ТВОЯ РЕАЛЕН ЛИНК ОТ GOOGLE FORMS:
      const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSeAWSlVtlAR8jE3Ue86_GbPe_z37d5LrZJ05K7BpC8eBDzfng/viewform?usp=header"; 
      window.open(googleFormUrl, '_blank');
    });
  }
}