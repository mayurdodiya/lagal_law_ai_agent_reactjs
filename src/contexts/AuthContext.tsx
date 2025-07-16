import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
type AuthContextType = {
  user:
    | (User & {
        userProfileInfo: Tables<"profiles">;
      })
    | null;
  session: Session | null;
  loading: boolean;
  setUser: (values: (Partial<User> & Partial<{ userProfileInfo: Tables<"profiles"> }>) | null) => void;
  signOut: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<
    | (User & {
        userProfileInfo: Tables<"profiles">;
      })
    | null
  >(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserProfileDetails = async () => {
    if (user) {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user?.id).single();

      if (!user.userProfileInfo) {
        setUser((prevData: User) => ({ ...prevData, userProfileInfo: data }));
      }
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!user) {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: sessionFromGet } }) => {
      setSession(sessionFromGet);
      if (!user) {
        setUser(session?.user ?? null);
      }
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      getUserProfileDetails();
    }
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };
  const value = {
    user,
    session,
    loading,
    signOut,
    setUser,
  };
  return <AuthContext value={value}>{children}</AuthContext>;
};
