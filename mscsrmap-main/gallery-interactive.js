document.addEventListener('DOMContentLoaded', () => {
  // ──────────────────────────────────────────────────────────────────────────
  // 0. HERO — WORD-BY-WORD REVEAL & STAGGERED ENTRANCE
  // ──────────────────────────────────────────────────────────────────────────
  const heroTitle = document.getElementById('heroTitle');
  if (heroTitle) {
    // Split hero title into word wraps while preserving HTML tags
    const rawHTML = heroTitle.innerHTML;
    // Process each text node, wrap words, preserve tags
    const fragment = document.createDocumentFragment();
    const temp = document.createElement('div');
    temp.innerHTML = rawHTML;

    function wrapWords(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        words.forEach(word => {
          if (/^\s+$/.test(word) || word === '') {
            // Keep whitespace as-is but handle line breaks
            if (word.includes('\n')) {
              // skip — <br> handles line breaks
            } else if (word.trim() === '') {
              frag.appendChild(document.createTextNode(word));
            }
          } else {
            const wrap = document.createElement('span');
            wrap.className = 'word-wrap';
            const inner = document.createElement('span');
            inner.textContent = word;
            wrap.appendChild(inner);
            frag.appendChild(wrap);
          }
        });
        return frag;
      }
      return null;
    }

    // Recursively process child nodes
    function processNode(parent, target) {
      Array.from(parent.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const wrapped = wrapWords(child);
          if (wrapped) target.appendChild(wrapped);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.tagName === 'BR') {
            target.appendChild(child.cloneNode());
          } else {
            const clone = document.createElement(child.tagName);
            // Copy attributes
            Array.from(child.attributes).forEach(attr => {
              clone.setAttribute(attr.name, attr.value);
            });
            processNode(child, clone);
            // Wrap the cloned element in a word-wrap
            const wrap = document.createElement('span');
            wrap.className = 'word-wrap';
            wrap.appendChild(clone);
            target.appendChild(wrap);
          }
        }
      });
    }

    heroTitle.innerHTML = '';
    processNode(temp, heroTitle);

    // Stagger reveal each word
    const wordSpans = heroTitle.querySelectorAll('.word-wrap > span');
    wordSpans.forEach((span, i) => {
      setTimeout(() => {
        span.classList.add('revealed');
      }, i * 100 + 400);
    });
  }

  // Hero label & subtitle entrance
  const heroLabel = document.querySelector('.exh-hero-label');
  const heroSub = document.querySelector('.exh-hero-subtitle');

  if (heroLabel) {
    setTimeout(() => {
      heroLabel.style.transition = 'opacity 0.7s ease, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
      heroLabel.style.opacity = '1';
      heroLabel.style.transform = 'translateY(0)';
    }, 200);
  }

  if (heroSub) {
    setTimeout(() => {
      heroSub.style.transition = 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      heroSub.style.opacity = '1';
      heroSub.style.transform = 'translateY(0)';
    }, 900);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 1. FILTER LOGIC — MAGNETIC SLIDER
  // ──────────────────────────────────────────────────────────────────────────
  const filterBar = document.getElementById('filterBar');
  const filterSlider = document.getElementById('filterSlider');
  const filterBtns = document.querySelectorAll('.exh-filter-pill');
  const cards = document.querySelectorAll('.exh-card');

  // Position the slider capsule on the active button
  function positionSlider(btn) {
    if (!filterSlider || !filterBar || !btn) return;
    const barRect = filterBar.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const offsetX = btnRect.left - barRect.left - 4; // subtract padding
    filterSlider.style.width = btnRect.width + 'px';
    filterSlider.style.transform = `translateX(${offsetX}px)`;
  }

  // Initialize slider on the active button
  const initialActive = filterBar?.querySelector('.exh-filter-pill.active');
  if (initialActive) {
    // Delay to ensure layout is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        positionSlider(initialActive);
      });
    });
  }

  // Reposition on resize
  window.addEventListener('resize', () => {
    const activeBtn = filterBar?.querySelector('.exh-filter-pill.active');
    if (activeBtn) positionSlider(activeBtn);
  });

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Slide the capsule
      positionSlider(btn);

      const filterVal = btn.getAttribute('data-filter');

      // Close lightbox if open
      closeLightbox();

      cards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        const show = (filterVal === 'all' || cat === filterVal);

        if (show) {
          card.classList.remove('filtered-out');
          card.style.display = '';
          void card.offsetWidth;
          card.style.opacity = '1';
          card.style.transform = '';
          card.style.pointerEvents = '';
          card.style.transition = 'opacity 0.5s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        } else {
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px) scale(0.95)';
          card.style.pointerEvents = 'none';
          setTimeout(() => {
            if (!show) {
              card.classList.add('filtered-out');
              card.style.display = 'none';
            }
          }, 380);
        }
      });
    });
  });

  // Filter bar entrance
  if (filterBar) {
    filterBar.style.opacity = '0';
    filterBar.style.transform = 'translateY(10px)';
    filterBar.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => {
      filterBar.style.opacity = '1';
      filterBar.style.transform = 'translateY(0)';
    }, 300);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 2. LIGHTBOX — CINEMATIC PROJECTOR
  // ──────────────────────────────────────────────────────────────────────────
  const lightbox = document.getElementById('exhLightbox');
  const lightboxImg = document.getElementById('exhLightboxImg');
  const lightboxClose = document.getElementById('exhLightboxClose');
  const lightboxBg = document.getElementById('exhLightboxBackdrop');
  const lightboxPrev = document.getElementById('exhLightboxPrev');
  const lightboxNext = document.getElementById('exhLightboxNext');
  const filmstrip = document.getElementById('exhFilmstrip');

  const panelTag = document.getElementById('exhPanelTag');
  const panelIdx = document.getElementById('exhPanelIdx');
  const panelTitle = document.getElementById('exhPanelTitle');
  const panelDate = document.getElementById('exhPanelDate');
  const panelDesc = document.getElementById('exhPanelDesc');
  const panelStats = document.getElementById('exhPanelStats');

  let visibleItems = [];
  let currentIndex = 0;

  function renderItem(card, animate = true) {
    if (!card) return;

    const imgUrl = card.getAttribute('data-image');
    const title = card.getAttribute('data-title');
    const cat = card.getAttribute('data-category');
    const idx = card.getAttribute('data-index');
    const date = card.getAttribute('data-date');
    const desc = card.getAttribute('data-desc');
    const stats = card.getAttribute('data-stats');

    // Image — crossfade + projector slide
    if (animate) {
      lightboxImg.classList.add('img-crossfade-out');
      setTimeout(() => {
        lightboxImg.src = imgUrl;
        lightboxImg.alt = title;
        lightboxImg.onload = () => {
          lightboxImg.classList.remove('img-crossfade-out');
          lightboxImg.style.animation = 'none';
          void lightboxImg.offsetWidth;
          lightboxImg.style.animation = 'projectorSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        };
      }, 200);
    } else {
      lightboxImg.src = imgUrl;
      lightboxImg.alt = title;
    }

    // Panel
    panelTag.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    panelIdx.textContent = `${String(visibleItems.indexOf(card) + 1).padStart(2, '0')} / ${String(visibleItems.length).padStart(2, '0')}`;
    panelTitle.innerHTML = title;
    panelDate.textContent = date;
    panelDesc.textContent = desc;

    // Tag + panel accent color
    const tagColors = { hackathon: '#34d399', workshop: 'var(--blue)', festival: '#a78bfa' };
    const color = tagColors[cat] || 'var(--blue)';
    panelTag.style.color = color;

    // Update panel accent line color
    const panel = document.querySelector('.exh-lightbox__panel');
    if (panel) {
      panel.style.setProperty('--accent-color', color);
    }

    // Stats
    panelStats.innerHTML = '';
    if (stats) {
      stats.split(';').forEach(pair => {
        const parts = pair.split(':');
        if (parts.length >= 2) {
          const label = parts[0].trim();
          const value = parts.slice(1).join(':').trim();
          const row = document.createElement('div');
          row.className = 'exh-panel__stat-row';
          row.innerHTML = `<dt>${label}</dt><dd>${value}</dd>`;
          panelStats.appendChild(row);
        }
      });
    }

    // Update filmstrip active state
    updateFilmstripActive();
  }

  // Build filmstrip thumbnails
  function buildFilmstrip() {
    if (!filmstrip) return;
    filmstrip.innerHTML = '';

    visibleItems.forEach((card, i) => {
      const thumb = document.createElement('div');
      thumb.className = 'exh-filmstrip__thumb';
      if (i === currentIndex) thumb.classList.add('active');

      const img = document.createElement('img');
      img.src = card.getAttribute('data-image');
      img.alt = card.getAttribute('data-title');
      img.loading = 'lazy';
      thumb.appendChild(img);

      thumb.addEventListener('click', () => {
        currentIndex = i;
        renderItem(visibleItems[currentIndex]);
      });

      filmstrip.appendChild(thumb);
    });
  }

  function updateFilmstripActive() {
    if (!filmstrip) return;
    const thumbs = filmstrip.querySelectorAll('.exh-filmstrip__thumb');
    thumbs.forEach((t, i) => {
      t.classList.toggle('active', i === currentIndex);
    });

    // Scroll active thumb into view
    const activeThumb = filmstrip.querySelector('.exh-filmstrip__thumb.active');
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  function openLightbox(card) {
    visibleItems = Array.from(cards).filter(c =>
      !c.classList.contains('filtered-out') && window.getComputedStyle(c).display !== 'none'
    );
    currentIndex = visibleItems.indexOf(card);
    if (currentIndex === -1) currentIndex = 0;

    renderItem(card, false);
    buildFilmstrip();

    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
    void lightbox.offsetWidth;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!lightbox.classList.contains('active')) {
        lightbox.style.display = 'none';
      }
    }, 450);
  }

  function navigate(dir) {
    if (visibleItems.length <= 1) return;
    currentIndex = dir === 'next'
      ? (currentIndex + 1) % visibleItems.length
      : (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    renderItem(visibleItems[currentIndex], true);
  }

  // Bind card clicks
  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      openLightbox(card);
    });
  });

  // Bind lightbox controls
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBg) lightboxBg.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => navigate('prev'));
  if (lightboxNext) lightboxNext.addEventListener('click', () => navigate('next'));

  // Keyboard
  window.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigate('next');
    if (e.key === 'ArrowLeft') navigate('prev');
  });

  // ──────────────────────────────────────────────────────────────────────────
  // 3. 3D TILT ENGINE + MAGNETIC CURSOR PULL
  // ──────────────────────────────────────────────────────────────────────────
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!isTouchDevice) {
    cards.forEach(card => {
      let tiltRAF = null;

      card.addEventListener('mousemove', (e) => {
        if (tiltRAF) cancelAnimationFrame(tiltRAF);

        tiltRAF = requestAnimationFrame(() => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          // Normalized -1 to 1
          const normalX = (x - centerX) / centerX;
          const normalY = (y - centerY) / centerY;

          // Tilt: max ±4 degrees
          const tiltX = -normalY * 4;
          const tiltY = normalX * 4;

          // Magnetic pull: max ±3px
          const pullX = normalX * 3;
          const pullY = normalY * 3;

          card.style.transform = `
            perspective(800px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            translateX(${pullX}px)
            translateY(${pullY}px)
            scale(1.02)
          `;
          card.style.transition = 'transform 0.1s ease-out, box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        });
      });

      card.addEventListener('mouseleave', () => {
        if (tiltRAF) cancelAnimationFrame(tiltRAF);
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = '';
      });
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 4. EXHIBITION WALL ENTRANCE — INTERSECTION OBSERVER
  // ──────────────────────────────────────────────────────────────────────────
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  // Mark all cards as entering
  cards.forEach(card => {
    card.classList.add('card-entering');
  });

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const card = entry.target;
        // Stagger based on visible index
        const allEntering = Array.from(document.querySelectorAll('.exh-card.card-entering'));
        const staggerIdx = allEntering.indexOf(card);
        const delay = Math.max(0, staggerIdx) * 100 + 100;

        setTimeout(() => {
          card.classList.remove('card-entering');
          card.classList.add('card-entered');
        }, delay);

        cardObserver.unobserve(card);
      }
    });
  }, observerOptions);

  cards.forEach(card => cardObserver.observe(card));

  // ──────────────────────────────────────────────────────────────────────────
  // 5. HORIZONTAL SCROLL PROGRESS & HINT FADE-OUT
  // ──────────────────────────────────────────────────────────────────────────
  const exhGrid = document.getElementById('exhGrid');
  const scrollFill = document.getElementById('exhScrollFill');
  const scrollHint = document.getElementById('exhScrollHint');

  if (exhGrid && scrollFill) {
    const updateScrollProgress = () => {
      const scrollLeft = exhGrid.scrollLeft;
      const scrollWidth = exhGrid.scrollWidth - exhGrid.clientWidth;
      if (scrollWidth > 0) {
        const progress = (scrollLeft / scrollWidth) * 100;
        scrollFill.style.width = `${progress}%`;
      } else {
        scrollFill.style.width = '0%';
      }
    };

    exhGrid.addEventListener('scroll', () => {
      updateScrollProgress();
      if (scrollHint && exhGrid.scrollLeft > 10) {
        scrollHint.classList.add('hidden');
      }
    });

    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 6. ELECTRIC BORDER INTEGRATION (React Bits adaptation)
  // ──────────────────────────────────────────────────────────────────────────
  function initElectricBorders() {
    cards.forEach(card => {
      // Setup DOM elements
      const canvasContainer = document.createElement('div');
      canvasContainer.className = 'eb-canvas-container';
      const canvas = document.createElement('canvas');
      canvas.className = 'eb-canvas';
      canvasContainer.appendChild(canvas);

      const layers = document.createElement('div');
      layers.className = 'eb-layers';
      const glow1 = document.createElement('div');
      glow1.className = 'eb-glow-1';
      const glow2 = document.createElement('div');
      glow2.className = 'eb-glow-2';
      const bgGlow = document.createElement('div');
      bgGlow.className = 'eb-background-glow';
      layers.appendChild(glow1);
      layers.appendChild(glow2);
      layers.appendChild(bgGlow);

      // Wrap the existing contents of the card in .eb-content
      const content = document.createElement('div');
      content.className = 'eb-content';
      
      // Move all current children (media, content) into eb-content
      while (card.firstChild) {
        content.appendChild(card.firstChild);
      }

      // Append new structure
      card.appendChild(canvasContainer);
      card.appendChild(layers);
      card.appendChild(content);

      // Animation & Canvas context
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const cat = card.getAttribute('data-category');
      let color = '#5227FF';
      if (cat === 'hackathon') color = '#34d399';
      else if (cat === 'workshop') color = '#0078d4';
      else if (cat === 'festival') color = '#a78bfa';

      const speed = 1.0;
      const chaos = 0.08; // smooth electric sparks
      const borderRadius = 12;

      const octaves = 4; // optimized from 10 for performance and smooth electric wavy paths
      const lacunarity = 1.6;
      const gain = 0.7;
      const amplitude = chaos;
      const frequency = 10;
      const baseFlatness = 0;
      const displacement = 50; // max displacement in pixels
      const borderOffset = 60;

      // Noise functions
      const random = x => {
        const sinVal = Math.sin(x * 12.9898) * 43758.5453;
        return sinVal - Math.floor(sinVal);
      };

      const noise2D = (x, y) => {
        const i = Math.floor(x);
        const j = Math.floor(y);
        const fx = x - i;
        const fy = y - j;

        const a = random(i + j * 57);
        const b = random(i + 1 + j * 57);
        const c = random(i + (j + 1) * 57);
        const d = random(i + 1 + (j + 1) * 57);

        const ux = fx * fx * (3.0 - 2.0 * fx);
        const uy = fy * fy * (3.0 - 2.0 * fy);

        return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
      };

      const octavedNoise = (x, oct, lac, g, baseAmp, baseFreq, t, seed, flatness) => {
        let val = 0;
        let amp = baseAmp;
        let freq = baseFreq;

        for (let i = 0; i < oct; i++) {
          let octaveAmplitude = amp;
          if (i === 0) octaveAmplitude *= flatness;
          val += octaveAmplitude * noise2D(freq * x + seed * 100, t * freq * 0.3);
          freq *= lac;
          amp *= g;
        }
        return val;
      };

      const getCornerPoint = (centerX, centerY, r, startAngle, arcLength, progress) => {
        const angle = startAngle + progress * arcLength;
        return {
          x: centerX + r * Math.cos(angle),
          y: centerY + r * Math.sin(angle)
        };
      };

      const getRoundedRectPoint = (t, left, top, w, h, r) => {
        const straightWidth = w - 2 * r;
        const straightHeight = h - 2 * r;
        const cornerArc = (Math.PI * r) / 2;
        const totalPerimeter = 2 * straightWidth + 2 * straightHeight + 4 * cornerArc;
        const distance = t * totalPerimeter;

        let acc = 0;

        // Top edge
        if (distance <= acc + straightWidth) {
          const progress = (distance - acc) / straightWidth;
          return { x: left + r + progress * straightWidth, y: top };
        }
        acc += straightWidth;

        // Top-right corner
        if (distance <= acc + cornerArc) {
          const progress = (distance - acc) / cornerArc;
          return getCornerPoint(left + w - r, top + r, r, -Math.PI / 2, Math.PI / 2, progress);
        }
        acc += cornerArc;

        // Right edge
        if (distance <= acc + straightHeight) {
          const progress = (distance - acc) / straightHeight;
          return { x: left + w, y: top + r + progress * straightHeight };
        }
        acc += straightHeight;

        // Bottom-right corner
        if (distance <= acc + cornerArc) {
          const progress = (distance - acc) / cornerArc;
          return getCornerPoint(left + w - r, top + h - r, r, 0, Math.PI / 2, progress);
        }
        acc += cornerArc;

        // Bottom edge
        if (distance <= acc + straightWidth) {
          const progress = (distance - acc) / straightWidth;
          return { x: left + w - r - progress * straightWidth, y: top + h };
        }
        acc += straightWidth;

        // Bottom-left corner
        if (distance <= acc + cornerArc) {
          const progress = (distance - acc) / cornerArc;
          return getCornerPoint(left + r, top + h - r, r, Math.PI / 2, Math.PI / 2, progress);
        }
        acc += cornerArc;

        // Left edge
        if (distance <= acc + straightHeight) {
          const progress = (distance - acc) / straightHeight;
          return { x: left, y: top + h - r - progress * straightHeight };
        }
        acc += straightHeight;

        // Top-left corner
        const progress = (distance - acc) / cornerArc;
        return getCornerPoint(left + r, top + r, r, Math.PI, Math.PI / 2, progress);
      };

      const updateSize = () => {
        const rect = card.getBoundingClientRect();
        const w = rect.width + borderOffset * 2;
        const h = rect.height + borderOffset * 2;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.scale(dpr, dpr);
        return { w, h };
      };

      let { w, h } = updateSize();
      let lastDpr = Math.min(window.devicePixelRatio || 1, 2);
      let time = 0;
      let lastFrameTime = 0;
      let animationFrameId = null;
      let isVisible = false;

      const drawElectricBorder = currentTime => {
        if (!isVisible) return; // Pause drawing loop if off-screen

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        if (dpr !== lastDpr) {
          lastDpr = dpr;
          const newSize = updateSize();
          w = newSize.w;
          h = newSize.h;
        }

        if (!lastFrameTime) lastFrameTime = currentTime;
        const deltaTime = (currentTime - lastFrameTime) / 1000;
        time += deltaTime * speed;
        lastFrameTime = currentTime;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.scale(dpr, dpr);

        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const scale = displacement;
        const left = borderOffset;
        const top = borderOffset;
        const borderWidth = w - 2 * borderOffset;
        const borderHeight = h - 2 * borderOffset;
        const maxRadius = Math.min(borderWidth, borderHeight) / 2;
        const r = Math.min(borderRadius, maxRadius);

        const approximatePerimeter = 2 * (borderWidth + borderHeight) + 2 * Math.PI * r;
        const sampleCount = Math.floor(approximatePerimeter / 4); // optimized sample spacing

        ctx.beginPath();

        for (let i = 0; i <= sampleCount; i++) {
          const progress = i / sampleCount;
          const point = getRoundedRectPoint(progress, left, top, borderWidth, borderHeight, r);

          const xNoise = octavedNoise(
            progress * 8,
            octaves,
            lacunarity,
            gain,
            amplitude,
            frequency,
            time,
            0,
            baseFlatness
          );

          const yNoise = octavedNoise(
            progress * 8,
            octaves,
            lacunarity,
            gain,
            amplitude,
            frequency,
            time,
            1,
            baseFlatness
          );

          const displacedX = point.x + xNoise * scale;
          const displacedY = point.y + yNoise * scale;

          if (i === 0) {
            ctx.moveTo(displacedX, displacedY);
          } else {
            ctx.lineTo(displacedX, displacedY);
          }
        }

        ctx.closePath();
        ctx.stroke();

        animationFrameId = requestAnimationFrame(drawElectricBorder);
      };

      // Intersection Observer to pause animation loop when card is off-screen
      const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (!isVisible) {
              isVisible = true;
              lastFrameTime = 0; // reset
              animationFrameId = requestAnimationFrame(drawElectricBorder);
            }
          } else {
            isVisible = false;
            if (animationFrameId) {
              cancelAnimationFrame(animationFrameId);
              animationFrameId = null;
            }
          }
        });
      }, {
        root: null,
        rootMargin: '100px', // start animating slightly before it scrolls into view
        threshold: 0
      });

      animObserver.observe(card);

      const resizeObserver = new ResizeObserver(() => {
        const newSize = updateSize();
        w = newSize.w;
        h = newSize.h;
      });
      resizeObserver.observe(card);
    });
  }

  // Run electric border initialization
  initElectricBorders();
});
