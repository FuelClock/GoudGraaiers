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
      summary.textContent = 'Loop: ' + active.length + ' stops from the St Jean gathering point (no market there: gather, then sail), ' + plan.skipped.length +
        ' sailed past without a profitable trade. Amounts assume a full 100 ton hold per cargo and scale with your real capacity.';
      skippedEl.textContent = plan.skipped.length ? 'Sail past without trading: ' + plan.skipped.join(', ') + '.' : '';

      active.forEach(function (a, i) {
        var li = document.createElement('li');
        li.className = 'stop';
        var hasSell = !!Object.keys(a.sell).length;
        var buys = a.buys || [];
        var html = '<span class="stop-no">' + (i + 1) + '</span>' +
          '<h4 class="stop-name">' + a.name + '</h4>';
        if (hasSell || buys.length) {
          var rows = '';
          if (hasSell) {
            rows += '<li class="stop-sell"><b>SELL</b>: dock and use the game\'s Sell by best profit margins button</li>';
          }
          buys.forEach(function (t, k) {
            rows += '<li><span class="stop-rank">' + (k + 1) + '</span>' +
              '<span class="stop-good">' + t.g + '</span>' +
              '<span class="stop-qty">' + t.qty + ' t per full 100 t hold</span></li>';
          });
          html += '<ul class="stop-goods">' + rows + '</ul>';
        } else {
          html += '<p class="stop-empty">' + (a.name === 'St. Jean' ? 'gather here, start the loop' : 'sail on, no profitable trade here') + '</p>';
        }
        li.innerHTML = html;
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
        var anchoredEnd = x > 2050, anchoredStart = x < 350;
        if (anchoredEnd) { lbl.setAttribute('x', x - 26); lbl.setAttribute('text-anchor', 'end'); }
        else if (anchoredStart) { lbl.setAttribute('x', x + 26); lbl.setAttribute('text-anchor', 'start'); }
        else { lbl.setAttribute('x', x); lbl.setAttribute('text-anchor', 'middle'); }
        lbl.setAttribute('y', y + 58);
        lbl.setAttribute('class', 'plan-name');
        lbl.setAttribute('font-size', 46); lbl.setAttribute('font-weight', 500);
        lbl.setAttribute('fill', '#e8e2d2');
        lbl.setAttribute('stroke', '#14212c'); lbl.setAttribute('stroke-width', 10);
        lbl.setAttribute('paint-order', 'stroke'); lbl.setAttribute('stroke-linejoin', 'round');
        lbl.textContent = a.name;
        stopsG.appendChild(lbl);
        var hasSell = !!Object.keys(a.sell).length;
        var buys = a.buys || [];
        var goodsLine = '';
        if (hasSell) {
          goodsLine = 'sell by best profit margins';
        } else if (buys.length) {
          goodsLine = 'buy ' + buys.slice(0, 3).map(function (t) { return t.g; }).join(' + ') +
            (buys.length > 3 ? ' +' + (buys.length - 3) + ' more' : '');
        } else if (a.name === 'St. Jean') {
          goodsLine = 'gather here, start the loop';
        }
        if (goodsLine) {
          var gl = document.createElementNS(NS, 'text');
          if (anchoredEnd) { gl.setAttribute('x', x - 26); gl.setAttribute('text-anchor', 'end'); }
          else if (anchoredStart) { gl.setAttribute('x', x + 26); gl.setAttribute('text-anchor', 'start'); }
          else { gl.setAttribute('x', x); gl.setAttribute('text-anchor', 'middle'); }
          gl.setAttribute('y', y + 96);
          gl.setAttribute('class', 'plan-goods');
          gl.setAttribute('font-size', 28); gl.setAttribute('font-weight', 500);
          gl.setAttribute('fill', '#e5cf82');
          gl.setAttribute('stroke', '#14212c'); gl.setAttribute('stroke-width', 8);
          gl.setAttribute('paint-order', 'stroke'); gl.setAttribute('stroke-linejoin', 'round');
          gl.textContent = goodsLine;
          stopsG.appendChild(gl);
        }
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
