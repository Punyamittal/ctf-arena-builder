import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Trophy, User, ChevronLeft, ChevronRight, Zap } from "lucide-react";
import CountdownTimer from "./CountdownTimer";
import AnimatedGrid from "./AnimatedGrid";

interface DashboardLayoutProps {
  children: ReactNode;
  score: number;
  endTime: number;
}

const navItems = [
  { to: "/dashboard", icon: LayoutGrid, label: "Tasks" },
  { to: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { to: "/profile", icon: User, label: "Profile" },
];

const DashboardLayout = ({ children, score, endTime }: DashboardLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex relative">
      <AnimatedGrid />

      {/* Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        className="fixed left-0 top-0 h-full z-40 glass-card border-r border-border/30 flex flex-col"
      >
        <div className="p-4 flex items-center gap-2 border-b border-border/30">
          <Zap className="w-6 h-6 text-primary shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-lg neon-text whitespace-nowrap overflow-hidden"
              >
                CTF Arena
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
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary neon-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium"
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
          className="p-3 border-t border-border/30 text-muted-foreground hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5 mx-auto" /> : <ChevronLeft className="w-5 h-5 mx-auto" />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <div
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: collapsed ? 64 : 220 }}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-30 glass-card border-b border-border/30 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Time Remaining:</span>
            <CountdownTimer targetTime={endTime} compact />
          </div>
          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-1.5 neon-glow">
              <span className="text-xs text-muted-foreground mr-2">Score:</span>
              <span className="font-mono font-bold neon-text">{score}</span>
            </div>
          </div>
        </header>

        <main className="p-6 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
