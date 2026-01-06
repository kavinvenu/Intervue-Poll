import { Loader2 } from "lucide-react";
import Badge from "./Badge";

interface WaitingScreenProps {
  message?: string;
}

const WaitingScreen = ({ message = "Wait for the teacher to ask questions.." }: WaitingScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in">
      <Badge />
      
      <div className="mt-10">
        <Loader2 className="w-16 h-16 text-primary animate-spin" strokeWidth={2} />
      </div>
      
      <h2 className="mt-6 text-2xl font-bold text-foreground text-center">
        {message}
      </h2>
    </div>
  );
};

export default WaitingScreen;
