// CURSOR
const isTouchDevice = () => {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);
};

if (!isTouchDevice()) {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    try {
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            cursor.style.left = mx + 'px';
            cursor.style.top = my + 'px';
        });
    } catch (error) {
        console.error('Error in mousemove event listener:', error);
    }

    function animateRing() {
        try {
            rx += (mx - rx) * 0.12;
            ry += (my - ry) * 0.12;
            ring.style.left = rx + 'px';
            ring.style.top = ry + 'px';
            requestAnimationFrame(animateRing);
        } catch (error) {
            console.error('Error in animateRing function:', error);
        }
    }
    animateRing();

    document.querySelectorAll('a, button, .service-card').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
}

const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
});

function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

// NAV SCROLL
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// HERO TYPEWRITER
const name = 'aress';
const typed = document.getElementById('typedName');
let i = 0;
function typeWriter() {
    if (i <= name.length) {
        const current = name.substring(0, i);
        typed.innerHTML = current.replace('a', '<span class="accent-letter">a</span>');
        i++;
        setTimeout(typeWriter, i === 1 ? 800 : 120);
    }
}
setTimeout(typeWriter, 600);

// REVEAL ON SCROLL
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, idx) => {
        if (e.isIntersecting) {
            setTimeout(() => e.target.classList.add('visible'), idx * 60);
        }
    });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

// PROJECT HOVER PREVIEW
const preview = document.getElementById('projPreview');
const previewInner = document.getElementById('projPreviewInner');
const rows = document.querySelectorAll('.project-row');

rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
        previewInner.textContent = row.dataset.emoji;
        preview.style.background = row.dataset.bg;
        preview.classList.add('active');
    });
    row.addEventListener('mouseleave', () => {
        preview.classList.remove('active');
    });
    row.addEventListener('mousemove', e => {
        preview.style.left = (e.clientX + 24) + 'px';
        preview.style.top = (e.clientY - 110) + 'px';
    });
    row.addEventListener('click', e => {
        if (row.getAttribute('href') === '#') {
            e.preventDefault();
        }
    });
});