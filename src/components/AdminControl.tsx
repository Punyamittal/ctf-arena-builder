import React, { useState } from "react";
import { useGameState } from "@/hooks/useGameState";
import { Lock, Play, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const AdminControl = () => {
    const { isStarted, startTimer, resetGame } = useGameState();
    const [isAdmin, setIsAdmin] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === "punya" && password === "mittal@123") {
            setIsAdmin(true);
            setShowLogin(false);
            toast.success("Admin access granted");
        } else {
            toast.error("Invalid credentials");
        }
    };

    if (!isAdmin) {
        return (
            <div className="flex justify-end mb-4">
                {showLogin ? (
                    <form onSubmit={handleLogin} className="flex gap-2 items-center bg-black/40 p-2 border border-primary/20 backdrop-blur-sm">
                        <input
                            type="text"
                            placeholder="Admin ID"
                            className="bg-black/50 border border-primary/20 text-[10px] px-2 py-1 focus:outline-none focus:border-primary w-24 uppercase tracking-tighter"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="bg-black/50 border border-primary/20 text-[10px] px-2 py-1 focus:outline-none focus:border-primary w-24 tracking-tighter"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className="bg-primary text-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-colors">
                            Verify
                        </button>
                        <button type="button" onClick={() => setShowLogin(false)} className="text-[10px] uppercase tracking-widest text-primary/40 hover:text-primary">
                            Cancel
                        </button>
                    </form>
                ) : (
                    <button
                        onClick={() => setShowLogin(true)}
                        className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-primary/40 hover:text-primary transition-colors border border-dashed border-primary/20 px-4 py-2"
                    >
                        <Lock className="w-3 h-3" /> Admin Access
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 mb-8 bg-primary/5 border border-primary/20 p-6 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Command Console</h3>
                        <p className="text-[8px] text-primary/60 uppercase tracking-widest mt-1">Status: Admin Authenticated</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsAdmin(false)}
                    className="text-[10px] font-bold uppercase tracking-widest text-primary/40 hover:text-primary"
                >
                    Logout
                </button>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => {
                        if (!isStarted) {
                            startTimer();
                            toast.success("Competition started!");
                        } else {
                            if (confirm("Reset clock and clear all data? This action is irreversible.")) {
                                resetGame();
                                toast.success("System Reset");
                            }
                        }
                    }}
                    className={`flex-1 flex items-center justify-center gap-3 px-6 py-6 text-xs font-bold uppercase tracking-[0.4em] transition-all group ${!isStarted
                            ? "bg-primary text-black hover:bg-white"
                            : "border border-primary/40 text-primary hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500"
                        }`}
                >
                    {!isStarted ? (
                        <>
                            <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                            Initialize System Timer
                        </>
                    ) : (
                        <>
                            <RotateCcw className="w-5 h-5 group-hover:rotate-[-45deg] transition-transform" />
                            Reset Global Clock
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
