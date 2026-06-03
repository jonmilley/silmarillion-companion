/* ============================================================
   app.js — rendering + interaction for the Silmarillion Companion.
   Content lives in data.js; this file wires it to the page and
   persists reading state to the browser via localStorage.
   ============================================================ */

/* ---------- storage layer (localStorage, with safe fallbacks) ---------- */
const KEY = {
  progress: 'silmarillion-progress',   // { chapterId: true }
  notes:    'silmarillion-notes',      // { chapterId: "note text" }
  tab:      'silmarillion-tab',         // last active tab id
};
const SCHEMA_VERSION = 1;

const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v == null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { return false; } // private mode / quota — state simply won't persist
  },
  remove(key) { try { localStorage.removeItem(key); } catch (e) {} },
};

let progress = store.get(KEY.progress, {}) || {};
let notes    = store.get(KEY.notes, {}) || {};

/* ---------- small helpers ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
// fold accents so "turin"/"feanor" match "Túrin"/"Fëanor"; precomposed chars keep 1:1 length
const fold = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const stripTags = s => s.replace(/<[^>]*>/g, '');

let toastTimer;
function toast(msg) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- starfield ---------- */
(function () {
  function field(id, count, size) {
    const el = document.getElementById(id);
    let html = '';
    for (let i = 0; i < count; i++) {
      const s = (Math.random() * size + 0.5).toFixed(1);
      html += `<span class="twinkle" style="left:${(Math.random() * 100).toFixed(2)}%;top:${(Math.random() * 100).toFixed(2)}%;width:${s}px;height:${s}px;--d:${(2 + Math.random() * 4).toFixed(1)}s;animation-delay:${(Math.random() * 4).toFixed(1)}s"></span>`;
    }
    el.innerHTML = html;
  }
  field('stars', 90, 1.8);
  field('stars2', 40, 2.6);
})();

/* ---------- tabs (with persistence) ---------- */
function activateTab(name, { scroll = true } = {}) {
  const tab = document.querySelector(`.tab[data-tab="${name}"]`);
  if (!tab) return;
  $$('.tab').forEach(x => x.classList.remove('active'));
  $$('.panel').forEach(p => p.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById(name).classList.add('active');
  store.set(KEY.tab, name);
  if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });
}
$$('.tab').forEach(t => t.addEventListener('click', () => activateTab(t.dataset.tab)));

/* ---------- render: tracker (The Tale) ---------- */
const allIds = SECTIONS.flatMap(s => s.chapters.map(c => c.id));

function renderTracker() {
  let html = '';
  SECTIONS.forEach(sec => {
    html += `<div class="sec-title">${sec.title}</div>`;
    sec.chapters.forEach(c => {
      const done = progress[c.id] ? 'done' : '';
      const idx = c.n ? `<span class="cidx">${c.n}.</span>` : '';
      const note = notes[c.id] || '';
      const hasNote = note.trim() ? 'has-note' : '';
      html += `
        <div class="chap ${done}" id="chap-${c.id}" data-id="${c.id}">
          <div class="mark" data-act="toggle">✦</div>
          <div class="body">
            <span class="ttl" data-act="toggle">${idx}${esc(c.t)}</span>
            <span class="desc">${esc(c.d)}</span>
            <button class="note-toggle ${hasNote}" data-act="note" type="button">
              <span class="dot"></span>${note.trim() ? 'note' : 'add note'}
            </button>
            <div class="note-editor">
              <textarea placeholder="Your thoughts on this chapter…">${esc(note)}</textarea>
              <div class="saved-hint">saved</div>
            </div>
          </div>
        </div>`;
    });
  });
  $('#trackerRoot').innerHTML = html;
  updateBar();
}

function toggle(id) {
  if (progress[id]) delete progress[id]; else progress[id] = true;
  const el = document.querySelector(`.chap[data-id="${id}"]`);
  el.classList.toggle('done', !!progress[id]);
  store.set(KEY.progress, progress);
  updateBar();
}

function updateBar() {
  const done = allIds.filter(i => progress[i]).length;
  const total = allIds.length;
  $('#pct').textContent = `${done} / ${total}`;
  $('#barFill').style.width = (total ? (done / total * 100) : 0) + '%';
}

/* delegated clicks on the tracker (toggle + note open) */
$('#trackerRoot').addEventListener('click', e => {
  const act = e.target.closest('[data-act]');
  if (!act) return;
  const chap = e.target.closest('.chap');
  const id = chap.dataset.id;
  if (act.dataset.act === 'toggle') toggle(id);
  if (act.dataset.act === 'note') {
    chap.querySelector('.note-editor').classList.toggle('open');
    chap.querySelector('textarea').focus();
  }
});

/* delegated, debounced note saving */
let noteTimers = {};
$('#trackerRoot').addEventListener('input', e => {
  if (e.target.tagName !== 'TEXTAREA') return;
  const chap = e.target.closest('.chap');
  const id = chap.dataset.id;
  const val = e.target.value;
  if (val.trim()) notes[id] = val; else delete notes[id];
  clearTimeout(noteTimers[id]);
  noteTimers[id] = setTimeout(() => {
    store.set(KEY.notes, notes);
    const toggleBtn = chap.querySelector('.note-toggle');
    toggleBtn.classList.toggle('has-note', !!val.trim());
    toggleBtn.lastChild.textContent = val.trim() ? 'note' : 'add note';
    const hint = chap.querySelector('.saved-hint');
    hint.classList.add('show');
    setTimeout(() => hint.classList.remove('show'), 1200);
  }, 450);
});

$('#resetBtn').addEventListener('click', () => {
  if (!confirm('Clear all your chapter checkmarks? (Your notes will be kept.)')) return;
  progress = {};
  store.set(KEY.progress, progress);
  renderTracker();
  toast('Progress reset');
});

/* ---------- export / import ---------- */
function exportData() {
  const payload = {
    app: 'silmarillion-companion',
    version: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    progress, notes,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `silmarillion-progress-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast('Progress exported');
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (data.app !== 'silmarillion-companion' && !data.progress && !data.notes) {
        throw new Error('Unrecognised file');
      }
      if (!confirm('Replace your current progress and notes with the contents of this file?')) return;
      progress = (data.progress && typeof data.progress === 'object') ? data.progress : {};
      notes    = (data.notes && typeof data.notes === 'object') ? data.notes : {};
      store.set(KEY.progress, progress);
      store.set(KEY.notes, notes);
      renderTracker();
      toast('Progress imported');
    } catch (e) {
      toast('Could not read that file');
    }
  };
  reader.readAsText(file);
}

$('#printBtn')?.addEventListener('click', () => window.print());
$('#exportBtn').addEventListener('click', exportData);
$('#importBtn').addEventListener('click', () => $('#importFile').click());
$('#importFile').addEventListener('change', e => {
  if (e.target.files[0]) importData(e.target.files[0]);
  e.target.value = '';
});

/* ---------- render: who's who ---------- */
(function () {
  let html = '';
  WHO.forEach(g => {
    html += `<div class="card"><div class="group-label">${g.label}</div><div class="group-note">${g.note}</div>`;
    g.people.forEach(p => {
      const alias = p.a ? ` <span class="alias">(${p.a})</span>` : '';
      html += `<div class="who" id="who-${slug(p.n)}"><span class="name">${p.n}</span>${alias}<span class="role">${p.r}</span></div>`;
    });
    html += '</div>';
  });
  $('#whoRoot').innerHTML = html;
})();

/* ---------- render: lexicon ---------- */
(function () {
  $('#lexRoot').innerHTML = LEX.map(([t, d]) =>
    `<dt id="lex-${slug(t)}">${t}</dt><dd>${d}</dd>`).join('');
})();

/* ---------- render: names ---------- */
(function () {
  $('#rulesRoot').innerHTML = RULES.map(([l, e]) =>
    `<div class="rule"><div class="letter">${l}</div><div class="ex">${e}</div></div>`).join('');
  $('#bankRoot').innerHTML = BANK.map(([n, p]) =>
    `<div class="chip" id="bank-${slug(n)}"><b>${n}</b><span>${p}</span></div>`).join('');
})();

/* ---------- render: timeline ---------- */
(function () {
  let html = '', i = 0;
  TIMELINE.forEach(g => {
    html += `<div class="era-head">${g.era}</div><div class="era-sub">${g.sub}</div><div class="tl">`;
    g.events.forEach(e => {
      const yr = e.y ? `<div class="yr">${e.y}</div>` : '';
      html += `<div class="ev" id="tl-${i++}">${yr}<div class="when">${e.w}</div><div class="what">${e.x}</div></div>`;
    });
    html += '</div>';
  });
  $('#timelineRoot').innerHTML = html;
})();

/* ---------- render: family trees ---------- */
function renderNode(n) {
  const key = n.key ? ' key' : '';
  const spouse = n.spouse ? `<span class="mq">⚭</span><span class="sp">${n.spouse}</span>` : '';
  const tag = n.tag ? `<span class="tag">${n.tag}</span>` : '';
  let h = `<div class="node"><span class="self"><span class="nm${key}">${n.name}</span>${spouse}</span>${tag}`;
  if (n.kids && n.kids.length) h += '<div class="kids">' + n.kids.map(renderNode).join('') + '</div>';
  h += '</div>';
  return h;
}
(function () {
  let html = '';
  html += `<div class="card"><h3>The House of Finwë &mdash; the Noldor</h3>
    <p class="tree-note">Why every other name starts with "Fin-." One king, three sons, and the cousins whose feud drives the book. <span style="color:var(--gold)">Gold</span> names are the ones to remember.</p>
    ${renderNode(TREE_FINWE)}</div>`;

  html += `<div class="card"><h3>The Half-elven &mdash; where the bloodlines meet</h3>
    <p class="tree-note">The story’s emotional payoff: two separate lines &mdash; one through Lúthien, one through Gondolin &mdash; converge in a single marriage.</p>
    <div style="font-family:'Cinzel',serif;color:var(--silver-deep);font-size:13px;letter-spacing:.1em;text-transform:uppercase;margin:8px 0 4px">Line One — through Lúthien</div>
    ${renderNode(TREE_LUTHIEN)}
    <div style="font-family:'Cinzel',serif;color:var(--silver-deep);font-size:13px;letter-spacing:.1em;text-transform:uppercase;margin:18px 0 4px">Line Two — through Gondolin</div>
    ${renderNode(TREE_GONDOLIN)}
    </div>`;

  html += `<div class="card union-card">
    <div style="font-family:'Cinzel',serif;color:var(--silver-deep);font-size:13px;letter-spacing:.12em;text-transform:uppercase;margin-bottom:10px">The two lines become one</div>
    <span class="nm">Eärendil</span><div class="plus">⚭</div><span class="nm">Elwing</span>
    <div class="down">↓</div>
    <div class="result">Elros &nbsp;&amp;&nbsp; Elrond</div>
    <p style="font-style:italic;color:var(--ink-dim);margin-top:10px;font-size:16px">Twin sons, each choosing a different fate: <b style="color:var(--silver);font-weight:600">Elros</b> takes mortality and founds the kings of Númenor; <b style="color:var(--silver);font-weight:600">Elrond</b> stays immortal &mdash; the lord of Rivendell you already know.</p>
  </div>`;

  $('#treesRoot').innerHTML = html;
})();

/* ---------- render: map of Beleriand ---------- */
(function () {
  function marker(id, x, y, label) {
    const lx = x > 520 ? x - 12 : x + 12;
    const anchor = x > 520 ? 'end' : 'start';
    const lbl = label ? `<text class="mlabel" x="${lx}" y="${y + 4}" text-anchor="${anchor}">${label}</text>` : '';
    return `<g class="mk" data-id="${id}"><circle cx="${x}" cy="${y}" r="5" fill="#e6c068" stroke="#070b16" stroke-width="1.5"/>${lbl}</g>`;
  }
  const tri = (x, y) => `<path d="M${x},${y} l8,16 l-16,0 Z" fill="#2a3142" stroke="#3a4358" stroke-width="0.6"/>`;
  function mtRow(x, y, n) { let s = ''; for (let i = 0; i < n; i++) { const px = x + i * ((520 - x) / n) * 2.0; if (px > 540) break; s += tri(px, y); } return s; }
  function mtArc() { let s = ''; [[150, 255], [200, 285], [255, 300], [305, 300]].forEach(p => s += tri(p[0], p[1])); return s; }
  function mtVert(x, y0, y1) { let s = ''; for (let y = y0; y < y1; y += 34) s += tri(x, y); return s; }
  function ringMts(cx, cy, r) { let s = ''; for (let a = 0; a < 360; a += 45) { const x = cx + r * Math.cos(a * Math.PI / 180); const y = cy + r * Math.sin(a * Math.PI / 180); s += tri(x, y - 8); } return s; }
  function rangeText(t, x, y, vert) {
    if (vert) return `<text class="rangelabel" x="${x}" y="${y}" transform="rotate(90 ${x} ${y})" text-anchor="middle">${t}</text>`;
    return `<text class="rangelabel" x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
  }

  const svg = `
  <svg viewBox="0 0 720 940" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Schematic map of Beleriand">
    <defs>
      <linearGradient id="seaG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a1530"/><stop offset="1" stop-color="#0c1426"/></linearGradient>
      <linearGradient id="landG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#13182a"/><stop offset="1" stop-color="#10151f"/></linearGradient>
    </defs>
    <rect x="0" y="0" width="720" height="940" fill="url(#seaG)"/>
    <path d="M150,40 L640,40 L660,300 L640,520 L600,720 L470,880 L300,870 L250,760 L180,690 L150,560 L120,470 L150,360 L120,250 L150,140 Z" fill="url(#landG)" stroke="rgba(207,224,242,0.25)" stroke-width="1.5"/>
    <ellipse cx="430" cy="540" rx="120" ry="120" fill="rgba(138,166,200,0.06)" stroke="rgba(207,224,242,0.18)" stroke-dasharray="4 5"/>
    <ellipse cx="335" cy="370" rx="58" ry="50" fill="rgba(230,192,104,0.05)"/>
    <path d="M380,150 Q360,400 330,560 Q310,720 300,860" fill="none" stroke="#3a6ea0" stroke-width="2.4" opacity="0.7"/>
    <path d="M300,330 Q270,470 320,560" fill="none" stroke="#3a6ea0" stroke-width="1.8" opacity="0.6"/>
    <path d="M600,250 Q610,500 600,800" fill="none" stroke="#3a6ea0" stroke-width="1.8" opacity="0.6"/>
    <text class="rlabel" x="345" y="430" transform="rotate(82 345 430)">Sirion</text>
    <text class="rlabel" x="612" y="540" transform="rotate(86 612 540)">Gelion</text>
    ${mtRow(190, 70, 18)}
    ${rangeText('Ered Engrin — the Iron Mountains', 360, 30)}
    ${mtArc()}
    ${rangeText('Ered Wethrin', 170, 300)}
    ${mtVert(648, 210, 640)}
    ${rangeText('Ered Luin', 640, 470, true)}
    ${ringMts(335, 370, 52)}
    ${rangeText('Echoriath', 335, 318)}
    <text class="sealabel" x="42" y="480" transform="rotate(-90 42 480)">The Great Sea &mdash; Belegaer</text>
    <text class="rangelabel" x="180" y="200">HITHLUM</text>
    <text class="rangelabel" x="400" y="250">DORTHONION</text>
    <text class="rangelabel" x="420" y="560">DORIATH</text>
    <text class="rangelabel" x="540" y="540">EAST BELERIAND</text>
    <text class="rangelabel" x="560" y="690">OSSIRIAND</text>
    <text class="rangelabel" x="150" y="560">THE&#160;FALAS</text>
    ${marker('angband', 360, 110, 'Angband')}
    ${marker('hithlum', 195, 225, '')}
    ${marker('dorthonion', 430, 275, '')}
    ${marker('gondolin', 335, 372, 'Gondolin')}
    ${marker('doriath', 430, 520, 'Menegroth')}
    ${marker('nargothrond', 265, 575, 'Nargothrond')}
    ${marker('falas', 135, 505, 'Eglarest')}
    ${marker('himring', 560, 250, 'Himring')}
    ${marker('ossiriand', 600, 680, '')}
    ${marker('sirion', 300, 855, 'Mouths of Sirion')}
  </svg>`;

  $('#mapHolder').innerHTML = svg;
  $$('#mapHolder .mk').forEach(g => {
    g.addEventListener('click', () => selectPlace(g.dataset.id));
  });
})();

function selectPlace(id) {
  $$('#mapHolder .mk').forEach(x => x.classList.remove('sel'));
  const g = document.querySelector(`#mapHolder .mk[data-id="${id}"]`);
  if (g) g.classList.add('sel');
  $('#mapCaption').textContent = PLACES[id] || '';
}

/* ---------- search across all content ---------- */
const searchIndex = (() => {
  const idx = [];
  SECTIONS.forEach(s => s.chapters.forEach(c =>
    idx.push({ cat: 'Chapters', title: (c.n ? c.n + '. ' : '') + c.t, text: c.d, tab: 'tale', sel: `#chap-${c.id}` })));
  WHO.forEach(g => g.people.forEach(p =>
    idx.push({ cat: 'Who’s Who', title: p.n + (p.a ? ` (${p.a})` : ''), text: p.r, tab: 'who', sel: `#who-${slug(p.n)}` })));
  LEX.forEach(([t, d]) =>
    idx.push({ cat: 'Lexicon', title: t, text: d, tab: 'lexicon', sel: `#lex-${slug(t)}` }));
  let ti = 0;
  TIMELINE.forEach(g => g.events.forEach(e =>
    idx.push({ cat: 'Timeline', title: (e.y ? e.y + ' — ' : '') + e.w, text: stripTags(e.x), tab: 'timeline', sel: `#tl-${ti++}` })));
  Object.entries(PLACES).forEach(([id, txt]) =>
    idx.push({ cat: 'Map', title: txt.split(/[—,(]/)[0].trim(), text: txt, tab: 'map', place: id }));
  BANK.forEach(([n, p]) =>
    idx.push({ cat: 'Pronunciation', title: n, text: p, tab: 'names', sel: `#bank-${slug(n)}` }));
  return idx;
})();

// q is already accent-folded; folding preserves char count for our precomposed text,
// so folded indices line up with the original string.
function highlight(text, q) {
  const i = fold(text).indexOf(q);
  if (i < 0) return esc(text.length > 90 ? text.slice(0, 88) + '…' : text);
  const start = Math.max(0, i - 30);
  let snip = (start > 0 ? '…' : '') + text.slice(start);
  if (snip.length > 100) snip = snip.slice(0, 98) + '…';
  const j = fold(snip).indexOf(q);
  if (j < 0) return esc(snip);
  return esc(snip.slice(0, j)) + '<mark>' + esc(snip.slice(j, j + q.length)) + '</mark>' + esc(snip.slice(j + q.length));
}

function runSearch(qRaw) {
  const box = $('#searchBox');
  const results = $('#searchResults');
  const q = fold(qRaw.trim());
  box.classList.toggle('has-text', !!qRaw);
  if (!q) { results.classList.remove('open'); results.innerHTML = ''; return; }

  const hits = searchIndex
    .map(r => {
      const inTitle = fold(r.title).includes(q);
      const inText = fold(r.text).includes(q);
      if (!inTitle && !inText) return null;
      return { r, score: inTitle ? 0 : 1 };
    })
    .filter(Boolean)
    .sort((a, b) => a.score - b.score)
    .slice(0, 24);

  if (!hits.length) {
    results.innerHTML = `<div class="sr-empty">No matches for “${esc(qRaw)}”.</div>`;
    results.classList.add('open');
    return;
  }

  // group by category (ordered by each category's best hit), so headers never repeat
  const groups = [];
  hits.forEach(({ r }) => {
    let g = groups.find(x => x.cat === r.cat);
    if (!g) { g = { cat: r.cat, items: [] }; groups.push(g); }
    g.items.push(r);
  });

  let html = '', first = true;
  groups.forEach(g => {
    html += `<div class="sr-cat">${g.cat}</div>`;
    g.items.forEach(r => {
      const dataPlace = r.place ? ` data-place="${r.place}"` : '';
      html += `<button class="sr-item${first ? ' active' : ''}" data-tab="${r.tab}" data-sel="${r.sel || ''}"${dataPlace} type="button">
        <span class="sr-title">${esc(r.title)}</span>
        <span class="sr-snippet">${highlight(r.text, q)}</span>
      </button>`;
      first = false;
    });
  });
  results.innerHTML = html;
  results.classList.add('open');
}

function jumpTo(el) {
  activateTab(el.dataset.tab, { scroll: false });
  closeSearch();
  setTimeout(() => {
    if (el.dataset.place) {
      selectPlace(el.dataset.place);
      $('#map').scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const target = el.dataset.sel ? document.querySelector(el.dataset.sel) : null;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.remove('flash'); void target.offsetWidth; target.classList.add('flash');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, 60);
}

function closeSearch() {
  $('#searchResults').classList.remove('open');
}

(function wireSearch() {
  const input = $('#searchInput');
  const results = $('#searchResults');
  input.addEventListener('input', () => runSearch(input.value));
  input.addEventListener('focus', () => { if (input.value.trim()) runSearch(input.value); });
  $('#searchClear').addEventListener('click', () => { input.value = ''; runSearch(''); input.focus(); });

  results.addEventListener('click', e => {
    const item = e.target.closest('.sr-item');
    if (item) jumpTo(item);
  });

  // keyboard: arrow navigation + enter + escape
  input.addEventListener('keydown', e => {
    const items = $$('.sr-item', results);
    let idx = items.findIndex(x => x.classList.contains('active'));
    if (e.key === 'ArrowDown' && items.length) {
      e.preventDefault(); idx = Math.min(items.length - 1, idx + 1);
      items.forEach(x => x.classList.remove('active')); items[idx].classList.add('active');
      items[idx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp' && items.length) {
      e.preventDefault(); idx = Math.max(0, idx - 1);
      items.forEach(x => x.classList.remove('active')); items[idx].classList.add('active');
      items[idx].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && items[idx]) {
      e.preventDefault(); jumpTo(items[idx]);
    } else if (e.key === 'Escape') {
      input.value = ''; runSearch(''); input.blur();
    }
  });

  // dismiss results when clicking away
  document.addEventListener('click', e => {
    if (!e.target.closest('#searchBox')) closeSearch();
  });
})();

/* ---------- PWA: install prompt + service worker ---------- */
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = $('#installBtn');
  if (btn) btn.style.display = 'inline-flex';
});
const installBtn = $('#installBtn');
if (installBtn) {
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.style.display = 'none';
  });
}
window.addEventListener('appinstalled', () => {
  if (installBtn) installBtn.style.display = 'none';
  toast('Installed — find it on your home screen');
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

/* ---------- init ---------- */
renderTracker();
activateTab(store.get(KEY.tab, 'begin') || 'begin', { scroll: false });
