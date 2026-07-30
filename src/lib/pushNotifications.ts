/**
 * MamanZen PWA Web Push Notification Service
 * Manages push permissions, service worker subscriptions, notification preferences,
 * and scheduled pregnancy tracking reminders.
 */

export interface PushNotificationPreferences {
  enabled: boolean;
  weeklyTips: boolean;
  hydration: boolean;
  appointments: boolean;
  moodJournal: boolean;
  meditation: boolean;
  reminderTime: string; // e.g. "09:00"
}

export const DEFAULT_PUSH_SETTINGS: PushNotificationPreferences = {
  enabled: false,
  weeklyTips: true,
  hydration: true,
  appointments: true,
  moodJournal: true,
  meditation: true,
  reminderTime: "09:00"
};

export const PRESET_REMINDERS = [
  {
    id: "weekly_tip",
    title: "🥑 Suivi SA : Votre bébé grandit !",
    body: "Semaine 12 SA : Votre bébé développe ses petites empreintes digitales ! Découvrez la fiche de la semaine.",
    url: "/tracker",
    category: "Hebdomadaire"
  },
  {
    id: "hydration",
    title: "💧 Pause Hydratation MamanZen",
    body: "Un grand verre d'eau frais pour renouveler le liquide amniotique et maintenir votre énergie !",
    url: "/dashboard",
    category: "Santé"
  },
  {
    id: "appointment",
    title: "🏥 Rappel Consultation Médicale",
    body: "Votre prochain rendez-vous de suivi approche. Pensez à noter vos questions pour votre sage-femme.",
    url: "/tracker",
    category: "Médical"
  },
  {
    id: "meditation",
    title: "🧘 Moment MamanZen & Relaxation",
    body: "Accordez-vous 5 minutes de respiration guidée pour apaiser votre esprit et vous connecter à votre bébé.",
    url: "/maternite/exercices",
    category: "Bien-être"
  },
  {
    id: "mood_journal",
    title: "📝 Journal de Forme Quotidien",
    body: "Comment vous sentez-vous aujourd'hui ? Enregistrez vos symptômes et votre humeur en 10 secondes.",
    url: "/symptomes",
    category: "Journal"
  }
];

export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isPushSupported()) return 'denied';
  return Notification.permission;
}

export function getSavedPushSettings(): PushNotificationPreferences {
  if (typeof window === 'undefined') return DEFAULT_PUSH_SETTINGS;
  const saved = localStorage.getItem('mamanzen_push_settings');
  if (saved) {
    try {
      return { ...DEFAULT_PUSH_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      console.error("Error reading push settings", e);
    }
  }
  return DEFAULT_PUSH_SETTINGS;
}

export function savePushSettings(settings: Partial<PushNotificationPreferences>): PushNotificationPreferences {
  const current = getSavedPushSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem('mamanzen_push_settings', JSON.stringify(updated));
  return updated;
}

/**
 * Requests Web Push permission from the user browser.
 */
export async function requestPushPermission(): Promise<boolean> {
  if (!isPushSupported()) {
    console.warn("Push notifications are not supported by this browser.");
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      savePushSettings({ enabled: true });
      
      // Send welcoming push notification immediately upon granting
      triggerPushNotification({
        title: "🌸 Notifications Push Activées !",
        body: "Vous recevrez désormais vos rappels de grossesse, astuces hebdomadaires et conseils de bien-être.",
        url: "/dashboard"
      });

      return true;
    } else {
      savePushSettings({ enabled: false });
      return false;
    }
  } catch (error) {
    console.error("Failed to request push notification permission", error);
    return false;
  }
}

/**
 * Triggers a Web Push notification via Service Worker or Native Notification API
 */
export async function triggerPushNotification(options: {
  title: string;
  body: string;
  url?: string;
  tag?: string;
}): Promise<boolean> {
  if (!isPushSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    // Try sending via Service Worker postMessage
    if (navigator.serviceWorker && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_PUSH_NOTIFICATION',
        title: options.title,
        body: options.body,
        url: options.url || '/dashboard',
        tag: options.tag || 'local-mamanzen-push'
      });
      return true;
    }

    // Try via service worker registration
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg && reg.showNotification) {
      await reg.showNotification(options.title, {
        body: options.body,
        icon: '/icon.svg',
        badge: '/icon.svg',
        vibrate: [100, 50, 100],
        data: { url: options.url || '/dashboard' },
        tag: options.tag || 'local-mamanzen-push'
      } as any);
      return true;
    }

    // Direct Notification fallback if service worker inactive
    new Notification(options.title, {
      body: options.body,
      icon: '/icon.svg',
      badge: '/icon.svg',
      data: { url: options.url || '/dashboard' }
    });
    return true;
  } catch (err) {
    console.error("Error triggering push notification:", err);
    return false;
  }
}

/**
 * Sends a preset sample reminder to test browser integration.
 */
export async function sendPresetTestNotification(presetId?: string): Promise<boolean> {
  const preset = PRESET_REMINDERS.find(p => p.id === presetId) || PRESET_REMINDERS[0];
  return triggerPushNotification({
    title: preset.title,
    body: preset.body,
    url: preset.url,
    tag: `preset-${preset.id}`
  });
}
