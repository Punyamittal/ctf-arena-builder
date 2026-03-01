import { motion } from "framer-motion";
import { Trophy, Medal, Award } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useGameState } from "@/hooks/useGameState";

interface Player {
  rank: number;
  username: string;
  score: number;
  solved: number;
}

const mockPlayers: Player[] = [
  { rank: 1, username: "sh4dowh4ck", score: 450, solved: 5 },
  { rank: 2, username: "crypt0queen", score: 375, solved: 4 },
  { rank: 3, username: "b1naryboss", score: 325, solved: 4 },
  { rank: 4, username: "null_byte", score: 275, solved: 3 },
  { rank: 5, username: "xpl0it3r", score: 200, solved: 2 },
  { rank: 6, username: "p4ck3tsniff", score: 175, solved: 2 },
  { rank: 7, username: "r00tk1t", score: 150, solved: 2 },
  { rank: 8, username: "f1r3wall", score: 100, solved: 1 },
  { rank: 9, username: "n3tw0rk_n1nja", score: 75, solved: 1 },
  { rank: 10, username: "d3bug_m0de", score: 50, solved: 1 },
];

const rankIcons = [Trophy, Medal, Award];
const rankColors = ["text-warning", "text-muted-foreground", "text-warning/60"];

const Leaderboard = () => {
  const { score, endTime, challenges } = useGameState();

  // Insert "You" into the mock leaderboard
  const you: Player = {
    rank: 0,
    username: "You",
    score,
    solved: challenges.filter((c) => c.solved).length,
  };

  const allPlayers = [...mockPlayers, you]
    .sort((a, b) => b.score - a.score)
    .map((p, i) => ({ ...p, rank: i + 1 }));

  return (
    <DashboardLayout score={score} endTime={endTime}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold mb-8">
          Leader<span className="neon-text">board</span>
        </h1>

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
                className={`glass-card p-5 text-center ${
                  player.rank === 1 ? "neon-glow row-span-1 -mt-4" : player.rank === 2 ? "violet-glow" : ""
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
                    className={`border-b border-border/10 transition-colors ${
                      isYou ? "bg-primary/5" : "hover:bg-muted/30"
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
      </motion.div>
    </DashboardLayout>
  );
};

export default Leaderboard;
