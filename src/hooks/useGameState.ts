import { useState, useCallback, useMemo } from "react";
import { challenges as initialChallenges, Challenge } from "@/data/challenges";

export const COMPETITION_DURATION = 60 * 60 * 1000; // 1 hour

export function useGameState() {
  const [startTime, setStartTime] = useState<number | null>(() => {
    const saved = localStorage.getItem("ctf_start_time");
    return saved ? Number(saved) : null;
  });

  const endTime = startTime ? startTime + COMPETITION_DURATION : null;

  const [challengeList, setChallengeList] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem("ctf_challenges");
    if (saved) {
      const parsed = JSON.parse(saved) as Challenge[];
      // Migration: Ensure fields exist by matching with initialChallenges
      return parsed.map(c => {
        const original = initialChallenges.find(oc => oc.id === c.id);
        return {
          ...c,
          hintTimes: c.hintTimes || original?.hintTimes || [15 * 60000, 30 * 60000],
          fileUrl: c.fileUrl || original?.fileUrl
        };
      });
    }
    return initialChallenges;
  });

  const save = (list: Challenge[]) => {
    setChallengeList(list);
    localStorage.setItem("ctf_challenges", JSON.stringify(list));
  };

  const startTimer = useCallback(() => {
    const now = Date.now();
    localStorage.setItem("ctf_start_time", String(now));
    setStartTime(now);
  }, []);

  const getElapsed = useCallback(() => {
    if (!startTime) return 0;
    return Date.now() - startTime;
  }, [startTime]);

  const getCurrentPoints = useCallback(
    (challenge: Challenge) => {
      if (!startTime) return challenge.basePoints;

      const base = challenge.basePoints;
      // If solved, use the solvedAt time; otherwise, use current time
      const now = challenge.solved ? (challenge.solvedAt || Date.now()) : Date.now();
      const elapsed = now - startTime;

      // 1. Calculate base points (with deduction if hints were available/used)
      let earnedPoints = base;
      if (elapsed >= challenge.hintTimes[1]) {
        earnedPoints = Math.floor(base * 0.5);
      } else if (elapsed >= challenge.hintTimes[0]) {
        earnedPoints = Math.floor(base * 0.75);
      }

      // 2. Add Time Left Bonus (1 point per second remaining)
      const timeLeftSeconds = Math.max(0, Math.floor((COMPETITION_DURATION - elapsed) / 1000));

      return earnedPoints + timeLeftSeconds;
    },
    [startTime]
  );

  const getAvailableHints = useCallback(
    (challenge: Challenge) => {
      const elapsed = getElapsed();
      const hints: string[] = [];
      if (elapsed >= challenge.hintTimes[0]) hints.push(challenge.hints[0]);
      if (elapsed >= challenge.hintTimes[1]) hints.push(challenge.hints[1]);
      return hints;
    },
    [getElapsed]
  );

  const submitFlag = useCallback(
    (challengeId: string, flag: string): boolean => {
      if (!startTime || !endTime || Date.now() > endTime) return false; // Can't submit before start or after end
      const challenge = challengeList.find((c) => c.id === challengeId);
      if (!challenge || challenge.solved) return false;
      if (flag.trim() === challenge.flag) {
        const updated = challengeList.map((c) =>
          c.id === challengeId ? { ...c, solved: true, solvedAt: Date.now() } : c
        );
        save(updated);
        return true;
      }
      return false;
    },
    [challengeList, startTime]
  );

  const score = useMemo(
    () =>
      challengeList
        .filter((c) => c.solved)
        .reduce((sum, c) => sum + getCurrentPoints(c), 0),
    [challengeList, getCurrentPoints]
  );

  const resetGame = useCallback(() => {
    localStorage.removeItem("ctf_start_time");
    localStorage.removeItem("ctf_challenges");
    window.location.reload();
  }, []);

  return {
    challenges: challengeList,
    startTime,
    endTime,
    score,
    isStarted: !!startTime,
    getCurrentPoints,
    getAvailableHints,
    getElapsed,
    submitFlag,
    startTimer,
    resetGame,
  };
}
