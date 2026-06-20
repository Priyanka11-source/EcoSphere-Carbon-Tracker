/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Leaf,
  Calendar,
  Sparkles,
  History,
  User,
  Bot,
  Edit2,
  Check,
  X,
  Award,
  Download,
  ArrowUp,
  ArrowDown,
  Compass,
  LogOut,
  Loader2,
  Trophy
} from "lucide-react";
import EcoSphereLogo from "./components/EcoSphereLogo";
import ActiveEcoGarden from "./components/ActiveEcoGarden";
import DailyLedger from "./components/DailyLedger";
import AIEcoGuardian from "./components/AIEcoGuardian";
import WeeklyTrendChart from "./components/WeeklyTrendChart";
import EnvironmentalInsights from "./components/EnvironmentalInsights";
import InteractiveOffsetStatement from "./components/InteractiveOffsetStatement";
import EcoLeaderboardAndBadges from "./components/EcoLeaderboardAndBadges";
import AuthScreen from "./components/AuthScreen";
import { auth, db, signOut, onAuthStateChanged } from "./lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
const tabStyles = {
  garden: {
    activeBg: "bg-[#50fa7b]/15 border-[#50fa7b]/40",
    activeText: "text-[#50fa7b] font-extrabold",
    activeShadow: "shadow-[0_0_20px_rgba(80,250,123,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]",
    hoverText: "hover:text-[#50fa7b]",
    activeIconColor: "text-[#50fa7b]"
  },
  ledger: {
    activeBg: "bg-[#8be9fd]/15 border-[#8be9fd]/40",
    activeText: "text-[#8be9fd] font-extrabold",
    activeShadow: "shadow-[0_0_20px_rgba(139,233,253,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]",
    hoverText: "hover:text-[#8be9fd]",
    activeIconColor: "text-[#8be9fd]"
  },
  commitments: {
    activeBg: "bg-[#ff79c6]/15 border-[#ff79c6]/40",
    activeText: "text-[#ff79c6] font-extrabold",
    activeShadow: "shadow-[0_0_20px_rgba(255,121,198,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]",
    hoverText: "hover:text-[#ff79c6]",
    activeIconColor: "text-[#ff79c6]"
  },
  statement: {
    activeBg: "bg-[#f1fa8c]/15 border-[#f1fa8c]/40",
    activeText: "text-[#f1fa8c] font-extrabold",
    activeShadow: "shadow-[0_0_20px_rgba(241,250,140,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]",
    hoverText: "hover:text-[#f1fa8c]",
    activeIconColor: "text-[#f1fa8c]"
  },
  insights: {
    activeBg: "bg-[#ffb86c]/15 border-[#ffb86c]/40",
    activeText: "text-[#ffb86c] font-extrabold",
    activeShadow: "shadow-[0_0_20px_rgba(255,184,108,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]",
    hoverText: "hover:text-[#ffb86c]",
    activeIconColor: "text-[#ffb86c]"
  },
  trends: {
    activeBg: "bg-[#50fa7b]/15 border-[#50fa7b]/40",
    activeText: "text-[#50fa7b] font-extrabold",
    activeShadow: "shadow-[0_0_20px_rgba(80,250,123,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]",
    hoverText: "hover:text-[#50fa7b]",
    activeIconColor: "text-[#50fa7b]"
  },
  milestones: {
    activeBg: "bg-amber-500/15 border-amber-500/40",
    activeText: "text-amber-400 font-extrabold",
    activeShadow: "shadow-[0_0_20px_rgba(245,158,11,0.3),inset_0_1px_1px_rgba(255,255,255,0.1)]",
    hoverText: "hover:text-amber-400",
    activeIconColor: "text-amber-400"
  },
  advisor: {
    activeBg: "bg-[#bd93f9]/15 border-[#bd93f9]/40",
    activeText: "text-[#bd93f9] font-extrabold",
    activeShadow: "shadow-[0_0_20px_rgba(189,147,249,0.35),inset_0_1px_1px_rgba(255,255,255,0.1)]",
    hoverText: "hover:text-[#bd93f9]",
    activeIconColor: "text-[#bd93f9]"
  }
};
export default function App() {
  const [activeTab, setActiveTab] = useState("garden");
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isDataSynced, setIsDataSynced] = useState(false);
  const [dbError, setDbError] = useState(null);
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [totalKarmaPoints, setTotalKarmaPoints] = useState(230);
  const [userProfile, setUserProfile] = useState({
    name: "Priyanka",
    email: "priyankapriyadarsinibej@gmail.com",
    avatar: "icon-leaf",
    archetype: "Carbon Pioneer"
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState("Priyanka");
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [weeklyChallenges, setWeeklyChallenges] = useState([]);
  useEffect(() => {
    setTempName(userProfile.name);
  }, [userProfile.name]);
  const loadUserData = async (user) => {
    setAuthLoading(true);
    setDbError(null);
    const userDocRef = doc(db, "users", user.uid);
    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.totalKarmaPoints !== void 0) setTotalKarmaPoints(data.totalKarmaPoints);
        if (data.userProfile) setUserProfile(data.userProfile);
        if (data.ledgerEntries) setLedgerEntries(data.ledgerEntries);
        if (data.weeklyChallenges) setWeeklyChallenges(data.weeklyChallenges);
        if (data.unlockedBadges) {
          setUnlockedBadges(data.unlockedBadges);
        } else {
          const initialBadges = [
            { id: "badge_rookie", name: "Quantum Ranger", unlockedDate: "Jun 15, 2026" }
          ];
          const points = data.totalKarmaPoints !== void 0 ? data.totalKarmaPoints : 230;
          if (points >= 120) initialBadges.push({ id: "badge_diet", name: "Plant Food Overlord", unlockedDate: "Jun 15, 2026" });
          if (points >= 200) initialBadges.push({ id: "badge_transit", name: "Tachyon Transit Rider", unlockedDate: "Jun 15, 2026" });
          if (points >= 350) initialBadges.push({ id: "badge_grid", name: "Fusion Grid Master", unlockedDate: "Jun 20, 2026" });
          if (points >= 500) initialBadges.push({ id: "badge_champion", name: "EcoSphere Sovereign", unlockedDate: "Jun 20, 2026" });
          setUnlockedBadges(initialBadges);
        }
        setIsDataSynced(true);
      } else {
        const initialProfile = {
          name: user.displayName || user.email?.split("@")[0] || "Priyanka Bej",
          email: user.email || "",
          avatar: "icon-leaf",
          archetype: "Carbon Pioneer"
        };
        const defaults = {
          totalKarmaPoints: 230,
          userProfile: initialProfile,
          unlockedBadges: [
            { id: "badge_rookie", name: "Quantum Ranger", unlockedDate: "Jun 15, 2026" },
            { id: "badge_diet", name: "Plant Food Overlord", unlockedDate: "Jun 15, 2026" },
            { id: "badge_transit", name: "Tachyon Transit Rider", unlockedDate: "Jun 15, 2026" }
          ],
          ledgerEntries: [
            {
              id: "base_1",
              category: "transport",
              description: "Gasoline vehicle commute to workspace",
              value: 20,
              unit: "km",
              carbonImpact: 5.6,
              date: "Jun 14, 2026",
              isReduction: false
            },
            {
              id: "base_2",
              category: "food",
              description: "Locally sourced garden salad lunch",
              value: 1,
              unit: "meals",
              carbonImpact: 0.4,
              date: "Jun 14, 2026",
              isReduction: true
            },
            {
              id: "base_3",
              category: "energy",
              description: "HVAC cooling units left running on standby",
              value: 4,
              unit: "hours",
              carbonImpact: 6,
              date: "Jun 15, 2026",
              isReduction: false
            }
          ],
          weeklyChallenges: [
            {
              id: "ch-1",
              title: "Silent Charger Pledge",
              description: "Unplug laptop and phone adapters when fully charged to eliminate standby energy waste.",
              category: "energy",
              co2SavedPerDay: 0.6,
              completed: false,
              daysDuration: 7,
              daysSucceeded: 3
            },
            {
              id: "ch-2",
              title: "Plant-Based Lunches",
              description: "Commit to plant-based lunches to lower livestock footprint impact factors.",
              category: "food",
              co2SavedPerDay: 1.8,
              completed: false,
              daysDuration: 5,
              daysSucceeded: 2
            }
          ]
        };
        await setDoc(userDocRef, defaults);
        setUserProfile(initialProfile);
        setTotalKarmaPoints(defaults.totalKarmaPoints);
        setUnlockedBadges(defaults.unlockedBadges);
        setLedgerEntries(defaults.ledgerEntries);
        setWeeklyChallenges(defaults.weeklyChallenges);
        setIsDataSynced(true);
      }
    } catch (err) {
      console.error("Error loading profile from firestore:", err);
      setDbError(err.message || "Failed to establish database connection.");
      setIsDataSynced(false);
      setUserProfile({
        name: user.displayName || user.email?.split("@")[0] || "Priyanka Bej",
        email: user.email || "",
        avatar: "icon-leaf",
        archetype: "Carbon Pioneer"
      });
      setTotalKarmaPoints(230);
      setLedgerEntries([
        {
          id: "base_1",
          category: "transport",
          description: "Gasoline vehicle commute to workspace (Offline)",
          value: 20,
          unit: "km",
          carbonImpact: 5.6,
          date: "Jun 14, 2026",
          isReduction: false
        },
        {
          id: "base_2",
          category: "food",
          description: "Locally sourced garden salad lunch (Offline)",
          value: 1,
          unit: "meals",
          carbonImpact: 0.4,
          date: "Jun 14, 2026",
          isReduction: true
        }
      ]);
      setWeeklyChallenges([
        {
          id: "ch-1",
          title: "Silent Charger Pledge (Offline)",
          description: "Unplug laptop and phone adapters when fully charged to eliminate standby energy waste.",
          category: "energy",
          co2SavedPerDay: 0.6,
          completed: false,
          daysDuration: 7,
          daysSucceeded: 3
        }
      ]);
    } finally {
      setAuthLoading(false);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserData(user);
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        setIsDataSynced(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    if (!isDataSynced || !currentUser) return;
    const badgeCriteriaList = [
      { id: "badge_rookie", name: "Quantum Ranger", threshold: 10 },
      { id: "badge_diet", name: "Plant Food Overlord", threshold: 120 },
      { id: "badge_transit", name: "Tachyon Transit Rider", threshold: 200 },
      { id: "badge_grid", name: "Fusion Grid Master", threshold: 350 },
      { id: "badge_champion", name: "EcoSphere Sovereign", threshold: 500 }
    ];
    let updated = false;
    const nextUnlocked = [...unlockedBadges];
    badgeCriteriaList.forEach((badge) => {
      const alreadyAwarded = nextUnlocked.some((b) => b.id === badge.id);
      if (!alreadyAwarded && totalKarmaPoints >= badge.threshold) {
        nextUnlocked.push({
          id: badge.id,
          name: badge.name,
          unlockedDate: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        });
        updated = true;
      }
    });
    if (updated) {
      setUnlockedBadges(nextUnlocked);
    }
  }, [totalKarmaPoints, unlockedBadges, isDataSynced, currentUser]);
  useEffect(() => {
    if (!isDataSynced || !currentUser) return;
    const userDocRef = doc(db, "users", currentUser.uid);
    setDoc(userDocRef, {
      totalKarmaPoints,
      userProfile,
      ledgerEntries,
      weeklyChallenges,
      unlockedBadges
    }, { merge: true }).catch((err) => console.error("Error backing up to Firestore:", err));
  }, [totalKarmaPoints, userProfile, ledgerEntries, weeklyChallenges, unlockedBadges, currentUser, isDataSynced]);
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setTotalKarmaPoints(230);
      setUserProfile({
        name: "Priyanka",
        email: "priyankapriyadarsinibej@gmail.com",
        avatar: "icon-leaf",
        archetype: "Carbon Pioneer"
      });
      setLedgerEntries([]);
      setWeeklyChallenges([]);
      setIsDataSynced(false);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };
  const carbonStats = useMemo(() => {
    const BASELINE_DAILY = 14.5;
    let directImpact = 0;
    let reductionsAvoided = 0;
    ledgerEntries.forEach((entry) => {
      if (entry.isReduction) {
        reductionsAvoided += entry.carbonImpact;
      } else {
        directImpact += entry.carbonImpact;
      }
    });
    weeklyChallenges.forEach((challenge) => {
      if (challenge.completed) {
        reductionsAvoided += challenge.co2SavedPerDay * challenge.daysDuration;
      } else {
        reductionsAvoided += challenge.co2SavedPerDay * challenge.daysSucceeded;
      }
    });
    const computedAverage = Math.max(1.8, BASELINE_DAILY + directImpact - reductionsAvoided);
    return {
      averageFootprint: computedAverage,
      totalCarbonSaved: reductionsAvoided,
      isGreenHero: computedAverage < 8,
      isCautionZone: computedAverage >= 18
    };
  }, [ledgerEntries, weeklyChallenges]);
  const dailyIndexTrend = useMemo(() => {
    const BASELINE_DAILY = 14.5;
    const todayDate = /* @__PURE__ */ new Date();
    const todayDateStr = todayDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const yesterdayDate = /* @__PURE__ */ new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayDateStr = yesterdayDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    let todayDirect = 0;
    let todayReduction = 0;
    let yesterdayDirect = 0;
    let yesterdayReduction = 0;
    ledgerEntries.forEach((entry) => {
      if (entry.date === todayDateStr) {
        if (entry.isReduction) {
          todayReduction += entry.carbonImpact;
        } else {
          todayDirect += entry.carbonImpact;
        }
      } else if (entry.date === yesterdayDateStr) {
        if (entry.isReduction) {
          yesterdayReduction += entry.carbonImpact;
        } else {
          yesterdayDirect += entry.carbonImpact;
        }
      }
    });
    const todayNet = Math.max(1.8, BASELINE_DAILY + todayDirect - todayReduction);
    const yesterdayNet = Math.max(1.8, BASELINE_DAILY + yesterdayDirect - yesterdayReduction);
    const diff = todayNet - yesterdayNet;
    let trend = "stable";
    if (diff > 0.05) {
      trend = "up";
    } else if (diff < -0.05) {
      trend = "down";
    }
    return {
      todayNet,
      yesterdayNet,
      diff,
      trend
    };
  }, [ledgerEntries]);
  const handleAddEntry = (entry) => {
    setLedgerEntries((prev) => [...prev, entry]);
    setTotalKarmaPoints((prev) => prev + (entry.isReduction ? 40 : 10));
  };
  const handleRemoveEntry = (id) => {
    setLedgerEntries((prev) => prev.filter((e) => e.id !== id));
  };
  const handleExportCSV = () => {
    if (ledgerEntries.length === 0) return;
    const headers = ["Date", "Category", "Description", "Value", "Unit", "Carbon Impact (kg CO2e)", "Type"];
    const rows = ledgerEntries.map((entry) => [
      `"${entry.date.replace(/"/g, '""')}"`,
      `"${entry.category.replace(/"/g, '""')}"`,
      `"${entry.description.replace(/"/g, '""')}"`,
      entry.value,
      `"${entry.unit.replace(/"/g, '""')}"`,
      entry.isReduction ? -entry.carbonImpact : entry.carbonImpact,
      entry.isReduction ? "Reduction" : "Footprint"
    ]);
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `EcoSphere_Carbon_Ledger_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleAddChallenge = (challenge) => {
    if (weeklyChallenges.some((ch) => ch.title === challenge.title)) return;
    setWeeklyChallenges((prev) => [...prev, challenge]);
    setTotalKarmaPoints((prev) => prev + 15);
  };
  const handleToggleChallenge = (id) => {
    setWeeklyChallenges((prev) => prev.map((ch) => {
      if (ch.id === id) {
        const nextCompleted = !ch.completed;
        if (nextCompleted) {
          setTotalKarmaPoints((p) => p + 50);
        }
        return {
          ...ch,
          completed: nextCompleted,
          daysSucceeded: nextCompleted ? ch.daysDuration : 0
        };
      }
      return ch;
    }));
  };
  const handleCommitOptInChallenge = (challenge) => {
    if (weeklyChallenges.some((ch) => ch.title === challenge.title)) return;
    const uniqueId = `opt-${Date.now()}`;
    handleAddChallenge({
      ...challenge,
      id: uniqueId
    });
  };
  const handleUpdateChallengeProgress = (id, daysSucceeded, completed) => {
    setWeeklyChallenges((prev) => prev.map((ch) => {
      if (ch.id === id) {
        return {
          ...ch,
          daysSucceeded,
          completed: completed || daysSucceeded >= ch.daysDuration
        };
      }
      return ch;
    }));
  };
  const handleGrantKarmaBonus = (points) => {
    setTotalKarmaPoints((prev) => prev + points);
  };
  const handleSaveName = () => {
    const trimmed = tempName.trim();
    if (trimmed) {
      setUserProfile((prev) => ({ ...prev, name: trimmed }));
    }
    setIsEditingName(false);
  };
  const currentLevelForUser = Math.floor(totalKarmaPoints / 150) + 1;
  const renderAvatarIcon = () => {
    const avatar = userProfile.avatar;
    if (avatar === "icon-leaf") return <Leaf className="w-5 h-5 text-[#bd93f9]" />;
    return <User className="w-5 h-5 text-[#bd93f9]" />;
  };
  if (authLoading) {
    return <div className="min-h-screen bg-[#1e1f29] text-[#f8f8f2] flex flex-col items-center justify-center font-sans relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#50fa7b]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-[#bd93f9]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="text-center z-10 flex flex-col items-center justify-center space-y-4">
          <motion.div
      animate={{ scale: [1, 1.08, 1], rotate: [0, 10, -10, 0] }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#bd93f9]/30 to-[#ff79c6]/30 flex items-center justify-center border border-[#bd93f9]/50 shadow-[0_0_25px_rgba(189,147,249,0.35),inset_0_2px_4px_rgba(255,255,255,0.15)]"
    >
            <EcoSphereLogo className="w-8 h-8 filter drop-shadow-[0_0_4px_rgba(189,147,249,0.6)]" />
          </motion.div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold tracking-wider text-slate-100 uppercase font-mono">Calibrating Biosphere</h2>
            <p className="text-[10px] text-[#6272a4] font-mono uppercase tracking-widest font-semibold flex items-center gap-1.5 justify-center">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#8be9fd]" />
              Establishing Secure Database Portals
            </p>
          </div>
        </div>
      </div>;
  }
  if (!currentUser) {
    return <AuthScreen onSuccess={() => {
    }} />;
  }
  return <div className="min-h-screen bg-[#181a23] text-[#f8f8f2] font-sans flex flex-col justify-between relative overflow-x-hidden selection:bg-[#bd93f9]/30 selection:text-[#bd93f9]">
      
      {
    /* ⚠️ Database Connectivity Offline Mode Warning */
  }
      {dbError && <div className="bg-[#ff5555]/15 border-b border-[#ff5555]/30 px-4 py-2 text-center text-[11px] text-[#ff5555] flex items-center justify-center gap-2.5 relative z-50 font-mono shadow-[0_4px_12px_rgba(255,85,85,0.15)] backdrop-blur-sm animate-pulse-slow">
          <span className="font-semibold flex items-center gap-1.5">
            <span>⚠️</span> Cloud synchronization offline (Memory mode). Data will remain local.
          </span>
          <button
    type="button"
    onClick={() => {
      if (currentUser) {
        loadUserData(currentUser);
      }
    }}
    className="cursor-pointer bg-[#ff5555]/20 hover:bg-[#ff5555]/35 hover:text-white rounded-md px-3 py-0.5 text-[9px] uppercase tracking-wider font-bold border border-[#ff5555]/40 transition-all active:scale-95 text-[#f8f8f2]"
  >
            Retry Connection Sync
          </button>
        </div>}

      {
    /* 🔮 Spatial Liquid Glass Floating Orbs */
  }
      <div className="absolute inset-x-0 top-0 h-[800px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20px] left-[15%] w-[450px] h-[450px] rounded-full liquid-orb-1 blur-[110px]" />
        <div className="absolute top-[220px] right-[10%] w-[500px] h-[500px] rounded-full liquid-orb-2 blur-[130px]" />
      </div>

      {
    /* Premium High-Contrast Header Panel with Multi-Neon Flow Lines */
  }
      <header className="premium-header relative w-full transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {
    /* Brand Logo & Description */
  }
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#bd93f9]/30 to-[#ff79c6]/30 flex items-center justify-center border border-[#bd93f9]/50 shadow-[0_0_15px_rgba(189,147,249,0.35),inset_0_2px_4px_rgba(255,255,255,0.15)] hover:rotate-6 transition-all duration-300">
              <EcoSphereLogo className="w-8 h-8 filter drop-shadow-[0_0_4px_rgba(189,147,249,0.6)]" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-medium tracking-tight text-white flex items-center gap-2">
                EcoSphere <span className="text-[9px] font-mono tracking-widest font-bold py-0.5 px-2 bg-[#282a36] text-[#bd93f9] rounded-full border border-[#bd93f9]/60 shadow-[0_0_10px_rgba(189,147,249,0.3)]">CARBON JOURNAL</span>
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-[#8be9fd] font-mono font-semibold">Elegant, interactive offset statement & advisor</p>
            </div>
          </div>

          {
    /* Elegant Profile with Tactile Clay/Skeuomorphic Indicators */
  }
          <div className="flex flex-wrap items-center justify-center gap-3">
            
            {
    /* User Profile Frame (Skeuomorphic bezel) */
  }
            <div className="flex items-center gap-3 bg-black/45 border border-white/5 rounded-2xl p-1.5 px-3.5 shadow-[inset_-2px_-2px_6px_rgba(0,0,0,0.6),2px_2px_4px_rgba(255,255,255,0.05)]">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#282a36] to-[#1e1f29] border border-[#bd93f9]/30 flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
                {renderAvatarIcon()}
              </div>
              <div className="text-left leading-normal flex items-center gap-2">
                {isEditingName ? <div className="flex items-center gap-1.5">
                    <input
    type="text"
    value={tempName}
    onChange={(e) => setTempName(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") handleSaveName();
      if (e.key === "Escape") setIsEditingName(false);
    }}
    className="bg-[#1e1f29] border border-[#bd93f9] rounded-lg px-2 py-0.5 text-xs text-white max-w-[100px] outline-none"
    autoFocus
  />
                    <button onClick={handleSaveName} className="p-1 rounded bg-[#bd93f9] hover:bg-[#8c5af5] text-white cursor-pointer transition-colors">
                      <Check className="w-3 h-3" />
                    </button>
                    <button onClick={() => {
    setTempName(userProfile.name);
    setIsEditingName(false);
  }} className="p-1 rounded bg-[#44475a] hover:bg-rose-950 text-slate-300 cursor-pointer transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </div> : <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white hover:text-[#bd93f9] transition-colors cursor-pointer flex items-center gap-1" onClick={() => setIsEditingName(true)} title="Click to edit designation">
                        {userProfile.name} <Edit2 className="w-2.5 h-2.5 opacity-50" />
                      </span>
                      {
    /* Claymorphic Level Badge */
  }
                      <span className="text-[8px] font-mono py-0.5 px-2 bg-[#ff79c6] text-white rounded-full font-bold uppercase clay-puffy">LVL {currentLevelForUser}</span>
                    </div>
                    <span className="block text-[8.5px] font-mono text-[#6272a4] uppercase tracking-wider">{userProfile.archetype}</span>
                  </div>}
              </div>
            </div>

            {
    /* Sign Out Button */
  }
            {currentUser && <button
    onClick={handleSignOut}
    className="p-2 sm:p-2.5 cursor-pointer bg-black/45 border border-[#ff5555]/30 hover:border-[#ff5555]/60 hover:bg-[#ff5555]/10 rounded-2xl text-[#ff5555] shadow-md transition-all flex items-center justify-center gap-1.5 duration-200"
    title="Sign Out of Atmospheric Session"
  >
                <LogOut className="w-4 h-4" />
                <span className="text-[9px] font-mono tracking-wider font-bold hidden sm:inline uppercase">Sign Out</span>
              </button>}

            {
    /* Quick Stats Grid Pill with Vibrant Neon Glows */
  }
            <div className="flex gap-2.5">
              <div className="bg-black/45 border border-[#ff5555]/40 rounded-2xl py-1.5 px-4 text-center shadow-[inset_0_1px_1px_rgba(255,121,198,0.08),0_0_14px_rgba(255,85,85,0.18)] hover:-translate-y-0.5 transition-transform duration-300">
                <span className="block text-[7.5px] uppercase font-mono text-[#ff5555] tracking-widest font-semibold">DAILY INDEX</span>
                <span className="font-mono font-medium text-xs sm:text-sm text-[#ff5555] flex items-center gap-1.5 justify-center mt-0.5 font-bold">
                  {carbonStats.averageFootprint.toFixed(1)} <span className="text-[9px] font-sans text-[#6272a4] mr-0.5">kg CO2e</span>
                  {dailyIndexTrend.trend === "up" && <span className="flex items-center text-[10px] text-[#ff5555] bg-[#ff5555]/10 px-1 py-0.5 rounded font-mono font-bold" title={`Increased by ${Math.abs(dailyIndexTrend.diff).toFixed(1)} kg over yesterday`}>
                      <ArrowUp className="w-2.5 h-2.5 text-[#ff5555]" />
                      <span>+{Math.abs(dailyIndexTrend.diff).toFixed(1)}</span>
                    </span>}
                  {dailyIndexTrend.trend === "down" && <span className="flex items-center text-[10px] text-[#50fa7b] bg-[#50fa7b]/10 px-1 py-0.5 rounded font-mono font-bold" title={`Decreased by ${Math.abs(dailyIndexTrend.diff).toFixed(1)} kg over yesterday`}>
                      <ArrowDown className="w-2.5 h-2.5 text-[#50fa7b]" />
                      <span>-{Math.abs(dailyIndexTrend.diff).toFixed(1)}</span>
                    </span>}
                </span>
              </div>
              <div className="bg-black/45 border border-[#50fa7b]/40 rounded-2xl py-1.5 px-4 text-center shadow-[inset_0_1px_1px_rgba(80,250,123,0.08),0_0_14px_rgba(80,250,123,0.18)] hover:-translate-y-0.5 transition-transform duration-300">
                <span className="block text-[7.5px] uppercase font-mono text-[#50fa7b] tracking-widest font-semibold">SAVED OFFSET</span>
                <span className="font-mono font-medium text-xs sm:text-sm text-[#50fa7b] flex items-center gap-1 justify-center mt-0.5 font-bold">
                  {carbonStats.totalCarbonSaved.toFixed(1)} <span className="text-[9px] font-sans text-[#6272a4]">kg saved</span>
                </span>
              </div>
            </div>

          </div>

        </div>
      </header>

      {
    /* Main Container */
  }
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8 relative z-10">
        
        {
    /* Spatial Floating Pill Navigation Menu */
  }
        <div id="module-navigation-tabs" className="w-full flex justify-start lg:justify-center z-10 overflow-x-auto scrollbar-none pb-1">
          <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/5 shadow-[0_10px_25px_rgba(0,0,0,0.5)] min-w-max gap-1">
            {[
    { id: "garden", label: "Ecosystem Dome", icon: (active, colorClass) => <Leaf className={`w-3.5 h-3.5 transition-colors duration-300 ${active ? colorClass : "text-[#6272a4] group-hover:text-[#50fa7b]"}`} /> },
    { id: "ledger", label: "Carbon Logs", icon: (active, colorClass) => <History className={`w-3.5 h-3.5 transition-colors duration-300 ${active ? colorClass : "text-[#6272a4] group-hover:text-[#8be9fd]"}`} /> },
    { id: "commitments", label: "Active Pledges", icon: (active, colorClass) => <Sparkles className={`w-3.5 h-3.5 transition-colors duration-300 ${active ? colorClass : "text-[#6272a4] group-hover:text-[#ff79c6]"}`} /> },
    { id: "statement", label: "Offset Statement", icon: (active, colorClass) => <Award className={`w-3.5 h-3.5 transition-colors duration-300 ${active ? colorClass : "text-[#6272a4] group-hover:text-[#f1fa8c]"}`} /> },
    { id: "insights", label: "Atmospheric Insights", icon: (active, colorClass) => <Compass className={`w-3.5 h-3.5 transition-colors duration-300 ${active ? colorClass : "text-[#6272a4] group-hover:text-[#ffb86c]"}`} /> },
    { id: "trends", label: "Data Trends", icon: (active, colorClass) => <Calendar className={`w-3.5 h-3.5 transition-colors duration-300 ${active ? colorClass : "text-[#6272a4] group-hover:text-[#50fa7b]"}`} /> },
    { id: "milestones", label: "Milestones & Peers", icon: (active, colorClass) => <Trophy className={`w-3.5 h-3.5 transition-colors duration-300 ${active ? colorClass : "text-[#6272a4] group-hover:text-amber-400"}`} /> },
    { id: "advisor", label: "AI Advisor", icon: (active, colorClass) => <Bot className={`w-3.5 h-3.5 transition-colors duration-300 ${active ? colorClass : "text-[#6272a4] group-hover:text-[#bd93f9]"}`} /> }
  ].map((tab) => {
    const active = activeTab === tab.id;
    const style = tabStyles[tab.id] || tabStyles.garden;
    return <button
      key={tab.id}
      id={`tab-nav-${tab.id}`}
      onClick={() => setActiveTab(tab.id)}
      className={`group flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl text-[11px] font-semibold tracking-wide transition-all duration-300 cursor-pointer border ${active ? `${style.activeBg} ${style.activeText} ${style.activeShadow} border-current font-bold clay-puffy` : `text-[#6272a4] border-transparent ${style.hoverText} hover:bg-white/5`}`}
    >
                  {tab.icon(active, style.activeIconColor)}
                  <span>{tab.label}</span>
                </button>;
  })}
          </div>
        </div>

        {
    /* Dynamic Bento Viewport Zone */
  }
        <div className="flex-1 min-h-0 relative">
          <AnimatePresence mode="wait">
            <motion.div
    key={activeTab}
    initial={{ opacity: 0, scale: 0.98, y: 15 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.98, y: -15 }}
    transition={{ duration: 0.35, cubicBezier: [0.16, 1, 0.3, 1] }}
    className="h-full"
  >
              
              {
    /* Tab 1: Ecosystem Dome */
  }
              {activeTab === "garden" && <div className="w-full flex justify-center items-stretch h-full">
                  <motion.div
    className="w-full bento-cell card-theme-garden rounded-3xl p-6 relative overflow-hidden flex flex-col"
    whileHover={{ scale: 1.005, y: -2 }}
    transition={{ type: "spring", stiffness: 350, damping: 25 }}
  >
                    <ActiveEcoGarden
    averageFootprint={carbonStats.averageFootprint}
    totalCarbonSaved={carbonStats.totalCarbonSaved}
    ledgerEntries={ledgerEntries}
  />
                  </motion.div>
                </div>}

              {
    /* Tab 2: Carbon Logs */
  }
              {activeTab === "ledger" && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  {
    /* Elegant Input Form Card */
  }
                  <motion.div
    className="bento-cell card-theme-calculator rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full"
    whileHover={{ scale: 1.012, y: -4 }}
    transition={{ type: "spring", stiffness: 350, damping: 25 }}
  >
                    <DailyLedger
    onAddEntry={handleAddEntry}
    entries={ledgerEntries}
    onRemoveEntry={handleRemoveEntry}
  />
                  </motion.div>

                  {
    /* Statement feed list */
  }
                  <motion.div
    className="bento-cell card-theme-ledger rounded-3xl p-6 relative overflow-hidden flex flex-col"
    whileHover={{ scale: 1.012, y: -4 }}
    transition={{ type: "spring", stiffness: 350, damping: 25 }}
  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/5">
                      <div>
                        <h3 className="text-base font-semibold text-white flex items-center gap-2">
                          <History className="w-4.5 h-4.5 text-[#bd93f9]" /> Active Carbon Ledger
                        </h3>
                        <p className="text-xs text-[#6272a4] mt-0.5">Real-time daily statements</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {ledgerEntries.length > 0 && <button
    id="btn-export-ledger-csv"
    onClick={handleExportCSV}
    className="text-[10px] uppercase tracking-wider font-mono font-bold py-1 px-3.5 rounded-xl bg-[#50fa7b]/10 text-[#50fa7b] border border-[#50fa7b]/30 hover:bg-[#50fa7b]/25 active:scale-95 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(80,250,123,0.15)] cursor-pointer"
    title="Export ledger database to CSV spreadsheet"
  >
                            <Download className="w-3 h-3 text-[#50fa7b]" />
                            Export Data
                          </button>}
                        <span className="text-[9px] font-mono py-1 px-3 bg-[#1e1f29] text-[#bd93f9] rounded-xl border border-[#bd93f9]/35 font-bold uppercase shadow-inner">
                          {ledgerEntries.length} Actions Checked
                        </span>
                      </div>
                    </div>

                    <div className="overflow-y-auto max-h-[460px] space-y-2 pr-2 text-left">
                      {ledgerEntries.length === 0 ? <div className="text-center py-12 text-xs text-[#6272a4] italic border border-dashed border-[#bd93f9]/20 rounded-2xl bg-black/35">
                          Statement log history is listless. Input entries to view calculations.
                        </div> : <AnimatePresence initial={false}>
                          {[...ledgerEntries].reverse().map((entry) => <motion.div
    key={entry.id}
    id={`diary-ledger-${entry.id}`}
    initial={{ opacity: 0, scale: 0.95, y: -10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: 10 }}
    transition={{ type: "spring", stiffness: 450, damping: 28 }}
    className="bg-black/60 rounded-2xl p-4 border border-white/5 flex items-center justify-between text-xs transition-colors duration-200 hover:border-[#bd93f9]/20 hover:bg-black/80"
  >
                              <div className="flex items-center gap-3.5 overflow-hidden mr-2">
                                <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base shadow-inner ${entry.isReduction ? "bg-[#1e1f29] text-[#50fa7b] border border-[#50fa7b]/20" : "bg-[#ff5555]/15 text-[#ff5555] border border-[#ff5555]/20"}`}>
                                  {entry.category === "transport" ? "\u{1F697}" : entry.category === "food" ? "\u{1F957}" : entry.category === "energy" ? "\u26A1" : "\u{1F6CD}\uFE0F"}
                                </span>
                                <div className="overflow-hidden space-y-0.5">
                                  <p className="font-bold text-white truncate max-w-[170px] sm:max-w-xs">{entry.description}</p>
                                  <p className="text-[10px] text-[#6272a4] font-mono">
                                    {entry.value} {entry.unit} • {entry.date}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 flex-shrink-0">
                                <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${entry.isReduction ? "text-[#50fa7b] bg-[#1e1f29] border border-[#50fa7b]/20" : "text-[#ff5555] bg-[#343746]"}`}>
                                  {entry.isReduction ? "-" : "+"}
                                  {Math.abs(entry.carbonImpact).toFixed(1)} kg
                                </span>
                                
                                <button
    onClick={() => handleRemoveEntry(entry.id)}
    id={`remove-journal-ledger-${entry.id}`}
    className="text-[#6272a4] hover:text-[#ff5555] transition-colors p-1.5 rounded-full hover:bg-white/5 cursor-pointer"
    title="Remove item"
  >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </motion.div>)}
                        </AnimatePresence>}
                    </div>
                  </motion.div>
                </div>}

              {
    /* Tab 3: Active Pledges */
  }
              {activeTab === "commitments" && <div className="max-w-3xl mx-auto w-full">
                  <motion.div
    className="bento-cell card-theme-commitments rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between h-full border border-white/5"
    whileHover={{ scale: 1.005, y: -2 }}
    transition={{ type: "spring", stiffness: 350, damping: 25 }}
  >
                    <div className="space-y-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-base font-semibold tracking-tight text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-[#ff79c6]" /> Active Commitments & Pledges
                          </h3>
                          <p className="text-xs text-[#6272a4] mt-1">Check actions to offset parameters and live sustainably</p>
                        </div>
                        <span className="text-[9px] font-mono px-2 py-0.5 bg-[#ff79c6]/10 text-[#ff79c6] rounded border border-[#ff79c6]/30 font-bold uppercase">
                          Weekly
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        {weeklyChallenges.map((challenge) => <div
    key={challenge.id}
    id={`active-ch-${challenge.id}`}
    className={`rounded-2xl p-4 border transition-all duration-300 relative overflow-hidden ${challenge.completed ? "bg-black/35 border-[#ff79c6]/10 opacity-70" : "bg-black/60 border-white/5 hover:border-[#ff79c6]/25 shadow-sm"}`}
  >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1 text-left">
                                <h4 className={`text-xs font-bold ${challenge.completed ? "line-through text-[#6272a4]" : "text-[#f8f8f2]"}`}>
                                  {challenge.title}
                                </h4>
                                <p className="text-[10px] text-[#6272a4] leading-relaxed">
                                  {challenge.description}
                                </p>
                              </div>

                              <label className="relative flex items-center justify-center cursor-pointer flex-shrink-0">
                                <input
    type="checkbox"
    id={`checkbox-${challenge.id}`}
    checked={challenge.completed}
    onChange={() => handleToggleChallenge(challenge.id)}
    className="sr-only"
  />
                                <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${challenge.completed ? "bg-gradient-to-br from-[#ff79c6] to-[#bd93f9] text-white clay-puffy" : "bg-[#1e1f29] border border-white/10 hover:border-[#ff79c6]/40 shadow-inner"}`}>
                                  {challenge.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                                </div>
                              </label>
                            </div>

                            <div className="flex justify-between items-center text-[9px] font-mono mt-3 border-t border-white/5 pt-2 text-[#6272a4]">
                              <span className="bg-[#1e1f29] border border-[#ff79c6]/35 px-2.5 py-0.5 rounded-full text-[8.5px] text-[#ff79c6] font-bold uppercase">
                                {challenge.category}
                              </span>
                              <span className={`font-semibold font-mono ${challenge.completed ? "text-[#50fa7b]" : "text-[#6272a4]"}`}>
                                Saves {challenge.co2SavedPerDay} kg CO2e / day
                              </span>
                            </div>
                          </div>)}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5">
                      <div className="bg-[#1e1f29] rounded-2xl p-4 text-center border border-[#ff79c6]/15 shadow-inner">
                        <p className="text-xs font-mono font-medium text-[#50fa7b] tracking-wide mb-1 flex items-center justify-center gap-1.5">
                          <Leaf className="w-3.5 h-3.5" /> Environmental Audit
                        </p>
                        <p className="text-[10px] text-[#6272a4] leading-normal px-2">
                          {carbonStats.averageFootprint < 8 ? "Splendid! Your current statement is safely under the critical ecological threshold limit." : "Your transport offsets are key! Consider biking commutes or plant-based meals to curb daily factors."}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>}

              {
    /* Tab 4: Offset Statement */
  }
              {activeTab === "statement" && <div className="bento-cell bg-black/30 border border-[#f1fa8c]/20 rounded-3xl p-6 relative overflow-hidden">
                  <InteractiveOffsetStatement
    userName={userProfile.name}
    userArchetype={userProfile.archetype}
    createdAt="Jun 20, 2026"
    ledgerEntries={ledgerEntries}
    weeklyChallenges={weeklyChallenges}
  />
                </div>}

              {
    /* Tab 5: Atmospheric Insights */
  }
              {activeTab === "insights" && <motion.div
    className="h-full bento-cell rounded-3xl p-6 relative overflow-hidden flex flex-col bg-black/40 border border-[#ffb86c]/20"
    whileHover={{ scale: 1.005, y: -2 }}
  >
                  <EnvironmentalInsights
    ledgerEntries={ledgerEntries}
    weeklyChallenges={weeklyChallenges}
    onCommitOptInChallenge={handleCommitOptInChallenge}
    onUpdateChallengeProgress={handleUpdateChallengeProgress}
    onGrantKarmaBonus={handleGrantKarmaBonus}
  />
                </motion.div>}

              {
    /* Tab 6: Data Trends */
  }
              {activeTab === "trends" && <motion.div
    className="bento-cell card-theme-trend rounded-3xl p-6 relative overflow-hidden"
    whileHover={{ scale: 1.012, y: -4 }}
  >
                  <WeeklyTrendChart ledgerEntries={ledgerEntries} />
                </motion.div>}

              {
    /* Tab 7: Milestones & Badges */
  }
              {activeTab === "milestones" && <div className="h-full">
                  <EcoLeaderboardAndBadges
    totalKarmaPoints={totalKarmaPoints}
    currentLevel={currentLevelForUser}
    unlockedBadges={unlockedBadges}
    userProfile={userProfile}
  />
                </div>}

              {
    /* Tab 8: AI Advisor */
  }
              {activeTab === "advisor" && <motion.div
    className="h-full lg:max-w-3xl mx-auto bento-cell card-theme-advisor rounded-3xl p-6 relative overflow-hidden flex flex-col"
    whileHover={{ scale: 1.012, y: -4 }}
    transition={{ type: "spring", stiffness: 350, damping: 25 }}
  >
                  <AIEcoGuardian
    ledgerEntries={ledgerEntries}
    onAddChallenge={handleAddChallenge}
  />
                </motion.div>}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {
    /* Modern, Simple Footnote Footer */
  }
      <footer className="text-center py-6 text-[10px] font-mono text-[#6272a4] border-t border-white/5 bg-black/25 relative z-10 space-y-1">
        <p>© EcoSphere • Atmospheric factors aligned with standard IPCC greenhouse guidelines.</p>
        <p className="text-[#8be9fd] tracking-widest uppercase text-[9px] font-bold">Crafted with care by PRIYANKA PRIYADARSINI BEJ</p>
      </footer>
    </div>;
}
