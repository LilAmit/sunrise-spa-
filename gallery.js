// סאנרייז ספא - גלריה - קובץ JavaScript

// יצירת כוכבים
const starsContainer = document.getElementById("stars");
for (let i = 0; i < 100; i++) {
  const star = document.createElement("div");
  star.className = "star";
  star.style.left = Math.random() * 100 + "%";
  star.style.top = Math.random() * 100 + "%";
  star.style.animationDelay = Math.random() * 3 + "s";
  starsContainer.appendChild(star);
}

// ========================
// Lightbox (תצוגת תמונות)
// ========================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxVideo = document.getElementById("lightbox-video");
const lightboxCaption = document.getElementById("lightbox-caption");
const closeBtn = document.getElementById("close-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

let currentIndex = 0;

// פתיחת Lightbox עבור כל פריט בגלריה
if (galleryItems && galleryItems.length > 0) {
  galleryItems.forEach((item, index) => {
    // הוספת tabindex לתמיכה בניווט מקלדת
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.setAttribute("aria-label", `פתח תמונה ${index + 1}`);

    // לחיצה בעכבר
    item.addEventListener("click", () => {
      currentIndex = index;
      openLightbox(item);
    });

    // לחיצה במקלדת (Enter או Space)
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        currentIndex = index;
        openLightbox(item);
      }
    });
  });
}

// פונקציה לפתיחת Lightbox
function openLightbox(item) {
  if (!lightbox || !item) return;

  const type = item.dataset.type;
  lightbox.style.display = "flex";

  setTimeout(() => {
    lightbox.classList.add("show");
  }, 10);

  if (type === "image") {
    const img = item.querySelector("img");
    if (img && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.style.display = "block";
    }
    if (lightboxVideo) {
      lightboxVideo.style.display = "none";
      lightboxVideo.pause();
    }
  } else if (type === "video") {
    const video = item.querySelector("video");
    if (video && lightboxVideo) {
      lightboxVideo.src = video.src;
      lightboxVideo.style.display = "block";
      lightboxVideo.play();
    }
    if (lightboxImg) {
      lightboxImg.style.display = "none";
    }
  }

  if (lightboxCaption) {
    const mediaElement = item.querySelector("img, video");
    lightboxCaption.textContent = mediaElement ? mediaElement.alt || "" : "";
  }
}

// פונקציה לסגירת Lightbox
function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove("show");
  if (lightboxVideo) {
    lightboxVideo.pause();
  }

  setTimeout(() => {
    lightbox.style.display = "none";
    if (lightboxImg) lightboxImg.src = "";
    if (lightboxVideo) lightboxVideo.src = "";
    // החזר פוקוס לתמונה שנפתחה
    if (galleryItems[currentIndex]) {
      galleryItems[currentIndex].focus();
    }
  }, 400);
}

// כפתור סגירה
if (closeBtn) {
  closeBtn.addEventListener("click", closeLightbox);
}

// סגירה בלחיצה על הרקע
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
}

// כפתור תמונה קודמת
if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    currentIndex =
      (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(galleryItems[currentIndex]);
  });
}

// כפתור תמונה הבאה
if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(galleryItems[currentIndex]);
  });
}

// תמיכה במקלדת - מותאם ל-RTL
document.addEventListener("keydown", (e) => {
  if (lightbox && lightbox.classList.contains("show")) {
    if (e.key === "Escape") closeLightbox();
    // ב-RTL: חץ ימינה = תמונה קודמת, חץ שמאלה = תמונה הבאה
    if (e.key === "ArrowRight" && prevBtn) prevBtn.click();
    if (e.key === "ArrowLeft" && nextBtn) nextBtn.click();
  }
});

// ========================
// כפתור חזרה למעלה
// ========================
const backToTopBtn = document.getElementById("backToTop");

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
      this.announce("קורא מסך הופעל. לחץ על כל טקסט כדי לשמוע אותו");
      this.enableScreenReaderListeners();
      document.body.classList.add("screen-reader-active");
    } else {
      this.announce("קורא מסך בוטל");
      this.disableScreenReaderListeners();
      document.body.classList.remove("screen-reader-active");
      this.stopSpeaking();
    }
  },

  enableScreenReaderListeners() {
    // הוסף מאזינים לכל האלמנטים הטקסטואליים
    this.screenReaderListener = (e) => {
      const target = e.target;
      let textToRead = "";

      if (target.tagName === "A") {
        textToRead = "קישור: " + target.innerText;
      } else if (target.tagName === "BUTTON") {
        textToRead = "כפתור: " + target.innerText;
      } else if (target.tagName.match(/^H[1-6]$/)) {
        textToRead = "כותרת: " + target.innerText;
      } else if (target.tagName === "IMG") {
        textToRead = "תמונה: " + (target.alt || "ללא תיאור");
      } else if (target.innerText && target.innerText.trim()) {
        textToRead = target.innerText.trim();
      }

      if (textToRead) {
        this.speak(textToRead);
      }
    };

    document.body.addEventListener("click", this.screenReaderListener);
  },

  disableScreenReaderListeners() {
    if (this.screenReaderListener) {
      document.body.removeEventListener("click", this.screenReaderListener);
    }
    if (this.screenReaderHoverListener) {
      document.body.removeEventListener(
        "mouseover",
        this.screenReaderHoverListener,
      );
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
      this.enableFullKeyboardNav();
      this.announce(
        "ניווט מקלדת מלא הופעל. השתמש בחיצי מקלדת, Tab, Home ו-End לניווט",
      );
    } else {
      this.disableFullKeyboardNav();
      this.announce("ניווט מקלדת מלא בוטל");
    }
  },

  enableFullKeyboardNav() {
    // הוסף tabindex לכל האלמנטים האינטראקטיביים
    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, [role="button"], .gallery-item, .content-box, .service-card',
    );

    interactiveElements.forEach((el) => {
      if (!el.hasAttribute("tabindex")) {
        el.setAttribute("tabindex", "0");
        el.setAttribute("data-keyboard-nav-added", "true");
      }
    });

    // הוסף מאזין לניווט בחיצים - מותאם ל-RTL
    this.keyboardNavHandler = (e) => {
      if (!document.body.classList.contains("keyboard-nav-active")) return;

      const focusableElements = this.getVisibleFocusableElements();
      const currentIndex = focusableElements.indexOf(document.activeElement);

      // בדיקה האם האתר הוא RTL (עברית)
      const isRTL =
        document.documentElement.dir === "rtl" ||
        document.documentElement.lang === "he" ||
        getComputedStyle(document.body).direction === "rtl";

      switch (e.key) {
        case "ArrowDown":
          // חץ למטה - גלילה למטה (התנהגות רגילה של הדפדפן)
          break;
        case "ArrowUp":
          // חץ למעלה - גלילה למעלה (התנהגות רגילה של הדפדפן)
          break;
        case "ArrowRight":
          e.preventDefault();
          // ב-RTL: חץ ימינה = אלמנט קודם, ב-LTR: חץ ימינה = אלמנט הבא
          if (isRTL) {
            this.focusPrevElement(focusableElements, currentIndex);
          } else {
            this.focusNextElement(focusableElements, currentIndex);
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          // ב-RTL: חץ שמאלה = אלמנט הבא, ב-LTR: חץ שמאלה = אלמנט קודם
          if (isRTL) {
            this.focusNextElement(focusableElements, currentIndex);
          } else {
            this.focusPrevElement(focusableElements, currentIndex);
          }
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
    // הסר tabindex מאלמנטים שהוספנו להם
    const addedElements = document.querySelectorAll(
      '[data-keyboard-nav-added="true"]',
    );
    addedElements.forEach((el) => {
      el.removeAttribute("tabindex");
      el.removeAttribute("data-keyboard-nav-added");
    });

    // הסר מאזין
    if (this.keyboardNavHandler) {
      document.removeEventListener("keydown", this.keyboardNavHandler);
    }
  },

  // פונקציה לקבלת אלמנטים גלויים בלבד
  getVisibleFocusableElements() {
    const allFocusable = document.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    // סנן רק אלמנטים שנראים על המסך
    return Array.from(allFocusable).filter((el) => {
      return (
        el.offsetParent !== null &&
        !el.closest('[style*="display: none"]') &&
        !el.closest('[style*="visibility: hidden"]') &&
        !el.closest(".hidden")
      );
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
        this.toggleFeature("high-contrast", btn),
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

    const isActive = document.body.classList.toggle(`${feature}-active`);
    btn.setAttribute("aria-pressed", isActive);
    this.announce(`${btn.textContent.trim()} ${isActive ? "הופעל" : "בוטל"}`);

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

            // הפעלת ניווט מקלדת מלא אם היה פעיל
            if (id === "keyboardNavBtn" && isActive) {
              this.enableFullKeyboardNav();
            }
          }
        });
      }

      // סנכרון מצב כפתורים לפי קלאסים של body (לתאימות אחורה)
      const classToButton = {
        "high-contrast-active": "highContrastYellowBtn",
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
    if (announcer) {
      announcer.textContent = message;
      setTimeout(() => (announcer.textContent = ""), 1000);
    }
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

// ===== צ'אטבוט =====
const chatbotBtn = document.getElementById("chatbotBtn");
const chatbotContainer = document.getElementById("chatbotContainer");
const chatbotClose = document.getElementById("chatbotClose");
const chatbotMessages = document.getElementById("chatbotMessages");
const quickBtns = document.querySelectorAll(".quick-btn");

// מאגר תשובות
const responses = {
  hours: {
    text: `שעות הפעילות שלנו:<br><br>
        📅 <strong>ראשון - חמישי:</strong> 10:00 - 22:00<br>
        📅 <strong>שישי:</strong> 09:00 - 16:00<br>
        📅 <strong>שבת:</strong> סגור<br><br>
        מומלץ לתאם תור מראש!`,
  },
  prices: {
    text: `המחירים שלנו:<br><br>
        <strong>💆 עיסוי גוף:</strong><br>
        • 45 דקות - ₪220<br>
        • 60 דקות - ₪270<br>
        • 90 דקות - ₪380<br><br>
        <strong>👫 עיסוי זוגי:</strong><br>
        • 60 דקות - ₪500<br>
        • 90 דקות - ₪700<br><br>
        <strong>🦶 עיסוי רגליים:</strong><br>
        • 30 דקות - ₪150<br>
        • 60 דקות - ₪240`,
  },
  location: {
    text: `אנחנו נמצאים ב:<br><br>
        📍 <strong>ההסתדרות 2, קומה 2</strong><br>
        🏙️ <strong>פתח תקווה</strong><br><br>
        ניתן להגיע אלינו בקלות באמצעות:<br><br>
        🚗 <a href="https://www.waze.com/live-map/directions/il/center-district/%D7%A4%D7%AA/sunrise-spa-%D7%A1%D7%A4%D7%90-%D7%A2%D7%99%D7%A1%D7%95%D7%99-%D7%A4%D7%AA%D7%97-%D7%AA%D7%A7%D7%95%D7%95%D7%94?navigate=yes&to=place.ChIJSZXBMVY3HRURy-oaXLqTcrg" target="_blank" style="color: #1565C0; font-weight: bold; text-decoration: underline;">ניווט בוויז</a><br><br>
        🗺️ <a href="https://www.google.com/maps/dir//Sunrise+Spa" target="_blank" style="color: #1565C0; font-weight: bold; text-decoration: underline;">ניווט בגוגל מפות</a>`,
  },
  services: {
    text: `אנחנו מציעים:<br><br>
        ✨ <strong>עיסוי תאילנדי</strong> - עיסוי מסורתי עם מתיחות<br>
        ✨ <strong>עיסוי שוודי</strong> - עיסוי מרגיע <br>
        ✨ <strong>עיסוי רקמות עמוק</strong> - לשחרור מתחים<br>
        ✨ <strong>עיסוי רגליים</strong> - רפלקסולוגיה<br>
        ✨ <strong>עיסוי זוגי</strong> - חוויה משותפת<br><br>
        כל העיסויים מבוצעים על ידי מעסים מקצועיים ומוסמכים.`,
  },
  booking: {
    text: `📞 <strong>להזמנת תור:</strong><br><br>
        ניתן להזמין תור בקלות באחת מהדרכים הבאות:<br><br>
        💬 <a href="https://wa.me/972586588751" target="_blank" style="color: #128C7E; font-weight: bold; text-decoration: underline;">שליחת הודעה בוואטסאפ</a><br>
        📱 <strong>058-658-8751</strong><br><br>
        📞 <a href="tel:0586588751" style="color: #667eea; font-weight: bold; text-decoration: underline;">התקשרות ישירה - 058-658-8751</a><br><br>
        💡 מומלץ להזמין מראש!`,
  },
};

// פתיחה/סגירה של הצ'אט
chatbotBtn.addEventListener("click", () => {
  chatbotContainer.classList.add("active");
});

chatbotClose.addEventListener("click", () => {
  chatbotContainer.classList.remove("active");
});

// סגירה בלחיצה על ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && chatbotContainer.classList.contains("active")) {
    chatbotContainer.classList.remove("active");
  }
});

// הוספת הודעה לצ'אט
function addMessage(text, sender) {
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
  const typingMsg = chatbotMessages.querySelector(".typing-message");
  if (typingMsg) {
    typingMsg.remove();
  }
}

// הוספת כל הכפתורים הראשיים
function addAllQuestions() {
  const quickDiv = document.createElement("div");
  quickDiv.className = "quick-questions";
  quickDiv.style.marginTop = "10px";

  const allQuestions = [
    { id: "hours", label: "🕐 שעות פעילות" },
    { id: "prices", label: "💰 מחירון" },
    { id: "location", label: "📍 איפה אתם נמצאים?" },
    { id: "services", label: "💆 אילו עיסויים יש?" },
    { id: "booking", label: "📅 איך מזמינים תור?" },
  ];

  allQuestions.forEach((q) => {
    const btn = document.createElement("button");
    btn.className = "quick-btn";
    btn.textContent = q.label;
    btn.onclick = () => handleQuickQuestion(q.id);
    quickDiv.appendChild(btn);
  });

  chatbotMessages.appendChild(quickDiv);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// טיפול בשאלה מהירה
function handleQuickQuestion(question) {
  const labels = {
    hours: "שעות פעילות",
    prices: "מחירון",
    location: "איפה אתם נמצאים?",
    services: "אילו עיסויים יש?",
    booking: "איך מזמינים תור?",
  };

  addMessage(labels[question], "user");
  showTypingIndicator();

  setTimeout(() => {
    hideTypingIndicator();
    const response = responses[question];
    addMessage(response.text, "bot");

    // תמיד להציג את כל השאלות אחרי התשובה
    addAllQuestions();
  }, 1000);
}

// כפתורים מהירים ראשוניים
quickBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const question = btn.dataset.question;
    handleQuickQuestion(question);
  });
});
