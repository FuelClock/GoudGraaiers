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
    var targets = d.querySelectorAll('.deck-card, .statement-band, .statement-body > *, .faq-row, .joining-steps > div, .doctrine-body, .cta-headline, .article-body > *, .page-title-band .page-side > *');
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

  if (d.readyState === 'loading') {
    d.addEventListener('DOMContentLoaded', function () { hero(); entrances(); });
  } else {
    hero(); entrances();
  }
})();
