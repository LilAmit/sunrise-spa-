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

// מערכת הנגשה
const accessibilityBtn = document.getElementById('accessibilityBtn');
const accessibilityMenu = document.getElementById('accessibilityMenu');
const closeAccessibility = document.getElementById('closeAccessibility');
const resetBtn = document.getElementById('resetAccessibility');
const accessibilityOptions = document.querySelectorAll('.accessibility-option');

// שמירה והחזרת הגדרות הנגשה
function saveAccessibilitySettings() {
    const activeFeatures = [];
    accessibilityOptions.forEach(option => {
        if (option.classList.contains('active')) {
            activeFeatures.push(option.dataset.feature);
        }
    });
    localStorage.setItem('accessibilityFeatures', JSON.stringify(activeFeatures));
}

function loadAccessibilitySettings() {
    const saved = localStorage.getItem('accessibilityFeatures');
    if (saved) {
        const activeFeatures = JSON.parse(saved);
        activeFeatures.forEach(feature => {
            const option = document.querySelector(`[data-feature="${feature}"]`);
            if (option) {
                option.classList.add('active');
                option.setAttribute('aria-pressed', 'true');
                document.body.classList.add(feature);
            }
        });
    }
}

// פתיחה/סגירה של תפריט הנגשה
accessibilityBtn.addEventListener('click', () => {
    const isOpen = accessibilityMenu.classList.contains('active');
    accessibilityMenu.classList.toggle('active');
    accessibilityBtn.setAttribute('aria-expanded', !isOpen);
    
    if (!isOpen) {
        setTimeout(() => {
            accessibilityOptions[0].focus();
        }, 100);
    }
});

closeAccessibility.addEventListener('click', () => {
    accessibilityMenu.classList.remove('active');
    accessibilityBtn.setAttribute('aria-expanded', 'false');
    accessibilityBtn.focus();
});

// סגירה בלחיצה מחוץ לתפריט
document.addEventListener('click', (e) => {
    if (!accessibilityMenu.contains(e.target) && !accessibilityBtn.contains(e.target)) {
        accessibilityMenu.classList.remove('active');
        accessibilityBtn.setAttribute('aria-expanded', 'false');
    }
});

// סגירה ב-ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && accessibilityMenu.classList.contains('active')) {
        accessibilityMenu.classList.remove('active');
        accessibilityBtn.setAttribute('aria-expanded', 'false');
        accessibilityBtn.focus();
    }
});

// הפעלה/כיבוי של אפשרויות הנגשה
accessibilityOptions.forEach(option => {
    const toggleFeature = () => {
        const feature = option.dataset.feature;
        const isActive = option.classList.contains('active');
        
        // ביטול אפשרויות מנוגדות
        if (feature === 'large-text' || feature === 'extra-large-text') {
            document.querySelectorAll('[data-feature="large-text"], [data-feature="extra-large-text"]')
                .forEach(opt => {
                    opt.classList.remove('active');
                    opt.setAttribute('aria-pressed', 'false');
                    document.body.classList.remove(opt.dataset.feature);
                });
        }
        
        if (!isActive) {
            option.classList.add('active');
            option.setAttribute('aria-pressed', 'true');
            document.body.classList.add(feature);
        } else {
            option.classList.remove('active');
            option.setAttribute('aria-pressed', 'false');
            document.body.classList.remove(feature);
        }
        
        saveAccessibilitySettings();
    };

    // תמיכה בקליק ומקלדת
    option.addEventListener('click', toggleFeature);
    option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFeature();
        }
    });
});

// איפוס הגדרות
resetBtn.addEventListener('click', () => {
    accessibilityOptions.forEach(option => {
        option.classList.remove('active');
        option.setAttribute('aria-pressed', 'false');
        document.body.classList.remove(option.dataset.feature);
    });
    localStorage.removeItem('accessibilityFeatures');
    
    const originalText = resetBtn.innerHTML;
    resetBtn.innerHTML = '<i class="fa-solid fa-check"></i> אופס!';
    setTimeout(() => {
        resetBtn.innerHTML = originalText;
    }, 1500);
});

// טעינת הגדרות בטעינת הדף
loadAccessibilitySettings();

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
