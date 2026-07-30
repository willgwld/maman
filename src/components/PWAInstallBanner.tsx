import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Check, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already running in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Don't show if user previously dismissed it in this session
      if (!sessionStorage.getItem('mamanzen_pwa_dismissed')) {
        setShowBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert("Pour installer MamanZen :\n• Sur iOS (iPhone/iPad) : appuyez sur 'Partager' puis 'Sur l'écran d'accueil'\n• Sur Android/Chrome : utilisez le menu du navigateur puis 'Ajouter à l'écran d'accueil'");
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('mamanzen_pwa_dismissed', 'true');
  };

  if (isInstalled) return null;

  return (
    <>
      {/* Floating Prompt Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-[#FAF8F5] via-[#FFF] to-[#FAF8F5] border border-[#E9B6B6]/40 p-4 rounded-3xl shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#E9B6B6]/20 text-[#E9B6B6] rounded-2xl flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#4A4A4A] flex items-center gap-1.5">
                Installer l'application MamanZen
                <span className="bg-[#A3B899]/20 text-[#6B8E5E] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">PWA</span>
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Accès direct 1-clic depuis votre écran d'accueil sans ouvrir le navigateur.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button
              onClick={handleInstall}
              className="bg-[#E9B6B6] hover:bg-[#D9A6A6] text-white rounded-2xl text-xs font-bold px-4 py-2 h-9 shadow-sm gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Installer l'App
            </Button>
            <button
              onClick={handleDismiss}
              className="p-2 text-muted-foreground hover:text-[#4A4A4A] rounded-xl"
              title="Masquer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
