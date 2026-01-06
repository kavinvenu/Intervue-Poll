import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import QuestionCard from "./QuestionCard";
import PollOption from "./PollOption";
import ChatPopup from "./ChatPopup";
import ChatPanel from "./ChatPanel";

interface Option {
  id: string;
  text: string;
  votes: number;
}

interface Student {
  id: string;
  name: string;
}

interface TeacherDashboardProps {
  questionNumber: number;
  question: string;
  options: Option[];
  totalVotes: number;
  students: Student[];
  onKickStudent: (studentId: string) => void;
  onAskNewQuestion: () => void;
  onViewHistory: () => void;
  canAskNewQuestion: boolean;
}

const TeacherDashboard = ({
  question,
  options,
  totalVotes,
  students,
  onKickStudent,
  onAskNewQuestion,
  onViewHistory,
  canAskNewQuestion,
}: TeacherDashboardProps) => {
  const getPercentage = (option: Option) => {
    if (totalVotes === 0) return 0;
    return Math.round((option.votes / totalVotes) * 100);
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-end mb-6">
          <Button
            variant="pill"
            size="pill"
            onClick={onViewHistory}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            View Poll history
          </Button>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground mb-4">Question</h2>

            <QuestionCard question={question}>
              {options.map((option, idx) => (
                <PollOption
                  key={option.id}
                  index={idx + 1}
                  text={option.text}
                  showResults={true}
                  percentage={getPercentage(option)}
                  disabled={true}
                />
              ))}
            </QuestionCard>

            <div className="flex justify-center mt-8">
              <Button
                variant="pill"
                size="pill"
                onClick={onAskNewQuestion}
                disabled={!canAskNewQuestion}
              >
                + Ask a new question
              </Button>
            </div>
          </div>

        </div>
      </div>

      <ChatPopup
        senderName="Teacher"
        senderId="teacher"
        isTeacher={true}
        students={students}
        onKickStudent={onKickStudent}
      />
    </div >
  );
};

export default TeacherDashboard;
