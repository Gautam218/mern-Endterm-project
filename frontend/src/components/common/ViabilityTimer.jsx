import React, { useState, useEffect } from "react";
import { Clock, AlertCircle } from "lucide-react";

export const ViabilityTimer = ({ viableUntil, coldIschemiaHours = 12, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
    percentRemaining: 100,
  });

  useEffect(() => {
    // Determine target expiration date
    let targetTime = viableUntil ? new Date(viableUntil).getTime() : null;
    if (!targetTime || isNaN(targetTime)) {
      targetTime = Date.now() + (coldIschemiaHours || 12) * 3600 * 1000;
    }

    const totalDuration = (coldIschemiaHours || 12) * 3600 * 1000;

    const updateTimer = () => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
          percentRemaining: 0,
        });
        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      const percent = Math.min(100, Math.max(0, (difference / totalDuration) * 100));

      setTimeLeft({
        hours,
        minutes,
        seconds,
        isExpired: false,
        percentRemaining: percent,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [viableUntil, coldIschemiaHours]);

  const pad = (n) => String(n).padStart(2, "0");

  if (timeLeft.isExpired) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Viability Expired</span>
      </div>
    );
  }

  // Determine urgency styling
  const totalHoursLeft = timeLeft.hours + timeLeft.minutes / 60;
  let statusColor = "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
  let pulse = "";

  if (totalHoursLeft < 2) {
    statusColor = "text-rose-400 border-rose-500/40 bg-rose-500/15";
    pulse = "animate-pulse";
  } else if (totalHoursLeft < 6) {
    statusColor = "text-amber-400 border-amber-500/30 bg-amber-500/10";
  }

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor} ${pulse} backdrop-blur-md`}
        title={`Cold Ischemia Time Remaining: ${timeLeft.hours}h ${timeLeft.minutes}m`}
      >
        <Clock className="w-3 h-3" />
        <span className="font-mono font-semibold">
          {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </span>
      </div>
    );
  }

  return (
    <div className={`p-2.5 rounded-xl border ${statusColor} backdrop-blur-md ${pulse} flex flex-col gap-1.5`}>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium opacity-90">
          <Clock className="w-3.5 h-3.5" />
          Cold Ischemia Viability
        </span>
        <span className="font-mono font-bold tracking-wider">
          {pad(timeLeft.hours)}h {pad(timeLeft.minutes)}m {pad(timeLeft.seconds)}s
        </span>
      </div>
      <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            totalHoursLeft < 2
              ? "bg-rose-500"
              : totalHoursLeft < 6
              ? "bg-amber-400"
              : "bg-emerald-400"
          }`}
          style={{ width: `${timeLeft.percentRemaining}%` }}
        />
      </div>
    </div>
  );
};
export default ViabilityTimer;
