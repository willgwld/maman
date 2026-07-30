import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft,
  Loader2,
  Lock,
  Smartphone,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';


function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" {...props}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}

export default function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isSupabaseConfigured, user, setLocalUser } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<'google' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Detect if coming from onboarding
  const isFromOnboarding = searchParams.get('fromOnboarding') === 'true' || Boolean(localStorage.getItem('mamanzen_pending_onboarding'));

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup' || isFromOnboarding) {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [searchParams, isFromOnboarding]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const isOnboardingDone = Boolean(user.user_metadata?.onboarding_completed || localStorage.getItem('mamanzen_onboarding_completed'));
      if (!isOnboardingDone) {
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    setError(null);
    setLoadingProvider('google');

    try {
      if (isSupabaseConfigured) {
        const { error: supaErr } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (supaErr) throw supaErr;
        return;
      }

      setError("L'authentification n'est pas configurée. Contacte l'administrateur.");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la connexion. Veuillez réessayer.");
    } finally {
      setTimeout(() => setLoadingProvider(null), 1200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFAF9] via-[#F6F3EE] to-[#FAFAF9] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-[#E9B6B6] selection:text-white">
      {/* Soft Ambient Floating Glow Orbs */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-[#E9B6B6]/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[20%] w-[450px] h-[450px] bg-[#A3B899]/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation Back Link */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#4A4A4A]/70 hover:text-[#4A4A4A] bg-white/70 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/80 shadow-sm transition-all hover:scale-105"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour à l'accueil</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-[#E9B6B6]/25 border border-white/80 relative overflow-hidden"
        >
          {/* Subtle Top Decorative Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#E9B6B6] via-[#A3B899] to-[#E9B6B6]" />

          {/* Header Branding */}
          <div className="text-center space-y-3 mb-8 pt-2">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#E9B6B6]/20 to-[#A3B899]/20 flex items-center justify-center mx-auto shadow-inner">
              <Heart className="w-8 h-8 text-[#E9B6B6] fill-[#E9B6B6]/40 animate-pulse" />
            </div>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#E9B6B6] bg-[#E9B6B6]/15 px-3.5 py-1 rounded-full">
                {isSignUp ? 'Espace Inscription' : 'Espace Connexion'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A4A4A] tracking-tight pt-2">
                MamanZen
              </h1>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto leading-relaxed">
                Votre havre de paix prénatale. Accédez à votre suivi en 1 clic.
              </p>
            </div>
          </div>

          {/* Onboarding Pending Banner */}
          {isFromOnboarding ? (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-[#E9B6B6]/15 border border-[#E9B6B6]/40 text-[#4A4A4A] rounded-2xl text-xs flex items-start gap-3 shadow-sm"
            >
              <Sparkles className="w-5 h-5 text-[#E9B6B6] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-[#4A4A4A]">Vos réponses sont enregistrées ! 🎉</p>
                <p className="text-muted-foreground mt-0.5 leading-relaxed">
                  Finalisez votre compte avec Google pour accéder immédiatement à votre espace MamanZen.
                </p>
              </div>
            </motion.div>
          ) : null}

          {/* Tab Mode Switcher */}
          <div className="flex bg-[#F6F3EE] p-1.5 rounded-2xl mb-8 border border-border/40">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(false);
                setError(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                !isSignUp
                  ? 'bg-white shadow-md text-[#4A4A4A]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => {
                setIsSignUp(true);
                setError(null);
              }}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                isSignUp
                  ? 'bg-white shadow-md text-[#4A4A4A]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* EXCLUSIVE GOOGLE OAUTH BUTTON */}
          <div className="space-y-4">
            {/* Google Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loadingProvider !== null}
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-[#3C4043] font-bold rounded-2xl h-14 px-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all group disabled:opacity-60"
            >
              <div className="flex items-center gap-3.5">
                {loadingProvider === 'google' ? (
                  <Loader2 className="w-5 h-5 animate-spin text-[#4285F4]" />
                ) : (
                  <GoogleIcon />
                )}
                <span className="text-sm font-bold tracking-tight">
                  {isSignUp ? "S'inscrire avec Google" : 'Continuer avec Google'}
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#4285F4] px-2.5 py-1 rounded-full group-hover:bg-blue-100 transition-colors">
                1 Clic
              </span>
            </motion.button>
          </div>

          {/* Key Advantages Checklist */}
          <div className="mt-8 pt-6 border-t border-border/50 space-y-2.5">
            <div className="flex items-center gap-2.5 text-xs text-[#4A4A4A]/80">
              <Zap className="w-4 h-4 text-[#A3B899] shrink-0" />
              <span>Connexion instantanée, aucun mot de passe à retenir</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#4A4A4A]/80">
              <Smartphone className="w-4 h-4 text-[#E9B6B6] shrink-0" />
              <span>Compatible iOS, Android & Navigateurs Web</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#4A4A4A]/80">
              <Lock className="w-4 h-4 text-[#A3B899] shrink-0" />
              <span>Protection maximale des données de santé</span>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-[#A3B899]" />
            <span>Sécurité renforcée • MamanZen {new Date().getFullYear()}</span>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
