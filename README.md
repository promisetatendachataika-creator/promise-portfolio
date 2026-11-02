# promise-portfolio

My personal site: the projects I've built, what I work with, and how to reach me.

I'm a Computer Science student at the University of Zimbabwe, looking for a 12-month industrial attachment.

It's plain HTML, CSS and JavaScript with no build step. The 3D parts use [three.js](https://threejs.org) and the
globe uses country outlines from [world-atlas](https://github.com/topojson/world-atlas) (kept in `data/`). three.js and
d3-geo load from jsDelivr.

## Running it locally

Any static server works, for example:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. (Opening `index.html` straight from the file system won't load the JavaScript modules.)

## How it's put together

- `index.html` holds the page text.
- `data/projects.json` and `data/certifications.json` hold the projects and certificates. Edit them from the admin page.
- `admin/` is the admin page (`/admin`). It saves changes to those two files on GitHub using a fine-grained access key
  that has Contents read and write access to this repository only. The key stays in the browser that uses it.
- `css/style.css` is the layout and type.
- `js/main.js` draws the background glow, the letter-by-letter reveals and the pinned statement.
- `js/content.js` builds the project and certificate lists from `data/`.
- `js/glass.js` and `js/cuts.js` turn the project list into glass pieces, one per project, on larger screens.
- `js/globe.js` draws the globe in the Contact section on large screens.

On phones, with reduced motion turned on, or if WebGL isn't available, the Work and Contact sections fall back to
plain lists, so everything is still readable.
