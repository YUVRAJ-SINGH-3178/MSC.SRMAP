document.addEventListener('DOMContentLoaded', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // 1. PARTICLE CANVAS BACKGROUND
  // ──────────────────────────────────────────────────────────────────────────
  const canvas = document.getElementById('canvas-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const mouse = { x: null, y: null, radius: 130 };
    let animId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.4 + 0.8;
        this.baseAlpha = Math.random() * 0.22 + 0.08;
        this.alpha = this.baseAlpha;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 0.25;
            this.y += (dy / dist) * force * 0.25;
            this.alpha = Math.min(0.55, this.baseAlpha + force * 0.3);
          } else {
            if (this.alpha > this.baseAlpha) this.alpha -= 0.004;
          }
        } else {
          if (this.alpha > this.baseAlpha) this.alpha -= 0.004;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 120, 212, ${this.alpha})`;
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 20000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.update();
        p.draw();
      }

      // Draw connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 100) {
            const alpha = ((100 - dist) / 100) * 0.1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 120, 212, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(animate);
    }
    animate();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. CURSOR SPOTLIGHT FOR GLOW CARDS
  // ──────────────────────────────────────────────────────────────────────────
  const cards = document.querySelectorAll('.glow-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 3. CASSETTE EXPANSION — Click-to-expand drawers
  // ──────────────────────────────────────────────────────────────────────────
  const eventCards = document.querySelectorAll('.event-cassette');

  eventCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // Block expansion if clicking inside the drawer or on any link
      if (e.target.closest('.event-summary-drawer') || e.target.closest('a')) {
        return;
      }

      const wasExpanded = card.classList.contains('expanded');

      // Close all other cards first
      eventCards.forEach(other => {
        if (other !== card && other.classList.contains('expanded')) {
          other.classList.remove('expanded');
          const otherDrawer = other.querySelector('.event-summary-drawer');
          if (otherDrawer) otherDrawer.style.maxHeight = null;
        }
      });

      // Toggle current card
      card.classList.toggle('expanded');
      const drawer = card.querySelector('.event-summary-drawer');
      if (drawer) {
        if (!wasExpanded) {
          // Expanding — compute full height
          drawer.style.maxHeight = drawer.scrollHeight + 40 + 'px';
        } else {
          // Collapsing
          drawer.style.maxHeight = null;
        }
      }
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 4. CATEGORY FILTERING — Smooth fade in/out with filter pills
  // ──────────────────────────────────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Prevent event bubbling (in case filter bar is inside a card somehow)
      e.stopPropagation();

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      eventCards.forEach(card => {
        const category = card.getAttribute('data-category');

        // Close any expanded drawers during filter
        card.classList.remove('expanded');
        const drawer = card.querySelector('.event-summary-drawer');
        if (drawer) drawer.style.maxHeight = null;

        const shouldShow = (filterVal === 'all' || category === filterVal);

        if (shouldShow) {
          // Show
          card.classList.remove('filtered-out');
          card.style.display = '';
          // Force reflow for clean transition
          void card.offsetWidth;
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        } else {
          // Hide with fade
          card.classList.add('filtered-out');
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px) scale(0.97)';
          setTimeout(() => {
            if (card.classList.contains('filtered-out')) {
              card.style.display = 'none';
            }
          }, 380);
        }
      });
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 5. STAGGERED REVEAL ANIMATION — Cassettes fade in on page load
  // ──────────────────────────────────────────────────────────────────────────
  eventCards.forEach((card, idx) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(18px)';
    card.style.transition = 'opacity 0.55s ease, transform 0.55s var(--ease), border-color 0.3s ease, box-shadow 0.3s ease';
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, idx * 90 + 200);
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 6. FEATURED HERO BANNER — Smooth entrance
  // ──────────────────────────────────────────────────────────────────────────
  const hero = document.querySelector('.featured-event-hero');
  if (hero) {
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(20px)';
    hero.style.transition = 'opacity 0.7s ease, transform 0.7s var(--ease)';
    setTimeout(() => {
      hero.style.opacity = '1';
      hero.style.transform = 'translateY(0)';
    }, 120);
  }
});
