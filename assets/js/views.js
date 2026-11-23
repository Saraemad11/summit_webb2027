/* =====================================================================
   Pages: home · summit map · projects · take part. Each returns HTML.
   Summit text comes from the summit file; each part has one plain line
   that says what it is or what the button does.
   ===================================================================== */
(function () {
  var D = window.NDS_DATA;
  var tt = C.tt, E = C.E, L = C.L, esc = C.esc, ico = C.ico;
  var V = {};
  function plabel(p) { return C.isAr() ? L(p.name) : p.label; }

  /* ---------------- shared pieces ---------------- */
  function arcsDeco(cls) {
    return '<svg class="arcs-deco ' + (cls || '') + '" viewBox="0 0 600 600" aria-hidden="true">' +
      [260, 215, 170, 125].map(function (r, i) { return '<circle cx="300" cy="300" r="' + r + '" style="--i:' + i + '"/>'; }).join('') + '</svg>';
  }
  function crumbs(items) {
    return '<nav class="crumbs" aria-label="breadcrumb"><a href="#/">' + tt('Home', 'الرئيسية') + '</a>' +
      items.map(function (it) { return '<span>/</span>' + (it[1] ? '<a href="' + it[1] + '">' + it[0] + '</a>' : '<b>' + it[0] + '</b>'); }).join('') + '</nav>';
  }
  function pageHero(o) {
    return '<section class="phero ' + (o.cls || '') + '" style="--c:' + (o.color || '#0B4D44') + '">' +
      '<div class="phero__bg">' + arcsDeco() + '</div><div class="container phero__in">' + (o.crumbs ? crumbs(o.crumbs) : '') +
      (o.eyebrow ? '<div class="eyebrow eyebrow--light" data-reveal>' + o.eyebrow + '</div>' : '') +
      '<h1 class="h1" data-split>' + o.title + '</h1>' +
      (o.lede ? '<p class="phero__lede" data-reveal style="--d:.2s">' + o.lede + '</p>' : '') + (o.extra || '') + '</div></section>';
  }
  function legend() {
    return '<ul class="legend">' + D.pillars.map(function (p) { return '<li style="--c:' + p.color + '"><a href="#/home/model"><i></i><b>' + plabel(p) + '</b><span>' + E(p.tag) + '</span></a></li>'; }).join('') + '</ul>';
  }
  function own(m, k) { return C.isAr() ? (m[k] || '') : (m[k + '_en'] || m[k] || ''); }
  function modelCard(m, i) {
    var t = C.track(m.track) || { id: 0, color: '#0B4D44', icon: 'award', name: { en: '', ar: '' } };
    return '<article class="sm" style="--c:' + t.color + ';--d:' + (i * 0.06) + 's" data-reveal>' +
      '<div class="sm__vis">' + (m.image ? '<img src="' + esc(m.image) + '" alt="" loading="lazy">' : '<span class="sm__ic">' + ico(t.icon) + '</span>') +
      (t.id ? '<span class="sm__track">0' + t.id + ' | ' + E(t.name) + '</span>' : '') + '</div>' +
      '<div class="sm__body"><h3>' + esc(own(m, 'title')) + '</h3><p class="sm__org">' + ico('building') + esc(own(m, 'org')) + (own(m, 'place') ? tt(', ', '، ') + esc(own(m, 'place')) : '') + '</p>' +
      (own(m, 'impact') ? '<p>' + esc(own(m, 'impact')) + '</p>' : '') + '</div></article>';
  }
  function trackCard(t, i) {
    return '<a class="tcard" href="#/projects/' + t.slug + '" style="--c:' + t.color + ';--d:' + (i * 0.05) + 's" data-reveal data-tilt>' +
      '<div class="tcard__top"><span class="tcard__n">0' + t.id + '</span><span class="tcard__ic">' + ico(t.icon) + '</span></div>' +
      '<h3>' + E(t.name) + '</h3><span class="tcard__go">' + tt('Submit a project in this track', 'تقديم مشروع في هذا المسار') + C.arrow() + '</span></a>';
  }

  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function galleryPhotos() { var g = window.SUCCESS_GALLERY || {}; return (g.photos || []).filter(function (x) { return x && typeof x === 'string'; }); }
  /* success-model photos: a mosaic of three columns that drift at different speeds as you scroll; tap a photo to open it */
  function gallery() {
    var ph = galleryPhotos(), g = window.SUCCESS_GALLERY || {}; if (!ph.length) return '';
    var cols = [[], [], []];
    ph.forEach(function (src, i) { cols[i % 3].push(i); });
    var card = function (i, row, col) {
      return '<button type="button" class="smm__card ' + ((row + col) % 2 ? 'smm__card--tall' : 'smm__card--wide') + '" data-lb="' + i + '" style="--i:' + i + ';--k:' + col + '" aria-label="' + tt('Open photo ', 'افتح الصورة ') + (i + 1) + '">' +
        '<span class="smm__img"><img src="' + esc(ph[i]) + '" alt="" loading="lazy" decoding="async"></span><span class="smm__n">' + pad2(i + 1) + '</span><span class="smm__zoom">' + ico('expand') + '</span></button>';
    };
    return '<div class="smm" data-mosaic><div class="smm__grid">' + cols.map(function (c, k) {
      return '<div class="smm__col" data-speed="' + [-1, 1.3, -0.8][k] + '">' + c.map(function (i, row) { return card(i, row, k); }).join('') + '</div>';
    }).join('') + '</div>' +
      '<div class="smm__foot"><p class="smg__cap">' + ico('award') + '<span>' + esc(own(g, 'caption')) + '</span></p><span class="smm__hint">' + ico('expand') + tt('Tap a photo to enlarge it', 'اضغط على أي صورة لتكبيرها') + '</span></div></div>';
  }
  /* the President's word and the Alliance leaders (from the file "NACDW .pdf") */
  V.speech = function () {
    var Q = D.quotes || [];
    var h = '<section class="spv"><div class="spv__bg">' + arcsDeco('arcs-deco--spv') + '</div><div class="container">';
    h += '<div class="spk" id="speech" data-spk><div class="spk__media" data-reveal="clip">' +
      Q.map(function (q, i) { return '<figure class="spk__ph' + (i ? '' : ' on') + '" data-i="' + i + '"><img src="' + q.img + '" alt="' + E(q.who) + '" style="object-position:' + (q.pos || 'center') + '"' + (i ? ' loading="lazy"' : '') + '></figure>'; }).join('') +
      '<span class="spk__mark">' + ico('quote') + '</span></div>' +
      '<div class="spk__body"><div class="eyebrow eyebrow--light" data-reveal data-spk-label>' + tt('The President’s word', 'كلمة الرئيس') + '</div>' +
      '<div class="spk__quotes" aria-live="polite">' + Q.map(function (q, i) {
        return '<blockquote class="spk__q' + (i ? '' : ' on') + (q.long ? ' spk__q--long' : '') + '" data-i="' + i + '" data-label="' + (q.key.indexOf('sisi') === 0 ? tt('The President’s word', 'كلمة الرئيس') : tt('From the Alliance leaders', 'من كلمات قيادات التحالف')) + '"' + (i ? ' hidden' : '') + '><p data-spk-text>' + E(q.text) + '</p>' +
          '<footer><b>' + E(q.who) + '</b><span>' + E(q.where) + '</span></footer></blockquote>';
      }).join('') + '</div>' +
      '<div class="spk__tabs" role="tablist">' + Q.map(function (q, i) {
        return '<button type="button" class="spk__tab' + (i ? '' : ' on') + '" role="tab" aria-selected="' + (i ? 'false' : 'true') + '" data-spk-go="' + i + '"><img src="' + q.img + '" alt="" style="object-position:' + (q.pos || 'center') + '" loading="lazy"><span><b>' + E(q.short) + '</b><small>' + E(q.tag) + '</small></span><i class="spk__bar"><i></i></i></button>';
      }).join('') + '</div></div></div>';
    return h + '</div></section>';
  };

  /* =================================================================
     HOME — follows the summit file
     ================================================================= */
  V.home = function () {
    var title = C.isAr() ? ['قمة العمل', 'التنموي'] : ['Development', 'Action Summit'];
    var h = '';
    /* ---- HERO ---- */
    h += '<section class="hero" id="top"><div class="hero__bg"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><div class="hero__grid"></div></div>' +
      '<div class="container hero__in"><div class="hero__copy">' +
      '<div class="hero__badge h-anim"><span class="pulse"></span>' + E(D.summit.when) + ' | ' + E(D.summit.host) + '</div>' +
      '<h1 class="hero__title"><span class="ln"><span class="h-anim"><span class="tfit" data-fit>' + title[0] + '</span></span></span><span class="ln"><span class="h-anim"><span class="tfit" data-fit>' + title[1] + '</span></span></span><span class="ln ln--rule"><span class="h-anim hero__rule"></span></span><span class="ln"><span class="h-anim hero__year">2027</span></span></h1>' +
      '<p class="hero__theme h-anim">' + E(D.summit.theme) + '</p>' +
      '<div class="hero__triad h-anim">' + D.pillars.map(function (p) { return '<a href="#/home/model" class="' + p.key.charAt(0) + '">' + plabel(p) + '</a>'; }).join('<i></i>') + '</div>' +
      '<div class="hero__cta h-anim">' + C.btn(tt('Register for the Summit', 'سجّل للمشاركة في القمة'), '#/register', 'primary') + C.btn(tt('Summit map', 'خريطة القمة'), '#/ring', 'ghost', 'orbit') + '</div>' +
      '<button type="button" class="hero__search h-anim" data-act="search">' + ico('search') + '<span>' + tt('Search for a track, section or category…', 'ابحث عن مسار أو قسم أو فئة…') + '</span><kbd>Ctrl K</kbd></button>' +
      '</div><div class="hero__visual h-anim">' + RING.orbit() + '</div></div>' +
      '<div class="marquee"><div class="marquee__in">' + [0, 1].map(function (k) { return D.tracks.map(function (t) { return '<a href="#/projects/' + t.slug + '" style="--c:' + t.color + '"' + (k ? ' tabindex="-1" aria-hidden="true"' : '') + '><i></i>' + E(t.name) + '</a>'; }).join(''); }).join('') + '</div></div>' +
      '<button type="button" class="scroll-cue" data-act="scrollto" data-target="speech"><span></span>' + tt('Scroll', 'مرّر') + '</button></section>';

    /* ---- THE PRESIDENT'S WORD ---- */
    h += V.speech();

    /* ---- SUMMIT CONCEPT (text over the photo, on scroll) ---- */
    var groups = C.isAr()
      ? ['الحكومة', 'المجتمع المدني', 'قطاع الأعمال', 'المستثمرين', 'شركاء التنمية', 'الأوساط الأكاديمية', 'المبتكرين']
      : ['Government', 'Civil Society', 'Business', 'Investors', 'Development Partners', 'Academia', 'Innovators'];
    var gsec = ['gov', 'civil', 'private', 'private', 'intl', 'academic', 'academic'];
    var gcol = ['#23968B', '#4DB3A9', '#F08A24', '#F7B267', '#4FC3F7', '#7ED6A0', '#FFD08A'];
    var mk = function (i) { return '<a class="zlink" href="#/register/' + gsec[i] + '"><mark style="--c:' + gcol[i] + ';--i:' + i + '">' + groups[i] + '</mark></a>'; };
    var statement = C.isAr()
      ? 'قمة وطنية ودولية رفيعة المستوى تجمع ' + mk(0) + ' و' + mk(1) + ' و' + mk(2) + ' و' + mk(3) + ' و' + mk(4) + ' و' + mk(5) + ' و' + mk(6) + ' حول أولويات التنمية في مصر.'
      : 'A high-level national and international platform that brings ' + mk(0) + ', ' + mk(1) + ', ' + mk(2) + ', ' + mk(3) + ', ' + mk(4) + ', ' + mk(5) + ' and ' + mk(6) + " together around Egypt's development priorities.";
    h += '<section class="zoom" id="concept" data-fx="sticky"><div class="zoom__sticky">' +
      '<div class="zoom__pre container"><div class="eyebrow">' + tt('Summit Concept', 'مفهوم القمة') + '</div><h2 class="h2">' + tt('A high-level <em>national and international platform.</em>', 'قمة وطنية ودولية <em>رفيعة المستوى.</em>') + '</h2></div>' +
      '<div class="zoom__frame"><img src="assets/img/summit-hall.jpg" alt=""><div class="zoom__shade"></div></div>' +
      '<div class="zoom__copy container"><div class="eyebrow eyebrow--light">' + tt('Summit Concept', 'مفهوم القمة') + '</div><p class="zoom__statement">' + statement + '</p>' +
      '<div class="zoom__meta"><span>' + ico('calendar') + E(D.summit.when) + '</span></div></div>' +
      '</div></section>';

    /* ---- STRATEGIC POSITION: the working theme and NACDW's role ---- */
    h += '<section class="section spos" id="positioning"><div class="container"><div class="spos__card" data-reveal="scale">' + arcsDeco('arcs-deco--cta') +
      '<div class="eyebrow eyebrow--light">' + tt('Strategic Position', 'المكانة الاستراتيجية') + '</div>' +
      '<p class="spos__k">' + tt('Working theme', 'الموضوع الرئيسي') + '</p>' +
      '<h2 class="spos__theme">' + E(D.summit.theme) + '</h2>' +
      C.btn(tt('Summit goals', 'أهداف القمة'), '#/home/goals', 'light') + '</div></div></section>';

    /* ---- SUMMIT GOALS ---- */
    h += '<section class="section goals" id="goals"><div class="container">' +
      C.head({ center: true, eyebrow: tt('Summit Goals', 'أهداف القمة'), title: tt('What are the <em>Summit goals?</em>', 'ما هي <em>أهداف القمة؟</em>'), lede: tt('The main goals of the Summit.', 'أهداف القمة الرئيسية.') }) +
      '<div class="goals__grid">' + D.positioning.map(function (p, i) {
        return '<article class="goal" data-reveal style="--d:' + (i * 0.08) + 's"><div class="goal__top"><span class="goal__ic">' + ico(p.icon) + '</span><span class="goal__n">0' + (i + 1) + '</span></div>' +
          '<h3>' + E(p.t) + '</h3><p>' + E(p.d) + '</p>' + (p.href ? '<a class="link" href="' + p.href + '">' + E(p.go) + C.arrow() + '</a>' : '') + '</article>';
      }).join('') + '</div></div></section>';

    /* ---- OPERATING MODEL (the ring builds as you scroll) ---- */
    h += '<section class="section opm" id="model"><div class="container">' +
      C.head({ center: true, eyebrow: tt('Summit Operating Model', 'نموذج عمل القمة'), title: tt('Dialogue, Partnership, <em>Action</em>', 'الحوار، الشراكة، <em>التنفيذ</em>'), lede: tt('The Summit moves in three steps.', 'تسير القمة في ثلاث خطوات متتالية.') }) +
      '<div class="opm__grid"><div class="opm__visual"><div class="opm__sticky" data-opm>' + RING.model() +
      '<div class="opm__cap"><span data-opm-cap>' + tt('Scroll', 'مرّر للأسفل') + '</span></div></div></div><div class="opm__steps">' +
      D.pillars.map(function (p, i) {
        return '<article class="ostep" data-step="' + i + '" style="--c:' + p.color + '"><div class="ostep__k"><span>0' + (i + 1) + '</span>' + ico(p.icon) + '</div>' +
          '<div class="ostep__label">' + plabel(p) + '</div><h3>' + E(p.tag) + '</h3>' +
          '<ul class="ostep__formats">' + p.formats.map(function (f) { return '<li>' + E(f) + '</li>'; }).join('') + '</ul></article>';
      }).join('') + '</div></div></div></section>';

    /* ---- PROPOSED PILLARS (8 TRACKS) ---- */
    h += '<section class="section tracks" id="tracks"><div class="container">' +
      C.head({ eyebrow: tt('Proposed Pillars', 'المحاور المقترحة'), title: tt('8 <em>Tracks</em>', '8 <em>مسارات</em>'), lede: tt('The areas the Summit focuses on. Choose a track to submit a project in it.', 'المجالات التي تركز عليها القمة. اختر مسارًا لتقديم مشروع فيه.') }) +
      '<div class="tgrid">' + D.tracks.map(trackCard).join('') + '</div></div></section>';

    /* ---- SUMMIT MAP (teaser) ---- */
    h += '<section class="section ringsec" id="map"><div class="ringsec__bg"></div><div class="container ringsec__grid"><div class="ringsec__copy">' +
      C.head({ eyebrow: tt('Summit map', 'خريطة القمة'), title: tt('Categories, Tracks, <em>Operating model</em>', 'الفئات، المسارات، <em>نموذج العمل</em>'), lede: tt('All parts of the Summit in one map. Open the map and tap any part to see what it is.', 'كل أجزاء القمة في خريطة واحدة. افتح الخريطة واضغط على أي جزء لتعرف ما هو.') }) +
      legend() + '<div class="btns">' + C.btn(tt('Open the summit map', 'افتح خريطة القمة'), '#/ring', 'primary', 'orbit') + '</div>' +
      '</div><div class="ringsec__visual" data-ring="teaser">' + RING.big() + '<div class="ringtip" role="tooltip"></div></div></div></section>';

    /* ---- TARGET AUDIENCE ---- */
    h += '<section class="section aud" id="audience"><div class="container">' +
      C.head({ center: true, eyebrow: tt('Target Audience', 'الجمهور المستهدف'), title: tt('Who takes part <em>in the Summit</em>', 'مَن يشارك <em>في القمة</em>'), lede: tt('Choose your category to register.', 'اختر فئتك للتسجيل.') }) +
      '<div class="aud__grid"><div class="aud__core" data-reveal><h3>' + ico('users') + tt('Core audience', 'الجمهور الأساسي') + '</h3><ul>' +
      D.stakeholders.map(function (s) { return '<li><a href="#/register/' + s.sector + '" style="--c:' + s.color + '"><span class="aud__ic">' + ico(s.icon) + '</span><span>' + E(s.line) + '</span>' + C.arrow() + '</a></li>'; }).join('') +
      '</ul></div><div class="aud__vip" data-reveal style="--d:.1s">' + arcsDeco() + '<h3>' + ico('award') + tt('VIP participation', 'مشاركة كبار الشخصيات') + '</h3><ul>' +
      D.vip.map(function (v, i) { return '<li style="--i:' + i + '"><span>0' + (i + 1) + '</span>' + E(v) + '</li>'; }).join('') + '</ul></div></div></div></section>';

    /* ---- SUCCESS MODELS (written in assets/js/models.js) ---- */
    var models = (window.SUCCESS_MODELS || []).filter(function (m) { return m && m.title; });
    h += '<section class="section smodels" id="models"><div class="container">' +
      C.head({ center: true, eyebrow: tt('Success Models', 'النماذج الناجحة'), title: tt('Egyptian models <em>and their community impact</em>', 'نماذج مصرية <em>وأثرها في المجتمع</em>'), lede: tt('Successful models from the participating organizations, and the impact they made.', 'نماذج ناجحة من الجهات المشاركة، وما حققته من أثر.') }) +
      '</div>' + gallery() + '<div class="container">' +
      (models.length ? '<div class="smgrid">' + models.map(modelCard).join('') + '</div>' :
        (galleryPhotos().length ? '' : '<div class="smempty" data-reveal>' + ico('award') + '<h3>' + tt('Coming soon', 'قريبًا') + '</h3><p>' + tt('Successful Egyptian models and their community impact will be shown here.', 'ستُعرض هنا النماذج المصرية الناجحة وأثرها في المجتمع.') + '</p></div>')) +
      '<div class="btns btns--center">' + C.btn(tt('Submit a success model', 'قدّم نموذجًا ناجحًا'), '#/projects/model', 'primary', 'award') + '</div></div></section>';

    /* ---- POTENTIAL PARTNERS + partner call to action ---- */
    h += '<section class="section partners" id="partners"><div class="container">' +
      C.head({ center: true, eyebrow: tt('Potential Partners', 'الشركاء المحتملون'), title: tt('National, Regional, <em>International</em>', 'وطني، إقليمي، <em>دولي</em>'), lede: tt('Who the Summit seeks to partner with on projects with community impact.', 'الجهات التي تسعى القمة إلى الشراكة معها في المشروعات ذات الأثر المجتمعي.') }) +
      '<div class="ptiers">' + D.partners.map(function (p, i) {
        return '<div class="ptier ptier--' + p.key + '" data-reveal style="--d:' + (i * 0.1) + 's"><div class="ptier__h"><span class="ptier__ic">' + ico(p.icon) + '</span><h3>' + E(p.name) + '</h3><span class="ptier__ring"><i></i><i></i><i></i></span></div><ul>' +
          p.items.map(function (x) { return '<li>' + ico('check') + E(x) + '</li>'; }).join('') + '</ul></div>';
      }).join('') + '</div>' +
      '<div class="pband" data-reveal><div><h3>' + tt('Become a Summit partner', 'كن شريكًا في القمة') + '</h3><p>' + tt('The Summit is looking for partners for projects with community impact. NACDW is the intermediary between the project and the partner, and follows the partnership up after the Summit.', 'تبحث القمة عن شركاء للمشروعات ذات الأثر المجتمعي. التحالف الوطني هو الجهة الوسيطة بين المشروع والشريك، ويتابع الشراكة حتى بعد القمة.') + '</p></div>' +
      C.btn(tt('See partnership opportunities', 'اعرف فرص الشراكة'), '#/register/partner', 'accent') + '</div></div></section>';

    /* ---- MATCHMAKING ---- */
    h += '<section class="section match" id="matchmaking"><div class="container match__grid"><div class="match__media" data-reveal="clip"><img src="assets/img/networking.jpg" alt=""></div>' +
      '<div class="match__copy">' + C.head({ eyebrow: tt('Networking meetings', 'لقاءات التعارف'), title: tt('Meetings arranged <em>by NACDW</em>', 'لقاءات يرتبها <em>التحالف</em>'), lede: tt('During the Summit, NACDW arranges meetings between participants and partners. All communication goes through NACDW.', 'أثناء القمة، يرتب التحالف لقاءات بين الجهات المشاركة والشركاء، وكل التواصل يتم من خلاله.') }) +
      '<div class="mech">' + D.mechanisms.map(function (m, i) {
        return '<a class="mechi" href="#/register/match" data-reveal style="--d:' + (i * 0.08) + 's"><span class="mechi__ic">' + ico(m.icon) + '</span><div><h4>' + E(m.name) + '</h4><p>' + E(m.desc) + '</p></div></a>';
      }).join('') + '</div><div class="btns">' + C.btn(tt('Request a networking meeting', 'اطلب لقاء تعارف'), '#/register/match', 'primary', 'calendar') + '</div></div></div></section>';

    h += V.cta();
    return h;
  };

  V.cta = function () {
    return '<section class="cta"><div class="container"><div class="cta__in" data-reveal="scale">' + arcsDeco('arcs-deco--cta') +
      '<img class="cta__mark" src="assets/img/logo-mark.png" alt="">' +
      '<h2>' + tt('Take part in the Summit.', 'شارك في القمة.') + '</h2><p>' + tt('Register to attend, speak or partner — or submit a project with community impact.', 'سجّل للحضور أو التحدث أو الشراكة، أو قدّم مشروعًا ذا أثر مجتمعي.') + '</p>' +
      '<div class="btns">' + C.btn(tt('Register for the Summit', 'سجّل للمشاركة'), '#/register', 'accent') + C.btn(tt('Submit a project', 'تقديم مشروع'), '#/projects', 'light', 'target') + '</div></div></div></section>';
  };

  /* =================================================================
     SUMMIT MAP
     ================================================================= */
  V.ringPanelDefault = function () {
    return '<div class="rp rp--intro"><span class="rp__k">' + tt('How to use the map', 'كيف تستخدم الخريطة') + '</span><h3>' + tt('Tap any part of the map', 'اضغط على أي جزء في الخريطة') + '</h3>' +
      '<p>' + tt('The circles are the six categories, the outer ring is the eight tracks, and the coloured ring in the middle is the operating model.', 'الدوائر هي الفئات الست، والإطار الخارجي هو المسارات الثمانية، والحلقة الملوّنة في المنتصف هي نموذج عمل القمة.') + '</p>' +
      '<ol class="rp__steps">' + D.pillars.map(function (p) { return '<li style="--c:' + p.color + '">' + ico(p.icon) + '<div><b>' + plabel(p) + '</b><span>' + E(p.tag) + '</span></div></li>'; }).join('') + '</ol></div>';
  };
  V.ringPanelCat = function (slug) {
    var s = C.stake(slug);
    return '<div class="rp" style="--c:' + s.color + '"><div class="rp__top"><span class="rp__ic">' + ico(s.icon) + '</span><div><span class="rp__k">' + tt('Category', 'فئة') + '</span><h3>' + E(s.name) + '</h3></div></div>' +
      '<p>' + E(s.line) + '</p><div class="chips">' + s.includes.map(function (x) { return '<span class="fmt">' + E(x) + '</span>'; }).join('') + '</div>' +
      '<div class="btns">' + C.btn(tt('Register in this category', 'سجّل في هذه الفئة'), '#/register/' + s.sector, 'primary') + '</div></div>';
  };
  V.ringPanelTrack = function (id) {
    var t = C.track(id);
    return '<div class="rp" style="--c:' + t.color + '"><div class="rp__top"><span class="rp__ic">' + ico(t.icon) + '</span><div><span class="rp__k">' + tt('Track 0', 'المسار 0') + t.id + '</span><h3>' + E(t.name) + '</h3></div></div>' +
      '<p>' + tt('One of the eight proposed tracks of the Summit.', 'أحد المسارات الثمانية المقترحة للقمة.') + '</p>' +
      '<div class="btns">' + C.btn(tt('Submit a project in this track', 'تقديم مشروع في هذا المسار'), '#/projects/' + t.slug, 'primary', 'target') + '</div></div>';
  };
  V.ringPanelPillar = function (k) {
    var p = C.pillar(k);
    return '<div class="rp" style="--c:' + p.color + '"><div class="rp__top"><span class="rp__ic">' + ico(p.icon) + '</span><div><span class="rp__k">' + tt('Operating model', 'نموذج العمل') + '</span><h3>' + plabel(p) + '</h3></div></div>' +
      '<p>' + E(p.tag) + '</p><div class="chips">' + p.formats.map(function (f) { return '<span class="fmt">' + E(f) + '</span>'; }).join('') + '</div></div>';
  };
  V.ringPanelHub = function () {
    return '<div class="rp rp--hub"><div class="rp__top"><img src="assets/img/logo-mark.png" alt="" class="rp__logo"><div><span class="rp__k">' + E(D.summit.when) + '</span><h3>' + E(D.summit.name) + '</h3></div></div>' +
      '<p>' + E(D.summit.concept) + '</p><div class="btns">' + C.btn(tt('Summit concept', 'مفهوم القمة'), '#/home/concept', 'primary') + '</div></div>';
  };
  V.ring = function () {
    return pageHero({ cls: 'phero--dark phero--ring', eyebrow: tt('Summit map', 'خريطة القمة'), crumbs: [[tt('Summit map', 'خريطة القمة')]],
      title: tt('Categories, Tracks, <em>Operating model</em>', 'الفئات، المسارات، <em>نموذج العمل</em>'),
      lede: tt('All parts of the Summit in one map. Tap any part to see what it is.', 'كل أجزاء القمة في خريطة واحدة. اضغط على أي جزء لتعرف ما هو.') }) +
      '<section class="section ringx"><div class="container ringx__grid"><div class="ringx__visual" data-ring="full">' + RING.big() + '<div class="ringtip" role="tooltip"></div>' +
      '<div class="ringx__legend">' + legend() + '</div></div><aside class="ringx__panel" data-ring-panel data-lenis-prevent>' + V.ringPanelDefault() + '</aside></div></section>' + V.cta();
  };

  /* =================================================================
     SUBMIT A PROJECT
     ================================================================= */
  function opts(list, sel, placeholder) {
    return '<option value="">' + placeholder + '</option>' + list.map(function (x) { return '<option value="' + x.key + '"' + (x.key === sel ? ' selected' : '') + '>' + E(x.name) + '</option>'; }).join('');
  }
  V.projects = function (slug) {
    var t = slug ? C.trackBySlug(slug) : null, isModel = slug === 'model';
    var h = pageHero({ cls: 'phero--dark phero--sm', eyebrow: tt('Submit a project', 'تقديم مشروع'), crumbs: [[tt('Submit a project', 'تقديم مشروع')]],
      title: tt('Projects <em>with community impact</em>', 'المشروعات <em>ذات الأثر المجتمعي</em>'),
      lede: tt('Submit your organization’s project with community impact; the Summit’s organizing committee reviews it with your organization.', 'قدّم مشروع جهتك ذا الأثر المجتمعي، وتراجعه اللجنة المنظمة للقمة بالتنسيق مع جهتك.') });
    h += '<section class="section join"><div class="container join__grid"><div class="formbox">' +
      '<form class="wizard" data-form="project" novalidate>' +
      (t ? '<p class="picked" style="--c:' + t.color + '">' + ico(t.icon) + '<span>' + tt('Track: ', 'المسار: ') + '<b>' + E(t.name) + '</b></span></p>' : '') +
      (isModel ? '<p class="picked" style="--c:#F08A24">' + ico('award') + '<span>' + tt('A success model is a project that has been implemented and made an impact.', 'النموذج الناجح هو مشروع تم تنفيذه وحقق أثرًا في المجتمع.') + '</span></p>' : '') +
      '<div class="fgrid">' +
      '<label class="field field--full"><span>' + tt('Project name', 'اسم المشروع') + ' *</span><input name="project" required maxlength="120"></label>' +
      '<label class="field field--full"><span>' + tt('Organization name', 'اسم المؤسسة / الجهة') + ' *</span><input name="org" required maxlength="120" autocomplete="organization"></label>' +
      '<label class="field"><span>' + tt('Track', 'المسار') + ' *</span><select name="track" required>' + opts(D.tracks.map(function (x) { return { key: x.slug, name: x.name }; }), t ? t.slug : '', tt('Choose a track', 'اختر المسار')) + '</select></label>' +
      '<label class="field"><span>' + tt('Project status', 'حالة المشروع') + ' *</span><select name="status" required>' + opts(D.statuses, isModel ? 'done' : '', tt('Choose the status', 'اختر الحالة')) + '</select></label>' +
      '<label class="field"><span>' + tt('Mobile', 'رقم الموبايل') + ' *</span><input name="mobile" type="tel" required maxlength="30" autocomplete="tel"></label>' +
      '<label class="field"><span>' + tt('Email', 'البريد الإلكتروني') + ' *</span><input name="email" type="email" required maxlength="120" autocomplete="email"></label>' +
      '<label class="field field--full"><span>' + tt('About the project and its community impact (optional)', 'نبذة عن المشروع وأثره في المجتمع (اختياري)') + '</span><textarea name="about" rows="4" maxlength="800"></textarea></label></div>' +
      '<div class="terms"><h3>' + tt('Before you send', 'قبل الإرسال') + '</h3>' +
      '<p class="terms__one">' + tt('The Summit’s organizing committee reviews the projects submitted by organizations before they are published, in coordination with the organization implementing the project.', 'تراجع اللجنة المنظمة للقمة المشروعات المُرسلة من المؤسسات والمشروعات قبل نشرها، وبعد التنسيق مع المؤسسة / الجهة المنفذة للمشروع.') + '</p>' +
      '<label class="check"><input type="checkbox" name="agree" required><span>' + tt('I agree to the above', 'أوافق على ما سبق') + '</span></label></div>' +
      '<div class="wz__err" role="alert"></div>' +
      '<div class="wz__nav"><button type="submit" class="btn btn--accent"><span>' + tt('Submit the project', 'تقديم المشروع') + '</span>' + ico('send') + '</button></div>' +
      '<p class="note">' + ico('info') + tt('Prototype: submissions are saved on this device until the form is connected to the organizers’ email.', 'نسخة تجريبية: الطلبات تُحفظ على هذا الجهاز حتى يتم ربط النموذج ببريد اللجنة المنظمة.') + '</p></form>' +
      '<div class="donebox" data-done="project" hidden>' + ico('check') + '<h3>' + tt('Your project was submitted', 'تم تقديم المشروع') + '</h3><p>' + tt('The organizing committee will review it and contact you.', 'ستراجعه اللجنة المنظمة وتتواصل معك.') + '</p>' +
      '<button type="button" class="btn btn--ghost" data-act="again" data-form="project"><span>' + tt('Submit another project', 'تقديم مشروع آخر') + '</span></button></div></div>' +
      '<aside class="steps3" data-reveal><h3>' + tt('How it works', 'كيف يتم الأمر') + '</h3><ol>' +
      [[tt('Fill in the project details', 'املأ بيانات المشروع'), tt('Project, organization, track, status, mobile and email.', 'اسم المشروع والجهة والمسار والحالة والموبايل والإيميل.')],
       [tt('The committee reviews it', 'تراجعه اللجنة المنظمة'), tt('In coordination with your organization, before anything is published.', 'بالتنسيق مع جهتك، وقبل نشر أي شيء.')]].map(function (s, i) { return '<li><span>' + (i + 1) + '</span><div><b>' + s[0] + '</b><p>' + s[1] + '</p></div></li>'; }).join('') +
      '</ol></aside></div></section>';
    return h;
  };

  /* =================================================================
     TAKE PART (registration)
     ================================================================= */
  V.register = function (preset) {
    var sector = D.sectors.some(function (s) { return s.key === preset; }) ? preset : '';
    var type = preset === 'partner' ? 'partner' : 'attend';
    var h = pageHero({ cls: 'phero--dark phero--sm', eyebrow: tt('Take part', 'شارك معنا'), crumbs: [[tt('Take part', 'شارك معنا')]],
      title: tt('How to take part <em>in the Summit</em>', 'كيفية المشاركة <em>في القمة</em>'),
      lede: tt('Choose how you will take part and fill in the form; the Summit team will contact you.', 'اختر طريقة مشاركتك واملأ النموذج، وسيتواصل معك فريق القمة.') });
    h += '<section class="section"><div class="container"><div class="ways">' + D.ways.map(function (w, i) {
      return '<button type="button" class="way" data-act="way" data-way="' + w.key + '" data-reveal style="--d:' + (i * 0.08) + 's">' + ico(w.icon) + '<b>' + E(w.name) + '</b><span>' + E(w.d) + '</span></button>';
    }).join('') + '</div>' +
      '<div class="join__grid"><div class="formbox"><form class="wizard" data-form="register" novalidate>' +
      '<h3 class="form__h">' + tt('To learn about partnership opportunities or to register, please fill in this form', 'لمعرفة فرص الشراكة أو للتسجيل، يرجى ملء النموذج التالي') + '</h3>' +
      '<div class="field field--full"><span>' + tt('How you will take part', 'نوع المشاركة') + ' *</span><div class="seg seg--radio">' + D.ways.map(function (w) {
        return '<label><input type="radio" name="type" value="' + w.key + '"' + (w.key === type ? ' checked' : '') + '><span>' + E(w.name) + '</span></label>';
      }).join('') + '</div></div>' +
      '<div class="fgrid">' +
      '<label class="field field--full"><span>' + tt('Organization name', 'اسم المؤسسة / الجهة') + ' *</span><input name="org" required maxlength="120" autocomplete="organization"></label>' +
      '<label class="field field--full"><span>' + tt('Sector', 'المجال') + ' *</span><select name="sector" required>' + opts(D.sectors, sector, tt('Choose the sector', 'اختر المجال')) + '</select></label>' +
      '<label class="field"><span>' + tt('Contact person', 'اسم المسؤول') + ' *</span><input name="person" required maxlength="80" autocomplete="name"></label>' +
      '<label class="field"><span>' + tt('Email', 'البريد الإلكتروني') + ' *</span><input name="email" type="email" required maxlength="120" autocomplete="email"></label>' +
      '<label class="field"><span>' + tt('Mobile phone', 'رقم الموبايل') + ' *</span><input name="mobile" type="tel" required maxlength="30" autocomplete="tel"></label>' +
      '<label class="field"><span>' + tt('Telephone', 'التليفون الأرضي') + '</span><input name="phone" type="tel" maxlength="30"></label>' +
      '<label class="field field--full"><span>' + tt('Country', 'الدولة') + ' *</span><input name="country" required maxlength="60" autocomplete="country-name"></label>' +
      '<div class="field field--full" id="match-pick"><span>' + tt('Networking meetings (optional): NACDW arranges meetings for you at the Summit with', 'لقاءات التعارف (اختياري): يرتب لك التحالف أثناء القمة لقاءات مع') + '</span><div class="pick">' +
      D.stakeholders.map(function (s) { return '<label class="pick__i" style="--c:' + s.color + '"><input type="checkbox" name="meet" value="' + s.sector + '"><span>' + ico(s.icon) + E(s.short) + '</span></label>'; }).join('') + '</div></div></div>' +
      '<div class="wz__err" role="alert"></div>' +
      '<div class="wz__nav"><button type="submit" class="btn btn--accent"><span>' + tt('Send registration', 'إرسال التسجيل') + '</span>' + ico('send') + '</button></div>' +
      '<p class="note">' + ico('info') + tt('Prototype: submissions are saved on this device until the form is connected to the organizers’ email.', 'نسخة تجريبية: الطلبات تُحفظ على هذا الجهاز حتى يتم ربط النموذج ببريد اللجنة المنظمة.') + '</p></form>' +
      '<div class="donebox" data-done="register" hidden>' + ico('check') + '<h3>' + tt('Your registration was received', 'تم استلام تسجيلك') + '</h3><p>' + tt('The Summit team will contact you with the details.', 'سيتواصل معك فريق القمة بالتفاصيل.') + '</p>' +
      '<button type="button" class="btn btn--ghost" data-act="again" data-form="register"><span>' + tt('Register another organization', 'تسجيل جهة أخرى') + '</span></button></div></div>' +
      '<aside class="qrbox" data-reveal><div class="qrbox__code" id="qr"></div><h3>' + tt('Scan to register', 'امسح الكود للتسجيل') + '</h3><p>' + tt('This code opens the registration page on a phone.', 'يفتح هذا الكود صفحة التسجيل على الموبايل.') + '</p></aside></div></div></section>';
    return h;
  };

  V.notFound = function () {
    return '<section class="nf"><div class="container"><img src="assets/img/logo-mark.png" alt=""><h1>404</h1><p>' + tt('Page not found.', 'الصفحة غير موجودة.') + '</p>' + C.btn(tt('Back home', 'العودة للرئيسية'), '#/', 'primary', 'home') + '</div></section>';
  };

  window.VIEWS = V;
})();
