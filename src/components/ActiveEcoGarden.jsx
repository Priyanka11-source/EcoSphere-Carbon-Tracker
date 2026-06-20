/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Sun, Leaf, Wind, Info, Trees, Zap } from "lucide-react";
export default function ActiveEcoGarden({ averageFootprint, totalCarbonSaved, ledgerEntries = [] }) {
  const [selectedFactElement, setSelectedFactElement] = useState(null);
  const [viewType, setViewType] = useState("dome");
  const isHealthy = averageFootprint < 8;
  const isModerate = averageFootprint >= 8 && averageFootprint < 18;
  const isPoor = averageFootprint >= 18;
  const ecoFacts = {
    canopy: {
      title: "Forest Canopy",
      desc: "One mature oak tree absorbs about 22kg of CO2 per year. Your offsets directly preserve ancient carbon-holding networks.",
      impact: "Preserving woodlands allows global soil carbon capture networks to remain intact.",
      icon: Leaf
    },
    sky: {
      title: "Atmospheric Winds",
      desc: "Vehicular commutes account for huge pollution volumes. Low-impact transit like biking clears local greenhouse gases.",
      impact: "Lowering passenger transport limits ozone and particulates in urban environments.",
      icon: Wind
    },
    soil: {
      title: "Mycelium Soil Base",
      desc: "Natural underground mycelium networks lock up immense quantities of carbon. Organic composting protects these soil webs.",
      impact: "Locally sourced nutrition reduces long-distance carbon transit logistics costs.",
      icon: Sun
    },
    turbines: {
      title: "Renewable Energy Grid",
      desc: "Diverting standard home appliances to renewable power resources mitigates up to 85% of domestic greenhouse factors.",
      impact: "Saves raw coal-burning exhaust gases from electric power sectors.",
      icon: Zap
    }
  };
  const relatableStats = useMemo(() => {
    const treesEquivalent = parseFloat((totalCarbonSaved / 22).toFixed(2));
    const powerHomeHours = parseFloat((totalCarbonSaved / 0.42).toFixed(1));
    const vehicleMilesSaved = parseFloat((totalCarbonSaved / 0.4).toFixed(1));
    return {
      treesEquivalent,
      powerHomeHours,
      vehicleMilesSaved
    };
  }, [totalCarbonSaved]);
  const IDEAL_THRESHOLD = 12;
  const DAILY_REDUCTION_GOAL = 5;
  const todayStr = useMemo(() => {
    return (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, []);
  const todayReductionsSum = useMemo(() => {
    return ledgerEntries.filter((entry) => entry.date === todayStr && entry.isReduction).reduce((sum, entry) => sum + entry.carbonImpact, 0);
  }, [ledgerEntries, todayStr]);
  const progressPercent = useMemo(() => {
    if (DAILY_REDUCTION_GOAL <= 0) return 0;
    return Math.min(100, Math.max(0, todayReductionsSum / DAILY_REDUCTION_GOAL * 100));
  }, [todayReductionsSum]);
  const remainingCapacity = useMemo(() => {
    return Math.max(0, parseFloat((IDEAL_THRESHOLD - averageFootprint).toFixed(1)));
  }, [averageFootprint]);
  const collectiveForestTrees = useMemo(() => {
    const rawCount = Math.max(2, Math.min(15, Math.ceil(totalCarbonSaved / 1.5)));
    const coordinates = [
      { x: 30, y: 140, scale: 0.8 },
      { x: 60, y: 150, scale: 1.1 },
      { x: 95, y: 135, scale: 0.95 },
      { x: 130, y: 155, scale: 1.25 },
      { x: 165, y: 145, scale: 1 },
      { x: 45, y: 125, scale: 0.75 },
      { x: 80, y: 120, scale: 0.85 },
      { x: 115, y: 125, scale: 0.9 },
      { x: 150, y: 130, scale: 0.8 },
      { x: 70, y: 105, scale: 0.65 },
      { x: 105, y: 110, scale: 0.7 },
      { x: 140, y: 105, scale: 0.65 },
      { x: 55, y: 95, scale: 0.55 },
      { x: 125, y: 95, scale: 0.55 },
      { x: 90, y: 90, scale: 0.5 }
    ];
    return coordinates.slice(0, rawCount);
  }, [totalCarbonSaved]);
  const themeStyles = {
    accentColor: isHealthy ? "#50fa7b" : isModerate ? "#ffb86c" : "#ff5555",
    backgroundGlow: isHealthy ? "rgba(80, 250, 123, 0.05)" : isModerate ? "rgba(255, 184, 108, 0.04)" : "rgba(255, 85, 85, 0.04)"
  };
  return <div id="active-eco-garden" className="relative transition-all duration-700 text-white flex flex-col justify-between h-full w-full">
      
      {
    /* Dynamic Background Glow representing the state of the dome */
  }
      <div
    className="absolute inset-0 pointer-events-none transition-all duration-1000 z-0"
    style={{
      background: `radial-gradient(circle at 50% 25%, ${themeStyles.backgroundGlow} 0%, transparent 70%)`
    }}
  />

      {
    /* Touch-safe View Swapper using glassmorphism + playmorphic buttons */
  }
      <div className="absolute top-4 right-4 z-20 flex bg-[#1e1f29] border border-white/5 rounded-2xl p-1 shadow-inner">
        <button
    onClick={() => setViewType("dome")}
    id="btn-toggle-viewtype-dome"
    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono tracking-widest cursor-pointer flex items-center gap-1.5 transition-all duration-300 ${viewType === "dome" ? "bg-[#bd93f9] text-[#1e1f29] font-bold shadow-md clay-puffy" : "text-[#6272a4] hover:text-white"}`}
  >
          <Leaf className="w-3.5 h-3.5" /> DOME
        </button>
        <button
    onClick={() => setViewType("forest")}
    id="btn-toggle-viewtype-forest"
    className={`px-3 py-1.5 rounded-xl text-[10px] font-mono tracking-widest cursor-pointer flex items-center gap-1.5 transition-all duration-300 ${viewType === "forest" ? "bg-[#bd93f9] text-[#1e1f29] font-bold shadow-md clay-puffy" : "text-[#6272a4] hover:text-white"}`}
  >
          <Trees className="w-3.5 h-3.5" /> FOREST
        </button>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
        
        {
    /* Left Visual Screen */
  }
        <div id="garden-visualizer" className="w-full md:w-1/2 flex flex-col items-center">
          <div className="mb-4 text-center space-y-1">
            <span className="text-[9px] font-mono tracking-widest uppercase bg-[#1e1f29] text-[#bd93f9] border border-[#bd93f9]/30 px-3 py-1 rounded-full shadow-inner font-bold">
              {viewType === "dome" ? "LIVING ATMOSPHERE" : "CARBON CO2 SINK"}
            </span>
            <h3 className="text-xl font-display font-medium tracking-tight text-white mt-1 animate-fade-in">
              {viewType === "dome" ? isHealthy ? "\u{1F331} Flourishing Sanctuary" : isModerate ? "\u{1F342} Unbalanced Dome" : "\u26A0\uFE0F Endangered Eco-Dome" : "\u{1F332} Shared Offset Forest"}
            </h3>
            <p className="text-[10px] text-[#6272a4] font-mono">
              {viewType === "dome" ? `System Index: ${averageFootprint.toFixed(1)} kg CO2e / day` : `Communal forest growing with saved offsets`}
            </p>
          </div>

          {
    /* Liquid Glass Interactive Core Area */
  }
          <div className="w-full max-w-[300px] aspect-square relative flex items-center justify-center p-4 rounded-3xl bg-black/40 backdrop-blur shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-[#bd93f9]/15">
            
            {
    /* Ambient Orbital Rings */
  }
            <div className="absolute inset-4 rounded-full border border-[#bd93f9]/5 animate-spin-slow pointer-events-none" />

            <AnimatePresence mode="wait">
              {viewType === "dome" ? <motion.div
    key="dome-interactive-view"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="w-full h-full relative"
  >
                  {
    /* Sunny Node representing carbon warmth index */
  }
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none">
                    <motion.div
    animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.3, 0.6, 0.3] }}
    transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
    className="text-[#bd93f9]/30"
  >
                      <div className="w-14 h-14 rounded-full bg-[#bd93f9]/10 blur-xl" />
                    </motion.div>
                  </div>

                  {
    /* SVG dome structure */
  }
                  <svg viewBox="0 0 200 200" className="w-full h-full cursor-pointer overflow-visible">
                    
                    {
    /* Native high-fidelity glow filters */
  }
                    <defs>
                      <filter id="glow-heavy" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <filter id="glow-soft" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    
                    {
    /* Semi-translucent glass circle dome with elegant soft glow */
  }
                    <circle
    cx="100"
    cy="100"
    r="85"
    fill="none"
    stroke={themeStyles.accentColor}
    strokeWidth="1.5"
    strokeDasharray="6 4"
    className="opacity-70 transition-all duration-700"
    filter="url(#glow-soft)"
  />

                    {
    /* Wind Turbines */
  }
                    <g onClick={() => setSelectedFactElement("turbines")} className="cursor-pointer group">
                      <line x1="45" y1="110" x2="45" y2="70" stroke={themeStyles.accentColor} strokeWidth="1.2" className="opacity-60" />
                      <motion.g
    animate={{ rotate: isHealthy ? 360 : 120 }}
    transition={{ repeat: Infinity, duration: isHealthy ? 2.5 : 8, ease: "linear" }}
    style={{ transformOrigin: "45px 70px" }}
  >
                        <line x1="45" y1="70" x2="45" y2="55" stroke="currentColor" className="text-[#bd93f9] stroke-[1.5]" />
                        <line x1="45" y1="70" x2="33" y2="78" stroke="currentColor" className="text-[#bd93f9] stroke-[1.2]" />
                        <line x1="45" y1="70" x2="57" y2="78" stroke="currentColor" className="text-[#bd93f9] stroke-[1.2]" />
                      </motion.g>

                      <line x1="155" y1="120" x2="155" y2="85" stroke={themeStyles.accentColor} strokeWidth="1.2" className="opacity-60" />
                      <motion.g
    animate={{ rotate: isHealthy ? 360 : 180 }}
    transition={{ repeat: Infinity, duration: isHealthy ? 3.5 : 10, ease: "linear" }}
    style={{ transformOrigin: "155px 85px" }}
  >
                        <line x1="155" y1="85" x2="155" y2="72" stroke="currentColor" className="text-[#8be9fd] stroke-[1.2]" />
                        <line x1="155" y1="85" x2="144" y2="92" stroke="currentColor" className="text-[#8be9fd] stroke-[1]" />
                        <line x1="155" y1="85" x2="166" y2="92" stroke="currentColor" className="text-[#8be9fd] stroke-[1]" />
                      </motion.g>
                    </g>

                    {
    /* Ground Layer */
  }
                    <path
    d="M 15,100 C 50,115 150,115 185,100 C 180,140 140,180 100,180 C 60,180 20,140 15,100 Z"
    fill={isHealthy ? "#241d2f" : isModerate ? "#2b211d" : "#281b1b"}
    stroke={themeStyles.accentColor}
    strokeWidth="1.5"
    strokeOpacity="0.7"
    className="transition-colors duration-1000 cursor-pointer"
    onClick={() => setSelectedFactElement("soil")}
  />

                    {
    /* Tree trunk */
  }
                    <path
    d="M 95,115 L 97,80 L 103,80 L 105,115 Z"
    fill="#44475a"
    onClick={() => setSelectedFactElement("canopy")}
    className="cursor-pointer"
  />

                    {
    /* Sprout canopy leaves with rich atmospheric glows */
  }
                    <g onClick={() => setSelectedFactElement("canopy")} className="cursor-pointer">
                      <circle cx="86" cy="74" r={isHealthy ? 20 : isModerate ? 15 : 9} fill="#bd93f9" opacity="0.65" filter="url(#glow-soft)" />
                      <circle cx="114" cy="74" r={isHealthy ? 20 : isModerate ? 15 : 9} fill="#8be9fd" opacity="0.65" filter="url(#glow-soft)" />
                      <circle cx="100" cy="58" r={isHealthy ? 25 : isModerate ? 18 : 11} fill="#ff79c6" opacity="0.92" filter="url(#glow-heavy)" />
                      
                      {isHealthy && <>
                          <circle cx="88" cy="62" r="2.5" fill="#50fa7b" className="animate-pulse" />
                          <circle cx="112" cy="62" r="2.5" fill="#8be9fd" className="animate-pulse" />
                          <circle cx="100" cy="46" r="2.5" fill="#bd93f9" className="animate-pulse" />
                        </>}
                    </g>

                    {
    /* Ambient sparkler vectors */
  }
                    <g className="pointer-events-none">
                      <circle cx="100" cy="58" r="5" fill="#bd93f9" opacity="0.4">
                        <animate attributeName="r" values="3;6;3" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="100" cy="58" r="1.5" fill="#ffffff" />

                      <circle cx="100" cy="155" r="4" fill="#50fa7b" opacity="0.3">
                        <animate attributeName="r" values="2.5;5;2.5" dur="3s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="100" cy="155" r="1" fill="#ffffff" />
                    </g>
                  </svg>
                </motion.div> : <motion.div
    key="forest-collective-view"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="w-full h-full relative"
  >
                  <div className="absolute top-3 left-3 text-[9px] font-mono text-[#50fa7b] font-bold bg-[#1e1f29]/90 px-2.5 py-0.5 rounded-lg border border-[#bd93f9]/20 shadow-inner">
                    🌲 Comm_Woods Grid
                  </div>

                  {
    /* Micro particles */
  }
                  <div className="absolute inset-0 pointer-events-none">
                    <motion.div
    animate={{ y: [0, -35, 0], opacity: [0.3, 0.8, 0.3] }}
    transition={{ duration: 4, repeat: Infinity }}
    className="absolute bottom-16 left-16 w-1.5 h-1.5 bg-[#50fa7b] rounded-full blur-[0.5px]"
  />
                    <motion.div
    animate={{ y: [0, -50, 0], opacity: [0.2, 0.7, 0.2] }}
    transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
    className="absolute bottom-24 right-16 w-1.5 h-1.5 bg-[#8be9fd] rounded-full"
  />
                  </div>

                  <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
                    <rect x="0" y="0" width="200" height="200" fill="#1e1f29" />
                    
                    {
    /* Stars */
  }
                    <circle cx="40" cy="30" r="0.5" fill="#ffffff" opacity="0.4" />
                    <circle cx="160" cy="40" r="0.8" fill="#ffffff" opacity="0.6" />
                    <circle cx="95" cy="20" r="0.5" fill="#ffffff" opacity="0.3" />

                    {
    /* Soft moss soil horizon */
  }
                    <path d="M 0,140 C 50,150 150,132 200,142 L 200,200 L 0,200 Z" fill="#282a36" stroke="#44475a" strokeWidth="1" />

                    {
    /* Trees */
  }
                    {collectiveForestTrees.map((tree, i) => <motion.g
    key={i}
    transform={`translate(${tree.x}, ${tree.y}) scale(${tree.scale})`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.05, duration: 0.35 }}
    className="cursor-pointer"
  >
                        <rect x="-1" y="0" width="2" height="15" fill="#6272a4" />
                        <circle cx="0" cy="-7" r="8" fill="#bd93f9" opacity="0.8" />
                        <circle cx="-4" cy="-3" r="6" fill="#50fa7b" opacity="0.85" />
                        <circle cx="4" cy="-3" r="6" fill="#8be9fd" opacity="0.8" />
                      </motion.g>)}
                  </svg>
                </motion.div>}
            </AnimatePresence>

            <div className="absolute bottom-2.5 text-[8.5px] font-mono text-[#bd93f9] flex items-center gap-1 bg-black/85 px-3 py-1 rounded-full border border-[#bd93f9]/25">
              {viewType === "dome" ? "Click sections (soil, canopy, winds) for insights" : "The forest updates based on cumulative offsets!"}
            </div>
          </div>
        </div>

        {
    /* Right Conversion Stat Cards inside beautiful glass sections */
  }
        <div id="garden-metrics-panel" className="w-full md:w-1/2 space-y-4">
          
          {
    /* Circular Progress & Daily Capacity Tracker Card */
  }
          <div className="bg-[#1e1f29]/80 border-2 border-[#bd93f9]/35 rounded-2xl p-4.5 shadow-[0_12px_24px_rgba(0,0,0,0.55),0_0_15px_rgba(189,147,249,0.1)] flex items-center justify-between gap-4 transition-all hover:border-[#bd93f9]/65" id="daily-reduction-tracker-card">
            {
    /* Left side text info */
  }
            <div className="text-left space-y-1">
              <span className="text-[8.5px] font-mono uppercase tracking-widest bg-[#282a36] text-[#50fa7b] border border-[#50fa7b]/40 px-2 py-0.5 rounded-full font-bold">
                Capacity Monitor
              </span>
              <h4 className="text-sm font-bold text-white mt-1">Daily Reduction Target</h4>
              <p className="text-[10px] text-slate-400 leading-normal">
                Keeping the dome index below <strong className="text-white text-[10.5px] font-mono">{IDEAL_THRESHOLD}kg</strong> and offset <strong className="text-[#50fa7b] text-[10.5px] font-mono">{DAILY_REDUCTION_GOAL}kg</strong> today.
              </p>
              
              <div className="pt-2 border-t border-white/5 mt-1.5 flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${remainingCapacity > 0 ? "bg-[#8be9fd] animate-pulse" : "bg-[#ff5555]"}`} />
                <span className="text-[10px] text-slate-300 font-mono">
                  Remaining Emissions Cap: <strong className={remainingCapacity > 0 ? "text-[#8be9fd] font-bold" : "text-[#ff5555] font-bold"}>{remainingCapacity.toFixed(1)} kg</strong>
                </span>
              </div>
            </div>

            {
    /* Circular Progress SVG on the Right */
  }
            <div className="relative flex-shrink-0 flex items-center justify-center w-24 h-24" id="circular-progress-svg-wrapper">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {
    /* Background circle */
  }
                <circle
    cx="50"
    cy="50"
    r="38"
    className="stroke-[#282a36]"
    strokeWidth="8"
    fill="transparent"
  />
                {
    /* Animated progress circle */
  }
                <circle
    cx="50"
    cy="50"
    r="38"
    stroke={progressPercent >= 100 ? "#50fa7b" : "#bd93f9"}
    strokeWidth="8"
    fill="transparent"
    strokeDasharray="238.76"
    strokeDashoffset={238.76 - progressPercent / 100 * 238.76}
    strokeLinecap="round"
    style={{
      transition: "stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
      filter: `drop-shadow(0 0 4px ${progressPercent >= 100 ? "#50fa7b" : "#bd93f9"})`
    }}
  />
              </svg>
              {
    /* Centered text */
  }
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[13px] font-mono font-bold text-white leading-none">
                  {Math.round(progressPercent)}%
                </span>
                <span className="text-[7px] uppercase text-[#6272a4] tracking-widest leading-none mt-1 font-bold">
                  {todayReductionsSum.toFixed(1)} kg saved
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1e1f29]/60 rounded-2xl p-4 border border-white/5 space-y-3.5 shadow-inner">
            <h4 className="text-[10px] font-mono text-[#50fa7b] tracking-widest uppercase py-1.5 px-3 bg-black/50 rounded-xl border border-white/5 flex items-center gap-1.5 font-bold">
              <Sparkles className="w-4 h-4 text-[#bd93f9]" /> carbon comparisons
            </h4>
            
            <div className="grid grid-cols-1 gap-2.5">
              <div className="bg-black/45 rounded-2xl p-3 border border-white/5 flex items-center gap-3.5 hover:border-[#50fa7b]/20 transition-all duration-300">
                <span className="text-xl">🌿</span>
                <div className="text-left">
                  <span className="block text-[8px] font-mono text-[#6272a4] uppercase tracking-widest">Yearly Sequestration</span>
                  <span className="font-mono font-bold text-xs text-[#50fa7b]">
                    {relatableStats.treesEquivalent} Mature Oak Equivalent
                  </span>
                  <p className="text-[9.5px] text-[#6272a4] leading-normal mt-0.5">communal forest woodlands offsets throughout the year</p>
                </div>
              </div>

              <div className="bg-black/45 rounded-2xl p-3 border border-white/5 flex items-center gap-3.5 hover:border-[#ffb86c]/20 transition-all duration-300">
                <span className="text-xl">☀️</span>
                <div className="text-left">
                  <span className="block text-[8px] font-mono text-[#6272a4] uppercase tracking-widest">Renewable Solar Work</span>
                  <span className="font-mono font-bold text-xs text-[#ffb86c]">
                    {relatableStats.powerHomeHours} domestic grid hours saved
                  </span>
                  <p className="text-[9.5px] text-[#6272a4] leading-normal mt-0.5">fully zero-emission backup solar generation</p>
                </div>
              </div>

              <div className="bg-black/45 rounded-2xl p-3 border border-white/5 flex items-center gap-3.5 hover:border-[#8be9fd]/20 transition-all duration-300">
                <span className="text-xl">🚴</span>
                <div className="text-left">
                  <span className="block text-[8px] font-mono text-[#6272a4] uppercase tracking-widest">Avoided Fuel Exhaust</span>
                  <span className="font-mono font-bold text-xs text-[#8be9fd]">
                    {relatableStats.vehicleMilesSaved} commute miles cleaned
                  </span>
                  <p className="text-[9.5px] text-[#6272a4] leading-normal mt-0.5">relieving high-congestion highway emissions</p>
                </div>
              </div>
            </div>
          </div>

          {
    /* Interactive Fact Sheet Panel */
  }
          <div className="relative text-left min-h-[110px]">
            <AnimatePresence mode="wait">
              {selectedFactElement ? <motion.div
    key={selectedFactElement}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    id={`fact-${selectedFactElement}`}
    className="bg-[#bd93f9]/5 text-[#f8f8f2] rounded-2xl p-4.5 space-y-2 border border-[#bd93f9]/20 shadow-md relative"
  >
                  <button
    onClick={() => setSelectedFactElement(null)}
    className="absolute top-2.5 right-2.5 text-[#6272a4] hover:text-[#ff5555] font-mono text-xs p-1 font-bold cursor-pointer"
  >
                    ✕
                  </button>
                  <div className="flex items-center gap-2">
                    {React.createElement(ecoFacts[selectedFactElement].icon, { className: "w-4 h-4 text-[#bd93f9]" })}
                    <span className="font-sans font-bold text-xs uppercase tracking-wider text-[#bd93f9]">
                      {ecoFacts[selectedFactElement].title}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[#f8f8f2]/80">
                    {ecoFacts[selectedFactElement].desc}
                  </p>
                  <div className="pt-2 border-t border-white/5 flex gap-2 items-start text-[10px] text-[#50fa7b] italic">
                    <Info className="w-3.5 h-3.5 flex-shrink-0 text-[#50fa7b] mt-0.5" />
                    <span>{ecoFacts[selectedFactElement].impact}</span>
                  </div>
                </motion.div> : <motion.div
    key="default-fact"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="bg-black/25 border border-dashed border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center py-5"
  >
                  <div className="w-8 h-8 rounded-full bg-[#1e1f29]/80 text-[#bd93f9] flex items-center justify-center mb-1.5 border border-[#bd93f9]/25">
                    <Leaf className="w-4 h-4" />
                  </div>
                  <h5 className="font-display font-medium text-xs text-slate-300 uppercase tracking-widest">Dome Sim Active</h5>
                  <p className="text-[10px] text-[#6272a4] mt-1 max-w-[250px] leading-relaxed">
                    Carbon actions dynamically shape the ecosystem. Click the dome sectors above to view sub-atomic stats.
                  </p>
                </motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>;
}
