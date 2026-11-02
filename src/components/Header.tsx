import { useEffect, useState } from 'react';
import { contact } from '../content';

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

export default function Header() {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // Storage can be blocked; the toggle still works for this visit.
    }
  }, [theme]);

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="site-header">
      <a href="#top" className="site-header__name">
        Promise Chataika
      </a>
      <nav className="site-header__nav" aria-label="Sections">
        <a href="#work">Work</a>
        <a href="#skills">Skills</a>
        <a href="#contact">Contact</a>
        <a href={contact.cv} download="Promise-Chataika-CV.pdf">
          CV
        </a>
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(next)}
          aria-label={`Switch to ${next} mode`}
          title={`Switch to ${next} mode`}
        >
          {theme === 'dark' ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <circle cx="12" cy="12" r="4.5" fill="currentColor" />
              <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </g>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="currentColor" />
            </svg>
          )}
        </button>
      </nav>
    </header>
  );
}
