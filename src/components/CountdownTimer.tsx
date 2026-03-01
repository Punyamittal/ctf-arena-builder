import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
  targetTime: number; // ms timestamp
  compact?: boolean;
  onComplete?: () => void;
}

const CountdownTimer = ({ targetTime, compact = false, onComplete }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(() => Math.max(0, targetTime - Date.now()));

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = Math.max(0, targetTime - Date.now());
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetTime, onComplete]);

  const hours = Math.floor(timeLeft / 3600000);
  const minutes = Math.floor((timeLeft % 3600000) / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (compact) {
    return (
      <div className="font-mono text-lg neon-text tracking-widest">
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </div>
    );
  }

  const blocks = [
    { label: "Hours", value: pad(hours) },
    { label: "Minutes", value: pad(minutes) },
    { label: "Seconds", value: pad(seconds) },
  ];

  return (
    <div className="flex gap-4">
      {blocks.map((block, i) => (
        <motion.div
          key={block.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card neon-glow p-4 min-w-[80px] text-center"
        >
          <div className="font-mono text-3xl font-bold neon-text">{block.value}</div>
          <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{block.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

export default CountdownTimer;
