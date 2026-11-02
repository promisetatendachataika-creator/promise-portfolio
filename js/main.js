// Page-wide effects: the background glow, letter-by-letter reveals,
// the pinned statement and the nav button. The two 3D sections are
// loaded on demand, and the page works without them.

import { clamp, lerp, smooth, hexToRgb, mixRgb } from './util.js';
import { loadContent } from './content.js';

// Projects and certifications come from /data; start loading them straight away.
const contentReady = loadContent();

const $ = (s) => document.querySelector(s);
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Letter reveal ---------- */

function splitLetters(el) {
  const chars = [];
  el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  const walk = (node, hl) => {
    for (const n of [...node.childNodes]) {
      if (n.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        for (const part of n.textContent.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.append(document.createTextNode(' '));
            continue;
          }
          const word = document.createElement('span');
          word.className = 'w';
          word.setAttribute('aria-hidden', 'true');
          for (const ch of part) {
            const c = document.createElement('span');
            c.textContent = ch;
            c.hl = hl;
            chars.push(c);
            word.append(c);
          }
          frag.append(word);
        }
        n.replaceWith(frag);
      } else if (n.nodeType === Node.ELEMENT_NODE && n.nodeName !== 'BR') {
        walk(n, hl || n.classList.contains('hl'));
      }
    }
  };
  walk(el, false);
  return chars;
}

const WHITE = [255, 255, 255];
const INK = hexToRgb('#18202b');
const REVEAL = hexToRgb('#2f9d6c');
const HL = hexToRgb('#1e6b47');

function paint(chars, p, spread, final = INK, accent = REVEAL, ghost = WHITE) {
  const n = chars.length;
  chars.forEach((c, i) => {
    const t = clamp((p * (1 + spread) - i / n) / spread);
    if (c.t === t) return;
    c.t = t;
    let o, col, blur;
    if (t <= 0.35) {
      o = t / 0.35;
      col = ghost;
      blur = lerp(8, 1.5, t / 0.35);
    } else if (t <= 0.7) {
      const k = (t - 0.35) / 0.35;
      o = 1;
      col = mixRgb(ghost, accent, k);
      blur = lerp(1.5, 0, k);
    } else {
      o = 1;
      col = mixRgb(accent, c.hl ? HL : final, (t - 0.7) / 0.3);
      blur = 0;
    }
    c.style.color = `rgba(${col.map(Math.round).join(',')},${o.toFixed(3)})`;
    c.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : '';
  });
}

const h1Chars = splitLetters($('#h1'));
const stmt = $('#stmt');
const stmtChars = splitLetters(stmt);
const nav = $('#nav');

/* ---------- Background glow ----------
   A 96x60 canvas, stretched to the viewport by CSS so it renders soft.
   The bowl's edge is a curve; each pixel takes its signed distance to it. */

const bg = $('#bg');
const bctx = bg.getContext('2d');
const BW = 96;
const BH = 60;
const img = bctx.createImageData(BW, BH);
const OUT = [255, 255, 255];
const RIM = hexToRgb('#d6e6fb');
const CORE = hexToRgb('#9fdcca');
const ROUND = 0.25;

const KEYS = {
  q: [0, 0.03, 0.08, 0.18, 0.4, 0.66, 0.87, 1.15, 1.43, 1.8],
  tip: [0.3, 0.45, 0.65, 0.8, 0.95, 1.05, 1.05, 1.1, 1.3, 2.4],
  half: [0.34, 0.38, 0.38, 0.38, 0.38, 0.46, 0.66, 0.9, 1.6, 3.0],
  soft: [0.22, 0.26, 0.22, 0.22, 0.19, 0.16, 0.13, 0.1, 0.1, 0.1],
};

function fromTable(key, q) {
  const Q = KEYS.q;
  const V = KEYS[key];
  if (q <= Q[0]) return V[0];
  for (let i = 1; i < Q.length; i++) {
    if (q <= Q[i]) return lerp(V[i - 1], V[i], (q - Q[i - 1]) / (Q[i] - Q[i - 1]));
  }
  return V[V.length - 1];
}

const cur = { tip: -0.3, half: 0.3, soft: 0.1 };
const tgt = { tip: 0.3, half: 0.34, soft: 0.22 };

function drawBowl(time) {
  const aspect = innerWidth / innerHeight;
  const tip = cur.tip + (reduceMotion ? 0 : Math.sin(time * 0.00033 + 1.3) * 0.02);
  const half = cur.half + (reduceMotion ? 0 : Math.sin(time * 0.0005) * 0.015);
  const soft = cur.soft;
  const d = img.data;

  // Edge curve, from above the top of the screen down to the tip.
  const N = 48;
  const ex = new Float32Array(N);
  const ey = new Float32Array(N);
  const okTip = tip > 0.01;
  for (let i = 0; i < N; i++) {
    const yy = -0.3 + ((tip + 0.3) * i) / (N - 1);
    ey[i] = yy;
    ex[i] = okTip ? half * aspect * Math.pow(Math.max(0, 1 - yy / tip), 0.72) : 0;
  }

  for (let y = 0; y < BH; y++) {
    const py = (y + 0.5) / BH;
    for (let x = 0; x < BW; x++) {
      const px = Math.abs((x + 0.5) / BW - 0.5) * aspect;
      let g = 0;
      if (okTip) {
        let best = 1e9;
        for (let i = 0; i < N - 1; i++) {
          const ax = ex[i];
          const ay = ey[i];
          const sx = ex[i + 1] - ax;
          const sy = ey[i + 1] - ay;
          const len = sx * sx + sy * sy || 1e-9;
          const t = clamp(((px - ax) * sx + (py - ay) * sy) / len);
          const dx = px - (ax + sx * t);
          const dy = py - (ay + sy * t);
          const dd = dx * dx + dy * dy;
          if (dd < best) best = dd;
        }
        const inside = py < tip && px < half * aspect * Math.pow(1 - py / tip, 0.72);
        const sd = (inside ? -Math.sqrt(best) : Math.sqrt(best)) - ROUND;
        g = 1 - smooth((sd + soft) / (2 * soft));
      }
      const col = g < 0.38 ? mixRgb(OUT, RIM, smooth(g / 0.38)) : mixRgb(RIM, CORE, smooth((g - 0.38) / 0.62));
      const o = (y * BW + x) * 4;
      d[o] = col[0];
      d[o + 1] = col[1];
      d[o + 2] = col[2];
      d[o + 3] = 255;
    }
  }
  bctx.putImageData(img, 0, 0);
}

/* ---------- Scroll ---------- */

const statement = $('#statement');
let q = 0;
let lastStmtP = -1;

function onScroll() {
  const H = innerHeight;
  // q is 0 when the page is at rest, and counts screens scrolled past the hero.
  q = (scrollY - (statement.offsetTop - 0.69 * H)) / H;
  tgt.tip = fromTable('tip', q);
  tgt.half = fromTable('half', q);
  tgt.soft = fromTable('soft', q);

  if (reduceMotion) return;
  const s = clamp((q - 0.69) / 0.74);
  stmt.style.transform = `translateY(${(0.205 * (1 - s) ** 2 * H).toFixed(1)}px)`;
  const p = clamp((q - 0.56) / 2.03);
  if (p !== lastStmtP) {
    paint(stmtChars, p, 0.16);
    lastStmtP = p;
  }
  nav.classList.toggle('on', p > 0.4);
}

/* ---------- Start ---------- */

if (reduceMotion) {
  paint(h1Chars, 1, 0.35);
  paint(stmtChars, 1, 0.16);
  nav.classList.add('on');
  onScroll();
  Object.assign(cur, tgt);
  drawBowl(0);
  addEventListener('resize', () => drawBowl(0));
} else {
  paint(h1Chars, 0, 0.35);
  paint(stmtChars, 0, 0.16);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  const start = performance.now();
  const INTRO_DELAY = 250;
  const INTRO_LEN = 1050;
  const from = { ...cur };

  requestAnimationFrame(() => {
    document.body.classList.add('ready');
    onScroll();
    const loop = (now) => {
      const age = now - start;
      // Headline reveal over the first 1.25 s.
      if (age < 1400) paint(h1Chars, clamp(age / 1250), 0.35);

      // The glow drops in from the top, then follows the scroll with a little lag.
      const k = smooth((age - INTRO_DELAY) / INTRO_LEN);
      if (age < INTRO_DELAY + INTRO_LEN) {
        for (const key of ['tip', 'half', 'soft']) cur[key] = lerp(from[key], tgt[key], k);
      } else {
        for (const key of ['tip', 'half', 'soft']) cur[key] += (tgt[key] - cur[key]) * 0.12;
      }
      // Once the dark sections cover the screen there is nothing to draw.
      const settling = Math.abs(cur.tip - tgt.tip) + Math.abs(cur.half - tgt.half) > 0.002;
      if (q < 2.6 || settling) drawBowl(now);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  });
}

/* ---------- The 3D sections ---------- */

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

if (!reduceMotion && hasWebGL()) {
  if (matchMedia('(min-width: 700px) and (min-height: 520px)').matches) {
    Promise.all([import('./glass.js'), contentReady])
      .then(([m, projects]) => projects.length && m.initGlass($('#work')))
      .catch((e) => console.warn('Glass view unavailable, showing the list instead.', e));
  }
  if (matchMedia('(min-width: 700px) and (min-height: 520px)').matches) {
    import('./globe.js')
      .then((m) => m.initGlobe($('#contact')))
      .catch((e) => console.warn('Globe unavailable, showing contact details instead.', e));
  }
}

/* ---------- Contact form: opens the visitor's email app ---------- */

$('#cbar').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = $('#cname').value.trim();
  const email = $('#cmail').value.trim();
  const msg = $('#cmsg').value.trim();
  const subject = encodeURIComponent(name ? `Message from ${name}` : 'Message from your website');
  const body = encodeURIComponent(`${msg}\n\n${name}${email ? `\n${email}` : ''}`);
  location.href = `mailto:promisetatendachataika@gmail.com?subject=${subject}&body=${body}`;
});
