# promise-portfolio

My personal site: the projects I've built, what I work with, and how to reach me.

I'm a Computer Science student at the University of Zimbabwe, looking for a 12-month industrial attachment.

It's plain HTML, CSS and JavaScript with no build step. The 3D parts use [three.js](https://threejs.org) and the
globe uses country outlines from [world-atlas](https://github.com/topojson/world-atlas), all loaded from jsDelivr.

## Running it locally

Any static server works, for example:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. (Opening `index.html` straight from the file system won't load the JavaScript modules.)

## How it's put together

- `index.html` holds all the text. The project list in the Work section is the source for the glass pieces too.
- `css/style.css` is the layout and type.
- `js/main.js` draws the background glow, the letter-by-letter reveals and the pinned statement.
- `js/glass.js` turns the project list into glass pieces on large screens.
- `js/globe.js` draws the globe in the Contact section on large screens.

On phones, with reduced motion turned on, or if WebGL isn't available, the Work and Contact sections fall back to
plain lists, so everything is still readable.
