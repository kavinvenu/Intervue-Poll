import { useState } from "react";
import { Button } from "@/components/ui/button";
import Badge from "./Badge";

interface NameInputProps {
  onSubmit: (name: string) => void;
  isLoading?: boolean;
}

const NameInput = ({ onSubmit, isLoading = false }: NameInputProps) => {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 animate-fade-in">
      <Badge />
      
      <h1 className="mt-8 text-4xl font-light text-foreground">
        Let's <span className="font-bold">Get Started</span>
      </h1>
      
      <p className="mt-4 text-center text-muted-foreground max-w-lg">
        If you're a student, you'll be able to <span className="font-semibold text-foreground">submit your answers</span>, participate in live polls, and see how your responses compare with your classmates
      </p>

      <form onSubmit={handleSubmit} className="mt-10 w-full max-w-md">
        <label className="block text-sm font-medium text-foreground mb-2">
          Enter your Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full px-4 py-4 bg-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="pill"
          size="pill-lg"
          className="w-full mt-6"
          disabled={!name.trim() || isLoading}
        >
          {isLoading ? "Joining..." : "Continue"}
        </Button>
      </form>
    </div>
  );
};

export default NameInput;
