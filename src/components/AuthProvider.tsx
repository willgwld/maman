import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  isSupabaseConfigured: boolean;
  userRole: string;
  setLocalUser: (user: any) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isSupabaseConfigured: false,
  userRole: "user",
  setLocalUser: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const env = (import.meta as any).env || {};
  const supabaseUrl = env.VITE_SUPABASE_URL || "";
  const isSupabaseConfigured = Boolean(
    supabaseUrl &&
    !supabaseUrl.includes("placeholder") &&
    supabaseUrl.startsWith("https://")
  );

  const [user, setUser] = useState<any | null>(() => {
    const saved = localStorage.getItem("mamanzen_user");
    if (saved) {
      try {
        const metadata = JSON.parse(saved);
        return {
          id: metadata.id,
          email: metadata.email,
          user_metadata: metadata,
        };
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  const fetchProfileRole = async (userId: string) => {
    const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
    return data?.role || "user";
  };

  useEffect(() => {
    let mounted = true;

    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(async ({ data: { session } }) => {
        if (!mounted) return;
        if (session?.user) {
          const supaUser = {
            id: session.user.id,
            email: session.user.email,
            user_metadata: {
              ...session.user.user_metadata,
              id: session.user.id,
              email: session.user.email,
            }
          };
          const role = await fetchProfileRole(supaUser.id);
          if (!mounted) return;
          (supaUser.user_metadata as any).role = role;
          setUser(supaUser);
          localStorage.setItem("mamanzen_user", JSON.stringify(supaUser.user_metadata));
        }
        setLoading(false);
      }).catch(() => {
        if (mounted) setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;
        if (session?.user) {
          const supaUser = {
            id: session.user.id,
            email: session.user.email,
            user_metadata: {
              ...session.user.user_metadata,
              id: session.user.id,
              email: session.user.email,
            }
          };
          const role = await fetchProfileRole(supaUser.id);
          (supaUser.user_metadata as any).role = role;
          setUser(supaUser);
          localStorage.setItem("mamanzen_user", JSON.stringify(supaUser.user_metadata));
        } else {
          setUser(null);
          localStorage.removeItem("mamanzen_user");
        }
        setLoading(false);
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, [isSupabaseConfigured]);

  const setLocalUser = (userObj: any) => {
    setUser(userObj);
    if (userObj?.user_metadata) {
      localStorage.setItem("mamanzen_user", JSON.stringify(userObj.user_metadata));
    } else if (userObj) {
      localStorage.setItem("mamanzen_user", JSON.stringify(userObj));
    } else {
      localStorage.removeItem("mamanzen_user");
    }
  };

  const signOut = () => {
    if (isSupabaseConfigured) {
      supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
    localStorage.removeItem("mamanzen_user");
    localStorage.removeItem("mamanzen_onboarding_completed");
    localStorage.removeItem("mamanzen_registered_emails");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isSupabaseConfigured,
        userRole: (user?.user_metadata as any)?.role || "user",
        setLocalUser,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
