import { useState } from "react";
import { motion } from "motion/react";
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup
} from "../lib/firebase";
import { Lock, Mail, ChevronRight, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import EcoSphereLogo from "./EcoSphereLogo";
export default function AuthScreen({ onSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all standard identity fields.");
      return;
    }
    if (isSignUp && !displayName) {
      setError("Please specify a profile display name.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const user = credential.user;
        onSuccess({
          uid: user.uid,
          email: user.email,
          displayName,
          isNewUser: true
        });
      } else {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const user = credential.user;
        onSuccess({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split("@")[0] || "User",
          isNewUser: false
        });
      }
    } catch (err) {
      console.error(err);
      let errMsg = err.message || "An authentication error occurred.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        errMsg = "Invalid email or security password. Please verify and retry.";
      } else if (err.code === "auth/invalid-credential") {
        errMsg = "Invalid credentials provided. Please check password and email accuracy.";
      } else if (err.code === "auth/email-already-in-use") {
        errMsg = "This email registration is already reserved by another Carbon Pioneer.";
      } else if (err.code === "auth/weak-password") {
        errMsg = "Security level insufficient. Password must be at least 6 characters.";
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };
  const handleGoogleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const user = credential.user;
      onSuccess({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "Google Pioneer",
        isNewUser: false
      });
    } catch (err) {
      console.error(err);
      setError(err.message || "Unable to establish Google authentication connection.");
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-[#1e1f29] text-[#f8f8f2] flex flex-col items-center justify-center p-4 selection:bg-[#44475a] relative overflow-hidden font-sans">
      {
    /* Decorative Atmosphere Elements */
  }
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#50fa7b]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-[#bd93f9]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-[#8be9fd]/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {
    /* EcoSphere Logo Heading */
  }
        <div className="text-center mb-8">
          <motion.div
    className="inline-flex items-center justify-center bg-gradient-to-br from-[#bd93f9]/30 to-[#ff79c6]/30 p-2.5 rounded-2xl mb-3 border border-[#bd93f9]/50 shadow-[0_0_20px_rgba(189,147,249,0.35),inset_0_2px_4px_rgba(255,255,255,0.15)]"
    animate={{ rotate: [0, 5, -5, 0] }}
    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
    whileHover={{ scale: 1.1, rotate: 12 }}
  >
            <EcoSphereLogo className="w-8 h-8 filter drop-shadow-[0_0_4px_rgba(189,147,249,0.6)]" />
          </motion.div>
          
          <h1 className="text-3xl font-extrabold tracking-tight font-sans bg-clip-text text-transparent bg-gradient-to-r from-[#50fa7b] via-[#8be9fd] to-[#bd93f9]">
            EcoSphere
          </h1>
          <p className="text-[#6272a4] text-xs mt-1 font-mono uppercase tracking-widest font-semibold">
            Planetary Index & Bio-Garden Engine
          </p>
        </div>

        {
    /* Card Form */
  }
        <motion.div
    className="bg-[#282a36]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] relative overflow-hidden"
    layoutId="authCard"
  >
          {
    /* Accent Line */
  }
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#50fa7b] via-[#8be9fd] to-[#bd93f9]" />

          <h2 className="text-lg font-bold text-[#f8f8f2] mb-6 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8be9fd]" />
            {isSignUp ? "Initiate Carbon Account" : "Access Your Garden"}
          </h2>

          {error && <motion.div
    className="bg-[#ff5555]/10 border border-[#ff5555]/30 rounded-xl p-3 mb-5 flex items-start gap-2.5 text-xs text-[#ff5555]"
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
  >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && <div className="space-y-1.5">
                <label className="block text-[10px] uppercase font-mono tracking-widest text-[#6272a4] font-bold">
                  Explorer Display Name
                </label>
                <div className="relative">
                  <input
    type="text"
    value={displayName}
    onChange={(e) => setDisplayName(e.target.value)}
    placeholder="e.g. Priyanka Bej"
    className="w-full bg-black/35 border border-white/10 rounded-xl py-2.5 pl-3 pr-10 text-sm focus:outline-none focus:border-[#8be9fd]/50 focus:ring-1 focus:ring-[#8be9fd]/20 transition-all font-sans placeholder-[#6272a4]/70"
    disabled={loading}
    required
  />
                  <div className="absolute right-3.5 top-3 text-[#6272a4]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              </div>}

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-mono tracking-widest text-[#6272a4] font-bold">
                Identity Mail
              </label>
              <div className="relative">
                <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="explorer@planetary.org"
    className="w-full bg-black/35 border border-white/10 rounded-xl py-2.5 pl-3 pr-10 text-sm focus:outline-none focus:border-[#8be9fd]/50 focus:ring-1 focus:ring-[#8be9fd]/20 transition-all font-sans placeholder-[#6272a4]/70"
    disabled={loading}
    required
  />
                <div className="absolute right-3.5 top-3 text-[#6272a4]">
                  <Mail className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] uppercase font-mono tracking-widest text-[#6272a4] font-bold">
                Security Password
              </label>
              <div className="relative">
                <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="••••••••"
    className="w-full bg-black/35 border border-white/10 rounded-xl py-2.5 pl-3 pr-10 text-sm focus:outline-none focus:border-[#8be9fd]/50 focus:ring-1 focus:ring-[#8be9fd]/20 transition-all font-sans placeholder-[#6272a4]/70"
    disabled={loading}
    required
  />
                <div className="absolute right-3.5 top-3 text-[#6272a4]">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
            </div>

            <button
    type="submit"
    disabled={loading}
    className="w-full mt-2 cursor-pointer bg-gradient-to-r from-[#bd93f9]/90 to-[#ff79c6]/90 hover:from-[#bd93f9] hover:to-[#ff79c6] text-black font-semibold rounded-xl py-2.5 px-4 text-xs sm:text-sm shadow-[0_4px_15px_rgba(189,147,249,0.25)] flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none duration-200"
  >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : <>
                  <span>{isSignUp ? "Create Carbon Account" : "Authenticate Identity"}</span>
                  <ChevronRight className="w-4 h-4 text-black" />
                </>}
            </button>
          </form>

          {
    /* Social Sign In Divider */
  }
          <div className="relative my-6 text-center">
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-b border-[#44475a]/40" />
            <span className="relative bg-[#282a36] px-3.5 text-[10px] uppercase font-mono tracking-wider text-[#6272a4] font-extrabold">
              or connect securely via
            </span>
          </div>

          {
    /* Google Sign In */
  }
          <button
    type="button"
    onClick={handleGoogleAuth}
    disabled={loading}
    className="w-full cursor-pointer bg-black/40 border border-[#8be9fd]/20 hover:border-[#8be9fd]/50 rounded-xl py-2.5 px-4 text-xs sm:text-sm text-[#f8f8f2] flex items-center justify-center gap-3 hover:bg-[#8be9fd]/5 transition-all duration-200"
  >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
            </svg>
            <span className="font-semibold text-xs sm:text-sm">Sign in with Google</span>
          </button>

          {
    /* Toggle button */
  }
          <div className="text-center mt-6">
            <button
    type="button"
    onClick={() => {
      setIsSignUp(!isSignUp);
      setError(null);
    }}
    className="text-xs text-[#8be9fd] hover:text-[#50fa7b] hover:underline bg-transparent border-none outline-none cursor-pointer transition-colors"
  >
              {isSignUp ? "Already registered? Let's Sign In" : "New to Cosmic Sphere? Register Account"}
            </button>
          </div>
        </motion.div>

        {
    /* Informative Footer */
  }
        <p className="text-center text-[10px] font-mono text-[#6272a4] mt-8">
          IPCC Carbon Accounting & Bio-Sphere state encrypted via Firebase Security Rules.
        </p>
      </div>
    </div>;
}
