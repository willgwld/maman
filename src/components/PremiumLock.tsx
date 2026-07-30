import { Heart, Sparkles, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/lib/premium-context";
import { Link } from "react-router-dom";

export function PremiumLock({ featureName }: { featureName: string }) {
  const { activatePremium } = usePremium();

  return (
    <Card className="rounded-[2.5rem] border-border/50 shadow-md overflow-hidden bg-gradient-to-br from-[#E9B6B6]/15 via-white to-[#A3B899]/10 p-2">
      <CardContent className="p-8 flex flex-col items-center justify-center text-center min-h-[320px]">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-border/60 relative">
          <Sparkles className="w-8 h-8 text-[#E9B6B6]" />
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#A3B899] rounded-full flex items-center justify-center border-2 border-white">
            <Heart className="w-3 h-3 text-white fill-current" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-[#4A4A4A] mb-3">{featureName} — MamanZen Plus</h2>
        
        <p className="text-muted-foreground text-sm mb-6 max-w-md leading-relaxed">
          Toutes les fonctionnalités fondamentales de santé et de suivi sont <strong>100% gratuites</strong>. 
          L'accès MamanZen Plus offre l'assistance IA personnalisée illimitée, les plans nutritionnels approfondis et la synchronisation partenaire.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          <Button 
            onClick={activatePremium}
            className="flex-1 bg-[#4A4A4A] text-white hover:bg-[#333] rounded-2xl py-6 text-sm font-bold shadow-xs gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#A3B899]" />
            Activer MamanZen Plus
          </Button>

          <Link to="/dons" className="flex-1">
            <Button 
              variant="outline"
              className="w-full border-[#E9B6B6] text-[#4A4A4A] hover:bg-[#E9B6B6]/10 rounded-2xl py-6 text-sm font-bold gap-1.5"
            >
              <Heart className="w-4 h-4 text-[#E9B6B6] fill-current" />
              Soutenir le projet
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
