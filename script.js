// ── CAKE POP CLICK EFFECT ──────────────────────────────────────────
const CAKE_POPS = ['🍭','🎂','🧁','🍩','🍪','🍫','🍬','🎀','✨','🌸','🍰','🥐'];

document.addEventListener('click', function(e) {
  const count = 8 + Math.floor(Math.random() * 5);
  for (let i = 0; i < count; i++) spawnPop(e.clientX, e.clientY, i, count);
  spawnRing(e.clientX, e.clientY);
});

function spawnPop(x, y, index, total) {
  const pop = document.createElement('div');
  pop.textContent = CAKE_POPS[Math.floor(Math.random() * CAKE_POPS.length)];
  const angle = (360 / total) * index + Math.random() * 20;
  const dist  = 55 + Math.random() * 90;
  const rad   = angle * Math.PI / 180;
  const dx    = Math.cos(rad) * dist;
  const dy    = Math.sin(rad) * dist;
  const size  = 18 + Math.random() * 16;
  const dur   = 700 + Math.random() * 400;
  pop.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;font-size:${size}px;
    pointer-events:none;z-index:99999;
    transform:translate(-50%,-50%);
    transition:transform ${dur}ms cubic-bezier(.2,.8,.4,1),opacity ${dur}ms ease;
    opacity:1;user-select:none;`;
  document.body.appendChild(pop);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    pop.style.transform = `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0.2) rotate(${Math.random()*400}deg)`;
    pop.style.opacity   = '0';
  }));
  setTimeout(() => pop.remove(), dur + 50);
}

function spawnRing(x, y) {
  const ring = document.createElement('div');
  ring.style.cssText = `
    position:fixed;left:${x}px;top:${y}px;
    width:12px;height:12px;
    border:3px solid #f472b6;border-radius:50%;
    pointer-events:none;z-index:99998;
    transform:translate(-50%,-50%) scale(1);opacity:0.9;
    transition:transform 550ms ease-out,opacity 550ms ease-out;`;
  document.body.appendChild(ring);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    ring.style.transform = 'translate(-50%,-50%) scale(9)';
    ring.style.opacity   = '0';
  }));
  setTimeout(() => ring.remove(), 600);
}

// ── FLOATING SUGAR PARTICLES ───────────────────────────────────────
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'sugar-canvas';
  canvas.style.cssText = `
    position:fixed;inset:0;width:100%;height:100%;
    pointer-events:none;z-index:0;opacity:0.55;`;
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  const SYMBOLS = ['✦','·','∗','❋','✿','◦','∘','❅','•'];
  const COLORS  = ['#f9a8d4','#fcd34d','#a7f3d0','#fbcfe8','#fed7aa','#e9d5ff','#ffffff'];

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  function createParticle() {
    return {
      x:       Math.random() * W,
      y:       H + 20,
      symbol:  SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
      size:    10 + Math.random() * 16,
      speedY:  0.4 + Math.random() * 0.7,
      speedX:  (Math.random() - 0.5) * 0.5,
      opacity: 0.4 + Math.random() * 0.5,
      drift:   Math.random() * Math.PI * 2,
      driftS:  0.008 + Math.random() * 0.012,
      life:    0,
    };
  }

  // seed initial particles spread across screen
  for (let i = 0; i < 55; i++) {
    const p = createParticle();
    p.y = Math.random() * H;
    p.life = Math.random() * 300;
    particles.push(p);
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    // spawn new ones gently
    if (frame % 18 === 0 && particles.length < 70) {
      particles.push(createParticle());
    }

    particles = particles.filter(p => {
      p.life++;
      p.y  -= p.speedY;
      p.x  += p.speedX + Math.sin(p.drift + p.life * p.driftS) * 0.4;
      ctx.save();
      ctx.globalAlpha = p.opacity * Math.min(1, p.life / 40) * Math.min(1, (H - p.y) / 80 + 0.2);
      ctx.fillStyle   = p.color;
      ctx.font        = `${p.size}px serif`;
      ctx.fillText(p.symbol, p.x, p.y);
      ctx.restore();
      return p.y > -30;
    });

    requestAnimationFrame(animate);
  }
  animate();
})();

// ── INJECT ALL TRANSITION CSS ──────────────────────────────────────
const style = document.createElement('style');
style.textContent = `
  /* Scroll reveal base states */
  .reveal        { opacity:0; transform:translateY(38px);  transition:opacity .65s cubic-bezier(.4,0,.2,1),transform .65s cubic-bezier(.4,0,.2,1); }
  .reveal-left   { opacity:0; transform:translateX(-44px); transition:opacity .65s cubic-bezier(.4,0,.2,1),transform .65s cubic-bezier(.4,0,.2,1); }
  .reveal-right  { opacity:0; transform:translateX(44px);  transition:opacity .65s cubic-bezier(.4,0,.2,1),transform .65s cubic-bezier(.4,0,.2,1); }
  .reveal-scale  { opacity:0; transform:scale(.86);        transition:opacity .6s cubic-bezier(.4,0,.2,1),transform .6s cubic-bezier(.4,0,.2,1); }
  .reveal.visible,.reveal-left.visible,.reveal-right.visible,.reveal-scale.visible {
    opacity:1; transform:none;
  }

  /* Page-load: hero fades in from below */
  .hero-content  { opacity:0; transform:translateY(30px); transition:opacity 1.1s ease,transform 1.1s ease; }
  .hero-content.visible { opacity:1; transform:none; }

  /* Nav link underline sweep */
  nav ul li a { position:relative; }
  nav ul li a::after {
    content:'';position:absolute;left:0;bottom:-3px;
    width:0;height:2px;background:#f472b6;border-radius:2px;
    transition:width .3s ease;
  }
  nav ul li a:hover::after { width:100%; }

  /* Buttons lift + glow */
  .btn { transition:transform .22s ease,box-shadow .22s ease !important; }
  .btn:hover { transform:translateY(-4px) !important; box-shadow:0 10px 28px rgba(244,114,182,.38) !important; }

  /* Cards lift */
  .card,.category-card,.about-card,.review {
    transition:transform .25s ease,box-shadow .25s ease !important;
  }
  .card:hover,.category-card:hover,.about-card:hover,.review:hover {
    transform:translateY(-7px) !important;
    box-shadow:0 18px 44px rgba(0,0,0,.14) !important;
  }

  /* Gallery zoom */
  .gallery-grid { overflow:hidden; }
  .gallery-grid img {
    transition:transform .4s ease,filter .4s ease,box-shadow .4s ease !important;
    cursor:zoom-in;
  }
  .gallery-grid img:hover {
    transform:scale(1.07) !important;
    filter:brightness(1.1) saturate(1.2) !important;
    box-shadow:0 12px 32px rgba(0,0,0,.2) !important;
    z-index:2; position:relative;
  }

  /* Stat pop */
  .stat h2 { display:inline-block; transition:transform .2s ease,color .2s ease; }
  .stat:hover h2 { transform:scale(1.18); color:#f472b6; }

  /* Offer pulse */
  .offer-box { transition:transform .2s ease,letter-spacing .2s ease !important; }
  .offer-box:hover { transform:scale(1.05) !important; letter-spacing:.03em; }

  /* Form input glow */
  form input,form textarea {
    transition:border-color .25s ease,box-shadow .25s ease,transform .2s ease !important;
  }
  form input:focus,form textarea:focus {
    outline:none;
    border-color:#f472b6 !important;
    box-shadow:0 0 0 3px rgba(244,114,182,.22) !important;
    transform:scale(1.01);
  }
  form button { transition:transform .2s ease,background .2s ease !important; }
  form button:hover { transform:translateY(-3px) !important; }

  /* Section title animated underline */
  .section-title { position:relative; display:inline-block; }
  .section-title::after {
    content:'';position:absolute;left:50%;bottom:-10px;
    transform:translateX(-50%);
    width:0;height:3px;
    background:linear-gradient(90deg,#f472b6,#fb923c,#fbbf24);
    border-radius:3px;transition:width .6s ease .25s;
  }
  .section-title.visible::after { width:55%; }

  /* Shop banner parallax feel */
  .shop-banner {
    transition:transform .4s ease,box-shadow .4s ease !important;
  }
  .shop-banner:hover {
    transform:scale(1.015) !important;
    box-shadow:0 20px 50px rgba(0,0,0,.18) !important;
  }

  /* smooth scroll */
  html { scroll-behavior:smooth; }
`;
document.head.appendChild(style);

// ── ASSIGN REVEAL CLASSES ──────────────────────────────────────────
const revealMap = [
  ['.section-title',    'reveal'      ],
  ['.category-card',    'reveal'      ],
  ['.card',             'reveal'      ],
  ['.offer-box',        'reveal'      ],
  ['.about-card',       'reveal'      ],
  ['.about-banner',     'reveal'      ],
  ['.shop-story',       'reveal'      ],
  ['.shop-banner',      'reveal'      ],
  ['.stat',             'reveal-scale'],
  ['.review',           'reveal'      ],
  ['.testimonials h2',  'reveal'      ],
];

revealMap.forEach(([sel, cls]) => {
  document.querySelectorAll(sel).forEach(el => el.classList.add(cls));
});

// Gallery alternating left/right
document.querySelectorAll('.gallery-grid img').forEach((el, i) => {
  el.classList.add(i % 2 === 0 ? 'reveal-left' : 'reveal-right');
});

// ── INTERSECTION OBSERVER ──────────────────────────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el  = entry.target;
    const siblings = Array.from(el.parentElement.children).filter(c =>
      c.classList.contains('reveal') || c.classList.contains('reveal-scale') ||
      c.classList.contains('reveal-left') || c.classList.contains('reveal-right')
    );
    const idx = siblings.indexOf(el);
    setTimeout(() => el.classList.add('visible'), idx * 95);
    io.unobserve(el);
  });
}, { threshold: 0.10, rootMargin:'0px 0px -35px 0px' });

document.querySelectorAll('.reveal,.reveal-scale,.reveal-left,.reveal-right')
  .forEach(el => io.observe(el));

// ── HERO LOAD ANIMATION ────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero-content').forEach(el => el.classList.add('visible'));
  }, 180);
});
