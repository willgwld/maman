import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { ShieldCheck, FileText, AlertTriangle, ArrowLeft, Lock, Heart, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LegalPages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "disclaimer";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["disclaimer", "cgu", "privacy"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="flex flex-col gap-8 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      {/* Navigation Header */}
      <header className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Link to="/settings" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux paramètres
          </Link>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#E9B6B6] fill-[#E9B6B6]/30" />
            <span className="font-bold text-sm">MamanZen Légal & Santé</span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Centre Légal, RGPD & Santé</h1>
          <p className="text-muted-foreground">
            Transparence, sécurité de vos données de santé et informations médicales réglementaires.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-secondary/50 rounded-2xl w-fit">
          <button
            onClick={() => handleTabChange("disclaimer")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "disclaimer"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Avertissement Médical
          </button>
          <button
            onClick={() => handleTabChange("privacy")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "privacy"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Lock className="w-4 h-4 text-[#A3B899]" />
            Confidentialité & RGPD
          </button>
          <button
            onClick={() => handleTabChange("cgu")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === "cgu"
                ? "bg-white shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FileText className="w-4 h-4 text-[#E9B6B6]" />
            Mentions Légales & CGU/CGV
          </button>
        </div>
      </header>

      {/* TAB 1: AVERTISSEMENT MÉDICAL */}
      {activeTab === "disclaimer" && (
        <Card className="rounded-[2rem] border-border/50 shadow-sm overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900">
              <AlertTriangle className="w-8 h-8 text-amber-600 shrink-0" />
              <div>
                <h2 className="font-bold text-lg">Avertissement important de non-responsabilité médicale</h2>
                <p className="text-xs text-amber-800">
                  Document obligatoire visant à clarifier le périmètre d'action de l'application MamanZen.
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">1. MamanZen n'est pas un dispositif médical</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                L’application MamanZen est un outil d’accompagnement au bien-être, à l’organisation et à la gestion du stress durant la grossesse.
                <strong> Elle ne constitue en aucun cas un dispositif médical, un service de télémédecine, ni un outil de diagnostic.</strong>
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">2. Non-substitution au suivi médical par un professionnel</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Aucune information, conseil, recommandation générée par l'Intelligence Artificielle ou contenu présent dans l'application MamanZen ne peut remplacer l’avis, le suivi, le diagnostic ou le traitement prescrit par votre <strong>médecin traitant, gynécologue-obstétricien ou sage-femme</strong>.
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                <li>Ne suspendez ou ne modifiez jamais un traitement médical sans l'accord préalable de votre professionnel de santé.</li>
                <li>Ne retardez jamais une consultation médicale en vous basant sur les informations fournies par MamanZen.</li>
                <li>Effectuez scrupuleusement vos consultations prénatales et échographies obligatoires auprès de votre équipe soignante.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">3. Signes d'urgence médicale</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Si vous présentez l'un des symptômes suivants, n'utilisez pas l'application pour chercher une réponse : contactez immédiatement le <strong>15 (SAMU)</strong>, le <strong>112</strong> ou rendez-vous aux urgences de votre maternité :
              </p>
              <div className="grid sm:grid-cols-2 gap-2 pt-2">
                <div className="bg-red-50/60 border border-red-200/60 p-3 rounded-xl text-xs text-red-900 font-medium">
                  • Saignements vaginaux abondants ou douleurs abdominales intenses
                </div>
                <div className="bg-red-50/60 border border-red-200/60 p-3 rounded-xl text-xs text-red-900 font-medium">
                  • Diminution significative ou absence de mouvements du bébé
                </div>
                <div className="bg-red-50/60 border border-red-200/60 p-3 rounded-xl text-xs text-red-900 font-medium">
                  • Perte de liquide amniotique (fissure ou rupture de la poche des eaux)
                </div>
                <div className="bg-red-50/60 border border-red-200/60 p-3 rounded-xl text-xs text-red-900 font-medium">
                  • Maux de tête violents, troubles visuels ou œdèmes brusques (signes de pré-éclampsie)
                </div>
              </div>
            </section>

            <section className="space-y-3 pt-2">
              <h3 className="text-lg font-bold text-foreground">4. Responsabilité concernant l'Assistant IA</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Les réponses générées par notre assistant virtuel (MamanZen IA) reposent sur des modèles d'intelligence artificielle entraînés sur des recommandations de bien-être prénatal. Bien que nous veillions à la qualité de ces algorithmes, des erreurs ou imprécisions sont possibles. L'utilisatrice reste seule maîtresse de l’utilisation qu’elle fait de ces suggestions.
              </p>
            </section>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: PRIVACY & RGPD */}
      {activeTab === "privacy" && (
        <Card className="rounded-[2rem] border-border/50 shadow-sm overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3 p-4 bg-[#A3B899]/20 rounded-2xl border border-[#A3B899]/30 text-foreground">
              <ShieldCheck className="w-8 h-8 text-[#A3B899] shrink-0" />
              <div>
                <h2 className="font-bold text-lg">Politique de Confidentialité & Protection des Données (RGPD)</h2>
                <p className="text-xs text-muted-foreground">
                  Conformité au Règlement Général sur la Protection des Données (UE 2016/679) et protection renforcée des données de santé.
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">1. Engagement pour la protection des données de santé</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Consciente de la sensibilité extrême des données relatives à la grossesse, la santé et au bien-être prénatal, MamanZen applique le principe de <strong>minimisation des données</strong> et de <strong>chiffrement de bout en bout</strong>.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">2. Données collectées</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nous collectons uniquement les données indispensables au bon fonctionnement de l'application :
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                <li><strong>Données d'identité :</strong> Prénom ou pseudo, adresse email.</li>
                <li><strong>Données relatives à la grossesse :</strong> Date prévue d'accouchement (DPA), semaine d'aménorrhée (SA).</li>
                <li><strong>Données de suivi de santé (Optionnel) :</strong> Journal des symptômes (nausées, fatigue, sommeil, humeur), notes personnelles, suivi du poids, conditions médicales renseignées de votre plein gré.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">3. Sécurité et Hébergement</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vos données sont stockées de façon sécurisée via notre infrastructure basée sur <strong>Supabase (PostgreSQL)</strong> avec gestion des politiques de sécurité au niveau des lignes (RLS - Row Level Security).
              </p>
              <div className="p-4 bg-secondary/30 rounded-2xl space-y-2 text-xs text-foreground">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#A3B899]" />
                  Chiffrement SSL/TLS pour tous les transferts de données.
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#A3B899]" />
                  Isolation stricte des données : vous seule avez accès à vos journaux de symptômes.
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#A3B899]" />
                  Aucune revente de données de santé à des régies publicitaires ou tiers commerciaux.
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">4. Vos Droits RGPD</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Conformément à la réglementation européenne, vous disposez des droits suivants sur vos données personnelles :
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                <li><strong>Droit d'accès et de rectification :</strong> Vous pouvez consulter et corriger vos informations depuis vos paramètres.</li>
                <li><strong>Droit à l'effacement (Droit à l'oubli) :</strong> Vous pouvez demander la suppression définitive de votre compte et de l'historique de vos symptômes à tout moment.</li>
                <li><strong>Droit à la portabilité :</strong> Vous pouvez exporter vos données sous un format structuré.</li>
              </ul>
              <p className="text-xs text-muted-foreground pt-2">
                Pour exercer vos droits ou pour toute question concernant vos données : <code>privacy@mamanzen.app</code>
              </p>
            </section>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: CGU / CGV / MENTIONS LÉGALES */}
      {activeTab === "cgu" && (
        <Card className="rounded-[2rem] border-border/50 shadow-sm overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3 p-4 bg-[#E9B6B6]/20 rounded-2xl border border-[#E9B6B6]/30 text-foreground">
              <FileText className="w-8 h-8 text-[#E9B6B6] shrink-0" />
              <div>
                <h2 className="font-bold text-lg">Mentions Légales & Conditions Générales (CGU / CGV)</h2>
                <p className="text-xs text-muted-foreground">
                  Informations éditeur, conditions d'utilisation du service et modalités d'abonnement.
                </p>
              </div>
            </div>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">1. Éditeur de l'application</h3>
              <div className="text-sm text-muted-foreground space-y-1 bg-secondary/20 p-4 rounded-xl">
                <p><strong>Nom de l'application :</strong> MamanZen SAS</p>
                <p><strong>Siège social :</strong> Paris, France</p>
                <p><strong>Directeur de publication :</strong> Équipe MamanZen</p>
                <p><strong>Contact :</strong> <code>contact@mamanzen.app</code></p>
                <p><strong>Hébergeur :</strong> Infrastructure Cloud Sécurisée (Europe)</p>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">2. Conditions Générales d'Utilisation (CGU)</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                L'accès et l'utilisation de l'application MamanZen impliquent l'acceptation sans réserve des présentes CGU. L'application est destinée à un usage strictement personnel. Il est interdit d'extraire, reproduire ou redistribuer les contenus informatifs et modules d'IA à des fins commerciales sans autorisation écrite.
              </p>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">3. Conditions Générales de Vente (CGV) - Abonnement "Sérénité"</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                MamanZen propose une offre gratuite ("Essentiel") et un abonnement premium ("Sérénité").
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                <li><strong>Tarif :</strong> 4,99 € TTC / mois (sans engagement).</li>
                <li><strong>Modalités de paiement :</strong> Règlement sécurisé par carte bancaire.</li>
                <li><strong>Droit de rétractation :</strong> Conformément à la législation, l'utilisateur dispose d'un délai de 14 jours pour rétracter son achat.</li>
                <li><strong>Résiliation :</strong> Résiliation possible d'un simple clic depuis les Paramètres du compte. L'accès reste actif jusqu'à la fin de la période mensuelle en cours.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">4. Propriété intellectuelle</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                La marque MamanZen, la charte graphique, les visuels, illustrations et contenus rédactionnels sont protégés par le droit d'auteur et la propriété intellectuelle.
              </p>
            </section>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
