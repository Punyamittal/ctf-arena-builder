import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import TaskCard from "@/components/TaskCard";
import { useGameState } from "@/hooks/useGameState";

const Dashboard = () => {
  const { challenges, score, endTime, getCurrentPoints } = useGameState();

  const categories = [...new Set(challenges.map((c) => c.category))];

  return (
    <DashboardLayout score={score} endTime={endTime}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              Challenge <span className="neon-text">Board</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              {challenges.filter((c) => c.solved).length}/{challenges.length} solved
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <span key={cat} className="glass-card px-3 py-1 text-xs font-mono text-muted-foreground">
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {challenges.map((challenge, i) => (
            <TaskCard
              key={challenge.id}
              challenge={challenge}
              currentPoints={getCurrentPoints(challenge)}
              index={i}
            />
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
