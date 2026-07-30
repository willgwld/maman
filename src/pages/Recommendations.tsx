import { useState, useEffect } from "react";
import { Sparkles, AlertCircle, HeartPulse, Moon, RefreshCcw, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePremium } from "@/lib/premium-context";
import { getPregnancyInfo } from "@/lib/pregnancy";
import { MedicalDisclaimerBanner } from "@/components/MedicalDisclaimer";
import { useAuth } from "@/components/AuthProvider";
import { fetchSymptomLogs, fetchUserProfile } from "@/lib/apiClient";

interface AIResponse {
  greeting: string;
  analysis: string;
  tips: string[];
  disclaimer: string;
}

export default function Recommendations() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isPremium } = usePremium();
  const { user: authUser } = useAuth();
  const authName = authUser?.user_metadata?.name || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || "Maman";

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!isPremium) {
        // Return generic mock data for free tier immediately
        await new Promise(r => setTimeout(r, 800));
        setData({
          greeting: "Bonjour " + authName + ",",
          analysis: "Voici votre conseil quotidien général pour ce deuxième trimestre.",
          tips: [
            "Pensez à bien vous hydrater tout au long de la journée.",
            "Reposez-vous dès que vous en ressentez le besoin."
          ],
          disclaimer: "MamanZen IA peut faire des erreurs. Consultez toujours un professionnel de santé."
        });
        setLoading(false);
        return;
      }

      // Load tracker data from Supabase
      const profile = await fetchUserProfile();
      const logs = await fetchSymptomLogs();

      let trimester = 2;
      let userName = authName;
      if (profile) {
        const info = getPregnancyInfo(profile.dueDate, typeof profile.currentWeek === 'number' ? profile.currentWeek : parseInt(profile.currentWeek as string) || 1);
        trimester = info.trimester;
      }

      let latestLog = logs && logs.length > 0 ? logs[0] : null;

      let reqBody = {
        trimester: trimester,
        symptoms: latestLog ? {
          fatigue: latestLog.energy === "low" ? 4 : latestLog.energy === "medium" ? 2 : 1,
          nausea: latestLog.symptoms.includes("Nausées") ? 3 : 1,
          mood: latestLog.mood === "sad" ? "Mauvais" : latestLog.mood === "radiant" ? "Excellent" : "Moyen",
          sleep: latestLog.energy === "low" ? 3 : 2,
          notes: latestLog.note || ""
        } : {
          fatigue: 3,
          nausea: 1,
          mood: "Moyen",
          sleep: 3,
          notes: ""
        }
      };

      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody)
      });

      if (!res.ok) throw new Error("Erreur réseau");
      
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      
      // Update greeting with userName if provided
      if (json.greeting && userName) {
        if (!json.greeting.includes(userName)) {
          json.greeting = json.greeting.replace("Bonjour", `Bonjour ${userName}`);
        }
      }

      setData(json);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [isPremium]);

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-3xl mx-auto">
      <MedicalDisclaimerBanner compact />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#E9B6B6]" />
            Vos Conseils du Jour
          </h1>
          <p className="text-muted-foreground">Une IA bienveillante pour vous accompagner pas à pas.</p>
        </div>
        {!isPremium && (
          <div className="bg-[#FAFAF9] border border-[#E9B6B6]/30 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm">
            <Lock className="w-4 h-4 text-[#E9B6B6]" />
            Limité à 1 conseil générique / jour
          </div>
        )}
      </header>

      {loading ? (
        <Card className="shadow-sm rounded-3xl border-border/50 bg-card overflow-hidden">
          <CardContent className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center animate-pulse mb-6">
              <Sparkles className="w-8 h-8 text-primary animate-spin-slow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Analyse en cours...</h3>
            <p className="text-muted-foreground">Nous préparons des conseils doux et personnalisés pour vous.</p>
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="shadow-sm rounded-3xl border-destructive/20 bg-destructive/5">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
            <p className="text-destructive font-medium mb-4">{error}</p>
            <Button variant="outline" onClick={fetchRecommendations} className="rounded-xl">
              <RefreshCcw className="mr-2 h-4 w-4" /> Réessayer
            </Button>
          </CardContent>
        </Card>
      ) : data ? (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20 shadow-sm rounded-3xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">{data.greeting}</h2>
              <p className="text-lg text-foreground/80 leading-relaxed">{data.analysis}</p>
            </CardContent>
          </Card>

          <h3 className="text-xl font-bold mt-4 px-2">Suggestions du jour</h3>
          <div className="grid gap-4">
            {data.tips.map((tip, idx) => (
              <Card key={idx} className="shadow-sm rounded-3xl border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-6 flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <HeartPulse className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-foreground leading-relaxed pt-2">{tip}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 bg-muted/50 border-none shadow-none rounded-3xl">
            <CardContent className="p-6 flex gap-4 items-start text-muted-foreground text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="italic leading-relaxed">{data.disclaimer}</p>
            </CardContent>
          </Card>
          
        </div>
      ) : null}
    </div>
  );
}