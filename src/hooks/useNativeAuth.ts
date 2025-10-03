import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useNativeAuth = () => {
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOutFromGoogle = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return {
    signInWithGoogle,
    signOutFromGoogle,
    loading,
  };
};
