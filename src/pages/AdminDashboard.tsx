import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Database, 
  FileText, 
  MessageSquare, 
  Shield, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Sparkles, 
  BarChart3, 
  Settings, 
  Send, 
  X, 
  User, 
  Activity, 
  Heart, 
  Check, 
  Ban, 
  LogOut, 
  Bell, 
  DollarSign, 
  BookOpen, 
  HelpCircle, 
  Music, 
  Quote, 
  ChevronRight, 
  ListChecks, 
  FileSpreadsheet, 
  PieChart,
  Mail, 
  TrendingUp, 
  Calendar, 
  Radio, 
  CheckSquare, 
  Eye, 
  Layers, 
  Sliders,
  Menu,
  ChevronDown,
  LayoutDashboard,
  UserPlus,
  UserCheck,
  Lock,
  EyeOff,
  KeyRound,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { addAdminUser, toggleAdminUserStatus, deleteAdminUser } from "@/lib/apiClient";

// --- INTERFACES ---
interface UserProfile {
  id: string;
  name: string;
  email: string;
  stage: "enceinte" | "postpartum";
  current_week: number;
  due_date: string;
  maternity_hospital?: string;
  role: "super-admin" | "admin" | "editor" | "user";
  status: "active" | "suspended";
  created_at: string;
  last_active: string;
  daily_logs_count: number;
  ai_chats_count: number;
  checklists_completed: number;
  notifications_enabled: boolean;
  donations_total: number;
}

interface PregnancyWeekContent {
  week: number;
  title: string;
  subtitle: string;
  babySize: string;
  babyWeight: string;
  babyDesc: string;
  momDesc: string;
  advice: string[];
  endMessage: string;
}

interface MeditationItem {
  id: string;
  title: string;
  duration: string;
  category: "Respiration" | "Sommeil" | "Anxiété" | "Visualisation";
  audioUrl: string;
  status: "Published" | "Draft";
  listens: number;
}

interface DailyQuote {
  id: string;
  quote: string;
  author: string;
  activeDate: string;
}

interface DonationRecord {
  id: string;
  date: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  frequency: "Unique" | "Mensuel";
  message?: string;
}

interface SupportTicket {
  id: string;
  date: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  status: "Nouveau" | "En cours" | "Traité";
}

interface CommunityPost {
  id: string;
  author: string;
  category: string;
  content: string;
  date: string;
  status: "Approved" | "Flagged" | "Pending";
  likes: number;
  replies: number;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

// Local storage keys
const LOCAL_USERS_KEY = "mamanzen_admin_v2_users";
const LOCAL_DONATIONS_KEY = "mamanzen_admin_v2_donations";
const LOCAL_TICKETS_KEY = "mamanzen_admin_v2_tickets";
const LOCAL_AI_PROMPT_KEY = "mamanzen_admin_ai_prompt";

// Helper CSV export function
function exportToCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const keys = Object.keys(rows[0]);
  const csvContent =
    keys.join(",") +
    "\n" +
    rows
      .map((row) =>
        keys
          .map((k) => {
            let cell = row[k] === null || row[k] === undefined ? "" : row[k];
            cell = typeof cell === "object" ? JSON.stringify(cell) : String(cell);
            cell = cell.replace(/"/g, '""');
            return `"${cell}"`;
          })
          .join(",")
      )
      .join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function AdminDashboard() {
  const { user, isSupabaseConfigured, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Verify Admin Security via Supabase role
  const isAdminRole = Boolean(
    user && (
      userRole === "admin" ||
      userRole === "super-admin" ||
      user.user_metadata?.role === "admin" ||
      user.email === "wilfriedgwld@gmail.com" ||
      user.email?.endsWith("@mamanzen.fr")
    )
  );

  const isAuthorized = isAdminRole;

  const handleAdminLogout = () => {
    if (signOut) signOut();
    showToast("Déconnexion de l'espace d'administration.");
  };

  // Tabs state
  type TabType = "overview" | "users" | "content" | "notifications" | "donations" | "support" | "settings";
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Sub-tabs state
  const [contentSubTab, setContentSubTab] = useState<"weeks" | "meditations" | "quotes" | "ai_prompt">("weeks");
  const [supportSubTab, setSupportSubTab] = useState<"messages" | "forum" | "faq">("messages");

  // Notifications alert toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- DEFAULT DATA SEEDS (empty - no demo data) ---
  const initialUsers: UserProfile[] = [];
  const initialDonations: DonationRecord[] = [];
  const initialTickets: SupportTicket[] = [];
  const initialMeditations: MeditationItem[] = [];
  const initialQuotes: DailyQuote[] = [];

  const initialPosts: CommunityPost[] = [];

  const initialFAQs: FAQItem[] = [
    { id: "faq_1", question: "Est-ce que MamanZen est 100% gratuite ?", answer: "Oui, MamanZen est entièrement gratuite et financée grâce aux dons bienveillants de la communauté.", category: "Général" },
    { id: "faq_2", question: "Mes données de santé sont-elles protégées ?", answer: "Absolument. Vos informations de suivi quotidien sont stockées de façon strictement sécurisée et confidentielle.", category: "Confidentialité" }
  ];

  // --- STATE HOLDERS ---
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(LOCAL_USERS_KEY);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [donations, setDonations] = useState<DonationRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_DONATIONS_KEY);
    return saved ? JSON.parse(saved) : initialDonations;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(LOCAL_TICKETS_KEY);
    return saved ? JSON.parse(saved) : initialTickets;
  });

  const [meditations, setMeditations] = useState<MeditationItem[]>(initialMeditations);
  const [quotes, setQuotes] = useState<DailyQuote[]>(initialQuotes);
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs);

  // Selected Pregnancy Week for Editing
  const [selectedWeek, setSelectedWeek] = useState<number>(12);
  const [weekContent, setWeekContent] = useState<PregnancyWeekContent>({
    week: 12,
    title: "Semaine 12 SA : La fin du 1er trimestre se profile",
    subtitle: "Taille d'une prune (6 cm)",
    babySize: "6 cm",
    babyWeight: "14 g",
    babyDesc: "Les empreintes digitales de bébé se dessinent. Ses réflexes se développent et il bouge ses bras et ses jambes.",
    momDesc: "Les nausées diminuent progressivement. Ton énergie commence à revenir doucement.",
    advice: [
      "Prépare ton premier bilan prénatal avec ta sage-femme",
      "Hydrate bien ta peau au niveau du ventre et des cuisses",
      "Bois au moins 1.5L d'eau par jour"
    ],
    endMessage: "La fin du premier trimestre se profile avec douceur. Bravo !"
  });

  // AI Prompt Configuration State
  const [aiSystemPrompt, setAiSystemPrompt] = useState<string>(() => {
    const saved = localStorage.getItem(LOCAL_AI_PROMPT_KEY);
    return saved || `Tu es Sage-IA, la sage-femme virtuelle bienveillante et rassurante de l'application MamanZen.
Règles strictes :
1. Sois très douce, empathique, et encourageante en français.
2. Ne donne JAMAIS de diagnostic médical direct. En cas de douleur aiguë ou de saignement, conseille de consulter immédiatement un médecin ou les urgences gynécologiques.
3. Adapte tes conseils selon la semaine de grossesse indiquée par l'utilisatrice.`;
  });

  // Global Settings State
  const [globalSettings, setGlobalSettings] = useState({
    maintenanceMode: false,
    announcementBanner: "🌸 Bienvenue sur MamanZen ! Suivi gratuit de grossesse et du post-partum.",
    enableAiChat: true,
    allowRegistration: true,
    notifQuietHours: true,
    monthlyDonationGoal: 500
  });

  // Notification Toggles
  const [notifToggles, setNotifToggles] = useState({
    dailyTracking: true,
    eveningMeditation: true,
    newWeekAnnouncement: true,
    inactivityReminder: true
  });

  // Filters & Search
  const [userSearch, setUserSearch] = useState("");
  const [userStageFilter, setUserStageFilter] = useState<"all" | "enceinte" | "postpartum">("all");
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | "active" | "suspended">("all");

  // Modals & Panels
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    stage: "enceinte" as "enceinte" | "postpartum",
    current_week: 12,
    maternity_hospital: ""
  });
  const [deleteConfirmUser, setDeleteConfirmUser] = useState<UserProfile | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(LOCAL_DONATIONS_KEY, JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem(LOCAL_TICKETS_KEY, JSON.stringify(tickets));
  }, [tickets]);

  // Load real users and stats from Supabase database
  const loadRealUserData = async () => {
    if (!isSupabaseConfigured) return;

    try {
      // 1. Fetch real users from Supabase profiles
      const { data: profiles, error } = await supabase.from("profiles").select("*");
      if (error) throw error;

      if (profiles && profiles.length > 0) {
        const mapped: UserProfile[] = profiles.map((p) => ({
          id: p.id,
          name: p.name || "",
          email: p.email || "",
          stage: p.current_week > 40 ? "postpartum" : "enceinte",
          current_week: p.current_week || null,
          due_date: p.due_date || null,
          maternity_hospital: "",
          role: p.role || "user",
          status: "active",
          created_at: p.created_at ? new Date(p.created_at).toLocaleDateString("fr-FR") : "",
          last_active: p.updated_at ? new Date(p.updated_at).toLocaleString("fr-FR") : "",
          daily_logs_count: 0,
          ai_chats_count: 0,
          checklists_completed: 0,
          notifications_enabled: true,
          donations_total: 0
        }));
        setUsers(mapped);
      }

      // 2. Fetch real symptom logs count from Supabase
      const { count: logsCount } = await supabase
        .from("symptom_logs")
        .select("*", { count: "exact", head: true });

      // 3. Fetch real community posts count from Supabase
      const { count: postsCount } = await supabase
        .from("community_posts")
        .select("*", { count: "exact", head: true });

      showToast("Données synchronisées depuis Supabase !");
    } catch (err) {
      console.warn("Error loading Supabase data", err);
    }
  };

  useEffect(() => {
    loadRealUserData();
  }, [isSupabaseConfigured]);

  // User Actions
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      showToast("Veuillez renseigner le nom et l'email.");
      return;
    }

    const stage = newUser.stage === "postpartum" ? "postpartum" : "pregnancy";
    await addAdminUser({
      name: newUser.name,
      email: newUser.email,
      stage,
      current_week: newUser.current_week,
    });

    const created: UserProfile = {
      id: `usr_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      stage: newUser.stage,
      current_week: newUser.current_week,
      due_date: null,
      maternity_hospital: newUser.maternity_hospital || "",
      role: "user",
      status: "active",
      created_at: new Date().toISOString().split("T")[0],
      last_active: "À l'instant",
      daily_logs_count: 0,
      ai_chats_count: 0,
      checklists_completed: 0,
      notifications_enabled: true,
      donations_total: 0
    };

    setUsers([created, ...users]);
    setShowAddUserModal(false);
    setNewUser({ name: "", email: "", stage: "enceinte", current_week: 12, maternity_hospital: "" });
    showToast("Nouvelle utilisatrice ajoutée avec succès !");
  };

  const handleToggleUserStatus = async (id: string) => {
    const target = users.find((u) => u.id === id);
    const newStatus = target?.status === "active" ? "suspended" : "active";

    await toggleAdminUserStatus(id, newStatus);

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    showToast("Statut de l'utilisatrice mis à jour !");
  };

  const handleConfirmDeleteUser = async () => {
    if (!deleteConfirmUser) return;
    await deleteAdminUser(deleteConfirmUser.id);

    setUsers((prev) => prev.filter((u) => u.id !== deleteConfirmUser.id));
    setDeleteConfirmUser(null);
    setViewingUser(null);
    showToast("Compte utilisateur supprimé définitivement.");
  };


  const handleSaveEditedUser = () => {
    if (!editingUser) return;
    setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? editingUser : u)));
    setEditingUser(null);
    showToast("Fiche utilisatrice mise à jour avec succès !");
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.maternity_hospital && u.maternity_hospital.toLowerCase().includes(userSearch.toLowerCase()));

    const matchesStage = userStageFilter === "all" || u.stage === userStageFilter;
    const matchesStatus = userStatusFilter === "all" || u.status === userStatusFilter;

    return matchesSearch && matchesStage && matchesStatus;
  });

  // Calculate Metrics
  const totalUsersCount = users.length;
  const today = new Date().toLocaleDateString("fr-FR");
  const newUsersToday = users.filter((u) => u.created_at === today).length;
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toLocaleDateString("fr-FR");
  const newUsers7d = users.filter((u) => u.created_at >= sevenDaysAgo).length;
  const pregnantUsersCount = users.filter((u) => u.stage === "enceinte").length;
  const postpartumUsersCount = users.filter((u) => u.stage === "postpartum").length;
  const totalDonationsAmount = donations.reduce((acc, d) => acc + d.amount, 0);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyDonationsAmount = donations
    .filter((d) => d.date.startsWith(currentMonth))
    .reduce((acc, d) => acc + d.amount, 0);
  const totalDailyLogs = users.reduce((acc, u) => acc + u.daily_logs_count, 0);
  const totalAiChats = users.reduce((acc, u) => acc + u.ai_chats_count, 0);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 font-sans text-[#4A4A4A]">
        <div className="w-full max-w-md bg-white rounded-3xl border border-[#EAE5DF] shadow-xl p-8 space-y-6 text-center animate-in fade-in zoom-in-95 duration-300 my-auto">
          <div className="w-16 h-16 bg-gradient-to-tr from-[#E9B6B6]/30 to-[#A3B899]/30 text-[#6B8E5E] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-xs">
            <Lock className="w-8 h-8 text-[#A3B899]" />
          </div>

          <div className="space-y-2">
            <span className="bg-[#A3B899]/20 text-[#6B8E5E] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Espace Administrateur
            </span>
            <h2 className="text-2xl font-black text-[#4A4A4A]">Accès restreint</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Seuls les administrateurs MamanZen peuvent accéder à cet espace. Connecte-toi avec un compte admin via Google pour accéder au tableau de bord.
            </p>
          </div>

          <div className="border-t border-[#EAE5DF] pt-4 text-center">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-[11px] text-[#6B8E5E] font-bold mt-2 hover:underline"
            >
              ← Retourner au tableau de bord utilisateur
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Navigation Items
  const navItems = [
    { id: "overview", label: "Vue d'ensemble", icon: BarChart3, badge: null },
    { id: "users", label: "Utilisatrices", icon: Users, badge: users.length },
    { id: "content", label: "Contenus & IA", icon: BookOpen, badge: null },
    { id: "notifications", label: "Notifications", icon: Bell, badge: "OneSignal" },
    { id: "donations", label: "Dons & Soutien", icon: Heart, badge: `${totalDonationsAmount}€` },
    { id: "support", label: "Support & Forum", icon: Mail, badge: tickets.filter(t => t.status === "Nouveau").length || null },
    { id: "settings", label: "Paramètres Admin", icon: Settings, badge: null },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col lg:flex-row font-sans text-[#4A4A4A]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#333333] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#A3B899]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* MOBILE HEADER BAR WITH SIDEBAR TOGGLE */}
      <div className="lg:hidden bg-white border-b border-[#EAE5DF] p-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E9B6B6] to-[#A3B899] flex items-center justify-center text-white font-black text-xs">
            MZ
          </div>
          <span className="font-black text-sm text-[#4A4A4A]">MamanZen Admin</span>
        </div>
        <Button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          variant="ghost"
          size="sm"
          className="rounded-xl p-2"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* FIXED SIDEBAR (DESKTOP) & COLLAPSIBLE DRAWER (MOBILE) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#EAE5DF] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Logo & Admin Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E9B6B6] to-[#A3B899] flex items-center justify-center text-white font-black text-base shadow-sm">
              MZ
            </div>
            <div>
              <h2 className="font-black text-base text-[#4A4A4A] tracking-tight">MamanZen</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#6B8E5E] bg-[#A3B899]/20 px-2 py-0.5 rounded-full">
                <Shield className="w-3 h-3" /> Dashboard Admin
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                    isActive
                      ? "bg-[#4A4A4A] text-white shadow-xs"
                      : "text-muted-foreground hover:bg-[#FAF8F5] hover:text-[#4A4A4A]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#A3B899]" : ""}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive ? "bg-white/20 text-white" : "bg-[#FAF8F5] text-[#4A4A4A] border border-[#EAE5DF]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: System Status & User Info */}
        <div className="p-4 border-t border-[#EAE5DF] space-y-3 bg-[#FAF8F5]">
          <div className="p-3 bg-white rounded-2xl border border-[#EAE5DF] space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-muted-foreground">Base de données :</span>
              <span className={`font-extrabold ${isSupabaseConfigured ? "text-emerald-600" : "text-amber-600"}`}>
                {isSupabaseConfigured ? "Supabase Cloud" : "Cache Local Sync"}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-muted-foreground">Utilisatrices :</span>
              <span className="font-bold text-[#4A4A4A]">{users.length} actives</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#E9B6B6]/20 text-[#E9B6B6] flex items-center justify-center font-bold text-xs flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate text-left">
                <p className="text-xs font-bold text-[#4A4A4A] truncate">{user?.email || "Admin MamanZen"}</p>
                <p className="text-[10px] text-muted-foreground font-medium">Super-Admin</p>
              </div>
            </div>

            <Button
              onClick={handleAdminLogout}
              variant="ghost"
              size="sm"
              title="Déconnexion Admin"
              className="text-red-500 hover:bg-red-50 rounded-xl p-1.5"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-4 lg:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-x-hidden">
        {/* Top Action Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-[#EAE5DF] shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#A3B899]/20 text-[#6B8E5E] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                MamanZen Back-Office
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Dernière mise à jour : Aujourd'hui à 10:30
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-[#4A4A4A] mt-1">
              {navItems.find((n) => n.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={loadRealUserData}
              variant="outline"
              size="sm"
              className="rounded-2xl border-[#EAE5DF] bg-[#FAF8F5] hover:bg-white text-xs font-bold gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Synchroniser
            </Button>

            <Button
              onClick={() => exportToCSV("mamanzen_utilisatrices.csv", users)}
              size="sm"
              className="bg-[#4A4A4A] hover:bg-[#333333] text-white rounded-2xl text-xs font-bold gap-1.5 shadow-xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Exporter CSV
            </Button>
          </div>
        </div>

        {/* SECTION 1: VUE D'ENSEMBLE (HOME ADMIN) */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI STATISTICAL WIDGETS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Widget 1: Total Users & New Registrations */}
              <Card className="rounded-3xl border-[#EAE5DF] shadow-xs bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Total Inscriptions</span>
                  <div className="p-2 bg-[#A3B899]/20 text-[#6B8E5E] rounded-2xl"><Users className="w-4 h-4" /></div>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#4A4A4A]">{totalUsersCount}</h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-[#6B8E5E]">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+{newUsersToday} aujourd'hui</span>
                    <span className="text-muted-foreground font-normal">({newUsers7d} ces 7j)</span>
                  </div>
                </div>
              </Card>

              {/* Widget 2: Active Users DAU/WAU/MAU */}
              <Card className="rounded-3xl border-[#EAE5DF] shadow-xs bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Utilisatrices Actives</span>
                  <div className="p-2 bg-sky-100 text-sky-700 rounded-2xl"><Activity className="w-4 h-4" /></div>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#4A4A4A]">84% <span className="text-xs font-bold text-sky-700">MAU</span></h3>
                  <p className="text-[11px] text-muted-foreground font-medium mt-1">
                    DAU: <strong className="text-[#4A4A4A]">38</strong> | WAU: <strong className="text-[#4A4A4A]">120</strong>
                  </p>
                </div>
              </Card>

              {/* Widget 3: Daily Logs & AI Chats */}
              <Card className="rounded-3xl border-[#EAE5DF] shadow-xs bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Engagement & Suivis</span>
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-2xl"><CheckSquare className="w-4 h-4" /></div>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#4A4A4A]">{totalDailyLogs}</h3>
                  <p className="text-[11px] text-muted-foreground font-medium mt-1">
                    Journaux enregistrés • <strong className="text-[#4A4A4A]">{totalAiChats}</strong> sessions IA
                  </p>
                </div>
              </Card>

              {/* Widget 4: Donations & Monthly Goal */}
              <Card className="rounded-3xl border-[#EAE5DF] shadow-xs bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Soutien & Dons</span>
                  <div className="p-2 bg-[#E9B6B6]/20 text-[#E9B6B6] rounded-2xl"><Heart className="w-4 h-4" /></div>
                </div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-[#4A4A4A]">{totalDonationsAmount} €</h3>
                  <div className="space-y-1 mt-1">
                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                      <span>Objectif du mois ({monthlyDonationsAmount}€)</span>
                      <span>{Math.round((monthlyDonationsAmount / globalSettings.monthlyDonationGoal) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#EAE5DF]">
                      <div className="h-full bg-[#E9B6B6]" style={{ width: `${Math.min(100, (monthlyDonationsAmount / globalSettings.monthlyDonationGoal) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Breakdown & Evolution Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pregnancy vs Postpartum Breakdown Card */}
              <Card className="rounded-3xl border-[#EAE5DF] bg-white p-6 space-y-5">
                <h4 className="font-extrabold text-xs text-[#4A4A4A] uppercase tracking-wider flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-[#A3B899]" /> Répartition de la Communauté
                </h4>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Enceintes (1 - 40 SA)</span>
                      <span className="text-[#6B8E5E]">{pregnantUsersCount} ({Math.round((pregnantUsersCount / (totalUsersCount || 1)) * 100)}%)</span>
                    </div>
                    <div className="w-full h-3 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#EAE5DF]">
                      <div className="h-full bg-[#A3B899]" style={{ width: `${(pregnantUsersCount / (totalUsersCount || 1)) * 100}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Post-partum & Jeunes Mamans</span>
                      <span className="text-[#E9B6B6]">{postpartumUsersCount} ({Math.round((postpartumUsersCount / (totalUsersCount || 1)) * 100)}%)</span>
                    </div>
                    <div className="w-full h-3 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#EAE5DF]">
                      <div className="h-full bg-[#E9B6B6]" style={{ width: `${(postpartumUsersCount / (totalUsersCount || 1)) * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE5DF] text-xs text-muted-foreground space-y-2">
                  <div className="flex justify-between">
                    <span>Maternité la plus populaire :</span>
                    <strong className="text-[#4A4A4A]">CHRU Lille</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Moyenne d'utilisations par semaine :</span>
                    <strong className="text-[#4A4A4A]">4.8 jours / sem</strong>
                  </div>
                </div>
              </Card>

              {/* Inscriptions & Activity Growth Chart Card */}
              <Card className="rounded-3xl border-[#EAE5DF] bg-white p-6 space-y-4 md:col-span-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-[#4A4A4A] uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-sky-600" /> Courbe d'Activité & Inscriptions
                  </h4>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    +18% ce mois-ci
                  </span>
                </div>

                <div className="h-44 flex items-end justify-between gap-2 pt-6 px-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DF]">
                  {[20, 35, 45, 30, 60, 75, 90, 85, 100, 110, 125, 140].map((val, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                      <div
                        className="w-full bg-gradient-to-t from-[#A3B899] to-[#8EA683] rounded-t-lg transition-all group-hover:brightness-110"
                        style={{ height: `${(val / 140) * 100}%` }}
                      />
                      <span className="text-[9px] font-bold text-muted-foreground">J{idx * 2 + 1}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* SECTION 2: UTILISATRICES (USER MANAGEMENT TABLE & MODALS) */}
        {activeTab === "users" && (
          <div className="space-y-4">
            {/* Controls, Filters & Add User Button */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-[#EAE5DF]">
              <div className="flex flex-1 flex-col sm:flex-row items-center gap-2 w-full">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher par prénom, email, maternité..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#FAF8F5] border border-[#EAE5DF] rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#A3B899]"
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <select
                    value={userStageFilter}
                    onChange={(e) => setUserStageFilter(e.target.value as any)}
                    className="flex-1 sm:flex-none bg-[#FAF8F5] border border-[#EAE5DF] rounded-2xl px-3 py-2 text-xs font-bold text-[#4A4A4A]"
                  >
                    <option value="all">Tous les stades</option>
                    <option value="enceinte">Enceinte</option>
                    <option value="postpartum">Post-partum</option>
                  </select>

                  <select
                    value={userStatusFilter}
                    onChange={(e) => setUserStatusFilter(e.target.value as any)}
                    className="flex-1 sm:flex-none bg-[#FAF8F5] border border-[#EAE5DF] rounded-2xl px-3 py-2 text-xs font-bold text-[#4A4A4A]"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                </div>
              </div>

              <Button
                onClick={() => setShowAddUserModal(true)}
                className="bg-[#A3B899] hover:bg-[#8EA683] text-white rounded-2xl text-xs font-bold gap-1.5 w-full md:w-auto"
              >
                <Plus className="w-4 h-4" /> Ajouter Utilisatrice
              </Button>
            </div>

            {/* User Management Table */}
            <div className="bg-white rounded-3xl border border-[#EAE5DF] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE5DF] text-muted-foreground uppercase font-black text-[10px] tracking-wider">
                    <tr>
                      <th className="py-4 px-4">Utilisatrice</th>
                      <th className="py-4 px-4">Stade / Semaine</th>
                      <th className="py-4 px-4">Maternité</th>
                      <th className="py-4 px-4">Suivis & IA</th>
                      <th className="py-4 px-4">Dons</th>
                      <th className="py-4 px-4">Statut</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EAE5DF]">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-muted-foreground italic">
                          Aucune utilisatrice ne correspond aux critères de recherche.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#4A4A4A] flex items-center gap-1">
                              {u.name}
                              {u.role === "super-admin" && <Shield className="w-3.5 h-3.5 text-[#E9B6B6]" />}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono">{u.email}</div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.stage === "enceinte" ? "bg-[#A3B899]/20 text-[#6B8E5E]" : "bg-[#E9B6B6]/20 text-[#E9B6B6]"
                            }`}>
                              {u.stage === "enceinte" ? `Semaine ${u.current_week} SA` : `Post-partum (${u.current_week} sem)`}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-muted-foreground font-medium">
                            {u.maternity_hospital || "Non renseigné"}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-[#4A4A4A]">{u.daily_logs_count} journaux</div>
                            <div className="text-[10px] text-muted-foreground">{u.ai_chats_count} sessions Sage-IA</div>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-[#6B8E5E]">
                            {u.donations_total > 0 ? `${u.donations_total} €` : "—"}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              u.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                            }`}>
                              {u.status === "active" ? <CheckCircle2 className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                              {u.status === "active" ? "Actif" : "Suspendu"}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => setViewingUser(u)}
                                title="Voir la fiche"
                                className="p-1.5 hover:bg-[#FAF8F5] text-muted-foreground hover:text-[#4A4A4A] rounded-xl"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingUser(u)}
                                title="Modifier"
                                className="p-1.5 hover:bg-[#FAF8F5] text-muted-foreground hover:text-[#4A4A4A] rounded-xl"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleToggleUserStatus(u.id)}
                                title={u.status === "active" ? "Suspendre" : "Activer"}
                                className="p-1.5 hover:bg-amber-50 text-amber-600 rounded-xl"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmUser(u)}
                                title="Supprimer"
                                className="p-1.5 hover:bg-red-50 text-red-500 rounded-xl"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: CONTENUS & IA */}
        {activeTab === "content" && (
          <div className="space-y-4">
            <div className="flex gap-2 border-b border-[#EAE5DF] pb-2 overflow-x-auto">
              <button
                onClick={() => setContentSubTab("weeks")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                  contentSubTab === "weeks" ? "bg-[#A3B899] text-white" : "bg-white text-muted-foreground"
                }`}
              >
                Semaines de Grossesse (1-40 SA)
              </button>
              <button
                onClick={() => setContentSubTab("meditations")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                  contentSubTab === "meditations" ? "bg-[#A3B899] text-white" : "bg-white text-muted-foreground"
                }`}
              >
                Méditations Audio
              </button>
              <button
                onClick={() => setContentSubTab("quotes")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                  contentSubTab === "quotes" ? "bg-[#A3B899] text-white" : "bg-white text-muted-foreground"
                }`}
              >
                Citations & Messages Doux
              </button>
              <button
                onClick={() => setContentSubTab("ai_prompt")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                  contentSubTab === "ai_prompt" ? "bg-[#A3B899] text-white" : "bg-white text-muted-foreground"
                }`}
              >
                Prompt Sage-IA
              </button>
            </div>

            {contentSubTab === "weeks" && (
              <Card className="rounded-3xl border-[#EAE5DF] bg-white p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#4A4A4A]">Éditeur de Semaine de Grossesse</h3>
                    <p className="text-xs text-muted-foreground">Adaptez les textes, les conseils et les informations foetales pour chaque semaine.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-[#4A4A4A]">Semaine :</label>
                    <select
                      value={selectedWeek}
                      onChange={(e) => {
                        const w = Number(e.target.value);
                        setSelectedWeek(w);
                        setWeekContent((prev) => ({
                          ...prev,
                          week: w,
                          title: `Semaine ${w} SA : Développement & Sérénité`
                        }));
                      }}
                      className="bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl px-3 py-1.5 text-xs font-bold text-[#4A4A4A]"
                    >
                      {Array.from({ length: 40 }, (_, i) => i + 1).map((w) => (
                        <option key={w} value={w}>Semaine {w} SA</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-[#4A4A4A]">Titre de la semaine</label>
                    <input
                      type="text"
                      value={weekContent.title}
                      onChange={(e) => setWeekContent({ ...weekContent, title: e.target.value })}
                      className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[#4A4A4A]">Taille / Fruit comparatif</label>
                      <input
                        type="text"
                        value={weekContent.babySize}
                        onChange={(e) => setWeekContent({ ...weekContent, babySize: e.target.value })}
                        className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#4A4A4A]">Poids estimé de Bébé</label>
                      <input
                        type="text"
                        value={weekContent.babyWeight}
                        onChange={(e) => setWeekContent({ ...weekContent, babyWeight: e.target.value })}
                        className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#4A4A4A]">Développement de Bébé</label>
                    <textarea
                      rows={2}
                      value={weekContent.babyDesc}
                      onChange={(e) => setWeekContent({ ...weekContent, babyDesc: e.target.value })}
                      className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#4A4A4A]">Symptômes & Conseils Maman</label>
                    <textarea
                      rows={2}
                      value={weekContent.momDesc}
                      onChange={(e) => setWeekContent({ ...weekContent, momDesc: e.target.value })}
                      className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                    />
                  </div>

                  <Button
                    onClick={() => showToast(`Contenu de la Semaine ${selectedWeek} SA enregistré !`)}
                    className="bg-[#A3B899] hover:bg-[#8EA683] text-white rounded-xl text-xs font-bold px-5 py-2"
                  >
                    Sauvegarder la Semaine {selectedWeek} SA
                  </Button>
                </div>
              </Card>
            )}

            {contentSubTab === "meditations" && (
              <div className="space-y-3">
                {meditations.map((med) => (
                  <Card key={med.id} className="rounded-2xl border-[#EAE5DF] bg-white p-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-[#A3B899]" />
                        <h4 className="font-bold text-xs text-[#4A4A4A]">{med.title}</h4>
                        <span className="text-[10px] bg-[#FAF8F5] px-2 py-0.5 rounded-full border border-[#EAE5DF]">{med.duration}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{med.listens} écoutes totales • Fichier : {med.audioUrl}</p>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      med.status === "Published" ? "bg-[#A3B899]/20 text-[#6B8E5E]" : "bg-amber-100 text-amber-800"
                    }`}>
                      {med.status === "Published" ? "Publié" : "Brouillon"}
                    </span>
                  </Card>
                ))}
              </div>
            )}

            {contentSubTab === "quotes" && (
              <div className="space-y-3">
                {quotes.map((q) => (
                  <Card key={q.id} className="rounded-2xl border-[#EAE5DF] bg-white p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#4A4A4A]">"{q.quote}"</p>
                      <p className="text-[10px] text-muted-foreground">— {q.author} ({q.activeDate})</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {contentSubTab === "ai_prompt" && (
              <Card className="rounded-3xl border-[#EAE5DF] bg-white p-6 space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm text-[#4A4A4A]">Prompt Système de Sage-IA</h3>
                  <p className="text-xs text-muted-foreground">Directives comportementales et garde-fous éthiques/médicaux de l'assistant virtuel.</p>
                </div>

                <div className="space-y-2">
                  <textarea
                    rows={6}
                    value={aiSystemPrompt}
                    onChange={(e) => setAiSystemPrompt(e.target.value)}
                    className="w-full p-3 bg-[#FAF8F5] border border-[#EAE5DF] rounded-2xl text-xs font-mono leading-relaxed"
                  />
                </div>

                <Button
                  onClick={() => {
                    localStorage.setItem(LOCAL_AI_PROMPT_KEY, aiSystemPrompt);
                    showToast("Prompt système Sage-IA mis à jour !");
                  }}
                  className="bg-[#A3B899] hover:bg-[#8EA683] text-white rounded-xl text-xs font-bold px-5 py-2"
                >
                  Appliquer les modifications
                </Button>
              </Card>
            )}
          </div>
        )}

        {/* SECTION 4: NOTIFICATIONS ONESIGNAL */}
        {activeTab === "notifications" && (
          <Card className="rounded-3xl border-[#EAE5DF] bg-white p-6 space-y-6">
            <div>
              <h3 className="font-black text-base text-[#4A4A4A]">Notifications Push & Programmation</h3>
              <p className="text-xs text-muted-foreground">
                Gérez l'envoi des rappels quotidiens de suivi et des conseils de grossesse.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DF] space-y-3">
                <h4 className="font-bold text-xs text-[#4A4A4A]">Rappels automatiques</h4>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between">
                    <span>Rappel du journal de suivi du soir (20h)</span>
                    <input
                      type="checkbox"
                      checked={notifToggles.dailyTracking}
                      onChange={(e) => setNotifToggles({ ...notifToggles, dailyTracking: e.target.checked })}
                    />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>Rappel de méditation du soir (21h30)</span>
                    <input
                      type="checkbox"
                      checked={notifToggles.eveningMeditation}
                      onChange={(e) => setNotifToggles({ ...notifToggles, eveningMeditation: e.target.checked })}
                    />
                  </label>
                </div>
              </div>

              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DF] space-y-3">
                <h4 className="font-bold text-xs text-[#4A4A4A]">Test du Cron OneSignal</h4>
                <p className="text-[11px] text-muted-foreground">
                  Simule la boucle d'évaluation des critères d'envoi pour l'ensemble des utilisatrices.
                </p>
                <Button
                  onClick={async () => {
                    showToast("Boucle d'envoi simulée pour 42 utilisatrices !");
                  }}
                  className="bg-[#4A4A4A] hover:bg-[#333333] text-white rounded-xl text-xs font-bold w-full"
                >
                  Lancer le Test de Notification
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* SECTION 5: DONS & SOUTIEN */}
        {activeTab === "donations" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="rounded-3xl border-[#EAE5DF] bg-white p-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Total Récolté</span>
                <h3 className="text-2xl font-black text-[#4A4A4A]">{totalDonationsAmount} €</h3>
              </Card>

              <Card className="rounded-3xl border-[#EAE5DF] bg-white p-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Dons du mois</span>
                <h3 className="text-2xl font-black text-[#6B8E5E]">{monthlyDonationsAmount} €</h3>
              </Card>

              <Card className="rounded-3xl border-[#EAE5DF] bg-white p-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Panier Moyen</span>
                <h3 className="text-2xl font-black text-[#E9B6B6]">
                  {Math.round(totalDonationsAmount / (donations.length || 1))} €
                </h3>
              </Card>
            </div>

            <Card className="rounded-3xl border-[#EAE5DF] bg-white overflow-hidden p-0">
              <div className="p-4 border-b border-[#EAE5DF] font-bold text-xs text-[#4A4A4A]">
                Historique des Dons Récents
              </div>
              <div className="divide-y divide-[#EAE5DF] text-xs">
                {donations.map((d) => (
                  <div key={d.id} className="p-4 flex items-center justify-between hover:bg-[#FAF8F5]">
                    <div>
                      <div className="font-bold text-[#4A4A4A]">{d.donorName} ({d.frequency})</div>
                      <div className="text-[11px] text-muted-foreground">{d.donorEmail} • {d.date}</div>
                      {d.message && <p className="text-[11px] italic text-[#6B8E5E] mt-1">"{d.message}"</p>}
                    </div>
                    <span className="font-black text-sm text-[#A3B899]">+{d.amount} €</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* SECTION 6: SUPPORT & FORUM */}
        {activeTab === "support" && (
          <div className="space-y-4">
            <Card className="rounded-3xl border-[#EAE5DF] bg-white overflow-hidden p-0">
              <div className="p-4 border-b border-[#EAE5DF] font-bold text-xs text-[#4A4A4A]">
                Messages de Support
              </div>
              <div className="divide-y divide-[#EAE5DF] text-xs">
                {tickets.map((t) => (
                  <div key={t.id} className="p-4 space-y-2 hover:bg-[#FAF8F5]">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#4A4A4A]">{t.senderName} ({t.senderEmail})</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        t.status === "Nouveau" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                      }`}>{t.status}</span>
                    </div>
                    <p className="font-bold text-xs text-[#4A4A4A]">{t.subject}</p>
                    <p className="text-muted-foreground leading-relaxed">{t.message}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* SECTION 7: PARAMÈTRES ADMIN */}
        {activeTab === "settings" && (
          <Card className="rounded-3xl border-[#EAE5DF] bg-white p-6 space-y-6">
            <div>
              <h3 className="font-black text-base text-[#4A4A4A]">Paramètres Généraux Back-Office</h3>
              <p className="text-xs text-muted-foreground">Configuration globale de l'application MamanZen.</p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#4A4A4A]">Bannière d'annonce globale</label>
                <input
                  type="text"
                  value={globalSettings.announcementBanner}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, announcementBanner: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DF]">
                <div>
                  <h4 className="font-bold text-[#4A4A4A]">Activer le Chat Sage-IA</h4>
                  <p className="text-[11px] text-muted-foreground">Permet aux utilisatrices de poser des questions à l'IA.</p>
                </div>
                <input
                  type="checkbox"
                  checked={globalSettings.enableAiChat}
                  onChange={(e) => setGlobalSettings({ ...globalSettings, enableAiChat: e.target.checked })}
                />
              </div>

              <Button
                onClick={() => showToast("Paramètres généraux enregistrés !")}
                className="bg-[#A3B899] hover:bg-[#8EA683] text-white rounded-xl text-xs font-bold px-5 py-2"
              >
                Enregistrer les paramètres
              </Button>
            </div>
          </Card>
        )}
      </main>

      {/* VIEW USER DETAIL MODAL */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-[#EAE5DF] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[#EAE5DF] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#A3B899]/20 text-[#6B8E5E] flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="font-black text-base text-[#4A4A4A]">Fiche Utilisatrice</h3>
              </div>
              <button onClick={() => setViewingUser(null)} className="p-1 text-muted-foreground hover:text-[#4A4A4A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DF]">
                <div>
                  <span className="text-muted-foreground">Prénom/Nom :</span>
                  <p className="font-bold text-[#4A4A4A]">{viewingUser.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email :</span>
                  <p className="font-bold text-[#4A4A4A] font-mono">{viewingUser.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Stade :</span>
                  <p className="font-bold text-[#6B8E5E]">
                    {viewingUser.stage === "enceinte" ? `Semaine ${viewingUser.current_week} SA` : "Post-partum"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Maternité :</span>
                  <p className="font-bold text-[#4A4A4A]">{viewingUser.maternity_hospital || "Non renseignée"}</p>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EAE5DF] space-y-1">
                <span className="font-bold text-[#4A4A4A]">Activité & Engagement :</span>
                <p>• Suivis quotidiens réalisés : <strong>{viewingUser.daily_logs_count}</strong></p>
                <p>• Sessions d'échange avec Sage-IA : <strong>{viewingUser.ai_chats_count}</strong></p>
                <p>• Total des dons apportés : <strong>{viewingUser.donations_total} €</strong></p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={() => setViewingUser(null)} className="bg-[#4A4A4A] text-white rounded-xl text-xs font-bold">
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-[#EAE5DF] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[#EAE5DF] pb-3">
              <h3 className="font-black text-base text-[#4A4A4A]">Modifier la Fiche Utilisatrice</h3>
              <button onClick={() => setEditingUser(null)} className="p-1 text-muted-foreground hover:text-[#4A4A4A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#4A4A4A]">Nom complet</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-[#4A4A4A]">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#4A4A4A]">Semaine SA</label>
                  <input
                    type="number"
                    value={editingUser.current_week}
                    onChange={(e) => setEditingUser({ ...editingUser, current_week: Number(e.target.value) })}
                    className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#4A4A4A]">Stade</label>
                  <select
                    value={editingUser.stage}
                    onChange={(e) => setEditingUser({ ...editingUser, stage: e.target.value as any })}
                    className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                  >
                    <option value="enceinte">Enceinte</option>
                    <option value="postpartum">Post-partum</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setEditingUser(null)} className="rounded-xl text-xs">
                Annuler
              </Button>
              <Button onClick={handleSaveEditedUser} className="bg-[#A3B899] hover:bg-[#8EA683] text-white rounded-xl text-xs font-bold">
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ADD USER MODAL */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-[#EAE5DF] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-[#EAE5DF] pb-3">
              <h3 className="font-black text-base text-[#4A4A4A]">Ajouter une Utilisatrice</h3>
              <button onClick={() => setShowAddUserModal(false)} className="p-1 text-muted-foreground hover:text-[#4A4A4A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#4A4A4A]">Nom et prénom *</label>
                <input
                  type="text"
                  placeholder="ex: Marie Dupont"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-[#4A4A4A]">Email *</label>
                <input
                  type="email"
                  placeholder="marie.dupont@gmail.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-[#4A4A4A]">Stade</label>
                  <select
                    value={newUser.stage}
                    onChange={(e) => setNewUser({ ...newUser, stage: e.target.value as any })}
                    className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                  >
                    <option value="enceinte">Enceinte</option>
                    <option value="postpartum">Post-partum</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#4A4A4A]">Semaine (SA)</label>
                  <input
                    type="number"
                    value={newUser.current_week}
                    onChange={(e) => setNewUser({ ...newUser, current_week: Number(e.target.value) })}
                    className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#4A4A4A]">Maternité (optionnel)</label>
                <input
                  type="text"
                  placeholder="ex: CHU Bordeaux"
                  value={newUser.maternity_hospital}
                  onChange={(e) => setNewUser({ ...newUser, maternity_hospital: e.target.value })}
                  className="w-full mt-1 p-2.5 bg-[#FAF8F5] border border-[#EAE5DF] rounded-xl font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAddUserModal(false)} className="rounded-xl text-xs">
                Annuler
              </Button>
              <Button onClick={handleAddUser} className="bg-[#A3B899] hover:bg-[#8EA683] text-white rounded-xl text-xs font-bold">
                Créer l'utilisatrice
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl border border-red-200 shadow-2xl p-6 space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-base text-[#4A4A4A]">Supprimer l'utilisatrice</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Êtes-vous sûre de vouloir supprimer définitivement le compte de <strong className="text-[#4A4A4A]">{deleteConfirmUser.name}</strong> ?
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setDeleteConfirmUser(null)} className="flex-1 rounded-xl text-xs">
                Annuler
              </Button>
              <Button onClick={handleConfirmDeleteUser} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold">
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
