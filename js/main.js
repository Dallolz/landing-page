// Main JavaScript for NexAI landing page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavigation();
    initContactForm();
    initObservers();
  });

  document.addEventListener('DOMContentLoaded', function() {
  // S'assurer que le titre est animé indépendamment des autres scripts
  const titleLines = document.querySelectorAll('.title-animation');

  // Réinitialiser les styles pour s'assurer que l'animation se produit
  titleLines.forEach(line => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(40px)';
  });

  // Petite astuce pour forcer le navigateur à recalculer les styles
  setTimeout(() => {
    titleLines.forEach((line, index) => {
      // Nettoyer les styles inline pour permettre à l'animation CSS de fonctionner
      line.style.removeProperty('opacity');
      line.style.removeProperty('transform');
    });
  }, 100);
});

  // Mobile navigation
  function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links-container');

    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        // Toggle active class
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');

        // Toggle body scroll lock
        document.body.classList.toggle('nav-open');
      });

      // Close menu when clicking on links
      const links = navLinks.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', () => {
          navToggle.classList.remove('active');
          navLinks.classList.remove('active');
          document.body.classList.remove('nav-open');
        });
      });
    }
  }

  // Contact form handling
  function initContactForm() {
    const form = document.getElementById('contact-form');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const formObject = {};

        formData.forEach((value, key) => {
          formObject[key] = value;
        });

        // Log form data (in production, you would send this to a server)
        console.log('Form data:', formObject);

        // Show success state with animation
        showFormSuccess(form);
      });

      // Add float label functionality for inputs
      const formInputs = form.querySelectorAll('input, textarea');
      formInputs.forEach(input => {
        // Set initial state
        if (input.value.trim() !== '') {
          input.classList.add('has-value');
        }

        // Listen for focus and blur events
        input.addEventListener('focus', () => {
          input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
          input.parentElement.classList.remove('focused');

          // Check if input has value
          if (input.value.trim() !== '') {
            input.classList.add('has-value');
          } else {
            input.classList.remove('has-value');
          }
        });

        // Listen for input events
        input.addEventListener('input', () => {
          if (input.value.trim() !== '') {
            input.classList.add('has-value');
          } else {
            input.classList.remove('has-value');
          }
        });
      });
    }
  }

  // Show form success message
  function showFormSuccess(form) {
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.innerHTML = `
      <div class="success-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4ZM20 34L10 24L12.83 21.17L20 28.34L35.17 13.17L38 16L20 34Z" fill="currentColor"/>
        </svg>
      </div>
      <h3>Message envoyé !</h3>
      <p>Merci pour votre message. Notre équipe vous contactera dans les plus brefs délais.</p>
      <button type="button" class="cta-button primary send-another">Envoyer un autre message</button>
    `;

    // Hide form with animation
    form.style.opacity = '0';
    form.style.transform = 'translateY(20px)';

    // Show success message after animation
    setTimeout(() => {
      // Save form HTML to restore it later
      const formHTML = form.innerHTML;

      // Replace form with success message
      form.innerHTML = '';
      form.appendChild(successMessage);
      form.style.opacity = '1';
      form.style.transform = 'translateY(0)';

      // Listen for "send another" button click
      const resetButton = form.querySelector('.send-another');
      if (resetButton) {
        resetButton.addEventListener('click', () => {
          // Hide success message
          form.style.opacity = '0';
          form.style.transform = 'translateY(20px)';

          // Restore original form
          setTimeout(() => {
            form.innerHTML = formHTML;
            form.style.opacity = '1';
            form.style.transform = 'translateY(0)';

            // Re-initialize form
            initContactForm();
          }, 300);
        });
      }
    }, 300);
  }

  // Intersection Observer for revealing elements
  function initObservers() {
    if ('IntersectionObserver' in window) {
      // Create observers for different animation types
      createFadeInObserver();
      createProgressiveRevealObserver();
    }
  }

  // Create observer for standard fade-in animations
  function createFadeInObserver() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if (!fadeElements.length) return;

    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    });

    fadeElements.forEach(element => {
      fadeObserver.observe(element);
    });
  }

  // Create observer for progressive reveal animations
  function createProgressiveRevealObserver() {
    const progressiveElements = document.querySelectorAll('.progressive-reveal');

    if (!progressiveElements.length) return;

    const progressiveObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Get all child elements to animate
          const children = entry.target.children;

          // Animate each child with incremental delay
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('revealed');
            }, index * 100);
          });

          progressiveObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10% 0px'
    });

    progressiveElements.forEach(element => {
      progressiveObserver.observe(element);
    });
  }