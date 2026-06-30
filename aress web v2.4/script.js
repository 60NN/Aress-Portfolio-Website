// ===== CUSTOM CURSOR =====
const isTouchDevice = () =>
  ('ontouchstart' in window) ||
  (navigator.maxTouchPoints > 0) ||
  (navigator.msMaxTouchPoints > 0);

if (!isTouchDevice()) {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

// ===== TICKER (duplicate items via JS for a seamless -50% loop) =====
const ticker = document.getElementById('ticker');
if (ticker) {
  // Clone the original set once so the two halves are identical,
  // letting the CSS translateX(-50%) animation loop without a visible jump.
  ticker.innerHTML += ticker.innerHTML;
}

// ===== MOBILE MENU =====
const navBurger  = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  if (!navBurger || !mobileMenu) return;
  navBurger.classList.remove('open');
  mobileMenu.classList.remove('open');
  navBurger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

function toggleMobileMenu() {
  const isOpen = mobileMenu.classList.toggle('open');
  navBurger.classList.toggle('open', isOpen);
  navBurger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

if (navBurger && mobileMenu) {
  navBurger.addEventListener('click', toggleMobileMenu);
  mobileMenu.querySelectorAll('a').forEach(link =>
    link.addEventListener('click', closeMobileMenu)
  );
}

// ===== NAV SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== HERO TYPEWRITER =====
const heroName = 'aress';
const typed    = document.getElementById('typedName');
let i = 0;

function typeWriter() {
  if (!typed) return;
  if (i <= heroName.length) {
    const current = heroName.substring(0, i);
    typed.innerHTML = current.replace('a', '<span class="accent-letter">a</span>');
    i++;
    setTimeout(typeWriter, i === 1 ? 800 : 120);
  }
}
setTimeout(typeWriter, 600);

// ===== REVEAL ON SCROLL =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, idx) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), idx * 60);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(r => observer.observe(r));

// ===== PROJECT HOVER PREVIEW =====
const preview      = document.getElementById('projPreview');
const previewInner = document.getElementById('projPreviewInner');

document.querySelectorAll('.project-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    if (!preview || !previewInner) return;
    previewInner.textContent   = row.dataset.emoji;
    preview.style.background   = row.dataset.bg;
    preview.classList.add('active');
  });
  row.addEventListener('mouseleave', () => {
    if (preview) preview.classList.remove('active');
  });
  row.addEventListener('mousemove', e => {
    if (!preview) return;
    preview.style.left = (e.clientX + 24) + 'px';
    preview.style.top  = (e.clientY - 110) + 'px';
  });
  row.addEventListener('click', e => {
    if (row.classList.contains('is-soon') || row.getAttribute('href') === '#') {
      e.preventDefault();
    }
  });
});

// ===== LANGUAGE SWITCH (EN / AR) =====
(function () {
  const switches = [
    document.getElementById('langSwitch'),
    document.getElementById('langSwitchMobile')
  ].filter(Boolean);

  if (!switches.length) return;

  // Elements whose innerHTML should be replaced (contain HTML tags like <em>, <span>)
  // They carry data-en-html / data-ar-html attributes
  function applyLanguage(lang) {
    const isAr = lang === 'ar';

    // 1. Direction + lang on <html>
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isAr ? 'rtl' : 'ltr');

    // 2. Update body font-family for Arabic
    document.body.style.fontFamily = isAr ? "'Cairo', sans-serif" : "'Inter', sans-serif";

    // 3. Update switch UI state
    switches.forEach(btn => btn.setAttribute('data-lang', lang));

    // 4. Swap plain-text elements (data-en / data-ar)
    document.querySelectorAll('[data-en][data-ar]').forEach(el => {
      const text = isAr ? el.getAttribute('data-ar') : el.getAttribute('data-en');
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = text;
        el.style.opacity = '1';
      }, 200);
    });

    // 5. Swap HTML-containing elements (data-en-html / data-ar-html)
    document.querySelectorAll('[data-en-html][data-ar-html]').forEach(el => {
      const html = isAr ? el.getAttribute('data-ar-html') : el.getAttribute('data-en-html');
      el.style.opacity = '0';
      setTimeout(() => {
        el.innerHTML = html;
        el.style.opacity = '1';
      }, 200);
    });

    // 6. Swap form placeholders (data-en-placeholder / data-ar-placeholder)
    document.querySelectorAll('[data-en-placeholder][data-ar-placeholder]').forEach(el => {
      el.placeholder = isAr ? el.getAttribute('data-ar-placeholder') : el.getAttribute('data-en-placeholder');
    });

    // 7. Persist
    localStorage.setItem('aress-lang', lang);
  }

  function toggleLanguage() {
    const current = document.documentElement.getAttribute('lang') || 'en';
    applyLanguage(current === 'en' ? 'ar' : 'en');
  }

  switches.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleLanguage();
    });
  });

  // Restore saved language (default: 'en')
  const saved = localStorage.getItem('aress-lang') || 'en';
  applyLanguage(saved);
})();

// ===== CONTACT FORM (Formspree) =====
(function () {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  const isAr = () => document.documentElement.getAttribute('lang') === 'ar';
  const messages = {
    sending: { en: 'Sending…', ar: 'جارٍ الإرسال…' },
    success: { en: 'Thanks — your message has been sent.', ar: 'شكراً — تم إرسال رسالتك.' },
    error:   { en: 'Something went wrong. Please try again.', ar: 'حدث خطأ ما. حاول مرة أخرى.' }
  };
  const t = key => (isAr() ? messages[key].ar : messages[key].en);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    status.className = 'form-status';
    status.textContent = t('sending');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (res.ok) {
        status.className = 'form-status success';
        status.textContent = t('success');
        form.reset();
      } else {
        status.className = 'form-status error';
        status.textContent = t('error');
      }
    } catch (err) {
      status.className = 'form-status error';
      status.textContent = t('error');
    }
  });
})();
