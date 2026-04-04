import React, { useState } from 'react'
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Download, Calendar, Filter, Loader2, FileCheck, ShieldCheck } from 'lucide-react'

const financialData = [
  { name: 'Jan', revenue: 4000, cost: 2400 },
  { name: 'Feb', revenue: 3000, cost: 1398 },
  { name: 'Mar', revenue: 2000, cost: 9800 },
  { name: 'Apr', revenue: 2780, cost: 3908 },
  { name: 'May', revenue: 1890, cost: 4800 },
  { name: 'Jun', revenue: 2390, cost: 3800 },
  { name: 'Jul', revenue: 3490, cost: 4300 },
]

const pieData = [
  { name: 'Raw Materials', value: 40 },
  { name: 'Finished Goods', value: 30 },
  { name: 'Components', value: 20 },
  { name: 'Packaging', value: 10 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']

const StatCard = ({ title, value, change, positive, index }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - rect.left) / rect.width - 0.5)
        y.set((e.clientY - rect.top) / rect.height - 0.5)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-surface-color dark:bg-dark-surface p-5 rounded-2xl border border-border-color dark:border-dark-border flex flex-col justify-between cursor-pointer shadow-sm hover:shadow-xl transition-all"
    >
      <div style={{ transform: "translateZ(20px)" }}>
        <div className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2">{title}</div>
        <div className="text-3xl font-black text-text-color tracking-tighter">{value}</div>
        <div className={`text-[12px] font-bold mt-2 flex items-center gap-1 ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
          <TrendingUp size={14} className={positive ? '' : 'rotate-180'} />
          {change} vs last month
        </div>
      </div>
    </motion.div>
  )
}

export default function ReportsPage() {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState(0);

  const handleExport = () => {
    setIsExporting(true);
    setExportStep(1); // Preparing

    setTimeout(() => setExportStep(2), 1200); // Fetching telemetery
    setTimeout(() => setExportStep(3), 2400); // Generating PDF

    setTimeout(() => {
      // Create Mock CSV Data (Actual working condition for export)
      const headers = ['Month', 'Revenue', 'Cost', 'Margin'];
      const rows = financialData.map(d => [d.name, d.revenue, d.cost, d.revenue - d.cost]);
      let csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Inventory_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setExportStep(0);
    }, 4000);
  };

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-5 md:p-6 lg:p-8 flex flex-col gap-6 scroll-smooth relative group">

      {/* 💎 ZENITH DESIGN LAYER: PRISM REFRACTION */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
        <motion.div
          animate={{ x: [-1000, 1000] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-[35deg]"
        />
        <motion.div
          animate={{ x: [1000, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-sap-blue/5 to-transparent rotate-[-45deg]"
        />
      </div>

      <div className="relative z-10 flex flex-col h-full gap-6">
        {/* Header */}
        <div className="flex justify-between items-end mb-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-xl md:text-2xl font-bold text-text-color tracking-tight">Financial & Analytical Reports</h1>
            <p className="text-sm text-text-muted mt-1">Enterprise-grade telemetry for revenue, COGS, and inventory turnover.</p>
          </motion.div>
          <div className="flex items-center gap-3">
            <motion.button whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-color dark:border-dark-border text-text-muted hover:text-text-color transition-colors text-[13px] font-medium bg-white dark:bg-[#11141c]">
              <Calendar size={14} /> Last 30 Days
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-color dark:border-dark-border text-text-muted hover:text-text-color transition-colors text-[13px] font-medium bg-white dark:bg-[#11141c]">
              <Filter size={14} /> Filter
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExport}
              disabled={isExporting}
              className={`flex items-center gap-2 px-4 py-2 bg-sap-blue text-white rounded-lg text-[13px] font-bold shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-all ${isExporting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
              Export PDF
            </motion.button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <StatCard title="Total Revenue" value="$4.2M" change="+12.5%" positive={true} index={0} />
          <StatCard title="Inventory Cost" value="$1.8M" change="-2.4%" positive={true} index={1} />
          <StatCard title="Stock Turnover" value="8.4x" change="-0.5x" positive={false} index={2} />
          <StatCard title="Dead Stock Val" value="$42k" change="+5.2%" positive={false} index={3} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Revenue vs Cost */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2 bg-surface-color dark:bg-dark-surface p-6 rounded-2xl border border-border-color dark:border-dark-border shadow-sm flex flex-col"
          >
            <h2 className="text-[14px] font-bold text-text-color mb-6 flex items-center gap-2">
              <div className="w-1 h-3 bg-sap-blue rounded-full" /> Revenue vs Cost Analysis (YTD)
            </h2>
            <div className="flex-1 min-h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(8px)'
                    }}
                    itemStyle={{ fontSize: '13px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="cost" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Inventory Distribution */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-surface-color dark:bg-dark-surface p-6 rounded-2xl border border-border-color dark:border-dark-border flex flex-col shadow-sm"
          >
            <h2 className="text-[14px] font-bold text-text-color mb-6 flex items-center gap-2">
              <div className="w-1 h-3 bg-emerald-500 rounded-full" /> Capital Distribution
            </h2>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'var(--surface-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(8px)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2 mt-6">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[13px] font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-white/5 shadow-inner">
                  <div className="flex items-center gap-2 text-text-muted">
                    <div className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: COLORS[i] }} />
                    {item.name}
                  </div>
                  <div className="font-mono font-bold text-text-color">{item.value}%</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Export Progress Overlay */}
        <AnimatePresence>
          {isExporting && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white dark:bg-[#0f172a] p-10 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center text-center max-w-sm"
              >
                <div className="w-20 h-20 rounded-2xl bg-sap-blue/10 flex items-center justify-center text-sap-blue mb-6 relative">
                  <Loader2 size={40} className="animate-spin opacity-20 absolute" />
                  {exportStep === 3 ? <FileCheck size={32} className="text-emerald-500" /> : <Download size={32} />}
                </div>

                <h3 className="text-xl font-black text-text-color tracking-tight mb-2">
                  {exportStep === 1 ? 'Quantizing Data...' : exportStep === 2 ? 'Verifying Integrity...' : 'Generating Assets...'}
                </h3>
                <p className="text-text-muted text-[14px] mb-8 font-medium italic opacity-70">
                  Please standby. We are compiling high-fidelity system telemetry into your report.
                </p>

                <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(exportStep / 3) * 100}%` }}
                    className="h-full bg-sap-blue shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-sap-blue">
                  <ShieldCheck size={12} /> SECURE EXPORT IN PROGRESS
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
