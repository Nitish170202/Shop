import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "motion/react";
import { Coffee, MapPin, Instagram, Facebook, Phone, Clock, Leaf, Sparkles, Wind, Droplets, ArrowRight } from "lucide-react";
import { collection, onSnapshot, query, orderBy, addDoc, serverTimestamp, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./lib/firebase";
import { Navigation } from "./components/Navigation";
import { AdminPanel } from "./components/AdminPanel";

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [socials, setSocials] = useState({
    instagram: "pankajteahouse",
    facebook: "pankajteahouse",
    whatsapp: "919876543210",
    phone: "+91 98765 43210"
  });

  // Auth State
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAdmin(u?.email === 'nitishkvh1234@gmail.com');
    });
  }, []);

  // Real-time Data
  useEffect(() => {
    const qP = query(collection(db, "products"), orderBy("createdAt", "desc"));
    const unsubP = onSnapshot(qP, (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubS = onSnapshot(doc(db, "settings", "socials"), (snap) => {
      if (snap.exists()) setSocials(snap.data() as any);
    });

    if (isAdmin) {
      const qI = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
      const unsubI = onSnapshot(qI, (snap) => setInquiries(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      
      const qV = query(collection(db, "visits"), orderBy("timestamp", "desc"));
      const unsubV = onSnapshot(qV, (snap) => setVisits(snap.docs.map(d => ({ id: d.id, ...d.data() }))));

      return () => { unsubP(); unsubS(); unsubI(); unsubV(); };
    }

    return () => { unsubP(); unsubS(); };
  }, [isAdmin]);

  // Visit Notification / Logging
  useEffect(() => {
    const logVisit = async () => {
      try {
        await addDoc(collection(db, "visits"), {
          timestamp: serverTimestamp(),
          userAgent: navigator.userAgent,
          referrer: document.referrer || 'Direct Entry'
        });
      } catch (err) {
        console.error("Silent visit log failed", err);
      }
    };
    logVisit();
  }, []);

  const handleInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await addDoc(collection(db, "inquiries"), {
        name: formData.get('name'),
        phone: formData.get('phone'),
        message: formData.get('message'),
        createdAt: serverTimestamp()
      });
      alert("Blessings! Your message has been received.");
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      alert("Error sending message. Please try again.");
    }
  };

  if (showAdmin && isAdmin) {
    return <AdminPanel products={products} inquiries={inquiries} visits={visits} onClose={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-warm-bg text-warm-ink selection:bg-gold selection:text-warm-ink font-sans">
      <Navigation isAdmin={isAdmin} user={user} onAdminToggle={() => setShowAdmin(true)} />

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }} className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1544787210-2213d2427517?q=80&w=2070&auto=format&fit=crop" 
            alt="Ancient plantation" className="w-full h-full object-cover brightness-[0.5] contrast-[1.1]" referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-warm-ink/20 to-warm-bg" />
        </motion.div>
        
        <div className="relative z-10 text-center px-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-block px-6 py-2 border border-white/20 rounded-full mb-10 backdrop-blur-md">
            <span className="font-sans text-white/90 text-[10px] uppercase font-black tracking-[0.5em]">The Heritage Collection</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-serif text-8xl md:text-[10rem] text-white mb-12 tracking-tighter leading-[0.85]">
            Quiet <span className="italic font-light text-gold">Alchemy.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-white/60 font-serif italic text-2xl mb-12 max-w-2xl mx-auto">
            "We don't brew tea. We curate moments of deep, slow stillness."
          </motion.p>
          <a href="#selection" className="group px-12 py-6 bg-gold text-warm-ink rounded-full font-bold uppercase text-[10px] tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 mx-auto w-fit">
            Explore The Collection <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </section>

      {/* Collection Section */}
      <section id="selection" className="py-40 px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-16">
          <div className="max-w-2xl">
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-gold font-black mb-6 block">Hand-Picked Heritage</span>
            <h2 className="font-serif text-7xl md:text-8xl tracking-tight leading-[0.9]">Bespoke <span className="italic font-light text-olive">Creations.</span></h2>
          </div>
          <p className="font-sans text-xs uppercase tracking-[0.2em] font-bold opacity-30 text-right max-w-[200px]">
            Sourced Directly from the Himalayas & Nilgiris.
          </p>
        </div>
        
        {products.length === 0 ? (
          <div className="py-40 text-center animate-pulse">
            <Leaf className="mx-auto text-olive/20 w-16 h-16 mb-8" />
            <p className="font-serif text-3xl italic opacity-20">The library is breathing... coming soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-32">
            {products.map(p => (
              <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} key={p.id} className="group cursor-pointer">
                <div className="aspect-[4/5] rounded-[60px] overflow-hidden mb-10 shadow-2xl relative bg-warm-ink/5">
                  <img src={p.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute top-10 right-10 px-6 py-2 bg-white/90 backdrop-blur-md rounded-full font-sans text-xs font-black text-olive shadow-lg">
                    {p.price}
                  </div>
                </div>
                <div className="px-6 text-center">
                  <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold font-black mb-3 block">{p.category}</span>
                  <h3 className="font-serif text-4xl mb-6 tracking-tight group-hover:text-olive transition-colors">{p.name}</h3>
                  <p className="font-serif text-lg italic opacity-50 line-clamp-2 leading-relaxed">{p.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* About Section (Brief) */}
      <section id="about" className="py-40 bg-olive/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-32 items-center">
           <div className="relative">
              <div className="absolute -inset-10 border border-olive/10 rounded-[100px]" />
              <img src="https://images.unsplash.com/photo-1594631252845-29fc458631b6?q=80&w=1974&auto=format&fit=crop" className="relative z-10 w-full rounded-[100px] shadow-2xl" />
           </div>
           <div>
              <h2 className="font-serif text-7xl mb-12 italic leading-tight">Heritage in every <span className="text-olive">infusion.</span></h2>
              <p className="text-xl opacity-60 leading-relaxed mb-16 font-serif italic">
                "Since 1984, our family has preserved the ritual of tea. We gather leaves not for consumption, but for connection."
              </p>
              <div className="grid grid-cols-3 gap-10">
                 {['Pure', 'Rare', 'Slow'].map(w => (
                   <div key={w} className="text-center">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-olive mx-auto mb-4 shadow-sm"><Sparkles size={18} /></div>
                      <span className="font-sans text-[10px] uppercase tracking-widest font-black opacity-30">{w}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* Contact & Map */}
      <section id="contact" className="py-40 px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-32 items-start">
           <div>
              <h2 className="font-serif text-8xl mb-16 italic tracking-tight">Visit The sanctuary.</h2>
              <div className="space-y-16">
                 <div className="flex gap-8 group">
                    <div className="w-20 h-20 bg-warm-ink text-white rounded-[32px] flex items-center justify-center transition-all group-hover:rotate-6 shadow-2xl"><MapPin size={32} /></div>
                    <div>
                       <h4 className="font-serif text-3xl mb-2">Finding Us</h4>
                       <p className="opacity-50 text-lg">Old Town, Street No. 7<br/>Jaipur, India</p>
                    </div>
                 </div>
                 <div className="flex gap-8 group">
                    <div className="w-20 h-20 bg-gold text-warm-ink rounded-[32px] flex items-center justify-center transition-all group-hover:rotate-6 shadow-2xl"><Clock size={32} /></div>
                    <div>
                       <h4 className="font-serif text-3xl mb-2">Open Hours</h4>
                       <p className="opacity-50 text-lg">Every Sunrise to Sunset<br/>08:00 AM - 10:00 PM</p>
                    </div>
                 </div>
              </div>
           </div>

           <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} className="bg-white p-16 rounded-[80px] shadow-[0_64px_128px_-32px_rgba(74,93,35,0.15)] border border-olive/5">
              <h4 className="font-serif text-4xl mb-12 italic">Direct Inquiry</h4>
              <form onSubmit={handleInquiry} className="space-y-10">
                 <div className="group relative">
                    <input name="name" required className="w-full bg-transparent border-b-2 border-olive/10 py-5 outline-none focus:border-olive transition-all font-serif text-2xl italic" placeholder="Your Name" />
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gold w-0 group-focus-within:w-full transition-all" />
                 </div>
                 <div className="group relative">
                    <input name="phone" required className="w-full bg-transparent border-b-2 border-olive/10 py-5 outline-none focus:border-olive transition-all font-serif text-2xl italic" placeholder="Mobile Number" />
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gold w-0 group-focus-within:w-full transition-all" />
                 </div>
                 <div className="group relative">
                    <textarea name="message" required className="w-full bg-transparent border-b-2 border-olive/10 py-5 outline-none focus:border-olive transition-all font-serif text-2xl italic h-32" placeholder="Tell us about your preference..." />
                    <div className="absolute bottom-0 left-0 h-0.5 bg-gold w-0 group-focus-within:w-full transition-all" />
                 </div>
                 <button type="submit" className="w-full py-6 bg-olive text-white rounded-full font-bold uppercase tracking-[0.4em] text-[10px] shadow-2xl hover:bg-warm-ink transition-all">Submit to Keeper</button>
              </form>
           </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-40 pb-20 bg-white/50 border-t border-olive/5 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-20">
           <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-8">
                 <Leaf className="text-olive w-10 h-10" />
                 <span className="font-serif text-4xl font-bold text-olive">Pankaj Tea House</span>
              </div>
              <p className="max-w-xs text-lg opacity-40 font-serif italic mb-10">Crafting the world's most serene tea ritual since eighty-four.</p>
              <div className="flex justify-center md:justify-start gap-6">
                 <a href={`https://instagram.com/${socials.instagram}`} className="w-14 h-14 bg-white border border-olive/10 rounded-[20px] flex items-center justify-center text-olive hover:bg-olive hover:text-white transition-all shadow-sm"><Instagram size={20} /></a>
                 <a href={`https://facebook.com/${socials.facebook}`} className="w-14 h-14 bg-white border border-olive/10 rounded-[20px] flex items-center justify-center text-olive hover:bg-olive hover:text-white transition-all shadow-sm"><Facebook size={20} /></a>
                 <a href={`https://wa.me/${socials.whatsapp}`} className="w-14 h-14 bg-white border border-olive/10 rounded-[20px] flex items-center justify-center text-olive hover:bg-olive hover:text-white transition-all shadow-sm"><Phone size={20} /></a>
              </div>
           </div>
           <div className="text-center md:text-right">
              <h5 className="font-sans text-[10px] uppercase font-black tracking-widest opacity-30 mb-8">Direct Contact</h5>
              <p className="font-serif text-3xl mb-2">{socials.phone}</p>
              <p className="font-sans text-xs opacity-40 uppercase tracking-widest">Available daily at sunset sessions</p>
           </div>
        </div>
        <div className="max-w-7xl mx-auto mt-40 pt-10 border-t border-olive/5 flex justify-between items-center opacity-20 text-[9px] uppercase tracking-[0.4em] font-black">
           <p>&copy; 2026 Pankaj Tea House. All rights reserved.</p>
           <p>Steeping stories since 1984</p>
        </div>
      </footer>
    </div>
  );
}
