import React, { useState, useEffect } from "react";
import { 
  Heart, 
  Smile, 
  Frown, 
  Meh, 
  Sparkles, 
  Zap, 
  Moon, 
  Plus, 
  Minus,
  Check, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Trash2, 
  Save,
  Clock,
  ChevronRight,
  Droplet,
  Droplets,
  Award,
  RotateCcw,
  Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchSymptomLogs, saveSymptomLog, deleteSymptomLog } from "@/lib/apiClient";

interface LogEntry {
  id: string;
  date: string;
  timestamp: number;
  mood: "sad" | "okay" | "peaceful" | "happy" | "radiant";
  energy: "low" | "medium" | "high";
  sleep: "poor" | "fair" | "good" | "excellent";
  symptoms: string[];
  hydration?: number;
  note: string;
}

const MOODS = [
  { key: "sad", emoji: "😔", label: "Épuisée", color: "border-rose-300 bg-rose-50 text-rose-700" },
  { key: "okay", emoji: "😕", label: "Moyenne", color: "border-amber-300 bg-amber-50 text-amber-700" },
  { key: "peaceful", emoji: "😌", label: "Paisible", color: "border-blue-300 bg-blue-50 text-blue-700" },
  { key: "happy", emoji: "😊", label: "Contente", color: "border-emerald-300 bg-emerald-50 text-emerald-700" },
  { key: "radiant", emoji: "✨", label: "Radieuse", color: "border-purple-300 bg-purple-50 text-purple-700" },
];

const ENERGIES = [
  { key: "low", label: "🪫 Faible", desc: "Besoin de repos" },
  { key: "medium", label: "⚡️ Modérée", desc: "Forme moyenne" },
  { key: "high", label: "🌟 Pleine d'énergie", desc: "Au top !" },
];

const SLEEPS = [
  { key: "poor", label: "😴 Agité / Mauvais" },
  { key: "fair", label: "🛌 Moyen" },
  { key: "good", label: "🌙 Bon" },
  { key: "excellent", label: "✨ Excellent" },
];

const SYMPTOMS_LIST = [
  "Nausées",
  "Fatigue intense",
  "Maux de dos / bassin",
  "Anxiété / Stress",
  "Tiraillements bas-ventre",
  "Jambes lourdes",
  "Remontées acides",
  "Insomnie",
  "Maux de tête",
  "Sauts d'humeur"
];

export default function Tracker() {
  const [activeTab, setActiveTab] = useState<"log" | "history" | "trends">("log");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form state
  const [mood, setMood] = useState<LogEntry["mood"]>("peaceful");
  const [energy, setEnergy] = useState<LogEntry["energy"]>("medium");
  const [sleep, setSleep] = useState<LogEntry["sleep"]>("good");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [waterGlasses, setWaterGlasses] = useState<number>(0);
  const [hydrationGoal, setHydrationGoal] = useState<number>(8); // 8 verres = 2.0 Litres
  const [note, setNote] = useState("");

  useEffect(() => {
    const loadLogs = async () => {
      const fetched = await fetchSymptomLogs();
      setLogs(fetched as any);

      const todayStr = new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long"
      });
      const todayLog = (fetched as any[]).find((l) => l.date === todayStr);
      if (todayLog && typeof todayLog.hydration === 'number') {
        setWaterGlasses(todayLog.hydration);
      }
    };
    loadLogs();
  }, []);

  const updateHydration = (count: number) => {
    const clamped = Math.max(0, Math.min(count, 16));
    setWaterGlasses(clamped);
  };

  const toggleSymptom = (s: string) => {
    if (selectedSymptoms.includes(s)) {
      setSelectedSymptoms(selectedSymptoms.filter((item) => item !== s));
    } else {
      setSelectedSymptoms([...selectedSymptoms, s]);
    }
  };

  const handleSave = async () => {
    const todayStr = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long"
    });

    const newEntryData = {
      date: todayStr,
      timestamp: Date.now(),
      mood,
      energy,
      sleep,
      symptoms: selectedSymptoms,
      hydration: waterGlasses,
      note: note.trim(),
    };

    const updatedLogs = await saveSymptomLog(newEntryData);
    setLogs(updatedLogs as any);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const deleteLog = async (id: string) => {
    await deleteSymptomLog(id);
    setLogs(logs.filter(l => l.id !== id));
  };

  // Trends calculation (7 and 30 days)
  const last7Days = logs.slice(0, 7);
  const last30Days = logs.slice(0, 30);

  const getTopSymptoms = (list: LogEntry[]) => {
    const counts: Record<string, number> = {};
    list.forEach((entry) => {
      entry.symptoms.forEach((s) => {
        counts[s] = (counts[s] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  };

  const top7Symptoms = getTopSymptoms(last7Days);

  // Hydration trends
  const logsWithHydration = last7Days.filter((l) => typeof l.hydration === "number");
  const avgHydration7Days = logsWithHydration.length > 0
    ? (logsWithHydration.reduce((acc, l) => acc + (l.hydration || 0), 0) / logsWithHydration.length).toFixed(1)
    : null;

  const litersLogged = (waterGlasses * 0.25).toFixed(2);
  const litersGoal = (hydrationGoal * 0.25).toFixed(1);
  const progressPercent = Math.min(Math.round((waterGlasses / hydrationGoal) * 100), 100);
  const isGoalReached = waterGlasses >= hydrationGoal;

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold text-[#4A4A4A]">Suivi Quotidien</h1>
          <p className="text-xs text-muted-foreground">Prends 30 secondes pour faire le point sur ta journée.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#FAFAF9] p-1 rounded-2xl border border-[#EAE5DF] text-xs font-bold">
          <button
            onClick={() => setActiveTab("log")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "log" ? "bg-white text-[#4A4A4A] shadow-2xs" : "text-muted-foreground hover:text-[#4A4A4A]"
            }`}
          >
            Saisir
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "history" ? "bg-white text-[#4A4A4A] shadow-2xs" : "text-muted-foreground hover:text-[#4A4A4A]"
            }`}
          >
            Historique ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab("trends")}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === "trends" ? "bg-white text-[#4A4A4A] shadow-2xs" : "text-muted-foreground hover:text-[#4A4A4A]"
            }`}
          >
            Tendances
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-[#A3B899]/20 border border-[#A3B899] text-[#6B8E5E] px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>Ton suivi d'aujourd'hui est bien enregistré ! Douce journée 🌸</span>
        </div>
      )}

      {/* TAB 1: FORMULAIRE DE SAISIE */}
      {activeTab === "log" && (
        <div className="space-y-6">
          {/* 1. HUMEUR */}
          <Card className="border border-[#EAE5DF] shadow-xs bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-5 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] block">
                1. Ton humeur aujourd'hui
              </label>

              <div className="grid grid-cols-5 gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setMood(m.key as any)}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${
                      mood === m.key
                        ? `${m.color} ring-2 ring-offset-1 font-bold shadow-xs scale-102`
                        : "border-[#EAE5DF] bg-[#FAFAF9] text-muted-foreground hover:bg-white"
                    }`}
                  >
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-[10px] font-medium leading-none">{m.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 2. ÉNERGIE & SOMMEIL */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Niveau d'énergie */}
            <Card className="border border-[#EAE5DF] shadow-xs bg-white rounded-3xl">
              <CardContent className="p-5 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] block">
                  2. Ton niveau d'énergie
                </label>
                <div className="space-y-2">
                  {ENERGIES.map((e) => (
                    <button
                      key={e.key}
                      type="button"
                      onClick={() => setEnergy(e.key as any)}
                      className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between text-xs transition-all ${
                        energy === e.key
                          ? "border-[#A3B899] bg-[#A3B899]/15 text-[#4A4A4A] font-bold"
                          : "border-[#EAE5DF] bg-[#FAFAF9] text-muted-foreground hover:bg-white"
                      }`}
                    >
                      <span>{e.label}</span>
                      <span className="text-[10px] text-muted-foreground">{e.desc}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Qualité du sommeil */}
            <Card className="border border-[#EAE5DF] shadow-xs bg-white rounded-3xl">
              <CardContent className="p-5 space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] block">
                  3. Ton sommeil de la nuit
                </label>
                <div className="space-y-2">
                  {SLEEPS.map((s) => (
                    <button
                      key={s.key}
                      type="button"
                      onClick={() => setSleep(s.key as any)}
                      className={`w-full p-2.5 rounded-2xl border text-left text-xs transition-all ${
                        sleep === s.key
                          ? "border-[#E9B6B6] bg-[#E9B6B6]/15 text-[#4A4A4A] font-bold"
                          : "border-[#EAE5DF] bg-[#FAFAF9] text-muted-foreground hover:bg-white"
                      }`}
                    >
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3. SUIVI D'HYDRATATION */}
          <Card className="border border-sky-100 shadow-xs bg-gradient-to-br from-sky-50/70 via-white to-blue-50/40 rounded-3xl overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-sky-500 fill-sky-500" />
                    <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A]">
                      3. Ton hydratation du jour
                    </label>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {waterGlasses} / {hydrationGoal} verres d'eau ({litersLogged}L / {litersGoal}L)
                  </p>
                </div>

                {/* Switch goal */}
                <div className="flex items-center gap-1.5 bg-white/80 p-1 rounded-xl border border-sky-100 text-[10px] font-medium text-slate-600">
                  <span className="text-muted-foreground px-1 hidden sm:inline">Objectif:</span>
                  {[6, 8, 10].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setHydrationGoal(goal)}
                      className={`px-2 py-0.5 rounded-lg transition-all ${
                        hydrationGoal === goal
                          ? "bg-sky-500 text-white font-bold shadow-2xs"
                          : "hover:bg-sky-50 text-slate-600"
                      }`}
                    >
                      {goal * 0.25}L
                    </button>
                  ))}
                </div>
              </div>

              {/* Goal Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-sky-800 flex items-center gap-1">
                    {isGoalReached ? "🎉 Objectif atteint !" : `${progressPercent}% de ton objectif`}
                  </span>
                  <span className="text-[11px] font-semibold text-sky-600">
                    {waterGlasses * 250} ml / {hydrationGoal * 250} ml
                  </span>
                </div>
                <div className="w-full h-3.5 bg-sky-100/80 rounded-full overflow-hidden p-0.5 border border-sky-200/60 relative">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Glass matrix buttons */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-1">
                {Array.from({ length: hydrationGoal }).map((_, idx) => {
                  const glassNum = idx + 1;
                  const isFilled = waterGlasses >= glassNum;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => updateHydration(waterGlasses === glassNum ? glassNum - 1 : glassNum)}
                      className={`h-12 rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition-all duration-200 ${
                        isFilled
                          ? "bg-gradient-to-b from-sky-400 to-sky-500 text-white border-sky-600 shadow-2xs scale-102"
                          : "bg-white/80 border-sky-100 text-sky-300 hover:border-sky-300 hover:bg-sky-50/50"
                      }`}
                      title={`Verre ${glassNum} (${glassNum * 250}ml)`}
                    >
                      <Droplet className={`w-4 h-4 ${isFilled ? "fill-white text-white" : "text-sky-300"}`} />
                      <span className="text-[9px] font-bold">{glassNum * 250}ml</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick action buttons (+1 glass / -1 glass) */}
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateHydration(waterGlasses - 1)}
                  disabled={waterGlasses <= 0}
                  className="rounded-xl border-sky-200 text-sky-700 hover:bg-sky-50 h-9 px-3 text-xs"
                >
                  <Minus className="w-3.5 h-3.5 mr-1" />
                  -1 verre
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={() => updateHydration(waterGlasses + 1)}
                  className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-bold h-9 text-xs shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  +1 verre d'eau (+250ml)
                </Button>

                {waterGlasses > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => updateHydration(0)}
                    className="rounded-xl text-slate-400 hover:text-slate-600 h-9 px-2"
                    title="Réinitialiser"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>

              {/* Goal Reached Celebration Banner */}
              {isGoalReached && (
                <div className="bg-sky-100/90 border border-sky-200 text-sky-900 p-3 rounded-2xl text-xs font-medium flex items-center gap-2 animate-in fade-in duration-300">
                  <Award className="w-5 h-5 text-sky-600 shrink-0" />
                  <div>
                    <p className="font-bold">Bravo ! Ton objectif d'hydratation est atteint 🌸</p>
                    <p className="text-[11px] text-sky-700 mt-0.5">
                      S'hydrater régulièrement prévient la fatigue, les crampes et favorise le bien-être.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4. SYMPTÔMES PRINCIPAUX */}
          <Card className="border border-[#EAE5DF] shadow-xs bg-white rounded-3xl">
            <CardContent className="p-5 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] block">
                4. Symptômes ou ressentis (multi-sélection)
              </label>

              <div className="flex flex-wrap gap-2">
                {SYMPTOMS_LIST.map((sym) => {
                  const isSelected = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        isSelected
                          ? "bg-[#E9B6B6] text-white border-[#E9B6B6] font-bold shadow-2xs"
                          : "bg-[#FAFAF9] border-[#EAE5DF] text-[#4A4A4A] hover:bg-white"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {sym}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 4. NOTE LIBRE OPTIONNELLE */}
          <Card className="border border-[#EAE5DF] shadow-xs bg-white rounded-3xl">
            <CardContent className="p-5 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] block">
                5. Mot doux ou note du jour (optionnel)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex: Une belle promenade au soleil, bébé a beaucoup bougé ce soir..."
                rows={3}
                className="w-full p-3 bg-[#FAFAF9] border border-[#EAE5DF] rounded-2xl text-xs text-[#4A4A4A] focus:ring-2 focus:ring-[#A3B899] outline-none"
              />
            </CardContent>
          </Card>

          {/* BOUTON ENREGISTRER */}
          <Button
            onClick={handleSave}
            className="w-full bg-[#A3B899] hover:bg-[#8F9F85] text-white rounded-2xl h-14 text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>Enregistrer mon suivi du jour</span>
          </Button>
        </div>
      )}

      {/* TAB 2: HISTORIQUE */}
      {activeTab === "history" && (
        <div className="space-y-4">
          {logs.length === 0 ? (
            <Card className="border border-[#EAE5DF] p-8 text-center bg-white rounded-3xl">
              <p className="text-sm text-muted-foreground">Aucun suivi enregistré pour le moment.</p>
              <Button
                onClick={() => setActiveTab("log")}
                className="mt-4 bg-[#A3B899] text-white rounded-xl text-xs font-bold"
              >
                Faire mon premier suivi
              </Button>
            </Card>
          ) : (
            logs.map((log) => {
              const mInfo = MOODS.find((m) => m.key === log.mood);
              return (
                <Card key={log.id} className="border border-[#EAE5DF] shadow-2xs bg-white rounded-2xl overflow-hidden">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between border-b border-[#EAE5DF] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{mInfo?.emoji || "😌"}</span>
                        <div>
                          <p className="text-xs font-bold text-[#4A4A4A] capitalize">{log.date}</p>
                          <p className="text-[10px] text-muted-foreground">Humeur: {mInfo?.label}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteLog(log.id)}
                        className="text-muted-foreground hover:text-rose-500 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {typeof log.hydration === "number" && log.hydration > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-xl w-fit my-1">
                        <Droplet className="w-3.5 h-3.5 fill-sky-400 text-sky-500" />
                        <span className="font-bold">{log.hydration} verre{log.hydration > 1 ? "s" : ""} d'eau</span>
                        <span className="text-[11px] text-sky-600">({(log.hydration * 0.25).toFixed(2)}L)</span>
                      </div>
                    )}

                    {log.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {log.symptoms.map((s) => (
                          <span
                            key={s}
                            className="bg-[#E9B6B6]/20 text-[#4A4A4A] text-[10px] font-bold px-2 py-0.5 rounded-md"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {log.note && (
                      <p className="text-xs text-[#4A4A4A] italic bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EAE5DF]/60">
                        « {log.note} »
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: TENDANCES (7 et 30 JOURS) */}
      {activeTab === "trends" && (
        <div className="space-y-5">
          <Card className="border border-[#EAE5DF] shadow-xs bg-white rounded-3xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#4A4A4A] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#A3B899]" />
              Tes symptômes les plus fréquents (7 derniers jours)
            </h3>

            {top7Symptoms.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Pas assez de données pour afficher les tendances. Continue ton suivi quotidien !</p>
            ) : (
              <div className="space-y-2">
                {top7Symptoms.map(([sym, count]) => (
                  <div key={sym} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#4A4A4A]">
                      <span>{sym}</span>
                      <span className="text-[#A3B899]">{count} fois</span>
                    </div>
                    <div className="w-full h-2 bg-[#FAFAF9] rounded-full overflow-hidden p-0.5 border border-[#EAE5DF]">
                      <div
                        className="h-full bg-[#A3B899] rounded-full"
                        style={{ width: `${Math.min((count / 7) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Carte Tendance Hydratation */}
          <Card className="border border-sky-100 shadow-xs bg-gradient-to-br from-sky-50/60 via-white to-blue-50/30 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#4A4A4A] flex items-center gap-2">
                <Droplets className="w-4 h-4 text-sky-500" />
                Moyenne d'hydratation (7 derniers jours)
              </h3>
              {avgHydration7Days && (
                <span className="text-xs font-bold bg-sky-500 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                  {avgHydration7Days} verres/jour
                </span>
              )}
            </div>

            {avgHydration7Days ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tu consommes en moyenne <strong className="text-sky-800">{(parseFloat(avgHydration7Days) * 0.25).toFixed(2)} Litres</strong> d'eau par jour sur tes derniers enregistrements.
                </p>
                <div className="w-full h-2.5 bg-sky-100 rounded-full overflow-hidden p-0.5 border border-sky-200/50">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((parseFloat(avgHydration7Days) / 8) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                Enregistre ton hydratation lors de tes prochains suivis quotidiens pour calculer ta moyenne sur 7 jours !
              </p>
            )}
          </Card>

          <Card className="border border-[#EAE5DF] shadow-xs bg-[#FAF8F5] rounded-3xl p-5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A]">💡 Recommandation douce</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Consulte tes tendances avant ton prochain rendez-vous avec ta sage-femme ou ton médecin. Cela t'aidera à partager précisément tes ressentis des dernières semaines.
            </p>
          </Card>
        </div>
      )}

    </div>
  );
}
