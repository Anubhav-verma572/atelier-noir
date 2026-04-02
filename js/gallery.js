/* ============================================
   ATELIER NOIR — Gallery JavaScript
   Handling filtering, sorting, and interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const Gallery = {
    init() {
      this.grid = document.getElementById('gallery-grid');
      if (!this.grid) return;

      this.items = Array.from(this.grid.querySelectorAll('.gallery__item'));
      this.filterBtns = document.querySelectorAll('.filter-btn');
      this.sortSelect = document.getElementById('sort-select');
      this.countDisplay = document.getElementById('item-count');
      this.emptyState = document.getElementById('gallery-empty');

      this.bindEvents();
      this.updateCount();
    },

    bindEvents() {
      // Filter clicks
      this.filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.filterBtns.forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          this.filterItems(e.target.dataset.filter);
        });
      });

      // Sort change
      if (this.sortSelect) {
        this.sortSelect.addEventListener('change', (e) => {
          this.sortItems(e.target.value);
        });
      }
    },

    filterItems(category) {
      let visibleCount = 0;

      this.items.forEach(item => {
        const itemCategory = item.dataset.category;
        
        if (category === 'all' || itemCategory === category) {
          item.classList.remove('is-hiding', 'is-hidden');
          visibleCount++;
        } else {
          item.classList.add('is-hiding');
          // Wait for transition before hiding completely
          setTimeout(() => {
            if (item.classList.contains('is-hiding')) {
              item.classList.add('is-hidden');
              item.classList.remove('is-hiding');
            }
          }, 300); // Matches var(--duration-normal)
        }
      });

      this.updateCount(visibleCount);

      if (visibleCount === 0) {
        setTimeout(() => {
          this.emptyState.classList.add('is-visible');
        }, 300);
      } else {
        this.emptyState.classList.remove('is-visible');
      }
    },

    sortItems(method) {
      // Re-order DOM elements based on sort method
      const sortedItems = [...this.items].sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        const dateA = new Date(a.dataset.date);
        const dateB = new Date(b.dataset.date);

        switch (method) {
          case 'price-asc': return priceA - priceB;
          case 'price-desc': return priceB - priceA;
          case 'newest': return dateB - dateA;
          case 'featured': default:
            // Use original DOM order via a data-index if needed, or simple reset
            return a.dataset.index - b.dataset.index;
        }
      });

      // Re-append to grid in new order
      sortedItems.forEach(item => {
        this.grid.appendChild(item);
      });
      
      // Update our items array reference
      this.items = sortedItems;
    },

    updateCount(count = null) {
      if (!this.countDisplay) return;
      const actualCount = count !== null ? count : this.items.length;
      this.countDisplay.textContent = `${actualCount} Works`;
    }
  };

  // Initialize and mark index for initial "Featured" sort
  const items = document.querySelectorAll('.gallery__item');
  items.forEach((item, index) => {
    item.dataset.index = index;
  });

  Gallery.init();
});
