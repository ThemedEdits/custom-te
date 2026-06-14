/* ============================================================
   script.js – Navbar toggle + service hover cross-fade
   ============================================================ */

(function () {
  'use strict';

  /* ── Elements ─────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar');
  const serviceItems = document.querySelectorAll('.service-item');
  const preview = document.getElementById('servicePreview');



  /* ── Build two image layers inside .service-preview ─────
     Layer A and Layer B alternate so we can cross-fade
     between any two images without a flash.               */
  const imgA = document.createElement('img');
  const imgB = document.createElement('img');
  imgA.alt = imgB.alt = 'Service Preview';
  preview.appendChild(imgA);
  preview.appendChild(imgB);

  let activeLayer = imgA;
  let pendingLayer = imgB;
  let currentSrc = '';

  /* ── Wrap the two tab buttons in a pill container ───────*/
  const tabsRow = document.querySelector('.services-tabs');
  const pill = document.createElement('div');
  pill.className = 'tab-pill';

  /* Sliding highlight element */
  const slider = document.createElement('div');
  slider.className = 'tab-slider';
  pill.appendChild(slider);

  Array.from(tabsRow.children).forEach(btn => pill.appendChild(btn));
  tabsRow.appendChild(pill);

  /* Position slider under the active button */
  function moveSlider(btn) {
    const pillRect = pill.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    slider.style.width = btnRect.width + 'px';
    slider.style.transform = `translateX(${btnRect.left - pillRect.left - 4}px)`;
  }

  /* Wait for full layout + fonts before setting initial position */
  slider.style.transition = 'none';
  window.addEventListener('load', () => {
    moveSlider(document.querySelector('.tab-btn.active'));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        slider.style.transition = '';
      });
    });
  });

  /* ── Services data ──────────────────────────────────────*/
  const servicesData = {
    graphic: [
      { title: 'SOCIAL MEDIA POST', img: 'img/social-media.jpg' },
      { title: 'CUSTOM LOGO', img: 'img/logo.jpg' },
      { title: 'MENU DESIGN', img: 'img/menu.jpg' },
      { title: 'VISITING CARD', img: 'img/visiting-card.jpg' },
      { title: 'BRAND IDENTITY', img: 'img/brand.jpg' },
    ],
    web: [
      { title: 'LANDING PAGE', img: 'img/landing.jpg' },
      { title: 'PORTFOLIO SITE', img: 'img/portfolio.jpg' },
      { title: 'E-COMMERCE', img: 'img/ecommerce.jpg' },
      { title: 'BUSINESS WEBSITE', img: 'img/business.jpg' },
      { title: 'UI/UX DESIGN', img: 'img/uiux.jpg' },
    ],
  };

  let currentTab = 'graphic';
  let currentIndex = 0;

  /* ── Tab switching ──────────────────────────────────────*/
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      moveSlider(btn);

      currentTab = btn.getAttribute('data-tab');
      currentIndex = 0;

      // Update desktop list
      updateDesktopList();

      // Update mobile carousel
      if (window.innerWidth <= 768) buildMobileCarousel();
    });
  });

  /* ── Desktop list update ────────────────────────────────*/
  function updateDesktopList() {
    const list = document.querySelector('.services-list');
    const items = servicesData[currentTab];
    list.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'service-item';
      li.setAttribute('data-img', item.img);
      li.textContent = item.title;
      list.appendChild(li);
    });
    // Re-bind hover events
    bindServiceHovers();
  }

  function bindServiceHovers() {
    const items = document.querySelectorAll('.service-item');
    items.forEach((item, idx) => {
      item.addEventListener('mouseenter', () => {
        const imgSrc = item.getAttribute('data-img') || '';
        preview.classList.remove('hidden');
        showImage(imgSrc, PLACEHOLDER_COLORS[idx % PLACEHOLDER_COLORS.length]);
      });
      item.addEventListener('mouseleave', () => {
        preview.classList.add('hidden');
        currentSrc = '';
      });
    });
  }

  /* ── Navbar open / close ────────────────────────────────
     The hamburger is always on top (topbar z-index 600).
     The navbar slides in from behind it (z-index 500).
     Hamburger animates to a cross via CSS when body.nav-open
     is set — no separate close button needed.
  ─────────────────────────────────────────────────────── */
  function openNav() {
    navbar.classList.add('open');
    document.body.classList.add('nav-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close Menu');
    // Wait for navbar to slide in, then animate links
    setTimeout(() => navbar.classList.add('links-visible'), 600);
  }

  function closeNav() {
    document.body.classList.remove('nav-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open Menu');

    // Lock links in place and fade opacity only
    navbar.classList.add('links-hiding');
    navbar.classList.remove('links-visible');

    // After links fade out, slide navbar down — keep links-hiding on during slide
    setTimeout(() => {
      navbar.classList.add('closing');

      navbar.addEventListener('transitionend', function handler(e) {
        if (e.propertyName !== 'transform') return;
        // Full cleanup only after navbar finishes sliding
        navbar.classList.remove('open', 'closing', 'links-hiding');
        navbar.style.transition = 'none';
        navbar.style.transform = 'translateY(-100%)';
        navbar.offsetHeight;
        navbar.style.transition = '';
        navbar.style.transform = '';
        navbar.removeEventListener('transitionend', handler);
      });
    }, 80);
  }

  hamburger.addEventListener('click', () => {
    navbar.classList.contains('open') ? closeNav() : openNav();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navbar.classList.contains('open')) closeNav();
  });

  /* ── Placeholder colours (used when no real image set) ─*/
  const PLACEHOLDER_COLORS = ['#d44', '#4a8', '#48d', '#a4d', '#da4'];

  /* ── Cross-fade helper ──────────────────────────────────
     Swaps pending/active image layers so every service
     switch gets a smooth fade, not just the first one.
  ─────────────────────────────────────────────────────── */
  function showImage(src, fallbackColor) {
    if (src === currentSrc) return;

    if (src) {
      pendingLayer.src = src;
      pendingLayer.style.background = '';
    } else {
      pendingLayer.src = '';
      pendingLayer.style.cssText =
        `background:${fallbackColor};width:100%;height:100%;`;
    }

    pendingLayer.classList.add('active');
    activeLayer.classList.remove('active');

    const tmp = activeLayer;
    activeLayer = pendingLayer;
    pendingLayer = tmp;

    currentSrc = src;
  }

  /* ── Service hover with vertical mouse tracking ─────────
     On mouseenter: record the mouse's clientY and set the
     preview's `top` to that value so the image top aligns
     with where the cursor entered the row.
     Horizontal position is fixed via CSS (right: 60px).
     On mouseleave: hide preview and reset currentSrc.
  ─────────────────────────────────────────────────────── */
  bindServiceHovers();

  /* ── Mobile carousel ────────────────────────────────────*/
  function buildMobileCarousel() {
    const servicesLeft = document.querySelector('.services-left');

    // Remove existing carousel if any
    const existing = document.querySelector('.mobile-carousel');
    const existingIcons = document.querySelector('.mobile-bottom-icons');
    if (existing) existing.remove();
    if (existingIcons) existingIcons.remove();

    const items = servicesData[currentTab];

    // Build carousel HTML
    const carousel = document.createElement('div');
    carousel.className = 'mobile-carousel';

    // Title pill
    const titleEl = document.createElement('div');
    titleEl.className = 'mobile-carousel-title';
    titleEl.textContent = items[0].title;

    // Frame
    const frame = document.createElement('div');
    frame.className = 'mobile-carousel-frame';

    const imgWrap = document.createElement('div');
    imgWrap.className = 'mobile-carousel-img-wrap';

    // Create all images, first active
    items.forEach((item, i) => {
      const img = document.createElement('img');
      img.src = item.img;
      img.alt = item.title;
      if (i === 0) img.classList.add('active');
      imgWrap.appendChild(img);
    });

    frame.appendChild(imgWrap);

    // Swipe hint
    const swipeHint = document.createElement('div');
    swipeHint.className = 'mobile-swipe-hint';
    swipeHint.innerHTML = `
      <div class="swipe-arrow" id="prevBtn">
        <img src="img/swiperp.svg" alt="Previous" style="width:36px;height:36px;transform:scaleX(-1);filter:brightness(0) invert(1);opacity:0.6;" />
      </div>
      <span class="swipe-label">SWIPE FOR MORE</span>
      <div class="swipe-arrow" id="nextBtn">
        <img src="img/swipern.svg" alt="Next" style="width:36px;height:36px;filter:brightness(0) invert(1);opacity:0.6;" />
      </div>
    `;

    // Dots
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'mobile-dots';
    items.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'mobile-dot' + (i === 0 ? ' active' : '');
      dotsWrap.appendChild(dot);
    });

    carousel.appendChild(titleEl);
    carousel.appendChild(frame);
    carousel.appendChild(swipeHint);
    carousel.appendChild(dotsWrap);

    servicesLeft.appendChild(carousel);

    // Bottom icons
    const bottomIcons = document.createElement('div');
    bottomIcons.className = 'mobile-bottom-icons';
    bottomIcons.innerHTML = `
      <div class="mobile-bottom-icon">
        <svg viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        <span>CODE</span>
      </div>
      <div class="mobile-bottom-icon">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
        <span>DESIGN</span>
      </div>
    `;
    servicesLeft.appendChild(bottomIcons);

    // ── Carousel logic ──
    currentIndex = 0;

    function goTo(index) {
      const imgs = imgWrap.querySelectorAll('img');
      const dots = dotsWrap.querySelectorAll('.mobile-dot');

      imgs[currentIndex].classList.remove('active');
      dots[currentIndex].classList.remove('active');

      currentIndex = (index + items.length) % items.length;

      imgs[currentIndex].classList.add('active');
      dots[currentIndex].classList.add('active');

      // Fade title
      titleEl.classList.add('fade');
      setTimeout(() => {
        titleEl.textContent = items[currentIndex].title;
        titleEl.classList.remove('fade');
      }, 200);
    }

    // Button clicks
    document.getElementById('nextBtn').addEventListener('click', () => goTo(currentIndex + 1));
    document.getElementById('prevBtn').addEventListener('click', () => goTo(currentIndex - 1));

    // Touch swipe
    let touchStartX = 0;
    imgWrap.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    imgWrap.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goTo(currentIndex + (diff > 0 ? 1 : -1));
    });
  }

  // Init mobile carousel on load if mobile
  if (window.innerWidth <= 768) buildMobileCarousel();

  // Rebuild on resize crossing breakpoint
  let wasMobile = window.innerWidth <= 768;
  window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && !wasMobile) buildMobileCarousel();
    if (!isMobile && wasMobile) {
      const c = document.querySelector('.mobile-carousel');
      const b = document.querySelector('.mobile-bottom-icons');
      if (c) c.remove();
      if (b) b.remove();
    }
    wasMobile = isMobile;
  });

  /* Start hidden */
  preview.classList.add('hidden');

})();