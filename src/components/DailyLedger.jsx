/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import { Car, Utensils, Zap, ShoppingBag, Plus, Check } from "lucide-react";
const CategoryPresets = {
  transport: [
    { name: "Petrol Car Commute", value: 0.28, unit: "km", isReduction: false, helperText: "Passenger vehicles emit on average 280g greenhouse gases per km" },
    { name: "EV Commute (Clean Grid)", value: 0.05, unit: "km", isReduction: false, helperText: "EV charging averages roughly 50g per km" },
    { name: "Public Transit or Bus Commute", value: 0.04, unit: "km", isReduction: false, helperText: "Trains and buses optimize footprint density" },
    { name: "Bicycle or Walking Trip", value: -0.24, unit: "km", isReduction: true, helperText: "Avoided solo motor travel saves ~240g CO2 per km" },
    { name: "Short-Haul Flight Journey", value: 0.15, unit: "km", isReduction: false, helperText: "High altitude airline combustion releases compound warming" }
  ],
  food: [
    { name: "Beef or Lamb Dinner", value: 7.2, unit: "meals", isReduction: false, helperText: "Farming red meat has a high methane emission index (~7.2kg CO2e per meal)" },
    { name: "Poultry, Pork or Seafood Meal", value: 1.8, unit: "meals", isReduction: false, helperText: "White meat and seafood footprint averages ~1.8kg" },
    { name: "Full Vegetarian Dish", value: 0.8, unit: "meals", isReduction: false, helperText: "Vegetarian meals generate only ~800g of CO2 equivalents" },
    { name: "Plant-Based Vegan Meal", value: -1.2, unit: "meals", isReduction: true, helperText: "Choosing vegan options avoids ~1.2kg of livestock farming emission" },
    { name: "Local / Farm-to-Table Produce", value: -0.4, unit: "meals", isReduction: true, helperText: "Local options avoid long logistics carbon mileage elements" }
  ],
  energy: [
    { name: "Residential Cooling or Air Conditioning", value: 1.5, unit: "hours", isReduction: false, helperText: "Each hour of residential cooling consumes substantial power (~1.5kg CO2)" },
    { name: "Household Utility (Standard Grid)", value: 0.42, unit: "kWh", isReduction: false, helperText: "Standard coal-gas grid power releases ~420g carbon per kWh" },
    { name: "Solar Energy Generation Offset", value: -0.38, unit: "kWh", isReduction: true, helperText: "Saves 380g emissions for every clean kilowatt-hour offset" },
    { name: "Eco-Smart: Standby Unplugged", value: -0.15, unit: "hours", isReduction: true, helperText: "Eliminates standby power drain, saving ~150g carbon" }
  ],
  shopping: [
    { name: "New Clothes or Footwear", value: 8.5, unit: "items", isReduction: false, helperText: "New fabric manufacturing generates massive logistics and processing carbon" },
    { name: "Single-Use Plastic Packaging", value: 0.4, unit: "items", isReduction: false, helperText: "Standard plastics release substantial production greenhouse gases" },
    { name: "Second-Hand / Thrifting Loop", value: -7.5, unit: "items", isReduction: true, helperText: "Repurposing saves major resource manufacturing offset" },
    { name: "Composting & Material Recycling", value: -0.8, unit: "items", isReduction: true, helperText: "Diverting organic decay avoids high landfill methane emissions" }
  ]
};
export default function DailyLedger({ onAddEntry, entries, onRemoveEntry }) {
  const [activeCategory, setActiveCategory] = useState("transport");
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [customQuantity, setCustomQuantity] = useState("5");
  const [customDescription, setCustomDescription] = useState("");
  const currentPresets = CategoryPresets[activeCategory];
  const activePreset = currentPresets[selectedPresetIndex] || currentPresets[0];
  const handleLogAction = () => {
    const qty = parseFloat(customQuantity);
    if (isNaN(qty) || qty <= 0) return;
    const carbonCoefficient = activePreset.value;
    const computedCO2 = parseFloat((carbonCoefficient * qty).toFixed(2));
    const finalDescription = customDescription.trim() || activePreset.name;
    const newEntry = {
      id: Math.random().toString(36).substring(2, 11),
      category: activeCategory,
      description: finalDescription,
      value: qty,
      unit: activePreset.unit,
      carbonImpact: Math.abs(computedCO2),
      date: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      isReduction: activePreset.isReduction
    };
    onAddEntry(newEntry);
    setCustomDescription("");
  };
  const iconsMap = {
    transport: <Car className="w-4 h-4" />,
    food: <Utensils className="w-4 h-4" />,
    energy: <Zap className="w-4 h-4" />,
    shopping: <ShoppingBag className="w-4 h-4" />
  };
  return <div id="daily-ledger-card" className="relative transition-all duration-300 text-white flex flex-col h-full justify-between text-left w-full">
      <div>
        <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#bd93f9]" /> carbon calculator
            </h3>
            <p className="text-xs text-[#6272a4]">Input routine carbon habits to audit offsets instantly</p>
          </div>
        </div>

        {
    /* Category switcher pills utilizing Bento + claymorphic parameters */
  }
        <div id="category-selector-tabs" className="grid grid-cols-4 gap-1.5 mb-5 bg-[#1e1f29] p-1.5 rounded-2xl border border-white/5">
          {["transport", "food", "energy", "shopping"].map((cat) => <button
    key={cat}
    id={`tab-btn-${cat}`}
    onClick={() => {
      setActiveCategory(cat);
      setSelectedPresetIndex(0);
    }}
    className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer ${activeCategory === cat ? "bg-[#bd93f9] text-[#1e1f29] font-bold shadow-md clay-puffy" : "text-[#6272a4] hover:text-white hover:bg-white/5"}`}
  >
              {iconsMap[cat]}
              <span className="hidden sm:inline font-sans font-bold ml-1">{cat}</span>
            </button>)}
        </div>

        {
    /* Preset selections */
  }
        <div className="space-y-4">
          <div>
            <label className="block text-[9px] font-mono text-[#6272a4] mb-2 uppercase tracking-widest">Select Carbon Preset</label>
            <div className="space-y-1.5 max-h-[145px] overflow-y-auto pr-1">
              {currentPresets.map((preset, index) => <button
    key={preset.name}
    id={`preset-btn-${index}`}
    onClick={() => setSelectedPresetIndex(index)}
    className={`w-full text-left p-2.5 px-3.5 rounded-2xl text-xs flex justify-between items-center transition-all border cursor-pointer ${selectedPresetIndex === index ? "border-[#bd93f9]/45 bg-[#44475a]/40 text-[#bd93f9] font-bold shadow-inner" : "border-white/5 bg-[#1e1f29]/60 hover:bg-white/5 text-slate-300"}`}
  >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${preset.isReduction ? "bg-[#50fa7b]" : "bg-[#ff5555]"}`} />
                    <span className="truncate max-w-[210px] sm:max-w-xs">{preset.name}</span>
                  </div>
                  <div>
                    <span className={`font-mono text-[9px] font-bold ${selectedPresetIndex === index ? "text-[#ff79c6]" : "text-[#6272a4]"}`}>
                      {preset.value > 0 ? `+${preset.value}` : preset.value} kg/unit
                    </span>
                  </div>
                </button>)}
            </div>
          </div>

          {"/* Quantities and Input Controls */"}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-[9px] font-mono text-[#6272a4] mb-1.5 uppercase tracking-widest">
                Quantity ({activePreset.unit})
              </label>
              <input
    type="number"
    id="ledger-quantity-input"
    value={customQuantity}
    onChange={(e) => setCustomQuantity(e.target.value)}
    className="w-full bg-[#1e1f29] border border-white/5 rounded-2xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-[#bd93f9]/40 transition-all font-bold"
    placeholder="e.g. 5"
    min="0.1"
  />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[9px] font-mono text-[#6272a4] mb-1.5 uppercase tracking-widest">
                Custom Entry Name (Optional)
              </label>
              <input
    type="text"
    id="ledger-label-input"
    value={customDescription}
    onChange={(e) => setCustomDescription(e.target.value)}
    className="w-full bg-[#1e1f29] border border-white/5 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bd93f9]/40 transition-all"
    placeholder={`Default: ${activePreset.name}`}
  />
            </div>
          </div>

          {
    /* Micro calculation box */
  }
          <div className="bg-[#bd93f9]/5 border border-[#bd93f9]/25 rounded-2xl p-4 space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-[#6272a4] flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#50fa7b]" /> Computing:
              </span>
              <span className={`font-mono font-bold text-sm ${activePreset.isReduction ? "text-[#50fa7b]" : "text-[#ff5555]"}`}>
                {activePreset.isReduction ? "Offsets " : "Adds "} 
                {Math.abs(activePreset.value * (parseFloat(customQuantity) || 0)).toFixed(1)} kg CO2e
              </span>
            </div>
            <p className="text-[10px] text-[#6272a4] leading-relaxed italic pr-2 font-sans">
              {activePreset.helperText}
            </p>
          </div>

          {
    /* Claymorphic Submission Button */
  }
          <button
    onClick={handleLogAction}
    id="btn-log-adventure-ledger"
    className="w-full text-white font-semibold tracking-wider py-3.5 rounded-2xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 text-xs uppercase hover:scale-[1.01] active:scale-[0.98] clay-btn-green"
  >
            <Plus className="w-4.5 h-4.5 stroke-[2.5]" /> Add Entry to Ledger
          </button>
        </div>
      </div>
    </div>;
}
