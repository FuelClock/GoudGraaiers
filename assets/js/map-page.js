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
  var MIN_K = 1, MAX_K = 5, FS_MIN_K = 0.75; /* fullscreen may zoom out a bit further (Thimon) */
  var FS_ENTER_K = 1 / 1.15; /* fullscreen DEFAULT: exactly one wheel notch out (Thimon, 2026-11-09: keeps the battle-mark isles on screen) */
  function minK() { return fsActive() ? FS_MIN_K : MIN_K; }
  function defaultK() { return fsActive() ? FS_ENTER_K : MIN_K; }

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
  /* click anywhere outside the popup closes it, same as the X (Thimon).
     Markers are excluded: their own click re-targets the popup anyway. */
  d.addEventListener('pointerdown', function (e) {
    if (popup.hidden) return;
    if (popup.contains(e.target) || e.target.closest('.imap-marker')) return;
    closePopup();
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
  var RES_NAME = { wood: 'Wood', iron: 'Iron', coal: 'Coal', ice: 'Ice', farm: 'Farm', rum: 'Rum', resin: 'Resin', copper: 'Copper', mhidden: 'Battle marks' };
  /* Factory production per level, straight from the client decomp
     (Common.Game/WosbCrafting.cs A(): the FactoryMineLivelInfo table).
     Rates are PER HOUR (the game's own UI: MineUi_21 "{1} (+{0} per hour)").
     i = [resId, count/hour] input (39 = Rations), o = output count/hour,
     h = internal storage capacity. resId names: RES_OF_ID below.
     Battle marks = the mhidden isles (NUnderground, produces res 37). */
  var RES_OF_ID = { 1: 'wood', 2: 'rum', 5: 'water', 6: 'sugar', 10: 'grain', 12: 'coal', 13: 'pitch', 16: 'plate', 22: 'animals', 29: 'bulkhead', 31: 'iron ore', 32: 'copper ore', 37: 'battle marks', 39: 'rations' };
  var FACTORIES = {
    wood:   { out: 'wood',        levels: [{o: 20, h: 820}, {o: 30, h: 1440}, {i: [39, 1], o: 70, h: 3920}, {i: [39, 2], o: 110, h: 7150}] },
    iron:   { out: 'iron ore',    levels: [{o: 15, h: 615}, {o: 22, h: 1080}, {i: [39, 1], o: 52, h: 2940}, {i: [39, 2], o: 82, h: 5362}] },
    copper: { out: 'copper ore',  levels: [{o: 2, h: 82}, {o: 3, h: 144}, {i: [39, 1], o: 6, h: 392}, {i: [39, 2], o: 10, h: 715}] },
    resin:  { out: 'pitch',       levels: [{o: 2, h: 82}, {o: 3, h: 144}, {i: [39, 1], o: 6, h: 336}, {i: [39, 2], o: 9, h: 585}] },
    rum:    { out: 'rum',         levels: [{o: 5, h: 205}, {i: [6, 1], o: 12, h: 576}, {i: [6, 2], o: 19, h: 1064}, {i: [6, 3], o: 26, h: 1690}] },
    farm:   { out: 'animals',     levels: [{i: [10, 3], o: 12, h: 200}, {i: [10, 3], o: 12, h: 400}, {i: [10, 4], o: 16, h: 600}, {i: [10, 5], o: 20, h: 750}] },
    ice:    { out: 'water',       levels: [{o: 20, h: 820}, {i: [12, 2], o: 40, h: 1920}, {i: [12, 5], o: 70, h: 3920}, {i: [12, 10], o: 110, h: 7150}] },
    coal:   { out: 'coal',        levels: [{o: 4, h: 164}, {o: 6, h: 288}, {i: [39, 1], o: 14, h: 784}, {i: [39, 2], o: 22, h: 1430}] },
    mhidden:{ out: 'battle marks',levels: [{o: 1, h: 40}, {i: [39, 2], o: 2, h: 90}, {i: [39, 3], o: 3, h: 120}, {i: [39, 4], o: 4, h: 140}] }
  };
  /* upgrade costs, same for every factory (WosbCrafting m_A tables):
     the cost to REACH the level with that index (0 = build the level 1) */
  var FACTORY_COSTS = [
    { gold: 500 },
    { gold: 3000 },
    { gold: 9000 },
    { items: [[29, 20], [16, 20], [5, 1000]] }
  ];
  /* captives (bondmen) double production AND input consumption
     (WosbCrafting.BondmanFactoryBoostAmount = 2, bondman_factory_tt);
     without supplies a factory runs at quarter speed with the right
     captain perk, or stops without it (FactoryMineLivelInfo.WorkingSpeed) */
  var FACTORY_BONDMAN_X = 2, FACTORY_NOSUPPLY_X = 0.25;
  function secondaryMarker(layer, cls, title, html, onOpen) {
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
      if (onOpen) onOpen(popupBody);
      if (activeMarker) activeMarker.classList.remove('is-active');
      activeMarker = el;
      el.classList.add('is-active');
      positionPopup(el);
    });
    markersEl.appendChild(el);
    return el;
  }
  /* ---- factory (mine) stats popup: per-level production with captives /
     supplies toggles and upgrade costs, tabbed with arrows like the game's
     upgrade UI. All numbers from the client decomp (see FACTORIES above). */
  function fmtN(n) {
    return (Math.round(n * 10) / 10).toString().replace(/\.5$/, '.5');
  }
  function fmtRes(n, name) {
    return fmtN(n) + ' ' + ((Math.round(n * 10) / 10) === 1 ? name.replace(/s$/, '') : name);
  }
  function fmtDur(hours) {
    if (!isFinite(hours) || hours <= 0) return 'never';
    var m = Math.round(hours * 60);
    if (m < 60) return m + ' min';
    var h = Math.floor(m / 60), mm = m % 60;
    if (h < 48) return h + ' h' + (mm ? ' ' + mm + ' min' : '');
    var d = Math.floor(h / 24);
    return d + ' d ' + (h % 24) + ' h';
  }
  function factoryCostChips(cost) {
    if (cost.gold) return '<span class="imap-goods-chip">' + cost.gold.toLocaleString('en-US') + ' gold</span>';
    return cost.items.map(function (it) {
      return '<span class="imap-goods-chip">' + it[1].toLocaleString('en-US') + ' ' + RES_OF_ID[it[0]] + '</span>';
    }).join('');
  }
  function initFactoryStats(el, resKey) {
    var f = FACTORIES[resKey];
    if (!f) { el.innerHTML = ''; return; }
    var st = { lvl: 0, bondman: false, supplies: false }; /* toggles start OFF (Thimon, 2026-11-09) */
    function render() {
      var lv = f.levels[st.lvl];
      var x = st.bondman ? FACTORY_BONDMAN_X : 1;
      var needs = 'nothing';
      var outX = x;
      var note = '';
      if (lv.i) {
        if (st.supplies) {
          needs = fmtRes(lv.i[1] * x, RES_OF_ID[lv.i[0]]) + ' / hour';
        } else {
          outX *= FACTORY_NOSUPPLY_X;
          note = '<p class="imap-fact-note">Quarter speed without supplies (with the captain perk; without it the mine stands still).</p>';
        }
      }
      if (resKey === 'farm') {
        note = '<p class="imap-fact-note">The more animals in storage, the faster the farm produces; level 2 only adds storage.</p>';
      }
      var costLabel = st.lvl === 0 ? 'Build cost' : 'Upgrade to this level';
      el.innerHTML =
        '<div class="imap-fact-lvl">' +
          '<button type="button" class="imap-fact-arrow" data-dir="-1" aria-label="Previous level"' + (st.lvl === 0 ? ' disabled' : '') + '>&lsaquo;</button>' +
          '<span class="imap-fact-lvlname">Level ' + (st.lvl + 1) + ' of ' + f.levels.length + '</span>' +
          '<button type="button" class="imap-fact-arrow" data-dir="1" aria-label="Next level"' + (st.lvl === f.levels.length - 1 ? ' disabled' : '') + '>&rsaquo;</button>' +
        '</div>' +
        '<div class="imap-fact-toggles">' +
          '<button type="button" class="imap-fact-toggle" data-t="bondman" aria-pressed="' + st.bondman + '">Captives &times;2</button>' +
          (lv.i ? '<button type="button" class="imap-fact-toggle" data-t="supplies" aria-pressed="' + st.supplies + '">Supplies</button>' : '') +
        '</div>' +
        '<div class="imap-fact-row"><span>Output</span><b>+' + fmtRes(lv.o * outX, f.out) + ' / hour</b></div>' +
        '<div class="imap-fact-row"><span>Needs</span><b>' + needs + '</b></div>' +
        '<div class="imap-fact-row"><span>Storage</span><b>' + lv.h.toLocaleString('en-US') + '</b></div>' +
        '<div class="imap-fact-row"><span>Fills in</span><b>' + fmtDur(lv.h / (lv.o * outX)) + '</b></div>' +
        '<p class="imap-popup-goods-label">' + costLabel + '</p>' +
        '<div class="imap-popup-goods imap-fact-cost">' + factoryCostChips(FACTORY_COSTS[st.lvl]) + '</div>' +
        note;
      el.querySelectorAll('.imap-fact-arrow').forEach(function (b) {
        b.addEventListener('click', function () {
          var nl = st.lvl + parseInt(b.getAttribute('data-dir'), 10);
          if (nl >= 0 && nl < f.levels.length) { st.lvl = nl; render(); }
        });
      });
      el.querySelectorAll('.imap-fact-toggle').forEach(function (b) {
        b.addEventListener('click', function () {
          var key = b.getAttribute('data-t');
          st[key] = !st[key];
          render();
        });
      });
    }
    render();
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
    /* battle-mark isles carry the game's own res_37 item icon */
    var cls = 'is-lvl-personal' + (p.res === 'mhidden' ? ' is-res-mhidden' : '');
    secondaryMarker(p, cls, res,
      '<h3 class="imap-popup-name">' + res + '</h3>' +
      '<p class="imap-popup-game">Mine or factory isle: claim it with a personal island.</p>' +
      '<div class="imap-popup-badges">' + badge('Mines', 'is-info') + '</div>' +
      '<div class="imap-fact" data-res="' + p.res + '"></div>',
      function (body) { initFactoryStats(body.querySelector('.imap-fact'), p.res); });
  });
  (DATA.layers ? DATA.layers.forts || [] : []).forEach(function (p) {
    secondaryMarker(p, 'is-lvl-forts', p.kind,
      '<h3 class="imap-popup-name">' + p.kind + '</h3>' +
      '<div class="imap-popup-badges">' + badge('Defence', 'is-warn') + '</div>');
  });
  (DATA.layers ? DATA.layers.empire || [] : []).forEach(function (p) {
    secondaryMarker(p, 'is-lvl-empire', 'Imperial fort',
      '<h3 class="imap-popup-name">Imperial fort</h3>' +
      '<div class="imap-popup-badges">' + badge('Empire', 'is-warn') + '</div>' +
      '<p class="imap-popup-dock">An abandoned fort where the Empire stores resources for its offensive. Bold captains can attack, smash, and plunder it: the reward grows over time.</p>');
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

  var LAYERS = ['pharos', 'traders', 'personal', 'regions', 'collections', 'forts', 'empire', 'routes'];
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
         lighthouses, trader villages and imperial forts need no name -
         the icons say it all */
      var named = !(m.classList.contains('is-lvl-pharos') || m.classList.contains('is-lvl-traders') || m.classList.contains('is-lvl-empire'));
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
    /* On the page the chart always covers the box (or sits centred in it):
       a chart edge can never leave the screen border. In FULLSCREEN the
       clamp is looser (Thimon, 2026-11-09): the chart may travel until its
       edge reaches the screen CENTRE, so an edge of the map can be viewed
       in the middle of the screen while zoomed in, while the map can never
       be dragged fully off-screen (the centre always stays on the chart). */
    if (fsActive()) {
      tx = Math.max(vw / 2 - IMG_W_FIT * k, Math.min(vw / 2, tx));
      ty = Math.max(vh / 2 - IMG_H_FIT * k, Math.min(vh / 2, ty));
      return;
    }
    var minX = Math.min(0, vw - IMG_W_FIT * k);
    var minY = Math.min(0, vh - IMG_H_FIT * k);
    tx = Math.max(minX, Math.min(0, tx));
    ty = Math.max(minY, Math.min(0, ty));
    if (IMG_W_FIT * k <= vw) tx = (vw - IMG_W_FIT * k) / 2;
    if (IMG_H_FIT * k <= vh) ty = (vh - IMG_H_FIT * k) / 2;
  }

  var IMG_W_FIT = 1, IMG_H_FIT = 1; /* stage size at k = 1 */
  var fsEnterAt = 0; /* ms timestamp: while freshly entered, every re-measure also re-centres (the fullscreen box can settle several frames late, and the loosened fs pan clamp no longer auto-centres, so a single early measure left the chart stuck in a corner - Thimon caught it) */
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
    if (fsEnterAt && fsActive() && performance.now() - fsEnterAt < 800) {
      tx = (vw - IMG_W_FIT * k) / 2;
      ty = (vh - IMG_H_FIT * k) / 2;
    }
    apply();
  }

  function zoomAt(cx, cy, factor) {
    var nk = Math.max(minK(), Math.min(MAX_K, k * factor));
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
    fsEnterAt = 0; /* a user drag cancels the freshly-entered re-centring window */
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
    /* plain scroll scrolls the page; ctrl+scroll zooms the chart. In
       fullscreen there is no page to scroll, so plain wheel zooms too
       (Thimon, 2026-11-09) */
    if (!e.ctrlKey && !fsActive()) return;
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
    k = defaultK();
    /* centred contain fit (on the page clampPan re-centres anyway; in
       fullscreen the loose clamp would otherwise leave tx = 0 stuck at
       the left bound) */
    tx = (vw - IMG_W_FIT * k) / 2;
    ty = (vh - IMG_H_FIT * k) / 2;
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
    if (on) {
      fsEnterAt = performance.now();
      k = Math.max(FS_MIN_K, Math.min(MAX_K, FS_ENTER_K)); /* the fullscreen default view: one notch out (Thimon) */
      measure(); /* re-fit the stage to the fullscreen box */
      /* start from the centred default view (one notch out); entering
         fullscreen always opens on the same framing */
      tx = (vw - IMG_W_FIT * k) / 2;
      ty = (vh - IMG_H_FIT * k) / 2;
      clampPan();
      apply();
      /* the fullscreen box can settle several frames late (native top-layer
         promotion, fallback overlay): every measure() within 800ms of entry
         re-centres too (see fsEnterAt in measure), so a late resize can
         never leave the chart stuck off-centre */
      requestAnimationFrame(function () { measure(); });
      setTimeout(function () { measure(); }, 350);
    } else {
      fsEnterAt = 0;
      k = Math.max(MIN_K, k); /* the page view never zooms below the fit */
      measure();
      requestAnimationFrame(measure);
    }
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
