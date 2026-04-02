/* ============================================
   ATELIER NOIR — Product JavaScript
   Zoom, AR Simulator, Price update, Accordions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const Product = {
    init() {
      this.initZoom();
      this.initGallery();
      this.initCustomizer();
      this.initAccordions();
      this.initAR();
      this.initCart();
    },

    // 1. Image Zoom
    initZoom() {
      const imgWrap = document.getElementById('main-image-wrap');
      const img = imgWrap?.querySelector('img');
      if (!imgWrap || !img) return;

      imgWrap.addEventListener('mousemove', (e) => {
        if (!imgWrap.classList.contains('is-zoomed')) return;
        
        const rect = imgWrap.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the element
        const y = e.clientY - rect.top;  // y position within the element
        
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;
        
        img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
      });

      imgWrap.addEventListener('click', () => {
        imgWrap.classList.toggle('is-zoomed');
        if (!imgWrap.classList.contains('is-zoomed')) {
          img.style.transformOrigin = 'center center';
        }
      });

      imgWrap.addEventListener('mouseleave', () => {
        imgWrap.classList.remove('is-zoomed');
        img.style.transformOrigin = 'center center';
      });
    },

    // 2. Thumbnail Gallery
    initGallery() {
      const mainImg = document.querySelector('#main-image-wrap img');
      const thumbs = document.querySelectorAll('.product__thumb');
      if (!mainImg || thumbs.length === 0) return;

      thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
          // Update active state
          thumbs.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');

          // Swap image with fade effect
          mainImg.style.opacity = '0';
          setTimeout(() => {
            mainImg.src = thumb.querySelector('img').src;
            mainImg.style.opacity = '1';
            
            // Sync AR artwork if modal exists
            const arArtwork = document.getElementById('ar-artwork');
            if (arArtwork) {
              arArtwork.src = mainImg.src;
            }
          }, 200);
        });
      });
    },

    // 3. Price Customizer
    initCustomizer() {
      const priceDisplay = document.getElementById('product-price');
      const radios = document.querySelectorAll('.selector-item input[type="radio"]');
      if (!priceDisplay || radios.length === 0) return;

      const basePrice = parseInt(priceDisplay.dataset.basePrice || 0, 10);

      const calculatePrice = () => {
        let addon = 0;
        radios.forEach(radio => {
          if (radio.checked && radio.dataset.priceAdd) {
            addon += parseInt(radio.dataset.priceAdd, 10);
          }
        });
        
        const total = basePrice + addon;
        priceDisplay.textContent = `$${total.toLocaleString()}`;
      };

      radios.forEach(radio => {
        radio.addEventListener('change', calculatePrice);
      });
      
      // Handle framing changes for AR simulation
      const frameRadios = document.querySelectorAll('input[name="frame"]');
      const arArtwork = document.getElementById('ar-artwork');
      
      frameRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
          if (!arArtwork) return;
          arArtwork.className = 'ar-modal__artwork'; // reset
          if (e.target.value !== 'none') {
            arArtwork.classList.add(`frame-${e.target.value}`);
          }
        });
      });
    },

    // 4. Accordions
    initAccordions() {
      const headers = document.querySelectorAll('.accordion__header');
      headers.forEach(header => {
        header.addEventListener('click', () => {
          const content = header.nextElementSibling;
          const isExpanded = header.getAttribute('aria-expanded') === 'true';
          
          if (isExpanded) {
            header.setAttribute('aria-expanded', 'false');
            content.style.maxHeight = null;
          } else {
            header.setAttribute('aria-expanded', 'true');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        });
      });
    },

    // 5. AR Simulator
    initAR() {
      const modal = document.getElementById('ar-modal');
      const btnOpen = document.getElementById('ar-btn');
      const btnClose = document.getElementById('ar-close');
      const scaleSlider = document.getElementById('ar-scale');
      const arArtwork = document.getElementById('ar-artwork');

      if (!modal || !btnOpen) return;

      btnOpen.addEventListener('click', () => {
        modal.classList.add('is-active');
        document.body.style.overflow = 'hidden';
      });

      const closeModal = () => {
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
      };

      if (btnClose) btnClose.addEventListener('click', closeModal);
      
      modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('ar-modal__view')) closeModal();
      });

      if (scaleSlider && arArtwork) {
        scaleSlider.addEventListener('input', (e) => {
          // Adjust width from 100px to 600px based on slider (0-100)
          const base = 150;
          const max = 450;
          const width = base + ((e.target.value / 100) * max);
          arArtwork.style.width = `${width}px`;
        });
      }
    },

    // 6. Add to Cart hook
    initCart() {
      const addBtn = document.getElementById('add-to-cart');
      if (addBtn && window.AtelierCart) {
        addBtn.addEventListener('click', () => {
          // Change button state
          const originalText = addBtn.textContent;
          addBtn.textContent = 'Adding...';
          addBtn.disabled = true;
          
          setTimeout(() => {
            window.AtelierCart.add(1);
            addBtn.textContent = 'Added securely';
            
            setTimeout(() => {
              addBtn.textContent = originalText;
              addBtn.disabled = false;
            }, 2000);
          }, 600); // Simulate network latency
        });
      }
    }
  };

  Product.init();
});
