import { cn } from "@/lib/utils";

interface OptionBadgeProps {
  index: number;
  selected?: boolean;
}

const OptionBadge = ({ index, selected = false }: OptionBadgeProps) => {
  return (
    <span
      className={cn(
        "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-option-badge/30 text-muted-foreground"
      )}
    >
      {index}
    </span>
  );
};

export default OptionBadge;
