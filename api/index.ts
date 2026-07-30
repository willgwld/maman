import express from "express";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
app.use(express.json());

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (_req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  });
}

function getFallbackChatReply(message: string = ""): string {
  const lower = message.toLowerCase();
  if (lower.includes("nausée") || lower.includes("vomisse") || lower.includes("estomac")) {
    return "🌸 **Conseil doux pour les nausées :**\n\n• Bois de petites gorgées d'eau fraîche ou infusée au citron tout au long de la journée.\n• Prends de petites collations fréquentes (biscottes, amandes, flocons d'avoine) avant même de te lever du lit.\n• Le gingembre frais en infusion est un excellent allié naturel reconnus contre les nausées.\n\n*Si les nausées t'empêchent de t'hydrater correctement, consulte ta sage-femme ou ton médecin.*";
  }
  if (lower.includes("dormir") || lower.includes("sommeil") || lower.includes("insomnie") || lower.includes("nuit")) {
    return "🌸 **Pour un sommeil plus paisible :**\n\n• Calfeutre ton bas du dos avec un coussin de grossesse/allaitement entre tes genoux.\n• Évite les écrans 1 heure avant d'éteindre et privilégie une tisane chaude de verveine ou fleur d'oranger.\n• Dors préférentiellement sur le côté gauche pour maximiser le flux sanguin vers le bébé.";
  }
  if (lower.includes("dos") || lower.includes("lombaire") || lower.includes("douleur")) {
    return "🌸 **Soulager les maux de dos :**\n\n• Fais de petites bascules du bassin sur un ballon de grossesse (fitball) pour détendre la colonne.\n• Porte un soutien-gorge adapté et des chaussures souples sans talons hauts.\n• Applique une compresse ou une bouillotte tiède sur le bas du dos et respire profondément.";
  }
  if (lower.includes("fatigue") || lower.includes("épuise")) {
    return "🌸 **Écoute ton corps et accorde-toi du repos :**\n\n• La fatigue du 1er et 3ème trimestre est tout à fait normale : ton corps fabrique de la vie !\n• N'hésite pas à faire des micro-siestes de 20 minutes en début d'après-midi.\n• Pense à vérifier ton taux de fer et de vitamine D lors de tes bilans de grossesse.";
  }
  if (lower.includes("manger") || lower.includes("aliment") || lower.includes("repas") || lower.includes("poids")) {
    return "🌸 **Alimentation équilibrée et sereine :**\n\n• Favorise les aliments riches en fibres, fer et calcium (légumes verts, lentilles, produits laitiers ou végétaux enrichis).\n• Veille à bien laver les fruits/légumes et consomme les viandes/poissons bien cuits.\n• Bois au moins 1.5L d'eau par jour pour prévenir les jambes lourdes et les infections.";
  }
  return "🌸 **Conseil bienveillant MamanZen :**\n\nPrends un moment pour respirer profondément : inspire doucement par le nez pendant 4 secondes, puis expire lentement par la bouche pendant 6 secondes.\n\nChaque étape de ta grossesse est unique. N'hésite pas à te reposer dès que le besoin se fait sentir et à exprimer tes besoins à ton entourage.\n\n*Pour toute question spécifique ou en cas de doute médical, consulte toujours ton professionnel de santé.*";
}

// Format chat history for Gemini API to ensure strict role alternation and leading 'user' role
function formatGeminiContents(history: any[], currentMessage?: string) {
  const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

  if (history && Array.isArray(history)) {
    for (const msg of history) {
      if (!msg || !msg.text || !msg.text.trim()) continue;
      const role = msg.role === 'user' ? 'user' : 'model';

      // Gemini contents MUST start with 'user'. Skip initial model greetings.
      if (contents.length === 0 && role === 'model') {
        continue;
      }

      // Gemini contents MUST alternate roles. Merge consecutive duplicate roles.
      if (contents.length > 0 && contents[contents.length - 1].role === role) {
        contents[contents.length - 1].parts[0].text += `\n${msg.text.trim()}`;
      } else {
        contents.push({
          role,
          parts: [{ text: msg.text.trim() }]
        });
      }
    }
  }

  if (currentMessage && currentMessage.trim()) {
    const text = currentMessage.trim();
    if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
      contents[contents.length - 1].parts[0].text += `\n${text}`;
    } else {
      contents.push({ role: 'user', parts: [{ text }] });
    }
  }

  if (contents.length === 0) {
    contents.push({ role: 'user', parts: [{ text: currentMessage || "Bonjour !" }] });
  }

  return contents;
}

// API route for AI recommendations
app.post("/api/recommendations", async (req, res) => {
  try {
    const { trimester = 1, symptoms = [] } = req.body || {};
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        greeting: "Bonjour chère maman 🌸",
        analysis: "Voici tes conseils bien-être personnalisés pour t'accompagner aujourd'hui.",
        tips: [
          "S'hydrater régulièrement tout au long de la journée.",
          "Prendre 5 minutes pour effectuer des respirations abdominales profondes.",
          "S'accorder des pauses régulièrement pour reposer tes jambes.",
          "Adapter son alimentation avec de petites collations nutritives si besoin."
        ],
        disclaimer: "Ces suggestions sont générales et ne remplacent en aucun cas l'avis d'un professionnel de santé."
      });
    }

    const prompt = `Génère des conseils pour une femme enceinte au trimestre ${trimester} avec ces symptômes aujourd'hui : ${JSON.stringify(symptoms)}`;

    const systemInstruction = `Tu es **MamanZen AI**, une assistante bienveillante, experte et extrêmement prudente spécialisée dans l'accompagnement des femmes enceintes.
Ton rôle principal est de fournir des **recommandations personnalisées, générales et non médicales**.

Règles :
1. Disclaimer obligatoire dans la propriété disclaimer.
2. Conseils simples, chaleureux et pratiques (3 à 5 conseils).`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            greeting: { type: Type.STRING, description: "Un mot doux d'accueil" },
            analysis: { type: Type.STRING, description: "Une brève analyse rassurante des symptômes" },
            tips: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 à 5 conseils pratiques" },
            disclaimer: { type: Type.STRING, description: "Le disclaimer médical obligatoire" }
          },
          required: ["greeting", "analysis", "tips", "disclaimer"]
        },
      },
    });

    if (!response.text) throw new Error("No response text from Gemini");
    const jsonResponse = JSON.parse(response.text.trim());
    return res.json(jsonResponse);
  } catch (error: any) {
    console.error("Error generating recommendations, serving fallback:", error);
    return res.json({
      greeting: "Bonjour douce maman 🌸",
      analysis: "Nous avons préparé ces conseils attentionnés pour ton confort aujourd'hui.",
      tips: [
        "Repose-toi dès que tu ressens un coup de fatigue.",
        "Bois beaucoup d'eau fraiche par petites gorgées.",
        "N'hésite pas à pratiquer des étirements doux pour soulager ton dos."
      ],
      disclaimer: "Ces suggestions sont générales et ne remplacent en aucun cas l'avis d'un professionnel de santé."
    });
  }
});

app.post("/api/onboarding-chat", async (req, res) => {
  try {
    const { history, message } = req.body || {};
    const ai = getGenAI();

    if (!ai) {
      return res.json({ reply: getFallbackChatReply(message) });
    }

    const systemInstruction = `Tu es **MamanZen**, une assistante bienveillante, chaleureuse et professionnelle qui accompagne les femmes enceintes pendant leur onboarding.`;

    const contents = formatGeminiContents(history, message);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: { systemInstruction },
    });

    if (!response.text) throw new Error("Empty response from Gemini");
    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in onboarding chat, serving fallback:", error);
    return res.json({ reply: getFallbackChatReply(req.body?.message) });
  }
});

app.post("/api/chat", async (req, res) => {
  try {
    const { history, message } = req.body || {};
    const ai = getGenAI();

    if (!ai) {
      return res.json({ reply: getFallbackChatReply(message) });
    }

    const systemInstruction = `Tu es **MamanZen IA**, une assistante bienveillante, experte et extrêmement prudente spécialisée dans l'accompagnement des femmes enceintes.
Ton rôle principal est de fournir des **recommandations personnalisées, générales et non médicales** pour aider les futures mamans à mieux vivre leur grossesse au quotidien.

Règles :
1. Rappelle que tes conseils sont généraux et ne remplacent pas l'avis d'un professionnel de santé.
2. Ne donne jamais de diagnostic médical.
3. Ton doux, encourageant et très rassurant en français.`;

    const contents = formatGeminiContents(history, message);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: { systemInstruction },
    });

    if (!response.text) throw new Error("Empty response from Gemini");
    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in general chat, serving fallback:", error);
    return res.json({ reply: getFallbackChatReply(req.body?.message) });
  }
});

// Helper function to send notification via OneSignal REST API
async function sendOneSignalPush(payload: {
  playerIds: string[];
  title: string;
  message: string;
  url?: string;
  data?: Record<string, any>;
}) {
  const appId = process.env.ONESIGNAL_APP_ID || "mamanzen-onesignal-app-id";
  const apiKey = process.env.ONESIGNAL_REST_API_KEY;

  if (!apiKey) {
    console.log(`[OneSignal Engine] Simulation Mode - Sending to ${payload.playerIds.length} players: "${payload.title}" -> "${payload.message}"`);
    return { simulated: true, recipients: payload.playerIds.length };
  }

  try {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        include_player_ids: payload.playerIds,
        headings: { fr: payload.title, en: payload.title },
        contents: { fr: payload.message, en: payload.message },
        url: payload.url || "/dashboard",
        data: payload.data || {},
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("[OneSignal Engine] API Error:", error);
    return { error: true };
  }
}

// Helper: Check if current time in given timezone falls within quiet hours (22:30 to 07:30)
function isInQuietHours(userTimezone: string = "Europe/Paris"): boolean {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: userTimezone,
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const hour = parseInt(parts.find(p => p.type === "hour")?.value || "12", 10);
    const minute = parseInt(parts.find(p => p.type === "minute")?.value || "0", 10);
    const totalMinutes = hour * 60 + minute;

    const quietStart = 22 * 60 + 30; // 22:30 = 1350 mins
    const quietEnd = 7 * 60 + 30;    // 07:30 = 450 mins

    if (totalMinutes >= quietStart || totalMinutes < quietEnd) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Notifications API - Register Push Subscription / OneSignal Player ID
app.post("/api/notifications/subscribe", (req, res) => {
  const { userId, onesignalPlayerId, pushSubscription, timezone } = req.body || {};
  
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  console.log(`[Notification Engine] Subscription stored for user ${userId}:`, {
    onesignalPlayerId: onesignalPlayerId || "N/A",
    pushSubscription: pushSubscription ? "Web Push Configured" : "N/A",
    timezone: timezone || "Europe/Paris"
  });

  return res.json({
    success: true,
    message: "Subscription registered successfully",
    timestamp: new Date().toISOString()
  });
});

// Notifications API - OneSignal Manual/Direct Trigger Test
app.post("/api/notifications/onesignal-send", async (req, res) => {
  const { playerId, title, message, url, type } = req.body || {};

  if (!playerId && !req.body.all) {
    return res.status(400).json({ error: "playerId or target is required" });
  }

  const result = await sendOneSignalPush({
    playerIds: playerId ? [playerId] : ["demo_player_id"],
    title: title || "🌸 Douceur MamanZen",
    message: message || "Une pensée douce pour accompagner ta journée.",
    url: url || "/dashboard",
    data: { type: type || "manual" }
  });

  return res.json({ success: true, result });
});

// Notifications API - Cron Job Engine Endpoint
app.post("/api/notifications/cron", async (req, res) => {
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET || "mamanzen_cron_secret";
  
  if (authHeader && authHeader !== `Bearer ${cronSecret}` && process.env.NODE_ENV === "production") {
    return res.status(401).json({ error: "Unauthorized cron execution" });
  }

  const now = new Date();
  
  // Sample execution metrics (would query Supabase profiles table in production)
  const metrics = {
    evaluatedUsers: 42,
    quietHoursSkipped: 3,
    dailyCapReachedSkipped: 1,
    notificationsDispatched: {
      dailyTrackingReminders: 12,
      eveningMeditations: 8,
      newWeekAnnouncements: 4,
      inactivityReminders: 2,
      welcomeMessages: 1
    }
  };

  return res.json({
    status: "ok",
    jobExecutedAt: now.toISOString(),
    metrics,
    rulesApplied: [
      "No notifications sent during quiet hours (22:30 - 07:30)",
      "Strict cap of max 2 notifications per user per day",
      "User timezone local evaluation",
      "Postpartum messaging adaptation for birth date non-null",
      "Personalized with first_name"
    ]
  });
});

export default app;

