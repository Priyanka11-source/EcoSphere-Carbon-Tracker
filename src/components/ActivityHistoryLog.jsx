/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Trash2, ArrowUpRight, ArrowDownRight, Sparkles, AlertCircle, Calendar } from "lucide-react";
export default function ActivityHistoryLog({ entries, onRemoveEntry }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const statsSummary = useMemo(() => {
    let directSum = 0;
    let reductionSum = 0;
    entries.forEach((entry) => {
      if (entry.isReduction) {
        reductionSum += entry.carbonImpact;
      } else {
        directSum += entry.carbonImpact;
      }
    });
    return {
      directSum,
      reductionSum,
      netValue: directSum - reductionSum
    };
  }, [entries]);
  const filteredEntries = useMemo(() => {
    let result = [...entries];
    if (selectedCategory !== "all") {
      result = result.filter((e) => e.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) => e.description.toLowerCase().includes(q) || e.unit.toLowerCase().includes(q)
      );
    }
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return b.id.localeCompare(a.id);
      }
      if (sortBy === "oldest") {
        return a.id.localeCompare(b.id);
      }
      if (sortBy === "impact-high") {
        return b.carbonImpact - a.carbonImpact;
      }
      if (sortBy === "impact-low") {
        return a.carbonImpact - b.carbonImpact;
      }
      return 0;
    });
    return result;
  }, [entries, selectedCategory, searchQuery, sortBy]);
  const getCategoryTheme = (cat) => {
    switch (cat) {
      case "transport":
        return { bg: "bg-rose-500/10 border-rose-500/30 text-rose-300", icon: "\u{1F6B2}", label: "Logistics/Transit" };
      case "food":
        return { bg: "bg-teal-500/10 border-teal-500/30 text-teal-300", icon: "\u{1F957}", label: "Dietary Choice" };
      case "energy":
        return { bg: "bg-amber-500/10 border-amber-500/30 text-amber-300", icon: "\u26A1", label: "Grid / Electric" };
      case "shopping":
        return { bg: "bg-[#9333ea]/15 border-[#c084fc]/30 text-[#d8b4fe]", icon: "\u{1F6CD}\uFE0F", label: "Garment / Commodity" };
    }
  };
  return <div id="activity-history-log" className="bg-gradient-to-br from-[#021c24] via-[#05111b] to-[#030610] rounded-3xl p-6 shadow-2xl border border-cyan-500/25 text-slate-100 flex flex-col justify-between h-full shadow-[0_0_35px_rgba(6,182,212,0.06)]">
      <div className="space-y-6">
        
        {
    /* Header containing animated subtitle */
  }
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-indigo-950 pb-4">
          <div>
            <h3 className="text-xl font-sans font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-spin-slow" /> Past Carbon Chronology
            </h3>
            <p className="text-xs text-slate-400">Deep structural history logs of all verified carbon actions</p>
          </div>

          {
    /* Quick interactive parameters counters */
  }
          <div className="flex gap-2">
            <div className="bg-[#070b14] border border-cyan-500/20 rounded-xl p-2 px-3 text-center">
              <span className="block text-[8px] font-mono text-cyan-400 uppercase tracking-widest">Aggregate Direct</span>
              <span className="font-mono text-sm font-bold text-rose-400">+{statsSummary.directSum.toFixed(1)} kg</span>
            </div>
            <div className="bg-[#070b14] border border-teal-500/20 rounded-xl p-2 px-3 text-center">
              <span className="block text-[8px] font-mono text-teal-400 uppercase tracking-widest">Aggregate Mitigated</span>
              <span className="font-mono text-sm font-bold text-teal-300">-{statsSummary.reductionSum.toFixed(1)} kg</span>
            </div>
          </div>
        </div>

        {
    /* Dynamic Filters Bar */
  }
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {
    /* Searching Field */
  }
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search history files..."
    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
  />
          </div>

          {
    /* Sorting Box */
  }
          <div className="relative">
            <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
  >
              <option value="newest">Sort: Chronological (Newest)</option>
              <option value="oldest">Sort: Chronological (Oldest)</option>
              <option value="impact-high">Sort: Carbon Impact (Highest)</option>
              <option value="impact-low">Sort: Carbon Impact (Lowest)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 text-xs">▼</div>
          </div>

          {
    /* Category Quick Filter Select */
  }
          <div className="relative">
            <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2 px-3 text-xs font-semibold text-slate-300 focus:outline-none focus:border-cyan-500 appearance-none cursor-pointer"
  >
              <option value="all">Filter: All Categories</option>
              <option value="transport">Filter: Transport / Commute</option>
              <option value="food">Filter: Dietary Choices</option>
              <option value="energy">Filter: Grid / Home Energy</option>
              <option value="shopping">Filter: Shopping & Garments</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 text-xs">▼</div>
          </div>
        </div>

        {
    /* Category Pills view */
  }
        <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-none scroll-smooth">
          {["all", "transport", "food", "energy", "shopping"].map((cat) => <button
    key={cat}
    onClick={() => setSelectedCategory(cat)}
    className={`py-1.5 px-3.5 rounded-lg text-[10px] font-mono tracking-widest uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${selectedCategory === cat ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-400" : "bg-[#070b14] hover:bg-[#121c2c] text-slate-400 border-slate-800"}`}
  >
              {cat === "all" ? "\u{1F310}" : getCategoryTheme(cat).icon}
              <span>{cat}</span>
            </button>)}
        </div>

        {
    /* Entries list with Animate Presence */
  }
        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          <AnimatePresence mode="popLayout">
            {filteredEntries.length === 0 ? <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="p-8 text-center bg-[#070b14] border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center space-y-2"
  >
                <AlertCircle className="w-8 h-8 text-slate-500" />
                <h4 className="text-sm font-bold text-slate-300">No Climate Logs Located</h4>
                <p className="text-slate-500 text-xs max-w-xs">Introduce entries to your daily carbon ledger to build dynamic files.</p>
              </motion.div> : filteredEntries.map((entry) => {
    const info = getCategoryTheme(entry.category);
    return <motion.div
      key={entry.id}
      id={`log-history-row-${entry.id}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className={`p-3.5 rounded-2xl border bg-[#070b14] border-slate-800 hover:border-indigo-500/40 flex items-center justify-between gap-4 transition-all`}
    >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {
      /* Interactive Visual Core */
    }
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner ${info.bg} border`}>
                        {info.icon}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-white truncate max-w-[190px]">
                            {entry.description}
                          </h4>
                          <span className="text-[9px] font-mono uppercase px-2 py-0.2 rounded-full bg-slate-800 text-slate-400">
                            {entry.value} {entry.unit}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Date: {entry.date} • Category: {info.label}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-right">
                        <span className={`text-[11px] font-mono font-extrabold flex items-center justify-end gap-0.5 ${entry.isReduction ? "text-teal-400" : "text-rose-400"}`}>
                          {entry.isReduction ? <>
                              <ArrowDownRight className="w-3.5 h-3.5 text-teal-400" />
                              -{entry.carbonImpact.toFixed(1)} kg CO2
                            </> : <>
                              <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
                              +{entry.carbonImpact.toFixed(1)} kg CO2
                            </>}
                        </span>
                        <span className="block text-[8px] uppercase tracking-wider text-slate-500 font-mono">
                          {entry.isReduction ? "Mitigated Offset" : "Direct Emission"}
                        </span>
                      </div>

                      {
      /* Deletion control */
    }
                      <button
      onClick={() => onRemoveEntry(entry.id)}
      id={`btn-remove-history-log-${entry.id}`}
      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 bg-slate-800/40 hover:bg-rose-500/10 transition-colors cursor-pointer"
      title="Delete record from memory bank"
    >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>;
  })}
          </AnimatePresence>
        </div>

      </div>
    </div>;
}
