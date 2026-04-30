// אפקט Fade-in
const faders = document.querySelectorAll(".fade-in");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);
faders.forEach((f) => observer.observe(f));

// Lazy Loading לתמונות
const lazyImages = document.querySelectorAll("img[data-src]");
const imageObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
        img.classList.remove("lazy-img");
        imageObserver.unobserve(img);
      }
    });
  },
  {
    rootMargin: "50px", // טען את התמונות 50px לפני שהן נראות
  },
);

lazyImages.forEach((img) => imageObserver.observe(img));

// סליידר
const track = document.getElementById("sliderTrack");
const indicatorsContainer = document.getElementById("indicators");

// בדיקה אם האלמנטים קיימים (הסליידר לא קיים בכל הדפים)
if (track && indicatorsContainer) {
  let currentSlide = 0;
  const totalSlides = track.children.length;
  let autoSlideInterval;
  let touchStartX = 0;
  let touchEndX = 0;

  function createIndicators() {
    for (let i = 0; i < totalSlides; i++) {
      const indicator = document.createElement("div");
      indicator.className = "indicator";
      if (i === 0) indicator.classList.add("active");
      indicator.onclick = () => goToSlide(i);
      indicatorsContainer.appendChild(indicator);
    }
  }

  function updateSlider() {
    const sliderWidth = document.querySelector(".side-slider").offsetWidth;

    // Set each image to exactly match the slider width
    const images = track.querySelectorAll('img');
    images.forEach(img => {
      img.style.width = sliderWidth + 'px';
      img.style.minWidth = sliderWidth + 'px';
    });

    const offset = currentSlide * -sliderWidth;
    track.style.transform = `translateX(${offset}px)`;

    const indicators = document.querySelectorAll(".indicator");
    indicators.forEach((ind, i) => {
      ind.classList.toggle("active", i === currentSlide);
    });
  }

  function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    resetAutoSlide();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
    resetAutoSlide();
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateSlider();
    resetAutoSlide();
  }

  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextSlide, 4000);
  }

  createIndicators();
  updateSlider(); // Initialize slider width on page load
  autoSlideInterval = setInterval(nextSlide, 4000);

  const slider = document.querySelector(".side-slider");

  // הפיכת הסליידר לנגיש במקלדת
  slider.setAttribute('tabindex', '0');
  slider.setAttribute('role', 'region');
  slider.setAttribute('aria-label', 'גלריית תמונות - השתמש בחצים לניווט');
  slider.setAttribute('aria-roledescription', 'סליידר תמונות');

  // יצירת אזור הכרזות לקורא מסך
  const sliderAnnouncer = document.createElement('div');
  sliderAnnouncer.id = 'sliderAnnouncer';
  sliderAnnouncer.className = 'sr-only';
  sliderAnnouncer.setAttribute('role', 'status');
  sliderAnnouncer.setAttribute('aria-live', 'polite');
  sliderAnnouncer.setAttribute('aria-atomic', 'true');
  slider.appendChild(sliderAnnouncer);

  // פונקציה להכרזה על שינוי שקופית
  function announceSlide() {
    const announcer = document.getElementById('sliderAnnouncer');
    if (announcer) {
      const currentImage = track.children[currentSlide];
      const altText = currentImage ? currentImage.alt : '';
      announcer.textContent = `תמונה ${currentSlide + 1} מתוך ${totalSlides}${altText ? ': ' + altText : ''}`;
    }
  }

  // ניווט במקלדת עבור הסליידר
  slider.addEventListener('keydown', (e) => {
    // בדיקת כיוון RTL
    const isRTL = document.documentElement.dir === 'rtl' ||
                  document.documentElement.lang === 'he' ||
                  getComputedStyle(document.body).direction === 'rtl';

    switch(e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        // ב-RTL: חץ שמאלה = הבא, ב-LTR: חץ שמאלה = קודם
        if (isRTL) {
          nextSlide();
        } else {
          prevSlide();
        }
        announceSlide();
        break;
      case 'ArrowRight':
        e.preventDefault();
        // ב-RTL: חץ ימינה = קודם, ב-LTR: חץ ימינה = הבא
        if (isRTL) {
          prevSlide();
        } else {
          nextSlide();
        }
        announceSlide();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        announceSlide();
        break;
      case 'End':
        e.preventDefault();
        goToSlide(totalSlides - 1);
        announceSlide();
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        // עצירה/התחלה של הניגון האוטומטי
        if (autoSlideInterval) {
          clearInterval(autoSlideInterval);
          autoSlideInterval = null;
          if (document.getElementById('sliderAnnouncer')) {
            document.getElementById('sliderAnnouncer').textContent = 'ניגון אוטומטי הופסק';
          }
        } else {
          autoSlideInterval = setInterval(nextSlide, 4000);
          if (document.getElementById('sliderAnnouncer')) {
            document.getElementById('sliderAnnouncer').textContent = 'ניגון אוטומטי הופעל';
          }
        }
        break;
    }
  });

  slider.addEventListener("mouseenter", () => clearInterval(autoSlideInterval));
  slider.addEventListener("mouseleave", () => {
    autoSlideInterval = setInterval(nextSlide, 4000);
  });

  // עצירת הסליידר כאשר יש פוקוס עליו
  slider.addEventListener('focus', () => {
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
    announceSlide();
  });

  slider.addEventListener('blur', () => {
    if (!autoSlideInterval) {
      autoSlideInterval = setInterval(nextSlide, 4000);
    }
  });

  // תמיכה ב-Touch
  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    clearInterval(autoSlideInterval);
  });

  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    autoSlideInterval = setInterval(nextSlide, 4000);
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  window.addEventListener("resize", updateSlider);
} // סיום if של הסליידר

// סטטוס פתוח/סגור
function updateStatus() {
  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const timeInMinutes = hours * 60 + minutes;

  const statusDiv = document.getElementById("statusIndicator");

  // בדיקה אם האלמנט קיים (הוא קיים רק בדף הבית)
  if (!statusDiv) {
    return; // אם האלמנט לא קיים, צא מהפונקציה
  }

  let isOpen = false;

  if (day === 6) {
    isOpen = false;
  } else if (day >= 0 && day <= 4) {
    const openTime = 10 * 60;
    const closeTime = 20 * 60;
    isOpen = timeInMinutes >= openTime && timeInMinutes < closeTime;
  } else if (day === 5) {
    const openTime = 9 * 60;
    const closeTime = 15 * 60;
    isOpen = timeInMinutes >= openTime && timeInMinutes < closeTime;
  }

  if (isOpen) {
    statusDiv.innerHTML =
      '<span class="status-badge status-open">🟢 פתוח עכשיו</span>';
  } else {
    statusDiv.innerHTML =
      '<span class="status-badge status-closed">🔴 סגור כעת</span>';
  }
}

updateStatus();
setInterval(updateStatus, 60000);

// כפתור חזרה למעלה
const backToTopBtn = document.getElementById("backToTop");

// בדיקה אם הכפתור קיים לפני הוספת event listeners
if (backToTopBtn) {
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ========================
// מערכת נגישות - תקן ישראלי 5568
// ========================
const AccessibilityManager = {
  panel: document.getElementById("accessibilityPanel"),
  trigger:
    document.getElementById("accessibilityTrigger") ||
    document.getElementById("accessibilityBtn"),
  closeBtn:
    document.getElementById("closePanel") ||
    document.getElementById("accessibilityClose"),
  resetBtn:
    document.getElementById("resetAccessibility") ||
    document.getElementById("resetAccessibilityBtn"),
  actions: document.querySelectorAll(".accessibility-action"),
  textSize: 100,
  lineHeight: 1.5,
  letterSpacing: 0,
  cursorSize: 1,
  screenReaderActive: false,
  screenReaderSpeed: 1,
  readingGuideActive: false,

  init() {
    this.loadSettings();
    this.bindEvents();
    this.initKeyboardNav();
    this.initScreenReader();
    this.initReadingGuide();
    this.initAccessibilityButtons();
  },

  bindEvents() {
    // פתיחה/סגירה
    if (this.trigger) {
      this.trigger.addEventListener("click", () => this.togglePanel());
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.closePanel());
    }

    // סגירה ב-ESC ואיפוס ב-Alt+R
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.panel &&
        this.panel.classList.contains("active")
      ) {
        this.closePanel();
      }
      // Alt+R לאיפוס כל הגדרות הנגישות
      if (e.altKey && (e.key === "r" || e.key === "R" || e.key === "ר")) {
        e.preventDefault();
        this.resetAll();
      }
    });

    // כפתורי פעולה
    if (this.actions) {
      this.actions.forEach((btn) => {
        btn.addEventListener("click", () => this.handleAction(btn));
      });
    }

    // איפוס
    if (this.resetBtn) {
      this.resetBtn.addEventListener("click", () => this.resetAll());
    }

    // סגירה בלחיצה מחוץ לפאנל
    document.addEventListener("click", (e) => {
      if (
        this.panel &&
        this.panel.classList.contains("active") &&
        !this.panel.contains(e.target) &&
        this.trigger &&
        !this.trigger.contains(e.target)
      ) {
        this.closePanel();
      }
    });
  },

  togglePanel() {
    if (!this.panel) return;
    const isOpen = this.panel.classList.toggle("active");
    if (this.trigger) {
      this.trigger.setAttribute("aria-expanded", isOpen);
    }
    this.announce(isOpen ? "תפריט נגישות נפתח" : "תפריט נגישות נסגר");

    if (isOpen) {
      this.actions[0]?.focus();
    }
  },

  closePanel() {
    if (!this.panel) return;
    this.panel.classList.remove("active");
    if (this.trigger) {
      this.trigger.setAttribute("aria-expanded", "false");
      this.trigger.focus();
    }
  },

  // ===== קורא מסך (Screen Reader) =====
  initScreenReader() {
    if ("speechSynthesis" in window) {
      this.synth = window.speechSynthesis;
      this.setupHebrewVoice();
    }
  },

  setupHebrewVoice() {
    // המתן לטעינת הקולות
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      // חיפוש קול עברי
      this.hebrewVoice = voices.find(
        (voice) =>
          voice.lang.includes("he") ||
          voice.lang.includes("iw") ||
          voice.name.includes("Hebrew"),
      );
      // אם אין קול עברי, השתמש בקול ברירת מחדל
      if (!this.hebrewVoice && voices.length > 0) {
        this.hebrewVoice = voices[0];
      }
    };

    if (this.synth.getVoices().length > 0) {
      loadVoices();
    } else {
      this.synth.addEventListener("voiceschanged", loadVoices);
    }
  },

  toggleScreenReader(btn) {
    this.screenReaderActive = !this.screenReaderActive;
    btn.setAttribute("aria-pressed", this.screenReaderActive);

    if (this.screenReaderActive) {
      this.announce("קורא מסך הופעל. לחץ על אלמנטים לשמיעה, או השתמש ב-Tab לניווט. קורא המסך יקריא אוטומטית כל אלמנט שתגיע אליו.");
      this.enableScreenReaderListeners();
      document.body.classList.add("screen-reader-active");

      // קרא את כותרת הדף בתחילה
      setTimeout(() => {
        const pageTitle = document.querySelector('h1')?.innerText || document.title;
        this.speak(`עמוד: ${pageTitle}`);
      }, 1500);
    } else {
      this.announce("קורא מסך בוטל");
      this.disableScreenReaderListeners();
      document.body.classList.remove("screen-reader-active");
      this.stopSpeaking();
    }
  },

  // קריאת כל תוכן הדף
  readEntirePage() {
    if (!this.synth) return;

    const contentElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, .price-item, .content-box, a, button');
    const textsToRead = [];

    contentElements.forEach(el => {
      // דלג על אלמנטים מוסתרים
      if (el.offsetParent === null) return;
      if (el.closest('.accessibility-panel') && !document.querySelector('.accessibility-panel.active')) return;
      if (el.closest('.chatbot-container') && !document.querySelector('.chatbot-container.active')) return;

      let text = '';
      const tagName = el.tagName;

      if (tagName.match(/^H[1-6]$/)) {
        text = `כותרת: ${el.innerText.trim()}`;
      } else if (tagName === 'P') {
        text = el.innerText.trim();
      } else if (tagName === 'LI') {
        text = `פריט: ${el.innerText.trim()}`;
      } else if (el.classList.contains('price-item')) {
        const time = el.querySelector('.price-time')?.innerText || '';
        const amount = el.querySelector('.price-amount')?.innerText || '';
        text = `מחיר: ${time} - ${amount}`;
      } else if (el.classList.contains('content-box')) {
        const heading = el.querySelector('h2, h3')?.innerText || '';
        const content = el.querySelector('p')?.innerText || '';
        text = `${heading}. ${content}`;
      }

      if (text && text.trim()) {
        textsToRead.push(text.trim());
      }
    });

    // קרא את כל הטקסטים ברצף
    const fullText = textsToRead.join('. ');
    this.speak(fullText);
  },

  enableScreenReaderListeners() {
    // פונקציה לקבלת תיאור מלא של אלמנט
    const getElementDescription = (target) => {
      let textToRead = "";
      const tagName = target.tagName;
      const ariaLabel = target.getAttribute('aria-label');
      const title = target.getAttribute('title');

      // אם יש aria-label, השתמש בו קודם
      if (ariaLabel) {
        textToRead = ariaLabel;
      }
      // קישורים
      else if (tagName === "A") {
        const href = target.getAttribute('href');
        const text = target.innerText.trim() || title || 'ללא טקסט';
        if (href && href.startsWith('tel:')) {
          textToRead = `קישור טלפון: ${text}`;
        } else if (href && href.startsWith('mailto:')) {
          textToRead = `קישור אימייל: ${text}`;
        } else if (href && href.includes('whatsapp')) {
          textToRead = `קישור וואטסאפ: ${text}`;
        } else if (target.target === '_blank') {
          textToRead = `קישור חיצוני: ${text} - נפתח בחלון חדש`;
        } else {
          textToRead = `קישור: ${text}`;
        }
      }
      // כפתורים
      else if (tagName === "BUTTON") {
        const text = target.innerText.trim() || title || ariaLabel || 'ללא תיאור';
        const pressed = target.getAttribute('aria-pressed');
        if (pressed !== null) {
          textToRead = `כפתור מתג: ${text} - ${pressed === 'true' ? 'מופעל' : 'כבוי'}`;
        } else {
          textToRead = `כפתור: ${text}`;
        }
      }
      // כותרות
      else if (tagName.match(/^H[1-6]$/)) {
        const level = tagName.charAt(1);
        textToRead = `כותרת רמה ${level}: ${target.innerText.trim()}`;
      }
      // תמונות
      else if (tagName === "IMG") {
        textToRead = `תמונה: ${target.alt || 'ללא תיאור'}`;
      }
      // סרטונים
      else if (tagName === "VIDEO") {
        textToRead = "סרטון וידאו";
      }
      // שדות קלט
      else if (tagName === "INPUT") {
        const type = target.type;
        const label = target.labels?.[0]?.innerText || target.placeholder || ariaLabel || '';
        const value = target.value || '';
        if (type === 'checkbox') {
          textToRead = `תיבת סימון: ${label} - ${target.checked ? 'מסומן' : 'לא מסומן'}`;
        } else if (type === 'radio') {
          textToRead = `כפתור בחירה: ${label} - ${target.checked ? 'נבחר' : 'לא נבחר'}`;
        } else {
          textToRead = `שדה קלט ${label}: ${value || 'ריק'}`;
        }
      }
      // אזור טקסט
      else if (tagName === "TEXTAREA") {
        const label = target.labels?.[0]?.innerText || target.placeholder || '';
        textToRead = `אזור טקסט ${label}: ${target.value || 'ריק'}`;
      }
      // רשימת בחירה
      else if (tagName === "SELECT") {
        const label = target.labels?.[0]?.innerText || '';
        const selected = target.options[target.selectedIndex]?.text || '';
        textToRead = `רשימת בחירה ${label}: ${selected}`;
      }
      // פריטים ברשימה
      else if (tagName === "LI") {
        textToRead = `פריט: ${target.innerText.trim()}`;
      }
      // תאי טבלה
      else if (tagName === "TD" || tagName === "TH") {
        textToRead = tagName === "TH" ? `כותרת טבלה: ${target.innerText.trim()}` : target.innerText.trim();
      }
      // כרטיסי מחיר
      else if (target.classList.contains('price-item')) {
        const time = target.querySelector('.price-time')?.innerText || '';
        const amount = target.querySelector('.price-amount')?.innerText || '';
        textToRead = `מחיר: ${time} - ${amount}`;
      }
      // תיבות תוכן
      else if (target.classList.contains('content-box')) {
        const heading = target.querySelector('h2, h3')?.innerText || '';
        textToRead = `תיבת תוכן: ${heading}`;
      }
      // פריטי גלריה
      else if (target.classList.contains('gallery-item')) {
        const img = target.querySelector('img');
        const video = target.querySelector('video');
        if (video) {
          textToRead = 'פריט גלריה: סרטון. לחץ Enter לצפייה';
        } else if (img) {
          textToRead = `פריט גלריה: ${img.alt || 'תמונה'}. לחץ Enter לצפייה`;
        }
      }
      // שאלות נפוצות
      else if (target.classList.contains('faq-question')) {
        const expanded = target.getAttribute('aria-expanded');
        const question = target.querySelector('span')?.innerText || target.innerText;
        textToRead = `שאלה: ${question} - ${expanded === 'true' ? 'פתוח' : 'סגור'}. לחץ Enter לפתיחה`;
      }
      // פסקאות ותוכן כללי
      else if (tagName === "P") {
        textToRead = target.innerText.trim();
      }
      // span, div ותוכן אחר
      else if (target.innerText && target.innerText.trim()) {
        // בדוק אם זה לא כולל הרבה אלמנטים ילדים
        if (target.children.length <= 2) {
          textToRead = target.innerText.trim();
        }
      }

      return textToRead;
    };

    // מאזין ללחיצות
    this.screenReaderListener = (e) => {
      const target = e.target;
      const textToRead = getElementDescription(target);
      if (textToRead) {
        this.speak(textToRead);
      }
    };

    // מאזין לשינויי פוקוס - קריאה אוטומטית כשמגיעים לאלמנט
    this.screenReaderFocusListener = (e) => {
      const target = e.target;
      const textToRead = getElementDescription(target);
      if (textToRead) {
        this.speak(textToRead);
      }
    };

    document.body.addEventListener("click", this.screenReaderListener);
    document.body.addEventListener("focusin", this.screenReaderFocusListener);

    // קריאה אוטומטית בעת hover (אופציונלי)
    this.screenReaderHoverListener = (e) => {
      if (e.target.matches("a, button, h1, h2, h3, h4, h5, h6, .price-item, .gallery-item, .faq-question")) {
        clearTimeout(this.hoverTimeout);
        this.hoverTimeout = setTimeout(() => {
          const textToRead = getElementDescription(e.target);
          if (textToRead) {
            this.speak(textToRead, true); // קריאה שקטה יותר
          }
        }, 800); // המתן 0.8 שנייה לפני הקריאה
      }
    };

    document.body.addEventListener('mouseover', this.screenReaderHoverListener);
  },

  disableScreenReaderListeners() {
    if (this.screenReaderListener) {
      document.body.removeEventListener("click", this.screenReaderListener);
    }
    if (this.screenReaderFocusListener) {
      document.body.removeEventListener("focusin", this.screenReaderFocusListener);
    }
    if (this.screenReaderHoverListener) {
      document.body.removeEventListener("mouseover", this.screenReaderHoverListener);
    }
    if (this.hoverTimeout) {
      clearTimeout(this.hoverTimeout);
    }
  },

  speak(text, quiet = false) {
    if (!this.synth) return;

    // עצור דיבור קודם
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    if (this.hebrewVoice) {
      utterance.voice = this.hebrewVoice;
    }

    utterance.lang = "he-IL";
    utterance.rate = this.screenReaderSpeed;
    utterance.pitch = 1;
    utterance.volume = quiet ? 0.5 : 1;

    this.synth.speak(utterance);
  },

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
    }
  },

  adjustReaderSpeed(delta) {
    this.screenReaderSpeed = Math.max(
      0.5,
      Math.min(2, this.screenReaderSpeed + delta),
    );
    this.announce(`מהירות קריאה: ${Math.round(this.screenReaderSpeed * 100)}%`);
  },

  // ===== מדריך קריאה (Reading Guide) =====
  initReadingGuide() {
    // יצירת מדריך הקריאה אם לא קיים
    if (!document.getElementById("readingGuide")) {
      const guide = document.createElement("div");
      guide.id = "readingGuide";
      guide.className = "reading-guide";
      guide.style.display = "none";
      document.body.appendChild(guide);
    }
  },

  toggleReadingGuide(btn) {
    const guide = document.getElementById("readingGuide");
    this.readingGuideActive = !this.readingGuideActive;
    btn.setAttribute("aria-pressed", this.readingGuideActive);

    if (this.readingGuideActive) {
      guide.style.display = "block";
      this.updateGuideHandler = (e) => {
        guide.style.top = e.clientY + "px";
      };
      document.addEventListener("mousemove", this.updateGuideHandler);
      document.body.classList.add("reading-guide-active");
      this.announce("מדריך קריאה הופעל");
    } else {
      guide.style.display = "none";
      if (this.updateGuideHandler) {
        document.removeEventListener("mousemove", this.updateGuideHandler);
      }
      document.body.classList.remove("reading-guide-active");
      this.announce("מדריך קריאה בוטל");
    }
  },

  // ===== התאמת מרווח שורות =====
  toggleLineHeight(btn) {
    const isActive = document.body.classList.toggle("line-height-active");
    btn.setAttribute("aria-pressed", isActive);

    if (isActive) {
      this.lineHeight = 2;
      document.body.style.setProperty("--line-height", "2");
    } else {
      this.lineHeight = 1.5;
      document.body.style.setProperty("--line-height", "1.5");
    }

    this.announce(isActive ? "מרווח שורות הוגדל" : "מרווח שורות אופס");
  },

  // ===== התאמת מרווח אותיות =====
  toggleLetterSpacing(btn) {
    const isActive = document.body.classList.toggle("letter-spacing-active");
    btn.setAttribute("aria-pressed", isActive);

    if (isActive) {
      this.letterSpacing = 2;
      document.body.style.setProperty("--letter-spacing", "2px");
    } else {
      this.letterSpacing = 0;
      document.body.style.setProperty("--letter-spacing", "0px");
    }

    this.announce(isActive ? "מרווח אותיות הוגדל" : "מרווח אותיות אופס");
  },

  // ===== גופן ידידותי לדיסלקציה =====
  toggleDyslexiaFont(btn) {
    const isActive = document.body.classList.toggle("dyslexia-font-active");
    btn.setAttribute("aria-pressed", isActive);
    this.announce(isActive ? "גופן דיסלקציה הופעל" : "גופן דיסלקציה בוטל");
  },

  // ===== התאמת סמן עכבר =====
  toggleBigCursor(btn) {
    const isActive = document.body.classList.toggle("big-cursor-active");
    btn.setAttribute("aria-pressed", isActive);
    this.announce(isActive ? "סמן גדול הופעל" : "סמן גדול בוטל");
  },

  toggleCursorColor(btn) {
    const isActive = document.body.classList.toggle("cursor-color-active");
    btn.setAttribute("aria-pressed", isActive);
    this.announce(isActive ? "צבע סמן שונה" : "צבע סמן אופס");
  },

  // ===== ניגודיות הפוכה =====
  toggleInvertColors(btn) {
    const isActive = document.body.classList.toggle("invert-colors-active");
    btn.setAttribute("aria-pressed", isActive);
    this.announce(isActive ? "צבעים הפוכים הופעלו" : "צבעים הפוכים בוטלו");
  },

  // ===== השבתת אנימציות =====
  toggleStopAnimations(btn) {
    const isActive = document.body.classList.toggle("stop-animations-active");
    btn.setAttribute("aria-pressed", isActive);
    this.announce(isActive ? "אנימציות הושבתו" : "אנימציות הופעלו");
  },

  // ===== מצב קריאה =====
  toggleReadingMode(btn) {
    const isActive = document.body.classList.toggle("reading-mode-active");
    btn.setAttribute("aria-pressed", isActive);
    this.announce(isActive ? "מצב קריאה הופעל" : "מצב קריאה בוטל");
  },

  // ===== היפוך כיוון טקסט =====
  toggleTextDirection(btn) {
    const currentDir = document.documentElement.getAttribute("dir") || "rtl";
    const newDir = currentDir === "rtl" ? "ltr" : "rtl";
    document.documentElement.setAttribute("dir", newDir);
    btn.setAttribute("aria-pressed", newDir === "ltr");
    this.announce(
      `כיוון טקסט שונה ל-${newDir === "rtl" ? "ימין לשמאל" : "שמאל לימין"}`,
    );
  },

  // ===== אתחול כפתורי נגישות =====
  initAccessibilityButtons() {
    // הוסף מאזינים לכפתורי הנגישות החדשים
    const buttons = {
      increaseFontBtn: () => this.changeTextSize(10),
      decreaseFontBtn: () => this.changeTextSize(-10),
      highContrastBtn: (btn) => this.toggleFeature("high-contrast", btn),
      darkContrastBtn: (btn) => this.toggleFeature("dark-mode", btn),
      highContrastYellowBtn: (btn) =>
        this.toggleFeature("high-contrast-yellow", btn),
      highlightLinksBtn: (btn) => this.toggleFeature("highlight-links", btn),
      textDirectionBtn: (btn) => this.toggleTextDirection(btn),
      stopAnimationsBtn: (btn) => this.toggleStopAnimations(btn),
      readableFontBtn: (btn) => this.toggleFeature("readable-font", btn),
      readingModeBtn: (btn) => this.toggleReadingMode(btn),
      screenReaderBtn: (btn) => this.toggleScreenReader(btn),
      readerSpeedUpBtn: () => this.adjustReaderSpeed(0.25),
      readerSpeedDownBtn: () => this.adjustReaderSpeed(-0.25),
      lineHeightBtn: (btn) => this.toggleLineHeight(btn),
      letterSpacingBtn: (btn) => this.toggleLetterSpacing(btn),
      dyslexiaFontBtn: (btn) => this.toggleDyslexiaFont(btn),
      bigCursorBtn: (btn) => this.toggleBigCursor(btn),
      cursorColorBtn: (btn) => this.toggleCursorColor(btn),
      invertColorsBtn: (btn) => this.toggleInvertColors(btn),
      readingGuideBtn: (btn) => this.toggleReadingGuide(btn),
      hideMediaBtn: (btn) => this.toggleHideMedia(btn),
      keyboardNavBtn: (btn) => this.toggleKeyboardNav(btn),
    };

    Object.entries(buttons).forEach(([id, handler]) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener("click", () => {
          handler(btn);
          this.saveSettings();
        });
      }
    });
  },

  handleAction(btn) {
    const action = btn.dataset.action;

    switch (action) {
      case "keyboard-nav":
        this.toggleFeature("keyboard-nav", btn);
        break;
      case "skip-links":
        this.toggleSkipLinks(btn);
        break;
      case "text-size-increase":
        this.changeTextSize(10);
        break;
      case "text-size-decrease":
        this.changeTextSize(-10);
        break;
      case "line-height":
        this.toggleFeature("line-height", btn);
        break;
      case "letter-spacing":
        this.toggleFeature("letter-spacing", btn);
        break;
      case "readable-font":
        this.toggleFeature("readable-font", btn);
        break;
      case "high-contrast":
        this.toggleFeature("high-contrast", btn);
        break;
      case "dark-mode":
        this.toggleFeature("dark-mode", btn);
        break;
      case "light-background":
        this.toggleFeature("light-background", btn);
        break;
      case "grayscale":
        this.toggleFeature("grayscale", btn);
        break;
      case "highlight-links":
        this.toggleFeature("highlight-links", btn);
        break;
      case "highlight-headings":
        this.toggleFeature("highlight-headings", btn);
        break;
      case "focus-highlight":
        this.toggleFeature("focus-highlight", btn);
        break;
      case "big-cursor":
        this.toggleFeature("big-cursor", btn);
        break;
      case "reading-guide":
        this.toggleReadingGuide(btn);
        break;
    }

    this.saveSettings();
  },

  toggleFeature(feature, btn) {
    // שמירת מיקום הגלילה לפני השינוי
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // שמירת מצב הפאנל לפני השינוי
    const panel = document.getElementById("accessibilityPanel");
    const panelWasActive = panel && panel.classList.contains("active");

    const isActive = document.body.classList.toggle(`${feature}-active`);
    btn.setAttribute("aria-pressed", isActive);
    this.announce(`${btn.textContent.trim()} ${isActive ? "הופעל" : "בוטל"}`);

    // וידוא שהפאנל נשאר פתוח ובמקומו
    if (panelWasActive && panel) {
      panel.classList.add("active");
    }

    // החזרת מיקום הגלילה אחרי השינוי
    requestAnimationFrame(() => {
      window.scrollTo(scrollX, scrollY);
    });
  },

  changeTextSize(delta) {
    this.textSize = Math.max(80, Math.min(150, this.textSize + delta));
    document.documentElement.style.fontSize = this.textSize + "%";

    // הסר מחלקות קודמות
    document.body.classList.remove(
      "text-size-80",
      "text-size-90",
      "text-size-110",
      "text-size-120",
      "text-size-130",
      "text-size-140",
      "text-size-150",
    );

    // הוסף מחלקה חדשה אם לא 100%
    if (this.textSize !== 100) {
      document.body.classList.add(`text-size-${this.textSize}`);
    }

    this.announce(`גודל טקסט שונה ל-${this.textSize}%`);
    this.saveSettings();
  },

  toggleSkipLinks(btn) {
    const skipLinks = document.getElementById("skipLinks");
    const isActive = skipLinks.style.display === "block";

    if (isActive) {
      skipLinks.style.display = "none";
      btn.setAttribute("aria-pressed", "false");
      this.announce("קישורי דילוג בוטלו");
    } else {
      skipLinks.style.display = "block";
      btn.setAttribute("aria-pressed", "true");
      this.announce("קישורי דילוג הופעלו");
    }
  },

  toggleReadingGuide(btn) {
    const guide = document.getElementById("readingGuide");
    const isActive = guide.style.display === "block";

    if (isActive) {
      guide.style.display = "none";
      btn.setAttribute("aria-pressed", "false");
      document.removeEventListener("mousemove", this.updateGuide);
      this.announce("מדריך קריאה בוטל");
    } else {
      guide.style.display = "block";
      btn.setAttribute("aria-pressed", "true");
      this.updateGuide = (e) => {
        guide.style.top = e.clientY + "px";
      };
      document.addEventListener("mousemove", this.updateGuide);
      this.announce("מדריך קריאה הופעל");
    }
  },

  // ===== הסתרת תמונות וסרטונים =====
  toggleHideMedia(btn) {
    const isActive = document.body.classList.toggle("hide-media-active");
    btn.setAttribute("aria-pressed", isActive);
    this.announce(
      isActive ? "תמונות וסרטונים הוסתרו" : "תמונות וסרטונים מוצגות",
    );
  },

  // ===== ניווט מקלדת מלא =====
  toggleKeyboardNav(btn) {
    const isActive = document.body.classList.toggle("keyboard-nav-active");
    btn.setAttribute("aria-pressed", isActive);

    if (isActive) {
      // הוסף tabindex לכל האלמנטים האינטראקטיביים
      this.enableFullKeyboardNav();
      this.announce(
        "ניווט מקלדת מלא הופעל. השתמש ב-Tab לניווט, Enter לבחירה, Escape ליציאה",
      );
    } else {
      this.disableFullKeyboardNav();
      this.announce("ניווט מקלדת מלא בוטל");
    }
  },

  enableFullKeyboardNav() {
    // הסר מאזין קודם אם קיים (מונע כפילויות)
    if (this.keyboardNavHandler) {
      document.removeEventListener("keydown", this.keyboardNavHandler);
    }

    // הפוך את כל האלמנטים לנגישים במקלדת - כמו בקורא מסך
    // לא כולל: תמונות בslider, אינדיקטורים של slider, price-item (יש להם ניווט משלהם)
    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, [role="button"], ' +
      'h1, h2, h3, h4, h5, h6, p, li, video, ' +
      '.gallery-item, .content-box, .service-card, ' +
      '.faq-question, .faq-answer, .blog-post, .blog-card, ' +
      'table, th, td, section, article',
    );
    interactiveElements.forEach((el) => {
      // דלג על תמונות בתוך slider ועל אינדיקטורים
      if (el.closest('.slider-track') || el.closest('.slider-indicators')) {
        return;
      }
      // דלג על price-item - יש להם ניווט נפרד
      if (el.classList.contains('price-item')) {
        return;
      }
      if (!el.hasAttribute("tabindex")) {
        el.setAttribute("tabindex", "0");
        el.setAttribute("data-keyboard-nav-added", "true");
      }
    });

    // הוסף מאזיני מקלדת גלובליים
    this.keyboardNavHandler = (e) => {
      // בדוק שניווט מקלדת פעיל
      if (!document.body.classList.contains("keyboard-nav-active")) return;

      // קבל רשימת אלמנטים גלויים בלבד
      const focusableElements = this.getVisibleFocusableElements();
      const currentIndex = focusableElements.indexOf(document.activeElement);

      switch (e.key) {
        case "ArrowDown":
          // חץ למטה - גלילה למטה (התנהגות רגילה של הדפדפן)
          break;
        case "ArrowUp":
          // חץ למעלה - גלילה למעלה (התנהגות רגילה של הדפדפן)
          break;
        case "ArrowLeft":
          e.preventDefault();
          // חץ שמאל = כמו Tab (אלמנט הבא)
          this.focusNextElement(focusableElements, currentIndex);
          break;
        case "ArrowRight":
          e.preventDefault();
          // חץ ימין = כמו Shift+Tab (אלמנט קודם)
          this.focusPrevElement(focusableElements, currentIndex);
          break;
        case "Home":
          e.preventDefault();
          this.focusFirstElement(focusableElements);
          break;
        case "End":
          e.preventDefault();
          this.focusLastElement(focusableElements);
          break;
      }
    };
    document.addEventListener("keydown", this.keyboardNavHandler);
  },

  disableFullKeyboardNav() {
    // הסר tabindex שנוסף
    const addedElements = document.querySelectorAll(
      '[data-keyboard-nav-added="true"]',
    );
    addedElements.forEach((el) => {
      el.removeAttribute("tabindex");
      el.removeAttribute("data-keyboard-nav-added");
    });

    // הסר מאזין מקלדת
    if (this.keyboardNavHandler) {
      document.removeEventListener("keydown", this.keyboardNavHandler);
    }
  },

  // פונקציה לקבלת אלמנטים גלויים בלבד - ממוינים לפי סדר: header → content → footer
  getVisibleFocusableElements() {
    const allFocusable = document.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );

    // סנן רק אלמנטים שנראים על המסך
    const visibleElements = Array.from(allFocusable).filter((el) => {
      // בדוק שהאלמנט גלוי
      if (el.offsetParent === null) return false;

      // בדוק שלא מוסתר על ידי style
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') return false;

      // בדוק שההורה לא מוסתר
      if (el.closest('[style*="display: none"]') ||
          el.closest('[style*="visibility: hidden"]') ||
          el.closest(".hidden")) return false;

      // אל תכלול אלמנטים בתפריט נגישות אם הוא סגור
      const accessibilityPanel = el.closest('.accessibility-panel');
      if (accessibilityPanel && !accessibilityPanel.classList.contains('active')) return false;

      // אל תכלול אלמנטים בצ'אטבוט אם הוא סגור
      const chatbotContainer = el.closest('.chatbot-container');
      if (chatbotContainer && !chatbotContainer.classList.contains('active')) return false;

      return true;
    });

    // מיון לפי סדר: header → content → footer
    return visibleElements.sort((a, b) => {
      // קבל את האזור של כל אלמנט
      const getZone = (el) => {
        if (el.closest('header')) return 0;
        if (el.closest('footer')) return 2;
        return 1; // תוכן
      };

      const zoneA = getZone(a);
      const zoneB = getZone(b);

      // מיון ראשי לפי אזור
      if (zoneA !== zoneB) {
        return zoneA - zoneB;
      }

      // בתוך אותו אזור - מיון לפי מיקום
      const rectA = a.getBoundingClientRect();
      const rectB = b.getBoundingClientRect();

      // מיון לפי מיקום אנכי (Y)
      const yDiff = rectA.top - rectB.top;
      if (Math.abs(yDiff) > 10) { // טולרנס של 10px לאלמנטים באותה שורה
        return yDiff;
      }

      // אם באותה שורה, מיין לפי מיקום אופקי (X) - בהתחשב ב-RTL
      const isRTL = document.documentElement.dir === "rtl" ||
                    document.documentElement.lang === "he";
      if (isRTL) {
        return rectB.left - rectA.left; // ב-RTL: מימין לשמאל
      } else {
        return rectA.left - rectB.left; // ב-LTR: משמאל לימין
      }
    });
  },

  focusNextElement(elements, currentIndex) {
    if (!elements) elements = this.getVisibleFocusableElements();
    if (currentIndex === undefined)
      currentIndex = elements.indexOf(document.activeElement);
    const nextIndex = currentIndex < elements.length - 1 ? currentIndex + 1 : 0;
    elements[nextIndex]?.focus();
  },

  focusPrevElement(elements, currentIndex) {
    if (!elements) elements = this.getVisibleFocusableElements();
    if (currentIndex === undefined)
      currentIndex = elements.indexOf(document.activeElement);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : elements.length - 1;
    elements[prevIndex]?.focus();
  },

  focusFirstElement(elements) {
    if (!elements) elements = this.getVisibleFocusableElements();
    elements[0]?.focus();
  },

  focusLastElement(elements) {
    if (!elements) elements = this.getVisibleFocusableElements();
    elements[elements.length - 1]?.focus();
  },

  resetAll() {
    // עצור קורא מסך אם פעיל
    if (this.screenReaderActive) {
      this.stopSpeaking();
      this.disableScreenReaderListeners();
      this.screenReaderActive = false;
    }

    // הסרת כל המחלקות
    document.body.className = "";
    document.documentElement.style.fontSize = "";
    document.documentElement.setAttribute("dir", "rtl"); // החזרת כיוון לעברית

    // איפוס משתנים
    this.textSize = 100;
    this.lineHeight = 1.5;
    this.letterSpacing = 0;
    this.cursorSize = 1;
    this.screenReaderSpeed = 1;
    this.readingGuideActive = false;

    // איפוס CSS variables
    document.body.style.removeProperty("--line-height");
    document.body.style.removeProperty("--letter-spacing");

    // איפוס כפתורים - כל הכפתורים בתפריט הנגישות
    const allButtons = document.querySelectorAll(
      ".accessibility-panel button, .accessibility-btn",
    );
    allButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", "false");
    });

    // איפוס אלמנטים
    const skipLinks = document.getElementById("skipLinks");
    const readingGuide = document.getElementById("readingGuide");

    if (skipLinks) skipLinks.style.display = "none";
    if (readingGuide) {
      readingGuide.style.display = "none";
      if (this.updateGuideHandler) {
        document.removeEventListener("mousemove", this.updateGuideHandler);
      }
    }

    localStorage.removeItem("accessibilitySettings");
    this.announce("כל הגדרות הנגישות אופסו");

    // אנימציה לכפתור איפוס
    if (this.resetBtn) {
      const originalHTML = this.resetBtn.innerHTML;
      this.resetBtn.innerHTML =
        '<i class="fa-solid fa-check"></i> אופס בהצלחה!';
      setTimeout(() => {
        this.resetBtn.innerHTML = originalHTML;
      }, 2000);
    }
  },

  saveSettings() {
    // שמירת כל מצבי הכפתורים החדשים
    const buttonStates = {};
    const buttonIds = [
      "screenReaderBtn",
      "increaseFontBtn",
      "decreaseFontBtn",
      "highContrastBtn",
      "darkContrastBtn",
      "highContrastYellowBtn",
      "highlightLinksBtn",
      "textDirectionBtn",
      "stopAnimationsBtn",
      "readableFontBtn",
      "readingModeBtn",
      "lineHeightBtn",
      "letterSpacingBtn",
      "dyslexiaFontBtn",
      "bigCursorBtn",
      "cursorColorBtn",
      "invertColorsBtn",
      "readingGuideBtn",
      "hideMediaBtn",
      "keyboardNavBtn",
    ];

    buttonIds.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        buttonStates[id] = btn.getAttribute("aria-pressed") === "true";
      }
    });

    const settings = {
      classes: document.body.className,
      textSize: this.textSize,
      screenReaderActive: this.screenReaderActive,
      screenReaderSpeed: this.screenReaderSpeed,
      buttonStates: buttonStates,
      pressed: Array.from(this.actions).map((btn) => ({
        action: btn.dataset.action,
        pressed: btn.getAttribute("aria-pressed"),
      })),
    };
    localStorage.setItem("accessibilitySettings", JSON.stringify(settings));
  },

  loadSettings() {
    const saved = localStorage.getItem("accessibilitySettings");
    if (!saved) return;

    try {
      const settings = JSON.parse(saved);
      document.body.className = settings.classes || "";
      this.textSize = settings.textSize || 100;
      document.documentElement.style.fontSize = this.textSize + "%";

      // טעינת מצבי כפתורים חדשים
      if (settings.buttonStates) {
        Object.entries(settings.buttonStates).forEach(([id, isActive]) => {
          const btn = document.getElementById(id);
          if (btn && isActive) {
            btn.setAttribute("aria-pressed", "true");

            // הפעלת קורא מסך אם היה פעיל
            if (id === "screenReaderBtn" && isActive) {
              this.screenReaderActive = true;
              this.enableScreenReaderListeners();
              document.body.classList.add("screen-reader-active");
            }

            // הפעלת מדריך קריאה אם היה פעיל
            if (id === "readingGuideBtn" && isActive) {
              const guide = document.getElementById("readingGuide");
              if (guide) {
                guide.style.display = "block";
                this.updateGuideHandler = (e) => {
                  guide.style.top = e.clientY + "px";
                };
                document.addEventListener("mousemove", this.updateGuideHandler);
              }
            }

            // הפעלת ניווט מקלדת אם היה פעיל
            if (id === "keyboardNavBtn" && isActive) {
              this.enableFullKeyboardNav();
            }
          }
        });
      }

      // סנכרון מצב כפתורים לפי קלאסים של body (לתאימות אחורה)
      const classToButton = {
        "high-contrast-yellow-active": "highContrastYellowBtn",
        "dark-mode-active": "darkContrastBtn",
        "high-contrast-active": "highContrastBtn",
        "highlight-links-active": "highlightLinksBtn",
        "readable-font-active": "readableFontBtn",
        "invert-colors-active": "invertColorsBtn",
        "line-height-active": "lineHeightBtn",
        "letter-spacing-active": "letterSpacingBtn",
        "dyslexia-font-active": "dyslexiaFontBtn",
        "big-cursor-active": "bigCursorBtn",
        "stop-animations-active": "stopAnimationsBtn",
        "hide-media-active": "hideMediaBtn",
        "keyboard-nav-active": "keyboardNavBtn",
        "reading-mode-active": "readingModeBtn",
        "cursor-color-active": "cursorColorBtn",
      };

      Object.entries(classToButton).forEach(([className, btnId]) => {
        if (document.body.classList.contains(className)) {
          const btn = document.getElementById(btnId);
          if (btn) {
            btn.setAttribute("aria-pressed", "true");
          }
        }
      });

      // הפעלה מחדש של פונקציות שדורשות אתחול מיוחד
      if (document.body.classList.contains("keyboard-nav-active")) {
        this.enableFullKeyboardNav();
      }

      // טעינת מהירות קורא מסך
      if (settings.screenReaderSpeed) {
        this.screenReaderSpeed = settings.screenReaderSpeed;
      }

      settings.pressed?.forEach((item) => {
        const btn = document.querySelector(`[data-action="${item.action}"]`);
        if (btn) btn.setAttribute("aria-pressed", item.pressed);
      });
    } catch (e) {
      console.error("Error loading accessibility settings:", e);
    }
  },

  announce(message) {
    const announcer = document.getElementById("srAnnouncer");
    announcer.textContent = message;
    setTimeout(() => (announcer.textContent = ""), 1000);
  },

  initKeyboardNav() {
    if (!this.panel) return;
    // ניווט במקלדת בתוך הפאנל
    this.panel.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        const focusable = this.panel.querySelectorAll("button:not([disabled])");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  },
};

// אתחול
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () =>
    AccessibilityManager.init(),
  );
} else {
  AccessibilityManager.init();
}

// ===== צ'אטבוט חכם - סאנרייז ספא =====
const chatbotBtn = document.getElementById("chatbotBtn");
const chatbotContainer = document.getElementById("chatbotContainer");
const chatbotClose = document.getElementById("chatbotClose");
const chatbotMessages = document.getElementById("chatbotMessages");

// מידע על הספא
const spaInfo = {
  name: "סאנרייז ספא",
  address: "ההסתדרות 2, קומה 2, פתח תקווה",
  phone: "058-658-8751",
  whatsapp: "https://wa.me/972586588751",
  whatsappBooking: "https://wa.me/972586588751?text=%D7%A9%D7%9C%D7%95%D7%9D%2C%20%D7%90%D7%A0%D7%99%20%D7%9E%D7%A2%D7%95%D7%A0%D7%99%D7%99%D7%9F%2F%D7%AA%20%D7%9C%D7%94%D7%96%D7%9E%D7%99%D7%9F%20%D7%AA%D7%95%D7%A8%20%D7%9C%D7%A2%D7%99%D7%A1%D7%95%D7%99%20%D7%91%D7%A1%D7%90%D7%A0%D7%A8%D7%99%D7%99%D7%96%20%D7%A1%D7%A4%D7%90%20%F0%9F%8C%BF",
  waze: "https://www.waze.com/live-map/directions/il/center-district/%D7%A4%D7%AA/sunrise-spa-%D7%A1%D7%A4%D7%90-%D7%A2%D7%99%D7%A1%D7%95%D7%99-%D7%A4%D7%AA%D7%97-%D7%AA%D7%A7%D7%95%D7%95%D7%94?navigate=yes&to=place.ChIJSZXBMVY3HRURy-oaXLqTcrg",
  maps: "https://www.google.com/maps/dir//Sunrise+Spa",
  hours: {
    weekdays: "20:00 - 10:00",
    friday: "15:00 - 9:00",
    saturday: "סגור"
  },
  services: [
    { name: "עיסוי תאילנדי", description: "עיסוי מסורתי עם מתיחות ולחיצות עמוקות, משפר גמישות ומשחרר מתחים" },
    { name: "עיסוי שוודי", description: "עיסוי קלאסי עם תנועות ליטוף ולישה, מושלם להרפיה ושיפור זרימת הדם" },
    { name: "עיסוי רקמות עמוק", description: "עיסוי חזק המתמקד בשרירים עמוקים, מתאים לכאבים כרוניים" },
    { name: "עיסוי רגליים (רפלקסולוגיה)", description: "לחיצות על נקודות בכפות הרגליים המחוברות לאיברי הגוף" },
    { name: "עיסוי זוגי", description: "עיסוי זוגי בחדר מרווח לשני אנשים" }
  ],
  prices: {
    body: [
      { duration: "45 דקות", price: 220 },
      { duration: "60 דקות", price: 270 },
      { duration: "75 דקות", price: 325 },
      { duration: "90 דקות", price: 380 },
      { duration: "120 דקות", price: 500 }
    ],
    couples: [
      { duration: "60 דקות", price: 500 },
      { duration: "75 דקות", price: 600 },
      { duration: "90 דקות", price: 700 },
      { duration: "120 דקות", price: 850 }
    ],
    feet: [
      { duration: "30 דקות", price: 150 },
      { duration: "45 דקות", price: 200 },
      { duration: "60 דקות", price: 240 }
    ]
  },
  social: {
    facebook: "https://www.facebook.com/snryyzsp/",
    instagram: "https://www.instagram.com/sunrise._.spa/",
    tiktok: "https://www.tiktok.com/@sunrise.spa7",
    youtube: "https://www.youtube.com/@SunriseSpa-z8u"
  }
};

// מערכת זיהוי כוונה חכמה
const intentPatterns = {
  greeting: {
    patterns: [/^(היי|הי|שלום|בוקר טוב|ערב טוב|צהריים טובים|מה נשמע|מה קורה|אהלן|הלו|hello|hi|hey|יא מלך|יא גבר|מה קורה אחי|אחלן)/i],
    response: () => `שלום וברוכים הבאים! 👋<br><br>אני כאן לעזור לך בכל שאלה על <strong>סאנרייז ספא</strong>.<br>מה תרצה לדעת?`
  },
  thanks: {
    patterns: [/(תודה|תודה רבה|מעולה|אחלה|מושלם|נהדר|תנקס|thanks|thank you|tnx)/i],
    response: () => `בשמחה! 😊<br><br>אם יש עוד שאלות, אני כאן לעזור.<br>מחכים לראות אותך ב<strong>סאנרייז ספא</strong>! 💆`
  },
  goodbye: {
    patterns: [/(להתראות|ביי|יאללה|שיהיה|bye|goodbye|יום טוב|לילה טוב)/i],
    response: () => `להתראות! 👋<br><br>תודה שפנית אלינו. מחכים לראות אותך בספא! 💕<br><br>📞 להזמנת תור: <a href="tel:0586588751" style="color: #667eea; font-weight: bold;">058-658-8751</a>`
  },
  hours: {
    patterns: [/(שעות|פעילות|פתוח|סגור|מתי|עובד|עובדים|פותח|נסגר|זמין|זמינים|מה השעות)/i],
    response: () => `⏰ <strong>שעות הפעילות שלנו:</strong><br><br>📅 ראשון - חמישי: ${spaInfo.hours.weekdays}<br>📅 שישי: ${spaInfo.hours.friday}<br>📅 שבת: ${spaInfo.hours.saturday}<br><br>💡 מומלץ לתאם תור מראש!`
  },
  prices: {
    patterns: [/(מחיר|כמה|עולה|עלות|תשלום|לשלם|מחירון|כסף|₪|שקל|תעריף|עלויות)/i],
    response: () => {
      let priceText = `💰 <strong>המחירון שלנו:</strong><br><br>`;
      priceText += `<strong>💆 עיסוי גוף</strong> (תאילנדי/שוודי/רקמות עמוק):<br>`;
      spaInfo.prices.body.forEach(p => priceText += `• ${p.duration} - ₪${p.price}<br>`);
      priceText += `<br><strong>👫 עיסוי זוגי:</strong><br>`;
      spaInfo.prices.couples.forEach(p => priceText += `• ${p.duration} - ₪${p.price}<br>`);
      priceText += `<br><strong>🦶 עיסוי רגליים:</strong><br>`;
      spaInfo.prices.feet.forEach(p => priceText += `• ${p.duration} - ₪${p.price}<br>`);
      return priceText;
    }
  },
  location: {
    patterns: [/(איפה|כתובת|מיקום|נמצא|ממוקם|להגיע|הגעה|וייז|waze|maps|מפה|ניווט|איך מגיעים|דרך)/i],
    response: () => `📍 <strong>המיקום שלנו:</strong><br><br>🏢 <strong>${spaInfo.address}</strong><br><br>🚗 <a href="${spaInfo.waze}" target="_blank" style="color: #1565C0; font-weight: bold;">ניווט בוויז</a><br><br>🗺️ <a href="${spaInfo.maps}" target="_blank" style="color: #1565C0; font-weight: bold;">ניווט בגוגל מפות</a>`
  },
  services: {
    patterns: [/(סוג|סוגי|עיסוי|עיסויים|טיפול|טיפולים|מסאז|מציעים|שירות|שירותים|מה יש|אפשרויות)/i],
    response: () => {
      let text = `✨ <strong>סוגי העיסויים שלנו:</strong><br><br>`;
      spaInfo.services.forEach(s => {
        text += `<strong>${s.name}</strong><br>${s.description}<br><br>`;
      });
      text += `כל העיסויים מבוצעים על ידי מעסים מקצועיים ומוסמכים! 👨‍⚕️`;
      return text;
    }
  },
  booking: {
    patterns: [/(הזמנה|להזמין|תור|לקבוע|לתאם|booking|זימון|לזמן|קביעת|מזמינים)/i],
    response: () => `📅 <strong>להזמנת תור:</strong><br><br>💬 <a href="${spaInfo.whatsappBooking}" target="_blank" style="color: #128C7E; font-weight: bold;">וואטסאפ - לחץ כאן</a><br><br>📞 <a href="tel:0586588751" style="color: #667eea; font-weight: bold;">התקשרו: ${spaInfo.phone}</a><br><br>💡 מומלץ להזמין מראש לקבלת השעה המועדפת!`
  },
  phone: {
    patterns: [/(טלפון|פלאפון|מספר|להתקשר|התקשרות|נייד)/i],
    response: () => `📞 <strong>הטלפון שלנו:</strong><br><br><a href="tel:0586588751" style="color: #667eea; font-weight: bold; font-size: 18px;">${spaInfo.phone}</a><br><br>💬 או שלחו הודעה ב<a href="${spaInfo.whatsappBooking}" target="_blank" style="color: #128C7E; font-weight: bold;">וואטסאפ</a>`
  },
  parking: {
    patterns: [/(חניה|חנייה|חונה|לחנות|parking|רכב|מכונית|אוטו)/i],
    response: () => `🚗 <strong>חניה באזור:</strong><br><br>• חניה בחינם ברחוב (כחול-לבן)<br>• חניון ציבורי קרוב<br>• חניה בתשלום בסביבה<br><br>💡 מומלץ להגיע 5-10 דקות מוקדם למציאת חניה נוחה`
  },
  thai: {
    patterns: [/(תאילנדי|תאילנד|thai)/i],
    response: () => `🌿 <strong>עיסוי תאילנדי:</strong><br><br>עיסוי מסורתי בן אלפי שנים הכולל:<br>• מתיחות יוגה<br>• לחיצות אקופרסורה<br>• תנוחות ייחודיות<br><br>✨ מתאים לשיפור גמישות ושחרור מתחים עמוקים<br><br>💰 מחירים: החל מ-₪220 (45 דקות)`
  },
  swedish: {
    patterns: [/(שוודי|שבדי|swedish)/i],
    response: () => `🧘 <strong>עיסוי שוודי:</strong><br><br>העיסוי הקלאסי והפופולרי ביותר:<br>• תנועות ליטוף ארוכות<br>• לישה עדינה<br>• תנועות מעגליות<br><br>✨ מושלם להרפיה, שיפור זרימת הדם והקלה על כאבי שרירים<br><br>💰 מחירים: החל מ-₪220 (45 דקות)`
  },
  deep: {
    patterns: [/(רקמות עמוק|עמוק|deep tissue|דיפ)/i],
    response: () => `💪 <strong>עיסוי רקמות עמוק:</strong><br><br>עיסוי אינטנסיבי ממוקד:<br>• מתמקד בשכבות העמוקות של השרירים<br>• לחיצות חזקות וממוקדות<br>• מתאים לכאבים כרוניים ופגיעות ספורט<br><br>✨ מספק הקלה ארוכת טווח<br><br>💰 מחירים: החל מ-₪220 (45 דקות)`
  },
  feet: {
    patterns: [/(רגליים|רגל|רפלקסולוגיה|reflexology|כף רגל)/i],
    response: () => `🦶 <strong>עיסוי רגליים / רפלקסולוגיה:</strong><br><br>שיטת טיפול עתיקה:<br>• לחיצות על נקודות בכפות הרגליים<br>• הנקודות מחוברות לאיברים שונים בגוף<br>• מרגיע ומפחית מתח<br><br>💰 מחירים:<br>• 30 דקות - ₪150<br>• 45 דקות - ₪200<br>• 60 דקות - ₪240`
  },
  couples: {
    patterns: [/(זוגי|זוג|זוגות|couple|ביחד|שנינו|רומנטי)/i],
    response: () => `👫 <strong>עיסוי זוגי:</strong><br><br>חוויה מושלמת לזוגות!<br>• שני מעסים מקצועיים במקביל<br>• חדר מרווח ומיוחד<br>• אווירה רומנטית ומרגיעה<br><br>💰 מחירים:<br>• 60 דקות - ₪500<br>• 75 דקות - ₪600<br>• 90 דקות - ₪700<br>• 120 דקות - ₪850<br><br>💕 מושלם למתנה או לאירוע מיוחד!`
  },
  payment: {
    patterns: [/(אשראי|מזומן|כרטיס|bit|ביט|תשלום|לשלם|משלמים|אפשר לשלם)/i],
    response: () => `💳 <strong>אמצעי תשלום:</strong><br><br>אנו מקבלים:<br>• מזומן<br>• כרטיסי אשראי (ויזה, מאסטרקארד)<br>• bit (בתיאום מראש)<br>• העברה בנקאית (בתיאום מראש)<br><br>📄 חשבונית ניתנת לפי בקשה`
  },
  cancel: {
    patterns: [/(ביטול|לבטל|שינוי|לשנות|cancel|להעביר|הזיז)/i],
    response: () => `🗓️ <strong>מדיניות ביטולים:</strong><br><br>✅ ביטול עד 24 שעות מראש - ללא עלות<br>⚠️ ביטול פחות מ-24 שעות - חיוב חלקי<br>❌ אי הגעה ללא הודעה - חיוב מלא<br><br>📞 לביטול או שינוי: <a href="tel:0586588751" style="color: #667eea; font-weight: bold;">${spaInfo.phone}</a>`
  },
  duration: {
    patterns: [/(כמה זמן|משך|זמן|דקות|שעה|לוקח|אורך|ארוך|קצר)/i],
    response: () => `⏱️ <strong>משך הטיפולים:</strong><br><br><strong>עיסוי גוף:</strong> 45, 60, 75, 90 או 120 דקות<br><strong>עיסוי זוגי:</strong> 60, 75, 90 או 120 דקות<br><strong>עיסוי רגליים:</strong> 30, 45 או 60 דקות<br><br>💡 ככל שהטיפול ארוך יותר, כך ההרפיה עמוקה יותר!`
  },
  recommend: {
    patterns: [/(ממליצים|מומלץ|הכי טוב|מה עדיף|איזה עיסוי|מתאים לי|לבחור)/i],
    response: () => `🤔 <strong>איזה עיסוי מומלץ?</strong><br><br>🧘 <strong>להרפיה כללית:</strong> עיסוי שוודי<br>💪 <strong>לכאבי שרירים:</strong> עיסוי רקמות עמוק<br>🌿 <strong>לגמישות ואנרגיה:</strong> עיסוי תאילנדי<br>🦶 <strong>לעייפות ברגליים:</strong> רפלקסולוגיה<br>👫 <strong>לחוויה רומנטית:</strong> עיסוי זוגי<br><br>💬 לא בטוחים? התקשרו ונעזור לבחור!`
  },
  about: {
    patterns: [/(מה זה|מי אתם|על הספא|ספר לי|ספרי לי|תגיד לי|תגידי לי|פרטים)/i],
    response: () => `✨ <strong>אודות סאנרייז ספא:</strong><br><br>אנחנו ספא מקצועי בלב פתח תקווה, מתמחים במגוון טיפולי עיסוי.<br><br>🏢 <strong>כתובת:</strong> ${spaInfo.address}<br>📞 <strong>טלפון:</strong> ${spaInfo.phone}<br><br>💆 המעסים שלנו מוסמכים ומנוסים<br>🌟 אווירה מרגיעה ומפנקת<br>💕 שירות אישי וחם<br><br>נשמח לראותכם!`
  },
  social: {
    patterns: [/(פייסבוק|אינסטגרם|טיקטוק|יוטיוב|facebook|instagram|tiktok|youtube|רשתות חברתיות)/i],
    response: () => `📱 <strong>עקבו אחרינו:</strong><br><br>📘 <a href="${spaInfo.social.facebook}" target="_blank" style="color: #1877f2; font-weight: bold;">פייסבוק</a><br>📸 <a href="${spaInfo.social.instagram}" target="_blank" style="color: #E4405F; font-weight: bold;">אינסטגרם</a><br>🎵 <a href="${spaInfo.social.tiktok}" target="_blank" style="color: #000; font-weight: bold;">טיקטוק</a><br>▶️ <a href="${spaInfo.social.youtube}" target="_blank" style="color: #FF0000; font-weight: bold;">יוטיוב</a>`
  },
  gift: {
    patterns: [/(מתנה|גיפט|gift|שובר|voucher|קארד|כרטיס מתנה)/i],
    response: () => `🎁 <strong>מתנה מושלמת!</strong><br><br>רוצה לפנק מישהו יקר בעיסוי?<br><br>📞 צרו קשר ונסדר לכם שובר מתנה:<br>טלפון: <a href="tel:0586588751" style="color: #667eea; font-weight: bold;">${spaInfo.phone}</a><br><br>💕 עיסוי זוגי = מתנה רומנטית מושלמת!`
  },
  pain: {
    patterns: [/(כאב|כואב|כאבים|גב|צוואר|כתפיים|שרירים|מתח|לחץ)/i],
    response: () => `💪 <strong>עיסוי לכאבים:</strong><br><br>מומלץ לנסות <strong>עיסוי רקמות עמוק</strong>!<br><br>✨ יתרונות:<br>• מתמקד בשכבות העמוקות<br>• משחרר מתחים כרוניים<br>• מקל על כאבי גב, צוואר וכתפיים<br><br>💡 לתוצאות טובות יותר - מומלץ טיפול של 60-90 דקות<br><br>📞 הזמינו תור: <a href="tel:0586588751" style="color: #667eea; font-weight: bold;">${spaInfo.phone}</a>`
  },
  relax: {
    patterns: [/(להירגע|רגיעה|סטרס|לחוץ|מתוח|עייף|עייפות|מנוחה|פינוק)/i],
    response: () => `🧘 <strong>זמן להירגע!</strong><br><br>מומלץ לנסות <strong>עיסוי שוודי</strong> - הכי מרגיע!<br><br>✨ מה תקבלו:<br>• תנועות רכות ומלטפות<br>• הרפיה עמוקה<br>• שיפור זרימת הדם<br>• יציאה מרוגעים ומאושרים<br><br>💆 שעה של עיסוי = כמו חופשה קטנה!<br><br>📞 להזמנת פינוק: <a href="tel:0586588751" style="color: #667eea; font-weight: bold;">${spaInfo.phone}</a>`
  },
  // שאלות כלליות
  time: {
    patterns: [/(מה השעה|כמה השעה|שעה עכשיו|מה השעה עכשיו|תגיד לי שעה|השעה בבקשה|the time|what time)/i],
    response: () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
      return `🕐 השעה עכשיו: <strong>${timeStr}</strong><br><br>💡 שעות הפעילות שלנו:<br>ראשון-חמישי: ${spaInfo.hours.weekdays}<br>שישי: ${spaInfo.hours.friday}`;
    }
  },
  date: {
    patterns: [/(מה התאריך|איזה תאריך|תאריך היום|איזה יום היום|יום בשבוע|מה היום|איזה יום|היום יום מה)/i],
    response: () => {
      const now = new Date();
      const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
      const dayName = days[now.getDay()];
      const dateStr = now.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
      const isOpen = now.getDay() !== 6;
      const statusText = isOpen ? '✅ אנחנו פתוחים היום!' : '🔴 היום שבת - אנחנו סגורים';
      return `📅 היום יום <strong>${dayName}</strong>, ${dateStr}<br><br>${statusText}`;
    }
  },
  howAreYou: {
    patterns: [/(מה העניינים|איך אתה|איך את|מה המצב|הכל טוב|מה איתך|מה שלומך|איך הולך|נו מה)/i],
    response: () => `הכל מעולה, תודה ששאלת! 😊<br><br>אני כאן כדי לעזור לך למצוא את העיסוי המושלם ב<strong>סאנרייז ספא</strong>.<br><br>איך אני יכול לעזור לך היום?`
  },
  whatIsThis: {
    patterns: [/(מה אתה|מי אתה|אתה בוט|אתה רובוט|צאטבוט|צ'אטבוט|בינה מלאכותית|אתה אמיתי|אתה בן אדם|אתה מחשב|AI|אתה אדם)/i],
    response: () => `🤖 אני העוזר הוירטואלי של <strong>סאנרייז ספא</strong>!<br><br>אני יכול לעזור לך עם:<br>• מידע על שעות פעילות ומיקום<br>• פרטים על סוגי העיסויים<br>• מחירון<br>• הזמנת תור<br>• ועוד!<br><br>פשוט שאל אותי מה שתרצה 😊`
  },
  // חדרים פרטיים
  privateRoom: {
    patterns: [/(חדר פרטי|חדרים פרטיים|פרטיות|אינטימי|חדר נפרד|יש פרטיות)/i],
    response: () => `✅ <strong>כן, יש לנו חדרים פרטיים!</strong><br><br>🚪 כל הטיפולים מתבצעים בחדרים פרטיים ואינטימיים.<br>👫 לעיסוי זוגי - חדר מרווח ומיוחד לשני אנשים.<br><br>💆 אצלנו תוכלו ליהנות מפרטיות מלאה ואווירה מרגיעה.<br><br>📞 להזמנת תור: <a href="tel:0586588751" style="color: #667eea; font-weight: bold;">${spaInfo.phone}</a>`
  },
  // עזרה / מה אפשר לשאול
  help: {
    patterns: [/(עזרה|עזור|help|מה אפשר|מה אתה יכול|תפריט|אפשרויות שלך|מה יש לך)/i],
    response: () => `📋 <strong>איך אני יכול לעזור?</strong><br><br>אפשר לשאול אותי על:<br>• ⏰ שעות פעילות<br>• 💰 מחירים<br>• 💆 סוגי עיסויים (תאילנדי, שוודי, רקמות עמוק, רגליים, זוגי)<br>• 📍 כתובת וניווט<br>• 📅 הזמנת תור<br>• 📞 טלפון<br>• 💳 אמצעי תשלום<br>• 🗓️ ביטולים ושינויים<br>• ⏱️ משך טיפולים<br>• 🤔 המלצה לעיסוי<br>• 🎁 שוברי מתנה<br>• 🚗 חניה<br>• 🚪 חדרים פרטיים<br>• 📱 רשתות חברתיות<br>• 🕐 מה השעה / איזה יום<br><br>פשוט שאלו! 😊`
  },
  // תלונות
  complaint: {
    patterns: [/(תלונה|להתלונן|לא מרוצה|בעיה|תקלה|שירות גרוע|רוצה לדבר עם מנהל|מנהל)/i],
    response: () => `📞 <strong>שירות לקוחות:</strong><br><br>חשוב לנו שתהיו מרוצים!<br>אם יש בעיה כלשהי, אנא צרו קשר ישירות:<br><br>📞 <a href="tel:0586588751" style="color: #667eea; font-weight: bold;">${spaInfo.phone}</a><br>💬 <a href="${spaInfo.whatsapp}" target="_blank" style="color: #128C7E; font-weight: bold;">וואטסאפ</a><br><br>נטפל בכל פנייה במהירות וברצינות 🙏`
  }
};

// פונקציה לזיהוי כוונת המשתמש
function detectIntent(userInput) {
  const input = userInput.toLowerCase().trim();

  for (const [intentName, intent] of Object.entries(intentPatterns)) {
    for (const pattern of intent.patterns) {
      if (pattern.test(input)) {
        return intent.response();
      }
    }
  }

  return null;
}

// תשובת ברירת מחדל חכמה
function getSmartDefaultResponse(userInput) {
  const responses = [
    `אני מבין שאתה שואל על "${userInput}".<br><br>אני יכול לעזור לך עם:<br>• שעות פעילות ומיקום<br>• מחירון וסוגי עיסויים<br>• הזמנת תור<br><br>נסה לשאול שאלה ספציפית יותר, או <a href="${spaInfo.whatsapp}" target="_blank" style="color: #128C7E; font-weight: bold;">שלח לנו הודעה בוואטסאפ</a> ונשמח לעזור! 😊`,
    `לא הצלחתי להבין בדיוק מה אתה מחפש 🤔<br><br>הנה כמה דברים שאני יכול לעזור בהם:<br>• "מה השעות?" - שעות פעילות<br>• "כמה עולה?" - מחירון<br>• "איפה אתם?" - כתובת וניווט<br>• "איזה עיסויים יש?" - סוגי טיפולים<br><br>או פשוט התקשרו: <a href="tel:0586588751" style="color: #667eea; font-weight: bold;">${spaInfo.phone}</a>`
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// פתיחה/סגירה של הצ'אט (toggle - לחיצה שנייה סוגרת)
if (chatbotBtn && chatbotContainer) {
  chatbotBtn.addEventListener("click", () => {
    chatbotContainer.classList.toggle("active");
  });
}

if (chatbotClose && chatbotContainer) {
  chatbotClose.addEventListener("click", () => {
    chatbotContainer.classList.remove("active");
  });
}

// סגירה בלחיצה על ESC
if (chatbotContainer) {
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && chatbotContainer.classList.contains("active")) {
      chatbotContainer.classList.remove("active");
    }
  });
}

// סגירה בלחיצה מחוץ לחלון הצ'אט
document.addEventListener("click", (e) => {
  if (chatbotContainer && chatbotContainer.classList.contains("active")) {
    if (!chatbotContainer.contains(e.target) && !chatbotBtn.contains(e.target)) {
      chatbotContainer.classList.remove("active");
    }
  }
});

// הוספת הודעה לצ'אט
function addMessage(text, sender) {
  if (!chatbotMessages) return;

  const messageDiv = document.createElement("div");
  messageDiv.className = sender === "user" ? "user-message" : "bot-message";

  const avatar = document.createElement("div");
  avatar.className = "message-avatar";
  avatar.innerHTML =
    sender === "user"
      ? '<i class="fa-solid fa-user"></i>'
      : '<i class="fa-solid fa-spa"></i>';

  const content = document.createElement("div");
  content.className = "message-content";
  content.innerHTML = text;

  messageDiv.appendChild(avatar);
  messageDiv.appendChild(content);

  chatbotMessages.appendChild(messageDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// הצגת אינדיקטור הקלדה
function showTypingIndicator() {
  if (!chatbotMessages) return;

  const typingDiv = document.createElement("div");
  typingDiv.className = "bot-message typing-message";
  typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fa-solid fa-spa"></i>
        </div>
        <div class="message-content typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
  chatbotMessages.appendChild(typingDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// הסרת אינדיקטור הקלדה
function hideTypingIndicator() {
  if (!chatbotMessages) return;

  const typingMsg = chatbotMessages.querySelector(".typing-message");
  if (typingMsg) {
    typingMsg.remove();
  }
}

// שליחת הודעה חופשית
const chatbotInput = document.getElementById("chatbotInput");
const chatbotSend = document.getElementById("chatbotSend");

function handleUserMessage() {
  const userMessage = chatbotInput.value.trim();

  if (userMessage === "") return;

  // הצג את הודעת המשתמש
  addMessage(userMessage, "user");

  // נקה את שדה הקלט
  chatbotInput.value = "";

  // זיהוי כוונה
  const response = detectIntent(userMessage);

  showTypingIndicator();

  setTimeout(() => {
    hideTypingIndicator();

    if (response) {
      addMessage(response, "bot");
    } else {
      addMessage(getSmartDefaultResponse(userMessage), "bot");
    }
  }, 800 + Math.random() * 700);
}

// בדיקה אם קלט הצ'אטבוט קיים לפני הוספת listeners
if (chatbotSend && chatbotInput) {
  chatbotSend.addEventListener("click", handleUserMessage);

  chatbotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleUserMessage();
    }
  });
}

// ===== יצירת ARIA live region גלובלי =====
if (!document.getElementById('globalAnnouncer')) {
  const globalAnnouncer = document.createElement('div');
  globalAnnouncer.id = 'globalAnnouncer';
  globalAnnouncer.className = 'sr-only';
  globalAnnouncer.setAttribute('role', 'status');
  globalAnnouncer.setAttribute('aria-live', 'polite');
  globalAnnouncer.setAttribute('aria-atomic', 'true');
  document.body.appendChild(globalAnnouncer);
}

// פונקציה גלובלית להכרזות
function announceToScreenReader(message) {
  const announcer = document.getElementById('globalAnnouncer') || document.getElementById('srAnnouncer');
  if (announcer) {
    announcer.textContent = '';
    setTimeout(() => {
      announcer.textContent = message;
    }, 50);
  }
}

// ===== ניווט מקלדת לכרטיסי מחירים ואלמנטים אינטראקטיביים =====
document.addEventListener('DOMContentLoaded', () => {
  // .price-item עצמו אינו פוקוסבילי - כפתור ה"הזמן תור" הפנימי (<a>) הוא
  // האלמנט האינטראקטיבי וכבר נכנס ל-Tab order טבעית. ניווט החצים בין
  // כפתורי הזמנה מטופל כעת על ידי AccessibilityManager (במצב "ניווט מקלדת
  // מלא") שעובר לפי סדר ויזואלי, כך ש-ArrowDown על הכפתור האחרון במחירון
  // ממשיך אוטומטית לאלמנט הבא בעמוד (כפתור ה-CTA או ההמלצות).

  // נשאיר אריאה-לייבל אינפורמטיבי לקוראי מסך על שורת המחיר עצמה
  const priceItems = document.querySelectorAll('.price-item');
  priceItems.forEach((item) => {
    const time = item.querySelector('.price-time');
    const amount = item.querySelector('.price-amount');
    if (time && amount) {
      item.setAttribute('aria-label', `${time.textContent}: ${amount.textContent}`);
    }
    item.setAttribute('role', 'listitem');
  });

  // הוספת tabindex לתיבות תוכן
  const contentBoxes = document.querySelectorAll('.content-box');
  contentBoxes.forEach((box) => {
    box.setAttribute('tabindex', '0');
    const heading = box.querySelector('h2, h3');
    if (heading) {
      box.setAttribute('aria-label', heading.textContent);
    }
  });

  // הוספת tabindex וניווט לשאלות FAQ
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach((question) => {
    if (!question.hasAttribute('tabindex')) {
      question.setAttribute('tabindex', '0');
    }

    // ניווט בחצים בין שאלות FAQ - ללא לולאה
    question.addEventListener('keydown', (e) => {
      const questions = Array.from(document.querySelectorAll('.faq-question'));
      const currentIndex = questions.indexOf(question);

      switch(e.key) {
        case 'ArrowDown':
        case 'ArrowLeft': // RTL support
          // אם זו השאלה האחרונה - אל תעשה כלום
          if (currentIndex < questions.length - 1) {
            e.preventDefault();
            e.stopPropagation();
            questions[currentIndex + 1].focus();
          }
          break;
        case 'ArrowUp':
        case 'ArrowRight': // RTL support
          // אם זו השאלה הראשונה - אל תעשה כלום
          if (currentIndex > 0) {
            e.preventDefault();
            e.stopPropagation();
            questions[currentIndex - 1].focus();
          }
          break;
      }
    });
  });

  // הוספת tabindex וניווט לשורות טבלה
  const tableRows = document.querySelectorAll('table tbody tr');
  tableRows.forEach((row) => {
    row.setAttribute('tabindex', '0');
    row.setAttribute('role', 'row');

    // ניווט בחצים בין שורות טבלה - ללא לולאה
    row.addEventListener('keydown', (e) => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));
      const currentIndex = rows.indexOf(row);

      switch(e.key) {
        case 'ArrowDown':
          // אם זו השורה האחרונה - אל תעשה כלום
          if (currentIndex < rows.length - 1) {
            e.preventDefault();
            e.stopPropagation();
            rows[currentIndex + 1].focus();
          }
          break;
        case 'ArrowUp':
          // אם זו השורה הראשונה - אל תעשה כלום
          if (currentIndex > 0) {
            e.preventDefault();
            e.stopPropagation();
            rows[currentIndex - 1].focus();
          }
          break;
      }
    });
  });

  // הסתר את תמונות ה-slider ואינדיקטורים מניווט מקלדת
  // כפתורי החצים נגישים בסדר Tab רגיל - Enter מפעיל אותם
  const sliderImages = document.querySelectorAll('.slider-track img');
  sliderImages.forEach((img) => {
    img.setAttribute('tabindex', '-1');
  });

  const sliderIndicators = document.querySelectorAll('.slider-indicators button, .slider-indicators span');
  sliderIndicators.forEach((indicator) => {
    indicator.setAttribute('tabindex', '-1');
  });

  // הערה: ניווט מקלדת לקישורי ניווט ורשתות חברתיות מטופל ב-AccessibilityManager
  // כאשר מופעל "ניווט מקלדת מלא" כדי למנוע כפילויות
});

// ===== קיצורי מקלדת גלובליים =====
document.addEventListener("keydown", (e) => {
  // בדיקה שלא נמצאים בשדה טקסט
  const activeElement = document.activeElement;
  const isInInput =
    activeElement.tagName === "INPUT" ||
    activeElement.tagName === "TEXTAREA" ||
    activeElement.isContentEditable;

  if (isInInput) return;

  // Alt + מקש לניווט מהיר.
  // משתמשים גם ב-e.key וגם ב-e.code כדי שהקיצורים יעבדו ללא תלות בפריסת
  // המקלדת (עברית, אנגלית, macOS Option, וכו'). e.code נותן את המקש הפיזי
  // (KeyW, Digit1) בעוד e.key נותן את התו המוצג (שמשתנה לפי layout).
  if (e.altKey) {
    const code = e.code;
    const key = (e.key || "").toLowerCase();

    if (code === "Digit1" || key === "1") {
      e.preventDefault();
      window.location.href = "index.html";
    } else if (code === "Digit2" || key === "2") {
      e.preventDefault();
      window.location.href = "gallery.html";
    } else if (code === "Digit3" || key === "3") {
      e.preventDefault();
      window.location.href = "blog.html";
    } else if (code === "Digit4" || key === "4") {
      e.preventDefault();
      window.location.href = "faq.html";
    } else if (code === "Digit5" || key === "5") {
      e.preventDefault();
      window.location.href = "privacy.html";
    } else if (code === "Digit6" || key === "6") {
      e.preventDefault();
      window.location.href = "terms.html";
    } else if (code === "Digit7" || key === "7") {
      e.preventDefault();
      window.location.href = "accessibility-statement.html";
    } else if (code === "KeyW" || key === "w") {
      // Alt+W — כפתור הוואטסאפ הצף
      e.preventDefault();
      const wa = document.querySelector(".whatsapp-float");
      if (wa) wa.focus();
      window.open(spaInfo.whatsappBooking, "_blank");
      announceToScreenReader("נפתח וואטסאפ ליצירת קשר");
    } else if (code === "KeyA" || key === "a") {
      // Alt+A — כפתור תפריט הנגישות הצף (טוגל פתח/סגור)
      e.preventDefault();
      const accessibilityBtn = document.getElementById("accessibilityBtn");
      const panel = document.getElementById("accessibilityPanel");
      if (accessibilityBtn) {
        accessibilityBtn.focus();
        accessibilityBtn.click();
        const isOpen = panel && panel.classList.contains("active");
        announceToScreenReader(isOpen ? "נפתח תפריט הנגישות" : "נסגר תפריט הנגישות");
      }
    } else if (code === "KeyC" || key === "c") {
      // Alt+C — כפתור הצ'אטבוט הצף (טוגל פתח/סגור)
      e.preventDefault();
      const chatBtn = document.getElementById("chatbotBtn");
      const container = document.getElementById("chatbotContainer");
      if (chatBtn) {
        chatBtn.focus();
        chatBtn.click();
        const isOpen = container && container.classList.contains("active");
        announceToScreenReader(isOpen ? "נפתח צ'אטבוט" : "נסגר צ'אטבוט");
      }
    } else if (code === "KeyT" || key === "t") {
      // Alt+T — כפתור "חזרה למעלה" הצף (גלילה לראש העמוד)
      e.preventDefault();
      const back = document.getElementById("backToTop");
      if (back && back.classList.contains("show")) {
        back.focus();
        back.click();
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      announceToScreenReader("גלילה לראש העמוד");
    } else if (code === "KeyB" || key === "b") {
      // Alt+B — גלילה לתחתית העמוד
      e.preventDefault();
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
      announceToScreenReader("גלילה לתחתית העמוד");
    }
  }

  // Escape - סגירת חלונות פתוחים
  if (e.key === "Escape") {
    // סגירת תפריט נגישות
    const accessibilityPanel = document.getElementById("accessibilityPanel");
    if (accessibilityPanel && accessibilityPanel.classList.contains("active")) {
      accessibilityPanel.classList.remove("active");
    }
    // סגירת צ'אטבוט
    if (chatbotContainer && chatbotContainer.classList.contains("active")) {
      chatbotContainer.classList.remove("active");
    }
  }

  // ? או / להצגת קיצורי מקלדת (יפתח את הצהרת הנגישות)
  if (e.key === "?" || (e.shiftKey && e.key === "/")) {
    e.preventDefault();
    window.location.href = "accessibility-statement.html#keyboard-shortcuts";
  }
});
