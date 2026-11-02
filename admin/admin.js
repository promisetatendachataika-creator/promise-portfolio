// Admin page: edit data/projects.json and data/certifications.json and
// save them to GitHub. The site reads those files, so a save here updates
// the site once Netlify has redeployed (about a minute).

const OWNER = 'promisetatendachataika-creator';
const REPO = 'promise-portfolio';
const FILES = { projects: 'data/projects.json', certs: 'data/certifications.json' };
const KEY_TOKEN = 'pc-admin-token';
const KEY_BRANCH = 'pc-admin-branch';

const $ = (s) => document.querySelector(s);
const store = {
  get: (k) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch {}
  },
  del: (k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  },
};

/* ---------- GitHub ---------- */

let token = '';
let branch = 'main';
const sha = { projects: null, certs: null };

const toB64 = (text) => {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};
const fromB64 = (b64) => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, '')), (c) => c.charCodeAt(0)));

async function gh(path, opts = {}) {
  const r = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/${path}`, {
    ...opts,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  if (!r.ok) {
    const msg = {
      401: 'GitHub didn’t accept that key. Check it was copied in full and hasn’t expired.',
      403: 'That key can’t change this repository. Give it “Contents: Read and write” on promise-portfolio.',
      404: `Couldn’t find the files on the “${branch}” branch. Check the branch name, and that the key can see promise-portfolio.`,
      409: 'The files changed on GitHub since you opened this page. Reload the page and make your change again.',
      422: 'GitHub rejected the save. Reload the page and try again.',
    }[r.status];
    throw new Error(msg || `GitHub said ${r.status}. Try again in a moment.`);
  }
  return r.json();
}

async function readFile(which) {
  const data = await gh(`contents/${FILES[which]}?ref=${encodeURIComponent(branch)}`);
  sha[which] = data.sha;
  return JSON.parse(fromB64(data.content));
}

async function writeFile(which, value, message) {
  const res = await gh(`contents/${FILES[which]}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: toB64(JSON.stringify(value, null, 2) + '\n'),
      sha: sha[which],
      branch,
    }),
  });
  sha[which] = res.content.sha;
}

/* ---------- State ---------- */

let projects = [];
let certs = [];
const dirty = { projects: false, certs: false };
let editing = -1;

function markDirty(which) {
  dirty[which] = true;
  $('#savebar').hidden = false;
  setSave('You have changes that aren’t on the site yet.');
  $('#save').disabled = false;
}

function setStatus(el, text, kind = '') {
  el.textContent = text;
  el.className = `status ${kind}`;
}

function setSave(text) {
  $('#save-status').textContent = text;
}

addEventListener('beforeunload', (e) => {
  if (dirty.projects || dirty.certs) e.preventDefault();
});

/* ---------- Lists ---------- */

function button(text, title, onClick, cls = 'icon') {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = cls;
  b.textContent = text;
  b.title = title;
  b.setAttribute('aria-label', title);
  b.addEventListener('click', onClick);
  return b;
}

function move(arr, i, d) {
  const j = i + d;
  if (j < 0 || j >= arr.length) return false;
  [arr[i], arr[j]] = [arr[j], arr[i]];
  return true;
}

function renderList(listEl, arr, which, describe, onEdit) {
  listEl.replaceChildren(
    ...arr.map((item, i) => {
      const li = document.createElement('li');
      if (which === 'projects' && i === editing) li.className = 'editing';
      const text = document.createElement('div');
      text.className = 'item__text';
      const name = document.createElement('div');
      name.className = 'item__name';
      name.textContent = item.name;
      const sub = document.createElement('div');
      sub.className = 'item__sub';
      sub.textContent = describe(item);
      text.append(name, sub);
      const btns = document.createElement('div');
      btns.className = 'item__btns';
      const up = button('↑', `Move ${item.name} up`, () => move(arr, i, -1) && (markDirty(which), renderAll()));
      const down = button('↓', `Move ${item.name} down`, () => move(arr, i, 1) && (markDirty(which), renderAll()));
      up.disabled = i === 0;
      down.disabled = i === arr.length - 1;
      if (onEdit) btns.append(button('Edit', `Edit ${item.name}`, () => onEdit(i)));
      btns.append(
        up,
        down,
        button(
          'Delete',
          `Delete ${item.name}`,
          () => {
            if (!confirm(`Delete “${item.name}”? It goes from the site when you save.`)) return;
            arr.splice(i, 1);
            if (which === 'projects') {
              if (editing === i) resetProjectForm();
              else if (editing > i) editing--;
            }
            markDirty(which);
            renderAll();
          },
          'icon icon--danger'
        )
      );
      li.append(text, btns);
      return li;
    })
  );
}

function renderAll() {
  renderList($('#project-list'), projects, 'projects', (p) => [p.status, p.links?.[0]?.url].filter(Boolean).join(' · '), editProject);
  renderList($('#cert-list'), certs, 'certs', (c) => c.issuer || '');
  $('#project-count').textContent = `${projects.length} on the site`;
}

/* ---------- Project form ---------- */

const form = $('#project-form');
const LABELS = [...form.label.options].map((o) => o.value);

function resetProjectForm() {
  editing = -1;
  form.reset();
  $('#more').open = false;
  $('#project-form-title').textContent = 'Add a project';
  $('#project-submit').textContent = 'Add project';
  $('#project-cancel').hidden = true;
}

function editProject(i) {
  const p = projects[i];
  editing = i;
  const links = [...(p.links || [])];
  const main = links.shift() || { label: 'Visit the site', url: '' };
  const srcIdx = links.findIndex((l) => l.label === 'Source code');
  const source = srcIdx >= 0 ? links.splice(srcIdx, 1)[0].url : '';
  if (!LABELS.includes(main.label)) {
    const o = document.createElement('option');
    o.textContent = main.label;
    form.label.append(o);
    LABELS.push(main.label);
  }
  form.name.value = p.name || '';
  form.url.value = main.url;
  form.label.value = main.label;
  form.status.value = p.status || '';
  form.summary.value = p.summary || '';
  form.details.value = (p.details || []).join('\n\n');
  form.stack.value = p.stack || '';
  form.source.value = source;
  form.extra.value = links.map((l) => `${l.label} | ${l.url}`).join('\n');
  $('#more').open = !!(p.status || p.summary || p.details?.length || p.stack || source || links.length);
  $('#project-form-title').textContent = `Edit “${p.name}”`;
  $('#project-submit').textContent = 'Save changes';
  $('#project-cancel').hidden = false;
  renderAll();
  $('#project-form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
  form.name.focus({ preventScroll: true });
}

$('#project-cancel').addEventListener('click', () => {
  resetProjectForm();
  renderAll();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const f = form;
  const links = [{ label: f.label.value, url: f.url.value.trim() }];
  if (f.source.value.trim() && f.source.value.trim() !== links[0].url) {
    links.push({ label: 'Source code', url: f.source.value.trim() });
  }
  for (const line of f.extra.value.split('\n')) {
    const [label, url] = line.split('|').map((x) => x.trim());
    if (label && url && /^https?:\/\//i.test(url)) links.push({ label, url });
  }
  const project = {
    name: f.name.value.trim(),
    status: f.status.value.trim(),
    summary: f.summary.value.trim(),
    details: f.details.value
      .split(/\n\s*\n/)
      .map((x) => x.replace(/\s*\n\s*/g, ' ').trim())
      .filter(Boolean),
    stack: f.stack.value.trim(),
    links,
  };
  if (editing >= 0) projects[editing] = project;
  else projects.push(project);
  markDirty('projects');
  const added = editing < 0;
  resetProjectForm();
  renderAll();
  setSave(added ? `Added “${project.name}”. Press Save to put it on the site.` : `Updated “${project.name}”. Press Save to put it on the site.`);
});

/* ---------- Certificate form ---------- */

$('#cert-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const f = e.target;
  certs.push({ name: f.name.value.trim(), issuer: f.issuer.value.trim() });
  f.reset();
  markDirty('certs');
  renderAll();
});

/* ---------- Connect and save ---------- */

async function connect() {
  const status = $('#connect-status');
  setStatus(status, 'Connecting…');
  try {
    [projects, certs] = await Promise.all([readFile('projects'), readFile('certs')]);
    store.set(KEY_TOKEN, token);
    store.set(KEY_BRANCH, branch);
    setStatus(status, `Connected. Editing the “${branch}” branch.`, 'ok');
    $('#forget').hidden = false;
    $('#editor').hidden = false;
    resetProjectForm();
    renderAll();
  } catch (err) {
    setStatus(status, err.message, 'err');
    $('#editor').hidden = true;
  }
}

$('#connect-form').addEventListener('submit', (e) => {
  e.preventDefault();
  token = $('#token').value.trim();
  branch = $('#branch').value.trim() || 'main';
  connect();
});

$('#forget').addEventListener('click', () => {
  store.del(KEY_TOKEN);
  token = '';
  $('#token').value = '';
  $('#editor').hidden = true;
  $('#savebar').hidden = true;
  $('#forget').hidden = true;
  setStatus($('#connect-status'), 'The key has been removed from this browser.');
});

$('#save').addEventListener('click', async () => {
  const btn = $('#save');
  btn.disabled = true;
  setSave('Saving…');
  try {
    if (dirty.projects) {
      await writeFile('projects', projects, 'Update projects from the admin page');
      dirty.projects = false;
    }
    if (dirty.certs) {
      await writeFile('certs', certs, 'Update certifications from the admin page');
      dirty.certs = false;
    }
    setSave('Saved. The site will show the changes in about a minute.');
  } catch (err) {
    setSave(err.message);
    btn.disabled = false;
  }
});

// Reconnect automatically if a key was saved earlier.
const savedToken = store.get(KEY_TOKEN);
$('#branch').value = store.get(KEY_BRANCH) || 'main';
if (savedToken) {
  token = savedToken;
  branch = $('#branch').value;
  $('#token').value = savedToken;
  connect();
}
