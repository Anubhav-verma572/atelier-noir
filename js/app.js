/* ============================================
   ATELIER NOIR — Core Application JS
   Theme toggle, navigation, scroll handling
   ============================================ */

(function() {
  'use strict';

  // --- Theme Toggle ---
  const ThemeManager = {
    init() {
      this.toggle = document.getElementById('theme-toggle');
      this.html = document.documentElement;
      this.sunIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
      this.moonIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
      
      const savedTheme = localStorage.getItem('atelier-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = savedTheme || (prefersDark ? 'dark' : 'light');
      
      this.setTheme(theme);
      
      if (this.toggle) {
        this.toggle.addEventListener('click', () => {
          const current = this.html.getAttribute('data-theme');
          this.setTheme(current === 'dark' ? 'light' : 'dark');
        });
      }
    },

    setTheme(theme) {
      this.html.setAttribute('data-theme', theme);
      localStorage.setItem('atelier-theme', theme);
      if (this.toggle) {
        this.toggle.innerHTML = theme === 'dark' ? this.sunIcon : this.moonIcon;
        this.toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      }
    }
  };

  // --- Navigation ---
  const Navigation = {
    init() {
      this.nav = document.querySelector('.nav');
      this.hamburger = document.querySelector('.nav__hamburger');
      this.mobileNav = document.querySelector('.mobile-nav');
      this.mobileLinks = document.querySelectorAll('.mobile-nav__link');
      this.lastScroll = 0;
      
      if (this.nav) {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        this.handleScroll();
      }
      
      if (this.hamburger) {
        this.hamburger.addEventListener('click', () => this.toggleMobile());
      }
      
      this.mobileLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMobile());
      });
    },

    handleScroll() {
      const scrollY = window.scrollY;
      
      if (scrollY > 80) {
        this.nav.classList.add('nav--scrolled');
        this.nav.classList.remove('nav--transparent');
      } else {
        this.nav.classList.remove('nav--scrolled');
        if (this.nav.dataset.transparent === 'true') {
          this.nav.classList.add('nav--transparent');
        }
      }
      
      this.lastScroll = scrollY;
    },

    toggleMobile() {
      this.hamburger.classList.toggle('active');
      this.mobileNav.classList.toggle('active');
      document.body.style.overflow = this.mobileNav.classList.contains('active') ? 'hidden' : '';
    },

    closeMobile() {
      this.hamburger.classList.remove('active');
      this.mobileNav.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // --- Scroll Reveal Observer ---
  const ScrollReveal = {
    init() {
      const options = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
      };

      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            this.observer.unobserve(entry.target);
          }
        });
      }, options);

      document.querySelectorAll('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-stagger, .image-reveal').forEach(el => {
        this.observer.observe(el);
      });
    }
  };

  // --- Smooth Scroll ---
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          const target = document.querySelector(anchor.getAttribute('href'));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        });
      });
    }
  };

  // --- Parallax (simple CSS-driven) ---
  const Parallax = {
    init() {
      this.elements = document.querySelectorAll('[data-parallax]');
      if (this.elements.length === 0) return;
      
      window.addEventListener('scroll', () => {
        requestAnimationFrame(() => this.update());
      }, { passive: true });
    },

    update() {
      const scrollY = window.scrollY;
      this.elements.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const rect = el.getBoundingClientRect();
        const inView = rect.bottom > 0 && rect.top < window.innerHeight;
        
        if (inView) {
          const yPos = -(scrollY - el.offsetTop) * speed;
          el.style.transform = `translateY(${yPos}px)`;
        }
      });
    }
  };

  // --- Cart Badge ---
  const Cart = {
    init() {
      this.count = parseInt(localStorage.getItem('atelier-cart-count') || '0');
      this.updateBadge();
    },

    add(qty = 1) {
      this.count += qty;
      localStorage.setItem('atelier-cart-count', this.count);
      this.updateBadge();
      this.showNotification();
    },

    updateBadge() {
      const badges = document.querySelectorAll('.cart-count__badge');
      badges.forEach(badge => {
        badge.textContent = this.count;
        badge.style.display = this.count > 0 ? 'flex' : 'none';
      });
    },

    showNotification() {
      const notif = document.createElement('div');
      notif.className = 'cart-notification';
      notif.textContent = 'Added to cart';
      notif.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--color-accent);
        color: var(--color-accent-text);
        padding: 12px 24px;
        font-size: 13px;
        font-weight: 500;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        z-index: 1500;
        opacity: 0;
        transform: translateY(12px);
        transition: all 0.3s ease;
      `;
      document.body.appendChild(notif);
      
      requestAnimationFrame(() => {
        notif.style.opacity = '1';
        notif.style.transform = 'translateY(0)';
      });
      
      setTimeout(() => {
        notif.style.opacity = '0';
        notif.style.transform = 'translateY(12px)';
        setTimeout(() => notif.remove(), 300);
      }, 2500);
    }
  };

  // --- Custom Cursor ---
  const Cursor = {
    init() {
      if (window.matchMedia('(pointer: coarse)').matches) return;
      
      this.cursor = document.querySelector('.cursor-follower');
      if (!this.cursor) return;

      let mouseX = 0, mouseY = 0;
      let cursorX = 0, cursorY = 0;

      document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      });

      const hoverTargets = document.querySelectorAll('a, button, .artwork-card, .collection-card');
      hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => this.cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => this.cursor.classList.remove('hovering'));
      });

      const animate = () => {
        cursorX += (mouseX - cursorX) * 0.12;
        cursorY += (mouseY - cursorY) * 0.12;
        this.cursor.style.left = cursorX + 'px';
        this.cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animate);
      };
      animate();
    }
  };

  // --- Page Load ---
  const PageLoader = {
    init() {
      document.body.classList.add('loaded');
    }
  };

  // --- Initialize Everything ---
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    Navigation.init();
    ScrollReveal.init();
    SmoothScroll.init();
    Parallax.init();
    Cart.init();
    Cursor.init();
    PageLoader.init();
  });

  // Expose Cart globally for onclick handlers
  window.AtelierCart = Cart;
})();
