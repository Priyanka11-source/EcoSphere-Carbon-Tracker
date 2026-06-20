/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { TrendingUp, Sparkles } from "lucide-react";
export default function WeeklyTrendChart({ ledgerEntries }) {
  const [viewMode, setViewMode] = useState("co2");
  const trendData = useMemo(() => {
    const BASELINE_DAILY = 14.5;
    return Array.from({ length: 7 }, (_, i) => {
      const d = /* @__PURE__ */ new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const dayEntries = ledgerEntries.filter((entry) => entry.date === dateStr);
      let directImpact = 0;
      let reductionsAvoided = 0;
      let footprintCount = 0;
      let savedCount = 0;
      dayEntries.forEach((entry) => {
        if (entry.isReduction) {
          reductionsAvoided += entry.carbonImpact;
          savedCount += 1;
        } else {
          directImpact += entry.carbonImpact;
          footprintCount += 1;
        }
      });
      const netFootprint = Math.max(1.8, BASELINE_DAILY + directImpact - reductionsAvoided);
      const totalSaved = reductionsAvoided;
      return {
        date: dateStr,
        label,
        footprint: parseFloat(netFootprint.toFixed(1)),
        saved: parseFloat(totalSaved.toFixed(1)),
        footprintCount,
        savedCount,
        baseline: BASELINE_DAILY
      };
    });
  }, [ledgerEntries]);
  const stats = useMemo(() => {
    const footprints = trendData.map((d) => d.footprint);
    const totalFootprint = footprints.reduce((acc, val) => acc + val, 0);
    const avgFootprint = totalFootprint / 7;
    const totalSaved = trendData.reduce((acc, d) => acc + d.saved, 0);
    const footprintLogs = trendData.reduce((acc, d) => acc + d.footprintCount, 0);
    const savedLogs = trendData.reduce((acc, d) => acc + d.savedCount, 0);
    return {
      average: parseFloat(avgFootprint.toFixed(1)),
      saved: parseFloat(totalSaved.toFixed(1)),
      footprintLogs,
      savedLogs,
      maxDate: trendData.reduce((prev, current) => prev.footprint > current.footprint ? prev : current).label,
      minDate: trendData.reduce((prev, current) => prev.footprint < current.footprint ? prev : current).label
    };
  }, [trendData]);
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isCo2 = viewMode === "co2";
      return <div className="bg-[#111218]/95 backdrop-blur-md border border-[#bd93f9]/40 rounded-2xl p-3 px-4 shadow-2xl relative z-50 text-left min-w-[190px]">
          <p className="text-[10px] uppercase font-mono tracking-wider text-[#6272a4] font-bold border-b border-white/5 pb-1 mb-2">
            {data.date}
          </p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center gap-4">
              <span className="text-white font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff79c6]" /> 
                {isCo2 ? "Footprint" : "Lifestyle Logs"}
              </span>
              <span className="font-mono font-bold text-[#ff79c6]">
                {isCo2 ? `${data.footprint} kg` : `${data.footprintCount} item${data.footprintCount === 1 ? "" : "s"}`}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-white font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#50fa7b]" /> 
                {isCo2 ? "Saved Offset" : "Reduction Logs"}
              </span>
              <span className="font-mono font-bold text-[#50fa7b]">
                {isCo2 ? `${data.saved} kg` : `${data.savedCount} action${data.savedCount === 1 ? "" : "s"}`}
              </span>
            </div>
            {isCo2 && <div className="flex justify-between items-center gap-4 text-[10px] text-slate-400 border-t border-white/5 pt-1.5 mt-1.5">
                <span>vs Daily Baseline</span>
                <span className="font-mono text-amber-200">14.5 kg</span>
              </div>}
          </div>
        </div>;
    }
    return null;
  };
  return <div className="relative w-full h-full flex flex-col justify-between" id="weekly-trend-section">
      
      {
    /* Glow Ambient Filter for SVG line highlights */
  }
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <filter id="chart-glow-pink">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="chart-glow-green">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#ff79c6]" /> Carbon Footprint Trend
          </h3>
          <p className="text-xs text-[#6272a4]">
            {viewMode === "co2" ? "Daily CO2e index variations over the past 7 days" : "Frequency of logging actions over the past 7 days"}
          </p>
        </div>
        
        {
    /* Quick Summary Badges & Dropdown filter toggles */
  }
        <div className="flex flex-wrap items-center gap-3.5 self-stretch sm:self-auto">
          {
    /* Distinct Toggle Dropdown with premium glass theme */
  }
          <div className="relative flex items-center gap-2 bg-[#1a1b26]/80 p-1.5 rounded-2xl border border-white/5">
            <span className="text-[10px] font-mono text-[#6272a4] uppercase font-bold tracking-wider pl-1 md:inline hidden">Metrics filter:</span>
            <select
    id="weekly-trend-view-mode-selector"
    value={viewMode}
    onChange={(e) => setViewMode(e.target.value)}
    className="bg-[#111218] border border-[#bd93f9]/40 rounded-xl px-3 py-1 text-xs font-mono font-bold text-[#bd93f9] focus:outline-none focus:border-[#ff79c6] focus:ring-1 focus:ring-[#ff79c6] cursor-pointer transition-all duration-300 hover:border-[#bd93f9]/80 shadow-[0_0_10px_rgba(189,147,249,0.15)]"
  >
              <option value="co2">📊 CO2e Impact (kg)</option>
              <option value="entries">✏️ Number of Entries</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {viewMode === "co2" ? <>
                <div className="bg-[#111218]/50 border border-[#ff79c6]/20 rounded-xl px-3 py-1.5 text-center font-mono">
                  <span className="block text-[8px] uppercase text-[#ff79c6] tracking-widest font-bold">Wkly Avg</span>
                  <span className="text-xs font-semibold text-white">{stats.average} kg</span>
                </div>
                <div className="bg-[#111218]/50 border border-[#50fa7b]/20 rounded-xl px-3 py-1.5 text-center font-mono">
                  <span className="block text-[8px] uppercase text-[#50fa7b] tracking-widest font-bold">Total Saved</span>
                  <span className="text-xs font-semibold text-white">-{stats.saved} kg</span>
                </div>
              </> : <>
                <div className="bg-[#111218]/50 border border-[#ff79c6]/20 rounded-xl px-3 py-1.5 text-center font-mono">
                  <span className="block text-[8px] uppercase text-[#ff79c6] tracking-widest font-bold">Lifestyles</span>
                  <span className="text-xs font-semibold text-white">{stats.footprintLogs}</span>
                </div>
                <div className="bg-[#111218]/50 border border-[#50fa7b]/20 rounded-xl px-3 py-1.5 text-center font-mono">
                  <span className="block text-[8px] uppercase text-[#50fa7b] tracking-widest font-bold">Off-settings</span>
                  <span className="text-xs font-semibold text-white">{stats.savedLogs}</span>
                </div>
              </>}
          </div>
        </div>
      </div>

      {
    /* Embedded High-Fidelity Chart Canvas */
  }
      <div className="w-full flex-1 min-h-[260px] max-h-[300px] mb-4 relative z-10" id="recharts-trend-container">
        <ResponsiveContainer width="100%" height={265} key={`${viewMode}-${ledgerEntries.length}`}>
          <LineChart
    data={trendData}
    margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
  >
            <CartesianGrid
    strokeDasharray="3 3"
    stroke="rgba(255,255,255,0.03)"
    vertical={false}
  />
            <XAxis
    dataKey="label"
    tick={{ fill: "#6272a4", fontSize: 10, fontFamily: "monospace" }}
    axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
    tickLine={false}
    dy={10}
  />
            <YAxis
    tick={{ fill: "#6272a4", fontSize: 10, fontFamily: "monospace" }}
    axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
    tickLine={false}
    dx={-5}
    allowDecimals={viewMode === "co2"}
    domain={[0, "auto"]}
  />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(189,147,249,0.15)", strokeWidth: 1.5 }} />
            
            <Legend
    verticalAlign="bottom"
    height={36}
    iconSize={8}
    iconType="circle"
    content={({ payload }) => <div className="flex flex-wrap justify-center items-center gap-5 text-[10px] font-mono mt-4">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff79c6] shadow-[0_0_8px_rgba(255,121,198,0.7)]" />
                    <span>{viewMode === "co2" ? "My Daily Footprint" : "Lifestyle Log Items"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#50fa7b] shadow-[0_0_8px_rgba(80,250,123,0.7)]" />
                    <span>{viewMode === "co2" ? "Avoided Offsets" : "Reduction Log Items"}</span>
                  </div>
                  {viewMode === "co2" && <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-3 border-t border-dashed border-[#f1fa8c]" />
                      <span>Ecosystem Target Baseline (14.5 kg)</span>
                    </div>}
                </div>}
  />

            {
    /* Target Limit Reference guide - only visible on CO2e view */
  }
            {viewMode === "co2" && <ReferenceLine
    y={14.5}
    stroke="#f1fa8c"
    strokeDasharray="4 4"
    strokeOpacity={0.5}
    label={{
      value: "Limit Line",
      fill: "#f1fa8c",
      fontSize: 8,
      position: "top",
      offset: 5,
      fontFamily: "monospace"
    }}
  />}

            {
    /* Avoided emissions offset trend */
  }
            <Line
    type="monotone"
    dataKey={viewMode === "co2" ? "saved" : "savedCount"}
    name={viewMode === "co2" ? "Offsets Saved" : "Reduction Logs"}
    stroke="#50fa7b"
    strokeWidth={3}
    dot={{ fill: "#50fa7b", r: 3, stroke: "#111218", strokeWidth: 1.5 }}
    activeDot={{ r: 5, stroke: "#111218", strokeWidth: 1 }}
    connectNulls
  />

            {
    /* Primary active footprint line */
  }
            <Line
    type="monotone"
    dataKey={viewMode === "co2" ? "footprint" : "footprintCount"}
    name={viewMode === "co2" ? "Footprint" : "Lifestyle Logs"}
    stroke="#ff79c6"
    strokeWidth={3}
    dot={{ fill: "#ff79c6", r: 3, stroke: "#111218", strokeWidth: 1.5 }}
    activeDot={{ r: 5, stroke: "#111218", strokeWidth: 1 }}
    connectNulls
  />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {
    /* Analysis Insight footer message */
  }
      <div className="bg-[#111218]/40 border border-[#bd93f9]/15 rounded-2xl p-3 flex items-start gap-2.5 text-left text-xs text-slate-300 transition-all hover:border-[#bd93f9]/25 hover:bg-[#111218]/60 mt-auto">
        <Sparkles className="w-4 h-4 text-[#f1fa8c] flex-shrink-0 mt-0.5 animate-pulse" />
        <p className="leading-relaxed">
          {viewMode === "co2" ? stats.average < 12 ? <span>Weekly Carbon trend is optimal! By holding an average of <strong className="text-[#50fa7b] font-semibold">{stats.average} kg CO2e</strong> (lower than the global average limit), your virtual greenhouse canopy remains highly healthy and active.</span> : <span>Footprint spike logged on <strong className="text-[#ff79c6] font-semibold">{stats.maxDate}</strong>. Record more green offsets to repair your eco dome's canopy filter.</span> : <span>
              You recorded <strong className="text-white font-semibold">{stats.footprintLogs + stats.savedLogs} actions</strong> this week. Your active participation represents ratio of <strong className="text-[#50fa7b] font-semibold">{stats.savedLogs} conservation steps</strong> to <strong className="text-[#ff79c6] font-semibold">{stats.footprintLogs} consumption choices</strong>!
            </span>}
        </p>
      </div>

    </div>;
}
