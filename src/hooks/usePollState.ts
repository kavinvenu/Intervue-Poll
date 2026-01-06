import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Poll {
  id: string;
  question: string;
  duration_seconds: number;
  started_at: string | null;
  is_active: boolean;
}

interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  option_index: number;
  is_correct: boolean;
}

interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  student_id: string;
}

export const usePollState = () => {
  const { toast } = useToast();
  const [activePoll, setActivePoll] = useState<Poll | null>(null);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  const fetchActivePoll = useCallback(async () => {
    try {
      const { data: polls, error } = await supabase
        .from("polls")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (polls && polls.length > 0) {
        setActivePoll(polls[0]);
        await fetchPollOptions(polls[0].id);
        await fetchVotes(polls[0].id);
      } else {
        setActivePoll(null);
        setPollOptions([]);
        setVotes([]);
      }
      setIsConnected(true);
    } catch (error) {
      console.error("Error fetching active poll:", error);
      setIsConnected(false);
      toast({
        title: "Connection Error",
        description: "Failed to sync with server. Retrying...",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchPollOptions = async (pollId: string) => {
    const { data, error } = await supabase
      .from("poll_options")
      .select("*")
      .eq("poll_id", pollId)
      .order("option_index", { ascending: true });

    if (!error) {
      setPollOptions(data || []);
    }
  };

  const fetchVotes = async (pollId: string) => {
    const { data, error } = await supabase
      .from("votes")
      .select("*")
      .eq("poll_id", pollId);

    if (!error) {
      setVotes(data || []);
    }
  };

  useEffect(() => {
    fetchActivePoll();

    const pollChannel = supabase
      .channel("polls-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "polls" },
        () => fetchActivePoll()
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    const voteChannel = supabase
      .channel("votes-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "votes" },
        (payload) => {
          setVotes((prev) => {
            // Prevent duplicate votes from realtime update if already added optimistically
            if (prev.some(v => v.id === payload.new.id)) return prev;
            return [...prev, payload.new as Vote];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(pollChannel);
      supabase.removeChannel(voteChannel);
    };
  }, [fetchActivePoll]);

  const createPoll = async (
    question: string,
    options: { text: string; isCorrect: boolean }[],
    durationSeconds: number
  ) => {
    setIsLoading(true);

    try {
      // First, deactivate any active polls
      await supabase
        .from("polls")
        .update({ is_active: false, ended_at: new Date().toISOString() })
        .eq("is_active", true);

      // Create new poll
      const { data: poll, error: pollError } = await supabase
        .from("polls")
        .insert({
          question,
          duration_seconds: durationSeconds,
          started_at: new Date().toISOString(),
          is_active: true,
        })
        .select()
        .single();

      if (pollError) throw pollError;

      // Create options
      const optionsData = options.map((opt, index) => ({
        poll_id: poll.id,
        option_text: opt.text,
        option_index: index,
        is_correct: opt.isCorrect,
      }));

      const { error: optionsError } = await supabase
        .from("poll_options")
        .insert(optionsData);

      if (optionsError) throw optionsError;

      toast({
        title: "Poll Created",
        description: "Your poll is now live!",
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create poll. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const submitVote = async (pollId: string, optionId: string, studentId: string) => {
    // Check if student already voted
    const existingVote = votes.find(
      (v) => v.poll_id === pollId && v.student_id === studentId
    );

    if (existingVote) {
      toast({
        title: "Already Voted",
        description: "You have already submitted your answer",
        variant: "destructive",
      });
      return false;
    }

    // Optimistic Update
    const optimisticVote: Vote = {
      id: `temp-${Date.now()}`,
      poll_id: pollId,
      option_id: optionId,
      student_id: studentId,
    };

    setVotes((prev) => [...prev, optimisticVote]);

    try {
      const { data, error } = await supabase
        .from("votes")
        .insert({
          poll_id: pollId,
          option_id: optionId,
          student_id: studentId,
        })
        .select()
        .single();

      if (error) {
        // Revert optimistic update on specific error
        setVotes((prev) => prev.filter((v) => v.id !== optimisticVote.id));

        if (error.code === "23505") {
          toast({
            title: "Already Voted",
            description: "You have already submitted your answer",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return false;
      }

      // Replace temp vote with real one
      setVotes((prev) =>
        prev.map(v => v.id === optimisticVote.id ? (data as Vote) : v)
      );

      toast({
        title: "Vote Submitted",
        description: "Your answer has been recorded",
      });

      return true;

    } catch (error) {
      // Revert optimistic update on error
      setVotes((prev) => prev.filter((v) => v.id !== optimisticVote.id));

      toast({
        title: "Error",
        description: "Failed to submit vote. Check your connection.",
        variant: "destructive",
      });
      return false;
    }
  };

  const endPoll = async (pollId: string) => {
    try {
      await supabase
        .from("polls")
        .update({ is_active: false, ended_at: new Date().toISOString() })
        .eq("id", pollId);
    } catch (error) {
      console.error("Error ending poll:", error);
    }
  };

  const getVoteCounts = () => {
    const counts: Record<string, number> = {};
    pollOptions.forEach((opt) => {
      counts[opt.id] = votes.filter((v) => v.option_id === opt.id).length;
    });
    return counts;
  };

  return {
    activePoll,
    pollOptions,
    votes,
    isLoading,
    isConnected,
    createPoll,
    submitVote,
    endPoll,
    getVoteCounts,
    refetch: fetchActivePoll,
  };
};
