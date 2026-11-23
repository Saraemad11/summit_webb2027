/* Core helpers & shared UI components */
(function () {
  var D = window.NDS_DATA;
  var C = {};
  C.lang = (function () { try { var l = localStorage.getItem('das27.lang'); return l === 'en' ? 'en' : 'ar'; } catch (e) { return 'ar'; } })();
  C.isAr = function () { return C.lang === 'ar'; };
  C.setLang = function (l) {
    C.lang = l; try { localStorage.setItem('das27.lang', l); } catch (e) { }
    document.documentElement.lang = l; document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  };
  C.L = function (o) { if (o == null) return ''; if (typeof o === 'string') return o; return o[C.lang] || o.en || ''; };
  C.tt = function (en, ar) { return C.lang === 'ar' ? ar : en; };
  C.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  C.E = function (o) { return C.esc(C.L(o)); };
  C.ico = function (n, cls) { return window.icon(n, cls); };
  C.arrow = function () { return window.icon('arrow', 'dir-flip'); };
  C.num = function (n) { return Number(n).toLocaleString('en-US'); };
  C.money = function (n) { if (!n) return '—'; return n >= 1e6 ? '$' + (n / 1e6).toFixed(n % 1e6 ? 1 : 0) + 'M' : '$' + Math.round(n / 1e3) + 'K'; };
  C.ago = function (t) {
    var s = Math.max(1, Math.round((Date.now() - t) / 1000)), u;
    if (s < 60) return C.tt('just now', 'الآن');
    if (s < 3600) { u = Math.round(s / 60); return C.tt(u + ' min ago', 'منذ ' + u + ' دقيقة'); }
    if (s < 86400) { u = Math.round(s / 3600); return C.tt(u + ' h ago', 'منذ ' + u + ' ساعة'); }
    u = Math.round(s / 86400); return C.tt(u + ' days ago', 'منذ ' + u + ' يوم');
  };
  // Preferred meeting date chosen by the requester (YYYY-MM-DD).
  C.slot = function (s) { if (!s) return ''; try { return new Date(s + 'T12:00:00').toLocaleDateString(C.isAr() ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return s; } };

  /* lookups */
  C.track = function (id) { return D.tracks.find(function (t) { return t.id === +id; }); };
  C.trackBySlug = function (s) { return D.tracks.find(function (t) { return t.slug === s; }); };
  C.stake = function (slug) { return D.stakeholders.find(function (s) { return s.slug === slug; }); };
  C.pillar = function (k) { return D.pillars.find(function (p) { return p.key === k; }); };
  C.model = function (id) { return window.Store.model(id); };

  /* ---------- components ---------- */
  C.head = function (o) {
    return '<div class="shead ' + (o.center ? 'shead--center ' : '') + (o.light ? 'shead--light ' : '') + (o.cls || '') + '">' +
      (o.eyebrow ? '<div class="eyebrow" data-reveal>' + o.eyebrow + '</div>' : '') +
      '<h2 class="h2" data-split>' + o.title + '</h2>' +
      '<div class="rule" data-reveal="grow"><i></i><b></b></div>' +
      (o.lede ? '<p class="lede" data-reveal style="--d:.15s">' + o.lede + '</p>' : '') + '</div>';
  };
  C.btn = function (label, href, v, ic, extra) {
    return '<a class="btn btn--' + (v || 'primary') + '" href="' + href + '" ' + (extra || '') + '><span>' + label + '</span>' + (ic === false ? '' : (ic ? C.ico(ic) : C.arrow())) + '</a>';
  };
  C.abtn = function (label, act, v, ic, data) {
    return '<button type="button" class="btn btn--' + (v || 'primary') + '" data-act="' + act + '" ' + (data || '') + '><span>' + label + '</span>' + (ic === false ? '' : (ic ? C.ico(ic) : C.arrow())) + '</button>';
  };
  C.trackChip = function (id, small) {
    var t = C.track(id); if (!t) return '';
    return '<a href="#/tracks/' + t.slug + '" class="tchip' + (small ? ' tchip--sm' : '') + '" style="--c:' + t.color + '"><i></i>' + C.E(t.name) + '</a>';
  };
  C.trackDots = function (ids) {
    return '<span class="tdots">' + (ids || []).map(function (id) { var t = C.track(id); return t ? '<i style="--c:' + t.color + '" title="' + C.E(t.name) + '"></i>' : ''; }).join('') + '</span>';
  };
  C.pillarChip = function (k, label) {
    var p = C.pillar(k); if (!p) return '';
    return '<span class="pchip pchip--' + k + '">' + C.ico(p.icon) + (label || C.E(p.name)) + '</span>';
  };
  C.res = function (k) { var r = D.resources[k]; return r ? '<span class="rchip">' + C.ico(r.icon) + C.E(r.name) + '</span>' : ''; };
  C.catChip = function (slug, short) {
    var s = C.stake(slug); if (!s) return '';
    return '<a class="cchip" href="#/interfaces/' + s.slug + '" style="--c:' + s.color + '">' + C.ico(s.icon) + C.E(short ? s.short : s.name) + '</a>';
  };
  C.initials = function (o) {
    var n = C.L(o.name).replace(/[()\-—&]/g, ' ').split(/\s+/).filter(function (w) { return w && !/^(the|of|for|and|ال|و)$/i.test(w); });
    if (C.isAr()) return (n[0] || '?').replace(/^ال/, '').charAt(0) + ((n[1] || '').replace(/^ال/, '').charAt(0) || '');
    return ((n[0] || '?').charAt(0) + (n[1] || '').charAt(0)).toUpperCase();
  };
  C.avatar = function (o, size) {
    if (!o) return '';
    var s = C.stake(o.cat);
    return '<span class="avatar' + (size ? ' avatar--' + size : '') + '" style="--c:' + (s ? s.color : '#0B4D44') + '">' + (o.demo && s ? C.ico(s.icon) : C.esc(C.initials(o))) + '</span>';
  };
  C.demo = function (o) { return o && o.demo ? '<span class="demo-tag">' + C.tt('Demo', 'تجريبي') + '</span>' : ''; };
  C.empty = function (ic, title, text, cta) {
    return '<div class="empty">' + C.ico(ic) + '<h4>' + title + '</h4>' + (text ? '<p>' + text + '</p>' : '') + (cta || '') + '</div>';
  };

  /* Ring progress stepper for a connection (Dialogue → Partnership → Action → Follow-up) */
  C.stepper = function (c) {
    var st = window.Store.STAGES, idx = st.indexOf(c.stage);
    var html = '<div class="stepper">';
    st.forEach(function (k, i) {
      var p = C.pillar(k), cls = i < idx ? 'done' : (i === idx ? (c.status === 'accepted' ? 'done' : c.status === 'declined' ? 'declined' : 'current') : '');
      html += '<span class="stepper__s stepper__s--' + k + ' ' + cls + '" title="' + C.E(p.name) + '">' + C.ico(p.icon) + '</span>' + (i < 2 ? '<i class="' + (i < idx ? 'on' : '') + '"></i>' : '');
    });
    var loop = c.stage === 'action' && c.progress === 'delivered';
    html += '<i class="' + (loop ? 'on' : '') + '"></i><span class="stepper__s stepper__s--loop ' + (loop ? 'done' : '') + '" title="' + C.tt('Follow-up', 'المتابعة') + '">' + C.ico('repeat') + '</span></div>';
    return html;
  };

  /* ---------- toasts ---------- */
  C.toast = function (html, type, ms) {
    var root = document.getElementById('toasts');
    var el = document.createElement('div');
    el.className = 'toast toast--' + (type || 'info');
    el.innerHTML = '<span class="toast__ic">' + C.ico(type === 'ok' ? 'check' : type === 'warn' ? 'info' : 'sparkles') + '</span><div>' + html + '</div><button type="button" aria-label="close">' + C.ico('x') + '</button>';
    root.appendChild(el);
    var kill = function () { el.classList.add('out'); setTimeout(function () { el.remove(); }, 400); };
    el.querySelector('button').onclick = kill;
    requestAnimationFrame(function () { el.classList.add('in'); });
    setTimeout(kill, ms || 4800);
  };

  /* ---------- modal ---------- */
  C.modal = function (html, opts) {
    opts = opts || {};
    C.closeModal(true);
    var root = document.getElementById('modal-root');
    root.innerHTML = '<div class="modal ' + (opts.cls || '') + '" role="dialog" aria-modal="true"><div class="modal__bg" data-act="close-modal"></div>' +
      '<div class="modal__card" data-lenis-prevent><button class="modal__x" type="button" data-act="close-modal" aria-label="close">' + C.ico('x') + '</button>' + html + '</div></div>';
    document.documentElement.classList.add('modal-open');
    if (window.APP && APP.lenis) APP.lenis.stop();
    requestAnimationFrame(function () { root.firstChild.classList.add('in'); var f = root.querySelector('input,select,textarea,button:not(.modal__x)'); if (f && !opts.nofocus) f.focus({ preventScroll: true }); });
  };
  C.closeModal = function (instant) {
    var root = document.getElementById('modal-root'), m = root.firstChild;
    document.documentElement.classList.remove('modal-open');
    if (window.APP && APP.lenis) APP.lenis.start();
    if (!m) return;
    if (instant) { root.innerHTML = ''; return; }
    m.classList.remove('in'); setTimeout(function () { if (root.firstChild === m) root.innerHTML = ''; }, 320);
  };

  window.C = C;
})();
