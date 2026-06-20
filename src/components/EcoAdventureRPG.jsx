/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Compass, RotateCcw, ChevronRight, Sparkles, BookOpen } from "lucide-react";
const AdventureChapters = {
  commuting: [
    {
      id: "comm_1",
      title: "The Critical Meeting",
      chapter: "Chapter 1: Conscious Commuter",
      prompt: "You wake up and realize you are late for a critical environmental summit addressing urban carbon reduction solutions! The sky is grey with standard morning smog. Your friend offers to drive you in their traditional gas-guzzling V8 engine SUV. What is your choice?",
      options: [
        {
          text: "Accept the ride to ensure punctuality.",
          impact: 4.8,
          // 4.8 kg CO2
          points: 10,
          narrativeOutcome: "You arrive 15 minutes early! However, the SUV releases thick tailpipe exhaust along the highway, and you sit in gridlock watching other single-occupancy vehicles compound the local smog index.",
          nextScenarioId: "comm_2"
        },
        {
          text: "Tell them thanks, but catch the local express light rail instead.",
          impact: 0.6,
          points: 40,
          narrativeOutcome: "The tram has its own right-of-way! You read carbon mitigation drafts during the smooth 12-minute transit and walk the last 300 meters, arriving with a clear conscience.",
          nextScenarioId: "comm_2"
        },
        {
          text: "Pedal furiously on your trusty commuter bicycle.",
          impact: 0,
          points: 60,
          narrativeOutcome: "An adrenaline-fueled, carbon-free dash! You navigate the riverside bike lane, weave through traffic, and arrive with zero emissions and high physical fitness.",
          nextScenarioId: "comm_2"
        }
      ]
    },
    {
      id: "comm_2",
      title: "The Office Dilemma",
      chapter: "Chapter 1: Conscious Commuter",
      prompt: "At the venue lobby. You see posters encouraging delegates to commit to one sustainable commuting habit next year. The mayor is signing off pledges. Which pledge do you sign?",
      options: [
        {
          text: "Pledge: Biking on all dry weather days.",
          impact: -320,
          // saves 320kg a year!
          points: 50,
          narrativeOutcome: "Excellent choice! Sustainable biking on average reduces standard commuter emissions by half a ton of greenhouse gases every single year.",
          nextScenarioId: "end"
        },
        {
          text: "Pledge: Carpooling with at least two colleagues thrice a week.",
          impact: -180,
          points: 30,
          narrativeOutcome: "Splitting emissions among passengers cuts commuting footprint by roughly 35%, plus reduces active traffic density on metropolitan lanes.",
          nextScenarioId: "end"
        }
      ]
    }
  ],
  energy: [
    {
      id: "energy_1",
      title: "The Summer Spike",
      chapter: "Chapter 2: Grid Guardian",
      prompt: "It's an intense, sweltering 38\xB0C summer afternoon. The neighborhood cooling grid is at max capacity, bordering a localized blackout. Your home feels like an active greenhouse. Your regular reaction is to crank the central AC to 18\xB0C. What will you do?",
      options: [
        {
          text: "Set the AC to a luxurious 18\xB0C and draw the blackout drapes.",
          impact: 5.5,
          points: 5,
          narrativeOutcome: "The house feels frigid and nice, but the electricity meter is spinning wildly, consuming expensive coal-fired power from the local regional grid.",
          nextScenarioId: "energy_2"
        },
        {
          text: "Set thermostat to 25\xB0C + run a low-energy high-volume ceiling fan.",
          impact: 1.2,
          points: 45,
          narrativeOutcome: "You discover the ceiling fan circulates cool air perfectly! Energy consumption drops by 70%, and you comfortably dodge contributing to any grid failures.",
          nextScenarioId: "energy_2"
        },
        {
          text: "Close the windows, pull drapes shut, and rely on damp thermal towels.",
          impact: 0,
          points: 55,
          narrativeOutcome: "A rugged offline survivalist tactic! Completely carbon-free. It is highly sweaty but teaches you the incredible cooling properties of classic thermodynamic conduction.",
          nextScenarioId: "energy_2"
        }
      ]
    },
    {
      id: "energy_2",
      title: "The Solar Proposition",
      chapter: "Chapter 2: Grid Guardian",
      prompt: "An energy cooperative knocks on the door proposing community solar panel sharing. Joining redirects 100% of your energy profile to hydro and solar resources. It adds a small dynamic premium of $12 a month. Do you join?",
      options: [
        {
          text: "Sign up immediately to bypass fossil fuels entirely.",
          impact: -1200,
          // massive global savings
          points: 80,
          narrativeOutcome: "Incredible commitment! Your home now runs on pristine sunlight and rushing river flows, reducing your lifetime electricity emissions down to net-zero.",
          nextScenarioId: "end"
        },
        {
          text: "Decline for now to invest first in insulation seals and energy-saving LEDs.",
          impact: -400,
          points: 40,
          narrativeOutcome: "Smart demand-side choice! Tight seals and smart LEDs decrease base electricity loads by 33%, a critical step before building external generation panels.",
          nextScenarioId: "end"
        }
      ]
    }
  ],
  diet: [
    {
      id: "diet_1",
      title: "The Supermarket Fork",
      chapter: "Chapter 3: Feast For Future",
      prompt: "You are hosting a gathering of college friends. You need to prepare a major dinner. The aisle offers standard farm beef hamburger patties versus locally grown whole legume patties. Your friends love hamburgers. What meat model do you purchase?",
      options: [
        {
          text: "Stick with traditional premium beef patties.",
          impact: 14.5,
          points: 10,
          narrativeOutcome: "The burgers taste classic and familiar. However, standard cattle farming releases extensive enteric fermentation methane, creating heavy CO2 equivalents (~14kg per burger tray).",
          nextScenarioId: "diet_2"
        },
        {
          text: "Choose organic poultry chicken breast sliders.",
          impact: 3.6,
          points: 30,
          narrativeOutcome: "A strong bird step! Switching beef to poultry limits feed farming footprint indices by nearly 75% globally.",
          nextScenarioId: "diet_2"
        },
        {
          text: "Go full gourmet whole-food lentil/portobello patties.",
          impact: 0.9,
          points: 60,
          narrativeOutcome: "You season them with local herbs! Your friends are absolutely stunned by the rich, umami texture. Total food emissions sit at a tiny fraction of conventional plates.",
          nextScenarioId: "diet_2"
        }
      ]
    },
    {
      id: "diet_2",
      title: "Leftovers Management",
      chapter: "Chapter 3: Feast For Future",
      prompt: "The gathering completes, leaving behind food scraps, extra bread, and salad trimmings. How will you treat this residual biomass?",
      options: [
        {
          text: "Toss everything into the combined landfill trash bin.",
          impact: 1.8,
          points: 5,
          narrativeOutcome: "Quick cleanup, but organic food rotting in hypoxic land dumps produces methane gas\u2014which is 28 times more active at securing greenhouse warmth than direct carbon dioxide.",
          nextScenarioId: "end"
        },
        {
          text: "Sort the compostables for your backyard soil bin or urban organics collection.",
          impact: -0.9,
          points: 50,
          narrativeOutcome: "Organic composting turns scraps back to rich, aerobic garden topsoil, completely bypassing methane production pathways. Nature smiles!",
          nextScenarioId: "end"
        }
      ]
    }
  ]
};
export default function EcoAdventureRPG() {
  const [activeStoryline, setActiveStoryline] = useState("commuting");
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);
  const [totalAdventurePoints, setTotalAdventurePoints] = useState(0);
  const [cumulativeAdventureCarbonEffect, setCumulativeAdventureCarbonEffect] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const storylineNodes = AdventureChapters[activeStoryline];
  const currentNode = storylineNodes[currentNodeIndex];
  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };
  const handleAdvance = () => {
    if (!selectedOption) return;
    setTotalAdventurePoints((p) => p + selectedOption.points);
    setCumulativeAdventureCarbonEffect((c) => c + selectedOption.impact);
    if (selectedOption.nextScenarioId === "end") {
      setIsCompleted(true);
    } else {
      const nextIndex = storylineNodes.findIndex((node) => node.id === selectedOption.nextScenarioId);
      if (nextIndex !== -1) {
        setCurrentNodeIndex(nextIndex);
        setSelectedOption(null);
      } else {
        setIsCompleted(true);
      }
    }
  };
  const handleResetChallenge = (storyName) => {
    setActiveStoryline(storyName);
    setCurrentNodeIndex(0);
    setSelectedOption(null);
    setIsCompleted(false);
  };
  return <div id="eco-adventure-game-card" className="bg-gradient-to-br from-[#1c0d3a] via-[#09101f] to-[#040612] rounded-3xl p-6 shadow-2xl border border-violet-500/20 flex flex-col h-full text-white shadow-[0_0_35px_rgba(139,92,246,0.08)]">
      <div className="flex items-center justify-between border-b border-violet-950 pb-4 mb-4">
        <div>
          <h3 className="text-xl font-sans font-bold text-white flex items-center gap-1.5 font-display">
            <Compass className="w-5 h-5 text-emerald-400" /> Quest: Decision Adventure
          </h3>
          <p className="text-xs text-slate-400">Uncover the systemic impact of micro-decisions through dynamic stories</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-mono tracking-wider bg-[#070b14] text-[#34d399] border border-emerald-900/40 px-3 py-1.5 rounded-full font-bold">
            Score: {totalAdventurePoints} Karma
          </span>
        </div>
      </div>

      {
    /* Storyline Tabs */
  }
      <div id="storyline-difficulty-tabs" className="grid grid-cols-3 gap-2 mb-4 bg-[#070b14] p-1.5 rounded-xl border border-slate-800/60">
        {[
    { id: "commuting", label: "Commute Class" },
    { id: "energy", label: "Energy Grid" },
    { id: "diet", label: "Feast Wise" }
  ].map((lane) => <button
    key={lane.id}
    id={`btn-lane-${lane.id}`}
    onClick={() => handleResetChallenge(lane.id)}
    className={`py-2 text-[11px] font-mono font-bold uppercase tracking-wide rounded-lg transition-all cursor-pointer ${activeStoryline === lane.id ? "bg-emerald-600 text-white font-extrabold shadow-sm" : "text-slate-400 hover:bg-[#111827]/85 hover:text-white"}`}
  >
            {lane.label}
          </button>)}
      </div>

      {
    /* Adventure Sandbox */
  }
      <div className="flex-1 flex flex-col justify-between min-h-[340px]">
        <AnimatePresence mode="wait">
          {!isCompleted ? <motion.div
    key={currentNode.id}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-4"
  >
              <div id="quest-header">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-extrabold">
                  {currentNode.chapter}
                </span>
                <h4 className="text-lg font-sans font-extrabold text-white mt-0.5 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  {currentNode.title}
                </h4>
              </div>

              {
    /* Literary prompt */
  }
              <div className="bg-[#070b14] leading-relaxed text-slate-250 text-xs border border-slate-800 p-4 rounded-2xl italic shadow-inner relative overflow-hidden text-left">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl" />
                "{currentNode.prompt}"
              </div>

              {
    /* Options */
  }
              <div id="scenario-options-cluster" className="space-y-2">
                {currentNode.options.map((opt, i) => <button
    key={i}
    id={`opt-btn-${i}`}
    onClick={() => handleSelectOption(opt)}
    className={`w-full text-left p-3.5 rounded-xl text-xs flex justify-between items-center transition-all border cursor-pointer ${selectedOption === opt ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold shadow-inner" : "border-slate-800 bg-[#070b14]/50 hover:bg-[#111827]/70 text-slate-300 font-medium"}`}
  >
                    <span>{opt.text}</span>
                    <ChevronRight className="w-4 h-4 text-emerald-500/80" />
                  </button>)}
              </div>

              {
    /* Action narrative outcome feedback */
  }
              {selectedOption && <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-emerald-950/20 border border-emerald-900/40 text-slate-205 rounded-2xl p-4 space-y-2 text-xs text-left"
  >
                  <p className="leading-relaxed text-slate-300 italic">
                    "{selectedOption.narrativeOutcome}"
                  </p>
                  <div className="flex justify-between text-[11px] font-mono text-emerald-405 border-t border-emerald-900/40 pt-2 font-bold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      +{selectedOption.points} Eco-Karma Points
                    </span>
                    <span>
                      Impact: {selectedOption.impact >= 0 ? "+" : ""}
                      {selectedOption.impact.toFixed(1)} kg CO2e
                    </span>
                  </div>
                </motion.div>}
            </motion.div> : (
    /* Adventure summary card screen */
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-6 space-y-4 flex flex-col items-center justify-center h-full"
    >
              <div className="w-16 h-16 rounded-full bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 flex items-center justify-center animate-bounce">
                <Award className="w-8 h-8 fill-emerald-950/40" />
              </div>

              <div id="rpg-congratulations">
                <h4 className="text-xl font-sans font-extrabold text-white">Quest Completed!</h4>
                <p className="text-xs text-slate-400 mt-1">You navigated the sustainable branches successfully!</p>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
                <div className="bg-[#070b14] border border-slate-800 rounded-xl p-3 flex flex-col">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Karma Earned</span>
                  <span className="text-base font-bold font-mono text-[#34d399]">+{totalAdventurePoints} PTS</span>
                </div>
                <div className="bg-[#070b14] border border-slate-800 rounded-xl p-3 flex flex-col">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Simulated Footprint</span>
                  <span className="text-base font-bold font-mono text-slate-205">
                    {cumulativeAdventureCarbonEffect < 0 ? "-" : "+"}
                    {Math.abs(cumulativeAdventureCarbonEffect).toFixed(1)} kg CO2
                  </span>
                </div>
              </div>

              <button
      onClick={() => handleResetChallenge(activeStoryline)}
      id="btn-restart-rpg-adventure"
      className="bg-emerald-600 hover:bg-emerald-700 border-none text-white font-sans font-bold py-2.5 px-5 rounded-xl flex items-center gap-1.5 text-xs transition-transform hover:scale-[1.01] cursor-pointer shadow-sm"
    >
                <RotateCcw className="w-3.5 h-3.5" /> Replay Chapter
              </button>
            </motion.div>
  )}
        </AnimatePresence>

        {
    /* Advance Control */
  }
        {!isCompleted && <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
            <button
    onClick={handleAdvance}
    disabled={!selectedOption}
    id="btn-advance-adventure-story"
    className={`py-3 px-6 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${selectedOption ? "bg-emerald-600 border-none text-white hover:bg-emerald-700 shadow-md cursor-pointer hover:scale-[1.01] active:scale-[0.99]" : "bg-[#070b14] text-slate-500 cursor-not-allowed border border-slate-800/60"}`}
  >
              Confirm Choice <ChevronRight className="w-4 h-4" />
            </button>
          </div>}
      </div>
    </div>;
}
