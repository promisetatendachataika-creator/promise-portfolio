import React from "react";
import { motion } from "motion/react";
import { GraduationCap, Code2, Users2, Database } from "lucide-react";

export default function About() {
  const stats = [
    { label: "University", value: "Zimbabwe", icon: GraduationCap },
    { label: "Lead Developer", value: "Projects", icon: Code2 },
    { label: "Business Tools", value: "Impact", icon: Users2 },
    { label: "Solutions", value: "Scalable", icon: Database },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-slate-950/70">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.14),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.08),transparent_28%)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-[11px] uppercase tracking-[0.35em] text-brand font-semibold">
              About Me
            </span>
            <h2 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight text-white">About Me</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-text-dim md:text-base">
            I am a driven student and developer focused on building polished software solutions for real-world needs.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.35)]"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-white">Hello!</h3>
                <p className="mt-3 text-text-dim text-lg leading-relaxed font-serif italic">
                  I am a <span className="text-white font-semibold not-italic underline decoration-brand/40">Computer Science student at the University of Zimbabwe</span> (still pursuing my degree) with a passion for building scalable software solutions.
                </p>
              </div>

              <div className="space-y-4 text-text-dim text-lg leading-relaxed">
                <p>
                  I thrive at the intersection of technical development and real-world application, having contributed as a lead developer on software projects for local businesses.
                </p>
                <p>
                  These experiences allowed me to apply my skills in <span className="text-white">Java/Spring Boot and React</span> to solve tangible operational challenges.
                </p>
                <p>
                  My technical expertise spans <span className="text-white">full-stack development, AI/ML, and network engineering</span>. I am driven by the challenge of bridging the gap between complex software architecture and practical business efficiency.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-6">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 transition-all hover:border-brand/40"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                        <stat.icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm uppercase tracking-[0.22em] text-text-dim">{stat.label}</p>
                        <p className="mt-2 text-xl font-semibold text-white">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2.5rem] border border-brand/20 bg-slate-950/40 p-4 shadow-2xl shadow-brand/10">
              <img
                src="/me.jpeg"
                alt="Promise Chataika working"
                className="h-full w-full rounded-[2rem] object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -right-8 -bottom-8 rounded-full border-2 border-brand/40 bg-slate-950/90 px-5 py-4 text-left backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.35em] text-brand">Experience</p>
                <p className="mt-2 text-2xl font-bold text-white">Lead Developer</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
