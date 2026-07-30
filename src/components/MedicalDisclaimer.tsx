import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function MedicalDisclaimerBanner({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="bg-[#F4F1ED] border border-border/60 rounded-xl p-3 text-xs text-muted-foreground flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-[#E9B6B6] shrink-0" />
        <span>
          <strong>Avertissement médical :</strong> MamanZen apporte un soutien au bien-être au quotidien et ne remplace pas un suivi médical par un médecin ou une sage-femme.{' '}
          <Link to="/legal?tab=disclaimer" className="underline font-medium hover:text-foreground">En savoir plus</Link>
        </span>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-sm text-amber-900 flex items-start gap-3 shadow-sm">
      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <h4 className="font-semibold text-amber-950">Avis important de non-responsabilité médicale</h4>
        <p className="text-amber-800 text-xs leading-relaxed">
          Les informations, suggestions et analyses fournies par MamanZen (y compris nos conseils IA) sont données à titre purement indicatif et d'accompagnement du bien-être. Elles ne constituent en aucun cas un avis médical, un diagnostic ou un traitement.
        </p>
        <div className="pt-1 flex items-center gap-3 text-xs">
          <span className="font-medium text-amber-900">En cas d'urgence ou de douleur, contactez immédiatement le 15 (SAMU) ou votre maternité.</span>
          <Link to="/legal?tab=disclaimer" className="underline text-amber-700 hover:text-amber-950 ml-auto whitespace-nowrap font-medium">
            Voir l'avertissement complet
          </Link>
        </div>
      </div>
    </div>
  );
}

export function HealthDataPrivacyBadge() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 px-3 py-1.5 rounded-full w-fit">
      <ShieldCheck className="w-4 h-4 text-[#A3B899]" />
      <span>Données de santé chiffrées & conformes RGPD</span>
    </div>
  );
}
