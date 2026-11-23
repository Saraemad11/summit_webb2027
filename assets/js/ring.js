/* =====================================================================
   Summit map — SVG generators
   - RING.big()   : interactive national network (tracks · communities · pillars · hub)
   - RING.model() : operating-model loop (Dialogue → Partnership → Action)
   - RING.ego()   : an organisation's personal ring (portal)
   - RING.orbit() : hero composition (HTML)
   ===================================================================== */
(function () {
  var D = window.NDS_DATA;
  function P(cx, cy, r, deg) { var a = deg * Math.PI / 180; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
  function f(n) { return Math.round(n * 100) / 100; }
  function arc(cx, cy, r, a0, a1, rev) {
    var s = P(cx, cy, r, rev ? a1 : a0), e = P(cx, cy, r, rev ? a0 : a1), large = Math.abs(a1 - a0) > 180 ? 1 : 0;
    return 'M' + f(s[0]) + ' ' + f(s[1]) + ' A' + r + ' ' + r + ' 0 ' + large + ' ' + (rev ? 0 : 1) + ' ' + f(e[0]) + ' ' + f(e[1]);
  }
  function sector(cx, cy, r1, r2, a0, a1) {
    var a = P(cx, cy, r2, a0), b = P(cx, cy, r2, a1), c = P(cx, cy, r1, a1), d = P(cx, cy, r1, a0), L = (a1 - a0) > 180 ? 1 : 0;
    return 'M' + f(a[0]) + ' ' + f(a[1]) + ' A' + r2 + ' ' + r2 + ' 0 ' + L + ' 1 ' + f(b[0]) + ' ' + f(b[1]) + ' L' + f(c[0]) + ' ' + f(c[1]) + ' A' + r1 + ' ' + r1 + ' 0 ' + L + ' 0 ' + f(d[0]) + ' ' + f(d[1]) + 'Z';
  }
  function svgIcon(name, x, y, s, color) {
    return '<svg x="' + x + '" y="' + y + '" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || '#fff') + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + (window.ICONS[name] || '') + '</svg>';
  }
  function arrowHead(cx, cy, r, deg, size, color) {
    // small chevron pointing clockwise at angle deg
    var tip = P(cx, cy, r, deg + 1.2), b1 = P(cx, cy, r - size, deg - 2.2), b2 = P(cx, cy, r + size, deg - 2.2);
    return '<path d="M' + f(b1[0]) + ' ' + f(b1[1]) + ' L' + f(tip[0]) + ' ' + f(tip[1]) + ' L' + f(b2[0]) + ' ' + f(b2[1]) + '" fill="none" stroke="' + color + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  var PIL = [{ k: 'dialogue', a0: -90, a1: 30 }, { k: 'partnership', a0: 30, a1: 150 }, { k: 'action', a0: 150, a1: 270 }];

  var RING = {};

  /* ---------------- interactive network ring ---------------- */
  RING.big = function (opt) {
    opt = opt || {};
    var cx = 500, cy = 500, id = 'r' + Math.random().toString(36).slice(2, 7);
    var links = window.Store.catLinks();
    var nodes = D.stakeholders.map(function (s, i) { var a = -90 + i * 60, p = P(cx, cy, 292, a); return { s: s, a: a, x: p[0], y: p[1] }; });
    var o = '<svg class="ring" id="' + id + '" viewBox="0 0 1000 1000" role="img" aria-label="' + C.tt('Summit map', 'خريطة القمة') + '">';
    o += '<defs><filter id="' + id + 'sh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="16" flood-color="#021F1B" flood-opacity=".28"/></filter>' +
      '<radialGradient id="' + id + 'glow"><stop offset="0" stop-color="#23968B" stop-opacity=".35"/><stop offset="1" stop-color="#23968B" stop-opacity="0"/></radialGradient></defs>';
    o += '<circle cx="500" cy="500" r="420" fill="url(#' + id + 'glow)" class="ring__glow"/>';
    // tracks (outer band)
    o += '<g class="ring__tracks">';
    D.tracks.forEach(function (t, i) {
      var mid = -90 + i * 45, a0 = mid - 21.6, a1 = mid + 21.6, rev = (mid > 0 && mid < 180);
      var pid = id + 't' + t.id, np = P(cx, cy, 445, mid);
      o += '<g class="rseg" data-track="' + t.id + '" tabindex="0" role="button" aria-label="' + C.E(t.name) + '">' +
        '<path class="rseg__band" d="' + sector(cx, cy, 422, 470, a0, a1) + '" fill="' + t.color + '"/>' +
        '<path id="' + pid + '" d="' + arc(cx, cy, 446, a0 + 1, a1 - 1, rev) + '" fill="none"/>' +
        '<text class="rseg__label" dy="5"><textPath href="#' + pid + '" startOffset="50%" text-anchor="middle">' + ('0' + t.id) + '  ' + C.E(t.name) + '</textPath></text>' +
        '<text class="rseg__num" x="' + f(np[0]) + '" y="' + f(np[1]) + '" dy="6" text-anchor="middle">0' + t.id + '</text></g>';
    });
    o += '</g><circle cx="500" cy="500" r="404" class="ring__hair"/>';
    // pillar loop
    o += '<g class="ring__pillars">';
    PIL.forEach(function (p) {
      var pl = C.pillar(p.k), pid = id + 'p' + p.k, rev = p.k === 'partnership';
      o += '<g class="rpil rpil--' + p.k + '" data-pillar="' + p.k + '">' +
        '<path d="' + arc(cx, cy, 170, p.a0 + 3, p.a1 - 3) + '" stroke="' + pl.color + '" stroke-width="34" fill="none" stroke-linecap="round"/>' +
        '<path id="' + pid + '" d="' + arc(cx, cy, 170, p.a0 + 6, p.a1 - 6, rev) + '" fill="none"/>' +
        '<text class="rpil__label" dy="5"><textPath href="#' + pid + '" startOffset="50%" text-anchor="middle">' + (C.isAr() ? C.E(pl.name) : pl.label) + '</textPath></text>' +
        arrowHead(cx, cy, 170, p.a1 - 3, 9, 'rgba(255,255,255,.95)') + '</g>';
    });
    o += '<path id="' + id + 'loop" d="M500 330 A170 170 0 1 1 500 670 A170 170 0 1 1 500 330" fill="none"/>';
    [0, 4, 8].forEach(function (b) { o += '<circle r="5" class="ring__particle"><animateMotion dur="12s" begin="' + b + 's" repeatCount="indefinite" rotate="auto"><mpath href="#' + id + 'loop"/></animateMotion></circle>'; });
    o += '</g>';
    // chords (every community linked to every other — through the hub)
    o += '<g class="ring__chords">';
    for (var i = 0; i < nodes.length; i++) for (var j = i + 1; j < nodes.length; j++) {
      var A = nodes[i], B = nodes[j], k = [A.s.slug, B.s.slug].sort().join('|'), L = links[k] || { n: 0, top: 'dialogue' };
      var mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2, adj = (j - i === 1 || j - i === 5), k2 = adj ? 0.62 : 0.3, qx = cx + (mx - cx) * k2, qy = cy + (my - cy) * k2;
      var w = Math.min(2 + L.n * 1.6, 11);
      o += '<path class="chord chord--' + L.top + '" data-a="' + A.s.slug + '" data-b="' + B.s.slug + '" data-n="' + L.n + '" d="M' + f(A.x) + ' ' + f(A.y) + ' Q' + f(qx) + ' ' + f(qy) + ' ' + f(B.x) + ' ' + f(B.y) + '" stroke-width="' + f(w) + '"/>';
    }
    o += '</g>';
    // nodes
    o += '<g class="ring__nodes">';
    nodes.forEach(function (n) {
      var lbl = C.E(n.s.short), lw = Math.max(90, lbl.length * (C.isAr() ? 9.2 : 8.6) + 26);
      o += '<g class="rnode" data-cat="' + n.s.slug + '" tabindex="0" role="button" aria-label="' + C.E(n.s.name) + '" transform="translate(' + f(n.x) + ' ' + f(n.y) + ')">' +
        '<circle r="66" class="rnode__halo" fill="' + n.s.color + '"/>' +
        '<circle r="48" fill="' + n.s.color + '" class="rnode__dot"/>' + svgIcon(n.s.icon, -17, -17, 34) +
        '<g class="rnode__lbl" transform="translate(0 76)"><rect x="' + f(-lw / 2) + '" y="-16" width="' + f(lw) + '" height="32" rx="16"/><text dy="5" text-anchor="middle">' + lbl + '</text></g></g>';
    });
    o += '</g>';
    // hub
    o += '<g class="ring__hub" data-hub="1" tabindex="0" role="button" aria-label="' + C.E(D.summit.name) + '"><circle cx="500" cy="500" r="116" fill="#fff" filter="url(#' + id + 'sh)"/>' +
      '<circle cx="500" cy="500" r="116" fill="none" class="ring__hubring"/><image href="assets/img/logo-mark.png" x="434" y="427" width="132" height="146"/></g>';
    o += '</svg>';
    return o;
  };

  /* ---------------- operating-model loop ---------------- */
  RING.model = function () {
    var cx = 300, cy = 300, r = 214, id = 'm' + Math.random().toString(36).slice(2, 7);
    var o = '<svg class="mring" viewBox="0 0 600 600" aria-hidden="true">';
    o += '<circle cx="300" cy="300" r="' + r + '" class="mring__track"/>';
    o += '<circle cx="300" cy="300" r="272" class="mring__outer"/>';
    PIL.forEach(function (p, i) {
      var pl = C.pillar(p.k), pid = id + p.k, rev = p.k === 'partnership';
      o += '<g class="marc marc--' + p.k + '" data-i="' + i + '" data-pillar="' + p.k + '">' +
        '<path class="marc__path" d="' + arc(cx, cy, r, p.a0 + 3.5, p.a1 - 3.5) + '" stroke="' + pl.color + '" pathLength="100"/>' +
        '<path id="' + pid + '" d="' + arc(cx, cy, r, p.a0 + 8, p.a1 - 8, rev) + '" fill="none"/>' +
        '<text class="marc__label" dy="6"><textPath href="#' + pid + '" startOffset="50%" text-anchor="middle">' + (C.isAr() ? C.E(pl.name) : pl.label) + '</textPath></text>' +
        '<g class="marc__head">' + arrowHead(cx, cy, r, p.a1 - 3.5, 11, '#fff') + '</g></g>';
      // pillar node marker on outer ring
      var m = P(cx, cy, 272, (p.a0 + p.a1) / 2);
      o += '<g class="mnode mnode--' + p.k + '" data-i="' + i + '" data-pillar="' + p.k + '" transform="translate(' + f(m[0]) + ' ' + f(m[1]) + ')"><circle r="22" fill="' + pl.color + '"/>' + svgIcon(pl.icon, -11, -11, 22) + '</g>';
    });
    o += '<path id="' + id + 'loop" d="M300 86 A214 214 0 1 1 300 514 A214 214 0 1 1 300 86" fill="none"/>';
    [0, 3.3, 6.6].forEach(function (b) { o += '<circle r="6" class="mring__particle"><animateMotion dur="10s" begin="' + b + 's" repeatCount="indefinite"><mpath href="#' + id + 'loop"/></animateMotion></circle>'; });
    o += '<circle cx="300" cy="300" r="132" fill="#fff" class="mring__core"/><image href="assets/img/logo-mark.png" x="236" y="229" width="128" height="142" class="mring__logo"/>';
    o += '</svg>';
    return o;
  };

  /* ---------------- personal ring (portal) ---------------- */
  RING.ego = function (me, conns) {
    var cx = 300, cy = 300, S = window.Store;
    var peers = [], seen = {};
    conns.forEach(function (c) { var oid = S.other(c, me.id); if (!seen[oid] && c.status !== 'declined') { seen[oid] = 1; peers.push({ o: S.org(oid), c: c }); } });
    peers = peers.filter(function (p) { return p.o; }).slice(0, 14);
    var o = '<svg class="ego" viewBox="0 0 600 600" role="img" aria-label="' + C.tt('Your connections', 'ارتباطاتك') + '">';
    PIL.forEach(function (p) { o += '<path d="' + arc(cx, cy, 262, p.a0 + 2, p.a1 - 2) + '" stroke="' + C.pillar(p.k).color + '" stroke-width="7" fill="none" stroke-linecap="round" opacity=".35"/>'; });
    o += '<circle cx="300" cy="300" r="215" class="ego__orbit"/>';
    if (!peers.length) {
      o += '<text x="300" y="440" text-anchor="middle" class="ego__empty">' + C.tt('No connections yet', 'لا توجد ارتباطات بعد') + '</text>';
    }
    var n = peers.length;
    peers.forEach(function (p, i) {
      var a = -90 + i * (360 / Math.max(n, 1)), pt = P(cx, cy, 215, a), st = C.stake(p.o.cat), pc = C.pillar(p.c.stage).color;
      o += '<line x1="300" y1="300" x2="' + f(pt[0]) + '" y2="' + f(pt[1]) + '" stroke="' + pc + '" stroke-width="' + (p.c.status === 'accepted' ? 4 : 2.5) + '" ' + (p.c.status === 'pending' ? 'stroke-dasharray="7 7" class="ego__pending"' : '') + ' stroke-linecap="round"/>';
    });
    peers.forEach(function (p, i) {
      var a = -90 + i * (360 / Math.max(n, 1)), pt = P(cx, cy, 215, a), st = C.stake(p.o.cat), nm = C.L(p.o.name);
      if (nm.length > 20) nm = nm.slice(0, 19) + '…';
      o += '<g class="ego__node" data-act="org" data-id="' + p.o.id + '" transform="translate(' + f(pt[0]) + ' ' + f(pt[1]) + ')" tabindex="0" role="button">' +
        '<circle r="30" fill="' + st.color + '"/>' + (p.o.demo ? svgIcon(st.icon, -13, -13, 26) : '<text dy="6" text-anchor="middle" class="ego__ini">' + C.esc(C.initials(p.o)) + '</text>') +
        '<text y="50" text-anchor="middle" class="ego__lbl">' + C.esc(nm) + '</text></g>';
    });
    var ms = C.stake(me.cat);
    o += '<circle cx="300" cy="300" r="66" fill="' + ms.color + '" class="ego__me"/><circle cx="300" cy="300" r="78" fill="none" stroke="' + ms.color + '" stroke-opacity=".25" stroke-width="10"/>' +
      (me.demo ? svgIcon(ms.icon, 274, 274, 52) : '<text x="300" y="312" text-anchor="middle" class="ego__meini">' + C.esc(C.initials(me)) + '</text>');
    o += '</svg>';
    return o;
  };

  /* ---------------- hero orbit (HTML) ---------------- */
  RING.orbit = function () {
    var h = '<div class="orbit" aria-hidden="false">';
    h += '<div class="orbit__halo"></div><div class="orbit__ring orbit__ring--a"></div><div class="orbit__ring orbit__ring--b"></div><div class="orbit__ring orbit__ring--c"></div>';
    h += '<div class="orbit__tracks">' + D.tracks.map(function (t, i) { return '<i style="--a:' + (i * 45) + 'deg;--c:' + t.color + '"></i>'; }).join('') + '</div>';
    h += '<svg class="orbit__pillars" viewBox="0 0 400 400">' + PIL.map(function (p) { return '<path d="' + arc(200, 200, 150, p.a0 + 4, p.a1 - 4) + '" stroke="' + C.pillar(p.k).color + '" stroke-width="18" fill="none" stroke-linecap="round" pathLength="100"/>'; }).join('') + '</svg>';
    h += '<div class="orbit__core"><img src="assets/img/logo-mark.png" alt="' + C.E(D.summit.name) + '"></div>';
    h += '<div class="orbit__nodes">' + D.stakeholders.map(function (s, i) {
      return '<a class="onode" href="#/register/' + s.sector + '" style="--a:' + (i * 60 - 90) + 'deg;--c:' + s.color + ';--i:' + i + '"><span class="onode__in"><span class="onode__dot">' + C.ico(s.icon) + '</span><span class="onode__lbl">' + C.E(s.short) + '</span></span></a>';
    }).join('') + '</div>';
    h += '</div>';
    return h;
  };

  window.RING = RING;
})();
