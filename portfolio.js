/* ============================================================
   portfolio.js – Graphic portfolio page only
   Reuses tab-pill/slider markup pattern from script.js
   ============================================================ */

(function () {
  'use strict';

  /* ── Wrap filter tabs in pill + slider (same pattern as services) ── */
  const tabsRow = document.querySelector('.services-tabs');
  const pill = document.createElement('div');
  pill.className = 'tab-pill';

  const slider = document.createElement('div');
  slider.className = 'tab-slider';
  pill.appendChild(slider);

  Array.from(tabsRow.children).forEach(btn => pill.appendChild(btn));
  tabsRow.appendChild(pill);

  function moveSlider(btn) {
    const pillRect = pill.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    slider.style.width = btnRect.width + 'px';
    slider.style.transform = `translateX(${btnRect.left - pillRect.left - 4}px)`;
  }

  slider.style.transition = 'none';
  window.addEventListener('load', () => {
    moveSlider(document.querySelector('.tab-btn.active'));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        slider.style.transition = '';
      });
    });
  });

  /* ── Filter logic ── */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      moveSlider(btn);

      const filter = btn.getAttribute('data-filter');
      portfolioItems.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-category') === filter;
        item.classList.toggle('filtered-out', !match);
      });
    });
  });

  /* ── Blob follows mouse inside each image, clipped to that image ── */
  document.querySelectorAll('.portfolio-img-wrap').forEach(wrap => {
    const blob = wrap.querySelector('.portfolio-blob');
    wrap.addEventListener('mousemove', (e) => {
      const rect = wrap.getBoundingClientRect();
      blob.style.left = (e.clientX - rect.left) + 'px';
      blob.style.top = (e.clientY - rect.top) + 'px';
    });
  });

  /* ── Lightbox ── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  portfolioItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.getAttribute('data-img');
      lightboxImg.src = src;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

})();