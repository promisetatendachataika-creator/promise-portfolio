import React from "react";
import { motion } from "motion/react";
import { Laptop, Server, BrainCircuit, ShieldCheck, Palette } from "lucide-react";

const skillCategories = [
  {
    title: "Full-Stack Development",
    icon: Laptop,
    skills: ["React", "JavaScript", "CSS3", "HTML5", "TypeScript", "Tailwind CSS"],
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "Backend & API",
    icon: Server,
    skills: ["Java", "Spring Boot", "Node.js", "Express", "REST APIs"],
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    title: "AI/ML & Data Science",
    icon: BrainCircuit,
    skills: ["Python", "Scikit-learn", "TensorFlow", "Data Analysis", "NumPy"],
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Design",
    icon: Palette,
    skills: ["Visual Asset Design", "UI/UX Prototyping"],
    color: "from-violet-500/20 to-fuchsia-500/20",
  },
  {
    title: "Core Engineering",
    icon: ShieldCheck,
    skills: ["C#", "MySQL", "Oracle", "Git", "Cisco Packet Tracer", "Network Engineering"],
    color: "from-orange-500/20 to-amber-500/20",
  },
];

export default function Skills() {
  return (
    <section id="skills" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Technical Expertise</h2>
            <p className="text-gray-400 max-w-xl text-lg">
              A comprehensive breakdown of my technical capabilities across various layers 
              of the software engineering stack.
            </p>
          </div>
          <div className="font-mono text-brand text-sm tracking-[0.2em] font-bold uppercase">
            / Full-Stack Capability
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-brand/[0.03] border border-border relative group transition-all duration-500 hover:border-brand/50 hover:bg-brand/[0.05]"
            >
              <div className="mb-6 w-14 h-14 rounded-xl bg-surface border border-border flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-surface-lighter">
                <category.icon className="text-brand" size={28} />
              </div>
              
              <h3 className="text-lg font-bold mb-6 text-text-main group-hover:text-brand transition-colors uppercase tracking-tight">
                {category.title}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-md bg-surface-lighter border border-border text-[10px] font-bold uppercase tracking-wider text-text-dim hover:text-brand hover:border-brand/30 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
