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
