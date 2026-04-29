import { motion, AnimatePresence } from "motion/react";
import { Leaf, Menu, X, Settings, LogIn } from "lucide-react";
import { useState } from "react";
import { useScroll, useTransform } from "motion/react";
import { login } from "../lib/firebase";

export const Navigation = ({ isAdmin, onAdminToggle, user }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const navBg = useTransform(scrollY, [0, 100], ["rgba(253, 253, 250, 0)", "rgba(253, 253, 250, 0.95)"]);
  const navBorder = useTransform(scrollY, [0, 100], ["rgba(74, 93, 35, 0)", "rgba(74, 93, 35, 0.1)"]);

  return (
    <motion.nav 
      style={{ backgroundColor: navBg, borderColor: navBorder }}
      className="fixed top-0 w-full z-50 border-b backdrop-blur-sm transition-all duration-500"
    >
      <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <Leaf className="text-olive w-10 h-10 group-hover:scale-110 transition-transform" />
          </motion.div>
          <span className="font-serif text-3xl font-bold tracking-tight text-olive">Pankaj Tea House</span>
        </a>

        <div className="hidden md:flex items-center gap-10 font-sans text-xs font-bold uppercase tracking-[0.2em] text-warm-ink/70">
          <a href="#about" className="hover:text-olive transition-colors relative group py-2">
            Heritage
            <span className="absolute bottom-0 left-0 w-0 h-px bg-olive transition-all group-hover:w-full" />
          </a>
          <a href="#selection" className="hover:text-olive transition-colors relative group py-2">
            Collection
            <span className="absolute bottom-0 left-0 w-0 h-px bg-olive transition-all group-hover:w-full" />
          </a>
          <a href="#contact" className="hover:text-olive transition-colors relative group py-2">
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-px bg-olive transition-all group-hover:w-full" />
          </a>
          
          {isAdmin ? (
            <button onClick={onAdminToggle} className="flex items-center gap-2 text-gold hover:text-warm-ink transition-colors px-4 py-2 border border-gold/20 rounded-full">
              <Settings size={14} /> Seller Panel
            </button>
          ) : !user && (
            <button onClick={login} className="opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2">
              <LogIn size={14} />
            </button>
          )}

          <a href="#contact" className="px-8 py-3 bg-olive text-white rounded-full hover:bg-olive/90 hover:shadow-xl hover:shadow-olive/20 transition-all active:scale-95">
            Visit Us
          </a>
        </div>

        <button className="md:hidden text-olive" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden absolute top-24 left-0 w-full bg-warm-bg border-b border-olive/10 px-8 py-12 flex flex-col gap-10 shadow-2xl"
          >
            <a href="#about" onClick={() => setIsOpen(false)} className="font-serif text-4xl italic text-olive">The Heritage</a>
            <a href="#selection" onClick={() => setIsOpen(false)} className="font-serif text-4xl italic text-olive">The Collection</a>
            <a href="#contact" onClick={() => setIsOpen(false)} className="font-serif text-4xl italic text-olive">Contact</a>
            {isAdmin && (
               <button onClick={() => { onAdminToggle(); setIsOpen(false); }} className="font-serif text-4xl italic text-gold text-left border-t border-olive/10 pt-10">Seller Panel</button>
            )}
            {!user && (
              <button onClick={() => { login(); setIsOpen(false); }} className="text-left font-sans text-xs uppercase tracking-widest opacity-50">Seller Login</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
