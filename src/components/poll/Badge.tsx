import { Sparkles } from "lucide-react";

interface BadgeProps {
  text?: string;
}

const Badge = ({ text = "Intervue Poll" }: BadgeProps) => {
  return (
    <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-pill text-sm font-medium">
      <Sparkles className="w-4 h-4" />
      <span>{text}</span>
    </div>
  );
};

export default Badge;
