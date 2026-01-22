// ===== צ'אטבוט =====
// הערה: AccessibilityManager מוגדר ב-script.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("=== DOM Content Loaded ===");
  console.log("Blog.js is running!");

  // ===== אפקט Fade-in =====
  const blogFaders = document.querySelectorAll(".blog-wrapper .fade-in");
  const blogObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          blogObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  blogFaders.forEach((f) => blogObserver.observe(f));

  // כפתור חזרה למעלה
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

  // ===== צ'אטבוט =====
  const chatbotBtn = document.getElementById("chatbotBtn");
  const chatbotContainer = document.getElementById("chatbotContainer");
  const chatbotClose = document.getElementById("chatbotClose");
  const chatbotMessages = document.getElementById("chatbotMessages");
  const quickBtns = document.querySelectorAll(".quick-btn");

  if (!chatbotBtn || !chatbotContainer) {
    console.log("Chatbot elements not found");
  } else {
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
        ✨ <strong>עיסוי שוודי</strong> - עיסוי מרגיע ונעים<br>
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
  } // סיום else של הצ'אטבוט

  // ===== תוכן מלא של הפוסטים (לשימוש המודאל) =====
  // חשוב: מוגדר מחוץ לכל block כדי שיהיה נגיש מכל מקום
  const fullPosts = {
    thai: {
      title: "עיסוי תאילנדי - מסורת עתיקה של ריפוי והרמוניה",
      category: "עיסוי תאילנדי",
      date: "10 ינואר 2025",
      content: `
            <h3><i class="fa-solid fa-spa"></i> מה זה עיסוי תאילנדי?</h3>
            <p>
                עיסוי תאילנדי, המכונה גם "יוגה עצלנית", הוא אחד מסוגי העיסוי המסורתיים והעתיקים ביותר בעולם. 
                שיטה זו התפתחה לפני כ-2,500 שנה בתאילנד ומשלבת טכניקות ייחודיות מהרפואה ההודית, המסורת הבודהיסטית 
                והידע המקומי התאילנדי. העיסוי מבוצע על מזרון רך על הרצפה, כאשר המטופל לבוש בבגדים נוחים.
            </p>

            <h3><i class="fa-solid fa-hand-sparkles"></i> הטכניקה הייחודית</h3>
            <p>
                בעיסוי תאילנדי, המעסה משתמש לא רק בידיים אלא גם במרפקים, ברכיים וברגליים כדי להפעיל לחץ על נקודות 
                ספציפיות בגוף. הטיפול כולל מתיחות יוגה עדינות, תנועות מפרקים והזרמת אנרגיה לאורך קווי האנרגיה (סן) 
                שעוברים בגוף. זהו עיסוי אקטיבי מאוד שבו גם המטופל משתתף בתנועות.
            </p>

            <div class="benefits-grid">
                <div class="benefit-card">
                    <i class="fa-solid fa-heart-pulse"></i>
                    <h4>שיפור גמישות</h4>
                    <p>מתיחות עמוקות שמשפרות את טווח התנועה והגמישות</p>
                </div>
                <div class="benefit-card">
                    <i class="fa-solid fa-leaf"></i>
                    <h4>איזון אנרגטי</h4>
                    <p>איזון זרימת האנרגיה בגוף והרמוניה פנימית</p>
                </div>
                <div class="benefit-card">
                    <i class="fa-solid fa-brain"></i>
                    <h4>הפחתת מתח</h4>
                    <p>שחרור מתחים נפשיים וגופניים עמוקים</p>
                </div>
                <div class="benefit-card">
                    <i class="fa-solid fa-hand-holding-heart"></i>
                    <h4>שיפור מחזור הדם</h4>
                    <p>עידוד זרימת דם בריאה לכל חלקי הגוף</p>
                </div>
            </div>

            <h3><i class="fa-solid fa-user-check"></i> למי מתאים?</h3>
            <p>
                עיסוי תאילנדי מתאים לכל מי שמחפש עיסוי אקטיבי יותר שמשלב מתיחות ועבודה עמוקה על השרירים. 
                הוא מצוין במיוחד עבור:
            </p>
            <ul>
                <li><strong>ספורטאים</strong> - לשיפור גמישות וטווח תנועה</li>
                <li><strong>אנשים עם מתח שרירי</strong> - לשחרור מתחים עמוקים</li>
                <li><strong>מי שסובל מכאבי גב</strong> - למניעה ולטיפול בכאבים</li>
                <li><strong>אנשים בעלי אורח חיים יושבני</strong> - לשיפור היציבה והגמישות</li>
                <li><strong>מי שמחפש חוויה מדיטטיבית</strong> - לאיזון נפשי ופיזי</li>
            </ul>

            <h3><i class="fa-solid fa-lightbulb"></i> טיפים להתכונן לעיסוי</h3>
            <p>
                כדי להפיק את המרב מהעיסוי התאילנדי, מומלץ:
            </p>
            <ul>
                <li>להגיע בבגדים נוחים וגמישים (חולצה ומכנסיים ארוכים)</li>
                <li>לא לאכול ארוחה כבדה שעתיים לפני הטיפול</li>
                <li>לשתות מים לפני ואחרי העיסוי</li>
                <li>לעדכן את המעסה על כאבים או פציעות ספציפיות</li>
                <li>להיות פתוחים לחוויה - העיסוי עשוי להיות אינטנסיבי אבל לא כואב</li>
            </ul>

            <div class="cta-section">
                <h3>מוכנים לחוויה תאילנדית אותנטית?</h3>
                <p>הצוות המקצועי שלנו מוכשר בטכניקות עיסוי תאילנדי מסורתיות</p>
                <a href="https://wa.me/972586588751" class="cta-button" target="_blank">
                    <i class="fa-brands fa-whatsapp"></i>
                    הזמן עיסוי תאילנדי עכשיו
                </a>
            </div>
        `,
    },

    swedish: {
      title: "עיסוי שוודי - המסע המרגיע והמשחרר ביותר",
      category: "עיסוי שוודי",
      date: "8 ינואר 2025",
      content: `
            <h3><i class="fa-solid fa-spa"></i> מה זה עיסוי שוודי?</h3>
            <p>
                עיסוי שוודי הוא אחד מסוגי העיסוי הפופולריים והידועים ביותר במערב. הוא פותח במאה ה-19 על ידי 
                הרופא השוודי פר הנריק לינג, והפך לבסיס לרוב סוגי העיסוי המערביים כיום. זהו עיסוי קלאסי 
                המתמקד בהרפיה עמוקה של השרירים והגוף בכללותו.
            </p>

            <h3><i class="fa-solid fa-hand-sparkles"></i> הטכניקה והתנועות</h3>
            <p>
                העיסוי השוודי משתמש בחמש תנועות בסיסיות שנעשות בסדר מדויק:
            </p>
            <ul>
                <li><strong>לטיפה (Effleurage)</strong> - תנועות ארוכות ומלטפות לאורך השריר</li>
                <li><strong>לישה (Petrissage)</strong> - תנועות עיסוי ולישה של השרירים</li>
                <li><strong>חיכוך (Friction)</strong> - תנועות מעגליות עמוקות</li>
                <li><strong>טפיחות (Tapotement)</strong> - תנועות קצביות של טפיחות קלות</li>
                <li><strong>רעידות (Vibration)</strong> - רעידות מהירות לשחרור מתחים</li>
            </ul>
            <p>
                העיסוי נעשה עם שמנים ארומתרפיים על עור חשוף, מה שמאפשר תנועות חלקות ונעימות. 
                הלחץ יכול להיות עדין עד בינוני-חזק, בהתאם להעדפת המטופל.
            </p>

            <div class="benefits-grid">
                <div class="benefit-card">
                    <i class="fa-solid fa-heart"></i>
                    <h4>הרפיה מושלמת</h4>
                    <p>הורדת רמות מתח וחרדה, הרגעה נפשית</p>
                </div>
                <div class="benefit-card">
                    <i class="fa-solid fa-droplet"></i>
                    <h4>שיפור זרימת דם</h4>
                    <p>עידוד מחזור דם בריא ותזונת הרקמות</p>
                </div>
                <div class="benefit-card">
                    <i class="fa-solid fa-bed"></i>
                    <h4>שינה איכותית</h4>
                    <p>שיפור איכות השינה והפחתת נדודי שינה</p>
                </div>
                <div class="benefit-card">
                    <i class="fa-solid fa-shield-heart"></i>
                    <h4>חיזוק מערכת חיסון</h4>
                    <p>תמיכה במערכת החיסונית של הגוף</p>
                </div>
            </div>

            <h3><i class="fa-solid fa-user-check"></i> למי מתאים?</h3>
            <p>
                עיסוי שוודי הוא אידיאלי עבור:
            </p>
            <ul>
                <li><strong>מתחילים בעולם העיסויים</strong> - חוויה נעימה ומרגיעה</li>
                <li><strong>אנשים תחת מתח ולחץ</strong> - להרפיה נפשית וגופנית</li>
                <li><strong>מי שסובל מכאבי ראש</strong> - להקלה וטיפול מונע</li>
                <li><strong>אנשים עם עור רגיש</strong> - העיסוי עדין ומותאם אישית</li>
            </ul>

            <h3><i class="fa-solid fa-lightbulb"></i> טיפים לחוויה אופטימלית</h3>
            <p>
                כדי ליהנות מהעיסוי במלואו:
            </p>
            <ul>
                <li>תקשרו בגלוי עם המעסה על הלחץ המועדף עליכם</li>
                <li>אפשרו לעצמכם להירגע ולנשום בעומק</li>
                <li>הימנעו מקפאין לפני העיסוי</li>
                <li>שתו הרבה מים אחרי העיסוי לסילוק רעלים</li>
                <li>תכננו זמן מנוחה אחרי העיסוי - הימנעו מפעילות אינטנסיבית</li>
            </ul>

            <div class="cta-section">
                <h3>הרגע הזה להירגע הגיע!</h3>
                <p>חוו עיסוי שוודי מקצועי במיטב המסורת</p>
                <a href="https://wa.me/972586588751" class="cta-button" target="_blank">
                    <i class="fa-brands fa-whatsapp"></i>
                    הזמן עיסוי שוודי עכשיו
                </a>
            </div>
        `,
    },

    deep: {
      title: "עיסוי רקמות עמוק - טיפול מקצועי לאנשים עם כאבים",
      category: "רקמות עמוק",
      date: "5 ינואר 2025",
      content: `
            <h3><i class="fa-solid fa-spa"></i> מה זה עיסוי רקמות עמוק?</h3>
            <p>
                עיסוי רקמות עמוק (Deep Tissue Massage) הוא טכניקת עיסוי מיוחדת המתמקדת בשכבות העמוקות ביותר 
                של השרירים, הגידים והרקמות החיבוריות. בניגוד לעיסוי שוודי הרגיל, עיסוי זה מפעיל לחץ חזק יותר 
                ומטפל בבעיות ספציפיות כמו כאבים כרוניים, פציעות ספורט ומתחי שרירים עמוקים.
            </p>

            <h3><i class="fa-solid fa-hand-sparkles"></i> איך זה עובד?</h3>
            <p>
                המעסה משתמש בתנועות איטיות ומכוונות עם לחץ רב יותר מאשר בעיסוי שוודי רגיל. הטכניקה כוללת:
            </p>
            <ul>
                <li><strong>לחץ עמוק וממוקד</strong> - על נקודות מתח ספציפיות</li>
                <li><strong>תנועות איטיות</strong> - לאורך כיוון סיבי השריר</li>
                <li><strong>שימוש במרפקים ואגרופים</strong> - להפעלת לחץ אפקטיבי</li>
                <li><strong>טכניקות שחרור מיופשיאלי</strong> - לטיפול ברקמות החיבוריות</li>
                <li><strong>מתיחות מוכוונות</strong> - לשיפור טווח התנועה</li>
            </ul>

            <div class="benefits-grid">
                <div class="benefit-card">
                    <i class="fa-solid fa-briefcase-medical"></i>
                    <h4>טיפול בכאבים כרוניים</h4>
                    <p>הקלה משמעותית בכאבי גב, צוואר וכתפיים כרוניים</p>
                </div>
                <div class="benefit-card">
                    <i class="fa-solid fa-person-running"></i>
                    <h4>שיקום פציעות</h4>
                    <p>מסייע בשיקום לאחר פציעות ספורט או תאונות</p>
                </div>
                <div class="benefit-card">
                    <i class="fa-solid fa-hands-holding"></i>
                    <h4>שחרור צלקות</h4>
                    <p>פירוק רקמות צלקת ושיפור תנועתיות</p>
                </div>
                <div class="benefit-card">
                    <i class="fa-solid fa-chart-line"></i>
                    <h4>שיפור תפקוד</h4>
                    <p>העלאת ביצועים גופניים וספורטיביים</p>
                </div>
            </div>

            <h3><i class="fa-solid fa-user-check"></i> למי מתאים?</h3>
            <p>
                עיסוי רקמות עמוק מומלץ במיוחד עבור:
            </p>
            <ul>
                <li><strong>כאבים כרוניים</strong> - גב תחתון, צוואר, כתפיים</li>
                <li><strong>מתח שרירי מתמיד</strong> - במיוחד באזורים ספציפיים</li>
                <li><strong>פציעות ספורט</strong> - למניעה ושיקום</li>
                <li><strong>יציבה לקויה</strong> - לתיקון והקלה</li>
                <li><strong>תסמונת התעלה הקרפלית</strong> - להפחתת לחץ על עצבים</li>
                <li><strong>פיברומיאלגיה</strong> - להקלה בתסמינים</li>
            </ul>

            <h3><i class="fa-solid fa-triangle-exclamation"></i> מה לצפות?</h3>
            <p>
                <strong>חשוב לדעת:</strong> עיסוי רקמות עמוק עשוי להיות לא נוח או אפילו מעט כואב במהלך הטיפול. 
                זוהי תגובה תקינה כאשר מטפלים בשרירים מתוחים ורקמות צפופות. עם זאת, הכאב צריך להיות "כאב טוב" - 
                תחושה של שחרור ולא כאב חד. <strong>תמיד תקשרו עם המעסה על עוצמת הכאב!</strong>
            </p>
            <p>
                לאחר העיסוי, ייתכן שתרגישו כאבי שרירים קלים למשך יום-יומיים, בדומה לאימון ספורטיבי. 
                זו תגובה נורמלית - הגוף מגיב לשחרור מתחים עמוקים ולשינויים ברקמות.
            </p>

            <h3><i class="fa-solid fa-lightbulb"></i> טיפים לאחר הטיפול</h3>
            <ul>
                <li><strong>שתו הרבה מים</strong> - לסילוק רעלים שהשתחררו</li>
                <li><strong>מרחו קרח</strong> - אם יש נפיחות או אי-נוחות</li>
                <li><strong>נוחו</strong> - הימנעו מפעילות אינטנסיבית ליום-יומיים</li>
                <li><strong>מתחו בעדינות</strong> - לשמירה על הגמישות שהתקבלה</li>
                <li><strong>האזינו לגוף</strong> - אם הכאב לא חולף, התייעצו עם מטפל</li>
            </ul>

            <div class="cta-section">
                <h3>מוכנים לשחרור אמיתי?</h3>
                <p>המעסים המנוסים שלנו יעניקו לכם טיפול מקצועי וממוקד</p>
                <a href="https://wa.me/972586588751" class="cta-button" target="_blank">
                    <i class="fa-brands fa-whatsapp"></i>
                    הזמן עיסוי רקמות עמוק עכשיו
                </a>
            </div>
        `,
    },

    reflexology: {
      title: "רפלקסולוגיה - ריפוי הגוף דרך כפות הרגליים",
      category: "רפלקסולוגיה",
      date: "3 ינואר 2025",
      content: `
            <h3><i class="fa-solid fa-spa"></i> מה זו רפלקסולוגיה?</h3>
            <p>
                רפלקסולוגיה היא שיטת טיפול עתיקה המבוססת על העיקרון שישנן נקודות רפלקס בכפות הרגליים, הידיים 
                והאוזניים המקושרות לכל איבר ומערכת בגוף. על ידי הפעלת לחץ על נקודות אלו, ניתן להשפיע על 
                הבריאות והתפקוד של האיברים המתאימים, לאזן את הגוף ולקדם ריפוי עצמי.
            </p>

            <h3><i class="fa-solid fa-map-location-dot"></i> מפת הרפלקסולוגיה</h3>
            <p>
                כף הרגל מחולקת לאזורים שונים, כאשר כל אזור מייצג חלק אחר בגוף:
            </p>
            <ul>
                <li><strong>אצבעות הרגליים</strong> - ראש, מוח ובלוטות בראש</li>
                <li><strong>כדור הרגל</strong> - חזה, ריאות ולב</li>
                <li><strong>קשת הרגל</strong> - איברי העיכול והבטן</li>
                <li><strong>עקב</strong> - איברי האגן והרבייה</li>
                <li><strong>צד פנימי</strong> - עמוד השדרה</li>
                <li><strong>צד חיצוני</strong> - כתפיים, זרועות ומפרקים</li>
            </ul>

            <h3><i class="fa-solid fa-hand-sparkles"></i> איך עובד טיפול?</h3>
            <p>
                המטפל משתמש באגודל ובאצבעות כדי להפעיל לחץ מדויק על נקודות ספציפיות בכף הרגל. 
                הלחץ יכול להיות עדין או חזק יותר, תלוי ברגישות ובצורך של המטופל. כאשר המטפל מוצא נקודה 
                רגישה או כואבת, זה עשוי להעיד על חוסר איזון באיבר המתאים.
            </p>

            <div class="benefits-grid">
                <div class="benefit-card">
                    <i class="fa-solid fa-spa"></i>
                    <h4>הרפיה עמוקה</h4>
                    <p>הפחתת מתח וחרדה, שיפור מצב הרוח</p>
                </div>
                <div class="benefit-card">
                    <i class="fa-solid fa-circle-half-stroke"></i>
                    <h4>איזון אנרגטי</h4>
                    <p>איזון מערכות הגוף והרמוניה פנימית</p>
                </div>
                <div class="benefit-card">
                    <i class="fa-solid fa-droplet"></i>
                    <h4>שיפור זרימת דם</h4>
                    <p>עידוד זרימה בריאה לכל חלקי הגוף</p>
                </div>
                <div class="benefit-card">
                    <i class="fa-solid fa-pills"></i>
                    <h4>תמיכה בריפוי</h4>
                    <p>עידוד תהליכי ריפוי עצמי טבעיים</p>
                </div>
            </div>

            <h3><i class="fa-solid fa-user-check"></i> למי מתאים?</h3>
            <p>
                רפלקסולוגיה יכולה לסייע במגוון רחב של מצבים:
            </p>
            <ul>
                <li><strong>מתח וחרדה</strong> - להרפיה ושיפור מצב רוח</li>
                <li><strong>בעיות שינה</strong> - לשיפור איכות השינה</li>
                <li><strong>כאבי ראש ומיגרנות</strong> - להפחתת תדירות ועוצמה</li>
                <li><strong>בעיות עיכול</strong> - לשיפור תפקוד מערכת העיכול</li>
                <li><strong>כאבי גב וצוואר</strong> - להקלה ושחרור</li>
                <li><strong>הורמונים לא מאוזנים</strong> - לאיזון הורמונלי</li>
                <li><strong>בעיות במחזור הדם</strong> - לשיפור זרימת הדם</li>
            </ul>

            <h3><i class="fa-solid fa-shield-halved"></i> התוויות נגד</h3>
            <p>
                למרות שרפלקסולוגיה בטוחה לרוב האנשים, יש מצבים בהם יש להיזהר או להימנע:
            </p>
            <ul>
                <li>פצעים פתוחים או זיהומים ברגליים</li>
                <li>פקקת ורידים (DVT) - קריש דם בוורידים עמוקים</li>
                <li>הריון מוקדם - יש להתייעץ עם רופא</li>
                <li>גאוט פעיל או דלקת מפרקים חריפה</li>
                <li>סוכרת לא מאוזנת</li>
            </ul>
            <p><strong>חשוב:</strong> תמיד יש להודיע למטפל על מצבים רפואיים קיימים.</p>

            <h3><i class="fa-solid fa-lightbulb"></i> מה לצפות בטיפול?</h3>
            <p>
                טיפול רפלקסולוגיה נמשך בדרך כלל 30-60 דקות. תתבקשו להסיר את הנעליים והגרביים ולשבת או לשכב בנוחות. 
                המטפל יבחן את כפות הרגליים ויתחיל לעבוד על נקודות שונות. תוכלו לחוות תחושות מגוונות:
            </p>
            <ul>
                <li>הרפיה עמוקה - רבים נרדמים במהלך הטיפול</li>
                <li>רגישות בנקודות מסוימות - זו תגובה נורמלית</li>
                <li>תחושת חימום או דחדוח - סימן לזרימת אנרגיה</li>
                <li>שחרור רגשי - לפעמים עולים רגשות במהלך הטיפול</li>
            </ul>

            <div class="cta-section">
                <h3>גלו את כוח הריפוי ברגליכם</h3>
                <p>חוו טיפול רפלקסולוגיה מקצועי ומרגיע</p>
                <a href="https://wa.me/972586588751" class="cta-button" target="_blank">
                    <i class="fa-brands fa-whatsapp"></i>
                    הזמן טיפול רפלקסולוגיה עכשיו
                </a>
            </div>
        `,
    },
  };

  // ===== פונקציונליות המודאל =====
  console.log("=== Modal Initialization Started ===");

  // קבלת כל האלמנטים הדרושים
  const modal = document.getElementById("postModal");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");
  const readMoreBtns = document.querySelectorAll(".read-more-btn");

  // בדיקות ראשוניות
  console.log("Modal:", modal ? "Found" : "NOT FOUND");
  console.log("Modal Body:", modalBody ? "Found" : "NOT FOUND");
  console.log("Modal Close:", modalClose ? "Found" : "NOT FOUND");
  console.log("Buttons:", readMoreBtns.length);
  console.log(
    "fullPosts:",
    typeof fullPosts,
    fullPosts ? "Defined" : "UNDEFINED",
  );

  // אם חסרים אלמנטים - עצור
  if (!modal || !modalBody || !modalClose) {
    console.error("CRITICAL: Modal elements missing!");
    return;
  }

  if (readMoreBtns.length === 0) {
    console.error("CRITICAL: No buttons found!");
    return;
  }

  // פונקציה לסגירת מודאל
  function closeModal() {
    modal.classList.remove("active");
    document.body.style.overflow = "";
    console.log("Modal closed");
  }

  // הוספת מאזינים לכפתורי "קרא עוד"
  readMoreBtns.forEach(function (btn, index) {
    const postId = btn.getAttribute("data-post");
    console.log("Button " + index + ' has data-post="' + postId + '"');

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      console.log(">>> CLICK on button " + index + ", postId=" + postId);

      const post = fullPosts[postId];

      if (!post) {
        console.error("Post not found for ID: " + postId);
        alert("שגיאה: לא נמצא תוכן לפוסט זה");
        return;
      }

      console.log("Post found: " + post.title);

      // מילוי התוכן במודאל
      modalBody.innerHTML =
        "<h2>" +
        post.title +
        "</h2>" +
        '<div class="post-meta">' +
        '<span><i class="fa-regular fa-calendar"></i> ' +
        post.date +
        "</span>" +
        "</div>" +
        post.content;

      // פתיחת המודאל
      modal.classList.add("active");
      document.body.style.overflow = "hidden";

      console.log("Modal opened successfully!");
    });
  });

  // סגירת מודאל בלחיצה על X
  modalClose.addEventListener("click", function (e) {
    e.preventDefault();
    closeModal();
  });

  // סגירת מודאל בלחיצה על הרקע
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // סגירת מודאל ב-ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  console.log("=== All initialization complete ===");
}); // סיום DOMContentLoaded הראשי
