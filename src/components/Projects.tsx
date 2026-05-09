import React from "react";
import { motion } from "motion/react";
import { Github, ExternalLink, Layers } from "lucide-react";

const projects = [
  {
    title: "Telecom License Regulator",
    description: "A React + TypeScript web application for managing telecom license applications, tracking fees, comparing licenses, and generating AI-powered compliance reports.",
    image: "https://picsum.photos/seed/telecom/900/700",
    tags: ["React", "TypeScript", "Firebase", "Gemini AI", "Vite"],
    github: "https://github.com/promisetatendachataika-creator/Telecom-Licence-Regulator",
    demo: "https://telecomunication1.netlify.app",
  },
  {
    title: "Inventory Management System",
    description: "A comprehensive solution for local retail businesses to track stock levels, sales, and predictive restock alerts.",
    image: "https://picsum.photos/seed/inventory/900/700",
    tags: ["React", "Java", "Spring Boot", "MySQL"],
    github: "https://github.com/promisetatendachataika-creator/chats-and-sons-app",
    demo: "https://chatsandsons.netlify.app",
  },
  {
    title: "AI Predictive Analytics Dashboard",
    description: "A data visualization platform analyzing market trends using machine learning models implemented in Python.",
    image: "https://picsum.photos/seed/ai/900/700",
    tags: ["Python", "React", "Scikit-Learn", "FastAPI"],
    github: "#",
    demo: "#",
  },
  {
    title: "Network Monitor Tool",
    description: "Real-time network traffic analyzer designed to visualize throughput and identify potential security threats.",
    image: "https://picsum.photos/seed/network/900/700",
    tags: ["C#", "Network Protocols", "Oracle", "Charts.js"],
    github: "#",
    demo: "#",
  },
  {
    title: "Brand Identity & UI Design",
    description: "Creating cohesive brand assets and interface mockups to improve user engagement.",
    image: "https://picsum.photos/seed/design/900/700",
    tags: ["Figma", "Adobe Suite", "Branding", "UI/UX"],
    github: "#",
    demo: "#",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-slate-950/80">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.12),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.08),transparent_30%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-5xl font-bold tracking-tight text-white">Works</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-dim">
              I had the pleasure with these awesome projects that bring business ideas and systems to life.
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 90, 180, 270, 360] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="hidden md:block text-brand opacity-20"
          >
            <Layers size={88} />
          </motion.div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="grid gap-8 sm:grid-cols-2">
            {projects.slice(0, 2).map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 shadow-[0_30px_90px_rgba(15,23,42,0.25)] transition-all hover:-translate-y-2"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                  <div className="absolute left-6 bottom-6 rounded-3xl bg-slate-950/80 px-4 py-3 text-xs uppercase tracking-[0.3em] text-brand backdrop-blur-sm">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-text-dim leading-relaxed text-sm font-serif italic mb-5">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-text-dim">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand transition-all hover:bg-brand/20"
                    >
                      <Github size={14} /> GitHub
                    </a>
                    {project.demo && project.demo !== "#" && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-all hover:border-brand"
                      >
                        <ExternalLink size={14} /> Live Site
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-[2.5rem] border border-white/10 bg-slate-950/90 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.3)]"
          >
            <div className="mb-8 flex items-center gap-4">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-brand/10 text-brand">
                <Layers size={24} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-text-dim">Showcase</p>
                <h3 className="text-3xl font-bold text-white">View Website</h3>
              </div>
            </div>
            <p className="text-text-dim leading-relaxed">
              Each project is built to solve practical business challenges with thoughtful UI, strong backend architecture, and modern tooling.
            </p>
            <div className="mt-10">
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-950 transition-all hover:opacity-90"
              >
                Explore more
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
