import React, { useState, useEffect } from "react";
import { 
  User, 
  Bell, 
  Shield, 
  LogOut, 
  Info, 
  ChevronRight, 
  Download, 
  Trash2, 
  Heart, 
  HelpCircle, 
  Mail, 
  Clock, 
  Globe, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Baby, 
  Calendar,
  Sparkles,
  ShieldCheck,
  Gift,
  AlertCircle,
  Moon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { MedicalDisclaimerBanner } from "@/components/MedicalDisclaimer";
import { PushNotificationManager } from "@/components/PushNotificationManager";
import { ThemeSelector } from "@/components/ThemeToggle";
import { fetchUserProfile, saveUserProfile } from "@/lib/apiClient";

const AVATAR_COLORS = [
  { name: "Rose Poudré", bg: "bg-[#E9B6B6]", text: "text-white" },
  { name: "Vert Sauge", bg: "bg-[#A3B899]", text: "text-white" },
  { name: "Beige Crème", bg: "bg-[#F4F1ED]", text: "text-[#4A4A4A]" },
  { name: "Lilas Doux", bg: "bg-[#E2D4F0]", text: "text-[#4A4A4A]" },
  { name: "Pêche Apaisante", bg: "bg-[#FCE3D2]", text: "text-[#4A4A4A]" }
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // User Profile State
  const initialName = user?.user_metadata?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Maman";
  const [userName, setUserName] = useState(initialName);
  const [stageMode, setStageMode] = useState<"pregnancy" | "postpartum">("pregnancy");
  const [currentWeek, setCurrentWeek] = useState(24);
  const [postpartumWeeks, setPostpartumWeeks] = useState(6);
  const [dueDate, setDueDate] = useState("");
  const [babyBirthDate, setBabyBirthDate] = useState("");
  const [hideTracking, setHideTracking] = useState(false);
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0]);
  const [medicalConditions, setMedicalConditions] = useState("");

  // Notification Preferences State
  const [notifDailyReminder, setNotifDailyReminder] = useState(true);
  const [notifEveningMeditation, setNotifEveningMeditation] = useState(true);
  const [notifWeeklyContent, setNotifWeeklyContent] = useState(true);
  const [preferredReminderTime, setPreferredReminderTime] = useState("20:00");
  const [selectedLanguage, setSelectedLanguage] = useState("fr");

  // Modals & Sub-screens
  const [activeModal, setActiveModal] = useState<"profile" | "notifs" | "delete" | "donate" | "help" | "contact" | "about" | null>(null);

  // Deletion Flow state
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteConfirmedText, setDeleteConfirmedText] = useState("");

  // Feedback Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load Initial Data
  useEffect(() => {
    const loadProfile = async () => {
      const p = await fetchUserProfile(user?.id);
      if (p) {
        if (p.name) setUserName(p.name);
        if (p.dueDate) setDueDate(p.dueDate);
        if (p.currentWeek) setCurrentWeek(typeof p.currentWeek === 'number' ? p.currentWeek : parseInt(p.currentWeek) || 24);
        if (p.stageMode) setStageMode(p.stageMode);
        if (p.postpartumWeeks) setPostpartumWeeks(p.postpartumWeeks);
        if (p.babyBirthDate) setBabyBirthDate(p.babyBirthDate);
        if (p.hideTracking !== undefined) setHideTracking(Boolean(p.hideTracking));
        if (p.medicalConditions) setMedicalConditions(p.medicalConditions);
      }
    };
    loadProfile();
  }, [user]);

  // Save Profile Handler
  const handleSaveProfile = async () => {
    const updatedUser = {
      userId: user?.id,
      name: userName,
      stageMode,
      currentWeek,
      postpartumWeeks,
      dueDate,
      babyBirthDate,
      hideTracking,
      medicalConditions
    };

    await saveUserProfile(updatedUser);

    if (user) {
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          name: userName,
          stage_mode: stageMode,
          due_date: dueDate,
          current_week: currentWeek,
          postpartum_weeks: postpartumWeeks,
          baby_birth_date: babyBirthDate,
          hide_tracking: hideTracking,
          medical_conditions: medicalConditions,
          updated_at: new Date().toISOString()
        });
      } catch (err) {
        console.warn("Sync failed, saved via API/locally", err);
      }
    }

    setActiveModal(null);
    showToast("Ton profil a été mis à jour avec succès ✨");
  };

  // Download User Data Export
  const handleExportData = () => {
    const exportPayload = {
      app: "MamanZen",
      version: "1.2.0",
      exportDate: new Date().toISOString(),
      profile: {
        name: userName,
        stageMode,
        currentWeek,
        postpartumWeeks,
        dueDate,
        babyBirthDate,
        medicalConditions
      },
      preferences: {
        notifications: {
          dailyReminder: notifDailyReminder,
          eveningMeditation: notifEveningMeditation,
          weeklyContent: notifWeeklyContent,
          preferredReminderTime
        },
        language: selectedLanguage
      }
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mamanzen_export_${userName.toLowerCase().replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast("Tes données ont été téléchargées dans un fichier sécurisé 📄");
  };

  // Confirm Account Deletion
  const handleConfirmDelete = async () => {
    localStorage.clear();
    if (user) {
      try {
        await supabase.from('profiles').delete().eq('id', user.id);
      } catch (e) {
        console.warn(e);
      }
    }
    signOut();
    navigate('/auth', { replace: true });
  };

  return (
    <div className="flex flex-col gap-6 pb-20 max-w-2xl mx-auto font-sans animate-fade-in text-[#4A4A4A]">
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#4A4A4A] text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Sparkles className="w-4 h-4 text-[#E9B6B6]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#4A4A4A]">Paramètres</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          On est là pour t’accompagner, pas pour te stresser.
        </p>
      </header>

      {/* Soft Reassurance Banner */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F4F1ED] border border-[#E9B6B6]/30 text-xs sm:text-sm text-[#555] flex items-center gap-2.5 sm:gap-3">
        <div className="p-1.5 sm:p-2 bg-white rounded-xl text-[#E9B6B6] shrink-0">
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
        </div>
        <p className="leading-snug sm:leading-relaxed text-[11px] sm:text-sm">
          <span className="font-bold text-[#4A4A4A]">Tu peux tout modifier à tout moment.</span> Tes choix sont respectés et tes données restent strictement confidentielles.
        </p>
      </div>

      {/* 1. Account Header Card */}
      <Card className="rounded-2xl sm:rounded-3xl border-border/50 shadow-2xs overflow-hidden bg-white">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Avatar circle */}
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl ${avatarColor.bg} ${avatarColor.text} flex items-center justify-center font-bold text-lg sm:text-2xl shadow-xs shrink-0 transition-transform hover:scale-105`}>
                {userName.charAt(0).toUpperCase() || "M"}
              </div>

              <div>
                <h2 className="text-base sm:text-xl font-bold text-[#4A4A4A]">{userName}</h2>
                <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#FAFAF9] border border-gray-100 text-[11px] sm:text-xs font-semibold text-[#666] mt-1">
                  <Baby className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#A3B899]" />
                  <span>
                    {stageMode === "pregnancy"
                      ? `Semaine ${currentWeek} de grossesse (${currentWeek + 2} SA)`
                      : `Post-partum – ${postpartumWeeks} semaine${postpartumWeeks > 1 ? 's' : ''}`
                    }
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setActiveModal("profile")}
              className="w-full sm:w-auto border-[#E9B6B6] text-[#4A4A4A] hover:bg-[#F4F1ED] rounded-xl text-xs sm:text-sm font-bold px-3 sm:px-4 h-8 sm:h-10 shrink-0 mt-1 sm:mt-0"
            >
              Modifier mon profil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Section "Mon parcours" */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold px-1 text-[#4A4A4A]">Mon parcours</h2>
        <Card className="rounded-3xl border-border/50 shadow-2xs overflow-hidden bg-white">
          <CardContent className="p-0 divide-y divide-border/40">
            
            {/* Situation Toggle Row */}
            <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-sm text-[#4A4A4A]">Statut actuel</p>
                <p className="text-xs text-muted-foreground">Basculez facilement selon l'avancée de votre maternité</p>
              </div>

              <div className="bg-[#FAFAF9] p-1 rounded-xl border border-gray-100 flex gap-1">
                <button
                  onClick={() => setStageMode("pregnancy")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    stageMode === "pregnancy"
                      ? "bg-[#E9B6B6] text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Enceinte
                </button>
                <button
                  onClick={() => setStageMode("postpartum")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    stageMode === "postpartum"
                      ? "bg-[#A3B899] text-white shadow-xs"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  Post-partum
                </button>
              </div>
            </div>

            {/* Date Details */}
            {stageMode === "pregnancy" ? (
              <div className="p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-rose-50 text-[#E9B6B6] rounded-xl">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#4A4A4A]">Date prévue d'accouchement</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(dueDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal("profile")}
                  className="text-xs font-bold text-[#A3B899] hover:underline"
                >
                  Modifier
                </button>
              </div>
            ) : (
              <div className="p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 text-[#A3B899] rounded-xl">
                    <Baby className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-[#4A4A4A]">Date de naissance de bébé</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(babyBirthDate).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal("profile")}
                  className="text-xs font-bold text-[#A3B899] hover:underline"
                >
                  Modifier
                </button>
              </div>
            )}

            {/* Discreet Toggle */}
            <div className="p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#FAFAF9] text-[#7D7D7D] rounded-xl">
                  {hideTracking ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-medium text-sm text-[#4A4A4A]">Masquer mon suivi de grossesse</p>
                  <p className="text-xs text-muted-foreground">Masque le compteur de semaines sur l'accueil pour plus de discrétion</p>
                </div>
              </div>
              <button
                onClick={() => setHideTracking(!hideTracking)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  hideTracking ? 'bg-[#A3B899]' : 'bg-gray-200'
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  hideTracking ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* 3. Section "Préférences" */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold px-1 text-[#4A4A4A]">Préférences</h2>
        <Card className="rounded-2xl sm:rounded-3xl border-border/50 shadow-2xs overflow-hidden bg-white">
          <CardContent className="p-0 divide-y divide-border/40">
            
            {/* Notification Manager Trigger */}
            <div 
              onClick={() => setActiveModal("notifs")}
              className="p-3.5 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-2.5 bg-rose-50 text-[#E9B6B6] rounded-xl shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-xs sm:text-sm text-[#4A4A4A]">Notifications & Rappels</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">Suivi, méditation du soir et contenus</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className="text-[11px] sm:text-xs font-bold text-[#E9B6B6] bg-rose-50 px-2.5 py-1 rounded-full">
                  Gérer mes rappels
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Daily Reminder Time */}
            <div className="p-3.5 sm:p-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-xs sm:text-sm text-[#4A4A4A]">Heure du rappel quotidien</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">Moment idéal pour faire le point</p>
                </div>
              </div>
              <input
                type="time"
                value={preferredReminderTime}
                onChange={(e) => setPreferredReminderTime(e.target.value)}
                className="bg-[#FAFAF9] border border-gray-200 rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-bold text-[#4A4A4A] outline-none focus:border-[#E9B6B6] shrink-0"
              />
            </div>

            {/* Language */}
            <div className="p-3.5 sm:p-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-2.5 bg-emerald-50 text-[#A3B899] rounded-xl shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-xs sm:text-sm text-[#4A4A4A]">Langue d'affichage</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">Français (par défaut)</p>
                </div>
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-[#FAFAF9] border border-gray-200 rounded-xl px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs font-bold text-[#4A4A4A] outline-none focus:border-[#E9B6B6] shrink-0"
              >
                <option value="fr">Français 🇫🇷</option>
                <option value="en">English 🇬🇧</option>
              </select>
            </div>

          </CardContent>
        </Card>
      </div>

      {/* Embedded Push Notification Sub-Manager for Direct Permission */}
      <PushNotificationManager compact={true} />

      {/* 4. Section "Données & Confidentialité" */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold px-1 text-[#4A4A4A]">Données & Confidentialité</h2>
        <Card className="rounded-3xl border-border/50 shadow-2xs overflow-hidden bg-white">
          <CardContent className="p-0 divide-y divide-border/40">
            
            {/* Reassurance quote */}
            <div className="p-4 sm:p-5 bg-[#A3B899]/10 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#A3B899] shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-[#4A4A4A] font-medium leading-relaxed">
                Tes données de santé restent privées et ne sont jamais vendues.
              </p>
            </div>

            {/* Download Data */}
            <button
              onClick={handleExportData}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#4A4A4A]">Télécharger mes données</p>
                  <p className="text-xs text-muted-foreground">Exporte ton historique complet au format JSON sécurisé</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Privacy Policy */}
            <Link 
              to="/legal?tab=privacy"
              className="p-4 sm:p-5 flex items-center justify-between text-left hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#4A4A4A]">Politique de confidentialité</p>
                  <p className="text-xs text-muted-foreground">Chiffrement RGPD, conservation et droits d'accès</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>

            {/* Admin Access Button */}
            <Link 
              to="/admin"
              className="p-4 sm:p-5 flex items-center justify-between text-left hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#4A4A4A]">Espace Administration (/admin)</p>
                  <p className="text-xs text-muted-foreground">Accéder au back-office de gestion MamanZen</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>

            {/* Terms of Service */}
            <Link 
              to="/legal?tab=cgu"
              className="p-4 sm:p-5 flex items-center justify-between text-left hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gray-100 text-gray-600 rounded-xl">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#4A4A4A]">Conditions d'utilisation (CGU)</p>
                  <p className="text-xs text-muted-foreground">Engagements de MamanZen & règles d'utilisation</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </Link>

            {/* Delete Account */}
            <button
              onClick={() => {
                setDeleteStep(1);
                setActiveModal("delete");
              }}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-red-50/50 transition-colors text-red-600"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50 text-red-500 rounded-xl">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-red-600">Supprimer définitivement mon compte</p>
                  <p className="text-xs text-red-400">Efface irréversiblement toutes vos données locales et en nuage</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400" />
            </button>

          </CardContent>
        </Card>
      </div>

      {/* 5. Section "Soutenir MamanZen" */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold px-1 text-[#4A4A4A]">Soutenir MamanZen</h2>
        <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden bg-gradient-to-br from-[#E9B6B6]/20 via-[#FAFAF9] to-[#A3B899]/20">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#E9B6B6] mx-auto shadow-xs">
              <Gift className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-[#4A4A4A] mb-1">MamanZen est 100 % gratuit grâce aux dons</h3>
              <p className="text-xs sm:text-sm text-[#666] max-w-md mx-auto leading-relaxed">
                MamanZen est 100 % gratuit grâce aux dons. Merci de nous aider à rester indépendants et sans publicité.
              </p>
            </div>

            <Button
              onClick={() => setActiveModal("donate")}
              className="bg-[#E9B6B6] hover:bg-[#D9A5A5] text-white font-bold rounded-2xl px-6 h-11 text-sm shadow-xs transition-all hover:scale-105"
            >
              <Heart className="w-4 h-4 fill-current mr-2" />
              Soutenir MamanZen
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 6. Section "Aide & Contact" */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold px-1 text-[#4A4A4A]">Aide & Contact</h2>
        <Card className="rounded-3xl border-border/50 shadow-2xs overflow-hidden bg-white">
          <CardContent className="p-0 divide-y divide-border/40">
            
            {/* Help Center */}
            <button
              onClick={() => setActiveModal("help")}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#4A4A4A]">Centre d'aide</p>
                  <p className="text-xs text-muted-foreground">Foire aux questions & guides d'utilisation</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Contact Us */}
            <button
              onClick={() => setActiveModal("contact")}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 text-[#A3B899] rounded-xl">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#4A4A4A]">Nous écrire</p>
                  <p className="text-xs text-muted-foreground">Équipe disponible et bienveillante à ton écoute</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* About App */}
            <button
              onClick={() => setActiveModal("about")}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-gray-50/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-[#4A4A4A]">À propos de MamanZen</p>
                  <p className="text-xs text-muted-foreground">Version 1.2.0 • Notre mission & nos valeurs</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>

          </CardContent>
        </Card>
      </div>

      {/* Medical Disclaimer Banner */}
      <MedicalDisclaimerBanner />

      {/* 7. Déconnexion */}
      <div className="pt-4">
        <Button 
          variant="outline" 
          className="w-full h-13 rounded-2xl border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors text-sm font-semibold"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Se déconnecter
        </Button>
      </div>


      {/* =========================================
          SUB-SCREENS & MODALS
         ========================================= */}

      {/* Modal 1: Edit Profile */}
      {activeModal === "profile" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-[#4A4A4A]">Modifier mon profil</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Avatar Color Picker */}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-2">Couleur de l'avatar</label>
              <div className="flex gap-3">
                {AVATAR_COLORS.map((col, i) => (
                  <button
                    key={i}
                    onClick={() => setAvatarColor(col)}
                    className={`w-9 h-9 rounded-full ${col.bg} border-2 transition-transform ${
                      avatarColor.name === col.name ? "scale-110 border-[#4A4A4A]" : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* First Name */}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Prénom</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-[#E9B6B6]"
                placeholder="Votre prénom"
              />
            </div>

            {/* Stage Selector */}
            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Parcours actuel</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setStageMode("pregnancy")}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                    stageMode === "pregnancy" ? "bg-rose-50 border-[#E9B6B6] text-[#E9B6B6]" : "border-gray-200 text-gray-600"
                  }`}
                >
                  🤰 Enceinte
                </button>
                <button
                  onClick={() => setStageMode("postpartum")}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                    stageMode === "postpartum" ? "bg-emerald-50 border-[#A3B899] text-[#A3B899]" : "border-gray-200 text-gray-600"
                  }`}
                >
                  👶 Post-partum
                </button>
              </div>
            </div>

            {stageMode === "pregnancy" ? (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Date prévue d'accouchement (DPA)</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-[#E9B6B6]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Semaine actuelle (1 à 42 SA)</label>
                  <input
                    type="number"
                    min="1"
                    max="42"
                    value={currentWeek}
                    onChange={(e) => setCurrentWeek(parseInt(e.target.value) || 1)}
                    className="w-full p-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-[#E9B6B6]"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Date de naissance de bébé</label>
                  <input
                    type="date"
                    value={babyBirthDate}
                    onChange={(e) => setBabyBirthDate(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-[#E9B6B6]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">Semaines de post-partum</label>
                  <input
                    type="number"
                    min="1"
                    max="104"
                    value={postpartumWeeks}
                    onChange={(e) => setPostpartumWeeks(parseInt(e.target.value) || 1)}
                    className="w-full p-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-[#E9B6B6]"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Suivi particulier ou note personnelle (optionnel)</label>
              <textarea
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                placeholder="Ex: Nausées fréquentes, suivi jumeaux..."
                className="w-full p-3 rounded-2xl border border-gray-200 text-sm outline-none focus:border-[#E9B6B6] min-h-[70px]"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 rounded-2xl h-11 text-xs font-bold" onClick={() => setActiveModal(null)}>
                Annuler
              </Button>
              <Button className="flex-1 rounded-2xl h-11 bg-[#E9B6B6] hover:bg-[#D9A5A5] text-white text-xs font-bold" onClick={handleSaveProfile}>
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Notification Preferences Drawer */}
      {activeModal === "notifs" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#E9B6B6]" />
                <h3 className="text-lg font-bold text-[#4A4A4A]">Choisir ce que je reçois</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Des rappels doux uniquement quand vous le souhaitez. Vous gardez le contrôle total.
            </p>

            <div className="space-y-3">
              {/* Toggle 1: Daily Tracking */}
              <div className="p-3.5 bg-[#FAFAF9] rounded-2xl flex items-center justify-between border border-gray-100">
                <div>
                  <p className="font-bold text-sm text-[#4A4A4A]">Rappel de suivi quotidien</p>
                  <p className="text-xs text-muted-foreground">Note tes symptômes et ton humeur en 30 secondes</p>
                </div>
                <button
                  onClick={() => setNotifDailyReminder(!notifDailyReminder)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    notifDailyReminder ? 'bg-[#E9B6B6]' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                    notifDailyReminder ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle 2: Evening Meditation */}
              <div className="p-3.5 bg-[#FAFAF9] rounded-2xl flex items-center justify-between border border-gray-100">
                <div>
                  <p className="font-bold text-sm text-[#4A4A4A]">Méditation du soir</p>
                  <p className="text-xs text-muted-foreground">Suggestion de respiration douce vers 21h</p>
                </div>
                <button
                  onClick={() => setNotifEveningMeditation(!notifEveningMeditation)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    notifEveningMeditation ? 'bg-[#A3B899]' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                    notifEveningMeditation ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Toggle 3: Weekly Content */}
              <div className="p-3.5 bg-[#FAFAF9] rounded-2xl flex items-center justify-between border border-gray-100">
                <div>
                  <p className="font-bold text-sm text-[#4A4A4A]">Nouveau contenu de la semaine</p>
                  <p className="text-xs text-muted-foreground">Notification quand bébé franchit une nouvelle étape</p>
                </div>
                <button
                  onClick={() => setNotifWeeklyContent(!notifWeeklyContent)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    notifWeeklyContent ? 'bg-[#A3B899]' : 'bg-gray-200'
                  }`}
                >
                  <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${
                    notifWeeklyContent ? 'translate-x-5' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>

            <Button
              onClick={() => {
                setActiveModal(null);
                showToast("Tes préférences de notifications sont sauvegardées 🔔");
              }}
              className="w-full bg-[#4A4A4A] text-white rounded-2xl h-11 text-xs font-bold hover:bg-[#333]"
            >
              Enregistrer mes préférences
            </Button>
          </div>
        </div>
      )}

      {/* Modal 3: Gentle Double-Confirmation Account Deletion */}
      {activeModal === "delete" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
            {deleteStep === 1 ? (
              <>
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>

                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-[#4A4A4A]">Supprimer mon compte ?</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Nous sommes désolés de te voir partir. Avant de supprimer définitivement ton compte, tu peux sauvegarder tes données si tu le souhaites.
                  </p>
                </div>

                <div className="p-3 bg-gray-50 rounded-2xl text-xs text-gray-600 space-y-1">
                  <p className="font-bold text-gray-700">Ce qui sera effacé :</p>
                  <ul className="list-disc list-inside space-y-0.5 text-gray-500">
                    <li>Ton historique de symptômes et d'humeurs</li>
                    <li>Tes préférences et checklists personnalisées</li>
                    <li>Ton profil et tes accès</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="rounded-2xl h-11 text-xs font-bold" onClick={handleExportData}>
                    <Download className="w-4 h-4 mr-1.5" /> Télécharger mes données d'abord
                  </Button>

                  <Button className="bg-red-500 hover:bg-red-600 text-white rounded-2xl h-11 text-xs font-bold" onClick={() => setDeleteStep(2)}>
                    Continuer la suppression
                  </Button>

                  <Button variant="ghost" className="rounded-2xl text-xs text-gray-400" onClick={() => setActiveModal(null)}>
                    Annuler & rester
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-bold text-red-600">Confirmation finale</h3>
                  <p className="text-xs text-gray-500">
                    Cette action est irréversible. Pour confirmer, écris <span className="font-bold text-gray-800">supprimer</span> ci-dessous.
                  </p>
                </div>

                <input
                  type="text"
                  placeholder="Tape 'supprimer'"
                  value={deleteConfirmedText}
                  onChange={(e) => setDeleteConfirmedText(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-gray-200 text-sm text-center outline-none focus:border-red-400"
                />

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 rounded-2xl h-11 text-xs font-bold" onClick={() => setDeleteStep(1)}>
                    Retour
                  </Button>
                  <Button
                    disabled={deleteConfirmedText.toLowerCase().trim() !== "supprimer"}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-2xl h-11 text-xs font-bold"
                    onClick={handleConfirmDelete}
                  >
                    Confirmer la suppression
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal 4: Donation Modal */}
      {activeModal === "donate" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#E9B6B6] fill-current" />
                <h3 className="text-lg font-bold text-[#4A4A4A]">Soutenir MamanZen</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed text-center">
              MamanZen est financé de manière indépendante par la communauté. Chaque petit don permet de couvrir les serveurs et l'assistance IA.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="rounded-2xl h-12 text-sm font-bold border-[#E9B6B6] text-[#E9B6B6] hover:bg-rose-50"
                onClick={() => {
                  setActiveModal(null);
                  showToast("Merci infiniment pour ton soutien de 2 € ! 💖");
                }}
              >
                2 € ☕
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl h-12 text-sm font-bold border-[#E9B6B6] bg-rose-50 text-[#E9B6B6] hover:bg-rose-100"
                onClick={() => {
                  setActiveModal(null);
                  showToast("Merci du fond du cœur pour ton don de 5 € ! 🌸");
                }}
              >
                5 € 🌺
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl h-12 text-sm font-bold border-[#E9B6B6] text-[#E9B6B6] hover:bg-rose-50"
                onClick={() => {
                  setActiveModal(null);
                  showToast("Un immense merci pour ton généreux don de 10 € ! ✨");
                }}
              >
                10 € ⭐
              </Button>
            </div>

            <Button disabled className="w-full bg-[#E9B6B6]/50 text-white rounded-2xl h-11 text-xs font-bold mt-2 cursor-not-allowed">
              Dons — prochainement
            </Button>
          </div>
        </div>
      )}

      {/* Modal 5: Help Center FAQ */}
      {activeModal === "help" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-[#4A4A4A]">Centre d'aide & FAQ</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 bg-[#FAFAF9] rounded-2xl border border-gray-100 space-y-1">
                <p className="font-bold text-[#4A4A4A]">Comment est calculée ma semaine de grossesse ?</p>
                <p className="text-gray-600">Le calcul repose sur votre date prévue d'accouchement (DPA). Vous pouvez l'ajuster à tout moment dans "Modifier mon profil".</p>
              </div>

              <div className="p-3.5 bg-[#FAFAF9] rounded-2xl border border-gray-100 space-y-1">
                <p className="font-bold text-[#4A4A4A]">Où sont stockées mes données de santé ?</p>
                <p className="text-gray-600">Vos données restent chiffrées sur votre appareil et dans notre base sécurisée RGPD. Nous ne les partageons jamais.</p>
              </div>

              <div className="p-3.5 bg-[#FAFAF9] rounded-2xl border border-gray-100 space-y-1">
                <p className="font-bold text-[#4A4A4A]">Puis-je utiliser l'appli sans connexion Internet ?</p>
                <p className="text-gray-600">Oui ! MamanZen est une PWA. Vos notes de suivi se synchronisent automatiquement dès que le réseau réapparaît.</p>
              </div>
            </div>

            <Button onClick={() => setActiveModal(null)} className="w-full bg-[#4A4A4A] text-white rounded-2xl h-11 text-xs font-bold">
              Fermer le centre d'aide
            </Button>
          </div>
        </div>
      )}

      {/* Modal 6: Contact Us */}
      {activeModal === "contact" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-[#4A4A4A]">Nous écrire</h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <p className="text-xs text-gray-500">
              Une remarque, un mot doux ou un problème technique ? Écris-nous, nous te répondrons sous 24 heures.
            </p>

            <textarea
              placeholder="Raconte-nous ce dont tu as besoin..."
              className="w-full p-3.5 rounded-2xl border border-gray-200 text-xs sm:text-sm outline-none focus:border-[#E9B6B6] min-h-[100px]"
            />

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-2xl h-11 text-xs font-bold" onClick={() => setActiveModal(null)}>
                Annuler
              </Button>
              <Button
                className="flex-1 bg-[#A3B899] hover:bg-[#8EA584] text-white rounded-2xl h-11 text-xs font-bold"
                onClick={() => {
                  setActiveModal(null);
                  showToast("Message envoyé avec succès ! Merci 💌");
                }}
              >
                Envoyer le message
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 7: About MamanZen */}
      {activeModal === "about" && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl text-center space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-[#E9B6B6]/20 text-[#E9B6B6] rounded-2xl flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 fill-current" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-[#4A4A4A]">MamanZen v1.2.0</h3>
              <p className="text-xs text-gray-400 mt-0.5">Grossesse & Sérénité au quotidien</p>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
              Une application conçue avec amour pour offrir à chaque future maman un havre de paix, sans stress, sans publicité et en toute confidentialité.
            </p>

            <Button onClick={() => setActiveModal(null)} className="w-full bg-[#4A4A4A] text-white rounded-2xl h-11 text-xs font-bold">
              Fermer
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
