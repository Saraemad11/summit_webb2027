/* =====================================================================
   App — router, intro, top bar, motion engine, forms.
   Pages: home · track · summit map · projects · register (take part).
   Every link opens its own page or section; nothing loops back.
   ===================================================================== */
(function () {
  var D = window.NDS_DATA, S = window.Store, V = window.VIEWS;
  var tt = C.tt, E = C.E, L = C.L, esc = C.esc, ico = C.ico;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var html = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var APP = window.APP = { lenis: null, route: null, key: null, cleanups: [], state: {} };
  var app = $('#app');
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function plabel(p) { return C.isAr() ? L(p.name) : p.label; }

  /* ================= TOP BAR & FOOTER ================= */
  // The parts of the summit page, in page order (built each time so they follow the language).
  function sections() {
    return [
      ['speech', 'quote', tt('The President’s word', 'كلمة الرئيس'), tt('The President and the Alliance leaders', 'كلمة الرئيس وقيادات التحالف')],
      ['concept', 'info', tt('Summit Concept', 'مفهوم القمة'), tt('What the Summit is', 'ما هي القمة')],
      ['positioning', 'compass', tt('Strategic Position', 'المكانة الاستراتيجية'), tt('The working theme of the Summit', 'الموضوع الرئيسي للقمة')],
      ['goals', 'target', tt('Summit Goals', 'أهداف القمة'), tt('What are the Summit goals', 'ما هي أهداف القمة')],
      ['model', 'repeat', tt('Summit Operating Model', 'نموذج عمل القمة'), tt('Dialogue, Partnership, Action', 'الحوار، الشراكة، التنفيذ')],
      ['tracks', 'layers', tt('Proposed Pillars', 'المحاور المقترحة'), tt('The 8 tracks of the Summit', '8 مسارات تركز عليها القمة')],
      ['audience', 'users', tt('Target Audience', 'الجمهور المستهدف'), tt('Who takes part', 'مَن يشارك في القمة')],
      ['models', 'award', tt('Success Models', 'النماذج الناجحة'), tt('Egyptian models and their impact', 'نماذج مصرية وأثرها في المجتمع')],
      ['partners', 'handshake', tt('Potential Partners', 'الشركاء المحتملون'), tt('Who the Summit seeks to partner with', 'الجهات التي تسعى القمة للشراكة معها')],
      ['matchmaking', 'calendar', tt('Networking meetings', 'لقاءات التعارف'), tt('Meetings arranged by NACDW at the Summit', 'لقاءات يرتبها التحالف أثناء القمة')]
    ];
  }
  function navHTML() {
    var secs = sections();
    var dd = function (key, label, body, cls, href) {
      var head = href
        ? '<span class="nav__link dd__pair" data-nav="home"><a class="dd__go" href="' + href + '">' + label + '</a><button type="button" class="dd__t" aria-expanded="false" aria-label="' + label + '">' + ico('chevDown') + '</button></span>'
        : '<button type="button" class="nav__link dd__t" aria-expanded="false" data-nav="' + key + '">' + label + ico('chevDown') + '</button>';
      return '<div class="dd" data-dd="' + key + '">' + head + '<div class="dd__m ' + (cls || '') + '">' + body + '</div></div>';
    };
    var summitM = '<div class="ddg ddg--if">' + secs.map(function (s) { return '<a href="#/home/' + s[0] + '" style="--c:#0B4D44"><span class="ddg__ic">' + ico(s[1]) + '</span><span><b>' + s[2] + '</b><small>' + s[3] + '</small></span></a>'; }).join('') + '</div>';
    var tracksM = '<div class="ddg ddg--tracks">' + D.tracks.map(function (t) { return '<a href="#/projects/' + t.slug + '" style="--c:' + t.color + '"><span class="ddg__n">0' + t.id + '</span><span class="ddg__ic">' + ico(t.icon) + '</span><b>' + E(t.name) + '</b></a>'; }).join('') + '</div><p class="dd__hint">' + ico('target') + tt('Choose a track to submit a project in it', 'اختر مسارًا لتقديم مشروع فيه') + '</p>';
    var h = '<div class="nav__bar"><div class="nav__in">' +
      '<a href="#/" class="nav__logo" aria-label="' + E(D.summit.name) + '"><img src="assets/img/logo-full.png" alt="' + E(D.summit.name) + '"></a>' +
      '<nav class="nav__links" aria-label="main">' + dd('summit', tt('The Summit', 'القمة'), summitM, 'dd__m--wide', '#/') + dd('tracks', tt('Tracks', 'المسارات'), tracksM, 'dd__m--wide') +
      '<a class="nav__link" href="#/ring" data-nav="ring">' + tt('Summit map', 'خريطة القمة') + '</a>' +
      '<a class="nav__link" href="#/projects" data-nav="projects">' + tt('Projects', 'المشروعات') + '</a></nav>' +
      '<div class="nav__acts"><button type="button" class="iconbtn" data-act="search" aria-label="' + tt('Search', 'بحث') + '" title="Ctrl K">' + ico('search') + '</button>' +
      '<button type="button" class="langbtn" data-act="lang" aria-label="language">' + (C.isAr() ? 'EN' : 'ع') + '</button>' +
      '<a class="btn btn--primary btn--sm nav__cta" href="#/register" data-nav="register"><span>' + tt('Take part', 'شارك معنا') + '</span>' + C.arrow() + '</a>' +
      '<button type="button" class="iconbtn nav__burger" data-act="menu" aria-label="menu">' + ico('menu', 'i-open') + ico('x', 'i-close') + '</button></div></div></div>';
    h += '<div class="mmenu" data-lenis-prevent><div class="mmenu__in">' +
      [[tt('Home', 'الرئيسية'), '#/'], [tt('Summit map', 'خريطة القمة'), '#/ring'], [tt('Projects', 'المشروعات'), '#/projects']].map(function (l, i) { return '<a class="mmenu__big" href="' + l[1] + '" style="--i:' + i + '">' + l[0] + '</a>'; }).join('') +
      '<div class="mmenu__g" style="--i:4"><a class="mmenu__gt" href="#/">' + tt('The Summit', 'القمة') + '</a><div class="mmenu__list">' + secs.map(function (s) { return '<a href="#/home/' + s[0] + '">' + ico(s[1]) + s[2] + '</a>'; }).join('') + '</div></div>' +
      '<div class="mmenu__g" style="--i:5"><span>' + tt('Tracks', 'المسارات') + '</span><div class="mmenu__list">' + D.tracks.map(function (t) { return '<a href="#/projects/' + t.slug + '" style="--c:' + t.color + '"><i></i>' + E(t.name) + '</a>'; }).join('') + '</div></div>' +
      '<div class="mmenu__acts" style="--i:6">' + C.btn(tt('Take part', 'شارك معنا'), '#/register', 'primary') + '</div></div></div>';
    return h;
  }
  function footerHTML() {
    var col = function (title, links) { return '<div class="fcol"><h4>' + title + '</h4>' + links.map(function (l) { return '<a href="' + l[1] + '">' + l[0] + '</a>'; }).join('') + '</div>'; };
    return '<div class="container footer__in"><div class="footer__brand"><img src="assets/img/logo-full.png" alt="' + E(D.summit.name) + '"><p><b>' + E(D.summit.name) + '</b><br>' + E(D.summit.theme) + '<br>' + E(D.summit.when) + '</p>' +
      '<div class="footer__triad">' + D.pillars.map(function (p) { return '<span class="' + p.key.charAt(0) + '">' + plabel(p) + '</span>'; }).join('<i></i>') + '</div></div><div class="footer__cols">' +
      col('<a href="#/">' + tt('The Summit', 'القمة') + '</a>', sections().map(function (s) { return [s[2], '#/home/' + s[0]]; })) +
      col(tt('Tracks', 'المسارات'), D.tracks.map(function (t) { return [E(t.name), '#/projects/' + t.slug]; })) +
      col(tt('Target Audience', 'الجمهور المستهدف'), D.stakeholders.map(function (s) { return [E(s.short), '#/register/' + s.sector]; })) +
      col(tt('Take part', 'شارك معنا'), [[tt('Register for the Summit', 'التسجيل في القمة'), '#/register'], [tt('Partnership opportunities', 'فرص الشراكة'), '#/register/partner'], [tt('Submit a project', 'تقديم مشروع'), '#/projects'], [tt('Request a networking meeting', 'طلب لقاء تعارف'), '#/register/match'], [tt('Summit map', 'خريطة القمة'), '#/ring']]) +
      '</div></div><div class="container footer__bot"><span>© 2027 ' + E(D.summit.host) + '</span></div>';
  }
  function renderChrome() { $('#nav').innerHTML = navHTML(); $('#footer').innerHTML = footerHTML(); $('#totop').innerHTML = ico('arrow'); markNav(); }
  function markNav() {
    var r = APP.route; if (!r) return;
    var key = r.name === 'projects' && r.parts[1] ? 'tracks' : r.name;
    $$('[data-nav]').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-nav') === key); });
  }
  function closeMenu() { html.classList.remove('menu-open'); }
  // After an item is chosen the dropdown closes and stays closed until the pointer really leaves it.
  function closeDropdowns() {
    $$('.dd').forEach(function (dd) {
      dd.classList.remove('open');
      var t = $('.dd__t', dd); if (t) t.setAttribute('aria-expanded', 'false');
      if (dd.classList.contains('dd--closed')) return;
      dd.classList.add('dd--closed');
      var onMove = function (e) {
        var m = $('.dd__m', dd), r1 = dd.getBoundingClientRect(), r2 = m ? m.getBoundingClientRect() : r1;
        var inside = function (r) { return e.clientX >= r.left - 6 && e.clientX <= r.right + 6 && e.clientY >= r.top - 22 && e.clientY <= r.bottom + 6; };
        if (!inside(r1) && !inside(r2)) { dd.classList.remove('dd--closed'); document.removeEventListener('pointermove', onMove); }
      };
      document.addEventListener('pointermove', onMove);
    });
    if (document.activeElement && document.activeElement.closest && document.activeElement.closest('.dd')) document.activeElement.blur();
  }

  /* ================= ROUTER ================= */
  function parse() {
    var h = decodeURIComponent(location.hash.replace(/^#\/?/, '')).split('?')[0];
    var parts = h.split(/\/|--/).filter(Boolean);
    return { parts: parts, name: parts[0] || 'home' };
  }
  // Hashes are plain names (#tracks--food-water) so deep links survive hosts that only pass #name.
  function toHash(h) { var p = String(h || '').replace(/^#\/?/, '').split(/\/|--/).filter(Boolean); return p.length ? p.join('--') : 'home'; }
  function go(h) { var t = '#' + toHash(h); if (location.hash === t) route(); else location.hash = t; }
  APP.go = go;
  function keyOf(r) { return r.name === 'home' ? 'home' : r.name + '/' + (r.parts[1] || ''); }
  function build(r) {
    var p = r.parts;
    switch (r.name) {
      case 'home': return V.home();
      case 'tracks': return V.projects(p[1]);
      case 'ring': return V.ring();
      case 'projects': return V.projects(p[1]);
      case 'register': return V.register(p[1]);
      default: return V.notFound();
    }
  }
  function titleOf(r) {
    var base = L(D.summit.name), t = '';
    t = { home: base, ring: tt('Summit map', 'خريطة القمة'), projects: tt('Submit a project', 'تقديم مشروع'), register: tt('Take part', 'شارك معنا') }[r.name] || '404';
    return r.name === 'home' ? base : t + ' | ' + base;
  }
  function cleanup() { APP.cleanups.forEach(function (fn) { try { fn(); } catch (e) { } }); APP.cleanups = []; }
  function paint(r, instant) {
    cleanup();
    app.innerHTML = build(r);
    document.title = titleOf(r);
    APP.route = r; APP.key = keyOf(r);
    markNav(); closeMenu();
    mount(r, instant);
  }
  function scrollTopSmooth() { if (APP.lenis) APP.lenis.scrollTo(0, { duration: 1.2, force: true }); else window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); }
  function scrollTop() { if (APP.lenis) APP.lenis.scrollTo(0, { immediate: true, force: true }); window.scrollTo(0, 0); }
  function scrollToEl(el, immediate) {
    if (!el) return;
    if (APP.lenis) APP.lenis.scrollTo(el, { offset: -108, duration: immediate ? 0 : 1.3, immediate: !!immediate, force: true });
    else el.scrollIntoView({ behavior: immediate ? 'auto' : 'smooth', block: 'start' });
  }
  function subTarget(r) {
    var p = r.parts;
    if (r.name === 'home' && p[1]) return document.getElementById(p[1]);
    if (r.name === 'register' && p[1] === 'match') return document.getElementById('match-pick');
    if ((r.name === 'register' || r.name === 'projects') && p[1]) return $('.formbox');
    return null;
  }
  var routing = false;
  async function route() {
    var r = parse(), key = keyOf(r);
    // Same page: only scroll to the requested section.
    if (APP.route && key === APP.key && r.name === 'home' && APP.route.name === 'home') {
      APP.route = r; var el = subTarget(r); if (el) scrollToEl(el); else scrollTopSmooth(); return;
    }
    if (routing) return; routing = true;
    var first = !APP.route;
    if (first || reduced) { paint(r, false); scrollTop(); }
    else {
      var pt = $('#pt'); pt.classList.remove('out'); pt.classList.add('in');
      await wait(560);
      paint(r, false); scrollTop();
      await wait(40);
      pt.classList.add('out'); pt.classList.remove('in');
      setTimeout(function () { pt.classList.remove('out'); }, 760);
    }
    routing = false;
    var target = subTarget(r);
    if (target) setTimeout(function () { scrollToEl(target, first); if (r.parts[1] === 'match') flash(target); }, first ? 120 : 300);
    if (keyOf(parse()) !== key) route();
  }
  function flash(el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }

  /* ================= MOTION ENGINE ================= */
  var io = ('IntersectionObserver' in window) ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 }) : null;
  function splitWords(el) {
    if (el.__split) return; el.__split = true; var n = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (ch) {
        if (ch.nodeType === 3) {
          var parts = ch.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            var o = document.createElement('span'); o.className = 'w';
            var i = document.createElement('span'); i.className = 'w__i'; i.style.setProperty('--wi', n++); i.textContent = w;
            o.appendChild(i); frag.appendChild(o);
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1) walk(ch);
      });
    })(el);
  }
  function mountReveals(root, instant) {
    $$('[data-split]', root).forEach(function (el) { splitWords(el); if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'split'); });
    $$('[data-reveal]', root).forEach(function (el) {
      if (el.classList.contains('in')) return;
      if (instant || reduced || !io) el.classList.add('in'); else io.observe(el);
    });
  }
  var fxEls = [], lastY = 0, ticking = false;
  function scanFx() { fxEls = $$('[data-fx]'); }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  function frame() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight, dh = document.documentElement.scrollHeight - vh;
    var bar = $('.scroll-progress span'); if (bar) bar.style.transform = 'scaleX(' + (dh > 0 ? y / dh : 0) + ')';
    var nav = $('#nav');
    if (nav) {
      nav.classList.toggle('nav--scrolled', y > 24);
    }
    $('#totop').classList.toggle('on', y > vh * 1.4);
    fxEls.forEach(function (el) {
      var r = el.getBoundingClientRect(), mode = el.getAttribute('data-fx'), p;
      if (mode === 'sticky') p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
      else p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      el.style.setProperty('--p', p.toFixed(4));
      if (el.id === 'concept') el.classList.toggle('copy-on', p > 0.42);
    });
    if (galleryHook) galleryHook();
    lastY = y;
  }
  function mount(r, instant) {
    mountReveals(app, instant);
    scanFx(); frame();
    mountTilt(); mountOpm(); mountSpeech(); mountGallery();
    fitTitle(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitle);
    $$('[data-ring]').forEach(mountRing);
    $$('[data-pillar]', app).forEach(function (g) { g.style.cursor = 'pointer'; g.addEventListener('click', function () { if (!g.closest('[data-ring="full"]')) go('#/home/model'); }); });
    if (r.name === 'register') { drawQR(); }
    $$('img', app).forEach(function (im) { if (!im.complete) im.addEventListener('load', function () { scanFx(); frame(); }, { once: true }); });
  }
  /* ---------- the President's word: quotes change by themselves; the line under each name is the timer ---------- */
  function mountSpeech() {
    var box = $('[data-spk]', app); if (!box) return;
    var phs = $$('.spk__ph', box), qs = $$('.spk__q', box), tabs = $$('.spk__tab', box), lab = $('[data-spk-label]', box), cur = 0, started = false;
    qs.forEach(function (q) { var t = $('[data-spk-text]', q); if (t) splitWords(t); });
    function dur(i) { var n = $$('.w', qs[i]).length; return Math.max(8000, Math.min(24000, 4200 + n * 170)); }
    function show(i) {
      cur = (i + qs.length) % qs.length;
      phs.forEach(function (x, k) { x.classList.toggle('on', k === cur); });
      qs.forEach(function (x, k) { var on = k === cur; x.classList.toggle('on', on); x.hidden = !on; x.classList.remove('go'); if (on) { void x.offsetWidth; x.classList.add('go'); if (lab) lab.textContent = x.getAttribute('data-label'); } });
      tabs.forEach(function (x, k) {
        var on = k === cur, b = $('.spk__bar i', x);
        x.classList.toggle('on', on); x.setAttribute('aria-selected', on ? 'true' : 'false');
        if (b) { b.style.animation = 'none'; void b.offsetWidth; b.style.animation = ''; }
        if (on) x.style.setProperty('--dur', dur(cur) + 'ms');
      });
    }
    tabs.forEach(function (t, k) { t.addEventListener('click', function () { show(k); }); });
    if (!reduced) box.addEventListener('animationend', function (e) { if (e.animationName === 'spkbar') show(cur + 1); });
    box.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') box.classList.add('hold'); });
    box.addEventListener('pointerleave', function () { box.classList.remove('hold'); });
    box.addEventListener('focusin', function () { box.classList.add('hold'); });
    box.addEventListener('focusout', function () { box.classList.remove('hold'); });
    if (!io || reduced) { show(0); return; }
    box.classList.add('off');
    var ob = new IntersectionObserver(function (es) {
      var vis = es[0].isIntersecting; box.classList.toggle('off', !vis);
      if (vis && !started) { started = true; show(0); }
    }, { threshold: 0.35 });
    ob.observe(box);
    APP.cleanups.push(function () { ob.disconnect(); });
  }

  /* ---------- success-model photos: columns drift at different speeds; each photo opens up as it comes into view ---------- */
  var galleryHook = null;
  function mountGallery() {
    galleryHook = null;
    var g = $('[data-mosaic]', app); if (!g) return;
    var cols = $$('.smm__col', g), cards = $$('.smm__card', g);
    g.addEventListener('click', function (e) { var c = e.target.closest('[data-lb]'); if (c) openLightbox(+c.getAttribute('data-lb'), c); });
    if (io && !reduced) {
      var ob = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ob.unobserve(e.target); } }); }, { rootMargin: '0px 0px -6% 0px', threshold: 0.12 });
      cards.forEach(function (c) { ob.observe(c); });
      APP.cleanups.push(function () { ob.disconnect(); });
    } else cards.forEach(function (c) { c.classList.add('in'); });
    if (reduced) return;
    function update() {
      var r = g.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom < -120 || r.top > vh + 120) return;
      var p = clamp((vh - r.top) / (vh + r.height), 0, 1) - 0.5;
      if (window.innerWidth < 700) {
        cols.forEach(function (c) { c.style.translate = ''; });
        cards.forEach(function (c) { c.style.translate = '0 ' + (p * 70 * (+c.style.getPropertyValue('--i') % 2 ? 1 : -1)).toFixed(1) + 'px'; });
      } else {
        cards.forEach(function (c) { c.style.translate = ''; });
        cols.forEach(function (c) { c.style.translate = '0 ' + (p * 150 * +c.getAttribute('data-speed')).toFixed(1) + 'px'; });
      }
    }
    update();
    galleryHook = update;
    APP.cleanups.push(function () { galleryHook = null; });
  }

  /* ---------- full-screen photo viewer (arrows, swipe, Esc) ---------- */
  function openLightbox(i, from) {
    var G = window.SUCCESS_GALLERY || {}, list = (G.photos || []).filter(Boolean), n = list.length; if (!n) return;
    var cap = C.isAr() ? (G.caption || '') : (G.caption_en || G.caption || ''), idx = i;
    var lb = document.createElement('div'); lb.className = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('data-lenis-prevent', '');
    lb.innerHTML = '<div class="lb__bg" data-lb-x></div><figure class="lb__fig"><img alt=""><figcaption><b data-lb-n></b><span>' + esc(cap) + '</span></figcaption></figure>' +
      '<button type="button" class="lb__btn lb__x" data-lb-x aria-label="' + tt('Close', 'إغلاق') + '">' + ico('x') + '</button>' +
      '<button type="button" class="lb__btn lb__prev" data-lb-step="-1" aria-label="' + tt('Previous', 'السابقة') + '">' + C.arrow() + '</button>' +
      '<button type="button" class="lb__btn lb__next" data-lb-step="1" aria-label="' + tt('Next', 'التالية') + '">' + C.arrow() + '</button>';
    $('#modal-root').appendChild(lb);
    var img = $('img', lb), num = $('[data-lb-n]', lb);
    function show(k) {
      idx = (k + n) % n; img.classList.remove('in'); void img.offsetWidth;
      img.src = list[idx]; num.textContent = '\u2066' + (idx + 1 < 10 ? '0' : '') + (idx + 1) + ' / ' + (n < 10 ? '0' : '') + n + '\u2069';
      img.classList.add('in');
      [idx - 1, idx + 1].forEach(function (j) { var pre = new Image(); pre.src = list[(j + n) % n]; });
    }
    function close() {
      document.removeEventListener('keydown', onKey); lb.classList.remove('on');
      setTimeout(function () { lb.remove(); }, 260);
      if (APP.lenis) APP.lenis.start(); html.classList.remove('lb-open');
      if (from && from.focus) from.focus({ preventScroll: true });
    }
    function onKey(e) {
      if (e.key === 'Escape') { e.stopPropagation(); close(); }
      else if (e.key === 'ArrowLeft') show(idx + (html.dir === 'rtl' ? 1 : -1));
      else if (e.key === 'ArrowRight') show(idx + (html.dir === 'rtl' ? -1 : 1));
    }
    lb.addEventListener('click', function (e) {
      if (e.target.closest('[data-lb-x]')) { close(); return; }
      var st = e.target.closest('[data-lb-step]'); if (st) show(idx + +st.getAttribute('data-lb-step'));
    });
    var x0 = null;
    lb.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    lb.addEventListener('pointerup', function (e) {
      if (x0 === null) return; var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) < 50) return;
      var fwd = html.dir === 'rtl' ? dx > 0 : dx < 0; show(idx + (fwd ? 1 : -1));
    });
    document.addEventListener('keydown', onKey);
    if (APP.lenis) APP.lenis.stop(); html.classList.add('lb-open');
    show(idx);
    requestAnimationFrame(function () { lb.classList.add('on'); $('.lb__x', lb).focus({ preventScroll: true }); });
  }

  /* ---------- hero title: both lines end at the same point (Arabic: stretched with a kashida, then fine-tuned) ---------- */
  var KASH = { 'التنموي': 5, 'قمة العمل': 8 };
  function fitTitle() {
    var h = $('.hero__title', app); if (!h) return;
    var f = $$('[data-fit]', h); if (f.length < 2) return;
    f.forEach(function (el) { if (el.__t == null) el.__t = el.textContent; el.textContent = el.__t; el.style.transform = ''; el.style.letterSpacing = ''; });
    var w = f.map(function (el) { return el.getBoundingClientRect().width; });
    if (!w[0] || !w[1]) return;
    var big = w[0] >= w[1] ? 0 : 1, el = f[1 - big], target = w[big], t = el.__t, at = KASH[t];
    if (C.isAr() && at != null) {
      var k = 0;
      while (k < 40) {
        el.textContent = t.slice(0, at) + new Array(k + 2).join('ـ') + t.slice(at);
        if (el.getBoundingClientRect().width > target) { el.textContent = t.slice(0, at) + new Array(k + 1).join('ـ') + t.slice(at); break; }
        k++;
      }
      var cur = el.getBoundingClientRect().width;
      if (cur > 0) el.style.transform = 'scaleX(' + (target / cur).toFixed(4) + ')';
    } else {
      el.style.letterSpacing = ((target - w[1 - big]) / Math.max(1, t.length)).toFixed(2) + 'px';
    }
    h.style.setProperty('--tw', target.toFixed(1) + 'px');
  }

  function mountOpm() {
    var box = $('[data-opm]', app); if (!box || !io) { if (box) box.className = 'opm__sticky s2'; return; }
    var steps = $$('.ostep', app), cap = $('[data-opm-cap]', box);
    var caps = D.pillars.map(function (p) { return plabel(p) + ' — ' + L(p.tag); });
    var ob = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = +e.target.getAttribute('data-step');
        box.className = 'opm__sticky s' + i; steps.forEach(function (s) { s.classList.toggle('on', s === e.target); });
        if (cap) cap.textContent = caps[i];
      });
    }, { rootMargin: '-42% 0px -42% 0px', threshold: 0 });
    steps.forEach(function (s) { ob.observe(s); });
    APP.cleanups.push(function () { ob.disconnect(); });
  }
  function mountTilt() {
    if (reduced || !window.matchMedia('(pointer:fine)').matches) return;
    $$('[data-tilt]', app).forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg'); el.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
        el.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%'); el.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', function () { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }

  /* ---------- the summit map: tap a category, a track, a pillar or the centre ---------- */
  function mountRing(box) {
    var svg = $('svg.ring', box), tip = $('.ringtip', box), full = box.getAttribute('data-ring') === 'full';
    if (!svg) return;
    var nodes = $$('.rnode', svg), chords = $$('.chord', svg), segs = $$('.rseg', svg), pils = $$('.rpil', svg);
    var sel = null;
    function clear() { svg.classList.remove('is-focus'); nodes.concat(chords, segs).forEach(function (n) { n.classList.remove('on', 'sel'); }); }
    function focusCat(a) {
      clear(); svg.classList.add('is-focus');
      nodes.forEach(function (n) { if (n.getAttribute('data-cat') === a) n.classList.add('on', 'sel'); });
      chords.forEach(function (ch) { var x = ch.getAttribute('data-a'), y = ch.getAttribute('data-b'); if (x === a || y === a) { ch.classList.add('on'); nodes.forEach(function (n) { var c = n.getAttribute('data-cat'); if (c === x || c === y) n.classList.add('on'); }); } });
    }
    function focusTrack(id) { clear(); svg.classList.add('is-focus'); segs.forEach(function (s) { if (s.getAttribute('data-track') === String(id)) s.classList.add('on', 'sel'); }); }
    function restore() { if (sel && sel.cat) focusCat(sel.cat); else if (sel && sel.track) focusTrack(sel.track); else clear(); }
    function panel(htmlStr) { var p = $('[data-ring-panel]'); if (!p) return; p.innerHTML = htmlStr; p.classList.remove('swap'); void p.offsetWidth; p.classList.add('swap'); mountReveals(p, true); }
    function showTip(e, h) { if (!tip) return; var r = box.getBoundingClientRect(); tip.innerHTML = h; tip.classList.add('on'); tip.style.left = clamp(e.clientX - r.left, 90, r.width - 90) + 'px'; tip.style.top = (e.clientY - r.top - 14) + 'px'; }
    function hideTip() { if (tip) tip.classList.remove('on'); }
    var key = function (el, fn) { el.addEventListener('click', fn); el.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } }); };
    nodes.forEach(function (n) {
      var cat = n.getAttribute('data-cat'), s = C.stake(cat), tipH = '<b>' + E(s.name) + '</b><span>' + E(s.line) + '</span>';
      n.addEventListener('pointerenter', function (e) { if (!sel) focusCat(cat); showTip(e, tipH); });
      n.addEventListener('pointermove', function (e) { showTip(e, tipH); });
      n.addEventListener('pointerleave', function () { hideTip(); restore(); });
      key(n, function () { if (!full) { go('#/ring'); return; } sel = { cat: cat }; focusCat(cat); panel(V.ringPanelCat(cat)); });
    });
    segs.forEach(function (sg) {
      var id = +sg.getAttribute('data-track'), t = C.track(id), tipH = '<b>0' + id + ' | ' + E(t.name) + '</b><span>' + tt('Open track', 'افتح المسار') + '</span>';
      sg.addEventListener('pointerenter', function (e) { if (!sel) focusTrack(id); showTip(e, tipH); });
      sg.addEventListener('pointermove', function (e) { showTip(e, tipH); });
      sg.addEventListener('pointerleave', function () { hideTip(); restore(); });
      key(sg, function () { if (!full) { go('#/projects/' + t.slug); return; } sel = { track: id }; focusTrack(id); panel(V.ringPanelTrack(id)); });
    });
    pils.forEach(function (pg) {
      var k = pg.getAttribute('data-pillar'), p = C.pillar(k);
      pg.addEventListener('pointerenter', function (e) { showTip(e, '<b>' + plabel(p) + '</b><span>' + E(p.tag) + '</span>'); });
      pg.addEventListener('pointerleave', hideTip);
      if (full) pg.addEventListener('click', function () { sel = null; clear(); panel(V.ringPanelPillar(k)); });
    });
    var hub = $('.ring__hub', svg);
    if (hub) {
      hub.addEventListener('pointerenter', function (e) { showTip(e, '<b>' + E(D.summit.name) + '</b><span>' + E(D.summit.theme) + '</span>'); });
      hub.addEventListener('pointerleave', hideTip);
      key(hub, function () { if (!full) { go('#/ring'); return; } sel = null; clear(); panel(V.ringPanelHub()); });
    }
  }

  /* ================= FORMS ================= */
  var MSG = {
    required: { ar: 'من فضلك املأ الخانات المطلوبة (المحددة بعلامة *).', en: 'Please fill in the required fields (marked *).' },
    email: { ar: 'من فضلك اكتب بريدًا إلكترونيًا صحيحًا.', en: 'Please enter a valid email address.' },
    agree: { ar: 'من فضلك وافق على الشروط قبل الإرسال.', en: 'Please agree to the terms before sending.' }
  };
  function validate(form) {
    var bad = null;
    $$('.bad', form).forEach(function (x) { x.classList.remove('bad'); });
    $$('[required]', form).forEach(function (inp) {
      var ok = inp.type === 'checkbox' ? inp.checked : String(inp.value || '').trim() !== '';
      if (!ok) { var box = inp.closest('.field') || inp.closest('.check'); if (box) box.classList.add('bad'); if (!bad) bad = inp.type === 'checkbox' ? 'agree' : 'required'; }
    });
    var em = $('input[type="email"]', form);
    if (!bad && em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) { em.closest('.field').classList.add('bad'); bad = 'email'; }
    return bad;
  }
  document.addEventListener('submit', function (e) {
    var form = e.target, kind = form.getAttribute('data-form'); if (!kind) return;
    e.preventDefault();
    var err = $('.wz__err', form), bad = validate(form);
    if (bad) { err.textContent = MSG[bad][C.lang]; err.classList.add('on'); var f1 = $('.bad input, .bad select, .bad textarea', form); if (f1) f1.focus(); return; }
    err.textContent = ''; err.classList.remove('on');
    var fd = new FormData(form), data = {};
    fd.forEach(function (v, k) { if (data[k]) data[k] = [].concat(data[k], v); else data[k] = v; });
    S.add(kind === 'project' ? 'projects' : 'registrations', data);
    form.hidden = true;
    var done = $('[data-done="' + kind + '"]'); if (done) done.hidden = false;
    scrollToEl($('.formbox'));
  });

  /* ---------- QR code to the registration page ---------- */
  function drawQR() {
    var box = $('#qr'); if (!box) return;
    if (!window.qrcode) { setTimeout(drawQR, 300); return; }
    var url = location.href.split('#')[0].split('?')[0] + '#register';
    try { var q = window.qrcode(0, 'M'); q.addData(url); q.make(); box.innerHTML = q.createSvgTag({ cellSize: 6, margin: 2, scalable: true }); box.title = url; } catch (e) { }
  }

  /* ================= SEARCH ================= */
  var pal = $('#palette'), palIdx = [], palSel = 0;
  function buildIndex() {
    var ix = [], dark = '#0B4D44';
    ix.push({ t: tt('Home', 'الرئيسية'), s: L(D.summit.theme), h: '#/', i: 'home', c: dark });
    sections().forEach(function (s) { ix.push({ t: s[2], s: s[3], h: '#/home/' + s[0], i: s[1], c: dark, k: tt('Section', 'قسم') }); });
    ix.push({ t: tt('Summit map', 'خريطة القمة'), s: tt('Categories, tracks and the operating model', 'الفئات والمسارات ونموذج العمل'), h: '#/ring', i: 'orbit', c: dark, k: tt('Page', 'صفحة') });
    ix.push({ t: tt('Submit a project', 'تقديم مشروع'), s: tt('Projects with community impact', 'المشروعات ذات الأثر المجتمعي'), h: '#/projects', i: 'target', c: '#F08A24', k: tt('Page', 'صفحة') });
    ix.push({ t: tt('Take part', 'شارك معنا'), s: tt('Attend, speak or partner', 'حضور أو متحدث أو شريك'), h: '#/register', i: 'users', c: '#F08A24', k: tt('Page', 'صفحة') });
    ix.push({ t: tt('Partnership opportunities', 'فرص الشراكة'), s: tt('Registration form', 'نموذج التسجيل'), h: '#/register/partner', i: 'handshake', c: '#F08A24', k: tt('Page', 'صفحة') });
    ix.push({ t: tt('Request a networking meeting', 'طلب لقاء تعارف'), s: tt('Arranged by NACDW at the Summit', 'يرتبه التحالف أثناء القمة'), h: '#/register/match', i: 'calendar', c: '#F08A24', k: tt('Page', 'صفحة') });
    (window.SUCCESS_MODELS || []).forEach(function (m) { if (m && m.title) ix.push({ t: m.title, s: (m.org || '') + (m.place ? tt(', ', '، ') + m.place : ''), h: '#/home/models', i: 'award', c: '#F08A24', k: tt('Success model', 'نموذج ناجح'), x: (m.title_en || '') + (m.impact || '') }); });
    D.pillars.forEach(function (p) { ix.push({ t: plabel(p), s: L(p.tag) + ' — ' + p.formats.map(L).join('، '), h: '#/home/model', i: p.icon, c: p.color, k: tt('Operating model', 'نموذج العمل'), x: p.label + p.name.en + p.name.ar }); });
    D.tracks.forEach(function (t) { ix.push({ t: L(t.name), s: tt('Track 0', 'المسار 0') + t.id, h: '#/projects/' + t.slug, i: t.icon, c: t.color, k: tt('Track', 'مسار'), x: t.name.en + t.name.ar }); });
    D.stakeholders.forEach(function (s) { ix.push({ t: L(s.name), s: L(s.line), h: '#/register/' + s.sector, i: s.icon, c: s.color, k: tt('Target audience', 'الجمهور المستهدف'), x: s.name.en + s.name.ar + s.line.en + s.line.ar }); });
    D.partners.forEach(function (p) { p.items.forEach(function (x) { ix.push({ t: L(x), s: tt('Potential partners | ', 'الشركاء المحتملون | ') + L(p.name), h: '#/home/partners', i: p.icon, c: dark, k: tt('Partner', 'شريك'), x: x.en + x.ar }); }); });
    D.mechanisms.forEach(function (m) { ix.push({ t: L(m.name), s: L(m.desc), h: '#/home/matchmaking', i: m.icon, c: dark, k: tt('Networking meetings', 'لقاءات التعارف'), x: m.name.en + m.name.ar }); });
    return ix;
  }
  function openPalette() {
    palIdx = buildIndex(); palSel = 0;
    pal.innerHTML = '<div class="palette__bg" data-pal-close></div><div class="palette__box" role="dialog" aria-label="search"><label class="palette__in">' + ico('search') + '<input type="search" placeholder="' + tt('Search tracks, sections, categories…', 'ابحث عن مسار أو قسم أو فئة…') + '" data-pal-q><kbd>Esc</kbd></label><div class="palette__res" data-pal-res data-lenis-prevent></div></div>';
    pal.hidden = false; requestAnimationFrame(function () { pal.classList.add('in'); });
    if (APP.lenis) APP.lenis.stop();
    var q = $('[data-pal-q]', pal); q.focus(); drawPalette('');
    q.addEventListener('input', function () { palSel = 0; drawPalette(q.value); });
    q.addEventListener('keydown', function (e) {
      var items = $$('.palette__item', pal);
      if (e.key === 'ArrowDown') { e.preventDefault(); palSel = Math.min(items.length - 1, palSel + 1); hi(items); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); palSel = Math.max(0, palSel - 1); hi(items); }
      else if (e.key === 'Enter' && items[palSel]) { e.preventDefault(); items[palSel].click(); }
    });
  }
  function hi(items) { items.forEach(function (it, i) { it.classList.toggle('on', i === palSel); }); if (items[palSel]) items[palSel].scrollIntoView({ block: 'nearest' }); }
  function drawPalette(q) {
    q = q.trim().toLowerCase();
    var res = palIdx.filter(function (x) { return !q || (x.t + ' ' + x.s + ' ' + (x.x || '') + ' ' + (x.k || '')).toLowerCase().indexOf(q) > -1; }).slice(0, 40);
    $('[data-pal-res]', pal).innerHTML = res.length ? res.map(function (x, i) {
      return '<a class="palette__item' + (i === palSel ? ' on' : '') + '" href="' + x.h + '" style="--c:' + x.c + '"><span class="palette__ic">' + ico(x.i) + '</span><span><b>' + esc(x.t) + '</b><small>' + esc(x.s) + '</small></span>' + (x.k ? '<em>' + esc(x.k) + '</em>' : '') + '</a>';
    }).join('') : '<p class="palette__none">' + tt('No results', 'لا توجد نتائج') + '</p>';
  }
  function closePalette() { if (pal.hidden) return; pal.classList.remove('in'); setTimeout(function () { pal.hidden = true; pal.innerHTML = ''; }, 220); if (APP.lenis) APP.lenis.start(); }
  pal.addEventListener('click', function (e) {
    if (e.target.closest('[data-pal-close]')) { closePalette(); return; }
    if (e.target.closest('.palette__item')) closePalette();
  });

  /* ================= EVENTS ================= */
  var acts = {
    'skip-intro': function () { endIntro(); },
    lang: function () { C.setLang(C.isAr() ? 'en' : 'ar'); renderChrome(); if (APP.route) { paint(APP.route, true); scrollTop(); } },
    search: openPalette,
    menu: function () { html.classList.toggle('menu-open'); $('#nav').classList.remove('nav--hide'); },
    totop: function () { if (APP.lenis) APP.lenis.scrollTo(0, { duration: 1.4 }); else window.scrollTo({ top: 0, behavior: 'smooth' }); },
    scrollto: function (el) { scrollToEl(document.getElementById(el.getAttribute('data-target'))); },
    car: function (el) { var c = $('[data-carousel]', app); if (c) c.scrollBy({ left: +el.getAttribute('data-dir') * 360, behavior: 'smooth' }); },
    way: function (el) { var r = $('input[name="type"][value="' + el.getAttribute('data-way') + '"]'); if (r) { r.checked = true; scrollToEl($('.formbox')); } },
    again: function (el) { var k = el.getAttribute('data-form'), f = $('form[data-form="' + k + '"]'); if (!f) return; f.reset(); f.hidden = false; el.closest('[data-done]').hidden = true; }
  };
  document.addEventListener('click', function (e) {
    if (e.target.closest('.skip-link')) { e.preventDefault(); app.focus(); return; }
    var plain = !(e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) && e.button === 0;
    var el = e.target.closest('[data-act]');
    if (el && acts[el.getAttribute('data-act')]) {
      e.preventDefault(); acts[el.getAttribute('data-act')](el, e);
      var lh = el.tagName === 'A' ? el.getAttribute('href') : null; if (lh && lh.indexOf('#/') === 0) go(lh);
      return;
    }
    var ddt = e.target.closest('.dd__t');
    if (ddt) { var dd = ddt.closest('.dd'), open = dd.classList.contains('open'); $$('.dd.open').forEach(function (x) { x.classList.remove('open'); }); dd.classList.remove('dd--closed'); if (!open) dd.classList.add('open'); ddt.setAttribute('aria-expanded', !open); return; }
    if (!e.target.closest('.dd')) $$('.dd.open').forEach(function (x) { x.classList.remove('open'); });
    var a = e.target.closest('a[href^="#"]');
    if (a) {
      if (a.closest('.dd')) closeDropdowns();
      $$('.dd.open').forEach(function (x) { x.classList.remove('open'); }); closeMenu();
      var href = a.getAttribute('href');
      if (href.indexOf('#/') !== 0 || !plain) return;
      e.preventDefault();
      if ('#' + toHash(href) === location.hash && APP.route) { var tg = subTarget(parse()); if (tg) scrollToEl(tg); else scrollTopSmooth(); }
      else go(href);
    }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.hidden ? openPalette() : closePalette(); return; }
    if (e.key === 'Escape') { if (!pal.hidden) closePalette(); else closeMenu(); $$('.dd.open').forEach(function (x) { x.classList.remove('open'); }); if ($('#intro')) endIntro(); }
  });
  window.addEventListener('hashchange', route);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { scanFx(); onScroll(); fitTitle(); });

  /* ================= INTRO: the logo first, then the panels swipe across and reveal the site ================= */
  var introTimer = null, introDone = false;
  function endIntro() {
    if (introDone) return; introDone = true; clearTimeout(introTimer);
    var el = $('#intro'), pt = $('#pt');
    var open = function () { if (el) el.remove(); html.classList.remove('intro-on'); document.body.classList.add('is-ready'); if (APP.lenis) APP.lenis.start(); scanFx(); frame(); };
    if (!el) { document.body.classList.add('is-ready'); return; }
    if (reduced || !pt) { el.classList.add('intro--out'); setTimeout(open, 250); return; }
    pt.classList.add('pt--intro'); pt.classList.remove('out'); void pt.offsetWidth; pt.classList.add('in');
    el.classList.add('intro--swipe');
    setTimeout(function () {
      open();
      pt.classList.add('out'); pt.classList.remove('in');
      setTimeout(function () { pt.classList.remove('out', 'pt--intro'); }, 820);
    }, 860);
  }
  function startIntro() {
    var el = $('#intro');
    if (!el || html.classList.contains('no-intro')) { if (el) el.remove(); introDone = true; document.body.classList.add('is-ready'); return; }
    html.classList.add('intro-on');
    if (APP.lenis) APP.lenis.stop();
    introTimer = setTimeout(endIntro, reduced ? 1600 : 3300);
  }

  /* ================= BOOT ================= */
  function boot() {
    try { history.scrollRestoration = 'manual'; } catch (e) { }
    C.setLang(C.lang);
    var initLenis = function () {
      if (APP.lenis || !window.Lenis || reduced) return;
      try {
        APP.lenis = new window.Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 });
        var raf = function (t) { APP.lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
        if (html.classList.contains('intro-on')) APP.lenis.stop();
      } catch (e) { APP.lenis = null; }
    };
    if (window.Lenis) initLenis(); else window.__lenisReady = initLenis;
    renderChrome();
    startIntro();
    route();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
