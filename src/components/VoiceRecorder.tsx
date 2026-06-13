"use client";

import React, { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Trash2, AlertCircle, Sparkles } from "lucide-react";
import { saveRecording, getRecording, deleteRecording as deleteRecordingFromDB } from "@/utils/db";

interface VoiceRecorderProps {
  activeHistoryId: string | null;
  onRecordingSaved: (id: string) => void;
  onRecordingDeleted: (id: string) => void;
}

export default function VoiceRecorder({
  activeHistoryId,
  onRecordingSaved,
  onRecordingDeleted,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Load recording when active history item changes
  useEffect(() => {
    setIsPlaying(false);
    setAudioUrl(null);
    setRecordingTime(0);

    if (!activeHistoryId) return;

    let isCurrent = true;
    getRecording(activeHistoryId)
      .then((blob) => {
        if (isCurrent && blob) {
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
        }
      })
      .catch((err) => {
        console.error("Failed to load recording from IndexedDB:", err);
      });

    return () => {
      isCurrent = false;
    };
  }, [activeHistoryId]);

  // Update recording timer
  useEffect(() => {
    if (isRecording) {
      timeIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    }
    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, [isRecording]);

  // Clean up references on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close();
      }
    };
  }, []);

  const startVisualizer = (stream: MediaStream) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!canvasRef.current || !isRecording) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        analyser.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, width, height);

        const barWidth = (width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * height * 0.85;

          const isDark = document.documentElement.classList.contains("dark");
          ctx.fillStyle = isDark 
            ? `rgba(192, 132, 252, ${0.4 + barHeight / height})` 
            : `rgba(159, 64, 45, ${0.4 + barHeight / height})`;

          const y = (height - barHeight) / 2;
          ctx.beginPath();
          ctx.roundRect(x, y, barWidth - 2, barHeight, 3);
          ctx.fill();

          x += barWidth;
        }

        animationFrameRef.current = requestAnimationFrame(draw);
      };

      draw();
    } catch (e) {
      console.error("Failed to start audio visualizer:", e);
    }
  };

  const startRecording = async () => {
    if (!activeHistoryId) return;
    setPermissionError(null);
    audioChunksRef.current = [];
    setRecordingTime(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const options = { mimeType: "audio/webm" };
      let recorder;
      
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        
        try {
          await saveRecording(activeHistoryId, audioBlob);
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
          onRecordingSaved(activeHistoryId);
        } catch (e) {
          console.error("Failed to save recording to db:", e);
          setPermissionError("No se pudo guardar la grabación localmente.");
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      setIsRecording(true);
      recorder.start();
      startVisualizer(stream);
    } catch (err: any) {
      console.error("Mic permission denied or error:", err);
      setPermissionError("Permiso denegado. Habilita el acceso al micrófono para grabar.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const deleteRecording = async () => {
    if (!activeHistoryId) return;

    try {
      await deleteRecordingFromDB(activeHistoryId);
      onRecordingDeleted(activeHistoryId);
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(null);
      setIsPlaying(false);
      setRecordingTime(0);
    } catch (e) {
      console.error("Failed to delete recording:", e);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (!activeHistoryId) {
    return (
      <div className="mt-4 text-on-surface-variant/60 font-semibold text-[11px] md:text-xs flex items-center justify-center space-x-1.5 py-2 px-5 glass-panel rounded-full select-none">
        <Sparkles size={12} className="text-primary animate-pulse" />
        <span>¡Sortea un tema o selecciona uno del historial para grabar tu práctica!</span>
      </div>
    );
  }

  return (
    <div className="mt-4 w-full max-w-sm mx-auto flex flex-col items-center">
      {/* Visual State: IDLE */}
      {!isRecording && !audioUrl && (
        <button
          onClick={startRecording}
          className="glass-panel px-5 py-2.5 rounded-full flex items-center space-x-2 text-on-surface-variant hover:text-primary transition-all active:scale-95 cursor-pointer text-xs font-bold shadow-sm hover:shadow-md border border-outline-variant/30 bg-transparent"
        >
          <Mic size={14} className="text-primary animate-pulse" />
          <span>Grabar Discurso para este Tema</span>
        </button>
      )}

      {/* Visual State: RECORDING */}
      {isRecording && (
        <div className="glass-panel w-full p-3 rounded-2xl flex flex-col items-center border border-red-500/30 bg-red-500/5 shadow-md">
          <div className="flex items-center justify-between w-full mb-2 px-1">
            <span className="text-[10px] uppercase font-bold text-red-500 tracking-widest flex items-center space-x-1 animate-pulse">
              <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
              <span>Grabando</span>
            </span>
            <span className="font-mono text-xs font-bold text-on-surface-variant">
              {formatDuration(recordingTime)}
            </span>
          </div>

          <canvas
            ref={canvasRef}
            width={240}
            height={36}
            className="w-full h-9 mb-2 bg-transparent opacity-80"
          />

          <button
            onClick={stopRecording}
            className="w-full py-1.5 bg-primary hover:bg-primary-hover text-background font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-98 border-none"
          >
            <Square size={10} fill="currentColor" />
            <span>Detener y Guardar Práctica</span>
          </button>
        </div>
      )}

      {/* Visual State: COMPLETED RECORDING (PLAYBACK) */}
      {audioUrl && (
        <div className="glass-panel w-full p-3 rounded-xl flex items-center justify-between border border-outline-variant/30 shadow-md">
          <div className="flex items-center space-x-3.5">
            <button
              onClick={togglePlayback}
              className="p-2.5 bg-primary text-background rounded-full hover:bg-primary-hover transition-colors cursor-pointer active:scale-90 border-none flex items-center justify-center"
              title={isPlaying ? "Pausar audio" : "Reproducir audio"}
            >
              {isPlaying ? <Pause size={12} fill="currentColor" /> : <Play size={12} fill="currentColor" />}
            </button>
            <div className="text-left">
              <p className="text-[11px] font-bold text-foreground leading-tight">Tu Grabación Guardada</p>
              <p className="text-[9px] text-on-surface-variant/75 mt-0.5 font-semibold uppercase tracking-wider leading-none">
                Almacenado localmente en este dispositivo
              </p>
            </div>
          </div>

          <button
            onClick={deleteRecording}
            className="p-1.5 text-on-surface-variant hover:text-error transition-colors rounded-lg cursor-pointer bg-transparent border-none"
            title="Eliminar grabación"
          >
            <Trash2 size={14} />
          </button>

          <audio
            ref={audioRef}
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
