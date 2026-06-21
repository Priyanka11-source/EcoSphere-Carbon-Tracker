/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send,
  Zap,
  Sparkles,
  Check,
  User,
  Terminal,
  BookOpen,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  TrendingUp,
  Leaf,
  ArrowRight,
  Quote
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { ECO_QUOTES } from "../data/quotes";
const reflectionPrompts = [
  {
    id: "phantom-energy",
    category: "energy",
    topic: "Standby Phantom Power",
    icon: "\u26A1",
    question: "Are there inactive phone chargers, screens, routers, or idle appliances plugged in around your living space right now?",
    options: [
      {
        label: "Yes, multiple wall-warts and idle devices",
        impact: 0.8,
        advice: "Idle home chargers/adapters draw a tiny, persistent current called 'vampire draw'. This accounts for up to 10% of standard home electric loads. Disconnecting idle devices saves energy and extends battery health."
      },
      {
        label: "Only one or two gadgets",
        impact: 0.3,
        advice: "Even a single idle charger consumes active power. Unplugging devices when fully charged prevents aggregate grid baseline factors."
      },
      {
        label: "No, everything unused is completely unplugged",
        impact: 0,
        advice: "Outstanding energy management! Eliminating stand-by 'phantom' power keeps baseline grid emissions perfectly clean."
      }
    ]
  },
  {
    id: "hd-streaming",
    category: "energy",
    topic: "Ultra-HD Video Streaming",
    icon: "\u{1F3AC}",
    question: "Did you stream video in high-definition or 4K on a large display for more than two hours today?",
    options: [
      {
        label: "Yes, streamed in high quality/4K",
        impact: 0.6,
        advice: "High-resolution video demands massive server-side computing and high-bitrate data routing. Lowering streaming parameters to 1080p or 720p cuts data-center carbon outputs by up to 40%!"
      },
      {
        label: "Mostly on a phone or tablet screen",
        impact: 0.2,
        advice: "Handheld displays are highly energy-efficient, though digital routing still consumes power. Downloading content over local Wi-Fi reduces grid routing steps."
      },
      {
        label: "No, minimal or no streaming today",
        impact: 0,
        advice: "Marvelous! Choosing physical options, reading, or offline hobbies removes server-side load entirely from global cloud systems."
      }
    ]
  },
  {
    id: "dairy-footprint",
    category: "food",
    topic: "Hidden Dairy Emissions",
    icon: "\u{1F9C0}",
    question: "Did you consume cheese, butter, creams, or dairy yogurt during meals today?",
    options: [
      {
        label: "Yes, dairy was in multiple dishes today",
        impact: 1.4,
        advice: "Lactating livestock emit high concentrations of methane, making heavy dairy products like butter and cheese highly resource-intensive. Substituting with oat, almond, or soy alternatives can slash related food footprint factor ratings by 65%!"
      },
      {
        label: "Had minor amounts (e.g. milk in morning tea/coffee)",
        impact: 0.4,
        advice: "Minor amounts still add up. Transitioning morning coffee creamers to standard oat milk is a simple, pleasant habit transition."
      },
      {
        label: "Completely dairy-free today!",
        impact: 0,
        advice: "Wonderful! Dairy-free eating limits intensive animal farming demands, drastically minimizing daily agricultural emissions."
      }
    ]
  },
  {
    id: "micro-shipping",
    category: "shopping",
    topic: "Same-Day E-Commerce Shipping",
    icon: "\u{1F4E6}",
    question: "Did you purchase an online product with same-day, next-day, or overnight express delivery recently?",
    options: [
      {
        label: "Yes, used express/overnight delivery",
        impact: 1.8,
        advice: "Expedited shipping prevents logistics companies from batching shipments, causing trucks to travel half-empty. Selecting standard 3-5 day transit allows cargo packing optimization and slashes shipping logistics emissions in half."
      },
      {
        label: "Only standard or package consolidation",
        impact: 0.4,
        advice: "Great planning! Grouping items together reduces box waste and lets couriers map highly optimized routes."
      },
      {
        label: "No online purchases / Walked to buy locally",
        impact: 0,
        advice: "Splendid! Sourcing items locally, or walking/cycling to pick them up, completely eliminates digital transit and packaging footprint factors."
      }
    ]
  },
  {
    id: "hvac-overshoot",
    category: "energy",
    topic: "Climate Control & Layers",
    icon: "\u{1F321}\uFE0F",
    question: "Did you operate active heating or cooling today while dressed in clothing that didn't match the current climate?",
    options: [
      {
        label: "Yes, heavily adjusted heating/cooling indoor climate",
        impact: 2.2,
        advice: "Overheating (in winter) or overcooling (in summer) while wearing non-seasonal clothing causes massive climate-system waste. Dropping your thermostat by just 1\xB0C and putting on a sweater saves up to 10% thermal energy consumption."
      },
      {
        label: "Maintained balanced Eco temp settings",
        impact: 0.7,
        advice: "Terrific balance! Standardizing HVAC systems on mild parameters avoids heavy spike cycles and keeps household footprints stable."
      },
      {
        label: "Did not use climate control systems today",
        impact: 0,
        advice: "Sensational! Utilizing natural cross-ventilation, heavy thermal insulation, or simply dressing for the season is the ultimate zero-carbon thermal choice."
      }
    ]
  }
];
export default function AIEcoGuardian({ ledgerEntries, onAddChallenge }) {
  const [messages, setMessages] = useState([
    {
      id: "init",
      sender: "assistant",
      text: "\u{1F33F} **Greetings!** I'm Ember, your dedicated AI Eco-Advisor. Together we can decode your footprint and construct carbon-neutral routines.\n\nAsk about specific carbon factors (e.g. going vegan vs. beef, short commutes) or check custom metrics with the **Quick-Actions** below!",
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [currentReflectionIndex, setCurrentReflectionIndex] = useState(0);
  const [selectedReflectionAnswer, setSelectedReflectionAnswer] = useState(null);
  const [reflectionBannerExpanded, setReflectionBannerExpanded] = useState(true);
  const [advisorQuoteIndex, setAdvisorQuoteIndex] = useState(0);
  const [activeSubTab, setActiveSubTab] = useState("chat");
  const [simulators, setSimulators] = useState([
    { id: "diet", label: "Plant-Based Diet Plan", co2SavedYearly: 1200, active: false, desc: "Substitute beef & intensive dairy with green alternatives.", icon: "\u{1F957}" },
    { id: "energy", label: "Eco Power & Smart Thermostat", co2SavedYearly: 1550, active: false, desc: "Cut phantom vampire power, use energy-efficient settings.", icon: "\u26A1" },
    { id: "commute", label: "Active Transit & Cycling", co2SavedYearly: 1900, active: false, desc: "Replace vehicle commutes with biking or public transit.", icon: "\u{1F6B2}" },
    { id: "shopping", label: "Conscious Packing Opt-In", co2SavedYearly: 450, active: false, desc: "Choose consolidate shipping and avoid express delivery.", icon: "\u{1F4E6}" }
  ]);
  const handleToggleSimulator = (id) => {
    setSimulators((prev) => prev.map((s) => s.id === id ? { ...s, active: !s.active } : s));
  };
  const currentDailyFootprint = useMemo(() => {
    const BASELINE_DAILY = 14.5;
    let netLedgerImpact = 0;
    ledgerEntries.forEach((entry) => {
      if (entry.isReduction) {
        netLedgerImpact -= entry.carbonImpact;
      } else {
        netLedgerImpact += entry.carbonImpact;
      }
    });
    return Math.max(1.8, BASELINE_DAILY + netLedgerImpact);
  }, [ledgerEntries]);
  const projectedFutureData = useMemo(() => {
    const activeSavingsYearly = simulators.filter((s) => s.active).reduce((sum, s) => sum + s.co2SavedYearly, 0);
    const monthNames = [
      "Jul 2026",
      "Aug 2026",
      "Sep 2026",
      "Oct 2026",
      "Nov 2026",
      "Dec 2026",
      "Jan 2027",
      "Feb 2027",
      "Mar 2027",
      "Apr 2027",
      "May 2027",
      "Jun 2027"
    ];
    return Array.from({ length: 12 }, (_, i) => {
      const monthIdx = i + 1;
      const daysCount = Math.round(30.4 * monthIdx);
      const bauEmissions = currentDailyFootprint * daysCount / 1e3;
      const savingsPerDay = activeSavingsYearly / 365;
      const greenDaily = Math.max(1.8, currentDailyFootprint - savingsPerDay);
      const greenEmissions = greenDaily * daysCount / 1e3;
      return {
        month: monthNames[i],
        "Business As Usual (BAU)": parseFloat(bauEmissions.toFixed(2)),
        "With Eco Adjustments": parseFloat(greenEmissions.toFixed(2))
      };
    });
  }, [currentDailyFootprint, simulators]);
  const annualBAUEmissions = currentDailyFootprint * 365 / 1e3;
  const simulatedSavingsYearly = simulators.filter((s) => s.active).reduce((sum, s) => sum + s.co2SavedYearly, 0) / 1e3;
  const targetEmissionsGoal = Math.max(0.6, annualBAUEmissions - simulatedSavingsYearly);
  const equivalencyTrees = Math.round(simulatedSavingsYearly * 1e3 / 22);
  const handleDiscussSimulatedCommitments = () => {
    const activeNames = simulators.filter((s) => s.active).map((s) => s.label);
    let msg = `Analyze my 1-Year Predictive Future carbon projection. Currently, my Business-As-Usual emissions project to be **${annualBAUEmissions.toFixed(2)} tons** per year.`;
    if (activeNames.length > 0) {
      msg += ` I simulated adopting: ${activeNames.join(", ")}. This saves **${simulatedSavingsYearly.toFixed(2)} tons** annually, dropping my signature to **${targetEmissionsGoal.toFixed(2)} tons** (equivalent to planting ${equivalencyTrees} trees!). How can I realistically accomplish these steps over the next 12 months?`;
    } else {
      msg += ` I want to explore strategies to reduce this by 40% over the next year. Recommend a roadmap of habit shifts starting next month.`;
    }
    setActiveSubTab("chat");
    handleSendMessage(msg);
  };
  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleCycleReflection = () => {
    setSelectedReflectionAnswer(null);
    setCurrentReflectionIndex((prev) => (prev + 1) % reflectionPrompts.length);
  };
  const handleDiscussHabit = (topic, optionChosen, impact) => {
    const fullPrompt = `Let's discuss my standby/hidden habits regarding "${topic}". I selected: "${optionChosen}". What are some precise ecological consequences of this, and how can I resolve it?`;
    handleSendMessage(fullPrompt);
  };
  const getLedgerSummaryString = () => {
    if (ledgerEntries.length === 0) return "No entries logged yet. General consumer profile.";
    const total = ledgerEntries.reduce((sum, e) => sum + (e.isReduction ? -e.carbonImpact : e.carbonImpact), 0);
    const breakdown = ledgerEntries.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.carbonImpact;
      return acc;
    }, {});
    return `Aggregated total carbon logged today: ${total.toFixed(2)} kg CO2e. Breakdown categories: ${JSON.stringify(breakdown)}.`;
  };
  const handleSendMessage = async (textToSend, actionType = "chat") => {
    if (!textToSend.trim()) return;
    const userMsg = {
      id: Math.random().toString(36).substring(2, 11),
      sender: "user",
      text: textToSend,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);
    try {
      const summary = getLedgerSummaryString();
      const response = await fetch("/api/gemini/eco-guardian", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          ledgerSummary: summary,
          history: messages.slice(-5),
          actionType
        })
      });
      const data = await response.json();
      let assistantText = data.text;
      if (actionType === "suggest-challenge") {
        try {
          const jsonMatch = assistantText.match(/\[[\s\S]*?\]/);
          if (jsonMatch) {
            const parsedChallenges = JSON.parse(jsonMatch[0]);
            const challengesList = parsedChallenges.map((c, idx) => ({
              id: `ai-challenge-${idx}-${Date.now()}`,
              title: c.title || "Weekly Eco-Steward",
              description: c.description || "Incorporate emission-conscious habits",
              category: c.category || "energy",
              co2SavedPerDay: c.co2SavedPerDay || 1.5,
              completed: false,
              daysDuration: c.daysDuration || 7,
              daysSucceeded: 0
            }));
            setActiveChallenges(challengesList);
            assistantText = "\u2728 **I have created three custom Weekly Commitments matching your profile!** Open and commit to them below the response:";
          }
        } catch (jsonErr) {
          console.error("Fallback to standard text display:", jsonErr);
        }
      }
      const assistantMsg = {
        id: Math.random().toString(36).substring(2, 11),
        sender: "assistant",
        text: assistantText,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn("Express backend unavailable, using local client-side AI advisor fallback:", err);
      
      let fallbackText = "";
      if (actionType === "suggest-challenge") {
        fallbackText = `Here's your suggested carbon challenges:
\`\`\`json
[
  { "title": "Vegan Victory", "description": "Choose plant-based, climate-safe lunch items to curb greenhouse feed crops.", "category": "food", "co2SavedPerDay": 2.2, "daysDuration": 7 },
  { "title": "Bicycle Envoy", "description": "Ditch vehicular travel for short running errands and pedal instead.", "category": "transport", "co2SavedPerDay": 3.8, "daysDuration": 7 },
  { "title": "Standby Slayer", "description": "Fully unplug your laptop chargers and computer monitors before sliding into sleep.", "category": "energy", "co2SavedPerDay": 0.5, "daysDuration": 7 }
]
\`\`\``;
        try {
          const jsonMatch = fallbackText.match(/\[[\s\S]*?\]/);
          if (jsonMatch) {
            const parsedChallenges = JSON.parse(jsonMatch[0]);
            const challengesList = parsedChallenges.map((c, idx) => ({
              id: `ai-challenge-${idx}-${Date.now()}`,
              title: c.title || "Weekly Eco-Steward",
              description: c.description || "Incorporate emission-conscious habits",
              category: c.category || "energy",
              co2SavedPerDay: c.co2SavedPerDay || 1.5,
              completed: false,
              daysDuration: c.daysDuration || 7,
              daysSucceeded: 0
            }));
            setActiveChallenges(challengesList);
            fallbackText = "✨ **I have created three custom Weekly Commitments matching your profile!** Open and commit to them below the response:";
          }
        } catch (jsonErr) {
          console.error("Fallback json parsing failed:", jsonErr);
        }
      } else if (actionType === "impact-projection") {
        fallbackText = `### 🌿 10-Year Co2e Impact Projection

Based on your selected pledge: **"${textToSend || "Eco-living choice"}"**, here is your projected carbon transition pathway:

*   **Years 1-3:** You directly prevent up to **180 kg of greenhouse gases** annually. This matches the carbon absorption rate of **8 mature indigenous canopy trees**!
*   **Years 4-7:** Your compound community action inspires neighbors. Average savings rise to **540 kg of CO2e** per year.
*   **Year 10:** You successfully prevent **1.2 metric tonnes of cumulative carbon emissions**! This equals avoiding a long transatlantic airline flight.

*Future Outlook:* Your local micro-habitat thrives, native pollinators return to residential flower displays, and ambient yard temperatures cool naturally under balanced urban canopies!`;
      } else {
        const lowerText = textToSend.toLowerCase();
        if (lowerText.includes("vegan") || lowerText.includes("meat") || lowerText.includes("diet") || lowerText.includes("food") || lowerText.includes("salad")) {
          fallbackText = `🌱 **Ember Eco-Advisor:** Transitioning to plant-based meals is one of the most effective personal actions you can take. Livestock farming represents nearly 15% of global greenhouse gas emissions.

Choosing plant-based grains, nuts, and greens avoids heavy resource intensive feeds, saving an average of **1.5 - 2.5 kg of CO2e** per meal compared to red meat! Try logging a plant-based meal in your ledger to verify the points bonus.`;
        } else if (lowerText.includes("car") || lowerText.includes("drive") || lowerText.includes("commute") || lowerText.includes("bike") || lowerText.includes("walk") || lowerText.includes("transport")) {
          fallbackText = `🚲 **Ember Eco-Advisor:** Solitary vehicle travel accounts for the largest fraction of personal emissions. 

Replacing just a 10km car drive with walking, cycling, or public transit avoids **2.5 kg of CO2e**. It also reduces urban particulate matter, keeping local air filters perfectly clean. Consider accepting a biking challenge today!`;
        } else if (lowerText.includes("electricity") || lowerText.includes("energy") || lowerText.includes("power") || lowerText.includes("unplug") || lowerText.includes("hvac") || lowerText.includes("heat")) {
          fallbackText = `⚡ **Ember Eco-Advisor:** Household energy draw can be optimized through simple micro-adjustments. 

Unplugging phone and laptop adaptors when not in use removes 'phantom draw' loads, preventing roughly **0.6 kg of CO2e** per day. Adjusting heating/cooling settings by just 1°C adds another major offset.`;
        } else {
          fallbackText = `🌿 **Greetings! I'm Ember, your interactive Eco-Advisor.** I'm running in offline/statically hosted mode, but I am analyzing your ecological ledger closely.

You are doing a fantastic job tracking your footprint choices. Remember, small, consistent daily offsets collectively shape our global planetary transition. 

Ask me about:
*   **Diet shifts** (e.g., vegan eating vs meat)
*   **Transportation choices** (e.g., cycling vs driving)
*   **Energy-saving habits** (e.g., standby power or thermostat settings)

Or try the quick action buttons to generate automated challenges and projections!`;
        }
      }

      const fallbackMsg = {
        id: Math.random().toString(36).substring(2, 11),
        sender: "assistant",
        text: fallbackText,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };
  const handleCommitChallenge = (challenge) => {
    onAddChallenge(challenge);
    setActiveChallenges((prev) => prev.filter((c) => c.id !== challenge.id));
  };
  const formatAssistantText = (txt) => {
    return txt.split("\n").map((line, idx) => {
      if (line.startsWith("**") || line.startsWith("\u{1F33F}") || line.startsWith("\u2728")) {
        return <p key={idx} className="font-sans font-bold text-white mt-2 text-xs">{line.replace(/\*\*/g, "")}</p>;
      }
      if (line.startsWith("*") || line.startsWith("-")) {
        return <li key={idx} className="ml-4 list-disc text-slate-300 text-xs mt-1 leading-relaxed">{line.replace(/^[\s*-]+/, "")}</li>;
      }
      return <p key={idx} className="text-xs text-slate-350 leading-relaxed mt-1">{line}</p>;
    });
  };
  const quickPledges = [
    { label: "Analyze Ledger Intake", prompt: "Evaluate my logged actions and provide specific environmental summaries.", type: "chat" },
    { label: "10-Year Co2 Projection", prompt: "Simulate a 10-year carbon projection profile comparing standard commutes vs cycling habits.", type: "impact-projection" },
    { label: "Design Habit Challenge", prompt: "Extract custom interactive lifestyle pledges for carbon offsets.", type: "suggest-challenge" }
  ];
  return <div id="ai-[#ai-guardian-panel]" className="relative flex flex-col h-full text-white w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4 mb-4 text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#1e1f29] text-[#bd93f9] flex items-center justify-center border border-[#bd93f9]/30 shadow-inner">
            <BotIcon />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-white">
              AI Eco-Advisor
            </h3>
            <p className="text-xs text-[#6272a4]">Carbon counseling console</p>
          </div>
        </div>

        {
    /* Sub-tab segmented controller with premium styling */
  }
        <div className="flex items-center gap-1 p-1 bg-[#1a1b26]/90 border border-white/5 rounded-2xl self-start sm:self-auto shadow-inner">
          <button
    id="subtab-btn-chat"
    onClick={() => setActiveSubTab("chat")}
    className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${activeSubTab === "chat" ? "bg-[#bd93f9] text-white shadow shadow-[#bd93f9]/30 font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
  >
            <Send className="w-3.5 h-3.5" />
            Ember Chat
          </button>
          <button
    id="subtab-btn-prediction"
    onClick={() => setActiveSubTab("prediction")}
    className={`cursor-pointer px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${activeSubTab === "prediction" ? "bg-[#bd93f9] text-white shadow shadow-[#bd93f9]/30 font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
  >
            <TrendingUp className="w-3.5 h-3.5" />
            Predictive Future
          </button>
        </div>
      </div>

      {activeSubTab === "chat" ? <>
          {
    /* 🌟 Interactive Planetary Wisdom Quote Panel */
  }
          <div id="advisor-interactive-wisdom-quote" className="mb-4 bg-gradient-to-br from-[#1e1f29] via-[#1a1b26] to-[#282a36] border border-[#bd93f9]/30 rounded-2xl p-4.5 shadow-[0_8px_25px_-4px_rgba(189,147,249,0.18)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-[#bd93f9]/5 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="space-y-2 max-w-xl relative自 z-10">
              <div className="flex items-center gap-2">
                <span className="p-1 px-2.5 rounded-full bg-[#bd93f9]/10 text-[#bd93f9] border border-[#bd93f9]/25 text-[8.5px] font-mono font-bold tracking-wider uppercase flex items-center gap-1">
                  <Quote className="w-2.5 h-2.5 text-[#bd93f9]" />
                  Planetary Wisdom
                </span>
                <span className="text-[9px] text-[#6272a4] font-mono">
                  Concept: {ECO_QUOTES[advisorQuoteIndex].context}
                </span>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
    key={advisorQuoteIndex}
    initial={{ opacity: 0, x: -6 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 6 }}
    className="space-y-1"
  >
                  <p className="text-sm font-medium text-white italic leading-relaxed font-sans">
                    "{ECO_QUOTES[advisorQuoteIndex].text}"
                  </p>
                  <p className="text-xs text-[#50fa7b] font-semibold font-mono">
                    — {ECO_QUOTES[advisorQuoteIndex].author}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex sm:flex-col items-stretch gap-2 shrink-0 w-full sm:w-auto z-10">
              <button
    id="btn-rotate-advisor-wisdom-quote"
    onClick={() => setAdvisorQuoteIndex((prev) => (prev + 1) % ECO_QUOTES.length)}
    className="flex-1 sm:flex-none text-[10px] uppercase tracking-wider font-mono font-bold py-2 px-3.5 bg-black/45 hover:bg-white/5 text-slate-300 hover:text-white rounded-xl border border-white/5 transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
    title="Rotate to another inspiring planetary quote"
  >
                <RefreshCw className="w-3 h-3 text-[#bd93f9] animate-spin-slow" />
                Cycle Wisdom
              </button>
              
              <button
    id="btn-ask-ember-about-quote"
    onClick={() => {
      const quote = ECO_QUOTES[advisorQuoteIndex];
      const prompt = `Let's discuss the deeper practical and ecological meaning of this quote by ${quote.author}: "${quote.text}". How does this philosophy translates to everyday consumer footprint offsets?`;
      handleSendMessage(prompt, "chat");
    }}
    className="flex-1 sm:flex-none text-[10px] uppercase tracking-wider font-mono font-extrabold py-2 px-3.5 bg-[#bd93f9] hover:bg-[#8c5af5] text-white rounded-xl transition-all duration-200 active:scale-95 shadow-lg flex items-center justify-center gap-1.5 border-none cursor-pointer text-center"
    title="Ask Ember to analyze this quote in the chat"
  >
                <Sparkles className="w-3 h-3 text-white" />
                Discuss Philosophy
              </button>
            </div>
          </div>

          {
    /* 🌱 Today's Daily Habit Reflection Card */
  }
      <div id="daily-habit-reflection-container" className="mb-4 bg-gradient-to-r from-[#1e1f29] via-[#242634] to-[#1e1f29] border border-[#bd93f9]/30 rounded-2xl p-4 shadow-[0_8px_20px_-4px_rgba(189,147,249,0.15)] flex flex-col text-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-[#bd93f9]/10 text-[#bd93f9] border border-[#bd93f9]/20 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-[#bd93f9]" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                Daily Habit Reflection
                <span className="text-[8px] uppercase tracking-widest font-mono font-bold text-[#ff79c6] bg-[#ff79c6]/10 px-2 py-0.5 rounded border border-[#ff79c6]/20 animate-pulse">
                  Bonus Insight
                </span>
              </h4>
              <p className="text-[10px] text-slate-400">Identify hidden carbon leakage in your daily routine</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
    id="btn-cycle-reflection-prompt"
    onClick={handleCycleReflection}
    className="text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all p-1.5 rounded-lg flex items-center justify-center cursor-pointer border-none bg-transparent"
    title="Next prompt/question"
    aria-label="Next reflection prompt"
  >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
    id="btn-toggle-reflection-panel"
    onClick={() => setReflectionBannerExpanded(!reflectionBannerExpanded)}
    className="text-slate-400 hover:text-white hover:bg-white/5 active:scale-95 transition-all p-1.5 rounded-lg flex items-center justify-center cursor-pointer border-none bg-transparent"
    title={reflectionBannerExpanded ? "Collapse panel" : "Expand panel"}
    aria-label={reflectionBannerExpanded ? "Collapse reflection panel" : "Expand reflection panel"}
  >
              {reflectionBannerExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {reflectionBannerExpanded && <motion.div
    initial={{ height: 0, opacity: 0, marginTop: 0 }}
    animate={{ height: "auto", opacity: 1, marginTop: 12 }}
    exit={{ height: 0, opacity: 0, marginTop: 0 }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
    className="overflow-hidden border-t border-white/5 pt-3"
  >
              {
    /* Embedded Prompt Layout */
  }
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="text-xl shrink-0 mt-0.5">{reflectionPrompts[currentReflectionIndex].icon}</span>
                  <div className="space-y-0.5 overflow-hidden">
                    <span className="text-[8.5px] font-mono tracking-wider font-bold text-[#bd93f9] uppercase bg-[#bd93f9]/5 border border-[#bd93f9]/20 px-2 py-0.5 rounded">
                      Topic: {reflectionPrompts[currentReflectionIndex].topic}
                    </span>
                    <p className="text-xs font-semibold text-white leading-relaxed mt-1">
                      {reflectionPrompts[currentReflectionIndex].question}
                    </p>
                  </div>
                </div>

                {
    /* Options List */
  }
                {selectedReflectionAnswer === null ? <div className="grid grid-cols-1 gap-2" id="reflection-options-grid">
                    {reflectionPrompts[currentReflectionIndex].options.map((opt, oIndex) => <button
    key={oIndex}
    id={`btn-reflection-opt-${oIndex}`}
    onClick={() => setSelectedReflectionAnswer(oIndex)}
    className="w-full text-left text-xs bg-[#1e1f29] hover:bg-[#282a36] border border-white/5 hover:border-[#bd93f9]/30 p-2.5 rounded-xl text-slate-300 hover:text-white transition-all duration-200 active:scale-[0.99] cursor-pointer shadow-inner"
  >
                        <span className="inline-block w-4.5 h-4.5 rounded-full text-[9px] font-mono font-bold bg-[#1e1f29] border border-slate-600 text-slate-400 text-center leading-4 mr-2">
                          {String.fromCharCode(65 + oIndex)}
                        </span>
                        {opt.label}
                      </button>)}
                  </div> : (
    /* Reflection Answer Insight Outcome Render */
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/45 border border-[#bd93f9]/20 p-3.5 rounded-xl space-y-3"
      id="reflection-insight-result"
    >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Your Selection & Impact Profile:</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9.5px] font-mono font-bold px-2.5 py-0.5 rounded ${reflectionPrompts[currentReflectionIndex].options[selectedReflectionAnswer].impact > 0 ? "bg-[#ff5555]/15 text-[#ff5555] border border-[#ff5555]/30" : "bg-[#50fa7b]/15 text-[#50fa7b] border border-[#50fa7b]/30"}`}>
                          {reflectionPrompts[currentReflectionIndex].options[selectedReflectionAnswer].impact > 0 ? `+${reflectionPrompts[currentReflectionIndex].options[selectedReflectionAnswer].impact.toFixed(1)} kg CO2e / Day` : "0.0 kg (Eco-Balanced)"}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-200 space-y-2">
                      <p className="font-bold text-[#8be9fd] text-[11.5px] flex items-center gap-1.5">
                        <span>💡 Hidden Habit Advice:</span>
                      </p>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        {reflectionPrompts[currentReflectionIndex].options[selectedReflectionAnswer].advice}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
      id="btn-discuss-habit-ai"
      onClick={() => handleDiscussHabit(
        reflectionPrompts[currentReflectionIndex].topic,
        reflectionPrompts[currentReflectionIndex].options[selectedReflectionAnswer].label,
        reflectionPrompts[currentReflectionIndex].options[selectedReflectionAnswer].impact
      )}
      className="text-[10px] uppercase font-mono font-bold py-1.5 px-3 bg-[#bd93f9] hover:bg-[#8c5af5] text-white rounded-lg transition-all flex items-center gap-1.5 shadow cursor-pointer active:scale-95 border-none"
    >
                        <Send className="w-3 h-3" /> Ask Ember
                      </button>
                      <button
      id="btn-next-reflection-habit"
      onClick={handleCycleReflection}
      className="text-[10px] uppercase font-mono font-bold py-1.5 px-3 bg-[#1e1f29] hover:bg-white/5 text-slate-300 rounded-lg transition-all flex items-center gap-1.5 border border-white/5 cursor-pointer hover:text-white"
    >
                        <RefreshCw className="w-3 h-3" /> Next Prompt
                      </button>
                    </div>
                  </motion.div>
  )}
              </div>
            </motion.div>}
        </AnimatePresence>
      </div>

      {
    /* Chat messages viewport */
  }
      <div id="guardian-chat-grid" className="flex-1 min-h-[250px] max-h-[300px] overflow-y-auto space-y-3.5 pr-2 mb-4 border border-[#bd93f9]/15 p-4 bg-[#1e1f29]/60 rounded-2xl shadow-inner animate-fade-in">
        {messages.map((msg) => <div
    key={msg.id}
    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
  >
            <div className={`max-w-[85%] rounded-2xl p-4 text-xs flex gap-3 items-start ${msg.sender === "user" ? "bg-gradient-to-br from-[#bd93f9] to-[#ff79c6] text-[#1e1f29] rounded-tr-none shadow font-bold" : "bg-black/40 text-slate-200 border border-white/5 rounded-tl-none"}`}>
              {msg.sender === "assistant" ? <div className="w-5.5 h-5.5 rounded-lg bg-[#282a36] text-[#bd93f9] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#bd93f9]/20">
                  <Terminal className="w-3 h-3" />
                </div> : <div className="w-5.5 h-5.5 rounded-lg bg-black text-slate-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/10">
                  <User className="w-3 h-3" />
                </div>}
              <div className="space-y-1">
                {msg.sender === "user" ? <p className="whitespace-pre-line leading-relaxed text-left font-sans font-semibold text-slate-900">{msg.text}</p> : <div className="space-y-1 select-text text-left">
                    {formatAssistantText(msg.text)}
                  </div>}
                <span className="block text-[8px] text-right font-mono opacity-50 mt-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          </div>)}
        {loading && <div className="flex justify-start">
            <div className="bg-black/30 border border-white/5 rounded-2xl rounded-tl-none p-4 flex items-center gap-2.5 text-xs text-[#6272a4] shadow animate-pulse">
              <Sparkles className="w-4 h-4 text-[#bd93f9] animate-spin" />
              <span>Ember is calculating environmental parameters...</span>
            </div>
          </div>}
        <div ref={chatEndRef} />
      </div>

      {
    /* Quick Action Pledges Grid */
  }
      <div id="quick-habits-pledges" className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 text-left">
        {quickPledges.map((qp, i) => <button
    key={i}
    id={`quick-pledge-${i}`}
    onClick={() => handleSendMessage(qp.prompt, qp.type)}
    disabled={loading}
    className="text-xs text-left bg-[#1e1f29]/60 hover:bg-white/5 text-slate-300 hover:text-white p-3 rounded-2xl border border-white/5 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-inner"
  >
            <Zap className="w-4 h-4 text-[#bd93f9] shrink-0" />
            <div className="overflow-hidden">
              <p className="font-bold truncate">{qp.label}</p>
            </div>
          </button>)}
      </div>

      {
    /* Input console control */
  }
      <div className="flex gap-2">
        <input
    type="text"
    id="chat-console-input-str"
    value={inputText}
    onChange={(e) => setInputText(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") handleSendMessage(inputText);
    }}
    className="flex-1 bg-[#1e1f29] border border-white/5 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#bd93f9]/70 transition-all font-sans placeholder:text-slate-650"
    placeholder="Assess carbon reduction options (e.g. going vegan)..."
    disabled={loading}
  />
        <button
    onClick={() => handleSendMessage(inputText)}
    id="btn-trigger-ai-chat"
    className="bg-[#bd93f9] hover:bg-[#8c5af5] text-white rounded-2xl w-11 h-11 flex items-center justify-center flex-shrink-0 border-none shadow cursor-pointer clay-puffy"
    disabled={loading || !inputText.trim()}
  >
          <Send className="w-4 h-4 text-white" />
        </button>
      </div>

      {
    /* Interactive AI Challenges Recommendation Block */
  }
      {activeChallenges.length > 0 && <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    id="ai-challenges-proposals"
    className="mt-4 pt-4 border-t border-white/5"
  >
          <div className="flex items-center gap-1.5 mb-3 text-xs font-bold text-slate-200 text-left">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-300" />
            <span>Opt into Recommended Pledges</span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {activeChallenges.map((challenge) => <div
    key={challenge.id}
    id={`challenge-card-${challenge.id}`}
    className="bg-black/50 border border-white/5 rounded-2xl p-4 flex justify-between items-center text-xs text-left"
  >
                <div className="mr-3 overflow-hidden space-y-1">
                  <h5 className="font-bold text-white truncate flex items-center gap-1">
                    {challenge.title}
                  </h5>
                  <p className="text-[10px] text-[#6272a4] leading-normal">{challenge.description}</p>
                  <span className="inline-block bg-[#1e1f29] text-[#8be9fd] text-[8.5px] font-mono font-bold rounded-full px-2.5 py-0.5 mt-1.5 uppercase border border-[#bd93f9]/20">
                    -{challenge.co2SavedPerDay} kg CO2e / Day Savings
                  </span>
                </div>
                <button
    onClick={() => handleCommitChallenge(challenge)}
    id={`btn-accept-${challenge.id}`}
    className="white font-sans font-bold py-2 px-4 rounded-xl flex items-center gap-1 cursor-pointer shrink-0 text-xs clay-btn-green clay-puffy"
  >
                  <Check className="w-3.5 h-3.5" /> Commit
                </button>
              </div>)}
          </div>
        </motion.div>}
        </> : (
    /* 🔮 Predictive Future Dashboard Tab View */
    <div className="space-y-4 text-left" id="predictive-future-dashboard">
          
          {
      /* Header Metric Cards Row */
    }
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#1e1f29]/70 border border-white/5 rounded-2xl p-4 flex flex-col justify-between shadow-inner">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#ff79c6] tracking-wider font-bold">1-Yr Status Quo</span>
                <p className="text-2xl font-bold font-sans text-white mt-1">
                  {annualBAUEmissions.toFixed(2)} <span className="text-xs font-mono text-slate-400">Tons CO2e</span>
                </p>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Projection holding standard daily habits</p>
            </div>

            <div className="bg-[#1e1f29]/70 border border-white/5 rounded-2xl p-4 flex flex-col justify-between shadow-inner">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#50fa7b] tracking-wider font-bold">Projected Savings</span>
                <p className="text-2xl font-bold font-sans text-[#50fa7b] mt-1">
                  -{simulatedSavingsYearly.toFixed(2)} <span className="text-xs font-mono text-slate-400">Tons</span>
                </p>
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Avoiding emission factors through simulated steps</p>
            </div>

            <div className="bg-[#1e1f29]/70 border border-[#50fa7b]/20 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#111218] to-[#1e1f29] shadow-md">
              <div className="absolute top-0 right-0 p-1.5 bg-[#50fa7b]/10 text-[#50fa7b] rounded-bl-xl border-l border-b border-[#50fa7b]/15 text-[8.5px] font-mono font-bold tracking-widest uppercase">
                Goal Signature
              </div>
              <div className="mt-1">
                <span className="text-[10px] font-mono uppercase text-[#8be9fd] tracking-wider font-bold">Simulated Outcome</span>
                <p className="text-2xl font-bold font-sans text-white mt-1">
                  {targetEmissionsGoal.toFixed(2)} <span className="text-xs font-mono text-slate-400">Tons</span>
                </p>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-[#50fa7b]" /> Equivalent to <strong>{equivalencyTrees} trees/yr</strong>
              </p>
            </div>
          </div>

          {
      /* Recharts Cumulative 1-Year Chart */
    }
          <div className="bg-[#1e1f29]/40 border border-[#bd93f9]/10 rounded-2xl p-4 flex flex-col shadow-inner">
            <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#bd93f9]" /> Cumulative 12-Month Projection
                </h4>
                <p className="text-[10px] text-slate-400">Compare maintaining current habits against custom future adjustments</p>
              </div>
              <span className="text-[8.5px] font-mono py-0.5 px-2 bg-[#1e1f29] border border-white/5 rounded-lg text-slate-300">
                Unit: Metric Tonnes CO2e
              </span>
            </div>

            <div className="w-full h-[220px]" id="future-projection-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
      data={projectedFutureData}
      margin={{ top: 10, right: 15, left: -25, bottom: 5 }}
    >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                  <XAxis
      dataKey="month"
      tick={{ fill: "#6272a4", fontSize: 9, fontFamily: "monospace" }}
      axisLine={false}
      tickLine={false}
    />
                  <YAxis
      tick={{ fill: "#6272a4", fontSize: 9, fontFamily: "monospace" }}
      axisLine={false}
      tickLine={false}
      domain={[0, "auto"]}
    />
                  <Tooltip
      content={({ active, payload }) => {
        if (active && payload && payload.length) {
          return <div className="bg-[#111218]/95 backdrop-blur-sm border border-[#bd93f9]/30 rounded-xl p-2.5 text-left text-[11px] min-w-[170px] shadow-2xl z-50">
                            <p className="font-mono text-[9px] uppercase tracking-wider text-[#6272a4] font-bold pb-1.5 border-b border-white/5 mb-1.5">
                              {payload[0].payload.month} Cumulative
                            </p>
                            <div className="space-y-1">
                              <div className="flex justify-between items-center gap-3">
                                <span className="text-slate-300">Status Quo:</span>
                                <span className="font-mono font-bold text-[#ff79c6]">{payload[0].value} T</span>
                              </div>
                              <div className="flex justify-between items-center gap-3 border-t border-white/5 pt-1 mt-1">
                                <span className="text-slate-200 font-semibold">Eco Adjusted:</span>
                                <span className="font-mono font-bold text-[#50fa7b]">{payload[1].value} T</span>
                              </div>
                            </div>
                          </div>;
        }
        return null;
      }}
    />
                  <Legend
      verticalAlign="bottom"
      iconSize={7}
      iconType="circle"
      content={({ payload }) => <div className="flex justify-center items-center gap-4 text-[9px] font-mono mt-3">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ff79c6]" />
                          <span>Status Quo (BAU)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#50fa7b]" />
                          <span>Sustainable Lifestyle Target</span>
                        </div>
                      </div>}
    />
                  <Line
      type="monotone"
      dataKey="Business As Usual (BAU)"
      stroke="#ff79c6"
      strokeWidth={2.5}
      dot={false}
      activeDot={{ r: 4 }}
    />
                  <Line
      type="monotone"
      dataKey="With Eco Adjustments"
      stroke="#50fa7b"
      strokeWidth={2.5}
      dot={false}
      activeDot={{ r: 4 }}
    />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>

          {
      /* Simulator Switches */
    }
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono text-[#bd93f9] pt-1">
              Test Future Scenarios
            </h4>
            <p className="text-[10px] text-slate-400">Toggle habit parameters to live-update your 1-Year Cumulative footprint pathway</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {simulators.map((sim) => <button
      key={sim.id}
      id={`sim-${sim.id}`}
      onClick={() => handleToggleSimulator(sim.id)}
      className={`text-left p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${sim.active ? "bg-[#1e1f29]/95 border-[#50fa7b]/40 text-white shadow" : "bg-[#1e1f29]/30 border-white/5 text-slate-300 hover:border-white/10 hover:bg-white/5 shadow-inner"}`}
    >
                  <div className="flex items-start gap-2.5 overflow-hidden pr-2">
                    <span className="text-lg shrink-0 mt-0.5">{sim.icon}</span>
                    <div className="overflow-hidden space-y-0.5">
                      <p className="font-bold text-xs truncate">{sim.label}</p>
                      <p className="text-[9.5px] text-slate-400 leading-tight line-clamp-2">{sim.desc}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0 gap-1 pl-1">
                    <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded ${sim.active ? "bg-[#50fa7b]/15 text-[#50fa7b] border border-[#50fa7b]/20" : "bg-black/40 text-[#bd93f9]/70 border border-white/5"}`}>
                      -{sim.co2SavedYearly} kg/yr
                    </span>
                    <span className={`text-[8.5px] font-semibold ${sim.active ? "text-[#50fa7b]" : "text-slate-500"}`}>
                      {sim.active ? "Simulated" : "Include"}
                    </span>
                  </div>
                </button>)}
            </div>
          </div>

          {
      /* Interactive Advice & Navigation Link back to AI Chat and Pledges */
    }
          <div className="bg-[#1e1f29]/60 border border-[#bd93f9]/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-left">
            <div className="space-y-1">
              <h5 className="text-xs font-bold text-[#8be9fd] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Environmental Outlook Analyst
              </h5>
              <p className="text-[10.5px] text-slate-305 leading-relaxed max-w-lg">
                Your simulated habits would save <strong className="text-[#50fa7b] font-bold">{(simulatedSavingsYearly * 1e3).toFixed(0)} kg CO2e</strong> next year. Discuss your custom Roadmap with Ember to formulate actual executable milestones!
              </p>
            </div>
            
            <button
      id="btn-consult-simulated"
      onClick={handleDiscussSimulatedCommitments}
      className="w-full sm:w-auto text-xs font-bold font-sans py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-all duration-300 active:scale-95 border-none clay-btn-purple text-white shadow-lg"
    >
              Consult Ember AI <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
  )}
    </div>;
}
function BotIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" opacity="0.4" />
      <circle cx="12" cy="12" r="5" fill="#bd93f9" fillOpacity="0.2" />
      <path d="M10 10.5h.01M14 10.5h.01M9 14.5c.6 1 1.8 1.5 3 1.5s2.4-.5 3-1.5" strokeLinecap="round" />
    </svg>;
}
