import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Trash2, Edit, LogOut, MessageSquare, Users, Package, X, Save, Settings } from "lucide-react";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db, logout } from "../lib/firebase";

export const AdminPanel = ({ products, inquiries, visits, onClose }: any) => {
  const [activeTab, setActiveTab] = useState<'products' | 'inquiries' | 'visits' | 'settings'>('products');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [siteSettings, setSiteSettings] = useState<any>({});

  useEffect(() => {
    const fetchSettings = async () => {
      const snap = await getDoc(doc(db, "settings", "socials"));
      if (snap.exists()) setSiteSettings(snap.data());
    };
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, "settings", "socials"), siteSettings);
      alert("Settings updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed. Check your admin status.");
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name || !editingProduct.price || !editingProduct.image) return;

    try {
      if (editingProduct.id) {
        const { id, ...data } = editingProduct;
        await updateDoc(doc(db, "products", id), { ...data, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, "products"), { 
          ...editingProduct, 
          createdAt: serverTimestamp(), 
          updatedAt: serverTimestamp() 
        });
      }
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      alert("Error saving product.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteDoc(doc(db, "products", id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-warm-bg overflow-y-auto">
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div className="flex items-center gap-4">
             <button onClick={onClose} className="p-3 hover:bg-olive/5 rounded-full transition-colors">
                <X size={24} />
             </button>
             <h2 className="font-serif text-5xl italic">Seller Workspace</h2>
          </div>
          <button onClick={logout} className="flex items-center gap-3 px-6 py-3 border border-red-200 text-red-500 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
            <LogOut size={16} /> Logout Session
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-16 border-b border-olive/10">
          <button onClick={() => setActiveTab('products')} className={`pb-6 px-6 relative flex items-center gap-3 font-sans text-xs font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'products' ? 'text-olive' : 'opacity-40'}`}>
            <Package size={16} /> Products ({products.length})
            {activeTab === 'products' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-olive" />}
          </button>
          <button onClick={() => setActiveTab('inquiries')} className={`pb-6 px-6 relative flex items-center gap-3 font-sans text-xs font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'inquiries' ? 'text-olive' : 'opacity-40'}`}>
            <MessageSquare size={16} /> Inquiries ({inquiries.length})
            {activeTab === 'inquiries' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-olive" />}
          </button>
          <button onClick={() => setActiveTab('visits')} className={`pb-6 px-6 relative flex items-center gap-3 font-sans text-xs font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'visits' ? 'text-olive' : 'opacity-40'}`}>
            <Users size={16} /> Live Visits ({visits.length})
            {activeTab === 'visits' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-olive" />}
          </button>
          <button onClick={() => setActiveTab('settings')} className={`pb-6 px-6 relative flex items-center gap-3 font-sans text-xs font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'settings' ? 'text-olive' : 'opacity-40'}`}>
            <Settings size={16} /> Presence
            {activeTab === 'settings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-olive" />}
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={() => setEditingProduct({ name: '', price: '', image: '', category: 'Signature Series', description: '', tags: [] })} 
              className="mb-12 group flex items-center gap-4 px-10 py-5 bg-olive text-white rounded-[24px] shadow-2xl shadow-olive/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Plus size={20} />
              <span className="font-sans text-[10px] font-black uppercase tracking-widest">Add New Blend</span>
            </button>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {products.map((p: any) => (
                <div key={p.id} className="bg-white p-8 rounded-[40px] border border-olive/5 shadow-sm group hover:shadow-2xl transition-all">
                  <div className="aspect-square rounded-[32px] overflow-hidden mb-6">
                    <img src={p.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <h4 className="font-serif text-3xl mb-1">{p.name}</h4>
                  <p className="font-sans text-gold font-bold mb-6 italic">{p.price}</p>
                  <div className="flex gap-4">
                    <button onClick={() => setEditingProduct(p)} className="flex-1 py-4 border border-olive/10 rounded-2xl text-[10px] uppercase font-black tracking-widest hover:bg-olive hover:text-white transition-all">Edit</button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-4 border border-red-50 text-red-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="grid gap-8 max-w-4xl animate-in fade-in duration-500">
            {inquiries.map((i: any) => (
              <div key={i.id} className="bg-white p-10 rounded-[40px] border border-olive/5 shadow-sm relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between mb-8 gap-4">
                  <div>
                    <h4 className="font-serif text-3xl mb-1">{i.name}</h4>
                    <p className="font-sans text-xs uppercase tracking-widest text-olive font-black">{i.phone}</p>
                  </div>
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] opacity-30">
                    {i.createdAt?.toDate().toLocaleString()}
                  </span>
                </div>
                <p className="font-serif text-xl italic text-warm-ink/70 leading-relaxed border-l-2 border-gold/20 pl-8">"{i.message}"</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="max-w-2xl bg-white p-12 rounded-[40px] border border-olive/5 shadow-sm animate-in fade-in duration-500">
              <h3 className="font-serif text-3xl mb-12 italic">Presence & Contact</h3>
              <form onSubmit={handleSaveSettings} className="space-y-8">
                 <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="font-sans text-[10px] uppercase tracking-widest font-black opacity-30 ml-2">Instagram</label>
                       <input value={siteSettings.instagram || ''} onChange={e => setSiteSettings({...siteSettings, instagram: e.target.value})} className="w-full bg-warm-bg/50 border border-olive/10 p-4 rounded-2xl outline-none focus:border-gold" />
                    </div>
                    <div className="space-y-4">
                       <label className="font-sans text-[10px] uppercase tracking-widest font-black opacity-30 ml-2">Facebook</label>
                       <input value={siteSettings.facebook || ''} onChange={e => setSiteSettings({...siteSettings, facebook: e.target.value})} className="w-full bg-warm-bg/50 border border-olive/10 p-4 rounded-2xl outline-none focus:border-gold" />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="font-sans text-[10px] uppercase tracking-widest font-black opacity-30 ml-2">WhatsApp</label>
                    <input value={siteSettings.whatsapp || ''} onChange={e => setSiteSettings({...siteSettings, whatsapp: e.target.value})} className="w-full bg-warm-bg/50 border border-olive/10 p-4 rounded-2xl outline-none focus:border-gold" />
                 </div>
                 <div className="space-y-4">
                    <label className="font-sans text-[10px] uppercase tracking-widest font-black opacity-30 ml-2">Public Phone</label>
                    <input value={siteSettings.phone || ''} onChange={e => setSiteSettings({...siteSettings, phone: e.target.value})} className="w-full bg-warm-bg/50 border border-olive/10 p-4 rounded-2xl outline-none focus:border-gold" />
                 </div>
                 <button type="submit" className="w-full py-5 bg-olive text-white rounded-3xl font-bold uppercase tracking-[0.3em] text-[10px] shadow-2xl">
                    Update Presence
                 </button>
              </form>
           </div>
        )}

        {/* ... (visits handled similarly) */}
      </div>

      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingProduct(null)} className="absolute inset-0 bg-warm-ink/80 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-warm-bg w-full max-w-2xl p-12 rounded-[60px] shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="font-serif text-4xl mb-12 italic">{editingProduct.id ? 'Edit Blend' : 'New Creation'}</h3>
              <form onSubmit={handleSaveProduct} className="space-y-8">
                <input required value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-white border border-olive/10 p-5 rounded-3xl outline-none font-serif text-2xl" placeholder="Tea Name" />
                <div className="grid grid-cols-2 gap-6">
                   <input required value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} className="w-full bg-white border border-olive/10 p-5 rounded-3xl outline-none" placeholder="Price" />
                   <select required value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full bg-white border border-olive/10 p-5 rounded-3xl outline-none font-serif">
                      <option value="Signature Series">Signature Series</option>
                      <option value="Floral Collection">Floral Collection</option>
                      <option value="Healing Herbs">Healing Herbs</option>
                   </select>
                </div>
                <input required value={editingProduct.image} onChange={e => setEditingProduct({...editingProduct, image: e.target.value})} className="w-full bg-white border border-olive/10 p-5 rounded-3xl outline-none" placeholder="Image URL" />
                <textarea value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full bg-white border border-olive/10 p-5 rounded-3xl outline-none h-32" placeholder="Description" />
                <button type="submit" className="w-full py-6 bg-olive text-white rounded-3xl font-bold uppercase tracking-widest text-xs">Save Changes</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
