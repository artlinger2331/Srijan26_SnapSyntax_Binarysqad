import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Search, Plus, ExternalLink, X, Save, ShoppingCart } from 'lucide-react'

const INITIAL_PO_LIST = [
  { id: 'PO-9001', vendor: 'Teck Corp', item: 'Copper Wire (100m)', qty: 50, total: 2250, status: 'Pending Approval', date: '2026-04-01' },
  { id: 'PO-9002', vendor: 'MetalWorks', item: 'Steel Bolt 8mm', qty: 20000, total: 3000, status: 'Ordered', date: '2026-03-28' },
  { id: 'PO-9003', vendor: 'ChemCorp', item: 'Industrial Lubricant', qty: 20, total: 850, status: 'Delivered', date: '2026-03-15' },
]

export default function ProcurementPage() {
  const [purchaseOrders, setPurchaseOrders] = useState(() => {
    const saved = localStorage.getItem('smart_inventory_pos');
    return saved ? JSON.parse(saved) : INITIAL_PO_LIST;
  });

  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPO, setNewPO] = useState({
    vendor: 'Teck Corp',
    item: '',
    qty: '',
    price: ''
  });

  useEffect(() => {
    localStorage.setItem('smart_inventory_pos', JSON.stringify(purchaseOrders));
  }, [purchaseOrders]);

  const handleCreatePO = (e) => {
    e.preventDefault();
    const qtyNum = parseInt(newPO.qty) || 0;
    const priceNum = parseFloat(newPO.price) || 0;
    
    const newEntry = {
      id: `PO-${9000 + purchaseOrders.length + 1}`,
      vendor: newPO.vendor,
      item: newPO.item,
      qty: qtyNum,
      total: qtyNum * priceNum,
      status: 'Pending Approval',
      date: new Date().toISOString().split('T')[0]
    };

    setPurchaseOrders([newEntry, ...purchaseOrders]);
    setIsModalOpen(false);
    setNewPO({ vendor: 'Teck Corp', item: '', qty: '', price: '' });
  };

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-5 md:p-6 lg:p-8 flex flex-col gap-6 scroll-smooth relative group">
      
      {/* 🧾 ZENITH DESIGN LAYER: DIGITAL LEDGER */}
      <div className="absolute inset-y-0 right-0 w-16 z-0 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.06] border-l border-sap-blue/20">
        <motion.div 
          animate={{ y: [0, -1000] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="text-[10px] font-mono leading-none break-all whitespace-pre-wrap text-sap-blue"
        >
          {Array(100).fill("0XF4A1 0X92C3 0XBD8E 0X12F4 0X77A1 0X92C3 0XBD8E 0X12F4").join("\n")}
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col h-full gap-6">
      <div className="flex justify-between items-end mb-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-xl md:text-2xl font-bold text-text-color tracking-tight">Procurement & POs</h1>
          <p className="text-sm text-text-muted mt-1">Create and track Purchase Orders with registered suppliers.</p>
        </motion.div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-sap-blue transition-all shadow-sm">
            <Search size={16} className="text-text-muted" />
            <input 
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search POs..." 
              className="bg-transparent border-none outline-none text-[13px] text-text-color w-full placeholder-text-muted font-medium"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sap-blue text-white rounded-lg text-[13px] font-bold shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors"
          >
            <Plus size={14} /> Create PO
          </motion.button>
        </div>
      </div>

      <div className="bg-surface-color dark:bg-dark-surface border border-border-color dark:border-dark-border rounded-xl flex flex-col overflow-hidden shadow-sm flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-100 dark:bg-gradient-to-b dark:from-[#1e3a5f] dark:to-[#0f2240] border-b border-border-color dark:border-white/10 text-text-muted dark:text-blue-100">
            <tr>
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-widest">PO Number</th>
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-widest">Vendor</th>
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-widest">Items</th>
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-widest">Total Value</th>
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-widest">Date Issued</th>
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-widest">Status</th>
              <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color dark:divide-dark-border">
            <AnimatePresence mode='popLayout'>
            {purchaseOrders.filter(po => po.id.toLowerCase().includes(search.toLowerCase()) || po.vendor.toLowerCase().includes(search.toLowerCase())).map((po, i) => (
              <motion.tr 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ 
                  scale: 1.005, 
                  backgroundColor: "rgba(34, 197, 94, 0.05)",
                  transition: { duration: 0.2 }
                }}
                key={po.id} 
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group cursor-pointer"
              >
                <td className="px-5 py-4 text-[13px] font-bold font-mono text-sap-blue flex items-center gap-2">
                  <FileText size={14} /> {po.id}
                </td>
                <td className="px-5 py-4 text-[13px] font-semibold text-text-color">{po.vendor}</td>
                <td className="px-5 py-4 text-[13px] text-text-muted">{po.item} (x{po.qty})</td>
                <td className="px-5 py-4 text-[13px] font-mono font-medium text-text-color">${po.total.toLocaleString()}</td>
                <td className="px-5 py-4 text-[13px] text-text-muted">{po.date}</td>
                <td className="px-5 py-4 text-[12px] font-bold">
                  <span className={`px-2 py-1 rounded inline-block ${
                    po.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-500' :
                    po.status === 'Ordered' ? 'bg-blue-500/10 text-sap-blue' : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {po.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <motion.button whileTap={{ scale: 0.8 }} className="text-text-muted hover:text-sap-blue transition-colors"><ExternalLink size={16} /></motion.button>
                </td>
              </motion.tr>
            ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Create PO Modal */}
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
                  <ShoppingCart size={18} className="text-sap-blue" />
                  <h3 className="font-bold text-text-color text-[16px]">Create Purchase Order</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-text-muted transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreatePO} className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Select Vendor</label>
                  <select 
                    value={newPO.vendor}
                    onChange={e => setNewPO({...newPO, vendor: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-border-color/50 rounded-lg px-3 py-2.5 text-[14px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all font-bold"
                  >
                    <option>Teck Corp</option>
                    <option>MetalWorks</option>
                    <option>ChemCorp</option>
                    <option>IronMines</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Item Name</label>
                  <input 
                    required
                    value={newPO.item}
                    onChange={e => setNewPO({...newPO, item: e.target.value})}
                    placeholder="e.g. Hydraulic Pump X1"
                    className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-border-color/50 rounded-lg px-3 py-2.5 text-[14px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Quantity</label>
                    <input 
                      type="number"
                      required
                      value={newPO.qty}
                      onChange={e => setNewPO({...newPO, qty: e.target.value})}
                      placeholder="0"
                      className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-border-color/50 rounded-lg px-3 py-2.5 text-[14px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Unit Price ($)</label>
                    <input 
                      type="number"
                      step="0.01"
                      required
                      value={newPO.price}
                      onChange={e => setNewPO({...newPO, price: e.target.value})}
                      placeholder="0.00"
                      className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-border-color/50 rounded-lg px-3 py-2.5 text-[14px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all font-mono font-bold"
                    />
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
                    <Save size={14} /> Commit Order
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
