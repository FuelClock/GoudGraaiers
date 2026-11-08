/* De Goud Graaiers — motion layer.
   Signature move: masked line reveal on the hero title.
   Plus: section entrances, control feedback, the spine deck, hero drift. */
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
    var targets = d.querySelectorAll('.deck-card, .tile-board > *, .faq-row, .joining-steps > div, .doctrine-body, .cta-headline, .article-body > *, .page-title-band .page-side > *, .side-nav a');
    if (reduce || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          var el = e.target;
          el.style.transition = 'opacity .7s ease ' + (i * 70) + 'ms, transform .7s cubic-bezier(.22,1,.36,1) ' + (i * 70) + 'ms';
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

  /* spine deck: cards fold into spines as the page scrolls */
  function deck() {
    var wrap = d.querySelector('.voyages');
    var cards = Array.prototype.slice.call(d.querySelectorAll('.deck-card'));
    if (!wrap || !cards.length) return;
    var isStacked = window.matchMedia('(max-width: 760px)').matches;
    if (isStacked || reduce) return;

    cards.forEach(function (c) {
      if (!c.dataset.letter) {
        c.dataset.letter = (c.querySelector('.card-title').textContent || '?').trim().charAt(0).toUpperCase();
      }
    });
    function layout() {
      var rect = wrap.getBoundingClientRect();
      var total = wrap.offsetHeight - window.innerHeight;
      var p = Math.min(1, Math.max(0, -rect.top / total));
      var n = cards.length;
      var pos = p * (n - 1);
      var active = Math.round(pos);
      var baseX = 32;
      cards.forEach(function (c, i) {
        var x;
        if (i <= active) {
          x = baseX + i * 120;
          if (i === active) x = Math.min(x, window.innerWidth * 0.42);
        } else {
          x = window.innerWidth + 40 + (i - active) * 60;
        }
        c.style.transform = 'translateX(' + x + 'px)';
        c.style.zIndex = String(10 + i);
        c.classList.toggle('is-spine', i < active);
      });
    }
    window.addEventListener('scroll', layout, { passive: true });
    window.addEventListener('resize', layout);
    layout();
    cards.forEach(function (c) {
      c.addEventListener('click', function () {
        var i = cards.indexOf(c);
        var wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: wrapTop + (i / (cards.length - 1)) * (wrap.offsetHeight - window.innerHeight), behavior: 'smooth' });
      });
    });
  }

  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', function () { hero(); entrances(); deck(); });
  } else {
    hero(); entrances(); deck();
  }
})();
