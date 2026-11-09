---
layout: article
title: The Map
lead: "The current game world, drawn by the game's own chart. Click a port for what it docks, trades and demands."
body_class: imap-page
styles:
  - /assets/css/map-page.css?v=2
scripts:
  - /assets/js/map-data.js?v=2
  - /assets/js/map-page.js?v=2
---

<h2>World chart</h2>

<p>Drag to sail around, scroll or pinch to zoom, click a port for its details. The search box above the chart jumps straight to a port. Markers come from the game files of the current build, so the chart stays honest after every game update.</p>

<div class="imap" id="imap">
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
      <svg class="imap-overlay" viewBox="0 0 2400 1989" preserveAspectRatio="none" aria-hidden="true">
        <circle class="imap-pvp" id="imap-pvp-circle" cx="0" cy="0" r="0"/>
      </svg>
      <div class="imap-markers" id="imap-markers"></div>
    </div>
    <div class="imap-popup" id="imap-popup" hidden>
      <button type="button" class="imap-popup-close" id="imap-popup-close" aria-label="Close">&times;</button>
      <div class="imap-popup-body" id="imap-popup-body"></div>
    </div>
  </div>
  <div class="imap-legend">
    <span class="imap-legend-item"><span class="imap-legend-dot imap-dot-port"></span> port</span>
    <span class="imap-legend-item"><span class="imap-legend-dot imap-dot-gather"></span> fleet gathering point</span>
    <span class="imap-legend-item"><span class="imap-legend-ring"></span> PvP circle</span>
  </div>
</div>

<p class="imap-note">The chart itself is the game's hand-drawn parchment, so a marker can sit a hair off the exact shoreline: that imprecision is the game's, not the data's. Ports without a market list no goods. Full route planning lives in the <a href="{{ '/guides.html' | relative_url }}">trade tool</a>.</p>

<noscript>
  <p class="imap-nojs">The interactive chart needs JavaScript. The <a href="/img/map-full.jpg">full-size chart</a> works without it.</p>
</noscript>
