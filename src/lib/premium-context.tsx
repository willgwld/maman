import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/components/AuthProvider';

interface PremiumContextType {
  isPremium: boolean;
  togglePremium: () => void;
  activatePremium: () => void;
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    const saved = localStorage.getItem('mamanzen_is_premium');
    if (saved !== null) return saved === 'true';
    return true; // Default to open access for core app experience
  });

  useEffect(() => {
    if (user?.user_metadata?.is_premium !== undefined) {
      setIsPremium(Boolean(user.user_metadata.is_premium));
    }
  }, [user]);

  const togglePremium = () => {
    setIsPremium(prev => {
      const next = !prev;
      localStorage.setItem('mamanzen_is_premium', String(next));
      return next;
    });
  };

  const activatePremium = () => {
    setIsPremium(true);
    localStorage.setItem('mamanzen_is_premium', 'true');
  };

  return (
    <PremiumContext.Provider value={{ isPremium, togglePremium, activatePremium }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}
