import { useState, useEffect } from "react";
import { Utensils, Droplets, Info, Search, Clock, Sparkles, CheckCircle2, ShieldAlert, Heart, Flame, ChevronRight, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MedicalDisclaimerBanner } from "@/components/MedicalDisclaimer";

interface Recipe {
  id: string;
  title: string;
  category: "anti-nausees" | "petit-dejeuner" | "repas" | "encas" | "hydratation";
  categoryLabel: string;
  prepTime: string;
  cookTime?: string;
  difficulty: "Facile" | "Très facile";
  icon: string;
  tag: string;
  tagColor: string;
  benefits: string;
  nutrients: string[];
  description: string;
  ingredients: string[];
  instructions: string[];
  trimester: "Tous trimestres" | "1er trimestre" | "2ème & 3ème trimestre" | "Post-partum & Allaitement";
}

const RECIPES: Recipe[] = [
  {
    id: "rec-1",
    title: "Smoothie Anti-Nausées Gingembre, Citron & Banane",
    category: "anti-nausees",
    categoryLabel: "Anti-nausées",
    prepTime: "5 min",
    difficulty: "Très facile",
    icon: "🥤",
    tag: "Spécial 1er Trimestre",
    tagColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
    benefits: "Le gingembre frais stoppe les réflexes nauséeux, la banane apporte du magnésium et protège l'estomac.",
    nutrients: ["Vitamine B6", "Magnésium", "Gingérols"],
    description: "La boisson fraîche idéale au réveil pour apaiser les nausées matinales et retrouver de l'énergie en douceur.",
    ingredients: [
      "1/2 banane bien mûre",
      "1 cm de racine de gingembre frais râpé",
      "Le jus d'un demi-citron jaune bio",
      "150ml d'eau de coco ou eau minérale fraîche",
      "3 glaçons",
      "1 cuillère à café de miel doux (optionnel)"
    ],
    instructions: [
      "Épluchez et râpez finement le gingembre frais.",
      "Placez la banane, le jus de citron, le gingembre et l'eau de coco dans votre blender.",
      "Mixez pendant 45 secondes jusqu'à obtenir une texture fluide et mousseuse.",
      "Servez frais et buvez par petites gorgées lentes dès le lever."
    ],
    trimester: "1er trimestre"
  },
  {
    id: "rec-2",
    title: "Porridge Chaud Avoine, Banane & Graines de Chia",
    category: "petit-dejeuner",
    categoryLabel: "Petit-déjeuner",
    prepTime: "8 min",
    cookTime: "5 min",
    difficulty: "Facile",
    icon: "🥣",
    tag: "Satiété & Fibre",
    tagColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    benefits: "Évite les fringales de 11h, stabilise la glycémie et apporte du fer végétal doux pour le transit.",
    nutrients: ["Fibres solubles", "Fer", "Calcium", "Oméga-3"],
    description: "Un petit-déjeuner réconfortant et crémeux qui prévient la constipation fréquente durant la grossesse.",
    ingredients: [
      "40g de flocons d'avoine complets",
      "200ml de lait d'amande ou lait entier pasteurisé",
      "1 cuillère à soupe de graines de chia",
      "1/2 banane coupée en rondelles",
      "1 poignée de myrtilles fraîches",
      "1 cuillère à café d'amandes effilochées"
    ],
    instructions: [
      "Dans une casserole, mélanger l'avoine, le lait et les graines de chia.",
      "Faire chauffer à feu doux pendant 5 minutes en remuant régulièrement avec une cuillère en bois.",
      "Verser le porridge crémeux dans un bol.",
      "Disposer joliment les rondelles de banane, les myrtilles et parsemer d'amandes effilochées."
    ],
    trimester: "Tous trimestres"
  },
  {
    id: "rec-3",
    title: "Buddha Bowl Avocat, Quinoa, Épinards & Œuf Poché",
    category: "repas",
    categoryLabel: "Repas équilibré",
    prepTime: "15 min",
    cookTime: "10 min",
    difficulty: "Facile",
    icon: "🥗",
    tag: "Riche en Folates & Fer",
    tagColor: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
    benefits: "L'acide folique (B9) est indispensable au développement du tube neural de bébé. L'œuf bien cuit apporte des protéines complètes.",
    nutrients: ["Acide folique (B9)", "Fer végétal", "Protéines", "Bons lipides"],
    description: "Un déjeuner nourrissant, très coloré et plein de fraîcheur, cuisiné avec des ingrédients ultra sûrs.",
    ingredients: [
      "60g de quinoa cuit",
      "1 poignée de jeunes pousses d'épinards bien lavées",
      "1/2 avocat bien mûr",
      "1 œuf bio (cuit dur ou bien poché à cœur)",
      "1 cuillère à soupe de graines de courge grillées",
      "Assaisonnement : 1 c.a.s d'huile de colza, jus de citron, pincée de sel"
    ],
    instructions: [
      "Laver soigneusement les épinards à l'eau claire additionnée d'un filet de vinaigre blanc.",
      "Faire cuire l'œuf afin que le jaune et le blanc soient parfaitement fermes et cuits.",
      "Dans un grand bol, disposer le quinoa tiède, les pousses d'épinards et le demi-avocat tranché.",
      "Ajouter l'œuf bien cuit coupé en deux.",
      "Arroser d'huile de colza (riche en oméga-3) et de jus de citron pour décupler l'absorption du fer."
    ],
    trimester: "Tous trimestres"
  },
  {
    id: "rec-4",
    title: "Velouté Réconfortant Potimarron, Lait de Coco & Curcuma",
    category: "repas",
    categoryLabel: "Repas équilibré",
    prepTime: "15 min",
    cookTime: "20 min",
    difficulty: "Facile",
    icon: "🍲",
    tag: "Digestion Douce",
    tagColor: "bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300",
    benefits: "Extrêmement facile à digérer pour les soirées où l'estomac est lourd ou compressé au 3ème trimestre.",
    nutrients: ["Bêta-carotène", "Potassium", "Anti-inflammatoire"],
    description: "Une soupe soyeuse et bien chaude pour apaiser la sphère digestive et réchauffer les futures mamans.",
    ingredients: [
      "500g de potimarron ou courge butternut",
      "100ml de lait de coco",
      "1 pincée de curcuma doux",
      "1 petite carotte bio",
      "1 cube de bouillon de légumes sans sel ajouté",
      "Graines de tournesol pour le dressage"
    ],
    instructions: [
      "Laver et couper le potimarron en dés (inutile d'éplucher si bio).",
      "Faire mijoter les morceaux de potimarron et carotte dans le bouillon pendant 20 minutes.",
      "Mixer très finement avec le lait de coco et le curcuma.",
      "Déguster chaud avec quelques graines de tournesol sur le dessus."
    ],
    trimester: "2ème & 3ème trimestre"
  },
  {
    id: "rec-5",
    title: "Energy Balls Dattes, Avoine & Puree d'Amande",
    category: "encas",
    categoryLabel: "Collation & En-cas",
    prepTime: "10 min",
    difficulty: "Très facile",
    icon: "🧆",
    tag: "Coup de Boost & Post-Partum",
    tagColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300",
    benefits: "Les dattes facilitent la maturation du col au 9ème mois et rechargent les réserves d'énergie lors des tétées d'allaitement.",
    nutrients: ["Magnésium", "Potassium", "Énergie durable"],
    description: "Des bouchées d'énergie saines à emporter dans la valise de maternité pour le travail et le post-partum.",
    ingredients: [
      "8 dattes Medjool dénoyautées",
      "50g de flocons d'avoine",
      "2 cuillères à soupe de purée d'amande complète",
      "1 cuillère à soupe de poudre de cacao cru sans sucre",
      "Noix de coco râpée (pour enrober)"
    ],
    instructions: [
      "Placer tous les ingrédients dans un hachoir ou robot culinaire.",
      "Mixer par impulsions jusqu'à obtenir une pâte homogène qui s'agglomère.",
      "Former 6 à 8 petites boules entre les paumes de vos mains.",
      "Rouler dans la noix de coco râpée et conserver au frais dans une boîte hermétique."
    ],
    trimester: "Post-partum & Allaitement"
  },
  {
    id: "rec-6",
    title: "Infusion Apaisante Mélisse, Fleur d'Oranger & Citron",
    category: "hydratation",
    categoryLabel: "Hydratation & Tisanes",
    prepTime: "5 min",
    difficulty: "Très facile",
    icon: "🫖",
    tag: "Sommeil & Anti-Stress",
    tagColor: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
    benefits: "100% sans caféine, calme les palpitations, les angoisses et facilite l'endormissement du soir.",
    nutrients: ["Huiles essentielles douces", "Hydratation optimale"],
    description: "Un rituel du soir doux pour déconnecter de la journée et apaiser le système nerveux.",
    ingredients: [
      "1 cuillère à soupe de feuilles de mélisse séchées (ou verveine)",
      "1 cuillère à café d'eau de fleur d'oranger",
      "1 tranche de citron bio",
      "250ml d'eau frémissante"
    ],
    instructions: [
      "Faire chauffer l'eau sans la porter à ébullition complète.",
      "Laisser infuser la mélisse pendant 7 à 10 minutes à couvert.",
      "Filtrer, ajouter la cuillère de fleur d'oranger et la rondelle de citron.",
      "Déguster tiède 30 minutes avant le coucher."
    ],
    trimester: "Tous trimestres"
  }
];

export default function Nutrition() {
  const [glasses, setGlasses] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("mamanzen_water");
    if (saved) setGlasses(parseInt(saved, 10));
  }, []);

  const addGlass = () => {
    const newAmount = Math.min(glasses + 1, 8);
    setGlasses(newAmount);
    localStorage.setItem("mamanzen_water", newAmount.toString());
  };

  const volume = (glasses * 0.25).toFixed(1);
  const percent = (glasses / 8) * 100;

  const filteredRecipes = RECIPES.filter((r) => {
    const matchesCategory = selectedCategory === "all" || r.category === selectedCategory;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 pb-20 animate-in fade-in duration-300">
      <MedicalDisclaimerBanner compact />

      {/* Header */}
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#4A4A4A] dark:text-[#E6E1DA]">
            Nutrition & Recettes Sérénité
          </h1>
          <span className="bg-[#A3B899]/20 text-[#A3B899] text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            100% Gratuit
          </span>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Recettes sûres, riches en nutriments essentiels et adaptées à chaque étape de votre maternité.
        </p>
      </header>

      {/* Hydration Tracker Card */}
      <Card className="rounded-3xl border-[#EAE5DF] dark:border-[#332E2A] bg-white dark:bg-[#201D1B] shadow-xs overflow-hidden">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center gap-5">
          <div className="w-14 h-14 bg-sky-100 dark:bg-sky-950/60 text-sky-500 rounded-2xl flex items-center justify-center shrink-0">
            <Droplets className="w-7 h-7" />
          </div>

          <div className="flex-1 w-full space-y-2">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span className="font-bold text-[#4A4A4A] dark:text-[#E6E1DA]">Suivi d'Hydratation du jour</span>
              <span className="font-semibold text-sky-600 dark:text-sky-400">{volume}L sur 2.0L conseillés</span>
            </div>
            <Progress value={percent} className="h-3 bg-sky-50 dark:bg-sky-950/40 [&>div]:bg-sky-400" />
            <p className="text-[11px] text-muted-foreground">
              Une bonne hydratation aide à renouveler le liquide amniotique et prévient les infections urinaires.
            </p>
          </div>

          <Button
            onClick={addGlass}
            disabled={glasses >= 8}
            className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl h-11 px-5 text-xs shrink-0 shadow-xs"
          >
            + 1 Verre (25 cl)
          </Button>
        </CardContent>
      </Card>

      {/* Search & Category Tabs */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un ingrédient, une recette ou un symptôme (ex: gingembre, fer, épinards)..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#201D1B] border border-[#EAE5DF] dark:border-[#332E2A] rounded-2xl text-xs sm:text-sm text-[#4A4A4A] dark:text-[#E6E1DA] focus:outline-none focus:ring-2 focus:ring-[#A3B899]"
          />
        </div>

        {/* Filter categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar text-xs">
          {[
            { id: "all", label: "Toutes les recettes", icon: "✨" },
            { id: "anti-nausees", label: "Anti-nausées", icon: "🍋" },
            { id: "petit-dejeuner", label: "Petit-déjeuner", icon: "🥣" },
            { id: "repas", label: "Repas équilibrés", icon: "🥗" },
            { id: "encas", label: "Collation & En-cas", icon: "🧆" },
            { id: "hydratation", label: "Tisanes & Boissons", icon: "🫖" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCategory === cat.id
                  ? "bg-[#A3B899] text-white shadow-xs"
                  : "bg-white dark:bg-[#201D1B] border border-[#EAE5DF] dark:border-[#332E2A] text-[#4A4A4A] dark:text-[#E6E1DA] hover:bg-[#FAFAF9] dark:hover:bg-[#2A2623]"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecipes.map((recipe) => (
          <Card
            key={recipe.id}
            onClick={() => setActiveRecipe(recipe)}
            className="rounded-3xl border border-[#EAE5DF] dark:border-[#332E2A] bg-white dark:bg-[#201D1B] shadow-xs hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col justify-between group"
          >
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2.5 bg-[#FAF8F5] dark:bg-[#2A2623] rounded-2xl shrink-0 group-hover:scale-110 transition-transform">
                    {recipe.icon}
                  </span>
                  <div>
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1 ${recipe.tagColor}`}>
                      {recipe.tag}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-[#4A4A4A] dark:text-[#E6E1DA] group-hover:text-[#A3B899] transition-colors leading-snug">
                      {recipe.title}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {recipe.description}
              </p>

              <div className="pt-2 border-t border-[#EAE5DF]/60 dark:border-[#332E2A] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#A3B899]" />
                    {recipe.prepTime}
                  </span>
                  <span>•</span>
                  <span className="font-medium text-[#A3B899]">{recipe.trimester}</span>
                </div>

                <span className="text-xs font-bold text-[#A3B899] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Voir la recette <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Food Safety Rules Banner */}
      <Card className="rounded-3xl border border-amber-200/70 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-950/20 shadow-xs">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>Règles d'or de sécurité alimentaire pendant la grossesse</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-amber-950 dark:text-amber-200">
            <div className="p-3 bg-white/80 dark:bg-[#201D1B]/80 rounded-2xl space-y-1">
              <p className="font-bold text-rose-700 dark:text-rose-400">🚫 Aliments strictement à éviter :</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-muted-foreground">
                <li>Viandes & poissons crus ou fumés (sushi, tartare)</li>
                <li>Fromages au lait cru & croûtes fleuries</li>
                <li>Œufs crus ou peu cuits (mayonnaise maison)</li>
                <li>Charcuteries non cuites & foies</li>
              </ul>
            </div>

            <div className="p-3 bg-white/80 dark:bg-[#201D1B]/80 rounded-2xl space-y-1">
              <p className="font-bold text-emerald-700 dark:text-emerald-400">✅ Réflexes bienveillants :</p>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-muted-foreground">
                <li>Bien laver fruits & légumes à l'eau claire</li>
                <li>Cuire la viande et le poisson à cœur (+70°C)</li>
                <li>Préférer les fromages pasteurisés</li>
                <li>Bien nettoyer votre réfrigérateur régulièrement</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recipe Details Modal */}
      {activeRecipe && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#201D1B] border border-[#EAE5DF] dark:border-[#332E2A] text-[#4A4A4A] dark:text-[#E6E1DA] rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#EAE5DF] dark:border-[#332E2A] pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 bg-[#FAF8F5] dark:bg-[#2A2623] rounded-2xl shrink-0">
                  {activeRecipe.icon}
                </span>
                <div>
                  <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-1 ${activeRecipe.tagColor}`}>
                    {activeRecipe.tag}
                  </span>
                  <h2 className="font-bold text-lg sm:text-xl leading-tight text-[#4A4A4A] dark:text-[#E6E1DA]">
                    {activeRecipe.title}
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setActiveRecipe(null)}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-[#2A2623] hover:bg-gray-200 dark:hover:bg-[#332E2A] transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Key Benefits */}
            <div className="p-3.5 bg-[#A3B899]/15 dark:bg-[#A3B899]/25 rounded-2xl border border-[#A3B899]/30 text-xs space-y-1">
              <p className="font-bold text-[#6B8E5E] dark:text-[#A3B899] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Bienfaits pour maman & bébé :</span>
              </p>
              <p className="text-[#4A4A4A] dark:text-[#E6E1DA] leading-relaxed">
                {activeRecipe.benefits}
              </p>
            </div>

            {/* Nutrients Pills */}
            <div className="flex flex-wrap gap-1.5">
              {activeRecipe.nutrients.map((n, i) => (
                <span key={i} className="text-[11px] font-bold px-2.5 py-1 bg-[#FAFAF9] dark:bg-[#2A2623] border border-[#EAE5DF] dark:border-[#3D3732] rounded-xl text-[#A3B899]">
                  ✦ {n}
                </span>
              ))}
            </div>

            {/* Ingredients */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-[#4A4A4A] dark:text-[#E6E1DA] flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#A3B899]" />
                <span>Ingrédients requis :</span>
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeRecipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-2 p-2 bg-[#FAF8F5] dark:bg-[#2A2623] rounded-xl">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A3B899] shrink-0" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preparation Steps */}
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-[#4A4A4A] dark:text-[#E6E1DA] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#A3B899]" />
                <span>Étapes de préparation :</span>
              </h3>
              <ol className="space-y-2.5 text-xs">
                {activeRecipe.instructions.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 p-3 bg-[#FAF8F5] dark:bg-[#2A2623] rounded-2xl">
                    <span className="w-5 h-5 bg-[#A3B899] text-white font-bold rounded-full flex items-center justify-center shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed text-[#4A4A4A] dark:text-[#E6E1DA]">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Button
              onClick={() => setActiveRecipe(null)}
              className="w-full bg-[#A3B899] hover:bg-[#8FA884] text-white font-bold rounded-2xl h-12 text-xs shadow-xs"
            >
              Fermer la recette
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
