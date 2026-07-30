import React from "react";
import { Heart, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Donations() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 px-4 animate-in fade-in duration-500 max-w-lg mx-auto text-center">
      <div className="w-16 h-16 bg-[#E9B6B6]/20 rounded-2xl flex items-center justify-center text-[#E9B6B6] mx-auto">
        <Heart className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-bold text-[#4A4A4A]">Soutenir MamanZen</h1>
      <p className="text-sm text-muted-foreground leading-relaxed">
        Les dons ne sont pas encore disponibles. Merci pour votre soutien — nous reviendrons vers vous bientôt.
      </p>
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="rounded-2xl text-sm font-bold gap-2 text-[#4A4A4A]"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </Button>
    </div>
  );
}
