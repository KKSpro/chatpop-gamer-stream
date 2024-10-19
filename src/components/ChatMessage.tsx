import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-start`}>
        <Avatar className="w-8 h-8">
          <AvatarImage src={message.isUser ? "/user-avatar.png" : "/bot-avatar.png"} />
          <AvatarFallback>{message.isUser ? 'U' : 'B'}</AvatarFallback>
        </Avatar>
        <div
          className={`mx-2 py-2 px-4 rounded-lg ${
            message.isUser
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-800'
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;