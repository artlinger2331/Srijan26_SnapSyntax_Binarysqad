import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { Settings, Play, CheckCircle, AlertTriangle, Plus, X, Save, Factory } from 'lucide-react'

const INITIAL_PRODUCTION_ORDERS = [
  { id: 'PRD-1021', item: 'Servo Motor V2', qty: 250, status: 'In Production', progress: 45, timeRemaining: '2h 15m' },
  { id: 'PRD-1022', item: 'Industrial Gasket', qty: 1000, status: 'Planned', progress: 0, timeRemaining: '--' },
  { id: 'PRD-1023', item: 'Hydraulic Valve', qty: 50, status: 'QA Review', progress: 100, timeRemaining: 'Pending' },
  { id: 'PRD-1024', item: 'Steel Bolt 8mm', qty: 5000, status: 'Halted', progress: 12, timeRemaining: 'Blocked' },
]

export default function ProductionPage() {
  const [productionOrders, setProductionOrders] = useState(() => {
    const saved = localStorage.getItem('smart_inventory_production');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTION_ORDERS;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    item: 'Servo Motor V2',
    qty: ''
  });

  useEffect(() => {
    localStorage.setItem('smart_inventory_production', JSON.stringify(productionOrders));
  }, [productionOrders]);

  const handleCreateOrder = (e) => {
    e.preventDefault();
    const qtyNum = parseInt(newOrder.qty) || 0;
    
    const order = {
      id: `PRD-${1025 + productionOrders.length}`,
      item: newOrder.item,
      qty: qtyNum,
      status: 'Planned',
      progress: 0,
      timeRemaining: '--'
    };

    setProductionOrders([order, ...productionOrders]);
    setIsModalOpen(false);
    setNewOrder({ item: 'Servo Motor V2', qty: '' });
  };

  const TelemetryCard = ({ machine, index }) => {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

    return (
      <motion.div 
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          x.set((e.clientX - rect.left) / rect.width - 0.5)
          y.set((e.clientY - rect.top) / rect.height - 0.5)
        }}
        onMouseLeave={() => { x.set(0); y.set(0) }}
        style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="p-4 rounded-xl bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border cursor-pointer transition-shadow hover:shadow-lg shadow-black/5"
      >
        <div style={{ transform: "translateZ(15px)" }}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-[13px] text-text-color tracking-tight">{machine}</span>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-[dot-pulse_1.5s_infinite]" /> Online
            </span>
          </div>
          <div className="flex justify-between text-[12px] text-text-muted mb-1 font-mono">
            <span>Temp: {65 + index * 15}°C</span>
            <span>Load: {45 + index * 20}%</span>
          </div>
          <div className="flex justify-between text-[12px] text-text-muted font-mono">
            <span>Vibration: {1.2 + index * 0.4}mm/s</span>
            <span>Uptime: 99.9%</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-5 md:p-6 lg:p-8 flex flex-col gap-6 scroll-smooth relative group">
      
      {/* 📐 ZENITH DESIGN LAYER: LIVING BLUEPRINT */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.04] dark:opacity-[0.08]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blueprintGrid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1" className="text-sap-blue" />
              <circle cx="0" cy="0" r="2" fill="currentColor" className="text-sap-blue" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueprintGrid)" />
          {/* Animated measurement lines */}
          <motion.line 
            animate={{ x1: [0, 2000], x2: [0, 2000] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            y1="200" y2="200" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" className="text-sap-blue" 
          />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full gap-6">
      <div className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-color tracking-tight">Production Floor</h1>
          <p className="text-sm text-text-muted mt-1">Monitor manufacturing orders and machine utilization in real-time.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sap-blue text-white rounded-lg text-[13px] font-bold shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors"
        >
          <Plus size={14} /> New Production Order
        </motion.button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Kanban Board like List */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <h2 className="text-[14px] font-bold text-text-color text-opacity-80 flex items-center gap-2">
            <div className="w-1 h-3 bg-sap-blue rounded-full" /> Active Orders
          </h2>
          <AnimatePresence mode='popLayout'>
          {productionOrders.map((order, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.01, backgroundColor: "rgba(34, 197, 94, 0.03)" }} 
              key={order.id} 
              className="bg-surface-color dark:bg-dark-surface p-5 rounded-xl border border-border-color dark:border-dark-border shadow-sm flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-4 w-[300px]">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  order.status === 'In Production' ? 'bg-blue-500/10 text-sap-blue border border-blue-500/20' :
                  order.status === 'QA Review' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                  order.status === 'Halted' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                }`}>
                  {order.status === 'In Production' ? <Play size={18} /> : 
                   order.status === 'QA Review' ? <CheckCircle size={18} /> : 
                   order.status === 'Halted' ? <AlertTriangle size={18} /> : <Settings size={18} />}
                </div>
                <div>
                  <div className="font-bold text-[14px] text-text-color tracking-tight">{order.item}</div>
                  <div className="font-mono text-[11px] text-text-muted mt-0.5">{order.id} | Qty: {order.qty}</div>
                </div>
              </div>
              
              <div className="flex-1 px-8 hidden md:block">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                  <span className={
                    order.status === 'In Production' ? 'text-sap-blue' :
                    order.status === 'QA Review' ? 'text-emerald-500' :
                    order.status === 'Halted' ? 'text-red-500' : 'text-text-muted'
                  }>{order.status}</span>
                  <span className="text-text-muted">{order.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${order.progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${order.status === 'Halted' ? 'bg-red-500' : order.status === 'QA Review' ? 'bg-emerald-500' : 'bg-sap-blue'}`}
                  />
                </div>
              </div>

              <div className="w-[100px] text-right font-mono text-[13px] font-medium text-text-color">
                {order.timeRemaining}
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        {/* Machine Telemetry */}
        <div className="bg-surface-color dark:bg-dark-surface p-5 rounded-xl border border-border-color dark:border-dark-border flex flex-col gap-4 h-fit">
          <h2 className="text-[14px] font-bold text-text-color text-opacity-80 flex items-center gap-2">
            <div className="w-1 h-3 bg-indigo-500 rounded-full" /> Machine Telemetry
          </h2>
          
          {['CNC Lathe 01', 'Injection Molder', 'Assembly Arm A'].map((machine, i) => (
            <TelemetryCard key={machine} machine={machine} index={i} />
          ))}
        </div>
      </div>

      {/* New Production Order Modal */}
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
                  <Factory size={18} className="text-sap-blue" />
                  <h3 className="font-bold text-text-color text-[16px]">Schedule Production Order</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-text-muted transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Select Target Product</label>
                  <select 
                    value={newOrder.item}
                    onChange={e => setNewOrder({...newOrder, item: e.target.value})}
                    className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-white/10 rounded-lg px-3 py-2.5 text-[14px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all font-bold"
                  >
                    <option>Servo Motor V2</option>
                    <option>Industrial Gasket</option>
                    <option>Hydraulic Valve</option>
                    <option>Steel Bolt 8mm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Production Quantity</label>
                  <input 
                    type="number"
                    required
                    value={newOrder.qty}
                    onChange={e => setNewOrder({...newOrder, qty: e.target.value})}
                    placeholder="e.g. 500"
                    className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-white/10 rounded-lg px-3 py-2.5 text-[14px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all font-mono font-bold"
                  />
                </div>

                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                  <div className="flex gap-2 text-sap-blue">
                    <AlertTriangle size={16} className="shrink-0" />
                    <p className="text-[12px] font-medium leading-relaxed">System will auto-allocate raw materials from Warehouse Plant A upon order activation.</p>
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
                    <Save size={14} /> Schedule Order
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
