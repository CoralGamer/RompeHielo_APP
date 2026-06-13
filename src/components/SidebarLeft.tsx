"use client";

import React, { useRef } from "react";
import { Upload, X, Trash2, Menu } from "lucide-react";

interface SidebarLeftProps {
  isOpen: boolean;
  onToggle: () => void;
  topicsText: string;
  onTopicsTextChange: (text: string) => void;
  topicCount: number;
}

export default function SidebarLeft({
  isOpen,
  onToggle,
  topicsText,
  onTopicsTextChange,
  topicCount,
}: SidebarLeftProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const cleanText = text.trim();
        if (topicsText.trim() === "") {
          onTopicsTextChange(cleanText);
        } else {
          onTopicsTextChange(topicsText.trim() + "\n" + cleanText);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleClearPool = () => {
    onTopicsTextChange("");
  };

  return (
    <>
      {/* Floating Toggle Button (Left) */}
      <button
        onClick={onToggle}
        className="fixed top-24 left-4 md:left-8 z-50 glass-panel p-3 rounded-full text-primary hover:text-primary-hover transition-all active:scale-95 cursor-pointer shadow-md hover:shadow-lg bg-transparent border-none"
        title="Ver Bolsa de Temas"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Left Sidebar Panel */}
      <aside
        className={`fixed left-0 top-0 h-full w-[85vw] sm:w-[380px] md:w-[420px] glass-panel z-40 flex flex-col p-6 pt-32 shadow-2xl transition-transform duration-400 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-extrabold text-xl md:text-2xl text-primary tracking-tight">
            Bolsa de Temas
          </h2>
          <button 
            onClick={onToggle}
            className="md:hidden text-on-surface-variant hover:text-primary transition-colors p-1 bg-transparent border-none cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-on-surface-variant mb-4 font-medium leading-relaxed">
          Ingresa tus propios temas (uno por línea) para sortearlos en la ruleta, o sube un archivo de texto con tu lista personalizada.
        </p>

        {/* Input Area */}
        <div className="relative flex-grow flex flex-col min-h-[200px]">
          <textarea
            value={topicsText}
            onChange={(e) => onTopicsTextChange(e.target.value)}
            className="w-full flex-grow bg-surface-container/40 text-on-surface p-4 rounded-xl resize-none input-focus-border text-sm border border-outline-variant/40 focus:border-primary focus:ring-0 leading-relaxed font-sans placeholder:text-on-surface-variant/40"
            placeholder="Ejemplo:&#10;Inteligencia Artificial&#10;El sentido de la vida&#10;Cómo hablar en público con confianza..."
          />
        </div>

        {/* Action Controls */}
        <div className="mt-4 flex justify-between items-center text-xs md:text-sm">
          <input
            type="file"
            accept=".txt"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-1.5 text-on-surface-variant hover:text-primary transition-colors font-semibold uppercase cursor-pointer bg-transparent border-none"
          >
            <Upload size={16} />
            <span>Subir .txt</span>
          </button>

          {topicsText.trim() && (
            <button
              onClick={handleClearPool}
              className="flex items-center space-x-1 text-on-surface-variant hover:text-primary transition-colors font-semibold uppercase cursor-pointer bg-transparent border-none"
              title="Vaciar bolsa"
            >
              <Trash2 size={16} />
              <span>Limpiar</span>
            </button>
          )}

          <span className="font-semibold text-on-surface-variant uppercase tracking-wider text-xs">
            {topicCount} {topicCount === 1 ? "Tema" : "Temas"}
          </span>
        </div>
      </aside>
    </>
  );
}
