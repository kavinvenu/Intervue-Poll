import { useState, useEffect, useCallback } from "react";

interface UsePollTimerProps {
  startedAt: string | null;
  durationSeconds: number;
  isActive: boolean;
  onTimeUp?: () => void;
}

export const usePollTimer = ({
  startedAt,
  durationSeconds,
  isActive,
  onTimeUp,
}: UsePollTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(durationSeconds);

  const calculateTimeRemaining = useCallback(() => {
    if (!startedAt || !isActive) {
      return 0;
    }

    const startTime = new Date(startedAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    const remaining = Math.max(0, durationSeconds - elapsed);

    return remaining;
  }, [startedAt, durationSeconds, isActive]);

  useEffect(() => {
    if (!isActive || !startedAt) {
      setTimeRemaining(0);
      return;
    }

    // Initial calculation - handles late joins
    const initialRemaining = calculateTimeRemaining();
    setTimeRemaining(initialRemaining);

    // Set up interval
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUp?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, durationSeconds, isActive, calculateTimeRemaining, onTimeUp]);

  return {
    timeRemaining,
    isExpired: timeRemaining <= 0,
  };
};
