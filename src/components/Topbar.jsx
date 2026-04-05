import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Clock, Bell, Sun, Moon, Menu } from 'lucide-react'

export default function TopBar({ showNotifications, setShowNotifications, setActiveNav, onMenuClick }) {
  const [theme, setTheme] = useState('dark')
  const [unreadCount, setUnreadCount] = useState(2)

  // Initialize theme from HTML class
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [])

  const toggleTheme = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark')
      setTheme('light')
    } else {
      document.documentElement.classList.add('dark')
      setTheme('dark')
    }
  }

  const handleClearNotifications = () => {
    setUnreadCount(0)
    setShowNotifications(false)
  }

  const handleToggleNotifications = () => {
    setShowNotifications(prev => !prev)
  }

  return (
    <div className="h-14 shrink-0 px-3 sm:px-5 flex items-center justify-between bg-surface-color dark:bg-sidebar border-b border-border-color dark:border-dark-border relative z-50">
      
      {/* Mobile Menu Button */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        onClick={onMenuClick}
        className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
      >
        <Menu size={18} />
      </motion.button>

      {/* Global Search */}
      <div className="hidden sm:flex items-center gap-2 bg-slate-100/50 dark:bg-black/20 backdrop-blur-md border border-border-color dark:border-white/10 rounded-xl px-4 py-1.5 flex-1 mx-3 md:w-64 focus-within:ring-2 focus-within:ring-sap-blue/50 focus-within:md:w-72 transition-all duration-300 shadow-sm max-w-xs md:max-w-none">
        <Search size={16} className="text-text-muted group-focus-within:text-sap-blue transition-colors flex-shrink-0" />
        <input 
          placeholder="Search..." 
          className="bg-transparent border-none outline-none text-[13px] text-text-color w-full placeholder-slate-400 dark:placeholder-slate-500 font-bold"
        />
      </div>

      {/* Mobile Search Icon */}
      <motion.button 
        whileTap={{ scale: 0.9 }}
        className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
      >
        <Search size={18} />
      </motion.button>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-4 ml-auto">
        
        {/* Theme Toggle */}
        <motion.button 
          whileTap={{ scale: 0.9, rotate: 15 }}
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </motion.button>

        <motion.button 
          whileTap={{ scale: 0.9 }}
          whileHover={{ y: -2 }}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <Clock size={18} />
        </motion.button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            whileHover={{ y: -2 }}
            onClick={handleToggleNotifications}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse ring-2 ring-surface-color dark:ring-sidebar" />
            )}
          </motion.button>

          {/* Notification Panel */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-80 z-[1000]"
              >
                {/* 
                  1. STATIC BACKGROUND LAYER (NO TRANSFORMS) 
                  This is required because applying backdrop-filter to the parent motion.div 
                  (which has transform styles injected by Framer Motion) causes Chrome 
                  to instantly fail the composite buffer merge, destroying the blur.
                */}
                <div 
                  className="absolute inset-0 rounded-2xl bg-white/70 dark:bg-[#020617]/60 border border-slate-200/50 dark:border-white/10 shadow-2xl"
                  style={{
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)'
                  }}
                />

                {/* 2. TEXT AND CONTENT LAYER */}
                <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-border-color dark:border-white/10 flex justify-between items-center">
                    <h3 className="font-bold text-[14px] text-text-color">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-[11px] font-bold text-sap-blue bg-blue-500/10 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                    )}
                  </div>
                
                <div className="max-h-64 overflow-y-auto p-2">
                  {unreadCount === 0 ? (
                    <div className="p-4 text-center text-text-muted text-[13px]">No new notifications</div>
                  ) : (
                    <>
                      <motion.div 
                        whileHover={{ backgroundColor: "rgba(34, 197, 94, 0.05)" }}
                        className="p-3 mb-1 rounded-lg cursor-pointer transition-colors"
                      >
                        <p className="text-[13px] font-medium text-text-color leading-snug">Order #4492 is ready for dispatch</p>
                        <p className="text-[11px] text-text-muted mt-1">10 mins ago</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ backgroundColor: "rgba(34, 197, 94, 0.05)" }}
                        className="p-3 rounded-lg cursor-pointer transition-colors"
                      >
                        <p className="text-[13px] font-medium text-text-color leading-snug">System maintenance scheduled for 02:00 AM UTC</p>
                        <p className="text-[11px] text-text-muted mt-1">2 hours ago</p>
                      </motion.div>
                    </>
                  )}
                </div>

                {unreadCount > 0 && (
                  <div className="p-2 border-t border-border-color dark:border-white/10">
                    <motion.button 
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClearNotifications} 
                      className="w-full py-2 text-[12px] font-bold text-text-muted hover:text-sap-blue transition-colors text-center rounded-lg hover:bg-slate-100 dark:hover:bg-white/5"
                    >
                      Mark all as read
                    </motion.button>
                  </div>
                )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <motion.div 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveNav('profile')}
          className="w-8 h-8 rounded-full bg-sap-blue flex items-center justify-center text-white font-bold text-[13px] shadow-sm shadow-blue-500/30 cursor-pointer ml-2"
        >
          JD
        </motion.div>
      </div>
    </div>
  )
}
