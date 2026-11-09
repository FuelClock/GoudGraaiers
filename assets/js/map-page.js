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
  /* labels live in their own overlay so a name is never buried under
     another marker's icon: icons (markers layer) < other labels < port names */
  var labelsEl = d.createElement('div');
  labelsEl.className = 'imap-labels';
  labelsEl.setAttribute('aria-hidden', 'true');
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
      /* only the goods the market SELLS: its own economy region's goods,
         stocked cheap (WosbTrading.A). The rest of the list in game is what
         the port BUYS, which must not appear here (Thimon's call) */
      var sells = port.sells || [];
      if (sells.length) {
        goods = '<p class="imap-popup-goods-label">Market sells</p><div class="imap-popup-goods">' +
          sells.map(function (g) { return '<span>' + g + '</span>'; }).join('') + '</div>';
      } else {
        goods = '<p class="imap-popup-goods-label">No goods of its own region</p>';
      }
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
  markersEl.insertAdjacentElement('afterend', labelsEl);
  function addLabel(text, extraCls, u) {
    var lbl = d.createElement('span');
    lbl.className = 'imap-marker-label' + (extraCls ? ' ' + extraCls : '');
    lbl.textContent = text;
    lbl.style.left = (u[0] * 100) + '%';
    lbl.style.top = (u[1] * 100) + '%';
    labelsEl.appendChild(lbl);
    return lbl;
  }
  var bySlug = {};
  DATA.ports.forEach(function (port) {
    var el = d.createElement('button');
    el.type = 'button';
    el.className = 'imap-marker' + (port.gather ? ' is-gather' : '') + (port.pirate ? ' is-pirate' : '');
    el.style.left = (port.u[0] * 100) + '%';
    el.style.top = (port.u[1] * 100) + '%';
    el.setAttribute('aria-label', port.name);
    el._label = addLabel(port.name, '', port.u);
    el.addEventListener('click', function (ev) {
      ev.stopPropagation();
      openPopup(port, el);
    });
    markersEl.appendChild(el);
    bySlug[slug(port.name)] = { port: port, el: el };
  });

  /* pvp ring: drawn as the game's line of bones. The client (wosb_game/B/C.cs,
     A(Vector3[])) places 100 hazardZoneEdgeIcon sprites evenly around the
     WorldHazardZones circle, each rotated to the angle + PI with +-0.5 rad of
     jitter at opacity White*0.75. A dashed CSS border never looked like that. */
  var pvpRing = d.getElementById('imap-pvp-ring');
  var pc = DATA.pvpCircle;
  var pvpR = pc.rOfW; /* radius as a fraction of chart width */
  var bones = [];
  (function buildBones() {
    var rOfH = pvpR * IMG_W / IMG_H;
    var N = 100;
    var frag = d.createDocumentFragment();
    for (var i = 0; i < N; i++) {
      var ang = (i / N) * Math.PI * 2;
      var jitter = ((i * 137 % 100) / 100 - 0.5); /* deterministic +-0.5 rad */
      /* our bone sprite lies horizontal, so radius-angle + PI pointed it
         across the circle (spokes); + PI/2 lays its long side ALONG the
         circle, matching the in-game look (Thimon) */
      var b = d.createElement('span');
      b.className = 'imap-bone';
      b.style.left = ((pc.u[0] + Math.cos(ang) * pvpR) * 100) + '%';
      b.style.top = ((pc.u[1] + Math.sin(ang) * rOfH) * 100) + '%';
      b.setAttribute('data-rot', (ang + Math.PI * 1.5 + jitter).toFixed(3));
      frag.appendChild(b);
      bones.push(b);
    }
    stage.appendChild(frag);
  })();

  /* phase-2 layers: fast travel, traders/settlements, personal islands,
     resource sites, points of interest (regions + collections), forts, routes.
     Markers render with the game's own map-legend icons (img/map-icons/,
     extracted from the client's AtlWorldMap atlas). */
  var CAT_BADGE = { Regional: 'Regional landmark', Shipwrecks: 'Shipwreck', Figurines: 'Rank figurine', LonghornHistory: 'Longhorn history', Weapons: 'Lost weapon' };
  var RES_NAME = { wood: 'Wood', iron: 'Iron', coal: 'Coal', ice: 'Ice', farm: 'Farm', rum: 'Rum', resin: 'Resin', copper: 'Copper', mhidden: 'Rare goods' };
  function secondaryMarker(layer, cls, title, html) {
    var el = d.createElement('button');
    el.type = 'button';
    el.className = 'imap-marker is-secondary ' + cls;
    el.style.left = (layer.u[0] * 100) + '%';
    el.style.top = (layer.u[1] * 100) + '%';
    el.setAttribute('aria-label', title);
    el._label = addLabel(title, 'is-secondary-label ' + cls, layer.u);
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
    /* the in-game legend splits special finds into two rows: points of
       interest REGIONS (interestPoint icon) and COLLECTIONS (collectionPoint) */
    var cls = p.cat === 'Regional' ? 'is-lvl-regions' : 'is-lvl-collections';
    secondaryMarker(p, cls, p.name,
      '<h3 class="imap-popup-name">' + p.name + '</h3>' +
      '<div class="imap-popup-badges">' + badge(CAT_BADGE[p.cat] || p.cat, 'is-info') + '</div>' +
      (p.reward ? '<p class="imap-popup-dock">Research reward: ' + p.reward + '</p>' : ''));
  });
  (DATA.layers ? DATA.layers.traders || [] : []).forEach(function (p) {
    secondaryMarker(p, 'is-lvl-traders', p.kind,
      '<h3 class="imap-popup-name">' + p.kind + '</h3>' +
      '<div class="imap-popup-badges">' + badge('Traders and settlements', 'is-info') + '</div>' +
      '<p class="imap-popup-dock">One of the world\'s static trader settlements, straight from the game files.</p>');
  });
  (DATA.layers ? DATA.layers.production || [] : []).forEach(function (p) {
    var res = RES_NAME[p.res] || p.res;
    secondaryMarker(p, 'is-lvl-personal', res,
      '<h3 class="imap-popup-name">' + res + '</h3>' +
      '<div class="imap-popup-badges">' + badge('Mines', 'is-info') + '</div>' +
      '<p class="imap-popup-dock">A mine or factory isle: claim it with a personal island to produce ' + res.toLowerCase() + ' for the guild.</p>');
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

  /* layer toggles: legend buttons, aria-pressed instead of a checkbox.
     Fullscreen carries a CLONE of the legend (built below, before this
     binding runs) so its buttons are picked up too: both copies stay in
     sync because every toggle is found by data-layer, never by id. */
  var fsLegend = d.getElementById('imap-fs-legend');
  (function buildFsLegend() {
    var src = d.getElementById('imap-legend');
    if (!fsLegend || !src) return;
    var clone = src.cloneNode(true);
    clone.removeAttribute('id');
    clone.querySelectorAll('[id]').forEach(function (el) { el.removeAttribute('id'); });
    fsLegend.appendChild(clone);
  })();

  var LAYERS = ['pharos', 'traders', 'personal', 'regions', 'collections', 'forts', 'routes'];
  var layerState = {};
  try { layerState = JSON.parse(localStorage.getItem('imap-layers') || '{}'); } catch (e) { layerState = {}; }
  LAYERS.forEach(function (name) {
    var btns = Array.prototype.slice.call(d.querySelectorAll('.imap-legend-toggle[data-layer="' + name + '"]'));
    if (!btns.length) return;
    layerState[name] = layerState[name] !== undefined ? !!layerState[name] : btns[0].getAttribute('aria-pressed') === 'true';
    function sync() {
      btns.forEach(function (btn) {
        btn.setAttribute('aria-pressed', layerState[name] ? 'true' : 'false');
      });
      markersEl.classList.toggle('hide-' + name, !layerState[name]);
      labelsEl.classList.toggle('hide-' + name, !layerState[name]);
      if (name === 'routes') routesSvg.classList.toggle('hide-routes-off', !layerState[name]);
      try { localStorage.setItem('imap-layers', JSON.stringify(layerState)); } catch (e) {}
    }
    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        layerState[name] = !layerState[name];
        sync();
      });
    });
    sync();
  });

  /* hi-res chart: loaded with the page (src in the markup) and shown on top
     as soon as it has decoded, so zooming never swaps images mid-gesture */
  var hiImg = d.getElementById('imap-img-hi');
  var hiLoaded = false;
  if (hiImg) {
    if (hiImg.complete && hiImg.naturalWidth) hiLoaded = true;
    else hiImg.addEventListener('load', function () { hiLoaded = true; syncHi(); });
  }
  function syncHi() {
    if (hiImg) hiImg.style.opacity = hiLoaded ? '1' : '0';
  }

  /* pan + zoom */
  function apply() {
    stage.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + k + ')';
    var inv = 1 / k;
    markersEl.querySelectorAll('.imap-marker').forEach(function (m) {
      m.style.transform = 'translate(-50%,-50%) scale(' + inv + ')';
      /* names live in the labels overlay, above every icon (Thimon);
         lighthouses and trader villages need no name - the icons say it all */
      var named = !(m.classList.contains('is-lvl-pharos') || m.classList.contains('is-lvl-traders'));
      if (m._label) {
        m._label.classList.toggle('is-on', named);
        m._label.style.transform = 'translate(-50%,-100%) translateY(calc(-1 * (var(--imap-icon) / 2 + 4px))) scale(' + inv + ')';
      }
    });
    bones.forEach(function (b) {
      b.style.transform = 'translate(-50%,-50%) rotate(' + b.getAttribute('data-rot') + 'rad) scale(' + inv + ')';
    });
    if (pvpRing) {
      var rOfH = pvpR * IMG_W / IMG_H; /* the circle is round on screen: radius in height fractions is larger */
      pvpRing.style.left = ((pc.u[0] - pvpR) * 100) + '%';
      pvpRing.style.top = ((pc.u[1] - rOfH) * 100) + '%';
      pvpRing.style.width = (pvpR * 2 * 100) + '%';
      pvpRing.style.height = (rOfH * 2 * 100) + '%';
    }
    if (routesSvg) routesSvg.style.strokeWidth = (3 / k) + 'px';
    syncHi();
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
    /* contain fit: at k = 1 the WHOLE chart is visible inside the box,
       centred on both axes, as large as the box allows (Thimon: zooming out
       must cleanly show the entire map, equal margins left/right) */
    var fit = Math.min(vw / IMG_W, vh / IMG_H);
    IMG_W_FIT = IMG_W * fit;
    IMG_H_FIT = IMG_H * fit;
    /* JS owns the stage geometry: the imgs just fill it. Leaving the size to
       the CSS img (width:100%) resolved against the viewport and skewed every
       marker as soon as the fit stopped being width-based */
    stage.style.width = IMG_W_FIT + 'px';
    stage.style.height = IMG_H_FIT + 'px';
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
    /* markers, the popup and the fullscreen controls handle their own
       clicks; capturing the pointer here would retarget those clicks to
       the viewport (the close button never received its click once) */
    if (e.target.closest('.imap-marker') || e.target.closest('.imap-popup') ||
        e.target.closest('.imap-fs-btn') || e.target.closest('.imap-fs-legend')) return;
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
    if (!e.ctrlKey) return; /* plain scroll scrolls the page; ctrl+scroll zooms the chart */
    e.preventDefault(); /* also keeps the browser's own ctrl+wheel page zoom out of the way */
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

  /* fullscreen: the expand button sits on the chart's top-right corner; in
     fullscreen the same corner carries the X, and the fs legend overlay
     shows the toggles. Fullscreen on the VIEWPORT element only, so the
     page legend, toolbar and article chrome stay out of the way. */
  var fsExpand = d.getElementById('imap-fs-expand');
  var fsClose = d.getElementById('imap-fs-close');
  function fsActive() {
    return d.fullscreenElement === viewport || d.webkitFullscreenElement === viewport ||
      viewport.classList.contains('imap-fs-fallback');
  }
  function setFsUi(on) {
    viewport.classList.toggle('imap-is-fs', on);
    fsExpand.hidden = on;
    fsClose.hidden = !on;
    fsLegend.hidden = !on;
    measure();
  }
  function enterFsFallback() {
    viewport.classList.add('imap-fs-fallback');
    d.body.classList.add('imap-fs-page'); /* lift MAIN's stacking context over the sticky header */
    setFsUi(true);
  }
  function enterFs() {
    var fn = viewport.requestFullscreen || viewport.webkitRequestFullscreen;
    if (!fn) { enterFsFallback(); return; }
    var p = fn.call(viewport);
    if (p && p.catch) p.catch(function () { enterFsFallback(); });
  }
  function exitFs() {
    if (d.fullscreenElement || d.webkitFullscreenElement) {
      (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    } else {
      viewport.classList.remove('imap-fs-fallback');
      d.body.classList.remove('imap-fs-page');
      setFsUi(false);
    }
  }
  fsExpand.addEventListener('click', enterFs);
  fsClose.addEventListener('click', exitFs);
  ['fullscreenchange', 'webkitfullscreenchange'].forEach(function (evName) {
    d.addEventListener(evName, function () { setFsUi(fsActive()); });
  });
  /* the fallback overlay has no native Esc handling of its own */
  d.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && viewport.classList.contains('imap-fs-fallback')) exitFs();
  });

  window.addEventListener('resize', measure);
  /* the box also changes size without a window resize (orientation,
     container-driven), so observe it directly */
  if (window.ResizeObserver) new ResizeObserver(measure).observe(viewport);
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
