import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, CheckCircle2, Clock, Package, X, Save,
  ShoppingCart, TrendingUp, BarChart2, ChevronRight,
  Calendar, Hash, Tag, Layers
} from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts'

/* ─────────────────────────────────────────────
   INITIAL DATA
───────────────────────────────────────────── */
const INITIAL_ORDERS = [
  { id: 'ORD-1001', product: 'Industrial Gasket',   category: 'Raw Material',  quantity: 200, status: 'Completed', date: '2024-03-15', priority: 'High'   },
  { id: 'ORD-1002', product: 'Ball Bearing X2',     category: 'Components',    quantity: 50,  status: 'Pending',   date: '2024-03-18', priority: 'Medium' },
  { id: 'ORD-1003', product: 'Hydraulic Valve',     category: 'Components',    quantity: 10,  status: 'Pending',   date: '2024-03-20', priority: 'High'   },
  { id: 'ORD-1004', product: 'Packaging Box (L)',   category: 'Packaging',     quantity: 500, status: 'Completed', date: '2024-03-22', priority: 'Low'    },
  { id: 'ORD-1005', product: 'Servo Motor V2',      category: 'Finished',      quantity: 8,   status: 'Pending',   date: '2024-03-25', priority: 'High'   },
  { id: 'ORD-1006', product: 'Copper Wire (100m)',  category: 'Raw Material',  quantity: 30,  status: 'Completed', date: '2024-03-27', priority: 'Medium' },
  { id: 'ORD-1007', product: 'Steel Bolt 8mm',      category: 'Components',    quantity: 1500,status: 'Pending',   date: '2024-03-28', priority: 'Low'    },
  { id: 'ORD-1008', product: 'Servo Bracket',       category: 'Finished',      quantity: 25,  status: 'Completed', date: '2024-03-29', priority: 'Medium' },
]

/* ─────────────────────────────────────────────
   SHARED STYLES
───────────────────────────────────────────── */
const glassCard = {
  background: 'var(--surface-color)',
  backdropFilter: 'blur(28px) saturate(200%)',
  WebkitBackdropFilter: 'blur(28px) saturate(200%)',
  border: '1px solid var(--border-color)',
  boxShadow: 'inset 0 1.5px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.08)',
}

const skeuThead = {
  background: 'var(--sidebar-color)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), border-bottom: 1px solid var(--border-color)',
}

const pillBtn = (active) => ({
  background: active
    ? 'var(--sap-blue)'
    : 'rgba(var(--text-muted-rgb, 100, 116, 139), 0.1)',
  border: active ? 'none' : '1px solid var(--border-color)',
  color: active ? '#fff' : 'var(--text-muted)',
  boxShadow: active ? '0 2px 16px rgba(var(--sap-blue-rgb, 34, 197, 94), 0.3)' : 'none',
  borderRadius: '9999px',
  padding: '6px 18px',
  fontSize: '12px',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all .2s',
})

/* ─────────────────────────────────────────────
   STATUS BADGE (clickable)
───────────────────────────────────────────── */
const StatusBadge = ({ status, onClick, size = 'md' }) => {
  const isPending = status === 'Pending'
  const pad = size === 'sm' ? '2px 10px' : '4px 14px'
  return (
    <motion.button 
      whileTap={{ scale: 0.9 }}
      onClick={onClick} 
      title={onClick ? 'Click to toggle status' : undefined}
      className={`inline-flex items-center gap-1.5 font-bold tracking-wider uppercase border transition-all ${
        isPending 
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.1)]' 
          : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
      }`}
      style={{
        borderRadius: '9999px', padding: pad, fontSize: '10px', cursor: onClick ? 'pointer' : 'default',
      }}>
      {isPending ? <Clock size={10} /> : <CheckCircle2 size={10} />}
      {status}
    </motion.button>
  )
}

/* ─────────────────────────────────────────────
   PRIORITY BADGE
───────────────────────────────────────────── */
const PriorityBadge = ({ priority }) => {
  const cfg = {
    High:   { color: '#f87171', bg: 'rgba(239,68,68,.15)',   border: 'rgba(239,68,68,.4)'   },
    Medium: { color: '#fb923c', bg: 'rgba(249,115,22,.15)',  border: 'rgba(249,115,22,.4)'  },
    Low:    { color: '#60a5fa', bg: 'rgba(96,165,250,.15)',  border: 'rgba(96,165,250,.4)'  },
  }[priority] || {}
  return (
    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color }}>
      {priority}
    </span>
  )
}

/* ─────────────────────────────────────────────
   CUSTOM TOOLTIP FOR CHARTS
───────────────────────────────────────────── */
const GlassTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ ...glassCard, padding: '10px 14px', borderRadius: '12px', minWidth: '100px' }}>
      <p style={{ fontSize: '10px', color: '#93c5fd', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontSize: '14px', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>{payload[0].value}</p>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ORDER DETAIL PANEL
───────────────────────────────────────────── */
const OrderDetailPanel = ({ order, onClose, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(order.status)

  useEffect(() => { setSelectedStatus(order.status) }, [order])

  const handleSave = () => {
    onStatusChange(order.id, selectedStatus)
    onClose()
  }

  const infoRows = [
    { icon: Hash,      label: 'Order ID',   value: order.id },
    { icon: Package,   label: 'Product',    value: order.product },
    { icon: Tag,       label: 'Category',   value: order.category },
    { icon: Layers,    label: 'Quantity',   value: `${order.quantity.toLocaleString()} units` },
    { icon: Calendar,  label: 'Order Date', value: order.date },
  ]

  return (
    <motion.div
      key="detail-panel"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      className="flex flex-col h-full"
      style={{
        ...glassCard,
        width: '340px',
        minWidth: '340px',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Glow orb */}
      <div style={{
        position: 'absolute', top: '-60px', right: '-60px',
        width: '200px', height: '200px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
        filter: 'blur(30px)', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Panel Header */}
      <div className="flex items-center justify-between p-5 relative z-10"
        style={{ borderBottom: '1px solid rgba(140,180,255,0.12)', background: 'rgba(30,50,120,0.3)' }}>
        <div>
          <p style={{ fontSize: '10px', color: '#6b8ab5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order Details</p>
          <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#fff', marginTop: '2px' }}>{order.id}</h3>
        </div>
        <button onClick={onClose}
          className="p-2 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 relative z-10">

        {/* Info rows */}
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(140,180,255,0.12)', background: 'rgba(255,255,255,0.04)' }}>
          {infoRows.map(({ icon: Icon, label, value }, i) => (
            <div key={label}
              className="flex items-center gap-3 px-4 py-3"
              style={{ borderBottom: i < infoRows.length - 1 ? '1px solid rgba(140,180,255,0.08)' : 'none' }}>
              <div className="p-1.5 rounded-lg" style={{ background: 'rgba(99,102,241,0.15)' }}>
                <Icon size={13} className="text-indigo-300" />
              </div>
              <div>
                <p style={{ fontSize: '9px', color: '#6b8ab5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#e0eaff', marginTop: '1px',
                  ...(label === 'Order ID' ? { fontFamily: 'monospace', color: '#a5b4fc' } : {}) }}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Priority */}
        <div className="flex items-center justify-between rounded-xl px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(140,180,255,0.12)' }}>
          <span style={{ fontSize: '11px', color: '#6b8ab5', fontWeight: 700 }}>Priority</span>
          <PriorityBadge priority={order.priority} />
        </div>

        {/* Current Status */}
        <div className="rounded-xl px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(140,180,255,0.12)' }}>
          <p style={{ fontSize: '10px', color: '#6b8ab5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Current Status</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['Pending', 'Completed'].map(s => (
              <button key={s} onClick={() => setSelectedStatus(s)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-[12px] tracking-wide transition-all hover:scale-105 active:scale-95"
                style={
                  selectedStatus === s
                    ? s === 'Pending'
                      ? { background: 'linear-gradient(135deg,rgba(245,158,11,.3),rgba(217,119,6,.4))', border: '1px solid rgba(245,158,11,.5)', color: '#fbbf24', boxShadow: '0 0 16px rgba(245,158,11,.3)' }
                      : { background: 'linear-gradient(135deg,rgba(16,185,129,.3),rgba(5,150,105,.4))', border: '1px solid rgba(16,185,129,.5)', color: '#34d399', boxShadow: '0 0 16px rgba(16,185,129,.3)' }
                    : { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(140,180,255,0.12)', color: '#6b8ab5' }
                }>
                {s === 'Pending' ? <Clock size={13} /> : <CheckCircle2 size={13} />}
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button onClick={handleSave}
          className="w-full py-3 rounded-xl font-bold text-[13px] text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)',
            boxShadow: '0 4px 24px rgba(99,102,241,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
          }}>
          <Save size={15} /> Save Changes
        </button>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   ANALYTICS MINI-CHART
───────────────────────────────────────────── */
const AnalyticsPanel = ({ orders }) => {
  const pending   = orders.filter(o => o.status === 'Pending').length
  const completed = orders.filter(o => o.status === 'Completed').length

  const pieData = [
    { name: 'Pending',   value: pending   },
    { name: 'Completed', value: completed },
  ]
  const PIE_COLORS = ['#f59e0b', '#10b981']

  // Bar chart: orders per category
  const catMap = {}
  orders.forEach(o => { catMap[o.category] = (catMap[o.category] || 0) + 1 })
  const barData = Object.entries(catMap).map(([name, count]) => ({ name, count }))

  return (
    <div className="rounded-2xl p-5 space-y-4" style={glassCard}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg" style={{ background: 'rgba(99,102,241,0.18)' }}>
          <TrendingUp size={15} className="text-indigo-300" />
        </div>
        <div>
          <h3 style={{ fontSize: '12px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Order Analytics</h3>
          <p style={{ fontSize: '10px', color: '#6b8ab5' }}>Live breakdown</p>
        </div>
      </div>

      {/* Donut + legend */}
      <div className="flex items-center gap-4">
        <div style={{ width: 90, height: 90, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={26} outerRadius={40}
                paddingAngle={4} dataKey="value" stroke="none">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip content={<GlassTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          {pieData.map((d, i) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i], boxShadow: `0 0 6px ${PIE_COLORS[i]}` }} />
                <span style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 600 }}>{d.name}</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar chart */}
      <div>
        <p style={{ fontSize: '10px', color: '#6b8ab5', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>By Category</p>
        <div style={{ height: 80 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }} barSize={10}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(140,180,255,0.08)" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#6b8ab5' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 9, fill: '#6b8ab5' }} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<GlassTooltip />} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((_, i) => (
                  <Cell key={i} fill={['#6366f1','#8b5cf6','#10b981','#f59e0b','#ef4444'][i % 5]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   ADD ORDER MODAL
───────────────────────────────────────────── */
const AddOrderModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({ product: '', category: '', quantity: '', status: 'Pending', priority: 'Medium' })
  const [err, setErr] = useState('')

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(140,180,255,0.2)',
    color: '#e0eaff', borderRadius: '10px', padding: '9px 14px', fontSize: '13px',
    width: '100%', outline: 'none',
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.product.trim() || !form.quantity) { setErr('Product name and quantity are required.'); return }
    onSave({
      id: `ORD-${Date.now().toString().slice(-4)}`,
      product: form.product.trim(), category: form.category.trim() || 'Uncategorized',
      quantity: parseInt(form.quantity, 10) || 1, status: form.status,
      priority: form.priority, date: new Date().toISOString().split('T')[0],
    })
    onClose()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(4,8,25,0.78)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.93, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }} transition={{ type: 'spring', bounce: 0.18, duration: 0.4 }}
        className="w-full max-w-md rounded-2xl overflow-hidden" style={glassCard} onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: 'rgba(140,180,255,0.14)', background: 'rgba(30,50,120,0.35)' }}>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg" style={{ background: 'rgba(99,102,241,0.2)' }}>
              <ShoppingCart size={18} className="text-indigo-300" />
            </div>
            <h3 className="font-bold text-white text-[15px]">New Order</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {err && <div className="p-3 rounded-lg text-[12px] font-medium text-red-300"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>{err}</div>}

          {[['Product Name', 'product', 'e.g. Steel Bolt 8mm'],
            ['Category',    'category','e.g. Components']].map(([label, key, ph]) => (
            <div key={key}>
              <label className="block text-[10px] font-bold text-blue-200/60 uppercase tracking-widest mb-2">{label}</label>
              <input style={inputStyle} placeholder={ph} value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}

          <div>
            <label className="block text-[10px] font-bold text-blue-200/60 uppercase tracking-widest mb-2">Quantity</label>
            <input type="number" min="1" style={inputStyle} placeholder="e.g. 100"
              value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[['Status','status',['Pending','Completed']],['Priority','priority',['High','Medium','Low']]].map(([label, key, opts]) => (
              <div key={key}>
                <label className="block text-[10px] font-bold text-blue-200/60 uppercase tracking-widest mb-2">{label}</label>
                <select style={{ ...inputStyle, cursor: 'pointer' }} value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}>
                  {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white/40 hover:text-white transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2 rounded-xl text-[13px] font-bold text-white flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 4px 20px rgba(99,102,241,0.5),inset 0 1px 0 rgba(255,255,255,0.2)' }}>
              <Save size={14} /> Save Order
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   MAIN ORDERS PAGE
───────────────────────────────────────────── */
export default function OrdersPage() {
  const [orders, setOrders]           = useState(INITIAL_ORDERS)
  const [showModal, setShowModal]     = useState(false)
  const [filter, setFilter]           = useState('All')
  const [selectedOrder, setSelectedOrder] = useState(null)

  const toggleStatus = (id) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: o.status === 'Pending' ? 'Completed' : 'Pending' } : o))

  const changeStatus = (id, newStatus) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))

  const deleteOrder = (id) => {
    setOrders(prev => prev.filter(o => o.id !== id))
    if (selectedOrder?.id === id) setSelectedOrder(null)
  }

  const addOrder = (order) => setOrders(prev => [order, ...prev])

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter)

  // Keep detail panel in sync if status changes from table
  const liveSelected = selectedOrder ? orders.find(o => o.id === selectedOrder.id) : null

  const pending   = orders.filter(o => o.status === 'Pending').length
  const completed = orders.filter(o => o.status === 'Completed').length

  return (
    <>
      <div className="flex-1 min-w-0 overflow-hidden flex flex-col relative group"
        style={{ padding: '28px 28px 20px' }}>

        {/* 🚀 ZENITH DESIGN LAYER: LOGISTICS STREAM */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: -100, y: Math.random() * 1000, opacity: 0 }}
              animate={{ 
                x: 2000, 
                opacity: [0, 0.15, 0],
              }}
              transition={{ 
                duration: 10 + Math.random() * 20, 
                repeat: Infinity, 
                delay: Math.random() * 20,
                ease: "linear"
              }}
              className="absolute w-1 h-1 bg-sap-blue rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-bg-color via-transparent to-bg-color opacity-60" />
        </div>

        <div className="relative z-10 flex flex-col h-full">

        {/* ── Page Header ──────────────────────── */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-text-color tracking-tight">Order Management</h1>
            <p className="text-sm text-text-muted mt-1">Click any row to view details &amp; update status.</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 4px 24px rgba(99,102,241,0.5),inset 0 1px 0 rgba(255,255,255,0.18)' }}>
            <Plus size={16} /> Add Order
          </button>
        </div>

        {/* ── KPI Pills ────────────────────────── */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Total Orders', value: orders.length,  color: 'rgba(99,102,241,.6)',  glow: 'rgba(99,102,241,.25)'  },
            { label: 'Pending',      value: pending,         color: 'rgba(245,158,11,.6)',  glow: 'rgba(245,158,11,.25)'  },
            { label: 'Completed',    value: completed,       color: 'rgba(16,185,129,.6)',  glow: 'rgba(16,185,129,.25)'  },
          ].map(({ label, value, color, glow }) => (
            <motion.div key={label} whileHover={{ y: -3, scale: 1.02 }}
              className="rounded-2xl p-4 flex flex-col gap-1"
              style={{ ...glassCard, borderColor: color, boxShadow: `0 0 22px ${glow},inset 0 1px 0 rgba(255,255,255,0.12)` }}>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#fff', fontFamily: 'monospace' }}>{value}</span>
            </motion.div>
          ))}
        </div>

        {/* ── Main area ────────────────────────── */}
        <div className="flex gap-4 flex-1 min-h-0">

          {/* ── Left: Table ───────────────────── */}
          <div className="flex flex-col flex-1 min-w-0 rounded-2xl overflow-hidden" style={glassCard}>

            {/* Filter tabs */}
            <div className="flex items-center gap-2 px-5 py-3"
              style={{ borderBottom: '1px solid rgba(140,180,255,0.10)', background: 'rgba(30,50,120,0.25)' }}>
              {['All','Pending','Completed'].map(tab => (
                <button key={tab} onClick={() => setFilter(tab)} style={pillBtn(filter === tab)}>{tab}</button>
              ))}
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse min-w-[560px]">
                <thead className="sticky top-0 z-10" style={skeuThead}>
                  <tr>
                    {['Order ID','Product','Qty','Status','Priority',''].map((h, i) => (
                      <th key={i} className={`px-5 py-3.5 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${i === 5 ? 'text-right' : ''}`}
                        style={{ color: '#93c5fd', textShadow: '0 1px 3px rgba(0,0,0,.7)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {filtered.length > 0 ? filtered.map((order, i) => {
                      const isActive = selectedOrder?.id === order.id
                      return (
                        <motion.tr key={order.id} layout
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -30 }} transition={{ delay: i * 0.03 }}
                          whileHover={{ 
                            scale: 1.005, 
                            backgroundColor: "rgba(34, 197, 94, 0.05)",
                            transition: { duration: 0.2 }
                          }}
                          onClick={() => setSelectedOrder(isActive ? null : order)}
                          className={`cursor-pointer transition-all duration-200 group border-b border-border-color dark:border-dark-border ${isActive ? 'bg-sap-blue/10 dark:bg-sap-blue/20 shadow-[inset_3px_0_0_var(--sap-blue)]' : 'bg-transparent'}`}
                        >
                          {/* Order ID */}
                          <td className="px-5 py-3.5">
                            <span className="text-[11px] font-black font-mono px-2 py-1 rounded-md bg-sap-blue/10 border border-sap-blue/20 text-sap-blue">
                              {order.id}
                            </span>
                          </td>

                          {/* Product */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <Package size={13} className="text-sap-blue shrink-0" />
                              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-color)' }}>{order.product}</span>
                            </div>
                          </td>

                          {/* Qty */}
                          <td className="px-5 py-3.5">
                            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-color)', fontFamily: 'monospace' }}>
                              {order.quantity.toLocaleString()}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="px-5 py-3.5">
                            <StatusBadge status={order.status}
                              onClick={e => { e.stopPropagation(); toggleStatus(order.id) }} size="sm" />
                          </td>

                          {/* Priority */}
                          <td className="px-5 py-3.5"><PriorityBadge priority={order.priority} /></td>

                          {/* Actions */}
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <ChevronRight size={15} className={`${isActive ? 'text-sap-blue' : 'text-text-muted'} transition-all`} />
                              <motion.button 
                                whileTap={{ scale: 0.8 }}
                                onClick={e => { e.stopPropagation(); deleteOrder(order.id) }}
                                className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors" title="Delete">
                                <Trash2 size={14} />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    }) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center" style={{ color: '#374575', fontSize: '13px' }}>
                          No orders match this filter.
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 text-[11px] font-medium"
              style={{ borderTop: '1px solid rgba(100,140,255,0.10)', color: '#374575', background: 'rgba(6,12,40,0.3)' }}>
              Showing {filtered.length} of {orders.length} orders
            </div>
          </div>

          {/* ── Right: Detail + Analytics ──────── */}
          <div className="flex flex-col gap-4" style={{ width: '340px', minWidth: '340px' }}>

            {/* Analytics Chart - always visible */}
            <AnalyticsPanel orders={orders} />

            {/* Detail Panel - slides when order selected */}
            <AnimatePresence>
              {liveSelected && (
                <div className="flex-1 min-h-0">
                  <OrderDetailPanel
                    order={liveSelected}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={changeStatus}
                  />
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>

    {/* Add Order Modal */}
      <AnimatePresence>
        {showModal && <AddOrderModal onClose={() => setShowModal(false)} onSave={addOrder} />}
      </AnimatePresence>
    </>
  )
}
