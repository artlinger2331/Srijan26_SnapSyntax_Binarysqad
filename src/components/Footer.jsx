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
      className="w-full shrink-0 px-3 sm:px-5 py-3 sm:py-4 border-t border-border-color dark:border-dark-border bg-white/50 dark:bg-sidebar/30 backdrop-blur-md flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 sm:gap-4 select-none"
    >
      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] sm:text-[11px] font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">System Status: <span className="text-emerald-500">Live</span></span>
        </div>
        <div className="flex items-center gap-2 group">
          <Cpu size={12} className="text-text-muted group-hover:text-sap-blue transition-colors flex-shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">Engine: <span className="text-text-color">v4.2.0-Quantix</span></span>
        </div>
        <div className="hidden sm:flex items-center gap-2 group">
          <ShieldCheck size={12} className="text-text-muted group-hover:text-emerald-500 transition-colors flex-shrink-0" />
          <span className="text-[10px] sm:text-[11px] font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">Security: <span className="text-text-color">AES-256</span></span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 w-full sm:w-auto opacity-60 text-center sm:text-right">
        <div className="hidden sm:flex items-center gap-2">
          <Globe size={12} className="text-text-muted flex-shrink-0" />
          <span className="text-[10px] font-black text-text-muted uppercase tracking-tighter whitespace-nowrap">Global Node: <span className="text-text-color">SA-East-1</span></span>
        </div>
        <span className="text-[9px] sm:text-[10px] font-bold text-text-muted uppercase tracking-widest whitespace-nowrap">
          © {currentYear} <span className="text-sap-blue font-black tracking-tighter">SAP</span> Smart Inventory
        </span>
      </div>
    </motion.footer>
  )
}
