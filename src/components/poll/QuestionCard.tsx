import { ReactNode } from "react";

interface QuestionCardProps {
  question: string;
  children: ReactNode;
}

const QuestionCard = ({ question, children }: QuestionCardProps) => {
  return (
    <div className="w-full max-w-[727px] rounded-[9px] border border-primary/30 overflow-hidden animate-scale-in mx-auto">
      <div className="bg-question-header text-question-header-foreground px-6 py-4">
        <p className="font-medium">{question}</p>
      </div>

      <div className="p-4 flex flex-col gap-[14px] bg-card">
        {children}
      </div>
    </div>
  );
};

export default QuestionCard;
