import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { 
  Heart, 
  Sparkles, 
  Activity, 
  ShieldCheck, 
  Check, 
  ArrowRight,
  Stethoscope,
  Smile,
  ListTodo,
  Baby,
  Brain,
  MessageSquareHeart,
  ChevronDown,
  Star,
  ChevronRight,
  Apple,
  ShieldAlert,
  Clock,
  Lock,
  Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock weekly preview data for the interactive showcase
const WEEKLY_PREVIEWS = [
  {
    week: 8,
    title: "Semaine 8 (10 SA)",
    size: "Une framboise 🍓",
    length: "1.6 cm",
    weight: "1 g",
    babyInfo: "Ses petits bras et ses jambes se forment. Les traits de son visage s'esquissent doucement.",
    mamaTip: "Les nausées peuvent atteindre leur pic. Privilégie de petites collations régulières et du gingembre.",
    color: "from-pink-100 to-rose-50"
  },
  {
    week: 12,
    title: "Semaine 12 (14 SA)",
    size: "Un citron vert 🍋",
    length: "5.4 cm",
    weight: "14 g",
    babyInfo: "La fin du premier trimestre approche ! Les organes vitaux sont tous en place et commencent à fonctionner.",
    mamaTip: "Un regain d'énergie s'annonce bientôt. C'est le bon moment pour planifier votre première échographie.",
    color: "from-amber-100 to-yellow-50"
  },
  {
    week: 20,
    title: "Semaine 20 (22 SA)",
    size: "Une petite courgette 🥒",
    length: "25 cm",
    weight: "300 g",
    babyInfo: "C'est la mi-grossesse ! Bébé entend les sons extérieurs et réagit à ta voix et aux caresses.",
    mamaTip: "Tu peux commencer à sentir de doux petits coups. Prends un moment de calme chaque soir pour te connecter.",
    color: "from-emerald-100 to-teal-50"
  },
  {
    week: 28,
    title: "Semaine 28 (30 SA)",
    size: "Un aubergine 🍆",
    length: "37 cm",
    weight: "1 kg",
    babyInfo: "Bébé ouvre les yeux et commence à rêver ! Son cerveau se développe à très grande vitesse.",
    mamaTip: "La fatigue peut réapparaître. Pense aux exercices de respiration de MamanZen pour apaiser les jambes lourdes.",
    color: "from-purple-100 to-indigo-50"
  },
  {
    week: 36,
    title: "Semaine 36 (38 SA)",
    size: "Un melon cantaloup 🍈",
    length: "47 cm",
    weight: "2.6 kg",
    babyInfo: "Bébé prend du poids et se prépare pour le grand jour. Il s'entraîne à téter et à respirer.",
    mamaTip: "Vérifie ta valise de maternité grâce à nos checklists dédiées et pratique la cohérence cardiaque.",
    color: "from-orange-100 to-amber-50"
  }
];

const FAQS = [
  {
    question: "MamanZen est-il vraiment 100% gratuit ?",
    answer: "Oui, absolument ! Toutes les fonctionnalités essentielles de MamanZen (suivi de symptômes, conseils hebdomadaires, checklists charge mentale, assistant IA et séances de relaxation) sont gratuites pour toutes les futures mamans. Nous proposons simplement un espace de don libre pour celles qui souhaitent soutenir le projet et nous aider à financer les serveurs."
  },
  {
    question: "L'application remplace-t-elle mon suivi médical ?",
    answer: "Non. MamanZen est une application de soutien au bien-être et au quotidien prénatal. Elle ne remplace en aucun cas votre médecin, sage-femme ou gynécologue. En cas de douleurs, saignements, fièvre ou doute médical, vous devez consulter immédiatement un professionnel de santé."
  },
  {
    question: "Comment mes données de santé sont-elles protégées ?",
    answer: "La confidentialité de vos données est notre priorité absolue. Vos informations sont chiffrées selon les normes RGPD les plus strictes. Nous ne vendons, n'échangeons et ne partageons JAMAIS vos données personnelles ou médicales à des tiers."
  },
  {
    question: "Puis-je utiliser l'application sur mon téléphone sans télécharger d'application ?",
    answer: "Oui ! MamanZen est une PWA (Progressive Web App). Vous pouvez l'utiliser directement dans votre navigateur web ou l'ajouter en un clic sur l'écran d'accueil de votre iPhone ou Android comme une véritable application native."
  },
  {
    question: "Comment fonctionne l'assistant Sage-Femme IA ?",
    answer: "Notre assistant IA est entraîné sur des guides de bien-être prénatal validés. Il répond instantanément à vos questions du quotidien (nutrition, symptômes courants, astuces confort, préparation). Il garde toujours une posture prévenante et vous rappelle de consulter en cas de signe d'alerte."
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [selectedWeekIdx, setSelectedWeekIdx] = useState(1); // Default week 12
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (loading) return;

    if (user) {
      const isOnboardingDone = Boolean(user.user_metadata?.onboarding_completed) || localStorage.getItem("mamanzen_onboarding_completed") === "true";
      if (isOnboardingDone) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  const currentPreview = WEEKLY_PREVIEWS[selectedWeekIdx];

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#4A4A4A] font-sans overflow-x-hidden selection:bg-[#E9B6B6] selection:text-white">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 right-0 bg-[#FAFAF9]/95 backdrop-blur-md z-50 border-b border-[#F4F1ED]">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-[#E9B6B6] to-[#A3B899] rounded-xl sm:rounded-2xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 sm:w-6 sm:h-6 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-2xl font-bold tracking-tight text-[#4A4A4A] leading-none">MamanZen</span>
              <span className="text-[10px] text-[#A3B899] font-medium tracking-wide uppercase -mt-0.5 hidden sm:inline">Grossesse & Sérénité</span>
            </div>
          </Link>

          <div className="hidden md:flex gap-8 items-center font-medium text-sm text-[#7D7D7D]">
            <a href="#features" className="hover:text-[#E9B6B6] transition-colors">Fonctionnalités</a>
            <a href="#week-preview" className="hover:text-[#E9B6B6] transition-colors">Semaine par semaine</a>
            <a href="#pricing" className="hover:text-[#E9B6B6] transition-colors">Tarifs & Dons</a>
            <a href="#faq" className="hover:text-[#E9B6B6] transition-colors">FAQ</a>
          </div>

          <div className="flex gap-1.5 sm:gap-3 items-center shrink-0">
            <Link to="/auth?mode=login">
              <Button variant="ghost" className="text-[#4A4A4A] hover:bg-[#F4F1ED] rounded-xl text-xs sm:text-sm px-2.5 sm:px-4 h-8 sm:h-10 font-bold">
                Connexion
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button className="bg-[#E9B6B6] hover:bg-[#D9A5A5] text-white rounded-xl text-xs sm:text-sm px-3 sm:px-5 h-8 sm:h-10 font-bold shadow-xs transition-all hover:scale-[1.02]">
                <span>Commencer</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 hidden xs:inline-block" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Decorative Gradient Orbs */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#E9B6B6]/20 via-[#F4F1ED] to-[#A3B899]/20 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F1ED] border border-[#E9B6B6]/30 text-[#4A4A4A] text-xs sm:text-sm font-semibold mb-6 shadow-2xs animate-fade-in">
            <Sparkles className="w-4 h-4 text-[#A3B899]" />
            <span>L'application de grossesse douce & 100% gratuite</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#4A4A4A] mb-6 leading-[1.12]">
            Ton accompagnement <span className="text-[#E9B6B6] italic font-serif">doux et personnalisé</span> pendant 9 mois
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-[#6B6B6B] mb-8 max-w-2xl leading-relaxed">
            Suivi quotidien des symptômes, guide semaine par semaine, assistant IA sage-femme et checklists charge mentale pour vivre ta grossesse sereinement.
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto mb-10">
            <Link to="/onboarding" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-13 sm:h-14 bg-[#E9B6B6] hover:bg-[#D9A5A5] text-white rounded-2xl text-base sm:text-lg px-8 font-bold shadow-md hover:shadow-lg transition-all hover:scale-[1.02]">
                Commencer gratuitement
              </Button>
            </Link>
            <a href="#week-preview" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto h-13 sm:h-14 border-[#E9B6B6]/60 text-[#4A4A4A] hover:bg-[#F4F1ED] rounded-2xl text-base sm:text-lg px-8 font-semibold transition-all">
                Voir l'aperçu par semaine
              </Button>
            </a>
          </div>

          {/* Social Proof / Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-[#7D7D7D] pt-4 border-t border-[#F4F1ED]">
            <div className="flex items-center gap-1.5 font-medium">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-bold text-[#4A4A4A]">4.9/5</span> (10 000+ mamans)
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#A3B899]" />
              <span>Conforme RGPD & Données Sécurisées</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#A3B899]" />
              <span>Sans pub & Sans abonnement masqué</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Weekly Preview Section */}
      <section id="week-preview" className="py-16 sm:py-24 bg-white border-y border-[#F4F1ED] px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="bg-[#A3B899]/20 text-[#6B8B5B] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
              Aperçu en direct
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#4A4A4A] mb-3">
              Découvre l'évolution de ta grossesse
            </h2>
            <p className="text-[#7D7D7D] text-base sm:text-lg">
              Sélectionne une semaine ci-dessous pour apercevoir ce que MamanZen te réserve au quotidien.
            </p>
          </div>

          {/* Week selector buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
            {WEEKLY_PREVIEWS.map((pw, idx) => (
              <button
                key={pw.week}
                onClick={() => setSelectedWeekIdx(idx)}
                className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  selectedWeekIdx === idx
                    ? "bg-[#E9B6B6] text-white shadow-md scale-105"
                    : "bg-[#FAFAF9] text-[#7D7D7D] hover:bg-[#F4F1ED] hover:text-[#4A4A4A]"
                }`}
              >
                <Baby className="w-4 h-4" />
                <span>Semaine {pw.week}</span>
              </button>
            ))}
          </div>

          {/* Week Card Showcase */}
          <div className={`p-6 sm:p-10 rounded-3xl bg-gradient-to-br ${currentPreview.color} border border-gray-100 shadow-sm transition-all duration-300`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-xs text-xs font-bold text-[#4A4A4A] mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-[#E9B6B6]" />
                  <span>{currentPreview.title}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#4A4A4A] mb-4">
                  Taille du bébé : <span className="text-[#E9B6B6]">{currentPreview.size}</span>
                </h3>

                <div className="flex gap-4 mb-6 text-sm">
                  <div className="bg-white/90 px-3.5 py-2 rounded-xl shadow-2xs">
                    <span className="text-[#7D7D7D] block text-xs">Taille moy.</span>
                    <span className="font-bold text-[#4A4A4A]">{currentPreview.length}</span>
                  </div>
                  <div className="bg-white/90 px-3.5 py-2 rounded-xl shadow-2xs">
                    <span className="text-[#7D7D7D] block text-xs">Poids moy.</span>
                    <span className="font-bold text-[#4A4A4A]">{currentPreview.weight}</span>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-[#4A4A4A]">
                  <div className="bg-white/80 p-4 rounded-2xl shadow-2xs">
                    <span className="font-bold text-[#E9B6B6] block mb-1">👶 Développement du bébé</span>
                    <p className="text-[#555] leading-relaxed">{currentPreview.babyInfo}</p>
                  </div>
                  <div className="bg-white/80 p-4 rounded-2xl shadow-2xs">
                    <span className="font-bold text-[#A3B899] block mb-1">🌿 Conseil maman du jour</span>
                    <p className="text-[#555] leading-relaxed">{currentPreview.mamaTip}</p>
                  </div>
                </div>
              </div>

              {/* App UI Preview Card */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E9B6B6]/20 text-[#E9B6B6] flex items-center justify-center font-bold text-xs">
                      MZ
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#4A4A4A]">Tableau de bord MamanZen</h4>
                      <p className="text-[11px] text-gray-400">Aujourd'hui • Suivi personnalisé</p>
                    </div>
                  </div>
                  <span className="text-xs bg-[#A3B899]/20 text-[#55704d] font-bold px-2.5 py-1 rounded-full">
                    S{currentPreview.week}
                  </span>
                </div>

                <div className="bg-[#FAFAF9] p-3.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 block mb-1.5">Mon état d'esprit</span>
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-rose-50 text-rose-600 px-2.5 py-1 rounded-lg font-medium">🌸 Calme & Sereine</span>
                    <span className="text-gray-400">Sommeil: 8h30 😴</span>
                  </div>
                </div>

                <div className="bg-[#FAFAF9] p-3.5 rounded-xl border border-gray-100">
                  <span className="text-xs font-bold text-gray-500 block mb-1.5">Assistant Sage-Femme IA</span>
                  <p className="text-xs text-gray-600 italic">"Bonjour ! Avez-vous pensé à vous étirer doucement 5 minutes ce matin ?"</p>
                </div>

                <Link to="/onboarding">
                  <Button className="w-full bg-[#4A4A4A] hover:bg-[#333] text-white rounded-xl text-xs font-bold h-10 mt-1">
                    Découvrir ton suivi complet →
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 sm:py-28 bg-[#FAFAF9] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#4A4A4A] mb-4">
              Tout pour alléger ta grossesse et ta charge mentale
            </h2>
            <p className="text-[#7D7D7D] text-base sm:text-lg">
              Une suite d'outils bienveillants pensés pour t'apporter apaisement, réponses et organisation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xs hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-[#E9B6B6]/20 rounded-2xl flex items-center justify-center mb-6 text-[#E9B6B6]">
                <Activity className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#4A4A4A] mb-3">Suivi Santé & Symptômes</h3>
              <p className="text-[#7D7D7D] text-sm leading-relaxed mb-4">
                Enregistre en 30 secondes tes symptômes (nausées, fatigue, contractions), ton humeur et ton sommeil pour identifier ce qui te fait du bien.
              </p>
              <ul className="space-y-2 text-xs text-[#555]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#A3B899]" /> Historique visuel des 30 derniers jours</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#A3B899]" /> Conseils ciblés selon tes symptômes</li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xs hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-[#A3B899]/20 rounded-2xl flex items-center justify-center mb-6 text-[#A3B899]">
                <MessageSquareHeart className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#4A4A4A] mb-3">Assistant Sage-Femme IA</h3>
              <p className="text-[#7D7D7D] text-sm leading-relaxed mb-4">
                Une question à 22h sur une tisane autorisée ou une douleur articulaire ? Notre IA spécialisée répond avec douceur et pertinence.
              </p>
              <ul className="space-y-2 text-xs text-[#555]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#A3B899]" /> Réponses instantanées 24h/24</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#A3B899]" /> Posture douce et prévenante</li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xs hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-[#F4F1ED] rounded-2xl flex items-center justify-center mb-6 text-[#4A4A4A]">
                <ListTodo className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#4A4A4A] mb-3">Checklists Charge Mentale</h3>
              <p className="text-[#7D7D7D] text-sm leading-relaxed mb-4">
                Valise de maternité, projet de naissance, achats essentiels et démarches administratives. Des listes prêtes à cocher.
              </p>
              <ul className="space-y-2 text-xs text-[#555]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#A3B899]" /> Listes classées par trimestre</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#A3B899]" /> Personnalisables à l'infini</li>
              </ul>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xs hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-500">
                <Brain className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#4A4A4A] mb-3">Relaxation & Sophrologie</h3>
              <p className="text-[#7D7D7D] text-sm leading-relaxed mb-4">
                Espace dédié à la méditation guidée, exercices de cohérence cardiaque prénatale et musiques douces pour apaiser le stress.
              </p>
              <ul className="space-y-2 text-xs text-[#555]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#A3B899]" /> Bruit blanc & sons de la nature</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#A3B899]" /> Séances courtes (3 à 10 min)</li>
              </ul>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xs hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
                <Apple className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#4A4A4A] mb-3">Nutrition & Recommandations</h3>
              <p className="text-[#7D7D7D] text-sm leading-relaxed mb-4">
                Sachez en un clin d'œil quels aliments sont sûrs ou déconseillés pendant la grossesse, avec des idées de recettes saines.
              </p>
              <ul className="space-y-2 text-xs text-[#555]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#A3B899]" /> Moteur de recherche d'aliments</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#A3B899]" /> Recettes anti-nausées</li>
              </ul>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xs hover:shadow-md transition-all">
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-6 text-[#E9B6B6]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#4A4A4A] mb-3">Mode Compagnon & Rappels</h3>
              <p className="text-[#7D7D7D] text-sm leading-relaxed mb-4">
                Possibilité d'activer des notifications douces (hydratation, rendez-vous) et d'engager le co-parent en toute simplicité.
              </p>
              <ul className="space-y-2 text-xs text-[#555]">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#A3B899]" /> Rappels paramétrables</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#A3B899]" /> Application installable en PWA</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 bg-[#F4F1ED] px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#4A4A4A] mb-4">
              Ce que disent les mamans qui l'utilisent
            </h2>
            <p className="text-[#7D7D7D] text-base sm:text-lg">
              Elles ont vécu une grossesse apaisée grâce à MamanZen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-2xs border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-[#4A4A4A] italic text-sm leading-relaxed mb-6">
                  "Les conseils de l'assistant IA pour mes nausées matinales au 1er trimestre m'ont sauvé mes matins ! L'application est d'une douceur apaisante."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-[#E9B6B6]/20 rounded-full flex items-center justify-center font-bold text-[#E9B6B6] text-sm">
                  C
                </div>
                <div>
                  <p className="font-bold text-sm text-[#4A4A4A]">Camille, 28 ans</p>
                  <p className="text-xs text-gray-400">Enceinte de 16 SA</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-2xs border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-[#4A4A4A] italic text-sm leading-relaxed mb-6">
                  "Enfin une application de grossesse sans publicité agressive ni graphiques anxiogènes. Les checklists pour la valise de maternité sont super bien pensées."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-[#A3B899]/20 rounded-full flex items-center justify-center font-bold text-[#A3B899] text-sm">
                  S
                </div>
                <div>
                  <p className="font-bold text-sm text-[#4A4A4A]">Sarah, 32 ans</p>
                  <p className="text-xs text-gray-400">Enceinte de 28 SA</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-2xs border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-[#4A4A4A] italic text-sm leading-relaxed mb-6">
                  "J'utilise la cohérence cardiaque le soir quand j'ai du mal à m'endormir. C'est magique. Merci pour cette application gratuite !"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 bg-[#E9B6B6]/20 rounded-full flex items-center justify-center font-bold text-[#E9B6B6] text-sm">
                  M
                </div>
                <div>
                  <p className="font-bold text-sm text-[#4A4A4A]">Marion, 35 ans</p>
                  <p className="text-xs text-gray-400">Maman d'un petit Léo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Free Model & Donations */}
      <section id="pricing" className="py-20 sm:py-28 bg-white px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="bg-[#A3B899]/20 text-[#55704d] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block">
              100% Accessible & Solidaire
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#4A4A4A] mb-4">
              Aucun abonnement forcé.
            </h2>
            <p className="text-[#7D7D7D] text-base sm:text-lg">
              Toutes les mamans méritent un suivi serein sans barrière financière.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Free Tier */}
            <div className="border border-[#F4F1ED] p-8 sm:p-10 rounded-3xl bg-[#FAFAF9] flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-4">
                  <Check className="w-3.5 h-3.5" /> Accès Gratuit Illimité
                </div>
                <h3 className="text-2xl font-bold text-[#4A4A4A] mb-2">MamanZen Gratuit</h3>
                <p className="text-sm text-[#7D7D7D] mb-6">Toutes les fonctionnalités essentielles débloquées.</p>
                <div className="mb-8">
                  <span className="text-4xl sm:text-5xl font-bold text-[#4A4A4A]">0 €</span>
                  <span className="text-gray-400 text-sm"> / pour toujours</span>
                </div>
                <ul className="space-y-3 mb-8 text-sm text-[#555]">
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#A3B899]" /> Suivi quotidien des symptômes & humeurs</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#A3B899]" /> Assistant Sage-Femme IA illimité</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#A3B899]" /> Checklists valise maternité & démarches</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#A3B899]" /> Guide nutritionnel & moteur d'aliments</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-[#A3B899]" /> Exercices de relaxation & musiques</li>
                </ul>
              </div>
              <Link to="/onboarding">
                <Button className="w-full h-12 rounded-2xl bg-[#4A4A4A] text-white hover:bg-[#333] font-bold text-sm">
                  Commencer maintenant
                </Button>
              </Link>
            </div>

            {/* Support / Donations Tier */}
            <div className="bg-gradient-to-br from-[#E9B6B6] to-[#d99f9f] p-8 sm:p-10 rounded-3xl text-white shadow-md flex flex-col justify-between relative">
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1">
                <Gift className="w-3.5 h-3.5" /> Solidaire
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-4">
                  💖 Soutien au projet
                </div>
                <h3 className="text-2xl font-bold mb-2">Espace Dons Libre</h3>
                <p className="text-sm text-white/90 mb-6">Aidez-nous à garder MamanZen 100% indépendant et sans publicité.</p>
                <div className="mb-8">
                  <span className="text-4xl sm:text-5xl font-bold">Don libre</span>
                  <span className="text-white/80 text-sm"> (à partir de 2 €)</span>
                </div>
                <ul className="space-y-3 mb-8 text-sm text-white/95">
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-white" /> Finance les serveurs et les requêtes IA</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-white" /> Garde l'application totalement gratuite pour toutes</li>
                  <li className="flex items-center gap-3"><Check className="w-5 h-5 text-white" /> Zéro revente de données personnelles</li>
                </ul>
              </div>
              <Link to="/dons">
                <Button className="w-full h-12 rounded-2xl bg-white text-[#E9B6B6] hover:bg-gray-50 font-bold text-sm shadow-sm">
                  Soutenir le projet 💖
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 sm:py-28 bg-[#FAFAF9] px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#4A4A4A] mb-3">Questions fréquentes</h2>
            <p className="text-[#7D7D7D] text-base sm:text-lg">Tout ce que vous devez savoir en toute transparence.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between font-bold text-[#4A4A4A] text-base sm:text-lg gap-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-[#E9B6B6] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-[#666] leading-relaxed border-t border-gray-50 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer CTA & Footer */}
      <footer className="bg-[#3A3A3A] text-white">
        <div className="py-20 px-4 sm:px-6 text-center max-w-4xl mx-auto border-b border-gray-700">
          <div className="w-12 h-12 bg-[#E9B6B6]/20 rounded-2xl flex items-center justify-center text-[#E9B6B6] mx-auto mb-6">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold mb-4">Prête à vivre 9 mois de douceur ?</h2>
          <p className="text-gray-300 text-base sm:text-xl mb-8 max-w-xl mx-auto">
            Rejoins MamanZen dès aujourd'hui et commence ton suivi personnalisé.
          </p>
          <Link to="/onboarding">
            <Button className="h-14 bg-[#E9B6B6] hover:bg-[#D9A5A5] text-white rounded-2xl text-lg px-8 font-bold shadow-lg hover:scale-105 transition-all">
              Créer mon espace gratuit
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-xs sm:text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#E9B6B6] rounded-lg flex items-center justify-center text-white">
              <Heart className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-bold text-white text-base">MamanZen</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/legal?tab=disclaimer" className="hover:text-[#E9B6B6] transition-colors">Avertissement Médical</Link>
            <Link to="/legal?tab=cgu" className="hover:text-white transition-colors">Mentions Légales & CGU</Link>
            <Link to="/legal?tab=privacy" className="hover:text-white transition-colors">Confidentialité (RGPD)</Link>
            <Link to="/dons" className="hover:text-white transition-colors">Soutenir MamanZen 💖</Link>
          </div>

          <div className="text-center md:text-right">
            © {new Date().getFullYear()} MamanZen. Fait avec amour pour les futures mamans.
          </div>
        </div>
      </footer>
    </div>
  );
}
