import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender_name: string;
  message: string;
  is_teacher: boolean;
  created_at: string;
}

interface Student {
  id: string;
  name: string;
}

interface ChatPanelProps {
  senderName: string;
  senderId: string;
  isTeacher: boolean;
  students?: Student[];
  onKickStudent?: (studentId: string) => void;
}

const ChatPanel = ({
  senderName,
  senderId,
  isTeacher,
  students = [],
  onKickStudent,
}: ChatPanelProps) => {
  const [activeTab, setActiveTab] = useState<"chat" | "participants">(
    isTeacher ? "participants" : "chat"
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("chat-messages-panel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(100);

    if (data) {
      setMessages(data);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    const { error } = await supabase.from("chat_messages").insert({
      sender_name: senderName,
      message: newMessage.trim(),
      is_teacher: isTeacher,
      student_id: isTeacher ? null : senderId,
    });

    if (!error) {
      setNewMessage("");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-[429px] h-[477px] bg-card rounded-[5px] border border-border overflow-hidden shadow-lg flex flex-col">
      {/* Tabs */}
      <div className="flex items-center px-6 gap-8 border-b border-border shrink-0 bg-card">
        <button
          onClick={() => setActiveTab("chat")}
          className={cn(
            "py-4 text-sm transition-all border-b-[3px]",
            activeTab === "chat"
              ? "text-foreground font-bold border-primary"
              : "text-muted-foreground font-medium border-transparent hover:text-foreground"
          )}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("participants")}
          className={cn(
            "py-4 text-sm transition-all border-b-[3px]",
            activeTab === "participants"
              ? "text-foreground font-bold border-primary"
              : "text-muted-foreground font-medium border-transparent hover:text-foreground"
          )}
        >
          Participants
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "chat" ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => {
                const isSelf = msg.sender_name === senderName;
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "animate-fade-in",
                      isSelf ? "text-right" : "text-left"
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-bold mb-1 block",
                        "text-primary"
                      )}
                    >
                      {msg.sender_name}
                    </span>
                    <div
                      className={cn(
                        "px-4 py-2 rounded-lg inline-block max-w-[85%] text-sm",
                        isSelf
                          ? "bg-primary text-primary-foreground"
                          : "bg-[#333333] text-white"
                      )}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={sendMessage}
              className="p-3 border-t border-border flex gap-2"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || isLoading}
                className="w-10 h-10 bg-primary text-primary-foreground rounded-lg flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="p-4 overflow-y-auto h-full">
            {isTeacher && onKickStudent ? (
              <>
                <div className="flex justify-between text-sm text-muted-foreground mb-3">
                  <span>Name</span>
                  <span>Action</span>
                </div>
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between py-2 animate-fade-in"
                  >
                    <span className="font-medium text-foreground">
                      {student.name}
                    </span>
                    <button
                      onClick={() => onKickStudent(student.id)}
                      className="text-primary text-sm font-medium hover:text-primary/80 transition-colors"
                    >
                      Kick out
                    </button>
                  </div>
                ))}
                {students.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No students joined yet
                  </p>
                )}
              </>
            ) : (
              <>
                <div className="text-sm text-muted-foreground mb-3">Name</div>
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="py-2 animate-fade-in"
                  >
                    <span className="font-medium text-foreground">
                      {student.name}
                    </span>
                  </div>
                ))}
                {students.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No participants yet
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
