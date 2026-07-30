import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import { Heart, Home, ClipboardList, Sparkles, CheckSquare, MessageSquareHeart, Brain, Baby, Settings, Menu, X, User } from "lucide-react";
import Landing from "./pages/Landing";
import Donations from "./pages/Donations";
import LegalPages from "./pages/LegalPages";
import Dashboard from "./pages/Dashboard";
import Tracker from "./pages/Tracker";
import Onboarding from "./pages/Onboarding";
import Checklists from "./pages/Checklists";
import Mental from "./pages/Mental";
import AIChat from "./pages/AIChat";
import Weekly from "./pages/Weekly";
import SettingsPage from "./pages/Settings";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import AdminDashboard from "./pages/AdminDashboard";
import NotificationPermissionModal from "@/components/NotificationPermissionModal";
import { useAuth } from "@/components/AuthProvider";
import { ThemeToggleQuick } from "@/components/ThemeToggle";

function RootRoute() {
  const { user, loading, isSupabaseConfigured } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#181615] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#A3B899] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isSupabaseConfigured && !user) {
    return <Navigate to="/auth" replace />;
  }

  const isCompleted = Boolean(user?.user_metadata?.onboarding_completed || localStorage.getItem('mamanzen_onboarding_completed'));

  if (user && isCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Landing />;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isSupabaseConfigured } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#181615] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#A3B899] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isSupabaseConfigured && !user) {
    return <Navigate to="/auth" replace />;
  }

  const isCompleted = Boolean(user?.user_metadata?.onboarding_completed || localStorage.getItem('mamanzen_onboarding_completed'));

  if (user && !isCompleted && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}

function NavItem({ to, icon: Icon, label, onClick }: { to: string; icon: any; label: string; onClick?: () => void }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
        isActive
          ? "bg-[#A3B899] text-white font-bold shadow-xs"
          : "hover:bg-[#FAFAF9] dark:hover:bg-[#2A2623] text-[#4A4A4A] dark:text-[#E6E1DA] font-medium"
      }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span className="flex-1 text-xs md:text-sm">{label}</span>
      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />}
    </Link>
  );
}

function MobileNavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 transition-all rounded-xl ${
        isActive
          ? "text-[#A3B899] font-bold bg-[#A3B899]/10"
          : "text-muted-foreground hover:text-[#4A4A4A] dark:hover:text-[#E6E1DA]"
      }`}
    >
      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
      <span className="text-[9px] sm:text-[10px] tracking-tight whitespace-nowrap">{label}</span>
    </Link>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#181615] text-[#4A4A4A] dark:text-[#E6E1DA] pb-24 md:pb-0 md:pl-64 transition-colors">
      {/* Sidebar Desktop */}
      <nav className="hidden md:flex flex-col fixed top-0 left-0 w-64 h-screen bg-white dark:bg-[#201D1B] border-r border-[#EAE5DF] dark:border-[#332E2A] p-5 shadow-xs overflow-y-auto z-30">
        <div className="flex items-center justify-between mb-8 px-1 mt-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-tr from-[#E9B6B6]/30 to-[#A3B899]/30 rounded-xl flex items-center justify-center text-[#E9B6B6]">
              <Heart className="w-5 h-5 fill-[#E9B6B6]" />
            </div>
            <span className="text-xl font-bold text-[#4A4A4A] dark:text-[#E6E1DA] tracking-tight">MamanZen</span>
          </div>
          <ThemeToggleQuick />
        </div>

        <div className="flex flex-col gap-1.5 mb-6">
          <div className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            L'Essentiel V1
          </div>
          <NavItem to="/dashboard" icon={Home} label="Tableau de bord" />
          <NavItem to="/tracker" icon={ClipboardList} label="Suivi Quotidien" />
          <NavItem to="/chat" icon={MessageSquareHeart} label="Sage-Femme IA" />
          <NavItem to="/checklists" icon={CheckSquare} label="Checklists Charge Mentale" />
          <NavItem to="/mental" icon={Brain} label="Méditations & Relax" />
          <NavItem to="/weekly" icon={Baby} label="Guide Semaine par Semaine" />
        </div>

        <div className="mt-auto pt-4 border-t border-[#EAE5DF] dark:border-[#332E2A]">
          <NavItem to="/settings" icon={Settings} label="Paramètres & Compte" />
        </div>
      </nav>

      {/* Top Mobile Header */}
      <header className="md:hidden sticky top-0 left-0 right-0 h-14 bg-white/95 dark:bg-[#201D1B]/95 backdrop-blur-md border-b border-[#EAE5DF] dark:border-[#332E2A] z-40 flex items-center justify-between px-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#E9B6B6]/20 text-[#E9B6B6] rounded-lg flex items-center justify-center">
            <Heart className="w-4 h-4 fill-[#E9B6B6]" />
          </div>
          <span className="font-bold text-base text-[#4A4A4A] dark:text-[#E6E1DA]">MamanZen</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggleQuick />
          <Link
            to="/settings"
            className="p-2 rounded-xl text-[#4A4A4A] dark:text-[#E6E1DA] bg-[#FAFAF9] dark:bg-[#2A2623] hover:bg-gray-100 dark:hover:bg-[#332E2A] border border-[#EAE5DF] dark:border-[#332E2A]"
            aria-label="Paramètres"
          >
            <Settings className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#4A4A4A] dark:text-[#E6E1DA] bg-[#FAFAF9] dark:bg-[#2A2623] hover:bg-gray-100 dark:hover:bg-[#332E2A] border border-[#EAE5DF] dark:border-[#332E2A]"
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-xs bg-white dark:bg-[#201D1B] text-[#4A4A4A] dark:text-[#E6E1DA] h-full p-5 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#EAE5DF] dark:border-[#332E2A] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-[#E9B6B6]/20 text-[#E9B6B6] rounded-lg flex items-center justify-center">
                    <Heart className="w-4 h-4 fill-[#E9B6B6]" />
                  </div>
                  <span className="font-bold text-[#4A4A4A] dark:text-[#E6E1DA]">Menu MamanZen</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2A2623]">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <NavItem to="/dashboard" icon={Home} label="Tableau de bord" onClick={() => setMobileMenuOpen(false)} />
                <NavItem to="/tracker" icon={ClipboardList} label="Suivi Quotidien" onClick={() => setMobileMenuOpen(false)} />
                <NavItem to="/chat" icon={MessageSquareHeart} label="Sage-Femme IA" onClick={() => setMobileMenuOpen(false)} />
                <NavItem to="/checklists" icon={CheckSquare} label="Checklists Charge Mentale" onClick={() => setMobileMenuOpen(false)} />
                <NavItem to="/mental" icon={Brain} label="Méditations & Relax" onClick={() => setMobileMenuOpen(false)} />
                <NavItem to="/weekly" icon={Baby} label="Guide Semaine par Semaine" onClick={() => setMobileMenuOpen(false)} />
                <NavItem to="/settings" icon={Settings} label="Paramètres & Compte" onClick={() => setMobileMenuOpen(false)} />
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE5DF] dark:border-[#332E2A] space-y-2">
              <Link
                to="/dons"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-[#E9B6B6] font-bold text-xs"
              >
                <Heart className="w-4 h-4 fill-current" />
                Soutenir l'application
              </Link>
              <Link
                to="/legal"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2A2623] font-medium text-xs"
              >
                Informations légales
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="p-4 md:p-8 max-w-4xl mx-auto">
        {children}
      </main>

      {/* Benevolent Notification Permission Modal */}
      <NotificationPermissionModal />

      {/* Bottom Navigation Mobile - 5 Core Essential Tabs */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#201D1B]/95 backdrop-blur-md border-t border-[#EAE5DF] dark:border-[#332E2A] z-40 shadow-lg px-2 py-1.5 pb-safe">
        <div className="flex items-center justify-around w-full max-w-md mx-auto">
          <MobileNavItem to="/dashboard" icon={Home} label="Accueil" />
          <MobileNavItem to="/tracker" icon={ClipboardList} label="Suivi" />
          <MobileNavItem to="/chat" icon={MessageSquareHeart} label="Sage-IA" />
          <MobileNavItem to="/checklists" icon={CheckSquare} label="Checklists" />
          <MobileNavItem to="/settings" icon={Settings} label="Compte" />
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dons" element={<AppLayout><Donations /></AppLayout>} />
        <Route path="/donations" element={<AppLayout><Donations /></AppLayout>} />
        <Route path="/legal" element={<AppLayout><LegalPages /></AppLayout>} />
        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/tracker" element={<ProtectedRoute><AppLayout><Tracker /></AppLayout></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><AppLayout><AIChat /></AppLayout></ProtectedRoute>} />
        <Route path="/checklists" element={<ProtectedRoute><AppLayout><Checklists /></AppLayout></ProtectedRoute>} />
        <Route path="/mental" element={<ProtectedRoute><AppLayout><Mental /></AppLayout></ProtectedRoute>} />
        <Route path="/weekly" element={<ProtectedRoute><AppLayout><Weekly /></AppLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
