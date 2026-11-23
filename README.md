# قمة العمل التنموي — الموقع

موقع ثنائي اللغة (عربي / English) لقمة العمل التنموي (Development Action Summit): الدخلة باللوجو، والسوايب بين الصفحات، والخرائط، ومحتوى من ملف القمة.

موقع ثابت (HTML + CSS + JavaScript وصور) من غير أي build ومن غير حاجة تتسطّب.

## الملفات

```
index.html            الصفحة الوحيدة؛ كل الصفحات بتتعرض جواها
vercel.json           إعدادات Vercel (اختياري)
.nojekyll             عشان GitHub Pages يعرض الملفات زي ما هي
assets/css/main.css   كل التنسيقات
assets/js/            الكود: data.js (المحتوى) · models.js (النماذج الناجحة وصورها) · views.js (الصفحات) · app.js (التنقل والحركة والفورم) · ring.js (الخرائط) · core.js · icons.js · store.js
assets/img/           اللوجو والصور (models: صور النماذج الناجحة · speech: صور كلمة الرئيس)
```

الحاجات اللي بتتحمّل من الإنترنت (مش محتاجة تسطيب): خط Cairo من Google Fonts، ومكتبة Lenis للسكرول الناعم، ومكتبة qrcode-generator لكود الـ QR.

## التشغيل على الجهاز

افتح `index.html` في المتصفح، أو شغّل `python -m http.server 5180` وافتح `http://localhost:5180` (لتخطي الافتتاحية: `?nointro`).

## الرفع على GitHub

1. على github.com اعمل New repository (مثلًا `nacdw-summit-2027`) واختار Public.
2. فك ضغط الـ ZIP، وادخل فولدر `nacdw-summit-2027`.
3. في صفحة الـ repo دوس **uploading an existing file**، واسحب كل اللي جوه الفولدر (مش الفولدر نفسه) بما فيهم `assets` و`index.html` و`vercel.json` و`.nojekyll` و`.gitignore`، ثم **Commit changes**.
   الملفات اللي اسمها بيبدأ بنقطة ممكن تكون مخفية؛ لو ما ظهرتش، الموقع هيشتغل من غيرها.

أو من الكمبيوتر:

```
git init
git add .
git commit -m "Development Action Summit website"
git branch -M main
git remote add origin https://github.com/<اسم-الحساب>/nacdw-summit-2027.git
git push -u origin main
```

## النشر على Vercel

1. ادخل vercel.com وسجّل بحساب GitHub.
2. **Add New → Project**، واختار الـ repo.
3. الإعدادات: Framework Preset = **Other**، وسيب Build Command وOutput Directory فاضيين (Root Directory = `./`).
4. **Deploy**. هتاخد لينك زي `https://nacdw-summit-2027.vercel.app`.

أي تعديل بتعمله على GitHub بعد كده بيتنشر على Vercel لوحده.

بديل من غير GitHub: من فولدر المشروع شغّل `npx vercel` واتبع الأسئلة.

## الصفحات

| الصفحة | الرابط |
|---|---|
| الرئيسية (القمة): كلمة الرئيس، مفهوم القمة، المكانة الاستراتيجية، أهداف القمة، نموذج العمل، المسارات، خريطة مختصرة، الجمهور المستهدف، النماذج الناجحة، الشركاء، لقاءات التعارف | `#home` و`#home--<القسم>` |
| خريطة القمة | `#ring` |
| تقديم مشروع (المسار يتحدد من الرابط) | `#projects` و`#projects--<المسار>` و`#projects--model` |
| شارك معنا (التسجيل + QR) | `#register` و`#register--partner` و`#register--match` و`#register--<المجال>` |

## تعديل النماذج الناجحة

افتح `assets/js/models.js`. كل نموذج بين `{ }`، وفي أول الملف شرح لكل خانة (الاسم، الجهة، رقم المسار، المكان، الأثر، صورة اختيارية في `assets/img/models`).
احفظ الملف، والنماذج تظهر لوحدها في جزء "النماذج الناجحة". لو الملف فاضي يظهر "قريبًا".
على GitHub: افتح الملف ودوس على القلم (Edit)، عدّل، ثم Commit.

صور معرض النماذج الناجحة في نفس الملف تحت `window.SUCCESS_GALLERY`: كل صورة في سطر (مسارها في `assets/img/models`)، والجملة اللي تحت الصور في `caption`.

## كلمة الرئيس

نصوص الكلمات في `assets/js/data.js` تحت `quotes` (من ملف NACDW .pdf). النص العربي ترجمة للنص الإنجليزي في الملف، ولو عندك الصيغة العربية الأصلية حطيها مكانه.

## قبل الإطلاق

نموذجا التسجيل وتقديم المشروعات يحفظان الطلبات في متصفح الزائر فقط (`das27.registrations` و`das27.projects`)، ولازم يتربطوا ببريد اللجنة المنظمة أو بقاعدة بيانات عشان الطلبات توصلكم.
عند تحديث الملفات غيّر رقم `?v=` في `index.html` عشان الزوار يشوفوا النسخة الجديدة.

---

## English quick start

Static site, no build step and no packages to install. Open `index.html`, or run `python -m http.server 5180`.
Deploy on Vercel: import the GitHub repo, Framework Preset **Other**, leave Build Command and Output Directory empty, Deploy.
The two forms only save to the visitor's browser (localStorage) until they are connected to an email service or a database.
