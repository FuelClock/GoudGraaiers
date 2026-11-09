/* Join the fleet, variant C: the Guild Ranking practice panel and the
   copy-domain button. Loaded with defer on join-c.md only. */
(function () {
  'use strict';

  var sim = document.querySelector('.jc-sim');
  var input = document.getElementById('jc-search');
  var chip = document.getElementById('jc-chip');
  var results = document.getElementById('jc-results');
  var result = document.getElementById('jc-result');
  var applyBtn = document.getElementById('jc-apply');
  var sendBtn = document.getElementById('jc-send');
  var backBtn = document.getElementById('jc-back');
  var back2Btn = document.getElementById('jc-back2');
  var restartBtn = document.getElementById('jc-restart');
  var state = document.getElementById('jc-state');
  var copyBtn = document.getElementById('jc-copy');
  var domain = document.getElementById('jc-domain');
  var hint = document.getElementById('jc-hud-hint');

  if (!sim || !input) return;

  var stageEls = {
    icons: document.getElementById('jc-stage-icons'),
    search: document.getElementById('jc-stage-search'),
    guild: document.getElementById('jc-stage-guild'),
    message: document.getElementById('jc-stage-message'),
    sent: document.getElementById('jc-stage-sent')
  };
  var dots = sim.querySelectorAll('.jc-dot');
  var stageLabels = { icons: 'Find the icon', search: 'Find the fleet', guild: 'The fleet', message: 'Your message', sent: 'Application sent' };
  var order = ['icons', 'search', 'guild', 'message', 'sent'];

  function show(name) {
    order.forEach(function (k) { stageEls[k].hidden = k !== name; });
    var idx = order.indexOf(name);
    dots.forEach(function (d, i) { d.classList.toggle('is-on', i <= idx); });
    if (state) state.textContent = stageLabels[name];
    if (name === 'icons') {
      stageEls.icons.querySelectorAll('.jc-hud-icon').forEach(function (b) { b.classList.remove('is-wrong'); });
      hint.hidden = true;
    }
    if (name === 'search') input.focus();
  }

  function matches(v) {
    if (!v) return false;
    var bare = v.replace(/\./g, '');
    if (bare.length < 2) return false;
    return bare === 'nl' || 'goud graaiers'.indexOf(bare) !== -1;
  }

  function query() {
    var v = input.value.trim().toLowerCase();
    var hit = matches(v);
    results.hidden = !hit;
    if (!hit && stageEls.guild.hidden === false) show('search');
  }

  input.addEventListener('input', query);

  /* the HUD stage: wrong icon shakes and explains, the shield advances */
  sim.querySelectorAll('.jc-hud-icon').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.classList.contains('jc-hud-right')) {
        show('search');
        return;
      }
      btn.classList.remove('is-wrong');
      void btn.offsetWidth; /* restart the shake animation */
      btn.classList.add('is-wrong');
      if (hint) {
        hint.textContent = 'Not that one: that is ' + btn.getAttribute('data-icon') + '. The Guild Ranking icon is the shield.';
        hint.hidden = false;
      }
    });
  });

  chip.addEventListener('click', function () {
    input.value = 'NL.';
    query();
    input.focus();
  });

  result.addEventListener('click', function () {
    results.hidden = true;
    show('guild');
  });

  applyBtn.addEventListener('click', function () { show('message'); });
  sendBtn.addEventListener('click', function () { show('sent'); });
  backBtn.addEventListener('click', function () { show('search'); });
  back2Btn.addEventListener('click', function () { show('guild'); });
  restartBtn.addEventListener('click', function () {
    input.value = '';
    results.hidden = true;
    show('icons');
  });

  if (copyBtn && domain) {
    copyBtn.addEventListener('click', function () {
      var text = domain.textContent.trim();
      var done = function () {
        copyBtn.textContent = 'Copied';
        window.setTimeout(function () { copyBtn.textContent = 'Copy the domain'; }, 1600);
      };
      var fallback = function () {
        var range = document.createRange();
        range.selectNodeContents(domain);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        try {
          document.execCommand('copy');
          done();
        } catch (e) { /* clipboard unavailable: the domain stays visible */ }
        selection.removeAllRanges();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
    });
  }
})();
