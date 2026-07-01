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
        showFeedback('Lütfen tüm zorunlu alanları doldurun.', 'error');
        return;
      }

      if (!isValidEmail(email)) {
        showFeedback('Geçersiz bir e-posta adresi girdiniz.', 'error');
        return;
      }

      // Simulate API submit
      showFeedback('Mesajınız başarıyla gönderildi. En kısa sürede sizinle iletişime geçeceğiz.', 'success');
      contactForm.reset();
    });
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showFeedback = (text, type) => {
    formMessage.textContent = text;
    formMessage.className = 'form-message'; // Clear types
    formMessage.classList.add(`form-message--${type}`);
    
    // Auto hide error after some time, success stays visible
    if (type === 'error') {
      setTimeout(() => {
        formMessage.style.display = 'none';
      }, 5000);
    }
  };

  // 5. Glassmorphic Page/Section Transition
  const transitionOverlay = document.getElementById('glass-transition');
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return; // Ignore empty jumps

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();

        // 1. Slide panels in (meet in the middle) and apply blur
        transitionOverlay.classList.add('glass-transition--active');

        // 2. Teleport scroll position instantly in the middle of transition
        setTimeout(() => {
          document.documentElement.style.scrollBehavior = 'auto';
          targetSection.scrollIntoView({ block: 'start' });

          // Update active link classes
          navLinks.forEach(l => l.classList.remove('header__link--active'));
          if (link.classList.contains('header__link')) {
            link.classList.add('header__link--active');
          }
          document.documentElement.style.scrollBehavior = 'smooth';
        }, 300);

        // 3. Slide panels away
        setTimeout(() => {
          transitionOverlay.classList.remove('glass-transition--active');
        }, 800);
      }
    });
  });
});

