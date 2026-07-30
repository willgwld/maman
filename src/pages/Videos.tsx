import React, { useState, useEffect } from "react";
import { PlayCircle, Clock, Heart, Search, X, ExternalLink, Sparkles, Filter, Youtube, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MedicalDisclaimerBanner } from "@/components/MedicalDisclaimer";

interface VideoItem {
  id: string;
  title: string;
  youtubeId: string;
  channel: string;
  duration: string;
  category: "yoga" | "respiration" | "audio" | "nutrition";
  description: string;
  level: string;
  thumbnailUrl?: string;
}

const YOUTUBE_VIDEOS: VideoItem[] = [
  {
    id: "vid-1",
    title: "Yoga Prénatal Doux : Soulager le Mal de Dos & les Hanches",
    youtubeId: "_x-a8q3_WdQ",
    channel: "Lucile Woodward",
    duration: "15:00",
    category: "yoga",
    level: "Tous trimestres",
    description: "Séance douce de yoga prénatal spécialement conçue pour libérer la colonne vertébrale, étirer les lombaires et soulager les douleurs de bassin."
  },
  {
    id: "vid-2",
    title: "Respiration & Sophrologie pour la Gestion des Contractions",
    youtubeId: "e_1Mv0z_JjU",
    channel: "La Maison des Maternelles",
    duration: "12:30",
    category: "respiration",
    level: "Préparation accouchement",
    description: "Techniques de souffle ventral et de respiration abdominale guidées par une sage-femme pour aborder le travail avec sérénité."
  },
  {
    id: "vid-3",
    title: "Méditation Guidée Grossesse : Connexion avec son Bébé",
    youtubeId: "YyS6_y3G8vA",
    channel: "Bulles de Sérénité",
    duration: "20:00",
    category: "audio",
    level: "Relaxation",
    description: "Un voyage sonore apaisant pour diminuer le stress, libérer l'ocytocine et créer une connexion profonde in utero."
  },
  {
    id: "vid-4",
    title: "Nutrition Grossesse : Que Manger pour Bébé et Maman ?",
    youtubeId: "7vG6j7l0x4M",
    channel: "Doctissimo Maman",
    duration: "10:15",
    category: "nutrition",
    level: "Conseils Diététique",
    description: "Guide nutritionnel complet : apports en fer, folates, vitamines, gestion des envies et aliments à éviter au fil des trimestres."
  },
  {
    id: "vid-5",
    title: "Assouplissement du Bassin & Mobilité en Fin de Grossesse",
    youtubeId: "4W2w8X3q3cE",
    channel: "Forme Maternité",
    duration: "18:20",
    category: "yoga",
    level: "2ème & 3ème trimestre",
    description: "Postures sur ballon et au sol pour préparer l'ouverture du bassin, relâcher les périnées tendus et faciliter la descente du bébé."
  },
  {
    id: "vid-6",
    title: "Sophrologie Audio : Sommeil Réparateur pour Future Maman",
    youtubeId: "6vK1eW_q3dM",
    channel: "Sérénité Maternelle",
    duration: "25:00",
    category: "audio",
    level: "Sommeil & Anxiété",
    description: "Séance audio de relaxation guidée pour calmer l'esprit, chasser l'insomnie et retrouver un sommeil réparateur."
  },
  {
    id: "vid-7",
    title: "Exercices de Renforcement Doux du Périnée & Maintien Postural",
    youtubeId: "3VpYJ0Q5n1o",
    channel: "Physio Maternité",
    duration: "14:45",
    category: "respiration",
    level: "Renforcement",
    description: "Exercices physiologiques adaptés pour protéger le dos, soutenir le poids du ventre et préserver le plancher pelvien."
  },
  {
    id: "vid-8",
    title: "Gestion des Nausées & Fatigue du 1er Trimestre",
    youtubeId: "9c8s12S3fQ8",
    channel: "Conseil Sage-Femme",
    duration: "08:50",
    category: "nutrition",
    level: "1er trimestre",
    description: "Conseils naturels et habitudes alimentaires anti-nausées : gingembre, petits repas fractionnés et hydratation optimale."
  }
];

export default function Videos() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [customYoutubeQuery, setCustomYoutubeQuery] = useState<string>("");

  useEffect(() => {
    const savedFavs = localStorage.getItem("mamanzen_fav_videos");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {}
    }
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (favorites.includes(id)) {
      updated = favorites.filter((fav) => fav !== id);
    } else {
      updated = [...favorites, id];
    }
    setFavorites(updated);
    localStorage.setItem("mamanzen_fav_videos", JSON.stringify(updated));
  };

  const filteredVideos = YOUTUBE_VIDEOS.filter((video) => {
    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "favorites" && favorites.includes(video.id)) ||
      video.category === activeCategory;

    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channel.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleCustomSearchOnYoutube = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customYoutubeQuery.trim()) return;
    const query = encodeURIComponent(`grossesse ${customYoutubeQuery}`);
    window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
  };

  return (
    <div className="flex flex-col gap-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <MedicalDisclaimerBanner compact />

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-[#4A4A4A]">Vidéos & Audios YouTube</h1>
            <span className="bg-[#A3B899]/20 text-[#6B8E5E] text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              100% Gratuit
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            Séances sélectionnées de yoga prénatal, respiration, méditation et nutrition grossesse.
          </p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher par mot-clé (dos, contractions, sommeil, respiration, nutrition)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-border/70 rounded-2xl text-sm outline-none focus:border-[#A3B899] focus:ring-1 focus:ring-[#A3B899] shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#4A4A4A]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          onClick={() => setActiveCategory("all")}
          className={`rounded-full text-xs font-bold px-4 py-2 h-9 ${
            activeCategory === "all" ? "bg-[#4A4A4A] text-white" : "border-border/60"
          }`}
        >
          Tout voir
        </Button>

        <Button
          variant={activeCategory === "yoga" ? "default" : "outline"}
          onClick={() => setActiveCategory("yoga")}
          className={`rounded-full text-xs font-bold px-4 py-2 h-9 ${
            activeCategory === "yoga" ? "bg-[#A3B899] text-white" : "border-border/60"
          }`}
        >
          🧘‍♀️ Yoga Prénatal
        </Button>

        <Button
          variant={activeCategory === "respiration" ? "default" : "outline"}
          onClick={() => setActiveCategory("respiration")}
          className={`rounded-full text-xs font-bold px-4 py-2 h-9 ${
            activeCategory === "respiration" ? "bg-[#A3B899] text-white" : "border-border/60"
          }`}
        >
          🌬️ Respiration & Accouchement
        </Button>

        <Button
          variant={activeCategory === "audio" ? "default" : "outline"}
          onClick={() => setActiveCategory("audio")}
          className={`rounded-full text-xs font-bold px-4 py-2 h-9 ${
            activeCategory === "audio" ? "bg-[#E9B6B6] text-white" : "border-border/60"
          }`}
        >
          🎧 Audios & Méditation
        </Button>

        <Button
          variant={activeCategory === "nutrition" ? "default" : "outline"}
          onClick={() => setActiveCategory("nutrition")}
          className={`rounded-full text-xs font-bold px-4 py-2 h-9 ${
            activeCategory === "nutrition" ? "bg-[#A3B899] text-white" : "border-border/60"
          }`}
        >
          🥗 Nutrition & Conseils
        </Button>

        <Button
          variant={activeCategory === "favorites" ? "default" : "outline"}
          onClick={() => setActiveCategory("favorites")}
          className={`rounded-full text-xs font-bold px-4 py-2 h-9 gap-1.5 ${
            activeCategory === "favorites" ? "bg-[#E9B6B6] text-white" : "border-border/60 text-[#E9B6B6]"
          }`}
        >
          <Heart className="w-3.5 h-3.5 fill-current" />
          Mes Favoris ({favorites.length})
        </Button>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-border/60 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/60 bg-[#FAFAF9]">
              <div className="flex items-center gap-2 truncate pr-4">
                <Youtube className="w-5 h-5 text-red-500 shrink-0" />
                <h3 className="font-bold text-sm md:text-base text-[#4A4A4A] truncate">{activeVideo.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-2 rounded-xl text-muted-foreground hover:bg-gray-200/60"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded YouTube Iframe */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Content Details */}
            <div className="p-5 overflow-y-auto space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-[#6B8E5E]">{activeVideo.channel}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activeVideo.duration}</span>
                    <span>•</span>
                    <span>{activeVideo.level}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl bg-[#FAFAF9] border border-border/70 hover:bg-gray-100 text-[#4A4A4A]"
                  >
                    Ouvrir sur YouTube <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Button
                    onClick={(e) => toggleFavorite(activeVideo.id, e)}
                    variant="outline"
                    className="rounded-xl h-9 text-xs font-bold gap-1 border-border/70"
                  >
                    <Heart className={`w-3.5 h-3.5 ${favorites.includes(activeVideo.id) ? "fill-[#E9B6B6] text-[#E9B6B6]" : ""}`} />
                    {favorites.includes(activeVideo.id) ? "Favori" : "Ajouter"}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-[#4A4A4A] leading-relaxed bg-[#FAF8F5] p-3 rounded-2xl border border-border/40">
                {activeVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-border/60 p-6 space-y-3">
          <p className="text-muted-foreground text-sm">Aucune vidéo trouvée pour votre recherche.</p>
          <Button onClick={() => { setActiveCategory("all"); setSearchQuery(""); }} variant="outline" className="rounded-xl">
            Réinitialiser les filtres
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredVideos.map((video) => {
            const isFav = favorites.includes(video.id);
            return (
              <Card
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="rounded-[2rem] border-border/50 shadow-xs hover:shadow-md transition-all overflow-hidden group cursor-pointer bg-white"
              >
                {/* Thumbnail Container */}
                <div className="h-48 bg-slate-900 relative flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback image if thumbnail fails
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10" />
                  
                  {/* Play Overlay */}
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center z-20 shadow-lg group-hover:scale-110 transition-transform">
                    <PlayCircle className="w-10 h-10 text-red-600 fill-red-600/10" />
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/75 text-white text-[11px] font-bold px-2.5 py-1 rounded-md z-20 flex items-center gap-1 backdrop-blur-xs">
                    <Clock className="w-3 h-3" /> {video.duration}
                  </div>

                  {/* Channel Tag */}
                  <div className="absolute top-3 left-3 bg-white/90 text-[#4A4A4A] text-[10px] font-bold px-2.5 py-1 rounded-full z-20 backdrop-blur-xs">
                    {video.channel}
                  </div>
                </div>

                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-base text-[#4A4A4A] leading-snug group-hover:text-[#6B8E5E] transition-colors">
                      {video.title}
                    </h3>
                    <button
                      onClick={(e) => toggleFavorite(video.id, e)}
                      className="p-1.5 rounded-full hover:bg-gray-100 transition-colors shrink-0"
                      title={isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
                    >
                      <Heart className={`w-5 h-5 ${isFav ? "fill-[#E9B6B6] text-[#E9B6B6]" : "text-muted-foreground"}`} />
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {video.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-bold text-[#6B8E5E] bg-[#A3B899]/15 px-2.5 py-1 rounded-lg">
                      {video.level}
                    </span>
                    <span className="text-xs font-bold text-[#E9B6B6] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Regarder la vidéo →
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* YouTube Custom Search Section */}
      <Card className="rounded-[2rem] border-border/50 shadow-xs bg-gradient-to-r from-[#FAF8F5] to-white p-6 mt-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h3 className="font-bold text-base text-[#4A4A4A] flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-500" />
              Rechercher un autre sujet sur YouTube
            </h3>
            <p className="text-xs text-muted-foreground">
              Trouvez n'importe quelle vidéo de grossesse (ex: périnée, allaitement, chambre bébé, contraction).
            </p>
          </div>

          <form onSubmit={handleCustomSearchOnYoutube} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Ex: massage périnée..."
              value={customYoutubeQuery}
              onChange={(e) => setCustomYoutubeQuery(e.target.value)}
              className="px-4 py-2.5 bg-white border border-border/70 rounded-xl text-xs outline-none focus:border-[#A3B899] w-full md:w-56"
            />
            <Button type="submit" className="bg-[#4A4A4A] hover:bg-black text-white text-xs font-bold px-4 rounded-xl shrink-0 gap-1.5">
              Chercher <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
