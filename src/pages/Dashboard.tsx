import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import TaskCard from "@/components/TaskCard";
import { useGameState } from "@/hooks/useGameState";
import { AdminControl } from "@/components/AdminControl";

const Dashboard = () => {
  const { challenges, score, endTime, isStarted, getCurrentPoints } = useGameState();

  const categories = [...new Set(challenges.map((c) => c.category))];

  return (
    <DashboardLayout score={score} endTime={endTime}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <AdminControl />
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-2 text-primary/40">
              <span className="w-8 h-[1px] bg-primary/20"></span>
              Operation Center
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
              Challenge <span className="text-primary">Staging</span>
            </h1>
            <p className="text-[10px] font-bold tracking-widest uppercase text-primary/40 mt-2">
              {challenges.filter((c) => c.solved).length} / {challenges.length} OBJECTIVES COMPLETED
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <span key={cat} className="border border-primary/20 px-3 py-1 text-[8px] font-bold tracking-[0.2em] uppercase text-primary/60">
                {cat}
              </span>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-primary/10">
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
