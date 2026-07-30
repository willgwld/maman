import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, Heart, Shield, Moon, Sparkles, Check, X, Calendar, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requestOneSignalPermission } from "@/lib/onesignal";
import { useAuth } from "@/components/AuthProvider";

interface NotificationPermissionModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onPermissionGranted?: () => void;
}

export default function NotificationPermissionModal({
  isOpen: externalIsOpen,
  onClose,
  onPermissionGranted
}: NotificationPermissionModalProps) {
  const { user } = useAuth();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successState, setSuccessState] = useState(false);

  // Auto-check if modal should open after onboarding or on dashboard
  useEffect(() => {
    if (externalIsOpen !== undefined) {
      setInternalIsOpen(externalIsOpen);
      return;
    }

    const prompted = localStorage.getItem("mamanzen_notif_prompted");
    const onboardingJustFinished = localStorage.getItem("mamanzen_onboarding_just_completed");

    if (!prompted && (onboardingJustFinished === "true" || true)) {
      // Short delay for gentle UX
      const timer = setTimeout(() => {
        setInternalIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [externalIsOpen]);

  const handleClose = () => {
    localStorage.setItem("mamanzen_notif_prompted", "true");
    localStorage.removeItem("mamanzen_onboarding_just_completed");
    setInternalIsOpen(false);
    if (onClose) onClose();
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      const userId = user?.id || "usr_local";
      const result = await requestOneSignalPermission(userId);

      if (result.success) {
        setSuccessState(true);
        localStorage.setItem("mamanzen_notifications_enabled", "true");
        localStorage.setItem("mamanzen_notif_prompted", "true");
        localStorage.removeItem("mamanzen_onboarding_just_completed");

        if (onPermissionGranted) onPermissionGranted();

        setTimeout(() => {
          setInternalIsOpen(false);
          if (onClose) onClose();
        }, 2000);
      } else {
        // Closed or blocked by browser
        handleClose();
      }
    } catch (error) {
      console.error("[Notification Modal] Error requesting permission:", error);
      handleClose();
    } finally {
      setLoading(false);
    }
  };

  if (!internalIsOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#EAE5DF] overflow-hidden"
        >
          {/* Top Decorative Banner */}
          <div className="bg-gradient-to-r from-[#FAF8F5] via-[#E9B6B6]/15 to-[#A3B899]/15 p-6 pb-5 text-center relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-2xl shadow-sm text-[#E9B6B6] mb-3 border border-[#EAE5DF]/60">
              {successState ? (
                <Check className="w-7 h-7 text-[#A3B899] stroke-[3]" />
              ) : (
                <Bell className="w-7 h-7 fill-[#E9B6B6]/20 text-[#E9B6B6]" />
              )}
            </div>

            <h3 className="text-xl font-bold text-[#4A4A4A] tracking-tight">
              {successState ? "Notifications activées ! 🌸" : "Restons en contact avec douceur"}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
              {successState
                ? "Merci ! Tu recevras tes petites attentions bienveillantes aux moments choisis."
                : "Recevoir tes attentions MamanZen personnalisées au cours de ta grossesse."}
            </p>
          </div>

          {!successState ? (
            <div className="p-6 space-y-5">
              {/* Feature List */}
              <div className="space-y-3">
                <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DF]/80 flex items-start gap-3">
                  <div className="p-2 bg-[#A3B899]/20 text-[#A3B899] rounded-xl shrink-0 mt-0.5">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#4A4A4A]">Rappel de suivi quotidien</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Un petit mot bienveillant pour noter comment tu te sens en 20 secondes.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DF]/80 flex items-start gap-3">
                  <div className="p-2 bg-purple-100 text-purple-600 rounded-xl shrink-0 mt-0.5">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#4A4A4A]">Pause méditation du soir</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Une parenthèse apaisante de 5 minutes avant de te coucher.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DF]/80 flex items-start gap-3">
                  <div className="p-2 bg-[#E9B6B6]/20 text-[#E9B6B6] rounded-xl shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#4A4A4A]">Nouvelle semaine de grossesse</p>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      Découvre l'évolution de ton corps et le développement de bébé.
                    </p>
                  </div>
                </div>
              </div>

              {/* Guarantees Badge */}
              <div className="flex items-center justify-around py-2 px-3 bg-[#A3B899]/10 rounded-2xl text-[11px] font-medium text-[#4A4A4A]">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#A3B899]" />
                  <span>0% Spam</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#A3B899]/40" />
                <div className="flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-[#A3B899]" />
                  <span>Nuits paisibles (22h30-7h30)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <Button
                  onClick={handleAccept}
                  disabled={loading}
                  className="w-full bg-[#A3B899] hover:bg-[#8F9F85] text-white rounded-2xl h-12 text-sm font-bold shadow-md shadow-[#A3B899]/20 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-pulse">Activation en cours...</span>
                  ) : (
                    <>
                      <span>Activer les notifications douces</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full text-center py-2 text-xs font-semibold text-muted-foreground hover:text-[#4A4A4A] transition-colors"
                >
                  Pas maintenant, je choisirai plus tard
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-[#A3B899]/20 rounded-full flex items-center justify-center mx-auto text-[#A3B899]">
                <Heart className="w-6 h-6 fill-current animate-bounce" />
              </div>
              <p className="text-xs text-muted-foreground">
                Tu peux modifier tes préférences de notification à tout moment dans la rubrique <strong>Paramètres</strong>.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
