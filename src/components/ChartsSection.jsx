import React, { useEffect, useState } from 'react'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
  PieChart, Pie
} from 'recharts'

const stockTrends = [
  { week: 'Oct 1',  value: 8100000 },
  { week: 'Oct 8',  value: 8150000 },
  { week: 'Oct 15', value: 8300000 },
  { week: 'Oct 22', value: 8200000 },
  { week: 'Oct 29', value: 8400000 },
  { week: 'Nov 5',  value: 8450000 },
]

const statusData = [
  { name: 'In Stock', value: 45000 },
  { name: 'Low Stock', value: 8500 },
  { name: 'Critical', value: 1200 },
]

const categoryData = [
  { name: 'Raw Material', value: 45 },
  { name: 'Components', value: 30 },
  { name: 'Packaging', value: 15 },
  { name: 'Finished', value: 10 },
]
const PIE_COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']

const ChartTooltip = ({ active, payload, label, formatter }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-color dark:bg-dark-surface border border-border-color dark:border-dark-border rounded-lg p-3 shadow-xl backdrop-blur-md">
      <p className="text-[11px] text-text-muted mb-1">{label}</p>
      <p className="font-bold text-emerald-500 font-mono text-[13px]">
        {formatter ? formatter(payload[0].value) : payload[0].value}
      </p>
    </div>
  )
}

export default function ChartsSection() {
  const [statusChart, setStatusChart] = useState(statusData)
  const [categoryChart, setCategoryChart] = useState(categoryData)
  const [trendChart, setTrendChart] = useState(stockTrends)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('inventoryData_v2')
      if (saved) {
        const products = JSON.parse(saved)
        if (Array.isArray(products)) {
          let inStockCount = 0, lowStockCount = 0, criticalCount = 0
          let totalVal = 0
          const catMap = {}
          
          products.forEach(p => {
            // Compute Status Counts
            if (p.status === 'In Stock') inStockCount++
            else if (p.status === 'Low Stock') lowStockCount++
            else if (p.status === 'Out Stock') criticalCount++

            // Compute Category Distribution
            const cat = p.category || 'Uncategorized'
            catMap[cat] = (catMap[cat] || 0) + 1

            // Compute Current Total Value
            const price = typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0
            const stock = typeof p.stock === 'number' ? p.stock : parseInt(p.stock, 10) || 0
            totalVal += price * stock
          })
          
          setStatusChart([
            { name: 'In Stock', value: inStockCount },
            { name: 'Low Stock', value: lowStockCount },
            { name: 'Critical', value: criticalCount },
          ])
          
          const newCatData = Object.keys(catMap).map(k => ({ name: k, value: catMap[k] })).sort((a,b) => b.value - a.value)
          setCategoryChart(newCatData.length > 0 ? newCatData : categoryData)

          setTrendChart([
            { week: 'Oct 1',  value: 12500 },
            { week: 'Oct 8',  value: 14200 },
            { week: 'Oct 15', value: 13800 },
            { week: 'Oct 22', value: 15400 },
            { week: 'Oct 29', value: 16100 },
            { week: 'Current', value: totalVal },
          ])
        }
      }
    } catch (e) {
      console.error('Failed to parse chart data', e)
    }
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      
      {/* Line Chart */}
      <div className="col-span-1 lg:col-span-2 bg-surface-color dark:bg-dark-surface border border-border-color dark:border-dark-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-bold text-text-color tracking-wide">WEEKLY STOCK TRENDS</h3>
          <span className="text-xs text-text-muted">(Last 6 Weeks)</span>
        </div>
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendChart} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.4} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
              <YAxis 
                tick={{ fontSize: 11, fill: 'var(--text-muted)' }} 
                tickLine={false} axisLine={false}
                tickFormatter={v => `$${(v/1000).toFixed(1)}K`}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<ChartTooltip formatter={v => `$${(v).toLocaleString()}`} />} />
              <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side Charts Grid */}
      <div className="col-span-1 grid grid-cols-1 gap-4">
        
        {/* Bar Chart */}
        <div className="bg-surface-color dark:bg-dark-surface border border-border-color dark:border-dark-border rounded-xl p-4 shadow-sm h-[135px] flex flex-col">
          <h3 className="text-xs font-bold text-text-color tracking-wide mb-2 uppercase">Stock Status</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusChart} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} content={<ChartTooltip />} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                  {statusChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#10b981' : index === 1 ? '#f59e0b' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-surface-color dark:bg-dark-surface border border-border-color dark:border-dark-border rounded-xl p-4 shadow-sm h-[150px] flex items-center">
          <div className="flex-1 h-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChart}
                  cx="50%" cy="50%"
                  innerRadius={30} outerRadius={45}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip formatter={v => `${v} SKUs`} />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-text-muted font-semibold tracking-widest mt-1">CAT</span>
            </div>
          </div>
          <div className="w-24">
            {categoryChart.slice(0, 3).map((c, i) => (
              <div key={i} className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span className="text-[10px] text-text-muted truncate">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  )
}
