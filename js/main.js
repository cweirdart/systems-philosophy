/* ============================================
   Systems Philosophy — Shared Components & Interactions
   ============================================ */

// Chapter data for navigation
const chapters = [
  { id: 'goal', label: 'Goal', title: 'Goal', path: '/chapters/goal.html' },
  { id: 'intro', label: 'Introduction', title: 'Introduction', path: '/chapters/intro.html' },
  { id: 'observation', label: 'Chapter 1', title: 'Observation', path: '/chapters/observation.html' },
  { id: 'nonlinear-networks', label: 'Chapter 2', title: 'Nonlinear Networks', path: '/chapters/nonlinear-networks.html' },
  { id: 'self-awareness', label: 'Chapter 3', title: 'Self-awareness & the Linear Model', path: '/chapters/self-awareness.html' },
  { id: 'digital-age-of-emergence', label: 'Chapter 4', title: 'Digital Age of Emergence', path: '/chapters/digital-age-of-emergence.html' },
  { id: 'paradigm-shift', label: 'Chapter 5', title: 'Where the Paradigm Shift Begins', path: '/chapters/paradigm-shift.html' },
  { id: 'unified-theory', label: 'Chapter 6', title: 'Unifying Science, Spirituality & Philosophy', path: '/chapters/unified-theory.html' },
  { id: 'unconditional-love', label: 'Chapter 7', title: 'The Principle Quality', path: '/chapters/unconditional-love.html' },
  { id: 'overview', label: 'Overview', title: 'Overview', path: '/chapters/overview.html' },
  { id: 'cognitive-energy', label: 'Appendix A', title: 'Cognitive Energy', path: '/chapters/cognitive-energy.html' },
  { id: 'fractal-dimension', label: 'Appendix B', title: 'The Fractal Dimension', path: '/chapters/fractal-dimension.html' },
  { id: 'divided-brain', label: 'Appendix C', title: 'The Divided Brain (McGilchrist)', path: '/chapters/divided-brain.html' },
  { id: 'secret-life-of-chaos', label: 'Appendix D', title: 'Secret Life of Chaos (Al-Khalili)', path: '/chapters/secret-life-of-chaos.html' },
];

// Detect base path (are we in /chapters/ or root?)
function getBasePath() {
  const path = window.location.pathname;
  if (path.includes('/chapters/')) return '..';
  return '.';
}

function buildHeader() {
  const base = getBasePath();
  const currentPath = window.location.pathname;

  const isActive = (path) => {
    const resolvedPath = path.replace('.', '');
    if (resolvedPath === '/' || resolvedPath === '/index.html') {
      return currentPath.endsWith('/') || currentPath.endsWith('/index.html');
    }
    return currentPath.includes(resolvedPath.replace('.html', ''));
  };

  const dropdownItems = chapters.map(ch => {
    const href = `${base}${ch.path}`;
    const active = isActive(ch.path) ? ' style="color:var(--accent)"' : '';
    if (ch.id === 'overview') {
      return `<div class="dropdown-divider"></div><a href="${href}"${active}>${ch.title}</a>`;
    }
    if (ch.id === 'cognitive-energy') {
      return `<div class="dropdown-divider"></div><div class="dropdown-label">Appendices</div><a href="${href}"${active}>${ch.title}</a>`;
    }
    return `<a href="${href}"${active}>${ch.label !== ch.title ? ch.label + ': ' + ch.title : ch.title}</a>`;
  }).join('\n');

  return `
  <header class="site-header">
    <div class="header-inner">
      <a href="${base}/index.html" class="site-logo">Systems Philosophy</a>
      <nav class="main-nav" id="mainNav">
        <a href="${base}/index.html"${isActive('/index.html') ? ' class="active"' : ''}>Home</a>
        <a href="${base}/watch.html"${isActive('/watch.html') ? ' class="active"' : ''}>Watch</a>
        <div class="nav-dropdown">
          <button class="nav-dropdown-trigger">Read</button>
          <div class="nav-dropdown-menu">
            ${dropdownItems}
            <div class="dropdown-divider"></div>
            <a href="${base}/inspiration.html"${isActive('/inspiration.html') ? ' style="color:var(--accent)"' : ''}>Additional Inspiration</a>
          </div>
        </div>
        <a href="${base}/about.html"${isActive('/about.html') ? ' class="active"' : ''}>About</a>
        <a href="${base}/subscribe.html"${isActive('/subscribe.html') ? ' class="active"' : ''}>Subscribe</a>
      </nav>
      <div class="header-social">
        <a href="mailto:selforgorg@gmail.com" title="Email" aria-label="Email">&#9993;</a>
        <a href="https://instagram.com/selforganizing" target="_blank" rel="noopener" title="Instagram" aria-label="Instagram">&#9673;</a>
      </div>
      <button class="mobile-menu-toggle" id="mobileToggle" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </header>`;
}

function buildFooter() {
  const base = getBasePath();
  return `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-col">
        <h4>Systems Philosophy</h4>
        <p>Exploring the deep simplicity of the self-organizing universe.</p>
        <p style="margin-top:1rem;">
          <a href="mailto:selforgorg@gmail.com">selforgorg@gmail.com</a>
          <a href="https://instagram.com/selforganizing" target="_blank" rel="noopener">@selforganizing</a>
        </p>
      </div>
      <div class="footer-col">
        <h4>Navigate</h4>
        <a href="${base}/index.html">Home</a>
        <a href="${base}/watch.html">Watch</a>
        <a href="${base}/chapters/goal.html">Read</a>
        <a href="${base}/about.html">About</a>
        <a href="${base}/inspiration.html">Inspiration</a>
      </div>
      <div class="footer-col">
        <h4>Subscribe</h4>
        <p>Sign up to receive news and updates.</p>
        <form class="footer-subscribe" onsubmit="handleSubscribe(event)">
          <input type="email" placeholder="Email address" required aria-label="Email address" />
          <button type="submit">Join</button>
        </form>
        <p class="mt-1" style="font-size:0.78rem;color:var(--text-muted);">We respect your privacy.</p>
      </div>
    </div>
    <div class="footer-bottom">
      &copy; ${new Date().getFullYear()} Systems Philosophy. All rights reserved.
    </div>
  </footer>`;
}

function buildChapterNav(currentId) {
  const base = getBasePath();
  const idx = chapters.findIndex(ch => ch.id === currentId);
  if (idx === -1) return '';

  const prev = idx > 0 ? chapters[idx - 1] : null;
  const next = idx < chapters.length - 1 ? chapters[idx + 1] : null;

  let html = '<nav class="chapter-nav">';

  if (prev) {
    html += `<a href="${base}${prev.path}">
      <div class="nav-label">&larr; Previous</div>
      <div class="nav-title">${prev.title}</div>
    </a>`;
  } else {
    html += '<span></span>';
  }

  if (next) {
    html += `<a href="${base}${next.path}">
      <div class="nav-label">Next &rarr;</div>
      <div class="nav-title">${next.title}</div>
    </a>`;
  } else {
    html += '<span></span>';
  }

  html += '</nav>';
  return html;
}

// Initialize
function init() {
  // Insert header
  const headerEl = document.getElementById('site-header');
  if (headerEl) headerEl.innerHTML = buildHeader();

  // Insert footer
  const footerEl = document.getElementById('site-footer');
  if (footerEl) footerEl.innerHTML = buildFooter();

  // Insert chapter nav
  const chapterNavEl = document.getElementById('chapter-nav');
  if (chapterNavEl) {
    const chapterId = chapterNavEl.dataset.chapter;
    chapterNavEl.innerHTML = buildChapterNav(chapterId);
  }

  // Mobile menu toggle
  const toggle = document.getElementById('mobileToggle');
  const nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      nav.classList.toggle('open');
    });
  }

  // Mobile dropdown toggles
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    if (trigger && window.innerWidth <= 768) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        dropdown.classList.toggle('open');
      });
    }
  });

  // Scroll animations
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  }

  // Header hide/show on scroll
  let lastScroll = 0;
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      const current = window.scrollY;
      if (current > 200 && current > lastScroll) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }
      lastScroll = current;
    }, { passive: true });
  }
}

function handleSubscribe(e) {
  e.preventDefault();
  const input = e.target.querySelector('input');
  if (input && input.value) {
    alert('Thank you for subscribing! We\'ll be in touch.');
    input.value = '';
  }
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
