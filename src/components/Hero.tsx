import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-brand/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-600/10 blur-[140px] rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand-light text-xs font-bold tracking-widest uppercase mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
              </span>
              Available for opportunities
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Promota Engineering <span className="text-gradient">Intelligent</span> <br />
              Solutions.
            </h1>
            
            <p className="text-lg md:text-xl text-text-dim max-w-xl mb-10 leading-relaxed font-serif italic border-l-2 border-brand pl-6">
              Computer Science Student & Technical Contributor. Focused on building scalable, 
              full-stack software that solves real-world operational challenges.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-brand text-black font-bold rounded-lg flex items-center gap-2"
              >
                View Projects
                <ArrowRight size={18} />
              </motion.a>
              <motion.a
                href="https://wa.me/263782573320"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent text-text-main font-bold rounded-lg border border-border hover:border-brand transition-all flex items-center gap-2"
              >
                Chat on WhatsApp
              </motion.a>
            </div>

            <div className="flex gap-6 text-gray-500">
              {[
                { icon: Github, href: "https://github.com/promisetatendachataika-creator", label: "Github" },
                { icon: Linkedin, href: "https://www.linkedin.com/me?trk=p_mwlite_feed-secondary_nav", label: "LinkedIn" },
                { icon: Mail, href: "mailto:promisetatendachataika@gmail.com", label: "Email" },
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -4, color: "#fff" }}
                  className="transition-colors p-2 bg-surface rounded-xl border border-white/5"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-center lg:justify-end relative"
          >
            <div className="relative w-72 h-72 md:w-[450px] md:h-[450px]">
              {/* Image Frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand/40 to-purple-600/40 rounded-[2rem] rotate-6 blur-2xl opacity-20" />
              <div className="relative w-full h-full rounded-2xl border border-border overflow-hidden bg-surface group transition-all duration-500 hover:border-brand/50">
                <img
                  src="/me.jpeg"
                  alt="Promise Chataika - Professional"
                  className="w-full h-full object-contain grayscale brightness-95 transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              {/* Experience Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-surface border border-border p-6 rounded-xl shadow-2xl max-w-[200px]"
              >
                <div className="text-3xl font-bold text-brand italic leading-none mb-1">PC</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-text-dim">
                  Pursuing CS Degree at UZ
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/10 flex justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-3 bg-brand rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
