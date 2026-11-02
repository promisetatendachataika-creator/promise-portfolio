// The Work section on large screens: the projects printed on thick
// pieces of smoked glass. The slab tilts toward the cursor, the piece
// under the pointer lifts, and clicking a piece shatters the panel to
// show that project. The project list (built from data/projects.json)
// is the source of truth, and the panel is cut into one piece per project.

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { clamp, easeIn, easeOutBack, rng } from './util.js';
import { makeCuts } from './cuts.js';

const FLY = 0.72;
const STAGGER = 0.03;

/* ---------- Polygon helpers (pixel space, y down) ---------- */

function centroid(poly) {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i];
    const [x1, y1] = poly[(i + 1) % poly.length];
    const f = x0 * y1 - x1 * y0;
    a += f;
    cx += (x0 + x1) * f;
    cy += (y0 + y1) * f;
  }
  a *= 0.5;
  return [cx / (6 * a), cy / (6 * a)];
}

function inset(poly, g) {
  const n = poly.length;
  let area = 0;
  for (let i = 0; i < n; i++) {
    const [x0, y0] = poly[i];
    const [x1, y1] = poly[(i + 1) % n];
    area += x0 * y1 - x1 * y0;
  }
  const s = Math.sign(area);
  const lines = poly.map((p, i) => {
    const q = poly[(i + 1) % n];
    let dx = q[0] - p[0], dy = q[1] - p[1];
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    return { p: [p[0] - dy * s * g, p[1] + dx * s * g], d: [dx, dy] };
  });
  return poly.map((_, i) => {
    const A = lines[(i - 1 + n) % n];
    const B = lines[i];
    const cross = A.d[0] * B.d[1] - A.d[1] * B.d[0];
    if (Math.abs(cross) < 1e-6) return B.p;
    const t = ((B.p[0] - A.p[0]) * B.d[1] - (B.p[1] - A.p[1]) * B.d[0]) / cross;
    return [A.p[0] + A.d[0] * t, A.p[1] + A.d[1] * t];
  });
}

function spanAt(poly, y) {
  let lo = Infinity, hi = -Infinity;
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i];
    const [x1, y1] = poly[(i + 1) % poly.length];
    if ((y0 - y) * (y1 - y) <= 0 && y0 !== y1) {
      const x = x0 + ((y - y0) / (y1 - y0)) * (x1 - x0);
      lo = Math.min(lo, x);
      hi = Math.max(hi, x);
    }
  }
  return [lo, hi];
}

function roundedShape(pts, r) {
  const shape = new THREE.Shape();
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const a = pts[(i - 1 + n) % n];
    const b = pts[(i + 1) % n];
    const la = p.distanceTo(a);
    const lb = p.distanceTo(b);
    const rr = Math.min(r, la * 0.42, lb * 0.42);
    const p1 = p.clone().lerp(a, rr / la);
    const p2 = p.clone().lerp(b, rr / lb);
    if (i === 0) shape.moveTo(p1.x, p1.y);
    else shape.lineTo(p1.x, p1.y);
    shape.quadraticCurveTo(p.x, p.y, p2.x, p2.y);
  }
  shape.closePath();
  return shape;
}

function wrap(ctx, text, maxW) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

/* ---------- Main ---------- */

export async function initGlass(section) {
  const canvas = section.querySelector('.work__gl');
  const detail = section.querySelector('.work__detail');
  const detailBody = section.querySelector('.work__detail-body');
  const backBtn = section.querySelector('.work__back');
  const keys = section.querySelector('.work__keys');
  const articles = [...section.querySelectorAll('.work__list .project')];
  const cuts = makeCuts(articles.length);

  // Wait for the logo and font, but never for more than a second and a half:
  // some browsers never settle image.decode(), and the glass works without them.
  const logo = new Image();
  const logoReady = new Promise((resolve) => {
    logo.onload = logo.onerror = resolve;
  });
  logo.src = new URL('../logo-light.png', import.meta.url).href;
  await Promise.race([
    Promise.all([logoReady, document.fonts.load('700 40px Bricolage').catch(() => {})]),
    new Promise((resolve) => setTimeout(resolve, 1500)),
  ]);
  await document.fonts.load('500 20px Bricolage');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.setClearColor(0x050507, 1);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.42;
  const keyLight = new THREE.DirectionalLight(0xe2ebff, 1.3);
  keyLight.position.set(-1, 1.3, 1.5);
  scene.add(keyLight);

  const camera = new THREE.PerspectiveCamera(30, 1, 10, 20000);
  const slab = new THREE.Group();
  scene.add(slab);

  // A soft lavender glow under the cursor, added inside the glass shader.
  const glow = { pos: { value: new THREE.Vector3() }, amt: { value: 0 }, radius: { value: 300 } };
  function glassMaterial() {
    const m = new THREE.MeshPhysicalMaterial({
      color: 0x17171b,
      roughness: 0.36,
      metalness: 0,
      clearcoat: 0.7,
      clearcoatRoughness: 0.12,
      specularIntensity: 0.7,
      iridescence: 0.55,
      iridescenceIOR: 1.3,
      iridescenceThicknessRange: [250, 650],
      envMapIntensity: 1,
    });
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uGlowPos = glow.pos;
      sh.uniforms.uGlowAmt = glow.amt;
      sh.uniforms.uGlowR = glow.radius;
      sh.vertexShader =
        'varying vec3 vGlowW;\n' +
        sh.vertexShader.replace(
          '#include <worldpos_vertex>',
          '#include <worldpos_vertex>\nvGlowW = (modelMatrix * vec4(transformed, 1.0)).xyz;'
        );
      sh.fragmentShader =
        'uniform vec3 uGlowPos; uniform float uGlowAmt; uniform float uGlowR; varying vec3 vGlowW;\n' +
        sh.fragmentShader.replace(
          '#include <emissivemap_fragment>',
          '#include <emissivemap_fragment>\n{ float gd = distance(vGlowW, uGlowPos) / uGlowR;\n totalEmissiveRadiance += vec3(.42,.37,.62) * .16 * exp(-1.6 * gd * gd) * uGlowAmt; }'
        );
    };
    m.customProgramCacheKey = () => 'glass-glow';
    return m;
  }

  // Text is drawn once onto canvases and printed on the top face of each piece.
  const TEX_DPR = Math.min(2, Math.max(1.5, devicePixelRatio));
  const pageCanvas = document.createElement('canvas');
  const navCanvas = document.createElement('canvas');
  const pageTex = new THREE.CanvasTexture(pageCanvas);
  const navTex = new THREE.CanvasTexture(navCanvas);
  for (const t of [pageTex, navTex]) {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  }

  const pieces = [];
  function makePiece(isNav) {
    const group = new THREE.Group();
    const mat = glassMaterial();
    const body = new THREE.Mesh(new THREE.BufferGeometry(), mat);
    body.userData.index = pieces.length;
    const print = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshBasicMaterial({ map: isNav ? navTex : pageTex, transparent: true, depthWrite: false, toneMapped: false })
    );
    group.add(body, print);
    slab.add(group);
    const piece = {
      isNav, group, body, print, mat,
      rest: new THREE.Vector3(), half: [1, 1],
      z: 0, vz: 0, rx: 0, vrx: 0, ry: 0, vry: 0,
      fly: null,
    };
    pieces.push(piece);
    return piece;
  }
  makePiece(true);
  articles.forEach(() => makePiece(false));

  let L = null;

  function drawNav() {
    const k = TEX_DPR;
    navCanvas.width = Math.round(L.bw * k);
    navCanvas.height = Math.round(L.navH * k);
    const x = navCanvas.getContext('2d');
    x.setTransform(k, 0, 0, k, 0, 0);
    x.clearRect(0, 0, L.bw, L.navH);
    const pad = 34 * L.S;
    const mid = L.navH / 2;
    const lh = L.navH * 0.42;
    const lw = logo.naturalWidth ? (logo.naturalWidth / logo.naturalHeight) * lh : 0;
    if (lw) x.drawImage(logo, pad, mid - lh / 2, lw, lh);
    x.fillStyle = '#e8e8ec';
    x.textBaseline = 'middle';
    x.font = `700 ${L.navH * 0.3}px Bricolage`;
    x.fillText('Work', pad + lw + 20 * L.S, mid + 1);
    x.font = `500 ${Math.max(14, L.navH * 0.2)}px Bricolage`;
    x.textAlign = 'right';
    x.fillStyle = 'rgba(255,255,255,.85)';
    x.fillText('Click a piece to open it', L.bw - pad, mid + 1);
    navTex.needsUpdate = true;
  }

  function drawPage() {
    const k = TEX_DPR;
    const pw = L.bw, ph = L.panelH;
    pageCanvas.width = Math.round(pw * k);
    pageCanvas.height = Math.round(ph * k);
    const x = pageCanvas.getContext('2d');
    x.setTransform(k, 0, 0, k, 0, 0);
    x.clearRect(0, 0, pw, ph);
    x.textBaseline = 'alphabetic';

    cuts.polys().forEach((cell, ci) => {
      const art = articles[ci];
      if (!art) return;
      const hero = ci === 0 && cuts.featured;
      const title = art.querySelector('h3').textContent;
      const status = art.querySelector('.project__status')?.textContent ?? '';
      const summary = hero ? art.querySelector('.project__summary')?.textContent ?? '' : '';

      const poly = cell.map(([u, v]) => [u * pw, v * ph]);
      const ys = poly.map((q) => q[1]);
      const cellH = Math.max(...ys) - Math.min(...ys);
      const c = centroid(poly);
      const cy = c[1];
      const span = spanAt(poly, cy);
      const w = (span[1] - span[0]) * 0.74;
      const left = (span[0] + span[1]) / 2 - w / 2;

      let size = hero ? Math.min(pw * 0.046, cellH * 0.2) : Math.min(pw * 0.024, cellH * 0.2);
      let lines;
      for (;;) {
        x.font = `700 ${size}px Bricolage`;
        lines = wrap(x, title, w);
        const widest = Math.max(...lines.map((l) => x.measureText(l).width));
        if ((lines.length <= 2 && widest <= w) || size < 14) break;
        size *= 0.93;
      }
      const lh = size * 0.98;
      const small = Math.max(14, 22 * L.S);
      const body = Math.max(15, 27 * L.S);
      x.font = `400 ${body}px Bricolage`;
      let sumLines = summary ? wrap(x, summary, w) : [];
      // Drop the summary if it won't fit comfortably in the piece.
      if (lines.length * size + sumLines.length * body * 1.35 > cellH * 0.6) sumLines = [];
      const blockH = lines.length * lh + small * 1.9 + (sumLines.length ? 18 * L.S + sumLines.length * body * 1.35 : 0);
      let y = cy - blockH / 2 + size * 0.8;

      x.font = `700 ${size}px Bricolage`;
      x.letterSpacing = `${(-0.035 * size).toFixed(2)}px`;
      const grad = x.createLinearGradient(0, y - size, 0, y + lh * lines.length);
      grad.addColorStop(0, '#ececf0');
      grad.addColorStop(1, '#b9b9c0');
      x.fillStyle = grad;
      for (const l of lines) {
        x.fillText(l, left, y);
        y += lh;
      }
      x.letterSpacing = '0px';
      y += small * 0.9 - lh + size * 0.2 + small;
      x.font = `500 ${small}px Bricolage`;
      x.fillStyle = 'rgba(255,255,255,.45)';
      x.fillText(status, left, y);
      if (sumLines.length) {
        y += 18 * L.S + body * 1.2;
        x.font = `400 ${body}px Bricolage`;
        x.fillStyle = 'rgba(255,255,255,.62)';
        for (const l of sumLines) {
          x.fillText(l, left, y);
          y += body * 1.35;
        }
      }
    });

    pageTex.needsUpdate = true;
  }

  // Builds the glass and printed geometry for one piece from a pixel polygon.
  function setGeometry(p, poly, texW, texH, originX, originY) {
    const c = centroid(poly);
    const local = poly.map(([px, py]) => new THREE.Vector2(px - c[0], -(py - c[1])));
    const shape = roundedShape(local, L.r);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: L.depth,
      bevelEnabled: true,
      bevelThickness: L.bevel,
      bevelSize: L.bevel,
      bevelSegments: 3,
      curveSegments: 5,
    });
    const pg = new THREE.ShapeGeometry(shape, 5);
    const pos = pg.attributes.position;
    const uv = pg.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, (pos.getX(i) + c[0]) / texW, 1 - (c[1] - pos.getY(i)) / texH);
    }
    p.body.geometry.dispose();
    p.print.geometry.dispose();
    p.body.geometry = geo;
    p.print.geometry = pg;
    p.print.position.z = L.depth + L.bevel + 0.4;
    p.rest.set(originX + c[0], originY - c[1], 0);
    let hw = 0, hh = 0;
    for (const v of local) {
      hw = Math.max(hw, Math.abs(v.x));
      hh = Math.max(hh, Math.abs(v.y));
    }
    p.half = [hw, hh];
  }

  function buildNav() {
    const b = L.bevel;
    const poly = [[b, b], [L.bw - b, b], [L.bw - b, L.navH - b], [b, L.navH - b]];
    setGeometry(pieces[0], poly, L.bw, L.navH, L.left, L.top);
  }

  const ptr = { x: 0, y: 0, u: 0.5, v: 0.5, inside: false, amt: 0 };

  function rebuildCells(t) {
    const g = L.gap / 2 + L.bevel;
    cuts.polys(t, ptr).forEach((cell, ci) => {
      const poly = inset(cell.map(([u, v]) => [u * L.bw, v * L.panelH]), g);
      setGeometry(pieces[ci + 1], poly, L.bw, L.panelH, L.left, L.panelTop);
    });
  }

  function setFly() {
    const r = rng(23);
    const cx = L.left + L.bw / 2;
    const cy = L.panelTop - L.panelH / 2;
    for (const p of pieces) {
      const dir = p.isNav
        ? new THREE.Vector2(0, 1)
        : new THREE.Vector2(p.rest.x - cx, p.rest.y - cy).normalize();
      const speed = (300 + r() * 260) * L.S;
      p.fly = {
        v: new THREE.Vector3(dir.x * speed, dir.y * speed - 160 * L.S, (420 + r() * 380) * L.S),
        axis: new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize(),
        ang: 2 + r() * 1.6,
      };
    }
  }

  function layout() {
    const W = section.clientWidth;
    const H = section.clientHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.position.set(0, 0, H / 2 / Math.tan(THREE.MathUtils.degToRad(15)));
    camera.updateProjectionMatrix();
    // Leave room at the top for the site's floating nav.
    const mx = 0.055 * W;
    const myTop = Math.max(0.085 * H, 104);
    const myBottom = 0.085 * H;
    const bw = W - 2 * mx;
    const bh = H - myTop - myBottom;
    const S = bw / 1730;
    const navH = 0.108 * bh;
    const gap = 14 * S;
    L = {
      W, H, S, bw, navH, gap,
      panelH: bh - navH - gap,
      left: -W / 2 + mx,
      top: H / 2 - myTop,
      depth: 13 * S,
      bevel: 2.6 * S,
      r: 20 * S,
    };
    L.panelTop = L.top - navH - gap;
    glow.radius.value = 300 * S;
    drawNav();
    drawPage();
    buildNav();
    rebuildCells(performance.now() / 1000);
    setFly();
  }

  /* ---------- Open and close ---------- */

  let mode = 'gone'; // gone -> back (fly in) -> idle -> out (shatter) -> gone
  let modeStart = performance.now();
  let mt = 0;
  const setMode = (m) => {
    mode = m;
    modeStart = performance.now();
    mt = 0;
  };
  let hovered = -1;
  let keyHover = -1;
  let lastKey = null;

  function open(ci) {
    if (mode !== 'idle' || !articles[ci]) return;
    setMode('out');
    hovered = -1;
    canvas.style.cursor = '';
    detailBody.replaceChildren(articles[ci].cloneNode(true));
    detail.hidden = false;
    setTimeout(() => {
      detail.classList.add('show');
      backBtn.focus({ preventScroll: true });
    }, 280);
  }

  function close() {
    if (mode !== 'gone' || detail.hidden) return;
    detail.classList.add('leaving');
    detail.classList.remove('show');
    setTimeout(() => {
      detail.hidden = true;
      detail.classList.remove('leaving');
      setMode('back');
      lastKey?.focus({ preventScroll: true });
    }, 250);
  }

  backBtn.addEventListener('click', close);
  section.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // Keyboard access: hidden buttons that show up when focused.
  articles.forEach((_, ci) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = `Open ${articles[ci].querySelector('h3').textContent}`;
    b.addEventListener('focus', () => (keyHover = ci + 1));
    b.addEventListener('blur', () => (keyHover = -1));
    b.addEventListener('click', () => {
      lastKey = b;
      open(ci);
    });
    keys.append(b);
  });

  /* ---------- Pointer ---------- */

  section.addEventListener('pointermove', (e) => {
    const r = section.getBoundingClientRect();
    ptr.x = e.clientX - r.left;
    ptr.y = e.clientY - r.top;
    ptr.inside = true;
  });
  section.addEventListener('pointerleave', () => (ptr.inside = false));
  // Work out which piece was clicked from the click itself, not the last frame.
  canvas.addEventListener('click', (e) => {
    if (mode !== 'idle') return;
    const r = section.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / L.W) * 2 - 1, -((e.clientY - r.top) / L.H) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(pieces.map((p) => p.body), false)[0];
    const i = hit ? hit.object.userData.index : -1;
    if (i > 0) {
      lastKey = null;
      open(i - 1);
    }
  });

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const tmp = new THREE.Vector3();
  const qFly = new THREE.Quaternion();
  const eul = new THREE.Euler();
  const tilt = { x: 0, y: 0 };

  /* ---------- Frame loop ---------- */

  let visible = false;
  let started = false;
  new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible && entry.intersectionRatio > 0.35 && !started) {
        started = true;
        setMode('back');
      }
    },
    { threshold: [0, 0.35, 0.6] }
  ).observe(section);

  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 120);
  });

  // Switch the section to its full-screen glass layout before measuring it.
  section.classList.add('is-glass');
  layout();

  let last = performance.now();
  let lastBuild = 0;

  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;
    const t = now / 1000;
    mt = (now - modeStart) / 1000;

    // Pointer in panel coordinates, ignoring the small tilt.
    const wx = ptr.x - L.W / 2;
    const wy = L.H / 2 - ptr.y;
    ptr.u = (wx - L.left) / L.bw;
    ptr.v = (L.panelTop - wy) / L.panelH;
    const target = ptr.inside && mode === 'idle' ? 1 : 0;
    ptr.amt += (target - ptr.amt) * (1 - Math.exp(-dt * 4));

    // The cut lines breathe; rebuild about 45 times a second.
    if (mode !== 'gone' && now - lastBuild > 22) {
      rebuildCells(t);
      lastBuild = now;
    }

    // Whole-slab tilt, as if pressed where the pointer is.
    const nx = ptr.inside ? (ptr.x / L.W - 0.5) * 2 : 0;
    const ny = ptr.inside ? (ptr.y / L.H - 0.5) * 2 : 0;
    const f = 1 - Math.exp(-dt / 0.3);
    tilt.y += (THREE.MathUtils.degToRad(nx * 7 - 1.2) - tilt.y) * f;
    tilt.x += (THREE.MathUtils.degToRad(ny * 5.5 + 0.8) - tilt.x) * f;
    slab.rotation.set(tilt.x, tilt.y, 0);
    slab.updateMatrixWorld(true);

    // Hover.
    let hit = null;
    if (ptr.inside && mode === 'idle') {
      ndc.set((ptr.x / L.W) * 2 - 1, -(ptr.y / L.H) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      hit = raycaster.intersectObjects(pieces.map((p) => p.body), false)[0] ?? null;
      hovered = hit ? hit.object.userData.index : -1;
      if (hit) glow.pos.value.copy(hit.point);
      else if (raycaster.ray.intersectPlane(plane, tmp)) glow.pos.value.copy(tmp);
    } else {
      hovered = -1;
    }
    const active = hovered >= 0 ? hovered : mode === 'idle' ? keyHover : -1;
    canvas.style.cursor = hovered > 0 ? 'pointer' : '';
    glow.amt.value += ((ptr.inside && mode === 'idle' ? 1 : 0) - glow.amt.value) * (1 - Math.exp(-dt * 5));

    const steps = 2;
    const h = dt / steps;
    pieces.forEach((p, i) => {
      // Spring: lift toward the camera and tip away from the pointer.
      let tz = 0, trx = 0, try_ = 0;
      if (i === active) {
        tz = (p.isNav ? 32 : 50) * L.S;
        if (hit && hovered === i) {
          const local = p.group.worldToLocal(hit.point.clone());
          try_ = clamp(local.x / p.half[0], -1, 1) * 0.24;
          trx = -clamp(local.y / p.half[1], -1, 1) * 0.24;
        }
      }
      for (let s = 0; s < steps; s++) {
        p.vz += (170 * (tz - p.z) - 19 * p.vz) * h;
        p.z += p.vz * h;
        p.vrx += (170 * (trx - p.rx) - 19 * p.vrx) * h;
        p.rx += p.vrx * h;
        p.vry += (170 * (try_ - p.ry) - 19 * p.vry) * h;
        p.ry += p.vry * h;
      }
      const lit = i === active ? 1 : 0;
      p.mat.iridescence += (0.55 + 0.35 * lit - p.mat.iridescence) * (1 - Math.exp(-dt * 8));
      p.mat.envMapIntensity += (1 + 0.45 * lit - p.mat.envMapIntensity) * (1 - Math.exp(-dt * 8));

      // Shatter and reassemble.
      const k = clamp((mt - i * STAGGER) / FLY);
      let e = 0;
      if (mode === 'out') e = easeIn(k);
      else if (mode === 'back') e = 1 - easeOutBack(k);
      else if (mode === 'gone') e = 1;
      p.group.visible = mode !== 'gone';

      const fv = p.fly.v;
      p.group.position.set(
        p.rest.x + fv.x * e,
        p.rest.y + fv.y * e - 520 * L.S * e * e,
        p.z + fv.z * e
      );
      eul.set(p.rx, p.ry, 0);
      p.group.quaternion.setFromEuler(eul);
      qFly.setFromAxisAngle(p.fly.axis, p.fly.ang * e);
      p.group.quaternion.premultiply(qFly);
    });

    const total = FLY + pieces.length * STAGGER + 0.05;
    if (mode === 'out' && mt > total) setMode('gone');
    if (mode === 'back' && mt > total) setMode('idle');

    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}
