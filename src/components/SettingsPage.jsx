import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Layout, Bell, Shield, Database, Moon, RefreshCcw } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('General')
  const [isHolographic, setIsHolographic] = useState(true)

  const tabs = [
    { name: 'General', icon: <User size={16} /> },
    { name: 'Appearance', icon: <Layout size={16} /> },
    { name: 'Notifications', icon: <Bell size={16} /> },
    { name: 'Security', icon: <Shield size={16} /> },
    { name: 'API Integrations', icon: <Database size={16} /> },
  ]

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-5 md:p-6 lg:p-8 flex flex-col gap-6 scroll-smooth">
      {/* Header */}
      <div className="flex justify-between items-end mb-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-xl md:text-2xl font-bold text-text-color tracking-tight">System Settings</h1>
          <p className="text-sm text-text-muted mt-1">Configure workspace preferences and account security.</p>
        </motion.div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          {tabs.map((tab, i) => (
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${
                activeTab === tab.name 
                ? 'bg-sap-blue text-white shadow-lg shadow-blue-500/20' 
                : 'text-text-muted hover:bg-surface-color dark:hover:bg-dark-surface hover:text-text-color'
              }`}
            >
              {tab.icon} {tab.name}
            </motion.button>
          ))}
        </div>

        {/* Right Content */}
        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 bg-surface-color dark:bg-dark-surface border border-border-color dark:border-dark-border rounded-2xl p-6 lg:p-8 shadow-sm"
        >
          <h2 className="text-lg font-bold text-text-color mb-6 border-b border-border-color dark:border-dark-border pb-4">{activeTab} Settings</h2>
          
          {activeTab === 'Appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-[14px] font-bold text-text-color mb-3">Theme Preference</h3>
                <div className="flex gap-4">
                  <motion.button 
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => document.documentElement.classList.add('dark')}
                    className={`flex-1 p-5 rounded-2xl flex flex-col items-center gap-3 text-[13px] font-bold transition-all border-2 ${
                      isDark 
                      ? 'border-sap-blue bg-blue-500/5 text-sap-blue' 
                      : 'border-border-color bg-slate-50 text-text-muted'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Moon size={24} />
                    </div>
                    Obsidian Dark 
                  </motion.button>
                  <motion.button 
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => document.documentElement.classList.remove('dark')}
                    className={`flex-1 p-5 rounded-2xl flex flex-col items-center gap-3 text-[13px] font-bold transition-all border-2 ${
                      !isDark 
                      ? 'border-sap-blue bg-blue-500/5 text-sap-blue' 
                      : 'border-border-color bg-slate-50 text-text-muted'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <Layout size={24} />
                    </div>
                    Classic Light
                  </motion.button>
                </div>
              </div>
              
              <div className="pt-4">
                <motion.div 
                   whileHover={{ backgroundColor: "rgba(34, 197, 94, 0.05)" }}
                   className="flex items-center justify-between p-5 bg-slate-50 dark:bg-[#11141c] rounded-2xl border border-border-color dark:border-dark-border transition-colors cursor-pointer"
                   onClick={() => setIsHolographic(!isHolographic)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                       <RefreshCcw size={20} className={isHolographic ? 'animate-spin-slow' : ''} />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-bold text-text-color">Holographic Micro-interactions</h4>
                      <p className="text-[12px] text-text-muted mt-1">Enable GPU-accelerated motion sensing on cards.</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isHolographic ? 'bg-sap-blue' : 'bg-slate-300 dark:bg-slate-700'}`}>
                    <motion.div 
                      animate={{ x: isHolographic ? 24 : 4 }}
                      className="w-4 h-4 bg-white rounded-full absolute top-1 shadow-md" 
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {activeTab === 'General' && (
            <div className="space-y-6 max-w-lg">
              <div className="group">
                <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2 transition-colors group-focus-within:text-sap-blue">Company Name</label>
                <input defaultValue="SAP Enterprise Logistics" className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-xl px-4 py-3 text-[14px] text-text-color shadow-sm focus:ring-2 focus:ring-sap-blue focus:border-sap-blue outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2 transition-colors group-focus-within:text-sap-blue">Currency</label>
                  <select className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-xl px-4 py-3 text-[14px] text-text-color shadow-sm focus:ring-2 focus:ring-sap-blue focus:border-sap-blue outline-none transition-all cursor-pointer">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
                <div className="group">
                  <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2 transition-colors group-focus-within:text-sap-blue">Timezone</label>
                  <select className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-xl px-4 py-3 text-[14px] text-text-color shadow-sm focus:ring-2 focus:ring-sap-blue focus:border-sap-blue outline-none transition-all cursor-pointer">
                    <option>UTC-5 (EST)</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC+5:30 (IST)</option>
                  </select>
                </div>
              </div>
              <div className="pt-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-sap-blue text-white rounded-xl text-[14px] font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors"
                >
                  Save Global Config
                </motion.button>
              </div>
            </div>
          )}

          {activeTab !== 'General' && activeTab !== 'Appearance' && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-text-muted">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="mb-6 opacity-20"
              >
                <RefreshCcw size={48} />
              </motion.div>
              <p className="font-bold text-[16px] text-text-color">Advanced config unavailable</p>
              <p className="text-[13px] mt-2 max-w-xs text-center opacity-80">This module is currently locked by system policy for your user role.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
