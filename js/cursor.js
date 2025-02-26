// Custom cursor implementation
class CustomCursor {
    constructor() {
      // Get cursor elements
      this.cursorDot = document.querySelector('.cursor-dot');
      this.cursorCircle = document.querySelector('.cursor-circle');
      this.cursorText = document.querySelector('.cursor-text');

      // Mouse position
      this.mouseX = 0;
      this.mouseY = 0;
      this.targetX = 0;
      this.targetY = 0;

      // Current state
      this.isVisible = false;
      this.isActive = false;
      this.currentCursorText = '';

      // Check if cursor elements exist (mobile devices may not have them)
      if (this.cursorDot && this.cursorCircle && this.cursorText) {
        this.init();
      }
    }

    init() {
      // Set initial state
      this.isVisible = true;

      // Check if we're on a touch device
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        this.hide();
        return;
      }

      // Add event listeners
      document.addEventListener('mousemove', this.onMouseMove.bind(this));
      document.addEventListener('mousedown', this.onMouseDown.bind(this));
      document.addEventListener('mouseup', this.onMouseUp.bind(this));
      document.addEventListener('mouseleave', this.onMouseLeave.bind(this));
      document.addEventListener('mouseenter', this.onMouseEnter.bind(this));

      // Track interactive elements
      this.trackInteractiveElements();

      // Start animation
      this.animate();
    }

    onMouseMove(e) {
      // Update target position
      this.targetX = e.clientX;
      this.targetY = e.clientY;
    }

    onMouseDown() {
      document.body.classList.add('cursor-active');

      // Scale down circle
      if (this.cursorCircle) {
        this.cursorCircle.style.transform = 'translate(-50%, -50%) scale(0.9)';
      }
    }

    onMouseUp() {
      document.body.classList.remove('cursor-active');

      // Reset circle scale
      if (this.cursorCircle) {
        this.cursorCircle.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    }

    onMouseLeave() {
      this.hide();
    }

    onMouseEnter() {
      this.show();
    }

    hide() {
      // Hide cursor
      if (this.isVisible) {
        document.body.classList.add('cursor-hidden');
        this.isVisible = false;
      }
    }

    show() {
      // Show cursor
      if (!this.isVisible) {
        document.body.classList.remove('cursor-hidden');
        this.isVisible = true;
      }
    }

    trackInteractiveElements() {
      // Hover effects for interactive elements
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [data-cursor-hover]');
      const textElements = document.querySelectorAll('[data-cursor-text]');

      // Add hover effect to interactive elements
      interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
          document.body.classList.add('cursor-hover');
        });

        element.addEventListener('mouseleave', () => {
          document.body.classList.remove('cursor-hover');
        });
      });

      // Add text display for elements with data-cursor-text
      textElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
          const text = element.getAttribute('data-cursor-text');
          this.showCursorText(text);
        });

        element.addEventListener('mouseleave', () => {
          this.hideCursorText();
        });
      });
    }

    showCursorText(text) {
      if (!this.cursorText) return;

      this.currentCursorText = text;
      this.cursorText.textContent = text;
      document.body.classList.add('cursor-text-visible');
    }

    hideCursorText() {
      if (!this.cursorText) return;

      this.currentCursorText = '';
      document.body.classList.remove('cursor-text-visible');
    }

    animate() {
      // Smooth mouse movement with lerp
      this.mouseX += (this.targetX - this.mouseX) * 0.15;
      this.mouseY += (this.targetY - this.mouseY) * 0.15;

      // Apply position to cursor elements
      if (this.cursorDot) {
        this.cursorDot.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
      }

      if (this.cursorCircle) {
        this.cursorCircle.style.transform = `translate(${this.mouseX}px, ${this.mouseY}px)`;
      }

      if (this.cursorText) {
        this.cursorText.style.transform = `translate(${this.mouseX}px, ${this.mouseY + 40}px)`;
      }

      // Continue animation loop
      requestAnimationFrame(this.animate.bind(this));
    }
  }

  // Initialize custom cursor when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const cursor = new CustomCursor();
  });