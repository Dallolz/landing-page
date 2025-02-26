// Scroll effects for NexAI landing page
class ScrollEffects {
  constructor() {
    // DOM elements
    this.header = document.querySelector('header');
    this.sections = document.querySelectorAll('.section');
    this.animatedElements = {
      hero: document.querySelectorAll('.animated-title .title-line'),
      services: document.querySelectorAll('.service-card'),
      approach: document.querySelectorAll('.approach-step'),
      useCases: document.querySelectorAll('.use-case-card'),
      headers: document.querySelectorAll('.section-header'),
      timeline: document.querySelector('.timeline-line')
    };

    // Scroll state
    this.lastScrollY = 0;
    this.scrollDirection = 'down';
    this.scrollThreshold = 50;
    this.ticking = false;

    // Check if GSAP and ScrollTrigger are loaded
    this.hasGSAP = typeof gsap !== 'undefined';
    this.hasScrollTrigger = this.hasGSAP && typeof ScrollTrigger !== 'undefined';

    // Initialize
    this.init();
  }

  init() {
    // Add scroll listener
    window.addEventListener('scroll', this.onScroll.bind(this));

    // Initial scroll position
    this.lastScrollY = window.scrollY;

    // Check if header should be visible initially
    this.updateHeaderVisibility();

    // Handle animations
    this.initializeAnimations();

    // Handle smooth scrolling for anchor links
    this.initializeSmoothScroll();

    // Manually trigger scroll once to set initial states
    this.onScroll();

    // Add all elements to reveal class for animation
    this.addRevealClasses();
  }

  addRevealClasses() {
    // Add reveal classes to all animated elements
    Object.values(this.animatedElements).forEach(elements => {
      if (NodeList.prototype.isPrototypeOf(elements)) {
        elements.forEach(el => {
          if (el) el.classList.add('reveal');
        });
      } else if (elements) {
        elements.classList.add('reveal');
      }
    });
  }

  onScroll() {
    // Request animation frame to optimize performance
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        // Calculate scroll direction
        const currentScrollY = window.scrollY;
        this.scrollDirection = currentScrollY > this.lastScrollY ? 'down' : 'up';

        // Update header visibility
        this.updateHeaderVisibility();

        // Check for inview elements if not using GSAP ScrollTrigger
        this.checkElementsInView();

        this.lastScrollY = currentScrollY;
        this.ticking = false;
      });

      this.ticking = true;
    }
  }

  updateHeaderVisibility() {
    if (!this.header) return;

    // Always show header at top of page
    if (window.scrollY <= 10) {
      this.header.classList.remove('hidden');
      this.header.classList.remove('scrolled');
      return;
    }

    // Add scrolled class when scrolling down
    if (window.scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }

    // Hide header when scrolling down, show when scrolling up
    if (this.scrollDirection === 'down' && window.scrollY > this.scrollThreshold) {
      this.header.classList.add('hidden');
    } else if (this.scrollDirection === 'up') {
      this.header.classList.remove('hidden');
    }
  }

  checkElementsInView() {
    // Process all sections for reveal animations
    const viewportHeight = window.innerHeight;

    // Check individual elements
    this.checkElementGroupInView(this.animatedElements.services, 0.15);
    this.checkElementGroupInView(this.animatedElements.approach, 0.1);
    this.checkElementGroupInView(this.animatedElements.useCases, 0.1);
    this.checkElementGroupInView(this.animatedElements.headers, 0.2);

    // Check timeline line
    if (this.animatedElements.timeline) {
      const timelineRect = this.animatedElements.timeline.getBoundingClientRect();
      if (timelineRect.top < viewportHeight * 0.8) {
        this.animatedElements.timeline.classList.add('revealed');
      }
    }
  }

  checkElementGroupInView(elements, staggerDelay = 0) {
    if (!elements || elements.length === 0) return;

    const viewportHeight = window.innerHeight;
    elements.forEach((element, index) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < viewportHeight * 0.85) {
        // Add delay based on index for staggered animation
        setTimeout(() => {
          element.classList.add('revealed');
        }, index * (staggerDelay * 1000));
      }
    });
  }

  initializeAnimations() {
    // Set up GSAP animations if available
    if (this.hasGSAP) {
      // Register ScrollTrigger plugin
      if (this.hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        // Setup animations
        this.setupGsapAnimations();
      }
    }

    // Nous n'appelons plus cette fonction qui causait le problème
    // this.wrapTitleTexts();
  }

  setupGsapAnimations() {
    if (!this.hasGSAP || !this.hasScrollTrigger) return;

    // Services section
    gsap.utils.toArray('.service-card').forEach((card, index) => {
      gsap.fromTo(card,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          delay: index * 0.15
        }
      );
    });

    // Approach steps
    gsap.utils.toArray('.approach-step').forEach((step, index) => {
      gsap.fromTo(step,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: step,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          delay: index * 0.1
        }
      );
    });

    // Timeline line
    gsap.fromTo('.timeline-line',
      { height: 0 },
      {
        height: '100%',
        duration: 1.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: '.approach-timeline',
          start: "top 70%",
          toggleActions: "play none none none"
        }
      }
    );

    // Use cases
    gsap.utils.toArray('.use-case-card').forEach((card, index) => {
      gsap.fromTo(card,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          delay: index * 0.15
        }
      );
    });

    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
      gsap.fromTo(header,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            toggleActions: "play none none none"
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
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: '.cta-section',
          start: "top 80%",
          toggleActions: "play none none none"
        }
      }
    );
  }

  initializeSmoothScroll() {
    // Get all anchor links that point to an ID
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Prevent default behavior
        e.preventDefault();

        // Get the target element
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
          // Get header height to offset scroll position
          const headerHeight = this.header ? this.header.offsetHeight : 0;

          // Scroll to element
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

          // Use smooth scroll if supported
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// Initialize scroll effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const scrollEffects = new ScrollEffects();
});