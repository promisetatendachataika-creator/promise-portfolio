import React from "react";
import { motion } from "motion/react";
import { Github, ExternalLink, Code, Layers } from "lucide-react";

const projects = [
  {
    title: "Inventory Management System",
    description: "A comprehensive solution for local retail businesses to track stock levels, sales, and predictive restock alerts.",
    image: "https://picsum.photos/seed/inventory/800/600",
    tags: ["React", "Java", "Spring Boot", "MySQL"],
    github: "#",
    demo: "#",
    accent: "bg-blue-500",
  },
  {
    title: "AI Predictive Analytics Dashboard",
    description: "A data visualization platform analyzing market trends using machine learning models implemented in Python.",
    image: "https://picsum.photos/seed/ai/800/600",
    tags: ["Python", "React", "Scikit-Learn", "FastAPI"],
    github: "#",
    demo: "#",
    accent: "bg-purple-500",
  },
  {
    title: "Network Monitor Tool",
    description: "Real-time network traffic analyzer designed to visualize throughput and identify potential security threats.",
    image: "https://picsum.photos/seed/network/800/600",
    tags: ["C#", "Network Protocols", "Oracle", "Charts.js"],
    github: "#",
    demo: "#",
    accent: "bg-emerald-500",
  },
  {
    title: "Brand Identity & UI Design",
    description: "Creating cohesive brand assets and interface mockups to improve user engagement.",
    image: "https://picsum.photos/seed/design/800/600",
    tags: ["Figma", "Adobe Suite", "Branding", "UI/UX"],
    github: "#",
    demo: "#",
    accent: "bg-violet-500",
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 italic tracking-tight">Recent Works</h2>
            <p className="text-gray-400 max-w-xl text-lg">
              A selection of projects that showcase my ability to solve tangible business 
              operational challenges through modern technology.
            </p>
          </div>
          <motion.div
            animate={{ rotate: [0, 90, 180, 270, 360] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="hidden md:block text-brand opacity-20"
          >
            <Layers size={80} />
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group rounded-2xl overflow-hidden bg-surface border border-border transition-all duration-500 hover:border-brand/50 hover:-translate-y-2"
            >
              <div className="relative aspect-video overflow-hidden border-b border-border">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale opacity-80 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">Featured Project</div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-text-main group-hover:text-brand transition-colors uppercase tracking-tight">
                  {project.title}
                </h3>
                
                <p className="text-text-dim text-xs mb-6 leading-relaxed line-clamp-2 font-serif italic">
                  {project.description}
                </p>

                <div className="flex items-center justify-between pt-5 border-t border-border">
                  <div className="flex gap-4">
                    <a href={project.github} className="text-text-dim hover:text-brand text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 border-b border-transparent hover:border-brand">
                      <Github size={14} /> GitHub
                    </a>
                  </div>
                  
                  <motion.a
                    href="#"
                    whileHover={{ x: 3 }}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand flex items-center gap-1.5"
                  >
                    View Case Study
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
