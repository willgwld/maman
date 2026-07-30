import React, { useState, useEffect } from "react";
import { CheckSquare, Plus, Trash2, Check, Luggage, Building, Calendar, Baby, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  fetchChecklists, 
  toggleChecklistItem, 
  addChecklistItem, 
  deleteChecklistItem
} from "@/lib/apiClient";

interface ChecklistItem {
  id: string;
  text: string;
  category: "valise" | "demarches" | "rdv" | "trousseau" | "postpartum";
  completed: boolean;
}

export default function Checklists() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<"all" | "valise" | "demarches" | "rdv" | "trousseau" | "postpartum">("all");
  const [newItemText, setNewItemText] = useState("");

  useEffect(() => {
    const loadChecklists = async () => {
      const fetched = await fetchChecklists();
      if (fetched) {
        setItems(fetched as any);
      }
    };
    loadChecklists();
  }, []);

  const toggleItem = async (id: string) => {
    const target = items.find(i => i.id === id);
    if (!target) return;
    const newCompleted = !target.completed;
    
    await toggleChecklistItem(id, newCompleted);
    setItems(items.map(i => i.id === id ? { ...i, completed: newCompleted } : i));
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;

    const category = activeCategory === "all" ? "valise" : activeCategory;
    const text = newItemText.trim();
    setNewItemText("");

    await addChecklistItem({ text, category });
    const fetched = await fetchChecklists();
    if (fetched) setItems(fetched as any);
  };

  const deleteItem = async (id: string) => {
    await deleteChecklistItem(id);
    setItems(items.filter((i) => i.id !== id));
  };

  const filteredItems = items.filter((i) => {
    if (activeCategory === "all") return true;
    return i.category === activeCategory;
  });

  const completedCount = filteredItems.filter((i) => i.completed).length;
  const progressPercent = filteredItems.length > 0 ? Math.round((completedCount / filteredItems.length) * 100) : 0;

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto pb-20 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-2xl font-bold text-[#4A4A4A] dark:text-[#E6E1DA]">Checklists & Charge Mentale</h1>
          <p className="text-xs text-muted-foreground">Tout est noté et organisé pour libérer votre esprit.</p>
        </div>

        <div className="p-2.5 bg-[#E9B6B6]/20 dark:bg-[#E9B6B6]/30 text-[#E9B6B6] rounded-2xl">
          <CheckSquare className="w-5 h-5" />
        </div>
      </div>

      {/* Progress Bar Card */}
      <Card className="border border-[#EAE5DF] dark:border-[#332E2A] bg-[#FAF8F5] dark:bg-[#201D1B] rounded-3xl p-5 space-y-3 shadow-xs">
        <div className="flex justify-between items-center text-xs font-bold text-[#4A4A4A] dark:text-[#E6E1DA]">
          <span>Progression : {completedCount} / {filteredItems.length} éléments cochés</span>
          <span className="text-[#A3B899] font-extrabold">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-white dark:bg-[#2A2623] border border-[#EAE5DF] dark:border-[#332E2A] rounded-full overflow-hidden p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#E9B6B6] to-[#A3B899] rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </Card>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 text-xs">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3.5 py-2 rounded-2xl font-bold transition-all border shrink-0 ${
            activeCategory === "all"
              ? "bg-[#4A4A4A] dark:bg-[#E6E1DA] text-white dark:text-[#181615] border-[#4A4A4A]"
              : "bg-white dark:bg-[#201D1B] border-[#EAE5DF] dark:border-[#332E2A] text-[#4A4A4A] dark:text-[#E6E1DA]"
          }`}
        >
          Toutes ({items.length})
        </button>

        <button
          onClick={() => setActiveCategory("valise")}
          className={`px-3.5 py-2 rounded-2xl font-bold transition-all border shrink-0 flex items-center gap-1.5 ${
            activeCategory === "valise"
              ? "bg-[#E9B6B6] text-white border-[#E9B6B6]"
              : "bg-white dark:bg-[#201D1B] border-[#EAE5DF] dark:border-[#332E2A] text-[#4A4A4A] dark:text-[#E6E1DA]"
          }`}
        >
          <Luggage className="w-3.5 h-3.5" />
          <span>Valise Maternité</span>
        </button>

        <button
          onClick={() => setActiveCategory("demarches")}
          className={`px-3.5 py-2 rounded-2xl font-bold transition-all border shrink-0 flex items-center gap-1.5 ${
            activeCategory === "demarches"
              ? "bg-[#A3B899] text-white border-[#A3B899]"
              : "bg-white dark:bg-[#201D1B] border-[#EAE5DF] dark:border-[#332E2A] text-[#4A4A4A] dark:text-[#E6E1DA]"
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>Démarches</span>
        </button>

        <button
          onClick={() => setActiveCategory("rdv")}
          className={`px-3.5 py-2 rounded-2xl font-bold transition-all border shrink-0 flex items-center gap-1.5 ${
            activeCategory === "rdv"
              ? "bg-purple-500 text-white border-purple-500"
              : "bg-white dark:bg-[#201D1B] border-[#EAE5DF] dark:border-[#332E2A] text-[#4A4A4A] dark:text-[#E6E1DA]"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>RDV Médicaux</span>
        </button>

        <button
          onClick={() => setActiveCategory("trousseau")}
          className={`px-3.5 py-2 rounded-2xl font-bold transition-all border shrink-0 flex items-center gap-1.5 ${
            activeCategory === "trousseau"
              ? "bg-amber-500 text-white border-amber-500"
              : "bg-white dark:bg-[#201D1B] border-[#EAE5DF] dark:border-[#332E2A] text-[#4A4A4A] dark:text-[#E6E1DA]"
          }`}
        >
          <Baby className="w-3.5 h-3.5" />
          <span>Trousseau Bébé</span>
        </button>

        <button
          onClick={() => setActiveCategory("postpartum")}
          className={`px-3.5 py-2 rounded-2xl font-bold transition-all border shrink-0 flex items-center gap-1.5 ${
            activeCategory === "postpartum"
              ? "bg-rose-500 text-white border-rose-500"
              : "bg-white dark:bg-[#201D1B] border-[#EAE5DF] dark:border-[#332E2A] text-[#4A4A4A] dark:text-[#E6E1DA]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Post-Partum</span>
        </button>
      </div>

      {/* Add New Item Input */}
      <form onSubmit={addItem} className="flex gap-2">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          placeholder="Ajouter une tâche personnelle..."
          className="flex-1 bg-white dark:bg-[#201D1B] border border-[#EAE5DF] dark:border-[#332E2A] rounded-2xl px-4 text-xs md:text-sm text-[#4A4A4A] dark:text-[#E6E1DA] focus:ring-2 focus:ring-[#A3B899] outline-none h-12"
        />
        <Button
          type="submit"
          disabled={!newItemText.trim()}
          className="bg-[#A3B899] hover:bg-[#8F9F85] text-white rounded-2xl h-12 px-5 font-bold transition-all shrink-0"
        >
          <Plus className="w-5 h-5" />
        </Button>
      </form>

      {/* Items List */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <Card className="border border-[#EAE5DF] dark:border-[#332E2A] p-8 text-center bg-white dark:bg-[#201D1B] rounded-3xl">
            <p className="text-xs text-muted-foreground">Aucune tâche dans cette rubrique pour l'instant.</p>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-4 bg-white dark:bg-[#201D1B] border rounded-2xl shadow-2xs transition-all flex items-center justify-between gap-3 cursor-pointer ${
                item.completed
                  ? "border-[#EAE5DF] dark:border-[#332E2A] bg-[#FAFAF9] dark:bg-[#2A2623] opacity-75"
                  : "border-[#EAE5DF] dark:border-[#332E2A] hover:border-[#A3B899]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                    item.completed
                      ? "bg-[#A3B899] border-[#A3B899] text-white"
                      : "border-[#EAE5DF] dark:border-[#332E2A] bg-[#FAFAF9] dark:bg-[#2A2623]"
                  }`}
                >
                  {item.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                <span
                  className={`text-xs md:text-sm font-medium ${
                    item.completed ? "line-through text-muted-foreground" : "text-[#4A4A4A] dark:text-[#E6E1DA]"
                  }`}
                >
                  {item.text}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteItem(item.id);
                }}
                className="text-muted-foreground hover:text-rose-500 p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
