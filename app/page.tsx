"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [buttonText, setButtonText] = useState("");

  useEffect(() => {
    const text = "Explore the Dashboard";
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setButtonText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-3xl text-center space-y-8">
        <div className="space-y-4">
          <p className="text-2xl md:text-3xl font-medium text-terminal-text">
            Hi, I'm Nazrawit, Nani to most 👋🏾
          </p>
          <p className="text-lg md:text-xl text-terminal-muted leading-relaxed">
            My thesis explores whether project managers truly adopt digital
            project management tools, and what drives that decision.
          </p>
          <p className="text-lg md:text-xl text-terminal-muted leading-relaxed">
            Because downloading a tool and actually using it are two very
            different things.
          </p>
          <p className="text-lg md:text-xl text-terminal-muted leading-relaxed">
            This platform shares the insights behind that reality.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-terminal-card border border-terminal-border font-semibold text-lg text-terminal-accent hover:border-terminal-accent hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-terminal-accent transition-all relative overflow-hidden group"
        >
          <span className="terminal-label">&gt;</span>
          <span className="whitespace-pre">{buttonText}</span>
          <span className="cursor-blink">_</span>
          <div className="absolute inset-0 bg-terminal-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </Link>
      </div>
    </div>
  );
}
