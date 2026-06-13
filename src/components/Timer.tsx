"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Clock, Check } from "lucide-react";
import { useAudio } from "@/hooks/useAudio";

interface TimerProps {
  onTimerComplete?: () => void;
}

const PRESET_TIMES = [
  { label: "1 min", value: 60 },
  { label: "2 min", value: 120 },
  { label: "3 min", value: 180 },
  { label: "5 min", value: 300 },
  { label: "10 min", value: 600 },
];

export default function Timer({ onTimerComplete }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(300); // Default 5 mins
  const [initialTime, setInitialTime] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [customMin, setCustomMin] = useState("");
  
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { playTick } = useAudio();

  // Handle countdown interval
  useEffect(() => {
    if (isRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const nextTime = prev - 1;
          if (nextTime <= 0) {
            return 0;
          }
          // Tick sound during final 5 seconds (5, 4, 3, 2, 1)
          if (nextTime <= 5) {
            playTick();
          }
          return nextTime;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRunning, playTick]);

  // Handle completion side effects when timeLeft reaches 0
  useEffect(() => {
    if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (onTimerComplete) {
        onTimerComplete();
      }
    }
  }, [timeLeft, isRunning, onTimerComplete]);

  // Click outside to close the time picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const selectPreset = (seconds: number) => {
    setIsRunning(false);
    setInitialTime(seconds);
    setTimeLeft(seconds);
    setShowPicker(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customMin);
    if (!isNaN(mins) && mins > 0 && mins <= 60) {
      const seconds = mins * 60;
      setIsRunning(false);
      setInitialTime(seconds);
      setTimeLeft(seconds);
      setShowPicker(false);
      setCustomMin("");
    }
  };

  const isLowTime = timeLeft > 0 && timeLeft <= 10 && isRunning;

  return (
    <div ref={containerRef} className="relative mt-2 select-none">
      {/* Main Timer Pill */}
      <div 
        className={`glass-panel px-6 py-2 rounded-full flex items-center space-x-3.5 transition-all duration-300 shadow-md ${
          isLowTime 
            ? "border-red-500/40 bg-red-500/5 animate-pulse shadow-red-500/5 text-red-600 dark:text-red-400" 
            : ""
        }`}
      >
        {/* Clickable Time Display */}
        <div 
          onClick={() => !isRunning && setShowPicker(!showPicker)}
          className={`font-mono font-bold text-xl md:text-2xl tracking-wider text-primary cursor-pointer hover:scale-103 transition-transform ${
            isRunning ? "cursor-default opacity-90" : "hover:text-primary-hover"
          } ${isLowTime ? "text-red-600 dark:text-red-400" : ""}`}
          title={isRunning ? "Pausa el temporizador para cambiar el tiempo" : "Haz clic para configurar el tiempo"}
        >
          {formatTime(timeLeft)}
        </div>

        {/* Separator & Controls */}
        <div className="flex space-x-2.5 border-l border-outline-variant/40 pl-3.5">
          <button 
            onClick={handleToggle}
            className={`text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-0.5 active:scale-90 bg-transparent border-none ${
              isLowTime ? "text-red-500 hover:text-red-700" : ""
            }`}
            title={isRunning ? "Pausar" : "Iniciar"}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button 
            onClick={handleReset}
            className={`text-on-surface-variant hover:text-primary transition-colors cursor-pointer p-0.5 active:scale-90 bg-transparent border-none ${
              isLowTime ? "text-red-500 hover:text-red-700" : ""
            }`}
            title="Reiniciar"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Preset / Custom Duration Picker Dropdown */}
      {showPicker && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-[260px] p-4 glass-panel rounded-2xl z-50 shadow-xl border border-outline-variant/40 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
          <h4 className="font-bold text-xs uppercase tracking-wider text-on-surface-variant mb-2.5 flex items-center space-x-1.5">
            <Clock size={12} className="text-primary" />
            <span>Configurar Duración</span>
          </h4>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 gap-2 mb-2.5">
            {PRESET_TIMES.map((preset) => (
              <button
                key={preset.value}
                onClick={() => selectPreset(preset.value)}
                className="py-1.5 px-2.5 text-[10px] font-semibold rounded-lg text-center border transition-all cursor-pointer flex items-center justify-between bg-transparent"
              >
                <span>{preset.label}</span>
                {initialTime === preset.value && <Check size={10} />}
              </button>
            ))}
          </div>

          {/* Custom Input Form */}
          <form onSubmit={handleCustomSubmit} className="border-t border-outline-variant/30 pt-2.5">
            <label className="block text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">
              Minutos Personalizados
            </label>
            <div className="flex space-x-1.5">
              <input
                type="number"
                min="1"
                max="60"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                placeholder="Ej. 7"
                className="flex-grow bg-surface-container/50 border border-outline-variant/30 text-on-surface rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-primary focus:ring-0"
              />
              <button
                type="submit"
                className="px-3 bg-primary text-background font-bold text-[10px] rounded-lg hover:bg-primary-hover active:scale-95 transition-all cursor-pointer flex items-center border-none"
              >
                Fijar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
