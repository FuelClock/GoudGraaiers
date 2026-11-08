/* De Goud Graaiers — trade route planner renderer.
   Reads window.TRADE_DATA and window.TRADE_PLANS (trade-data.js) and draws
   the selected loop on the chart plus the stops list. */
(function () {
  'use strict';
  function init() {
    if (!window.TRADE_DATA || !window.TRADE_PLANS) { setTimeout(init, 120); return; }
    var rateSel = document.getElementById('rate-select');
    var pvpToggle = document.getElementById('pvp-toggle');
    var summary = document.getElementById('trade-summary');
    var skippedEl = document.getElementById('trade-skipped');
    var list = document.getElementById('route-list');

    function render() {
      var rate = rateSel.value;
      var allowPvp = pvpToggle.checked;
      var key = rate + (allowPvp ? 'p' : '');
      var plan = TRADE_PLANS[key];
      var pts = [];
      list.innerHTML = '';
      document.getElementById('plan-route').setAttribute('d', '');
      var stopsG = document.getElementById('plan-stops');
      stopsG.innerHTML = '';
      var NS = 'http://www.w3.org/2000/svg';

      if (!plan || plan.error) {
        var msg = 'No counterclockwise loop exists for this ship: every tier 1 port on the map sits inside the PvP circle or is a pirate port, so a 1st rate trader has nowhere peaceful to dock. Tick the PvP box, or sail a smaller ship.';
        summary.textContent = allowPvp ? 'Not enough ports for a loop.' : msg;
        skippedEl.textContent = '';
        return;
      }
      var active = plan.active.slice();
      var stIdx = active.findIndex(function (a) { return a.name === 'St. Jean'; });
      if (stIdx > 0) active = active.slice(stIdx).concat(active.slice(0, stIdx));
      summary.textContent = 'Loop: ' + active.length + ' trading stops, ' + plan.skipped.length +
        ' sailed past without a profitable trade. Amounts assume a full 100 ton hold per cargo and scale with your real capacity.';
      skippedEl.textContent = plan.skipped.length ? 'Sail past without trading: ' + plan.skipped.join(', ') + '.' : '';

      active.forEach(function (a, i) {
        var li = document.createElement('li');
        var parts = [];
        if (Object.keys(a.sell).length) {
          parts.push('<b class="act-sell">SELL</b> <span class="goods">sell by best profit margins</span>');
        }
        if ((a.buys || []).length) {
          var bl = a.buys.map(function (t) {
            return '<span class="goods">' + t.g + ' ' + t.qty + 't</span>';
          }).join(' &nbsp; ');
          parts.push('<b class="act-buy">BUY, best first:</b> ' + bl);
        }
        li.innerHTML = '<b>' + a.name + '</b>' +
          (parts.length ? ': ' + parts.join(' &nbsp; ') : ': sail on, no trade here');
        list.appendChild(li);
      });

      var MUW = 120.0516;
      active.forEach(function (a, i) {
        var x = a.lng / MUW * 2400, y = (1 - a.lat / 100) * 1987;
        pts.push([x, y]);
        var c = document.createElementNS(NS, 'circle');
        c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 18);
        c.setAttribute('fill', '#d4af37'); c.setAttribute('stroke', '#14212c'); c.setAttribute('stroke-width', 5);
        stopsG.appendChild(c);
        var t = document.createElementNS(NS, 'text');
        t.setAttribute('x', x); t.setAttribute('y', y + 13);
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('font-size', 34); t.setAttribute('font-weight', 500);
        t.setAttribute('fill', '#14212c');
        t.textContent = String(i + 1);
        stopsG.appendChild(t);
        var lbl = document.createElementNS(NS, 'text');
        if (x > 2050) { lbl.setAttribute('x', x - 26); lbl.setAttribute('text-anchor', 'end'); }
        else if (x < 350) { lbl.setAttribute('x', x + 26); lbl.setAttribute('text-anchor', 'start'); }
        else { lbl.setAttribute('x', x); lbl.setAttribute('text-anchor', 'middle'); }
        lbl.setAttribute('y', y + 58);
        lbl.setAttribute('font-size', 46); lbl.setAttribute('font-weight', 600);
        lbl.setAttribute('fill', '#14212c');
        lbl.setAttribute('stroke', '#e8e2d2'); lbl.setAttribute('stroke-width', 10);
        lbl.setAttribute('paint-order', 'stroke'); lbl.setAttribute('stroke-linejoin', 'round');
        lbl.textContent = a.name;
        stopsG.appendChild(lbl);
      });
      if (pts.length > 1) {
        pts.push(pts[0].slice());
        var d = 'M ' + pts.map(function (pt) { return pt[0].toFixed(0) + ' ' + pt[1].toFixed(0); }).join(' L ');
        document.getElementById('plan-route').setAttribute('d', d);
      }
    }

    rateSel.addEventListener('change', render);
    pvpToggle.addEventListener('change', render);
    render();
  }
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
