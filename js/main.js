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
});
