import { cn } from "@/lib/utils";

interface RoleSelectorProps {
  selectedRole: "student" | "teacher" | null;
  onSelectRole: (role: "student" | "teacher") => void;
}

const RoleSelector = ({ selectedRole, onSelectRole }: RoleSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
      <button
        onClick={() => onSelectRole("student")}
        className={cn(
          "p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md",
          selectedRole === "student"
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
      >
        <h3 className="text-xl font-bold text-foreground mb-2">I'm a Student</h3>
        <p className="text-muted-foreground text-sm">
          Participate in live polls, submit your answers, and see real-time results
        </p>
      </button>

      <button
        onClick={() => onSelectRole("teacher")}
        className={cn(
          "p-6 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md",
          selectedRole === "teacher"
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
      >
        <h3 className="text-xl font-bold text-foreground mb-2">I'm a Teacher</h3>
        <p className="text-muted-foreground text-sm">
          Submit answers and view live poll results in real-time.
        </p>
      </button>
    </div>
  );
};

export default RoleSelector;
