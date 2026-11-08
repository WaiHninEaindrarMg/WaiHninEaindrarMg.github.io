document.addEventListener('DOMContentLoaded', () => {
  // 1. Language Switcher (EN / JA)
  const langToggleBtn = document.getElementById('lang-toggle');
  const langLabel = document.getElementById('lang-label');
  const savedLang = localStorage.getItem('portfolio_lang') || 'en';

  function setLanguage(lang) {
    document.body.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('portfolio_lang', lang);
    if (langLabel) {
      langLabel.textContent = lang === 'en' ? '日本語' : 'English';
    }
  }

  setLanguage(savedLang);

  if (langToggleBtn) {
    langToggleBtn.addEventListener('click', () => {
      const current = document.body.getAttribute('data-lang') || 'en';
      setLanguage(current === 'en' ? 'ja' : 'en');
    });
  }

  // 2. Theme Switcher (Dark / Light)
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const savedTheme = localStorage.getItem('portfolio_theme') || 'dark';

  function setTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      if (themeIcon) themeIcon.textContent = '🌙';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) themeIcon.textContent = '☀️';
    }
    localStorage.setItem('portfolio_theme', theme);
  }

  setTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      setTheme(isLight ? 'dark' : 'light');
    });
  }

  // 3. Project Category Filter
  const projectFilterBtns = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-project-filter');

      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Publication Category Filter
  const pubFilterBtns = document.querySelectorAll('[data-pub-filter]');
  const pubCards = document.querySelectorAll('.pub-card[data-pub-type]');

  pubFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pubFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-pub-filter');

      pubCards.forEach(card => {
        const pubType = card.getAttribute('data-pub-type');
        if (filter === 'all' || pubType === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 5. Copy Citation to Clipboard
  const copyCitationBtns = document.querySelectorAll('.copy-citation-btn');
  copyCitationBtns.forEach(btn => {
    btn.addEventListener('click', async () => {
      const citation = btn.getAttribute('data-citation');
      if (!citation) return;
      try {
        await navigator.clipboard.writeText(citation);
        const originalHTML = btn.innerHTML;
        const isJa = document.body.getAttribute('data-lang') === 'ja';
        btn.innerHTML = isJa ? '✓ コピー完了' : '✓ Copied!';
        setTimeout(() => {
          btn.innerHTML = originalHTML;
        }, 1800);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    });
  });

  // 6. Active Navigation Highlight on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // 7. Mobile Navigation (Hamburger Menu)
  const burger = document.getElementById('nav-burger');
  const navMobile = document.getElementById('nav-links');

  function closeMobileNav() {
    if (!burger || !navMobile) return;
    navMobile.classList.remove('open');
    burger.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && navMobile) {
    burger.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('open');
      burger.classList.toggle('active', isOpen);
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when a link is tapped
    navMobile.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMobileNav));

    // Close when resizing back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) closeMobileNav();
    });
  }

  // 8. Scroll-Reveal Animations (progressive enhancement)
  const revealTargets = document.querySelectorAll(
    '.section-header, .kpi-card, .pillar-card, .project-card, .pub-card, .skill-box, .timeline-item, .profile-card'
  );
  if ('IntersectionObserver' in window) {
    revealTargets.forEach(el => el.classList.add('reveal'));
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  }

  // 9. Back-to-Top Button + Navbar elevation on scroll
  const backToTop = document.getElementById('back-to-top');
  const navbar = document.querySelector('.navbar');

  function onScrollUI() {
    const y = window.scrollY;
    if (backToTop) backToTop.classList.toggle('visible', y > 600);
    if (navbar) navbar.classList.toggle('scrolled', y > 10);
  }
  window.addEventListener('scroll', onScrollUI, { passive: true });
  onScrollUI();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
