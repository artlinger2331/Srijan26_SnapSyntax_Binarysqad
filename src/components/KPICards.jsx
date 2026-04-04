import React, { useEffect, useState } from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { TrendingUp, AlertCircle, AlertOctagon, Package } from 'lucide-react'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const AnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
  const [hasMounted, setHasMounted] = useState(false)
  const springValue = useSpring(0, { bounce: 0, duration: 2000 })
  const displayValue = useTransform(springValue, (current) => {
    if (value > 1000000) return (current / 1000000).toFixed(1) + 'M'
    return Math.round(current).toLocaleString()
  })

  useEffect(() => {
    setHasMounted(true)
    springValue.set(value)
  }, [value, springValue])

  if (!hasMounted) return <span>{prefix}0{suffix}</span>
  
  return (
    <div className="flex items-center">
      {prefix && <span>{prefix}</span>}
      <motion.span>{displayValue}</motion.span>
      {suffix && <span>{suffix}</span>}
    </div>
  )
}

const KPICard = ({ title, value, icon: Icon, color, prefix, suffix, subtext, subtextColor, badge }) => {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"])

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-surface-color dark:bg-dark-surface border border-border-color dark:border-dark-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group w-full h-full cursor-grab active:cursor-grabbing"
    >
      <div style={{ transform: "translateZ(20px)" }} className="relative z-10 w-full h-full pointer-events-none">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-[11px] font-bold text-text-muted uppercase tracking-wider select-none pointer-events-none">{title}</h3>
          <div className={`p-2 rounded-lg bg-opacity-10 dark:bg-opacity-20 ${color} bg-current pointer-events-none`}>
            <Icon size={18} className="text-current" />
          </div>
        </div>
        
        <div className="flex items-end gap-3 pointer-events-none">
          <div className="text-3xl font-black text-text-color tracking-tight font-mono select-none">
            <AnimatedNumber value={value} prefix={prefix} suffix={suffix} />
          </div>
          {badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${badge.bg} ${badge.text} border ${badge.border} mb-1 select-none pointer-events-none`}>
              {badge.label}
            </span>
          )}
        </div>

        <div className={`text-xs mt-3 font-medium ${subtextColor || 'text-text-muted'} pointer-events-none select-none`}>
          {subtext}
        </div>
      </div>

      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-20 transition-opacity ${color} bg-current pointer-events-none`} />
    </motion.div>
  )
}

const SortableKPICard = ({ id, cardProps }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.9 : 1,
    scale: isDragging ? 1.05 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-none h-full">
      <KPICard {...cardProps} />
    </div>
  )
}

export default function KPICards() {
  const [stats, setStats] = useState({ outOfStock: 14, lowStock: 29, totalValue: 8452310, activeOrders: 108 })
  const [cardOrder, setCardOrder] = useState(['totalValue', 'outOfStock', 'lowStock', 'activeOrders'])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('inventoryData_v2')
      if (saved) {
        const products = JSON.parse(saved)
        if (Array.isArray(products)) {
          let outStock = 0
          let lowStock = 0
          let totalVal = 0
          
          products.forEach(p => {
            if (p.status === 'Out Stock') outStock++
            if (p.status === 'Low Stock') lowStock++
            
            const price = typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0
            const stock = typeof p.stock === 'number' ? p.stock : parseInt(p.stock, 10) || 0
            totalVal += price * stock
          })
          
          setStats(prev => ({ ...prev, outOfStock: outStock, lowStock: lowStock, totalValue: totalVal }))
        }
      }

      // Load saved layout order
      const savedLayout = localStorage.getItem('kpi_layout_order')
      if (savedLayout) {
        setCardOrder(JSON.parse(savedLayout))
      }
    } catch (e) {
      console.error('Failed to parse KPI data', e)
    }
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setCardOrder((items) => {
        const oldIndex = items.indexOf(active.id)
        const newIndex = items.indexOf(over.id)
        const newOrder = arrayMove(items, oldIndex, newIndex)
        localStorage.setItem('kpi_layout_order', JSON.stringify(newOrder))
        return newOrder
      })
    }
  }

  const cardsData = {
    totalValue: {
      id: 'totalValue',
      title: "Total Stock Value", 
      value: stats.totalValue, 
      prefix: "$", 
      icon: TrendingUp, 
      color: "text-sap-blue",
      subtext: "▲ Real-time valuation",
      subtextColor: "text-emerald-500"
    },
    outOfStock: {
      id: 'outOfStock',
      title: "Out of Stock Alerts", 
      value: stats.outOfStock, 
      icon: AlertOctagon, 
      color: "text-red-500",
      badge: { bg: 'bg-red-100 dark:bg-red-950', text: 'text-red-600 dark:text-red-400', border: 'border-red-200 dark:border-red-800', label: 'Critical' },
      subtext: "Immediate action required"
    },
    lowStock: {
      id: 'lowStock',
      title: "Low Stock Warning", 
      value: stats.lowStock, 
      icon: AlertCircle, 
      color: "text-amber-500",
      badge: { bg: 'bg-amber-100 dark:bg-amber-950', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', label: 'Warning' },
      subtext: "Items nearing reorder point"
    },
    activeOrders: {
      id: 'activeOrders',
      title: "Active Orders", 
      value: stats.activeOrders, 
      icon: Package, 
      color: "text-emerald-500",
      subtext: "Pending fulfillment"
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={cardOrder} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr h-full">
          {cardOrder.map((id) => (
            <SortableKPICard key={id} id={id} cardProps={cardsData[id]} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
