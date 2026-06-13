"use client";

import React, { useState, useEffect } from "react";
import { Bolt, HelpCircle } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";
import { DEFAULT_TOPICS } from "@/utils/presets";

interface TopicSelectorProps {
  topicsPool: string[];
  activeTopic: string;
  setActiveTopic: (topic: string) => void;
  onTopicSelected: (topic: string) => void;
}

export default function TopicSelector({
  topicsPool,
  activeTopic,
  setActiveTopic,
  onTopicSelected,
}: TopicSelectorProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [displayTopic, setDisplayTopic] = useState("AWAITING INPUT");
  const [hasFlashed, setHasFlashed] = useState(false);
  const { playTick, playChime } = useAudio();

  // Sync displayTopic with activeTopic when not rolling
  useEffect(() => {
    if (!isRolling) {
      if (activeTopic) {
        setDisplayTopic(activeTopic);
      } else {
        setDisplayTopic("ESPERANDO ENTRADA");
      }
    }
  }, [activeTopic, isRolling]);

  const handleRoll = () => {
    if (isRolling) return;

    const pool = topicsPool.length > 0 ? topicsPool : DEFAULT_TOPICS;
    setIsRolling(true);
    setHasFlashed(false);

    let currentDelay = 40;
    const maxDelay = 350;

    const cycle = () => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const randomTopic = pool[randomIndex];
      setDisplayTopic(randomTopic);
      playTick();

      if (currentDelay < maxDelay) {
        // Slow down exponentially
        currentDelay = currentDelay * 1.12;
        setTimeout(cycle, currentDelay);
      } else {
        // Choose final topic
        const finalIndex = Math.floor(Math.random() * pool.length);
        const finalTopic = pool[finalIndex];
        
        setDisplayTopic(finalTopic);
        setActiveTopic(finalTopic);
        onTopicSelected(finalTopic);
        playChime();
        
        // Trigger visual settle flash
        setHasFlashed(true);
        setIsRolling(false);
      }
    };

    cycle();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-4 text-center mt-6 md:mt-10">
      {/* Topic Display Canvas - Space optimized */}
      <div className="min-h-[100px] md:min-h-[140px] flex items-center justify-center mb-6 w-full relative">
        <h1
          className={`font-black text-2xl sm:text-3xl md:text-5xl text-foreground/80 tracking-tight leading-tight select-none px-4 drop-shadow-sm transition-all duration-300 ${
            isRolling ? "roulette-shimmer blur-[0.5px]" : ""
          } ${
            hasFlashed 
              ? "scale-105 text-primary drop-shadow-[0_4px_12px_rgba(159,64,45,0.15)] dark:drop-shadow-[0_4px_12px_rgba(192,132,252,0.25)]" 
              : ""
          }`}
        >
          {displayTopic}
        </h1>
      </div>

      {/* Primary Action Button */}
      <button
        onClick={handleRoll}
        disabled={isRolling}
        className={`bg-primary hover:bg-primary-hover text-background font-bold text-base md:text-lg py-3 px-8 rounded-full flex items-center space-x-3 group cursor-pointer active:scale-95 transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-background ${
          isRolling ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <Bolt 
          size={20} 
          className={`transition-transform duration-300 ${isRolling ? "animate-spin" : "group-hover:rotate-12"}`} 
        />
        <span>¡Sortear Tema!</span>
      </button>

      {/* Helper text */}
      {topicsPool.length === 0 && !isRolling && (
        <p className="mt-3 text-[10px] text-on-surface-variant/70 flex items-center justify-center space-x-1">
          <HelpCircle size={10} />
          <span>Usando temas predeterminados. Abre el panel izquierdo para añadir los tuyos.</span>
        </p>
      )}
    </div>
  );
}
