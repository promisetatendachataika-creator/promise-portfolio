// Fills the Work and Certifications sections from the files in /data.
// Those files are edited from the admin page (/admin), so adding a
// project never needs a code change.

const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
};

// Only allow ordinary web, email and phone links.
const safeUrl = (u) => {
  try {
    const url = new URL(u, location.href);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

export function renderProject(p) {
  const art = el('article', 'project');
  art.append(el('h3', null, p.name || 'Untitled project'));
  if (p.status) art.append(el('p', 'project__status', p.status));
  if (p.summary) art.append(el('p', 'project__summary', p.summary));
  for (const d of p.details || []) if (d.trim()) art.append(el('p', null, d));
  if (p.stack) art.append(el('p', 'project__stack', p.stack));
  const links = (p.links || []).filter((l) => safeUrl(l.url));
  if (links.length) {
    const row = el('p', 'project__links');
    for (const l of links) {
      const a = el('a', null, l.label || 'Open');
      a.href = safeUrl(l.url);
      a.target = '_blank';
      a.rel = 'noreferrer';
      row.append(a);
    }
    art.append(row);
  }
  return art;
}

async function getJSON(path) {
  const r = await fetch(new URL(`../${path}`, import.meta.url), { cache: 'no-cache' });
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return r.json();
}

export async function loadContent() {
  const list = document.getElementById('work-list');
  const certs = document.getElementById('certs-list');
  const [projects, certifications] = await Promise.all([
    getJSON('data/projects.json').catch((e) => (console.warn(e), [])),
    getJSON('data/certifications.json').catch((e) => (console.warn(e), [])),
  ]);
  list.replaceChildren(...projects.map(renderProject));
  certs.replaceChildren(
    ...certifications.map((c) => {
      const row = el('div');
      row.append(el('dt', null, c.name), el('dd', null, c.issuer || ''));
      return row;
    })
  );
  return projects;
}
