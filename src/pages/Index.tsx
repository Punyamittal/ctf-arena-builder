import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Clock, Lightbulb, Trophy, ChevronDown, Shield } from "lucide-react";
import AnimatedGrid from "@/components/AnimatedGrid";
import CountdownTimer from "@/components/CountdownTimer";

const Index = () => {
  const navigate = useNavigate();
  // Competition starts in 1 hour from now for demo
  const competitionStart = Date.now() + 3600000;

  const features = [
    {
      icon: Clock,
      title: "60 Minutes",
      description: "Race against the clock. Every second counts in this high-stakes challenge.",
    },
    {
      icon: Lightbulb,
      title: "Smart Hints",
      description: "Automatic hints unlock at 15 and 30 minutes — but they cost you points.",
    },
    {
      icon: Trophy,
      title: "Live Rankings",
      description: "Real-time leaderboard. Climb to the top and prove your skills.",
    },
    {
      icon: Shield,
      title: "Multi-Category",
      description: "Web, Crypto, Forensics, Reverse Engineering and more.",
    },
  ];

  const hintSteps = [
    { time: "0 min", points: "100 pts", label: "Full Reward", active: true },
    { time: "15 min", points: "75 pts", label: "Hint 1 Unlocks", active: false },
    { time: "30 min", points: "50 pts", label: "Hint 2 Unlocks", active: false },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedGrid />

      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-background via-background/90 to-background pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 glass-card neon-glow px-4 py-2 mb-8"
          >
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-primary">FOR 1ST & 2ND YEAR STUDENTS</span>
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-bold mb-4 tracking-tight">
            <span className="neon-text">CTF</span>{" "}
            <span className="text-foreground">Arena</span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground font-mono mb-2">
            Think. <span className="text-primary">Break.</span> Capture.
          </p>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">
            A 60-minute Capture The Flag competition. Solve challenges, earn points, and climb the leaderboard.
          </p>

          <div className="flex flex-col items-center gap-8 mb-12">
            <CountdownTimer targetTime={competitionStart} />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/dashboard")}
              className="glass-card neon-glow px-10 py-4 text-lg font-bold text-primary-foreground bg-primary rounded-2xl transition-all hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
            >
              Enter Arena
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 animate-bounce"
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-16"
          >
            How It <span className="neon-text">Works</span>
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center group hover:neon-glow transition-all duration-300"
              >
                <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hint System Explanation */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-4"
          >
            Hint <span className="neon-text">System</span>
          </motion.h2>
          <p className="text-center text-muted-foreground mb-12">
            Hints unlock automatically over time — but each one reduces your potential reward.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {hintSteps.map((step, i) => (
              <motion.div
                key={step.time}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex-1 w-full"
              >
                <div
                  className={`glass-card p-6 text-center ${
                    i === 0 ? "neon-glow" : i === 1 ? "violet-glow" : "border-destructive/30"
                  }`}
                >
                  <div className="font-mono text-sm text-muted-foreground mb-1">{step.time}</div>
                  <div className={`text-2xl font-bold font-mono ${i === 0 ? "neon-text" : i === 1 ? "text-secondary" : "text-destructive"}`}>
                    {step.points}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{step.label}</div>
                </div>
                {i < hintSteps.length - 1 && (
                  <div className="hidden md:block text-center text-muted-foreground mt-2">→</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center text-sm text-muted-foreground border-t border-border/30">
        <p className="font-mono">CTF Arena © 2026 — Built for learners, by hackers.</p>
      </footer>
    </div>
  );
};

export default Index;
