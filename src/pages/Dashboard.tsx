import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Heart, 
  Smile, 
  MessageSquareHeart, 
  CheckSquare, 
  Brain, 
  Baby, 
  Sparkles, 
  ArrowRight, 
  Calendar, 
  Sun,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getWeeklyInfo, getGreeting, QUOTES } from "@/lib/pregnancy";
import { fetchUserProfile } from "@/lib/apiClient";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{
    name: string;
    mode: "pregnancy" | "postpartum";
    dueDate: string;
    currentWeek: number;
  }>({
    name: "Maman",
    mode: "pregnancy",
    dueDate: "2026-10-15",
    currentWeek: 20
  });

  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Pick a daily quote based on date
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setQuote(QUOTES[dayOfYear % QUOTES.length]);

    const loadProfile = async () => {
      const p = await fetchUserProfile();
      if (p) {
        setUser({
          name: p.name || "Maman",
          mode: p.stageMode || "pregnancy",
          dueDate: p.dueDate || "2026-10-15",
          currentWeek: typeof p.currentWeek === 'number' ? p.currentWeek : parseInt(p.currentWeek as string) || 20
        });
      }
    };
    loadProfile();
  }, []);

  const greeting = getGreeting(user.name);
  const weekly = getWeeklyInfo(user.currentWeek);

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto pb-16 animate-in fade-in duration-300">
      
      {/* 1. Header & Greeting */}
      <div className="flex items-center justify-between pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{greeting.icon}</span>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4A4A4A] tracking-tight">
              {greeting.text}
            </h1>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground font-medium">
            Une pause douceur pour prendre soin de toi aujourd'hui.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 bg-[#A3B899]/15 text-[#6B8E5E] px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 border border-[#A3B899]/30">
          <Heart className="w-3.5 h-3.5 fill-[#6B8E5E]" />
          <span>100% Gratuit</span>
        </div>
      </div>

      {/* 2. Citation douce du jour */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-[#FAF8F5] via-[#FFF9F9] to-[#F5F8F4] dark:from-[#25221F] dark:via-[#221F1D] dark:to-[#201D1B] rounded-2xl border-l-4 border-l-[#E9B6B6]">
        <CardContent className="p-4 flex items-start gap-3">
          <span className="text-xl shrink-0 mt-0.5">🌸</span>
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold text-[#E9B6B6] uppercase tracking-wider">Pensée du jour</p>
            <p className="text-xs text-[#4A4A4A] dark:text-[#E6E1DA] italic font-medium leading-relaxed">
              « {quote} »
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. HERO BUTTON: Comment je me sens aujourd'hui ? */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-[#E9B6B6] via-[#D9A5A5] to-[#A3B899] text-white rounded-3xl overflow-hidden relative">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <CardContent className="p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suivi Quotidien (30 sec)</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Comment je me sens aujourd'hui ?
            </h2>
            <p className="text-xs text-white/90 font-medium max-w-sm">
              Note ton humeur, ton énergie et tes symptômes pour suivre ton bien-être au fil des jours.
            </p>
          </div>

          <Button
            onClick={() => navigate("/tracker")}
            className="w-full sm:w-auto bg-white dark:bg-[#201D1B] text-[#4A4A4A] dark:text-[#E6E1DA] hover:bg-white/95 rounded-2xl h-13 px-6 text-sm font-bold shadow-md transition-all hover:scale-102 flex items-center justify-center gap-2 shrink-0 border border-white/20"
          >
            <span>Faire mon suivi</span>
            <ArrowRight className="w-4 h-4 text-[#E9B6B6]" />
          </Button>
        </CardContent>
      </Card>

      {/* 4. Semaine actuelle & Évolution de Bébé */}
      <Card className="border border-[#EAE5DF] dark:border-[#332E2A] shadow-xs bg-white dark:bg-[#201D1B] rounded-3xl overflow-hidden">
        <CardContent className="p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#E9B6B6]/20 text-[#E9B6B6] rounded-2xl flex items-center justify-center text-xl">
                {weekly.babyIcon}
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#E9B6B6] uppercase tracking-wider">
                  {user.mode === "pregnancy" ? `Trimestre ${weekly.trimester}` : "Post-Partum"}
                </p>
                <h3 className="font-bold text-lg text-[#4A4A4A] dark:text-[#E6E1DA]">
                  {user.mode === "pregnancy" ? `Semaine ${weekly.week} de grossesse` : `Semaine ${weekly.week} avec bébé`}
                </h3>
              </div>
            </div>

            <Link
              to="/weekly"
              className="text-xs font-bold text-[#A3B899] hover:underline flex items-center gap-1"
            >
              <span>En savoir plus</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Barre de progression */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-[#4A4A4A] dark:text-[#E6E1DA]">
              <span>Taille : {weekly.babyName}</span>
              <span className="text-muted-foreground">{weekly.babyLength} • {weekly.babyWeight}</span>
            </div>
            <div className="w-full h-2.5 bg-[#FAFAF9] dark:bg-[#2A2623] border border-[#EAE5DF] dark:border-[#332E2A] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#E9B6B6] to-[#A3B899] rounded-full transition-all duration-500"
                style={{ width: `${Math.min((weekly.week / 40) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="p-3 bg-[#FAF8F5] dark:bg-[#2A2623] rounded-2xl text-xs text-[#4A4A4A] dark:text-[#E6E1DA] leading-relaxed">
            💡 <strong>Ce qui se passe :</strong> {weekly.babyDesc}
          </div>
        </CardContent>
      </Card>

      {/* 5. Accès rapide aux 4 autres sections V1 */}
      <div className="space-y-3 pt-1">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#4A4A4A] ml-1">
          Tes rubriques indispensables
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Section 1: Sage-Femme IA */}
          <Link
            to="/chat"
            className="p-4 bg-white border border-[#EAE5DF] hover:border-[#A3B899] rounded-2xl shadow-2xs hover:shadow-sm transition-all flex flex-col gap-2 group"
          >
            <div className="w-9 h-9 bg-[#A3B899]/20 text-[#6B8E5E] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#4A4A4A] group-hover:text-[#6B8E5E]">Sage-Femme IA</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Poser une question douce</p>
            </div>
          </Link>

          {/* Section 2: Checklists Charge Mentale */}
          <Link
            to="/checklists"
            className="p-4 bg-white border border-[#EAE5DF] hover:border-[#E9B6B6] rounded-2xl shadow-2xs hover:shadow-sm transition-all flex flex-col gap-2 group"
          >
            <div className="w-9 h-9 bg-[#E9B6B6]/20 text-[#E9B6B6] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#4A4A4A] group-hover:text-[#E9B6B6]">Checklists</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Valise & démarches</p>
            </div>
          </Link>

          {/* Section 3: Méditations & Respiration */}
          <Link
            to="/mental"
            className="p-4 bg-white border border-[#EAE5DF] hover:border-purple-300 rounded-2xl shadow-2xs hover:shadow-sm transition-all flex flex-col gap-2 group"
          >
            <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#4A4A4A] group-hover:text-purple-600">Espace Relax</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Respiration & méditations</p>
            </div>
          </Link>

          {/* Section 4: Évolution par semaine */}
          <Link
            to="/weekly"
            className="p-4 bg-white border border-[#EAE5DF] hover:border-blue-300 rounded-2xl shadow-2xs hover:shadow-sm transition-all flex flex-col gap-2 group"
          >
            <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Baby className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#4A4A4A] group-hover:text-blue-600">Guide Semaines</p>
              <p className="text-[11px] text-muted-foreground leading-tight">Semaine par semaine</p>
            </div>
          </Link>
        </div>
      </div>



    </div>
  );
}
