(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[[`2 + 3`,`10`],[`3 + 4`,`21`],[`4 + 5`,`36`],[`5 + 6`,`?`]];function t(e,t){return e.calculatorView===`success`?i():e.calculatorView===`history`?r(e,t):n(e)}function n(e){return`<section class="calculator-app" data-calculator-view="calculator">
    <header class="calculator-toolbar">
      <button class="calculator-nav" data-action="home" aria-label="Back to home">‹</button>
      <div><p class="eyebrow">Utility</p><h1>Calculator</h1></div>
      <span class="calculator-toolbar-end"><button class="history-button" data-action="calculator-history">History</button>${e.completedApps.includes(3)?`<span class="calculator-resolved">Resolved</span>`:``}</span>
    </header>
    <div class="calculator-display" aria-live="polite"><span class="display-label">Current input</span><strong>${e.calculatorDisplay}</strong></div>
    <div class="calculator-keypad" aria-label="Calculator keypad">
      <button class="calc-key utility-key" data-calc="clear">C</button><button class="calc-key utility-key" data-calc="toggle-sign">+/-</button><button class="calc-key utility-key" data-calc="percent">%</button><button class="calc-key operator-key" data-calc="÷">÷</button>
      <button class="calc-key" data-calc="7">7</button><button class="calc-key" data-calc="8">8</button><button class="calc-key" data-calc="9">9</button><button class="calc-key operator-key" data-calc="×">×</button>
      <button class="calc-key" data-calc="4">4</button><button class="calc-key" data-calc="5">5</button><button class="calc-key" data-calc="6">6</button><button class="calc-key operator-key" data-calc="-">−</button>
      <button class="calc-key" data-calc="1">1</button><button class="calc-key" data-calc="2">2</button><button class="calc-key" data-calc="3">3</button><button class="calc-key operator-key" data-calc="+">+</button>
      <button class="calc-key zero-key" data-calc="0">0</button><button class="calc-key" data-calc=".">.</button><button class="calc-key equals-key" data-calc="=">=</button>
    </div>
    <p class="calculator-footer">Offline utility · no recent activity</p>
  </section>`}function r(t,n){return`<section class="calculator-app calculator-history" data-calculator-view="history">
    <header class="calculator-toolbar history-toolbar">
      <button class="calculator-nav" data-action="calculator-main" aria-label="Back to calculator">‹</button>
      <div><p class="eyebrow">Calculator</p><h1>History</h1></div>
      <span class="history-count">04</span>
    </header>
    <div class="calculation-list">
      ${e.map(([e,t],n)=>`<div class="calculation-row"><span class="calculation-index">0${n+1}</span><span>${e}</span><strong>${t}</strong></div>`).join(``)}
    </div>
    <div class="calculator-puzzle-panel">
      <p class="calculator-prompt">Enter the missing result</p>
      <form data-action="solve-calculator" class="calculator-answer-form">
        <label for="calculator-answer">Missing result</label>
        <div class="answer-row"><input id="calculator-answer" name="answer" type="text" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="_ _" aria-label="Enter the missing result" /><button class="submit-button" type="submit">Submit</button></div>
        ${n?`<p class="notice puzzle-notice" role="alert">${n}</p>`:``}
      </form>
      <button class="hint-button" data-action="calculator-hint">${t.calculatorHintLevel>0?`Hint shown`:`Show hint`}</button>
      ${t.calculatorHintLevel>0?`<p class="calculator-hint">${t.calculatorHintLevel>1?`Look at how the first number interacts with the two numbers.`:`The plus sign may not mean addition.`}</p>`:``}
    </div>
  </section>`}function i(){return`<section class="calculator-app calculator-success" data-calculator-view="success">
    <span class="success-mark">✓</span>
    <p class="eyebrow">Calculator · recovered</p>
    <h1>CALCULATION RECOVERED</h1>
    <strong class="recovered-result">55</strong>
    <div class="clue-fragments"><span>A</span><i>—</i><span>17</span><i>—</i><span>55</span></div>
    <p class="calculator-question">Why do these numbers keep appearing?</p>
    <p class="calculator-signature">— A</p>
    <button class="primary-button success-button" data-action="dismiss-calculator-success">Return to home</button>
  </section>`}function a(e,t){if(t===`clear`){e.calculatorDisplay=`0`,e.calculatorStoredValue=null,e.calculatorOperator=null,e.calculatorWaitingForOperand=!1;return}if(t===`toggle-sign`){e.calculatorDisplay=String(Number(e.calculatorDisplay)*-1);return}if(t===`percent`){e.calculatorDisplay=String(Number(e.calculatorDisplay)/100);return}if(t===`.`||/^\d$/.test(t)){if(e.calculatorWaitingForOperand)e.calculatorDisplay=t===`.`?`0.`:t,e.calculatorWaitingForOperand=!1;else if(t===`.`&&e.calculatorDisplay.includes(`.`))return;else e.calculatorDisplay=e.calculatorDisplay===`0`&&t!==`.`?t:e.calculatorDisplay+t;return}if(t===`=`){e.calculatorStoredValue!==null&&e.calculatorOperator&&(e.calculatorDisplay=s(o(e.calculatorStoredValue,Number(e.calculatorDisplay),e.calculatorOperator)),e.calculatorStoredValue=null,e.calculatorOperator=null,e.calculatorWaitingForOperand=!0);return}let n=t;e.calculatorStoredValue!==null&&e.calculatorOperator&&!e.calculatorWaitingForOperand&&(e.calculatorDisplay=s(o(e.calculatorStoredValue,Number(e.calculatorDisplay),e.calculatorOperator))),e.calculatorStoredValue=Number(e.calculatorDisplay),e.calculatorOperator=n,e.calculatorWaitingForOperand=!0}function o(e,t,n){return n===`+`?e+t:n===`-`?e-t:n===`×`?e*t:t===0?0:e/t}function s(e){return String(Number.isInteger(e)?e:Number(e.toFixed(8)))}var c={introCompleted:!1,currentScreen:`lock`,phoneUnlocked:!1,currentApp:null,currentNote:null,notesView:`list`,currentPhoto:null,galleryView:`grid`,galleryHintLevel:0,calculatorView:`calculator`,calculatorHintLevel:0,calculatorDisplay:`0`,calculatorStoredValue:null,calculatorOperator:null,calculatorWaitingForOperand:!1,currentConversation:null,messagesView:`list`,messagesHintLevel:0,currentLocation:null,mapsView:`overview`,mapsHintLevel:0,selectedTrack:null,musicView:`playlist`,musicHintLevel:0,currentFile:null,filesView:`list`,filesSearch:``,filesHintLevel:0,currentCalendarDay:14,currentCalendarEvent:null,calendarView:`month`,calendarHintLevel:0,currentBrowserPage:null,browserView:`search`,browserQuery:``,browserHintLevel:0,unknownStage:`matching`,unknownSelectedClue:null,unknownMatchedClues:{},unknownOrder:[],unknownEndingStep:0,unknownHintLevel:0,finalIdentity:null,gameCompleted:!1,unlockedApps:[1],completedApps:[],collectedClues:[]};function l(){return structuredClone(c)}function u(){let e=localStorage.getItem(`the-lost-phone-state`);if(!e)return l();try{return{...l(),...JSON.parse(e)}}catch{return l()}}function d(e){localStorage.setItem(`the-lost-phone-state`,JSON.stringify(e))}function f(e,t,n){if(!e.unlockedApps.includes(t)||e.completedApps.includes(t))return;e.completedApps.push(t),n&&!e.collectedClues.includes(n)&&e.collectedClues.push(n);let r=t+1;r<=10&&!e.unlockedApps.includes(r)&&e.unlockedApps.push(r)}var p=[`A`,`17`,`55`,`17:55`,`Northbridge Café`,`07:14`,`backup_old.txt`,`18:20`,`Willow Street`],m=[[`FRAGMENT-01`,`A single letter appeared before anything else. It was signed by someone who never used their full name.`,`A`],[`FRAGMENT-02`,`The photographs stopped making sense at one particular number. The number was the hour that kept returning.`,`L`],[`FRAGMENT-03`,`The calculator produced a number that wasn't really a calculation. It became important later.`,`E`],[`FRAGMENT-04`,`Two numbers finally became a time. That was when the meeting was supposed to happen.`,`X`],[`FRAGMENT-05`,`The same place appeared more than once. It was where the meeting happened.`,`A`],[`FRAGMENT-06`,`A missing track left behind a time. Later, that same time appeared in a file's history.`,`N`],[`FRAGMENT-07`,`Someone wanted this file gone. It contained the warning that the trail had not been erased completely.`,`D`],[`FRAGMENT-08`,`The calendar revealed when the meeting ended. Everything after this point became harder to explain.`,`E`],[`FRAGMENT-09`,`The final search revealed where the back entrance led. It was the street behind the meeting place.`,`R`]],h=[[`Alexander Reed`,`Photographer`,`Northbridge area`],[`Alexander Cole`,`Teacher`,`Riverside`],[`Alexander Mason`,`Engineer`,`West End`],[`Alexander Shaw`,`Student`,`Hawthorne`]];function g(e){return e.replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e]??e)}function _(e,t=``){return e.unknownStage===`complete`?b():e.unknownStage===`review`?ae():e.unknownStage===`ending`?ie(e):e.unknownStage===`owner`?re(e,t):e.unknownStage===`name`?ne():e.unknownStage===`ordering`?te(e,t):ee(e,t)}function v(e){return`<main class="phone-shell unknown-shell"><div class="speaker"></div><div class="phone-screen unknown-screen" data-screen="app"><div class="status-bar"><span>10:42</span><span>▮▮▮ 87%</span></div>${e}<div class="home-indicator"></div></div></main>`}function y(e,t=``){return`<header class="unknown-header"><button class="unknown-back" data-action="home" aria-label="Return to home">‹</button><div><p class="eyebrow">RECOVERY</p><h1>${e}</h1>${t?`<p class="unknown-subtitle">${t}</p>`:``}</div></header>`}function ee(e,t){let n=Object.keys(e.unknownMatchedClues).length;return v(`<section class="unknown-app">${y(`Reconstruct the trail`,`This application has no name. Maybe it was never meant to be opened.`)}<p class="unknown-intro">RECOVERED FRAGMENTS</p><div class="unknown-columns"><div><p class="unknown-label">Collected clues · ${n}/9</p><div class="clue-list">${p.map(t=>{let n=t in e.unknownMatchedClues;return`<button class="clue-chip ${n?`is-matched`:``} ${e.unknownSelectedClue===t?`is-selected`:``}" data-unknown-clue="${g(t)}" ${n?`disabled`:``}>${g(t)}${n?` ✓`:``}</button>`}).join(``)}</div></div><div><p class="unknown-label">Recovered fragments</p><div class="fragment-list">${m.map(([t,n,r],i)=>{let a=p[i],o=a in e.unknownMatchedClues;return`<button class="fragment-card ${o?`is-matched`:``}" data-unknown-fragment="${t}" ${o?`disabled`:``}><span>${t}</span><strong>${g(n)}</strong><b>${r}</b>${o?`<small>matched: ${g(a)}</small>`:``}</button>`}).join(``)}</div></div></div>${t?`<p class="unknown-notice">${g(t)}</p>`:``}${n===9?`<button class="unknown-primary" data-action="unknown-order">Arrange the trail</button>`:``}<button class="unknown-hint" data-action="unknown-hint">${e.unknownHintLevel?[`The first name came from the fragments. The surname must come from the evidence.`,`Which owner is connected to the place you kept finding?`,`Northbridge Café and Willow Street point toward the same owner record.`][e.unknownHintLevel-1]:`Need a hint?`}</button></section>`)}function te(e,t){let n=e.unknownOrder.length?e.unknownOrder:[...p];return v(`<section class="unknown-app">${y(`Order the evidence`,`The fragments fit. Now put them in the order the trail was discovered.`)}<ol class="order-list">${n.map((e,t)=>`<li><span>${t+1}</span><strong>${g(e)}</strong><div><button class="order-button" data-unknown-move="up" data-unknown-index="${t}" ${t===0?`disabled`:``} aria-label="Move up">↑</button><button class="order-button" data-unknown-move="down" data-unknown-index="${t}" ${t===n.length-1?`disabled`:``} aria-label="Move down">↓</button></div></li>`).join(``)}</ol>${t?`<p class="unknown-notice">${g(t)}</p>`:``}<button class="unknown-primary" data-action="unknown-confirm-order">Confirm order</button></section>`)}function ne(){return v(`<section class="unknown-app centered-reveal">${y(`Name recovered`)}<div class="letter-reveal">${m.map(([,,e],t)=>`<span style="animation-delay:${t*.12}s">${e}</span>`).join(``)}</div><h2>ALEXANDER</h2><p>“A” wasn't an initial.<br />It was the first piece of a name.</p><button class="unknown-primary" data-action="unknown-owner">Continue</button></section>`)}function re(e,t){return v(`<section class="unknown-app">${y(`One piece is still missing`)}<p class="unknown-lead">Four people share the first name.<br />One record matches the trail.</p><div class="owner-list">${h.map(([e,t,n])=>`<article class="owner-card"><h2>${e}</h2><p>${t}</p><small>Last known location · ${n}</small></article>`).join(``)}</div><div class="evidence-grid"><span><b>Meeting location</b>Northbridge Café</span><span><b>Exit</b>Willow Street</span><span><b>Recovered file</b>backup_old.txt</span><span><b>Signature</b>— A</span></div><form class="unknown-answer" data-action="solve-unknown"><label for="unknown-answer">Whose phone was this?</label><h2>Whose phone was this?</h2><div class="answer-row"><input id="unknown-answer" name="answer" type="text" autocomplete="off" placeholder="Full owner name" /><button class="unknown-primary" type="submit">Identify</button></div></form>${t?`<p class="unknown-notice">${g(t)}</p>`:``}<button class="unknown-hint" data-action="unknown-hint">${e.unknownHintLevel?[`The first name came from the fragments. The surname must come from the evidence.`,`Which owner is connected to the place you kept finding?`,`Northbridge Café and Willow Street point toward the same owner record.`][e.unknownHintLevel-1]:`Need a hint?`}</button></section>`)}function ie(e){let t=[`PHONE OWNER IDENTIFIED|ALEXANDER REED`,`You finally found the name.`,`The phone wasn't lost by accident.`,`Alexander left a trail through the phone. Someone tried to erase it. But they missed enough.`,`The meeting. The file. The missing track. The back entrance. And one name.`,`Alexander Reed|Last known location:|Northbridge Café|October 14, 2026|17:55 → 18:20|Exit:|Willow Street`,`Whatever happened after 18:20 is still unknown.`],n=t[e.unknownEndingStep].split(`|`);return v(`<section class="unknown-app centered-reveal ending-reveal">${y(`Recovery log`)}<div class="ending-copy">${n.map((t,n)=>n===0&&e.unknownEndingStep===0?`<h2>${t}</h2>`:`<p>${t}</p>`).join(``)}</div><button class="unknown-primary" data-action="unknown-next">${e.unknownEndingStep===t.length-1?`Close case`:`Continue`}</button></section>`)}function b(){return v(`<section class="unknown-app centered-reveal">${y(`Case closed`)}<h2>CASE CLOSED</h2><h1 class="final-owner">ALEXANDER REED</h1><p>You found the owner.<br />You recovered the trail.<br />But some questions remain unanswered.</p><strong class="thanks">Thank you for playing.</strong><div class="ending-actions"><button class="unknown-primary" data-action="unknown-review">Review the Trail</button><button class="unknown-secondary" data-action="home">Return to Phone</button></div></section>`)}function ae(){return v(`<section class="unknown-app">${y(`Review the trail`)}<div class="review-list">${[[`NOTES`,`A`],[`GALLERY`,`17`],[`CALCULATOR`,`55`],[`MESSAGES`,`17:55`],[`MAPS`,`Northbridge Café`],[`MUSIC`,`07:14`],[`FILES`,`backup_old.txt`],[`CALENDAR`,`18:20`],[`BROWSER`,`Willow Street`],[`UNKNOWN`,`Alexander Reed`]].map(([e,t],n)=>`<article><span>${n+1} — ${e}</span><strong>${t}</strong></article>`).join(``)}</div><button class="unknown-secondary" data-action="unknown-complete">Return to Recovery</button></section>`)}var x=[{id:1,name:`Notes`,glyph:`N`,accent:`#d9c38d`},{id:2,name:`Gallery`,glyph:`G`,accent:`#9aabb9`},{id:3,name:`Calculator`,glyph:`+`,accent:`#b9a99a`},{id:4,name:`Messages`,glyph:`M`,accent:`#8ca99b`},{id:5,name:`Maps`,glyph:`⌖`,accent:`#a6a18d`},{id:6,name:`Music`,glyph:`♫`,accent:`#aa91a1`},{id:7,name:`Files`,glyph:`F`,accent:`#bd9c78`},{id:8,name:`Calendar`,glyph:`□`,accent:`#a78f88`},{id:9,name:`Browser`,glyph:`◉`,accent:`#8c9eaa`},{id:10,name:`Unknown`,glyph:`?`,accent:`#817c88`}],S=[{id:1,filename:`IMG_001`,date:`October 14, 2026`,time:`10:42 AM`,src:`/gallery/img-001.svg`},{id:2,filename:`IMG_002`,date:`October 14, 2026`,time:`11:03 AM`,src:`/gallery/img-002.svg`},{id:3,filename:`IMG_003`,date:`October 14, 2026`,time:`11:17 AM`,src:`/gallery/img-003.svg`},{id:4,filename:`IMG_004`,date:`October 14, 2026`,time:`11:31 AM`,src:`/gallery/img-004.svg`},{id:5,filename:`IMG_005`,date:`October 14, 2026`,time:`11:45 AM`,src:`/gallery/img-005.svg`},{id:6,filename:`IMG_006`,date:`October 14, 2026`,time:`12:02 PM`,src:`/gallery/img-006.svg`}];function oe(e,t){return e.galleryView===`success`?le():e.galleryView===`viewer`&&e.currentPhoto?ce(e.currentPhoto):se(e,t)}function se(e,t){let n=e.completedApps.includes(2);return`<section class="gallery-app" data-gallery-view="grid">
    <header class="gallery-toolbar">
      <button class="gallery-nav" data-action="home" aria-label="Back to home">‹</button>
      <div><p class="eyebrow">Camera roll</p><h1>Gallery</h1></div>
      <span class="gallery-count">${S.length.toString().padStart(2,`0`)}</span>
    </header>
    <div class="gallery-caption"><span class="caption-mark">/</span><span>Something changed.</span>${n?`<span class="gallery-resolved">Resolved</span>`:``}</div>
    <div class="photo-grid">
      ${S.map(e=>`<button class="photo-tile" data-photo-id="${e.id}" aria-label="Open ${e.filename}"><img src="${e.src}" alt="Bedroom photograph ${e.filename}" /><span>${e.filename}</span></button>`).join(``)}
    </div>
    <div class="gallery-puzzle-panel">
      <div class="gallery-prompt">Which photo was different?</div>
      <form data-action="solve-gallery" class="gallery-answer-form">
        <label for="gallery-answer">Photo identifier</label>
        <div class="answer-row"><input id="gallery-answer" name="answer" type="text" inputmode="numeric" maxlength="7" autocomplete="off" placeholder="_ _ _" aria-label="Which photo was different" /><button class="submit-button" type="submit">Submit</button></div>
        ${t?`<p class="notice puzzle-notice" role="alert">${t}</p>`:``}
      </form>
      <button class="hint-button" data-action="gallery-hint">${e.galleryHintLevel>0?`Hint shown`:`Show hint`}</button>
      ${e.galleryHintLevel>0?`<p class="gallery-hint">${e.galleryHintLevel>1?`One detail appears differently from the others.`:`Compare the photographs carefully.`}</p>`:``}
    </div>
  </section>`}function ce(e){let t=S.find(t=>t.id===e);return`<section class="gallery-app photo-viewer" data-gallery-view="viewer">
    <header class="viewer-toolbar"><button class="gallery-nav" data-action="gallery-grid" aria-label="Back to gallery">‹</button><span>Photo details</span><span class="viewer-index">${t.id} / ${S.length}</span></header>
    <figure class="photo-detail">
      <img src="${t.src}" alt="Bedroom photograph ${t.filename}" />
      <figcaption><strong>${t.filename}</strong><span>${t.date}</span><span>${t.time}</span></figcaption>
    </figure>
  </section>`}function le(){return`<section class="gallery-app gallery-success" data-gallery-view="success">
    <span class="success-mark">✓</span>
    <p class="eyebrow">Gallery · recovered</p>
    <h1>PUZZLE SOLVED</h1>
    <p class="success-lead">One photograph doesn't belong.</p>
    <div class="time-reveal"><strong>11:17</strong><span>You've seen this before.</span><small>— A</small></div>
    <button class="primary-button success-button" data-action="dismiss-gallery-success">Return to home</button>
  </section>`}var C=[{id:1,title:`Shopping List`,preview:`MILK · BREAD · APPLES`,content:[`MILK`,`BREAD`,`APPLES`,`COFFEE`]},{id:2,title:`Things I Need To Remember`,preview:`Call Mom · Return the book`,content:[`Call Mom`,`Return the book`,`Buy batteries`,`Water the plants`]},{id:3,title:`Don't Forget`,preview:`I keep forgetting things.`,content:[`I keep forgetting things.`,`So I made a little rule for myself.`,`The first is at the beginning.`,`The second is in the middle.`,`The third is at the end.`,``,`8 P 4 X 2 K 7`],puzzle:!0}];function ue(e,t){return e.notesView===`success`?me():e.notesView===`detail`&&e.currentNote?fe(e.currentNote,t):de(e)}function de(e){let t=e.completedApps.includes(1);return`
    <section class="notes-app" data-notes-view="list">
      <header class="notes-toolbar">
        <button class="notes-nav" data-action="home" aria-label="Back to home">‹</button>
        <div><p class="eyebrow">Personal</p><h1>Notes</h1></div>
        <span class="notes-count">${C.length.toString().padStart(2,`0`)}</span>
      </header>
      <div class="notes-list">
        ${C.map(e=>`<button class="note-row ${e.id===3&&t?`is-resolved`:``}" data-note-id="${e.id}">
          <span class="note-index">0${e.id}</span>
          <span class="note-copy"><strong>${e.title}</strong><small>${e.id===3&&t?`Puzzle resolved · `:``}${e.preview}</small></span>
          <span class="note-chevron">›</span>
        </button>`).join(``)}
      </div>
      <p class="notes-footer">${t?`Puzzle resolved · `:``}Last edited · today</p>
    </section>`}function fe(e,t){let n=C.find(t=>t.id===e);return`
    <section class="notes-app note-detail" data-notes-view="detail">
      <header class="notes-toolbar detail-toolbar">
        <button class="notes-nav" data-action="notes-list" aria-label="Back to notes">‹</button>
        <span class="note-folder">All notes</span>
        <span class="notes-count">0${n.id}</span>
      </header>
      <article class="note-paper ${n.puzzle?`puzzle-note`:``}">
        <p class="note-date">Wednesday · September 16</p>
        <h1>${n.title}</h1>
        <div class="note-content">${n.content.map(e=>`<p>${e||`&nbsp;`}</p>`).join(``)}</div>
      </article>
      ${n.puzzle?pe(t):`<p class="note-status">No further action required.</p>`}
    </section>`}function pe(e){return`<div class="puzzle-panel">
    <div class="puzzle-panel-heading"><span>Recovery prompt</span><span class="puzzle-status">● active</span></div>
    <form data-action="solve-notes" class="answer-form">
      <label for="notes-answer">Enter the code</label>
      <div class="answer-row"><input id="notes-answer" name="answer" type="text" inputmode="text" maxlength="3" autocomplete="off" placeholder="_ _ _" aria-label="Enter the code" /><button class="submit-button" type="submit">Submit</button></div>
      ${e?`<p class="notice puzzle-notice" role="alert">${e}</p>`:``}
    </form>
    <button class="hint-button" data-action="hint">Show hint</button>
  </div>`}function me(){return`<section class="notes-app success-screen" data-notes-view="success">
    <span class="success-mark">✓</span>
    <p class="eyebrow">Notes · recovered</p>
    <h1>PUZZLE SOLVED</h1>
    <p class="success-lead">A hidden note was recovered.</p>
    <div class="recovered-note"><p>If you're reading this, you've already opened the phone.</p><p>Don't trust the obvious things.</p><p class="signature">— A</p></div>
    <button class="primary-button success-button" data-action="dismiss-success">Return to home</button>
  </section>`}var w=[{id:1,contact:`Maya`,preview:`You remember 17, right?`,timestamp:`Today`,unread:!0,messages:[{sender:`MAYA`,text:`Are you still coming?`,time:`10:08 AM`,sent:!1},{sender:`A`,text:`Not tonight.`,time:`10:12 AM`,sent:!0},{sender:`MAYA`,text:`You said that yesterday.`,time:`10:13 AM`,sent:!1},{sender:`A`,text:`Things changed.`,time:`10:16 AM`,sent:!0},{sender:`MAYA`,text:`What time was it supposed to be?`,time:`10:18 AM`,sent:!1},{sender:`A`,text:`17.`,time:`10:19 AM`,sent:!0},{sender:`MAYA`,text:`Just remember it.`,time:`10:20 AM`,sent:!1}]},{id:2,contact:`Daniel`,preview:`Are you still using the old number?`,timestamp:`Yesterday`,unread:!1,messages:[{sender:`DANIEL`,text:`Are you still using the old number?`,time:`Yesterday, 8:41 PM`,sent:!1},{sender:`A`,text:`No.`,time:`8:44 PM`,sent:!0},{sender:`DANIEL`,text:`Good.`,time:`8:45 PM`,sent:!1},{sender:`A`,text:`Why?`,time:`8:47 PM`,sent:!0},{sender:`DANIEL`,text:`Someone asked about it.`,time:`8:52 PM`,sent:!1},{sender:`A`,text:`Who?`,time:`8:53 PM`,sent:!0},{sender:`DANIEL`,text:`I don't know.`,time:`8:54 PM`,sent:!1}]},{id:3,contact:`Unknown`,preview:`And the minutes?`,timestamp:`Yesterday`,unread:!0,messages:[{sender:`UNKNOWN`,text:`You remember the meeting?`,time:`Yesterday, 11:03 PM`,sent:!1},{sender:`A`,text:`Yes.`,time:`11:04 PM`,sent:!0},{sender:`UNKNOWN`,text:`And the minutes?`,time:`11:05 PM`,sent:!1},{sender:`A`,text:`55.`,time:`11:06 PM`,sent:!0},{sender:`UNKNOWN`,text:`Don't be late.`,time:`11:07 PM`,sent:!1},{sender:`A`,text:`I won't.`,time:`11:08 PM`,sent:!0}]}];function he(e,t){return e.messagesView===`success`?ve():e.messagesView===`conversation`&&e.currentConversation?_e(e.currentConversation):ge(e,t)}function ge(e,t){let n=e.completedApps.includes(4);return`<section class="messages-app" data-messages-view="list">
    <header class="messages-toolbar">
      <button class="messages-nav" data-action="home" aria-label="Back to home">‹</button>
      <div><p class="eyebrow">Private</p><h1>Messages</h1></div>
      ${n?`<span class="messages-resolved">Resolved</span>`:`<span class="message-signal">●</span>`}
    </header>
    <div class="conversation-list">
      ${w.map(e=>`<button class="conversation-row ${e.unread?`is-unread`:``}" data-conversation-id="${e.id}">
        <span class="contact-avatar">${e.contact.charAt(0)}</span>
        <span class="conversation-copy"><strong>${e.contact}</strong><small>${e.preview}</small></span>
        <span class="conversation-meta"><small>${e.timestamp}</small>${e.unread?`<i></i>`:``}</span>
      </button>`).join(``)}
    </div>
    <div class="messages-puzzle-panel">
      <p class="messages-prompt">Two parts of the meeting time are hidden in different conversations.</p>
      <form data-action="solve-messages" class="messages-answer-form">
        <label for="messages-answer-hour">What time was the meeting?</label>
        <div class="time-answer-row"><input id="messages-answer-hour" name="hour" type="text" inputmode="numeric" maxlength="2" placeholder="__" aria-label="Meeting hour" /><span>:</span><input id="messages-answer-minute" name="minute" type="text" inputmode="numeric" maxlength="2" placeholder="__" aria-label="Meeting minute" /><button class="submit-button" type="submit">Submit</button></div>
        ${t?`<p class="notice puzzle-notice" role="alert">${t}</p>`:``}
      </form>
      <button class="hint-button" data-action="messages-hint">${e.messagesHintLevel>0?`Hint shown`:`Show hint`}</button>
      ${e.messagesHintLevel>0?`<p class="messages-hint">${e.messagesHintLevel>1?`One conversation gives you one part of the time. Another gives you the other part.`:`Not every conversation is part of the answer.`}</p>`:``}
    </div>
    <p class="messages-footer">${n?`Investigation complete · `:``}Encrypted · device only</p>
  </section>`}function _e(e){let t=w.find(t=>t.id===e);return`<section class="messages-app conversation-view" data-messages-view="conversation">
    <header class="conversation-toolbar">
      <button class="messages-nav" data-action="messages-list" aria-label="Back to messages">‹</button>
      <span class="contact-header"><span class="contact-avatar small">${t.contact.charAt(0)}</span><strong>${t.contact}</strong></span>
      <span class="conversation-status">offline</span>
    </header>
    <div class="message-thread" aria-label="Conversation with ${t.contact}">
      <p class="thread-date">${t.timestamp===`Today`?`Today`:`Yesterday`}</p>
      ${t.messages.map(e=>`<div class="message-line ${e.sent?`is-sent`:`is-received`}"><span class="message-sender">${e.sender}</span><p>${e.text}</p><time>${e.time}</time></div>`).join(``)}
    </div>
  </section>`}function ve(){return`<section class="messages-app messages-success" data-messages-view="success">
    <span class="success-mark">✓</span>
    <p class="eyebrow">Messages · recovered</p>
    <h1>MESSAGE RECOVERED</h1>
    <strong class="meeting-time">17:55</strong>
    <div class="same-place-note"><p>Same place.</p><small>— A</small></div>
    <div class="new-clue"><span>New clue</span><strong>17:55</strong></div>
    <button class="primary-button success-button" data-action="dismiss-messages-success">Return to home</button>
  </section>`}var T=[{id:1,name:`Northbridge Café`,address:`14 Willow Street`,visited:`October 14, 2026`,time:`17:55`,saved:!0,top:`38%`,left:`25%`},{id:2,name:`Riverside Station`,address:`8 River Road`,visited:`October 12, 2026`,time:`09:20`,saved:!0,top:`24%`,left:`78%`},{id:3,name:`Old Library`,address:`21 King Street`,visited:`October 14, 2026`,time:`17:55`,saved:!1,top:`69%`,left:`68%`},{id:4,name:`Hawthorne Park`,address:`3 Park Lane`,visited:`October 13, 2026`,time:`14:10`,saved:!1,top:`72%`,left:`19%`},{id:5,name:`West End Market`,address:`42 Market Street`,visited:`October 11, 2026`,time:`18:30`,saved:!1,top:`18%`,left:`43%`}];function E(e,t){return e.mapsView===`success`?A():e.mapsView===`location`&&e.currentLocation?k(e.currentLocation):D(e,t)}function D(e,t){let n=T.filter(e=>e.saved),r=T.filter(e=>!e.saved);return`<section class="maps-app" data-maps-view="overview">
    <header class="maps-toolbar">
      <button class="maps-nav" data-action="home" aria-label="Back to home">‹</button>
      <div><p class="eyebrow">Offline maps</p><h1>Maps</h1></div>
      ${e.completedApps.includes(5)?`<span class="maps-resolved">Resolved</span>`:`<span class="map-signal">●</span>`}
    </header>
    <div class="map-search"><span>⌕</span><span>Search this phone</span><i>offline</i></div>
    <div class="fictional-map" aria-label="Fictional map of local places">
      <span class="map-road road-one"></span><span class="map-road road-two"></span><span class="map-road road-three"></span>
      <span class="map-water"></span>
      ${T.map(e=>`<button class="map-pin ${e.time===`17:55`?`same-time`:``}" style="top:${e.top};left:${e.left}" data-location-id="${e.id}" aria-label="Open ${e.name}"><span></span></button>`).join(``)}
      <span class="map-scale">N<br><b>—</b></span>
    </div>
    <p class="map-note">I went back to the same place more than once.<br />I just don't remember which one.</p>
    <div class="place-groups">
      <div class="place-group"><p class="group-label">Saved Places</p>${n.map(e=>O(e,!0)).join(``)}</div>
      <div class="place-group"><p class="group-label">Recent</p>${r.map(e=>O(e,!1)).join(``)}</div>
    </div>
    <div class="maps-puzzle-panel">
      <p class="maps-prompt">Which place was visited at 17:55 and saved?</p>
      <form data-action="solve-maps" class="maps-answer-form">
        <label for="maps-answer">Place name</label>
        <div class="answer-row"><input id="maps-answer" name="answer" type="text" autocomplete="off" placeholder="Place name" aria-label="Which place was visited at 17:55 and saved" /><button class="submit-button" type="submit">Submit</button></div>
        ${t?`<p class="notice puzzle-notice" role="alert">${t}</p>`:``}
      </form>
      <button class="hint-button" data-action="maps-hint">${e.mapsHintLevel>0?`Hint shown`:`Show hint`}</button>
      ${e.mapsHintLevel>0?`<p class="maps-hint">${e.mapsHintLevel>1?`Two places share that time. Check what else the phone remembers about them.`:`Start with the time you already discovered.`}</p>`:``}
    </div>
  </section>`}function O(e,t){return`<button class="location-row" data-location-id="${e.id}"><span class="location-pin-mini">●</span><span class="location-copy"><strong>${e.name}</strong><small>${e.address} · ${e.time}</small></span>${t?`<span class="saved-mark">★</span>`:`<span class="location-arrow">›</span>`}</button>`}function k(e){let t=T.find(t=>t.id===e);return`<section class="maps-app location-detail" data-maps-view="location">
    <header class="maps-detail-toolbar"><button class="maps-nav" data-action="maps-overview" aria-label="Back to map">‹</button><span>Location details</span><span class="detail-status">${t.saved?`saved`:`visited`}</span></header>
    <div class="detail-map"><span class="detail-pin">●</span><span class="detail-coordinate">LOCAL RECORD ${t.id.toString().padStart(2,`0`)}</span></div>
    <article class="location-card"><p class="location-kicker">Phone record</p><h1>${t.name}</h1><p class="location-address">${t.address}</p><div class="location-metadata"><span><small>Visited</small><strong>${t.visited}</strong></span><span><small>Time</small><strong>${t.time}</strong></span></div>${t.saved?`<p class="saved-place">★ Saved place</p>`:`<p class="unsaved-place">Not saved</p>`}</article>
  </section>`}function A(){return`<section class="maps-app maps-success" data-maps-view="success">
    <span class="success-mark">✓</span>
    <p class="eyebrow">Maps · recovered</p>
    <h1>PLACE IDENTIFIED</h1>
    <strong class="identified-place">Northbridge Café</strong>
    <strong class="identified-time">17:55</strong>
    <div class="place-reveal"><p>Someone wanted me to remember this place.</p><small>— A</small></div>
    <div class="new-clue"><span>New clue</span><strong>Northbridge Café</strong></div>
    <button class="primary-button success-button" data-action="dismiss-maps-success">Return to home</button>
  </section>`}var j=[{id:1,title:`After Rain`,artist:`A`,duration:`01:02`},{id:2,title:`Streetlights`,artist:`A`,duration:`02:04`},{id:3,title:`Empty Roads`,artist:`A`,duration:`03:06`},{id:4,title:`Last Train`,artist:`A`,duration:`04:08`},{id:5,title:`Northbound`,artist:`A`,duration:`05:10`},{id:6,title:`Home`,artist:`A`,duration:`06:12`}];function M(e,t){return e.musicView===`success`?F():N(e,t)}function N(e,t){return`<section class="music-app" data-music-view="playlist">
    <header class="music-toolbar">
      <button class="music-nav" data-action="home" aria-label="Back to home">‹</button>
      <div><p class="eyebrow">Offline library</p><h1>Music</h1></div>
      ${e.completedApps.includes(6)?`<span class="music-resolved">Resolved</span>`:`<span class="music-signal">●</span>`}
    </header>
    <div class="playlist-heading">
      <div class="album-art" aria-hidden="true"><span></span><i></i><b></b></div>
      <div class="playlist-copy"><p class="eyebrow">Playlist · 06 tracks</p><h2>Late Evening</h2><p>I always listened in the same order.</p><small>Last played at Northbridge Café</small></div>
    </div>
    <div class="track-list" aria-label="Late Evening playlist">
      ${j.map(t=>P(t,e.selectedTrack)).join(``)}
    </div>
    <div class="missing-track-note"><span class="note-symbol">/</span><p>The last track is missing.<br />I never finished the list.</p></div>
    <div class="music-puzzle-panel">
      <p class="music-prompt">What should the missing track's duration be?</p>
      <form data-action="solve-music" class="music-answer-form">
        <label for="music-answer-minute">Missing duration</label>
        <div class="music-time-row"><input id="music-answer-hour" name="hour" type="text" inputmode="numeric" maxlength="4" placeholder="__" aria-label="Missing duration minutes" /><span>:</span><input id="music-answer-minute" name="minute" type="text" inputmode="numeric" maxlength="4" placeholder="__" aria-label="Missing duration seconds" /><button class="submit-button" type="submit">Submit</button></div>
        ${t?`<p class="notice puzzle-notice" role="alert">${t}</p>`:``}
      </form>
      <button class="hint-button" data-action="music-hint">${e.musicHintLevel>0?`Hint shown`:`Show hint`}</button>
      ${e.musicHintLevel>0?`<p class="music-hint">${e.musicHintLevel>1?`The seconds change by the same amount each time.`:`Look at the numbers, not the song titles.`}</p>`:``}
    </div>
  </section>`}function P(e,t){let n=e.id===t;return`<button class="track-row ${n?`is-playing`:``}" data-track-id="${e.id}" aria-label="${n?`Pause`:`Play`} ${e.title}">
    <span class="track-number">${n?`▶`:e.id.toString().padStart(2,`0`)}</span>
    <span class="track-art" aria-hidden="true"><i></i></span>
    <span class="track-copy"><strong>${e.title}</strong><small>${n?`Playing · `:``}${e.artist}</small></span>
    <span class="track-duration">${e.duration}</span>
  </button>`}function F(){return`<section class="music-app music-success" data-music-view="success">
    <span class="success-mark">✓</span>
    <p class="eyebrow">Music · recovered</p>
    <h1>TRACK RECOVERED</h1>
    <strong class="missing-duration">07:14</strong>
    <div class="track-reveal"><p>The missing track wasn't missing.<br />Someone removed it.</p><small>— A</small></div>
    <div class="new-clue"><span>New clue</span><strong>07:14</strong></div>
    <button class="primary-button success-button" data-action="dismiss-music-success">Return to home</button>
  </section>`}var I=[{id:1,filename:`meeting_notes.txt`,type:`TXT`,size:`2 KB`,modified:`October 12, 2026 — 8:14 PM`,content:[`Meeting moved to Thursday.`,`Bring the old notebook.`,`Don't forget the keys.`]},{id:2,filename:`cafe_receipt.pdf`,type:`PDF`,size:`84 KB`,modified:`October 14, 2026 — 6:02 PM`,content:[`NORTHBRIDGE CAFÉ`,`Table 7`,`October 14, 2026`,`17:55`,`Paid`]},{id:3,filename:`photo_backup.zip`,type:`ZIP`,size:`12.4 MB`,modified:`October 15, 2026 — 9:31 AM`,content:[`6 photos`,`Last modified:`,`October 15, 2026`]},{id:4,filename:`todo.txt`,type:`TXT`,size:`1 KB`,modified:`October 13, 2026 — 7:20 AM`,content:[`Buy batteries`,`Return the book`,`Call Mom`]},{id:5,filename:`backup_old.txt`,type:`TXT`,size:`3 KB`,modified:`October 14, 2026 — 7:14 PM`,content:[`I should have deleted this.`,`If someone finds this file, they will know I was here.`,`The place matters more than the date.`,`— A`]},{id:6,filename:`calendar_export.ics`,type:`ICS`,size:`6 KB`,modified:`October 16, 2026 — 10:03 AM`,content:[`3 calendar events`,`Last event:`,`October 16, 2026`]}];function ye(e,t){return e.filesView===`success`?Ce():e.filesView===`detail`&&e.currentFile?Se(e.currentFile):be(e,t)}function be(e,t){let n=e.filesSearch.trim().toLowerCase(),r=I.filter(e=>e.filename.toLowerCase().includes(n)),i=new Set([5,2,1]),a=r.filter(e=>i.has(e.id)),o=r.filter(e=>!i.has(e.id));return`<section class="files-app" data-files-view="list">
    <header class="files-toolbar">
      <button class="files-nav" data-action="home" aria-label="Back to home">‹</button>
      <div><p class="eyebrow">On this device</p><h1>Files</h1></div>
      ${e.completedApps.includes(7)?`<span class="files-resolved">Resolved</span>`:`<span class="files-signal">●</span>`}
    </header>
    <label class="file-search"><span>⌕</span><input id="file-search" type="search" value="${we(e.filesSearch)}" placeholder="Search files" aria-label="Search files" autocomplete="off" /><i>offline</i></label>
    <p class="files-note">There are too many copies.<br />Find the one I meant to erase.</p>
    <div class="file-sections">
      ${L(`Recent Files`,a)}
      ${L(`Documents`,o)}
      ${r.length===0?`<p class="empty-files">No matching files.</p>`:``}
    </div>
    <div class="files-puzzle-panel">
      <p class="files-prompt">Which file was meant to be erased?</p>
      <form data-action="solve-files" class="files-answer-form">
        <label for="files-answer">Filename</label>
        <div class="answer-row"><input id="files-answer" name="answer" type="text" autocomplete="off" placeholder="Filename" aria-label="Which file was meant to be erased" /><button class="submit-button" type="submit">Submit</button></div>
        ${t?`<p class="notice puzzle-notice" role="alert">${t}</p>`:``}
      </form>
      <button class="hint-button" data-action="files-hint">${e.filesHintLevel>0?`Hint shown`:`Show hint`}</button>
      ${e.filesHintLevel>0?`<p class="files-hint">${e.filesHintLevel>1?`Look at the modified time, then read what the file says.`:`One of the files connects to something you discovered earlier.`}</p>`:``}
    </div>
  </section>`}function L(e,t){return t.length===0?``:`<section class="file-section"><p class="file-section-label">${e}</p>${t.map(xe).join(``)}</section>`}function xe(e){return`<button class="file-row" data-file-id="${e.id}"><span class="file-icon file-type-${e.type.toLowerCase()}">${e.type.charAt(0)}</span><span class="file-copy"><strong>${e.filename}</strong><small>${e.type} · ${e.size}</small></span><span class="file-modified">${e.modified.split(` — `)[0]}</span><span class="file-arrow">›</span></button>`}function Se(e){let t=I.find(t=>t.id===e);return`<section class="files-app file-detail" data-files-view="detail">
    <header class="file-detail-toolbar"><button class="files-nav" data-action="files-list" aria-label="Back to files">‹</button><span>File details</span><span class="file-type-label">${t.type}</span></header>
    <article class="document-viewer">
      <div class="document-heading"><span class="large-file-icon file-type-${t.type.toLowerCase()}">${t.type.charAt(0)}</span><div><h1>${t.filename}</h1><p>${t.type} · ${t.size}</p></div></div>
      <div class="document-metadata"><span><small>Modified</small><strong>${t.modified}</strong></span><span><small>Location</small><strong>On My Phone</strong></span></div>
      <div class="document-content">${t.content.map(e=>`<p>${e||`&nbsp;`}</p>`).join(``)}</div>
    </article>
  </section>`}function Ce(){return`<section class="files-app files-success" data-files-view="success">
    <span class="success-mark">✓</span>
    <p class="eyebrow">Files · recovered</p>
    <h1>FILE RECOVERED</h1>
    <strong class="recovered-file">backup_old.txt</strong>
    <div class="file-reveal"><p>If someone finds this file, they will know I was here.</p><small>— A</small></div>
    <div class="new-clue"><span>New clue</span><strong>backup_old.txt</strong></div>
    <p class="erase-trail">Someone really did try to erase the trail.</p>
    <button class="primary-button success-button" data-action="dismiss-files-success">Return to home</button>
  </section>`}function we(e){return e.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}var R=[{id:1,day:12,date:`October 12, 2026`,time:`20:14`,title:`Sort photos`,location:`Home`,description:[`Clean up the gallery.`,`Keep the originals.`]},{id:2,day:13,date:`October 13, 2026`,time:`07:14`,title:`Leave early`,location:`Home`,description:[`Don't forget the notebook.`]},{id:3,day:13,date:`October 13, 2026`,time:`18:30`,title:`Call Daniel`,location:`Home`,description:[`Ask if he still has the old number.`]},{id:4,day:14,date:`October 14, 2026`,time:`17:30`,title:`Walk`,location:`Willow Street`,description:[`Leave ten minutes early.`]},{id:5,day:14,date:`October 14, 2026`,time:`17:55`,title:`Meeting`,location:`Northbridge Café`,description:[`Same place.`,`Don't bring anyone.`]},{id:6,day:14,date:`October 14, 2026`,time:`18:20`,title:`Leave`,location:`Northbridge Café`,description:[`If everything goes normally, leave through the back.`]},{id:7,day:14,date:`October 14, 2026`,time:`18:45`,title:`Delete`,location:`Home`,description:[`Remove anything that connects the meeting to me.`]},{id:8,day:15,date:`October 15, 2026`,time:`09:10`,title:`Check backup`,location:`Home`,description:[`Make sure the old file is gone.`]}],Te=[`Sun`,`Mon`,`Tue`,`Wed`,`Thu`,`Fri`,`Sat`],Ee=[`Sunday`,`Monday`,`Tuesday`,`Wednesday`,`Thursday`,`Friday`,`Saturday`];function De(e,t){return e.calendarView===`success`?Ne():e.calendarView===`event`&&e.currentCalendarEvent?Me(e.currentCalendarEvent):e.calendarView===`day`&&e.currentCalendarDay?Ae(e.currentCalendarDay):Oe(e,t)}function Oe(e,t){return`<section class="calendar-app" data-calendar-view="month">
    <header class="calendar-toolbar"><button class="calendar-nav" data-action="home" aria-label="Back to home">‹</button><div><p class="eyebrow">Offline calendar</p><h1>Calendar</h1></div>${e.completedApps.includes(8)?`<span class="calendar-resolved">Resolved</span>`:`<span class="calendar-signal">●</span>`}</header>
    <div class="month-heading"><button class="month-arrow" aria-label="Previous month" disabled>‹</button><h2>October 2026</h2><button class="month-arrow" aria-label="Next month" disabled>›</button></div>
    <div class="weekday-row">${Te.map(e=>`<span>${e}</span>`).join(``)}</div>
    <div class="month-grid">${ke(e.currentCalendarDay)}</div>
    <div class="calendar-legend"><span class="legend-dot"></span><span>Events on this device</span></div>
    <div class="calendar-puzzle-panel"><p class="calendar-prompt">What happened immediately after the meeting?</p><p class="calendar-instruction">Use the event times, not the order they appear on screen.</p><form data-action="solve-calendar" class="calendar-answer-form"><label for="calendar-answer">Event title</label><div class="answer-row"><input id="calendar-answer" name="answer" type="text" autocomplete="off" placeholder="Event title" aria-label="What happened immediately after the meeting" /><button class="submit-button" type="submit">Submit</button></div>${t?`<p class="notice puzzle-notice" role="alert">${t}</p>`:``}</form><button class="hint-button" data-action="calendar-hint">${e.calendarHintLevel>0?`Hint shown`:`Show hint`}</button>${e.calendarHintLevel>0?`<p class="calendar-hint">${e.calendarHintLevel>1?`What is the first event after that time?`:`Start with the event you already know about.`}</p>`:``}</div>
  </section>`}function ke(e){return[``,``,``,``,`1`,`2`,`3`,...Array.from({length:28},(e,t)=>String(t+4))].map(t=>{if(!t)return`<span class="calendar-day empty"></span>`;let n=Number(t),r=R.filter(e=>e.day===n).length;return`<button class="calendar-day ${r?`has-events`:``} ${n===14?`key-day`:``} ${e===n?`is-selected`:``}" data-calendar-day="${n}"><span>${t}</span>${r?`<i>${r}</i>`:``}</button>`}).join(``)}function Ae(e){let t=R.filter(t=>t.day===e);return`<section class="calendar-app day-view" data-calendar-view="day"><header class="calendar-sub-toolbar"><button class="calendar-nav" data-action="calendar-month" aria-label="Back to month">‹</button><div><p class="eyebrow">October 2026</p><h1>${Ee[new Date(2026,9,e).getDay()]} ${e}</h1></div><span class="day-count">${t.length.toString().padStart(2,`0`)}</span></header><div class="day-events"><p class="day-label">${t[0]?.date??`October ${e}, 2026`}</p>${t.length?t.map(je).join(``):`<p class="empty-day">No events recorded.</p>`}</div></section>`}function je(e){return`<button class="calendar-event-row" data-calendar-event="${e.id}"><span class="event-time">${e.time}</span><span class="event-line"></span><span class="event-copy"><strong>${e.title}</strong><small>${e.location}</small></span><span class="event-arrow">›</span></button>`}function Me(e){let t=R.find(t=>t.id===e);return`<section class="calendar-app event-detail" data-calendar-view="event"><header class="calendar-sub-toolbar"><button class="calendar-nav" data-action="calendar-day" aria-label="Back to day">‹</button><span>Event details</span><span class="event-detail-time">${t.time}</span></header><article class="event-card"><span class="event-card-mark">●</span><p class="event-card-date">${t.date}</p><h1>${t.title}</h1><div class="event-fact"><small>Time</small><strong>${t.time}</strong></div><div class="event-fact"><small>Location</small><strong>${t.location}</strong></div><div class="event-description">${t.description.map(e=>`<p>${e}</p>`).join(``)}</div></article></section>`}function Ne(){return`<section class="calendar-app calendar-success" data-calendar-view="success"><span class="success-mark">✓</span><p class="eyebrow">Calendar · recovered</p><h1>TIMELINE RECOVERED</h1><strong class="timeline-time">18:20</strong><div class="timeline-reveal"><p>The meeting ended at 18:20.<br />Whatever happened afterward was planned.</p><small>— A</small></div><div class="new-clue"><span>New clue</span><strong>18:20</strong></div><p class="next-event-note">The next event was not an accident.</p><button class="primary-button success-button" data-action="dismiss-calendar-success">Return to home</button></section>`}var z=[{id:1,title:`Northbridge Café — Official`,domain:`northbridge-cafe.example`,snippet:`Northbridge Café has served the neighborhood since 2019. Opening hours: 08:00–21:00. The café's rear entrance opens onto Willow Street.`,pageTitle:`Northbridge Café`,content:[`Established in 2019.`,`Address:`,`14 Willow Street`,`Opening hours:`,`08:00–21:00`,`The rear entrance is on Willow Street.`,`Private events may be arranged after normal opening hours.`]},{id:2,title:`Northbridge Café — Local Guide`,domain:`cityguide.example`,snippet:`A neighborhood café known for its quiet rear entrance and evening tables.`,pageTitle:`Northbridge Café — Local Guide`,content:[`Address:`,`14 Willow Street`,`Popular with students and nearby residents.`,`The rear entrance faces Willow Street.`,`Evening tables near the rear entrance are usually quieter than the front area.`]},{id:3,title:`Northbridge Café Reviews`,domain:`reviewboard.example`,snippet:`Several visitors mention the quiet rear entrance and late afternoon meetings.`,pageTitle:`Northbridge Café Reviews`,content:[`Review 1:`,`“The back entrance is much quieter.”`,`— Maya, October 2026`,`Review 2:`,`“Good place for a private conversation in the evening.”`,`— Daniel, October 2026`,`Review 3:`,`“The rear tables are away from the main entrance.”`,`— Anonymous, October 2026`]},{id:4,title:`Willow Street History`,domain:`localarchive.example`,snippet:`Historical information about Willow Street and nearby businesses.`,pageTitle:`Willow Street History`,content:[`Northbridge Café occupies number 14 Willow Street.`,`The building has had a rear service entrance facing the same street since before the café opened.`,`The rear entrance is not visible from the main road.`]}];function Pe(e,t){return e.browserView===`success`?Be():e.browserView===`page`&&e.currentBrowserPage?Re(e.currentBrowserPage):e.browserView===`results`?Ie(e,t):Fe(e)}function Fe(e){return`<section class="browser-app browser-search-view" data-browser-view="search">
    <header class="browser-toolbar"><button class="browser-nav" data-action="home" aria-label="Back to home">‹</button><div><p class="eyebrow">Private browser</p><h1>Browser</h1></div>${e.completedApps.includes(9)?`<span class="browser-resolved">Resolved</span>`:`<span class="browser-signal">●</span>`}</header>
    ${B(e)}
    <div class="browser-start-note"><span class="browser-note-mark">/</span><p>Some things are easier to find when you already know what you're looking for.</p></div>
    <button class="recent-search" data-action="browser-recent"><span>Recent search</span><strong>northbridge cafe</strong><span>›</span></button>
    <p class="browser-footer">Search index · on device</p>
  </section>`}function B(e){return`<form class="browser-search-form" data-action="search-browser"><span>⌕</span><input id="browser-search" name="query" type="search" value="${V(e.browserQuery)}" placeholder="Search or enter address" aria-label="Search fictional browser" autocomplete="off" /><button type="submit" aria-label="Search">Go</button></form>`}function Ie(e,t){let n=Ve(e.browserQuery),r=[`northbridge`,`northbridge cafe`,`cafe`].includes(n);return`<section class="browser-app browser-results-view" data-browser-view="results">
    <header class="browser-results-toolbar"><button class="browser-nav" data-action="home" aria-label="Back to home">‹</button><span>Search results</span><span class="browser-signal">●</span></header>
    ${B(e)}
    ${r?`<p class="result-summary">Results for <strong>${He(e.browserQuery.trim())}</strong></p><div class="result-list">${z.map(Le).join(``)}</div>`:`<div class="no-results"><span>⌕</span><p>No useful results found.</p></div>`}
    ${r?ze(e,t):``}
  </section>`}function Le(e){return`<button class="browser-result" data-browser-page="${e.id}"><span class="result-source">${e.domain}</span><strong>${e.title}</strong><p>${e.snippet}</p><span class="result-arrow">›</span></button>`}function Re(e){let t=z.find(t=>t.id===e);return`<section class="browser-app browser-page-view" data-browser-view="page">
    <header class="browser-page-toolbar"><button class="browser-nav" data-action="browser-results" aria-label="Back to search results">‹</button><span class="page-domain">${t.domain}</span><span class="page-menu">•••</span></header>
    <article class="browser-article"><p class="article-source">${t.domain}</p><h1>${t.pageTitle}</h1><div class="article-rule"></div><div class="article-content">${t.content.map(e=>`<p>${e||`&nbsp;`}</p>`).join(``)}</div></article>
  </section>`}function ze(e,t){return`<div class="browser-puzzle-panel"><p class="browser-prompt">Where was the meeting's exit?</p><form data-action="solve-browser" class="browser-answer-form"><label for="browser-answer">Location</label><div class="answer-row"><input id="browser-answer" name="answer" type="text" autocomplete="off" placeholder="Street or address" aria-label="Where was the meeting's exit" /><button class="submit-button" type="submit">Submit</button></div>${t?`<p class="notice puzzle-notice" role="alert">${t}</p>`:``}</form><button class="hint-button" data-action="browser-hint">${e.browserHintLevel>0?`Hint shown`:`Show hint`}</button>${e.browserHintLevel>0?`<p class="browser-hint">${e.browserHintLevel>1?`The Calendar mentioned leaving through the back. Find out where that entrance leads.`:`Don't rely on just one result. Look for a detail that appears more than once.`}</p>`:``}</div>`}function Be(){return`<section class="browser-app browser-success" data-browser-view="success"><span class="success-mark">✓</span><p class="eyebrow">Browser · confirmed</p><h1>LOCATION CONFIRMED</h1><strong class="confirmed-location">Willow Street</strong><div class="browser-reveal"><p>The back entrance wasn't an accident.</p><small>— A</small></div><div class="new-clue"><span>New clue</span><strong>Willow Street</strong></div><p class="final-app-note">One final app remains.</p><button class="primary-button success-button" data-action="dismiss-browser-success">Return to home</button></section>`}function Ve(e){return e.trim().toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).replace(/\s+/g,` `)}function V(e){return e.replace(/&/g,`&amp;`).replace(/"/g,`&quot;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}function He(e){return V(e)}var Ue=document.querySelector(`#app`);function H(e,t=``){Ue.innerHTML=e.introCompleted?e.currentScreen===`lock`?Ge(t):e.currentScreen===`home`?U(e,t):qe(e,t):We()}function We(){return`
    <main class="intro-screen">
      <video class="intro-video" src="/assets/ref.mp4" autoplay muted playsinline preload="auto"></video>
    </main>`}function Ge(e){return`
    <main class="phone-shell lock-shell">
      <div class="speaker"></div>
      <div class="phone-screen lock-screen" data-screen="lock">
        <div class="status-bar"><span>10:42</span><span>▮▮▮ 87%</span></div>
        <div class="lock-content">
          <p class="eyebrow">Wednesday · September 16</p>
          <time>10:42 <small>PM</small></time>
          <div class="lock-mark">⌁</div>
          <p class="device-locked">DEVICE LOCKED</p>
          <p class="lock-hint">Swipe up to enter passcode</p>
          <form class="passcode-form" data-action="unlock">
            <label for="passcode">Device passcode</label>
            <input id="passcode" name="passcode" type="password" inputmode="numeric" maxlength="4" autocomplete="off" placeholder="· · · ·" aria-label="Enter four digit passcode" />
            <button type="submit" class="primary-button">Unlock device</button>
            ${e?`<p class="notice error" role="alert">${e}</p>`:``}
          </form>
        </div>
        <div class="home-indicator"></div>
      </div>
    </main>`}function U(e,t){return`
    <main class="phone-shell">
      <div class="speaker"></div>
      <div class="phone-screen home-screen" data-screen="home">
        ${G()}
        <header class="home-header">
          <div><p class="eyebrow">Found device</p><h1>Home</h1></div>
          <span class="signal-dot" aria-label="Offline"></span>
        </header>
        <section class="app-grid" aria-label="Phone applications">
          ${x.map(t=>Ke(t.id,t.name,t.glyph,t.accent,e)).join(``)}
        </section>
        <div class="home-footer"><span>Wednesday, September 16</span><span>${e.completedApps.length}/10 resolved</span></div>
        ${t?`<p class="toast" role="status">${t}</p>`:``}
        <div class="home-indicator"></div>
      </div>
    </main>`}function Ke(e,t,n,r,i){let a=i.unlockedApps.includes(e),o=i.completedApps.includes(e);return`<button class="app-icon ${a?`is-unlocked`:`is-locked`} ${o?`is-completed`:``}" data-app-id="${e}" ${a?``:`data-locked="true"`}>
    <span class="app-glyph" style="--app-accent: ${r}">${n}</span>
    <span class="app-name">${t}</span>
    ${a?o?`<span class="completion-dot">✓</span>`:``:`<span class="lock-badge">⌑</span>`}
  </button>`}function qe(e,t){let n=x.find(t=>t.id===e.currentApp);return n?n.id===1?Je(e,t):n.id===2?Ye(e,t):n.id===3?Xe(e,t):n.id===4?W(e,t):n.id===5?Ze(e,t):n.id===6?Qe(e,t):n.id===7?$e(e,t):n.id===8?et(e,t):n.id===9?tt(e,t):_(e,t):U(e,``)}function Je(e,t){return`
    <main class="phone-shell notes-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen notes-screen" data-screen="app">
        ${G()}
        ${ue(e,t)}
        <div class="home-indicator"></div>
      </div>
    </main>`}function Ye(e,t){return`
    <main class="phone-shell gallery-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen gallery-screen" data-screen="app">
        ${G()}
        ${oe(e,t)}
        <div class="home-indicator"></div>
      </div>
    </main>`}function Xe(e,n){return`
    <main class="phone-shell calculator-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen calculator-screen" data-screen="app">
        ${G()}
        ${t(e,n)}
        <div class="home-indicator"></div>
      </div>
    </main>`}function W(e,t){return`
    <main class="phone-shell messages-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen messages-screen" data-screen="app">
        ${G()}
        ${he(e,t)}
        <div class="home-indicator"></div>
      </div>
    </main>`}function Ze(e,t){return`
    <main class="phone-shell maps-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen maps-screen" data-screen="app">
        ${G()}
        ${E(e,t)}
        <div class="home-indicator"></div>
      </div>
    </main>`}function Qe(e,t){return`
    <main class="phone-shell music-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen music-screen" data-screen="app">
        ${G()}
        ${M(e,t)}
        <div class="home-indicator"></div>
      </div>
    </main>`}function $e(e,t){return`
    <main class="phone-shell files-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen files-screen" data-screen="app">
        ${G()}
        ${ye(e,t)}
        <div class="home-indicator"></div>
      </div>
    </main>`}function et(e,t){return`
    <main class="phone-shell calendar-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen calendar-screen" data-screen="app">
        ${G()}
        ${De(e,t)}
        <div class="home-indicator"></div>
      </div>
    </main>`}function tt(e,t){return`
    <main class="phone-shell browser-shell">
      <div class="speaker"></div>
      <div class="phone-screen app-screen browser-screen" data-screen="app">
        ${G()}
        ${Pe(e,t)}
        <div class="home-indicator"></div>
      </div>
    </main>`}function G(){return`<div class="status-bar"><span>10:42</span><span>▮▮▮ 87%</span></div>`}var K=u();if(K.introCompleted=!1,K.currentScreen=`lock`,K.phoneUnlocked=!1,H(K),!K.introCompleted){let e=document.querySelector(`.intro-video`),t=!1;e?.addEventListener(`ended`,()=>{t||(t=!0,K.introCompleted=!0,d(K),H(K))})}setInterval(()=>d(K),250),document.addEventListener(`submit`,e=>{let t=e.target;if(t.dataset.action===`unlock`){if(e.preventDefault(),new FormData(t).get(`passcode`)!==`7391`){H(K,`Incorrect passcode`),document.querySelector(`#passcode`)?.focus();return}K.phoneUnlocked=!0,K.currentScreen=`home`,H(K)}}),document.addEventListener(`click`,e=>{let t=e.target,n=t.closest(`[data-action]`),r=t.closest(`[data-app-id]`);if(n?.dataset.action===`home`){K.currentScreen=`home`,K.currentApp=null,K.currentNote=null,K.notesView=`list`,K.currentPhoto=null,K.galleryView=`grid`,K.galleryHintLevel=0,q(),J(),Y(),X(),Z(),Q(),$(),H(K);return}if(n?.dataset.action===`notes-list`){K.currentNote=null,K.notesView=`list`,H(K);return}if(n?.dataset.action===`hint`){H(K,`Think about the positions described in the note.`);return}if(n?.dataset.action===`dismiss-success`){K.currentScreen=`home`,K.currentApp=null,K.currentNote=null,K.notesView=`list`,K.currentPhoto=null,K.galleryView=`grid`,K.galleryHintLevel=0,q(),J(),Y(),X(),Z(),Q(),$(),H(K);return}if(n?.dataset.action===`gallery-grid`){K.currentPhoto=null,K.galleryView=`grid`,H(K);return}if(n?.dataset.action===`gallery-hint`){K.galleryHintLevel=Math.min(2,K.galleryHintLevel+1),H(K);return}if(n?.dataset.action===`dismiss-gallery-success`){K.currentScreen=`home`,K.currentApp=null,K.currentPhoto=null,K.galleryView=`grid`,K.galleryHintLevel=0,H(K);return}if(n?.dataset.action===`calculator-main`){K.calculatorView=`calculator`,H(K);return}if(n?.dataset.action===`calculator-history`){K.calculatorView=`history`,H(K);return}if(n?.dataset.action===`calculator-hint`){K.calculatorHintLevel=Math.min(2,K.calculatorHintLevel+1),H(K);return}if(n?.dataset.action===`dismiss-calculator-success`){K.currentScreen=`home`,K.currentApp=null,q(),H(K);return}if(n?.dataset.action===`messages-list`){K.currentConversation=null,K.messagesView=`list`,H(K);return}if(n?.dataset.action===`messages-hint`){K.messagesHintLevel=Math.min(2,K.messagesHintLevel+1),H(K);return}if(n?.dataset.action===`dismiss-messages-success`){K.currentScreen=`home`,K.currentApp=null,J(),H(K);return}if(n?.dataset.action===`maps-overview`){Y(),H(K);return}if(n?.dataset.action===`maps-hint`){K.mapsHintLevel=Math.min(2,K.mapsHintLevel+1),H(K);return}if(n?.dataset.action===`dismiss-maps-success`){K.currentScreen=`home`,K.currentApp=null,Y(),H(K);return}if(n?.dataset.action===`music-hint`){K.musicHintLevel=Math.min(2,K.musicHintLevel+1),H(K);return}if(n?.dataset.action===`dismiss-music-success`){K.currentScreen=`home`,K.currentApp=null,X(),H(K);return}if(n?.dataset.action===`files-list`){K.currentFile=null,K.filesView=`list`,H(K);return}if(n?.dataset.action===`files-hint`){K.filesHintLevel=Math.min(2,K.filesHintLevel+1),H(K);return}if(n?.dataset.action===`dismiss-files-success`){K.currentScreen=`home`,K.currentApp=null,Z(),H(K);return}if(n?.dataset.action===`calendar-month`){K.currentCalendarEvent=null,K.calendarView=`month`,H(K);return}if(n?.dataset.action===`calendar-day`){K.currentCalendarEvent=null,K.calendarView=`day`,H(K);return}if(n?.dataset.action===`calendar-hint`){K.calendarHintLevel=Math.min(2,K.calendarHintLevel+1),H(K);return}if(n?.dataset.action===`dismiss-calendar-success`){K.currentScreen=`home`,K.currentApp=null,Q(),H(K);return}if(n?.dataset.action===`browser-recent`){K.browserQuery=`northbridge cafe`,K.browserView=`results`,K.currentBrowserPage=null,H(K);return}if(n?.dataset.action===`browser-results`){K.currentBrowserPage=null,K.browserView=`results`,H(K);return}if(n?.dataset.action===`browser-hint`){K.browserHintLevel=Math.min(2,K.browserHintLevel+1),H(K);return}if(n?.dataset.action===`unknown-hint`){K.unknownHintLevel=Math.min(3,K.unknownHintLevel+1),H(K);return}if(n?.dataset.action===`unknown-order`){K.unknownStage=`ordering`,K.unknownOrder=p.map(e=>K.unknownMatchedClues[e]),H(K);return}if(n?.dataset.action===`unknown-confirm-order`){if(K.unknownOrder.join(`|`)!==p.map(e=>K.unknownMatchedClues[e]).join(`|`)){H(K,`The trail doesn't begin there.`);return}K.unknownStage=`name`,H(K);return}if(n?.dataset.action===`unknown-owner`){K.unknownStage=`owner`,H(K);return}if(n?.dataset.action===`unknown-next`){K.unknownEndingStep>=6?(K.unknownStage=`complete`,K.gameCompleted=!0):K.unknownEndingStep+=1,H(K);return}if(n?.dataset.action===`unknown-review`){K.unknownStage=`review`,H(K);return}if(n?.dataset.action===`unknown-close-review`||n?.dataset.action===`unknown-complete`){K.unknownStage=K.gameCompleted?`complete`:`owner`,H(K);return}if(n?.dataset.action===`dismiss-browser-success`){K.currentScreen=`home`,K.currentApp=null,$(),H(K);return}let i=t.closest(`[data-note-id]`);if(i&&K.currentApp===1){K.currentNote=Number(i.dataset.noteId),K.notesView=`detail`,H(K);return}let o=t.closest(`[data-photo-id]`);if(o&&K.currentApp===2){K.currentPhoto=Number(o.dataset.photoId),K.galleryView=`viewer`,H(K);return}let s=t.closest(`[data-conversation-id]`);if(s&&K.currentApp===4){K.currentConversation=Number(s.dataset.conversationId),K.messagesView=`conversation`,H(K);return}let c=t.closest(`[data-location-id]`);if(c&&K.currentApp===5){K.currentLocation=Number(c.dataset.locationId),K.mapsView=`location`,H(K);return}let l=t.closest(`[data-file-id]`);if(l&&K.currentApp===7){K.currentFile=Number(l.dataset.fileId),K.filesView=`detail`,H(K);return}let u=t.closest(`[data-calendar-day]`);if(u&&K.currentApp===8){K.currentCalendarDay=Number(u.dataset.calendarDay),K.calendarView=`day`,K.currentCalendarEvent=null,H(K);return}let d=t.closest(`[data-calendar-event]`);if(d&&K.currentApp===8){K.currentCalendarEvent=Number(d.dataset.calendarEvent),K.calendarView=`event`,H(K);return}let f=t.closest(`[data-browser-page]`);if(f&&K.currentApp===9){K.currentBrowserPage=Number(f.dataset.browserPage),K.browserView=`page`,H(K);return}let m=t.closest(`[data-unknown-clue]`);if(m&&K.currentApp===10){K.unknownSelectedClue=m.dataset.unknownClue??null,H(K);return}let h=t.closest(`[data-unknown-fragment]`);if(h&&K.currentApp===10&&K.unknownSelectedClue){let e=h.dataset.unknownFragment??``,t=p.indexOf(K.unknownSelectedClue);if(e!==`FRAGMENT-${String(t+1).padStart(2,`0`)}`){H(K,`Those two pieces don't belong together.`);return}K.unknownMatchedClues[K.unknownSelectedClue]=e,K.unknownSelectedClue=null,H(K);return}let g=t.closest(`[data-unknown-move]`);if(g&&K.currentApp===10){let e=Number(g.dataset.unknownIndex),t=g.dataset.unknownMove===`up`?e-1:e+1;t>=0&&t<K.unknownOrder.length&&([K.unknownOrder[e],K.unknownOrder[t]]=[K.unknownOrder[t],K.unknownOrder[e]]),H(K);return}let _=t.closest(`[data-track-id]`);if(_&&K.currentApp===6){K.selectedTrack=Number(_.dataset.trackId),H(K);return}let v=t.closest(`[data-calc]`);if(v&&K.currentApp===3){a(K,v.dataset.calc??``),H(K);return}if(!r)return;let y=Number(r.dataset.appId);if(!K.unlockedApps.includes(y)){H(K,`This app is locked.`);return}K.currentScreen=`app`,K.currentApp=y,K.currentNote=null,K.notesView=`list`,K.currentPhoto=null,K.galleryView=`grid`,K.galleryHintLevel=0,q(),J(),Y(),X(),Z(),Q(),$(),y===10&&K.gameCompleted&&(K.unknownStage=`complete`),H(K)}),document.addEventListener(`submit`,e=>{let t=e.target;if(t.dataset.action!==`solve-unknown`)return;e.preventDefault();let n=String(new FormData(t).get(`answer`)??``).trim().toLowerCase().replace(/\s+/g,` `);if(n!==`alexander reed`&&n!==`alexander r.`){H(K,`That identity doesn't match the recovered trail.`);return}f(K,10),K.finalIdentity=`Alexander Reed`,K.gameCompleted=!0,K.unknownStage=`ending`,K.unknownEndingStep=0,H(K)}),document.addEventListener(`submit`,e=>{let t=e.target;if(t.dataset.action===`search-browser`){e.preventDefault(),K.browserQuery=String(new FormData(t).get(`query`)??``),K.currentBrowserPage=null,K.browserView=`results`,H(K);return}if(t.dataset.action!==`solve-browser`)return;e.preventDefault();let n=String(new FormData(t).get(`answer`)??``).trim().toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).replace(/\s+/g,` `);if(n!==`willow street`&&n!==`14 willow street`){H(K,`The sources point somewhere more specific.`);return}f(K,9,`Willow Street`),K.browserView=`success`,H(K)}),document.addEventListener(`submit`,e=>{let t=e.target;if(t.dataset.action!==`solve-calendar`)return;e.preventDefault();let n=String(new FormData(t).get(`answer`)??``).trim().toLowerCase().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).replace(/\s*[—-]\s*/g,` - `).replace(/\s+/g,` `);if(n!==`leave`&&n!==`leave - northbridge cafe`){H(K,`Check what happened next in time.`);return}f(K,8,`18:20`),K.calendarView=`success`,H(K)}),document.addEventListener(`input`,e=>{let t=e.target;t.id===`file-search`&&(K.filesSearch=t.value,H(K),document.querySelector(`#file-search`)?.focus())}),document.addEventListener(`submit`,e=>{let t=e.target;if(t.dataset.action!==`solve-files`)return;e.preventDefault();let n=String(new FormData(t).get(`answer`)??``).trim().toLowerCase();if((n.endsWith(`.txt`)?n.slice(0,-4):n)!==`backup_old`){H(K,`That file doesn't match all the clues.`);return}f(K,7,`backup_old.txt`),K.filesView=`success`,H(K)}),document.addEventListener(`submit`,e=>{let t=e.target;if(t.dataset.action!==`solve-music`)return;e.preventDefault();let n=new FormData(t),r=String(n.get(`hour`)??``).trim(),i=String(n.get(`minute`)??``).trim();if(r!==`07`&&r!==`7`||i!==`14`){H(K,`The pattern doesn't continue that way.`);return}f(K,6,`07:14`),K.musicView=`success`,H(K)}),document.addEventListener(`submit`,e=>{let t=e.target;if(t.dataset.action===`solve-maps`){if(e.preventDefault(),String(new FormData(t).get(`answer`)??``).trim().normalize(`NFD`).replace(/[\u0300-\u036f]/g,``).toLowerCase()!==`northbridge cafe`){H(K,`That doesn't match the records.`);return}f(K,5,`Northbridge Café`),K.mapsView=`success`,H(K)}}),document.addEventListener(`submit`,e=>{let t=e.target;if(t.dataset.action!==`solve-messages`)return;e.preventDefault();let n=new FormData(t),r=String(n.get(`hour`)??``).trim(),i=String(n.get(`minute`)??``).trim();if(r!==`17`||i!==`55`){H(K,`Those clues don't fit together.`);return}f(K,4,`17:55`),K.messagesView=`success`,H(K)}),document.addEventListener(`submit`,e=>{let t=e.target;if(t.dataset.action===`solve-calculator`){if(e.preventDefault(),String(new FormData(t).get(`answer`)??``).trim()!==`55`){H(K,`That pattern doesn't fit.`);return}f(K,3,`55`),K.calculatorView=`success`,H(K)}}),document.addEventListener(`submit`,e=>{let t=e.target;if(t.dataset.action!==`solve-gallery`)return;e.preventDefault();let n=String(new FormData(t).get(`answer`)??``).trim().toUpperCase();if(n!==`003`&&n!==`3`&&n!==`IMG_003`){H(K,`That doesn't seem to be the one.`);return}f(K,2,`17`),K.galleryView=`success`,H(K)});function q(){K.calculatorView=`calculator`,K.calculatorHintLevel=0,K.calculatorDisplay=`0`,K.calculatorStoredValue=null,K.calculatorOperator=null,K.calculatorWaitingForOperand=!1}function J(){K.currentConversation=null,K.messagesView=`list`,K.messagesHintLevel=0}function Y(){K.currentLocation=null,K.mapsView=`overview`,K.mapsHintLevel=0}function X(){K.selectedTrack=null,K.musicView=`playlist`,K.musicHintLevel=0}function Z(){K.currentFile=null,K.filesView=`list`,K.filesSearch=``,K.filesHintLevel=0}function Q(){K.currentCalendarDay=14,K.currentCalendarEvent=null,K.calendarView=`month`,K.calendarHintLevel=0}function $(){K.currentBrowserPage=null,K.browserView=`search`,K.browserQuery=``,K.browserHintLevel=0}document.addEventListener(`submit`,e=>{let t=e.target;if(t.dataset.action===`solve-notes`){if(e.preventDefault(),String(new FormData(t).get(`answer`)??``).trim().toUpperCase()!==`8X7`){H(K,`That doesn't seem right.`);return}f(K,1,`A`),K.notesView=`success`,H(K)}});