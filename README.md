# סאנרייז ספא - אתר רשמי 🌅

אתר מקצועי לספא מסאז' בפתח תקווה, עם מערכת נגישות מתקדמת, צ'אטבוט חכם ו-SEO מותאם.

## 📋 מה חדש בגרסה זו?

### ✅ שיפורים שבוצעו:

#### 1. **ביצועים (Performance)**
- ✅ **Lazy Loading** לתמונות - טעינה מהירה יותר של העמוד
- ✅ **Preconnect** למשאבים חיצוניים (Google Fonts, CDN)
- ✅ Alt tags מפורטים לכל התמונות לשיפור SEO ונגישות
- ✅ אופטימיזציה של תמונות בסליידר

#### 2. **SEO ושיווק**
- ✅ **Open Graph tags** - שיתופים יפים בפייסבוק/WhatsApp
- ✅ **Twitter Cards** - שיתופים יפים בטוויטר
- ✅ **robots.txt** - ניהול סריקת מנועי חיפוש
- ✅ **sitemap.xml** - מיפוי האתר עבור Google
- ✅ **Google Analytics** - מעקב אחרי תנועה (יש להחליף ב-ID שלך)
- ✅ **Facebook Pixel** - מעקב אחרי המרות (יש להחליף ב-Pixel ID שלך)
- ✅ **Schema.org markup** מורחב

#### 3. **נגישות (Accessibility)**
- ✅ Alt tags מפורטים ומדויקים לכל התמונות
- ✅ תמיכה מלאה בתקן ישראלי 5568
- ✅ תפריט נגישות מקיף
- ✅ ARIA labels נכונים

#### 4. **אבטחה (Security)**
- ✅ **Content Security Policy (CSP)** ב-.htaccess
- ✅ **XSS Protection** מופעל
- ✅ **X-Frame-Options** - הגנה מפני clickjacking
- ✅ קובץ **.htaccess** מלא עם הגדרות אבטחה וביצועים
- ✅ Caching מותאם לביצועים טובים יותר

#### 5. **תוכן חדש**
- ✅ **עמוד מדיניות פרטיות** (privacy.html) - חובה חוקית!
- ✅ **עמוד תנאי שימוש** (terms.html)
- ✅ **עמוד שאלות נפוצות FAQ** (faq.html) - עם אקורדיון אינטראקטיבי

#### 6. **צ'אטבוט מתקדם**
- ✅ זיהוי חכם של מילות מפתח
- ✅ תיבת קלט חופשי למשתמשים
- ✅ 13 נושאי תשובה שונים (שעות, מחירים, חניה, הריון, וכו')
- ✅ תשובות אוטומטיות חכמות
- ✅ עיצוב משופר וחוויית משתמש טובה יותר

---

## 🔧 הגדרות שצריך לעשות

### 1. Google Analytics
קובץ: `index.html` (שורות 45-51)

החלף את `G-XXXXXXXXXX` ב-Tracking ID שלך:
```html
gtag('config', 'G-XXXXXXXXXX'); <!-- שנה כאן -->
```

### 2. Facebook Pixel
קובץ: `index.html` (שורות 53-68)

החלף את `YOUR_PIXEL_ID_HERE` ב-Pixel ID שלך:
```javascript
fbq('init', 'YOUR_PIXEL_ID_HERE'); <!-- שנה כאן -->
```

### 3. עדכון Sitemap
קובץ: `sitemap.xml`

עדכן את התאריכים ב-`<lastmod>` לפי הצורך.

### 4. אבטחה - HTTPS
קובץ: `.htaccess` (שורות 35-38)

כאשר יש לך תעודת SSL, הסר את ההערה מהשורות:
```apache
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 📁 מבנה הקבצים

```
SunriseSpa/
├── index.html              # עמוד הבית
├── gallery.html            # גלריה
├── blog.html              # בלוג
├── privacy.html           # מדיניות פרטיות ✨ חדש
├── terms.html             # תנאי שימוש ✨ חדש
├── faq.html               # שאלות נפוצות ✨ חדש
├── styles.css             # CSS ראשי
├── gallery.css            # CSS לגלריה
├── blog.css               # CSS לבלוג
├── script.js              # JavaScript ראשי
├── gallery.js             # JavaScript לגלריה
├── blog.js                # JavaScript לבלוג
├── robots.txt             # הגדרות מנועי חיפוש ✨ חדש
├── sitemap.xml            # מפת האתר ✨ חדש
├── .htaccess              # הגדרות אבטחה וביצועים ✨ חדש
├── SunriseLogo.png        # לוגו
├── Sunrise1-10.jpg        # תמונות
└── README.md              # קובץ זה
```

---

## 🚀 העלאה לשרת

### שלבים:
1. **העלה את כל הקבצים** לשרת דרך FTP/cPanel
2. **וודא שה-.htaccess עובד** (אם השרת הוא Apache)
3. **שלח את ה-sitemap ל-Google**:
   - היכנס ל-[Google Search Console](https://search.google.com/search-console)
   - הוסף את הקובץ: `https://www.sunrisespa.co.il/sitemap.xml`
4. **בדוק Open Graph tags** ב-[Facebook Debugger](https://developers.facebook.com/tools/debug/)

---

## 📊 בדיקות שכדאי לעשות

### ✅ SEO
- בדוק ב-[Google PageSpeed Insights](https://pagespeed.web.dev/)
- בדוק ב-[GTmetrix](https://gtmetrix.com/)

### ✅ נגישות
- בדוק ב-[WAVE](https://wave.webaim.org/)
- בדוק עם קורא מסך (NVDA/JAWS)

### ✅ מובייל
- בדוק באייפון ואנדרואיד
- בדוק ב-Chrome DevTools (F12 → Toggle Device Toolbar)

### ✅ דפדפנים
- Chrome ✓
- Firefox ✓
- Safari ✓
- Edge ✓

---

## 🎨 עיצוב והתאמה אישית

### שינוי צבעים
עדכן ב-`styles.css`:
```css
/* הצבע הראשי */
background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #ffdde1 100%);

/* צבע לינקים */
background: linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%);
```

### שינוי גופן
עדכן ב-`index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;700&display=swap" rel="stylesheet">
```

---

## 🐛 בעיות נפוצות

### הצ'אטבוט לא עובד
- בדוק שקובץ `script.js` נטען כראוי
- פתח Console (F12) ובדוק שגיאות

### התמונות לא נטענות
- ודא שהתמונות קיימות בתיקייה
- בדוק שהשמות של התמונות נכונים (case-sensitive בלינוקס)

### .htaccess לא עובד
- ודא שהשרת הוא Apache
- בדוק ש-`mod_rewrite` מופעל

---

## 📞 תמיכה

אם יש בעיות או שאלות:
- פנה למפתח המקורי
- בדוק את ה-Console בדפדפן לשגיאות
- השתמש ב-[Stack Overflow](https://stackoverflow.com/)

---

## 📝 רישיון

© 2025 סאנרייז ספא. כל הזכויות שמורות.

---

**בהצלחה! 🎉**
