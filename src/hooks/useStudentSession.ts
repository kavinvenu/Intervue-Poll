import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  session_id: string;
  is_kicked: boolean;
}

export const useStudentSession = () => {
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isKicked, setIsKicked] = useState(false);

  // Generate or retrieve session ID
  const getSessionId = useCallback(() => {
    let sessionId = sessionStorage.getItem("poll_session_id");
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem("poll_session_id", sessionId);
    }
    return sessionId;
  }, []);

  // Check for existing session
  const checkExistingSession = useCallback(async () => {
    const sessionId = getSessionId();

    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("session_id", sessionId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking session:", error);
    }

    if (data) {
      if (data.is_kicked) {
        setIsKicked(true);
      } else {
        setStudent(data);
      }
    }

    setIsLoading(false);
  }, [getSessionId]);

  useEffect(() => {
    checkExistingSession();

    // Subscribe to student updates (for kick functionality)
    const sessionId = getSessionId();
    const channel = supabase
      .channel("student-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "students",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const updated = payload.new as Student;
          if (updated.is_kicked) {
            setIsKicked(true);
            toast({
              title: "Removed from Session",
              description: "You have been removed by the teacher",
              variant: "destructive",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [checkExistingSession, getSessionId, toast]);

  const joinSession = async (name: string) => {
    setIsLoading(true);
    const sessionId = getSessionId();

    const { data, error } = await supabase
      .from("students")
      .insert({
        name,
        session_id: sessionId,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        // Session already exists, fetch it
        await checkExistingSession();
      } else {
        toast({
          title: "Error",
          description: "Failed to join session",
          variant: "destructive",
        });
      }
      setIsLoading(false);
      return false;
    }

    setStudent(data);
    setIsLoading(false);
    return true;
  };

  return {
    student,
    isLoading,
    isKicked,
    joinSession,
  };
};
