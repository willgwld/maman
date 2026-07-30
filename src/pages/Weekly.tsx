import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Baby,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  User,
  Grid,
  Star,
  MessageSquareHeart,
  Brain,
  CheckCircle2,
  Bookmark,
  Calendar,
  X,
  CheckSquare,
  ShieldCheck,
  Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getWeeklyInfo, WEEKLY_DATA, WeeklyInfo } from "@/lib/pregnancy";
import { fetchFavoriteWeeks, toggleFavoriteWeek } from "@/lib/apiClient";

export default function Weekly() {
  // Calculated or stored user's week
  const [userCurrentWeek, setUserCurrentWeek] = useState<number>(20);
  const [currentWeek, setCurrentWeek] = useState<number>(20);
  const [showGridModal, setShowGridModal] = useState<boolean>(false);
  const [trimesterFilter, setTrimesterFilter] = useState<number>(0); // 0 = Tous, 1 = T1, 2 = T2, 3 = T3
  const [favorites, setFavorites] = useState<number[]>([]);
  const [recentSymptomLog, setRecentSymptomLog] = useState<string | null>(null);

  // Initialize from user profile and localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("mamanzen_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        let calculated = 20;
        if (parsed.due_date) {
          const due = new Date(parsed.due_date);
          const now = new Date();
          const diffMs = due.getTime() - now.getTime();
          const diffWeeks = Math.round(diffMs / (1000 * 60 * 60 * 24 * 7));
          calculated = Math.max(1, Math.min(40, 40 - diffWeeks));
        } else if (parsed.current_week) {
          calculated = Number(parsed.current_week);
        }
        setUserCurrentWeek(calculated);
        setCurrentWeek(calculated);
      }

      // Load favorites from Supabase
      fetchFavoriteWeeks().then(setFavorites);

      // Check tracker logs for personalized message
      const savedHistory = localStorage.getItem("mamanzen_tracker_history");
      if (savedHistory) {
        const history = JSON.parse(savedHistory);
        if (history.length > 0) {
          const latest = history[0];
          if (latest.symptoms && latest.symptoms.length > 0) {
            setRecentSymptomLog(latest.symptoms[0]);
          }
        }
      }
    } catch (e) {
      console.error("Error loading week data", e);
    }
  }, []);

  const weekly: WeeklyInfo = getWeeklyInfo(currentWeek);

  const prevWeek = () => setCurrentWeek((w) => Math.max(1, w - 1));
  const nextWeek = () => setCurrentWeek((w) => Math.min(40, w + 1));

  const toggleFavorite = async (weekNum: number) => {
    const updated = favorites.includes(weekNum)
      ? favorites.filter((f) => f !== weekNum)
      : [...favorites, weekNum];
    setFavorites(updated);
    await toggleFavoriteWeek(weekNum);
  };

  const isFavorite = favorites.includes(currentWeek);

  // Filtered list of weeks for modal grid
  const allWeeksArray = Array.from({ length: 40 }, (_, i) => i + 1);
  const filteredWeeks = allWeeksArray.filter((w) => {
    if (trimesterFilter === 0) return true;
    const info = getWeeklyInfo(w);
    return info.trimester === trimesterFilter;
  });

  return (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto pb-20 animate-in fade-in duration-300">
      
      {/* Top Bar Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-[#E9B6B6] text-[11px] font-bold tracking-wide">
            <Heart className="w-3 h-3 fill-current" />
            <span>Guide Semaine par Semaine</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#4A4A4A] mt-1">
            Ton Suivi de Grossesse
          </h1>
        </div>

        <button
          onClick={() => setShowGridModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#EAE5DF] hover:bg-gray-50 text-[#4A4A4A] text-xs font-bold shadow-2xs transition-all"
        >
          <Grid className="w-4 h-4 text-[#A3B899]" />
          <span className="hidden sm:inline">Toutes les semaines</span>
          <span className="sm:hidden">1-40</span>
        </button>
      </div>

      {/* Navigation Bar between Weeks */}
      <Card className="rounded-2xl border border-[#EAE5DF] bg-white p-2.5 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <Button
            onClick={prevWeek}
            disabled={currentWeek <= 1}
            variant="ghost"
            size="sm"
            className="rounded-xl hover:bg-[#FAFAF9] text-[#4A4A4A] disabled:opacity-20 px-2 sm:px-3 h-9"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-bold ml-1">S{currentWeek - 1}</span>
          </Button>

          <div className="text-center flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#A3B899]">
                {weekly.trimester === 1
                  ? "1er Trimestre"
                  : weekly.trimester === 2
                  ? "2ème Trimestre"
                  : "3ème Trimestre"}
              </span>
              {currentWeek === userCurrentWeek && (
                <span className="px-2 py-0.5 rounded-full bg-[#A3B899]/15 text-[#5B7550] text-[10px] font-bold">
                  Ta semaine actuelle
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-[#4A4A4A]">
              Semaine {currentWeek} <span className="text-xs font-normal text-gray-400">(SA)</span>
            </h2>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleFavorite(currentWeek)}
              title={isFavorite ? "Retirer des favoris" : "Mettre en favori"}
              className={`p-2 rounded-xl transition-colors ${
                isFavorite
                  ? "bg-amber-50 text-amber-500"
                  : "text-gray-400 hover:text-amber-500 hover:bg-amber-50/50"
              }`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? "fill-amber-400" : ""}`} />
            </button>

            <Button
              onClick={nextWeek}
              disabled={currentWeek >= 40}
              variant="ghost"
              size="sm"
              className="rounded-xl hover:bg-[#FAFAF9] text-[#4A4A4A] disabled:opacity-20 px-2 sm:px-3 h-9"
            >
              <span className="hidden sm:inline text-xs font-bold mr-1">S{currentWeek + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Title & Reassuring Subtitle */}
      <div className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-2xl p-4 sm:p-5 text-center space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-[#4A4A4A]">
          {weekly.title} : {weekly.subtitle}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
          Avance sereinement, ton corps accomplit un travail extraordinaire et naturel.
        </p>
      </div>

      {/* Personalized Symptom Reassurance Banner if User Logged Symptoms Recently */}
      {recentSymptomLog && (
        <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-[#E9B6B6]/40 text-xs text-[#555] flex items-start gap-3 animate-in slide-in-from-top-2">
          <div className="p-1.5 bg-white rounded-xl text-[#E9B6B6] shrink-0 mt-0.5 shadow-2xs">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div className="space-y-0.5">
            <p className="font-bold text-[#4A4A4A]">
              Rappel bienveillant pour toi
            </p>
            <p className="leading-relaxed text-[11px] sm:text-xs">
              Tu as mentionné ressentir « <span className="font-semibold text-rose-700">{recentSymptomLog}</span> » récemment dans ton suivi. C'est très fréquent à ce stade de la grossesse. Autorise-toi des pauses sans aucune culpabilité. 🌸
            </p>
          </div>
        </div>
      )}

      {/* 1. BLOC « POUR BÉBÉ » */}
      <Card className="rounded-3xl border border-[#EAE5DF] shadow-2xs overflow-hidden bg-white">
        <div className="p-4 sm:p-5 bg-gradient-to-br from-[#FAF8F5] via-white to-emerald-50/30 border-b border-[#EAE5DF]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-emerald-100/80 text-[#6B8E5E] rounded-2xl flex items-center justify-center shrink-0">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B8E5E]">
                  Évolution du Fœtus
                </span>
                <h3 className="text-base font-bold text-[#4A4A4A]">Pour Bébé</h3>
              </div>
            </div>

            {/* Size badges */}
            <div className="text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#EAE5DF] shadow-2xs text-xs font-extrabold text-[#4A4A4A]">
                <span className="text-lg">{weekly.babyIcon}</span>
                <span>{weekly.babyName}</span>
              </div>
            </div>
          </div>

          {/* Length & Weight Specs */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-[#EAE5DF]/60">
            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-100 text-center">
              <span className="text-[10px] font-semibold text-gray-500 uppercase block">Taille approx.</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#4A4A4A]">{weekly.babyLength}</span>
            </div>
            <div className="bg-white/80 p-2.5 rounded-xl border border-gray-100 text-center">
              <span className="text-[10px] font-semibold text-gray-500 uppercase block">Poids approx.</span>
              <span className="text-xs sm:text-sm font-extrabold text-[#4A4A4A]">{weekly.babyWeight}</span>
            </div>
          </div>
        </div>

        <CardContent className="p-4 sm:p-5 space-y-2">
          <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
            {weekly.babyDesc}
          </p>
        </CardContent>
      </Card>

      {/* 2. BLOC « POUR TOI » */}
      <Card className="rounded-3xl border border-[#EAE5DF] shadow-2xs overflow-hidden bg-white">
        <div className="p-4 sm:p-5 bg-gradient-to-br from-[#FAF8F5] via-white to-rose-50/30 border-b border-[#EAE5DF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-rose-100/80 text-[#E9B6B6] rounded-2xl flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#E9B6B6]">
                Changements Physiques & Émotionnels
              </span>
              <h3 className="text-base font-bold text-[#4A4A4A]">Pour Toi</h3>
            </div>
          </div>
        </div>

        <CardContent className="p-4 sm:p-5 space-y-2">
          <p className="text-xs sm:text-sm text-[#555] leading-relaxed">
            {weekly.momDesc}
          </p>
        </CardContent>
      </Card>

      {/* 3. BLOC « CONSEILS DE LA SEMAINE » */}
      <Card className="rounded-3xl border border-[#EAE5DF] shadow-2xs overflow-hidden bg-white">
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#EAE5DF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#A3B899]/20 text-[#5B7550] rounded-2xl flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5B7550]">
                Accompagnement Doux
              </span>
              <h3 className="text-base font-bold text-[#4A4A4A]">Conseils Pratiques de la Semaine</h3>
            </div>
          </div>
        </div>

        <CardContent className="p-4 sm:p-5">
          <ul className="space-y-3">
            {weekly.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-50 text-[#A3B899] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                </div>
                <span className="text-xs sm:text-sm text-[#4A4A4A] leading-relaxed font-medium">
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 4. BLOC « SYMPTÔMES FRÉQUENTS » */}
      <Card className="rounded-3xl border border-[#EAE5DF] shadow-2xs overflow-hidden bg-white">
        <div className="p-4 sm:p-5 bg-[#FAF8F5] border-b border-[#EAE5DF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-100/80 text-amber-700 rounded-2xl flex items-center justify-center shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Sans Alarmisme
              </span>
              <h3 className="text-base font-bold text-[#4A4A4A]">Symptômes Fréquents à cette Période</h3>
            </div>
          </div>
        </div>

        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap gap-2">
            {weekly.symptoms.map((symptom, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-[#FAFAF9] border border-[#EAE5DF] text-xs font-semibold text-[#555] flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E9B6B6]"></span>
                {symptom}
              </span>
            ))}
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-gray-100 text-xs text-muted-foreground flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#A3B899] shrink-0" />
            <p className="leading-relaxed">
              {weekly.symptomsNote}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 5. ACCÈS RAPIDE AUX RESSOURCES CONSEILLÉES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/mental"
          className="p-4 rounded-2xl bg-white border border-[#EAE5DF] hover:border-[#A3B899] shadow-2xs flex items-center gap-3 transition-all group"
        >
          <div className="p-3 bg-emerald-50 text-[#A3B899] rounded-xl group-hover:scale-105 transition-transform">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-xs sm:text-sm text-[#4A4A4A]">Méditations conseillées</p>
            <p className="text-[11px] text-muted-foreground">Relaxation guidée pour la semaine {currentWeek}</p>
          </div>
        </Link>

        <Link
          to="/chat"
          className="p-4 rounded-2xl bg-white border border-[#EAE5DF] hover:border-[#E9B6B6] shadow-2xs flex items-center gap-3 transition-all group"
        >
          <div className="p-3 bg-rose-50 text-[#E9B6B6] rounded-xl group-hover:scale-105 transition-transform">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-xs sm:text-sm text-[#4A4A4A]">Poser une question</p>
            <p className="text-[11px] text-muted-foreground">Sage-Femme IA bienveillante 24h/7d</p>
          </div>
        </Link>
      </div>

      {/* 6. MESSAGE D'ENCOURAGEMENT (MESSAGE DE FIN) */}
      <Card className="border-0 bg-gradient-to-r from-rose-50/70 via-[#FAF8F5] to-emerald-50/70 rounded-3xl p-5 text-center shadow-2xs space-y-2 border border-[#EAE5DF]">
        <div className="w-8 h-8 rounded-full bg-white shadow-2xs mx-auto flex items-center justify-center text-[#E9B6B6]">
          <Heart className="w-4 h-4 fill-current" />
        </div>
        <p className="text-xs sm:text-sm font-semibold text-[#4A4A4A] italic leading-relaxed max-w-lg mx-auto">
          « {weekly.endMessage} »
        </p>
        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
          MamanZen • Tu avances à ton rythme, et c'est parfait.
        </p>
      </Card>

      {/* MODAL/DRAWER OVERLAY: ALL WEEKS GRID SELECTOR (1 to 40) */}
      {showGridModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#EAE5DF]">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#EAE5DF] flex items-center justify-between bg-[#FAF8F5]">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#4A4A4A]">
                  Toutes les Semaines (1 à 40)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Explore les étapes passées ou anticipe la suite sereinement.
                </p>
              </div>
              <button
                onClick={() => setShowGridModal(false)}
                className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Trimester Tabs */}
            <div className="px-4 py-2 bg-white border-b border-[#EAE5DF] flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
              <button
                onClick={() => setTrimesterFilter(0)}
                className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                  trimesterFilter === 0
                    ? "bg-[#4A4A4A] text-white"
                    : "bg-[#FAFAF9] text-[#666] hover:bg-gray-100"
                }`}
              >
                Toutes (1-40)
              </button>
              <button
                onClick={() => setTrimesterFilter(1)}
                className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                  trimesterFilter === 1
                    ? "bg-rose-500 text-white"
                    : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                }`}
              >
                1er Trimestre (1-12)
              </button>
              <button
                onClick={() => setTrimesterFilter(2)}
                className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                  trimesterFilter === 2
                    ? "bg-[#A3B899] text-white"
                    : "bg-emerald-50 text-[#5B7550] hover:bg-emerald-100"
                }`}
              >
                2e Trimestre (13-27)
              </button>
              <button
                onClick={() => setTrimesterFilter(3)}
                className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                  trimesterFilter === 3
                    ? "bg-amber-500 text-white"
                    : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                }`}
              >
                3e Trimestre (28-40)
              </button>
            </div>

            {/* Weeks Grid */}
            <div className="p-4 sm:p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-[60vh]">
              {filteredWeeks.map((wNum) => {
                const info = getWeeklyInfo(wNum);
                const isSelected = wNum === currentWeek;
                const isUserWeek = wNum === userCurrentWeek;
                const isFav = favorites.includes(wNum);

                return (
                  <button
                    key={wNum}
                    onClick={() => {
                      setCurrentWeek(wNum);
                      setShowGridModal(false);
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all relative ${
                      isSelected
                        ? "border-[#A3B899] bg-[#A3B899]/10 ring-2 ring-[#A3B899]/30"
                        : "border-[#EAE5DF] bg-white hover:bg-[#FAFAF9]"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold text-[#4A4A4A]">
                        Semaine {wNum}
                      </span>
                      <div className="flex items-center gap-1">
                        {isFav && <Star className="w-3 h-3 text-amber-500 fill-amber-400" />}
                        <span className="text-base">{info.babyIcon}</span>
                      </div>
                    </div>

                    <p className="text-[11px] font-semibold text-[#A3B899] mt-1 truncate">
                      {info.babyName}
                    </p>

                    {isUserWeek && (
                      <span className="mt-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#A3B899] text-white self-start">
                        Actuelle
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF8F5] border-t border-[#EAE5DF] text-center">
              <Button
                onClick={() => setShowGridModal(false)}
                className="bg-[#A3B899] hover:bg-[#8EA684] text-white rounded-xl text-xs font-bold px-6 h-9"
              >
                Fermer
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
