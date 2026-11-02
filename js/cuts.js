// Cuts the glass panel into one piece per project, for any number of
// projects. Pieces sit in rows; each row boundary is a straight, slightly
// tilted line, and each divider inside a row leans a little. Everything
// drifts slowly, and dividers shy away from the pointer.
//
// Coordinates are panel fractions: x right, y down, 0 to 1.

import { rng } from './util.js';

function rowCounts(n) {
  if (n <= 0) return [];
  if (n <= 3) return [n];
  const rows = n <= 8 ? 2 : n <= 12 ? 3 : Math.ceil(n / 4);
  const base = Math.floor(n / rows);
  const extra = n % rows;
  // Put the extra pieces in the lower rows, so the top row (with the
  // featured project) keeps the biggest pieces.
  return Array.from({ length: rows }, (_, i) => base + (i >= rows - extra ? 1 : 0));
}

export function makeCuts(n) {
  const R = rng(31 + n);
  const rows = rowCounts(n);
  const featured = rows.length > 1 && rows[0] > 1;

  // Row boundaries. The first row is a little taller.
  const heights = rows.map((_, i) => (i === 0 && rows.length > 1 ? 1.35 : 1));
  const total = heights.reduce((a, b) => a + b, 0);
  const lines = [{ y: 0, fixed: true }];
  let acc = 0;
  for (let i = 0; i < rows.length - 1; i++) {
    acc += heights[i];
    lines.push({
      y: acc / total,
      jl: (R() - 0.5) * 0.08,
      jr: (R() - 0.5) * 0.08,
      pl: 12 + R() * 8,
      pr: 12 + R() * 8,
      al: R() * 6.28,
      ar: R() * 6.28,
    });
  }
  lines.push({ y: 1, fixed: true });

  // Dividers inside each row. The first piece is wider when it's featured.
  const dividers = rows.map((c, r) => {
    const w = Array.from({ length: c }, (_, j) => (r === 0 && j === 0 && featured ? 1.5 : 1));
    const sum = w.reduce((a, b) => a + b, 0);
    const out = [];
    let x = 0;
    for (let j = 0; j < c - 1; j++) {
      x += w[j] / sum;
      out.push({
        t: x + (R() - 0.5) * 0.08,
        b: x + (R() - 0.5) * 0.08,
        pt: 10 + R() * 10,
        pb: 10 + R() * 10,
        at: R() * 6.28,
        ab: R() * 6.28,
      });
    }
    return out;
  });

  const wave = (t, period, phase, amp) => (t == null ? 0 : Math.sin((t * 2 * Math.PI) / period + phase) * amp);

  // Returns one polygon (list of [x, y]) per piece. t = null gives the
  // resting shape; ptr = { u, v, amt } pushes dividers away from the pointer.
  function polys(t = null, ptr = null) {
    const ly = lines.map((L) =>
      L.fixed ? [L.y, L.y] : [L.y + L.jl + wave(t, L.pl, L.al, 0.02), L.y + L.jr + wave(t, L.pr, L.ar, 0.02)]
    );
    const yOn = (k, x) => ly[k][0] + (ly[k][1] - ly[k][0]) * x;
    const push = (x, y) => {
      if (!ptr || ptr.amt < 0.001) return x;
      const dx = x - ptr.u;
      const d = Math.hypot(dx, y - ptr.v);
      return d < 0.35 && d > 1e-4 ? x + Math.sign(dx) * 0.03 * (1 - d / 0.35) * ptr.amt : x;
    };
    const divs = dividers.map((row, r) =>
      row.map((dv) => {
        let xt = dv.t + wave(t, dv.pt, dv.at, 0.015);
        let xb = dv.b + wave(t, dv.pb, dv.ab, 0.015);
        xt = push(xt, yOn(r, xt));
        xb = push(xb, yOn(r + 1, xb));
        return [xt, xb];
      })
    );

    const out = [];
    rows.forEach((c, r) => {
      const d = [[0, 0], ...divs[r], [1, 1]];
      // Divider ends from the neighbouring rows also sit on this row's
      // top and bottom lines; include them so the pieces tile exactly.
      const above = r > 0 ? divs[r - 1].map((v) => v[1]) : [];
      const below = r < rows.length - 1 ? divs[r + 1].map((v) => v[0]) : [];
      for (let j = 0; j < c; j++) {
        const [xtl, xbl] = d[j];
        const [xtr, xbr] = d[j + 1];
        const top = [xtl, ...above.filter((x) => x > xtl + 1e-3 && x < xtr - 1e-3).sort((a, b) => a - b), xtr];
        const bottom = [xbr, ...below.filter((x) => x > xbl + 1e-3 && x < xbr - 1e-3).sort((a, b) => b - a), xbl];
        out.push([...top.map((x) => [x, yOn(r, x)]), ...bottom.map((x) => [x, yOn(r + 1, x)])]);
      }
    });
    return out;
  }

  return { count: n, featured, polys };
}
