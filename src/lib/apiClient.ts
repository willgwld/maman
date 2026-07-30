// Type-safe client library for MamanZen REST API & Local Sync

export interface UserProfileData {
  userId?: string;
  name: string; // Prénom de la maman
  dueDate: string; // Date d'accouchement prévue
  currentWeek: number | string; // Semaine actuelle de grossesse
  stageMode: "pregnancy" | "postpartum"; // Mode grossesse ou post-partum
  postpartumWeeks?: number;
  babyBirthDate?: string;
  medicalConditions?: string;
  hideTracking?: boolean;
  updatedAt?: string;
}

export interface SymptomLogEntry {
  id: string;
  userId?: string;
  date: string;
  timestamp: number;
  mood: "sad" | "okay" | "peaceful" | "happy" | "radiant";
  energy: "low" | "medium" | "high";
  sleep: "poor" | "fair" | "good" | "excellent";
  symptoms: string[];
  hydration?: number;
  note: string;
  createdAt?: string;
}

export interface ChecklistItemData {
  id: string;
  userId?: string;
  text: string;
  category: "valise" | "demarches" | "rdv" | "trousseau" | "postpartum";
  completed: boolean;
  updatedAt?: string;
}

const DEFAULT_USER_ID = "usr_local";

function getUserId(): string {
  try {
    const saved = localStorage.getItem("mamanzen_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.id || parsed.userId || parsed.email || DEFAULT_USER_ID;
    }
  } catch (e) {}
  return DEFAULT_USER_ID;
}

// ==========================================
// 1. PROFIL & GROSSESSE API CLIENT
// ==========================================

export async function fetchUserProfile(userId?: string): Promise<UserProfileData | null> {
  const targetUserId = userId || getUserId();

  try {
    const res = await fetch(`/api/profile?userId=${encodeURIComponent(targetUserId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.profile) {
        localStorage.setItem(`mamanzen_user_profile_${targetUserId}`, JSON.stringify(data.profile));
        localStorage.setItem("mamanzen_user_profile", JSON.stringify(data.profile));
        return data.profile;
      }
    }
  } catch (err) {
    console.warn("[MamanZen API] Offline mode for profile fetch", err);
  }

  const savedProfile = localStorage.getItem(`mamanzen_user_profile_${targetUserId}`) || localStorage.getItem("mamanzen_user_profile");
  if (savedProfile) {
    try {
      return JSON.parse(savedProfile);
    } catch (e) {}
  }

  return null;
}

export async function saveUserProfile(profile: UserProfileData): Promise<UserProfileData> {
  const targetUserId = profile.userId || getUserId();
  const payload = { ...profile, userId: targetUserId };

  // Local storage save
  localStorage.setItem("mamanzen_user_profile", JSON.stringify(payload));
  localStorage.setItem("mamanzen_user", JSON.stringify(payload));

  try {
    const res = await fetch("/api/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.profile) {
        return data.profile;
      }
    }
  } catch (err) {
    console.warn("[MamanZen API] Offline mode for profile save", err);
  }

  return payload;
}

// ==========================================
// 2. HISTORIQUE DES SYMPTÔMES API CLIENT
// ==========================================

export async function fetchSymptomLogs(userId?: string): Promise<SymptomLogEntry[]> {
  const targetUserId = userId || getUserId();

  try {
    const res = await fetch(`/api/symptom-logs?userId=${encodeURIComponent(targetUserId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        localStorage.setItem(`mamanzen_daily_logs_${targetUserId}`, JSON.stringify(data.logs));
        return data.logs;
      }
    }
  } catch (err) {
    console.warn("[MamanZen API] Offline mode for symptom logs fetch", err);
  }

  // Fallback to localStorage
  const saved = localStorage.getItem(`mamanzen_daily_logs_${targetUserId}`) || localStorage.getItem("mamanzen_daily_logs");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }

  return [];
}

export async function saveSymptomLog(log: Omit<SymptomLogEntry, "id"> & { id?: string }, userId?: string): Promise<SymptomLogEntry[]> {
  const targetUserId = userId || getUserId();
  const payload = { ...log, userId: targetUserId };

  try {
    const res = await fetch("/api/symptom-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        localStorage.setItem(`mamanzen_daily_logs_${targetUserId}`, JSON.stringify(data.logs));
        return data.logs;
      }
    }
  } catch (err) {
    console.warn("[MamanZen API] Offline mode for symptom log save", err);
  }

  // Fallback local update
  const savedLogs = await fetchSymptomLogs(targetUserId);
  const entryId = log.id || "log_" + Date.now();
  const newEntry: SymptomLogEntry = {
    ...log,
    id: entryId,
    userId: targetUserId,
    timestamp: log.timestamp || Date.now()
  };

  const updated = [newEntry, ...savedLogs.filter(l => l.id !== entryId)];
  localStorage.setItem(`mamanzen_daily_logs_${targetUserId}`, JSON.stringify(updated));
  return updated;
}

export async function deleteSymptomLog(logId: string, userId?: string): Promise<SymptomLogEntry[]> {
  const targetUserId = userId || getUserId();

  try {
    const res = await fetch(`/api/symptom-logs/${encodeURIComponent(logId)}?userId=${encodeURIComponent(targetUserId)}`, {
      method: "DELETE"
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.logs)) {
        localStorage.setItem(`mamanzen_daily_logs_${targetUserId}`, JSON.stringify(data.logs));
        return data.logs;
      }
    }
  } catch (err) {
    console.warn("[MamanZen API] Offline mode for symptom log deletion", err);
  }

  const savedLogs = await fetchSymptomLogs(targetUserId);
  const updated = savedLogs.filter(l => l.id !== logId);
  localStorage.setItem(`mamanzen_daily_logs_${targetUserId}`, JSON.stringify(updated));
  return updated;
}

// ==========================================
// 3. CHECKLISTS DYNAMIQUES API CLIENT
// ==========================================

export async function fetchChecklists(userId?: string): Promise<ChecklistItemData[]> {
  const targetUserId = userId || getUserId();

  try {
    const res = await fetch(`/api/checklists?userId=${encodeURIComponent(targetUserId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        localStorage.setItem(`mamanzen_checklists_${targetUserId}`, JSON.stringify(data.items));
        return data.items;
      }
    }
  } catch (err) {
    console.warn("[MamanZen API] Offline mode for checklists fetch", err);
  }

  const saved = localStorage.getItem(`mamanzen_checklists_${targetUserId}`) || localStorage.getItem("mamanzen_checklists_v2");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {}
  }

  return [];
}

export async function toggleChecklistItem(itemId: string, completed: boolean, userId?: string): Promise<ChecklistItemData[]> {
  const targetUserId = userId || getUserId();

  try {
    const res = await fetch(`/api/checklists/${encodeURIComponent(itemId)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: targetUserId, completed })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        localStorage.setItem(`mamanzen_checklists_${targetUserId}`, JSON.stringify(data.items));
        return data.items;
      }
    }
  } catch (err) {
    console.warn("[MamanZen API] Offline mode for checklist toggle", err);
  }

  const current = await fetchChecklists(targetUserId);
  const updated = current.map(i => i.id === itemId ? { ...i, completed } : i);
  localStorage.setItem(`mamanzen_checklists_${targetUserId}`, JSON.stringify(updated));
  return updated;
}

export async function addChecklistItem(text: string, category: ChecklistItemData["category"], userId?: string): Promise<ChecklistItemData[]> {
  const targetUserId = userId || getUserId();

  try {
    const res = await fetch("/api/checklists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: targetUserId, item: { text, category, completed: false } })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        localStorage.setItem(`mamanzen_checklists_${targetUserId}`, JSON.stringify(data.items));
        return data.items;
      }
    }
  } catch (err) {
    console.warn("[MamanZen API] Offline mode for checklist addition", err);
  }

  const current = await fetchChecklists(targetUserId);
  const newItem: ChecklistItemData = {
    id: "item_" + Date.now(),
    text,
    category,
    completed: false
  };
  const updated = [newItem, ...current];
  localStorage.setItem(`mamanzen_checklists_${targetUserId}`, JSON.stringify(updated));
  return updated;
}

export async function deleteChecklistItem(itemId: string, userId?: string): Promise<ChecklistItemData[]> {
  const targetUserId = userId || getUserId();

  try {
    const res = await fetch(`/api/checklists/${encodeURIComponent(itemId)}?userId=${encodeURIComponent(targetUserId)}`, {
      method: "DELETE"
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        localStorage.setItem(`mamanzen_checklists_${targetUserId}`, JSON.stringify(data.items));
        return data.items;
      }
    }
  } catch (err) {
    console.warn("[MamanZen API] Offline mode for checklist deletion", err);
  }

  const current = await fetchChecklists(targetUserId);
  const updated = current.filter(i => i.id !== itemId);
  localStorage.setItem(`mamanzen_checklists_${targetUserId}`, JSON.stringify(updated));
  return updated;
}

export async function resetChecklistsToDefault(userId?: string): Promise<ChecklistItemData[]> {
  const targetUserId = userId || getUserId();

  try {
    const res = await fetch("/api/checklists/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: targetUserId })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.items)) {
        localStorage.setItem("mamanzen_checklists_v2", JSON.stringify(data.items));
        return data.items;
      }
    }
  } catch (err) {
    console.warn("[MamanZen API] Offline mode for checklist reset", err);
  }

  localStorage.removeItem("mamanzen_checklists_v2");
  return fetchChecklists(targetUserId);
}

// ==========================================
// 4. GOOGLE AUTHENTICATION HELPERS
// ==========================================

export async function fetchGoogleAuthConfig(): Promise<{
  configured: boolean;
  clientId: string | null;
  redirectUri: string;
}> {
  try {
    const res = await fetch("/api/auth/google/config");
    if (res.ok) {
      const data = await res.json();
      return {
        configured: Boolean(data.configured),
        clientId: data.clientId,
        redirectUri: data.redirectUri || `${window.location.origin}/auth/callback`
      };
    }
  } catch (e) {
    console.warn("Failed to fetch Google auth config", e);
  }

  return {
    configured: false,
    clientId: null,
    redirectUri: `${window.location.origin}/auth/callback`
  };
}

export async function getGoogleAuthUrl(): Promise<{ url: string } | null> {
  try {
    const res = await fetch(`/api/auth/google/url?origin=${encodeURIComponent(window.location.origin)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.url) {
        return { url: data.url };
      }
    }
  } catch (e) {
    console.warn("Failed to get Google auth URL", e);
  }

  return null;
}

export async function verifyGoogleUserToken(dataPayload: any): Promise<any> {
  try {
    const res = await fetch("/api/auth/google/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataPayload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.user) {
        return data.user;
      }
    }
  } catch (e) {
    console.warn("Failed to verify Google user token", e);
  }

  return null;
}

// ==========================================
// 5. ADMIN BACK-OFFICE API CLIENT
// ==========================================

export async function fetchAdminUsers(): Promise<any[]> {
  try {
    const res = await fetch("/api/admin/users");
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        return data.users;
      }
    }
  } catch (e) {
    console.warn("Failed to fetch admin users from API", e);
  }
  return [];
}

export async function fetchAdminStats(): Promise<any> {
  try {
    const res = await fetch("/api/admin/stats");
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.stats) {
        return data.stats;
      }
    }
  } catch (e) {
    console.warn("Failed to fetch admin stats", e);
  }
  return null;
}

export async function addAdminUser(userPayload: { name: string; email: string; stageMode?: string; currentWeek?: number; maternity_hospital?: string }): Promise<any> {
  try {
    const res = await fetch("/api/admin/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userPayload)
    });
    if (res.ok) {
      const data = await res.json();
      return data.user || null;
    }
  } catch (e) {
    console.warn("Failed to add user via admin API", e);
  }
  return null;
}

export async function toggleAdminUserStatus(userId: string, newStatus: "active" | "suspended"): Promise<boolean> {
  try {
    const res = await fetch("/api/admin/users/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, status: newStatus })
    });
    return res.ok;
  } catch (e) {
    console.warn("Failed to toggle status via admin API", e);
    return false;
  }
}

export async function deleteAdminUser(userId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
      method: "DELETE"
    });
    return res.ok;
  } catch (e) {
    console.warn("Failed to delete user via admin API", e);
    return false;
  }
}


