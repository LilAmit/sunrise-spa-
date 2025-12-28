// סאנרייז ספא - גלריה - קובץ JavaScript

// יצירת כוכבים
const starsContainer = document.getElementById('stars');
for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 3 + 's';
    starsContainer.appendChild(star);
}

// ========================
// Lightbox (תצוגת תמונות)
// ========================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeBtn = document.getElementById('close-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

let currentIndex = 0;

// פתיחת Lightbox עבור כל פריט בגלריה
galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentIndex = index;
        openLightbox(item);
    });
});

// פונקציה לפתיחת Lightbox
function openLightbox(item) {
    const type = item.dataset.type;
    lightbox.style.display = 'flex';
    
    setTimeout(() => {
        lightbox.classList.add('show');
    }, 10);

    if (type === 'image') {
        const imgSrc = item.querySelector('img').src;
        lightboxImg.src = imgSrc;
        lightboxImg.style.display = 'block';
        lightboxVideo.style.display = 'none';
        lightboxVideo.pause();
    } else if (type === 'video') {
        const videoSrc = item.querySelector('video').src;
        lightboxVideo.src = videoSrc;
        lightboxVideo.style.display = 'block';
        lightboxImg.style.display = 'none';
        lightboxVideo.play();
    }

    lightboxCaption.textContent = item.querySelector('img, video').alt || '';
}

// פונקציה לסגירת Lightbox
function closeLightbox() {
    lightbox.classList.remove('show');
    lightboxVideo.pause();
    
    setTimeout(() => {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
        lightboxVideo.src = '';
    }, 400);
}

// כפתור סגירה
closeBtn.addEventListener('click', closeLightbox);

// סגירה בלחיצה על הרקע
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// כפתור תמונה קודמת
prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(galleryItems[currentIndex]);
});

// כפתור תמונה הבאה
nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(galleryItems[currentIndex]);
});

// תמיכה במקלדת
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('show')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') nextBtn.click();
        if (e.key === 'ArrowRight') prevBtn.click();
    }
});

// ========================
// כפתור חזרה למעלה
// ========================
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
// מערכת הנגשה
// ========================
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
