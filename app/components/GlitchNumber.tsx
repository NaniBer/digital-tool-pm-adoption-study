import { useState, useEffect } from "react";

export default function GlitchNumber({
  value,
  loading = false,
  decimals = 0,
}: {
  value: number;
  loading?: boolean;
  decimals?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!loading) {
      // Show actual value when not loading
      setDisplayValue(value);
      return;
    }

    // Start glitching while loading
    const interval = setInterval(() => {
      // Generate random glitch value
      const glitchValue = Math.random() * 100;
      setDisplayValue(glitchValue);
    }, 80);

    return () => clearInterval(interval);
  }, [loading, value]);

  return <span>{displayValue.toFixed(decimals)}</span>;
}
