import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Trophy, User, ChevronLeft, ChevronRight, Shield, Brain } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import AnimatedGrid from "./AnimatedGrid";

interface DashboardLayoutProps {
  children: ReactNode;
  score: number;
  endTime: number | null;
}

const navItems = [
  { to: "/dashboard", icon: LayoutGrid, label: "Tasks" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/profile", icon: User, label: "Profile" },
];

const DashboardLayout = ({ children, score, endTime }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-black flex relative text-primary font-sans">
      <AnimatedGrid />

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        className="fixed left-0 top-0 h-full z-40 bg-black border-r border-primary/10 flex flex-col"
      >
        <div className="p-4 flex items-center gap-2 border-b border-primary/10 mb-4">
          <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm shrink-0">
            <Brain className="w-5 h-5 text-black" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-black text-lg tracking-tighter text-white whitespace-nowrap overflow-hidden"
              >
                CIPHER
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 transition-all uppercase text-[10px] font-bold tracking-widest ${isActive
                  ? "bg-primary text-black"
                  : "text-primary/60 hover:text-primary hover:bg-primary/5"
                }`
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-3 border-t border-primary/10 text-primary/60 hover:text-primary transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4 mx-auto" /> : <ChevronLeft className="w-4 h-4 mx-auto" />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: collapsed ? 64 : 220 }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-black/50 backdrop-blur-md border-b border-primary/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">System Status: Active</span>
            <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-40">Time:</span>
              <CountdownTimer targetTime={endTime} compact />
            </div>
            <div className="bg-primary/10 border border-primary/20 px-4 py-1">
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-40 mr-2">Score:</span>
              <span className="font-bold text-sm tracking-tighter">{score}</span>
            </div>
          </div>
        </header>

        <main className="p-8 relative z-10 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
