'use strict';

/* ================================================================
   UTILITIES
   ================================================================ */

function esc(v) {
  if (v == null) return '';
  return String(v)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function loadJSON(path) {
  const r = await fetch(path);
  if (!r.ok) throw new Error('Cannot load ' + path);
  return r.json();
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val || '';
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html || '';
}


/* ================================================================
   DARK MODE
   ================================================================ */

function initDark() {
  if (localStorage.getItem('dark') === '1') document.body.classList.add('dark');

  document.querySelectorAll('.dark-toggle').forEach(btn => {
    updateToggleLabel(btn);
    btn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const on = document.body.classList.contains('dark');
      localStorage.setItem('dark', on ? '1' : '0');
      document.querySelectorAll('.dark-toggle').forEach(b => updateToggleLabel(b));
    });
  });
}

function updateToggleLabel(btn) {
  btn.textContent = document.body.classList.contains('dark') ? '☀' : '☾';
}


/* ================================================================
   NAVIGATION
   ================================================================ */

function initNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page ||
        (page === '' && a.getAttribute('href') === 'index.html')) {
      a.classList.add('active');
    }
  });

  const ham = document.querySelector('.hamburger');
  const nav = document.querySelector('.left-nav');
  if (ham && nav) {
    ham.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => nav.classList.remove('open'))
    );
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !ham.contains(e.target))
        nav.classList.remove('open');
    });
  }
}


/* ================================================================
   GLOBAL SEARCH ENGINE
   ================================================================ */

let SEARCH_INDEX = null;
let activeIdx    = -1;

const SEARCH_ICONS = {
  Home        : '🏠',
  About       : '👤',
  Publications: '📄',
  Projects    : '🚀',
  Teaching    : '🎓',
  Students    : '👨‍🎓',
  Lectures    : '🎤',
  News        : '📰'
};

function debounce(fn, delay) {
  delay = delay || 200;
  var t;
  return function() {
    var args = arguments;
    clearTimeout(t);
    t = setTimeout(function() { fn.apply(null, args); }, delay);
  };
}

async function buildSearchIndex() {
  if (SEARCH_INDEX) return SEARCH_INDEX;
  SEARCH_INDEX = [];

  var sources = [
    { f:'data/home.json',     page:'index.html',    label:'Home'         },
    { f:'data/about.json',    page:'about.html',    label:'About'        },
    { f:'data/lab.json',      page:'lab.html',      label:'Publications' },
    { f:'data/projects.json', page:'projects.html', label:'Projects'     },
    { f:'data/teaching.json', page:'teaching.html', label:'Teaching'     },
    { f:'data/students.json', page:'students.html', label:'Students'     },
    { f:'data/lectures.json', page:'lectures.html', label:'Lectures'     },
    { f:'data/news.json',     page:'news.html',     label:'News'         }
  ];

  for (var i = 0; i < sources.length; i++) {
    try {
      var res = await fetch(sources[i].f);
      var d   = await res.json();
      indexDataSearch(d, sources[i].page, sources[i].label);
    } catch(e) {}
  }
  return SEARCH_INDEX;
}

function addItem(title, text, page, label) {
  SEARCH_INDEX.push({
    title : title,
    text  : (text || '').toLowerCase(),
    page  : page,
    label : label
  });
}

function indexDataSearch(d, page, label) {
  if (d.publications)
    d.publications.forEach(function(p) {
      addItem(p.title,
        [p.title, p.venue, p.description, (p.tags||[]).join(' '), p.abstract||''].join(' '),
        page, label);
    });

  if (d.projects)
    d.projects.forEach(function(p) {
      addItem(p.name,
        [p.name, p.description, p.funding||''].join(' '),
        page, label);
    });

  if (d.teaching)
    d.teaching.forEach(function(t) {
      addItem(t.subjects.join(', '),
        [t.subjects.join(' '), t.institute, t.notes||''].join(' '),
        page, label);
    });

  if (d.current_students)
    d.current_students.forEach(function(s) {
      addItem(s.name,
        [s.name, s.degree, s.topic||'',
         (s.papers||[]).map(function(p){return p.title+' '+(p.venue||'');}).join(' ')
        ].join(' '),
        page, label);
    });
 if (d.ms_students)
    d.ms.forEach(function(s) {
      addItem(s.name,
        [s.name, s.degree, s.topic||'',
         (s.papers||[]).map(function(p){return p.title+' '+(p.venue||'');}).join(' ')
        ].join(' '),
        page, label);
    });
if (d.dual_degre)
    d.dual_degre.forEach(function(s) {
      addItem(s.name,
        [s.name, s.degree, s.topic||'',
         (s.papers||[]).map(function(p){return p.title+' '+(p.venue||'');}).join(' ')
        ].join(' '),
        page, label);
    });
if (d.mphil)
    d.mphil.forEach(function(s) {
      addItem(s.name,
        [s.name, s.degree, s.topic||'',
         (s.papers||[]).map(function(p){return p.title+' '+(p.venue||'');}).join(' ')
        ].join(' '),
        page, label);
    });

  if (d.alumni)
    d.alumni.forEach(function(s) {
      addItem(s.name,
        [s.name, s.degree, s.placement||'',
         (s.papers||[]).map(function(p){return p.title+' '+(p.venue||'');}).join(' ')
        ].join(' '),
        page, label);
    });

  if (d.research_staff)
    d.research_staff.forEach(function(s) {
      addItem(s.name,
        [s.name, s.degree, s.topic||'',
         (s.papers||[]).map(function(p){return p.title+' '+(p.venue||'');}).join(' ')
        ].join(' '),
        page, label);
    });

  if (d.research_interns)
    d.research_interns.forEach(function(s) {
      addItem(s.name,
        [s.name, s.degree, s.topic||'',
         (s.papers||[]).map(function(p){return p.title+' '+(p.venue||'');}).join(' ')
        ].join(' '),
        page, label);
    });

  if (d.lectures)
    d.lectures.forEach(function(l) {
      addItem(l.title,
        [l.title, l.institution, l.description].join(' '),
        page, label);
    });

  // if (d.news)
  //   d.news.forEach(function(n) {
  //     addItem(n.title,
  //       [n.title, n.description, n.category].join(' '),
  //       page, label);
  //   });
  if (d.news)
    d.news.forEach(function(n) {
      addItem(n.description.slice(0, 60),
        [n.description, n.category].join(' '),
        page, label);
    });

  if (d.introduction)
    addItem('Introduction', d.introduction, page, label);
  if (d.biography)
    addItem('Biography', d.biography.join(' '), page, label);
  if (d.academic_philosophy)
    addItem('Academic Philosophy', d.academic_philosophy, page, label);
}

function runSearch(q) {
  if (!SEARCH_INDEX || !q.trim()) return [];
  var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  var seen  = {};
  var res   = [];

  for (var i = 0; i < SEARCH_INDEX.length; i++) {
    var item = SEARCH_INDEX[i];
    var key  = item.page + '|' + item.title;
    var hit  = terms.every(function(t) { return item.text.indexOf(t) !== -1; });
    if (hit && !seen[key]) {
      seen[key] = true;
      res.push(item);
      if (res.length >= 5) break;
    }
  }
  return res;
}

function highlight(text, terms) {
  var result = esc(text);
  terms.forEach(function(t) {
    var safe = t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    result = result.replace(new RegExp('(' + safe + ')', 'ig'), '<mark>$1</mark>');
  });
  return result;
}


/* ================================================================
   OVERLAY OPEN / CLOSE
   ================================================================ */

function openSearch() {
  var overlay = document.getElementById('search-overlay');
  var input   = document.getElementById('global-search-input');
  if (!overlay) return;
  overlay.classList.add('open');
  if (input) { input.focus(); input.select(); }
}

function closeSearch() {
  var overlay = document.getElementById('search-overlay');
  var input   = document.getElementById('global-search-input');
  var results = document.getElementById('search-results');
  if (overlay) overlay.classList.remove('open');
  if (input)   input.value = '';
  if (results) results.innerHTML = '';
  activeIdx = -1;
}


function injectSearchOverlay() {
  if (document.getElementById('search-overlay')) return; 

  var el = document.createElement('div');
  el.id        = 'search-overlay';
  el.className = 'search-overlay';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-modal', 'true');
  el.setAttribute('aria-label', 'Search');

  el.innerHTML = [
    '<div class="search-modal">',
    '  <div class="search-modal-header">',
    '    <span class="search-modal-label">Search</span>',
    '    <button id="search-close" class="search-close-btn" aria-label="Close search">✕</button>',
    '  </div>',
    '  <input',
    '    id="global-search-input"',
    '    type="search"',
    '    placeholder="Search publications, projects, news…"',
    '    autocomplete="off"',
    '    spellcheck="false"',
    '  />',
    '  <div id="search-results" class="search-results" role="listbox"></div>',
    '  <div class="search-hint">',
    '    ↑ ↓ navigate &nbsp;·&nbsp; ↵ open &nbsp;·&nbsp; Esc close &nbsp;·&nbsp; Ctrl K anywhere',
    '  </div>',
    '</div>'
  ].join('\n');

  document.body.insertBefore(el, document.body.firstChild);
}



function initSearch() {

  injectSearchOverlay();

  buildSearchIndex().catch(function() {});

  var sidebarForm  = document.querySelector('.nav-search');
  var sidebarInput = sidebarForm && sidebarForm.querySelector('input');
  var sidebarBtn   = sidebarForm && sidebarForm.querySelector('button');

  if (sidebarInput) {
    sidebarInput.setAttribute('readonly', 'readonly');
    sidebarInput.setAttribute('placeholder', 'Search… (Ctrl K)');
    sidebarInput.style.cursor = 'pointer';

    sidebarInput.addEventListener('mousedown', function(e) {
      e.preventDefault();
      openSearch();
    });
    sidebarInput.addEventListener('focus', function(e) {
      e.preventDefault();
      sidebarInput.blur();
      openSearch();
    });
    sidebarInput.addEventListener('keydown', function(e) {
      if (e.key !== 'Tab') { e.preventDefault(); openSearch(); }
    });
  }

  if (sidebarBtn) {
    sidebarBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openSearch();
    });
  }

  if (sidebarForm) {
    sidebarForm.style.cursor = 'pointer';
    sidebarForm.addEventListener('click', function() { openSearch(); });
  }

  var overlay = document.getElementById('search-overlay');
  var input   = document.getElementById('global-search-input');
  var results = document.getElementById('search-results');

  if (!overlay || !input || !results) return;

  var doSearch = debounce(function() {
    var q = input.value.trim();

    if (!q) {
      results.innerHTML = '';
      activeIdx = -1;
      return;
    }

    buildSearchIndex().then(function() {
      var matches = runSearch(q);
      var terms   = q.split(/\s+/).filter(Boolean);

      if (!matches.length) {
        results.innerHTML =
          '<div class="search-item" style="cursor:default;">' +
          '<div class="search-type">No results</div>' +
          '<div class="search-title" style="font-style:normal;color:var(--text-muted);">' +
          'Try a different keyword.</div></div>';
        activeIdx = -1;
        return;
      }

      results.innerHTML = matches.map(function(r, i) {
        return [
          '<div class="search-item" data-url="' + esc(r.page) + '" data-i="' + i + '" role="option" tabindex="-1">',
          '  <div class="search-type">' + (SEARCH_ICONS[r.label] || '') + '&nbsp;' + esc(r.label) + '</div>',
          '  <div class="search-title">' + highlight(r.title, terms) + '</div>',
          '</div>'
        ].join('');
      }).join('');

      activeIdx = -1;
    }).catch(function() {});

  }, 200);

  input.addEventListener('input', doSearch);

  results.addEventListener('click', function(e) {
    var item = e.target.closest('.search-item');
    if (item && item.dataset.url) location.href = item.dataset.url;
  });

  input.addEventListener('keydown', function(e) {
    var items = Array.prototype.slice.call(
      results.querySelectorAll('.search-item[data-url]')
    );

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = Math.min(activeIdx + 1, items.length - 1);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
    }

    items.forEach(function(el) { el.classList.remove('active'); });
    if (items[activeIdx]) {
      items[activeIdx].classList.add('active');
      items[activeIdx].scrollIntoView({ block: 'nearest' });
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      var el = items[activeIdx] || items[0];
      if (el && el.dataset.url) location.href = el.dataset.url;
    }

    if (e.key === 'Escape') closeSearch();
  });

  var closeBtn = document.getElementById('search-close');
  if (closeBtn) closeBtn.addEventListener('click', closeSearch);

  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeSearch();
  });

  document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearch();
    }
  });
}


/* ================================================================
   HOME PAGE
   ================================================================ */

async function initHome() {
  if (!document.getElementById('home-root')) return;
  try {
    var res = await fetch('data/home.json');
    var d   = await res.json();

    document.getElementById('page-title').innerText = d.name;
    document.getElementById('h-name').innerText = d.name;
    document.getElementById('h-title').innerText = d.title;
    document.getElementById('h-intro').innerText = d.introduction;

    document.getElementById('p-image').src = d.sidebar.image;
    document.getElementById('p-name').innerText = '';
    document.getElementById('p-role').innerText = '';//d.title'';
    document.getElementById('p-location').innerText = d.sidebar.location;
    document.getElementById('p-email').innerHTML =
      '<a href="mailto:' + d.sidebar.email + '">' + d.sidebar.email + '</a>';

    if (d.sidebar && d.sidebar.phone) {
      document.getElementById('p-phone').innerHTML =
        '<a href="tel:' + d.sidebar.phone + '">' + d.sidebar.phone + '</a>';
    }

    var icons = {
      github  : 'fab fa-github',
      linkedin: 'fab fa-linkedin-in',
      facebook: 'fab fa-facebook',
      scholar : 'fas fa-graduation-cap'
    };
    var socialHTML = '';
    Object.entries(d.sidebar.social).forEach(function(entry) {
      var key = entry[0], value = entry[1];
      if (value && icons[key]) {
        socialHTML += '<a href="' + value + '" target="_blank"><i class="' + icons[key] + '"></i></a>';
      }
    });
    document.getElementById('p-social').innerHTML = socialHTML;

    var statsEl = document.getElementById('p-stats');
    if (statsEl && d.quick_stats) {
      statsEl.innerHTML = d.quick_stats.map(function(s) {
        return '<div class="stat-box">' +
          '<span class="stat-num">' + s.value + '</span>' +
          '<span class="stat-label">' + s.label + '</span>' +
          '</div>';
      }).join('');
    }

    var mapEl = document.getElementById('p-map');
    if (mapEl && d.map_embed) mapEl.src = d.map_embed;

    var yr = document.getElementById('footer-yr');
    if (yr) yr.innerText = new Date().getFullYear();

  } catch(e) { console.error('Home load error:', e); }
}


/* ================================================================
   ABOUT PAGE
   ================================================================ */

async function initAbout() {
  if (!document.getElementById('about-root')) return;
  try {
    var d = await loadJSON('data/about.json');

    var photoEl = document.getElementById('about-photo');
    if (photoEl) photoEl.src = d.photo;
    var nameEl = document.getElementById('about-name');
    if (nameEl) nameEl.textContent = d.name || 'Dr. Parameswari Krishnamurthy';

    setHTML('ab-bio', (d.biography || []).map(function(p) {
      return '<p>' + esc(p) + '</p>';
    }).join(''));

    setHTML('ab-interests', (d.research_interests || []).map(function(i) {
      return '<li>' + esc(i) + '</li>';
    }).join(''));

    setText('ab-philosophy', d.academic_philosophy || '');

   setHTML('ab-education', (d.education || []).map(function(e) {
      return '<div class="edu-row">' +
        '<span class="edu-yr">' + esc(e.year) + '</span>' +
        '<div>' +
          '<p class="edu-deg">' + esc(e.degree) + '</p>' +
          '<p class="edu-uni">' + esc(e.institution) + '</p>' +
          (e.note ? '<p class="edu-note">' + esc(e.note) + '</p>' : '') +
        '</div></div>';
    }).join(''));

    setHTML('ab-affiliations', (d.affiliations || []).map(function(a) {
      return '<li>' + esc(a) + '</li>';
    }).join(''));

    // Experience
    setHTML('ab-experience', (d.experience || []).map(function(e) {
      return '<div class="exp-row">' +
       '<span class="exp-yr">' + esc(e.year).replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') + '</span>' +
        '<div>' +
          '<p class="exp-deg">' + esc(e.degree) + '</p>' +
          '<p class="exp-uni">' + esc(e.institution) + '</p>' +
        '</div></div>';
    }).join(''));

    // Research Profiles
    if (d.researchProfile) {
      setText('ab-rp-summary', d.researchProfile.summary || '');
      setHTML('ab-rp-links', (d.researchProfile.profiles || []).map(function(p) {
        return '<a class="rp-link" href="' + esc(p.url) + '" target="_blank" rel="noopener">' +
          esc(p.name) + ' ↗</a>';
      }).join(''));
    }


    // var btn = document.getElementById('cv-btn');
    // if (btn) btn.addEventListener('click', function() { generateCV(d); });

  } catch(e) { console.error('About load error:', e); }
}

function generateCV(d) {
  var win = window.open('', '_blank');
  if (!win) return;
  win.document.write(
    '<!DOCTYPE html><html><head><meta charset="UTF-8">' +
    '<title>CV — ' + esc(d.name || '') + '</title>' +
    '<style>' +
    'body{font-family:Georgia,serif;font-size:11pt;padding:2cm;line-height:1.6;color:#111}' +
    'h1{font-size:22pt;margin-bottom:6px}' +
    'h2{margin-top:1.5em;border-bottom:1px solid #111;padding-bottom:4px;font-size:12pt}' +
    '</style></head><body>' +
    '<h1>' + esc(d.name || '') + '</h1>' +
    '<h2>Education</h2>' +
    (d.education || []).map(function(e) {
      return '<p><strong>' + esc(e.year) + '</strong> — ' + esc(e.degree) + ', ' + esc(e.institution) + '</p>';
    }).join('') +
    '<h2>Research Interests</h2><ul>' +
    (d.research_interests || []).map(function(i) { return '<li>' + esc(i) + '</li>'; }).join('') +
    '</ul><h2>Academic Philosophy</h2><p>' + esc(d.academic_philosophy || '') + '</p>' +
    '<script>window.print();<\/script></body></html>'
  );
  win.document.close();
}


/* ================================================================
   PUBLICATIONS
   ================================================================ */

// async function initLab() {
//   var container = document.getElementById('pub-container');
//   if (!container) return;
//   try {
//     var data = await loadJSON('data/lab.json');
//     var pubs = data.publications || [];
//     setupFilters(pubs);
//     renderPubs(pubs);
//   } catch(e) {
//     console.error(e);
//     container.innerHTML = '<p style="padding:2rem;color:#888;">Could not load publications.</p>';
//   }
// }

async function initLab() {
  var container = document.getElementById('pub-container');
  if (!container) return;
  try {
    var data = await loadJSON('data/lab.json');
    var pubs = data.publications || [];
    setupFilters(pubs);
    renderPubs(pubs);
    document.querySelectorAll('.pub-type-filter').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.pub-type-filter').forEach(function(l) {
          l.classList.remove('active');
        });
        this.classList.add('active');

        var type = this.dataset.type;
        var filtered = type === 'all'
          ? pubs
          : type === ''
          ? pubs.filter(function(p) { return !p.type || p.type === 'conference'; })
          : pubs.filter(function(p) { return p.type === type; });
        var ySel = document.getElementById('flt-year');
        if (ySel) ySel.value = '';
        renderPubs(filtered);
      });
    });

  } catch(e) {
    console.error(e);
    container.innerHTML = '<p style="padding:2rem;color:#888;">Could not load publications.</p>';
  }
}

function setupFilters(pubs) {
  var ySel = document.getElementById('flt-year');
  // var tSel = document.getElementById('flt-tag');
  var rst  = document.getElementById('flt-reset');
  if (!ySel) return;

  var years = pubs.map(function(p) { return p.year; }).filter(Boolean);
  years = years.filter(function(v, i, a) { return a.indexOf(v) === i; });
  years.sort(function(a,b) { return b - a; });

  // var tags = pubs.reduce(function(acc, p) {
  //   (p.tags || []).forEach(function(t) { if (acc.indexOf(t) === -1) acc.push(t); });
  //   return acc;
  // }, []).sort();

  years.forEach(function(y) {
    var o = document.createElement('option');
    o.value = y; o.textContent = y; ySel.appendChild(o);
  });
  // tags.forEach(function(t) {
  //   var o = document.createElement('option');
  //   o.value = t; o.textContent = t; tSel.appendChild(o);
  // });

  function applyFilters() {
    renderPubs(pubs.filter(function(p) {
      return (!ySel.value || String(p.year) === ySel.value);
            //  &&(!tSel.value || (p.tags && p.tags.indexOf(tSel.value) !== -1));
    }));
  }
  ySel.addEventListener('change', applyFilters);
  // tSel.addEventListener('change', applyFilters);
  // if (rst) rst.addEventListener('click', function() { ySel.value=''; tSel.value=''; renderPubs(pubs); });
  if (rst) rst.addEventListener('click', function() { ySel.value=''; renderPubs(pubs); });
}

function renderPubs(pubs) {
  var container = document.getElementById('pub-container');
  if (!pubs.length) {
    container.innerHTML = '<p style="padding:2rem 0;color:#888;">No publications found.</p>';
    return;
  }
  var byYear = {};
  pubs.forEach(function(p) {
    var yr = p.year || 'Unknown';
    if (!byYear[yr]) byYear[yr] = [];
    byYear[yr].push(p);
  });
  var sortedYrs = Object.keys(byYear).sort(function(a,b) { return b - a; });

  container.innerHTML = sortedYrs.map(function(yr) {
    return '<div class="tl-year">' +
       '<div class="tl-yr-label">' + yr +
      // '<span class="tl-yr-count">' + byYear[yr].length + ' paper' + (byYear[yr].length > 1 ? 's' : '') + '</span>' +
      '</div>' +
      byYear[yr].map(function(p) { return pubHTML(p); }).join('') +
      '</div>';
  }).join('');

  attachPubListeners();
}

function pubHTML(p) {
  var id = p.id || (function() {
    var slug = (p.title || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40);
    var yr = p.year ? '-' + p.year : '';
    return 'pub-' + slug + yr;
  })();

  var imageHTML = (p.image && p.image.trim() !== '')
    ? '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" class="pub-img"' +
      ' onerror="this.outerHTML=\'<div class=\\\'pub-img-ph\\\'>No Image</div>\'">'
    : '<div class="pub-img-ph">No Image</div>';

  var tags = (p.tags || []).map(function(t) {
    return '<span class="tag">' + esc(t) + '</span>';
  }).join('');

  var downloadBtns = (Array.isArray(p.downloads) ? p.downloads : [])
    .filter(function(d) { return d && d.label && d.url; })
    .map(function(d) {
      var lbl = d.label.trim().toLowerCase();
      if (lbl === 'pdf')
        return '<a class="pub-link" href="' + esc(d.url) + '" target="_blank" rel="noopener">↗ PDF</a>';
      if (lbl === 'code')
        return '<a class="pub-link" href="' + esc(d.url) + '" target="_blank" rel="noopener">{ } Code</a>';
      return '<a class="pub-link" href="' + esc(d.url) + '" target="_blank" rel="noopener">' + esc(d.label) + '</a>';
    }).join('');

  return [
    '<div class="pub-entry" id="' + id + '">',
    '  <div class="pub-img-wrap">' + imageHTML + '</div>',
    '  <div class="pub-body">',
    '    <p class="pub-title">' + esc(p.title) + '</p>',
    '    <p class="pub-venue">' + esc(p.venue) + ' <span class="lec-type">' + esc(p.year) + '</span></p>',
    '    <p class="pub-desc">' + esc(p.description) + '</p>',
    '    <div class="pub-tags">' + tags + '</div>',
    '    <div class="pub-actions">',
    (p.abstract ? '      <button class="pub-btn" data-target="' + id + '-abs" data-kind="abs">Abstract</button>' : ''),
    (p.bibtex   ? '      <button class="pub-btn" data-target="' + id + '-bib" data-kind="bib">BibTeX</button>'   : ''),
    '      ' + downloadBtns,
    '    </div>',
    '  </div>',
    (p.abstract ? [
      '<div class="pub-panel" id="' + id + '-abs">',
      '  <span class="panel-label">Abstract</span>',
      '  <button class="panel-close" data-target="' + id + '-abs" data-kind="abs">✕</button>',
      '  <p>' + esc(p.abstract) + '</p>',
      '</div>'
    ].join('') : ''),
    (p.bibtex ? [
      '<div class="pub-panel" id="' + id + '-bib">',
      '  <span class="panel-label">BibTeX</span>',
      '  <button class="panel-close" data-target="' + id + '-bib" data-kind="bib">✕</button>',
      '  <pre>' + esc(p.bibtex) + '</pre>',
      '</div>'
    ].join('') : ''),
    '</div>'
  ].join('\n');
}

function attachPubListeners() {
  document.querySelectorAll('.pub-btn[data-target]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var panel  = document.getElementById(this.dataset.target);
      if (!panel) return;
      var entry   = this.closest('.pub-entry');
      var wasOpen = panel.classList.contains('open');
      entry.querySelectorAll('.pub-panel.open').forEach(function(p) { p.classList.remove('open'); });
      entry.querySelectorAll('.pub-btn.on').forEach(function(b) { b.classList.remove('on'); });
      if (!wasOpen) { panel.classList.add('open'); this.classList.add('on'); }
    });
  });

  document.querySelectorAll('.panel-close').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var panel = document.getElementById(this.dataset.target);
      if (panel) panel.classList.remove('open');
      var entry = this.closest('.pub-entry');
      if (entry && this.dataset.kind) {
        entry.querySelectorAll('.pub-btn[data-kind="' + this.dataset.kind + '"]')
          .forEach(function(b) { b.classList.remove('on'); });
      }
    });
  });
}


/* ================================================================
   PROJECTS
   ================================================================ */

async function initProjects() {
  var c = document.getElementById('proj-container');
  if (!c) return;
  try {
    var d  = await loadJSON('data/projects.json');
    var ps = d.projects || [];
    renderProjects(ps,d);
  } catch(e) {
    document.getElementById('proj-container').innerHTML = '<p>Could not load projects.</p>';
    console.error(e);
  }
}

// function renderProjects(ps) {
//   var c = document.getElementById('proj-container');
//   if (!ps.length) { c.innerHTML = '<p style="padding:1rem 0;color:#888;">No projects found.</p>'; return; }

//   var byYear = {};
//   ps.forEach(function(p) { if (!byYear[p.year]) byYear[p.year]=[]; byYear[p.year].push(p); });
//   var sortedYrs = Object.keys(byYear).sort(function(a,b){return b-a;});

//   c.innerHTML = sortedYrs.map(function(yr) {
//     return '<div class="tl-year">' +
//       '<div class="tl-yr-label">' + yr + '</div>' +
//       // ' <span class="tl-yr-count">' + byYear[yr].length + ' project' + (byYear[yr].length>1?'s':'') + '</span></div>' +
//       byYear[yr].map(function(p) {
//         return '<div class="proj-entry">' +
//           '<div class="proj-meta">' +
//           '<span class="proj-name">' + esc(p.name) + '</span>' +
//           '<span class="proj-period">' + esc(p.period) + '</span>' +
//           '</div>' +
//           (p.funding ? '<p class="proj-funding">' + esc(p.funding) + '</p>' : '') +
//           '<p class="proj-desc">' + esc(p.description) + '</p>' +
//           (p.links && p.links.length ?
//             '<div class="proj-links">' +
//             p.links.map(function(l) {
//               return '<a class="proj-link" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>';
//             }).join('') + '</div>' : '') +
//           '</div>';
//       }).join('') +
//       '</div>';
//   }).join('');
// }
function renderProjects(ps,d) {
  var c = document.getElementById('proj-container');
  if (!ps.length) { c.innerHTML = '<p style="padding:1rem 0;color:#888;">No projects found.</p>'; return; }

var rows = ps.map(function(p) {
    var nameCell = esc(p.name); 

    var roleCell   = p.role    ? esc(p.role)    : '<span style="color:var(--text-muted)">—</span>';
    var fundCell   = p.funding ? esc(p.funding) : '<span style="color:var(--text-muted)">—</span>';

    return '<tr>' +
      '<td class="ptbl-name">'    + nameCell  + '</td>' +
      '<td class="ptbl-role">'    + roleCell  + '</td>' +
      '<td class="ptbl-funding">' + fundCell  + '</td>' +
      '</tr>';
  }).join('');

  c.innerHTML =
    c.innerHTML =
    (d.intro ? '<p class="proj-intro">' + esc(d.intro) + '</p>' : '')  +
    '<div class="proj-table-wrap">' +
    '<table class="proj-table">' +
    '<thead><tr>' +
    '<th>Project Name</th>' +
    '<th>Role</th>' +
    '<th>Funded By</th>' +
    '</tr></thead>' +
    '<tbody>' + rows + '</tbody>' +
    '</table></div>';}


/* ================================================================
   TEACHING
   ================================================================ */

async function initTeaching() {
  var c = document.getElementById('teach-container');
  if (!c) return;
  try {
    var d = await loadJSON('data/teaching.json');
    var courses = d.teaching || [];

    // Group by institute
    var groups = {};
    var groupOrder = [];
    courses.forEach(function(t) {
      var key = t.institute || 'Other';
      if (!groups[key]) {
        groups[key] = [];
        groupOrder.push(key);
      }
      groups[key].push(t);
    });

    c.innerHTML = groupOrder.map(function(inst) {
      var rows = groups[inst].map(function(t) {
        return '<div class="teach-row">' +
          '<div class="teach-meta">' +
          '<span class="teach-yrs">'    + esc(t.year_range) + '</span>' +
          '<span class="teach-season">' + esc(t.season)     + '</span>' +
          '<span class="teach-lvl">'    + esc(t.level)      + '</span>' +
          '</div>' +
          '<div class="teach-body">' +
          (t.course_code ? '<p class="teach-code">' + esc(t.course_code) + '</p>' : '') +
          '<p class="teach-subj">' + esc(t.subjects.join(', ')) + '</p>' +
          (t.notes ? '<p class="teach-note">' + esc(t.notes) + '</p>' : '') +
          '</div></div>';
      }).join('');

      return '<div class="teach-group">' +
        '<div class="teach-group-header">' + esc(inst) + '</div>' +
        rows +
        '</div>';
    }).join('');

  } catch(e) {
    document.getElementById('teach-container').innerHTML = '<p>Could not load teaching data.</p>';
  }
}


/* ================================================================
   STUDENTS  —  two-column layout, isolated card expansion
   ================================================================ */

var DEG_ORDER = { 'Ph.D.': 0, 'PhD': 0, 'M.S.': 1, 'MS': 1, 'CLD': 2, 'CLS': 3 };

function sortStudents(arr) {
  return arr.slice().sort(function(a, b) {
    var da = DEG_ORDER[a.degree] != null ? DEG_ORDER[a.degree] : 99;
    var db = DEG_ORDER[b.degree] != null ? DEG_ORDER[b.degree] : 99;
    if (da !== db) return da - db;
    return (b.year || 0) - (a.year || 0);
  });
}

function sortDualDegree(arr) {
  return arr.slice().sort(function(a, b) {
    // current/present first, alumni last
    var aIsAlumni = a.status === 'alumni' ? 1 : 0;
    var bIsAlumni = b.status === 'alumni' ? 1 : 0;
    if (aIsAlumni !== bIsAlumni) return aIsAlumni - bIsAlumni;
    // within same status group, latest year first
    return (b.year || 0) - (a.year || 0);
  });
}

function initials(name) {
  return (name || '').split(/\s+/).map(function(w) { return w[0] || ''; }).join('').toUpperCase().slice(0, 2);
}

function svgAvatar(name) {
  var ini  = initials(name);
  var hue  = 0;
  for (var i = 0; i < name.length; i++) hue = (hue + name.charCodeAt(i) * 37) % 360;
  var bg   = 'hsl(' + hue + ',28%,72%)';
  var fg   = 'hsl(' + hue + ',20%,28%)';
  var svg  = '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56">' +
    '<rect width="56" height="56" fill="' + bg + '"/>' +
    '<text x="28" y="36" text-anchor="middle" font-family="Georgia,serif" font-size="20" ' +
    'font-style="italic" fill="' + fg + '">' + ini + '</text></svg>';
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

function renderStudentCard(s, opts) {
  opts = opts || {};
  var uid = 'stu-' + s.name.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '');
  var avatar = svgAvatar(s.name);

  var photoSrc = (s.photo && s.photo.trim()) ? esc(s.photo) : avatar;
  var photoHTML = '<img class="stu-photo" src="' + photoSrc + '" alt="' + esc(s.name) + '"' +
    ' onerror="this.src=\'' + avatar + '\'">';

  var infoHTML = s.status === 'current'
    ? (s.topic     ? '<p class="stu-topic">'     + esc(s.topic)     + '</p>' : '')
    : (s.placement ? '<p class="stu-placement">' + esc(s.placement) + '</p>' : '');

  // var alumBadge = s.institution
  //   ? '<span class="stu-alumni-badge">' + esc(s.institution) + '</span>' : '';
var isDualDegree = s.degree === 'CLD' || s.degree === 'CSD' || s.degree === 'M.S.' || s.degree === 'MS' || s.degree === 'Honors';

  var alumBadge = s.institution
    ? '<span class="stu-alumni-badge">' + esc(s.institution) + '</span>' : '';

  var completedBadge = opts.showCompletedBadge && isDualDegree && s.status === 'alumni'
    ? '<span class="stu-completed-badge">Completed</span>'
    : '';
  var hasPapers = s.papers && s.papers.length > 0;

  var pubBtnHTML = hasPapers
    ? '<button class="stu-pub-btn" data-target="' + uid + '-pubs" aria-expanded="false">' +
      'Publications' +
      '<span class="stu-chevron">▾</span>' +
      // '<span class="stu-pub-count">(' + s.papers.length + ')</span>' +
      '</button>'
    : '';

  var papersHTML = '';
  if (hasPapers) {
    var items = s.papers.map(function(p) {
      var linksArr = Array.isArray(p.links) && p.links.length
        ? p.links
        : (p.link ? [{ label: 'PDF', url: p.link }] : []);

      var linkChips = linksArr.map(function(lnk) {
        return '<a class="stu-pub-chip" href="' + esc(lnk.url) + '" target="_blank" rel="noopener">' +
          esc(lnk.label) + ' ↗</a>';
      }).join('');

      return '<li class="stu-pub-item">' +
        '<div class="stu-pub-content">' +
        '<span class="stu-pub-title">' + esc(p.title) + '</span>' +
        (p.venue ? '<span class="stu-pub-venue">' + esc(p.venue) + '</span>' : '') +
        (linkChips ? '<span class="stu-pub-chips">' + linkChips + '</span>' : '') +
        '</div></li>';
    }).join('');

    papersHTML = '<div class="stu-pub-panel" id="' + uid + '-pubs">' +
      '<ul class="stu-pub-list">' + items + '</ul>' +
      '</div>';
  }

  var hasSocials = s.socials && s.socials.length;

  // var socialBtn =
  //   '<button class="stu-social-btn" ' +
  //   (hasSocials ? 'data-target="' + uid + '-socials"' : 'disabled') +
  //   ' aria-expanded="false">↗</button>';
  var socialBtn = hasSocials
  ? '<button class="stu-social-btn" data-target="' + uid + '-socials"' +
    ' aria-expanded="false" aria-label="Social links">↗</button>'
  : '';

  var socialMenu = '';

  if (hasSocials) {
    var links = s.socials.map(function(l){
      return '<a class="stu-social-link" href="' + esc(l.url) +
        '" target="_blank" rel="noopener">' +
        esc(l.label) + ' ↗</a>';
    }).join('');

    socialMenu =
      '<div class="stu-social-pop" id="' + uid + '-socials">' +
      links +
      '</div>';
  }

  var nameHTML =
    '<div class="stu-name-row">' +
    '<span class="stu-name">' + esc(s.name) + '</span>' +
    socialBtn +
    socialMenu +
    '</div>';

  return [
    '<div class="stu-card" data-uid="' + uid + '">',
    '  <div class="stu-card-top">',
    '    <div class="stu-photo-wrap">' + photoHTML + '</div>',
    '    <div class="stu-identity">',
    '      ' + nameHTML,
    '      <div class="stu-meta">',
    '        <span class="stu-deg">' + esc(s.degree) + '</span>',
    '        <span class="stu-period">' + esc(s.period) + '</span>',
    // '        ' + alumBadge,
    '        ' + completedBadge,

    '      </div>',
    '      ' + infoHTML,
    '    </div>',
    '  </div>',
    '  ' + pubBtnHTML,
    '  ' + papersHTML,
    '</div>'
  ].join('\n');

}

async function initStudents() {
  var c = document.getElementById('stu-container');
  if (!c) return;
  try {
    var d       = await loadJSON('data/students.json');
    var current = sortStudents(d.current_students || []);
    var ms = sortStudents(d.ms_students || []);
    // var dual_degree = sortStudents(d.dual_degree || []);
    var dual_degree = sortDualDegree(d.dual_degree || []);
    var alumni  = sortStudents(d.alumni || []);
    var researchAssociates = sortStudents(d.research_staff || d.research_associated || []);
    var researchInterns = sortStudents(d.research_interns || []);
    var html    = '';

    function twoColWrap(students, opts) {
      var left  = [];
      var right = [];
      students.forEach(function(s, i) {
        (i % 2 === 0 ? left : right).push(renderStudentCard(s, opts));
      });
      return '<div class="stu-col-wrap">' +
        '<div class="stu-col">' + left.join('')  + '</div>' +
        '<div class="stu-col">' + right.join('') + '</div>' +
        '</div>';
    }

    if (current.length) {
      html += '<div class="stu-group-title">Ongoing PhD Students</div>';
      html += twoColWrap(current);
    }

    if (alumni.length) {
      html += '<div class="stu-group-title">PhD Students Supervised</div>';
      html += twoColWrap(alumni);
    }
	if( dual_degree.length) {
	  html += '<div class="stu-group-title">MS/Dual Degree Students</div>';
    html += twoColWrap(dual_degree, { showCompletedBadge: true });
	}
  if (researchAssociates.length) {
    html += '<div class="stu-group-title">Research Staff</div>';
    html += twoColWrap(researchAssociates);
  }
  if (researchInterns.length) {
    html += '<div class="stu-group-title">Research Interns</div>';
    html += twoColWrap(researchInterns);
  }
	// if (ms.length) {
	//   html += '<div class="stu-group-title">MS Students</div>';
	//   html += twoColWrap(ms);
	// }

    c.innerHTML = html;
    attachStudentListeners(c);

  } catch(e) {
    console.error('Students load error:', e);
    document.getElementById('stu-container').innerHTML =
      '<p style="padding:1rem 0;color:#888;">Could not load student data.</p>';
  }
}

function attachStudentListeners(container) {
  container.querySelectorAll('.stu-pub-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var panel  = document.getElementById(this.dataset.target);
      if (!panel) return;
      var isOpen = panel.classList.contains('open');
      panel.classList.toggle('open', !isOpen);
      this.classList.toggle('open',  !isOpen);
      this.setAttribute('aria-expanded', String(!isOpen));
    });
  });
   container.querySelectorAll('.stu-social-btn').forEach(function(btn){

    if(btn.disabled) return;

    btn.addEventListener('click', function(e){

      e.stopPropagation();

      var menu = document.getElementById(this.dataset.target);

      if(!menu) return;

      var open = menu.classList.contains('open');

      document.querySelectorAll('.stu-social-pop').forEach(function(p){
        p.classList.remove('open');
      });

      if(!open) menu.classList.add('open');

    });

  });

}



/* ================================================================
   LECTURES
   ================================================================ */

async function initLectures() {
  var c = document.getElementById('lec-container');
  if (!c) return;
  try {
    var d = await loadJSON('data/lectures.json');
    c.innerHTML = (d.lectures || []).map(function(l) {
      var dlHtml = '';
      if (l.downloads && l.downloads.length) {
        dlHtml = '<div class="lec-dls">' +
          l.downloads.map(function(dl) {
            var lbl  = (dl.label || '').trim().toLowerCase();
            var icon = '↗';
            if (lbl.indexOf('video') !== -1 || lbl.indexOf('play') !== -1 || lbl.indexOf('recording') !== -1) icon = '▶';
            if (lbl.indexOf('slide') !== -1 || lbl.indexOf('pdf') !== -1) icon = '↓';
            if (lbl.indexOf('code') !== -1 || lbl.indexOf('notebook') !== -1) icon = '{}';
            return '<a class="lec-dl" href="' + esc(dl.url) + '" target="_blank" rel="noopener">' + icon + ' ' + esc(dl.label) + '</a>';
          }).join('') + '</div>';
      }
      return '<div class="lec-entry">' +
        '<div class="lec-header">' +
        '<span class="lec-title">' + esc(l.title) + '</span>' +
        '<span class="lec-type">' + esc(l.type) + '</span>' +
        '</div>' +
        '<p class="lec-inst">' + esc(l.institution) + ' · ' + esc(l.year) + '</p>' +
        '<p class="lec-desc">' + esc(l.description) + '</p>' +
        dlHtml + '</div>';
    }).join('');
  } catch(e) { document.getElementById('lec-container').innerHTML = '<p>Could not load lectures.</p>'; }
}


/* ================================================================
   NEWS
   ================================================================ */
// async function initNews() {
//   var c = document.getElementById('news-container');
//   if (!c) return;
//   try {
//     var d  = await loadJSON('data/news.json');
//     var ns = d.news || [];

//     // category filter links
//     document.querySelectorAll('.news-cat-filter').forEach(function(link) {
//       link.addEventListener('click', function(e) {
//         e.preventDefault();
//         document.querySelectorAll('.news-cat-filter').forEach(function(l) {
//           l.classList.remove('active');
//         });
//         this.classList.add('active');
//         var cat = this.dataset.cat;
//         var filtered = cat === 'all'
//           ? ns
//           : ns.filter(function(n) { return (n.category || '') === cat; });
//         renderNews(filtered);
//       });
//     });

//     renderNews(ns);

//   } catch(e) { document.getElementById('news-container').innerHTML = '<p>Could not load news.</p>'; }
// }
async function initNews() {
  var c = document.getElementById('news-container');
  if (!c) return;
  try {
    var d  = await loadJSON('data/news.json');
    var ns = d.news || [];

    var ySel = document.getElementById('flt-year');
    var rst  = document.getElementById('flt-reset');

    // if (ySel) {
    //   var years = ns.map(function(n) { return n.year; }).filter(Boolean);
    //   years = years.filter(function(v, i, a) { return a.indexOf(v) === i; });
    //   years = years.filter(function(v, i, a) { return a.indexOf(v) === i; });
    //   // no sort — preserve JSON order for display
    //   years.forEach(function(y) {
    if (ySel) {
      var years = ns.map(function(n) { return n.year; }).filter(Boolean);
      years = years.filter(function(v, i, a) { return a.indexOf(v) === i; });
      years.forEach(function(y) {
        var o = document.createElement('option');
        o.value = y; o.textContent = y; ySel.appendChild(o);
      });
      ySel.addEventListener('change', function() {
        renderNews(ySel.value ? ns.filter(function(n) { return String(n.year) === ySel.value; }) : ns);
      });
    }

    if (rst) rst.addEventListener('click', function() {
      if (ySel) ySel.value = '';
      renderNews(ns);
    });

    renderNews(ns);

  } catch(e) { document.getElementById('news-container').innerHTML = '<p>Could not load news.</p>'; }
}
function renderNews(ns) {
  var c = document.getElementById('news-container');
  if (!ns.length) { c.innerHTML = '<p style="padding:1rem 0;color:#888;">No news found.</p>'; return; }

  c.innerHTML = ns.map(function(n) {
    var actionHTML = '';
    if (Array.isArray(n.links) && n.links.length) {
      actionHTML = '<div class="pub-actions" style="margin-top:.6rem">' +
        n.links.map(function(lnk) {
          var lbl  = (lnk.label || '').trim().toLowerCase();
          var icon = '↗ ' + esc(lnk.label);
          if (lbl.indexOf('video') !== -1 || lbl.indexOf('play') !== -1 || lbl.indexOf('watch') !== -1) icon = '▶ Play';
          else if (lbl.indexOf('view') !== -1 || lbl.indexOf('read') !== -1) icon = '↗ View';
          else if (lbl.indexOf('pdf') !== -1) icon = '↓ PDF';
          return '<a class="pub-link" href="' + esc(lnk.url) + '" target="_blank" rel="noopener">' + icon + '</a>';
        }).join('') + '</div>';
    }
    return '<div class="news-row">' +
      '<div class="news-meta">' +
      '<span class="news-date">' + esc(n.date) + '</span>' +
      '<span class="news-cat">' + esc(n.category) + '</span>' +
      '</div>' +
      '<div>' +
      '<p class="news-ttl">' + esc(n.title) + '</p>' +
      '<p class="news-body">' + esc(n.description) + '</p>' +
      actionHTML +
      '</div></div>';
  }).join('');
}

async function initHomeNews() {
  var c = document.getElementById('home-news-list');
  if (!c) return;
  try {
    var d  = await loadJSON('data/news.json');
    var ns = (d.news || []).slice(0, 10);
    if (!ns.length) { c.innerHTML = ''; return; }
    // c.innerHTML = ns.map(function(n) {
    //   return '<div class="home-news-item">' +
    //     '<span class="hni-date">' + esc(n.date) + '</span>' +
    //     '<p class="hni-text">' + esc(n.title) + '</p>' +
    //     '</div>';
    // }).join('');
    c.innerHTML = ns.map(function(n) {
      return '<div class="home-news-item">' +
        '<span class="hni-date">' + esc(n.date) + '</span>' +
        '<p class="hni-text">' + esc(n.description) + '</p>' +
        '</div>';
    }).join('');
  } catch(e) {}
}


/* ================================================================
   INIT
   ================================================================ */

document.addEventListener('DOMContentLoaded', function() {
  initDark();
  initNav();
  initSearch();   
initHome();
initHomeNews();
  initAbout();
  initLab();
  initProjects();
  initTeaching();
  initStudents();
  initLectures();
  initNews();

  var fy = document.getElementById('footer-yr');
  if (fy) fy.textContent = new Date().getFullYear();
  
document.addEventListener('click', function(){

  document.querySelectorAll('.stu-social-pop').forEach(function(p){

    p.classList.remove('open');

  });

});
});