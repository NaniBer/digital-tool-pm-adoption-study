import { useState, useEffect } from 'react';

export default function GlitchIndustryItem({
  label,
  percentage,
  loading = false,
}: {
  label: string;
  percentage: number;
  loading?: boolean;
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
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm">{label}</span>
        <span className="text-sm text-terminal-accent">
          {glitchedPercentage.toFixed(0)}%
        </span>
      </div>
      <div className="w-full bg-terminal-border h-1">
        <div
          className="bg-terminal-accent h-full"
          style={{ width: `${glitchedPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
