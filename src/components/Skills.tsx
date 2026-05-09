import React from "react";
import { motion } from "motion/react";
import { Laptop, Server, BrainCircuit, Palette, ShieldCheck } from "lucide-react";

const skillCategories = [
  {
    title: "Full-Stack Development",
    icon: Laptop,
    skills: ["React", "JavaScript", "CSS3", "HTML5", "TypeScript", "Tailwind CSS"],
    color: "from-cyan-500/10 to-sky-500/10",
  },
  {
    title: "Backend & API",
    icon: Server,
    skills: ["Java", "Spring Boot", "Node.js", "Express", "REST APIs"],
    color: "from-emerald-500/10 to-lime-500/10",
  },
  {
    title: "AI/ML & Data Science",
    icon: BrainCircuit,
    skills: ["Python", "Scikit-learn", "TensorFlow", "Data Analysis", "NumPy"],
    color: "from-violet-500/10 to-fuchsia-500/10",
  },
  {
    title: "Design",
    icon: Palette,
    skills: ["Visual Asset Design", "UI/UX Prototyping"],
    color: "from-rose-500/10 to-pink-500/10",
  },
  {
    title: "Core Engineering",
    icon: ShieldCheck,
    skills: ["C#", "MySQL", "Oracle", "Git", "Cisco Packet Tracer", "Network Engineering"],
    color: "from-amber-500/10 to-orange-500/10",
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-slate-950/80">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.12),transparent_18%),radial-gradient(circle_at_bottom_left,rgba(59,130,246,0.08),transparent_30%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-16 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <h2 className="text-5xl font-bold tracking-tight text-white">Skills</h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-text-dim">
              I am striving to never stop learning and improving across the tools and technologies that power modern products.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.25)]">
            <div className="flex flex-wrap gap-3">
              {skillCategories[0].skills.slice(0, 4).map((skill) => (
                <span key={skill} className="rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-[0_30px_70px_rgba(15,23,42,0.2)] transition-all hover:-translate-y-2 hover:border-brand/30"
            >
              <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${category.color} border border-white/10 text-brand`}> 
                <category.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{category.title}</h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-text-dim"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, idx) => (
            <div key={idx} className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center transition-all hover:border-brand/40">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-brand/10 text-brand">
                <category.icon size={24} />
              </div>
              <p className="font-semibold text-white">{category.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
