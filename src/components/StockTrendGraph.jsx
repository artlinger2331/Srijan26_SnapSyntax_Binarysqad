import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { day: 'Mon', stock: 4000, demand: 2400 },
  { day: 'Tue', stock: 3200, demand: 2800 },
  { day: 'Wed', stock: 2800, demand: 3200 },
  { day: 'Thu', stock: 3600, demand: 2900 },
  { day: 'Fri', stock: 2200, demand: 3800 },
  { day: 'Sat', stock: 3800, demand: 3100 },
  { day: 'Sun', stock: 4200, demand: 2700 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}>
      <p style={{ color: '#64748b', fontSize: 11, marginBottom: 6 }}>{label}</p>
      {payload.map(e => (
        <p key={e.name} style={{ fontSize: 13, fontFamily: 'monospace', color: e.color, margin: '2px 0' }}>
          ● {e.name}: <strong>{e.value.toLocaleString()}</strong>
        </p>
      ))}
    </div>
  );
};

const StockTrendGraph = () => (
  <div className="chart-card">
    <div className="chart-header">
      <span className="chart-title">📈 Stock Levels vs Demand (Weekly)</span>
      <div className="chart-filters">
        <button className="chip active">7D</button>
        <button className="chip">30D</button>
        <button className="chip">90D</button>
      </div>
    </div>
    <div style={{ height: 240, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={{ stroke: '#1e293b' }} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v/1000}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: 12, fontSize: 12 }} />
          <Line type="monotone" dataKey="stock" name="Current Stock" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          <Line type="monotone" dataKey="demand" name="Projected Demand" stroke="#6366f1" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default StockTrendGraph;
