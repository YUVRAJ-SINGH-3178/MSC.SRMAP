document.addEventListener('DOMContentLoaded', () => {
  // 1. Particle Canvas Background
  const canvas = document.getElementById('canvas-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 130 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
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
        this.radius = Math.random() * 1.5 + 0.8;
        this.baseAlpha = Math.random() * 0.25 + 0.1;
        this.alpha = this.baseAlpha;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Mouse attraction/interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            // Gentle drift towards cursor
            this.x += (dx / dist) * force * 0.3;
            this.y += (dy / dist) * force * 0.3;
            this.alpha = Math.min(0.6, this.baseAlpha + force * 0.3);
          } else {
            if (this.alpha > this.baseAlpha) this.alpha -= 0.005;
          }
        } else {
          if (this.alpha > this.baseAlpha) this.alpha -= 0.005;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 120, 212, ${this.alpha})`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const count = Math.min(90, Math.floor((canvas.width * canvas.height) / 18000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };
    initParticles();
    window.addEventListener('resize', initParticles);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw thin lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < 110) {
            const alpha = ((110 - dist) / 110) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 120, 212, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    };
    animate();
  }

  // 2. Cursor Spotlight (Tilt & Highlight)
  const cards = document.querySelectorAll('.glow-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 3. Staggered Word Reveal (Custom Hero)
  const heroWords = document.querySelectorAll('.editorial-word');
  heroWords.forEach((word, idx) => {
    setTimeout(() => {
      word.classList.add('visible');
    }, idx * 100 + 200);
  });

  // 4. Blueprint Timeline Scroll Progression & In-view Reveals
  const timelinePhases = document.querySelectorAll('.timeline-phase');
  const progressLine = document.querySelector('.timeline-progress-fill');
  
  const handleScroll = () => {
    if (timelinePhases.length === 0) return;
    
    let activeIndex = -1;
    const triggerPoint = window.innerHeight * 0.7;

    timelinePhases.forEach((phase, index) => {
      const rect = phase.getBoundingClientRect();
      if (rect.top < triggerPoint) {
        phase.classList.add('in-view');
        activeIndex = index;
      }
    });

    if (progressLine && activeIndex !== -1) {
      const totalPhases = timelinePhases.length;
      const progressPercent = ((activeIndex + 1) / totalPhases) * 100;
      progressLine.style.height = `${progressPercent}%`;
    }
  };

  window.addEventListener('scroll', handleScroll);
  setTimeout(handleScroll, 100);

  // 5. Dynamic Stats Counter Simulation
  const counterElements = document.querySelectorAll('.stat-counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseInt(target.getAttribute('data-target'), 10);
        let current = 0;
        const duration = 1200; // ms
        const steps = 25;
        const increment = Math.ceil(targetVal / steps);
        const stepTime = duration / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= targetVal) {
            target.textContent = targetVal + "+";
            clearInterval(timer);
          } else {
            target.textContent = current;
          }
        }, stepTime);
        
        counterObserver.unobserve(target);
      }
    });
  }, { threshold: 0.4 });

  counterElements.forEach(el => counterObserver.observe(el));
});
