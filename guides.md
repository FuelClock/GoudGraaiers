---
layout: article
title: Guides & Trade Tool
lead: "The flotilla's shared knowledge: plan your optimal trade loop, sail the guild route, and find the tools we use."
scripts:
  - /assets/js/trade-data.js?v=10
  - /assets/js/trade-planner.js?v=4
plate: /img/paintings/porcellis-ships-in-distress-stormy-sea.jpg
plate_alt: Ships in distress on a stormy sea, oil painting by Jan Porcellis
---
## Plan your trade loop

The planner computes the single best counterclockwise trade loop for your ship: it uses the per-port market prices from the flotilla trading spreadsheet, keeps you out of the PvP circle and pirate ports unless you ask for them, and fills your hold with the goods that earn the most gold per ton of hold space. When you reach the first port that pays a good's top price, you sell the whole stock there and refill with the local cheap goods. A few ports have no market at all: St Jean, Freedom Bay, Gelbion, Surako and Naabad Stronghold never appear as trade stops. St Jean is still where the fleet gathers to start the loop; the other four you simply never visit.

<div class="trade-controls">
  <label class="trade-control">
    <span>Your ship's rate</span>
    <select id="rate-select">
      <option value="1">1st rate (Victory class)</option>
      <option value="2">2nd rate</option>
      <option value="3" selected>3rd rate</option>
      <option value="4">4th rate</option>
      <option value="5">5th rate</option>
      <option value="6">6th rate</option>
      <option value="7">7th rate (small, docks anywhere)</option>
    </select>
  </label>
  <label class="trade-control trade-control--check">
    <input type="checkbox" id="pvp-toggle">
    <span>I will sail into the PvP circle and pirate ports</span>
  </label>
</div>

<p class="trade-note" id="trade-summary"></p>
<p class="trade-note" id="trade-skipped"></p>

<figure class="map-route">
  <div class="map-route-frame">
    <img src="{{ '/img/map-web.jpg' | relative_url }}" alt="The world chart with your optimal trade loop drawn on it" width="2400" height="1987" loading="lazy" decoding="async">
    <svg viewBox="0 0 2400 1987" xmlns="http://www.w3.org/2000/svg" aria-label="Your optimal trade loop drawn on the world chart.">
      <defs>
        <marker id="plan-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#d4af37"/>
        </marker>
      </defs>
      <g fill="none" stroke="#d4af37" stroke-width="6" stroke-dasharray="20 14" opacity="0.95">
        <path id="plan-route" d="" marker-end="url(#plan-arrow)"/>
      </g>
      <g id="plan-stops" font-family="EB Garamond, Georgia, serif"></g>
    </svg>
  </div>
  <figcaption id="plan-caption">Your loop is drawn in gold; green markers are the sell stops: dock there and use the game's Sell by best profit margins button, so selling is never written out per port. Buy stops carry their cargos under the port name, the three best on the map and the full ranked list, best profit first, below. Amounts assume a 100 ton hold and scale with your real cargo capacity.</figcaption>
</figure>

<h3 class="route-heading">Your trading stops</h3>
<ol id="route-list" class="route-list"></ol>

<details class="planner-notes">
<summary>How the route is chosen</summary>
<p>Trading in World of Sea Battle works like this: you fill your hold with whatever is cheap at your current port, sail on, and sell the whole stock the moment you reach the first port that pays a good's maximum price, freeing the hold for the next region's cheap goods. The planner applies exactly that rule at every port on your loop: each stop lists every cargo worth loading there, ranked by money earned per hold of cargo space. Hold space is deliberately not part of the planning, so no port gets skipped to make room for a bigger haul elsewhere. Everything bought in one region sells at a single port in the next region: the SELL stops mark exactly where to dump your hold.</p>
<p>Docking is modeled per port from tiers verified in game: a port in a shallow zone of tier N can only be docked by ships of rate N and smaller, while ports in open water or on the endless sea take any ship. A rate 2 port like Everston, for example, turns away only 1st rates, while a rate 6 port like Fiji takes 6th rates and smaller only. So a rate 1 trader cannot dock at Everston (tier 2) but can dock at Gray Island (open water), exactly as in the game.</p>
<p>Amounts are shown per full 100 ton hold of each good and scale linearly with your real capacity: a ship with a 300 ton hold can triple every number. The buy list at each stop is ranked by money per cargo space, best first, so work down it until your hold is full. No gold figures are shown because market stock is partly random anyway: the ranking comes from the price spread, your actual earnings come from the market.</p>
</details>

<details class="planner-notes">
<summary>Stock: every market is a little different each cycle</summary>
<p>Port markets restock on a server cycle (roughly every 24 to 48 hours, depending on your server), and which goods a port stocks after a cycle is partly random: one visit a port may only have Wine, the next the whole range. Guild production and how much players buy shift the amounts further, so treat the plan as the route and the market as the weather. When a planned good is sold out at a port, skip that purchase and carry on: the loop stays valid, one leg simply earns a little less. Provisions (Beer, Nuts, Dates) are almost always in stock but pay little per ton, so they are hold filler, not the main cargo.</p>
</details>

## The Trade Fever loop, on the chart

From our Trade Fever voyages: gather at St Jean and sail the loop counterclockwise. Buy in the north, Arabia and the south; every load sells one leg further on. Twenty to thirty seconds in port is enough: warehouse, market, buy, out at the lighthouse.

<figure class="map-route">
  <div class="map-route-frame">
    <img src="{{ '/img/map-web.jpg' | relative_url }}" alt="The world chart with the counterclockwise trade loop drawn on it: St Jean, Gray Island, Assab, Al-Khalif, San Martinas and Los Catuano" width="2400" height="1987" loading="lazy" decoding="async">
    <svg viewBox="0 0 2400 1987" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The counterclockwise trade loop drawn on the world chart: St Jean, Gray Island, Assab, Al-Khalif, San Martinas and Los Catuano, with what to buy and sell at each port.">
      <defs>
        <marker id="route-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#d4af37"/>
        </marker>
      </defs>
      <g fill="none" stroke="#d4af37" stroke-width="6" stroke-dasharray="20 14" opacity="0.95">
        <path d="M 1777 1299 Q 1830 900 1733 523" marker-end="url(#route-arrow)"/>
        <path d="M 1733 523 Q 800 480 125 1548" marker-end="url(#route-arrow)"/>
        <path d="M 125 1548 Q 100 1700 145 1797" marker-end="url(#route-arrow)"/>
        <path d="M 145 1797 Q 800 1890 1408 1766" marker-end="url(#route-arrow)"/>
        <path d="M 1408 1766 Q 1800 1790 2042 1493" marker-end="url(#route-arrow)"/>
        <path d="M 2042 1493 Q 1990 1380 1777 1299" marker-end="url(#route-arrow)"/>
      </g>
      <g font-family="EB Garamond, Georgia, serif">
        <circle cx="1733" cy="523" r="16" fill="#d4af37" stroke="#14212c" stroke-width="5"/>
        <text x="1733" y="448" text-anchor="middle" class="port-name" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">Gray Island</text>
        <text x="1733" y="490" text-anchor="middle" class="port-goods" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">sell south goods, buy grog + wine</text>
        <circle cx="1777" cy="1299" r="22" fill="none" stroke="#d4af37" stroke-width="5"/>
        <circle cx="1777" cy="1299" r="12" fill="#d4af37" stroke="#14212c" stroke-width="4"/>
        <text x="1812" y="1283" text-anchor="start" class="port-name" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">St Jean</text>
        <text x="1812" y="1325" text-anchor="start" class="port-goods" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">gather here, start the loop</text>
        <circle cx="125" cy="1548" r="14" fill="#e8e2d2" stroke="#14212c" stroke-width="4"/>
        <text x="168" y="1535" text-anchor="start" class="port-name" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">Assab</text>
        <text x="168" y="1577" text-anchor="start" class="port-goods" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">sell beer, wine, grog</text>
        <circle cx="145" cy="1797" r="14" fill="#e8e2d2" stroke="#14212c" stroke-width="4"/>
        <text x="185" y="1782" text-anchor="start" class="port-name" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">Al-Khalif</text>
        <text x="185" y="1824" text-anchor="start" class="port-goods" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Arabia: buy silk + saffron</text>
        <circle cx="1408" cy="1766" r="14" fill="#e8e2d2" stroke="#14212c" stroke-width="4"/>
        <text x="1408" y="1690" text-anchor="middle" class="port-name" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">San Martinas</text>
        <text x="1408" y="1732" text-anchor="middle" class="port-goods" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">sell silk + saffron</text>
        <circle cx="2042" cy="1493" r="14" fill="#e8e2d2" stroke="#14212c" stroke-width="4"/>
        <text x="2000" y="1420" text-anchor="middle" class="port-name" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">Los Catuano</text>
        <text x="2000" y="1462" text-anchor="middle" class="port-goods" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">buy coffee + tobacco</text>
      </g>
    </svg>
  </div>
  <figcaption>The loop sails counterclockwise from St Jean: buy in the north, Arabia and the south, and sell one leg further on. Ports sit at their real positions on the current chart.</figcaption>
</figure>

## Useful instruments

**WosbCraft**: calculate crafting costs easily: [wosbcraft.com](https://www.wosbcraft.com/)

**WOSB trading spreadsheet**: profitable trade routes, which goods to buy where:

- [Visual map of trade routes](https://docs.google.com/spreadsheets/d/167fXMSUOoureMP7blZZXRSqQPoXIJK3MenyGpGulP_E/edit?gid=1827480102#gid=1827480102)
- [Where to buy what](https://docs.google.com/spreadsheets/d/167fXMSUOoureMP7blZZXRSqQPoXIJK3MenyGpGulP_E/edit?gid=0#gid=0)
