/* ============================================
   SCRIPT ACCUEIL — Particules
   ============================================ */

// ── Particules canvas ──
(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let W = 0, H = 0, particles = [];
  let animationFrame = 0;
  let lastFrameTime = 0;
  const frameInterval = 1000 / 30;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let reducedMotion = motionPreference.matches;

  class Particle {
    constructor() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.22;
      this.vy = (Math.random() - 0.5) * 0.22;
      this.r = Math.random() * 1.25 + 0.6;
      this.alpha = Math.random() * 0.38 + 0.36;
      this.hue = Math.random() < 0.65 ? 190 : 275;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -4 || this.x > W + 4) this.vx *= -1;
      if (this.y < -4 || this.y > H + 4) this.vy *= -1;
    }

    draw() {
      const color = this.hue < 230 ? '76, 226, 255' : '183, 126, 255';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  function resize() {
    W = window.innerWidth;
    H = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.max(28, Math.min(78, Math.round((W * H) / 26000)));
    particles = Array.from({ length: count }, () => new Particle());

    render();
    if (!reducedMotion && !document.hidden) startAnimation();
  }

  function drawConnections() {
    const colors = [
      '76, 226, 255',
      '183, 126, 255'
    ];
    const alphaLevels = [0.07, 0.14, 0.22];
    const paths = colors.map(() => alphaLevels.map(() => new Path2D()));
    const maxDistance = 145;
    const maxDistanceSquared = maxDistance * maxDistance;

    for (let i = 0; i < particles.length; i++) {
      const first = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const second = particles[j];
        const dx = first.x - second.x;
        const dy = first.y - second.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared >= maxDistanceSquared) continue;

        const level = distanceSquared < maxDistanceSquared * 0.2 ? 2 :
          distanceSquared < maxDistanceSquared * 0.55 ? 1 : 0;
        const colorIndex = first.hue < 230 ? 0 : 1;
        paths[colorIndex][level].moveTo(first.x, first.y);
        paths[colorIndex][level].lineTo(second.x, second.y);
      }
    }

    ctx.lineWidth = 0.7;
    colors.forEach((color, colorIndex) => {
      alphaLevels.forEach((alpha, level) => {
        ctx.strokeStyle = `rgba(${color}, ${alpha})`;
        ctx.stroke(paths[colorIndex][level]);
      });
    });
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter';
    particles.forEach(particle => {
      particle.draw();
    });
    drawConnections();
    ctx.globalCompositeOperation = 'source-over';
  }

  function animate(time) {
    if (time - lastFrameTime >= frameInterval) {
      lastFrameTime = time;
      particles.forEach(particle => particle.update());
      render();
    }
    animationFrame = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (!animationFrame) {
      lastFrameTime = 0;
      animationFrame = requestAnimationFrame(animate);
    }
  }

  function stopAnimation() {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAnimation();
    } else if (!reducedMotion) {
      startAnimation();
    }
  });

  motionPreference.addEventListener('change', event => {
    reducedMotion = event.matches;
    if (reducedMotion) {
      stopAnimation();
    } else if (!document.hidden) {
      startAnimation();
    }
  });

  window.addEventListener('resize', resize);
  resize();
})();