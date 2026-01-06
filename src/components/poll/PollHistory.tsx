import QuestionCard from "./QuestionCard";
import PollOption from "./PollOption";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Option {
  id: string;
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: Option[];
  totalVotes: number;
}

interface PollHistoryProps {
  polls: Poll[];
  onBack: () => void;
}

const PollHistory = ({ polls, onBack }: PollHistoryProps) => {
  const getPercentage = (option: Option, totalVotes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((option.votes / totalVotes) * 100);
  };

  return (
    <div className="min-h-screen p-6 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <h1 className="text-4xl font-light text-foreground mb-8">
          View <span className="font-bold">Poll History</span>
        </h1>

        <div className="space-y-8">
          {polls.map((poll, index) => (
            <div key={poll.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <h2 className="text-lg font-bold text-foreground mb-4">
                Question {polls.length - index}
              </h2>
              <QuestionCard question={poll.question}>
                {poll.options.map((option, idx) => (
                  <PollOption
                    key={option.id}
                    index={idx + 1}
                    text={option.text}
                    showResults={true}
                    percentage={getPercentage(option, poll.totalVotes)}
                    disabled={true}
                  />
                ))}
              </QuestionCard>
            </div>
          ))}

          {polls.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No polls have been conducted yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollHistory;
