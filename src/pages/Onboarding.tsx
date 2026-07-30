import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  Baby, 
  Smile, 
  MessageSquareHeart, 
  CheckSquare, 
  Brain, 
  Calendar,
  Flower2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { saveUserProfile } from "@/lib/apiClient";

export default function Onboarding() {
  const navigate = useNavigate();
  const { setLocalUser } = useAuth();
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    mode: "pregnancy" as "pregnancy" | "postpartum",
    dueDate: "",
    currentWeek: "20",
  });

  const handleNext = () => {
    if (step === 1 && !formData.name.trim()) return;
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleFinish = async () => {
    const name = formData.name.trim();
    const dueDate = formData.dueDate;
    const currentWeek = parseInt(formData.currentWeek) || null;

    let userId: string;
    let email: string;

    const { data: { user: supaUser } } = await supabase.auth.getUser();
    if (supaUser?.id) {
      userId = supaUser.id;
      email = supaUser.email || "";

      await supabase.from('profiles').upsert({
        id: userId,
        name,
        email,
        current_week: currentWeek,
        due_date: dueDate || null,
        stage_mode: formData.mode,
        updated_at: new Date().toISOString(),
      });

      await supabase.auth.updateUser({
        data: { onboarding_completed: true, name }
      });
    } else {
      userId = "usr_" + Math.random().toString(36).substring(2, 9);
      email = "";
    }

    await saveUserProfile({
      userId,
      name,
      dueDate: dueDate || new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
      currentWeek: currentWeek || 20,
      stageMode: formData.mode
    });

    const userObj = {
      id: userId,
      email,
      user_metadata: {
        full_name: name,
        name,
        onboarding_completed: true,
        id: userId,
        email,
      }
    };

    setLocalUser(userObj);
    localStorage.setItem("mamanzen_onboarding_completed", "true");
    localStorage.setItem("mamanzen_onboarding_just_completed", "true");
    localStorage.setItem("mamanzen_user", JSON.stringify(userObj.user_metadata));
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center items-center p-4 py-8">
      <div className="w-full max-w-md mx-auto space-y-6">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#E9B6B6]/30 to-[#A3B899]/30 rounded-2xl shadow-sm text-[#E9B6B6] mb-1">
            <Heart className="w-7 h-7 fill-[#E9B6B6]" />
          </div>
          <h1 className="text-2xl font-bold text-[#4A4A4A] tracking-tight">MamanZen</h1>
          <p className="text-xs text-muted-foreground font-medium">Une sage-femme douce dans ta poche</p>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-8 bg-[#A3B899]"
                  : i < step
                  ? "w-2 bg-[#A3B899]/50"
                  : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step Cards */}
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-md rounded-3xl overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {/* STEP 1: Prénom & Mode */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 text-center">
                    <span className="inline-block p-2 bg-[#E9B6B6]/20 rounded-xl text-[#E9B6B6]">
                      <Flower2 className="w-5 h-5" />
                    </span>
                    <h2 className="text-xl font-bold text-[#4A4A4A]">Faisons connaissance</h2>
                    <p className="text-xs text-muted-foreground">
                      Comment souhaites-tu qu'on t'appelle ?
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] ml-1">
                        Ton Prénom
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Sarah, Marie, Léa..."
                        className="w-full bg-[#FAFAF9] border border-[#EAE5DF] rounded-2xl h-12 px-4 focus:ring-2 focus:ring-[#A3B899] outline-none text-base text-[#4A4A4A] font-medium"
                        autoFocus
                      />
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] ml-1">
                        Où en es-tu dans ton aventure ?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, mode: "pregnancy" })}
                          className={`p-4 rounded-2xl border text-left flex flex-col items-center text-center gap-2 transition-all ${
                            formData.mode === "pregnancy"
                              ? "border-[#E9B6B6] bg-[#E9B6B6]/10 text-[#4A4A4A] ring-2 ring-[#E9B6B6]/40 shadow-xs"
                              : "border-[#EAE5DF] bg-[#FAFAF9] text-muted-foreground hover:bg-white"
                          }`}
                        >
                          <span className="text-2xl">🤰</span>
                          <span className="text-xs font-bold">Je suis enceinte</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, mode: "postpartum" })}
                          className={`p-4 rounded-2xl border text-left flex flex-col items-center text-center gap-2 transition-all ${
                            formData.mode === "postpartum"
                              ? "border-[#A3B899] bg-[#A3B899]/10 text-[#4A4A4A] ring-2 ring-[#A3B899]/40 shadow-xs"
                              : "border-[#EAE5DF] bg-[#FAFAF9] text-muted-foreground hover:bg-white"
                          }`}
                        >
                          <span className="text-2xl">👶</span>
                          <span className="text-xs font-bold">Je suis en post-partum</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleNext}
                    disabled={!formData.name.trim()}
                    className="w-full bg-[#4A4A4A] hover:bg-[#333] text-white rounded-2xl h-12 text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <span>Continuer</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </motion.div>
              )}

              {/* STEP 2: Date ou Semaine */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="space-y-2 text-center">
                    <span className="inline-block p-2 bg-[#A3B899]/20 rounded-xl text-[#A3B899]">
                      <Calendar className="w-5 h-5" />
                    </span>
                    <h2 className="text-xl font-bold text-[#4A4A4A]">
                      {formData.mode === "pregnancy" ? "Ta date d'accouchement" : "L'arrivée de ton bébé"}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {formData.mode === "pregnancy"
                        ? "Pour personnaliser ton suivi semaine après semaine."
                        : "Indique la date de naissance pour adapter tes conseils post-partum."}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {formData.mode === "pregnancy" ? (
                      <>
                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] ml-1">
                            Date prévue d'accouchement (DPA)
                          </label>
                          <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="w-full bg-[#FAFAF9] border border-[#EAE5DF] rounded-2xl h-12 px-4 focus:ring-2 focus:ring-[#A3B899] outline-none text-sm text-[#4A4A4A]"
                          />
                        </div>

                        <div className="relative flex py-1 items-center">
                          <div className="flex-grow border-t border-[#EAE5DF]"></div>
                          <span className="flex-shrink mx-3 text-[11px] text-muted-foreground uppercase font-bold">ou</span>
                          <div className="flex-grow border-t border-[#EAE5DF]"></div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] ml-1">
                            Ou nombre de semaines de grossesse (SA)
                          </label>
                          <select
                            value={formData.currentWeek}
                            onChange={(e) => setFormData({ ...formData, currentWeek: e.target.value })}
                            className="w-full bg-[#FAFAF9] border border-[#EAE5DF] rounded-2xl h-12 px-4 focus:ring-2 focus:ring-[#A3B899] outline-none text-sm text-[#4A4A4A] font-medium"
                          >
                            {Array.from({ length: 40 }, (_, i) => i + 1).map((w) => (
                              <option key={w} value={w}>
                                Semaine {w} {w <= 12 ? "(1er trimestre)" : w <= 27 ? "(2ème trimestre)" : "(3ème trimestre)"}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] ml-1">
                          Date de naissance de bébé
                        </label>
                        <input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          className="w-full bg-[#FAFAF9] border border-[#EAE5DF] rounded-2xl h-12 px-4 focus:ring-2 focus:ring-[#A3B899] outline-none text-sm text-[#4A4A4A]"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="rounded-2xl h-12 px-5 border-[#EAE5DF]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-[#4A4A4A] hover:bg-[#333] text-white rounded-2xl h-12 text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>Suivant</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Présentation des 5 piliers */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div className="space-y-1 text-center">
                    <span className="inline-block p-2 bg-[#E9B6B6]/20 rounded-xl text-[#E9B6B6]">
                      <Sparkles className="w-5 h-5" />
                    </span>
                    <h2 className="text-xl font-bold text-[#4A4A4A]">Les 5 Piliers MamanZen</h2>
                    <p className="text-xs text-muted-foreground">
                      Pensé pour t'apporter douceur et soutien au quotidien.
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 bg-[#FAFAF9] rounded-2xl border border-[#EAE5DF] flex items-center gap-3">
                      <div className="p-2 bg-[#E9B6B6]/20 text-[#E9B6B6] rounded-xl shrink-0">
                        <Smile className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-[#4A4A4A]">1. Suivi quotidien en 30s</p>
                        <p className="text-muted-foreground text-[11px]">Enregistre ton humeur, ton énergie et tes symptômes en un geste.</p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAFAF9] rounded-2xl border border-[#EAE5DF] flex items-center gap-3">
                      <div className="p-2 bg-[#A3B899]/20 text-[#A3B899] rounded-xl shrink-0">
                        <MessageSquareHeart className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-[#4A4A4A]">2. Sage-Femme IA bienveillante</p>
                        <p className="text-muted-foreground text-[11px]">Questions illimitées, conseils doux et rassurants 24h/24.</p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAFAF9] rounded-2xl border border-[#EAE5DF] flex items-center gap-3">
                      <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0">
                        <CheckSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-[#4A4A4A]">3. Checklists Charge Mentale</p>
                        <p className="text-muted-foreground text-[11px]">Valise de maternité, RDV et démarches sans stress.</p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAFAF9] rounded-2xl border border-[#EAE5DF] flex items-center gap-3">
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-xl shrink-0">
                        <Brain className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-[#4A4A4A]">4. Méditations & Respiration</p>
                        <p className="text-muted-foreground text-[11px]">Pauses apaisantes de 3 à 10 minutes adaptées aux mamans.</p>
                      </div>
                    </div>

                    <div className="p-3 bg-[#FAFAF9] rounded-2xl border border-[#EAE5DF] flex items-center gap-3">
                      <div className="p-2 bg-blue-100 text-blue-600 rounded-xl shrink-0">
                        <Baby className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-[#4A4A4A]">5. Évolution Semaine par Semaine</p>
                        <p className="text-muted-foreground text-[11px]">Découvre les étapes clés de ton corps et du développement de bébé.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="rounded-2xl h-12 px-5 border-[#EAE5DF]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="flex-1 bg-[#4A4A4A] hover:bg-[#333] text-white rounded-2xl h-12 text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>Suivant</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Prête à commencer */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-tr from-[#A3B899] to-[#E9B6B6] rounded-3xl flex items-center justify-center mx-auto text-white shadow-md">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-[#4A4A4A]">
                      Tout est prêt, {formData.name || "chère maman"} !
                    </h2>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                      Ton espace cocon MamanZen t'attend. Prends une grande inspiration, nous sommes là pour t'accompagner pas à pas.
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DF] text-xs text-[#4A4A4A] font-medium italic">
                    « Prends soin de toi, une journée à la fois. Tu fais déjà un travail formidable. »
                  </div>

                  <Button
                    onClick={handleFinish}
                    className="w-full bg-[#A3B899] hover:bg-[#8F9F85] text-white rounded-2xl h-14 text-base font-bold shadow-lg shadow-[#A3B899]/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Entrer dans MamanZen</span>
                    <Sparkles className="w-5 h-5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Disclaimer Note */}
        <p className="text-[11px] text-center text-muted-foreground px-4">
          🌸 MamanZen est une application de bien-être et de soutien. Elle ne remplace jamais l'avis d'un professionnel de santé.
        </p>

      </div>
    </div>
  );
}
