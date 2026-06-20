/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Shield, Mail, Key, User, ArrowRight, Sun, CheckCircle2, Globe, Laptop, Leaf, Zap, Droplet, Flame, Heart, Compass, Award, Bot } from "lucide-react";
import EcoSphereLogo from "./EcoSphereLogo";
export default function EcoLoginGateway({ onLoginComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [authMethod, setAuthMethod] = useState("google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("icon-leaf");
  const [archetype, setArchetype] = useState("Solarpunk Coder");
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("The selected image file is too large! Please upload an image under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setSelectedAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [isVerifyingGoogle, setIsVerifyingGoogle] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  const avatarsList = [
    "icon-leaf",
    "icon-sun",
    "icon-globe",
    "icon-shield",
    "icon-sparkles",
    "icon-zap",
    "icon-droplet",
    "icon-flame",
    "icon-heart",
    "icon-compass",
    "icon-award",
    "icon-bot",
    "\u{1F98A}",
    "\u{1F43C}",
    "\u{1F428}",
    "\u{1F981}",
    "\u{1F438}",
    "\u{1F989}",
    "\u{1F9A6}",
    "\u{1F43F}\uFE0F",
    "\u{1F41D}",
    "\u{1F98B}",
    "\u{1F422}"
  ];
  const renderAvatarIcon = (item, className = "w-5 h-5") => {
    if (item === "icon-leaf") return <Leaf className={`${className} text-emerald-400`} />;
    if (item === "icon-sun") return <Sun className={`${className} text-amber-400`} />;
    if (item === "icon-globe") return <Globe className={`${className} text-[#34d399]`} />;
    if (item === "icon-shield") return <Shield className={`${className} text-emerald-400`} />;
    if (item === "icon-sparkles") return <Sparkles className={`${className} text-amber-300`} />;
    if (item === "icon-zap") return <Zap className={`${className} text-yellow-400`} />;
    if (item === "icon-droplet") return <Droplet className={`${className} text-sky-400`} />;
    if (item === "icon-flame") return <Flame className={`${className} text-orange-400`} />;
    if (item === "icon-heart") return <Heart className={`${className} text-rose-500`} />;
    if (item === "icon-compass") return <Compass className={`${className} text-teal-400`} />;
    if (item === "icon-award") return <Award className={`${className} text-yellow-405 text-yellow-400`} />;
    if (item === "icon-bot") return <Bot className={`${className} text-cyan-400`} />;
    return null;
  };
  const renderArchetypeIcon = (iconName, className = "w-4 h-4") => {
    if (iconName === "laptop") return <Laptop className={`${className} text-emerald-400`} />;
    if (iconName === "compass") return <Compass className={`${className} text-sky-400`} />;
    if (iconName === "leaf") return <Leaf className={`${className} text-teal-400`} />;
    if (iconName === "zap") return <Zap className={`${className} text-amber-400`} />;
    return <User className={className} />;
  };
  const archetypesList = [
    { title: "Solarpunk Coder", desc: "Minimizes gadget standby phantom currents.", icon: "laptop" },
    { title: "Urban Transit Rover", desc: "Avoids heavy single-commutes, cycles constantly.", icon: "compass" },
    { title: "Bio-Flora Chef", desc: "Enjoys localized vegan culinary crafts.", icon: "leaf" },
    { title: "Grid Overlord", desc: "Tackles central cooling and renewable solar offsets.", icon: "zap" }
  ];
  const handleStartGoogleAuth = () => {
    setIsVerifyingGoogle(true);
    setVerificationProgress(10);
    const interval = setInterval(() => {
      setVerificationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVerifyingGoogle(false);
            setEmail("priyankapriyadarsinibej@gmail.com");
            setUsername("Priyanka Bej");
            setSelectedAvatar("\u{1F916}");
            setCurrentStep(2);
          }, 800);
          return 100;
        }
        return prev + 15;
      });
    }, 150);
  };
  const handleTraditionalNext = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    const temporaryName = email.split("@")[0];
    setUsername(temporaryName.charAt(0).toUpperCase() + temporaryName.slice(1));
    setCurrentStep(2);
  };
  const handleFinishDeployment = () => {
    onLoginComplete({
      name: username || "Carbon Pioneer",
      email: email || "pioneer@ecosphere.com",
      avatar: selectedAvatar,
      archetype,
      bonusPoints: authMethod === "google" ? 50 : 25
      // extra reward for secure OAuth
    });
  };
  return <div id="eco-login-overlay" className="fixed inset-0 z-50 bg-[#070b14]/98 text-slate-100 flex items-center justify-center p-4 overflow-y-auto font-sans">
      
      {
    /* Decorative organic background vectors */
  }
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-emerald-950/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-indigo-950/20 rounded-full blur-[110px]" />
      </div>

      <motion.div
    initial={{ opacity: 0, scale: 0.98, y: 15 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="w-full max-w-lg bg-[#0e1628] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between text-white"
  >
        {
    /* Glow border bar */
  }
        <div className="absolute top-0 inset-x-0 h-[4px] bg-gradient-to-r from-emerald-600 to-teal-550" />

        {
    /* Top Branding Section */
  }
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center gap-1.5 items-center">
            <span className="h-9 w-9 rounded-xl bg-[#070b14] flex items-center justify-center shadow-sm border border-slate-800/80">
              <EcoSphereLogo className="w-6 h-6" />
            </span>
            <span className="font-mono text-[9px] uppercase text-emerald-400 font-bold tracking-wider bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-900/40">
              SECURE LEDGER ACCESS
            </span>
          </div>
          <h2 className="text-2xl font-display font-bold tracking-tight text-white">EcoSphere</h2>
          <p className="text-xs text-slate-400 max-w-sm mx-auto font-sans leading-normal">
            Authenticate to sync your personalized ledger inputs, active ecosystem challenges, and community rankings.
          </p>
        </div>

        {
    /* Progress nodes */
  }
        <div className="flex items-center justify-center gap-3 mb-6 font-mono text-[10px]">
          <div className={`flex items-center gap-1.5 ${currentStep >= 1 ? "text-emerald-400 font-bold" : "text-slate-550"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold border ${currentStep >= 1 ? "border-emerald-500 bg-emerald-950 text-emerald-400" : "border-slate-850 bg-slate-900"}`}>1</span>
            <span>GATEWAY</span>
          </div>
          <div className="h-[1px] w-6 bg-slate-800/80" />
          <div className={`flex items-center gap-1.5 ${currentStep >= 2 ? "text-emerald-400 font-bold" : "text-slate-550"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold border ${currentStep >= 2 ? "border-emerald-500 bg-emerald-950 text-emerald-400" : "border-slate-850 bg-slate-900"}`}>2</span>
            <span>ARCHETYPE</span>
          </div>
          <div className="h-[1px] w-6 bg-slate-800/80" />
          <div className={`flex items-center gap-1.5 ${currentStep >= 3 ? "text-emerald-400 font-bold" : "text-slate-550"}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold border ${currentStep >= 3 ? "border-emerald-500 bg-emerald-950 text-emerald-400" : "border-slate-850 bg-slate-900"}`}>3</span>
            <span>INTEGRATE</span>
          </div>
        </div>

        {
    /* Action Panel Area */
  }
        <div className="relative min-h-[290px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {currentStep === 1 && <motion.div
    key="step1"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 10 }}
    className="space-y-4 w-full"
  >
                {
    /* Method Tabs */
  }
                <div className="flex bg-[#070b14] p-1.5 rounded-xl border border-slate-800/60">
                  <button
    type="button"
    onClick={() => setAuthMethod("google")}
    className={`flex-1 py-2 text-xs font-display font-semibold rounded-lg transition-all cursor-pointer ${authMethod === "google" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white hover:bg-[#111827]/40"}`}
  >
                    Google Single Sign-On
                  </button>
                  <button
    type="button"
    onClick={() => setAuthMethod("traditional")}
    className={`flex-1 py-2 text-xs font-display font-semibold rounded-lg transition-all cursor-pointer ${authMethod === "traditional" ? "bg-emerald-600 text-white shadow" : "text-slate-400 hover:text-white hover:bg-[#111827]/40"}`}
  >
                    Custom Credentials
                  </button>
                </div>

                {authMethod === "google" ? <div className="space-y-4 pt-2 text-center">
                    <p className="text-xs text-slate-400">
                      Instantly bind your official environmental logs using decentralized authentication. No custom passwords required.
                    </p>

                    {isVerifyingGoogle ? <div className="bg-[#070b14]/50 rounded-2xl p-6 border border-slate-805 space-y-4">
                        <div className="flex justify-between items-center text-xs font-mono text-emerald-400">
                          <span>Connecting Google Servers...</span>
                          <span>{verificationProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                          <motion.div
    style={{ width: `${verificationProgress}%` }}
    className="bg-emerald-600 h-full rounded-full"
  />
                        </div>
                        <p className="text-[10px] text-slate-500 italic">Reading certified sandbox credentials...</p>
                      </div> : <button
    type="button"
    onClick={handleStartGoogleAuth}
    className="w-full bg-[#070b14]/85 hover:bg-[#111827] text-white font-display font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all text-xs cursor-pointer shadow-sm select-none border border-slate-800 active:scale-[0.98]"
  >
                        {
    /* High-fidelity SVG of Google icon */
  }
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                          <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.47 14.99 1 12 1 7.24 1 3.2 3.73 1.15 7.72l3.86 3A7.01 7.01 0 0 1 12 5.04z" />
                          <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46C18.18 15.93 15.65 18 12 18c-3.1 0-5.74-2.09-6.68-4.9l-3.86 3C3.5 20.1 7.42 23 12 23c5.84 0 10.74-4.22 11.49-10.73z" />
                          <path fill="#FBBC05" d="M5.32 13.1a6.97 6.97 0 0 1 0-2.2l-3.86-3a11.95 11.95 0 0 0 0 8.2l3.86-3z" />
                          <path fill="#34A853" d="M12 18.96c-1.84 0-3.48-.49-4.81-1.3l-3.86 3C5.55 22.37 8.57 23 12 23z" />
                        </svg>
                        Continue with Google Secure Accounts
                      </button>}
                  </div> : <form onSubmit={handleTraditionalNext} className="space-y-3.5 pt-1 text-left">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">EMAIL ADDRESS</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-550" />
                        <input
    type="email"
    required
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="your.name@pioneer.com"
    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-600 transition-colors placeholder:text-slate-600"
  />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">SECURITY SECRET</label>
                      <div className="relative">
                        <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-555" />
                        <input
    type="password"
    required
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="•••••••••••••••••••••"
    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-emerald-600 transition-colors placeholder:text-slate-650"
  />
                      </div>
                    </div>

                    <button
    type="submit"
    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-xs cursor-pointer border-none active:scale-[0.98]"
  >
                      Authenticate traditional profile <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>}
              </motion.div>}

            {currentStep === 2 && <motion.div
    key="step2"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 10 }}
    className="space-y-4 w-full text-left"
  >
                {
    /* Username setup */
  }
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">LEADERBOARD DISPLAY NAME</label>
                  <input
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    placeholder="Enter pioneer nickname"
    className="w-full bg-[#070b14] border border-slate-800 rounded-xl py-2.5 px-3 text-xs font-bold text-white focus:outline-none focus:border-emerald-600"
  />
                </div>

                {
    /* Avatar select */
  }
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest flex justify-between items-center font-bold">
                    <span>SELECT CLIMATE AVATAR</span>
                    <span className="text-[9px] text-emerald-400 font-sans font-bold">or upload custom photo</span>
                  </label>
                  <div className="flex flex-col gap-2 bg-[#070b14] p-2.5 rounded-2xl border border-slate-800">
                    <div className="flex flex-wrap gap-1.5 justify-center py-1">
                      {avatarsList.map((item) => <button
    key={item}
    type="button"
    onClick={() => setSelectedAvatar(item)}
    className={`w-10 h-10 rounded-lg text-lg flex items-center justify-center transition-all cursor-pointer ${selectedAvatar === item ? "bg-emerald-600 ring-2 ring-emerald-450 scale-105 shadow text-white" : "bg-[#111827]/60 hover:bg-[#152035] text-slate-300 border border-slate-800"}`}
  >
                          {item.startsWith("icon-") ? renderAvatarIcon(item, "w-5 h-5") : item}
                        </button>)}
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-slate-800/80 pt-2.5 px-1 gap-2">
                      <div className="flex items-center gap-2">
                        {
    /* Selected Preview */
  }
                        <div className="w-9 h-9 rounded-xl bg-[#070b14] border border-slate-800 flex items-center justify-center text-xs font-bold text-slate-200 overflow-hidden flex-shrink-0">
                          {selectedAvatar.startsWith("data:image") ? <img src={selectedAvatar} alt="Custom avatar preview" className="w-full h-full object-cover" /> : selectedAvatar.startsWith("icon-") ? renderAvatarIcon(selectedAvatar, "w-5 h-5") : <span className="text-xl">{selectedAvatar}</span>}
                        </div>
                        <div className="text-left font-sans">
                          <p className="text-[10px] font-bold text-slate-200">Active Avatar</p>
                          <p className="text-[9px] text-slate-400 truncate max-w-[130px]">
                            {selectedAvatar.startsWith("data:image") ? "Uploaded Photo" : "Environmental Nickname"}
                          </p>
                        </div>
                      </div>
                      
                      <label className="bg-emerald-600 hover:bg-emerald-700 border-none text-white rounded-xl py-1.5 px-3 font-semibold text-[10px] flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all">
                        <span>Upload Photo</span>
                        <input
    type="file"
    accept="image/*"
    onChange={handleFileChange}
    className="hidden"
  />
                      </label>
                    </div>
                  </div>
                </div>

                {
    /* Archetype select */
  }
                <div className="space-y-1">
                  <label className="block text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">CHOOSE SPECIALIZATION ALIGNMENT</label>
                  <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1">
                    {archetypesList.map((arch) => <button
    key={arch.title}
    type="button"
    onClick={() => setArchetype(arch.title)}
    className={`w-full p-2.5 rounded-xl text-left border flex items-center gap-2.5 transition-all text-xs cursor-pointer ${archetype === arch.title ? "border-emerald-600 bg-emerald-950/40 text-emerald-300 shadow-sm" : "border-slate-800 bg-[#070b14]/50 hover:bg-[#111827] text-slate-300"}`}
  >
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border ${archetype === arch.title ? "bg-[rgba(16,185,129,0.15)] text-emerald-400 border-emerald-500/30" : "bg-[#070b14] text-slate-400 border-slate-800"}`}>
                          {renderArchetypeIcon(arch.icon || "user", "w-4.5 h-4.5")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold leading-tight truncate text-white">{arch.title}</h4>
                          <p className="text-[10px] text-slate-400 leading-normal line-clamp-1">{arch.desc}</p>
                        </div>
                      </button>)}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
    type="button"
    onClick={() => setCurrentStep(1)}
    className="flex-1 bg-[#070b14] hover:bg-[#111827] border border-slate-800 text-slate-300 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all"
  >
                    Back
                  </button>
                  <button
    type="button"
    onClick={() => setCurrentStep(3)}
    className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2 rounded-xl text-xs text-white font-bold shadow-sm border-none cursor-pointer transition-all"
  >
                    Confirm Alignment
                  </button>
                </div>
              </motion.div>}

            {currentStep === 3 && <motion.div
    key="step3"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="space-y-5 text-center py-2"
  >
                <div className="w-16 h-16 rounded-full bg-emerald-950/50 text-emerald-450 flex items-center justify-center mx-auto border border-emerald-800/40">
                  <Shield className="w-9 h-9" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">CREDENTIAL CLEARANCE OK</span>
                  <h3 className="text-lg font-display font-bold text-white">Security Verification Cleared</h3>
                  <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-4 max-w-sm mx-auto space-y-1.5 font-mono text-[11px] text-slate-300">
                    <p className="flex justify-between items-center">
                      <span>User profile:</span> 
                      <span className="font-sans font-bold text-white flex items-center gap-1.5">
                        {username} 
                        {selectedAvatar.startsWith("data:image") || selectedAvatar.length > 4 ? <img src={selectedAvatar} alt="" className="w-5 h-5 rounded-md object-cover inline-block" /> : <span className="text-lg">{selectedAvatar}</span>}
                      </span>
                    </p>
                    <p className="flex justify-between"><span>Ecosystem Alignment:</span> <span className="text-emerald-400 font-bold font-sans">{archetype}</span></p>
                    <p className="flex justify-between"><span>Integration Method:</span> <span className="text-slate-300">{authMethod === "google" ? "Google Authenticated" : "Secure Email Verified"}</span></p>
                    <p className="flex justify-between"><span>Initial Karma Balance:</span> <span className="text-emerald-400 font-bold font-sans">+50 PTS (Secure Sync)</span></p>
                  </div>
                </div>

                <button
    onClick={handleFinishDeployment}
    id="btn-complete-auth-entry"
    className="w-full bg-emerald-600 hover:bg-emerald-700 text-[13px] font-display font-bold py-3 px-4 rounded-xl text-white tracking-wide border-none shadow active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-4"
  >
                  ENTER ECOSPHERE PORTAL <CheckCircle2 className="w-4 h-4" />
                </button>
              </motion.div>}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>;
}
