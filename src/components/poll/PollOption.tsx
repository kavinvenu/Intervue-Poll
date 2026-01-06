import { cn } from "@/lib/utils";
import OptionBadge from "./OptionBadge";

interface PollOptionProps {
  index: number;
  text: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  showResults?: boolean;
  percentage?: number;
}

const PollOption = ({
  index,
  text,
  selected = false,
  onClick,
  disabled = false,
  showResults = false,
  percentage = 0,
}: PollOptionProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full p-4 rounded-lg border-2 text-left transition-all duration-200 overflow-hidden",
        selected
          ? "border-primary bg-primary/5"
          : "border-transparent bg-secondary hover:border-primary/30",
        disabled && "cursor-default",
        !disabled && !selected && "hover:bg-secondary/80"
      )}
    >
      {showResults && (
        <div
          className="absolute left-0 top-0 bottom-0 bg-primary transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      )}
      
      <div className="relative flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <OptionBadge index={index} selected={selected} />
          <span className={cn(
            "font-medium",
            showResults && percentage > 50 ? "text-primary-foreground" : "text-foreground"
          )}>
            {text}
          </span>
        </div>
        
        {showResults && (
          <span className="text-sm font-semibold text-foreground">
            {percentage}%
          </span>
        )}
      </div>
    </button>
  );
};

export default PollOption;
