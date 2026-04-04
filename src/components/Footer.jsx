import React from 'react'
import { motion } from 'framer-motion'
import { Cpu, ShieldCheck, Globe } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <motion.footer 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-auto px-5 py-3 border-t border-border-color dark:border-dark-border bg-white/50 dark:bg-sidebar/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 select-none pointer-events-none"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest">System Status: <span className="text-emerald-500">Live</span></span>
        </div>
        <div className="flex items-center gap-2 group pointer-events-auto">
          <Cpu size={12} className="text-text-muted group-hover:text-sap-blue transition-colors" />
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Engine: <span className="text-text-color">v4.2.0-Quantix</span></span>
        </div>
        <div className="flex items-center gap-2 group pointer-events-auto">
          <ShieldCheck size={12} className="text-text-muted group-hover:text-emerald-500 transition-colors" />
          <span className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Security: <span className="text-text-color">AES-256 Validated</span></span>
        </div>
      </div>

      <div className="flex items-center gap-6 opacity-60">
        <div className="flex items-center gap-2">
          <Globe size={12} className="text-text-muted" />
          <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter">Global Node: <span className="text-text-color">SA-East-1</span></span>
        </div>
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
          © {currentYear} <span className="text-sap-blue font-black tracking-tighter">SAP</span> Smart Inventory. All Rights Reserved.
        </span>
      </div>
    </motion.footer>
  )
}
