// פוסטים
const fullPosts = {
    thai: {
        title: 'עיסוי תאילנדי',
        date: '10 ינואר 2025',
        content: '<p>תוכן העיסוי התאילנדי</p>'
    },
    swedish: {
        title: 'עיסוי שוודי',
        date: '8 ינואר 2025',
        content: '<p>תוכן העיסוי השוודי</p>'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('טעינה הושלמה');

    const modal = document.getElementById('postModal');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.getElementById('modalClose');
    const buttons = document.querySelectorAll('.read-more-btn');

    console.log('מספר כפתורים:', buttons.length);

    buttons.forEach(function(btn) {
        btn.onclick = function() {
            console.log('לחצו על כפתור!');
            const postId = btn.getAttribute('data-post');
            const post = fullPosts[postId];

            if (post) {
                modalBody.innerHTML = '<h2>' + post.title + '</h2>' + post.content;
                modal.classList.add('active');
            } else {
                alert('פוסט לא נמצא');
            }
        };
    });

    if (modalClose) {
        modalClose.onclick = function() {
            modal.classList.remove('active');
        };
    }

    if (modal) {
        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        };
    }
});
