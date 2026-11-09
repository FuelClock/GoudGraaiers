/* De Goud Graaiers — motion layer.
   Signature move: masked line reveal on the hero title.
   Plus: section entrances and control feedback. */
(function () {
  'use strict';
  var d = document;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* hero line reveal */
  function hero() {
    var lines = d.querySelectorAll('.hero-line');
    if (!lines.length) return;
    lines.forEach(function (l) {
      var t = l.textContent;
      l.textContent = '';
      var inner = d.createElement('span');
      inner.textContent = t;
      l.appendChild(inner);
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        d.body.classList.add('js-done');
      });
    });
    setTimeout(function () { d.body.classList.add('js-done'); }, 2500);
  }

  /* section entrances */
  function entrances() {
    var targets = d.querySelectorAll('.deck-card, .statement-band, .statement-body > *, .faq-item, .joining-steps > div, .doctrine-body, .article-body > *, .page-title-band .page-side > *');
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          el.style.transition = 'opacity .7s ease, transform .7s cubic-bezier(.22,1,.36,1)';
          el.style.opacity = '1';
          el.style.transform = 'none';
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15 });
    targets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      io.observe(el);
    });
  }

  /* voyage plan modals: Read the plan opens a dialog with the full plan */
  function modals() {
    d.querySelectorAll('.card-link[data-voyage]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var dlg = d.getElementById('voyage-' + btn.getAttribute('data-voyage'));
        if (!dlg) return;
        if (dlg.showModal) dlg.showModal();
        else dlg.setAttribute('open', '');
      });
    });
    d.querySelectorAll('.voyage-modal').forEach(function (dlg) {
      dlg.querySelectorAll('.voyage-modal-close').forEach(function (b) {
        b.addEventListener('click', function () { dlg.close(); });
      });
      dlg.addEventListener('click', function (ev) {
        if (ev.target === dlg) dlg.close(); /* click on the backdrop */
      });
    });
  }

  /* parallax chart: the fixed chart layer drifts UP by a fraction of the
     scroll (Thimon: opposite direction reads better), so the sea slides
     towards the top of the screen as the fleet sails down the page. The
     layer box is 118vh (top -9vh) and the width-fit chart tile is taller
     than box + max drift at desktop widths, so no edge ever shows. The
     factor is derived from the page's real scroll range so the drift uses
     that headroom exactly. Reduced motion: the layer stays put. */
  function parallax() {
    var layer = d.getElementById('chart-layer');
    if (!layer || reduce) return;
    var sky = layer.parentElement;
    var f = 0;
    var ticking = false;
    function measure() {
      var headroom = sky.offsetHeight * 0.15 - 32; /* slack beyond the viewport, safety margin */
      var range = d.documentElement.scrollHeight - window.innerHeight;
      f = range > 0 ? Math.max(0, headroom / range) : 0;
    }
    function update() {
      ticking = false;
      /* images resize the page after load; re-derive the factor when it moves */
      if (d.documentElement.scrollHeight !== lastH) { lastH = d.documentElement.scrollHeight; measure(); }
      layer.style.transform = 'translate3d(0,' + (-window.scrollY * f).toFixed(1) + 'px,0)';
    }
    var lastH = 0;
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { measure(); onScroll(); });
    measure();
    update();
  }

  /* statement band gold sheen: no autonomous animation (Thimon,
     2026-11-09); scroll-driven only — the mouse influence was removed when
     the perimeter outline comet took over the fancy duty. The sheen
     position is a CSS custom property set here, driven by the BAND'S OWN
     trip through the viewport, so it sweeps across exactly while the
     visitor scrolls past it. Eased per frame, running only while the band
     intersects the viewport. Reduced motion: CSS hides the sheen entirely. */
  function shine() {
    var band = d.querySelector('.statement-band');
    if (!band || reduce) return;
    var target = -120, current = -120, raf = null, visible = false;
    function frame() {
      current += (target - current) * 0.08;
      band.style.setProperty('--sheen-x', current.toFixed(2) + '%');
      if (Math.abs(target - current) > 0.5) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = null;
      }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    function retarget() {
      /* at the top of the page the sheen rests off-view on the left; as the
         band crosses the viewport it flashes past during the first half of
         the trip and rests off-view on the right (2026-11-09, Thimon) */
      var r = band.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh - r.top) / (vh + r.height);
      if (p < 0) p = 0; else if (p > 1) p = 1;
      target = p < 0.5 ? -120 + (p / 0.5) * 240 : 120;
      kick();
    }
    window.addEventListener('scroll', function () { if (visible) retarget(); }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          visible = e.isIntersecting;
          if (visible) retarget();
        });
      }).observe(band);
    } else {
      visible = true;
      retarget();
    }
    retarget();
  }

  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', function () { hero(); entrances(); parallax(); modals(); shine(); });
  } else {
    hero(); entrances(); parallax(); modals(); shine();
  }
})();
