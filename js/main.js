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

  // 5. Interactive Electric Canvas (Hero)
  const canvas = document.getElementById('energy-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const particleCount = 45;
    const maxDistance = 100;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 2 + 1.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#eab308';
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw connecting electrical arcs
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.45;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(234, 179, 8, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      if (canvas.offsetWidth !== width || canvas.offsetHeight !== height) {
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;
      }
    });
  }

  // 6. AnimeJS Page/Section Transition (Left-to-Right Swipe)
  const transitionOverlay = document.getElementById('transition-wipe');
  const transitionPanel = document.querySelector('.transition-wipe__panel');
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return; // Ignore empty jumps

      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        e.preventDefault();

        // Prevent clicking other links during transition
        document.body.style.pointerEvents = 'none';

        // 1. Swipe in panel from left to right (to cover the screen)
        anime({
          targets: transitionPanel,
          left: ['-100vw', '0vw'],
          duration: 500,
          easing: 'easeInQuad',
          complete: () => {
            // 2. Teleport scroll position to target section instantly
            document.documentElement.style.scrollBehavior = 'auto';
            targetSection.scrollIntoView({ block: 'start' });

            // Update active link classes
            navLinks.forEach(l => l.classList.remove('header__link--active'));
            if (link.classList.contains('header__link')) {
              link.classList.add('header__link--active');
            }
            document.documentElement.style.scrollBehavior = 'smooth';

            // 3. Swipe out panel to the right (to reveal the target section)
            anime({
              targets: transitionPanel,
              left: ['0vw', '100vw'],
              duration: 500,
              easing: 'easeOutQuad',
              complete: () => {
                // Reset panel position for next run
                transitionPanel.style.left = '-100vw';
                document.body.style.pointerEvents = '';
              }
            });
          }
        });
      }
    });
  });

  // 7. Hero Entry Animation with AnimeJS
  const heroLeft = document.querySelector('.hero__split-left');
  const heroRight = document.querySelector('.hero__split-right');
  const heroDivider = document.querySelector('.hero__divider');

  if (heroLeft && heroRight && heroDivider) {
    // Set initial styles for animation
    heroLeft.style.opacity = 0;
    heroRight.style.opacity = 0;
    heroDivider.style.opacity = 0;

    // Timeline for coordinated slide-in split
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      duration: 1000
    });

    tl.add({
      targets: heroLeft,
      translateX: [-100, 0],
      opacity: [0, 1],
      duration: 800
    })
    .add({
      targets: heroRight,
      translateX: [100, 0],
      opacity: [0, 1],
      duration: 800
    }, '-=600')
    .add({
      targets: heroDivider,
      scaleY: [0, 1],
      opacity: [0, 1],
      duration: 600
    }, '-=600');
  }
});

