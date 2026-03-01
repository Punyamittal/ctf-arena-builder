import { motion } from "framer-motion";
import { Shield, Globe, Lock, Cpu, HelpCircle, CheckCircle } from "lucide-react";
import { Challenge } from "@/data/challenges";
import { useNavigate } from "react-router-dom";

const categoryIcons: Record<Challenge["category"], React.ElementType> = {
  Forensics: Shield,
  Web: Globe,
  Crypto: Lock,
  Reverse: Cpu,
  Misc: HelpCircle,
};

const categoryAccents: Record<Challenge["category"], string> = {
  Web: "border-primary/40 hover:border-primary/70",
  Crypto: "border-secondary/40 hover:border-secondary/70",
  Forensics: "border-success/40 hover:border-success/70",
  Reverse: "border-warning/40 hover:border-warning/70",
  Misc: "border-muted-foreground/40 hover:border-muted-foreground/70",
};

const categoryBadgeBg: Record<Challenge["category"], string> = {
  Web: "bg-primary/15 text-primary",
  Crypto: "bg-secondary/15 text-secondary",
  Forensics: "bg-success/15 text-success",
  Reverse: "bg-warning/15 text-warning",
  Misc: "bg-muted text-muted-foreground",
};

interface TaskCardProps {
  challenge: Challenge;
  currentPoints: number;
  index: number;
}

const TaskCard = ({ challenge, currentPoints, index }: TaskCardProps) => {
  const navigate = useNavigate();
  const Icon = categoryIcons[challenge.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={() => navigate(`/challenge/${challenge.id}`)}
      className={`glass-card border ${categoryAccents[challenge.category]} p-5 cursor-pointer transition-all duration-300 group ${
        challenge.solved ? "success-glow" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-xl ${categoryBadgeBg[challenge.category]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {challenge.solved ? (
          <div className="flex items-center gap-1 text-success text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Solved
          </div>
        ) : (
          <span className="text-muted-foreground text-xs font-mono uppercase tracking-wider">Unsolved</span>
        )}
      </div>

      <h3 className="text-foreground font-semibold text-lg mb-1 group-hover:neon-text transition-all">
        {challenge.title}
      </h3>

      <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${categoryBadgeBg[challenge.category]}`}>
        {challenge.category}
      </span>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-muted-foreground">Reward</span>
          <p className="font-mono font-bold text-lg neon-text">{currentPoints} pts</p>
        </div>
        <div className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          Open Challenge →
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
