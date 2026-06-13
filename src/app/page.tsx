"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import SidebarLeft from "@/components/SidebarLeft";
import SidebarRight from "@/components/SidebarRight";
import TopicSelector from "@/components/TopicSelector";
import Timer from "@/components/Timer";
import VoiceRecorder from "@/components/VoiceRecorder";
import WelcomeModal from "@/components/WelcomeModal";
import PrivacyModal from "@/components/PrivacyModal";
import { clearAllRecordings } from "@/utils/db";

interface HistoryItem {
  id: string;
  topic: string;
  timestamp: number;
  hasRecording: boolean;
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  
  const [topicsText, setTopicsText] = useState("");
  const [activeTopic, setActiveTopic] = useState("");
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const timerSectionRef = useRef<HTMLDivElement>(null);

  // Initialize and load state from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    
    // Load theme
    const savedTheme = localStorage.getItem("rompehielo-theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
    
    // Load onboarding state
    const seenOnboarding = localStorage.getItem("rompehielo-onboarding-seen");
    if (!seenOnboarding) {
      setWelcomeModalOpen(true);
    }

    // Load topic pool text
    const savedTopicsText = localStorage.getItem("rompehielo-topics-text");
    if (savedTopicsText !== null) {
      setTopicsText(savedTopicsText);
    }
    
    // Load and migrate history
    const savedHistory = localStorage.getItem("rompehielo-history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed)) {
          const migrated: HistoryItem[] = parsed.map((item: any, idx: number) => {
            if (typeof item === "string") {
              return {
                id: `migrated-${idx}-${Date.now()}`,
                topic: item,
                timestamp: Date.now() - idx * 60000,
                hasRecording: false,
              };
            }
            return item;
          });
          setHistory(migrated);
        }
      } catch (e) {
        console.error("Failed to parse history from localStorage:", e);
      }
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isMounted) return;
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("rompehielo-theme", theme);
  }, [theme, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("rompehielo-topics-text", topicsText);
  }, [topicsText, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("rompehielo-history", JSON.stringify(history));
  }, [history, isMounted]);

  // Derived state: Parse topics text into list of topics
  const topicsPool = topicsText
    .split("\n")
    .map((t) => t.trim())
    .filter((t) => t !== "");

  const handleTopicSelected = (topic: string) => {
    const id = `speech-${Date.now()}`;
    const newItem: HistoryItem = {
      id,
      topic,
      timestamp: Date.now(),
      hasRecording: false,
    };
    setHistory((prev) => [newItem, ...prev]);
    setActiveHistoryId(id);
    setActiveTopic(topic);
  };

  const handleClearHistory = async () => {
    if (confirm("¿Estás seguro de que deseas borrar todo el historial y todas las grabaciones locales?")) {
      setHistory([]);
      setActiveHistoryId(null);
      setActiveTopic("");
      try {
        await clearAllRecordings();
      } catch (e) {
        console.error("Failed to clear local recording DB:", e);
      }
    }
  };

  const handleSelectFromHistory = (topic: string, id: string) => {
    setActiveTopic(topic);
    setActiveHistoryId(id);
    setRightSidebarOpen(false);
  };

  const handleRecordingSaved = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, hasRecording: true } : item
      )
    );
  };

  const handleRecordingDeleted = (id: string) => {
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, hasRecording: false } : item
      )
    );
  };

  const handleScrollToTimer = () => {
    timerSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleCloseWelcomeModal = () => {
    setWelcomeModalOpen(false);
    localStorage.setItem("rompehielo-onboarding-seen", "true");
  };

  const handleOpenWelcomeModal = () => {
    setWelcomeModalOpen(true);
  };

  const handleOpenPrivacyModal = () => {
    setPrivacyModalOpen(true);
  };

  // Keyboard accessibility listeners for spans in footer
  const handleKeyDownOpenWelcome = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpenWelcomeModal();
    }
  };

  const handleKeyDownOpenPrivacy = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpenPrivacyModal();
    }
  };

  // Prevent loading UI layout until state is loaded from client (prevents hydration mismatch)
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#fcf9f3] dark:bg-[#08090f] flex items-center justify-center">
        <div className="font-extrabold text-2xl tracking-tighter text-[#9f402d] animate-pulse flex items-center space-x-1.5">
          <span>🧊</span>
          <span>RompeHielo</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative flex flex-col justify-between font-sans text-foreground">
      {/* Background Graphic Grid */}
      <div className="fixed inset-0 w-full h-full z-0 select-none pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-100/30 via-rose-100/25 to-amber-50/20 dark:from-indigo-950/20 dark:via-purple-950/15 dark:to-zinc-950/20 transition-all duration-500" />
        <img
          alt="Landscape Background"
          className="w-full h-full object-cover object-bottom opacity-10 dark:opacity-[0.04] mix-blend-overlay transition-opacity duration-500"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDoy0CP_DiUv3m04WOqSbnMLvTilAzib5RIm_OUMoCDYRfnTNr3FP_0l1L5edrGZnu1TAaWTzcczxGupe6zhe-ylW6aZRmKnkyDDjP6Mj6qbioNuYiiiWzpohxOMxvVlCXsYFMywa-iKsXZ24raSSkQ3zKrP4vXUyYakscr0_27PqFI7jX711qIu7IHKMQTNSSkuaSoFffk9v4L_I9IykFHe-vdRNFvom5rz6teALiVslSyXc4wjwNh"
        />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] dark:bg-background/25 transition-all duration-500" />
      </div>

      {/* Navigation */}
      <Navbar
        onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
        onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
        onScrollToTimer={handleScrollToTimer}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Sidebars */}
      <SidebarLeft
        isOpen={leftSidebarOpen}
        onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)}
        topicsText={topicsText}
        onTopicsTextChange={setTopicsText}
        topicCount={topicsPool.length}
      />

      <SidebarRight
        isOpen={rightSidebarOpen}
        onClose={() => setRightSidebarOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onSelectTopic={handleSelectFromHistory}
      />

      {/* Main Canvas / Hero Area */}
      <main className="relative z-10 flex-1 w-full flex flex-col items-center justify-center px-4 py-16 text-center max-w-4xl mx-auto overflow-hidden">
        
        {/* Topic Selector */}
        <TopicSelector
          topicsPool={topicsPool}
          activeTopic={activeTopic}
          setActiveTopic={setActiveTopic}
          onTopicSelected={handleTopicSelected}
        />

        {/* Practice Voice Recorder */}
        <VoiceRecorder
          activeHistoryId={activeHistoryId}
          onRecordingSaved={handleRecordingSaved}
          onRecordingDeleted={handleRecordingDeleted}
        />

        {/* Organic Timer Section */}
        <div ref={timerSectionRef} className="mt-2 transition-transform duration-300">
          <Timer />
        </div>
      </main>

      {/* Welcome Onboarding Modal */}
      <WelcomeModal
        isOpen={welcomeModalOpen}
        onClose={handleCloseWelcomeModal}
      />

      {/* Privacy Modal */}
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />

      {/* Footer */}
      <footer className="relative z-10 w-full bg-transparent px-6 md:px-16 py-3 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs text-on-surface-variant/60 font-semibold uppercase tracking-wider gap-1.5 select-none border-t border-outline-variant/10">
        <div>© 2026 ROMPEHIELO ENGINE. ENFÓCATE.</div>
        <div className="flex space-x-6 items-center" role="navigation" aria-label="Enlaces del Pie de Página">
          <span 
            role="button"
            tabIndex={0}
            onClick={handleOpenWelcomeModal}
            onKeyDown={handleKeyDownOpenWelcome}
            className="hover:text-primary transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/45 rounded px-1"
            aria-haspopup="dialog"
            aria-label="Abrir introducción Acerca de"
          >
            Acerca de
          </span>
          <span 
            role="button"
            tabIndex={0}
            onClick={handleOpenPrivacyModal}
            onKeyDown={handleKeyDownOpenPrivacy}
            className="hover:text-primary transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/45 rounded px-1"
            aria-haspopup="dialog"
            aria-label="Abrir Política de Privacidad"
          >
            Privacidad
          </span>
          
          {/* YouTube Button - Inline SVG to bypass outdated lucide package limitations */}
          <a
            href="https://github.com/CoralGamer/RompeHielo_APP"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-red-600 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/45 rounded px-1 text-on-surface-variant font-bold normal-case"
            aria-label="Ver canal de YouTube (redirecciona al repositorio de GitHub)"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="text-red-500" stroke="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span>YouTube</span>
          </a>

          {/* GitHub Star Button - Inline SVG to bypass outdated lucide package limitations */}
          <a
            href="https://github.com/CoralGamer/RompeHielo_APP/stargazers"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 hover:text-primary transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/45 rounded px-1 text-on-surface-variant font-bold normal-case"
            aria-label="Dar una estrella al repositorio en GitHub"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" className="text-amber-500" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>Dar Estrella</span>
          </a>

          <a
            href="https://github.com/CoralGamer/RompeHielo_APP"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/45 rounded px-1"
            aria-label="Ver código en GitHub"
          >
            Github
          </a>
        </div>
      </footer>
    </div>
  );
}
