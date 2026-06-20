/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, CheckCircle2, XCircle, RotateCcw, AlertTriangle, HelpCircle } from "lucide-react";
const QuizDeck = [
  {
    id: 1,
    question: "Under equal product weights, which of the following foods releases the highest aggregate greenhouse emissions?",
    choices: [
      "Farming Cheese & Dairy",
      "Marine Salmon Catching",
      "Conventional Tofu Production",
      "Grass-Fed Beef Herding"
    ],
    correctAnswerIndex: 3,
    explanation: "Beef herding releases massive methane emissions due to enteric fermentation, requiring 50kg to 100kg of CO2 equivalents per kg of beef produced!"
  },
  {
    id: 2,
    question: "How much carbon dioxide does an average standard passenger car release per mile driven globally?",
    choices: [
      "Around 100 grams",
      "Around 400 grams",
      "Around 900 grams",
      "Around 1200 grams"
    ],
    correctAnswerIndex: 1,
    explanation: "An average passenger car emits approximately 350-400 grams of direct CO2 per mile, meaning standard road commutes compound emissions massively over a month."
  },
  {
    id: 3,
    question: "What is the primary cause of 'phantom energy loss' in residential spaces?",
    choices: [
      "Running central heating in sleep mode",
      "Incorret insulation seals on kitchen windows",
      "Leaving device accessories plugged in standby",
      "Using standard halogen light fittings"
    ],
    correctAnswerIndex: 2,
    explanation: "Standby standby loads, or 'vampire power,' can consume up to 10% of a home's total electricity. Unplugging fully charged devices avoids substantial grid waste."
  },
  {
    id: 4,
    question: "Which transport model enjoys the lowest average carbon footprint per passenger mile?",
    choices: [
      "Electric Vehicle (EV)",
      "High-Speed Passenger Train",
      "Public Hybrid City Bus",
      "Eco Economy Domestic Transit"
    ],
    correctAnswerIndex: 1,
    explanation: "Mass electric high-speed rails are highly energy-efficient and run at high passenger capacities, cutting passenger-mile footprints down to less than 20 grams."
  }
];
export default function EcoQuizGame() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [showGameSummary, setShowGameSummary] = useState(false);
  const activeQuestion = QuizDeck[currentIdx];
  const handleSelectAnswer = (idx) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);
    if (idx === activeQuestion.correctAnswerIndex) {
      setQuizScore((s) => s + 25);
    }
  };
  const handleNextQuestion = () => {
    if (currentIdx + 1 < QuizDeck.length) {
      setCurrentIdx((curr) => curr + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      setShowGameSummary(true);
    }
  };
  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setIsAnswered(false);
    setQuizScore(0);
    setShowGameSummary(false);
  };
  return <div id="quiz-questions-card" className="bg-gradient-to-br from-[#1c1202] via-[#09111e] to-[#040612] rounded-3xl p-6 shadow-2xl border border-amber-500/20 flex flex-col h-full justify-between text-white shadow-[0_0_35px_rgba(245,158,11,0.08)]">
      <div>
        <div className="flex items-center justify-between border-b border-amber-950 pb-4 mb-4">
          <div>
            <h3 className="text-xl font-sans font-bold text-white flex items-center gap-1.5 font-display">
              <HelpCircle className="w-5 h-5 text-emerald-400" /> EcoSphere Climate Quiz
            </h3>
            <p className="text-xs text-slate-400">Test your ecological intelligence on real global parameters</p>
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-[#34d399] bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-900/40">
              Q: {currentIdx + 1} / {QuizDeck.length}
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!showGameSummary ? <motion.div
    key={currentIdx}
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0 }}
    className="space-y-4"
  >
              {
    /* Question Text */
  }
              <div className="min-h-[60px] flex items-center">
                <h4 className="font-sans font-extrabold text-sm text-slate-100 leading-relaxed text-left font-display">
                  {activeQuestion.question}
                </h4>
              </div>

              {
    /* Choices List */
  }
              <div id="quiz-options-group" className="space-y-2">
                {activeQuestion.choices.map((choice, idx) => {
    let buttonStyle = "border-slate-800 bg-[#070b14]/50 hover:bg-[#111827] text-slate-300 font-medium hover:border-slate-700";
    let indicatorIcon = null;
    if (isAnswered) {
      if (idx === activeQuestion.correctAnswerIndex) {
        buttonStyle = "border-emerald-500 bg-emerald-950/40 text-[#34d399] font-bold";
        indicatorIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
      } else if (idx === selectedIdx) {
        buttonStyle = "border-rose-500 bg-rose-950/40 text-rose-450 font-bold";
        indicatorIcon = <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />;
      } else {
        buttonStyle = "opacity-30 border-slate-850 bg-[#070b14]/10 text-slate-500";
      }
    }
    return <button
      key={idx}
      id={`quiz-choice-${idx}`}
      onClick={() => handleSelectAnswer(idx)}
      disabled={isAnswered}
      className={`w-full text-left p-3 px-4 rounded-xl text-xs flex justify-between items-center transition-all border cursor-pointer ${buttonStyle}`}
    >
                      <span>{choice}</span>
                      {indicatorIcon}
                    </button>;
  })}
              </div>

              {
    /* Verified Explanation Section */
  }
              {isAnswered && <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-emerald-950/20 border border-emerald-900/40 text-slate-300 rounded-2xl p-4 text-xs select-text text-left"
  >
                  <p className="font-bold text-emerald-400 flex items-center gap-1 font-sans">
                    <AlertTriangle className="w-4 h-4 text-amber-500" /> Fact Check:
                  </p>
                  <p className="leading-relaxed text-slate-300 mt-1">{activeQuestion.explanation}</p>
                </motion.div>}
            </motion.div> : (
    /* Results & Stats view */
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-6 space-y-4 flex flex-col items-center justify-center"
    >
              <div className="w-16 h-16 rounded-full bg-emerald-950/45 border border-emerald-800/40 text-emerald-400 flex items-center justify-center animate-bounce">
                <Award className="w-9 h-9 fill-emerald-950/50" />
              </div>
              <div>
                <h4 className="text-xl font-sans font-extrabold text-white font-display">Quiz Completed!</h4>
                <p className="text-xs text-slate-400 mt-1">Excellent carbon intelligence building effort</p>
              </div>

              <div className="bg-[#070b14] border border-slate-800 rounded-2xl p-4 w-full max-w-[240px]">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Carbon Score</span>
                <span className="text-2xl font-bold font-mono text-[#34d399] block mt-1">{quizScore} / 100 PTS</span>
              </div>

              <p className="text-xs text-slate-400 max-w-[280px]">
                {quizScore === 100 ? "\u2B50 Eco Genius! You have complete mastery of global carbon impact figures." : "\u{1F331} Great work. Each fact learned strengthens real-world carbon abatement."}
              </p>
            </motion.div>
  )}
        </AnimatePresence>
      </div>

      {isAnswered && <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end">
          {!showGameSummary ? <button
    onClick={handleNextQuestion}
    id="btn-quiz-advance"
    className="bg-emerald-600 hover:bg-emerald-700 border-none text-white font-sans font-bold py-2.5 px-6 rounded-xl text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
  >
              Continue
            </button> : <button
    onClick={handleResetQuiz}
    id="btn-quiz-reset"
    className="bg-slate-805 hover:bg-slate-900 bg-slate-800 border-none text-white font-sans font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-1 cursor-pointer"
  >
              <RotateCcw className="w-3.5 h-3.5" /> Retry Quiz
            </button>}
        </div>}
    </div>;
}
