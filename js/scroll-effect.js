// Scroll effects for NexAI landing page

// Initialize GSAP ScrollTrigger
function initScrollEffects() {
    // Only initialize if ScrollTrigger exists
    if (typeof gsap !== 'undefined' && gsap.registerPlugin && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);

      // Setup animations
      setupHeaderAnimation();
      setupSectionAnimations();
      setupParallaxEffects();
      setupScrollReveal();
    } else {
      console.warn('GSAP or ScrollTrigger not loaded. Animations may not work properly.');
    }
  }

  // Handle header state on scroll
  function setupHeaderAnimation() {
    // Navbar background change on scroll
    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      toggleClass: { className: 'scrolled', targets: '#navbar' }
    });

    // Hero section parallax
    gsap.to('.hero-content', {
      y: 100,
      opacity: 0.5,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // Animate sections as they come into view
  function setupSectionAnimations() {
    // Services cards
    gsap.utils.toArray('.service-card').forEach((card, i) => {
      gsap.fromTo(card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          delay: i * 0.1
        }
      );
    });

    // Timeline items
    gsap.utils.toArray('.timeline-item').forEach((item, i) => {
      gsap.fromTo(item,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          delay: i * 0.15
        }
      );
    });

    // Use case cards
    gsap.utils.toArray('.use-case-card').forEach((card, i) => {
      gsap.fromTo(card,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          delay: i * 0.1
        }
      );
    });

    // Value propositions
    gsap.utils.toArray('.value-prop').forEach((prop, i) => {
      gsap.fromTo(prop,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: prop,
            start: 'top 80%',
            toggleActions: 'play none none none'
          },
          delay: i * 0.1
        }
      );
    });

    // Section titles
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.fromTo(header,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // CTA section
    gsap.fromTo('.cta-content',
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 70%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // Create parallax scrolling effects
  function setupParallaxEffects() {
    // Parallax for section backgrounds
    gsap.utils.toArray('.section').forEach(section => {
      // Only if it has a background image
      if (section.classList.contains('bg-parallax')) {
        gsap.to(section, {
          backgroundPositionY: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      }
    });

    // Parallax for floating elements with different speeds
    gsap.utils.toArray('.parallax-slow').forEach(element => {
      gsap.to(element, {
        y: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: element.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    gsap.utils.toArray('.parallax-medium').forEach(element => {
      gsap.to(element, {
        y: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: element.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });

    gsap.utils.toArray('.parallax-fast').forEach(element => {
      gsap.to(element, {
        y: 25,
        ease: 'none',
        scrollTrigger: {
          trigger: element.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      });
    });
  }

  // Reveal elements on scroll
  function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    // Create observer configuration
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.1 // 10% of the item visible
    };

    // Create observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    // Observe all reveal elements
    revealElements.forEach(el => {
      observer.observe(el);
    });
  }

  // Initialize on load
  window.addEventListener('DOMContentLoaded', initScrollEffects);