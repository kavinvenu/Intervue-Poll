import { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import ChatPanel from "./ChatPanel";

interface Student {
  id: string;
  name: string;
}

interface ChatPopupProps {
  senderName: string;
  senderId: string;
  isTeacher: boolean;
  students?: Student[];
  onKickStudent?: (studentId: string) => void;
}

const ChatPopup = ({
  senderName,
  senderId,
  isTeacher,
  students = [],
  onKickStudent
}: ChatPopupProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {isOpen && (
        <div className="animate-scale-in origin-bottom-right shadow-2xl rounded-xl">
          <ChatPanel
            senderName={senderName}
            senderId={senderId}
            isTeacher={isTeacher}
            students={students}
            onKickStudent={onKickStudent}
          />
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatPopup;
