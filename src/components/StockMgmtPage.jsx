import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { MapPin, Box, MoveRight, Layers, ArrowUpRight, Search, X, Save, RefreshCw } from 'lucide-react'

const INITIAL_BINS = [
  { id: 'A1-01', location: 'Zone A - Rack 1', capacity: 80, items: 450, type: 'Raw Materials', status: 'Optimal' },
  { id: 'A1-02', location: 'Zone A - Rack 1', capacity: 95, items: 820, type: 'Components', status: 'Full' },
  { id: 'B2-01', location: 'Zone B - Rack 2', capacity: 15, items: 12, type: 'Packaging', status: 'Low' },
  { id: 'C3-04', location: 'Zone C - Cold St', capacity: 60, items: 300, type: 'Finished Goods', status: 'Optimal' },
  { id: 'D1-10', location: 'Zone D - Dock', capacity: 0, items: 0, type: 'Mixed', status: 'Empty' },
]

export default function StockMgmtPage() {
  const [binList, setBinList] = useState(() => {
    const saved = localStorage.getItem('smart_inventory_bins');
    return saved ? JSON.parse(saved) : INITIAL_BINS;
  });

  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transfer, setTransfer] = useState({
    from: 'A1-01',
    to: 'D1-10',
    qty: '',
    type: 'Components'
  });

  useEffect(() => {
    localStorage.setItem('smart_inventory_bins', JSON.stringify(binList));
  }, [binList]);

  const handleTransfer = (e) => {
    e.preventDefault();
    const qtyNum = parseInt(transfer.qty) || 0;
    
    // Simple logic: subtract from source, add to destination
    const updatedBins = binList.map(bin => {
      if (bin.id === transfer.from) {
        const newItems = Math.max(0, bin.items - qtyNum);
        const newCap = Math.max(0, Math.round((newItems / 1000) * 100)); // Mocking 1000 as max capacity
        return { ...bin, items: newItems, capacity: newCap, status: newCap > 90 ? 'Full' : newCap < 10 ? 'Empty' : 'Optimal' };
      }
      if (bin.id === transfer.to) {
        const newItems = bin.items + qtyNum;
        const newCap = Math.min(100, Math.round((newItems / 1000) * 100));
        return { ...bin, items: newItems, capacity: newCap, status: newCap > 90 ? 'Full' : newCap < 10 ? 'Empty' : 'Optimal' };
      }
      return bin;
    });

    setBinList(updatedBins);
    setIsModalOpen(false);
    setTransfer({ from: 'A1-01', to: 'D1-10', qty: '', type: 'Components' });
  };

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-5 md:p-6 lg:p-8 flex flex-col gap-6 scroll-smooth relative group">
      
      {/* 🎯 ZENITH DESIGN LAYER: TACTICAL HUD */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* HUD Corner Brackets */}
        <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-sap-blue/20 rounded-tl-3xl" />
        <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-sap-blue/20 rounded-tr-3xl" />
        <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-sap-blue/20 rounded-bl-3xl" />
        <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-sap-blue/20 rounded-br-3xl" />
        
        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,33,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[size:100%_4px,3px_100%] pointer-events-none opacity-10" />
      </div>

      <div className="relative z-10 flex flex-col h-full gap-6">
      {/* Header */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-color tracking-tight">Warehouse Layout & Stock Bins</h1>
          <p className="text-sm text-text-muted mt-1">Manage physical storage locations, bin capacities, and internal movements.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-sap-blue transition-all shadow-sm">
            <Search size={16} className="text-text-muted" />
            <input 
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search Bin ID..." 
              className="bg-transparent border-none outline-none text-[13px] text-text-color w-full placeholder-text-muted font-medium"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sap-blue text-white rounded-lg text-[13px] font-bold shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors"
          >
            <ArrowUpRight size={14} /> New Movement Transfer
          </motion.button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-surface-color dark:bg-dark-surface p-5 rounded-xl border border-border-color dark:border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Layers size={24} />
          </div>
          <div>
            <div className="text-[12px] font-bold text-text-muted uppercase tracking-wider">Total Bins</div>
            <div className="text-2xl font-black text-text-color mt-1">1,204</div>
          </div>
        </div>
        <div className="bg-surface-color dark:bg-dark-surface p-5 rounded-xl border border-border-color dark:border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
            <Box size={24} />
          </div>
          <div>
            <div className="text-[12px] font-bold text-text-muted uppercase tracking-wider">Avg Capacity</div>
            <div className="text-2xl font-black text-text-color mt-1">76%</div>
          </div>
        </div>
        <div className="bg-surface-color dark:bg-dark-surface p-5 rounded-xl border border-border-color dark:border-dark-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <MoveRight size={24} />
          </div>
          <div>
            <div className="text-[12px] font-bold text-text-muted uppercase tracking-wider">Daily Movements</div>
            <div className="text-2xl font-black text-text-color mt-1">342</div>
          </div>
        </div>
      </div>

      {/* Bins Grid */}
      <h2 className="text-[14px] font-bold text-text-color mt-2 flex items-center gap-2">
        <div className="w-1 h-3 bg-sap-blue rounded-full" /> Active Storage Bins
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <AnimatePresence mode='popLayout'>
        {binList.filter(b => b.id.toLowerCase().includes(search.toLowerCase())).map((bin, i) => {
          const x = useMotionValue(0)
          const y = useMotionValue(0)
          const mouseXSpring = useSpring(x)
          const mouseYSpring = useSpring(y)
          const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
          const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

          const handleMouseMove = (e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top
            x.set(mouseX / rect.width - 0.5)
            y.set(mouseY / rect.height - 0.5)
          }

          return (
            <motion.div 
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { x.set(0); y.set(0) }}
              style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              key={bin.id} 
              className="group bg-surface-color dark:bg-dark-surface p-5 rounded-xl border border-border-color dark:border-dark-border hover:shadow-xl transition-all cursor-pointer"
            >
              <div style={{ transform: "translateZ(20px)" }} className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-sap-blue" />
                    <div>
                      <div className="font-mono font-bold text-text-color text-[15px]">{bin.id}</div>
                      <div className="text-[12px] text-text-muted">{bin.location}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                    bin.status === 'Full' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                    bin.status === 'Empty' ? 'bg-slate-500/10 text-slate-500 border border-slate-500/20' :
                    bin.status === 'Low' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                  }`}>
                    {bin.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-[12px] font-medium mb-1">
                    <span className="text-text-muted italic">Utilization</span>
                    <span className="text-text-color font-bold">{bin.capacity}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${bin.capacity}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`h-full rounded-full ${bin.capacity > 90 ? 'bg-red-500' : bin.capacity < 20 && bin.capacity > 0 ? 'bg-amber-500' : 'bg-sap-blue'}`}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center text-[13px] border-t border-border-color dark:border-dark-border pt-4 mt-2">
                  <span className="font-medium text-text-muted">{bin.type}</span>
                  <span className="font-mono font-bold text-text-color">{bin.items} Units</span>
                </div>
              </div>
            </motion.div>
          )
        })}
        </AnimatePresence>
      </div>

      {/* Movement Transfer Modal */}
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
                <div className="flex items-center gap-2">
                  <RefreshCw size={18} className="text-sap-blue" />
                  <h3 className="font-bold text-text-color text-[16px]">Stock Movement Log</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-text-muted transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleTransfer} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Source Bin</label>
                    <select 
                      value={transfer.from}
                      onChange={e => setTransfer({...transfer, from: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color border-opacity-50 rounded-lg px-3 py-2.5 text-[14px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all font-bold"
                    >
                      {binList.map(b => (
                        <option key={b.id} value={b.id}>{b.id}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end justify-center pb-2">
                    <MoveRight className="text-text-muted" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Target Bin</label>
                    <select 
                      value={transfer.to}
                      onChange={e => setTransfer({...transfer, to: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color border-opacity-50 rounded-lg px-3 py-2.5 text-[14px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all font-bold"
                    >
                      {binList.map(b => (
                        <option key={b.id} value={b.id}>{b.id}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Quantity to Move</label>
                  <input 
                    type="number"
                    required
                    value={transfer.qty}
                    onChange={e => setTransfer({...transfer, qty: e.target.value})}
                    placeholder="e.g. 50"
                    className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color border-opacity-50 rounded-lg px-3 py-2.5 text-[14px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all font-mono font-bold"
                  />
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
                    <Save size={14} /> Execute Movement
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
