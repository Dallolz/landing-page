// Main JavaScript for NexAI landing page

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initMobileNav();

    // Initialize smooth scrolling
    initSmoothScroll();

    // Initialize contact form
    initContactForm();

    // Initialize any other components
    initComponents();
  });

  // Mobile navigation toggle
  function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!navToggle || !navLinks) return;

    // Toggle navigation
    navToggle.addEventListener('click', function() {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking on links
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Smooth scrolling to anchors
  function initSmoothScroll() {
    // Get all links that hash to an element
    const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    scrollLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Prevent default anchor click behavior
        e.preventDefault();

        // Get the target element
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (!targetElement) return;

        // Calculate header height for offset
        const headerHeight = document.querySelector('nav').offsetHeight;

        // Get position of the target element
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        // Smooth scroll to target
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  // Contact form handling
  function initContactForm() {
    const form = document.getElementById('contact-form');

    if (!form) return;

    form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(form);
      const formObject = {};

      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      // Here you would typically send the data to your server
      // For demonstration purposes, we'll just log it and show a success message
      console.log('Form submitted with data:', formObject);

      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'form-success';
      successMsg.innerHTML = `
        <h3>Merci pour votre message!</h3>
        <p>Nous vous répondrons dans les plus brefs délais.</p>
      `;

      // Replace form with success message
      form.innerHTML = '';
      form.appendChild(successMsg);
    });
  }

  // Initialize other components
  function initComponents() {
    // Add active class to current section in navigation
    highlightCurrentSection();

    // Initialize counter animations
    initCounters();
  }

  // Highlight current section in navigation
  function highlightCurrentSection() {
    // Get all sections that have an ID
    const sections = document.querySelectorAll('section[id]');

    // Listen for scroll events
    window.addEventListener('scroll', function() {
      // Get current scroll position
      const scrollY = window.pageYOffset;

      // Loop through sections to determine which one is in view
      sections.forEach(section => {
        const sectionId = section.getAttribute('id');
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100; // Offset for header

        // Check if the section is in view
        if (scrollY > sectionTop && scrollY < sectionTop + sectionHeight) {
          // Remove active class from all links
          document.querySelectorAll('.nav-links a').forEach(link => {
            link.classList.remove('active');
          });

          // Add active class to corresponding navigation link
          const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    });
  }

  // Initialize counter animations
  function initCounters() {
    const counters = document.querySelectorAll('.counter');

    if (!counters.length) return;

    // Create observer
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target'));
          const speed = parseInt(counter.getAttribute('data-speed') || '200');
          let count = 0;

          const updateCount = () => {
            const increment = target / speed;

            if (count < target) {
              count += increment;
              counter.innerText = Math.ceil(count);
              setTimeout(updateCount, 1);
            } else {
              counter.innerText = target;
            }
          };

          updateCount();
          observer.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    // Observe all counters
    counters.forEach(counter => {
      observer.observe(counter);
    });
  }