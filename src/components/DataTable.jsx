import React, { useState, useMemo } from 'react';

const initialData = [
  { id: 'SKU-001', name: 'Industrial Engine V8', category: 'Machinery',     location: 'Section A-1', stock: 2,   min: 2,   supplier: 'Teck Corp',   status: 'low' },
  { id: 'SKU-002', name: 'Titanium Screws 5mm', category: 'Fasteners',     location: 'Section B-4', stock: 850, min: 500, supplier: 'MetalWorks',  status: 'good' },
  { id: 'SKU-003', name: 'Coolant Fluid 50L',   category: 'Fluids',         location: 'Hazmat 1',    stock: 0,   min: 10,  supplier: 'ChemCorp',   status: 'out' },
  { id: 'SKU-004', name: 'Steel Beams 10m',     category: 'Raw Materials',   location: 'Yard C',      stock: 45,  min: 20,  supplier: 'IronMines',  status: 'good' },
  { id: 'SKU-005', name: 'Control Board PCB-9', category: 'Electronics',    location: 'Section A-2', stock: 4,   min: 15,  supplier: 'ElectroTech',status: 'low' },
  { id: 'SKU-006', name: 'Hydraulic Seals',     category: 'Parts',          location: 'Section C-1', stock: 120, min: 50,  supplier: 'PolySeal',   status: 'good' },
  { id: 'SKU-007', name: 'Safety Goggles Pro',  category: 'Safety',         location: 'Office Storage', stock: 68, min: 20, supplier: 'SafeGear', status: 'good' },
];

const categories = ['All','Machinery','Fasteners','Fluids','Raw Materials','Electronics','Parts','Safety'];

const DataTable = () => {
  const [data] = useState(initialData);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, dir: 'asc' });

  const toggleRow = (id) => {
    const s = new Set(selectedRows);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedRows(s);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const rows = useMemo(() => {
    let r = [...data];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter(i => i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || i.supplier.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'All') r = r.filter(i => i.category === categoryFilter);
    if (sortConfig.key) {
      r.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.dir === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.dir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return r;
  }, [data, searchQuery, categoryFilter, sortConfig]);

  return (
    <div className="data-table-card">
      {/* Toolbar */}
      <div className="dt-toolbar">
        <span className="dt-title">📋 Inventory Master Data</span>
        <div className="dt-controls">
          <div className="search-input-wrap">
            <span style={{ color: '#64748b', fontSize: 13 }}>🔍</span>
            <input placeholder="Search items..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
          <select className="dt-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          {selectedRows.size > 0 && (
            <button className="dt-btn dt-btn-primary">▶ Generate PO ({selectedRows.size})</button>
          )}
          <button className="dt-btn dt-btn-secondary">Export CSV</button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <input type="checkbox" style={{ accentColor: '#10b981' }}
                  checked={selectedRows.size === rows.length && rows.length > 0}
                  onChange={() => selectedRows.size === rows.length ? setSelectedRows(new Set()) : setSelectedRows(new Set(rows.map(r => r.id)))}
                />
              </th>
              <th onClick={() => handleSort('id')}>SKU ↕</th>
              <th onClick={() => handleSort('name')}>Item Name ↕</th>
              <th>Category</th>
              <th>Location</th>
              <th onClick={() => handleSort('stock')}>Stock ↕</th>
              <th>Supplier</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className={row.status === 'out' ? 'row-out' : row.status === 'low' ? 'row-low' : ''}>
                <td>
                  <input type="checkbox" style={{ accentColor: '#10b981' }}
                    checked={selectedRows.has(row.id)} onChange={() => toggleRow(row.id)} />
                </td>
                <td className="td-sku">{row.id}</td>
                <td className="td-name">{row.name}{row.status === 'out' && ' ⚠️'}</td>
                <td><span className="cat-badge">{row.category}</span></td>
                <td>{row.location}</td>
                <td className="td-stock">
                  <div className="stock-cell">
                    <span className={`stock-dot ${row.status}`}></span>
                    <span className={`stock-qty ${row.status}`}>{row.stock.toLocaleString()}</span>
                    <span style={{ color: '#334155', fontSize: 10 }}>/ {row.min}</span>
                  </div>
                </td>
                <td>{row.supplier}</td>
                <td style={{ textAlign: 'right' }}>
                  <button className="row-action">✏️</button>
                  <button className="row-action">⋯</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan="8" style={{ padding: '28px', textAlign: 'center', color: '#475569' }}>No items match your search/filter criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="dt-footer">
        <span>Showing {rows.length} of {data.length} items</span>
        <div className="pagination">
          <button className="page-btn" disabled>‹ Prev</button>
          <button className="page-btn current">1</button>
          <button className="page-btn" disabled>Next ›</button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
