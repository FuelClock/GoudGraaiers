---
layout: article
title: Join the fleet
lead: "Two ways aboard: apply in-game, or step onto our TeamSpeak first and meet the fleet."
ts_action: true
body_class: join-c
plate: /img/paintings/bakhuizen-ships-in-distress-rocky-coast.jpg
plate_alt: Ships in distress off a rocky coast, oil painting by Ludolf Bakhuizen
styles:
  - /assets/css/join-c.css?v=2
scripts:
  - /assets/js/join-c.js?v=2
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
    <span class="jc-dot"></span>
  </div>

  <div class="jc-stage" id="jc-stage-search">
    <label class="jc-label" for="jc-search">Search</label>
    <div class="jc-searchrow">
      <input id="jc-search" type="text" placeholder="Search..." autocomplete="off" spellcheck="false">
      <button type="button" class="jc-chip" id="jc-chip" aria-label="Fill in the tag NL.">NL.</button>
    </div>
    <div class="jc-results" id="jc-results" hidden>
      <button type="button" class="jc-result" id="jc-result">
        <span class="jc-result-name">Goud Graaiers</span>
        <span class="jc-result-tag">[NL.]</span>
      </button>
    </div>
    <p class="jc-note">In the game, the Guild Ranking icon sits in the top right corner of your screen. The real search box holds up to 12 characters and filters the list by tag first.</p>
  </div>

  <div class="jc-stage" id="jc-stage-guild" hidden>
    <div class="jc-guild-head">
      <span class="jc-guild-name">Goud Graaiers</span>
      <span class="jc-guild-tag">[NL.]</span>
    </div>
    <p class="jc-guild-text">A combined Dutch and English flotilla under one flag: organized and chill squads, neutrality first.</p>
    <div class="jc-actionsrow">
      <button type="button" class="jc-button" id="jc-apply">Submit an application</button>
      <button type="button" class="jc-back" id="jc-back">Back to search</button>
    </div>
  </div>

  <div class="jc-stage" id="jc-stage-message" hidden>
    <label class="jc-label" for="jc-message">Enter a message for the guild&rsquo;s leaders</label>
    <textarea id="jc-message" class="jc-textarea" rows="3" maxlength="250" placeholder="Hi, I would like to join Goud Graaiers"></textarea>
    <p class="jc-note">The game asks every applicant for a short message, up to 250 characters. It is optional here.</p>
    <div class="jc-actionsrow">
      <button type="button" class="jc-button" id="jc-send">Send application</button>
      <button type="button" class="jc-back" id="jc-back2">Back</button>
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
    <li><strong>Open the Guild Ranking panel.</strong> The icon sits in the top right corner of your screen. It opens the ranking only while you are not in a guild yet: once you are a member, the same spot opens your own guild window.</li>
    <li><strong>Stay on the Guild Ranking tab.</strong> The window opens on it, above a list you can sort with the tabs By rating, By ports and New (a Flotilla tab appears there too while you are not in one yet).</li>
    <li><strong>Type NL. in the search box</strong> (it holds up to 12 characters) <strong>and click on Goud Graaiers</strong> in the list. The game filters by tag first. If nothing matches, a search button appears that asks the server; it needs at least 3 characters.</li>
    <li><strong>Submit an application.</strong> A box opens for a message to the guild&rsquo;s leaders, up to 250 characters. Send it and the button reads Application sent. One of our admirals will accept you as soon as possible.</li>
  </ol>
  <p>Good news on ranks: in game our guild keeps flotilla status, so you can apply at any captain rank; only faction-pledged guilds ask for rank 10. Before you sign, it helps to read <a href="{{ '/' | relative_url }}#doctrine">how the flotilla sails</a>: organized and chill squads, neutrality, and what the ranks mean. Most of all: be a shipmate. That is the whole test.</p>
</details>

<details class="doctrine-vision" id="vision">
  <summary>Gerrit&rsquo;s vision</summary>
  <div class="doctrine-vision-body">
    <p><strong>Gerrit&rsquo;s vision for our guild:</strong> to foster a community where diverse playstyles and languages converge for seamless and enjoyable cooperation.</p>
    <p><strong>Faction alignment:</strong> we operate as a flotilla in game and intend to keep it that way, unless the game introduces a Dutch (WIC) faction, or the guild has built the cohesion and strength for port battles and a majority of our members wishes for a pledge.</p>
    <p>What that means for you:</p>
    <ul>
      <li><strong>No faction affiliation:</strong> we are not tied to any specific faction, so we do not take part in port battles.</li>
      <li><strong>Freedom to engage:</strong> no reputation requirements. Members engage other factions as they see fit; we only keep friendly relations with the other Dutch guilds.</li>
      <li><strong>Neutrality for safety:</strong> allied standing with every faction significantly reduces the hostile encounters you meet.</li>
    </ul>
    <p>If that vision fits you, the practice panel above is exactly how you apply.</p>
  </div>
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
