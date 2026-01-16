// אפקט Fade-in
const faders = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
faders.forEach(f => observer.observe(f));

// Lazy Loading לתמונות
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.remove('lazy-img');
            imageObserver.unobserve(img);
        }
    });
}, {
    rootMargin: '50px' // טען את התמונות 50px לפני שהן נראות
});

lazyImages.forEach(img => imageObserver.observe(img));

// סליידר
const track = document.getElementById('sliderTrack');
const indicatorsContainer = document.getElementById('indicators');

// בדיקה אם האלמנטים קיימים (הסליידר לא קיים בכל הדפים)
if (track && indicatorsContainer) {
    let currentSlide = 0;
    const totalSlides = track.children.length;
    let autoSlideInterval;
    let touchStartX = 0;
    let touchEndX = 0;

    function createIndicators() {
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'indicator';
            if (i === 0) indicator.classList.add('active');
            indicator.onclick = () => goToSlide(i);
            indicatorsContainer.appendChild(indicator);
        }
    }

    function updateSlider() {
        const sliderWidth = document.querySelector('.side-slider').offsetWidth;
        const offset = currentSlide * -sliderWidth;
        track.style.transform = `translateX(${offset}px)`;

        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((ind, i) => {
            ind.classList.toggle('active', i === currentSlide);
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
    autoSlideInterval = setInterval(nextSlide, 4000);

    const slider = document.querySelector('.side-slider');
    slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
    slider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 4000);
    });

    // תמיכה ב-Touch
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoSlideInterval);
    });

    slider.addEventListener('touchend', (e) => {
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

    window.addEventListener('resize', updateSlider);
} // סיום if של הסליידר

// סטטוס פתוח/סגור
function updateStatus() {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    const statusDiv = document.getElementById('statusIndicator');

    // בדיקה אם האלמנט קיים (הוא קיים רק בדף הבית)
    if (!statusDiv) {
        return; // אם האלמנט לא קיים, צא מהפונקציה
    }

    let isOpen = false;

    if (day === 6) {
        isOpen = false;
    } else if (day >= 0 && day <= 4) {
        const openTime = 10 * 60;
        const closeTime = 22 * 60;
        isOpen = timeInMinutes >= openTime && timeInMinutes < closeTime;
    } else if (day === 5) {
        const openTime = 9 * 60;
        const closeTime = 16 * 60;
        isOpen = timeInMinutes >= openTime && timeInMinutes < closeTime;
    }

    if (isOpen) {
        statusDiv.innerHTML = '<span class="status-badge status-open">🟢 פתוח עכשיו</span>';
    } else {
        statusDiv.innerHTML = '<span class="status-badge status-closed">🔴 סגור כעת</span>';
    }
}

updateStatus();
setInterval(updateStatus, 60000);

// כפתור חזרה למעלה
const backToTopBtn = document.getElementById('backToTop');

// בדיקה אם הכפתור קיים לפני הוספת event listeners
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================
// מערכת נגישות - תקן ישראלי 5568
// ========================
const AccessibilityManager = {
    panel: document.getElementById('accessibilityPanel'),
    trigger: document.getElementById('accessibilityTrigger') || document.getElementById('accessibilityBtn'),
    closeBtn: document.getElementById('closePanel') || document.getElementById('accessibilityClose'),
    resetBtn: document.getElementById('resetAccessibility') || document.getElementById('resetAccessibilityBtn'),
    actions: document.querySelectorAll('.accessibility-action'),
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
            this.trigger.addEventListener('click', () => this.togglePanel());
        }
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.closePanel());
        }
        
        // סגירה ב-ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel && this.panel.classList.contains('active')) {
                this.closePanel();
            }
        });
        
        // כפתורי פעולה
        if (this.actions) {
            this.actions.forEach(btn => {
                btn.addEventListener('click', () => this.handleAction(btn));
            });
        }

        // איפוס
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetAll());
        }

        // סגירה בלחיצה מחוץ לפאנל
        document.addEventListener('click', (e) => {
            if (this.panel && this.panel.classList.contains('active') &&
                !this.panel.contains(e.target) &&
                this.trigger && !this.trigger.contains(e.target)) {
                this.closePanel();
            }
        });
    },
    
    togglePanel() {
        if (!this.panel) return;
        const isOpen = this.panel.classList.toggle('active');
        if (this.trigger) {
            this.trigger.setAttribute('aria-expanded', isOpen);
        }
        this.announce(isOpen ? 'תפריט נגישות נפתח' : 'תפריט נגישות נסגר');
        
        if (isOpen) {
            this.actions[0]?.focus();
        }
    },
    
    closePanel() {
        if (!this.panel) return;
        this.panel.classList.remove('active');
        if (this.trigger) {
            this.trigger.setAttribute('aria-expanded', 'false');
            this.trigger.focus();
        }
    },
    
    // ===== קורא מסך (Screen Reader) =====
    initScreenReader() {
        if ('speechSynthesis' in window) {
            this.synth = window.speechSynthesis;
            this.setupHebrewVoice();
        }
    },

    setupHebrewVoice() {
        // המתן לטעינת הקולות
        const loadVoices = () => {
            const voices = this.synth.getVoices();
            // חיפוש קול עברי
            this.hebrewVoice = voices.find(voice =>
                voice.lang.includes('he') ||
                voice.lang.includes('iw') ||
                voice.name.includes('Hebrew')
            );
            // אם אין קול עברי, השתמש בקול ברירת מחדל
            if (!this.hebrewVoice && voices.length > 0) {
                this.hebrewVoice = voices[0];
            }
        };

        if (this.synth.getVoices().length > 0) {
            loadVoices();
        } else {
            this.synth.addEventListener('voiceschanged', loadVoices);
        }
    },

    toggleScreenReader(btn) {
        this.screenReaderActive = !this.screenReaderActive;
        btn.setAttribute('aria-pressed', this.screenReaderActive);

        if (this.screenReaderActive) {
            this.announce('קורא מסך הופעל. לחץ על כל טקסט כדי לשמוע אותו');
            this.enableScreenReaderListeners();
            document.body.classList.add('screen-reader-active');
        } else {
            this.announce('קורא מסך בוטל');
            this.disableScreenReaderListeners();
            document.body.classList.remove('screen-reader-active');
            this.stopSpeaking();
        }
    },

    enableScreenReaderListeners() {
        // הוסף מאזינים לכל האלמנטים הטקסטואליים
        this.screenReaderListener = (e) => {
            const target = e.target;
            let textToRead = '';

            if (target.tagName === 'A') {
                textToRead = 'קישור: ' + target.innerText;
            } else if (target.tagName === 'BUTTON') {
                textToRead = 'כפתור: ' + target.innerText;
            } else if (target.tagName.match(/^H[1-6]$/)) {
                textToRead = 'כותרת: ' + target.innerText;
            } else if (target.tagName === 'IMG') {
                textToRead = 'תמונה: ' + (target.alt || 'ללא תיאור');
            } else if (target.innerText && target.innerText.trim()) {
                textToRead = target.innerText.trim();
            }

            if (textToRead) {
                this.speak(textToRead);
            }
        };

        document.body.addEventListener('click', this.screenReaderListener);

        // קריאה אוטומטית בעת hover (אופציונלי)
        this.screenReaderHoverListener = (e) => {
            if (e.target.matches('a, button, h1, h2, h3, h4, h5, h6')) {
                clearTimeout(this.hoverTimeout);
                this.hoverTimeout = setTimeout(() => {
                    let text = e.target.innerText || e.target.alt || '';
                    if (text.trim()) {
                        this.speak(text.trim(), true); // קריאה שקטה יותר
                    }
                }, 1000); // המתן שנייה לפני הקריאה
            }
        };

        // הפעל את hover רק אם המשתמש רוצה
        // document.body.addEventListener('mouseover', this.screenReaderHoverListener);
    },

    disableScreenReaderListeners() {
        if (this.screenReaderListener) {
            document.body.removeEventListener('click', this.screenReaderListener);
        }
        if (this.screenReaderHoverListener) {
            document.body.removeEventListener('mouseover', this.screenReaderHoverListener);
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

        utterance.lang = 'he-IL';
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
        this.screenReaderSpeed = Math.max(0.5, Math.min(2, this.screenReaderSpeed + delta));
        this.announce(`מהירות קריאה: ${Math.round(this.screenReaderSpeed * 100)}%`);
    },

    // ===== מדריך קריאה (Reading Guide) =====
    initReadingGuide() {
        // יצירת מדריך הקריאה אם לא קיים
        if (!document.getElementById('readingGuide')) {
            const guide = document.createElement('div');
            guide.id = 'readingGuide';
            guide.className = 'reading-guide';
            guide.style.display = 'none';
            document.body.appendChild(guide);
        }
    },

    toggleReadingGuide(btn) {
        const guide = document.getElementById('readingGuide');
        this.readingGuideActive = !this.readingGuideActive;
        btn.setAttribute('aria-pressed', this.readingGuideActive);

        if (this.readingGuideActive) {
            guide.style.display = 'block';
            this.updateGuideHandler = (e) => {
                guide.style.top = e.clientY + 'px';
            };
            document.addEventListener('mousemove', this.updateGuideHandler);
            document.body.classList.add('reading-guide-active');
            this.announce('מדריך קריאה הופעל');
        } else {
            guide.style.display = 'none';
            if (this.updateGuideHandler) {
                document.removeEventListener('mousemove', this.updateGuideHandler);
            }
            document.body.classList.remove('reading-guide-active');
            this.announce('מדריך קריאה בוטל');
        }
    },

    // ===== התאמת מרווח שורות =====
    toggleLineHeight(btn) {
        const isActive = document.body.classList.toggle('line-height-active');
        btn.setAttribute('aria-pressed', isActive);

        if (isActive) {
            this.lineHeight = 2;
            document.body.style.setProperty('--line-height', '2');
        } else {
            this.lineHeight = 1.5;
            document.body.style.setProperty('--line-height', '1.5');
        }

        this.announce(isActive ? 'מרווח שורות הוגדל' : 'מרווח שורות אופס');
    },

    // ===== התאמת מרווח אותיות =====
    toggleLetterSpacing(btn) {
        const isActive = document.body.classList.toggle('letter-spacing-active');
        btn.setAttribute('aria-pressed', isActive);

        if (isActive) {
            this.letterSpacing = 2;
            document.body.style.setProperty('--letter-spacing', '2px');
        } else {
            this.letterSpacing = 0;
            document.body.style.setProperty('--letter-spacing', '0px');
        }

        this.announce(isActive ? 'מרווח אותיות הוגדל' : 'מרווח אותיות אופס');
    },

    // ===== גופן ידידותי לדיסלקציה =====
    toggleDyslexiaFont(btn) {
        const isActive = document.body.classList.toggle('dyslexia-font-active');
        btn.setAttribute('aria-pressed', isActive);
        this.announce(isActive ? 'גופן דיסלקציה הופעל' : 'גופן דיסלקציה בוטל');
    },

    // ===== התאמת סמן עכבר =====
    toggleBigCursor(btn) {
        const isActive = document.body.classList.toggle('big-cursor-active');
        btn.setAttribute('aria-pressed', isActive);
        this.announce(isActive ? 'סמן גדול הופעל' : 'סמן גדול בוטל');
    },

    toggleCursorColor(btn) {
        const isActive = document.body.classList.toggle('cursor-color-active');
        btn.setAttribute('aria-pressed', isActive);
        this.announce(isActive ? 'צבע סמן שונה' : 'צבע סמן אופס');
    },

    // ===== ניגודיות הפוכה =====
    toggleInvertColors(btn) {
        const isActive = document.body.classList.toggle('invert-colors-active');
        btn.setAttribute('aria-pressed', isActive);
        this.announce(isActive ? 'צבעים הפוכים הופעלו' : 'צבעים הפוכים בוטלו');
    },

    // ===== השבתת אנימציות =====
    toggleStopAnimations(btn) {
        const isActive = document.body.classList.toggle('stop-animations-active');
        btn.setAttribute('aria-pressed', isActive);
        this.announce(isActive ? 'אנימציות הושבתו' : 'אנימציות הופעלו');
    },

    // ===== מצב קריאה =====
    toggleReadingMode(btn) {
        const isActive = document.body.classList.toggle('reading-mode-active');
        btn.setAttribute('aria-pressed', isActive);
        this.announce(isActive ? 'מצב קריאה הופעל' : 'מצב קריאה בוטל');
    },

    // ===== היפוך כיוון טקסט =====
    toggleTextDirection(btn) {
        const currentDir = document.documentElement.getAttribute('dir') || 'rtl';
        const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        document.documentElement.setAttribute('dir', newDir);
        btn.setAttribute('aria-pressed', newDir === 'ltr');
        this.announce(`כיוון טקסט שונה ל-${newDir === 'rtl' ? 'ימין לשמאל' : 'שמאל לימין'}`);
    },

    // ===== אתחול כפתורי נגישות =====
    initAccessibilityButtons() {
        // הוסף מאזינים לכפתורי הנגישות החדשים
        const buttons = {
            'increaseFontBtn': () => this.changeTextSize(10),
            'decreaseFontBtn': () => this.changeTextSize(-10),
            'highContrastBtn': (btn) => this.toggleFeature('high-contrast', btn),
            'darkContrastBtn': (btn) => this.toggleFeature('dark-mode', btn),
            'highlightLinksBtn': (btn) => this.toggleFeature('highlight-links', btn),
            'textDirectionBtn': (btn) => this.toggleTextDirection(btn),
            'stopAnimationsBtn': (btn) => this.toggleStopAnimations(btn),
            'readableFontBtn': (btn) => this.toggleFeature('readable-font', btn),
            'readingModeBtn': (btn) => this.toggleReadingMode(btn),
            'screenReaderBtn': (btn) => this.toggleScreenReader(btn),
            'readerSpeedUpBtn': () => this.adjustReaderSpeed(0.25),
            'readerSpeedDownBtn': () => this.adjustReaderSpeed(-0.25),
            'lineHeightBtn': (btn) => this.toggleLineHeight(btn),
            'letterSpacingBtn': (btn) => this.toggleLetterSpacing(btn),
            'dyslexiaFontBtn': (btn) => this.toggleDyslexiaFont(btn),
            'bigCursorBtn': (btn) => this.toggleBigCursor(btn),
            'cursorColorBtn': (btn) => this.toggleCursorColor(btn),
            'invertColorsBtn': (btn) => this.toggleInvertColors(btn),
            'readingGuideBtn': (btn) => this.toggleReadingGuide(btn)
        };

        Object.entries(buttons).forEach(([id, handler]) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => {
                    handler(btn);
                    this.saveSettings();
                });
            }
        });
    },

    handleAction(btn) {
        const action = btn.dataset.action;
        
        switch(action) {
            case 'keyboard-nav':
                this.toggleFeature('keyboard-nav', btn);
                break;
            case 'skip-links':
                this.toggleSkipLinks(btn);
                break;
            case 'text-size-increase':
                this.changeTextSize(10);
                break;
            case 'text-size-decrease':
                this.changeTextSize(-10);
                break;
            case 'line-height':
                this.toggleFeature('line-height', btn);
                break;
            case 'letter-spacing':
                this.toggleFeature('letter-spacing', btn);
                break;
            case 'readable-font':
                this.toggleFeature('readable-font', btn);
                break;
            case 'high-contrast':
                this.toggleFeature('high-contrast', btn);
                break;
            case 'dark-mode':
                this.toggleFeature('dark-mode', btn);
                break;
            case 'light-background':
                this.toggleFeature('light-background', btn);
                break;
            case 'grayscale':
                this.toggleFeature('grayscale', btn);
                break;
            case 'highlight-links':
                this.toggleFeature('highlight-links', btn);
                break;
            case 'highlight-headings':
                this.toggleFeature('highlight-headings', btn);
                break;
            case 'focus-highlight':
                this.toggleFeature('focus-highlight', btn);
                break;
            case 'big-cursor':
                this.toggleFeature('big-cursor', btn);
                break;
            case 'reading-guide':
                this.toggleReadingGuide(btn);
                break;
        }
        
        this.saveSettings();
    },
    
    toggleFeature(feature, btn) {
        const isActive = document.body.classList.toggle(`${feature}-active`);
        btn.setAttribute('aria-pressed', isActive);
        this.announce(`${btn.textContent.trim()} ${isActive ? 'הופעל' : 'בוטל'}`);
    },
    
    changeTextSize(delta) {
        this.textSize = Math.max(80, Math.min(150, this.textSize + delta));
        document.documentElement.style.fontSize = this.textSize + '%';
        this.announce(`גודל טקסט שונה ל-${this.textSize}%`);
    },
    
    toggleSkipLinks(btn) {
        const skipLinks = document.getElementById('skipLinks');
        const isActive = skipLinks.style.display === 'block';
        
        if (isActive) {
            skipLinks.style.display = 'none';
            btn.setAttribute('aria-pressed', 'false');
            this.announce('קישורי דילוג בוטלו');
        } else {
            skipLinks.style.display = 'block';
            btn.setAttribute('aria-pressed', 'true');
            this.announce('קישורי דילוג הופעלו');
        }
    },
    
    toggleReadingGuide(btn) {
        const guide = document.getElementById('readingGuide');
        const isActive = guide.style.display === 'block';
        
        if (isActive) {
            guide.style.display = 'none';
            btn.setAttribute('aria-pressed', 'false');
            document.removeEventListener('mousemove', this.updateGuide);
            this.announce('מדריך קריאה בוטל');
        } else {
            guide.style.display = 'block';
            btn.setAttribute('aria-pressed', 'true');
            this.updateGuide = (e) => {
                guide.style.top = e.clientY + 'px';
            };
            document.addEventListener('mousemove', this.updateGuide);
            this.announce('מדריך קריאה הופעל');
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
        document.body.className = '';
        document.documentElement.style.fontSize = '';
        document.documentElement.setAttribute('dir', 'rtl'); // החזרת כיוון לעברית

        // איפוס משתנים
        this.textSize = 100;
        this.lineHeight = 1.5;
        this.letterSpacing = 0;
        this.cursorSize = 1;
        this.screenReaderSpeed = 1;
        this.readingGuideActive = false;

        // איפוס CSS variables
        document.body.style.removeProperty('--line-height');
        document.body.style.removeProperty('--letter-spacing');

        // איפוס כפתורים - כל הכפתורים בתפריט הנגישות
        const allButtons = document.querySelectorAll('.accessibility-panel button, .accessibility-btn');
        allButtons.forEach(btn => {
            btn.setAttribute('aria-pressed', 'false');
        });

        // איפוס אלמנטים
        const skipLinks = document.getElementById('skipLinks');
        const readingGuide = document.getElementById('readingGuide');

        if (skipLinks) skipLinks.style.display = 'none';
        if (readingGuide) {
            readingGuide.style.display = 'none';
            if (this.updateGuideHandler) {
                document.removeEventListener('mousemove', this.updateGuideHandler);
            }
        }

        localStorage.removeItem('accessibilitySettings');
        this.announce('כל הגדרות הנגישות אופסו');

        // אנימציה לכפתור איפוס
        if (this.resetBtn) {
            const originalHTML = this.resetBtn.innerHTML;
            this.resetBtn.innerHTML = '<i class="fa-solid fa-check"></i> אופס בהצלחה!';
            setTimeout(() => {
                this.resetBtn.innerHTML = originalHTML;
            }, 2000);
        }
    },
    
    saveSettings() {
        const settings = {
            classes: document.body.className,
            textSize: this.textSize,
            pressed: Array.from(this.actions).map(btn => ({
                action: btn.dataset.action,
                pressed: btn.getAttribute('aria-pressed')
            }))
        };
        localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    },
    
    loadSettings() {
        const saved = localStorage.getItem('accessibilitySettings');
        if (!saved) return;
        
        try {
            const settings = JSON.parse(saved);
            document.body.className = settings.classes || '';
            this.textSize = settings.textSize || 100;
            document.documentElement.style.fontSize = this.textSize + '%';
            
            settings.pressed?.forEach(item => {
                const btn = document.querySelector(`[data-action="${item.action}"]`);
                if (btn) btn.setAttribute('aria-pressed', item.pressed);
            });
        } catch(e) {
            console.error('Error loading accessibility settings:', e);
        }
    },
    
    announce(message) {
        const announcer = document.getElementById('srAnnouncer');
        announcer.textContent = message;
        setTimeout(() => announcer.textContent = '', 1000);
    },
    
    initKeyboardNav() {
        if (!this.panel) return;
        // ניווט במקלדת בתוך הפאנל
        this.panel.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                const focusable = this.panel.querySelectorAll('button:not([disabled])');
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
    }
};

// אתחול
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => AccessibilityManager.init());
} else {
    AccessibilityManager.init();
}


// ===== צ'אטבוט חכם =====
const chatbotBtn = document.getElementById('chatbotBtn');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const quickBtns = document.querySelectorAll('.quick-btn');

// מאגר תשובות מורחב
const responses = {
    hours: {
        text: `שעות הפעילות שלנו:<br><br>
        📅 <strong>ראשון - חמישי:</strong> 10:00 - 22:00<br>
        📅 <strong>שישי:</strong> 09:00 - 16:00<br>
        📅 <strong>שבת:</strong> סגור<br><br>
        מומלץ לתאם תור מראש!`,
        keywords: ['שעות', 'פעילות', 'פתוח', 'סגור', 'מתי', 'זמינות', 'לפתוח', 'עובד']
    },
    prices: {
        text: `המחירים שלנו:<br><br>
        <strong>💆 עיסוי גוף:</strong><br>
        • 45 דקות - ₪220<br>
        • 60 דקות - ₪270<br>
        • 75 דקות - ₪325<br>
        • 90 דקות - ₪380<br>
        • 120 דקות - ₪500<br><br>
        <strong>👫 עיסוי זוגי:</strong><br>
        • 60 דקות - ₪500<br>
        • 75 דקות - ₪600<br>
        • 90 דקות - ₪700<br>
        • 120 דקות - ₪850<br><br>
        <strong>🦶 עיסוי רגליים:</strong><br>
        • 30 דקות - ₪150<br>
        • 45 דקות - ₪200<br>
        • 60 דקות - ₪240`,
        keywords: ['מחיר', 'כמה', 'עולה', 'עלות', 'תשלום', 'לשלם', 'מחירון', 'כסף', '₪']
    },
    location: {
        text: `אנחנו נמצאים ב:<br><br>
        📍 <strong>ההסתדרות 2, קומה 2</strong><br>
        🏙️ <strong>פתח תקווה</strong><br><br>
        ניתן להגיע אלינו בקלות באמצעות:<br><br>
        🚗 <a href="https://www.waze.com/live-map/directions/il/center-district/%D7%A4%D7%AA/sunrise-spa-%D7%A1%D7%A4%D7%90-%D7%A2%D7%99%D7%A1%D7%95%D7%99-%D7%A4%D7%AA%D7%97-%D7%AA%D7%A7%D7%95%D7%95%D7%94?navigate=yes&to=place.ChIJSZXBMVY3HRURy-oaXLqTcrg" target="_blank" style="color: #1565C0; font-weight: bold; text-decoration: underline;">ניווט בוויז</a><br><br>
        🗺️ <a href="https://www.google.com/maps/dir//Sunrise+Spa" target="_blank" style="color: #1565C0; font-weight: bold; text-decoration: underline;">ניווט בגוגל מפות</a>`,
        keywords: ['איפה', 'כתובת', 'מיקום', 'נמצא', 'ממוקם', 'להגיע', 'וויז', 'waze', 'maps', 'הדרכה']
    },
    services: {
        text: `אנחנו מציעים:<br><br>
        ✨ <strong>עיסוי תאילנדי</strong> - עיסוי מסורתי עם מתיחות<br>
        ✨ <strong>עיסוי שוודי</strong> - עיסוי מרגיע ונעים<br>
        ✨ <strong>עיסוי רקמות עמוק</strong> - לשחרור מתחים<br>
        ✨ <strong>עיסוי רגליים</strong> - רפלקסולוגיה<br>
        ✨ <strong>עיסוי זוגי</strong> - חוויה משותפת<br><br>
        כל העיסויים מבוצעים על ידי מעסים מקצועיים ומוסמכים.`,
        keywords: ['עיסוי', 'טיפול', 'מסאז', 'סוגי', 'סוג', 'מציעים', 'יש', 'עושים', 'שירות']
    },
    booking: {
        text: `📞 <strong>להזמנת תור:</strong><br><br>
        ניתן להזמין תור בקלות באחת מהדרכים הבאות:<br><br>
        💬 <a href="https://wa.me/972586588751" target="_blank" style="color: #128C7E; font-weight: bold; text-decoration: underline;">שליחת הודעה בוואטסאפ</a><br>
        📱 <strong>058-658-8751</strong><br><br>
        📞 <a href="tel:0586588751" style="color: #667eea; font-weight: bold; text-decoration: underline;">התקשרות ישירה - 058-658-8751</a><br><br>
        💡 מומלץ להזמין מראש!`,
        keywords: ['להזמין', 'תור', 'הזמנה', 'לקבוע', 'לתאם', 'booking', 'זימון', 'איך']
    },
    parking: {
        text: `🚗 <strong>חניה:</strong><br><br>
        באזור יש מספר אפשרויות חניה:<br>
        • חניה בחינם ברחוב (כחול לבן)<br>
        • חניון ציבורי קרוב<br>
        • חניה בתשלום בסביבה<br><br>
        מומלץ להגיע 5-10 דקות מוקדם כדי למצוא חניה בנוחות 😊`,
        keywords: ['חניה', 'חונים', 'לחנות', 'parking', 'רכב', 'מכונית']
    },
    difference: {
        text: `<strong>ההבדלים בין סוגי העיסויים:</strong><br><br>
        🌿 <strong>עיסוי תאילנדי:</strong> מתיחות ולחיצות עמוקות, משפר גמישות<br><br>
        🧘 <strong>עיסוי שוודי:</strong> ליטופים רכים ומרגיעים, מושלם להרפיה<br><br>
        💪 <strong>עיסוי רקמות עמוק:</strong> אינטנסיבי, מתמקד בשרירים - לכאבים כרוניים<br><br>
        🦶 <strong>עיסוי רגליים:</strong> רפלקסולוגיה - לחיצה על נקודות בכפות הרגליים`,
        keywords: ['הבדל', 'ההבדל', 'שונה', 'תאילנדי', 'שוודי', 'רקמות', 'עמוק']
    },
    pregnant: {
        text: `🤰 <strong>עיסוי בהריון:</strong><br><br>
        כן, אבל יש כמה דברים חשובים:<br>
        ✓ רק לאחר החודש השלישי<br>
        ✓ חובה לעדכן את המעסה על ההריון<br>
        ✓ מומלץ להתייעץ עם הרופא לפני<br>
        ✓ נבצע עיסוי מותאם במיוחד<br><br>
        צרי קשר ונתאים לך טיפול מיוחד! 💕`,
        keywords: ['הריון', 'הרה', 'בהריון', 'בהרה', 'הריונית', 'הרות', 'pregnant']
    },
    cancellation: {
        text: `🗓️ <strong>מדיניות ביטולים:</strong><br><br>
        ✓ ביטול עד 24 שעות לפני - ללא עלות<br>
        ⚠️ ביטול פחות מ-24 שעות - חיוב חלקי<br>
        ❌ אי הגעה ללא הודעה - חיוב מלא<br><br>
        לביטול או שינוי, צור קשר בטלפון או WhatsApp.`,
        keywords: ['ביטול', 'לבטל', 'לשנות', 'שינוי', 'cancellation', 'cancel']
    },
    duration: {
        text: `⏱️ <strong>משך הטיפולים:</strong><br><br>
        אנו מציעים טיפולים במשכים שונים:<br>
        • עיסוי גוף: 45, 60, 75, 90 או 120 דקות<br>
        • עיסוי זוגי: 60, 75, 90 או 120 דקות<br>
        • עיסוי רגליים: 30, 45 או 60 דקות<br><br>
        💡 המשך המפורט מופיע במחירון!`,
        keywords: ['כמה זמן', 'משך', 'זמן', 'דקות', 'שעה', 'לוקח', 'אורך']
    },
    qualified: {
        text: `👨‍⚕️ <strong>מעסים מוסמכים:</strong><br><br>
        בהחלט! כל המעסים שלנו:<br>
        ✓ בעלי הסמכה מקצועית בעיסוי<br>
        ✓ ניסיון רב בתחום<br>
        ✓ עברו קורסים מוסמכים<br>
        ✓ עוברים השתלמויות שוטפות<br><br>
        אתם בידיים טובות! 😊`,
        keywords: ['מוסמך', 'הסמכה', 'מקצועי', 'ניסיון', 'qualified', 'רישיון']
    },
    payment: {
        text: `💳 <strong>אמצעי תשלום:</strong><br><br>
        אנו מקבלים:<br>
        • מזומן<br>
        • כרטיסי אשראי (ויזה, מאסטרקארד)<br>
        • העברה בנקאית (בתאום מראש)<br>
        • bit (בתאום מראש)<br><br>
        📄 חשבונית ניתנת עבור כל תשלום`,
        keywords: ['תשלום', 'לשלם', 'אשראי', 'מזומן', 'כרטיס', 'bit', 'העברה', 'payment']
    },
    couples: {
        text: `👫 <strong>עיסוי זוגי:</strong><br><br>
        חווית עיסוי מושלמת לזוגות!<br>
        • שני מעסים מקצועיים במקביל<br>
        • חדר מרווח ומיוחד<br>
        • אווירה רומנטית ומרגיעה<br><br>
        💕 <strong>מחירים מיוחדים:</strong><br>
        60 דק' - ₪500 | 90 דק' - ₪700<br><br>
        מושלם למתנה או לאירוע מיוחד!`,
        keywords: ['זוגי', 'זוג', 'זוגות', 'couple', 'לזוג', 'ביחד']
    }
};

// זיהוי מילות מפתח חכם
function findBestMatch(userInput) {
    const input = userInput.toLowerCase().trim();

    // בדיקה ישירה של מילים
    for (const [key, response] of Object.entries(responses)) {
        if (response.keywords) {
            for (const keyword of response.keywords) {
                if (input.includes(keyword.toLowerCase())) {
                    return key;
                }
            }
        }
    }

    return null;
}

// פתיחה/סגירה של הצ'אט - רק אם האלמנטים קיימים
if (chatbotBtn && chatbotContainer) {
    chatbotBtn.addEventListener('click', () => {
        chatbotContainer.classList.add('active');
    });
}

if (chatbotClose && chatbotContainer) {
    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });
}

// סגירה בלחיצה על ESC
if (chatbotContainer) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatbotContainer.classList.contains('active')) {
            chatbotContainer.classList.remove('active');
        }
    });
}

// הוספת הודעה לצ'אט
function addMessage(text, sender) {
    if (!chatbotMessages) return; // בדיקה שהאלמנט קיים

    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'bot-message';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-spa"></i>';

    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = text;

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);

    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// הצגת אינדיקטור הקלדה
function showTypingIndicator() {
    if (!chatbotMessages) return; // בדיקה שהאלמנט קיים

    const typingDiv = document.createElement('div');
    typingDiv.className = 'bot-message typing-message';
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
    if (!chatbotMessages) return; // בדיקה שהאלמנט קיים

    const typingMsg = chatbotMessages.querySelector('.typing-message');
    if (typingMsg) {
        typingMsg.remove();
    }
}

// הוספת כל הכפתורים הראשיים
function addAllQuestions() {
    if (!chatbotMessages) return; // בדיקה שהאלמנט קיים

    const quickDiv = document.createElement('div');
    quickDiv.className = 'quick-questions';
    quickDiv.style.marginTop = '10px';

    const allQuestions = [
        { id: 'hours', label: '🕐 שעות פעילות' },
        { id: 'prices', label: '💰 מחירון' },
        { id: 'location', label: '📍 איפה אתם נמצאים?' },
        { id: 'services', label: '💆 אילו עיסויים יש?' },
        { id: 'booking', label: '📅 איך מזמינים תור?' }
    ];

    allQuestions.forEach(q => {
        const btn = document.createElement('button');
        btn.className = 'quick-btn';
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
        hours: 'שעות פעילות',
        prices: 'מחירון',
        location: 'איפה אתם נמצאים?',
        services: 'אילו עיסויים יש?',
        booking: 'איך מזמינים תור?'
    };
    
    addMessage(labels[question], 'user');
    showTypingIndicator();
    
    setTimeout(() => {
        hideTypingIndicator();
        const response = responses[question];
        addMessage(response.text, 'bot');
        
        // תמיד להציג את כל השאלות אחרי התשובה
        addAllQuestions();
    }, 1000);
}

// כפתורים מהירים ראשוניים - רק אם הם קיימים
if (quickBtns && quickBtns.length > 0) {
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const question = btn.dataset.question;
            handleQuickQuestion(question);
        });
    });
}

// שליחת הודעה חופשית
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');

function handleUserMessage() {
    const userMessage = chatbotInput.value.trim();

    if (userMessage === '') return;

    // הצג את הודעת המשתמש
    addMessage(userMessage, 'user');

    // נקה את שדה הקלט
    chatbotInput.value = '';

    // חפש התאמה
    const matchedKey = findBestMatch(userMessage);

    showTypingIndicator();

    setTimeout(() => {
        hideTypingIndicator();

        if (matchedKey) {
            const response = responses[matchedKey];
            addMessage(response.text, 'bot');
        } else {
            // תשובת ברירת מחדל
            const defaultResponse = `
                מצטער, לא הבנתי את השאלה שלך 🤔<br><br>
                בחר אחת מהאפשרויות הבאות או נסח את השאלה אחרת:
            `;
            addMessage(defaultResponse, 'bot');
        }

        // הצג את כל הכפתורים
        addAllQuestions();
    }, 1000);
}

// בדיקה אם קלט הצ'אטבוט קיים לפני הוספת listeners
if (chatbotSend && chatbotInput) {
    chatbotSend.addEventListener('click', handleUserMessage);

    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
}
