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
  const [starCount, setStarCount] = useState<number | null>(null);

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

    // Fetch GitHub repository stars in real-time
    fetch("https://api.github.com/repos/CoralGamer/RompeHielo_APP")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.stargazers_count === "number") {
          setStarCount(data.stargazers_count);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch GitHub stars:", err);
      });
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
      <main className="relative z-10 flex-grow w-full flex flex-col items-center justify-center px-4 py-16 text-center max-w-4xl mx-auto overflow-hidden">
        
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
          
          {/* Custom GitHub Star Count Button matching the visual mock-up */}
          <a
            href="https://github.com/CoralGamer/RompeHielo_APP"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 bg-zinc-950/80 border border-zinc-800 hover:border-primary/50 text-zinc-300 text-[10px] font-mono py-1 px-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-primary/45 select-none shadow-sm"
            aria-label={`Estrellas en GitHub: ${starCount !== null ? starCount : "cargando"}`}
          >
            {/* GitHub SVG Icon */}
            <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" className="text-zinc-300" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span>Star</span>
            <span className="text-zinc-700">|</span>
            <span className="text-cyan-400 font-bold">
              {starCount !== null ? starCount : "..."}
            </span>
          </a>

          <a
            href="https://github.com/CoralGamer/RompeHielo_APP"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/45 rounded px-1"
            aria-label="Ver repositorio en GitHub"
          >
            Github
          </a>
        </div>
      </footer>
    </div>
  );
}
