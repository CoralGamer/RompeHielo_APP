"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Trash2, RotateCcw, Play, Pause, Mic } from "lucide-react";
import { getRecording } from "@/utils/db";

interface HistoryItem {
  id: string;
  topic: string;
  timestamp: number;
  hasRecording: boolean;
}

interface SidebarRightProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onSelectTopic: (topic: string, id: string) => void;
}

export default function SidebarRight({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectTopic,
}: SidebarRightProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop playback when sidebar closes
  useEffect(() => {
    if (!isOpen) {
      handleStopAudio();
    }
  }, [isOpen]);

  // Cleanup Object URLs
  useEffect(() => {
    return () => {
      if (playingUrl) {
        URL.revokeObjectURL(playingUrl);
      }
    };
  }, [playingUrl]);

  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setPlayingId(null);
  };

  const handlePlayAudio = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop click from triggering select topic

    if (playingId === id) {
      // Toggle play/pause
      if (audioRef.current) {
        if (audioRef.current.paused) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
          setPlayingId(null);
        }
      }
      return;
    }

    // Stop current audio if any
    handleStopAudio();

    try {
      const blob = await getRecording(id);
      if (blob) {
        // Revoke old URL if any
        if (playingUrl) {
          URL.revokeObjectURL(playingUrl);
        }

        const url = URL.createObjectURL(blob);
        setPlayingUrl(url);
        setPlayingId(id);

        // Play the audio
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.play().catch((err) => {
              console.error("Audio playback interrupted:", err);
              setPlayingId(null);
            });
          }
        }, 50);
      }
    } catch (err) {
      console.error("Failed to load recording for playback:", err);
    }
  };

  const onAudioEnded = () => {
    setPlayingId(null);
  };

  const onAudioPause = () => {
    setPlayingId(null);
  };

  const onAudioPlay = () => {
    // Safe sync if audio starts playing
  };

  return (
    <aside
      className={`fixed right-0 top-0 h-full w-[85vw] sm:w-[380px] md:w-[420px] glass-panel z-40 flex flex-col p-6 pt-32 shadow-2xl transition-transform duration-400 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6 flex-shrink-0">
        <h2 className="font-extrabold text-xl md:text-2xl text-primary tracking-tight">
          Historial de Temas
        </h2>
        <button
          onClick={onClose}
          className="text-on-surface-variant hover:text-primary transition-colors p-1 cursor-pointer bg-transparent border-none"
        >
          <X size={22} />
        </button>
      </div>

      {/* History List Container */}
      <div className="flex-grow overflow-y-auto space-y-3 pr-1">
        {history.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-on-surface-variant/60 italic p-6">
            <RotateCcw size={32} className="mb-3 opacity-40 animate-pulse" />
            <p className="text-sm font-medium">Aún no has sorteado ningún tema.</p>
            <p className="text-xs mt-1">¡Presiona el botón principal en el lienzo para comenzar!</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectTopic(item.topic, item.id)}
              className="p-3.5 bg-surface-container/40 rounded-xl border border-outline-variant/20 text-on-surface text-sm font-medium shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 cursor-pointer flex justify-between items-center group"
            >
              <div className="flex flex-col text-left flex-grow mr-2">
                <span className="line-clamp-2 leading-relaxed">
                  {item.topic}
                </span>
                <span className="text-[9px] text-on-surface-variant/75 mt-1 font-semibold">
                  {new Date(item.timestamp).toLocaleString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                {/* Micro Audio Player */}
                {item.hasRecording && (
                  <button
                    onClick={(e) => handlePlayAudio(item.id, e)}
                    className="p-2 bg-primary/10 hover:bg-primary text-primary hover:text-background rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center active:scale-90"
                    title={playingId === item.id ? "Pausar discurso" : "Escuchar discurso grabado"}
                  >
                    {playingId === item.id ? (
                      <Pause size={14} fill="currentColor" />
                    ) : (
                      <Play size={14} fill="currentColor" />
                    )}
                  </button>
                )}

                {/* Mic marker indicator */}
                {item.hasRecording && !item.hasRecording && (
                  <Mic size={14} className="text-primary/60" />
                )}

                <span className="text-[10px] uppercase font-bold text-primary/60 border border-primary/20 px-2 py-0.5 rounded-full opacity-60 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  #{new Date(item.timestamp).getTime().toString().slice(-4)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Hidden Global Audio Element for Sidebar Playback */}
      <audio
        ref={audioRef}
        onEnded={onAudioEnded}
        onPause={onAudioPause}
        onPlay={onAudioPlay}
        className="hidden"
      />

      {/* Footer / Clear Button */}
      {history.length > 0 && (
        <div className="mt-6 border-t border-outline-variant/30 pt-4 flex-shrink-0">
          <button
            onClick={onClearHistory}
            className="w-full py-3 bg-transparent border border-outline-variant/50 hover:border-error hover:text-error text-on-surface-variant font-semibold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer active:scale-98"
          >
            <Trash2 size={15} />
            <span>Borrar Historial y Audios</span>
          </button>
        </div>
      )}
    </aside>
  );
}
