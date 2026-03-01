import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, CheckCircle, XCircle, Lightbulb, Lock, AlertTriangle, Download } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useGameState } from "@/hooks/useGameState";
import AnimatedGrid from "@/components/AnimatedGrid";

const ChallengePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { challenges, score, endTime, isStarted, getCurrentPoints, getAvailableHints, submitFlag } = useGameState();

  const challenge = challenges.find((c) => c.id === id);
  const [flag, setFlag] = useState("");
  const [result, setResult] = useState<"correct" | "wrong" | null>(null);
  const [hints, setHints] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (challenge) setHints(getAvailableHints(challenge));
    }, 1000);
    return () => clearInterval(interval);
  }, [challenge, getAvailableHints]);

  if (!challenge) {
    return (
      <DashboardLayout score={score} endTime={endTime}>
        <p>Challenge not found.</p>
      </DashboardLayout>
    );
  }

  const currentPoints = getCurrentPoints(challenge);

  const handleSubmit = () => {
    if (!flag.trim()) return;
    const correct = submitFlag(challenge.id, flag);
    setResult(correct ? "correct" : "wrong");
    if (!correct) setTimeout(() => setResult(null), 2500);
  };

  return (
    <DashboardLayout score={score} endTime={endTime}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-primary/40 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Theater
        </button>

        <div className="grid lg:grid-cols-5 gap-px bg-primary/10">
          {/* Problem Description */}
          <div className="lg:col-span-3 space-y-px bg-primary/10">
            <div className="bg-black p-8">
              <div className="flex flex-col gap-4 mb-8">
                <div className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/40 flex items-center gap-2">
                  <span className="w-4 h-[1px] bg-primary/20"></span>
                  Target Objective
                </div>
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl font-black uppercase tracking-tighter">{challenge.title}</h1>
                  <span className="border border-primary/20 px-3 py-0.5 text-[8px] font-bold tracking-[0.2em] uppercase text-primary/60">{challenge.category}</span>
                </div>
              </div>
              <div className="prose prose-invert max-w-none">
                {challenge.description.split("\n").map((line, i) => {
                  if (line.startsWith("File:") && challenge.fileUrl) {
                    return (
                      <div key={i} className="flex items-center justify-between border-l-2 border-primary pl-4 py-3 bg-primary/5 my-4 group">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold tracking-[0.2em] text-primary/40 uppercase">Attached Asset</span>
                          <p className="text-[11px] tracking-widest leading-loose uppercase text-primary font-bold">
                            {line.substring(5).trim()}
                          </p>
                        </div>
                        <a
                          href={challenge.fileUrl}
                          download
                          className="bg-primary/10 hover:bg-primary text-primary hover:text-black p-3 transition-all flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest hidden group-hover:block px-2">Download Package</span>
                        </a>
                      </div>
                    );
                  }
                  return (
                    <p key={i} className={`text-[11px] tracking-widest leading-loose uppercase ${line.startsWith("File:") ? "text-primary border-l-2 border-primary pl-4 py-2 bg-primary/5" : "text-primary/70"}`}>
                      {line || <br />}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Hints */}
            <div className="bg-black p-8 h-full">
              <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/40 flex items-center gap-2 mb-8">
                <Lightbulb className="w-4 h-4" /> Intelligence Briefs
              </h3>
              <div className="space-y-4">
                {[0, 1].map((i) => (
                  <div key={i} className={`border p-6 ${hints[i] ? "border-primary/40 bg-primary/5" : "border-primary/10 opacity-40"}`}>
                    {hints[i] ? (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <span className="text-[9px] text-primary font-bold tracking-widest uppercase mb-4 block">Briefing {i + 1} Decrypted</span>
                        <p className="text-[11px] tracking-widest leading-loose text-white uppercase">{hints[i]}</p>
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-3 text-primary/40 text-[10px] font-bold tracking-widest uppercase">
                        <Lock className="w-3 h-3" />
                        <span>Briefing {i + 1} inaccessible: T-{(challenge.hintTimes[i] / 60000).toFixed(0)}m window</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submission Panel */}
          <div className="lg:col-span-2">
            <div className="bg-black p-8 sticky top-24 h-full border-l border-primary/10">
              <h3 className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/40 flex items-center gap-2 mb-8">Flag Capture</h3>

              <div className="mb-12">
                <div className="bg-primary/5 border border-primary/10 p-8 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
                    <AnimatedGrid />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary/40 mb-2 block relative z-10">Bounty</span>
                  <p className="text-5xl font-black tracking-tighter text-primary relative z-10">{currentPoints}</p>
                  {currentPoints < challenge.basePoints && (
                    <span className="text-[8px] font-bold tracking-widest uppercase text-primary/60 flex items-center justify-center gap-1 mt-4 relative z-10">
                      <AlertTriangle className="w-3 h-3" /> Intel Deduction Applied
                    </span>
                  )}
                </div>
              </div>

              {challenge.solved ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 bg-primary text-black"
                >
                  <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                  <p className="font-black text-xl tracking-tighter uppercase">Objective Secured</p>
                  <p className="text-[10px] font-bold tracking-widest uppercase mt-2">+{currentPoints} Credits Synchronized</p>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div className="relative">
                    <div className="text-[9px] font-bold tracking-widest uppercase text-primary/40 mb-2">Input Sequence</div>
                    <input
                      type="text"
                      value={flag}
                      onChange={(e) => setFlag(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      placeholder="FLAG{...}"
                      className="w-full bg-primary/5 border border-primary/20 p-4 font-bold tracking-widest text-xs focus:outline-none focus:border-primary text-white placeholder:text-primary/20 uppercase disabled:opacity-30 disabled:cursor-not-allowed"
                      disabled={!isStarted}
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!isStarted}
                    className="w-full bg-primary text-black font-black uppercase tracking-[0.2em] py-5 text-xs hover:bg-white transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {!isStarted ? <Lock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    {!isStarted ? "Waiting to Start" : "Finalize Capture"}
                  </button>

                  {!isStarted && (
                    <div className="p-4 border border-dashed border-primary/20 text-[10px] font-bold tracking-widest uppercase text-center text-primary/60">
                      System Offline: Initialize Timer in Dashboard to enable capture
                    </div>
                  )}

                  <div className="text-[8px] font-bold tracking-[0.3em] uppercase text-primary/30 text-center">
                    Identity Verification Required for Authorization
                  </div>

                  <AnimatePresence>
                    {result === "wrong" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-black tracking-widest uppercase text-center flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Access Denied: Invalid Sequence
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ChallengePage;
