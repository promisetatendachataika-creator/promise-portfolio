import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

const modalContent: Record<string, string> = {
  Privacy: "I do not track or store your personal information.",
  Terms: "All content is my original work. Please request permission before reusing.",
  Support: "Have feedback on this site? Reach out to me at promisetatendachataika@gmail.com."
};

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  return (
    <footer className="py-12 border-t border-border bg-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <span className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-black text-xs font-black leading-none">PC</span>
            <span className="text-[10px] font-bold uppercase tracking-tighter text-text-main">Promise Chataika | Engineer</span>
          </motion.div>
          
          <div className="text-text-dim text-[10px] font-bold uppercase tracking-[0.3em]">
            &copy; {currentYear} &mdash; Built with React & Tailwind by CS Student
          </div>
          
          <div className="flex gap-8">
            {Object.keys(modalContent).map((item) => (
              <button 
                key={item} 
                onClick={() => setActiveModal(item)}
                className="text-[10px] font-bold uppercase tracking-widest text-text-dim hover:text-brand transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-surface border border-border p-8 rounded-2xl shadow-2xl"
            >
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-4 text-text-dim hover:text-brand transition-colors"
              >
                <X size={20} />
              </button>
              <h4 className="text-brand font-bold uppercase tracking-[0.2em] text-[10px] mb-4">{activeModal}</h4>
              <p className="text-text-main text-sm font-medium leading-relaxed">
                {modalContent[activeModal]}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
