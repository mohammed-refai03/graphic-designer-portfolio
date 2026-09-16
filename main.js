/* ==========================================================================
   STACKLY — 100VH 2D EDITORIAL GRAPHIC DESIGNER PORTFOLIO
   JAVASCRIPT ENGINE (GSAP, KINETIC CURSOR & 2D CANVAS EXPERIMENTS)
   ========================================================================== */

/* --------------------------------------------------------------------------
   00. PRELOADER ANIMATION ENGINE (Full 2-Second Visible Animation)
   -------------------------------------------------------------------------- */
// Preserve scroll position on history back, scroll to top only on reload
(function initScrollMode() {
  const navEntries = performance.getEntriesByType && performance.getEntriesByType('navigation');
  const isBack = navEntries && navEntries.length > 0 && navEntries[0].type === 'back_forward';
  const isReload = navEntries && navEntries.length > 0 && navEntries[0].type === 'reload';

  if (isBack) {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'auto';
    }
  } else if (isReload) {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }
})();

(function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const fill = document.getElementById('preloader-fill');
  const counter = document.getElementById('preloader-counter');
  const startTime = Date.now();
  const DURATION = 2000; // Exactly 2 seconds count-up animation
  let dismissed = false;

  document.body.style.overflow = 'hidden';

  function dismiss() {
    if (dismissed) return;
    dismissed = true;

    if (fill) fill.style.width = '100%';
    if (counter) counter.textContent = '100%';

    setTimeout(() => {
      preloader.classList.add('preloader-hidden');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (preloader.parentNode) preloader.style.display = 'none';
      }, 600);
    }, 150);
  }

  function animate() {
    if (dismissed) return;
    const elapsed = Date.now() - startTime;
    const progress = Math.min(100, Math.floor((elapsed / DURATION) * 100));

    if (fill) fill.style.width = progress + '%';
    if (counter) counter.textContent = progress + '%';

    if (progress < 100) {
      requestAnimationFrame(animate);
    } else {
      dismiss();
    }
  }

  requestAnimationFrame(animate);
  setTimeout(dismiss, 2200);
})();

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // ENHANCED DUAL AUTO & MANUAL TESTIMONIAL SLIDER ENGINE
  // --------------------------------------------------------------------------
  function initTestimonialSlider(wrapperId, prevBtnId, nextBtnId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    const slides = wrapper.querySelectorAll('.testimonial-slide');
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const dots = wrapper.querySelectorAll('.slider-dot');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let autoTimer = null;
    const DURATION = 5000; // 5s auto-play interval

    function showSlide(index) {
      if (index >= slides.length) currentSlide = 0;
      else if (index < 0) currentSlide = slides.length - 1;
      else currentSlide = index;

      slides.forEach((s, i) => {
        if (i === currentSlide) s.classList.add('active');
        else s.classList.remove('active');
      });

      dots.forEach((d, i) => {
        if (i === currentSlide) d.classList.add('active');
        else d.classList.remove('active');
      });
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => showSlide(currentSlide + 1), DURATION);
    }

    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSlide(currentSlide - 1);
        startAuto();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showSlide(currentSlide + 1);
        startAuto();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        showSlide(idx);
        startAuto();
      });
    });

    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', startAuto);

    // Touch Swipe
    let touchStartX = 0;
    let touchEndX = 0;

    wrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) showSlide(currentSlide + 1);
        else showSlide(currentSlide - 1);
        startAuto();
      }
    }, { passive: true });

    startAuto();
  }

  initTestimonialSlider('home-testimonial-wrapper', 'home-t-prev', 'home-t-next');
  initTestimonialSlider('services-testimonial-wrapper', 'services-t-prev', 'services-t-next');

  // 00. REGISTER GSAP PLUGINS IF AVAILABLE
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 00B. INITIALIZE AOS (ANIMATE ON SCROLL) ENGINE
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50
    });
  }

  // 00C. GSAP SCROLLTRIGGER ENGINE
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }


  // --------------------------------------------------------------------------
  // 01. CUSTOM KINETIC CURSOR (DISABLED FOR NORMAL BROWSER MOUSE)
  // --------------------------------------------------------------------------
  const cursorDot = document.getElementById('custom-cursor');
  const cursorFollower = document.getElementById('cursor-follower');
  if (cursorDot) cursorDot.style.display = 'none';
  if (cursorFollower) cursorFollower.style.display = 'none';

  // Hover target listeners
  document.querySelectorAll('a, button, [data-cursor], .project-slide, .service-item, .about-card, .wb-card, .exhibition-card, .lab-tab').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      const cursorType = el.getAttribute('data-cursor');
      if (cursorType === 'view') {
        document.body.classList.add('cursor-view');
      } else {
        document.body.classList.add('cursor-hover');
      }
    });

    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover', 'cursor-view');
    });
  });

  // Magnetic Button Effect - REMOVED PER INSTRUCTION (Buttons remain static and clean)
  const magneticElements = document.querySelectorAll('.magnetic-btn, [data-magnetic]');
  magneticElements.forEach((btn) => {
    if (typeof gsap !== 'undefined') {
      gsap.set(btn, { x: 0, y: 0 });
    }
  });

  // --------------------------------------------------------------------------
  // 02. NAVBAR SCROLL SPY & MOBILE MENU
  // --------------------------------------------------------------------------
  const navLinks = document.querySelectorAll('.nav-link');

  let navTicking = false;
  function updateActiveNav() {
    const pageName = window.location.pathname.split('/').pop() || 'index.html';

    // On standalone pages (about.html, services.html, projects.html, etc.), keep existing active nav link
    if (pageName !== '' && pageName !== 'index.html') {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href && (href === pageName || href.startsWith(pageName))) {
          link.classList.add('active');
        }
      });
      return;
    }

    // On index.html home page, update active link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    const scrollPos = window.scrollY || document.documentElement.scrollTop;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (scrollPos >= sectionTop - 220) {
        current = section.getAttribute('id');
      }
    });

    if (current) {
      navLinks.forEach((link) => {
        const href = link.getAttribute('href');
        if (href === `#${current}` || href === `index.html#${current}`) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }
  }

  function onScrollNav() {
    if (!navTicking) {
      requestAnimationFrame(() => {
        updateActiveNav();
        navTicking = false;
      });
      navTicking = true;
    }
  }

  window.addEventListener('scroll', onScrollNav, { passive: true });
  updateActiveNav();

  window.saveScrollBefore404 = function() {
    try {
      const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      sessionStorage.setItem('scrollBefore404', currentScrollY.toString());
      sessionStorage.setItem('urlBefore404', window.location.href);
    } catch(e) {}
  };

  // Intercept clicks on links pointing to 404.html
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a, button');
    if (!link) return;

    const href = link.getAttribute('href');
    const onclick = link.getAttribute('onclick');

    if (href === '404.html' || (href && (href === '#' || href === '#0') && !link.classList.contains('sidebar-link') && !link.hasAttribute('data-tab')) || (onclick && onclick.includes('404.html'))) {
      window.saveScrollBefore404();
    }
  }, true);

  // Smooth scroll for internal anchor links (with 404 navigation for unused '#' links)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      if (this.classList.contains('sidebar-link') || this.hasAttribute('data-tab')) {
        return;
      }

      const targetId = this.getAttribute('href');

      if (!targetId || targetId === '#' || targetId === '#0') {
        e.preventDefault();
        window.saveScrollBefore404();
        window.location.href = '404.html';
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        e.preventDefault();
        window.saveScrollBefore404();
        window.location.href = '404.html';
      }
    });
  });

  // Scroll restoration logic (restores exact section when returning from 404, or scrolls to top on reload)
  try {
    const navEntries = performance.getEntriesByType && performance.getEntriesByType('navigation');
    const isReload = navEntries && navEntries.length > 0 && navEntries[0].type === 'reload';
    const isBack = navEntries && navEntries.length > 0 && navEntries[0].type === 'back_forward';
    const savedScroll = sessionStorage.getItem('scrollBefore404');

    if (isReload) {
      sessionStorage.removeItem('scrollBefore404');
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      window.scrollTo(0, 0);
    } else if (savedScroll !== null) {
      const targetY = parseInt(savedScroll, 10);
      sessionStorage.removeItem('scrollBefore404');
      if (!isNaN(targetY)) {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'manual';
        }
        const restorePos = () => window.scrollTo(0, targetY);
        restorePos();
        requestAnimationFrame(restorePos);
        setTimeout(restorePos, 20);
        setTimeout(restorePos, 100);
      }
    } else if (isBack) {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    }
  } catch (err) {
    console.warn('Scroll restoration error:', err);
  }

  // Mobile Nav Drawer Logic
  const hamburgerToggle = document.getElementById('hamburger-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const closeMobileNav = document.getElementById('close-mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  let savedHamburgerScrollY = 0;

  function openMobileHamburger() {
    if (!mobileNav) return;
    savedHamburgerScrollY = window.scrollY || window.pageYOffset;
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  function closeMobileHamburger() {
    if (!mobileNav) return;
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    window.scrollTo({
      top: savedHamburgerScrollY,
      behavior: 'instant'
    });
  }

  if (hamburgerToggle && mobileNav) {
    hamburgerToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMobileHamburger();
    });

    if (closeMobileNav) {
      closeMobileNav.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileHamburger();
      });
    }

    mobileLinks.forEach(l => {
      l.addEventListener('click', () => {
        closeMobileHamburger();
      });
    });
  }

  // Human PNG Parallax
  const humanWrapper = document.getElementById('hero-human-wrapper');
  const humanImg = document.getElementById('hero-human-img');

  if (humanWrapper && humanImg) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 25;
      const y = (e.clientY / window.innerHeight - 0.5) * 25;

      humanWrapper.style.transform = `translateY(-50%) translate(${x * 0.6}px, ${y * 0.6}px)`;
      humanImg.style.transform = `rotateY(${x * 0.3}deg) rotateX(${-y * 0.3}deg)`;
    });
  }

  // GSAP HERO ENTRANCE ANIMATION
  if (typeof gsap !== 'undefined') {
    const heroTL = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    heroTL
      .from('.reveal-label', { opacity: 0, y: -20, delay: 0.1 })
      .from('.reveal-text', { opacity: 0, y: 40, stagger: 0.15 }, '-=0.5')
      .from('#hero-human-wrapper', { opacity: 0, scale: 0.85, y: '-45%' }, '-=0.6')
      .from('.reveal-paragraph', { opacity: 0, y: 20 }, '-=0.4')
      .from('.reveal-ctas', { opacity: 0, y: 20 }, '-=0.4');
  }

  // --------------------------------------------------------------------------
  // HERO DYNAMIC TYPEWRITER ANIMATION
  // --------------------------------------------------------------------------
  const typingElement = document.getElementById('hero-typing-text');
  if (typingElement) {
    const titles = [
      'GRAPHIC DESIGNER',
      'VISUAL DESIGNER',
      'BRAND DESIGNER',
      'CREATIVE ARTIST'
    ];
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;       // Typing speed in ms
    const deleteSpeed = 60;      // Deleting speed in ms
    const delayAfterType = 2000; // Pause when full title is typed
    const delayAfterDelete = 500;// Pause before typing next title

    function typeLoop() {
      const currentTitle = titles[titleIndex];

      if (isDeleting) {
        typingElement.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingElement.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
      }

      let timeoutDuration = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentTitle.length) {
        timeoutDuration = delayAfterType;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        timeoutDuration = delayAfterDelete;
      }

      setTimeout(typeLoop, timeoutDuration);
    }

    typeLoop();
  }

  // --------------------------------------------------------------------------
  // 03. FEATURED PROJECTS SLIDER ENGINE (AUTO-PLAY, ARROW CLICK, HOVER PAUSE, TOUCH)
  // --------------------------------------------------------------------------
  const sliderTrack = document.getElementById('projects-slider');
  const slides = document.querySelectorAll('.project-slide');
  const nextBtn = document.getElementById('proj-next');
  const prevBtn = document.getElementById('proj-prev');
  const sliderWrap = document.querySelector('.projects-slider-wrapper');

  if (sliderTrack && slides.length > 0) {
    let currentProject = 0;
    const totalProjects = slides.length;
    let projAutoTimer = null;

    function updateSlider() {
      sliderTrack.style.transform = `translateX(-${currentProject * 100}%)`;
      slides.forEach((s, idx) => {
        if (idx === currentProject) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    }

    function nextProjSlide() {
      currentProject = (currentProject + 1) % totalProjects;
      updateSlider();
    }

    function prevProjSlide() {
      currentProject = (currentProject - 1 + totalProjects) % totalProjects;
      updateSlider();
    }

    function startProjAuto() {
      stopProjAuto();
      projAutoTimer = setInterval(nextProjSlide, 6000);
    }

    function stopProjAuto() {
      if (projAutoTimer) clearInterval(projAutoTimer);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextProjSlide();
        startProjAuto();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevProjSlide();
        startProjAuto();
      });
    }

    if (sliderWrap) {
      sliderWrap.addEventListener('mouseenter', stopProjAuto);
      sliderWrap.addEventListener('mouseleave', startProjAuto);

      // Touch Swipe Support
      let touchStartX = 0;
      let touchEndX = 0;

      sliderWrap.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      sliderWrap.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diffX = touchStartX - touchEndX;
        if (Math.abs(diffX) > 40) {
          if (diffX > 0) nextProjSlide();
          else prevProjSlide();
          startProjAuto();
        }
      }, { passive: true });
    }

    // Keyboard Left/Right Arrow Navigation
    window.addEventListener('keydown', (e) => {
      const projSec = document.getElementById('projects');
      if (projSec) {
        const rect = projSec.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          if (e.key === 'ArrowRight') {
            nextProjSlide();
            startProjAuto();
          } else if (e.key === 'ArrowLeft') {
            prevProjSlide();
            startProjAuto();
          }
        }
      }
    });

    startProjAuto();
  }

  // --------------------------------------------------------------------------
  // 04. SERVICES BACKDROP PREVIEW HOVER
  // --------------------------------------------------------------------------
  const serviceItems = document.querySelectorAll('.service-item');
  const servicePreview = document.getElementById('service-preview');

  serviceItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const bgImg = item.getAttribute('data-bg');
      if (servicePreview && bgImg) {
        servicePreview.style.backgroundImage = `url(${bgImg})`;
        servicePreview.style.opacity = '0.15';
      }
    });

    item.addEventListener('mouseleave', () => {
      if (servicePreview) servicePreview.style.opacity = '0';
    });
  });

  // --------------------------------------------------------------------------
  // 05. THE LAB 2D EXPERIMENTS CANVAS (`#lab-canvas`)
  // --------------------------------------------------------------------------
  const labCanvas = document.getElementById('lab-canvas');
  if (labCanvas) {
    const lCtx = labCanvas.getContext('2d');
    let lW = (labCanvas.width = labCanvas.clientWidth);
    let lH = (labCanvas.height = labCanvas.clientHeight);

    let activeExp = 'mesh';
    let speedVal = 50;
    let densityVal = 100;
    let time = 0;

    // Controls
    const speedInput = document.getElementById('lab-speed');
    const densityInput = document.getElementById('lab-density');
    const resetBtn = document.getElementById('lab-reset-btn');

    if (speedInput) speedInput.addEventListener('input', (e) => speedVal = e.target.value);
    if (densityInput) densityInput.addEventListener('input', (e) => densityVal = e.target.value);
    if (resetBtn) resetBtn.addEventListener('click', () => time = 0);

    const labTabs = document.querySelectorAll('.lab-tab');
    labTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        labTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeExp = tab.getAttribute('data-exp');
      });
    });

    let labMouseX = lW / 2;
    let labMouseY = lH / 2;

    labCanvas.addEventListener('mousemove', (e) => {
      const rect = labCanvas.getBoundingClientRect();
      labMouseX = e.clientX - rect.left;
      labMouseY = e.clientY - rect.top;
    });

    function drawLab() {
      lCtx.fillStyle = '#0A0A0A';
      lCtx.fillRect(0, 0, lW, lH);
      time += speedVal * 0.0005;

      if (activeExp === 'mesh') {
        const cols = 22;
        const rows = 12;
        const cellW = lW / cols;
        const cellH = lH / rows;

        lCtx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        lCtx.lineWidth = 1.5;

        for (let r = 0; r < rows; r++) {
          lCtx.beginPath();
          for (let c = 0; c < cols; c++) {
            const x = c * cellW;
            const y = r * cellH + Math.sin(c * 0.3 + time + r * 0.2) * 25;
            if (c === 0) lCtx.moveTo(x, y);
            else lCtx.lineTo(x, y);
          }
          lCtx.stroke();
        }
      } else if (activeExp === 'particles') {
        const count = parseInt(densityVal) * 1.5;
        lCtx.fillStyle = '#C084FC';

        for (let i = 0; i < count; i++) {
          const px = (Math.sin(i * 99 + time) * 0.5 + 0.5) * lW;
          const py = (Math.cos(i * 33 + time) * 0.5 + 0.5) * lH;

          const dx = px - labMouseX;
          const dy = py - labMouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = Math.max(0, 120 - dist) / 120;

          const finalX = px + (dx / (dist || 1)) * force * 40;
          const finalY = py + (dy / (dist || 1)) * force * 40;

          lCtx.beginPath();
          lCtx.arc(finalX, finalY, 2.5, 0, Math.PI * 2);
          lCtx.fill();
        }
      } else if (activeExp === 'shader') {
        const spacing = 30;

        for (let x = 0; x < lW; x += spacing) {
          for (let y = 0; y < lH; y += spacing) {
            const dx = x - labMouseX;
            const dy = y - labMouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const offset = Math.sin(dist * 0.05 - time * 4) * 8;

            lCtx.beginPath();
            lCtx.arc(x + offset, y + offset, 2.5, 0, Math.PI * 2);
            lCtx.fillStyle = dist < 100 ? '#A855F7' : '#FFFFFF';
            lCtx.fill();
          }
        }
      } else if (activeExp === 'morph') {
        lCtx.save();
        lCtx.translate(lW / 2, lH / 2);
        lCtx.rotate(time * 0.4);

        lCtx.strokeStyle = '#A855F7';
        lCtx.lineWidth = 3;

        const sides = Math.floor((Math.sin(time) * 0.5 + 0.5) * 4) + 3;
        const radius = 90;

        lCtx.beginPath();
        for (let i = 0; i < sides; i++) {
          const a = (i / sides) * Math.PI * 2;
          const sx = Math.cos(a) * radius;
          const sy = Math.sin(a) * radius;
          if (i === 0) lCtx.moveTo(sx, sy);
          else lCtx.lineTo(sx, sy);
        }
        lCtx.closePath();
        lCtx.stroke();
        lCtx.restore();
      }

      requestAnimationFrame(drawLab);
    }
    drawLab();
  }

  // --------------------------------------------------------------------------
  // 06. CASE STUDY MODAL & DIALOGS (WITH ARROW NAVIGATION & KEYBOARD CYCLING)
  // --------------------------------------------------------------------------
  const caseData = {
    1: {
      title: 'NEON CYBERNETICS',
      category: 'BRAND IDENTITY / VECTOR SYSTEM',
      year: '2025',
      img: 'assets/project_neon_cybernetics.webp',
      desc: 'Developed a comprehensive spatial 2D branding system and logo matrix for a quantum computing startup in Tokyo.',
      deliverables: ['Vector Polyhedron Logo', 'Brand Guidelines', 'Interactive Landing Layout', 'Product Packaging Dielines']
    },
    2: {
      title: 'SYNTHESIS EDITORIAL',
      category: 'EDITORIAL / KINETIC TYPE',
      year: '2025',
      img: 'assets/project_synthesis_editorial.webp',
      desc: 'High-fashion printed magazine layout combining brutalist grid architecture with custom kinetic display typefaces.',
      deliverables: ['180-page Hardcover Magazine', 'Display Typeface System', 'Editorial Poster Series']
    },
    3: {
      title: 'KINETIC PACKAGING',
      category: 'PACKAGING / DIELINE ARCHITECTURE',
      year: '2024',
      img: 'assets/project_kinetic_packaging.webp',
      desc: 'Tactile matte black and violet foil box packaging design for luxury cyber-wear accessories.',
      deliverables: ['2D Dieline Specifications', 'Foil Stamping Stencils', 'Unboxing UX Design']
    },
    4: {
      title: 'NEBULA DIGITAL SYSTEM',
      category: 'DIGITAL SCREEN / UI ARCHITECTURE',
      year: '2024',
      img: 'assets/project_nebula_ui.webp',
      desc: 'Dynamic dark mode dashboard component system engineered for real-time data metrics visualization.',
      deliverables: ['UI/UX Component System', 'Interface Architecture', 'Data Graphics Grid']
    },
    5: {
      title: 'METAVERSE ART DIRECTION',
      category: 'ART DIRECTION / EXHIBITION',
      year: '2026',
      img: 'assets/project_metaverse_art.webp',
      desc: 'Conceptualized and designed a full 2D & spatial graphic exhibition campaign for digital art collectors.',
      deliverables: ['Exhibition Layout Architecture', 'Campaign Posters', 'Promotional Film Titles']
    }
  };

  const caseModal = document.getElementById('case-study-modal');
  const caseContent = document.getElementById('case-study-content');
  const closeCaseBtn = document.getElementById('close-case-modal');

  let currentCaseId = 1;
  const totalCases = 5;

  function renderCaseModal(id) {
    currentCaseId = parseInt(id, 10) || 1;
    if (currentCaseId > totalCases) currentCaseId = 1;
    if (currentCaseId < 1) currentCaseId = totalCases;

    const data = caseData[currentCaseId];
    if (data && caseModal && caseContent) {
      caseContent.innerHTML = `
        <div class="modal-case-header">
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
            <span class="section-num">${data.category} // ${data.year}</span>
            <span class="section-num" style="color:var(--accent-light);">CASE STUDY ${currentCaseId} / ${totalCases}</span>
          </div>
          <h2 class="section-title" style="margin-top:0.4rem; font-size:1.8rem;">${data.title}</h2>
        </div>
        <div style="position:relative; margin:1.25rem 0;">
          <img src="${data.img}" alt="${data.title}" style="width:100%; height:320px; object-fit:cover; border-radius:16px; border:1px solid var(--border-subtle);">
        </div>
        <p style="font-size:1rem; color:var(--text-secondary); margin-bottom:1.25rem; line-height:1.6;">${data.desc}</p>
        <h4 style="font-family:var(--font-display); color:var(--accent-light); margin-bottom:0.6rem; letter-spacing:1px; font-size:0.85rem;">KEY DELIVERABLES</h4>
        <ul style="list-style:none; display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.5rem; padding:0;">
          ${data.deliverables.map(d => `<li style="padding:0.35rem 0.85rem; background:rgba(168,85,247,0.12); border:1px solid rgba(168,85,247,0.3); border-radius:20px; font-size:0.8rem; color:#fff;">${d}</li>`).join('')}
        </ul>
        <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.08); padding-top:1rem;">
          <button class="btn btn-glass btn-sm case-nav-btn" id="case-modal-prev" style="display:inline-flex; align-items:center; gap:0.5rem;">
            <i class="fa-solid fa-arrow-left"></i> PREVIOUS CASE
          </button>
          <button class="btn btn-glass btn-sm case-nav-btn" id="case-modal-next" style="display:inline-flex; align-items:center; gap:0.5rem;">
            NEXT CASE <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      `;
      caseModal.classList.add('active');

      const casePrev = document.getElementById('case-modal-prev');
      const caseNext = document.getElementById('case-modal-next');

      if (casePrev) casePrev.addEventListener('click', () => renderCaseModal(currentCaseId - 1));
      if (caseNext) caseNext.addEventListener('click', () => renderCaseModal(currentCaseId + 1));
    }
  }

  // Case Study modal disabled per user instruction (navigates to 404.html)

  if (closeCaseBtn && caseModal) {
    closeCaseBtn.addEventListener('click', () => caseModal.classList.remove('active'));
  }

  // Keydown Arrow Navigation inside open Case Study Modal
  window.addEventListener('keydown', (e) => {
    if (caseModal && caseModal.classList.contains('active')) {
      if (e.key === 'ArrowRight') {
        renderCaseModal(currentCaseId + 1);
      } else if (e.key === 'ArrowLeft') {
        renderCaseModal(currentCaseId - 1);
      } else if (e.key === 'Escape') {
        caseModal.classList.remove('active');
      }
    }
  });

  // Modals (Contact & Login)
  const contactModal = document.getElementById('contact-modal');
  const openContactBtn = document.getElementById('open-contact-modal');
  const closeContactBtn = document.getElementById('close-contact-modal');

  if (openContactBtn && contactModal) {
    openContactBtn.addEventListener('click', () => contactModal.classList.add('active'));
    if (closeContactBtn) closeContactBtn.addEventListener('click', () => contactModal.classList.remove('active'));
  }

  const loginModal = document.getElementById('login-modal');
  const openLoginBtn = document.getElementById('open-login-btn');
  const closeLoginBtn = document.getElementById('close-login-modal');

  if (openLoginBtn && loginModal) {
    openLoginBtn.addEventListener('click', () => loginModal.classList.add('active'));
    if (closeLoginBtn) closeLoginBtn.addEventListener('click', () => loginModal.classList.remove('active'));
  }

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('active');
    }
  });

  // Contact Form Service Chips Selector (.chip-btn)
  const chipBtns = document.querySelectorAll('.chip-btn');
  chipBtns.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
    });
  });

  // --------------------------------------------------------------------------
  // REDESIGNED FAQ ACCORDION OPEN / CLOSE ENGINE
  // --------------------------------------------------------------------------
  const redesignedFaqCards = document.querySelectorAll('.redesigned-faq-card');
  if (redesignedFaqCards.length > 0) {
    redesignedFaqCards.forEach((card) => {
      card.addEventListener('click', () => {
        const isCurrentlyActive = card.classList.contains('active');

        if (isCurrentlyActive) {
          card.classList.remove('active');
        } else {
          redesignedFaqCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // CREATIVE PROCESS INTERACTIVE ACCORDION & IMAGE SWITCHER (ABOUT PAGE)
  // --------------------------------------------------------------------------
  const processFaqCards = document.querySelectorAll('.process-faq-card');
  if (processFaqCards.length > 0) {
    processFaqCards.forEach((card) => {
      card.addEventListener('click', () => {
        const isCurrentlyActive = card.classList.contains('active');
        if (!isCurrentlyActive) {
          processFaqCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');

          const newImgSrc = card.getAttribute('data-img');
          const newBadgeHTML = card.getAttribute('data-badge');
          const imgEl = document.getElementById('process-active-img');
          const badgeEl = document.getElementById('process-img-badge');

          if (imgEl && newImgSrc) {
            imgEl.classList.add('fade-out');
            setTimeout(() => {
              imgEl.src = newImgSrc;
              if (badgeEl && newBadgeHTML) {
                badgeEl.innerHTML = newBadgeHTML;
              }
              imgEl.classList.remove('fade-out');
            }, 200);
          }
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // HORIZONTAL PROCESS TRACK ARROW NAVIGATION (CLEAN NATURAL VERTICAL SCROLLING)
  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------
  // PROJECTS PAGE INTERACTIVITY & ARROW CONTROLS
  // --------------------------------------------------------------------------

  // 1. CATEGORY FILTER NAVIGATION
  const catFilterBtns = document.querySelectorAll('.cat-filter-btn');
  const exCards = document.querySelectorAll('.ex-card');

  if (catFilterBtns.length > 0 && exCards.length > 0) {
    catFilterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        catFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        exCards.forEach((card) => {
          const cardCategories = card.getAttribute('data-category') || '';
          if (filterValue === 'all' || cardCategories.includes(filterValue)) {
            card.classList.remove('hidden');
            if (typeof gsap !== 'undefined') {
              gsap.fromTo(card, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
            }
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // 2. PROJECT WORLDS TABS SWITCHING
  const worldTabBtns = document.querySelectorAll('.world-tab-btn');
  const worldPanes = document.querySelectorAll('.world-pane');

  if (worldTabBtns.length > 0 && worldPanes.length > 0) {
    worldTabBtns.forEach((tab) => {
      tab.addEventListener('click', () => {
        worldTabBtns.forEach(t => t.classList.remove('active'));
        worldPanes.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetWorldId = tab.getAttribute('data-world');
        const targetPane = document.getElementById(targetWorldId);

        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }

  // 3. PROJECTS PROCESS TRACK HORIZONTAL SCROLL ARROWS & WHEEL INTERCEPTOR
  const projectsProcessSec = document.getElementById('projects-process');
  const projectsProcessTrack = document.getElementById('projects-process-track');
  const projectsPrevBtn = document.getElementById('projects-process-prev');
  const projectsNextBtn = document.getElementById('projects-process-next');

  if (projectsProcessTrack && projectsPrevBtn && projectsNextBtn) {
    projectsPrevBtn.addEventListener('click', () => {
      projectsProcessTrack.scrollBy({ left: -360, behavior: 'smooth' });
    });
    projectsNextBtn.addEventListener('click', () => {
      projectsProcessTrack.scrollBy({ left: 360, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 4. ANIMATED DESIGN STATS COUNTERS (SMOOTH SCROLL-TRIGGERED OBSERVER)
  // --------------------------------------------------------------------------
  const counterNums = document.querySelectorAll('.counter-num');
  if (counterNums.length > 0) {
    const animateCounter = (counter) => {
      if (counter.dataset.animated === 'true') return;
      counter.dataset.animated = 'true';

      const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
      const duration = 1600; // 1.6s duration
      const startTime = performance.now();

      function updateCount(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quadratic
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentVal = Math.floor(easeProgress * target);

        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateCount);
    };

    if ('IntersectionObserver' in window) {
      const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

      counterNums.forEach(counter => statsObserver.observe(counter));
    } else {
      counterNums.forEach(counter => animateCounter(counter));
    }
  }

  // 5. ARCHIVE FLOATING IMAGE HOVER PREVIEW - REMOVED PER INSTRUCTION
  // Popup previews disabled; only VIEW button carries cursor pointer.

  // --------------------------------------------------------------------------
  // 6. TESTIMONIAL SLIDER ENGINE (AUTO-PLAY, HOVER PAUSE, DOTS, ARROWS & SWIPE)
  // --------------------------------------------------------------------------
  const testimonialWrappers = document.querySelectorAll('.testimonial-slider-wrapper');

  testimonialWrappers.forEach((wrapper) => {
    const tSlides = wrapper.querySelectorAll('.testimonial-slide');
    const tPrevBtn = wrapper.querySelector('.prev-btn') || document.getElementById('testimonial-prev-btn');
    const tNextBtn = wrapper.querySelector('.next-btn') || document.getElementById('testimonial-next-btn');
    const tDots = wrapper.querySelectorAll('.dot');

    if (tSlides.length === 0) return;

    let currentTSlide = 0;
    let tAutoTimer = null;

    function showTSlide(index) {
      if (index >= tSlides.length) currentTSlide = 0;
      else if (index < 0) currentTSlide = tSlides.length - 1;
      else currentTSlide = index;

      tSlides.forEach((slide, i) => {
        if (i === currentTSlide) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });

      tDots.forEach((dot, i) => {
        if (i === currentTSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    function startTAuto() {
      stopTAuto();
      tAutoTimer = setInterval(() => {
        showTSlide(currentTSlide + 1);
      }, 5000);
    }

    function stopTAuto() {
      if (tAutoTimer) clearInterval(tAutoTimer);
    }

    if (tNextBtn) {
      tNextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showTSlide(currentTSlide + 1);
        startTAuto();
      });
    }

    if (tPrevBtn) {
      tPrevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showTSlide(currentTSlide - 1);
        startTAuto();
      });
    }

    tDots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        showTSlide(i);
        startTAuto();
      });
    });

    wrapper.addEventListener('mouseenter', stopTAuto);
    wrapper.addEventListener('mouseleave', startTAuto);

    // Touch Swipe Support
    let tTouchStartX = 0;
    let tTouchEndX = 0;

    wrapper.addEventListener('touchstart', (e) => {
      tTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      tTouchEndX = e.changedTouches[0].screenX;
      const diffX = tTouchStartX - tTouchEndX;
      if (Math.abs(diffX) > 40) {
        if (diffX > 0) showTSlide(currentTSlide + 1);
        else showTSlide(currentTSlide - 1);
        startTAuto();
      }
    }, { passive: true });

    startTAuto();
  });

  // --------------------------------------------------------------------------
  // 7. PROCESS CANVAS INTERACTIVE ANIMATION & STEP CONTROLS (INDEX PAGE)
  // --------------------------------------------------------------------------
  const processCanvas = document.getElementById('process-canvas');
  const stageSteps = document.querySelectorAll('.stage-step');

  if (processCanvas) {
    const ctx = processCanvas.getContext('2d');
    let width = processCanvas.clientWidth;
    let height = processCanvas.clientHeight;
    let currentStage = 1;

    function resizeCanvas() {
      if (!processCanvas) return;
      const rect = processCanvas.getBoundingClientRect();
      width = processCanvas.width = rect.width || 500;
      height = processCanvas.height = rect.height || 420;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle nodes definition
    const PARTICLE_COUNT = 45;
    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 2.5 + 1.5,
        color: i % 3 === 0 ? '#A855F7' : (i % 2 === 0 ? '#C084FC' : '#64748B')
      });
    }

    // Interactive stage configuration
    stageSteps.forEach((step) => {
      step.addEventListener('click', () => {
        stageSteps.forEach(s => s.classList.remove('active'));
        step.classList.add('active');
        currentStage = parseInt(step.getAttribute('data-stage'), 10) || 1;
      });
    });

    function drawProcessCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Dark background
      ctx.fillStyle = 'rgba(10, 10, 15, 0.9)';
      ctx.fillRect(0, 0, width, height);

      // Render Stage Specific Geometry under particles
      ctx.lineWidth = 1;

      if (currentStage === 1) { // Chaos
        particles.forEach(p => {
          p.x += (Math.random() - 0.5) * 2;
          p.y += (Math.random() - 0.5) * 2;
        });
      } else if (currentStage === 2) { // Concept / Wireframe
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.12)';
        const stepSize = 40;
        for (let x = 0; x < width; x += stepSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += stepSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (currentStage === 3) { // Design / Vectors
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.2)';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.18, 0, Math.PI * 2);
        ctx.stroke();
      } else if (currentStage === 4) { // Refine
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.35)';
        ctx.beginPath();
        ctx.moveTo(width / 2, height * 0.15);
        ctx.lineTo(width * 0.85, height / 2);
        ctx.lineTo(width / 2, height * 0.85);
        ctx.lineTo(width * 0.15, height / 2);
        ctx.closePath();
        ctx.stroke();
      } else if (currentStage === 5) { // Deliver
        ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 70 + Math.sin(Date.now() * 0.003) * 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)';
        ctx.stroke();
      }

      // Draw particle constellation connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        p1.x += p1.vx * (currentStage === 1 ? 2.5 : 1);
        p1.y += p1.vy * (currentStage === 1 ? 2.5 : 1);

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = currentStage >= 3 ? 120 : 90;

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / maxDist) * (currentStage === 5 ? 0.45 : 0.25);
            ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawProcessCanvas);
    }

    drawProcessCanvas();
  }
});
