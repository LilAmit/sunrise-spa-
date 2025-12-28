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
