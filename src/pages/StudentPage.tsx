import { useState, useEffect } from "react";
import NameInput from "@/components/poll/NameInput";
import WaitingScreen from "@/components/poll/WaitingScreen";
import StudentPollView from "@/components/poll/StudentPollView";
import KickedOutScreen from "@/components/poll/KickedOutScreen";
import { useStudentSession } from "@/hooks/useStudentSession";
import { usePollState } from "@/hooks/usePollState";
import { usePollTimer } from "@/hooks/usePollTimer";
import { useStudentsList } from "@/hooks/useStudentsList";
import { Loader2 } from "lucide-react";

const StudentPage = () => {
  const { student, isLoading: sessionLoading, isKicked, joinSession } = useStudentSession();
  const { activePoll, pollOptions, votes, isLoading: pollLoading, submitVote, getVoteCounts, isConnected } = usePollState();
  const { students } = useStudentsList();
  const [hasVoted, setHasVoted] = useState(false);

  const { timeRemaining } = usePollTimer({
    startedAt: activePoll?.started_at || null,
    durationSeconds: activePoll?.duration_seconds || 60,
    isActive: !!activePoll?.is_active,
  });

  // Check if student already voted
  useEffect(() => {
    if (student && activePoll) {
      const voted = votes.some(
        (v) => v.poll_id === activePoll.id && v.student_id === student.id
      );
      setHasVoted(voted);
    }
  }, [student, activePoll, votes]);

  const handleJoin = async (name: string) => {
    await joinSession(name);
  };

  const handleVote = async (optionId: string) => {
    if (!student || !activePoll) return;
    const success = await submitVote(activePoll.id, optionId, student.id);
    if (success) {
      setHasVoted(true);
    }
  };

  // Loading state
  if (sessionLoading || pollLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  // Kicked out screen
  if (isKicked) {
    return <KickedOutScreen />;
  }

  // Name input if no student
  if (!student) {
    return <NameInput onSubmit={handleJoin} />;
  }

  // Waiting screen if no active poll
  if (!activePoll) {
    return <WaitingScreen />;
  }

  // Format options with vote counts
  const voteCounts = getVoteCounts();
  const formattedOptions = pollOptions.map((opt) => ({
    id: opt.id,
    text: opt.option_text,
    votes: voteCounts[opt.id] || 0,
  }));

  const totalVotes = Object.values(voteCounts).reduce((a, b) => a + b, 0);

  // Find the student's selected option
  const studentVote = votes.find(
    (v) => v.poll_id === activePoll.id && v.student_id === student.id
  );

  // Format students for panel
  const formattedStudents = students.map((s) => ({ id: s.id, name: s.name }));

  return (
    <>
      {!isConnected && (
        <div className="bg-destructive/15 text-destructive text-center py-2 px-4 text-sm font-medium">
          Connection lost. Trying to reconnect...
        </div>
      )}
      <StudentPollView
        questionNumber={1}
        question={activePoll.question}
        options={formattedOptions}
        timeRemaining={timeRemaining}
        hasVoted={hasVoted}
        selectedOptionId={studentVote?.option_id || null}
        onVote={handleVote}
        totalVotes={totalVotes}
        studentName={student.name}
        studentId={student.id}
        students={formattedStudents}
      />
    </>
  );
};

export default StudentPage;
