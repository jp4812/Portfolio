/**
 * ============================================================================
 * JEMIL PATEL — 3D PORTFOLIO INTERACTIVE CORE ENGINE
 * Features: Three.js WebGL Scene, Particle Systems, 3D Tilt Parallax,
 * Procedural Web Audio Synth, Custom 3D Cursor, Live CP Telemetry & AJAX Forms.
 * ============================================================================
 */

// ============================================================================
// 1. PROCEDURAL WEB AUDIO SYNTHESIZER ENGINE (Pure Web Audio API)
// ============================================================================
class SoundFXEngine {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('portfolio_audio_enabled') === 'true';
    this.initUI();
  }

  getAudioContext() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  initUI() {
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');

    if (this.enabled) {
      audioToggle?.classList.add('is-active');
      if (audioIcon) audioIcon.className = 'fa-solid fa-volume-high';
    }

    audioToggle?.addEventListener('click', () => {
      this.enabled = !this.enabled;
      localStorage.setItem('portfolio_audio_enabled', this.enabled);

      if (this.enabled) {
        this.getAudioContext();
        audioToggle.classList.add('is-active');
        if (audioIcon) audioIcon.className = 'fa-solid fa-volume-high';
        this.playTone(520, 0.08, 'sine');
      } else {
        audioToggle.classList.remove('is-active');
        if (audioIcon) audioIcon.className = 'fa-solid fa-volume-xmark';
      }
    });
  }

  playTone(freq = 440, duration = 0.08, type = 'sine', gainVal = 0.04) {
    if (!this.enabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, ctx.currentTime + duration);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  playClick() {
    this.playTone(680, 0.06, 'triangle', 0.05);
  }

  playHover() {
    this.playTone(380, 0.04, 'sine', 0.02);
  }
}

const soundFX = new SoundFXEngine();

// ============================================================================
// 2. THREE.JS 3D COMPUTE GRAPH & NEURAL DAG INTERACTIVE ENGINE
// ============================================================================
class ComputeGraphDAGScene {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    if (!this.canvas || typeof THREE === 'undefined') return;

    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, worldPos: new THREE.Vector3() };
    this.scrollProgress = 0;
    this.clock = new THREE.Clock();
    this.isVisible = true;

    // Node & Edge Configuration (Balanced Density & Visibility)
    this.nodeCount = 112;
    this.maxDistance = 8.4;
    this.maxEdges = 900;

    this.init();
  }

  init() {
    // 1. Scene with Deep Charcoal Fog for seamless depth fade
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070709);
    this.scene.fog = new THREE.FogExp2(0x070709, 0.024);

    // 2. Perspective Camera
    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 26);

    // 3. High-Performance WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Raycaster & Virtual 3D Cursor Plane
    this.raycaster = new THREE.Raycaster();
    this.cursorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    // 5. Construct Scene Layers
    this.createPerspectiveGrid();
    this.createComputeGraph();

    // 6. Bind Global Non-Blocking Listeners
    this.bindEvents();

    // 7. Launch 60+ FPS Render Loop
    this.animate();
  }

  // --------------------------------------------------------------------------
  // Base Perspective Grid (High-Tech Floor Horizon)
  // --------------------------------------------------------------------------
  createPerspectiveGrid() {
    const size = 160;
    const divisions = 45;
    // Dark steel grid (#1f2430) with electric coral center line (#ff4e50)
    const gridHelper = new THREE.GridHelper(size, divisions, 0xff4e50, 0x1f2430);
    gridHelper.position.y = -13.5;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.45;
    gridHelper.material.depthWrite = false;
    this.scene.add(gridHelper);
    this.grid = gridHelper;
  }

  // --------------------------------------------------------------------------
  // 3D Compute Graph / Neural DAG (Nodes & Dynamic Synaptic Edges)
  // --------------------------------------------------------------------------
  createComputeGraph() {
    this.nodes = [];
    const positions = new Float32Array(this.nodeCount * 3);
    const colors = new Float32Array(this.nodeCount * 3);
    const sizes = new Float32Array(this.nodeCount);

    const coralColor = new THREE.Color(0xff4e50); // Electric Coral / Orange
    const cyanColor = new THREE.Color(0x00f2fe);  // Neon Cyan / Teal
    const slateColor = new THREE.Color(0x8a99ad); // Visible Steel Slate Node

    for (let i = 0; i < this.nodeCount; i++) {
      const i3 = i * 3;

      // Balanced 3D Spatial Distribution across entire viewport
      const x = (Math.random() - 0.5) * 58;
      const y = (Math.random() - 0.5) * 38;
      const z = (Math.random() - 0.5) * 28;

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      // Thematic color distribution
      let nodeColor;
      let nodeWeight;
      const rand = Math.random();

      if (rand < 0.38) {
        nodeColor = coralColor;
        nodeWeight = 1.7;
      } else if (rand < 0.72) {
        nodeColor = cyanColor;
        nodeWeight = 1.4;
      } else {
        nodeColor = slateColor;
        nodeWeight = 1.1;
      }

      colors[i3] = nodeColor.r;
      colors[i3 + 1] = nodeColor.g;
      colors[i3 + 2] = nodeColor.b;
      sizes[i] = nodeWeight;

      this.nodes.push({
        pos: new THREE.Vector3(x, y, z),
        basePos: new THREE.Vector3(x, y, z),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.024,
          (Math.random() - 0.5) * 0.024,
          (Math.random() - 0.5) * 0.018
        ),
        impulse: new THREE.Vector3(),
        color: nodeColor,
        baseSize: nodeWeight,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Node Points Geometry
    this.nodesGeo = new THREE.BufferGeometry();
    this.nodesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.nodesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom Circular Glowing Sprite Map with crisp core
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.32, 'rgba(255, 120, 90, 0.9)');
    grad.addColorStop(0.68, 'rgba(0, 242, 254, 0.35)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    const spriteMap = new THREE.CanvasTexture(canvas);

    // Boosted Point Size (1.55px for clear presence)
    const nodesMat = new THREE.PointsMaterial({
      size: 1.55,
      map: spriteMap,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.pointsMesh = new THREE.Points(this.nodesGeo, nodesMat);
    this.scene.add(this.pointsMesh);

    // Dynamic Edge Connections (LineSegments)
    this.linePositions = new Float32Array(this.maxEdges * 6);
    this.lineColors = new Float32Array(this.maxEdges * 6);

    this.linesGeo = new THREE.BufferGeometry();
    this.linesGeo.setAttribute('position', new THREE.BufferAttribute(this.linePositions, 3));
    this.linesGeo.setAttribute('color', new THREE.BufferAttribute(this.lineColors, 3));

    // Boosted Line Visibility (crisp dark steel to electric coral/cyan)
    const linesMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.linesMesh = new THREE.LineSegments(this.linesGeo, linesMat);
    this.scene.add(this.linesMesh);
  }

  bindEvents() {
    // Non-blocking mouse coordinates tracking
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    // High-DPI & Responsive Window Resizing
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Content Panel Scroll Velocity Tracking
    const contentPanel = document.querySelector('.content-panel');
    const scrollTarget = contentPanel || window;
    scrollTarget.addEventListener('scroll', () => {
      const scrollHeight = (contentPanel ? contentPanel.scrollHeight - contentPanel.clientHeight : document.body.scrollHeight - window.innerHeight) || 1;
      const scrollTop = contentPanel ? contentPanel.scrollTop : window.scrollY;
      this.scrollProgress = scrollTop / scrollHeight;
    }, { passive: true });

    // Resource Optimization on Tab Switching
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
      if (this.isVisible) this.clock.start();
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    if (!this.isVisible) return;

    const elapsedTime = this.clock.getElapsedTime();

    // Smooth Mouse Coordinates Interpolation (Lerp)
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.06;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.06;

    // Unproject Mouse onto Virtual 3D Plane at Z=0 for Accurate 3D Cursor Physics
    this.raycaster.setFromCamera(new THREE.Vector2(this.mouse.x, this.mouse.y), this.camera);
    this.raycaster.ray.intersectPlane(this.cursorPlane, this.mouse.worldPos);

    // ------------------------------------------------------------------------
    // 1. Update 3D Compute Nodes (Drift, Impulse, Bounds)
    // ------------------------------------------------------------------------
    const nodePosAttr = this.nodesGeo.attributes.position;
    const nodePosArr = nodePosAttr.array;
    const mouseInfluenceRadius = 10.5; // Widened interaction radius

    for (let i = 0; i < this.nodeCount; i++) {
      const node = this.nodes[i];
      const i3 = i * 3;

      // Subtle organic harmonic drift
      node.pos.x += node.vel.x + Math.sin(elapsedTime * 0.6 + node.phase) * 0.008;
      node.pos.y += node.vel.y + Math.cos(elapsedTime * 0.5 + node.phase) * 0.008;
      node.pos.z += node.vel.z;

      // Soft Bounding Box wrapping across expanded viewport
      if (Math.abs(node.pos.x) > 30) node.vel.x *= -1;
      if (Math.abs(node.pos.y) > 20) node.vel.y *= -1;
      if (Math.abs(node.pos.z) > 15) node.vel.z *= -1;

      // 3D Cursor Gravitational / Repulsion Force Calculation
      if (this.mouse.worldPos) {
        const distToMouse = node.pos.distanceTo(this.mouse.worldPos);
        if (distToMouse < mouseInfluenceRadius) {
          const force = (1 - distToMouse / mouseInfluenceRadius) * 0.055;
          const dir = new THREE.Vector3().subVectors(node.pos, this.mouse.worldPos).normalize();
          node.impulse.addScaledVector(dir, force);
        }
      }

      // Apply and decay velocity impulse
      node.pos.add(node.impulse);
      node.impulse.multiplyScalar(0.93);

      nodePosArr[i3] = node.pos.x;
      nodePosArr[i3 + 1] = node.pos.y;
      nodePosArr[i3 + 2] = node.pos.z;
    }
    nodePosAttr.needsUpdate = true;

    // ------------------------------------------------------------------------
    // 2. Dynamic Euclidean Proximity Edges (Neural DAG Synapses)
    // ------------------------------------------------------------------------
    let edgeIndex = 0;
    const baseSlate = new THREE.Color(0x2d3748); // Boosted base edge visibility (#2d3748)
    const activeCoral = new THREE.Color(0xff4e50);
    const activeCyan = new THREE.Color(0x00f2fe);

    for (let i = 0; i < this.nodeCount && edgeIndex < this.maxEdges; i++) {
      for (let j = i + 1; j < this.nodeCount && edgeIndex < this.maxEdges; j++) {
        const nodeA = this.nodes[i];
        const nodeB = this.nodes[j];
        const dist = nodeA.pos.distanceTo(nodeB.pos);

        if (dist < this.maxDistance) {
          const idx = edgeIndex * 6;

          // Write Vertex 1
          this.linePositions[idx] = nodeA.pos.x;
          this.linePositions[idx + 1] = nodeA.pos.y;
          this.linePositions[idx + 2] = nodeA.pos.z;

          // Write Vertex 2
          this.linePositions[idx + 3] = nodeB.pos.x;
          this.linePositions[idx + 4] = nodeB.pos.y;
          this.linePositions[idx + 5] = nodeB.pos.z;

          // Proximity to mouse enhances edge luminescence to vibrant electric coral/cyan
          const midPoint = new THREE.Vector3().addVectors(nodeA.pos, nodeB.pos).multiplyScalar(0.5);
          const mouseDist = this.mouse.worldPos ? midPoint.distanceTo(this.mouse.worldPos) : 999;
          const isCursorActive = mouseDist < mouseInfluenceRadius;

          const edgeColorA = isCursorActive ? (i % 2 === 0 ? activeCoral : activeCyan) : baseSlate;
          const edgeColorB = isCursorActive ? (j % 2 === 0 ? activeCyan : activeCoral) : baseSlate;

          this.lineColors[idx] = edgeColorA.r;
          this.lineColors[idx + 1] = edgeColorA.g;
          this.lineColors[idx + 2] = edgeColorA.b;
          this.lineColors[idx + 3] = edgeColorB.r;
          this.lineColors[idx + 4] = edgeColorB.g;
          this.lineColors[idx + 5] = edgeColorB.b;

          edgeIndex++;
        }
      }
    }

    // Update draw range efficiently (prevents rendering stale geometry)
    this.linesGeo.setDrawRange(0, edgeIndex * 2);
    this.linesGeo.attributes.position.needsUpdate = true;
    this.linesGeo.attributes.color.needsUpdate = true;

    // ------------------------------------------------------------------------
    // 3. Perspective Grid Oscillation & Camera Dolly
    // ------------------------------------------------------------------------
    if (this.grid) {
      this.grid.position.z = (elapsedTime * 1.8) % (160 / 45);
    }

    // Smooth Camera Dolly & Depth Parallax
    this.camera.position.x += (this.mouse.x * 2.8 - this.camera.position.x) * 0.04;
    this.camera.position.y += (this.mouse.y * 2.2 - this.camera.position.y) * 0.04;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }
}

// ============================================================================
// 3. 3D CARD TILT & SPECULAR GLARE PARALLAX ENGINE
// ============================================================================
class CardTiltEngine {
  constructor() {
    this.cards = document.querySelectorAll('[data-tilt]');
    this.init();
  }

  init() {
    if (!this.cards.length) return;

    this.cards.forEach(card => {
      const maxTilt = parseFloat(card.getAttribute('data-tilt-max')) || 12;
      const hasGlare = card.getAttribute('data-tilt-glare') === 'true';

      let glareElement = null;
      if (hasGlare) {
        glareElement = document.createElement('div');
        glareElement.className = 'tilt-glare';
        card.appendChild(glareElement);
      }

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out';
        soundFX.playHover();
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;

        const rotateX = -(percentY * maxTilt);
        const rotateY = percentX * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        if (glareElement) {
          glareElement.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
          glareElement.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
          glareElement.style.setProperty('--glare-opacity', '0.6');
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

        if (glareElement) {
          glareElement.style.setProperty('--glare-opacity', '0');
        }
      });
    });
  }
}

// ============================================================================
// 4. CUSTOM 3D MAGNETIC CURSOR ENGINE
// ============================================================================
class CustomCursorEngine {
  constructor() {
    this.dot = document.getElementById('cursor-dot');
    this.ring = document.getElementById('cursor-ring');
    this.pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    this.mouse = { x: this.pos.x, y: this.pos.y };

    if (!this.dot || !this.ring) return;
    this.init();
  }

  init() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      // Central dot tracks instantly
      this.dot.style.transform = `translate(${this.mouse.x}px, ${this.mouse.y}px)`;
    });

    // Magnetic Interactive Targets
    const interactiveElements = document.querySelectorAll(
      'a, button, input, select, textarea, .skill-chip, .timeline-card, .cp-card, .metric-card, [data-magnetic]'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.ring.classList.add('is-hovered');
      });

      el.addEventListener('mouseleave', () => {
        this.ring.classList.remove('is-hovered');
      });

      el.addEventListener('click', () => {
        soundFX.playClick();
      });
    });

    this.render();
  }

  render() {
    // Smooth Lerp for ring trailing
    this.pos.x += (this.mouse.x - this.pos.x) * 0.18;
    this.pos.y += (this.mouse.y - this.pos.y) * 0.18;

    this.ring.style.transform = `translate(${this.pos.x}px, ${this.pos.y}px)`;

    requestAnimationFrame(() => this.render());
  }
}

// ============================================================================
// 5. RESPONSIVE NAVIGATION & DOCK HIGHLIGHTS
// ============================================================================
function setupNavigation() {
  const navHeader = document.querySelector('.nav-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const dockLinks = document.querySelectorAll('.dock a');
  const contentPanel = document.querySelector('.content-panel');

  if (menuToggle && navHeader) {
    const closeIconHidden = menuToggle.querySelector('.close-icon-hidden');
    const closeIconShown = menuToggle.querySelector('.close-icon-shown');

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navHeader.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', isOpen);

      if (closeIconHidden && closeIconShown) {
        closeIconHidden.style.display = isOpen ? 'none' : 'block';
        closeIconShown.style.display = isOpen ? 'block' : 'none';
      }
    });

    document.addEventListener('click', (e) => {
      if (navHeader.classList.contains('menu-open') && !navHeader.contains(e.target)) {
        navHeader.classList.remove('menu-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        if (closeIconHidden && closeIconShown) {
          closeIconHidden.style.display = 'block';
          closeIconShown.style.display = 'none';
        }
      }
    });
  }

  // Active link highlighters
  dockLinks.forEach(link => {
    link.addEventListener('click', () => {
      dockLinks.forEach(item => item.classList.remove('active-nav-route'));
      link.classList.add('active-nav-route');

      if (navHeader && navHeader.classList.contains('menu-open')) {
        navHeader.classList.remove('menu-open');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // IntersectionObserver for active section route tracking on scroll
  const sections = document.querySelectorAll('.panel-section');
  const observerOptions = {
    root: contentPanel || null,
    threshold: 0.3
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        dockLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            dockLinks.forEach(l => l.classList.remove('active-nav-route'));
            link.classList.add('active-nav-route');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));
}

// ============================================================================
// 6. SCROLL-DRIVEN INTERACTIVE TIMELINE REVEAL ENGINE
// ============================================================================
function setupTimelineAnimations() {
  const contentPanel = document.querySelector('.content-panel');
  const timelineShell = document.querySelector('.timeline-shell');
  const progressLine = document.querySelector('.timeline-progress-line');
  const timelineCards = document.querySelectorAll('.timeline-card');

  if (!timelineShell || !timelineCards.length) return;

  // 1. Intersection Observer for Scroll Triggering Cards & Milestone Nodes
  const observerOptions = {
    root: contentPanel || null,
    threshold: 0.2,
    rootMargin: "0px 0px -60px 0px"
  };

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        const node = entry.target.querySelector('.timeline-node, .timeline-dot');
        if (node) {
          node.classList.add('is-active', 'node-active');
        }
        soundFX.playHover();
      }
    });
  }, observerOptions);

  timelineCards.forEach((card) => {
    timelineObserver.observe(card);
  });

  // 2. Dynamic Central Spine Progress Tracker
  if (progressLine) {
    function updateTimelineSpine() {
      const rect = timelineShell.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const totalHeight = rect.height;

      const triggerPoint = viewportHeight * 0.75;
      const currentScroll = triggerPoint - rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalHeight));

      progressLine.style.setProperty('--line-height', `${(progress * 100).toFixed(1)}%`);
    }

    const scrollTarget = contentPanel || window;
    scrollTarget.addEventListener('scroll', updateTimelineSpine, { passive: true });
    window.addEventListener('resize', updateTimelineSpine, { passive: true });
    updateTimelineSpine();
  }
}

// ============================================================================
// 7. REAL-TIME COMPETITIVE PROGRAMMING TELEMETRY ENGINE
// ============================================================================
const LEETCODE_USERNAME = "emmi_2204";
const CODEFORCES_HANDLE = "jemil_4812";

function animateCounter(element, target, prefix = '') {
  if (!element) return;
  let current = 0;
  const duration = 1200;
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.innerText = `${prefix}${target}`;
      clearInterval(timer);
    } else {
      element.innerText = `${prefix}${Math.floor(current)}`;
    }
  }, stepTime);
}

async function fetchLiveCPStats() {
  let leetcodeSolved = 0;
  let codeforcesSolved = 0;

  // 1. LeetCode Solved Count
  try {
    const response = await fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME}/solved`);
    if (response.ok) {
      const data = await response.json();
      leetcodeSolved = data.solvedProblem || data.totalSolved || 0;
      animateCounter(document.getElementById('leetcode-count'), leetcodeSolved);
    } else {
      throw new Error('LeetCode response error');
    }
  } catch (error) {
    console.warn('LeetCode API fallback.', error);
    leetcodeSolved = 150;
    animateCounter(document.getElementById('leetcode-count'), leetcodeSolved, '+');
  }

  // 2. Codeforces Solved Count
  try {
    const response = await fetch(`https://codeforces.com/api/user.status?handle=${CODEFORCES_HANDLE}`);
    if (response.ok) {
      const data = await response.json();
      if (data.status === "OK") {
        const uniqueSolvedProblems = new Set();
        data.result.forEach(submission => {
          if (submission.verdict === "OK") {
            const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
            uniqueSolvedProblems.add(problemId);
          }
        });
        codeforcesSolved = uniqueSolvedProblems.size;
        animateCounter(document.getElementById('codeforces-count'), codeforcesSolved);
      }
    } else {
      throw new Error('Codeforces response error');
    }
  } catch (error) {
    console.warn('Codeforces API fallback.', error);
    codeforcesSolved = 50;
    animateCounter(document.getElementById('codeforces-count'), codeforcesSolved, '+');
  }

  // 3. Aggregate Total Solved
  const totalSolvedElement = document.getElementById('total-solved-count');
  if (totalSolvedElement) {
    setTimeout(() => {
      animateCounter(totalSolvedElement, leetcodeSolved + codeforcesSolved, '+');
    }, 300);
  }
}

// ============================================================================
// 8. AJAX CONTACT FORM SUBMISSION WITH WEB3FORMS
// ============================================================================
function setupContactForm() {
  const contactForm = document.querySelector('.contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  if (contactForm && formStatus && submitBtn) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Transmitting...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

      formStatus.style.display = "block";
      formStatus.style.color = "var(--text-muted)";
      formStatus.innerText = "Encrypting and transmitting payload...";

      const formData = new FormData(contactForm);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();

        if (response.status === 200 || result.success) {
          formStatus.style.color = "#4ade80";
          formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Transmission successful! Thank you for reaching out.';
          contactForm.reset();
          soundFX.playTone(880, 0.15, 'sine', 0.06);
        } else {
          throw new Error(result.message || "Submission failed");
        }
      } catch (error) {
        console.error('Submission error:', error);
        formStatus.style.color = "#f87171";
        formStatus.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Transmission failed. Please try again or email directly.';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Transmit Message</span> <i class="fa-solid fa-paper-plane"></i>';
      }
    });
  }
}

// ============================================================================
// 9. COLLAPSIBLE PROFILE SIDEBAR CONTROLLER (Mini-Rail Architecture)
// ============================================================================
function setupProfileSidebarToggle() {
  const sidebar = document.getElementById('profile-sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const toggleIcon = document.getElementById('sidebar-toggle-icon');

  if (!sidebar || !toggleBtn) return;

  // Restore persistent collapsed preference from localStorage
  const isCollapsed = localStorage.getItem('profile_sidebar_collapsed') === 'true';
  if (isCollapsed) {
    sidebar.classList.add('is-collapsed');
    toggleBtn.setAttribute('aria-expanded', 'false');
  } else {
    toggleBtn.setAttribute('aria-expanded', 'true');
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const collapsed = sidebar.classList.toggle('is-collapsed');
    toggleBtn.setAttribute('aria-expanded', String(!collapsed));
    localStorage.setItem('profile_sidebar_collapsed', String(collapsed));

    // Audio feedback
    soundFX.playTone(collapsed ? 480 : 640, 0.08, 'sine', 0.04);

    // Trigger smooth window resize for Three.js camera & GSAP ScrollTrigger
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    }, 400);
  });
}

// ============================================================================
// 10. INITIALIZATION BOOTSTRAPPER
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  new ComputeGraphDAGScene();
  new CardTiltEngine();
  new CustomCursorEngine();
  setupProfileSidebarToggle();
  setupNavigation();
  setupTimelineAnimations();
  fetchLiveCPStats();
  setupContactForm();
});