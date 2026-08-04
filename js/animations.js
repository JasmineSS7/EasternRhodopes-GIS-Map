/**
 * UI Animations & Theme Controller
 */
export function initThemeToggle() {
  const btn = document.getElementById('btn-toggle-theme');
  const body = document.body;

  btn.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    const isDark = body.classList.contains('dark-theme');
    btn.querySelector('i').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    localStorage.setItem('rhodope_theme', isDark ? 'dark' : 'light');
  });

  // Restore Theme Choice
  const saved = localStorage.getItem('rhodope_theme');
  if (saved === 'dark') {
    body.classList.add('dark-theme');
    btn.querySelector('i').className = 'fa-solid fa-sun';
  }
}