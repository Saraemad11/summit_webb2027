/* =====================================================================
   Development Action Summit — content (bilingual), from the summit file.
   Wording follows the brief: NACDW is the umbrella and the intermediary
   between projects and partners; no funding or "mobilization" wording.
   ===================================================================== */
(function () {
  var T = function (en, ar) { return { en: en, ar: ar }; };

  var summit = {
    name: T('Development Action Summit', 'قمة العمل التنموي'),
    theme: T("Shaping Egypt's Next Chapter of Development Work", 'صياغة الفصل القادم للعمل التنموي في مصر'),
    when: T('June 2027', 'يونيو 2027'),
    host: T('The National Alliance for Civil Development Work', 'التحالف الوطني للعمل الأهلي التنموي'),
    concept: T(
      "A high-level national and international platform that brings Government, Civil Society, Business, Investors, Development Partners, Academia and Innovators together around Egypt's development priorities.",
      'قمة وطنية ودولية رفيعة المستوى تجمع الحكومة والمجتمع المدني وقطاع الأعمال والمستثمرين وشركاء التنمية والأوساط الأكاديمية والمبتكرين حول أولويات التنمية في مصر.'
    )
  };

  /* ---------- Strategic Position: the four goals, each with one plain line ---------- */
  var positioning = [
    { icon: 'link', t: T('Connect projects with community impact to partners', 'ربط المشروعات ذات الأثر المجتمعي بالشركاء'),
      d: T('NACDW is the intermediary: it receives projects, connects them with the right partner and is a partner in them.', 'التحالف هو الجهة الوسيطة: يستقبل المشروعات، ويوصلها إلى الشريك المناسب، ويكون شريكًا فيها.'),
      href: '#/projects', go: T('Submit a project', 'قدّم مشروعًا') },
    { icon: 'award', t: T('Showcase Egyptian models and their community impact', 'إبراز النماذج المصرية وأثرها في المجتمع'),
      d: T('Present successful Egyptian models and the impact they made in their communities.', 'عرض النماذج المصرية الناجحة وما حققته من أثر في المجتمع.'),
      href: '#/home/models', go: T('See the success models', 'شاهد النماذج الناجحة') },
    { icon: 'repeat', t: T('Create commitments that continue after the Summit', 'إطلاق التزامات تستمر بعد انتهاء القمة'),
      d: T('Partnerships that start at the Summit are followed up by NACDW afterwards.', 'الشراكات التي تبدأ في القمة يتابعها التحالف بعد انتهائها.') }
  ];

  /* ---------- Summit Operating Model ---------- */
  var pillars = [
    { key: 'dialogue', label: 'DIALOGUE', name: T('Dialogue', 'الحوار'), icon: 'message', color: '#23968B',
      tag: T('Policy and strategic exchange', 'تبادل السياسات والرؤى الاستراتيجية'),
      formats: [T('Keynotes', 'الكلمات الرئيسية'), T('Ministerial dialogue', 'الحوار الوزاري'), T('Plenaries', 'الجلسات العامة'), T('Thematic panels', 'الجلسات النقاشية المتخصصة')] },
    { key: 'partnership', label: 'PARTNERSHIP', name: T('Partnership', 'الشراكة'), icon: 'handshake', color: '#0B4D44',
      tag: T('Structured relationship building', 'بناء علاقات منظَّمة'),
      formats: [T('Hosted roundtables', 'الموائد المستديرة'), T('Bilateral meetings', 'اللقاءات الثنائية'), T('Sector networking', 'التشبيك القطاعي')] },
    { key: 'action', label: 'ACTION', name: T('Action', 'التنفيذ'), icon: 'target', color: '#F08A24',
      tag: T('Projects development & sustainability', 'تطوير المشروعات واستدامتها'),
      formats: [T('Project showcases', 'عروض المشروعات'), T('MOUs', 'مذكرات التفاهم'), T('Follow-up', 'المتابعة')] }
  ];

  /* ---------- Proposed Pillars (8 Tracks) — colours from the deck ---------- */
  var tracks = [
    { id: 1, slug: 'inclusive-economy', color: '#196A24', icon: 'trending', name: T('Inclusive Economic Development', 'التنمية الاقتصادية الشاملة') },
    { id: 2, slug: 'food-water', color: '#197934', icon: 'droplet', name: T('Food and Water Security', 'الأمن الغذائي والمائي') },
    { id: 3, slug: 'education-human-capital', color: '#19874B', icon: 'grad', name: T('Education and Human Capital', 'التعليم ورأس المال البشري') },
    { id: 4, slug: 'digital-ai', color: '#189666', icon: 'cpu', name: T('Digital Transformation and AI', 'التحول الرقمي والذكاء الاصطناعي') },
    { id: 5, slug: 'entrepreneurship-innovation', color: '#16A486', icon: 'rocket', name: T('Entrepreneurship and Innovation', 'ريادة الأعمال والابتكار') },
    { id: 6, slug: 'health-wellbeing', color: '#14B4AC', icon: 'heart', name: T('Health and Wellbeing', 'الصحة والرفاه') },
    { id: 7, slug: 'climate-green', color: '#12B0C4', icon: 'leaf', name: T('Climate and Green Transition', 'المناخ والتحول الأخضر') },
    { id: 8, slug: 'social-protection', color: '#0F9ED5', icon: 'shield', name: T('Social Protection and Communities', 'الحماية الاجتماعية والمجتمعات') }
  ];

  /* ---------- Target audience (core audience in the file) ---------- */
  var stakeholders = [
    { slug: 'government', sector: 'gov', color: '#0B5048', icon: 'landmark',
      name: T('Government & Governorates', 'الحكومة والمحافظات'), short: T('Government', 'الحكومة'),
      line: T('Government and governorates representatives', 'ممثلو الحكومة والمحافظات'),
      includes: [T('Government representatives', 'ممثلو الحكومة'), T('Governorates representatives', 'ممثلو المحافظات')] },
    { slug: 'civil-society', sector: 'civil', color: '#23968B', icon: 'users',
      name: T('Civil Society & NACDW Members', 'المجتمع المدني وأعضاء التحالف'), short: T('Civil Society', 'المجتمع المدني'),
      line: T('NACDW members and civil society organizations', 'أعضاء التحالف الوطني ومنظمات المجتمع المدني'),
      includes: [T('NACDW members', 'أعضاء التحالف الوطني'), T('Civil society organizations', 'منظمات المجتمع المدني')] },
    { slug: 'private-sector', sector: 'private', color: '#E9821E', icon: 'briefcase',
      name: T('Private Sector, Banks & Investors', 'القطاع الخاص والبنوك والمستثمرون'), short: T('Private Sector', 'القطاع الخاص'),
      line: T('Private sector, banks, investors and foundations', 'القطاع الخاص والبنوك والمستثمرون والمؤسسات'),
      includes: [T('Private sector', 'القطاع الخاص'), T('Banks', 'البنوك'), T('Investors', 'المستثمرون'), T('Foundations', 'المؤسسات')] },
    { slug: 'development-partners', sector: 'intl', color: '#0F9ED5', icon: 'globe',
      name: T('Development Partners', 'شركاء التنمية'), short: T('Development Partners', 'شركاء التنمية'),
      line: T('UN agencies, donors and development finance institutions', 'وكالات الأمم المتحدة والجهات المانحة ومؤسسات تمويل التنمية'),
      includes: [T('UN agencies', 'وكالات الأمم المتحدة'), T('Donors', 'الجهات المانحة'), T('Development finance institutions', 'مؤسسات تمويل التنمية')] },
    { slug: 'academia-innovators', sector: 'academic', color: '#2E9B6A', icon: 'flask',
      name: T('Academia & Innovators', 'الأوساط الأكاديمية والمبتكرون'), short: T('Academia & Innovation', 'الأكاديمية والابتكار'),
      line: T('Universities, research centers, startups and social enterprises', 'الجامعات ومراكز البحث والشركات الناشئة والمؤسسات الاجتماعية'),
      includes: [T('Universities', 'الجامعات'), T('Research centers', 'مراكز البحث'), T('Startups', 'الشركات الناشئة'), T('Social enterprises', 'المؤسسات الاجتماعية')] },
    { slug: 'youth-communities', sector: 'youth', color: '#E0603F', icon: 'megaphone',
      name: T('Youth, Women, Communities & Media', 'الشباب والمرأة والمجتمعات والإعلام'), short: T('Youth & Communities', 'الشباب والمجتمعات'),
      line: T('Youth, women leaders, community representatives and media', 'الشباب والقيادات النسائية وممثلو المجتمعات المحلية والإعلام'),
      includes: [T('Youth', 'الشباب'), T('Women leaders', 'القيادات النسائية'), T('Community representatives', 'ممثلو المجتمعات المحلية'), T('Media', 'الإعلام')] }
  ];

  var vip = [
    T('Senior government representatives', 'كبار ممثلي الحكومة'),
    T('Ambassadors', 'السفراء'),
    T('Heads of international organizations', 'رؤساء المنظمات الدولية'),
    T('Corporate chairs and CEOs, development bank leaders', 'رؤساء مجالس إدارات الشركات والرؤساء التنفيذيون وقيادات بنوك التنمية'),
    T('Regional and global figures', 'شخصيات إقليمية ودولية')
  ];

  /* ---------- Potential Partners Suggested ---------- */
  var partners = [
    { key: 'national', name: T('National', 'وطني'), icon: 'landmark', items: [
      T('Relevant ministries and governorates', 'الوزارات والمحافظات المعنية'), T('Major Egyptian companies and banks', 'كبرى الشركات والبنوك المصرية'),
      T('Universities and research institutions', 'الجامعات والمؤسسات البحثية'), T('Business federations and chambers', 'اتحادات الأعمال والغرف التجارية'),
      T('Foundations, media and knowledge partners', 'المؤسسات والإعلام وشركاء المعرفة')] },
    { key: 'regional', name: T('Regional', 'إقليمي'), icon: 'map', items: [
      T('League of Arab States', 'جامعة الدول العربية'), T('Arab development institutions', 'مؤسسات التنمية العربية'),
      T('African Union and regional organizations', 'الاتحاد الأفريقي والمنظمات الإقليمية'), T('Gulf foundations and investment entities', 'المؤسسات والجهات الاستثمارية الخليجية'),
      T('Regional business and philanthropy networks', 'شبكات الأعمال والعمل الخيري الإقليمية')] },
    { key: 'international', name: T('International', 'دولي'), icon: 'globe', items: [
      T('UN agencies and EU institutions', 'وكالات الأمم المتحدة ومؤسسات الاتحاد الأوروبي'), T('World Bank Group and development banks', 'مجموعة البنك الدولي وبنوك التنمية'),
      T('Bilateral development agencies', 'وكالات التنمية الثنائية'), T('Global foundations and corporations', 'المؤسسات والشركات العالمية'),
      T('International development networks', 'شبكات التنمية الدولية')] }
  ];

  /* ---------- Matchmaking (arranged by NACDW; no direct contact between organizations) ---------- */
  var mechanisms = [
    { icon: 'store', pillar: 'partnership', name: T('Development Marketplace', 'سوق التنمية'),
      desc: T('Exhibition zones for NACDW entities, governorates, companies, donors, social enterprises and startups.', 'مناطق عرض لكيانات التحالف الوطني والمحافظات والشركات والجهات المانحة والمؤسسات الاجتماعية والشركات الناشئة.') },
    { icon: 'calendar', pillar: 'partnership', name: T('Structured networking meetings', 'لقاءات تعارف منظَّمة'),
      desc: T('Pre-scheduled meetings across business, government, donors, investors and civil society.', 'لقاءات مجدولة مسبقًا بين قطاع الأعمال والحكومة والجهات المانحة والمستثمرين والمجتمع المدني.') },
    { icon: 'clipboard', pillar: 'action', name: T('Partnerships on Platform', 'الشراكات في القمة'),
      desc: T('MOUs, project announcements and a visible register of partnerships for post-Summit follow-up.', 'مذكرات تفاهم وإعلانات مشروعات وسجل معلن للشراكات لمتابعتها بعد القمة.') }
  ];

  /* ---------- Forms ---------- */
  var sectors = [
    { key: 'gov', name: T('Government', 'حكومي') },
    { key: 'private', name: T('Private sector', 'قطاع خاص') },
    { key: 'civil', name: T('Civil society', 'مجتمع مدني') },
    { key: 'academic', name: T('Academic / research', 'أكاديمي / بحثي') }
  ];
  var ways = [
    { key: 'attend', icon: 'users', name: T('Attend', 'حضور'), d: T('Attend the Summit sessions and meetings.', 'حضور جلسات القمة ولقاءاتها.') },
    { key: 'speak', icon: 'mic', name: T('Speak', 'متحدث'), d: T('Give a talk or join a panel.', 'المشاركة بكلمة أو في جلسة نقاشية.') },
    { key: 'partner', icon: 'handshake', name: T('Partner', 'شريك'), d: T('Learn about partnership opportunities in the projects.', 'التعرف على فرص الشراكة في المشروعات.') }
  ];
  var statuses = [
    { key: 'prep', name: T('In preparation', 'قيد الإعداد') },
    { key: 'ready', name: T('Ready for implementation', 'جاهز للتنفيذ') },
    { key: 'ongoing', name: T('Under implementation', 'قيد التنفيذ') },
    { key: 'done', name: T('Implemented', 'تم التنفيذ') }
  ];

  // Words about the Alliance — from the file "NACDW .pdf". The Arabic is a translation of the file's English text.
  var quotes = [
    { key: 'sisi-2023', img: 'assets/img/speech/sisi.jpg', pos: '30% 30%', long: true, tag: T('Conference 2023', 'مؤتمر التحالف 2023'),
      who: T('President Abdel Fattah El-Sisi', 'الرئيس عبد الفتاح السيسي'), short: T('The President', 'الرئيس'),
      where: T('National Alliance for Civil Development Work Conference 2023', 'مؤتمر التحالف الوطني للعمل الأهلي التنموي 2023'),
      text: T('I extend my greetings and appreciation to all the entities within the Alliance, as well as to those engaged in charitable work—a role we truly need, as these organizations are performing their duties efficiently. I call upon more entities to join the Alliance, for this concerted and organized effort will, in turn, have an impact on the economic and health sectors. My sincere thanks go to all contributors—whether from within Egypt or abroad—and to all donors. We need to exert greater effort to address the economic crisis and its repercussions, and I invite everyone to contribute.',
        'أوجّه التحية والتقدير لكل الجهات الموجودة في التحالف، ولكل العاملين في العمل الخيري، وهو دور نحتاجه بالفعل، فهذه المؤسسات تؤدي دورها بكفاءة. وأدعو المزيد من الجهات إلى الانضمام إلى التحالف، فهذا الجهد المتضافر والمنظَّم سيكون له بدوره أثر على القطاعين الاقتصادي والصحي. وكل الشكر لكل المساهمين، من داخل مصر أو من خارجها، ولكل المتبرعين. نحتاج إلى بذل مزيد من الجهد لمواجهة الأزمة الاقتصادية وتداعياتها، وأدعو الجميع إلى المساهمة.') },
    { key: 'sisi-ktf', img: 'assets/img/speech/sisi.jpg', pos: '30% 30%', tag: T('“Shoulder to Shoulder”', 'مبادرة «كتف في كتف»'),
      who: T('President Abdel Fattah El-Sisi', 'الرئيس عبد الفتاح السيسي'), short: T('The President', 'الرئيس'),
      where: T('Launch ceremony of the "Shoulder to Shoulder" initiative', 'احتفالية إطلاق مبادرة «كتف في كتف»'),
      text: T("Many thanks to everyone who contributed to this success—volunteers, institutions, and stakeholders—under the umbrella of the 'National Alliance for Civil Development Work' and 'Al-Watan'.",
        'كل الشكر لكل من ساهم في هذا النجاح، من متطوعين ومؤسسات وجهات فاعلة، تحت مظلة «التحالف الوطني للعمل الأهلي التنموي» و«الوطن».') },
    { key: 'khaled', img: 'assets/img/speech/khaled.jpg', pos: '45% 30%', tag: T('Chairman of the Board', 'رئيس مجلس الأمناء'),
      who: T('Khaled Abdel Aziz', 'خالد عبد العزيز'), short: T('Khaled Abdel Aziz', 'خالد عبد العزيز'),
      where: T('Chairman of the Board of Trustees, National Alliance for Civil Development Work', 'رئيس مجلس أمناء التحالف الوطني للعمل الأهلي التنموي'),
      text: T('Donations from Egyptians are transformed into specific services provided to the Egyptian people. The Alliance’s role is to organize these efforts and coordinate among various entities and civil society organizations to ensure the proper geographic distribution of services across different villages; the Alliance is also building a database of all service beneficiaries.',
        'تبرعات المصريين تتحول إلى خدمات محددة تُقدَّم للشعب المصري. ودور التحالف هو تنظيم هذه الجهود والتنسيق بين الجهات ومنظمات المجتمع المدني المختلفة، لضمان التوزيع الجغرافي السليم للخدمات على القرى المختلفة، كما يبني التحالف قاعدة بيانات لكل المستفيدين من الخدمات.') },
    { key: 'nabila', img: 'assets/img/speech/nabila.jpg', pos: '35% 25%', tag: T('Executive Director', 'المدير التنفيذي'),
      who: T('H.E. Ambassador Nabila Makram', 'السفيرة نبيلة مكرم'), short: T('Amb. Nabila Makram', 'السفيرة نبيلة مكرم'),
      where: T('Head of the Technical Secretariat and Executive Director of the National Alliance for Civil Development Work', 'رئيس الأمانة الفنية والمدير التنفيذي للتحالف الوطني للعمل الأهلي التنموي'),
      text: T('Economic empowerment is one of the key priorities of the National Alliance for Civil Development Work. We do not merely seek to provide aid or support; we aim to make a lasting impact. We identify needs through volunteers within the villages, analyzing requirements to determine the specific economic empowerment projects needed by the local residents—particularly women.',
        'التمكين الاقتصادي من أهم أولويات التحالف الوطني للعمل الأهلي التنموي؛ فنحن لا نسعى إلى تقديم المساعدات أو الدعم فقط، بل نهدف إلى إحداث أثر مستدام. نحدد الاحتياجات من خلال المتطوعين داخل القرى، ونحلل المتطلبات لتحديد مشروعات التمكين الاقتصادي التي يحتاجها الأهالي، وخاصة المرأة.') }
  ];

  window.NDS_DATA = {
    T: T, summit: summit, positioning: positioning, pillars: pillars, tracks: tracks, stakeholders: stakeholders, vip: vip,
    partners: partners, mechanisms: mechanisms, sectors: sectors, ways: ways, statuses: statuses, quotes: quotes
  };
})();
