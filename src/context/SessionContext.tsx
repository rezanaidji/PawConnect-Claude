import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../supabase";
import LoadingPage from "../pages/LoadingPage";
import { Session } from "@supabase/supabase-js";

export type UserRole = "user" | "admin" | "super_admin";

const SessionContext = createContext<{
  session: Session | null;
  role: UserRole | null;
  isLoading: boolean;
}>({
  session: null,
  role: null,
  isLoading: true,
});

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

type Props = { children: React.ReactNode };
export const SessionProvider = ({ children }: Props) => {
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for auth state changes — keep callback sync to avoid deadlock
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (!session) {
          setRole(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch role separately when session changes — avoids deadlock in onAuthStateChange
  useEffect(() => {
    if (!session?.user) {
      return;
    }

    let cancelled = false;

    const fetchRole = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (cancelled) return;

      if (error) {
        console.error("Error fetching role:", error);
        setRole(null);
      } else {
        setRole(data.role as UserRole);
      }
      setIsLoading(false);
    };

    fetchRole();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  return (
    <SessionContext.Provider value={{ session, role, isLoading }}>
      {isLoading ? <LoadingPage /> : children}
    </SessionContext.Provider>
  );
};
