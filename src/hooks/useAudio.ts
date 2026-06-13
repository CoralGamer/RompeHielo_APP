import { useCallback, useRef } from "react";

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      // Create audio context lazily on user interaction to comply with browser policies
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioContextClass();
    }
    
    // Resume context if suspended (happens on Chrome/Safari when created before user interaction)
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    
    return audioCtxRef.current!;
  };

  const playTick = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      // Slightly organic high pitch click
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      // Soft pitch drop
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch (error) {
      console.warn("Failed to play audio tick:", error);
    }
  }, []);

  const playChime = useCallback(() => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Arpeggio notes (frequencies: C5=523.25, E5=659.25, G5=783.99, C6=1046.50)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Warm triangle wave for organic wind-down tone
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        const noteStart = now + idx * 0.12;
        const noteDuration = 0.6;
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.setValueAtTime(0, noteStart);
        gainNode.gain.linearRampToValueAtTime(0.08, noteStart + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + noteDuration + 0.05);
      });
    } catch (error) {
      console.warn("Failed to play audio chime:", error);
    }
  }, []);

  return { playTick, playChime };
}
