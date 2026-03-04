import { useEffect, useState, useRef } from 'react';

const CHARACTERS = '!<>-_\\/[]{}—=+*^?#';

export default function TextScramble({
  text,
  isActive = false,
  loading = false,
}: {
  text: string;
  isActive: boolean;
  loading?: boolean;
}) {
  const [displayText, setDisplayText] = useState('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) return;

    let iterations = 0;

    const animate = () => {
      // Keep scrambling if loading, otherwise decode
      if (loading) {
        // Continuous scrambling - never settle
        setDisplayText(
          text
            .split('')
            .map(() => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)])
            .join('')
        );
        timeoutRef.current = setTimeout(animate, 50);
      } else {
        // Decode to target text
        setDisplayText(
          text
            .split('')
            .map((letter, index) => {
              if (index < iterations) {
                return text[index];
              }
              return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
            })
            .join('')
        );

        if (iterations >= text.length) {
          setDisplayText(text);
        } else {
          iterations += 1 / 2;
          timeoutRef.current = setTimeout(animate, 30);
        }
      }
    };

    // Start with fully scrambled text
    setDisplayText(
      text
        .split('')
        .map(() => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)])
        .join('')
    );

    animate();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, text, loading]);

  return <span>{displayText}</span>;
}
