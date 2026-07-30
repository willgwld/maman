/**
 * OneSignal Web SDK Integration for MamanZen PWA
 * Handles OneSignal initialization, player_id capture, push subscription, and Supabase sync.
 */

import { supabase } from '@/lib/supabase';

declare global {
  interface Window {
    OneSignalDeferred?: any[];
    OneSignal?: any;
  }
}

export interface OneSignalNotificationPreferences {
  daily_tracking: boolean;
  evening_meditation: boolean;
  new_week: boolean;
  inactivity_reminder: boolean;
}

export const DEFAULT_ONESIGNAL_PREFERENCES: OneSignalNotificationPreferences = {
  daily_tracking: true,
  evening_meditation: true,
  new_week: true,
  inactivity_reminder: true,
};

/**
 * Initializes the OneSignal SDK for Web/PWA
 */
export function initOneSignal(appId: string = import.meta.env.VITE_ONESIGNAL_APP_ID || "mamanzen-onesignal-app-id") {
  if (typeof window === 'undefined') return;

  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async (OneSignal: any) => {
    await OneSignal.init({
      appId: appId,
      safari_web_id: import.meta.env.VITE_ONESIGNAL_SAFARI_ID || undefined,
      allowLocalhostAsSecureOrigin: true,
      serviceWorkerParam: { scope: "/" },
      serviceWorkerPath: "OneSignalSDKWorker.js",
      notifyButton: {
        enable: false, // We use custom UI in Settings.tsx
      },
    });

    console.log("[OneSignal] SDK Initialized");

    // Listen to subscription change
    OneSignal.User.PushSubscription.addEventListener("change", async (event: any) => {
      const isSubscribed = event.current.id;
      if (isSubscribed) {
        const playerId = OneSignal.User.PushSubscription.id;
        console.log("[OneSignal] Player ID captured:", playerId);
        await syncPlayerIdToBackend(playerId);
      }
    });
  });
}

/**
 * Requests push notification permission from user via OneSignal
 */
export async function requestOneSignalPermission(userId?: string): Promise<{ success: boolean; playerId?: string }> {
  if (typeof window === 'undefined' || !window.OneSignal) {
    console.warn("[OneSignal] SDK not ready, falling back to Web Notification API");
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      return { success: perm === 'granted' };
    }
    return { success: false };
  }

  try {
    const OneSignal = window.OneSignal;
    await OneSignal.Notifications.requestPermission();
    const isPushGranted = OneSignal.Notifications.permission;

    if (isPushGranted) {
      const playerId = OneSignal.User.PushSubscription.id;
      if (userId && playerId) {
        await syncPlayerIdToBackend(playerId, userId);
      }
      return { success: true, playerId };
    }
    return { success: false };
  } catch (error) {
    console.error("[OneSignal] Permission request error:", error);
    return { success: false };
  }
}

/**
 * Syncs the OneSignal player ID and timezone to the backend and Supabase
 */
export async function syncPlayerIdToBackend(playerId: string, userId?: string) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Paris';

  // 1. Sync to custom Express Backend Endpoint
  try {
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userId || 'current_user',
        onesignalPlayerId: playerId,
        timezone,
      }),
    });
  } catch (err) {
    console.warn('[OneSignal] Could not sync player_id to backend endpoint:', err);
  }

  // 2. Direct Supabase profile update if user ID is provided
  if (userId) {
    try {
      await supabase
        .from('profiles')
        .update({
          onesignal_player_id: playerId,
          timezone,
          notifications_enabled: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    } catch (err) {
      console.warn('[OneSignal] Supabase profile sync failed:', err);
    }
  }
}

/**
 * Update user notification preferences in Supabase profile
 */
export async function updateOneSignalPreferences(
  userId: string,
  notificationsEnabled: boolean,
  preferences: OneSignalNotificationPreferences,
  preferredTrackingTime: string = '09:00',
  preferredMeditationTime: string = '21:30'
) {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Paris';

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        notifications_enabled: notificationsEnabled,
        notification_preferences: preferences,
        preferred_tracking_time: preferredTrackingTime,
        preferred_meditation_time: preferredMeditationTime,
        timezone,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.error('[OneSignal] Error updating preferences in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('[OneSignal] Failed to save preferences:', err);
    return false;
  }
}
