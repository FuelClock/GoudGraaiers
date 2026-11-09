---
layout: article
title: Guides & Trade Tool
lead: "The flotilla's shared knowledge: sail the guild's Trade Fever route, plan your own optimal trade loop, and find the tools we use."
scripts:
  - /assets/js/trade-data.js?v=10
  - /assets/js/trade-planner.js?v=7
plate: /img/paintings/porcellis-ships-in-distress-stormy-sea.jpg
plate_alt: Ships in distress on a stormy sea, oil painting by Jan Porcellis
---
## The Trade Fever loop

From our Trade Fever voyages: gather at St Jean and sail the loop counterclockwise. Buy in the north, Arabia and the south, the sell ports are marked in green. There in port you move all the trade goods into the port storage, and in the trading tab you press the button "At the best price". Twenty to thirty seconds in port should be enough: warehouse, market, buy and quickly exit at the lighthouse. This is the route we sail at the events; sailing something else tonight? Open the planner below and it plans your own loop.

<figure class="map-route">
  <div class="map-route-frame">
    <img src="{{ '/img/map-web.jpg' | relative_url }}" alt="The world chart with the Trade Fever loop drawn on it: St. Jean, Gray Island, Everston, Oneg, Nordberg, Nisogora, Cursed City, West bastion, Sharhat, Assab, Al-Khalif, El Tigre, Devios and back to St Jean" width="2400" height="1987" loading="lazy" decoding="async">
    <svg viewBox="0 0 2400 1987" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="The Trade Fever loop drawn on the world chart: St. Jean, Gray Island, Everston, Oneg, Nordberg, Nisogora, Cursed City, West bastion, Sharhat, Assab, Al-Khalif, El Tigre, Devios and back to St Jean, with the three best cargos at every buy stop.">
      <defs>
        <marker id="route-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#d4af37"/>
        </marker>
      </defs>
      <g fill="none" stroke="#d4af37" stroke-width="6" stroke-dasharray="20 14" opacity="0.95">
        <path d="M 1777 1301 L 1734 559" marker-end="url(#route-arrow)"/>
        <path d="M 1732 523 Q 1463 315 1159 295" marker-end="url(#route-arrow)"/>
        <path d="M 1123 292 L 470 168" marker-end="url(#route-arrow)"/>
        <path d="M 434 162 L 303 357" marker-end="url(#route-arrow)"/>
        <path d="M 282 386 L 228 523" marker-end="url(#route-arrow)"/>
        <path d="M 215 556 L 139 778" marker-end="url(#route-arrow)"/>
        <path d="M 127 812 L 258 1022" marker-end="url(#route-arrow)"/>
        <path d="M 277 1052 L 366 1392" marker-end="url(#route-arrow)"/>
        <path d="M 375 1426 L 158 1532" marker-end="url(#route-arrow)"/>
        <path d="M 125 1548 L 142 1761" marker-end="url(#route-arrow)"/>
        <path d="M 145 1797 L 672 1765" marker-end="url(#route-arrow)"/>
        <path d="M 708 1763 L 694 1545" marker-end="url(#route-arrow)"/>
        <path d="M 692 1509 Q 1051 1298 1387 1738" marker-end="url(#route-arrow)"/>
        <path d="M 1409 1766 L 1754 1329" marker-end="url(#route-arrow)"/>
      </g>
      <g font-family="EB Garamond, Georgia, serif">
        <circle cx="1777" cy="1301" r="18" fill="#d4af37" stroke="#14212c" stroke-width="5"/>
        <text x="1777" y="1314" text-anchor="middle" font-size="34" font-weight="500" fill="#14212c">1</text>
        <text x="1777" y="1359" text-anchor="middle" class="plan-name" font-size="46" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">St. Jean</text>
        <text x="1777" y="1397" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">gather here, start the loop</text>
        <circle cx="1732" cy="523" r="18" fill="#3f8f5f" stroke="#14212c" stroke-width="5"/>
        <text x="1732" y="536" text-anchor="middle" font-size="34" font-weight="500" fill="#14212c">2</text>
        <text x="1732" y="581" text-anchor="middle" class="plan-name" font-size="46" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">Gray Island</text>
        <text x="1732" y="619" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Wine</text>
        <text x="1732" y="653" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Beer</text>
        <text x="1732" y="687" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Grog</text>
        <circle cx="1123" cy="292" r="18" fill="#d4af37" stroke="#14212c" stroke-width="5"/>
        <text x="1123" y="305" text-anchor="middle" font-size="34" font-weight="500" fill="#14212c">3</text>
        <text x="1123" y="350" text-anchor="middle" class="plan-name" font-size="46" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">Everston</text>
        <text x="1123" y="388" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Wine</text>
        <text x="1123" y="422" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Rugs</text>
        <text x="1123" y="456" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Beer</text>
        <circle cx="434" cy="162" r="18" fill="#d4af37" stroke="#14212c" stroke-width="5"/>
        <text x="434" y="175" text-anchor="middle" font-size="34" font-weight="500" fill="#14212c">4</text>
        <text x="434" y="220" text-anchor="middle" class="plan-name" font-size="46" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">Oneg</text>
        <text x="434" y="258" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Wine</text>
        <text x="434" y="292" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Rugs</text>
        <text x="434" y="326" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Cinnamon</text>
        <circle cx="282" cy="386" r="18" fill="#d4af37" stroke="#14212c" stroke-width="5"/>
        <text x="282" y="399" text-anchor="middle" font-size="34" font-weight="500" fill="#14212c">5</text>
        <text x="308" y="444" text-anchor="start" class="plan-name" font-size="46" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">Nordberg</text>
        <text x="308" y="482" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Rugs</text>
        <text x="308" y="516" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Cinnamon</text>
        <text x="308" y="550" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Wine</text>
        <circle cx="215" cy="556" r="18" fill="#d4af37" stroke="#14212c" stroke-width="5"/>
        <text x="215" y="569" text-anchor="middle" font-size="34" font-weight="500" fill="#14212c">6</text>
        <text x="241" y="614" text-anchor="start" class="plan-name" font-size="46" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">Nisogora</text>
        <text x="241" y="652" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Rugs</text>
        <text x="241" y="686" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Cinnamon</text>
        <text x="241" y="720" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Wine</text>
        <circle cx="127" cy="812" r="18" fill="#d4af37" stroke="#14212c" stroke-width="5"/>
        <text x="127" y="825" text-anchor="middle" font-size="34" font-weight="500" fill="#14212c">7</text>
        <text x="153" y="870" text-anchor="start" class="plan-name" font-size="46" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">Cursed City</text>
        <text x="153" y="908" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Rugs</text>
        <text x="153" y="942" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Cinnamon</text>
        <text x="153" y="976" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Paprika</text>
        <circle cx="277" cy="1052" r="18" fill="#d4af37" stroke="#14212c" stroke-width="5"/>
        <text x="277" y="1065" text-anchor="middle" font-size="34" font-weight="500" fill="#14212c">8</text>
        <text x="303" y="1110" text-anchor="start" class="plan-name" font-size="46" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">West bastion</text>
        <text x="303" y="1148" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Rugs</text>
        <text x="303" y="1182" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Cinnamon</text>
        <text x="303" y="1216" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Paprika</text>
        <circle cx="375" cy="1426" r="18" fill="#d4af37" stroke="#14212c" stroke-width="5"/>
        <text x="375" y="1439" text-anchor="middle" font-size="34" font-weight="500" fill="#14212c">9</text>
        <text x="375" y="1484" text-anchor="middle" class="plan-name" font-size="46" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">Sharhat</text>
        <text x="375" y="1522" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Rugs</text>
        <text x="375" y="1556" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Cinnamon</text>
        <text x="375" y="1590" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Pepper</text>
        <circle cx="125" cy="1548" r="18" fill="#3f8f5f" stroke="#14212c" stroke-width="5"/>
        <text x="125" y="1561" text-anchor="middle" font-size="34" font-weight="500" fill="#14212c">10</text>
        <text x="151" y="1606" text-anchor="start" class="plan-name" font-size="46" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">Assab</text>
        <text x="151" y="1644" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Rugs</text>
        <text x="151" y="1678" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Cinnamon</text>
        <text x="151" y="1712" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Tobacco</text>
        <circle cx="145" cy="1797" r="18" fill="#3f8f5f" stroke="#14212c" stroke-width="5"/>
        <text x="145" y="1810" text-anchor="middle" font-size="34" font-weight="500" fill="#14212c">11</text>
        <text x="171" y="1855" text-anchor="start" class="plan-name" font-size="46" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">Al-Khalif</text>
        <text x="171" y="1893" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Rugs</text>
        <text x="171" y="1927" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Cinnamon</text>
        <text x="171" y="1961" text-anchor="start" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Paprika</text>
        <circle cx="708" cy="1763" r="18" fill="#d4af37" stroke="#14212c" stroke-width="5"/>
        <text x="708" y="1776" text-anchor="middle" font-size="34" font-weight="500" fill="#14212c">12</text>
        <text x="708" y="1821" text-anchor="middle" class="plan-name" font-size="46" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">El Tigre</text>
        <text x="708" y="1859" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Rugs</text>
        <text x="708" y="1893" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Oil</text>
        <text x="708" y="1927" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Pepper</text>
        <circle cx="692" cy="1509" r="18" fill="#d4af37" stroke="#14212c" stroke-width="5"/>
        <text x="692" y="1522" text-anchor="middle" font-size="34" font-weight="500" fill="#14212c">13</text>
        <text x="692" y="1567" text-anchor="middle" class="plan-name" font-size="46" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">Devios</text>
        <text x="692" y="1605" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Rugs</text>
        <text x="692" y="1639" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Oil</text>
        <text x="692" y="1673" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Pepper</text>
        <circle cx="1409" cy="1766" r="18" fill="#3f8f5f" stroke="#14212c" stroke-width="5"/>
        <text x="1409" y="1779" text-anchor="middle" font-size="34" font-weight="500" fill="#14212c">14</text>
        <text x="1409" y="1824" text-anchor="middle" class="plan-name" font-size="46" font-weight="500" fill="#e8e2d2" stroke="#14212c" stroke-width="10" paint-order="stroke" stroke-linejoin="round">San Martinas</text>
        <text x="1409" y="1862" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Oil</text>
        <text x="1409" y="1896" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Pepper</text>
        <text x="1409" y="1930" text-anchor="middle" class="plan-goods" font-size="28" font-weight="500" fill="#e5cf82" stroke="#14212c" stroke-width="8" paint-order="stroke" stroke-linejoin="round">Sugar</text>
      </g>
    </svg>
  </div>
  <figcaption>The loop sails counterclockwise from St Jean, the gathering point, and mirrors the rate 3 planner route with Masadora and Bord Radel left out: after West Bastion it runs Sharhat, Assab, Al-Khalif, El Tigre and Devios in that order. Green markers are the sell stops: dock there and use the game's Sell by best profit margins button. Every other stop lists its three best cargos, best first. Ports sit at their real positions on the current chart.</figcaption>
</figure>

<details class="trade-tool">
<summary>Plan your own trade loop</summary>
<p>The planner computes the single best counterclockwise trade loop for your ship: it uses the per-port market prices from the flotilla trading spreadsheet, keeps you out of the PvP circle and pirate ports unless you ask for them, and fills your hold with the goods that earn the most gold per ton of hold space. When you reach the first port that pays a good's top price, you sell the whole stock there and refill with the local cheap goods. A few ports have no market at all: St Jean, Freedom Bay, Gelbion, Surako and Naabad Stronghold never appear as trade stops. St Jean is still where the fleet gathers to start the loop; the other four you simply never visit.</p>

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
  <figcaption id="plan-caption">Your loop is drawn in gold; green markers are the sell stops: dock there and use the game's Sell by best profit margins button, so selling is never written out per port. Buy stops carry their three best cargos under the port name; hover (or tap) a port dot for the full ranked goods window, best profit first.</figcaption>
</figure>

<details class="planner-notes">
<summary>How the route is chosen</summary>
<p>Trading in World of Sea Battle works like this: you fill your hold with whatever is cheap at your current port, sail on, and sell the whole stock the moment you reach the first port that pays a good's maximum price, freeing the hold for the next region's cheap goods. The planner applies exactly that rule at every port on your loop: each stop lists every cargo worth loading there, ranked by money earned per hold of cargo space. Hold space is deliberately not part of the planning, so no port gets skipped to make room for a bigger haul elsewhere. Everything bought in one region sells at a single port in the next region: the SELL stops mark exactly where to dump your hold.</p>
<p>Docking is modeled per port from tiers verified in game: a port in a shallow zone of tier N can only be docked by ships of rate N and smaller, while ports in open water or on the endless sea take any ship. A rate 2 port like Everston, for example, turns away only 1st rates, while a rate 6 port like Fiji takes 6th rates and smaller only. So a rate 1 trader cannot dock at Everston (tier 2) but can dock at Gray Island (open water), exactly as in the game.</p>
<p>The buy list at each stop is ranked by money per cargo space, best first, so work down it until your hold is full. No amounts or gold figures are shown because market stock is partly random anyway: the ranking comes from the price spread, your actual earnings come from the market.</p>
</details>

<details class="planner-notes">
<summary>Stock: every market is a little different each cycle</summary>
<p>Port markets restock on a server cycle (roughly every 24 to 48 hours, depending on your server), and which goods a port stocks after a cycle is partly random: one visit a port may only have Wine, the next the whole range. Guild production and how much players buy shift the amounts further, so treat the plan as the route and the market as the weather. When a planned good is sold out at a port, skip that purchase and carry on: the loop stays valid, one leg simply earns a little less. Provisions (Beer, Nuts, Dates) are almost always in stock but pay little per ton, so they are hold filler, not the main cargo.</p>
</details>
</details>

## Useful instruments

**WosbCraft**: calculate crafting costs easily: [wosbcraft.com](https://www.wosbcraft.com/)

**WOSB trading spreadsheet**: profitable trade routes, which goods to buy where:

- [Visual map of trade routes](https://docs.google.com/spreadsheets/d/167fXMSUOoureMP7blZZXRSqQPoXIJK3MenyGpGulP_E/edit?gid=1827480102#gid=1827480102)
- [Where to buy what](https://docs.google.com/spreadsheets/d/167fXMSUOoureMP7blZZXRSqQPoXIJK3MenyGpGulP_E/edit?gid=0#gid=0)
