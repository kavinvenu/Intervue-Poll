import { useState } from "react";
import { Button } from "@/components/ui/button";
import Timer from "./Timer";
import QuestionCard from "./QuestionCard";
import PollOption from "./PollOption";
import ChatPopup from "./ChatPopup";
import ChatPanel from "./ChatPanel";

interface Option {
  id: string;
  text: string;
  votes?: number;
}

interface Student {
  id: string;
  name: string;
}

interface StudentPollViewProps {
  questionNumber: number;
  question: string;
  options: Option[];
  timeRemaining: number;
  hasVoted: boolean;
  selectedOptionId: string | null;
  onVote: (optionId: string) => void;
  totalVotes?: number;
  studentName: string;
  studentId: string;
  students?: Student[];
}

const StudentPollView = ({
  questionNumber,
  question,
  options,
  timeRemaining,
  hasVoted,
  selectedOptionId,
  onVote,
  totalVotes = 0,
  studentName,
  studentId,
  students = [],
}: StudentPollViewProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(selectedOptionId);
  const showResults = hasVoted || timeRemaining <= 0;

  const handleOptionClick = (optionId: string) => {
    if (!hasVoted && timeRemaining > 0) {
      setSelectedOption(optionId);
    }
  };

  const handleSubmit = () => {
    if (selectedOption && !hasVoted) {
      onVote(selectedOption);
    }
  };

  const getPercentage = (option: Option) => {
    if (totalVotes === 0) return 0;
    return Math.round(((option.votes || 0) / totalVotes) * 100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-xl font-bold text-foreground">Question {questionNumber}</h2>
          <Timer seconds={timeRemaining} />
        </div>

        <QuestionCard question={question}>
          {options.map((option, idx) => (
            <PollOption
              key={option.id}
              index={idx + 1}
              text={option.text}
              selected={selectedOption === option.id}
              onClick={() => handleOptionClick(option.id)}
              disabled={hasVoted || timeRemaining <= 0}
              showResults={showResults}
              percentage={showResults ? getPercentage(option) : 0}
            />
          ))}
        </QuestionCard>

        {!hasVoted && timeRemaining > 0 && (
          <div className="flex justify-end mt-6">
            <Button
              variant="pill"
              size="pill"
              onClick={handleSubmit}
              disabled={!selectedOption}
            >
              Submit
            </Button>
          </div>
        )}

        {showResults && (
          <p className="text-center mt-8 text-lg font-bold text-foreground animate-fade-in">
            Wait for the teacher to ask a new question.
          </p>
        )}
      </div>

      <ChatPopup
        senderName={studentName}
        senderId={studentId}
        isTeacher={false}
        students={students}
      />
    </div>
  );
};

export default StudentPollView;
