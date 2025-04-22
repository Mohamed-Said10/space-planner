import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useAuthProfile() {
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const user = session.user;

          // Option 1: Create only if profile doesn't exist
          const { data: existingProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          if (!existingProfile) {
            const { error } = await supabase.from("profiles").insert({
              id: user.id,
              full_name: user.user_metadata.full_name || user.email,
              role: "client",
            });

            if (error) console.error("Error creating profile:", error);
          }
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);
}
