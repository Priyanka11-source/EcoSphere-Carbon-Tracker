/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Trophy, Users, ShieldAlert, Sparkles, Flame, CheckCircle2, Heart, Globe, Leaf, Sun, Zap, Droplet, Compass, Bot } from "lucide-react";
export default function EcoLeaderboardAndBadges({
  totalKarmaPoints,
  currentLevel,
  unlockedBadges,
  userProfile
}) {
  const badgesList = [
    {
      id: "badge_rookie",
      name: "Quantum Ranger",
      description: "Stepped onto the sustainable path of emission tracking",
      requirement: "Log your very first carbon activity (Threshold: 10 PTS)",
      icon: "\u{1F331}",
      unlocked: unlockedBadges.some((b) => b.id === "badge_rookie") || totalKarmaPoints >= 10,
      unlockedDate: unlockedBadges.find((b) => b.id === "badge_rookie")?.unlockedDate || "Jun 15, 2026",
      color: "border-cyan-500/30 bg-cyan-950/20 text-cyan-300"
    },
    {
      id: "badge_diet",
      name: "Plant Food Overlord",
      description: "Choosing plant-based options to lower livestock methane emission vectors",
      requirement: "Earn 100+ points on dietary quests (Threshold: 120 PTS)",
      icon: "\u{1F957}",
      unlocked: unlockedBadges.some((b) => b.id === "badge_diet") || totalKarmaPoints >= 120,
      unlockedDate: unlockedBadges.find((b) => b.id === "badge_diet")?.unlockedDate || (totalKarmaPoints >= 120 ? "Jun 15, 2026" : void 0),
      color: "border-indigo-500/30 bg-indigo-950/30 text-indigo-300"
    },
    {
      id: "badge_transit",
      name: "Tachyon Transit Rider",
      description: "Conquering high-impact commutes via carbonless bicycles or cyber-rail",
      requirement: "Conquer commuting storyline chapters (Threshold: 200 PTS)",
      icon: "\u{1F6B2}",
      unlocked: unlockedBadges.some((b) => b.id === "badge_transit") || totalKarmaPoints >= 200,
      unlockedDate: unlockedBadges.find((b) => b.id === "badge_transit")?.unlockedDate || (totalKarmaPoints >= 200 ? "Jun 15, 2026" : void 0),
      color: "border-rose-500/30 bg-rose-950/20 text-rose-300"
    },
    {
      id: "badge_grid",
      name: "Fusion Grid Master",
      description: "Managing home thermal power levels with absolute wisdom",
      requirement: "Unlock sustainable home solar arrays (Threshold: 350 PTS)",
      icon: "\u26A1",
      unlocked: unlockedBadges.some((b) => b.id === "badge_grid") || totalKarmaPoints >= 350,
      unlockedDate: unlockedBadges.find((b) => b.id === "badge_grid")?.unlockedDate || (totalKarmaPoints >= 350 ? "Jun 20, 2026" : void 0),
      color: "border-amber-500/30 bg-amber-950/20 text-amber-300"
    },
    {
      id: "badge_champion",
      name: "EcoSphere Sovereign",
      description: "Attain high-rank status on the regional climate board",
      requirement: "Achieve a total of 500+ Carbon Karma Points (Threshold: 500 PTS)",
      icon: "\u{1F451}",
      unlocked: unlockedBadges.some((b) => b.id === "badge_champion") || totalKarmaPoints >= 500,
      unlockedDate: unlockedBadges.find((b) => b.id === "badge_champion")?.unlockedDate || (totalKarmaPoints >= 500 ? "Jun 20, 2026" : void 0),
      color: "border-[#d8b4fe]/30 bg-[#9333ea]/10 text-[#d8b4fe]"
    }
  ];
  const [leaderboardPeers, setLeaderboardPeers] = useState([
    { id: "peer_1", name: "Celeste Moon", score: 480, avatar: "icon-sun", status: "Solarpunk specialist \u{1F6B2}", cheered: false },
    { id: "peer_2", name: "Thorne Oakwood", score: 380, avatar: "icon-leaf", status: "Vegan menu activated \u{1F96C}", cheered: false },
    { id: "peer_user", name: "You (Carbon Pioneer)", score: totalKarmaPoints, avatar: "icon-leaf", status: "Active in the Biodome!", cheered: false },
    { id: "peer_3", name: "Brooke River", score: 290, avatar: "icon-globe", status: "AC standby limits on \u{1F32A}\uFE0F", cheered: false },
    { id: "peer_4", name: "Solal Sola", score: 180, avatar: "icon-sparkles", status: "Auditing vampire chargers...", cheered: false }
  ]);
  useEffect(() => {
    setLeaderboardPeers((prev) => {
      const updated = prev.map((p) => {
        if (p.id === "peer_user") {
          return {
            ...p,
            score: totalKarmaPoints,
            name: userProfile ? `${userProfile.name} (You)` : "You (Carbon Pioneer)",
            avatar: userProfile?.avatar || "icon-leaf",
            status: userProfile ? `Active specialization: ${userProfile.archetype} \u26A1` : "Active in the Biodome!"
          };
        }
        return p;
      });
      return updated.sort((a, b) => b.score - a.score);
    });
  }, [totalKarmaPoints, userProfile]);
  const handleCheer = (id) => {
    setLeaderboardPeers((prev) => prev.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          cheered: !p.cheered,
          score: p.cheered ? p.score - 5 : p.score + 5
          // peer gets a boost
        };
      }
      return p;
    }).sort((a, b) => b.score - a.score));
  };
  const pointsForNextLevel = 150;
  const levelProgressPercentage = Math.min(100, Math.floor(totalKarmaPoints % pointsForNextLevel / pointsForNextLevel * 100));
  return <div id="leaderboard-badges-container" className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full text-slate-100">
      
      {
    /* Trophy Achievements Closet */
  }
      <div id="badges-cabinet-panel" className="bg-gradient-to-br from-[#1d190b] via-[#09111e] to-[#040612] rounded-3xl p-6 shadow-2xl border border-amber-500/20 flex flex-col justify-between shadow-[0_0_35px_rgba(245,158,11,0.06)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-lg font-display font-semibold tracking-tight text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" /> Climate Milestones
              </h3>
              <p className="text-xs text-slate-400 font-sans">Milestones unlocked based on Quest points & active ledger values</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase bg-indigo-950 border border-indigo-800/40 text-[#a5b4fc] px-2.5 py-0.5 rounded font-medium">
                Level {currentLevel}
              </span>
            </div>
          </div>

          {
    /* Level Progress Slider */
  }
          <div className="bg-[#070b14] rounded-2xl p-4 border border-slate-800/60">
            <div className="flex justify-between items-center text-xs text-slate-300 mb-2 font-mono">
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                Level {currentLevel} Progress ({totalKarmaPoints} PTS)
              </span>
              <span>{levelProgressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div
    initial={{ width: 0 }}
    animate={{ width: `${levelProgressPercentage}%` }}
    transition={{ duration: 1, ease: "easeOut" }}
    className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-rose-500 h-full rounded-full"
  />
            </div>
            <p className="text-[9px] text-slate-500 mt-2 italic font-mono">Collect points by completing story decision paths, checking quizzes, or logging reductions!</p>
          </div>

          {
    /* Grid of badges */
  }
          <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
            {badgesList.map((badge) => <div
    key={badge.id}
    id={`badge-row-${badge.id}`}
    className={`p-3 rounded-2xl border flex items-center gap-3.5 transition-all ${badge.unlocked ? badge.color + " shadow-md" : "border-slate-900 bg-slate-950/20 text-slate-600 opacity-40"}`}
  >
                <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shadow-inner">
                  {badge.unlocked ? badge.icon : "\u{1F512}"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-sans font-bold text-xs truncate text-slate-200">{badge.name}</h4>
                    {badge.unlocked && <span className="text-[8px] font-mono text-cyan-400 flex items-center gap-0.5 font-bold uppercase tracking-wider">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400" /> ACTIVE
                      </span>}
                  </div>
                  <p className="text-[10px] leading-snug mt-0.5 text-slate-400">{badge.description}</p>
                  <p className="text-[8px] font-mono text-slate-500 mt-0.5 uppercase tracking-wide">Target: {badge.requirement}</p>
                </div>
              </div>)}
          </div>

          {
    /* 🌟 Official Point Thresholds Reference Shelf */
  }
          <div id="badges-thresholds-reference-shelf" className="mt-4 bg-[#0a0a0f] border border-amber-500/20 rounded-2xl p-4.5 text-left relative overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-amber-500/5 rounded-full blur-[20px] pointer-events-none" />
            <h4 className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#ffb86c] mb-2.5 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              Official Badge Progression Thresholds
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 font-mono text-[9.5px]">
              <div className="flex items-center justify-between border-b border-white/5 pb-1">
                <span className="text-slate-300 flex items-center gap-1">
                  <span className="text-[12px]">🌱</span> Quantum Ranger
                </span>
                <span className="text-[#50fa7b] font-bold">10 PTS</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-1">
                <span className="text-slate-300 flex items-center gap-1">
                  <span className="text-[12px]">🥗</span> Plant Food Overlord
                </span>
                <span className="text-[#50fa7b] font-bold">120 PTS</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-1">
                <span className="text-slate-300 flex items-center gap-1">
                  <span className="text-[12px]">🚲</span> Tachyon Transit Rider
                </span>
                <span className="text-[#50fa7b] font-bold">200 PTS</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-1">
                <span className="text-slate-300 flex items-center gap-1">
                  <span className="text-[12px]">⚡</span> Fusion Grid Master
                </span>
                <span className="text-[#50fa7b] font-bold">350 PTS</span>
              </div>
              <div className="flex items-center justify-between pb-0.5">
                <span className="text-slate-300 flex items-center gap-1">
                  <span className="text-[12px]">👑</span> EcoSphere Sovereign
                </span>
                <span className="text-[#50fa7b] font-bold">500 PTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
    /* Right Column: Social regional Leaderboard */
  }
      <div id="social-leaderboard-panel" className="bg-gradient-to-br from-[#110c34] via-[#070e1b] to-[#030410] rounded-3xl p-6 shadow-2xl border border-violet-500/20 flex flex-col justify-between shadow-[0_0_35px_rgba(139,92,246,0.06)]">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-lg font-display font-semibold tracking-tight text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" /> Community Leaderboard
              </h3>
              <p className="text-xs text-slate-400 font-sans">Compare footprint scores with peers, celebrate achievements and earn bonuses</p>
            </div>
          </div>

          {
    /* Leaderboard Competitors List */
  }
          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            <AnimatePresence>
              {leaderboardPeers.map((peer, idx) => {
    const isUser = peer.id === "peer_user";
    return <motion.div
      key={peer.id}
      layout
      id={`leaderboard-peer-${peer.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-3 rounded-2xl flex items-center justify-between transition-all border ${isUser ? "border-cyan-500/40 bg-cyan-950/20 shadow-lg shadow-cyan-950/20 relative overflow-hidden" : "border-slate-900 bg-slate-950/30 hover:bg-slate-950/65"}`}
    >
                    {isUser && <div className="absolute top-0 right-0 w-1.5 h-full bg-cyan-500 animate-pulse" />}
                    
                    <div className="flex items-center gap-3 overflow-hidden mr-3">
                      <span className="font-mono font-black text-xs text-slate-500 w-4 text-center">
                        #{idx + 1}
                      </span>
                      {
      /* Avatar container */
    }
                      <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-base flex-shrink-0 overflow-hidden">
                        {peer.avatar && peer.avatar.startsWith("icon-") ? peer.avatar === "icon-leaf" ? <Leaf className="w-5 h-5 text-emerald-400" /> : peer.avatar === "icon-sun" ? <Sun className="w-5 h-5 text-amber-400" /> : peer.avatar === "icon-globe" ? <Globe className="w-5 h-5 text-[#34d399]" /> : peer.avatar === "icon-shield" ? <ShieldAlert className="w-5 h-5 text-emerald-400" /> : peer.avatar === "icon-sparkles" ? <Sparkles className="w-5 h-5 text-amber-300" /> : peer.avatar === "icon-zap" ? <Zap className="w-5 h-5 text-yellow-400" /> : peer.avatar === "icon-droplet" ? <Droplet className="w-5 h-5 text-sky-400" /> : peer.avatar === "icon-flame" ? <Flame className="w-5 h-5 text-orange-400" /> : peer.avatar === "icon-heart" ? <Heart className="w-5 h-5 text-rose-500" /> : peer.avatar === "icon-compass" ? <Compass className="w-5 h-5 text-teal-400" /> : peer.avatar === "icon-award" ? <Award className="w-5 h-5 text-amber-400" /> : peer.avatar === "icon-bot" ? <Bot className="w-5 h-5 text-cyan-400" /> : <Leaf className="w-5 h-5 text-emerald-400" /> : peer.avatar && (peer.avatar.startsWith("data:image") || peer.avatar.length > 4 && !peer.avatar.startsWith("icon-")) ? <img src={peer.avatar} alt={peer.name} className="w-full h-full object-cover" /> : <span>{peer.avatar}</span>}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className={`text-xs font-bold truncate ${isUser ? "text-cyan-300 font-black" : "text-slate-200"}`}>
                          {peer.name} {isUser && "\u2B50"}
                        </h4>
                        <p className="text-[9px] text-slate-400 italic mt-0.5 truncate max-w-[150px]">{peer.status}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 flex-shrink-0">
                      <span className="font-mono text-[10px] font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-900/40 px-2 py-0.5 rounded">
                        {peer.score} pts
                      </span>
                      {!isUser && <button
      onClick={() => handleCheer(peer.id)}
      id={`cheer-peer-${peer.id}`}
      className={`p-1 px-2.5 rounded-lg text-[9px] font-mono uppercase tracking-widest font-black flex items-center gap-1 transition-all border ${peer.cheered ? "bg-rose-600 text-white border-rose-500" : "bg-rose-950/20 hover:bg-rose-950/50 text-rose-300 border-rose-900/40"}`}
    >
                          <Heart className={`w-2.5 h-2.5 ${peer.cheered ? "fill-white" : ""}`} />
                          {peer.cheered ? "OK" : "CHEER"}
                        </button>}
                    </div>
                  </motion.div>;
  })}
            </AnimatePresence>
          </div>

          <div className="bg-[#070b14] border border-slate-800/80 rounded-2xl p-4 text-xs italic space-y-1 mt-4 font-mono">
            <span className="font-sans font-bold text-cyan-400 block tracking-wide">💡 CYBERNETIC CO-OPERATION SYNERGY</span>
            "Communal climate accountability lowers greenhouse indices by nearly 35%. Cheer your peers online to bolster decentralized solarpunk grids!"
          </div>
        </div>
      </div>

    </div>;
}
