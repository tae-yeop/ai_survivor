/**
 * AI Vibe Lab — Motion System
 * Lightweight scroll animations, parallax, and reveal effects.
 * No framework dependency. Respects prefers-reduced-motion.
 */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  /* ================================================================
     Scroll-triggered reveal animations
     ================================================================ */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ================================================================
     Parallax sections
     Elements with [data-parallax] or .parallax-section
     ================================================================ */
  const parallaxEls = document.querySelectorAll('[data-parallax], .parallax-section');
  if (parallaxEls.length > 0 && !window.matchMedia('(pointer: coarse)').matches) {
    let ticking = false;

    function updateParallax() {
      const scrollY = window.scrollY;
      const viewH = window.innerHeight;

      parallaxEls.forEach((el) => {
        const speed = parseFloat(el.dataset.parallax || el.getAttribute('data-speed')) || 0.3;
        const rect = el.getBoundingClientRect();
        const elTop = rect.top + scrollY;
        const elBottom = elTop + rect.height;
        const visibleTop = scrollY;
        const visibleBottom = scrollY + viewH;

        // Only compute when element is visible
        if (elBottom > visibleTop && elTop < visibleBottom) {
          const center = (visibleTop + visibleBottom) / 2;
          const offset = (elTop - center) * speed * 0.5;
          el.style.transform = `translate3d(0, ${offset}px, 0)`;
        }
      });

      ticking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );

    // Initial layout
    updateParallax();
  }

  /* ================================================================
     Scroll progress bar
     ================================================================ */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    let progressTicking = false;

    function updateProgress() {
      const scrollH = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollH <= 0) {
        progressBar.style.transform = 'scaleX(0)';
        return;
      }
      const progress = Math.min(window.scrollY / scrollH, 1);
      progressBar.style.transform = `scaleX(${progress})`;
      progressTicking = false;
    }

    window.addEventListener(
      'scroll',
      () => {
        if (!progressTicking) {
          requestAnimationFrame(updateProgress);
          progressTicking = true;
        }
      },
      { passive: true }
    );

    updateProgress();
  }

  /* ================================================================
     Cursor glow effect (hero section)
     ================================================================ */
  const glowContainer = document.getElementById('hero-glow');
  if (glowContainer && !window.matchMedia('(pointer: coarse)').matches) {
    const glow = document.createElement('div');
    glow.setAttribute('aria-hidden', 'true');
    glow.style.cssText =
      'position:absolute;width:600px;height:600px;border-radius:50%;' +
      'background:radial-gradient(circle,rgba(79,70,229,0.12) 0%,transparent 70%);' +
      'pointer-events:none;z-index:0;transform:translate(-50%,-50%);' +
      'will-change:left,top;';
    glowContainer.style.position = 'relative';
    glowContainer.style.overflow = 'hidden';
    glowContainer.prepend(glow);

    let glowTicking = false;
    glowContainer.addEventListener(
      'mousemove',
      (e) => {
        if (!glowTicking) {
          requestAnimationFrame(() => {
            const rect = glowContainer.getBoundingClientRect();
            glow.style.left = e.clientX - rect.left + 'px';
            glow.style.top = e.clientY - rect.top + 'px';
            glowTicking = false;
          });
          glowTicking = true;
        }
      },
      { passive: true }
    );

    glowContainer.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
      glow.style.transition = 'opacity 0.5s ease';
    });

    glowContainer.addEventListener('mouseenter', () => {
      glow.style.opacity = '1';
      glow.style.transition = 'opacity 0.3s ease';
    });
  }

  /* ================================================================
     Header scroll awareness — adds .header-scrolled class
     ================================================================ */
  const header = document.querySelector('header');
  if (header) {
    let headerTicking = false;
    window.addEventListener(
      'scroll',
      () => {
        if (!headerTicking) {
          requestAnimationFrame(() => {
            header.classList.toggle('header-scrolled', window.scrollY > 10);
            headerTicking = false;
          });
          headerTicking = true;
        }
      },
      { passive: true }
    );
  }

  /* ================================================================
     Preloader removal
     ================================================================ */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    const removePreloader = () => {
      preloader.classList.add('preloader-hidden');
      setTimeout(() => {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 500);
    };

    // Remove after load or 800ms timeout (whichever first)
    if (document.readyState === 'complete') {
      setTimeout(removePreloader, 300);
    } else {
      window.addEventListener('load', () => setTimeout(removePreloader, 200));
      setTimeout(removePreloader, 1500); // safety timeout
    }
  }
})();
