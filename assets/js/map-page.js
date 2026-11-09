/* The Map page: pan/zoom chart + port markers + popups + search.
   Zero dependencies; driven by window.MAP_DATA (assets/js/map-data.js,
   generated from the game files). Loaded with defer on map.md only. */
(function () {
  'use strict';

  var d = document;
  var DATA = window.MAP_DATA;
  var viewport = d.getElementById('imap-viewport');
  var stage = d.getElementById('imap-stage');
  var markersEl = d.getElementById('imap-markers');
  var popup = d.getElementById('imap-popup');
  var popupBody = d.getElementById('imap-popup-body');
  var popupClose = d.getElementById('imap-popup-close');
  var searchInput = d.getElementById('imap-search');
  var results = d.getElementById('imap-results');
  var img = stage.querySelector('.imap-img');

  if (!viewport || !DATA) return;

  var TYPE_LABEL = { Bay: 'Faction bay', City: 'City', NeutralBay: 'Neutral bay', PirateBay: 'Pirate bay' };
  var IMG_W = 2400, IMG_H = 1989; /* map-web.jpg */
  var MIN_K = 1, MAX_K = 5;

  var k = 1, tx = 0, ty = 0; /* stage transform: translate(tx,ty) scale(k) */
  var vw = 0, vh = 0;
  var activeMarker = null;

  function slug(name) {
    return 'port-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function dockLine(port) {
    if (!port.dock) return 'Deep water: every ship can dock.';
    return 'Shallow waters: only ships of rate ' + port.dock + ' and above can dock.';
  }

  function badge(text, cls) {
    return '<span class="imap-badge' + (cls ? ' ' + cls : '') + '">' + text + '</span>';
  }

  function popupHtml(port) {
    var badges = badge(TYPE_LABEL[port.type] || port.type, 'is-info');
    if (port.pirate) badges += badge('Pirate', 'is-warn');
    if (port.pvp) badges += badge('PvP waters', 'is-warn');
    if (port.gather) badges += badge('Fleet gathering point', 'is-good');
    var goods = '';
    if (port.market) {
      goods = '<p class="imap-popup-goods-label">Market goods</p><div class="imap-popup-goods">' +
        port.goods.map(function (g) { return '<span>' + g + '</span>'; }).join('') + '</div>';
    } else {
      goods = '<p class="imap-popup-goods-label">No trade market</p>';
    }
    return '<h3 class="imap-popup-name">' + port.name + '</h3>' +
      '<p class="imap-popup-game">' + port.game + '</p>' +
      '<div class="imap-popup-badges">' + badges + '</div>' +
      '<p class="imap-popup-dock">' + dockLine(port) + '</p>' + goods;
  }

  function openPopup(port, markerEl) {
    popupBody.innerHTML = popupHtml(port);
    popup.hidden = false;
    if (activeMarker) activeMarker.classList.remove('is-active');
    activeMarker = markerEl;
    if (activeMarker) activeMarker.classList.add('is-active');
    positionPopup(markerEl);
    if (history.replaceState) history.replaceState(null, '', '#' + slug(port.name));
  }

  function positionPopup(markerEl) {
    if (!markerEl || popup.hidden) return;
    var vr = viewport.getBoundingClientRect();
    var mr = markerEl.getBoundingClientRect();
    var pw = popup.offsetWidth, ph = popup.offsetHeight;
    var left = mr.left - vr.left + mr.width + 12;
    if (left + pw > vr.width - 8) left = mr.left - vr.left - pw - 12;
    left = Math.max(8, Math.min(left, vr.width - pw - 8));
    var top = mr.top - vr.top - ph / 2 + mr.height / 2;
    top = Math.max(8, Math.min(top, Math.max(8, vr.height - ph - 8)));
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
  }

  function closePopup() {
    popup.hidden = true;
    if (activeMarker) activeMarker.classList.remove('is-active');
    activeMarker = null;
    if (history.replaceState) history.replaceState(null, '', location.pathname);
  }

  popupClose.addEventListener('click', closePopup);
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !popup.hidden) closePopup();
  });

  /* build markers */
  var bySlug = {};
  DATA.ports.forEach(function (port) {
    var el = d.createElement('button');
    el.type = 'button';
    el.className = 'imap-marker' + (port.gather ? ' is-gather' : '') + (port.pirate ? ' is-pirate' : '');
    el.style.left = (port.u[0] * 100) + '%';
    el.style.top = (port.u[1] * 100) + '%';
    el.setAttribute('aria-label', port.name);
    el.innerHTML = '<span class="imap-marker-label">' + port.name + '</span>';
    el.addEventListener('click', function (ev) {
      ev.stopPropagation();
      openPopup(port, el);
    });
    markersEl.appendChild(el);
    bySlug[slug(port.name)] = { port: port, el: el };
  });

  /* pvp ring: a div in stage space; border stays a constant 2px on screen */
  var pvpRing = d.getElementById('imap-pvp-ring');
  var pc = DATA.pvpCircle;
  var pvpR = pc.rOfW; /* radius as a fraction of chart width */

  /* phase-2 layers: fast travel, special finds, production, forts, routes */
  var CAT_BADGE = { Regional: 'Regional landmark', Shipwrecks: 'Shipwreck', Figurines: 'Rank figurine', LonghornHistory: 'Longhorn history', Weapons: 'Lost weapon' };
  var RES_NAME = { wood: 'Wood', iron: 'Iron', coal: 'Coal', ice: 'Ice', farm: 'Farm', rum: 'Rum', resin: 'Resin', copper: 'Copper', mhidden: 'Rare goods' };
  function secondaryMarker(layer, cls, title, html) {
    var el = d.createElement('button');
    el.type = 'button';
    el.className = 'imap-marker is-secondary ' + cls;
    el.style.left = (layer.u[0] * 100) + '%';
    el.style.top = (layer.u[1] * 100) + '%';
    el.setAttribute('aria-label', title);
    el.innerHTML = '<span class="imap-marker-label">' + title + '</span>';
    el.addEventListener('click', function (ev) {
      ev.stopPropagation();
      popupBody.innerHTML = html;
      popup.hidden = false;
      if (activeMarker) activeMarker.classList.remove('is-active');
      activeMarker = el;
      el.classList.add('is-active');
      positionPopup(el);
    });
    markersEl.appendChild(el);
    return el;
  }
  (DATA.layers ? DATA.layers.pharos || [] : []).forEach(function (p) {
    secondaryMarker(p, 'is-lvl-pharos', 'Fast travel',
      '<h3 class="imap-popup-name">Fast travel point</h3>' +
      '<p class="imap-popup-dock">A lighthouse of the fast travel network: sail here once and you can teleport between its kind.</p>');
  });
  (DATA.layers ? DATA.layers.finds || [] : []).forEach(function (p) {
    secondaryMarker(p, 'is-lvl-finds', p.name,
      '<h3 class="imap-popup-name">' + p.name + '</h3>' +
      '<div class="imap-popup-badges">' + badge(CAT_BADGE[p.cat] || p.cat, 'is-info') + '</div>' +
      (p.reward ? '<p class="imap-popup-dock">Research reward: ' + p.reward + '</p>' : ''));
  });
  (DATA.layers ? DATA.layers.production || [] : []).forEach(function (p) {
    var res = RES_NAME[p.res] || p.res;
    secondaryMarker(p, 'is-lvl-production', res + ' site',
      '<h3 class="imap-popup-name">' + res + ' site</h3>' +
      '<div class="imap-popup-badges">' + badge('Production', 'is-info') + '</div>' +
      '<p class="imap-popup-dock">A ' + res.toLowerCase() + ' production site for guild factories.</p>');
  });
  (DATA.layers ? DATA.layers.forts || [] : []).forEach(function (p) {
    secondaryMarker(p, 'is-lvl-forts', p.kind,
      '<h3 class="imap-popup-name">' + p.kind + '</h3>' +
      '<div class="imap-popup-badges">' + badge('Defence', 'is-warn') + '</div>');
  });

  /* npc trade routes (built before the toggle chips that may show/hide them) */
  var routesSvg = d.getElementById('imap-routes');
  if (routesSvg && DATA.routes) {
    routesSvg.innerHTML = DATA.routes.map(function (poly) {
      return '<polyline points="' + poly.map(function (pt) { return pt[0] + ',' + pt[1]; }).join(' ') + '"/>';
    }).join('');
  }

  /* layer toggles */
  var LAYERS = ['pharos', 'finds', 'production', 'forts', 'routes'];
  var layerState = {};
  try { layerState = JSON.parse(localStorage.getItem('imap-layers') || '{}'); } catch (e) { layerState = {}; }
  LAYERS.forEach(function (name) {
    var box = d.getElementById('imap-lvl-' + name);
    if (!box) return;
    box.checked = layerState[name] !== undefined ? !!layerState[name] : box.checked;
    function sync() {
      layerState[name] = box.checked;
      markersEl.classList.toggle('hide-' + name, !box.checked);
      if (name === 'routes') routesSvg.classList.toggle('hide-routes-off', !box.checked);
      try { localStorage.setItem('imap-layers', JSON.stringify(layerState)); } catch (e) {}
    }
    box.addEventListener('change', sync);
    sync();
  });

  /* hi-res swap: the 5100px chart fades in once the zoom needs it */
  var hiImg = d.getElementById('imap-img-hi');
  var hiLoaded = false, hiWanted = false;
  if (hiImg) {
    hiImg.addEventListener('load', function () { hiLoaded = true; syncHi(); });
  }
  function syncHi() {
    hiWanted = k >= 1.5;
    if (hiWanted && !hiLoaded && hiImg && !hiImg.getAttribute('src')) hiImg.src = '/img/map-full.jpg';
    if (hiImg) hiImg.style.opacity = (hiLoaded && hiWanted) ? '1' : '0';
  }

  /* pan + zoom */
  function apply() {
    stage.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + k + ')';
    var inv = 1 / k;
    markersEl.querySelectorAll('.imap-marker').forEach(function (m) {
      m.style.transform = 'translate(-50%,-50%) scale(' + inv + ')';
      m.classList.toggle('is-labeled', k >= 2.2);
    });
    if (pvpRing) {
      pvpRing.style.left = ((pc.u[0] - pvpR) * 100) + '%';
      pvpRing.style.top = (((pc.u[1] * IMG_W) - pvpR * IMG_W) / IMG_H * 100) + '%';
      pvpRing.style.width = (pvpR * 2 * 100) + '%';
      pvpRing.style.height = ((pvpR * 2 * IMG_W) / IMG_H * 100) + '%';
      pvpRing.style.borderWidth = (2 * k) + 'px';
    }
    if (routesSvg) routesSvg.style.strokeWidth = (3 / k) + 'px';
    syncHi();
    markersEl.classList.toggle('is-close', k >= 1.5);
    if (!popup.hidden && activeMarker) positionPopup(activeMarker);
  }

  function clampPan() {
    var minX = Math.min(0, vw - IMG_W_FIT * k);
    var minY = Math.min(0, vh - IMG_H_FIT * k);
    tx = Math.max(minX, Math.min(0, tx));
    ty = Math.max(minY, Math.min(0, ty));
    if (IMG_W_FIT * k <= vw) tx = (vw - IMG_W_FIT * k) / 2;
    if (IMG_H_FIT * k <= vh) ty = (vh - IMG_H_FIT * k) / 2;
  }

  var IMG_W_FIT = 1, IMG_H_FIT = 1; /* stage size at k = 1 */
  function measure() {
    vw = viewport.clientWidth;
    vh = viewport.clientHeight;
    IMG_W_FIT = vw;
    IMG_H_FIT = IMG_W_FIT * IMG_H / IMG_W;
    clampPan();
    apply();
  }

  function zoomAt(cx, cy, factor) {
    var nk = Math.max(MIN_K, Math.min(MAX_K, k * factor));
    if (nk === k) return;
    var wx = (cx - tx) / k, wy = (cy - ty) / k;
    k = nk;
    tx = cx - wx * k;
    ty = cy - wy * k;
    clampPan();
    apply();
  }

  var drag = null;
  viewport.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.imap-marker')) return;
    drag = { x: e.clientX, y: e.clientY, tx: tx, ty: ty, id: e.pointerId };
    viewport.setPointerCapture(e.pointerId);
    viewport.classList.add('is-dragging');
  });
  viewport.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    tx = drag.tx + (e.clientX - drag.x);
    ty = drag.ty + (e.clientY - drag.y);
    clampPan();
    apply();
  });
  viewport.addEventListener('pointerup', function (e) {
    if (drag && e.pointerId === drag.id) { drag = null; viewport.classList.remove('is-dragging'); }
  });
  viewport.addEventListener('pointercancel', function () { drag = null; viewport.classList.remove('is-dragging'); });

  /* pinch: two pointers, zoom by distance ratio */
  var pointers = [];
  var pinch = null;
  viewport.addEventListener('pointerdown', function (e) {
    pointers.push({ id: e.pointerId, x: e.clientX, y: e.clientY });
    if (pointers.length === 2) {
      drag = null;
      pinch = { dist: Math.hypot(pointers[0].x - pointers[1].x, pointers[0].y - pointers[1].y) };
    }
  });
  viewport.addEventListener('pointermove', function (e) {
    var p = pointers.find(function (q) { return q.id === e.pointerId; });
    if (p) { p.x = e.clientX; p.y = e.clientY; }
    if (pinch && pointers.length === 2) {
      var vr = viewport.getBoundingClientRect();
      var dist = Math.hypot(pointers[0].x - pointers[1].x, pointers[0].y - pointers[1].y);
      var mid = { x: (pointers[0].x + pointers[1].x) / 2 - vr.left, y: (pointers[0].y + pointers[1].y) / 2 - vr.top };
      zoomAt(mid.x, mid.y, dist / pinch.dist);
      pinch.dist = dist;
    }
  });
  function releasePointer(e) {
    pointers = pointers.filter(function (q) { return q.id !== e.pointerId; });
    if (pointers.length < 2) pinch = null;
  }
  viewport.addEventListener('pointerup', releasePointer);
  viewport.addEventListener('pointercancel', function (e) { releasePointer(e); drag = null; viewport.classList.remove('is-dragging'); });

  viewport.addEventListener('wheel', function (e) {
    e.preventDefault();
    var vr = viewport.getBoundingClientRect();
    zoomAt(e.clientX - vr.left, e.clientY - vr.top, e.deltaY < 0 ? 1.15 : 1 / 1.15);
  }, { passive: false });

  d.getElementById('imap-zoom-in').addEventListener('click', function () {
    zoomAt(vw / 2, vh / 2, 1.3);
  });
  d.getElementById('imap-zoom-out').addEventListener('click', function () {
    zoomAt(vw / 2, vh / 2, 1 / 1.3);
  });
  d.getElementById('imap-zoom-reset').addEventListener('click', function () {
    k = 1; tx = 0; ty = 0;
    clampPan();
    apply();
  });

  window.addEventListener('resize', measure);
  measure();
  apply();

  /* search */
  function focusPort(port) {
    var target = bySlug[slug(port.name)];
    if (!target) return;
    var mrk = target.el;
    if (k < 2) k = 2;
    var wantX = vw / 2 - parseFloat(mrk.style.left) / 100 * IMG_W_FIT * k;
    var wantY = vh / 2 - parseFloat(mrk.style.top) / 100 * IMG_H_FIT * k;
    tx = wantX; ty = wantY;
    clampPan();
    apply();
    openPopup(port, mrk);
  }

  function renderResults(q) {
    var norm = q.trim().toLowerCase();
    if (!norm) { results.hidden = true; results.innerHTML = ''; return; }
    var hits = DATA.ports.filter(function (p) {
      return p.name.toLowerCase().indexOf(norm) !== -1 || p.game.toLowerCase().indexOf(norm) !== -1;
    }).slice(0, 8);
    results.innerHTML = hits.map(function (p) {
      return '<button type="button" data-name="' + p.name.replace(/"/g, '&quot;') + '">' + p.name +
        '<span class="imap-result-type">' + (TYPE_LABEL[p.type] || p.type) + '</span></button>';
    }).join('');
    results.hidden = hits.length === 0;
    results.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        var port = DATA.ports.find(function (p) { return p.name === b.getAttribute('data-name'); });
        results.hidden = true;
        results.innerHTML = '';
        searchInput.value = '';
        focusPort(port);
      });
    });
  }
  searchInput.addEventListener('input', function () { renderResults(searchInput.value); });
  searchInput.addEventListener('focus', function () { renderResults(searchInput.value); });
  d.addEventListener('click', function (e) {
    if (!e.target.closest('.imap-search')) results.hidden = true;
  });

  /* deep links: #port-st-jean opens that port */
  function openFromHash() {
    var id = location.hash.replace(/^#/, '');
    if (id && bySlug[id]) focusPort(bySlug[id].port);
  }
  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();
