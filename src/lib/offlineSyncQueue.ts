/**
 * MamanZen Offline Sync Queue Utility
 * Handles offline detection, local storage queueing of daily tracker/symptom logs,
 * background synchronization with Service Worker, and automatic replay when connectivity returns.
 */

import { supabase } from "@/lib/supabase";

export interface OfflineTrackerLog {
  id: string;
  timestamp: number;
  date: string;
  user_id?: string;
  trimester: number;
  symptoms: string[];
  notes: string;
  mood: string;
  fatigue: number | null;
  nausea: number | null;
  synced: boolean;
}

const QUEUE_STORAGE_KEY = 'mamanzen_offline_tracker_queue';

/**
 * Gets all pending offline tracker entries.
 */
export function getOfflineQueue(): OfflineTrackerLog[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading offline tracker queue", e);
    return [];
  }
}

/**
 * Saves queue back to localStorage and notifies Service Worker if registered.
 */
export function saveOfflineQueue(queue: OfflineTrackerLog[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  
  // Send message to Service Worker if active
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'SYNC_QUEUE_UPDATED',
      count: queue.length
    });
  }
}

/**
 * Enqueues a new tracker submission when user is offline or network fails.
 */
export async function enqueueTrackerLog(log: Omit<OfflineTrackerLog, 'id' | 'timestamp' | 'synced'>): Promise<OfflineTrackerLog> {
  const newEntry: OfflineTrackerLog = {
    ...log,
    id: `offline_log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: Date.now(),
    synced: false
  };

  const currentQueue = getOfflineQueue();
  currentQueue.push(newEntry);
  saveOfflineQueue(currentQueue);

  // Attempt Background Sync registration via Service Worker
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if ('sync' in reg) {
        // @ts-ignore
        await reg.sync.register('sync-tracker-logs');
      }
    } catch (e) {
      console.log("Background Sync registration not supported or failed, using fallback online listener", e);
    }
  }

  return newEntry;
}

/**
 * Process and flush the offline queue to Supabase or local user profile when network is available.
 */
export async function flushOfflineQueue(): Promise<{ syncedCount: number; errorsCount: number }> {
  if (typeof window === 'undefined' || !navigator.onLine) {
    return { syncedCount: 0, errorsCount: 0 };
  }

  const queue = getOfflineQueue();
  if (queue.length === 0) return { syncedCount: 0, errorsCount: 0 };

  let syncedCount = 0;
  let errorsCount = 0;
  const remainingQueue: OfflineTrackerLog[] = [];

  for (const item of queue) {
    try {
      if (item.user_id) {
        // Sync to Supabase
        const { error } = await supabase.from('symptom_logs').insert({
          user_id: item.user_id,
          date: item.date,
          symptoms: item.symptoms,
          notes: item.notes
        });

        if (error) throw error;
      }

      // Also merge into local history in localStorage for offline availability
      const existingHistoryRaw = localStorage.getItem('mamanzen_symptom_history');
      let history = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
      history.unshift({
        id: item.id,
        date: item.date,
        symptoms: item.symptoms,
        notes: item.notes,
        synced_at: new Date().toISOString()
      });
      localStorage.setItem('mamanzen_symptom_history', JSON.stringify(history));

      syncedCount++;
    } catch (err) {
      console.error("Failed to sync item:", item, err);
      errorsCount++;
      remainingQueue.push(item);
    }
  }

  saveOfflineQueue(remainingQueue);

  // If items were synced, trigger a confirmation notification if available
  if (syncedCount > 0 && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.showNotification) {
        reg.showNotification("🌸 Synchronisation Réussie", {
          body: `${syncedCount} journal(x) de suivi de grossesse enregistré(s) hors-ligne ont été synchronisé(s) !`,
          icon: '/icon.svg',
          badge: '/icon.svg',
          tag: 'sync-complete'
        });
      }
    } catch (e) {}
  }

  return { syncedCount, errorsCount };
}

/**
 * Subscribes to window 'online' event to automatically trigger queue flush.
 */
export function setupAutoOfflineSync(onSyncComplete?: (count: number) => void) {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = async () => {
    console.log("[OfflineSync] Internet connection restored, processing queue...");
    const { syncedCount } = await flushOfflineQueue();
    if (syncedCount > 0 && onSyncComplete) {
      onSyncComplete(syncedCount);
    }
  };

  window.addEventListener('online', handleOnline);

  // Run initial flush check if online
  if (navigator.onLine) {
    flushOfflineQueue().then(({ syncedCount }) => {
      if (syncedCount > 0 && onSyncComplete) {
        onSyncComplete(syncedCount);
      }
    });
  }

  return () => {
    window.removeEventListener('online', handleOnline);
  };
}
