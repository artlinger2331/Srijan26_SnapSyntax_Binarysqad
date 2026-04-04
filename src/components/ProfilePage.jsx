import React from 'react'
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { User, Shield, Activity, Settings, Mail, Phone, MapPin, Globe, CreditCard, Bell, LogOut, ChevronRight, CheckCircle2 } from 'lucide-react'

const ProfileStat = ({ label, value, icon: Icon, color }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-surface-color dark:bg-dark-surface p-4 rounded-2xl border border-border-color dark:border-white/5 flex items-center gap-4 shadow-sm transition-all"
  >
    <div className={`p-3 rounded-xl ${color} bg-opacity-10 dark:bg-opacity-20`}>
      <Icon size={20} className={color.replace('bg-', 'text-')} />
    </div>
    <div>
      <div className="text-[11px] font-bold text-text-muted uppercase tracking-widest">{label}</div>
      <div className="text-xl font-black text-text-color mt-0.5">{value}</div>
    </div>
  </motion.div>
)

const SettingRow = ({ label, value, icon: Icon, toggle }) => (
  <motion.div 
    whileHover={{ backgroundColor: "rgba(34, 197, 94, 0.03)" }}
    className="flex items-center justify-between p-4 rounded-xl cursor-pointer group transition-colors border border-transparent hover:border-border-color dark:hover:border-white/5"
  >
    <div className="flex items-center gap-4">
      <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-text-muted group-hover:text-sap-blue transition-colors">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-[14px] font-bold text-text-color">{label}</div>
        <div className="text-[12px] text-text-muted">{value}</div>
      </div>
    </div>
    {toggle ? (
      <div className="w-10 h-5 bg-sap-blue rounded-full relative p-1 shadow-inner shadow-blue-900/20">
        <div className="absolute right-1 w-3 h-3 bg-white rounded-full shadow-sm" />
      </div>
    ) : (
      <ChevronRight size={18} className="text-text-muted group-hover:translate-x-1 transition-transform" />
    )}
  </motion.div>
)

export default function ProfilePage() {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-5 md:p-6 lg:p-10 flex flex-col gap-8 scroll-smooth bg-slate-50/10 dark:bg-transparent">
      
      {/* 🚀 Header & Interactive Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <motion.div 
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            x.set((e.clientX - rect.left) / rect.width - 0.5)
            y.set((e.clientY - rect.top) / rect.height - 0.5)
          }}
          onMouseLeave={() => { x.set(0); y.set(0) }}
          style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
          className="lg:col-span-1 bg-surface-color dark:bg-[#0f172a] rounded-[32px] p-8 border border-border-color dark:border-white/10 shadow-2xl relative overflow-hidden group"
        >
          {/* Animated Background Aura */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sap-blue/10 rounded-full blur-[80px] -mr-32 -mt-32 animate-pulse" />
          
          <div style={{ transform: "translateZ(40px)" }} className="relative z-10 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full ring-4 ring-sap-blue/20 p-1.5 shadow-2xl shadow-blue-500/20">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-sap-blue to-indigo-600 flex items-center justify-center text-white text-4xl font-black italic shadow-inner">
                  JD
                </div>
              </div>
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 border-4 border-white dark:border-[#0f172a] rounded-full flex items-center justify-center">
                <CheckCircle2 size={16} className="text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-text-color tracking-tight">John Doe</h2>
            <p className="text-sap-blue font-bold text-[13px] uppercase tracking-widest mt-1">Senior System Architect</p>
            
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border-color dark:border-white/5">
                <div className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Access Lvl</div>
                <div className="font-mono font-black text-text-color mt-1">Lvl 4 Admin</div>
              </div>
              <div className="text-center p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-border-color dark:border-white/5">
                <div className="text-[11px] font-bold text-text-muted uppercase tracking-widest">Uptime</div>
                <div className="font-mono font-black text-text-color mt-1">99.8%</div>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-8 w-full py-3.5 bg-sap-blue text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40 transition-all text-[14px]"
            >
              <LogOut size={18} /> Sign Out Session
            </motion.button>
          </div>
        </motion.div>

        {/* 📊 Metrics & Profile Body */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProfileStat label="Actions Performed" value="1,240" icon={Activity} color="bg-blue-500" />
            <ProfileStat label="Security Alerts" value="0" icon={Shield} color="bg-emerald-500" />
            <ProfileStat label="System Access" value="24d 12h" icon={User} color="bg-amber-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface-color dark:bg-dark-surface p-6 rounded-3xl border border-border-color dark:border-white/5 shadow-xl shadow-black/5"
            >
              <h3 className="text-[15px] font-black text-text-color mb-6 flex items-center gap-2 uppercase tracking-wide">
                <div className="w-1 h-4 bg-sap-blue rounded-full" />
                Personal Information
              </h3>
              <div className="flex flex-col gap-2">
                <SettingRow label="Email Address" value="john.doe@smartinventory.com" icon={Mail} />
                <SettingRow label="Mobile Phone" value="+1 (555) 0123-4567" icon={Phone} />
                <SettingRow label="Home Office" value="Seattle, WA, HQ-01" icon={MapPin} />
                <SettingRow label="Regional Locale" value="North America (PST)" icon={Globe} />
              </div>
            </motion.div>

            {/* Account Settings */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface-color dark:bg-dark-surface p-6 rounded-3xl border border-border-color dark:border-white/5 shadow-xl shadow-black/5"
            >
              <h3 className="text-[15px] font-black text-text-color mb-6 flex items-center gap-2 uppercase tracking-wide">
                <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                Account & Security
              </h3>
              <div className="flex flex-col gap-2">
                <SettingRow label="2-Factor Auth" value="Enabled (Authenticator)" icon={Shield} toggle />
                <SettingRow label="Notification Pref" value="Global Desktop Alerts" icon={Bell} toggle />
                <SettingRow label="Login History" value="View recent activity" icon={Settings} />
                <SettingRow label="Billing & Plan" value="Enterprise Corporate" icon={CreditCard} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 🧩 Recent Activity Log */}
      <div className="bg-surface-color dark:bg-dark-surface rounded-3xl border border-border-color dark:border-white/5 p-8 shadow-xl shadow-black/5">
        <h3 className="text-[17px] font-black text-text-color mb-8 flex items-center gap-3">
          Recent Security Activity
          <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest">Session Secure</span>
        </h3>
        
        <div className="space-y-6">
          {[
            { action: 'Database backup synchronized', time: '12 minutes ago', status: 'Success' },
            { action: 'Critical inventory threshold updated', time: '2 hours ago', status: 'Success' },
            { action: 'New supplier "Global Forge Corp" onboarded', time: 'Yesterday at 4:30 PM', status: 'Success' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between pb-6 border-b border-border-color dark:border-white/5 last:border-0 last:pb-0 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-text-muted group-hover:bg-sap-blue/10 group-hover:text-sap-blue transition-all">
                  <Activity size={18} />
                </div>
                <div>
                  <div className="text-[14px] font-bold text-text-color">{item.action}</div>
                  <div className="text-[12px] text-text-muted mt-0.5">{item.time}</div>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
