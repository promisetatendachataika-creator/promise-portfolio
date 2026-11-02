import { projects, smallerProjects } from '../content';

export default function Projects() {
  return (
    <>
      <div className="projects">
        {projects.map((p) => (
          <article key={p.name} className="project">
            <h3 className="project__name">{p.name}</h3>
            <p className="project__status">{p.status}</p>
            <p className="project__summary">{p.summary}</p>
            {p.details.map((d) => (
              <p key={d}>{d}</p>
            ))}
            <p className="project__stack">
              <span className="visually-hidden">Built with: </span>
              {p.stack.join(', ')}
            </p>
            {p.links.length > 0 && (
              <p className="project__links">
                {p.links.map((l) => (
                  <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                    {l.label}
                  </a>
                ))}
              </p>
            )}
          </article>
        ))}
      </div>

      <h3 className="minor-heading">Smaller projects</h3>
      <ul className="plain-list">
        {smallerProjects.map((p) => (
          <li key={p.href}>
            <a href={p.href} target="_blank" rel="noreferrer">
              {p.name}
            </a>{' '}
            <span className="muted">in {p.note}</span>
          </li>
        ))}
      </ul>
    </>
  );
}
