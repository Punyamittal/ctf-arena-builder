import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Send, CheckCircle, XCircle, Lightbulb, Lock, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useGameState } from "@/hooks/useGameState";

const ChallengePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { challenges, score, endTime, getCurrentPoints, getAvailableHints, submitFlag } = useGameState();

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
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Challenges
        </button>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Problem Description */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-bold">{challenge.title}</h1>
                <span className="glass-card px-3 py-0.5 text-xs font-mono text-primary">{challenge.category}</span>
              </div>
              <div className="prose prose-invert max-w-none">
                {challenge.description.split("\n").map((line, i) => (
                  <p key={i} className={`text-muted-foreground ${line.startsWith("URL:") ? "font-mono text-primary" : ""}`}>
                    {line || <br />}
                  </p>
                ))}
              </div>
            </div>

            {/* Hints */}
            <div className="glass-card p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-warning" /> Hints
              </h3>
              <div className="space-y-3">
                {[0, 1].map((i) => (
                  <div key={i} className={`glass-card p-4 border ${hints[i] ? "border-warning/30" : "border-border/30"}`}>
                    {hints[i] ? (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                        <span className="text-xs text-warning font-mono mb-1 block">HINT {i + 1} UNLOCKED</span>
                        <p className="text-sm text-foreground">{hints[i]}</p>
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Lock className="w-4 h-4" />
                        <span>Hint {i + 1} unlocks at {i === 0 ? "15" : "30"} minutes</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submission Panel */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 neon-glow sticky top-24">
              <h3 className="font-semibold text-lg mb-2">Submit Flag</h3>
              <p className="text-xs text-muted-foreground mb-4 font-mono">Format: FLAG&#123;...&#125;</p>

              <div className="mb-4">
                <div className="text-center">
                  <span className="text-xs text-muted-foreground">Current Reward</span>
                  <p className="text-4xl font-bold font-mono neon-text">{currentPoints} pts</p>
                  {currentPoints < 100 && (
                    <span className="text-xs text-warning flex items-center justify-center gap-1 mt-1">
                      <AlertTriangle className="w-3 h-3" /> Reduced by hints
                    </span>
                  )}
                </div>
              </div>

              {challenge.solved ? (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="text-center py-6"
                >
                  <CheckCircle className="w-16 h-16 text-success mx-auto mb-3" />
                  <p className="text-success font-bold text-lg">Challenge Solved!</p>
                  <p className="text-muted-foreground text-sm mt-1">+{currentPoints} points earned</p>
                </motion.div>
              ) : (
                <>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      value={flag}
                      onChange={(e) => setFlag(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                      placeholder="FLAG{...}"
                      className="w-full bg-muted/50 border border-border/50 rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_hsl(var(--primary)/0.4)]"
                  >
                    <Send className="w-4 h-4" /> Submit Flag
                  </motion.button>

                  <AnimatePresence>
                    {result === "wrong" && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-4 flex items-center gap-2 text-destructive text-sm justify-center"
                      >
                        <XCircle className="w-4 h-4" /> Incorrect flag. Try again.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default ChallengePage;
