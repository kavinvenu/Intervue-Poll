import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  session_id: string;
  is_kicked: boolean;
}

export const useStudentsList = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("is_kicked", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching students:", error);
      return;
    }

    setStudents(data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchStudents();

    const channel = supabase
      .channel("students-list")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "students" },
        () => {
          fetchStudents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchStudents]);

  const kickStudent = async (studentId: string) => {
    const { error } = await supabase
      .from("students")
      .update({ is_kicked: true })
      .eq("id", studentId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove student",
        variant: "destructive",
      });
      return false;
    }

    toast({
      title: "Student Removed",
      description: "The student has been removed from the session",
    });

    return true;
  };

  return {
    students,
    isLoading,
    kickStudent,
    refetch: fetchStudents,
  };
};
