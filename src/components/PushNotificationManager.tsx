import { useState } from "react";
import { Bell, BellOff, Clock, Sparkles, Send, ShieldAlert, Calendar, Droplets, Smile, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { PRESET_REMINDERS, PushNotificationPreferences } from "@/lib/pushNotifications";

export function PushNotificationManager({ compact = false }: { compact?: boolean }) {
  const {
    isSupported: supported,
    permission,
    preferences: settings,
    loading: isRequesting,
    requestPermission,
    unsubscribe,
    updatePreferences,
    sendTestNotification
  } = usePushNotifications();

  const [testSent, setTestSent] = useState<string | null>(null);

  const handleToggleMaster = async () => {
    if (permission !== "granted" || !settings.enabled) {
      await requestPermission();
    } else {
      await unsubscribe();
    }
  };

  const handleToggleTopic = (key: keyof PushNotificationPreferences) => {
    updatePreferences({ [key]: !settings[key] });
  };

  const handleSendTest = async (presetId: string) => {
    if (permission !== "granted") {
      const granted = await requestPermission();
      if (!granted) return;
    }
    const preset = PRESET_REMINDERS.find((p) => p.id === presetId) || PRESET_REMINDERS[0];
    const success = await sendTestNotification(preset.title, preset.body, preset.url);
    if (success) {
      setTestSent(presetId);
      setTimeout(() => setTestSent(null), 3000);
    }
  };

  if (!supported) {
    return (
      <Card className="rounded-[2rem] border-border/50 shadow-sm p-5 bg-amber-50/60 text-amber-900 text-xs">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
          <p>
            Les notifications Push Web ne sont pas prises en charge par ce navigateur ou dans cet environnement d'exécution.
          </p>
        </div>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className="rounded-[2rem] border-border/50 shadow-xs bg-gradient-to-r from-[#FAF8F5] to-white overflow-hidden">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${settings.enabled && permission === "granted" ? "bg-[#A3B899]/20 text-[#6B8E5E]" : "bg-[#E9B6B6]/20 text-[#E9B6B6]"}`}>
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-[#4A4A4A] flex items-center gap-1.5">
                Rappels & Notifications Push
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  permission === "granted" && settings.enabled
                    ? "bg-[#A3B899]/20 text-[#6B8E5E]"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {permission === "granted" && settings.enabled ? "Push Activé" : "Inactif"}
                </span>
              </h4>
              <p className="text-xs text-muted-foreground">
                Recevez vos astuces hebdomadaires et vos rappels de santé en direct.
              </p>
            </div>
          </div>

          <Button
            onClick={handleToggleMaster}
            disabled={isRequesting}
            className={`rounded-2xl text-xs font-bold px-4 h-9 whitespace-nowrap shrink-0 transition-all ${
              permission === "granted" && settings.enabled
                ? "bg-[#A3B899] hover:bg-[#8EA683] text-white"
                : "bg-[#E9B6B6] hover:bg-[#D9A6A6] text-white shadow-xs"
            }`}
          >
            {isRequesting ? "Demande en cours..." : permission === "granted" && settings.enabled ? "Gérer les Push" : "Activer les Notifications"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-[2rem] border-border/50 shadow-sm overflow-hidden bg-card">
      <CardContent className="p-6 space-y-6">
        {/* Header & Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${permission === "granted" && settings.enabled ? "bg-[#A3B899]/20 text-[#6B8E5E]" : "bg-[#E9B6B6]/20 text-[#E9B6B6]"}`}>
              {permission === "granted" && settings.enabled ? <Bell className="w-6 h-6" /> : <BellOff className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-[#4A4A4A] flex items-center gap-2">
                Notifications Push & Rappels Grossesse
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  permission === "granted" && settings.enabled
                    ? "bg-[#A3B899]/20 text-[#6B8E5E]"
                    : permission === "denied"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {permission === "granted" && settings.enabled
                    ? "Autorisées & Actives"
                    : permission === "denied"
                    ? "Bloquées par le navigateur"
                    : "À Configurer"}
                </span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Restez connectée à votre bébé avec des notifications adaptées à votre semaine SA.
              </p>
            </div>
          </div>

          <Button
            onClick={handleToggleMaster}
            disabled={isRequesting}
            className={`rounded-2xl text-xs font-bold px-5 h-11 transition-all ${
              permission === "granted" && settings.enabled
                ? "bg-[#4A4A4A] hover:bg-[#333333] text-white"
                : "bg-[#E9B6B6] hover:bg-[#D9A6A6] text-white shadow-md"
            }`}
          >
            {isRequesting
              ? "Demande en cours..."
              : permission === "granted" && settings.enabled
              ? "Désactiver les Push"
              : "Autoriser les Notifications Push"}
          </Button>
        </div>

        {permission === "denied" && (
          <div className="p-3.5 bg-red-50 text-red-800 rounded-2xl border border-red-200 text-xs flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 shrink-0 text-red-600" />
            <span>
              Les notifications ont été refusées dans les paramètres de votre navigateur. Pour les réactiver, cliquez sur le cadenas à côté de l'adresse de la page et autorisez les notifications.
            </span>
          </div>
        )}

        {/* Reminder Categories Settings */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Thématiques des Rappels Automatiques
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Weekly Tips */}
            <div className="p-3.5 rounded-2xl border border-border/60 bg-[#FAFAF9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#A3B899]/20 rounded-xl text-[#6B8E5E]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#4A4A4A]">Suivi Hebdomadaire (SA)</p>
                  <p className="text-[11px] text-muted-foreground">Astuces & taille du bébé chaque semaine</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleTopic("weeklyTips")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  settings.weeklyTips ? "bg-[#A3B899]" : "bg-gray-200"
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${settings.weeklyTips ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Hydration */}
            <div className="p-3.5 rounded-2xl border border-border/60 bg-[#FAFAF9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
                  <Droplets className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#4A4A4A]">Rappels Hydratation</p>
                  <p className="text-[11px] text-muted-foreground">Penser à boire de l'eau dans la journée</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleTopic("hydration")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  settings.hydration ? "bg-[#A3B899]" : "bg-gray-200"
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${settings.hydration ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Appointments */}
            <div className="p-3.5 rounded-2xl border border-border/60 bg-[#FAFAF9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#E9B6B6]/20 rounded-xl text-[#E9B6B6]">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#4A4A4A]">Rendez-vous Médicaux</p>
                  <p className="text-[11px] text-muted-foreground">Rappels pour vos consultations et échos</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleTopic("appointments")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  settings.appointments ? "bg-[#A3B899]" : "bg-gray-200"
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${settings.appointments ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Mood Journal */}
            <div className="p-3.5 rounded-2xl border border-border/60 bg-[#FAFAF9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                  <Smile className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#4A4A4A]">Journal de Symptômes</p>
                  <p className="text-[11px] text-muted-foreground">Rappel quotidien pour noter vos ressentis</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleTopic("moodJournal")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                  settings.moodJournal ? "bg-[#A3B899]" : "bg-gray-200"
                }`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition ${settings.moodJournal ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Time preference */}
        <div className="p-4 bg-[#FAFAF9] rounded-2xl border border-border/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-[#A3B899]" />
            <span className="font-bold text-[#4A4A4A]">Heure préférée de notification :</span>
          </div>
          <select
            value={settings.reminderTime}
            onChange={(e) => {
              updatePreferences({ reminderTime: e.target.value });
            }}
            className="p-2 rounded-xl bg-white border border-border font-bold text-[#4A4A4A] outline-none focus:border-[#A3B899]"
          >
            <option value="08:00">08:00 (Matin doux)</option>
            <option value="09:00">09:00 (Matinée)</option>
            <option value="12:00">12:00 (Pause déjeuner)</option>
            <option value="18:00">18:00 (Fin de journée)</option>
            <option value="20:00">20:00 (Soirée zen)</option>
          </select>
        </div>

        {/* Interactive Push Test Suite */}
        <div className="pt-2 border-t border-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#4A4A4A] flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-[#A3B899]" />
                Tester l'envoi d'une Notification Push en direct
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Cliquez sur un modèle ci-dessous pour déclencher une vraie notification sur votre appareil.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {PRESET_REMINDERS.map((preset) => (
              <div
                key={preset.id}
                className="p-3 bg-white rounded-2xl border border-border/60 hover:border-[#A3B899] transition-all flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#A3B899] bg-[#A3B899]/10 px-2 py-0.5 rounded-full">
                      {preset.category}
                    </span>
                    {testSent === preset.id && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Envoyée !
                      </span>
                    )}
                  </div>
                  <h5 className="font-bold text-xs text-[#4A4A4A] mt-1.5">{preset.title}</h5>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{preset.body}</p>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSendTest(preset.id)}
                  className="rounded-xl text-[11px] h-8 font-semibold text-[#4A4A4A] hover:bg-[#FAF8F5] gap-1.5 w-full mt-1"
                >
                  <Send className="w-3 h-3 text-[#E9B6B6]" />
                  Envoyer cette notification
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
