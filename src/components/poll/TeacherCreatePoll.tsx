import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import Badge from "./Badge";

interface PollOption {
  text: string;
  isCorrect: boolean;
}

interface TeacherCreatePollProps {
  onCreatePoll: (question: string, options: PollOption[], durationSeconds: number) => void;
  isLoading?: boolean;
}

import { useToast } from "@/hooks/use-toast";

const TeacherCreatePoll = ({ onCreatePoll, isLoading = false }: TeacherCreatePollProps) => {
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<PollOption[]>([
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
  ]);
  const [duration, setDuration] = useState(60);

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, { text: "", isCorrect: false }]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const updateOptionText = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const updateOptionCorrect = (index: number, isCorrect: boolean) => {
    if (!isCorrect) return; // Prevent unchecking via radio click, force selection of another
    const newOptions = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }));
    setOptions(newOptions);
  };

  const filledOptions = options.map(o => o.text.trim()).filter(t => t !== "");
  const hasDuplicates = new Set(filledOptions).size !== filledOptions.length;
  const hasCorrectOption = options.some(o => o.isCorrect);
  const isValid = question.trim() && options.every(o => o.text.trim()) && !hasDuplicates && hasCorrectOption;

  const handleSubmit = () => {
    if (hasDuplicates) {
      toast({
        title: "Duplicate Options",
        description: "Each option must be unique. Please remove duplicate entries.",
        variant: "destructive",
      });
      return;
    }

    if (!hasCorrectOption) {
      toast({
        title: "No Correct Option",
        description: "Please mark at least one option as correct.",
        variant: "destructive",
      });
      return;
    }

    if (question.trim() && options.every(o => o.text.trim())) {
      onCreatePoll(question.trim(), options, duration);
    }
  };

  return (
    <div className="min-h-screen p-6 pb-32 animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <Badge />

        <h1 className="mt-6 text-4xl font-light text-foreground">
          Let's <span className="font-bold">Get Started</span>
        </h1>

        <p className="mt-2 text-muted-foreground">
          you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold text-foreground">
              Enter your question
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium cursor-pointer focus:outline-none"
            >
              <option value={30}>30 seconds</option>
              <option value={60}>60 seconds</option>
              <option value={90}>90 seconds</option>
              <option value={120}>120 seconds</option>
            </select>
          </div>

          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, 100))}
              placeholder="Type your question here..."
              className="w-full px-4 py-4 bg-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-32"
              disabled={isLoading}
            />
            <span className="absolute bottom-3 right-3 text-sm text-muted-foreground">
              {question.length}/100
            </span>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <label className="text-lg font-semibold text-foreground">
              Edit Options
            </label>
            <label className="text-lg font-semibold text-foreground">
              Is it Correct?
            </label>
          </div>

          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index} className="flex items-center gap-4 animate-fade-in">
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => updateOptionText(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 px-4 py-3 bg-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isLoading}
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`correct-${index}`}
                      checked={option.isCorrect}
                      onChange={() => updateOptionCorrect(index, true)}
                      className="w-5 h-5 accent-primary"
                    />
                    <span className="text-sm text-foreground">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`correct-${index}`}
                      checked={!option.isCorrect}
                      onChange={() => updateOptionCorrect(index, false)}
                      className="w-5 h-5 accent-primary"
                    />
                    <span className="text-sm text-foreground">No</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          {hasDuplicates && (
            <p className="mt-2 text-sm text-destructive font-medium">
              * Duplicate options are not allowed.
            </p>
          )}

          {options.length < 6 && (
            <button
              onClick={addOption}
              className="mt-4 flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add More option
            </button>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
          <div className="max-w-3xl mx-auto flex justify-end">
            <Button
              variant="pill"
              size="pill"
              onClick={handleSubmit}
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Creating..." : "Ask Question"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCreatePoll;
