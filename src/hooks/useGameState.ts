import { useState, useCallback, useMemo } from "react";
import { challenges as initialChallenges, Challenge } from "@/data/challenges";

const HINT_1_TIME = 15 * 60 * 1000; // 15 min
const HINT_2_TIME = 30 * 60 * 1000; // 30 min
const COMPETITION_DURATION = 60 * 60 * 1000; // 1 hour

export function useGameState() {
  const [startTime] = useState(() => {
    const saved = localStorage.getItem("ctf_start_time");
    if (saved) return Number(saved);
    const now = Date.now();
    localStorage.setItem("ctf_start_time", String(now));
    return now;
  });

  const endTime = startTime + COMPETITION_DURATION;

  const [challengeList, setChallengeList] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem("ctf_challenges");
    if (saved) return JSON.parse(saved);
    return initialChallenges;
  });

  const save = (list: Challenge[]) => {
    setChallengeList(list);
    localStorage.setItem("ctf_challenges", JSON.stringify(list));
  };

  const getElapsed = useCallback(() => Date.now() - startTime, [startTime]);

  const getCurrentPoints = useCallback(
    (challenge: Challenge) => {
      if (challenge.solved) {
        // Calculate points at time of solve
        const elapsed = (challenge.solvedAt || Date.now()) - startTime;
        if (elapsed >= HINT_2_TIME) return 50;
        if (elapsed >= HINT_1_TIME) return 75;
        return 100;
      }
      const elapsed = getElapsed();
      if (elapsed >= HINT_2_TIME) return 50;
      if (elapsed >= HINT_1_TIME) return 75;
      return 100;
    },
    [startTime, getElapsed]
  );

  const getAvailableHints = useCallback(
    (challenge: Challenge) => {
      const elapsed = getElapsed();
      const hints: string[] = [];
      if (elapsed >= HINT_1_TIME) hints.push(challenge.hints[0]);
      if (elapsed >= HINT_2_TIME) hints.push(challenge.hints[1]);
      return hints;
    },
    [getElapsed]
  );

  const submitFlag = useCallback(
    (challengeId: string, flag: string): boolean => {
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
    [challengeList]
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
    getCurrentPoints,
    getAvailableHints,
    getElapsed,
    submitFlag,
    resetGame,
  };
}
