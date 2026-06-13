"use client";

import React from "react";
import { Sun, Moon, History, Clock } from "lucide-react";

interface NavbarProps {
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  onScrollToTimer: () => void;
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
}

export default function Navbar({
  onToggleLeftSidebar,
  onToggleRightSidebar,
  onScrollToTimer,
  theme,
  setTheme,
}: NavbarProps) {
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-40 bg-background/30 backdrop-blur-md border-b border-outline-variant/30 flex justify-between items-center px-4 md:px-16 py-4 transition-colors duration-300">
      {/* Brand - Semantic button with keyboard controls */}
      <button 
        onClick={onToggleLeftSidebar}
        className="font-extrabold text-2xl md:text-3xl tracking-tighter text-primary cursor-pointer hover:opacity-85 transition-opacity flex items-center space-x-1.5 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/45 rounded-lg p-1"
        aria-label="Abrir Bolsa de Temas"
        title="Abrir Bolsa de Temas"
      >
        <span className="text-3xl" aria-hidden="true">🧊</span>
        <span>RompeHielo</span>
      </button>

      {/* Navigation Links (Desktop) */}
      <div className="hidden md:flex space-x-12 items-center" role="menubar">
        <button
          onClick={onToggleRightSidebar}
          role="menuitem"
          className="flex items-center space-x-1.5 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold tracking-wider uppercase cursor-pointer bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/45 rounded-lg p-1"
          aria-label="Ver Historial de Temas y Grabaciones"
        >
          <History size={16} aria-hidden="true" />
          <span>Historial</span>
        </button>
        <button
          onClick={onScrollToTimer}
          role="menuitem"
          className="flex items-center space-x-1.5 text-on-surface-variant hover:text-primary transition-colors text-sm font-semibold tracking-wider uppercase cursor-pointer bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/45 rounded-lg p-1"
          aria-label="Ir al Temporizador"
        >
          <Clock size={16} aria-hidden="true" />
          <span>Temporizador</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 items-center">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-1.5 text-primary cursor-pointer active:scale-95 transition-transform hover:text-primary-hover bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary/45 rounded-full"
          title={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
          aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
        >
          {theme === "light" ? <Moon size={22} aria-hidden="true" /> : <Sun size={22} aria-hidden="true" />}
        </button>
      </div>
    </nav>
  );
}
