import { supabase } from "@/lib/supabase";

export interface UserProfileData {
  userId?: string;
  name: string;
  dueDate: string;
  currentWeek: number | string;
  stageMode: "pregnancy" | "postpartum";
  postpartumWeeks?: number;
  babyBirthDate?: string;
  medicalConditions?: string;
  hideTracking?: boolean;
}

export interface SymptomLogEntry {
  id?: string;
  userId?: string;
  date: string;
  mood: "sad" | "okay" | "peaceful" | "happy" | "radiant";
  energy: "low" | "medium" | "high";
  symptoms: string[];
  hydration?: number;
  note: string;
}

export interface ChecklistItemData {
  id: string;
  userId?: string;
  text: string;
  category: "valise" | "demarches" | "rdv" | "trousseau" | "postpartum";
  completed: boolean;
}

async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data?.user?.id || null;
}

// ==========================================
// 1. PROFIL UTILISATEUR
// ==========================================

export async function fetchUserProfile(userId?: string): Promise<UserProfileData | null> {
  const uid = userId || await getCurrentUserId();
  if (!uid) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", uid)
    .single();

  if (error || !data) return null;

  return {
    userId: data.id,
    name: data.name || "",
    dueDate: data.due_date || "",
    currentWeek: data.current_week || 1,
    stageMode: data.stage_mode || "pregnancy",
    postpartumWeeks: data.postpartum_weeks || 0,
    babyBirthDate: data.baby_birth_date || "",
    medicalConditions: data.medical_conditions || "",
    hideTracking: data.hide_tracking || false,
  };
}

export async function saveUserProfile(profile: UserProfileData): Promise<UserProfileData> {
  const uid = profile.userId || await getCurrentUserId();
  if (!uid) throw new Error("No authenticated user");

  const { error } = await supabase.from("profiles").upsert({
    id: uid,
    name: profile.name,
    due_date: profile.dueDate || null,
    current_week: typeof profile.currentWeek === 'number' ? profile.currentWeek : parseInt(profile.currentWeek as string) || 1,
    stage_mode: profile.stageMode,
    postpartum_weeks: profile.postpartumWeeks || 0,
    baby_birth_date: profile.babyBirthDate || null,
    medical_conditions: profile.medicalConditions || null,
    hide_tracking: profile.hideTracking || false,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
  return profile;
}

// ==========================================
// 2. SYMPTÔMES
// ==========================================

export async function fetchSymptomLogs(userId?: string): Promise<SymptomLogEntry[]> {
  const uid = userId || await getCurrentUserId();
  if (!uid) return [];

  const { data, error } = await supabase
    .from("symptom_logs")
    .select("*")
    .eq("user_id", uid)
    .order("date", { ascending: false });

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    date: row.date,
    mood: row.mood || "peaceful",
    energy: row.energy_level ? (row.energy_level >= 3 ? "high" : row.energy_level >= 2 ? "medium" : "low") : "medium",
    symptoms: row.symptoms || [],
    hydration: row.water_ml || 0,
    note: row.notes || "",
  }));
}

export async function saveSymptomLog(entry: SymptomLogEntry): Promise<SymptomLogEntry> {
  const uid = entry.userId || await getCurrentUserId();
  if (!uid) throw new Error("No authenticated user");

  const energyLevel = entry.energy === "high" ? 3 : entry.energy === "medium" ? 2 : 1;

  const { error } = await supabase.from("symptom_logs").insert({
    user_id: uid,
    date: entry.date,
    mood: entry.mood,
    energy_level: energyLevel,
    symptoms: entry.symptoms,
    water_ml: entry.hydration || 0,
    notes: entry.note,
  });

  if (error) throw error;
  return entry;
}

export async function deleteSymptomLog(logId: string): Promise<void> {
  const { error } = await supabase.from("symptom_logs").delete().eq("id", logId);
  if (error) throw error;
}

// ==========================================
// 3. CHECKLISTS
// ==========================================

export async function fetchChecklists(userId?: string): Promise<ChecklistItemData[]> {
  const uid = userId || await getCurrentUserId();
  if (!uid) return [];

  const { data, error } = await supabase
    .from("checklists")
    .select("*")
    .eq("user_id", uid)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    userId: row.user_id,
    text: row.text,
    category: row.category || "valise",
    completed: row.completed || false,
  }));
}

export async function toggleChecklistItem(itemId: string, completed: boolean): Promise<void> {
  const { error } = await supabase
    .from("checklists")
    .update({ completed, updated_at: new Date().toISOString() })
    .eq("id", itemId);
  if (error) throw error;
}

export async function addChecklistItem(item: { text: string; category: string }): Promise<void> {
  const uid = await getCurrentUserId();
  if (!uid) throw new Error("No authenticated user");

  const { error } = await supabase.from("checklists").insert({
    user_id: uid,
    text: item.text,
    category: item.category,
    completed: false,
  });
  if (error) throw error;
}

export async function deleteChecklistItem(itemId: string): Promise<void> {
  const { error } = await supabase.from("checklists").delete().eq("id", itemId);
  if (error) throw error;
}

// ==========================================
// 4. ADMIN (via Supabase direct)
// ==========================================

export async function fetchAdminUsers(): Promise<any[]> {
  const { data, error } = await supabase.from("profiles").select("*");
  if (error || !data) return [];
  return data;
}

export async function fetchAdminStats(): Promise<any> {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true });
  const { count: totalLogs } = await supabase.from("symptom_logs").select("*", { count: "exact", head: true });
  const { count: totalPosts } = await supabase.from("community_posts").select("*", { count: "exact", head: true });
  const { count: newUsersThisMonth } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", startOfMonth);

  return {
    totalUsers: totalUsers || 0,
    totalLogs: totalLogs || 0,
    totalPosts: totalPosts || 0,
    newUsersThisMonth: newUsersThisMonth || 0,
    dau: 0,
    wau: 0,
    mau: 0,
  };
}

export async function addAdminUser(data: { name: string; email: string; stage: string; current_week: number }): Promise<any> {
  const { error } = await supabase.from("profiles").insert({
    name: data.name,
    email: data.email,
    role: "user",
    stage_mode: data.stage === "enceinte" ? "pregnancy" : "postpartum",
    current_week: data.current_week,
  });
  if (error) throw error;
  return { success: true };
}

export async function toggleAdminUserStatus(userId: string, status: string): Promise<any> {
  const { error } = await supabase.from("profiles").update({ status, updated_at: new Date().toISOString() }).eq("id", userId);
  if (error) throw error;
  return { success: true, status };
}

export async function deleteAdminUser(userId: string): Promise<any> {
  const { error } = await supabase.from("profiles").delete().eq("id", userId);
  if (error) throw error;
  return { success: true };
}

// ==========================================
// 5. AUTH (Google)
// ==========================================

export async function fetchGoogleAuthConfig(): Promise<{ configured: boolean; clientId: string | null }> {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || null;
  return { configured: Boolean(clientId), clientId };
}

export async function getGoogleAuthUrl(): Promise<string | null> {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin + "/auth/callback" },
  });
  if (error || !data) return null;
  return data.url;
}

// ==========================================
// 6. HYDRATION
// ==========================================

export async function fetchTodayHydration(): Promise<number> {
  const uid = await getCurrentUserId();
  if (!uid) return 0;

  const todayStr = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  const { data, error } = await supabase
    .from("symptom_logs")
    .select("water_ml")
    .eq("user_id", uid)
    .eq("date", todayStr)
    .maybeSingle();

  if (error || !data) return 0;
  return data.water_ml || 0;
}

export async function saveHydrationCount(glasses: number): Promise<void> {
  const uid = await getCurrentUserId();
  if (!uid) throw new Error("No authenticated user");

  const todayStr = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  const { data: existing } = await supabase
    .from("symptom_logs")
    .select("id")
    .eq("user_id", uid)
    .eq("date", todayStr)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("symptom_logs")
      .update({ water_ml: glasses })
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("symptom_logs")
      .insert({
        user_id: uid,
        date: todayStr,
        water_ml: glasses,
        mood: "okay",
        energy_level: 2,
        symptoms: [],
        notes: "",
      });
    if (error) throw error;
  }
}

// ==========================================
// 7. FAVORITE WEEKS
// ==========================================

export async function fetchFavoriteWeeks(): Promise<number[]> {
  const uid = await getCurrentUserId();
  if (!uid) return [];

  const { data, error } = await supabase
    .from("favorite_weeks")
    .select("week_number")
    .eq("user_id", uid);

  if (error || !data) return [];
  return data.map((row: any) => row.week_number);
}

export async function toggleFavoriteWeek(weekNumber: number): Promise<void> {
  const uid = await getCurrentUserId();
  if (!uid) throw new Error("No authenticated user");

  const { data: existing } = await supabase
    .from("favorite_weeks")
    .select("id")
    .eq("user_id", uid)
    .eq("week_number", weekNumber)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("favorite_weeks")
      .delete()
      .eq("id", existing.id);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("favorite_weeks")
      .insert({ user_id: uid, week_number: weekNumber });
    if (error) throw error;
  }
}

export async function verifyGoogleUserToken(accessToken: string): Promise<any> {
  const { data, error } = await supabase.auth.getUser(accessToken);
  if (error || !data?.user) return null;
  return {
    id: data.user.id,
    email: data.user.email,
    name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || "",
    avatar: data.user.user_metadata?.avatar_url || "",
  };
}
