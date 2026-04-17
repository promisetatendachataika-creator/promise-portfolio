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
    <section id="about" className="py-24 relative overflow-hidden bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="sticky top-32"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Bridging the gap between <span className="text-brand">code</span> and <span className="text-text-dim">efficiency</span>.
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-surface border border-border p-6 rounded-xl group transition-all hover:border-brand/50 hover:bg-surface-lighter">
                    <stat.icon className="text-brand mb-4" size={24} />
                    <div className="text-xl font-bold mb-1">{stat.value}</div>
                    <div className="text-[10px] uppercase tracking-widest text-text-dim font-bold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="relative">
              <div className="absolute -top-12 -left-12 text- brand/10 text-9xl font-bold pointer-events-none select-none">
                01
              </div>
              
              <div className="space-y-8">
                <p className="text-xl md:text-2xl text-text-dim leading-relaxed font-serif italic">
                  I am a <span className="text-text-main font-medium not-italic underline decoration-brand/50">Computer Science student at the University of Zimbabwe</span> (still pursuing my degree) with a passion for building scalable software solutions.
                </p>
                
                <div className="w-16 h-1 bg-brand rounded-full" />
                
                <p className="text-text-dim text-lg leading-relaxed">
                  I thrive at the intersection of technical development and real-world application, 
                  having contributed as a lead developer on software projects for local businesses. 
                  These experiences allowed me to apply my skills in <span className="text-text-main">Java/Spring Boot and React</span> to solve 
                  tangible operational challenges.
                </p>
                
                <p className="text-text-dim text-lg leading-relaxed">
                  My technical expertise spans <span className="text-text-main">full-stack development, AI/ML, and network engineering</span>. 
                  I am driven by the challenge of bridging the gap between complex software architecture 
                  and practical business efficiency.
                </p>

                <div className="pt-8 text-left">
                  <div className="inline-flex items-center gap-4 p-5 rounded-xl bg-surface border border-border transition-all hover:border-brand/40">
                    <div className="w-12 h-12 rounded-lg bg-brand/10 flex items-center justify-center text-brand">
                      <GraduationCap size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-brand uppercase tracking-widest mb-1">Education</div>
                      <div className="font-bold text-text-main text-lg tracking-tight">University of Zimbabwe</div>
                      <div className="text-xs text-text-dim font-mono tracking-tighter uppercase">Currently Pursuing: BSc. Computer Science</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
