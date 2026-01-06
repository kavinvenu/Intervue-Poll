import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PollOption {
  id: string;
  option_text: string;
  option_index: number;
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  votes: { option_id: string }[];
}

interface FormattedPoll {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: number;
  }[];
  totalVotes: number;
}

export const usePollHistory = () => {
  const [polls, setPolls] = useState<FormattedPoll[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPollHistory = useCallback(async () => {
    setIsLoading(true);

    const { data: pollsData, error: pollsError } = await supabase
      .from("polls")
      .select(`
        id,
        question,
        poll_options (
          id,
          option_text,
          option_index
        ),
        votes (
          option_id
        )
      `)
      .eq("is_active", false)
      .order("created_at", { ascending: false });

    if (pollsError) {
      console.error("Error fetching poll history:", pollsError);
      setIsLoading(false);
      return;
    }

    const formatted: FormattedPoll[] = (pollsData || []).map((poll: any) => {
      const options = (poll.poll_options || [])
        .sort((a: PollOption, b: PollOption) => a.option_index - b.option_index)
        .map((opt: PollOption) => ({
          id: opt.id,
          text: opt.option_text,
          votes: (poll.votes || []).filter((v: any) => v.option_id === opt.id).length,
        }));

      return {
        id: poll.id,
        question: poll.question,
        options,
        totalVotes: (poll.votes || []).length,
      };
    });

    setPolls(formatted);
    setIsLoading(false);
  }, []);

  return {
    polls,
    isLoading,
    fetchPollHistory,
  };
};
