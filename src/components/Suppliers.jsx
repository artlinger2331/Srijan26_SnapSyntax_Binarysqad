import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Star, AlertTriangle, CheckCircle, ExternalLink, MessageSquarePlus, X, Save, UserPlus } from 'lucide-react';

const INITIAL_SUPPLIERS = [
  { id: 1, name: 'Teck Corp',  email: 'john@teck.com',    leadTime: '3 Days',  rating: 4.8, status: 'Active',  quality: 'Excellent', initials: 'TC' },
  { id: 2, name: 'MetalWorks', email: 'sales@metalw.com', leadTime: '7 Days',  rating: 4.2, status: 'Active',  quality: 'Good',      initials: 'MW' },
  { id: 3, name: 'ChemCorp',   email: 'orders@chem.com',  leadTime: '14 Days', rating: 3.5, status: 'Warning', quality: 'Fair',      initials: 'CC' },
  { id: 4, name: 'IronMines',  email: 'hi@ironmi.com',    leadTime: '5 Days',  rating: 4.9, status: 'Active',  quality: 'Excellent', initials: 'IM' },
];

const Suppliers = () => {
  const [supplierList, setSupplierList] = useState(() => {
    const saved = localStorage.getItem('smart_inventory_suppliers');
    return saved ? JSON.parse(saved) : INITIAL_SUPPLIERS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    email: '',
    leadTime: '',
    category: 'Components'
  });

  useEffect(() => {
    localStorage.setItem('smart_inventory_suppliers', JSON.stringify(supplierList));
  }, [supplierList]);

  const handleAddSupplier = (e) => {
    e.preventDefault();
    const initials = newSupplier.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const supplier = {
      id: Date.now(),
      name: newSupplier.name,
      email: newSupplier.email,
      leadTime: newSupplier.leadTime || 'TBD',
      rating: 5.0,
      status: 'Active',
      quality: 'New',
      initials: initials || '??'
    };

    setSupplierList([supplier, ...supplierList]);
    setIsModalOpen(false);
    setNewSupplier({ name: '', email: '', leadTime: '', category: 'Components' });
  };

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-5 md:p-6 lg:p-8 flex flex-col gap-6 scroll-smooth relative group">
      
      {/* 🌌 ZENITH DESIGN LAYER: GALACTIC HUB */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sap-blue rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[150px]"
        />
      </div>

      <div className="relative z-10 flex flex-col h-full gap-6">
      <div className="flex justify-between items-end mb-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-xl md:text-2xl font-bold text-text-color tracking-tight">Supplier Tracking</h1>
          <p className="text-sm text-text-muted mt-1">Monitor vendor performance, lead times, and quality ratings.</p>
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-sap-blue text-white rounded-lg text-[13px] font-bold shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors flex items-center gap-2"
        >
          <UserPlus size={16} /> Add Supplier
        </motion.button>
      </div>

      <div className="flex flex-col gap-4">
        <AnimatePresence mode='popLayout'>
          {supplierList.map((s, i) => (
            <motion.div 
              key={s.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ 
                scale: 1.005, 
                backgroundColor: "rgba(var(--sap-blue-rgb, 34, 197, 94), 0.05)",
                transition: { duration: 0.2 }
              }}
              className="group bg-surface-color dark:bg-dark-surface p-5 rounded-2xl border border-border-color dark:border-dark-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer transition-all"
            >
              {/* Name + Contact */}
              <div className="flex items-center gap-4 min-w-[280px]">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-600 dark:text-emerald-400 text-lg shadow-inner">
                  {s.initials}
                </div>
                <div>
                  <div className="text-[16px] font-bold text-text-color group-hover:text-sap-blue transition-colors">{s.name}</div>
                  <div className="flex items-center gap-1.5 text-[12px] text-text-muted mt-1">
                    <Mail size={12} /> {s.email}
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8 w-full md:w-auto">
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Lead Time</div>
                  <div className="text-[14px] font-mono font-bold text-text-color">{s.leadTime}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Quality Rating</div>
                  <div className="flex items-center gap-1 text-[14px] font-bold text-amber-500">
                    <Star size={14} fill="currentColor" /> {s.rating}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Vendor Status</div>
                  <div className={`flex items-center gap-1.5 text-[13px] font-bold ${s.status === 'Warning' ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {s.status === 'Warning' ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                    {s.status}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-xl border border-border-color dark:border-dark-border text-text-muted hover:text-sap-blue hover:bg-sap-blue/5 transition-all"
                >
                  <ExternalLink size={18} />
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => window.location.href = `mailto:${s.email}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sap-blue text-white text-[13px] font-bold shadow-md shadow-blue-500/10 hover:bg-blue-600 transition-all"
                >
                  <MessageSquarePlus size={16} /> Contact
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Supplier Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-surface-color dark:bg-dark-surface border border-border-color dark:border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border-color dark:border-white/10 bg-slate-50 dark:bg-dark-surface/50">
                <h3 className="font-bold text-text-color text-[16px]">Onboard New Supplier</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-text-muted transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddSupplier} className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Supplier / Company Name</label>
                  <input 
                    required
                    value={newSupplier.name}
                    onChange={e => setNewSupplier({...newSupplier, name: e.target.value})}
                    placeholder="e.g. Global Logistics Inc"
                    className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-2.5 text-[14px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Primary Contact Email</label>
                  <input 
                    type="email"
                    required
                    value={newSupplier.email}
                    onChange={e => setNewSupplier({...newSupplier, email: e.target.value})}
                    placeholder="contact@company.com"
                    className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-2.5 text-[14px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Avg Lead Time</label>
                    <input 
                      value={newSupplier.leadTime}
                      onChange={e => setNewSupplier({...newSupplier, leadTime: e.target.value})}
                      placeholder="e.g. 5 Days"
                      className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-2.5 text-[14px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Category</label>
                    <select 
                      value={newSupplier.category}
                      onChange={e => setNewSupplier({...newSupplier, category: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-2.5 text-[14px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all font-bold"
                    >
                      <option>Components</option>
                      <option>Raw Material</option>
                      <option>Logistics</option>
                      <option>Packaging</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 rounded-lg text-[13px] font-semibold text-text-muted hover:text-text-color transition-colors">
                    Cancel
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="flex-[2] py-2.5 bg-sap-blue text-white rounded-lg text-[13px] font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={14} /> Onboard Supplier
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default Suppliers;
