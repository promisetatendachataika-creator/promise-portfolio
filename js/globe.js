// The Contact section on large screens: a globe that grows in front of
// a giant "Harare". Drag to spin it; click it (or wait) and it turns to
// Zimbabwe, lights the country up and shows the contact details.

import * as THREE from 'three';
import { geoEquirectangular, geoPath, geoGraticule10 } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import { clamp, lerp, seg, easeInOut, easeOut, rng } from './util.js';

const ATLAS = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json';
const ZIMBABWE_ID = '716';
// Map positions (0 to 1 from the top-left of an equirectangular map).
const HARARE = { u: (31.05 + 180) / 360, v: (90 + 17.83) / 180 };
const AFRICA = { u: (18 + 180) / 360, v: (90 - 4) / 180 };
const ACTIONS = ['Send an email', 'Open WhatsApp', 'Call me', 'Open LinkedIn', 'Open GitHub'];

const dirOf = ({ u, v }) => {
  const ph = 2 * Math.PI * u;
  const th = Math.PI * v;
  return new THREE.Vector3(-Math.cos(ph) * Math.sin(th), Math.cos(th), Math.sin(ph) * Math.sin(th));
};
const faceYaw = (d) => Math.atan2(-d.x, d.z);
const faceLat = (d) => Math.asin(d.y);

async function buildMaps() {
  const world = await fetch(ATLAS).then((r) => {
    if (!r.ok) throw new Error(`Map data: ${r.status}`);
    return r.json();
  });
  const countries = feature(world, world.objects.countries);
  const zim = countries.features.find((f) => String(f.id) === ZIMBABWE_ID);

  const TW = 2048;
  const TH = 1024;
  const proj = geoEquirectangular().scale(TW / (2 * Math.PI)).translate([TW / 2, TH / 2]);

  const map = document.createElement('canvas');
  map.width = TW;
  map.height = TH;
  const x = map.getContext('2d');
  const path = geoPath(proj, x);
  x.fillStyle = '#0d3c37';
  x.fillRect(0, 0, TW, TH);
  x.beginPath();
  path(geoGraticule10());
  x.strokeStyle = 'rgba(255,255,255,.07)';
  x.lineWidth = 1.2;
  x.stroke();
  x.beginPath();
  path(countries);
  x.fillStyle = '#d3e7da';
  x.fill();
  x.beginPath();
  path(mesh(world, world.objects.countries, (a, b) => a !== b));
  x.strokeStyle = 'rgba(13,60,55,.45)';
  x.lineWidth = 1.3;
  x.stroke();

  const mask = document.createElement('canvas');
  mask.width = TW;
  mask.height = TH;
  const m = mask.getContext('2d');
  m.fillStyle = '#000';
  m.fillRect(0, 0, TW, TH);
  if (zim) {
    const mp = geoPath(proj, m);
    m.filter = 'blur(1.5px)';
    m.beginPath();
    mp(zim);
    m.fillStyle = '#fff';
    m.fill();
  }
  return { map, mask };
}

export async function initGlobe(section) {
  const $ = (s) => section.querySelector(s);
  const canvas = $('#cgl');
  const dust = $('#cdust');
  const word = $('#cword');
  const eyebrow = $('#ceyebrow');
  const flare = $('#cflare');
  const pin = $('#cpin');
  const word1 = $('#cword1');
  const list = $('#clist');
  const items = [...list.querySelectorAll('li')];
  const card = $('#ccard');
  const bar = $('#cbar');
  const hint = $('#chint');
  const railBtns = [...section.querySelectorAll('.c-rail button')];

  const { map, mask } = await buildMaps();

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -2e5, 2e5);

  const mapTex = new THREE.CanvasTexture(map);
  mapTex.colorSpace = THREE.NoColorSpace;
  mapTex.wrapS = THREE.RepeatWrapping;
  mapTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const maskTex = new THREE.CanvasTexture(mask);
  maskTex.colorSpace = THREE.NoColorSpace;
  maskTex.wrapS = THREE.RepeatWrapping;

  const sun = new THREE.Vector3(0.62, 0.5, 0.6).normalize();
  const uniforms = {
    map: { value: mapTex },
    mask: { value: maskTex },
    sun: { value: sun },
    hi: { value: 0 },
    time: { value: 0 },
    ready: { value: 1 },
  };

  const planet = new THREE.Group();
  const tiltG = new THREE.Group();
  const spinG = new THREE.Group();
  planet.add(tiltG);
  tiltG.add(spinG);
  scene.add(planet);

  spinG.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(1, 128, 96),
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: /* glsl */ `
          varying vec2 vUv; varying vec3 vN;
          void main(){
            vUv = uv;
            vN = normalize(mat3(modelMatrix) * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
          }`,
        fragmentShader: /* glsl */ `
          uniform sampler2D map, mask; uniform vec3 sun; uniform float hi, time, ready;
          varying vec2 vUv; varying vec3 vN;
          void main(){
            vec3 col = pow(texture2D(map, vUv).rgb, vec3(2.2));
            float m = texture2D(mask, vUv).r;
            vec3 n = normalize(vN);
            float diff = max(dot(n, sun), 0.);
            vec3 lit = col * (vec3(1.3, 1.24, 1.16) * pow(diff, .85) + vec3(.05, .09, .09));
            vec3 gold = vec3(1., .5, .04) * (.5 + diff * 1.3);
            lit = mix(lit, gold, m * hi * (.9 + .1 * sin(time * 2.2)));
            float fres = pow(1. - max(n.z, 0.), 3.);
            lit += vec3(.45, 1., .78) * fres * (.06 + diff * .45);
            lit = lit / (lit * .3 + 1.) * 1.3;
            gl_FragColor = vec4(pow(lit, vec3(1. / 2.2)), 1.) * ready;
          }`,
      })
    )
  );

  planet.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(1.14, 64, 48),
      new THREE.ShaderMaterial({
        uniforms: { sun: uniforms.sun, ready: uniforms.ready },
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        vertexShader: /* glsl */ `
          varying vec3 vN;
          void main(){ vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
        fragmentShader: /* glsl */ `
          uniform vec3 sun; uniform float ready; varying vec3 vN;
          void main(){
            float z = clamp(-vN.z, 0., 1.), a = smoothstep(.0, .55, z);
            float s = .55 + .6 * max(dot(-vN * vec3(1., 1., 0.), normalize(sun * vec3(1., 1., 0.))), 0.);
            a = pow(a, 2.6) * s * .7;
            gl_FragColor = vec4(vec3(.62, 1., .8), a * ready);
          }`,
      })
    )
  );

  /* ---------- State ---------- */

  const harareDir = dirOf(HARARE);
  let yaw = faceYaw(dirOf(AFRICA));
  let pitch = 0.16;
  let vyaw = 0;
  let st = 0, from = 0, to = 0, t0 = 0, dur = 1;
  let W = 1, H = 1, R0 = 1, wordW = 1, wordH = 1;
  let mouseX = 0, mouseY = 0;
  let dragging = false, lastDrag = -1e9, interacted = false;
  let down = null;
  let cx = 0, cy = 0, R = 1;
  let visible = false, firstSeen = -1, visibleSince = -1;

  function go(n) {
    if (n === to) return;
    from = st;
    to = n;
    t0 = performance.now();
    dur = 1300 * Math.abs(to - from) || 1;
  }

  function size() {
    W = section.clientWidth;
    H = section.clientHeight;
    renderer.setSize(W, H, false);
    camera.left = -W / 2;
    camera.right = W / 2;
    camera.top = H / 2;
    camera.bottom = -H / 2;
    camera.updateProjectionMatrix();
    R0 = Math.min(H * 0.3, W * 0.19);
    wordW = word.offsetWidth;
    wordH = word.offsetHeight;
    const k = Math.min(devicePixelRatio, 1.5);
    dust.width = Math.round(W * k);
    dust.height = Math.round(H * k);
    dctx.setTransform(k, 0, 0, k, 0, 0);
  }

  /* ---------- Contact list and card ---------- */

  const cardLabel = card.querySelector('.c-card__label');
  const cardValue = card.querySelector('.c-card__value');
  const cardGo = card.querySelector('.c-card__go');
  function pick(i) {
    items.forEach((li, j) => li.classList.toggle('on', i === j));
    const a = items[i].querySelector('a');
    cardLabel.textContent = items[i].querySelector('.c-list__label').textContent;
    cardValue.textContent = a.textContent;
    cardGo.textContent = ACTIONS[i];
    cardGo.href = a.href;
    if (a.target) cardGo.target = a.target;
    else cardGo.removeAttribute('target');
    cardGo.rel = 'noreferrer';
    const sr = section.getBoundingClientRect();
    const r = items[i].getBoundingClientRect();
    card.style.top = `${r.top - sr.top + r.height / 2 - card.offsetHeight / 2}px`;
  }
  items.forEach((li, i) => {
    li.addEventListener('pointerenter', () => pick(i));
    li.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      pick(i);
    });
    li.querySelector('a').addEventListener('focus', () => pick(i));
  });

  railBtns.forEach((b, i) => b.addEventListener('click', () => go(i)));
  section.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') go(0);
  });

  /* ---------- Dragging the globe ---------- */

  const insideGlobe = (x, y) => Math.hypot(x - cx, y - cy) < R;
  canvas.addEventListener('pointerdown', (e) => {
    const r = section.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (!insideGlobe(x, y)) return;
    down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY, moved: 0 };
    dragging = true;
    interacted = true;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('drag');
  });
  canvas.addEventListener('pointermove', (e) => {
    const r = section.getBoundingClientRect();
    mouseX = (e.clientX - r.left) / W - 0.5;
    mouseY = (e.clientY - r.top) / H - 0.5;
    canvas.style.cursor = insideGlobe(e.clientX - r.left, e.clientY - r.top) ? '' : 'default';
    if (!dragging || !down) return;
    const dx = e.clientX - down.lx;
    const dy = e.clientY - down.ly;
    down.lx = e.clientX;
    down.ly = e.clientY;
    down.moved += Math.abs(dx) + Math.abs(dy);
    const k = 1.1 / R0;
    yaw += dx * k;
    pitch = clamp(pitch + dy * k, -1, 1);
    vyaw = dx * k;
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    lastDrag = performance.now();
    canvas.classList.remove('drag');
    if (down && down.moved < 6 && to === 0) go(1);
    down = null;
  };
  canvas.addEventListener('pointerup', end);
  canvas.addEventListener('pointercancel', end);

  /* ---------- Dust ---------- */

  const dctx = dust.getContext('2d');
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 64;
  {
    const s = sprite.getContext('2d');
    const g = s.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(225,255,236,.9)');
    g.addColorStop(0.4, 'rgba(170,240,200,.38)');
    g.addColorStop(1, 'rgba(170,240,200,0)');
    s.fillStyle = g;
    s.fillRect(0, 0, 64, 64);
  }
  const rnd = rng(5);
  const motes = Array.from({ length: 34 }, () => ({
    x: rnd(), y: rnd(), r: 3 + rnd() ** 2 * 34, s: 0.004 + rnd() * 0.012, p: rnd() * 6.28,
  }));

  /* ---------- Frame ---------- */

  size();
  addEventListener('resize', size);
  new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      const now = performance.now();
      if (e.intersectionRatio > 0.3 && firstSeen < 0) firstSeen = now;
      visibleSince = e.intersectionRatio > 0.6 ? (visibleSince < 0 ? now : visibleSince) : -1;
    },
    { threshold: [0, 0.3, 0.6] }
  ).observe(section);

  section.classList.remove('static');
  section.classList.add('is-globe');
  size();
  pick(0);

  const show = (el, o, minForPointer = 0.6) => {
    el.style.opacity = o.toFixed(3);
    el.style.visibility = o < 0.01 ? 'hidden' : '';
    el.style.pointerEvents = o < minForPointer ? 'none' : '';
  };
  const ease = (dt, r) => 1 - Math.exp(-dt * r);

  let last = performance.now();
  function frame(now) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible) return;
    const t = now / 1000;
    uniforms.time.value = t;

    // If the visitor just looks for a few seconds, turn to the contact details.
    if (!interacted && to === 0 && visibleSince > 0 && now - visibleSince > 4500) go(1);

    st = lerp(from, to, easeInOut(seg(now, t0, t0 + dur)));
    const a = clamp(st);
    const age = firstSeen < 0 ? 0 : (now - firstSeen) / 1000;
    const grow = easeOut(seg(age, 0, 1.5));
    const iw = easeOut(seg(age, 0.75, 1.7));

    cx = lerp(0.5 * W, 0.34 * W, a);
    cy = 0.5 * H;
    R = R0 * lerp(0.03, 1, grow) * lerp(0.82, 1.04, a);
    planet.position.set(cx - W / 2, H / 2 - cy, 0);
    planet.scale.setScalar(R);

    // Rotation: idle spin, drag with inertia, or steer to Harare.
    if (st < 0.02) {
      if (!dragging) {
        yaw += vyaw;
        vyaw *= Math.exp(-dt * 4);
        if (now - lastDrag > 1500) yaw += dt * (0.08 + (1 - grow) * 2.4);
        pitch += (0.16 - pitch) * ease(dt, 1.2);
      }
    } else {
      const target = faceYaw(harareDir);
      let d = (target - yaw) % (2 * Math.PI);
      if (d > Math.PI) d -= 2 * Math.PI;
      if (d < -Math.PI) d += 2 * Math.PI;
      yaw += d * ease(dt, 3.6);
      pitch += (faceLat(harareDir) - pitch) * ease(dt, 3.6);
    }
    spinG.rotation.y = yaw;
    tiltG.rotation.x = pitch;
    uniforms.hi.value = 0.3 + 0.7 * seg(a, 0.15, 0.6);

    // The giant word opens from the centre, then fades as the globe moves.
    const shiftX = -a * 0.08 * W;
    const I = (1 - iw) * 50;
    word.style.transform = `translate(calc(-50% + ${shiftX.toFixed(1)}px), calc(-50% + ${(mouseY * -6).toFixed(1)}px))`;
    word.style.clipPath = `inset(-10% ${I.toFixed(2)}% -10% ${I.toFixed(2)}%)`;
    word.style.opacity = (1 - seg(a, 0.1, 0.5)).toFixed(3);
    eyebrow.style.transform = `translate(${(-wordW / 2 + wordW * 0.02 + shiftX).toFixed(1)}px, ${(-wordH / 2 - 34 + mouseY * -6).toFixed(1)}px)`;
    eyebrow.style.opacity = (iw * (1 - seg(a, 0.05, 0.35))).toFixed(3);

    flare.style.transform = `translate(${(cx + R * 0.74).toFixed(1)}px, ${(cy - R * 0.62).toFixed(1)}px)`;
    flare.style.opacity = (grow * (0.88 + 0.12 * Math.sin(t * 1.3)) * 0.8).toFixed(3);
    hint.style.opacity = (iw * 0.8 * (1 - seg(a, 0, 0.25))).toFixed(3);

    // Pin on Harare.
    const v = harareDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw).applyAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
    pin.style.transform = `translate(${(cx + v.x * R - 6).toFixed(1)}px, ${(cy - v.y * R - 8).toFixed(1)}px)`;
    pin.style.opacity = (seg(v.z, 0.22, 0.42) * seg(age, 1.6, 2.1)).toFixed(3);

    const ka = seg(a, 0.45, 1);
    word1.style.opacity = ka.toFixed(3);
    word1.style.transform = `translate(calc(-50% + ${(0.15 * W + (1 - easeOut(ka)) * 40).toFixed(1)}px), ${(0.6 * H).toFixed(1)}px)`;

    const ls = seg(a, 0.55, 1);
    show(list, ls);
    show(card, ls);
    card.style.transform = `translateX(${((1 - easeOut(seg(a, 0.6, 1))) * 26).toFixed(1)}px)`;
    const bk = seg(a, 0.7, 1);
    show(bar, bk, 0.5);
    bar.style.transform = `translate(-50%, ${((1 - easeOut(bk)) * 34).toFixed(1)}px)`;
    railBtns.forEach((b, i) => b.classList.toggle('on', Math.round(st) === i));

    // Dust.
    dctx.clearRect(0, 0, W, H);
    for (const m of motes) {
      const x = (((m.x + t * m.s + 2) % 1.1) - 0.05) * W;
      const y = (m.y + Math.sin(t * 0.3 + m.p) * 0.02) * H;
      dctx.globalAlpha = (0.3 + 0.35 * Math.sin(t * 0.7 + m.p) ** 2) * 0.6;
      dctx.drawImage(sprite, x - m.r, y - m.r, m.r * 2, m.r * 2);
    }
    dctx.globalAlpha = 1;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);
}
