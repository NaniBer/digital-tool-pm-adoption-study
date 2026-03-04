import { useState, useEffect } from 'react';

export default function TerminalLog({
  logs,
  typingSpeed = 30,
  lineDelay = 200,
}: {
  logs: Array<{ time: string; type: string; message: string }>;
  typingSpeed?: number;
  lineDelay?: number;
}) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [typingText, setTypingText] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (visibleLines >= logs.length) return;

    const currentLogIndex = visibleLines;
    const currentLog = logs[currentLogIndex];
    let charIndex = 0;

    // Reset current line text
    setTypingText((prev) => ({
      ...prev,
      [currentLogIndex]: '',
    }));

    const typeChar = () => {
      if (charIndex <= currentLog.message.length) {
        setTypingText((prev) => ({
          ...prev,
          [currentLogIndex]: currentLog.message.slice(0, charIndex),
        }));
        charIndex++;
      } else {
        // Line complete, move to next
        setVisibleLines((prev) => prev + 1);
      }
    };

    const interval = setInterval(typeChar, typingSpeed);
    return () => clearInterval(interval);
  }, [visibleLines, logs, typingSpeed]);

  const getTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-terminal-success';
      case 'warning':
        return 'text-terminal-warning';
      case 'error':
        return 'text-terminal-error';
      default:
        return 'text-terminal-accent';
    }
  };

  return (
    <div className="space-y-2 font-mono text-sm max-h-64 overflow-y-auto">
      {logs.slice(0, visibleLines + 1).map((log, index) => (
        <div key={index} className="flex items-start gap-3">
          <span className="text-terminal-muted">[{log.time}]</span>
          <span className={getTextColor(log.type)}>
            {log.type.toUpperCase()}:
          </span>
          <span className="text-terminal-muted">
            {typingText[index] !== undefined ? typingText[index] : log.message}
            {index === visibleLines && <span className="cursor-blink">_</span>}
          </span>
        </div>
      ))}
    </div>
  );
}
