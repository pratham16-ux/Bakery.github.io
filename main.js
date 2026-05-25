/* ============================================
   STACKLY BAKERY — main.js
   All Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  // ─── Page Transition ─────────────────────────
  const overlay = document.getElementById('page-overlay');

  function navigateTo(url) {
    if (!overlay) return (window.location.href = url);
    overlay.classList.add('active');
    setTimeout(() => { window.location.href = url; }, 580);
  }

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (
      href &&
      !href.startsWith('#') &&
      !href.startsWith('http') &&
      !href.startsWith('mailto') &&
      !href.startsWith('tel') &&
      !link.hasAttribute('data-no-transition')
    ) {
      link.addEventListener('click', e => {
        e.preventDefault();
        navigateTo(href);
      });
    }
  });

  if (overlay) {
    overlay.classList.add('exit');
    setTimeout(() => overlay.classList.remove('exit', 'active'), 800);
  }

  // ─── Navbar Scroll ────────────────────────────
  const navbar = document.getElementById('navbar');

  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ─── Hamburger + Mobile Menu ──────────────────
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobile-menu');
  const mobileClose = document.getElementById('mobile-close');

  function openMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });
  }

  if (mobileClose) mobileClose.addEventListener('click', closeMenu);

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // ─── Hero Slider ──────────────────────────────
  const slides         = document.querySelectorAll('.hero-slide');
  const dots           = document.querySelectorAll('.slider-dot');
  const counterCurrent = document.getElementById('slider-current');
  const counterTotal   = document.getElementById('slider-total');
  let currentSlide = 0;
  let sliderTimer  = null;

  function goToSlide(idx) {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    currentSlide = (idx + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    if (counterCurrent) {
      counterCurrent.textContent = String(currentSlide + 1).padStart(2, '0');
    }
  }

  function startSlider() {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }

  if (slides.length > 0) {
    if (counterTotal) counterTotal.textContent = String(slides.length).padStart(2, '0');
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        startSlider();
      });
    });
    goToSlide(0);
    startSlider();
  }

  // ─── Products Carousel ────────────────────────
  const track   = document.getElementById('products-track');
  const prevBtn = document.getElementById('carousel-prev');
  const nextBtn = document.getElementById('carousel-next');

  if (track) {
    let currentPos = 0;
    const cards = track.querySelectorAll('.product-card');

    const visibleCount = () => {
      if (window.innerWidth < 768)  return 1;
      if (window.innerWidth < 1100) return 2;
      return 4;
    };

    const maxPos = () => Math.max(0, cards.length - visibleCount());

    function moveCarousel(dir) {
      currentPos = Math.max(0, Math.min(currentPos + dir, maxPos()));
      const gap = 24;
      const cardWidth = (cards[0] ? cards[0].offsetWidth : 0) + gap;
      track.style.transform = `translateX(-${currentPos * cardWidth}px)`;
    }

    if (prevBtn) prevBtn.addEventListener('click', () => moveCarousel(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => moveCarousel(1));

    setInterval(() => {
      if (currentPos >= maxPos()) currentPos = -1;
      moveCarousel(1);
    }, 4500);
  }

  // ─── Testimonials Slider ──────────────────────
  const tTrack = document.getElementById('testimonials-track');
  const tDots  = document.querySelectorAll('.t-dot');
  let tCurrent = 0;
  let tTimer   = null;

  function goToTestimonial(idx) {
    if (tDots[tCurrent]) tDots[tCurrent].classList.remove('active');
    tCurrent = (idx + (tDots.length || 1)) % (tDots.length || 1);
    if (tTrack) tTrack.style.transform = `translateX(-${tCurrent * 100}%)`;
    if (tDots[tCurrent]) tDots[tCurrent].classList.add('active');
  }

  if (tTrack) {
    tDots.forEach((d, i) => {
      d.addEventListener('click', () => {
        goToTestimonial(i);
        clearInterval(tTimer);
        tTimer = setInterval(() => goToTestimonial(tCurrent + 1), 5000);
      });
    });
    goToTestimonial(0);
    tTimer = setInterval(() => goToTestimonial(tCurrent + 1), 5000);
  }

  // ─── Menu Tabs ────────────────────────────────
  const tabs   = document.querySelectorAll('.menu-tab');
  const panels = document.querySelectorAll('.menu-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(`panel-${target}`);
      if (panel) panel.classList.add('active');
    });
  });

  // ─── Scroll Reveal ────────────────────────────
  const revealEls = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale'
  );

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ─── Counter Animation ────────────────────────
  function animateCounter(el, target, duration, suffix) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      el.textContent = Math.floor(start) + (suffix || '');
      if (start >= target) clearInterval(timer);
    }, 16);
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(el => {
          const target = parseInt(el.getAttribute('data-count'));
          const suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, target, 1600, suffix);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.stats-section').forEach(s => statsObserver.observe(s));

  // ─── Add to Cart ──────────────────────────────
  let cartCount = 0;
  const cartBadge = document.getElementById('cart-count');

  function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }

  document.querySelectorAll('.product-add, .btn-add-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      cartCount++;
      if (cartBadge) cartBadge.textContent = cartCount;
      const name =
        btn.closest('.product-card, .menu-item-card')
          ?.querySelector('.product-name, .menu-item-name')
          ?.textContent || 'Item';
      showToast(`✓  "${name}" added to cart`);
      btn.style.transform = 'scale(1.35)';
      setTimeout(() => (btn.style.transform = ''), 320);
    });
  });

  // ─── Newsletter ───────────────────────────────
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value) {
        showToast('🎉 Subscribed! Welcome to Stackly Bakery.');
        input.value = '';
      }
    });
  });

  // ─── Contact Form ─────────────────────────────
  const contactFormEl = document.getElementById('contact-form');
  const successEl     = document.getElementById('cf-success');

  if (contactFormEl) {
    contactFormEl.addEventListener('submit', function (e) {
      e.preventDefault();
      contactFormEl.style.opacity = '0.4';
      contactFormEl.style.pointerEvents = 'none';
      setTimeout(() => {
        contactFormEl.style.display = 'none';
        if (successEl) successEl.classList.add('show');
      }, 400);
    });
  }

  // ─── FAQ Toggle ───────────────────────────────
  window.toggleFaq = function (el) {
    const answer = el.nextElementSibling;
    const isOpen = el.classList.contains('open');

    document.querySelectorAll('.faq-question').forEach(q => {
      q.classList.remove('open');
      q.nextElementSibling.classList.remove('open');
    });

    if (!isOpen) {
      el.classList.add('open');
      answer.classList.add('open');
    }
  };

  // ─── Highlight today's hours ──────────────────
  const dayMap = { 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat' };
  const todayId = 'day-' + dayMap[new Date().getDay()];
  const todayRow = document.getElementById(todayId);
  if (todayRow) {
    todayRow.classList.add('today');
    const daySpan = todayRow.querySelector('.hours-day');
    const dot = document.createElement('span');
    dot.className = 'today-dot';
    daySpan.prepend(dot);
  }

  // ─── Shop sidebar filters ─────────────────────
  document.querySelectorAll('.sidebar-list li').forEach(li => {
    li.addEventListener('click', () => {
      li.closest('ul')?.querySelectorAll('li').forEach(i => i.classList.remove('active'));
      li.classList.add('active');
    });
  });

  // ─── Parallax on inner hero ───────────────────
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    // Home hero slides
    document.querySelectorAll('.hero-slide.active img').forEach(img => {
      img.style.transform = `scale(1) translateY(${scrolled * 0.22}px)`;
    });

    // Inner page hero
    const innerBg = document.querySelector('.inner-hero img.hero-bg');
    if (innerBg) {
      innerBg.style.transform = `scale(1.06) translateY(${scrolled * 0.18}px)`;
    }

    // Contact hero bg
    const contactBg = document.querySelector('.contact-hero-bg');
    if (contactBg) {
      contactBg.style.transform = `scale(1.08) translateY(${scrolled * 0.12}px)`;
    }
  }, { passive: true });

  // ─── Active nav link detection ────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const aPage = a.getAttribute('href');
    if (aPage === currentPage) a.classList.add('active');
  });

  // ─── Magnetic hover on buttons ───────────────
  if (window.innerWidth > 768) {
    document.querySelectorAll('.btn-primary, .cf-submit, .nav-cta').forEach(el => {
      el.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        this.style.transform = `translate(${x * 0.12}px, ${y * 0.14}px)`;
      });

      el.addEventListener('mouseleave', function () {
        this.style.transform = '';
      });
    });
  }

  // ─── Staggered card hover shine ──────────────
  document.querySelectorAll('.product-card, .menu-item-card, .cat-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      this.style.setProperty('--shine-x', x + '%');
      this.style.setProperty('--shine-y', y + '%');
    });
  });

  // ─── Subtle cursor glow (desktop only) ───────
  if (window.innerWidth > 768) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:fixed;width:260px;height:260px;border-radius:50%;
      background:radial-gradient(circle,rgba(200,136,74,0.06) 0%,transparent 70%);
      pointer-events:none;transform:translate(-50%,-50%);z-index:0;
      transition:opacity 0.3s;will-change:left,top;
    `;
    document.body.appendChild(glow);
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      glow.style.left = mouseX + 'px';
      glow.style.top  = mouseY + 'px';
    });
  }

  // ─── Floating ambient particles (home) ───────
  if (document.querySelector('.hero-home')) {
    const symbols = ['✦', '✧', '·', '○', '◦', '∘'];
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('span');
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      const size = Math.random() * 10 + 5;
      p.style.cssText = `
        position:fixed;pointer-events:none;z-index:1;
        font-size:${size}px;
        color:rgba(200,136,74,${Math.random() * 0.08 + 0.02});
        left:${Math.random() * 100}vw;top:${Math.random() * 100}vh;
        animation:floatParticle ${9 + Math.random() * 10}s ease-in-out ${Math.random() * 6}s infinite;
      `;
      document.body.appendChild(p);
    }

    const ps = document.createElement('style');
    ps.textContent = `
      @keyframes floatParticle {
        0%,100% { transform:translateY(0) rotate(0deg); opacity:0.35; }
        25%      { transform:translateY(-28px) rotate(90deg); opacity:0.75; }
        50%      { transform:translateY(-14px) rotate(180deg) translateX(18px); }
        75%      { transform:translateY(-38px) rotate(270deg); opacity:0.28; }
      }
    `;
    document.head.appendChild(ps);
  }

  // ─── Tilt effect on team & about images ──────
  document.querySelectorAll('.team-img, .about-story-img, .testimonial-img').forEach(el => {
    el.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      this.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.02)`;
    });

    el.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });

  // ─── Timeline animated border on scroll ──────
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length) {
    const tlObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const body = entry.target.querySelector('.timeline-body');
          if (body) {
            setTimeout(() => {
              body.style.borderLeftColor = 'var(--caramel)';
              body.style.borderLeftWidth = '3px';
            }, i * 80);
          }
          tlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    timelineItems.forEach(item => tlObserver.observe(item));
  }

  // ─── Marquee hover pause ──────────────────────
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  // ─── Number morph on stat hover ──────────────
  document.querySelectorAll('.stat-item').forEach(item => {
    const numEl = item.querySelector('[data-count]');
    if (!numEl) return;
    const target = parseInt(numEl.getAttribute('data-count'));
    const suffix = numEl.getAttribute('data-suffix') || '';

    item.addEventListener('mouseenter', () => {
      let val = target;
      const flash = setInterval(() => {
        numEl.textContent = Math.floor(Math.random() * target) + suffix;
      }, 55);
      setTimeout(() => {
        clearInterval(flash);
        numEl.textContent = target + suffix;
      }, 480);
    });
  });

  // ─── Insta grid staggered hover ──────────────
  document.querySelectorAll('.insta-item').forEach((item, i) => {
    item.style.transitionDelay = (i * 0.04) + 's';
  });

  // ─── Section label line draw animation ───────
  const labelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const line = entry.target.querySelector('.section-label::before');
        entry.target.style.setProperty('--label-width', '28px');
        labelObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.section-label').forEach(el => labelObserver.observe(el));

  // ─── Smooth image lazy load shimmer ──────────
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    img.addEventListener('load', () => {
      img.style.opacity = '1';
    });
    // If already cached/loaded
    if (img.complete) img.style.opacity = '1';
  });

});