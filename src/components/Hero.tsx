import React from "react";
import { motion } from "motion/react";
import { ArrowRight, Github, Linkedin, Mail, MapPin, Briefcase, MessageCircle } from "lucide-react";

const profileItems = [
  {
    label: "Email",
    value: "promisetatendachataika@gmail.com",
    icon: Mail,
    href: "mailto:promisetatendachataika@gmail.com",
  },
  {
    label: "Location",
    value: "Harare, Zimbabwe",
    icon: MapPin,
  },
  {
    label: "Availability",
    value: "Full-time / Freelancer",
    icon: Briefcase,
  },
];

const quickSkills = ["HTML", "CSS", "JS", "REACT"];

const socialLinks = [
  { icon: Github, href: "https://github.com/promisetatendachataika-creator", label: "Github" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/promise-chataika-03178a335", label: "LinkedIn" },
];

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-24">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-24 top-24 w-72 h-72 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute -right-24 bottom-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-slate-950/90 via-slate-950/0 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8 z-10"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-semibold uppercase tracking-[0.32em]">
              <span className="h-2 w-2 rounded-full bg-brand animate-pulse inline-block" />
              Available for freelance work
            </div>

            <div className="space-y-4">
              <p className="text-lg md:text-2xl text-text-dim">
                Hey, I’m <span className="text-brand font-semibold">Promise</span>,
              </p>
              <h1 className="text-6xl md:text-[7rem] font-black tracking-tight leading-[0.9]">
                Developer
              </h1>
            </div>

            <p className="max-w-xl text-text-dim text-lg leading-relaxed">
              I help businesses grow by crafting modern web experiences with React, Tailwind, and clean full-stack architecture.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-brand text-slate-950 font-bold transition-all"
              >
                Let's Talk
                <ArrowRight size={18} />
              </motion.a>
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-brand/30 text-text-main transition-all hover:border-brand"
              >
                View Projects
              </motion.a>
              <motion.a
                href="https://wa.me/263782573320"
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-green-500/30 text-green-400 transition-all hover:border-green-500 hover:bg-green-500/10"
              >
                <MessageCircle size={18} />
                WhatsApp
              </motion.a>
            </div>

            <div className="flex flex-wrap gap-3 text-sm font-semibold text-text-dim">
              {quickSkills.map((skill) => (
                <span key={skill} className="rounded-full border border-brand/20 bg-white/5 px-4 py-2">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="relative mx-auto max-w-md rounded-[2.5rem] border border-brand/20 bg-surface/90 backdrop-blur-xl p-8 shadow-2xl">
              <div className="absolute -left-8 top-8 w-24 h-24 rounded-full bg-brand/10 border border-brand/20 blur-2xl" />

              <div className="flex flex-col items-center text-center gap-4">
                <div className="relative w-32 h-32 rounded-full border border-brand/20 overflow-hidden">
                  <img
                    src="/me.jpeg"
                    alt="Promise Chataika"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.36em] text-brand font-bold">Promise Chataika</p>
                  <h2 className="text-3xl font-bold text-text-main">Full-stack developer</h2>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                {profileItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href || "#"}
                    className="group flex items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 transition-all hover:border-brand/40 hover:bg-brand/5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                      <item.icon size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-xs uppercase tracking-[0.2em] text-text-dim">{item.label}</p>
                      <p className="text-base font-semibold text-text-main">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                <p className="uppercase text-[11px] tracking-[0.35em] text-text-dim">Tools</p>
                <div className="flex flex-wrap gap-3">
                  {quickSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-sm font-semibold text-text-main"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                {socialLinks.map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/5 text-text-main transition-all hover:border-brand hover:text-brand"
                    aria-label={social.label}
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-3 text-text-dim">
        <div className="flex h-14 w-10 items-start justify-center rounded-full border-2 border-brand p-2">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="block h-2 w-2 rounded-full bg-brand"
          />
        </div>
        <p className="text-xs uppercase tracking-[0.35em]">Scroll</p>
      </div>
    </section>
  );
}
