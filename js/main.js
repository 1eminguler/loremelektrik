// main.js - Client-side interactions for Lorem Elektrik

document.addEventListener('DOMContentLoaded', () => {
  // Sticky Header scroll behavior
  const header = document.querySelector('.header');
  const scrollThreshold = 50;

  const handleScroll = () => {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // Mobile Menu Toggle
  const toggleBtn = document.querySelector('.header__toggle');
  const navMenu = document.querySelector('.header__nav');
  const navLinks = document.querySelectorAll('.header__link');

  const toggleMenu = () => {
    toggleBtn.classList.toggle('header__toggle--open');
    navMenu.classList.toggle('header__nav--open');
    document.body.style.overflow = navMenu.classList.contains('header__nav--open') ? 'hidden' : '';
  };

  toggleBtn.addEventListener('click', toggleMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('header__nav--open')) {
        toggleMenu();
      }
    });
  });

  // Scroll Reveal using Intersection Observer
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-on-scroll--active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // Contact Form Validation and Submission
  const contactForm = document.querySelector('.contact__form');
  const formMessage = document.querySelector('.form-message');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showFeedback(formMessage, 'Lütfen tüm zorunlu alanları doldurun.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFeedback(formMessage, 'Geçersiz bir e-posta adresi girdiniz.', 'error');
        return;
      }

      showFeedback(formMessage, 'Mesajınız başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.', 'success');
      contactForm.reset();
    });
  }

  // Consult Form Validation and Submission
  const consultForm = document.querySelector('.consult__form');
  const consultMessage = document.getElementById('consult-message');

  if (consultForm) {
    consultForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('consult-name').value.trim();
      const email = document.getElementById('consult-email').value.trim();
      const phone = document.getElementById('consult-phone').value.trim();
      const type = document.getElementById('consult-type').value;
      const details = document.getElementById('consult-details').value.trim();
      const fileInput = document.getElementById('consult-file');

      if (!name || !email || !phone || !type || !details) {
        showFeedback(consultMessage, 'Lütfen tüm alanları doldurun.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFeedback(consultMessage, 'Geçersiz bir e-posta adresi girdiniz.', 'error');
        return;
      }

      // Check file size if a file is uploaded
      if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const maxSizeBytes = 5 * 1024 * 1024; // 5MB

        if (file.size > maxSizeBytes) {
          showFeedback(consultMessage, 'Yüklenen dosya boyutu 5MB\'dan büyük olamaz.', 'error');
          return;
        }
      }

      showFeedback(consultMessage, 'Proje talebiniz ve dosyanız başarıyla alındı. Elektrikçimiz detaylı teklifle dönüş yapacaktır.', 'success');
      consultForm.reset();
    });
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showFeedback = (container, text, type) => {
    container.textContent = text;
    container.className = 'form-message'; // Clear types
    container.classList.add(`form-message--${type}`);
    
    if (type === 'error') {
      setTimeout(() => {
        container.style.display = 'none';
      }, 5000);
    }
  };

  // 5. Interactive Lightbulb Distance Glow Script
  const bulbContainer = document.getElementById('hero-bulb-container');
  if (bulbContainer) {
    const bulbGlow = bulbContainer.querySelector('.bulb-glow');
    const bulbFilament = bulbContainer.querySelector('.bulb-filament');
    const bulbRays = bulbContainer.querySelector('.bulb-rays');
    const bulbOutline = bulbContainer.querySelector('.bulb-outline');

    document.addEventListener('mousemove', (e) => {
      const rect = bulbContainer.getBoundingClientRect();
      const bulbX = rect.left + rect.width / 2;
      const bulbY = rect.top + rect.height / 2;

      const dx = e.clientX - bulbX;
      const dy = e.clientY - bulbY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Glow influence range is 400px
      const maxGlowDist = 400;
      let intensity = 0;
      if (distance < maxGlowDist) {
        intensity = (1 - (distance / maxGlowDist)) ** 2; // quadratic curve for smoother feel
      }

      // Add a tiny baseline glow so it's not pitch black
      const finalGlow = Math.max(intensity, 0.08);

      // Update elements dynamically
      bulbGlow.setAttribute('opacity', finalGlow * 0.9);
      bulbGlow.style.filter = `drop-shadow(0 0 ${finalGlow * 35}px var(--accent))`;
      
      if (intensity > 0.05) {
        bulbOutline.style.stroke = 'var(--accent)';
        bulbOutline.style.filter = `drop-shadow(0 0 ${intensity * 8}px var(--accent))`;
        bulbFilament.style.stroke = 'var(--accent)';
        bulbFilament.style.filter = `drop-shadow(0 0 ${intensity * 12}px var(--accent))`;
        bulbRays.style.opacity = intensity * 1.2;
      } else {
        bulbOutline.style.stroke = '#fff';
        bulbOutline.style.filter = 'none';
        bulbFilament.style.stroke = '#888';
        bulbFilament.style.filter = 'none';
        bulbRays.style.opacity = 0.1;
      }
    });
  }

  // 6. Glassmorphic Staggered Page/Section Transition
  const transitionOverlay = document.getElementById('glass-transition');
  const internalLinks = document.querySelectorAll('a[href^="#"]');
  let isTransitioning = false;

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      
      // Handle Ana Sayfa / Top scroll jump
      if (targetId === '#') {
        e.preventDefault();
        isTransitioning = true;
        
        transitionOverlay.classList.remove('glass-transition--active-out');
        transitionOverlay.classList.add('glass-transition--active');

        setTimeout(() => {
          document.documentElement.style.scrollBehavior = 'auto';
          window.scrollTo(0, 0);

          navLinks.forEach(l => l.classList.remove('header__link--active'));
          link.classList.add('header__link--active');
          document.documentElement.style.scrollBehavior = 'smooth';
        }, 450);

        setTimeout(() => {
          transitionOverlay.classList.add('glass-transition--active-out');
          transitionOverlay.classList.remove('glass-transition--active');
          isTransitioning = false;
        }, 850);
        return;
      }

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();
        isTransitioning = true;

        // 1. Slide columns down sequentially
        transitionOverlay.classList.remove('glass-transition--active-out');
        transitionOverlay.classList.add('glass-transition--active');

        // 2. Midway through transitions, teleport scroll instantly
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = 'auto';
          targetSection.scrollIntoView({ block: 'start' });

          // Update active link classes
          navLinks.forEach(l => l.classList.remove('header__link--active'));
          if (link.classList.contains('header__link')) {
            link.classList.add('header__link--active');
          }
          document.documentElement.style.scrollBehavior = 'smooth';
        }, 450);

        // 3. Slide columns out downwards
        setTimeout(() => {
          transitionOverlay.classList.add('glass-transition--active-out');
          transitionOverlay.classList.remove('glass-transition--active');
          isTransitioning = false;
        }, 850);
      }
    });
  });

  // 7. Scrollspy to dynamically update active header nav item on scroll
  const mainSections = document.querySelectorAll('main > section[id]');
  
  const updateActiveLink = () => {
    if (isTransitioning) return;
    const scrollPosition = window.scrollY + 160;

    // Force Ana Sayfa active when scrolled to the top
    if (window.scrollY < 200) {
      navLinks.forEach(link => {
        if (link.getAttribute('href') === '#') {
          link.classList.add('header__link--active');
        } else {
          link.classList.remove('header__link--active');
        }
      });
      return;
    }

    let activeSectionId = '';
    mainSections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPosition >= top && scrollPosition < top + height) {
        activeSectionId = section.getAttribute('id');
      }
    });

    if (activeSectionId) {
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${activeSectionId}`) {
          link.classList.add('header__link--active');
        } else {
          link.classList.remove('header__link--active');
        }
      });
    }
  };

  let scrollFrame;
  window.addEventListener('scroll', () => {
    if (scrollFrame) {
      window.cancelAnimationFrame(scrollFrame);
    }
    scrollFrame = window.requestAnimationFrame(updateActiveLink);
  });
  updateActiveLink(); // Initial check
});

