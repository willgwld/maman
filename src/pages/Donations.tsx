import React, { useState } from "react";
import { 
  Heart, 
  Gift, 
  Coffee, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  HeartHandshake, 
  Zap, 
  Check, 
  Users, 
  HelpCircle,
  QrCode
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

export default function Donations() {
  const [donationType, setDonationType] = useState<"once" | "monthly">("once");
  const [selectedAmount, setSelectedAmount] = useState<number | "custom">(5);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "apple">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const presets = [
    { 
      amount: 3, 
      label: "Café Solidaire", 
      icon: Coffee, 
      desc: "Finance 1 journée de serveurs et garde l'application rapide pour toutes." 
    },
    { 
      amount: 5, 
      label: "Tisane Bien-être", 
      icon: Heart, 
      desc: "Permet de maintenir l'assistant IA MamanZen sans aucune publicité.",
      popular: true
    },
    { 
      amount: 10, 
      label: "Coup de Pouce Zen", 
      icon: Sparkles, 
      desc: "Offre l'accès complet à 50 futures mamans en situation d'isolement." 
    },
    { 
      amount: 25, 
      label: "Maman Protectrice", 
      icon: Gift, 
      desc: "Finance l'enregistrement de nouvelles séances audio & méditations guidées." 
    },
  ];

  const getEffectiveAmount = () => {
    if (selectedAmount === "custom") {
      const parsed = parseFloat(customAmount);
      return isNaN(parsed) || parsed <= 0 ? 5 : parsed;
    }
    return selectedAmount;
  };

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowThankYou(true);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-5 sm:gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      
      {/* Header Banner */}
      <header className="text-center space-y-2 sm:space-y-3 pt-1 sm:pt-2 px-1">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#E9B6B6]/20 text-[#E9B6B6] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current shrink-0" />
          <span>Projet 100% Solidaire & Indépendant</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#4A4A4A]">
          Soutenir MamanZen <span className="text-[#E9B6B6]">💖</span>
        </h1>
        <p className="text-muted-foreground text-xs sm:text-base max-w-2xl mx-auto leading-relaxed px-1">
          Toutes nos fonctionnalités (IA, nutrition, suivi des symptômes, vidéos) sont <strong>100% gratuites</strong> pour qu'aucune maman ne soit freinée. Vos dons libres permettent de financer les serveurs et de préserver notre indépendance.
        </p>
      </header>

      {/* Impact Stats - Compact & Responsive on Mobile */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="rounded-2xl border-border/50 shadow-2xs bg-gradient-to-br from-[#FAFAF9] to-white">
          <CardContent className="p-2.5 sm:p-5 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#A3B899]/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#A3B899] shrink-0">
              <Check className="w-4 h-4 sm:w-6 sm:h-6 stroke-[3]" />
            </div>
            <div>
              <p className="text-sm sm:text-2xl font-bold text-[#4A4A4A] leading-tight">100% Gratuit</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Aucun abonnement forcé</p>
              <p className="text-[9px] text-muted-foreground sm:hidden">Sans engagement</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-2xs bg-gradient-to-br from-[#FAFAF9] to-white">
          <CardContent className="p-2.5 sm:p-5 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#E9B6B6]/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-[#E9B6B6] shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-sm sm:text-2xl font-bold text-[#4A4A4A] leading-tight">0% Pub</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Données 100% protégées</p>
              <p className="text-[9px] text-muted-foreground sm:hidden">100% Privé</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/50 shadow-2xs bg-gradient-to-br from-[#FAFAF9] to-white">
          <CardContent className="p-2.5 sm:p-5 flex flex-col sm:flex-row items-center text-center sm:text-left gap-1.5 sm:gap-4">
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#F4F1ED] rounded-xl sm:rounded-2xl flex items-center justify-center text-[#4A4A4A] shrink-0">
              <Users className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-sm sm:text-2xl font-bold text-[#4A4A4A] leading-tight">12.5k+</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">Mamans accompagnées</p>
              <p className="text-[9px] text-muted-foreground sm:hidden">Mamans aidées</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Donation Card Form */}
      <Card className="rounded-[2.5rem] border-border/50 shadow-lg bg-white overflow-hidden">
        <CardContent className="p-6 sm:p-10 space-y-8">
          
          {/* Donation Mode Toggle */}
          <div className="flex bg-[#FAFAF9] p-1.5 rounded-2xl border border-border/50 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => setDonationType("once")}
              className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                donationType === "once"
                  ? "bg-white text-[#4A4A4A] shadow-sm"
                  : "text-muted-foreground hover:text-[#4A4A4A]"
              }`}
            >
              Don Ponctuel
            </button>
            <button
              type="button"
              onClick={() => setDonationType("monthly")}
              className={`flex-1 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                donationType === "monthly"
                  ? "bg-white text-[#4A4A4A] shadow-sm"
                  : "text-muted-foreground hover:text-[#4A4A4A]"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-[#E9B6B6]" />
              Soutien Mensuel
            </button>
          </div>

          {/* Preset Cards */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] ml-1">
              Choisissez le montant de votre soutien :
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presets.map((p) => {
                const IconComponent = p.icon;
                const isSelected = selectedAmount === p.amount;
                return (
                  <div
                    key={p.amount}
                    onClick={() => {
                      setSelectedAmount(p.amount);
                      setCustomAmount("");
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#E9B6B6]/15 border-[#E9B6B6] shadow-sm ring-1 ring-[#E9B6B6]"
                        : "bg-[#FAFAF9] border-border/60 hover:bg-white hover:border-border"
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute top-3 right-3 bg-[#E9B6B6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Coup de cœur
                      </span>
                    )}
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? "bg-[#E9B6B6] text-white" : "bg-white text-[#E9B6B6] shadow-xs"}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-base text-[#4A4A4A]">{p.amount} € {donationType === "monthly" && "/ mois"}</p>
                        <p className="text-xs font-semibold text-muted-foreground">{p.label}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">
                      {p.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Custom Amount */}
            <div 
              onClick={() => setSelectedAmount("custom")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
                selectedAmount === "custom"
                  ? "bg-[#E9B6B6]/15 border-[#E9B6B6] ring-1 ring-[#E9B6B6]"
                  : "bg-[#FAFAF9] border-border/60 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#A3B899] shadow-xs">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#4A4A4A]">Montant Personnalisé</p>
                  <p className="text-xs text-muted-foreground">Donnez exactement ce que vous souhaitez</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  min="1"
                  placeholder="ex: 15"
                  value={customAmount}
                  onChange={(e) => {
                    setSelectedAmount("custom");
                    setCustomAmount(e.target.value);
                  }}
                  className="w-full sm:w-28 bg-white border border-border/80 rounded-xl h-10 px-3 text-sm font-bold outline-none focus:ring-2 focus:ring-[#E9B6B6]"
                />
                <span className="font-bold text-sm text-[#4A4A4A]">€</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#4A4A4A] ml-1">
              Moyen de paiement :
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === "card"
                    ? "bg-[#4A4A4A] text-white border-[#4A4A4A] shadow-sm"
                    : "bg-[#FAFAF9] border-border text-[#4A4A4A] hover:bg-gray-100"
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Carte Bancaire
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === "paypal"
                    ? "bg-[#4A4A4A] text-white border-[#4A4A4A] shadow-sm"
                    : "bg-[#FAFAF9] border-border text-[#4A4A4A] hover:bg-gray-100"
                }`}
              >
                PayPal
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("apple")}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  paymentMethod === "apple"
                    ? "bg-[#4A4A4A] text-white border-[#4A4A4A] shadow-sm"
                    : "bg-[#FAFAF9] border-border text-[#4A4A4A] hover:bg-gray-100"
                }`}
              >
                Apple Pay / Google
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleDonate}
              disabled={isProcessing}
              className="w-full bg-[#E9B6B6] hover:bg-[#D9A5A5] text-white rounded-2xl h-14 text-base font-bold shadow-md hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Traitement en cours...</span>
              ) : (
                <>
                  <Heart className="w-5 h-5 fill-current" />
                  <span>
                    Faire un don de {getEffectiveAmount()} € {donationType === "monthly" && "/ mois"}
                  </span>
                </>
              )}
            </Button>

            <p className="text-center text-[11px] text-muted-foreground">
              Paiement 100% sécurisé et chiffré. Vous pouvez annuler votre soutien mensuel à tout moment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Thank You Modal */}
      <AnimatePresence>
        {showThankYou && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl text-center space-y-5 border border-[#E9B6B6]/30"
            >
              <div className="w-20 h-20 bg-[#E9B6B6]/20 rounded-full flex items-center justify-center mx-auto text-[#E9B6B6]">
                <Heart className="w-10 h-10 fill-current animate-bounce" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#4A4A4A]">Un IMMENSE Merci ! ❤️</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Votre don de <strong>{getEffectiveAmount()} €</strong> contribue directement à maintenir MamanZen 100% gratuit, sans pub, et accessible à toutes les mamans.
                </p>
              </div>

              <div className="bg-[#FAFAF9] p-4 rounded-2xl border border-border text-xs text-[#4A4A4A] space-y-1 text-left">
                <p className="font-bold flex items-center gap-1 text-[#A3B899]">
                  <CheckCircle2 className="w-4 h-4" /> Transaction confirmée
                </p>
                <p className="text-muted-foreground">Un reçu de don à votre nom est en cours de génération.</p>
              </div>

              <Button
                onClick={() => setShowThankYou(false)}
                className="w-full bg-[#4A4A4A] hover:bg-[#333] text-white rounded-2xl h-12 text-sm font-semibold"
              >
                Continuer sur MamanZen
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Transparency & Goals Section */}
      <Card className="rounded-[2.5rem] border-border/50 shadow-sm bg-[#FAFAF9]">
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#A3B899]/20 rounded-xl flex items-center justify-center text-[#A3B899]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#4A4A4A]">Transparence & Objectifs MamanZen</h3>
              <p className="text-xs text-muted-foreground">À quoi servent exactement vos contributions ?</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-border/60 space-y-1">
              <p className="font-bold text-[#4A4A4A]">1. Serveurs & Infrastructure Cloud</p>
              <p className="text-muted-foreground">Hébergement sécurisé des profils, de la base de données de santé et réponses rapides de l'IA.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-border/60 space-y-1">
              <p className="font-bold text-[#4A4A4A]">2. Création de Contenus Spécialisés</p>
              <p className="text-muted-foreground">Rétribution de sages-femmes, doulas et diététiciennes pour relire et valider les conseils.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-border/60 space-y-1">
              <p className="font-bold text-[#4A4A4A]">3. Gratuité Garantie pour Toutes</p>
              <p className="text-muted-foreground">Pas de version au rabais ni d'option bloquée derrière un mur payant. Tout est accessible.</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-border/60 space-y-1">
              <p className="font-bold text-[#4A4A4A]">4. Zéro Publicité Intrusive</p>
              <p className="text-muted-foreground">Nous refusons les bannières de pubs et les partenariats marchands agressifs.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ on Donations */}
      <Card className="rounded-[2.5rem] border-border/50 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#E9B6B6]" />
            Questions fréquentes sur les dons
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-[#4A4A4A]">
          <div className="space-y-1 border-b border-border/50 pb-3">
            <p className="font-bold text-[#4A4A4A]">Puis-je utiliser l'application sans donner ?</p>
            <p className="text-xs text-muted-foreground">Oui, absolument ! Toutes les fonctionnalités (IA, nutrition, vidéos, checklists) sont 100% gratuites et sans restriction. Donner est une démarche facultative pour soutenir notre travail.</p>
          </div>

          <div className="space-y-1 border-b border-border/50 pb-3">
            <p className="font-bold text-[#4A4A4A]">Puis-je annuler un don mensuel ?</p>
            <p className="text-xs text-muted-foreground">Oui, à tout moment d'un simple clic depuis vos paramètres ou par e-mail, sans aucune condition ni justification.</p>
          </div>

          <div className="space-y-1">
            <p className="font-bold text-[#4A4A4A]">Mes informations bancaires sont-elles en sécurité ?</p>
            <p className="text-xs text-muted-foreground">Absolument. Les transactions sont traitées par Stripe / PayPal avec un niveau de sécurité bancaire certifié PCI-DSS Level 1.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
