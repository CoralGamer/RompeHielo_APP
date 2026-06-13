"use client";

import React from "react";
import { X, ShieldCheck, Database, ServerCrash, RefreshCw, AlertTriangle } from "lucide-react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-background/60 backdrop-blur-md transition-all duration-300" 
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto glass-panel rounded-3xl p-6 md:p-8 z-10 shadow-2xl border border-outline-variant/40 animate-in fade-in zoom-in-95 duration-300 flex flex-col text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full hover:bg-surface-container/50 cursor-pointer bg-transparent border-none"
          title="Cerrar política de privacidad"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="font-black text-xl md:text-2xl text-foreground tracking-tight">
              Política de Privacidad
            </h2>
            <p className="text-[10px] font-bold text-on-surface-variant/80 uppercase tracking-widest mt-0.5">
              RompeHielo App • Privacidad Absoluta
            </p>
          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
          <p>
            En <strong>RompeHielo</strong> valoramos tu privacidad por encima de todo. Creemos que tu voz y tus prácticas de oratoria son exclusivamente tuyas. Por ello, la aplicación ha sido diseñada bajo una arquitectura <strong>100% cliente-servidor (offline-first)</strong>.
          </p>

          <div className="border-t border-outline-variant/20 pt-4 space-y-4">
            {/* Aspect 1: Local Storage */}
            <div className="flex items-start space-x-3">
              <Database className="text-primary mt-1 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-extrabold text-foreground text-sm">Almacenamiento Local Físico</h4>
                <p className="text-xs mt-1">
                  Todos tus datos (temas de tu bolsa de ideas, el historial de prácticas y las grabaciones binarias de voz) se almacenan localmente en tu propio dispositivo utilizando <strong>LocalStorage</strong> para texto y la base de datos interna <strong>IndexedDB</strong> para audio.
                </p>
              </div>
            </div>

            {/* Aspect 2: No Cloud */}
            <div className="flex items-start space-x-3">
              <ServerCrash className="text-primary mt-1 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-extrabold text-foreground text-sm">Cero Conexión a la Nube</h4>
                <p className="text-xs mt-1">
                  No recopilamos telemetría, no utilizamos cookies de seguimiento ni transmitimos tus archivos de audio a ningún servidor externo. El procesamiento de grabación y reproducción se realiza mediante las APIs del navegador (`MediaRecorder` y `Web Audio API`). La aplicación funciona incluso sin conexión a internet.
                </p>
              </div>
            </div>

            {/* Aspect 3: Device Bound */}
            <div className="flex items-start space-x-3">
              <RefreshCw className="text-primary mt-1 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-extrabold text-foreground text-sm">Límite de Dispositivo Único</h4>
                <p className="text-xs mt-1">
                  Dado que tus datos no pasan por nuestra nube ni requieren de una cuenta en línea, tu información no se sincronizará entre diferentes dispositivos. Solo podrás ver tus discursos y grabaciones desde el teléfono o la computadora en los que realizaste las grabaciones originales.
                </p>
              </div>
            </div>

            {/* Aspect 4: Cache Warning */}
            <div className="flex items-start space-x-3 p-3 bg-error/5 border border-error/20 rounded-2xl text-red-700 dark:text-red-300">
              <AlertTriangle className="mt-1 flex-shrink-0" size={18} />
              <div>
                <h4 className="font-extrabold text-sm">Advertencia Crítica sobre la Caché</h4>
                <p className="text-[11px] mt-1 font-medium leading-relaxed">
                  Si decides borrar el historial de tu navegador, borrar la caché de navegación, limpiar los datos de almacenamiento del sitio o utilizar pestañas en modo incógnito, <strong>la base de datos IndexedDB y LocalStorage se vaciarán permanentemente</strong>. En este caso, perderás todos tus temas e historial sin posibilidad de recuperarlos.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer active:scale-98 border-none"
        >
          Entendido y Aceptado
        </button>

      </div>
    </div>
  );
}
