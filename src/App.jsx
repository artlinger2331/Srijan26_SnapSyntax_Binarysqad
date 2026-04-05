import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import ThreeLogisticsGlobe from './components/ThreeLogisticsGlobe'

// Components
import TopBar from './components/Topbar'
import KPICards from './components/KPICards'
import ChartsSection from './components/ChartsSection'
import ActionCenter from './components/ActionCenter'
import ActivityFeed from './components/ActivityFeed'
import InventoryPage from './components/InventoryPage'
import OrdersPage from './components/OrdersPage'
import Suppliers from './components/Suppliers'
import ReportsPage from './components/ReportsPage'
import StockMgmtPage from './components/StockMgmtPage'
import ProductionPage from './components/ProductionPage'
import ProcurementPage from './components/ProcurementPage'
import ProductsPage from './components/ProductsPage'
import SettingsPage from './components/SettingsPage'
import ProfilePage from './components/ProfilePage'
import Footer from './components/Footer'
import LandingPage from './components/LandingPage'

const navTop = [
  { id: 'dashboard',  icon: '⊞', label: 'Dashboard' },
  { id: 'inventory',  icon: '🗄', label: 'Inventory' },
  { id: 'orders',     icon: '📋', label: 'Orders' },
  { id: 'suppliers',  icon: '🤝', label: 'Suppliers' },
  { id: 'reports',    icon: '📊', label: 'Reports' },
]

const navStock = [
  { id: 'stockmgmt',  icon: '🔢', label: 'Stock Management' },
  { id: 'production', icon: '⚙', label: 'Production' },
  { id: 'procure',    icon: '🛒', label: 'Procurement' },
  { id: 'products',   icon: '📦', label: 'Products' },
]

const Sidebar = ({ active, setActive, isOpen, setIsOpen }) => {
  const NavItem = ({ item }) => (
    <motion.button
      whileHover={{ x: 4, backgroundColor: active === item.id ? "" : "rgba(34, 197, 94, 0.05)" }}
      whileTap={{ scale: 0.97 }}
      onClick={() => {
        setActive(item.id)
        // Close sidebar on mobile when item is clicked
        if (window.innerWidth < 1024) {
          setIsOpen(false)
        }
      }}
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left text-[13px] transition-all border-l-4 ${
        active === item.id 
          ? 'bg-sap-blue/10 dark:bg-sap-blue/20 text-sap-blue font-bold border-sap-blue shadow-[0_0_15px_rgba(34,197,94,0.1)]' 
          : 'text-text-muted hover:text-text-color border-transparent font-medium'
      }`}
    >
      <span className="text-[17px] w-6 text-center flex-shrink-0 transition-transform group-hover:scale-110">{item.icon}</span>
      {item.label}
    </motion.button>
  )

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-[40] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar - Only visible on mobile, animated */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed lg:hidden w-[220px] shrink-0 bg-surface-color dark:bg-sidebar border-r border-border-color dark:border-dark-border flex flex-col h-screen overflow-hidden z-[41]"
          >
            {/* Brand */}
            <div className="px-5 py-4 border-b border-border-color dark:border-dark-border flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-sap-blue text-white px-2 py-0.5 rounded text-sm font-black tracking-tighter">SAP</div>
                <span className="font-bold text-[13px] text-text-color tracking-wide hidden sm:inline">Smart Inventory</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="lg:hidden text-text-muted hover:text-text-color"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Nav */}
            <nav className="p-3 flex flex-col gap-1">
              {navTop.map(item => <NavItem key={item.id} item={item} />)}
            </nav>

            <div className="px-5 py-2 mt-2">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Stock Ops</span>
            </div>
            <nav className="p-3 flex flex-col gap-1 flex-1 overflow-y-auto">
              {navStock.map(item => <NavItem key={item.id} item={item} />)}
            </nav>

            {/* Footer Nav */}
            <div className="p-3 border-t border-border-color dark:border-dark-border">
              <NavItem item={{ id: 'settings', icon: '⚙', label: 'Settings' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar - Always visible on desktop, never animated */}
      <div 
        className="hidden lg:flex w-[220px] shrink-0 bg-surface-color dark:bg-sidebar border-r border-border-color dark:border-dark-border flex-col h-screen overflow-hidden z-0"
      >
        {/* Brand */}
        <div className="px-5 py-4 border-b border-border-color dark:border-dark-border flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-sap-blue text-white px-2 py-0.5 rounded text-sm font-black tracking-tighter">SAP</div>
            <span className="font-bold text-[13px] text-text-color tracking-wide">Smart Inventory</span>
          </div>
        </div>

        {/* Main Nav */}
        <nav className="p-3 flex flex-col gap-1">
          {navTop.map(item => <NavItem key={item.id} item={item} />)}
        </nav>

        <div className="px-5 py-2 mt-2">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Stock Ops</span>
        </div>
        <nav className="p-3 flex flex-col gap-1 flex-1 overflow-y-auto">
          {navStock.map(item => <NavItem key={item.id} item={item} />)}
        </nav>

        {/* Footer Nav */}
        <div className="p-3 border-t border-border-color dark:border-dark-border">
          <NavItem item={{ id: 'settings', icon: '⚙', label: 'Settings' }} />
        </div>
      </div>
    </>
  )
}

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [hasLanded, setHasLanded] = useState(false)
  const [isAppLoading, setIsAppLoading] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleEnterDashboard = () => {
    setHasLanded(true)
    setIsAppLoading(true)
    // Artificial delay to show off the premium entrance animation
    setTimeout(() => setIsAppLoading(false), 3800)
  }

  if (!hasLanded) {
    return <LandingPage onEnterDashboard={handleEnterDashboard} />
  }

  return (
    <>
      {/* 🚀 STUNNING 3D SPLASH SCREEN INTERCEPTOR */}
      <AnimatePresence>
        {isAppLoading && (
          <motion.div 
            key="splash-screen"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }} // GPU accelerated exit with no expensive blur filters
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020409] overflow-hidden"
            style={{ perspective: '1200px' }}
          >
            {/* Deep Space / Obsidian Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(30,58,138,0.2)_0%,rgba(0,0,0,0)_60%)] rounded-full blur-[80px]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(16,185,129,0.05)_0%,rgba(0,0,0,0)_70%)] rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.1)_0%,rgba(0,0,0,0)_70%)] rounded-full blur-[100px]" />

            {/* 3D Rotating Logo Container */}
            <motion.div
              initial={{ rotateX: 50, rotateZ: -30, scale: 0.6, opacity: 0, z: -500 }}
              animate={{ rotateX: 0, rotateZ: 0, scale: 1, opacity: 1, z: 0 }}
              transition={{ duration: 1.8, type: "spring", bounce: 0.3 }}
              className="relative flex flex-col items-center z-10"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Core 3D Cube illusion */}
              <div className="relative w-32 h-32 mb-12 flex items-center justify-center">
                {/* Orbital Rings */}
                <motion.div 
                  animate={{ rotateZ: 360, rotateX: 360, rotateY: 180 }}
                  transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-40%] rounded-full border-[1.5px] border-dashed border-sap-blue/20"
                  style={{ transformStyle: 'preserve-3d' }}
                />
                <motion.div 
                  animate={{ rotateZ: -360, rotateX: -180, rotateY: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-20%] rounded-full border border-indigo-500/30"
                  style={{ transformStyle: 'preserve-3d' }}
                />

                {/* Main 3D Glass Panel */}
                <motion.div 
                  initial={{ rotateY: 90 }}
                  animate={{ rotateY: 0 }}
                  transition={{ delay: 0.8, duration: 1.2, type: "spring" }}
                  className="absolute inset-0 bg-[#090b14]/80 border border-blue-500/40 rounded-2xl shadow-[0_0_60px_rgba(10,132,255,0.3),inset_0_0_30px_rgba(10,132,255,0.2)] flex items-center justify-center overflow-hidden backdrop-blur-2xl ring-1 ring-white/10"
                >
                  {/* Diagonal Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite]" />
                  
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-400 tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                    SAP
                  </span>
                </motion.div>
              </div>

              {/* Cinematic Typography */}
              <motion.div
                initial={{ opacity: 0, y: 40, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 1, duration: 1.2, type: "spring", bounce: 0.4 }}
                className="text-center"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-slate-500 via-white to-slate-500 mb-6 uppercase drop-shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                  Smart Inventory
                </h1>
                <div className="flex items-center justify-center gap-6">
                  <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-blue-500/60 shadow-[0_0_10px_rgba(59,130,246,1)]" />
                  <motion.span 
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.5em] drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]"
                  >
                    System Initialization
                  </motion.span>
                  <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-blue-500/60 shadow-[0_0_10px_rgba(59,130,246,1)]" />
                </div>
              </motion.div>
            </motion.div>

            {/* Hyper-Speed Light Trails Floor */}
            <motion.div 
              initial={{ opacity: 0, rotateX: 85, scale: 0.5, y: 300 }}
              animate={{ opacity: 1, rotateX: 75, scale: 2, y: 200 }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute bottom-[-40%] left-[-50%] right-[-50%] h-[100vh] pointer-events-none z-0 overflow-hidden"
              style={{ transformOrigin: 'top center' }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.15)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(59,130,246,0.15)_1.5px,transparent_1.5px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] animate-[grid-move_20s_linear_infinite]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020409] via-transparent to-transparent" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN APPLICATION WRAPPER */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isAppLoading ? 0 : 1 
        }}
        // Ultra-smooth Apple-style cubic-bezier deceleration curve
        transition={{ duration: 1.8, delay: isAppLoading ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-screen w-full overflow-hidden antialiased bg-bg-color relative z-0"
      >
      
      {/* LEFT NAVIGATION */}
      <Sidebar active={activeNav} setActive={setActiveNav} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        
        {/* TOP BAR SPACER (Reserves physical space so layout doesn't break) */}
        <div className="h-14 w-full shrink-0" />

        {/* WORKSPACE AREA (SPLIT LEFT AND RIGHT) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeNav}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10, transition: { duration: 0.15 } }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 flex flex-col lg:flex-row min-w-0 min-h-0 gap-0 lg:gap-4"
          >
            {activeNav === 'dashboard' ? (
              <div className="flex-1 flex min-h-0">
                
                {/* LEFT DASHBOARD BODY */}
                <div className="flex-1 min-w-0 overflow-y-auto p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col gap-4 sm:gap-6 scroll-smooth relative group w-full">
                  
                  {/* 🎨 TITAN WONDER: 3D LOGISTICS GLOBE */}
                  <div className="absolute inset-x-0 bottom-0 top-[20%] z-0 opacity-20 pointer-events-none">
                    <ThreeLogisticsGlobe />
                  </div>
              


              {/* Header */}
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-text-color tracking-tight truncate">Enterprise Overview</h1>
                  <p className="text-xs sm:text-sm text-text-muted mt-1 line-clamp-2">Real-time inventory telemetry across manufacturing facilities.</p>
                </div>
                <button className="px-3 sm:px-4 py-2 border border-border-color dark:border-dark-border bg-surface-color dark:bg-dark-surface rounded-lg text-[12px] sm:text-[13px] font-medium text-text-color shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex-shrink-0 whitespace-nowrap">
                  Plant A (Global) ▼
                </button>
              </div>

              {/* KPI Cards */}
              <div className="relative z-10">
                <KPICards />
              </div>

              {/* Charts */}
              <div className="relative z-10">
                <ChartsSection />
              </div>

              {/* Action Center Table */}
              <div className="relative z-10 h-[300px]">
                <ActionCenter />
              </div>

            </div>

            {/* RIGHT OPERATIONAL SIDEBAR */}
            <div className="hidden xl:block w-[280px] 2xl:w-[320px] shrink-0 h-full relative">
              <ActivityFeed />
            </div>

          </div>
        ) : activeNav === 'inventory' ? (
          <InventoryPage />
        ) : activeNav === 'orders' ? (
          <OrdersPage />
        ) : activeNav === 'reports' ? (
          <ReportsPage />
        ) : activeNav === 'suppliers' ? (
          <Suppliers />
        ) : activeNav === 'stockmgmt' ? (
          <StockMgmtPage />
        ) : activeNav === 'production' ? (
          <ProductionPage />
        ) : activeNav === 'procure' ? (
          <ProcurementPage />
        ) : activeNav === 'products' ? (
          <ProductsPage />
        ) : activeNav === 'settings' ? (
          <SettingsPage />
        ) : activeNav === 'profile' ? (
          <ProfilePage />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-bg-color text-text-muted">
            <div className="text-center">
              <div className="text-4xl mb-4">🚧</div>
              <p className="font-bold text-lg text-text-color">Module Coming Soon</p>
              <p className="text-sm mt-1">Click 'Dashboard' in the sidebar to return.</p>
            </div>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
        <Footer />

        {/* TOP BAR (Rendered LAST so its backdrop-filter captures everything!) */}
        <div className="absolute top-0 left-0 right-0 z-[100]">
          <TopBar 
            showNotifications={showNotifications} 
            setShowNotifications={setShowNotifications} 
            setActiveNav={setActiveNav}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      </div>
      </motion.div>
    </>
  )
}
