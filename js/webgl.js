// WebGL Animation with Three.js for NexAI
class WebGLAnimation {
    constructor() {
      // Animation properties
      this.canvas = document.getElementById('webgl');
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.mouse = { x: 0, y: 0 };
      this.targetMouse = { x: 0, y: 0 };
      this.scrollY = 0;
      this.targetScrollY = 0;

      // Three.js objects
      this.scene = null;
      this.camera = null;
      this.renderer = null;
      this.clock = null;
      this.particles = null;
      this.geometries = [];
      this.materials = [];
      this.noiseTexture = null;

      // Colors
      this.colors = {
        bgColor: 0x080816,
        particleColor1: 0x0063fa, // Blue
        particleColor2: 0x00d4c8, // Teal
      };

      // Initialize
      this.init();
    }

    // Initialize Three.js scene
    init() {
      // Check if canvas exists
      if (!this.canvas) {
        console.error('WebGL canvas element not found');
        return;
      }

      // Setup clock for animation timing
      this.clock = new THREE.Clock();

      // Create scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(this.colors.bgColor);

      // Create camera
      this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 2000);
      this.camera.position.z = 500;

      // Create renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true
      });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Create particle field
      this.createParticleField();

      // Event listeners
      window.addEventListener('resize', this.onResize.bind(this));
      window.addEventListener('mousemove', this.onMouseMove.bind(this));
      window.addEventListener('scroll', this.onScroll.bind(this));

      // Start animation loop
      this.animate();

      // Show loading progress
      this.simulateLoading();
    }

    // Create particle field effect
    createParticleField() {
      // Particle count based on screen size
      const multiplier = Math.min(this.width, 1440) / 1440;
      const particleCount = Math.floor(2000 * multiplier);

      // Create particle geometry
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const scales = new Float32Array(particleCount);
      const opacities = new Float32Array(particleCount);
      const colors = new Float32Array(particleCount * 3);

      // Create particles in a 3D grid formation
      const range = 1200;
      const halfRange = range / 2;
      const color1 = new THREE.Color(this.colors.particleColor1);
      const color2 = new THREE.Color(this.colors.particleColor2);

      for (let i = 0; i < particleCount; i++) {
        // Position in 3D space with more concentration in center
        let x, y, z;
        const positionFactor = Math.random();

        if (positionFactor < 0.8) {
          // 80% of particles in a cube
          x = (Math.random() - 0.5) * range;
          y = (Math.random() - 0.5) * range;
          z = (Math.random() - 0.5) * range;
        } else {
          // 20% of particles in a sphere for a more concentrated look
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const r = halfRange * Math.cbrt(Math.random()); // Cube root for more uniform distribution

          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        }

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Scales vary based on position
        const distanceFromCenter = Math.sqrt(x*x + y*y + z*z);
        const normalizedDistance = Math.min(distanceFromCenter / halfRange, 1);
        scales[i] = (1 - (normalizedDistance * 0.5)) * (Math.random() * 2 + 2);

        // Opacity decreases with distance from center
        opacities[i] = Math.max(0.2, 1 - normalizedDistance);

        // Colors gradient between blue and teal
        const colorMix = normalizedDistance;
        const particleColor = new THREE.Color().lerpColors(color1, color2, colorMix);
        colors[i * 3] = particleColor.r;
        colors[i * 3 + 1] = particleColor.g;
        colors[i * 3 + 2] = particleColor.b;
      }

      // Add attributes to geometry
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
      geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      // Create shader material for particles
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pixelRatio: { value: this.renderer.getPixelRatio() }
        },
        vertexShader: `
          attribute float scale;
          attribute float opacity;
          attribute vec3 color;

          varying float vOpacity;
          varying vec3 vColor;

          uniform float time;
          uniform float pixelRatio;

          void main() {
            vOpacity = opacity;
            vColor = color;

            // Subtle movement based on position and time
            vec3 pos = position;
            float t = time * 0.15;

            // Create wave-like motion
            pos.x += sin(pos.y * 0.01 + t) * 5.0;
            pos.y += cos(pos.x * 0.01 + t) * 5.0;
            pos.z += sin(pos.x * 0.01 + pos.y * 0.01 + t) * 5.0;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

            // Calculate size based on scale and z-depth
            gl_PointSize = scale * (1500.0 / -mvPosition.z) * pixelRatio;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying float vOpacity;
          varying vec3 vColor;

          void main() {
            // Create soft, circular particles
            float r = length(gl_PointCoord - vec2(0.5, 0.5));
            if (r > 0.5) discard;

            // Soft edge
            float alpha = smoothstep(0.5, 0.4, r) * vOpacity;

            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      // Create particle system
      this.particles = new THREE.Points(geometry, material);
      this.scene.add(this.particles);

      // Add connecting lines between close particles
      this.createConnectingLines(positions, particleCount);
    }

    // Create lines connecting nearby particles
    createConnectingLines(positions, particleCount) {
      // Parameters
      const maxDistance = 150; // Max distance for connection
      const maxConnections = 3000; // Limit connections for performance

      // Arrays to store line positions
      const linePositions = [];
      const lineColors = [];
      const color1 = new THREE.Color(this.colors.particleColor1);
      const color2 = new THREE.Color(this.colors.particleColor2);

      // Find particles that are close to each other
      let connectionCount = 0;

      for (let i = 0; i < particleCount; i++) {
        const x1 = positions[i * 3];
        const y1 = positions[i * 3 + 1];
        const z1 = positions[i * 3 + 2];

        // Limit connections per particle for better performance
        let particleConnections = 0;
        const maxConnectionsPerParticle = 3;

        for (let j = i + 1; j < particleCount && particleConnections < maxConnectionsPerParticle; j++) {
          if (connectionCount >= maxConnections) break;

          const x2 = positions[j * 3];
          const y2 = positions[j * 3 + 1];
          const z2 = positions[j * 3 + 2];

          // Calculate distance between particles
          const dx = x2 - x1;
          const dy = y2 - y1;
          const dz = z2 - z1;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          // Connect if close enough
          if (distance < maxDistance) {
            linePositions.push(x1, y1, z1);
            linePositions.push(x2, y2, z2);

            // Calculate colors based on position
            const dist1 = Math.sqrt(x1*x1 + y1*y1 + z1*z1) / 600;
            const dist2 = Math.sqrt(x2*x2 + y2*y2 + z2*z2) / 600;

            const lineColor1 = new THREE.Color().lerpColors(color1, color2, dist1);
            const lineColor2 = new THREE.Color().lerpColors(color1, color2, dist2);

            lineColors.push(lineColor1.r, lineColor1.g, lineColor1.b);
            lineColors.push(lineColor2.r, lineColor2.g, lineColor2.b);

            connectionCount++;
            particleConnections++;
          }
        }
      }

      // Create line geometry
      const lineGeometry = new THREE.BufferGeometry();
      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

      // Create lines material
      const lineMaterial = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
      });

      // Create lines mesh
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      this.scene.add(lines);
    }

    // Handle window resize
    onResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;

      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(this.width, this.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      if (this.particles && this.particles.material.uniforms) {
        this.particles.material.uniforms.pixelRatio.value = this.renderer.getPixelRatio();
      }
    }

    // Handle mouse movement
    onMouseMove(event) {
      // Convert mouse position to normalized coordinates (-1 to 1)
      this.targetMouse.x = (event.clientX / this.width) * 2 - 1;
      this.targetMouse.y = -(event.clientY / this.height) * 2 + 1;
    }

    // Handle scroll
    onScroll() {
      this.targetScrollY = window.scrollY;
    }

    // Animation loop
    animate() {
      requestAnimationFrame(this.animate.bind(this));

      const elapsedTime = this.clock.getElapsedTime();
      const delta = this.clock.getDelta();

      // Smooth mouse movement with lerp
      this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.1;
      this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.1;

      // Smooth scroll with lerp
      this.scrollY += (this.targetScrollY - this.scrollY) * 0.1;

      // Update particle animation based on mouse and scroll
      if (this.particles) {
        // Update shader time
        if (this.particles.material.uniforms) {
          this.particles.material.uniforms.time.value = elapsedTime;
        }

        // Rotate particles based on mouse position and scroll
        this.particles.rotation.x = this.mouse.y * 0.2;
        this.particles.rotation.y = this.mouse.x * 0.2;

        // Move particles based on scroll
        const scrollFactor = this.scrollY * 0.0005;
        this.particles.position.y = -scrollFactor * 300;

        // Scale particles for parallax effect
        const scale = 1 + scrollFactor * 0.2;
        this.particles.scale.set(scale, scale, scale);
      }

      // Render scene
      this.renderer.render(this.scene, this.camera);
    }

    // Simulate loading progress
    simulateLoading() {
      const loader = document.querySelector('.loader');
      const progressBar = document.querySelector('.loader-bar');

      if (!loader || !progressBar) return;

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;

        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          // Hide loader after a small delay
          setTimeout(() => {
            loader.classList.add('hidden');

            // Remove loader from DOM after animation completes
            setTimeout(() => {
              loader.remove();
            }, 600);
          }, 500);
        }

        progressBar.style.width = `${progress}%`;
      }, 200);
    }
  }

  // Initialize WebGL animation when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const webgl = new WebGLAnimation();
  });