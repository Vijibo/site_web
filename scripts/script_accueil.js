/* ============================================
   SCRIPT ACCUEIL — Intro + Particules
   ============================================ */

// ── Intro machine à écrire ──
(function() {
  const text   = 'Victor Ji';
  const el     = document.getElementById('intro-typewriter');
  const screen = document.getElementById('intro-screen');
  const main   = document.getElementById('main-content');

  if (!el || !screen) return;

  let i = 0;
  const speed = 95; // ms par lettre

  function type() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(type, speed);
    } else {
      // Pause puis disparition
      setTimeout(() => {
        screen.classList.add('fade-out');
        // Affiche le main
        setTimeout(() => {
          screen.style.display = 'none';
          main.style.transition = 'opacity 0.6s ease';
          main.style.opacity = '1';
          // Déclenche les reveals
          document.querySelectorAll('.reveal').forEach(el => {
            revealObs.observe(el);
          });
        }, 800);
      }, 900);
    }
  }

  // Démarre après un court délai
  setTimeout(type, 400);

  // Observer pour reveals
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((e, idx) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), idx * 80);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

})();

// ── Particules canvas ──
(function() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = 55;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r  = Math.random() * 1.5 + 0.4;
      this.a  = Math.random() * 0.5 + 0.1;
      this.hue = Math.random() < 0.7 ? 238 : 220; // indigo ou bleu
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 70%, 70%, ${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99,102,241,${0.12 * (1 - d/130)})`;
          ctx.lineWidth   = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();