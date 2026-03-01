import { motion } from "framer-motion";
import { Shield, Globe, Lock, Cpu, HelpCircle, CheckCircle, Download } from "lucide-react";
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
  Web: "border-primary/20 hover:border-primary",
  Crypto: "border-primary/20 hover:border-primary",
  Forensics: "border-primary/20 hover:border-primary",
  Reverse: "border-primary/20 hover:border-primary",
  Misc: "border-primary/20 hover:border-primary",
};

const categoryBadgeBg: Record<Challenge["category"], string> = {
  Web: "bg-primary text-black",
  Crypto: "bg-primary text-black",
  Forensics: "bg-primary text-black",
  Reverse: "bg-primary text-black",
  Misc: "bg-primary text-black",
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
      onClick={() => navigate(`/challenge/${challenge.id}`)}
      className={`bg-black border ${categoryAccents[challenge.category]} p-6 cursor-pointer transition-all duration-300 group`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex gap-2">
          <div className={`p-2 ${categoryBadgeBg[challenge.category]}`}>
            <Icon className="w-4 h-4" />
          </div>
          {challenge.fileUrl && (
            <div className="p-2 border border-primary/20 text-primary/40 group-hover:border-primary/40 group-hover:text-primary transition-colors">
              <Download className="w-4 h-4" />
            </div>
          )}
        </div>
        {challenge.solved ? (
          <div className="flex items-center gap-1 text-primary text-[10px] font-bold uppercase tracking-widest">
            <CheckCircle className="w-3 h-3" />
            Solved
          </div>
        ) : (
          <span className="text-primary/40 text-[10px] font-bold uppercase tracking-widest">Awaiting Capture</span>
        )}
      </div>

      <h3 className="text-white font-bold text-lg mb-2 uppercase tracking-tighter group-hover:text-primary transition-colors">
        {challenge.title}
      </h3>

      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/60 border border-primary/20 px-2 py-0.5">
        {challenge.category}
      </span>

      <div className="mt-8 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">Value</span>
          <p className="font-bold text-2xl tracking-tighter text-primary leading-none">{currentPoints}</p>
        </div>
        <div className="text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          Initialize <span className="text-primary">_</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
