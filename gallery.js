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
    // הוספת תמיכה מלאה בנגישות
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");

    // קביעת aria-label לפי סוג המדיה
    const type = item.dataset.type;
    const mediaLabel = type === "video" ? "סרטון" : "תמונה";
    item.setAttribute("aria-label", `לחץ Enter או רווח לצפייה ב${mediaLabel} ${index + 1} מתוך ${galleryItems.length}`);

    // הוספת aria-describedby לתיאור נוסף
    const img = item.querySelector("img");
    if (img && img.alt) {
      item.setAttribute("aria-description", img.alt);
    }

    // לחיצה בעכבר
    item.addEventListener("click", (e) => {
      // וודא שזו לחיצה אמיתית ולא מקלדת
      if (e.detail > 0) {
        currentIndex = index;
        openLightbox(item);
      }
    });

    // לחיצה במקלדת (Enter או Space) - עובד תמיד, גם עם ניווט מקלדת מלא
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation(); // מונע התנגשות עם handlers אחרים
        currentIndex = index;
        openLightbox(item);
      }
      // ניווט בין תמונות בגלריה בחצים כשאין lightbox פתוח
      else if (!lightbox.classList.contains("show")) {
        const isRTL = document.documentElement.dir === "rtl" || document.documentElement.lang === "he";

        if (e.key === "ArrowRight") {
          e.preventDefault();
          e.stopPropagation(); // מונע כפל פעולה עם ניווט מקלדת מלא
          // ב-RTL: ימינה = קודם, ב-LTR: ימינה = הבא
          const nextIndex = isRTL ?
            (index > 0 ? index - 1 : galleryItems.length - 1) :
            (index < galleryItems.length - 1 ? index + 1 : 0);
          galleryItems[nextIndex].focus();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          e.stopPropagation(); // מונע כפל פעולה עם ניווט מקלדת מלא
          // ב-RTL: שמאלה = הבא, ב-LTR: שמאלה = קודם
          const prevIndex = isRTL ?
            (index < galleryItems.length - 1 ? index + 1 : 0) :
            (index > 0 ? index - 1 : galleryItems.length - 1);
          galleryItems[prevIndex].focus();
        } else if (e.key === "Home") {
          e.preventDefault();
          e.stopPropagation();
          galleryItems[0].focus();
        } else if (e.key === "End") {
          e.preventDefault();
          e.stopPropagation();
          galleryItems[galleryItems.length - 1].focus();
        }
      }
    });

    // הוספת keypress כגיבוי (חלק מהדפדפנים משתמשים בזה)
    item.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
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
    switch(e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowRight":
        // ב-RTL: חץ ימינה = תמונה קודמת
        if (prevBtn) prevBtn.click();
        announceImage('קודמת');
        break;
      case "ArrowLeft":
        // ב-RTL: חץ שמאלה = תמונה הבאה
        if (nextBtn) nextBtn.click();
        announceImage('הבאה');
        break;
      case "Home":
        e.preventDefault();
        currentIndex = 0;
        openLightbox(galleryItems[currentIndex]);
        announceImage('ראשונה');
        break;
      case "End":
        e.preventDefault();
        currentIndex = galleryItems.length - 1;
        openLightbox(galleryItems[currentIndex]);
        announceImage('אחרונה');
        break;
    }
  }
});

// פונקציה להכרזה על תמונה לקוראי מסך
function announceImage(direction) {
  const announcer = document.getElementById('srAnnouncer') || document.getElementById('globalAnnouncer');
  if (announcer) {
    announcer.textContent = `תמונה ${direction}: ${currentIndex + 1} מתוך ${galleryItems.length}`;
  }
}

// ========================
// הערה: כל הפונקציונליות הנוספת (נגישות, צ'אטבוט, כפתור חזרה למעלה, קיצורי מקלדת)
// מנוהלת על ידי script.js שנטען לפני קובץ זה
// ========================
