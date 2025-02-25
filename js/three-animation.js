// Three.js Animation for NexAI Landing Page

// Scene variables
let scene, camera, renderer;
let particles, particleSystem;
let raycaster, mouse;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;
let scrollY = 0;
let targetScrollY = 0;
let clock;

// Colors
const PARTICLE_COLOR_PRIMARY = 0x0064fa;
const PARTICLE_COLOR_SECONDARY = 0x00d5c8;
const BACKGROUND_COLOR = 0x0a0a1a;

// Initialize ThreeJS scene
function initThreeJS() {
  // Setup clock for consistent animations
  clock = new THREE.Clock();

  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(BACKGROUND_COLOR);

  // Setup camera
  const fov = 75;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 1000;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 30;

  // Setup renderer
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Add renderer to DOM
  const container = document.getElementById('canvas-container');
  container.appendChild(renderer.domElement);

  // Setup raycaster for interactivity
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Create the particle network
  createParticleNetwork();

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Setup event listeners
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('scroll', onScroll);

  // Start animation loop
  animate();
}

// Create particle network effect
function createParticleNetwork() {
  // Particle count based on screen size
  const particleCount = Math.min(
    2000,
    Math.max(1000, Math.floor(window.innerWidth * window.innerHeight / 1000))
  );

  // Create geometry
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  // Color gradient
  const color1 = new THREE.Color(PARTICLE_COLOR_PRIMARY);
  const color2 = new THREE.Color(PARTICLE_COLOR_SECONDARY);

  // Generate particles
  for (let i = 0; i < particleCount; i++) {
    // Position
    const x = (Math.random() - 0.5) * 80;
    const y = (Math.random() - 0.5) * 80;
    const z = (Math.random() - 0.5) * 80;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Color
    const mixRatio = Math.random();
    const particleColor = new THREE.Color().lerpColors(color1, color2, mixRatio);

    colors[i * 3] = particleColor.r;
    colors[i * 3 + 1] = particleColor.g;
    colors[i * 3 + 2] = particleColor.b;

    // Size
    sizes[i] = Math.random() * 2 + 0.5;
  }

  // Add attributes to geometry
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Create material
  const material = new THREE.ShaderMaterial({
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float time;

      void main() {
        vColor = color;

        // Add subtle movement
        vec3 pos = position;
        pos.y += sin(time * 0.2 + position.x * 0.05) * 0.5;
        pos.x += cos(time * 0.2 + position.z * 0.05) * 0.5;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;

      void main() {
        // Create a circular point
        float r = distance(gl_PointCoord, vec2(0.5, 0.5));
        if (r > 0.5) discard;

        // Add glow effect
        float glow = 1.0 - r * 2.0;
        glow = pow(glow, 1.5);

        gl_FragColor = vec4(vColor, glow);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      time: { value: 0 }
    }
  });

  // Create particle system
  particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Add connecting lines
  createConnectingLines(positions, particleCount);
}

// Create lines connecting nearby particles
function createConnectingLines(positions, particleCount) {
  // Line material
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x0064fa,
    transparent: true,
    opacity: 0.1,
    blending: THREE.AdditiveBlending
  });

  // Find close particles and connect them
  const linePositions = [];
  const maxConnections = 3000; // Limit connections for performance

  for (let i = 0; i < particleCount; i++) {
    const x1 = positions[i * 3];
    const y1 = positions[i * 3 + 1];
    const z1 = positions[i * 3 + 2];

    for (let j = i + 1; j < particleCount; j++) {
      const x2 = positions[j * 3];
      const y2 = positions[j * 3 + 1];
      const z2 = positions[j * 3 + 2];

      // Calculate distance between particles
      const distance = Math.sqrt(
        Math.pow(x2 - x1, 2) +
        Math.pow(y2 - y1, 2) +
        Math.pow(z2 - z1, 2)
      );

      // Connect if close enough
      if (distance < 10 && linePositions.length / 6 < maxConnections) {
        linePositions.push(x1, y1, z1);
        linePositions.push(x2, y2, z2);
      }
    }
  }

  // Create line geometry
  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

  // Create line segments
  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);
}

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle mouse movement
function onMouseMove(event) {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Set target rotation based on mouse position
  targetRotationY = mouse.x * 0.2;
  targetRotationX = mouse.y * 0.2;
}

// Handle scroll events
function onScroll() {
  targetScrollY = window.scrollY;
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsedTime = clock.getElapsedTime();

  // Update particle system shader time
  if (particleSystem && particleSystem.material.uniforms) {
    particleSystem.material.uniforms.time.value = elapsedTime;
  }

  // Smooth rotation towards target
  currentRotationX += (targetRotationX - currentRotationX) * 0.05;
  currentRotationY += (targetRotationY - currentRotationY) * 0.05;

  // Smooth scroll effect
  scrollY += (targetScrollY - scrollY) * 0.1;

  // Apply rotation based on mouse position
  if (particleSystem) {
    particleSystem.rotation.x = currentRotationX;
    particleSystem.rotation.y = currentRotationY;

    // Add scroll influence
    particleSystem.position.y = -scrollY * 0.003;

    // Add subtle motion
    particleSystem.rotation.z = Math.sin(elapsedTime * 0.1) * 0.02;
  }

  // Render scene
  renderer.render(scene, camera);
}

// Initialize on document load
window.addEventListener('DOMContentLoaded', initThreeJS);