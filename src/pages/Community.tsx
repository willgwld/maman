import React, { useState, useEffect } from "react";
import { Users, MessageSquare, ShieldCheck, Heart, Search, Plus, Send, X, ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";

interface PostItem {
  id: string;
  author: string;
  authorInitial: string;
  title: string;
  content: string;
  category: string;
  likes: number;
  repliesCount: number;
  timeAgo: string;
  isLiked?: boolean;
}

const INITIAL_POSTS: PostItem[] = [];

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("Bien-être");

  useEffect(() => {
    const saved = localStorage.getItem("mamanzen_community_posts");
    if (saved) {
      try {
        setPosts(JSON.parse(saved));
      } catch (e) {
        setPosts(INITIAL_POSTS);
      }
    } else {
      setPosts(INITIAL_POSTS);
    }
  }, []);

  const currentUserName = user?.user_metadata?.name || user?.user_metadata?.full_name || "Maman";

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: PostItem = {
      id: "post_" + Date.now(),
      author: currentUserName,
      authorInitial: currentUserName.charAt(0).toUpperCase() || "M",
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      likes: 0,
      repliesCount: 0,
      timeAgo: "À l'instant",
      isLiked: false
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem("mamanzen_community_posts", JSON.stringify(updated));

    setNewTitle("");
    setNewContent("");
    setShowNewPostModal(false);
  };

  const handleToggleLike = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const currentlyLiked = Boolean(p.isLiked);
        return {
          ...p,
          likes: currentlyLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !currentlyLiked
        };
      }
      return p;
    });
    setPosts(updated);
    localStorage.setItem("mamanzen_community_posts", JSON.stringify(updated));
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === "Toutes" || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex flex-col gap-6 pb-16 animate-in fade-in duration-300 max-w-2xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-[#4A4A4A]">Communauté MamanZen</h1>
          <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2 mt-1">
            <ShieldCheck className="w-4 h-4 text-[#A3B899]" />
            Un espace d'échange chaleureux et 100% sécurisé entre mamans.
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-[#E9B6B6] to-[#D9A5A5] hover:from-[#D9A5A5] hover:to-[#C89494] rounded-2xl text-white font-bold h-11 px-5 shadow-xs transition-all shrink-0"
          onClick={() => setShowNewPostModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle discussion
        </Button>
      </header>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un sujet (ex: douleurs dos, accouchement, allaitement...)" 
          className="w-full h-11 bg-white border border-border/80 rounded-2xl pl-10 pr-4 text-xs outline-none focus:ring-2 focus:ring-[#E9B6B6] shadow-2xs transition-all"
        />
      </div>

      {/* Filtres par catégorie */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {["Toutes", "1er Trimestre", "2ème Trimestre", "3ème Trimestre", "Bien-être", "Préparation", "Post-partum"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === cat 
                ? "bg-[#4A4A4A] text-white shadow-2xs" 
                : "bg-white text-muted-foreground border border-border/60 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Liste des discussions */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card className="rounded-3xl border-border/50 bg-white p-8 text-center text-muted-foreground">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">Aucune discussion trouvée.</p>
            <p className="text-xs mt-1">Sois la première à partager une question ou un témoignage !</p>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className="rounded-3xl border-border/60 shadow-2xs hover:shadow-xs transition-all bg-white overflow-hidden">
              <CardContent className="p-5">
                <div className="flex gap-3.5">
                  <div className="w-10 h-10 bg-gradient-to-tr from-[#E9B6B6]/30 to-[#A3B899]/30 rounded-2xl flex items-center justify-center font-bold text-[#4A4A4A] shrink-0 text-sm">
                    {post.authorInitial}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#4A4A4A]">{post.author}</span>
                        <span className="text-[10px] text-muted-foreground">• {post.timeAgo}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#6B8E5E] bg-[#A3B899]/15 px-2.5 py-0.5 rounded-full border border-[#A3B899]/30">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm md:text-base text-[#4A4A4A] leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {post.content}
                    </p>

                    <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
                      <button 
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all ${
                          post.isLiked 
                            ? "bg-rose-50 text-rose-600 font-bold" 
                            : "hover:bg-slate-50 text-slate-500"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${post.isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
                        <span>{post.likes}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                        <span>{post.repliesCount} réponses</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal Création de post */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-xl border border-border">
            <div className="flex justify-between items-center pb-2 border-b">
              <h2 className="font-bold text-lg text-[#4A4A4A]">Nouvelle discussion</h2>
              <button 
                onClick={() => setShowNewPostModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#4A4A4A] block mb-1">Catégorie</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border px-3 text-xs bg-slate-50 outline-none focus:ring-2 focus:ring-[#E9B6B6]"
                >
                  <option value="1er Trimestre">1er Trimestre</option>
                  <option value="2ème Trimestre">2ème Trimestre</option>
                  <option value="3ème Trimestre">3ème Trimestre</option>
                  <option value="Bien-être">Bien-être</option>
                  <option value="Préparation">Préparation</option>
                  <option value="Post-partum">Post-partum</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#4A4A4A] block mb-1">Titre de ta question ou sujet</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Conseils pour le choix de la poussette ?"
                  className="w-full h-10 rounded-xl border border-border px-3 text-xs outline-none focus:ring-2 focus:ring-[#E9B6B6]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#4A4A4A] block mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Exprime ta demande en toute bienveillance..."
                  className="w-full rounded-xl border border-border p-3 text-xs outline-none focus:ring-2 focus:ring-[#E9B6B6] resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowNewPostModal(false)}
                  className="rounded-xl text-xs h-10"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-[#E9B6B6] to-[#D9A5A5] hover:from-[#D9A5A5] hover:to-[#C89494] text-white font-bold rounded-xl text-xs h-10 px-5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Publier
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
