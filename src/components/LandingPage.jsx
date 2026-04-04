import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Box, Activity, ShieldCheck, Zap, Globe, Network, Cpu } from 'lucide-react';

// Highly advanced animated ring component representing the "data core"
const OrbitalRing = ({ size, delay, duration, reverse, color, borderStyle }) => (
  <motion.div
    animate={{ rotateX: [60, 60], rotateY: [0, reverse ? -360 : 360] }}
    transition={{ duration, repeat: Infinity, ease: "linear", delay }}
    style={{ 
      width: size, 
      height: size, 
      position: 'absolute', 
      top: '50%', 
      left: '50%',
      marginTop: -size/2,
      marginLeft: -size/2,
      transformStyle: 'preserve-3d',
    }}
    className={`rounded-full border ${borderStyle} ${color}`}
  />
);

const FloatingWidget = ({ delay, icon: Icon, title, value, className, xOffset = -5, glowColor }) => {
  const getGlowClasses = (color) => {
    switch(color) {
      case 'emerald': return 'bg-emerald-500/20 group-hover:bg-emerald-500/40 text-emerald-400';
      case 'cyan': return 'bg-cyan-500/20 group-hover:bg-cyan-500/40 text-cyan-400';
      case 'indigo': return 'bg-indigo-500/20 group-hover:bg-indigo-500/40 text-indigo-400';
      default: return 'bg-blue-500/20 group-hover:bg-blue-500/40 text-blue-400';
    }
  };

  const colors = getGlowClasses(glowColor);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: xOffset, scale: 1.05 }}
      className={`absolute bg-slate-900/40 backdrop-blur-2xl p-4 rounded-xl flex items-center gap-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 ${className}`}
    >
      <div className={`p-2.5 rounded-lg bg-gradient-to-br from-white/10 to-transparent border border-white/10 shadow-inner relative overflow-hidden group`}>
        <div className={`absolute inset-0 blur-md transition-colors ${colors.split(' ')[0]} ${colors.split(' ')[1]}`}></div>
        <Icon className={`relative z-10 drop-shadow-[0_0_12px_currentColor] ${colors.split(' ')[2]}`} size={20} />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold mb-0.5">{title}</p>
        <p className="text-sm font-bold text-slate-100">{value}</p>
      </div>
    </motion.div>
  );
};

const LandingPage = ({ onEnterDashboard }) => {
  return (
    <div className="min-h-screen bg-[#020308] text-slate-100 font-sans relative overflow-hidden selection:bg-sap-blue selection:text-white flex flex-col">
      
      {/* 🌌 WONDER OF GOD BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" style={{ perspective: '1000px' }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0a1128_0%,#020308_100%)]"></div>
        
        {/* Tilting 3D Grid Floor */}
        <motion.div 
          animate={{ rotateX: [60, 60], y: [0, 50] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: 'top' }}
          className="absolute inset-[-100%] top-[40%] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,#000_50%,transparent_100%)]"
        />

        {/* Ethereal Glow Orbs */}
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-emerald-500/10 blur-[150px] rounded-full mix-blend-screen" 
        />
        <motion.div 
          animate={{ opacity: [0.1, 0.15, 0.1], scale: [1.2, 1, 1.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-1/4 w-[1000px] h-[1000px] bg-blue-600/10 blur-[180px] rounded-full mix-blend-screen" 
        />
      </div>

      {/* TOP NAVIGATION */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="container mx-auto px-6 py-8 flex justify-between items-center z-50 relative"
      >
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-sap-blue blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
            <div className="relative bg-sap-blue text-white p-1.5 px-2.5 rounded-lg text-xs font-black tracking-tighter border border-white/20">SAP</div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            Smart <span className="text-slate-400 font-medium">Inventory</span>
          </span>
        </div>
        
        <div className="hidden md:flex gap-10 text-[13px] font-semibold text-slate-400 tracking-wide uppercase">
          <a href="#" className="hover:text-white transition-colors flex items-center gap-2 relative group">
            <Globe size={14}/> Platform
            <div className="absolute -bottom-2 left-0 w-0 h-[2px] bg-sap-blue transition-all group-hover:w-full"></div>
          </a>
          <a href="#" className="hover:text-white transition-colors flex items-center gap-2 relative group">
            <Network size={14}/> Systems
            <div className="absolute -bottom-2 left-0 w-0 h-[2px] bg-sap-blue transition-all group-hover:w-full"></div>
          </a>
          <a href="#" className="hover:text-white transition-colors flex items-center gap-2 relative group">
            <ShieldCheck size={14}/> Enterprise
            <div className="absolute -bottom-2 left-0 w-0 h-[2px] bg-sap-blue transition-all group-hover:w-full"></div>
          </a>
        </div>

        <button
          onClick={onEnterDashboard}
          className="relative inline-flex h-10 overflow-hidden rounded-xl p-[1px] focus:outline-none group"
        >
          <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#22c55e_50%,transparent_100%)] opacity-50 group-hover:opacity-100 transition-opacity" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-[#0a0f1c] px-6 text-[13px] font-bold text-white backdrop-blur-3xl hover:bg-[#111827] transition-colors gap-2">
            Initialize <Zap size={14} className="text-sap-blue" />
          </span>
        </button>
      </motion.nav>

      {/* MAIN HERO */}
      <main className="container mx-auto px-6 flex-1 flex flex-col items-center justify-center z-10 relative">
        
        {/* The God Core (Background/Centerpiece) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center pointer-events-none opacity-40 mix-blend-screen scale-150 lg:scale-100">
           {/* Complex Orbital System */}
           <div className="relative w-[800px] h-[800px]" style={{ perspective: '1200px' }}>
              <OrbitalRing size={800} duration={40} borderStyle="border-white/5 border-dashed" color="" />
              <OrbitalRing size={650} duration={25} borderStyle="border-emerald-500/10" color="" reverse />
              <OrbitalRing size={500} duration={15} borderStyle="border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)_inset]" color="" />
              <OrbitalRing size={350} duration={10} borderStyle="border-white/20 border-dotted" color="" reverse />
              
              {/* Inner Pulsing Star */}
              <motion.div 
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full blur-[60px]"
              />
           </div>
        </div>

        {/* Foreground Content */}
        <div className="relative z-20 flex flex-col items-center text-center max-w-5xl">
          
          {/* Status Chip */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-[#0a0f1c]/80 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 tracking-[0.2em] uppercase mb-10 shadow-[0_0_30px_rgba(16,185,129,0.15)] backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Neural Telemetry Active • T-Minus 0
          </motion.div>

          {/* Hyper-Modern God-Tier Typography */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-[100px] font-black tracking-tight leading-[0.95] mb-8"
          >
            Supply Chain <br/>
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-400 to-sap-blue drop-shadow-[0_0_40px_rgba(34,197,94,0.3)]">
              Perfected.
              {/* Fake Glitch Overlay */}
              <motion.span 
                animate={{ opacity: [0, 0.5, 0], x: [-2, 2, 0] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 5 }}
                className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-transparent translate-x-[2px] mix-blend-screen pointer-events-none"
              >
                Perfected.
              </motion.span>
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.6 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed font-light mb-12"
          >
            Enter the pinnacle of structural inventory intelligence. Unprecedented SAP integration, sub-millisecond precision, and an interface forged for the modern enterprise.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.8, type: "spring" }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <button
              onClick={onEnterDashboard}
              className="relative group bg-white text-slate-950 flex items-center justify-center gap-3 px-10 py-5 rounded-2xl font-black text-[15px] transition-all hover:bg-slate-100 hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
              Engage Subsystem <ArrowRight size={20} className="text-sap-blue group-hover:translate-x-2 transition-transform" />
            </button>
            <button className="bg-[#0a0f1c]/50 border border-white/10 backdrop-blur-md flex items-center justify-center gap-3 text-white px-10 py-5 rounded-2xl font-bold text-[15px] hover:bg-white/5 hover:border-white/30 transition-all shadow-[0_0_30px_rgba(0,0,0,0.5)]">
               Architectural Overview
            </button>
          </motion.div>
        </div>

        {/* 3D Glass Data Fragments (Floating around the orb) */}
        <div className="absolute inset-0 pointer-events-none">
          <FloatingWidget 
            delay={1.5} icon={Cpu} title="Processing" value="Quantum Grid" glowColor="blue"
            className="top-[15%] left-[5%] lg:left-[15%]" xOffset={10}
          />
          <FloatingWidget 
            delay={1.7} icon={Activity} title="Sync Rate" value="0.4 ms / TPS" glowColor="emerald"
            className="top-[25%] right-[5%] lg:right-[15%]" xOffset={-10}
          />
          <FloatingWidget 
            delay={1.9} icon={Box} title="Global Nodes" value="14,204 ONLINE" glowColor="cyan"
            className="bottom-[25%] left-[10%] lg:left-[20%]" xOffset={10}
          />
          <FloatingWidget 
            delay={2.1} icon={ShieldCheck} title="Protocol" value="SOC2 / AES-256" glowColor="indigo"
            className="bottom-[15%] right-[10%] lg:right-[20%]" xOffset={-10}
          />
        </div>

      </main>

      {/* EXPERIMENTAL BOTTOM DOCK ILLUSION */}
      <div className="absolute bottom-0 w-full h-[150px] pointer-events-none overflow-hidden flex justify-center items-end" style={{ perspective: '500px' }}>
         <motion.div 
            initial={{ rotateX: 60, y: 100, opacity: 0 }}
            animate={{ rotateX: 60, y: 0, opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="w-[80%] h-[200px] border-t border-x border-sap-blue/30 rounded-t-full bg-gradient-to-b from-sap-blue/10 to-transparent shadow-[0_-20px_60px_rgba(34,197,94,0.15)]"
         >
           {/* Scanning laser line */}
           <motion.div 
             animate={{ y: [0, 200, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="w-full h-[1px] bg-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.8)]"
           />
         </motion.div>
      </div>

    </div>
  );
};

export default LandingPage;
