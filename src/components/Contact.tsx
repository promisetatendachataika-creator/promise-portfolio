import React, { useState } from "react";
import { motion } from "motion/react";
import { Send, Mail, MapPin, Phone, Github, Linkedin, Twitter } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !message) {
      window.alert("Please fill in all fields before sending your message.");
      return;
    }

    const subject = encodeURIComponent(`Contact request from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:promisetatendachataika@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <section id="contact" className="py-24 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8 italic">Let's <span className="text-brand">Connect.</span></h2>
            <p className="text-gray-400 text-lg mb-12 max-w-md italic leading-relaxed">
              Whether you have a question about a project, want to collaborate, 
              or just want to say hi, my inbox is always open.
            </p>

            <div className="space-y-8">
              {[
                { icon: Mail, label: "Email", value: "promisetatendachataika@gmail.com", href: "mailto:promisetatendachataika@gmail.com" },
                { icon: MapPin, label: "Location", value: "13642 Budiriro 5B Harare", href: "#" },
                { icon: Phone, label: "Phone", value: "+263 78 257 3320", href: "tel:+263782573320" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-xl bg-surface border border-border flex items-center justify-center text-text-dim group-hover:text-brand transition-all group-hover:bg-brand/10 group-hover:border-brand/50">
                    <item.icon size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-text-dim mb-1">{item.label}</div>
                    <a href={item.href} className="text-lg font-bold text-text-main hover:text-brand transition-colors">
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-16">
              {[
                { icon: Github, href: "https://github.com/promisetatendachataika-creator" },
                { icon: Linkedin, href: "https://www.linkedin.com/me?trk=p_mwlite_feed-secondary_nav" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <item.icon size={20} />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 md:p-12 bg-brand rounded-2xl relative"
          >
            <h3 className="text-2xl font-bold mb-6 text-black uppercase tracking-tighter">Start a conversation</h3>
            
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-black/10 border border-black/10 rounded-lg focus:outline-none focus:border-black/30 transition-all text-black placeholder:text-black/50 text-sm font-medium"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-black/10 border border-black/10 rounded-lg focus:outline-none focus:border-black/30 transition-all text-black placeholder:text-black/50 text-sm font-medium"
                />
                <textarea
                  rows={3}
                  placeholder="Your Message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-black/10 border border-black/10 rounded-lg focus:outline-none focus:border-black/30 transition-all text-black placeholder:text-black/50 text-sm font-medium resize-none"
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-black text-white font-bold rounded-lg flex items-center justify-center gap-3 transition-all hover:bg-white/10 hover:text-white"
              >
                Send Message
                <Send size={16} />
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
