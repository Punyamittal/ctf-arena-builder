import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useGameState } from "@/hooks/useGameState";

interface Player {
  rank: number;
  username: string;
  score: number;
  solved: number;
  lastSolveTime?: number;
}

const rankIcons = [Trophy, Medal, Award];
const rankColors = ["text-warning", "text-muted-foreground", "text-warning/60"];

const BOTS = [
  {
    username: "sh4dowh4ck", solves: [
      { id: "forensics-1", time: 4 * 60 * 1000 },
      { id: "forensics-2", time: 15 * 60 * 1000 },
      { id: "forensics-3", time: 30 * 60 * 1000 },
    ]
  },
  {
    username: "crypt0queen", solves: [
      { id: "forensics-1", time: 8 * 60 * 1000 },
      { id: "forensics-3", time: 40 * 60 * 1000 },
    ]
  },
  {
    username: "null_byte", solves: [
      { id: "forensics-1", time: 12 * 60 * 1000 },
    ]
  },
];

const Leaderboard = () => {
  const { score, endTime, challenges, startTime, getElapsed } = useGameState();
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10000); // Update every 10s
    return () => clearInterval(interval);
  }, []);

  const solvedChallenges = challenges.filter((c) => c.solved);
  const lastSolveTime = solvedChallenges.length > 0
    ? Math.max(...solvedChallenges.map(c => c.solvedAt || 0))
    : 0;

  const elapsed = getElapsed();

  // Calculate bot scores based on elapsed time
  const activeBots = BOTS.map(bot => {
    let botScore = 0;
    let botSolvedCount = 0;
    let botLastSolve = 0;

    bot.solves.forEach(solve => {
      if (elapsed >= solve.time) {
        botSolvedCount++;
        botLastSolve = Math.max(botLastSolve, (startTime || 0) + solve.time);

        const challenge = challenges.find(c => c.id === solve.id);
        if (challenge) {
          let earnedPoints = challenge.basePoints;
          if (solve.time >= challenge.hintTimes[1]) {
            earnedPoints = Math.floor(challenge.basePoints * 0.5);
          } else if (solve.time >= challenge.hintTimes[0]) {
            earnedPoints = Math.floor(challenge.basePoints * 0.75);
          }

          // Add 1 point for every second left in the 1-hour window
          const timeLeftSeconds = Math.max(0, Math.floor((60 * 60 * 1000 - solve.time) / 1000));
          botScore += earnedPoints + timeLeftSeconds;
        }
      }
    });

    return {
      username: bot.username,
      score: botScore,
      solved: botSolvedCount,
      lastSolveTime: botLastSolve,
    };
  }).filter(bot => bot.solved > 0);

  // User player
  const you: Player = {
    rank: 0,
    username: "You",
    score,
    solved: solvedChallenges.length,
    lastSolveTime,
  };

  // For now, only the current user is tracked.
  // In a real app, this would fetch from a database.
  // We filter for players who have actually solved something
  const allPlayers = [you, ...activeBots]
    .filter(p => p.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.lastSolveTime || 0) - (b.lastSolveTime || 0); // Earlier solve time wins ties
    })
    .map((p, i) => ({ ...p, rank: i + 1 }));

  return (
    <DashboardLayout score={score} endTime={endTime}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold mb-8">
          Leader<span className="neon-text">board</span>
        </h1>

        {allPlayers.length > 0 ? (
          <>
            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
              {[1, 0, 2].map((podiumIndex) => {
                const player = allPlayers[podiumIndex];
                if (!player) return null;
                const Icon = rankIcons[player.rank - 1] || Trophy;
                const isYou = player.username === "You";

                return (
                  <motion.div
                    key={player.rank}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: podiumIndex * 0.15 }}
                    className={`glass-card p-5 text-center ${player.rank === 1 ? "neon-glow row-span-1 -mt-4" : player.rank === 2 ? "violet-glow" : ""
                      } ${isYou ? "border-primary/50" : ""}`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${rankColors[player.rank - 1] || "text-muted-foreground"}`} />
                    <div className="font-mono text-2xl font-bold neon-text">#{player.rank}</div>
                    <div className={`font-semibold mt-1 ${isYou ? "text-primary" : ""}`}>{player.username}</div>
                    <div className="text-sm text-muted-foreground">{player.score} pts</div>
                    <div className="text-xs text-muted-foreground">{player.solved} solved</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Full Table */}
            <div className="glass-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left px-6 py-3 text-xs font-mono text-muted-foreground uppercase">Rank</th>
                    <th className="text-left px-6 py-3 text-xs font-mono text-muted-foreground uppercase">Player</th>
                    <th className="text-right px-6 py-3 text-xs font-mono text-muted-foreground uppercase">Score</th>
                    <th className="text-right px-6 py-3 text-xs font-mono text-muted-foreground uppercase">Solved</th>
                  </tr>
                </thead>
                <tbody>
                  {allPlayers.map((player, i) => {
                    const isYou = player.username === "You";
                    return (
                      <motion.tr
                        key={player.username}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`border-b border-border/10 transition-colors ${isYou ? "bg-primary/5" : "hover:bg-muted/30"
                          }`}
                      >
                        <td className="px-6 py-3">
                          <span className={`font-mono font-bold ${player.rank <= 3 ? "neon-text" : "text-muted-foreground"}`}>
                            #{player.rank}
                          </span>
                        </td>
                        <td className={`px-6 py-3 font-medium ${isYou ? "text-primary font-bold" : ""}`}>
                          {player.username} {isYou && <span className="text-xs text-primary/60 ml-1">(you)</span>}
                        </td>
                        <td className="px-6 py-3 text-right font-mono">{player.score}</td>
                        <td className="px-6 py-3 text-right font-mono text-muted-foreground">{player.solved}</td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="glass-card p-20 text-center border-dashed border-primary/20">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-primary/20" />
            <h3 className="text-xl font-bold uppercase tracking-widest text-primary/40">Leaderboard Clear</h3>
            <p className="text-[10px] uppercase tracking-[0.2em] text-primary/20 mt-2">No active captures detected in the sequence</p>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Leaderboard;
