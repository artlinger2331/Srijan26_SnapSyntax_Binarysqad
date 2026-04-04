import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Package, ShieldAlert } from 'lucide-react'

// actionData state is now dynamic, see inside ActionCenter component

const ActionBadge = ({ status }) => {
  const cfg = {
    'Low Stock': { bg: 'bg-amber-500/10 dark:bg-amber-500/20',     text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    'Critical':  { bg: 'bg-red-500/10 dark:bg-red-500/20',         text: 'text-red-600 dark:text-red-400',     border: 'border-red-200 dark:border-red-800' },
    'Overstock': { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
  }[status] || { bg: 'bg-slate-500/10', text: 'text-slate-500', border: 'border-slate-200' }

  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      {status}
    </span>
  )
}

const ItemModal = ({ item, onClose }) => {
  if (!item) return null
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div 
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          className="bg-surface-color dark:bg-dark-surface border border-border-color dark:border-dark-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-border-color dark:border-dark-border bg-slate-50 dark:bg-dark-surface/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                <Package size={20} />
              </div>
              <div>
                <h3 className="font-bold text-text-color text-[15px]">{item.name}</h3>
                <span className="text-[11px] font-mono text-text-muted">SKU: {item.sku}</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-text-muted transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6 p-4 rounded-xl bg-slate-50 dark:bg-dark-surface/50 border border-slate-100 dark:border-dark-border">
              <div>
                <span className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Current Stock Target</span>
                <span className="font-mono text-2xl font-black text-text-color">{item.stock}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Status</span>
                <ActionBadge status={item.status} />
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400">
              <ShieldAlert size={18} className="shrink-0 mt-0.5" />
              <p className="text-[12px] leading-snug font-medium">
                This item requires immediate managerial override. Reorder workflows are currently blocked pending unit cost verification.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-border-color dark:border-dark-border flex justify-end gap-3 bg-slate-50 dark:bg-dark-surface/50">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-text-muted hover:text-text-color transition-colors">
              Dismiss
            </button>
            <button className="px-4 py-2 rounded-lg text-[13px] font-bold bg-sap-blue text-white shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors flex items-center gap-2">
              Generate PO <ExternalLink size={14} />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function ActionCenter() {
  const [activeItem, setActiveItem] = useState(null)
  const [actionData, setActionData] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('inventoryData_v2')
      if (saved) {
        const products = JSON.parse(saved)
        if (Array.isArray(products)) {
          // Filter only items that require human action: Low Stock or Out Stock
          const filtered = products.filter(p => p.status === 'Low Stock' || p.status === 'Out Stock')
          
          const mapped = filtered.map(p => {
            const currentStock = typeof p.stock === 'number' ? p.stock : parseInt(p.stock, 10) || 0
            
            // Generate a visually pleasing target/capacity metric for the dashboard
            const targetStock = currentStock === 0 ? 20 : Math.max(20, Math.ceil(currentStock * 2.5))

            return {
              id: p.id,
              sku: p.sku || 'N/A',
              name: p.name || 'Unnamed',
              stock: `${currentStock} / ${targetStock}`,
              // Transform 'Out Stock' to 'Critical' purely for the high-contrast managerial view
              status: p.status === 'Out Stock' ? 'Critical' : p.status 
            }
          })
          setActionData(mapped)
        }
      }
    } catch (e) {
      console.error('Failed to parse action center data', e)
    }
  }, [])

  return (
    <>
      <div
        className="bg-surface-color dark:bg-dark-surface border border-border-color dark:border-dark-border rounded-xl flex flex-col overflow-hidden h-full relative"
        style={{
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.15)',
        }}
      >
        
        {/* Header */}
        <div className="p-5 pb-3 border-b border-border-color dark:border-white/10 bg-slate-50 dark:bg-dark-surface/50">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
            <h2 className="text-[14px] font-bold text-text-color tracking-wide uppercase">Action Center</h2>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed font-semibold">
            Filtered view of items requiring immediate human decision right now. Click any row to resolve.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-gradient-to-b dark:from-[#1e3a5f] dark:to-[#0f2240] border-b border-border-color dark:border-white/10 text-text-muted dark:text-blue-100">
              <tr>
                <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-text-muted dark:text-blue-300">SKU</th>
                <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-text-muted dark:text-blue-300">Item Name</th>
                <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-text-muted dark:text-blue-300">Current Stock</th>
                <th className="px-5 py-3.5 text-[10px] font-black uppercase tracking-widest text-text-muted dark:text-blue-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color dark:divide-white/5">
              {actionData.length > 0 ? actionData.map((item, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ 
                    scale: 1.005, 
                    backgroundColor: "rgba(34, 197, 94, 0.05)",
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.99 }}
                  key={item.id || i} 
                  onClick={() => setActiveItem(item)}
                  className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-all duration-200"
                >
                  <td className="px-5 py-4 text-[12px] font-bold text-sap-blue font-mono group-hover:text-emerald-500 transition-colors uppercase tracking-wider">{item.sku}</td>
                  <td className="px-5 py-4 text-[13px] font-bold text-text-color group-hover:text-sap-blue transition-colors">{item.name}</td>
                  <td className="px-5 py-4 text-[12px] font-mono text-text-muted font-bold group-hover:text-text-color">{item.stock}</td>
                  <td className="px-5 py-4">
                    <ActionBadge status={item.status} />
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center text-text-muted text-[12px] font-medium opacity-80">
                    No items require immediate action. All stock levels are nominal! 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeItem && <ItemModal item={activeItem} onClose={() => setActiveItem(null)} />}
    </>
  )
}
