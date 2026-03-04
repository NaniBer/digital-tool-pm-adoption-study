import { useState, useEffect } from 'react';

export function useGlitchValue(value: number, loading: boolean) {
  const [glitchedValue, setGlitchedValue] = useState(value);

  useEffect(() => {
    if (!loading) {
      setGlitchedValue(value);
      return;
    }

    const interval = setInterval(() => {
      const randomGlitch = Math.random() * 100;
      setGlitchedValue(randomGlitch);
    }, 80);

    return () => clearInterval(interval);
  }, [loading, value]);

  return glitchedValue;
}
