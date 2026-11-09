---
layout: article
title: Join the fleet
lead: "Two ways aboard: apply in-game, or step onto our TeamSpeak first and meet the fleet."
ts_action: true
body_class: join-c
plate: /img/paintings/bakhuizen-ships-in-distress-rocky-coast.jpg
plate_alt: Ships in distress off a rocky coast, oil painting by Ludolf Bakhuizen
styles:
  - /assets/css/join-c.css?v=1
scripts:
  - /assets/js/join-c.js?v=1
---
<h2>Try the boarding steps</h2>

<p class="jc-intro">This is a practice copy of the in-game Guild Ranking panel. Find the fleet and send your application right here, exactly like you will in the game. Nothing leaves this page.</p>

<div class="jc-sim" data-ui>
  <div class="jc-sim-head">
    <span class="jc-sim-name">Guild Ranking</span>
    <span class="jc-sim-state" id="jc-state">Find the fleet</span>
  </div>
  <div class="jc-dots" aria-hidden="true">
    <span class="jc-dot is-on"></span>
    <span class="jc-dot"></span>
    <span class="jc-dot"></span>
  </div>

  <div class="jc-stage" id="jc-stage-search">
    <label class="jc-label" for="jc-search">Search guilds</label>
    <div class="jc-searchrow">
      <input id="jc-search" type="text" placeholder="Type a guild name or tag..." autocomplete="off" spellcheck="false">
      <button type="button" class="jc-chip" id="jc-chip" aria-label="Fill in the tag NL.">NL.</button>
    </div>
    <div class="jc-results" id="jc-results" hidden>
      <button type="button" class="jc-result" id="jc-result">
        <span class="jc-result-name">Goud Graaiers</span>
        <span class="jc-result-tag">[NL.]</span>
      </button>
    </div>
    <p class="jc-note">In the game, the Guild Ranking icon sits in the top right corner of your screen. Type NL. here, or tap the tag to fill it in.</p>
  </div>

  <div class="jc-stage" id="jc-stage-guild" hidden>
    <div class="jc-guild-head">
      <span class="jc-guild-name">Goud Graaiers</span>
      <span class="jc-guild-tag">[NL.]</span>
    </div>
    <p class="jc-guild-text">A combined Dutch and English flotilla under one flag: organized and chill squads, neutrality first.</p>
    <div class="jc-actionsrow">
      <button type="button" class="jc-button" id="jc-apply">Send application</button>
      <button type="button" class="jc-back" id="jc-back">Back to search</button>
    </div>
  </div>

  <div class="jc-stage jc-stage-sent" id="jc-stage-sent" hidden>
    <div class="jc-seal" aria-hidden="true">Application sent</div>
    <p class="jc-sent-text">An admiral accepts applications as soon as possible, usually the same evening. While you wait, step onto our TeamSpeak and meet the fleet.</p>
    <div class="jc-actionsrow">
      <a class="jc-button" href="ts3server://donkey.beauty">Connect to TeamSpeak</a>
      <button type="button" class="jc-back" id="jc-restart">Try again</button>
    </div>
  </div>
</div>

<details class="jc-plain">
  <summary>Prefer the plain steps?</summary>
  <ol class="jc-steps">
    <li><strong>Open the Guild Ranking panel.</strong> The icon sits in the top right corner of your screen.</li>
    <li><strong>Select the Guild Ranking tab again.</strong> The panel opens on it.</li>
    <li><strong>Search for NL.</strong> and click on <strong>Goud Graaiers</strong> in the results.</li>
    <li><strong>Send your join application.</strong> One of our admirals will accept you as soon as possible.</li>
  </ol>
  <p>Before you sign, it helps to read <a href="{{ '/' | relative_url }}">how the flotilla sails</a>: organized and chill squads, neutrality, and what the ranks mean. Most of all: be a shipmate. That is the whole test.</p>
</details>

<noscript>
  <p class="jc-nojs">The practice panel needs JavaScript. The plain steps above cover everything it teaches.</p>
</noscript>

<h2 id="teamspeak">Meet us on TeamSpeak first</h2>

<p>TeamSpeak is our primary way of communication. It is not a must and we don't enforce its use, but it is a useful tool that helps us coordinate in events and battles.</p>

<p>If you already have TeamSpeak installed, connect with the domain <code class="jc-domain" id="jc-domain">donkey.beauty</code>, or tap the button below to connect directly.</p>

<div class="jc-actionsrow">
  <a class="jc-button" href="ts3server://donkey.beauty">Connect to TeamSpeak</a>
  <button type="button" class="jc-copy" id="jc-copy">Copy the domain</button>
</div>

<p><a href="{{ '/teamspeak.html' | relative_url }}">How to install TeamSpeak and connect to the guild server</a></p>
