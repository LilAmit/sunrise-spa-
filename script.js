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

// סליידר
let currentSlide = 0;
const track = document.getElementById('sliderTrack');
const totalSlides = track.children.length;
const indicatorsContainer = document.getElementById('indicators');
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

// סטטוס פתוח/סגור
function updateStatus() {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    const statusDiv = document.getElementById('statusIndicator');
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

// ========================
// מערכת נגישות - תקן ישראלי 5568
// ========================
const AccessibilityManager = {
    panel: document.getElementById('accessibilityPanel'),
    trigger: document.getElementById('accessibilityTrigger'),
    closeBtn: document.getElementById('closePanel'),
    resetBtn: document.getElementById('resetAccessibility'),
    actions: document.querySelectorAll('.accessibility-action'),
    textSize: 100,
    
    init() {
        this.loadSettings();
        this.bindEvents();
        this.initKeyboardNav();
    },
    
    bindEvents() {
        // פתיחה/סגירה
        this.trigger.addEventListener('click', () => this.togglePanel());
        this.closeBtn.addEventListener('click', () => this.closePanel());
        
        // סגירה ב-ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel.classList.contains('active')) {
                this.closePanel();
            }
        });
        
        // כפתורי פעולה
        this.actions.forEach(btn => {
            btn.addEventListener('click', () => this.handleAction(btn));
        });
        
        // איפוס
        this.resetBtn.addEventListener('click', () => this.resetAll());
        
        // סגירה בלחיצה מחוץ לפאנל
        document.addEventListener('click', (e) => {
            if (this.panel.classList.contains('active') && 
                !this.panel.contains(e.target) && 
                !this.trigger.contains(e.target)) {
                this.closePanel();
            }
        });
    },
    
    togglePanel() {
        const isOpen = this.panel.classList.toggle('active');
        this.trigger.setAttribute('aria-expanded', isOpen);
        this.announce(isOpen ? 'תפריט נגישות נפתח' : 'תפריט נגישות נסגר');
        
        if (isOpen) {
            this.actions[0]?.focus();
        }
    },
    
    closePanel() {
        this.panel.classList.remove('active');
        this.trigger.setAttribute('aria-expanded', 'false');
        this.trigger.focus();
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
        // הסרת כל המחלקות
        document.body.className = '';
        document.documentElement.style.fontSize = '';
        this.textSize = 100;
        
        // איפוס כפתורים
        this.actions.forEach(btn => {
            btn.setAttribute('aria-pressed', 'false');
        });
        
        // איפוס אלמנטים
        document.getElementById('skipLinks').style.display = 'none';
        document.getElementById('readingGuide').style.display = 'none';
        
        localStorage.removeItem('accessibilitySettings');
        this.announce('כל הגדרות הנגישות אופסו');
        
        // אנימציה לכפתור איפוס
        this.resetBtn.innerHTML = '<i class="fa-solid fa-check"></i> אופס בהצלחה!';
        setTimeout(() => {
            this.resetBtn.innerHTML = '<i class="fa-solid fa-rotate-left"></i> איפוס כל ההגדרות';
        }, 2000);
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


// ===== צ'אטבוט =====
const chatbotBtn = document.getElementById('chatbotBtn');
const chatbotContainer = document.getElementById('chatbotContainer');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotMessages = document.getElementById('chatbotMessages');
const quickBtns = document.querySelectorAll('.quick-btn');

// מאגר תשובות
const responses = {
    hours: {
        text: `שעות הפעילות שלנו:<br><br>
        📅 <strong>ראשון - חמישי:</strong> 10:00 - 22:00<br>
        📅 <strong>שישי:</strong> 09:00 - 16:00<br>
        📅 <strong>שבת:</strong> סגור<br><br>
        מומלץ לתאם תור מראש!`
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
        • 60 דקות - ₪240`
    },
    location: {
        text: `אנחנו נמצאים ב:<br><br>
        📍 <strong>ההסתדרות 2, קומה 2</strong><br>
        🏙️ <strong>פתח תקווה</strong><br><br>
        ניתן להגיע אלינו בקלות באמצעות:<br><br>
        🚗 <a href="https://www.waze.com/live-map/directions/il/center-district/%D7%A4%D7%AA/sunrise-spa-%D7%A1%D7%A4%D7%90-%D7%A2%D7%99%D7%A1%D7%95%D7%99-%D7%A4%D7%AA%D7%97-%D7%AA%D7%A7%D7%95%D7%95%D7%94?navigate=yes&to=place.ChIJSZXBMVY3HRURy-oaXLqTcrg" target="_blank" style="color: #1565C0; font-weight: bold; text-decoration: underline;">ניווט בוויז</a><br><br>
        🗺️ <a href="https://www.google.com/maps/dir//Sunrise+Spa" target="_blank" style="color: #1565C0; font-weight: bold; text-decoration: underline;">ניווט בגוגל מפות</a>`
    },
    services: {
        text: `אנחנו מציעים:<br><br>
        ✨ <strong>עיסוי תאילנדי</strong> - עיסוי מסורתי עם מתיחות<br>
        ✨ <strong>עיסוי שוודי</strong> - עיסוי מרגיע ונעים<br>
        ✨ <strong>עיסוי רקמות עמוק</strong> - לשחרור מתחים<br>
        ✨ <strong>עיסוי רגליים</strong> - רפלקסולוגיה<br>
        ✨ <strong>עיסוי זוגי</strong> - חוויה משותפת<br><br>
        כל העיסויים מבוצעים על ידי מעסים מקצועיים ומוסמכים.`
    },
    booking: {
        text: `📞 <strong>להזמנת תור:</strong><br><br>
        ניתן להזמין תור בקלות באחת מהדרכים הבאות:<br><br>
        💬 <a href="https://wa.me/972586588751" target="_blank" style="color: #128C7E; font-weight: bold; text-decoration: underline;">שליחת הודעה בוואטסאפ</a><br>
        📱 <strong>058-658-8751</strong><br><br>
        📞 <a href="tel:0586588751" style="color: #667eea; font-weight: bold; text-decoration: underline;">התקשרות ישירה - 058-658-8751</a><br><br>
        💡 מומלץ להזמין מראש!`
    }
};

// פתיחה/סגירה של הצ'אט
chatbotBtn.addEventListener('click', () => {
    chatbotContainer.classList.add('active');
});

chatbotClose.addEventListener('click', () => {
    chatbotContainer.classList.remove('active');
});

// סגירה בלחיצה על ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatbotContainer.classList.contains('active')) {
        chatbotContainer.classList.remove('active');
    }
});

// הוספת הודעה לצ'אט
function addMessage(text, sender) {
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
    const typingMsg = chatbotMessages.querySelector('.typing-message');
    if (typingMsg) {
        typingMsg.remove();
    }
}

// הוספת כל הכפתורים הראשיים
function addAllQuestions() {
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

// כפתורים מהירים ראשוניים
quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const question = btn.dataset.question;
        handleQuickQuestion(question);
    });
});
