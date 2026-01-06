import { useState, useEffect } from "react";
import TeacherCreatePoll from "@/components/poll/TeacherCreatePoll";
import TeacherDashboard from "@/components/poll/TeacherDashboard";
import PollHistory from "@/components/poll/PollHistory";
import { usePollState } from "@/hooks/usePollState";
import { useStudentsList } from "@/hooks/useStudentsList";
import { usePollHistory } from "@/hooks/usePollHistory";
import { usePollTimer } from "@/hooks/usePollTimer";
import { Loader2 } from "lucide-react";

type View = "create" | "dashboard" | "history";

const TeacherPage = () => {
  const [view, setView] = useState<View>("create");
  const { activePoll, pollOptions, votes, isLoading, createPoll, getVoteCounts, endPoll } = usePollState();
  const { students, kickStudent } = useStudentsList();
  const { polls: historyPolls, fetchPollHistory } = usePollHistory();

  const { timeRemaining, isExpired } = usePollTimer({
    startedAt: activePoll?.started_at || null,
    durationSeconds: activePoll?.duration_seconds || 60,
    isActive: !!activePoll?.is_active,
    onTimeUp: () => {
      if (activePoll) {
        endPoll(activePoll.id);
      }
    },
  });

  // Switch to dashboard when poll is active
  useEffect(() => {
    if (activePoll && view === "create") {
      setView("dashboard");
    }
  }, [activePoll, view]);

  const handleCreatePoll = async (
    question: string,
    options: { text: string; isCorrect: boolean }[],
    durationSeconds: number
  ) => {
    const success = await createPoll(question, options, durationSeconds);
    if (success) {
      setView("dashboard");
    }
  };

  const handleAskNewQuestion = () => {
    setView("create");
  };

  const handleViewHistory = () => {
    fetchPollHistory();
    setView("history");
  };

  const handleBackFromHistory = () => {
    if (activePoll) {
      setView("dashboard");
    } else {
      setView("create");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  // History view
  if (view === "history") {
    return <PollHistory polls={historyPolls} onBack={handleBackFromHistory} />;
  }

  // Create poll view
  if (view === "create" || !activePoll) {
    return <TeacherCreatePoll onCreatePoll={handleCreatePoll} isLoading={isLoading} />;
  }

  // Dashboard view
  const voteCounts = getVoteCounts();
  const formattedOptions = pollOptions.map((opt) => ({
    id: opt.id,
    text: opt.option_text,
    votes: voteCounts[opt.id] || 0,
  }));

  const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);

  // Can ask new question if poll expired or all students voted
  const allStudentsVoted = students.length > 0 && votes.length >= students.length;
  const canAskNewQuestion = isExpired || allStudentsVoted;

  return (
    <TeacherDashboard
      questionNumber={1}
      question={activePoll.question}
      options={formattedOptions}
      totalVotes={totalVotes}
      students={students.map((s) => ({ id: s.id, name: s.name }))}
      onKickStudent={kickStudent}
      onAskNewQuestion={handleAskNewQuestion}
      onViewHistory={handleViewHistory}
      canAskNewQuestion={canAskNewQuestion}
    />
  );
};

export default TeacherPage;
