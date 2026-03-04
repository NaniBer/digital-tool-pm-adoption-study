import { useState, useEffect } from 'react';

export default function GlitchBar({
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
      <span>{glitchedPercentage.toFixed(decimals)}</span>
    </>
  );
}
