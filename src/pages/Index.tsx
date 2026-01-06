import { useState } from "react";
import { Button } from "@/components/ui/button";
import Badge from "@/components/poll/Badge";
import RoleSelector from "@/components/poll/RoleSelector";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | null>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole === "student") {
      navigate("/student");
    } else if (selectedRole === "teacher") {
      navigate("/teacher");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in">
      <Badge />
      
      <h1 className="mt-8 text-4xl md:text-5xl font-light text-foreground text-center">
        Welcome to the <span className="font-bold">Live Polling System</span>
      </h1>
      
      <p className="mt-4 text-center text-muted-foreground max-w-lg">
        Please select the role that best describes you to begin using the live polling system
      </p>

      <div className="mt-10">
        <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />
      </div>

      <Button
        variant="pill"
        size="pill-lg"
        className="mt-10"
        onClick={handleContinue}
        disabled={!selectedRole}
      >
        Continue
      </Button>
    </main>
  );
};

export default Index;
