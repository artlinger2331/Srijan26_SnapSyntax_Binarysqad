import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Package, AlertTriangle, RefreshCw } from 'lucide-react'

// Dummy events pool for real-time simulation
const EVENT_POOL = [
  { msg: "Quality Check passed for Batch #4092", icon: <Package size={16} />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { msg: "System Sync completed across 3 facilities", icon: <RefreshCw size={16} />, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { msg: "User 'Sarah M.' scanned in 120 units", icon: <User size={16} />, color: "text-blue-500", bg: "bg-blue-500/10" },
  { msg: "Automated Alert: 'Bolt-8x' nearing critical", icon: <AlertTriangle size={16} />, color: "text-amber-500", bg: "bg-amber-500/10" },
]

export default function ActivityFeed() {
  const [logs, setLogs] = useState([
    { id: 1, msg: "User 'John D.' scanned in 50 units of SKU-102", time: "2 mins ago", icon: <User size={16} />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: 2, msg: "Shipment #9902 arrived at Loading Dock B", time: "15 mins ago", icon: <Package size={16} />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: 3, msg: "Automated Alert: 'Screw-01' reached reorder point", time: "1 hour ago", icon: <AlertTriangle size={16} />, color: "text-amber-500", bg: "bg-amber-500/10" },
  ])

  // Real-time Event Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      // 30% chance to push a new log every 5 seconds
      if (Math.random() > 0.7) {
        const randomEvent = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)]
        const newLog = { 
          id: Date.now(), 
          ...randomEvent, 
          time: "Just now" 
        }
        setLogs(prev => [newLog, ...prev].slice(0, 10)) // keep max 10
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full h-full bg-surface-color dark:bg-sidebar border-l border-border-color dark:border-dark-border flex flex-col overflow-hidden">
      <div className="p-5 border-b border-border-color dark:border-dark-border bg-slate-50 dark:bg-transparent">
        <h2 className="text-[14px] font-bold text-text-color tracking-wide">Operational Sidebar</h2>
        <p className="text-[12px] text-text-muted mt-1">Real-Time Feed & Live Activity Log</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex gap-3 p-3 mb-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/30 transition-colors cursor-default"
            >
              {/* Icon */}
              <div className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center ${log.bg} ${log.color} border border-transparent dark:border-white/5`}>
                {log.icon}
              </div>
              
              {/* Content */}
              <div className="flex flex-col justify-center">
                <span className="text-[13px] text-text-color font-semibold leading-snug">{log.msg}</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-1">{log.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
