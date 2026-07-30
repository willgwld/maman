import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Heart, RefreshCw, MessageSquareHeart, Activity, Bot, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchSymptomLogs } from "@/lib/apiClient";

interface Message {
  role: "user" | "model";
  text: string;
}

const SUGGESTIONS = [
  "Comment soulager les nausées du matin ?",
  "Est-ce normal d'avoir très envie de dormir au 1er trimestre ?",
  "Quels exercices doux pour apaiser les maux de dos ?",
  "Des astuces pour mieux dormir pendant la grossesse ?"
];

export default function AIChat() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Bonjour chérie ! 🌸 Je suis ton assistante **MamanZen**, une sage-femme douce dans ta poche. Pose-moi toutes tes questions, sans hésitation ni jugement. Comment te sens-tu aujourd'hui ?"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputValue.trim();
    if (!messageText || isLoading) return;

    if (!textToSend) setInputValue("");

    const newHistory = [...messages, { role: "user" as const, text: messageText }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          message: messageText
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([...newHistory, { role: "model", text: data.reply }]);
      } else {
        setMessages([
          ...newHistory,
          {
            role: "model",
            text: "🌸 Je rencontre une petite difficulté momentanée de connexion. N'hésite pas à me réécrire dans quelques instants !"
          }
        ]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages([
        ...newHistory,
        {
          role: "model",
          text: "🌸 Oups, une petite interruption réseau. Peux-tu me reposer ta question ?"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Analyze recent symptoms from Supabase
  const analyzeRecentSymptoms = async () => {
    const logs = await fetchSymptomLogs();
    if (!logs || logs.length === 0) {
      sendMessage("Je n'ai pas encore saisi de symptômes aujourd'hui. Quels conseils peux-tu me donner pour rester en pleine forme ?");
      return;
    }

    const recent = logs[0];
    const prompt = `Voici mon dernier suivi du journal : 
- Date : ${recent.date}
- Humeur : ${recent.mood}
- Énergie : ${recent.energy}
- Symptômes : ${recent.symptoms?.join(", ") || "aucun symptôme particulier"}
- Note : ${recent.note || "aucune note"}

Peux-tu analyser gentiment ces symptômes et me donner des conseils doux et rassurants adaptées ?`;

    sendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7.5rem)] md:h-[calc(100vh-5rem)] max-w-2xl mx-auto pb-4 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#E9B6B6] to-[#A3B899] rounded-2xl flex items-center justify-center text-white shadow-xs">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#4A4A4A] tracking-tight">Sage-Femme IA</h1>
            <p className="text-xs text-muted-foreground font-medium">Une écoute douce, rassurante et sans jugement 24h/24</p>
          </div>
        </div>

        <Button
          onClick={analyzeRecentSymptoms}
          variant="outline"
          size="sm"
          className="border-[#A3B899] text-[#6B8E5E] hover:bg-[#A3B899]/10 rounded-2xl text-xs font-bold gap-1.5 hidden sm:flex"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Analyser mes symptômes</span>
        </Button>
      </div>

      {/* Chat Box Container */}
      <Card className="flex-1 flex flex-col border border-[#EAE5DF] shadow-md rounded-3xl overflow-hidden bg-white">
        
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#FAF8F5]/50">
          
          {/* Medical disclaimer note */}
          <div className="p-3 bg-[#FFF9F9] rounded-2xl border border-[#E9B6B6]/30 text-[11px] text-[#4A4A4A] leading-relaxed flex items-start gap-2">
            <span className="text-base shrink-0">🌸</span>
            <span>
              <strong>Rappel bienveillant :</strong> L'IA MamanZen donne des conseils de bien-être et de confort. En cas de symptôme urgent ou médical, consulte toujours ton médecin ou ta sage-femme.
            </span>
          </div>

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {msg.role === "model" ? (
                <div className="w-8 h-8 bg-[#E9B6B6]/30 text-[#E9B6B6] rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 fill-[#E9B6B6]" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-[#4A4A4A] text-white rounded-xl flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  Moi
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed max-w-[85%] shadow-2xs ${
                  msg.role === "model"
                    ? "bg-white dark:bg-[#2A2623] text-[#4A4A4A] dark:text-[#E6E1DA] border border-[#EAE5DF] dark:border-[#3D3732] rounded-tl-xs"
                    : "bg-[#4A4A4A] dark:bg-[#A3B899] text-white dark:text-[#181615] font-medium rounded-tr-xs"
                }`}
              >
                {msg.text.split("\n").map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i !== msg.text.split("\n").length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#E9B6B6]/30 text-[#E9B6B6] rounded-xl flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-white border border-[#EAE5DF] rounded-2xl text-xs text-muted-foreground italic animate-pulse">
                MamanZen réfléchit avec douceur...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-3 py-2 bg-white dark:bg-[#201D1B] border-t border-[#EAE5DF]/60 dark:border-[#332E2A] flex items-center gap-2 overflow-x-auto custom-scrollbar text-xs">
          <button
            onClick={analyzeRecentSymptoms}
            className="sm:hidden px-3 py-1.5 bg-[#A3B899]/15 dark:bg-[#A3B899]/25 text-[#6B8E5E] dark:text-[#A3B899] border border-[#A3B899]/30 rounded-full font-bold whitespace-nowrap shrink-0"
          >
            ✨ Analyser mes symptômes
          </button>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="px-3 py-1.5 bg-[#FAFAF9] dark:bg-[#2A2623] border border-[#EAE5DF] dark:border-[#3D3732] hover:border-[#A3B899] text-[#4A4A4A] dark:text-[#E6E1DA] rounded-full text-[11px] whitespace-nowrap shrink-0 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-[#201D1B] border-t border-[#EAE5DF] dark:border-[#332E2A] flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Pose ta question avec tes propres mots..."
            className="flex-1 bg-[#FAFAF9] dark:bg-[#2A2623] border border-[#EAE5DF] dark:border-[#3D3732] rounded-2xl h-12 px-4 text-xs md:text-sm text-[#4A4A4A] dark:text-[#E6E1DA] focus:ring-2 focus:ring-[#A3B899] outline-none"
          />

          <Button
            onClick={() => sendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="bg-[#A3B899] hover:bg-[#8F9F85] text-white rounded-2xl h-12 px-5 font-bold transition-all disabled:opacity-40 shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

      </Card>
    </div>
  );
}
