import { useEffect, useState } from "react";

export default function CountdownTimer({ unlockDate, onUnlock }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const unlock = new Date(unlockDate).getTime();
      const diff = unlock - now;

      if (diff <= 0) {
        setTimeLeft(null);
        onUnlock(); 
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [unlockDate, onUnlock]);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-2">
      <span className="bg-blue-50 px-2 py-1 rounded-lg">
        {timeLeft.days}d
      </span>
      <span className="bg-blue-50 px-2 py-1 rounded-lg">
        {timeLeft.hours}h
      </span>
      <span className="bg-blue-50 px-2 py-1 rounded-lg">
        {timeLeft.minutes}m
      </span>
      <span className="bg-blue-50 px-2 py-1 rounded-lg">
        {timeLeft.seconds}s
      </span>
    </div>
  );
}
