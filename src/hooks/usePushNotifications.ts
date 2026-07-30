/// <reference types="vite/client" />
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import {
  isPushSupported,
  getNotificationPermission,
  getSavedPushSettings,
  savePushSettings,
  triggerPushNotification,
  PushNotificationPreferences,
  DEFAULT_PUSH_SETTINGS
} from '@/lib/pushNotifications';

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

// Convert VAPID Public Key to Uint8Array for PushManager
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [preferences, setPreferences] = useState<PushNotificationPreferences>(DEFAULT_PUSH_SETTINGS);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check support and current permission on mount
  useEffect(() => {
    const supported = isPushSupported();
    setIsSupported(supported);
    if (supported) {
      setPermission(getNotificationPermission());
      setPreferences(getSavedPushSettings());
      
      // Get existing service worker subscription if present
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((reg) => {
          reg.pushManager.getSubscription().then((sub) => {
            setSubscription(sub);
          });
        }).catch((err) => console.warn('Service Worker ready check failed', err));
      }
    }
  }, []);

  // Fetch preferences from Supabase if logged in
  useEffect(() => {
    if (!user) return;

    async function loadSupabasePreferences() {
      try {
        const { data, error } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (data && !error) {
          const merged: PushNotificationPreferences = {
            enabled: data.enabled ?? true,
            weeklyTips: data.weekly_tips ?? true,
            hydration: data.hydration ?? true,
            appointments: data.appointments ?? true,
            moodJournal: data.mood_journal ?? true,
            meditation: data.meditation ?? true,
            reminderTime: data.reminder_time || '09:00'
          };
          setPreferences(merged);
          savePushSettings(merged);
        }
      } catch (err) {
        console.warn('Could not fetch Supabase push preferences:', err);
      }
    }

    loadSupabasePreferences();
  }, [user]);

  // Save updated preferences locally + in Supabase
  const updatePreferences = useCallback(async (newPrefs: Partial<PushNotificationPreferences>) => {
    const updated = savePushSettings(newPrefs);
    setPreferences(updated);

    if (user) {
      try {
        await supabase
          .from('notification_preferences')
          .upsert({
            user_id: user.id,
            enabled: updated.enabled,
            weekly_tips: updated.weeklyTips,
            hydration: updated.hydration,
            appointments: updated.appointments,
            mood_journal: updated.moodJournal,
            meditation: updated.meditation,
            reminder_time: updated.reminderTime,
            updated_at: new Date().toISOString()
          }, { onConflict: 'user_id' });
      } catch (err) {
        console.warn('Failed to sync push preferences to Supabase:', err);
      }
    }
  }, [user]);

  // Request Web Push Permission & Subscribe
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Les notifications Push ne sont pas supportées par votre navigateur.');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        // Register & Subscribe via PushManager
        const reg = await navigator.serviceWorker.ready;
        
        // Optional VAPID key from env or fallback public demo key
        const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        let subOptions: PushSubscriptionOptionsInit = { userVisibleOnly: true };

        if (vapidPublicKey) {
          subOptions.applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
        }

        let pushSub = await reg.pushManager.getSubscription();
        if (!pushSub) {
          pushSub = await reg.pushManager.subscribe(subOptions);
        }
        setSubscription(pushSub);

        // Save subscription in Supabase if user is authenticated
        if (user && pushSub) {
          const subJson = pushSub.toJSON();
          await supabase
            .from('push_subscriptions')
            .upsert({
              user_id: user.id,
              endpoint: subJson.endpoint,
              p256dh: subJson.keys?.p256dh,
              auth: subJson.keys?.auth,
              user_agent: navigator.userAgent,
              updated_at: new Date().toISOString()
            }, { onConflict: 'endpoint' });
        }

        // Enable master preference
        await updatePreferences({ enabled: true });

        // Trigger welcome notification
        triggerPushNotification({
          title: '🌸 Bienvenue sur MamanZen Push !',
          body: 'Vous recevrez vos conseils doux et personnalisés selon votre grossesse.',
          url: '/dashboard'
        });

        setLoading(false);
        return true;
      } else {
        await updatePreferences({ enabled: false });
        setError('Permission de notification refusée.');
        setLoading(false);
        return false;
      }
    } catch (err: any) {
      console.error('Push registration failed:', err);
      setError(err.message || 'Erreur lors de l’activation des notifications.');
      setLoading(false);
      return false;
    }
  }, [isSupported, user, updatePreferences]);

  // Unsubscribe from Web Push
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();
        setSubscription(null);

        if (user) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('endpoint', endpoint);
        }
      }
      await updatePreferences({ enabled: false });
      setLoading(false);
      return true;
    } catch (err: any) {
      console.error('Failed to unsubscribe from push:', err);
      setError(err.message);
      setLoading(false);
      return false;
    }
  }, [subscription, user, updatePreferences]);

  // Send a test notification
  const sendTestNotification = useCallback(async (title?: string, body?: string, url?: string) => {
    return triggerPushNotification({
      title: title || '🌸 Douceur MamanZen',
      body: body || 'Pensez à prendre un moment pour respirer et boire un peu d’eau.',
      url: url || '/dashboard'
    });
  }, []);

  return {
    isSupported,
    permission,
    preferences,
    subscription,
    loading,
    error,
    requestPermission,
    unsubscribe,
    updatePreferences,
    sendTestNotification
  };
}
