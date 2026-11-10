---
layout: article
title: The Map
lead: "The current game world, drawn by the game's own chart. Click a port for what it docks, trades and demands."
body_class: imap-page
styles:
  - /assets/css/map-page.css?v=21
scripts:
  - /assets/js/map-data.js?v=11
  - /assets/js/map-page.js?v=15
---

<h2>World chart</h2>

<p>Drag to sail around, ctrl + scroll or pinch to zoom, click a port for its details. The search box above the chart jumps straight to a port.</p>

<div class="imap" id="imap">
  <div class="imap-legend" id="imap-legend">
    <button type="button" class="imap-legend-toggle" data-layer="pharos" id="imap-lvl-pharos" aria-pressed="true"><img class="imap-chip-icon" src="/img/map-icons/pharos.png" alt=""> Fast travel</button>
    <button type="button" class="imap-legend-toggle" data-layer="traders" id="imap-lvl-traders" aria-pressed="false"><img class="imap-chip-icon" src="/img/map-icons/trader.png" alt=""> Traders &amp; settlements</button>
    <button type="button" class="imap-legend-toggle" data-layer="personal" id="imap-lvl-personal" aria-pressed="false"><img class="imap-chip-icon" src="/img/map-icons/mine.png" alt=""> Mines</button>
    <button type="button" class="imap-legend-toggle" data-layer="regions" id="imap-lvl-regions" aria-pressed="false"><img class="imap-chip-icon" src="/img/map-icons/poi-region.png" alt=""> Points of interest: regions</button>
    <button type="button" class="imap-legend-toggle" data-layer="collections" id="imap-lvl-collections" aria-pressed="false"><img class="imap-chip-icon" src="/img/map-icons/poi-collection.png" alt=""> Points of interest: collections</button>
    <button type="button" class="imap-legend-toggle" data-layer="empire" id="imap-lvl-empire" aria-pressed="false"><img class="imap-chip-icon" src="/img/map-icons/fort-empire.png" alt=""> Imperial forts</button>
    <button type="button" class="imap-legend-toggle" data-layer="forts" id="imap-lvl-forts" aria-pressed="false"><img class="imap-chip-icon" src="/img/map-icons/forts.png" alt=""> Port battle &amp; guild forts</button>
    <button type="button" class="imap-legend-toggle" data-layer="routes" id="imap-lvl-routes" aria-pressed="false"><img class="imap-chip-icon" src="/img/map-icons/routes.png" alt=""> Trade routes</button>
    <span class="imap-legend-keys">
      <span class="imap-legend-item"><span class="imap-legend-dot imap-dot-port"></span> port</span>
      <span class="imap-legend-item"><span class="imap-legend-dot imap-dot-gather"></span> fleet gathering point</span>
      <span class="imap-legend-item"><img class="imap-legend-icon" src="/img/map-icons/bone.png" alt=""> PvP circle, drawn as the game's line of bones</span>
    </span>
  </div>
  <div class="imap-toolbar">
    <div class="imap-search">
      <input id="imap-search" type="text" placeholder="Find a port..." autocomplete="off" spellcheck="false" aria-label="Find a port">
      <div class="imap-results" id="imap-results" hidden></div>
    </div>
    <div class="imap-zoom">
      <button type="button" id="imap-zoom-out" aria-label="Zoom out">&minus;</button>
      <button type="button" id="imap-zoom-reset" aria-label="Reset view">Reset</button>
      <button type="button" id="imap-zoom-in" aria-label="Zoom in">+</button>
    </div>
  </div>
  <div class="imap-viewport" id="imap-viewport">
    <div class="imap-stage" id="imap-stage">
      <img class="imap-img" src="/img/map-web.jpg" alt="The World of Sea Battle world chart" draggable="false">
      <img class="imap-img-hi" id="imap-img-hi" src="/img/map-hires.jpg" alt="" draggable="false">
      <svg class="imap-routes" id="imap-routes" viewBox="0 0 2400 1987" preserveAspectRatio="none" aria-hidden="true"></svg>
      <div class="imap-pvp-ring" id="imap-pvp-ring" aria-hidden="true"></div>
      <div class="imap-markers" id="imap-markers"></div>
    </div>
    <div class="imap-fs-legend" id="imap-fs-legend" hidden></div>
    <button type="button" class="imap-fs-btn" id="imap-fs-expand" aria-label="Expand the map to full screen">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M16 3h3a2 2 0 0 1 2 2v3"/><path d="M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
    </button>
    <button type="button" class="imap-fs-btn imap-fs-close" id="imap-fs-close" aria-label="Close full screen" hidden>&times;</button>
    <div class="imap-popup" id="imap-popup" hidden>
      <button type="button" class="imap-popup-close" id="imap-popup-close" aria-label="Close">&times;</button>
      <div class="imap-popup-body" id="imap-popup-body"></div>
    </div>
  </div>
</div>

<p class="imap-note">Full route planning lives in the <a href="{{ '/guides.html' | relative_url }}">trade tool</a>.</p>

<noscript>
  <p class="imap-nojs">The interactive chart needs JavaScript. The <a href="/img/map-full.jpg">full-size chart</a> works without it.</p>
</noscript>
