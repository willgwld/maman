import React, { useState, useEffect, useRef } from "react";
import { Brain, Play, Pause, RotateCcw, Sparkles, Volume2, VolumeX, Moon, Sun, Heart, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Session {
  id: string;
  title: string;
  duration: string;
  desc: string;
  icon: string;
  category: "respiration" | "meditation" | "sommeil" | "postpartum";
}

const SESSIONS: Session[] = [
  {
    id: "coherence",
    title: "Cohérence Cardiaque 3 min",
    duration: "3 min",
    desc: "3 minutes de souffle synchronisé pour calmer immédiatement le rythme cardiaque et le cortisol.",
    icon: "🌬️",
    category: "respiration"
  },
  {
    id: "anxiete",
    title: "Apaiser l'Anxiété & la Peur de l'Accouchement",
    duration: "5 min",
    desc: "Sophrologie et visualisation guidée pour libérer la peur des contractions et faire confiance à son corps.",
    icon: "🌸",
    category: "meditation"
  },
  {
    id: "bebe",
    title: "Connexion Tendre In Utero",
    duration: "7 min",
    desc: "Un moment suspendu de communication affective, de tendresse et de partage avec votre bébé.",
    icon: "👶",
    category: "meditation"
  },
  {
    id: "sommeil",
    title: "Sommeil Profond & Scannage Corporel",
    duration: "10 min",
    desc: "Détente musculaire progressive pour chasser les insomnies et relâcher les tensions lombaires.",
    icon: "🌙",
    category: "sommeil"
  },
  {
    id: "respiration-478",
    title: "Technique 4-7-8 Anti-Panique",
    duration: "4 min",
    desc: "Inspirez 4s, retenez 7s, expirez 8s pour activer le système parasympathique et stopper les angoisses.",
    icon: "🧘‍♀️",
    category: "respiration"
  },
  {
    id: "nidra-postpartum",
    title: "Yoga Nidra Récupération Post-Partum",
    duration: "12 min",
    desc: "L'équivalent de 2h de sommeil réparateur en relaxation profonde pour les mamans fatiguées.",
    icon: "✨",
    category: "postpartum"
  }
];

const AFFIRMATIONS = [
  "Mon corps sait exactement comment faire grandir et mettre au monde mon bébé.",
  "Chaque contraction est une vague qui me rapproche de mon enfant.",
  "Je prends le temps de me reposer sans aucune culpabilité.",
  "Je suis une maman aimante, forte et bienveillante.",
  "Je fais confiance à mes sensations et à mon instinct maternel.",
  "Mon bébé et moi sommes une équipe parfaite en pleine santé.",
  "Je m'accorde de la douceur et du pardon à chaque étape."
];

export default function Mental() {
  const [activeSession, setActiveSession] = useState<Session | null>(SESSIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState<"Inspirer" | "Retenir" | "Expirer">("Inspirer");
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  // Web Audio Synth ambient sound
  const [ambientSound, setAmbientSound] = useState<"none" | "rain" | "waves">("none");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Toggle Web Audio Synth soundscape
  useEffect(() => {
    if (ambientSound === "none") {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Generate soft pink noise / ocean waves
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.015; // Keep volume soft
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for rain / waves
      const filter = ctx.createBiquadFilter();
      filter.type = ambientSound === "waves" ? "lowpass" : "bandpass";
      filter.frequency.setValueAtTime(ambientSound === "waves" ? 350 : 800, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      noiseNodeRef.current = whiteNoise;
    } catch (e) {
      console.log("Audio Context not supported", e);
    }

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, [ambientSound]);

  // Breathing Circle Animation Timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Breath rhythm generator
  useEffect(() => {
    let breathInterval: any = null;
    if (isPlaying) {
      const is478 = activeSession?.id === "respiration-478";
      const cycle = () => {
        setBreathPhase("Inspirer");
        setTimeout(() => setBreathPhase("Retenir"), is478 ? 4000 : 4000);
        setTimeout(() => setBreathPhase("Expirer"), is478 ? 11000 : 6000);
      };
      cycle();
      breathInterval = setInterval(cycle, is478 ? 19000 : 12000);
    }
    return () => clearInterval(breathInterval);
  }, [isPlaying, activeSession]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const resetTimer = () => {
    setIsPlaying(false);
    const mins = parseInt(activeSession?.duration || "3");
    setTimerSeconds(mins * 60);
    setBreathPhase("Inspirer");
  };

  const selectSession = (s: Session) => {
    setActiveSession(s);
    setIsPlaying(false);
    const mins = parseInt(s.duration);
    setTimerSeconds(mins * 60);
    setBreathPhase("Inspirer");
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const nextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
  };

  const filteredSessions = SESSIONS.filter(
    (s) => activeCategory === "all" || s.category === activeCategory
  );

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto pb-20 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold text-[#4A4A4A] dark:text-[#E6E1DA]">Espace Relax & Sérénité</h1>
          <p className="text-xs text-muted-foreground">Pauses apaisantes, sophrologie et respirations guidées.</p>
        </div>

        <div className="p-2.5 bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 rounded-2xl">
          <Brain className="w-5 h-5" />
        </div>
      </div>

      {/* Affirmation du jour */}
      <Card className="border border-purple-100 dark:border-purple-900/40 bg-gradient-to-r from-purple-50/60 via-pink-50/40 to-rose-50/60 dark:from-purple-950/20 dark:via-pink-950/20 dark:to-rose-950/20 rounded-3xl p-4 shadow-2xs">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Affirmation Positive
            </span>
            <p className="text-xs sm:text-sm font-medium text-[#4A4A4A] dark:text-[#E6E1DA] italic leading-relaxed">
              « {AFFIRMATIONS[affirmationIndex]} »
            </p>
          </div>

          <Button
            onClick={nextAffirmation}
            variant="ghost"
            size="sm"
            className="rounded-xl h-8 px-2 text-xs text-purple-700 dark:text-purple-300 hover:bg-purple-100/50"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </Card>

      {/* ACTIVE BREATHING & MEDITATION PLAYER */}
      <Card className="border border-[#EAE5DF] dark:border-[#332E2A] shadow-md bg-white dark:bg-[#201D1B] rounded-3xl p-6 md:p-8 text-center space-y-6">
        <div className="space-y-1">
          <span className="text-4xl">{activeSession?.icon || "🌸"}</span>
          <h2 className="text-xl font-bold text-[#4A4A4A] dark:text-[#E6E1DA]">{activeSession?.title}</h2>
          <p className="text-xs text-muted-foreground">{activeSession?.desc}</p>
        </div>

        {/* Breathing Circle Visualizer */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-3000 ${
              isPlaying
                ? breathPhase === "Inspirer"
                  ? "bg-[#E9B6B6]/30 dark:bg-[#E9B6B6]/40 scale-110"
                  : breathPhase === "Retenir"
                  ? "bg-purple-200/40 dark:bg-purple-900/40 scale-110"
                  : "bg-[#A3B899]/30 dark:bg-[#A3B899]/40 scale-90"
                : "bg-gray-100 dark:bg-[#2A2623] scale-100"
            }`}
          />
          <div className="w-32 h-32 bg-white dark:bg-[#201D1B] rounded-full shadow-md border border-[#EAE5DF] dark:border-[#332E2A] flex flex-col items-center justify-center z-10 space-y-1">
            <span className="text-xs font-bold text-[#E9B6B6] uppercase tracking-wider">
              {isPlaying ? breathPhase : "Prête ?"}
            </span>
            <span className="text-2xl font-extrabold text-[#4A4A4A] dark:text-[#E6E1DA]">
              {formatTime(timerSeconds)}
            </span>
          </div>
        </div>

        {/* Ambient Sound Scape Selector */}
        <div className="flex items-center justify-center gap-2 pt-1 border-t border-[#EAE5DF]/60 dark:border-[#332E2A]">
          <span className="text-[11px] font-bold text-muted-foreground mr-1 flex items-center gap-1">
            <Volume2 className="w-3.5 h-3.5 text-[#A3B899]" /> Ambiance :
          </span>
          {[
            { id: "none", label: "Silencieux" },
            { id: "rain", label: "Pluie 🌧️" },
            { id: "waves", label: "Océan 🌊" },
          ].map((snd) => (
            <button
              key={snd.id}
              onClick={() => setAmbientSound(snd.id as any)}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                ambientSound === snd.id
                  ? "bg-[#A3B899] text-white"
                  : "bg-[#FAFAF9] dark:bg-[#2A2623] text-muted-foreground hover:text-[#4A4A4A]"
              }`}
            >
              {snd.label}
            </button>
          ))}
        </div>

        {/* Play Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            onClick={resetTimer}
            variant="outline"
            className="rounded-2xl border-[#EAE5DF] dark:border-[#332E2A] h-12 px-4"
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
          </Button>

          <Button
            onClick={togglePlay}
            className="bg-[#A3B899] hover:bg-[#8F9F85] text-white rounded-2xl h-14 px-8 text-sm font-bold shadow-md transition-all flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Mettre en pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>Commencer la séance</span>
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* SESSIONS CATALOG */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] dark:text-[#E6E1DA] ml-1">
            Choisir une séance guidée
          </h3>
        </div>

        {/* Category pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
          {[
            { id: "all", label: "Toutes" },
            { id: "respiration", label: "Respiration" },
            { id: "meditation", label: "Méditation" },
            { id: "sommeil", label: "Sommeil" },
            { id: "postpartum", label: "Post-partum" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-2xl font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-[#A3B899] text-white"
                  : "bg-white dark:bg-[#201D1B] border border-[#EAE5DF] dark:border-[#332E2A] text-[#4A4A4A] dark:text-[#E6E1DA]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          {filteredSessions.map((s) => {
            const isSelected = activeSession?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => selectSession(s)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? "bg-white dark:bg-[#201D1B] border-[#A3B899] dark:border-[#A3B899] shadow-xs ring-2 ring-[#A3B899]/30"
                    : "bg-white dark:bg-[#201D1B] border-[#EAE5DF] dark:border-[#332E2A] hover:border-[#A3B899]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <h4 className="text-xs md:text-sm font-bold text-[#4A4A4A] dark:text-[#E6E1DA]">{s.title}</h4>
                    <p className="text-[11px] text-muted-foreground">{s.desc}</p>
                  </div>
                </div>

                <span className="text-xs font-bold text-[#A3B899] bg-[#A3B899]/15 dark:bg-[#A3B899]/25 px-3 py-1 rounded-full shrink-0">
                  {s.duration}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
