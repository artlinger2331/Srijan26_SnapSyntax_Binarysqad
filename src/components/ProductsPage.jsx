import React, { useState, useEffect } from 'react'
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from 'framer-motion'
import { Package, Search, Navigation, Plus, X, Tag, Info, LayoutTemplate } from 'lucide-react'

const defaultProducts = [
  { id: 1, name: 'Servo Motor V2', category: 'Finished Goods', spec: '24V DC / 500RPM', img: '⚙️' },
  { id: 2, name: 'Hydraulic Valve', category: 'Components', spec: '150 Bar Max Flow', img: '🚰' },
  { id: 3, name: 'Industrial Gasket', category: 'Raw Material', spec: 'Silicone 50mm', img: '🕳️' },
  { id: 4, name: 'Packaging Box (L)', category: 'Packaging', spec: 'Corrugated 40x40', img: '📦' },
  { id: 5, name: 'Steel Bolt 8mm', category: 'Components', spec: 'Stainless Steel M8', img: '🔩' },
  { id: 6, name: 'Copper Wire', category: 'Raw Material', spec: '12 AWG / Spool', img: '🧵' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('smart_inventory_products')
    return saved ? JSON.parse(saved) : defaultProducts
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Finished Goods', spec: '', img: '📦' })

  useEffect(() => {
    localStorage.setItem('smart_inventory_products', JSON.stringify(products))
  }, [products])

  const handleAddProduct = (e) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.spec) return
    
    const id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
    const productToAdd = { ...newProduct, id }
    setProducts([productToAdd, ...products])
    setNewProduct({ name: '', category: 'Finished Goods', spec: '', img: '📦' })
    setIsModalOpen(false)
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const ProductCard = ({ product, index }) => {
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.05 }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          x.set((e.clientX - rect.left) / rect.width - 0.5)
          y.set((e.clientY - rect.top) / rect.height - 0.5)
        }}
        onMouseLeave={() => { x.set(0); y.set(0) }}
        style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
        whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
        whileTap={{ scale: 0.98 }}
        className="group bg-surface-color dark:bg-dark-surface p-6 rounded-3xl border border-border-color dark:border-white/5 relative overflow-hidden flex flex-col items-center text-center cursor-pointer transition-all"
      >
        {/* 🏷️ ZENITH OVERLAY: ASSET SERIAL HUD */}
        <div className="absolute top-2 left-4 text-[9px] font-mono font-black text-sap-blue opacity-30 group-hover:opacity-100 transition-opacity tracking-widest">
          S/N: {String(product.id).padStart(4, '0')}-{product.category.slice(0,3).toUpperCase()}
        </div>

        <div style={{ transform: "translateZ(30px)" }} className="relative z-10 w-full flex flex-col items-center">
          <div className="absolute top-[-5px] right-[-5px] p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.button whileHover={{ scale: 1.2 }} className="w-9 h-9 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg flex items-center justify-center text-sap-blue border border-white/50 dark:border-white/10">
              <Navigation size={16} />
            </motion.button>
          </div>

          <motion.div 
            whileHover={{ rotate: [0, -10, 10, 0] }}
            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100/50 to-slate-200/50 dark:from-white/5 dark:to-white/10 shadow-inner mb-6 flex items-center justify-center text-5xl backdrop-blur-sm"
          >
            {product.img}
          </motion.div>

          <h3 className="text-[17px] font-bold text-text-color mb-1 group-hover:text-sap-blue transition-colors px-4">{product.name}</h3>
          <p className="text-[11px] font-black text-sap-blue uppercase tracking-[0.15em] mb-3 bg-sap-blue/10 px-3 py-1 rounded-full">{product.category}</p>
          <p className="text-[13px] text-text-muted opacity-80 leading-relaxed max-w-[200px]">{product.spec}</p>

          <motion.button 
            whileHover={{ 
              scale: 1.05, 
              backgroundColor: "var(--sap-blue)", 
              color: "white",
              boxShadow: "0 10px 20px -5px rgba(34, 197, 94, 0.4)" 
            }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 w-full py-2.5 border border-border-color dark:border-white/10 rounded-xl text-[13px] font-bold text-text-color bg-white/5 dark:bg-white/5 transition-all duration-300 active:scale-[0.97] backdrop-blur-sm"
          >
            Add Specification
          </motion.button>
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-sap-blue/5 rounded-full blur-3xl group-hover:bg-sap-blue/10 transition-colors" />
      </motion.div>
    )
  }

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-5 md:p-6 lg:p-8 flex flex-col gap-6 scroll-smooth bg-slate-50/30 dark:bg-transparent relative group">
      
      {/* 🔐 ZENITH DESIGN LAYER: ASSET VAULT */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.06]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="vaultPattern" width="200" height="200" patternUnits="userSpaceOnUse">
              <rect x="10" y="10" width="180" height="180" rx="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-sap-blue" />
              <rect x="40" y="40" width="120" height="120" rx="10" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4,4" className="text-sap-blue" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#vaultPattern)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl md:text-3xl font-black text-text-color tracking-tight">Product Master Data</h1>
          <p className="text-sm text-text-muted mt-1 font-medium italic opacity-70">Centralized high-fidelity catalog of manufacturing assets.</p>
        </motion.div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-3 bg-white/30 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-2xl px-4 py-2.5 flex-1 md:w-72 focus-within:ring-2 focus-within:ring-sap-blue/30 focus-within:w-80 transition-all duration-500 shadow-xl shadow-black/5">
            <Search size={18} className="text-text-muted group-focus-within:text-sap-blue" />
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter catalog..." 
              className="bg-transparent border-none outline-none text-[14px] text-text-color w-full placeholder-slate-400 dark:placeholder-slate-600 font-bold"
            />
          </div>
          <motion.button 
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-sap-blue text-white rounded-2xl text-[14px] font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all"
          >
            <Plus size={18} /> <span className="hidden sm:inline">Add Product</span>
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode='popLayout'>
          {filteredProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </AnimatePresence>
      </div>

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white dark:bg-[#0f172a] w-full max-w-md rounded-3xl p-8 border border-white/20 shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sap-blue/10 flex items-center justify-center text-sap-blue">
                    <Package size={20} />
                  </div>
                  <h2 className="text-xl font-black text-text-color">New Product</h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} className="text-text-muted" />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">
                    <Tag size={12} /> Product Name
                  </label>
                  <input 
                    required
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Enter asset name..." 
                    className="w-full bg-slate-50 dark:bg-white/5 border border-border-color dark:border-white/10 rounded-xl px-4 py-3 text-[14px] text-text-color outline-none focus:ring-2 focus:ring-sap-blue/50 transition-all font-bold placeholder:font-normal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">
                      <LayoutTemplate size={12} /> Category
                    </label>
                    <select 
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full bg-slate-50 dark:bg-white/5 border border-border-color dark:border-white/10 rounded-xl px-3 py-3 text-[14px] text-text-color outline-none focus:ring-2 focus:ring-sap-blue/50 transition-all font-bold"
                    >
                      <option className='dark:bg-slate-900'>Finished Goods</option>
                      <option className='dark:bg-slate-900'>Components</option>
                      <option className='dark:bg-slate-900'>Raw Material</option>
                      <option className='dark:bg-slate-900'>Packaging</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">
                      Icon
                    </label>
                    <input 
                      value={newProduct.img}
                      onChange={e => setNewProduct({...newProduct, img: e.target.value})}
                      placeholder="Emoji/Icon" 
                      className="w-full text-center bg-slate-50 dark:bg-white/5 border border-border-color dark:border-white/10 rounded-xl px-4 py-3 text-[18px] text-text-color outline-none focus:ring-2 focus:ring-sap-blue/50 transition-all font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">
                    <Info size={12} /> Tech Specifications
                  </label>
                  <textarea 
                    required
                    value={newProduct.spec}
                    onChange={e => setNewProduct({...newProduct, spec: e.target.value})}
                    placeholder="24V DC / 500RPM / Stainless Steel..." 
                    className="w-full bg-slate-50 dark:bg-white/5 border border-border-color dark:border-white/10 rounded-xl px-4 py-3 text-[14px] text-text-color outline-none focus:ring-2 focus:ring-sap-blue/50 transition-all min-h-[100px] resize-none font-bold placeholder:font-normal"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 border border-border-color dark:border-white/10 rounded-2xl text-[14px] font-bold text-text-muted hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    Cancel
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="flex-[2] py-3.5 bg-sap-blue text-white rounded-2xl text-[14px] font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-all"
                  >
                    Commit to Catalog
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}
