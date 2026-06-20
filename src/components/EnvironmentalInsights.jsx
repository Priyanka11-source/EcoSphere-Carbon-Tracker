/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, BookOpen, CheckCircle2, ChevronRight, RefreshCw, Star } from "lucide-react";
export default function EnvironmentalInsights({
  ledgerEntries,
  weeklyChallenges,
  onCommitOptInChallenge,
  onUpdateChallengeProgress,
  onGrantKarmaBonus
}) {
  const [successCelebrationMsg, setSuccessCelebrationMsg] = useState(null);
  const [adviceIndex, setAdviceIndex] = useState(0);
  const personalizedBreakdown = useMemo(() => {
    let transportSum = 0;
    let foodSum = 0;
    let energySum = 0;
    let shoppingSum = 0;
    ledgerEntries.forEach((entry) => {
      if (!entry.isReduction) {
        if (entry.category === "transport") transportSum += entry.carbonImpact;
        if (entry.category === "food") foodSum += entry.carbonImpact;
        if (entry.category === "energy") energySum += entry.carbonImpact;
        if (entry.category === "shopping") shoppingSum += entry.carbonImpact;
      }
    });
    const grandTotal = transportSum + foodSum + energySum + shoppingSum || 1;
    const categories = [
      { name: "Transport", value: transportSum, percentage: Math.round(transportSum / grandTotal * 100) },
      { name: "Diet/Food", value: foodSum, percentage: Math.round(foodSum / grandTotal * 100) },
      { name: "Home Energy", value: energySum, percentage: Math.round(energySum / grandTotal * 100) },
      { name: "Shopping", value: shoppingSum, percentage: Math.round(shoppingSum / grandTotal * 100) }
    ];
    const topOffender = [...categories].sort((a, b) => b.value - a.value)[0];
    return {
      breakdown: categories,
      topCategory: topOffender.name,
      topValue: topOffender.value,
      topPercentage: topOffender.percentage,
      grandTotalEmissions: grandTotal
    };
  }, [ledgerEntries]);
  const challengeLibrary = [
    {
      id: "lib-opt-1",
      title: "Meatless Monday Month",
      description: "Swap cattle/animal-based lunches for legume or clean vegetarian sliders across four consecutive Mondays.",
      category: "food",
      co2SavedPerDay: 2.2,
      completed: false,
      daysDuration: 4,
      daysSucceeded: 0
    },
    {
      id: "lib-opt-2",
      title: "Cycle to Summit Week",
      description: "Replace all solitary automobile fuel rides under 5km with dynamic bicycle spins.",
      category: "transport",
      co2SavedPerDay: 4.5,
      completed: false,
      daysDuration: 7,
      daysSucceeded: 0
    },
    {
      id: "lib-opt-3",
      title: "Standby Slayer Quest",
      description: "Perform a nightly audit of all screen gadgets and adapters, physically disconnecting them to stop background phantom loads.",
      category: "energy",
      co2SavedPerDay: 0.8,
      completed: false,
      daysDuration: 5,
      daysSucceeded: 0
    },
    {
      id: "lib-opt-4",
      title: "Zero Single-Use Swaps",
      description: "Commit entirely to reusable silicon cups and fiber bags, avoiding plastic boxes for lunches.",
      category: "shopping",
      co2SavedPerDay: 1.2,
      completed: false,
      daysDuration: 6,
      daysSucceeded: 0
    }
  ];
  const insightAnalysisText = useMemo(() => {
    const top = personalizedBreakdown.topCategory;
    const pct = personalizedBreakdown.topPercentage;
    if (personalizedBreakdown.grandTotalEmissions <= 1) {
      const emptyPool = [
        {
          insight: "Your carbon footprint looks highly efficient today! Perfect clean canvas.",
          suggestion: "Keep it up! Log your standard office lunches or power uses to construct personalized carbon-neutral pathways with Ember."
        },
        {
          insight: "Perfect biosphere equilibrium! Zero active emissions detected in the atmospheric meters.",
          suggestion: "Explore the Living Ecosystem tab to witness your trees and flowers blooming under pristine air conditions!"
        },
        {
          insight: "A quiet day in the biosphere is a major victory for our collective atmosphere.",
          suggestion: "Maintain this momentum by using passive cooling, natural daytime lighting, or taking a brisk restorative walk!"
        },
        {
          insight: "Prone to outstanding carbon neutrality today! Beautiful planetary harmony.",
          suggestion: "This is the optimal carbon baseline. Inspire others by committing to a new opt-in global challenge below!"
        }
      ];
      return emptyPool[adviceIndex % emptyPool.length];
    }
    if (top === "Transport") {
      const transportPool = [
        {
          insight: `Automotive logistics forms ${pct}% of your direct footprint. Moving single passengers in large heavy SUVs multiplies carbon footprint structures dramatically.`,
          suggestion: `Try committing to the 'Cycle to Summit Week' challenge. Standard passenger rides averages 400g/mile. Swapping to high-speed passenger trains or a bike eliminates this factor.`
        },
        {
          insight: `Your transport emissions contribute ${pct}% of your atmospheric impact factor index. Accelerating and braking abruptly wastes up to 33% more fuel on highways.`,
          suggestion: "Transitioning to smooth 'eco-driving' modes saves significant fuel, preserves brake pad materials, and curbs microplastic tire wear!"
        },
        {
          insight: `A significant ${pct}% of your logs stems from transit habits. Engine cold-starts produce heavier emissions of climate gases during the first few miles.`,
          suggestion: "Group your running errands into a single circular trip rather than taking separate vehicle sprints. Collective efficiency wins!"
        },
        {
          insight: `Highway logistics and daily passenger commutes represent ${pct}% of your total carbon footprint.`,
          suggestion: "Telecommuting or holding team syncs digitally even one day per week can slash your vehicle transportation emissions by 20% globally!"
        }
      ];
      return transportPool[adviceIndex % transportPool.length];
    } else if (top === "Diet/Food") {
      const foodPool = [
        {
          insight: `Your dietary selections represent ${pct}% of your logged index. Cattle feed crops and fermentation processes emit substantial methane gases.`,
          suggestion: `Consuming seasonal plants rather than beef or lamb cuts food footprints by up to 88%! We suggest opting into 'Meatless Monday Month' below.`
        },
        {
          insight: `Food logs constitute ${pct}% of your ecological index. Organic food items decaying in sealed municipal dumps generate heavy landfill gas.`,
          suggestion: "Shop with precise meal plans to eliminate kitchen organic waste entirely. Start composting leftover food scraps to bypass decay methane pathways."
        },
        {
          insight: `Dietary impact accounts for ${pct}% of your footprint logs. Long-range refrigerated shipping routes waste transit energy.`,
          suggestion: "Prioritizing locally grown, organic seasonal produce bypasses long-range refrigerated container transport and heavy processing food miles!"
        },
        {
          insight: `Agriculture and global livestock production are responsible for ${pct}% of your daily energy footprint.`,
          suggestion: "Try incorporating more climate-resilient grains like millet, sorghum, and oats. They require very little water and have exceptionally low carbon inputs."
        }
      ];
      return foodPool[adviceIndex % foodPool.length];
    } else if (top === "Home Energy") {
      const energyPool = [
        {
          insight: `Home grid heat and auxiliary power represents ${pct}% of emissions. Background vampire loads consume immense traditional energy when unnoticed.`,
          suggestion: `Unplugging laptop accessories when fully powered or sealing drafty windows decreases central AC losses. Consider opting into 'Standby Slayer Quest'.`
        },
        {
          insight: `Auxiliary power grid demand spikes at ${pct}% in your records. Boilers use deep electrical grids to store thermal reserves.`,
          suggestion: "Setting domestic water heater temperatures to 120\xB0F (49\xB0C) preserves burner loads and cuts up to 5% of direct energy utility bills!"
        },
        {
          insight: `Grid energy consumption represents ${pct}% of your carbon logs. Standard hot water washing is a continuous energy drain.`,
          suggestion: "Washing laundry load items in cold water cycles saves about 90% of the energy consumed by standard washing machines!"
        },
        {
          insight: `Electricity and ambient heating factors account for ${pct}% of emissions. Defective ambient seals stress local grids.`,
          suggestion: "Keep refrigerator coils free of dust and verify door seals are airtight. Clean appliances run up to 15% more efficiently!"
        }
      ];
      return energyPool[adviceIndex % energyPool.length];
    } else {
      const shoppingPool = [
        {
          insight: `Commodities shopping accounts for ${pct}% of direct logs. Fashion supply chains emit heavy logistics carbon.`,
          suggestion: `Acquiring pre-owned, high-quality, long-lasting consignment garments preserves local materials. Try composting food scraps to bypass high landfill decay methane pathways.`
        },
        {
          insight: `Consumer acquisitions form ${pct}% of your footprint profile. Every new synthetic plastic item requires intensive petroleum refining.`,
          suggestion: "Emphasize circular sharing economies by swapping high-durability items with neighbors and bypassing single-use convenience plastic!"
        },
        {
          insight: `Industrial production emissions represent ${pct}% of your footprint logs. Excess packaging creates huge immediate dumpster debris.`,
          suggestion: "Purchase standard grains and snacks in bulk containers to eliminate unnecessary single-use cardboard and bubble-wrap mailer waste."
        },
        {
          insight: `Material acquisition represents ${pct}% of your carbon footprint. Short product lifecycles drive perpetual manufacturing.`,
          suggestion: "Support zero-waste circular brands that offer take-back and repair guarantees, extending the product lifecycle indefinitely."
        }
      ];
      return shoppingPool[adviceIndex % shoppingPool.length];
    }
  }, [personalizedBreakdown, adviceIndex]);
  const handleProgressChallengeDay = (challenge) => {
    const nextDays = challenge.daysSucceeded + 1;
    const isNowDone = nextDays >= challenge.daysDuration;
    onUpdateChallengeProgress(challenge.id, nextDays, isNowDone);
    if (isNowDone) {
      const karmaBonus = challenge.co2SavedPerDay * challenge.daysDuration > 10 ? 100 : 50;
      onGrantKarmaBonus(karmaBonus);
      setSuccessCelebrationMsg(`\u{1F389} CONGRATULATIONS! You successfully finished the "${challenge.title}" challenge! You've avoided estimated ${(challenge.co2SavedPerDay * challenge.daysDuration).toFixed(1)}kg of greenhouse gases and gained ${karmaBonus} bonus Eco-Karma Points!`);
    }
  };
  return <div id="environmental-insights-module" className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      
      {
    /* Dynamic Celebratory Banner Overlays */
  }
      <AnimatePresence>
        {successCelebrationMsg && <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4"
  >
            <div className="bg-emerald-950 text-white rounded-3xl p-6 max-w-md w-full border border-emerald-500 shadow-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-800 text-amber-400 flex items-center justify-center mx-auto animate-bounce border-2 border-emerald-400">
                <Star className="w-10 h-10 fill-amber-300" />
              </div>
              <h3 className="text-xl font-sans font-black text-emerald-200">Achievement Complete!</h3>
              <p className="text-xs leading-relaxed text-emerald-100">{successCelebrationMsg}</p>
              <button
    onClick={() => setSuccessCelebrationMsg(null)}
    className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer w-full"
  >
                Let's Cultivate More! 🌿
              </button>
            </div>
          </motion.div>}
      </AnimatePresence>

      {
    /* Left Pane: Tailored Footprint Insights & Breakdown Charts */
  }
      <motion.div
    id="personalized-analytics-panel"
    className="bento-cell card-theme-insights-analytics rounded-3xl p-6 flex flex-col justify-between"
    whileHover={{ scale: 1.012, y: -4 }}
    transition={{ type: "spring", stiffness: 350, damping: 25 }}
  >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-lg font-display font-semibold tracking-tight text-white flex items-center gap-1.5">
                <BookOpen className="w-5 h-5 text-emerald-400" /> Carbon Analytics
              </h3>
              <p className="text-xs text-slate-400">Real-time distribution tailored to your daily ledger logs</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Breakdown distribution</h4>
            <div className="space-y-2">
              {personalizedBreakdown.breakdown.map((cat) => <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-200">
                    <span>{cat.name}</span>
                    <span className="font-mono text-slate-400">{cat.percentage}% ({cat.value.toFixed(1)} kg)</span>
                  </div>
                  <div className="w-full bg-[#070b14] rounded-full h-2 overflow-hidden">
                    <motion.div
    initial={{ width: 0 }}
    animate={{ width: `${cat.percentage}%` }}
    transition={{ duration: 0.8 }}
    className={`h-full rounded-full ${cat.name === "Transport" ? "bg-rose-500" : cat.name === "Diet/Food" ? "bg-emerald-500" : cat.name === "Home Energy" ? "bg-amber-500" : "bg-indigo-500"}`}
  />
                  </div>
                </div>)}
            </div>
          </div>

          {
    /* Interactive Advice Bubble */
  }
          <motion.div
    whileHover={{ scale: 1.015, borderColor: "rgba(16,185,129,0.3)" }}
    whileTap={{ scale: 0.99 }}
    onClick={() => setAdviceIndex((prev) => prev + 1)}
    id="embers-interactive-advice-bubble"
    className="bg-[#070b14]/50 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs relative overflow-hidden cursor-pointer group select-none transition-all duration-300"
    title="Click for next tailored eco-advice!"
  >
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <h4 className="font-display font-medium text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                Ember's Tailored Advice:
              </h4>
              <span className="text-[10px] text-slate-500 font-mono group-hover:text-emerald-400 flex items-center gap-1 transition-colors">
                <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                Tap to rotate
              </span>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
    key={adviceIndex}
    initial={{ opacity: 0, y: 4 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -4 }}
    transition={{ duration: 0.2 }}
    className="space-y-2"
  >
                <p className="leading-relaxed text-slate-300 italic">
                  "{insightAnalysisText.insight}"
                </p>
                <div className="pt-2 border-t border-slate-800 flex gap-2 items-start text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
                  <span>{insightAnalysisText.suggestion}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {
    /* Right Pane: Eco-Challenges Library (Opt-In & Tracking) */
  }
      <motion.div
    id="eco-challenges-quest-library"
    className="bento-cell card-theme-insights-challenges rounded-3xl p-6 flex flex-col justify-between"
    whileHover={{ scale: 1.012, y: -4 }}
    transition={{ type: "spring", stiffness: 350, damping: 25 }}
  >
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-lg font-display font-semibold tracking-tight text-white flex items-center gap-1.5">
                <Calendar className="w-5 h-5 text-teal-400" /> Global Eco-Challenges
              </h3>
              <p className="text-xs text-slate-400">Pick targets to decrease standard carbon footprint factors</p>
            </div>
          </div>

          {
    /* List of library items */
  }
          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {challengeLibrary.map((challenge) => {
    const parentActiveVersion = weeklyChallenges.find((wc) => wc.title === challenge.title);
    const isActive = !!parentActiveVersion;
    const isCompleted = parentActiveVersion?.completed;
    return <div
      key={challenge.id}
      id={`lib-challenge-item-${challenge.id}`}
      className={`p-3.5 rounded-2xl border transition-all ${isCompleted ? "border-emerald-500/20 bg-emerald-950/10 opacity-70" : isActive ? "border-teal-500/45 bg-teal-950/10 text-white" : "border-slate-800 bg-[#070b14]/55 hover:bg-[#070b14]"}`}
    >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        {challenge.title}
                        {isCompleted && <span className="text-[8px] bg-emerald-900 border border-emerald-700/50 text-emerald-200 px-1.5 py-0.2 rounded uppercase font-bold">Completed</span>}
                      </h4>
                      <p className="text-[10px] leading-relaxed text-slate-400">{challenge.description}</p>
                    </div>

                    {
      /* Opt-In Trigger Control or Progress Indicators */
    }
                    <div className="flex-shrink-0">
                      {!isActive ? <button
      onClick={() => onCommitOptInChallenge(challenge)}
      id={`optin-lib-challenge-${challenge.id}`}
      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-sans font-bold py-1.5 px-3 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
    >
                          Opt-In <ChevronRight className="w-3 h-3" />
                        </button> : !isCompleted ? <button
      onClick={() => handleProgressChallengeDay(parentActiveVersion)}
      id={`progress-lib-challenge-${challenge.id}`}
      className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-sans font-bold py-1.5 px-3 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer"
    >
                          Log Progress
                        </button> : <span className="text-emerald-400 text-xs flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Done
                        </span>}
                    </div>
                  </div>

                  {
      /* Tiny progress status bar */
    }
                  {isActive && <div className="mt-3 space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span>Milestone Progress</span>
                        <span>{parentActiveVersion.daysSucceeded} / {parentActiveVersion.daysDuration} Days Finished</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${parentActiveVersion.daysSucceeded / parentActiveVersion.daysDuration * 100}%` }}
      className="bg-emerald-500 h-full rounded-full"
    />
                      </div>
                    </div>}

                  <div className="flex items-center gap-3 mt-2 text-[9px] text-slate-500 font-mono uppercase tracking-wider">
                    <span>Category: {challenge.category}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">Saves ~{challenge.co2SavedPerDay} kg CO2e / day</span>
                  </div>
                </div>;
  })}
          </div>
        </div>
      </motion.div>

    </div>;
}
