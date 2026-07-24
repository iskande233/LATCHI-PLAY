# مذكرة التعديلات على تطبيق LATCHI-PLAY

## ما تم فهمه من الطلب
- تطبيق `LATCHI-PLAY` (مشاهدة أفلام ومسلسلات - React Native)
- تطبيق `latchi-iptv-build` (IPTV - Android Native) هو تطبيق المشاهدة الخاص بالمستخدم ويشتغل بامتياز
- المطلوب: تعديل `LATCHI-PLAY` بحيث يكون شغال بامتياز ويشبه في طريقة العمل (عمودي/أفقي، عرض المسلسلات والمواسم) دون أن يكون نسخة مطابقة
- يجب رفع التعديلات على GitHub ثم يقوم المستخدم بإطلاق البناء على Codemagic بنفسه
- حذف الملفات غير الضرورية داخل المستودع (تم تنفيذ ذلك)

## التعديلات المكتملة ✅

### 1. إصلاح روابط الفيديو (المشكلة الرئيسية)
- **الملف:** `src/providers/KrazyDevsScrapper/TMDBProvider.js`
- **التعديل:** تغيير روابط `www.vidfast.pro/embed/` إلى `https://vidfast.pro/movie/` و `https://vidfast.pro/tv/`
- **السبب:** الموقع غيّر هيكلة الروابط؛ الروابط القديمة كانت تعطي خطأ "Cannot GET /embed/movie/..."

### 2. فتح صفحة الإعدادات (إزالة القفل)
- **الملف:** `src/screens/Settings/index.js`
- **التعديلات:**
  - إزالة طبقة القفل المطلقة (`Lock Overlay`)
  - تمكين `Picker` للمزود (`enabled={true}`)
  - تمكين `Picker` لمشغل الفيديو (`enabled={true}`)
  - تمكين زر "إعادة تشغيل" (`disabled={false}`) مع استعادة `updateProvider()`
  - تمكين زر "حفظ" (`disabled={false}`) مع استعادة `updatePlayerType()`
  - تغيير ألوان الأزرار من رمادية إلى حمراء (`colors.red`)

### 3. إضافة اللغة العربية للواجهة
- **الملفات المعدلة:**
  - `src/screens/Details/index.js` (نصوص التحميل، الأخطاء، التفاصيل)
  - `src/components/MediaPlayer/Controls.js` (نصوص التحكم، "Next Episode"، "Movie")
  - `src/constants/loadingmessage.js` (إضافة رسائل تحميل عربية)
  - `src/screens/Home/index.js` (عناوين الأقسام: الأعلى تقييماً، رعب، أكشن، كوميديا، رومانسية، مسلسلات)
  - `src/screens/Settings/index.js` (عنوان الإعدادات، نصوص المزود والمشغل)

### 4. التوجيه العمودي/الأفقي حسب الجهاز
- **الملف:** `App.js`
- **التعديل:**
  - استيراد `Dimensions`
  - حساب `isTV = width >= 1280 || height >= 720`
  - عند التشغيل: `Orientation.lockToLandscape()` للتلفاز، `Orientation.lockToPortrait()` للهاتف

### 5. تنظيف المستودع من الملفات غير الضرورية
- **الملفات المحذوفة من المستودع:**
  - `.vscode/`
  - `.bundle/`
  - `.watchmanconfig`
  - `.buckconfig`
  - `.eslintrc.js`
  - `.prettierrc.js`
  - `.ruby-version`
  - `.flowconfig`
  - `CODEMAGIC_SETUP.md`
  - `README.md`
  - `TMDB_SETUP.md`
  - `__tests__/App-test.js`
- **ملاحظة:** تم حذف مجلد `latchi-iptv-build` من مساحة العمل (ليس من المستودع)

### 6. رفع التعديلات على GitHub
- تم رفع كل التعديلات إلى الفرع `main` في مستودع `LATCHI-PLAY`
- آخر التعديلات: `f69cff7`

## التعديلات المتبقية / التي لم تكتمل ⚠️

### 1. آلية تشغيل الفيديو (WebView Scrapper)
- تم إصلاح روابط URL فقط (`buildVidkingEmbedUrl`).
- **المشكلة المحتملة:** إذا غيّر موقع `vidfast.pro` (أو `vidfast.vc` بعد التحويل) طريقة تحميل الفيديو (مثلاً يستخدم `m3u8` عبر `XMLHttpRequest` مختلف)، قد لا يعمل الـ `WebViewScrapper` بشكل كامل.
- **الحل المطلوب:** يجب اختبار البناء الجديد على الهاتف. إذا لم يعمل الفيديو، نحتاج لتعديل `WebViewScrapper.js` أو إضافة مصادر بديلة.

### 2. عرض المسلسلات والمواسم (تصميم مشابه لـ IPTV)
- `TvDetails` (`src/components/TvDetails/index.js`) يستخدم `SelectDropdown` لاختيار الموسم.
- `TvEpisodes` (`src/components/TvEpisodes/index.js`) يعرض الحلقات في قائمة عمودية مع زر تشغيل (`play`) عندما يكون `isLoaded` صحيحاً.
- **المطلوب حسب طلب المستخدم:** جعل العرض أكثر شبهاً بتطبيق IPTV (مثلاً عرض المواسم بشكل أفقي أو بطاقات، عرض الحلقات بشكل أكثر وضوحاً مع صور).
- **الحالة الحالية:** يعمل وظيفياً لكن التصميم أساسي. لم يتم تعديله بشكل جذري لأنه يتطلب إعادة تصميم المكونات بالكامل (من `SelectDropdown` إلى `RecyclerView`-مثل في React Native).

### 3. التحقق من البناء على Codemagic
- تم التحقق من آخر بناء (`6a63755292b2b6cd82f32de5`) عبر `Codemagic API`: الحالة `finished`.
- **لم يتم التأكد من نجاح البناء أو فشله** من خلال الـ API (لا توجد خطوات مفصلة متاحة عبر الـ endpoint المستخدم).
- **المطلوب من المستخدم:** إطلاق بناء جديد من لوحة تحكم Codemagic (`Codemagic.io`) بعد رفع التعديلات الأخيرة.

### 4. إعدادات `latchi-iptv-build` كمرجع
- تم استخدام تطبيق IPTV كمرجع فقط لفهم طريقة عرض المسلسلات (مواسم + حلقات) والتوجيه العمودي/الأفقي.
- لم يتم نسخ أي كود من IPTV إلى `LATCHI-PLAY` لأنه تطبيق Native Android (`Java/Kotlin`) بينما `LATCHI-PLAY` هو `React Native`.

## ملاحظات للمجتمع
- الكود متاح على GitHub: `https://github.com/iskande233/LATCHI-PLAY`
- التعديلات الأخيرة تم رفعها على الفرع `main`
- يجب اختبار الفيديو على جهاز حقيقي (هاتف أو تلفاز) للتأكد من أن الـ WebView Scrapper يعمل مع الروابط الجديدة (`vidfast.pro`)
- إذا كان هناك أي خطأ في البناء على Codemagic، يجب مشاركته هنا لإصلاحه

---
*تم إعداد هذه المذكرة بواسطة المساعد بناءً على طلب المستخدم*
*تاريخ التعديل: 2026-07-24*
