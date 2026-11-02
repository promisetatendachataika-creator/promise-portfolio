import type { ReactNode } from 'react';
import Header from './components/Header';
import Projects from './components/Projects';
import { background, contact, skills } from './content';

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="section__title">
        {title}
      </h2>
      <div className="section__body">{children}</div>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main id="top">
        <div className="intro">
          <h1 className="intro__name">
            Promise
            <br />
            Chataika
          </h1>
          <img
            className="intro__photo"
            src="/me.jpeg"
            alt="Promise Chataika"
            width="320"
            height="400"
          />
          <div className="intro__text">
            <p className="lede">
              I study Computer Science at the University of Zimbabwe and live in Harare. Most of what
              I’ve built so far has been for people around me: an ordering system for my family’s
              carpentry workshop, and a website for a local church.
            </p>
            <p>
              I’m looking for a 12-month industrial attachment in software development, networking or
              IT support.
            </p>
            <p className="intro__links">
              <a href={`mailto:${contact.email}`}>Email me</a>
              <a href={contact.whatsapp} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              <a href={contact.cv} download="Promise-Chataika-CV.pdf">
                Download my CV
              </a>
              <a href={contact.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a href={contact.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </p>
          </div>
        </div>

        <Section id="work" title="Work">
          <Projects />
        </Section>

        <Section id="skills" title="Skills">
          <dl className="pairs">
            {skills.map((s) => (
              <div key={s.area}>
                <dt>{s.area}</dt>
                <dd>{s.items}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="background" title="Education">
          <dl className="pairs">
            {background.map((b) => (
              <div key={b.title}>
                <dt>{b.title}</dt>
                <dd>{b.detail}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="contact" title="Contact">
          <p className="lede">The quickest way to reach me is WhatsApp or email.</p>
          <dl className="pairs">
            <div>
              <dt>Email</dt>
              <dd>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </dd>
            </div>
            <div>
              <dt>Phone and WhatsApp</dt>
              <dd>
                <a href={contact.phoneHref}>{contact.phone}</a>{' '}
                <span className="muted">
                  (<a href={contact.whatsapp} target="_blank" rel="noreferrer">open WhatsApp</a>)
                </span>
              </dd>
            </div>
            <div>
              <dt>Based in</dt>
              <dd>Harare, Zimbabwe</dd>
            </div>
          </dl>
        </Section>
      </main>

      <footer className="site-footer">
        <p>© {new Date().getFullYear()} Promise Chataika</p>
      </footer>
    </>
  );
}
