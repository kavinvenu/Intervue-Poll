import { Clock } from "lucide-react";

interface TimerProps {
  seconds: number;
}

const Timer = ({ seconds }: TimerProps) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  return (
    <div className="flex items-center gap-2 text-timer font-medium">
      <Clock className="w-5 h-5" />
      <span className="text-lg">{formattedTime}</span>
    </div>
  );
};

export default Timer;
