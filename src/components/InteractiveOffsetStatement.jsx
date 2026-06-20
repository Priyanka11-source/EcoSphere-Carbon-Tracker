/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Award,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  Download,
  Quote
} from "lucide-react";
import { jsPDF } from "jspdf";
import { ECO_QUOTES } from "../data/quotes";
export default function InteractiveOffsetStatement({
  userName,
  userArchetype,
  createdAt,
  ledgerEntries,
  weeklyChallenges
}) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [certTheme, setCertTheme] = useState("emerald");
  const [isSealed, setIsSealed] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % ECO_QUOTES.length);
  };
  const activeQuote = ECO_QUOTES[quoteIndex];
  const metrics = useMemo(() => {
    let emissions = 0;
    let registeredOffsets = 0;
    ledgerEntries.forEach((entry) => {
      if (entry.isReduction) {
        registeredOffsets += Math.abs(entry.carbonImpact);
      } else {
        emissions += entry.carbonImpact;
      }
    });
    let commitmentOffsets = 0;
    weeklyChallenges.forEach((challenge) => {
      if (challenge.completed) {
        commitmentOffsets += challenge.co2SavedPerDay * (challenge.daysSucceeded || challenge.daysDuration || 7);
      } else if (challenge.daysSucceeded > 0) {
        commitmentOffsets += challenge.co2SavedPerDay * challenge.daysSucceeded;
      }
    });
    const totalOffsets = registeredOffsets + commitmentOffsets;
    const netBalance = emissions - totalOffsets;
    const offsetPercentage = emissions > 0 ? Math.min(100, Math.round(totalOffsets / emissions * 100)) : 100;
    let tier = "Bronze Leaf Steward";
    let tierColor = "text-[#ffb86c] border-[#ffb86c]/30 bg-[#ffb86c]/5";
    let badgeText = "BRONZE";
    if (totalOffsets >= 50) {
      tier = "Emerald Canopy Paragon";
      tierColor = "text-[#50fa7b] border-[#50fa7b]/35 bg-[#50fa7b]/5";
      badgeText = "EMERALD PARAGON";
    } else if (totalOffsets >= 20) {
      tier = "Golden Redwood Guardian";
      tierColor = "text-[#ffb86c] border-[#ffb86c]/35 bg-[#ffb86c]/5";
      badgeText = "GOLDEN GUARDIAN";
    } else if (totalOffsets >= 5) {
      tier = "Silver Sapling Defender";
      tierColor = "text-[#8be9fd] border-[#8be9fd]/35 bg-[#8be9fd]/5";
      badgeText = "SILVER DEFENDER";
    }
    const hash = (userName + createdAt).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const refCode = `ESC-2026-${Math.abs(hash).toString(16).toUpperCase()}-${Math.round(totalOffsets * 10)}`;
    return {
      emissions,
      registeredOffsets,
      commitmentOffsets,
      totalOffsets,
      netBalance,
      offsetPercentage,
      tier,
      tierColor,
      badgeText,
      refCode
    };
  }, [ledgerEntries, weeklyChallenges, userName, createdAt]);
  const downloadCertificatePDF = () => {
    setDownloadingCert(true);
    setDownloadSuccess(false);
    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [800, 600]
        });
        doc.setFillColor(24, 26, 35);
        doc.rect(0, 0, 800, 600, "F");
        const rgb = certTheme === "emerald" ? [80, 250, 123] : certTheme === "cyan" ? [139, 233, 253] : certTheme === "purple" ? [189, 147, 249] : certTheme === "golden" ? [245, 158, 11] : certTheme === "silver" ? [148, 163, 184] : certTheme === "yellow" ? [241, 250, 140] : [255, 121, 198];
        doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
        doc.setLineWidth(3);
        doc.rect(25, 25, 750, 550);
        doc.setDrawColor(40, 42, 54);
        doc.setLineWidth(1);
        doc.rect(34, 34, 732, 532);
        doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
        doc.setLineWidth(5);
        doc.line(25, 60, 25, 25);
        doc.line(25, 25, 60, 25);
        doc.line(775, 60, 775, 25);
        doc.line(775, 25, 740, 25);
        doc.line(25, 540, 25, 575);
        doc.line(25, 575, 60, 575);
        doc.line(775, 540, 775, 575);
        doc.line(775, 575, 740, 575);
        doc.setTextColor(rgb[0], rgb[1], rgb[2]);
        doc.setFont("courier", "bold");
        doc.setFontSize(11);
        doc.text("ECOSPHERE METRIC VERIFICATION", 400, 75, { align: "center" });
        doc.setDrawColor(56, 58, 89);
        doc.setLineWidth(1);
        doc.line(180, 95, 620, 95);
        doc.setTextColor(248, 248, 242);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);
        doc.text("CARBON OFFSET CERTIFICATE", 400, 130, { align: "center" });
        doc.setTextColor(98, 114, 164);
        doc.setFont("times", "italic");
        doc.setFontSize(13);
        doc.text("This official verification document confirms that the active ledger accounts for", 400, 160, { align: "center" });
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(30);
        doc.text((userName || "VALUED CITIZEN").toUpperCase(), 400, 212, { align: "center" });
        doc.setTextColor(139, 233, 253);
        doc.setFont("courier", "bold");
        doc.setFontSize(11);
        doc.text((userArchetype || "CARBON EXPLORER").toUpperCase(), 400, 238, { align: "center" });
        doc.setFillColor(30, 31, 41);
        doc.setDrawColor(56, 58, 89);
        doc.setLineWidth(1);
        doc.roundedRect(150, 275, 500, 130, 12, 12, "FD");
        doc.setTextColor(139, 233, 253);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text("Has achieved a certified climate reduction value of", 400, 305, { align: "center" });
        doc.setTextColor(rgb[0], rgb[1], rgb[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(38);
        doc.text(`${metrics.totalOffsets.toFixed(2)} kg CO2e`, 400, 355, { align: "center" });
        doc.setTextColor(98, 114, 164);
        doc.setFont("courier", "normal");
        doc.setFontSize(10.5);
        doc.text(`Offsetting ${metrics.offsetPercentage}% of logged emissions to date`, 400, 385, { align: "center" });
        doc.setTextColor(248, 248, 242);
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.text(`"${activeQuote.text}"`, 400, 442, { align: "center" });
        doc.setTextColor(98, 114, 164);
        doc.setFont("courier", "normal");
        doc.setFontSize(9.5);
        doc.text(`\u2014 ${activeQuote.author}`, 400, 460, { align: "center" });
        doc.setDrawColor(56, 58, 89);
        doc.setLineWidth(1);
        doc.line(100, 495, 700, 495);
        doc.setTextColor(98, 114, 164);
        doc.setFont("courier", "bold");
        doc.setFontSize(8.5);
        doc.text("DATE OF TRANSLATION", 100, 522);
        doc.setTextColor(248, 248, 242);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11.5);
        doc.text(createdAt, 100, 538);
        doc.setTextColor(98, 114, 164);
        doc.setFont("courier", "bold");
        doc.setFontSize(8.5);
        doc.text("VERIFICATION ID", 700, 522, { align: "right" });
        doc.setTextColor(248, 248, 242);
        doc.setFont("courier", "bold");
        doc.setFontSize(11);
        doc.text(metrics.refCode, 700, 538, { align: "right" });
        doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
        doc.setLineWidth(1.5);
        doc.circle(400, 525, 22, "S");
        doc.setLineWidth(1);
        doc.circle(400, 525, 17, "S");
        doc.setTextColor(rgb[0], rgb[1], rgb[2]);
        doc.setFont("courier", "bold");
        doc.setFontSize(9.5);
        doc.text("ESC", 400, 529, { align: "center" });
        doc.save(`Climate-Stewardship-Certificate-${userName.replace(/\s+/g, "-") || "Explorer"}.pdf`);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3e3);
      } catch (err) {
        console.error("Failed to compile certificate PDF:", err);
      } finally {
        setDownloadingCert(false);
      }
    }, 1200);
  };
  const certThemeStyles = {
    emerald: {
      border: "border-[#50fa7b]/30",
      bgGlow: "from-[#50fa7b]/5 to-transparent",
      textAccent: "text-[#50fa7b]",
      pill: "bg-[#50fa7b]/10 text-[#50fa7b] border-[#50fa7b]/20",
      sealGlow: "shadow-[0_0_30px_rgba(80,250,123,0.3)] bg-gradient-to-br from-[#50fa7b] to-[#25d366]"
    },
    cyan: {
      border: "border-[#8be9fd]/30",
      bgGlow: "from-[#8be9fd]/5 to-transparent",
      textAccent: "text-[#8be9fd]",
      pill: "bg-[#8be9fd]/10 text-[#8be9fd] border-[#8be9fd]/20",
      sealGlow: "shadow-[0_0_30px_rgba(139,233,253,0.3)] bg-gradient-to-br from-[#8be9fd] to-[#38bdf8]"
    },
    purple: {
      border: "border-[#bd93f9]/30",
      bgGlow: "from-[#bd93f9]/5 to-transparent",
      textAccent: "text-[#bd93f9]",
      pill: "bg-[#bd93f9]/10 text-[#bd93f9] border-[#bd93f9]/20",
      sealGlow: "shadow-[0_0_30px_rgba(189,147,249,0.3)] bg-gradient-to-br from-[#bd93f9] to-[#ff79c6]"
    },
    golden: {
      border: "border-amber-500/30",
      bgGlow: "from-amber-500/5 to-transparent",
      textAccent: "text-amber-400",
      pill: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      sealGlow: "shadow-[0_0_30px_rgba(245,158,11,0.3)] bg-gradient-to-br from-amber-400 to-yellow-600"
    },
    silver: {
      border: "border-slate-400/30",
      bgGlow: "from-slate-400/5 to-transparent",
      textAccent: "text-slate-300",
      pill: "bg-slate-400/10 text-slate-300 border-slate-400/20",
      sealGlow: "shadow-[0_0_30px_rgba(148,163,184,0.3)] bg-gradient-to-br from-slate-300 to-slate-500"
    },
    yellow: {
      border: "border-[#f1fa8c]/30",
      bgGlow: "from-[#f1fa8c]/5 to-transparent",
      textAccent: "text-[#f1fa8c]",
      pill: "bg-[#f1fa8c]/10 text-[#f1fa8c] border-[#f1fa8c]/20",
      sealGlow: "shadow-[0_0_30px_rgba(241,250,140,0.3)] bg-gradient-to-br from-[#f1fa8c] to-yellow-500"
    },
    pink: {
      border: "border-[#ff79c6]/30",
      bgGlow: "from-[#ff79c6]/5 to-transparent",
      textAccent: "text-[#ff79c6]",
      pill: "bg-[#ff79c6]/10 text-[#ff79c6] border-[#ff79c6]/20",
      sealGlow: "shadow-[0_0_30px_rgba(255,121,198,0.3)] bg-gradient-to-br from-[#ff79c6] to-pink-500"
    }
  };
  const currStyle = certThemeStyles[certTheme];
  return <div id="interactive-offset-statement" className="space-y-6 text-left">
      
      {
    /* Narrative Section Header */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-[#50fa7b] animate-pulse" />
            Elegant Offset Statement
          </h3>
          <p className="text-xs text-[#6272a4] mt-0.5">Custom carbon balance statement and verifiable ecological certificate</p>
        </div>
        
        {
    /* Certificate Theme Selector Actions */
  }
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-black/45 border border-white/5 rounded-xl self-start sm:self-auto">
          <span className="text-[10px] font-mono font-medium text-[#6272a4] px-2">Theme:</span>
          {["emerald", "cyan", "purple", "golden", "silver", "yellow", "pink"].map((t) => <button
    key={t}
    onClick={() => setCertTheme(t)}
    className={`cursor-pointer px-2.5 py-1 rounded-lg text-[9px] font-mono tracking-wider font-bold uppercase transition-all duration-200 ${certTheme === t ? "bg-white/10 text-white font-extrabold border-b border-current" : "text-[#6272a4] hover:text-slate-300"}`}
  >
              {t}
            </button>)}
        </div>
      </div>

      {
    /* Two-Column Grid: Left (Skeuomorphic Certificate Statement Paper) vs Right (Live Interactive Controls & Receipt Details) */
  }
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {
    /* Left Column: Skeuomorphic Verifiable Carbon Offset Certificate (8/12 widths) */
  }
        <div className="lg:col-span-7 flex flex-col items-center">
          
          <motion.div
    id="verifiable-certificate-bezel"
    className={`w-full bg-[#181a23]/95 border ${currStyle.border} rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl bg-gradient-to-b ${currStyle.bgGlow}`}
    whileHover={{ y: -3 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
            {
    /* Elegant Atmospheric Watermark background lines */
  }
            <div className="absolute inset-0 pattern-carbon-lines opacity-5 pointer-events-none" />
            
            {
    /* Technical Certificate Header */
  }
            <div className="flex justify-between items-start border-b border-dashed border-white/10 pb-4 relative z-10">
              <div className="space-y-1">
                <span className={`text-[8px] font-mono font-extrabold tracking-widest uppercase border border-current px-2.5 py-0.5 rounded-md ${currStyle.textAccent}`}>
                  Verifiable Carbon Statement {metrics.badgeText}
                </span>
                <p className="text-[10px] text-[#6272a4] font-mono mt-1">ISSUED BY ECOSPHERE CLIMATE SYSTEM INC</p>
              </div>
              <div className="text-right">
                <span className="text-[9.5px] font-mono text-slate-400 font-bold tracking-wider">REF ID:</span>
                <p className="text-[9.5px] font-mono font-semibold text-white tracking-widest leading-none mt-0.5">{metrics.refCode}</p>
              </div>
            </div>

            {
    /* Certificate Core Statement Text Body */
  }
            <div className="py-6 space-y-5 text-center relative z-10">
              <div className="space-y-1.5">
                <p className="text-slate-400 font-serif italic text-xs">This official carbon offset ledger verifies that</p>
                <h4 className="text-xl font-display font-medium text-white tracking-wide uppercase px-4 truncate max-w-full">
                  {userName || "Valued Planetary Explorer"}
                </h4>
                <p className="text-[10px] font-mono tracking-widest text-[#8be9fd] uppercase font-bold">{userArchetype || "Biosphere Citizen"}</p>
              </div>

              {
    /* Dynamic Certificate Summary Text */
  }
              <div className="max-w-md mx-auto bg-black/45 rounded-2xl p-4 border border-white/5 space-y-1 my-1">
                <p className="text-[11.5px] text-slate-350 leading-relaxed font-sans font-medium">
                  Has successfully avoided and offset a verified quantity of
                </p>
                <p className={`text-2xl font-bold tracking-tight font-sans ${currStyle.textAccent} flex items-center justify-center gap-1.5 my-1`}>
                  {metrics.totalOffsets.toFixed(2)} <span className="text-xs font-mono text-slate-400 font-normal">kg CO2e</span>
                </p>
                <p className="text-[9.5px] text-[#6272a4] font-mono">
                  Offsetting <strong className="text-white font-bold">{metrics.offsetPercentage}%</strong> of direct carbon emissions recorded.
                </p>
              </div>

              {
    /* Curated Quotes Carousel - Tap to rotate inline */
  }
              <div
    onClick={handleNextQuote}
    id="interactive-statement-quote-box"
    className="group max-w-sm mx-auto bg-white/[0.02] hover:bg-white/[0.04] p-3 rounded-2xl border border-white/5 cursor-pointer relative transition-all duration-300 select-none text-left"
    title="Tap to rotate inspiring eco-quotes!"
  >
                <Quote className="absolute -top-1.5 -left-1.5 w-7 h-7 text-white/5 group-hover:text-emerald-500/10 transition-colors" />
                <AnimatePresence mode="wait">
                  <motion.div
    key={quoteIndex}
    initial={{ opacity: 0, y: 3 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -3 }}
    transition={{ duration: 0.2 }}
    className="space-y-1.5"
  >
                    <p className="text-[10px] text-slate-300 italic font-serif leading-relaxed pr-6">
                      "{activeQuote.text}"
                    </p>
                    <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-500 font-bold tracking-wide">
                      <span>— {activeQuote.author}</span>
                      <span className="flex items-center gap-1 text-[8px] tracking-wider uppercase bg-[#181a23] py-0.5 px-1.5 rounded-md border border-white/5 hover:text-emerald-400 transition-colors">
                        <RefreshCw className="w-2 h-2 animate-spin-slow" /> Next Quote
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {
    /* Certificate Footer Signature and Security Seal */
  }
            <div className="border-t border-dashed border-white/10 pt-4 flex justify-between items-end relative z-10">
              
              {
    /* Climate Stewardship Signoffs */
  }
              <div className="text-left space-y-1">
                <p className="text-[8px] font-mono text-[#6272a4] tracking-widest">VERIFIED STAMP DATE</p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[9.5px] font-mono text-slate-300 font-semibold">{createdAt}</span>
                </div>
              </div>

              {
    /* Dynamic Skeuomorphic Official Holographic Stamp Seal */
  }
              <motion.div
    id="carbon-security-seal"
    onClick={() => setIsSealed(!isSealed)}
    whileHover={{ scale: 1.1, rotate: 12 }}
    whileTap={{ scale: 0.95 }}
    className={`w-14 h-14 rounded-full flex items-center justify-center cursor-pointer relative shrink-0 transition-all ${currStyle.sealGlow}`}
    title="Verifiable Eco-Security Seal. Click to engage stamp details!"
  >
                <div className="absolute inset-1 rounded-full border border-black/25 flex items-center justify-center border-dashed font-mono font-bold text-[8.5px] text-white">
                  {isSealed ? <ShieldCheck className="w-6 h-6 text-[#1e1f29] animate-bounce-slow" /> : <span className="text-[#101115] text-[7.5px] uppercase font-mono tracking-tighter text-center">SECURE<br />SEAL</span>}
                </div>
                {
    /* Visual ripple sparkles when sealed */
  }
                {isSealed && <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#50fa7b] opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#50fa7b]" />
                  </span>}
              </motion.div>
            </div>
          </motion.div>

          {
    /* Secure interactive download action shelf */
  }
          <div id="statement-download-bar" className="w-full mt-4 bg-[#1e1f29]/40 border border-white/5 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono uppercase tracking-wider text-[#6272a4] font-bold">Verification Export Shelf</span>
              <p className="text-[11px] text-slate-300">Secure your digital accomplishments and ledger statements</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
    id="btn-download-cert-pdf"
    onClick={downloadCertificatePDF}
    disabled={downloadingCert}
    className={`flex-1 sm:flex-none cursor-pointer py-2 px-5 rounded-xl text-xs font-bold font-mono tracking-wide uppercase transition-all duration-200 flex items-center justify-center gap-1.5 border-none ${downloadSuccess ? "bg-[#50fa7b]/20 text-[#50fa7b] border border-[#50fa7b]/30" : downloadingCert ? "bg-white/5 text-slate-400 cursor-not-allowed" : "bg-[#50fa7b] hover:bg-[#25d366] text-black active:scale-95 shadow-md shadow-[#50fa7b]/10"}`}
  >
                {downloadingCert ? <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Generating PDF...
                  </> : downloadSuccess ? <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    Saved PDF!
                  </> : <>
                    <Download className="w-3.5 h-3.5" />
                    Certificate PDF
                  </>}
              </button>
            </div>
          </div>

          <p className="text-[9px] font-mono text-[#6272a4] mt-2.5 italic">
            💡 Verifiable carbon certificates represent client-side saved offsets calculations in accordance with standard atmospheric estimates.
          </p>
        </div>

        {
    /* Right Column: Statement Breakdown and Interactive Metrics Console (5/12 widths) */
  }
        <div className="lg:col-span-5 space-y-4">
          
          {
    /* Carbon Offset Balance Sheet Card */
  }
          <div className="bg-[#1e1f29]/50 border border-white/5 rounded-2xl p-5 space-y-4 relative overflow-hidden">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono text-[#bd93f9]">
              Statement Balance Sheet
            </h4>
            <p className="text-[10px] text-slate-400">Atmospheric entries summary and completed commitment metrics</p>
            
            <div className="space-y-3.5">
              
              {
    /* Metric Item: Total Additions */
  }
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#ff5555]/10 text-[#ff5555] border border-[#ff5555]/15 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Emissions Additions</h5>
                    <p className="text-[9px] text-slate-500 font-mono">Logged activity additions</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#ff5555]">
                  +{metrics.emissions.toFixed(1)} kg CO2e
                </span>
              </div>

              {
    /* Metric Item: Ledger Reductions */
  }
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#50fa7b]/10 text-[#50fa7b] border border-[#50fa7b]/15 flex items-center justify-center shrink-0">
                    <ArrowDownRight className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Ledger Offsets</h5>
                    <p className="text-[9px] text-slate-500 font-mono">Negative energy & transit reductions</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#50fa7b]">
                  -{metrics.registeredOffsets.toFixed(1)} kg CO2e
                </span>
              </div>

              {
    /* Metric Item: Active Commitments Offsets */
  }
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-[#ffb86c]/10 text-[#ffb86c] border border-[#ffb86c]/15 flex items-center justify-center shrink-0">
                    <Award className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Commitment Bonuses</h5>
                    <p className="text-[9px] text-slate-500 font-mono">Weekly pledges completed or advanced</p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#ffb86c]">
                  -{metrics.commitmentOffsets.toFixed(1)} kg CO2e
                </span>
              </div>

              {
    /* Net Position Breakdown in Financial Style */
  }
              <div className="pt-2">
                <div className="bg-black/40 rounded-xl p-3.5 border border-white/5 flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Net Carbon Balance</h5>
                    <p className="text-[9px] text-slate-500 mt-0.5">Aggregate surplus (deficits) today</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-base font-bold font-mono ${metrics.netBalance <= 0 ? "text-[#50fa7b]" : "text-[#ff5555]"}`}>
                      {metrics.netBalance <= 0 ? "" : "+"}{metrics.netBalance.toFixed(1)} kg
                    </span>
                    <span className="block text-[8px] font-mono text-[#6272a4] uppercase font-bold tracking-wider">
                      {metrics.netBalance <= 0 ? "CLIMATE POSITIVE" : "CUMULATIVE EXTRA"}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {
    /* Environmental Milestone Tiers badge */
  }
          <div className={`border rounded-2xl p-4 flex items-center justify-between relative overflow-hidden text-left shadow-sm ${metrics.tierColor}`}>
            <div className="space-y-1 overflow-hidden pr-2">
              <span className="text-[8.5px] font-mono tracking-widest uppercase font-bold">CURRENT STAGE LEVEL</span>
              <h5 className="text-xs font-bold text-white truncate">{metrics.tier}</h5>
              <p className="text-[10px] text-slate-400 leading-snug">
                Earn offsets to escalate through wood, leaf, and forest paragon status levels!
              </p>
            </div>
            
            <span className="text-2xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] flex-shrink-0 relative z-10">
              {metrics.totalOffsets >= 50 ? "\u{1F333}" : metrics.totalOffsets >= 20 ? "\u{1F332}" : metrics.totalOffsets >= 5 ? "\u{1F331}" : "\u{1F341}"}
            </span>
          </div>

          {
    /* Dynamic interactive tips to increase offsets */
  }
          <div className="bg-[#1e1f29]/30 border border-white/5 rounded-2xl p-4 text-xs space-y-1">
            <h5 className="font-bold text-[#8be9fd] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500/10" />
              How to improve your balance sheet today:
            </h5>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed pt-1.5">
              <li>Log green reductions like carpooling, cycling, or turning off phantom power.</li>
              <li>Commit to and complete multi-day global weekly commitments.</li>
              <li>Toggle parameters in Ember's <strong className="text-slate-300">Predictive Future</strong> advisor to construct a carbon-neutral outline.</li>
            </ol>
          </div>

        </div>
      </div>
    </div>;
}
