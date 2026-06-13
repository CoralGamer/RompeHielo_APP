"use client";

import React from "react";
import { X, Sparkles, Mic, Clock, Volume2, Database, AlertTriangle, ShieldCheck } from "lucide-react";

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-background/60 backdrop-blur-md transition-all duration-300" 
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[85vh] glass-panel rounded-3xl z-10 shadow-2xl border border-outline-variant/40 animate-in fade-in zoom-in-95 duration-300 flex flex-col text-left overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container/50 cursor-pointer bg-transparent border-none z-20"
          title="Cerrar introducción"
        >
          <X size={20} />
        </button>

        {/* Scrollable Wrapper */}
        <div className="overflow-y-auto p-6 md:p-8 pr-5 md:pr-7 mr-1 flex-1">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
              <Sparkles size={24} className="animate-pulse" />
            </div>
            <div>
              <h2 className="font-black text-2xl md:text-3xl text-primary tracking-tight">
                Te damos la bienvenida a RompeHielo
              </h2>
              <p className="text-xs font-bold text-on-surface-variant/80 uppercase tracking-widest mt-0.5">
                Práctica de Oratoria e Improvisación
              </p>
            </div>
          </div>

          {/* Origin */}
          <div className="mb-6 p-4 rounded-2xl bg-primary/5 border border-primary/15 leading-relaxed text-sm text-foreground">
            💡 <strong>El Origen:</strong> Este proyecto nació de una charla de necesidades compartida entre <strong>Susan y Nicolás</strong>. El objetivo es ofrecer una herramienta sumamente práctica, limpia y sin rodeos para entrenar la habilidad de hablar en público, estructurar ideas al vuelo y vencer el miedo escénico.
          </div>

          {/* How it works */}
          <div className="mb-6">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-primary mb-4">
              ¿Cómo funciona el entrenamiento?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-surface-container/30 rounded-2xl border border-outline-variant/15 flex flex-col">
                <div className="text-primary mb-2">
                  <Sparkles size={18} />
                </div>
                <h4 className="font-bold text-sm mb-1">1. Lluvia de Ideas</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Ingresa temas personalizados en el panel izquierdo (Bolsa de Temas) o usa nuestra lista por defecto.
                </p>
              </div>

              <div className="p-4 bg-surface-container/30 rounded-2xl border border-outline-variant/15 flex flex-col">
                <div className="text-primary mb-2 flex space-x-1">
                  <Clock size={18} />
                  <Mic size={18} />
                </div>
                <h4 className="font-bold text-sm mb-1">2. Sortea y Graba</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Sortea un tema. Tienes hasta <strong>5 minutos</strong> para hablar del tema mientras grabas tu voz con el micrófono.
                </p>
              </div>

              <div className="p-4 bg-surface-container/30 rounded-2xl border border-outline-variant/15 flex flex-col">
                <div className="text-primary mb-2">
                  <Volume2 size={18} />
                </div>
                <h4 className="font-bold text-sm mb-1">3. Autoevaluación</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Escucha tus propias prácticas en el historial (panel derecho) para identificar muletillas, pausas, tono y mejorar tu ritmo.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Warnings */}
          <div className="mb-8 border-t border-outline-variant/20 pt-6">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-error mb-4 flex items-center space-x-2">
              <AlertTriangle size={18} />
              <span>Advertencias sobre el Almacenamiento Local</span>
            </h3>

            <div className="space-y-3.5 text-xs text-on-surface-variant leading-relaxed">
              <div className="flex items-start space-x-3">
                <div className="text-emerald-500 mt-0.5 flex-shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <strong>Datos 100% Locales y Privados:</strong> Todo lo que crees (temas, historial y grabaciones de audio) se procesa y guarda localmente en el navegador de este dispositivo. No hay servidores, nubes, cookies externas ni cuentas de usuario. Nadie más puede acceder a tu voz.
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="text-primary mt-0.5 flex-shrink-0">
                  <Database size={16} />
                </div>
                <div>
                  <strong>Límite de Espacio:</strong> El almacenamiento disponible para guardar discursos grabados dependerá exclusivamente de la memoria libre que tengas en tu dispositivo/teléfono.
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="text-amber-500 mt-0.5 flex-shrink-0">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <strong>Sin Sincronización:</strong> Al no existir base de datos en la nube, debes usar siempre este mismo teléfono o computadora si quieres revisar tu progreso. Si entras desde otro dispositivo, no verás tu historial.
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-error/5 border border-error/20 rounded-xl text-red-700 dark:text-red-300">
                <div className="mt-0.5 flex-shrink-0">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <strong>¡Cuidado al borrar datos!:</strong> Si borras el historial de navegación, la caché de tu navegador, o utilizas programas de limpieza de cookies, <strong>eliminarás definitivamente todas tus grabaciones e historial</strong> de forma irreversible.
                </div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onClose}
            className="w-full py-4 bg-primary hover:bg-primary-hover text-background font-bold text-sm uppercase tracking-wider rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer active:scale-98 border-none"
          >
            ¡Entendido, a practicar!
          </button>
        </div>

      </div>
    </div>
  );
}
