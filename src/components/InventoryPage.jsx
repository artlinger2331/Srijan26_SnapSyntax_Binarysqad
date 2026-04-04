import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MoreVertical, Edit2, Trash2, Search, Filter, Download, Upload, X, Save, ArrowUpDown, ScanBarcode } from 'lucide-react'

// Initial configuration for state
const INITIAL_DATA = [
  { id: '1', sku: '1001', name: 'Industrial Gasket', category: 'Raw Material', price: 4.50, stock: 450, status: 'In Stock' },
  { id: '2', sku: '1002', name: 'Ball Bearing X2', category: 'Components', price: 12.00, stock: 12, status: 'Low Stock' },
  { id: '3', sku: '1003', name: 'Hydraulic Valve', category: 'Components', price: 215.00, stock: 0, status: 'Out Stock' },
  { id: '4', sku: '1004', name: 'Packaging Box (L)', category: 'Packaging', price: 1.20, stock: 8500, status: 'In Stock' },
  { id: '5', sku: '1005', name: 'Servo Motor V2', category: 'Finished', price: 890.00, stock: 5, status: 'Low Stock' },
  { id: '6', sku: '1006', name: 'Copper Wire (100m)', category: 'Raw Material', price: 45.00, stock: 0, status: 'Out Stock' },
  { id: '7', sku: '1007', name: 'Steel Bolt 8mm', category: 'Components', price: 0.15, stock: 12000, status: 'In Stock' },
]

const StatusBadge = ({ status }) => {
  const safeStatus = typeof status === 'string' ? status.trim() : 'Unknown'
  const styles = {
    'In Stock':  { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
    'Low Stock': { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    'Out Stock': { bg: 'bg-red-500/10 dark:bg-red-500/20', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800' },
  }[safeStatus] || { bg: 'bg-slate-500/10 dark:bg-slate-500/20', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200 dark:border-slate-800' }

  return (
    <span className={`inline-flex px-2 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase border ${styles.bg} ${styles.text} ${styles.border}`}>
      {safeStatus}
    </span>
  )
}

export default function InventoryPage() {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('inventoryData_v2')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          return parsed.map(p => ({
            id: p.id || String(Math.random()),
            sku: p.sku || '',
            name: p.name || 'Unnamed Product',
            category: p.category || 'Uncategorized',
            price: typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0,
            stock: typeof p.stock === 'number' ? p.stock : parseInt(p.stock, 10) || 0,
            status: p.status || 'In Stock'
          }))
        }
      }
    } catch (e) {
      console.error('Failed to parse inventoryData from local storage', e)
    }
    return INITIAL_DATA
  })

  useEffect(() => {
    localStorage.setItem('inventoryData_v2', JSON.stringify(products))
  }, [products])

  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [sortBy, setSortBy] = useState('Default')
  const [editingProduct, setEditingProduct] = useState(null)
  
  // Barcode Scanner State
  const [barcodeBuffer, setBarcodeBuffer] = useState('')
  const [scannedSku, setScannedSku] = useState(null)
  const scannerTimeoutRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is manually typing in input/textarea forms
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.key === 'Enter') {
        if (barcodeBuffer.length > 0) {
          // Hardware Scanner just finished transmitting the SKU
          e.preventDefault()
          setScannedSku(barcodeBuffer)
          setSearch('') // Clear manual search so the row is visible
          
          // Auto-scroll to the row smoothly
          setTimeout(() => {
            const rowEl = document.getElementById(`row-${barcodeBuffer}`)
            if (rowEl) rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }, 100)
          
          // Clear highlight after 3 seconds
          setTimeout(() => setScannedSku(null), 3000)
          setBarcodeBuffer('')
        }
      } else if (e.key.length === 1) { // Normal alphanumeric character
        setBarcodeBuffer(prev => prev + e.key)
        
        // Barcode scanners transmit entire strings in milliseconds.
        // We aggressively clear the buffer to prevent slow human typos from triggering it.
        clearTimeout(scannerTimeoutRef.current)
        scannerTimeoutRef.current = setTimeout(() => {
          setBarcodeBuffer('')
        }, 150)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(scannerTimeoutRef.current)
    }
  }, [barcodeBuffer])

  // Add Product State
  const [showAddModal, setShowAddModal] = useState(false)
  const [addError, setAddError] = useState('')
  const [newProductData, setNewProductData] = useState({ name: '', sku: '', category: '', price: '', stock: '' })

  const fileInputRef = useRef(null)

  const handleImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      const lines = text.split('\n').filter(line => line.trim() !== '')
      
      const importedProducts = []
      // Start at 1 to skip headers
      for (let i = 1; i < lines.length; i++) {
        // Robust CSV split: Split by comma, safely ignoring commas inside double quotes
        const row = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
        
        if (row && row.length >= 6) {
          const sku = row[0] ? row[0].replace(/^"|"$/g, '').trim() : ''
          const name = row[1] ? row[1].replace(/^"|"$/g, '').trim() : ''
          const category = row[2] ? row[2].replace(/^"|"$/g, '').trim() : ''
          const price = parseFloat(row[3]) || 0
          const stock = parseInt(row[4], 10) || 0
          const status = row[5] ? row[5].replace(/^"|"$/g, '').trim() : 'In Stock'

          if (sku && name) {
            importedProducts.push({
              id: Date.now().toString() + i,
              sku, name, category, price, stock, status
            })
          }
        }
      }
      
      if (importedProducts.length > 0) {
        setProducts(prev => [...importedProducts, ...prev])
      }
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    reader.readAsText(file)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    const { name, sku, category, price, stock } = newProductData
    
    // Manual Validation
    if (!name.trim() || !sku.trim() || !category.trim() || price === '' || stock === '') {
      setAddError('All fields must be filled out to add a product.')
      return
    }

    const stockNum = parseInt(stock, 10) || 0
    let status = 'In Stock'
    if (stockNum === 0) status = 'Out Stock'
    else if (stockNum < 20) status = 'Low Stock'

    const newProduct = {
      id: Date.now().toString(),
      name: name.trim(),
      sku: sku.trim(),
      category: category.trim(),
      price: parseFloat(price) || 0,
      stock: stockNum,
      status
    }

    setProducts([newProduct, ...products])
    setShowAddModal(false)
    setNewProductData({ name: '', sku: '', category: '', price: '', stock: '' })
    setAddError('')
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    // Recalculate status based on stock dynamically
    const newStock = parseInt(editingProduct.stock, 10)
    let newStatus = 'In Stock'
    if (newStock === 0) newStatus = 'Out Stock'
    else if (newStock < 20) newStatus = 'Low Stock'

    const updatedProduct = { ...editingProduct, stock: newStock, status: newStatus }
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
    setEditingProduct(null)
  }

  const handleExport = () => {
    const headers = ['SKU', 'Product Name', 'Category', 'Price', 'Stock QTY', 'Status']
    const csvContent = products.map(p => 
      `${p.sku},"${p.name}","${p.category}",${p.price},${p.stock},${p.status}`
    ).join('\n')
    
    const blob = new Blob([headers.join(',') + '\n' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'inventory_export.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  let filteredData = products.filter(item => {
    const safeName = item.name || ''
    const safeSku = item.sku || ''
    const matchesSearch = safeName.toLowerCase().includes(search.toLowerCase()) || safeSku.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filterStatus === 'All' || item.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (sortBy === 'Price: Low to High') {
    filteredData.sort((a, b) => a.price - b.price)
  } else if (sortBy === 'Price: High to Low') {
    filteredData.sort((a, b) => b.price - a.price)
  } else if (sortBy === 'Stock: Low to High') {
    filteredData.sort((a, b) => a.stock - b.stock)
  } else if (sortBy === 'Stock: High to Low') {
    filteredData.sort((a, b) => b.stock - a.stock)
  }

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-5 md:p-6 lg:p-8 flex flex-col scroll-smooth relative group">
      
      {/* 🔮 ZENITH DESIGN LAYER: HYPER-GRID */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.07]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--sap-blue) 1px, transparent 1px), linear-gradient(90deg, var(--sap-blue) 1px, transparent 1px)`,
            backgroundSize: '100px 100px',
            transform: 'perspective(500px) rotateX(60deg) translateY(-100px)',
            transformOrigin: 'top center',
            height: '200%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-color via-transparent to-bg-color" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text-color tracking-tight">Inventory Management</h1>
          <p className="text-sm text-text-muted mt-1">Manage and track all product SKUs across warehouse locations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 flex items-center gap-2 text-[12px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all">
            <ScanBarcode size={16} className="animate-pulse" />
            Scanner Ready
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-sap-blue text-white rounded-lg text-[13px] font-bold shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors">
            + Add Product
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-surface-color dark:bg-dark-surface border border-border-color dark:border-dark-border rounded-xl flex flex-col overflow-hidden shadow-sm flex-1">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-border-color dark:border-dark-border flex items-center justify-between bg-slate-50 dark:bg-transparent">
          <div className="flex items-center gap-2 bg-white dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-1.5 w-72 focus-within:ring-2 focus-within:ring-sap-blue transition-all shadow-sm">
            <Search size={16} className="text-text-muted" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by SKU or Name..." 
              className="bg-transparent border-none outline-none text-[13px] text-text-color w-full placeholder-text-muted font-medium"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <Filter size={14} className="absolute left-3 text-text-muted pointer-events-none" />
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-8 pr-8 py-1.5 appearance-none rounded-lg border border-border-color dark:border-dark-border text-text-muted hover:text-text-color hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors text-[13px] font-medium bg-white dark:bg-[#11141c] shadow-sm outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out Stock">Out of Stock</option>
              </select>
            </div>
            
            <div className="relative flex items-center">
              <ArrowUpDown size={14} className="absolute left-3 text-text-muted pointer-events-none" />
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-8 pr-8 py-1.5 appearance-none rounded-lg border border-border-color dark:border-dark-border text-text-muted hover:text-text-color hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors text-[13px] font-medium bg-white dark:bg-[#11141c] shadow-sm outline-none cursor-pointer"
              >
                <option value="Default">Sort: Default</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Stock: Low to High">Stock: Low to High</option>
                <option value="Stock: High to Low">Stock: High to Low</option>
              </select>
            </div>

            <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImport} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-color dark:border-dark-border text-text-muted hover:text-text-color hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors text-[13px] font-medium bg-white dark:bg-[#11141c] shadow-sm">
              <Upload size={14} /> Import CSV
            </button>
            <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border-color dark:border-dark-border text-text-muted hover:text-text-color hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors text-[13px] font-medium bg-white dark:bg-[#11141c] shadow-sm">
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead
              className="sticky top-0 z-10"
              style={{
                background: 'linear-gradient(180deg, #1e3a5f 0%, #152d4e 40%, #0f2240 100%)',
                boxShadow:
                  'inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.45), 0 3px 8px rgba(0,0,0,0.5)',
                borderBottom: '1px solid rgba(0,0,0,0.4)',
              }}
            >
              <tr>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-widest whitespace-nowrap"
                  style={{ color: '#a8c8f0', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>SKU (ID)</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-widest whitespace-nowrap"
                  style={{ color: '#a8c8f0', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>Product Name</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-widest whitespace-nowrap"
                  style={{ color: '#a8c8f0', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>Category</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-widest whitespace-nowrap"
                  style={{ color: '#a8c8f0', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>Price</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-widest whitespace-nowrap"
                  style={{ color: '#a8c8f0', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>Stock QTY</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-widest whitespace-nowrap"
                  style={{ color: '#a8c8f0', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>Status</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-widest whitespace-nowrap text-right"
                  style={{ color: '#a8c8f0', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color dark:divide-dark-border bg-white dark:bg-transparent">
              {filteredData.length > 0 ? filteredData.map((row) => {
                const isScanned = scannedSku === row.sku
                return (
                <motion.tr 
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  key={row.id} 
                  id={`row-${row.sku}`}
                  whileHover={{ 
                    scale: 1.005, 
                    backgroundColor: "rgba(var(--sap-blue-rgb, 34, 197, 94), 0.05)",
                    transition: { duration: 0.2 }
                  }}
                  className={`group transition-all duration-500 border-b border-border-color dark:border-dark-border ${isScanned ? 'bg-emerald-500/20 shadow-[inset_0_0_30px_rgba(16,185,129,0.3)] scale-[1.01]' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}
                >
                  <td className={`px-5 py-4 text-[13px] font-bold font-mono whitespace-nowrap transition-colors ${isScanned ? 'text-emerald-400' : 'text-text-color group-hover:text-sap-blue'}`}>{row.sku}</td>
                  <td className={`px-5 py-4 text-[14px] font-semibold whitespace-nowrap ${isScanned ? 'text-emerald-300' : 'text-text-color'}`}>{row.name}</td>
                  <td className={`px-5 py-4 text-[13px] font-medium whitespace-nowrap ${isScanned ? 'text-emerald-400/80' : 'text-text-muted'}`}>{row.category}</td>
                  <td className={`px-5 py-4 text-[13px] font-medium whitespace-nowrap font-mono ${isScanned ? 'text-emerald-400/80' : 'text-text-muted'}`}>${row.price.toFixed(2)}</td>
                  <td className={`px-5 py-4 text-[13px] font-bold font-mono whitespace-nowrap ${isScanned ? 'text-emerald-300' : 'text-text-color'}`}>{row.stock.toLocaleString()}</td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => setEditingProduct(row)} className={`p-1.5 rounded-md transition-colors ${isScanned ? 'text-emerald-300 hover:bg-emerald-500/30' : 'text-text-muted hover:text-sap-blue hover:bg-sap-blue/10'}`} title="Edit">
                        <Edit2 size={16} />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleDelete(row.id)} className={`p-1.5 rounded-md transition-colors ${isScanned ? 'text-emerald-300 hover:bg-emerald-500/30' : 'text-text-muted hover:text-red-500 hover:bg-red-500/10'}`} title="Delete">
                        <Trash2 size={16} />
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} className={`p-1.5 rounded-md transition-colors ${isScanned ? 'text-emerald-300 hover:bg-emerald-500/30' : 'text-text-muted hover:text-text-color hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
                        <MoreVertical size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              )}) : (
                <tr>
                  <td colSpan="7" className="px-5 py-8 text-center text-text-muted text-[13px]">
                    No products match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-border-color dark:border-dark-border flex justify-between items-center bg-slate-50 dark:bg-transparent">
          <span className="text-[12px] font-medium text-text-muted pl-2">Showing {filteredData.length} of {products.length} entries</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-border-color dark:border-dark-border rounded-md text-[12px] font-bold text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-not-allowed opacity-50">Prev</button>
            <button className="px-3 py-1.5 border border-sap-blue bg-sap-blue text-white rounded-md text-[12px] font-bold shadow-sm shadow-blue-500/20">1</button>
            <button className="px-3 py-1.5 border border-border-color dark:border-dark-border rounded-md text-[12px] font-bold text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Next</button>
          </div>
        </div>

      </div>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setEditingProduct(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="bg-surface-color dark:bg-dark-surface border border-border-color dark:border-dark-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-border-color dark:border-dark-border bg-slate-50 dark:bg-dark-surface/50">
                <h3 className="font-bold text-text-color text-[16px]">Edit Product</h3>
                <button onClick={() => setEditingProduct(null)} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-text-muted transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit}>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Product Name</label>
                    <input 
                      required
                      value={editingProduct.name}
                      onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-2 text-[13px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Category</label>
                      <input 
                        required
                        value={editingProduct.category}
                        onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-2 text-[13px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">SKU</label>
                      <input 
                        required
                        value={editingProduct.sku}
                        onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                        className="w-full font-mono bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-2 text-[13px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Price ($)</label>
                      <input 
                        type="number" step="0.01" required
                        value={editingProduct.price}
                        onChange={e => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                        className="w-full font-mono bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-2 text-[13px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Stock Quantity</label>
                      <input 
                        type="number" required
                        value={editingProduct.stock}
                        onChange={e => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                        className="w-full font-mono bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-2 text-[13px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-border-color dark:border-dark-border flex justify-end gap-3 bg-slate-50 dark:bg-dark-surface/50">
                  <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-text-muted hover:text-text-color transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-lg text-[13px] font-bold bg-sap-blue text-white shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors flex items-center gap-2">
                    <Save size={14} /> Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => {
              setShowAddModal(false)
              setAddError('')
            }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="bg-surface-color dark:bg-dark-surface border border-border-color dark:border-dark-border w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-5 border-b border-border-color dark:border-dark-border bg-slate-50 dark:bg-dark-surface/50">
                <h3 className="font-bold text-text-color text-[16px]">Add New Product</h3>
                <button 
                  onClick={() => {
                    setShowAddModal(false)
                    setAddError('')
                  }} 
                  className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-text-muted transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit}>
                <div className="p-6 space-y-4">
                  {addError && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-[12px] font-medium">
                      {addError}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Product Name</label>
                    <input 
                      value={newProductData.name}
                      onChange={e => setNewProductData({ ...newProductData, name: e.target.value })}
                      placeholder="e.g. Copper Wire (100m)"
                      className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-2 text-[13px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Category</label>
                      <input 
                        value={newProductData.category}
                        onChange={e => setNewProductData({ ...newProductData, category: e.target.value })}
                        placeholder="e.g. Raw Material"
                        className="w-full bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-2 text-[13px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">SKU</label>
                      <input 
                        value={newProductData.sku}
                        onChange={e => setNewProductData({ ...newProductData, sku: e.target.value })}
                        placeholder="e.g. 1008"
                        className="w-full font-mono bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-2 text-[13px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Price ($)</label>
                      <input 
                        type="number" step="0.01"
                        value={newProductData.price}
                        onChange={e => setNewProductData({ ...newProductData, price: e.target.value })}
                        placeholder="0.00"
                        className="w-full font-mono bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-2 text-[13px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-text-muted uppercase tracking-widest mb-1.5">Stock Quantity</label>
                      <input 
                        type="number"
                        value={newProductData.stock}
                        onChange={e => setNewProductData({ ...newProductData, stock: e.target.value })}
                        placeholder="0"
                        className="w-full font-mono bg-slate-50 dark:bg-[#11141c] border border-border-color dark:border-dark-border rounded-lg px-3 py-2 text-[13px] text-text-color focus:ring-2 focus:ring-sap-blue outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-border-color dark:border-dark-border flex justify-end gap-3 bg-slate-50 dark:bg-dark-surface/50">
                  <button type="button" onClick={() => {
                    setShowAddModal(false)
                    setAddError('')
                  }} className="px-4 py-2 rounded-lg text-[13px] font-semibold text-text-muted hover:text-text-color transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-lg text-[13px] font-bold bg-sap-blue text-white shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-colors flex items-center gap-2">
                    <Save size={14} /> Save Product
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
