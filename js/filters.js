/**
 * Filters Module - Manages category state and GeoJSON marker filtering.
 */
export class FilterEngine {
  constructor(categories, onFilterChange) {
    this.categories = categories;
    this.activeCategory = 'all';
    this.onFilterChange = onFilterChange;
  }

  renderCategoriesUI(containerId, counts) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    // "All" Category Item
    const allLi = document.createElement('li');
    allLi.className = `cat-item ${this.activeCategory === 'all' ? 'active' : ''}`;
    allLi.innerHTML = `
      <div class="cat-item-content">
        <i class="fa-solid fa-border-all"></i>
        <span>Всички обекти</span>
      </div>
      <span class="cat-badge">${Object.values(counts).reduce((a, b) => a + b, 0)}</span>
    `;
    allLi.addEventListener('click', () => this.setActive('all'));
    container.appendChild(allLi);

    // Dynamic Categories
    this.categories.forEach(cat => {
      const li = document.createElement('li');
      li.className = `cat-item ${this.activeCategory === cat.id ? 'active' : ''}`;
      li.innerHTML = `
        <div class="cat-item-content">
          <i class="fa-solid ${cat.icon}" style="color: ${cat.color}"></i>
          <span>${cat.name}</span>
        </div>
        <span class="cat-badge">${counts[cat.id] || 0}</span>
      `;
      li.addEventListener('click', () => this.setActive(cat.id));
      container.appendChild(li);
    });
  }

  setActive(catId) {
    this.activeCategory = catId;
    document.querySelectorAll('.cat-item').forEach(el => el.classList.remove('active'));
    this.onFilterChange(this.activeCategory);
  }
}