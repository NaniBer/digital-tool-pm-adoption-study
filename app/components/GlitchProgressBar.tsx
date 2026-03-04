import { useState, useEffect } from 'react';

export default function GlitchProgressBar({
  percentage,
  loading = false,
  decimals = 0,
}: {
  percentage: number;
  loading?: boolean;
  decimals?: number;
}) {
  const [glitchedPercentage, setGlitchedPercentage] = useState(percentage);

  useEffect(() => {
    if (!loading) {
      setGlitchedPercentage(percentage);
      return;
    }

    const interval = setInterval(() => {
      const randomGlitch = Math.random() * 100;
      setGlitchedPercentage(randomGlitch);
    }, 80);

    return () => clearInterval(interval);
  }, [loading, percentage]);

  return (
    <>
      <div className="w-full bg-terminal-border h-2">
        <div
          className="bg-terminal-accent h-full"
          style={{
            width: `${glitchedPercentage}%`,
          }}
        ></div>
      </div>
      <div className="text-right terminal-label mt-1">
        {glitchedPercentage.toFixed(decimals)}%
      </div>
    </>
  );
}
