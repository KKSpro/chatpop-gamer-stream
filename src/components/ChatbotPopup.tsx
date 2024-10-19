import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X } from 'lucide-react';
import ChatMessage from './ChatMessage';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const ChatbotPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage: Message = { id: Date.now(), text: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate bot response with streaming
    setIsStreaming(true);
    let botResponse = "Thank you for your question. I'm processing your request...";
    const botMessage: Message = { id: Date.now() + 1, text: '', isUser: false };
    setMessages((prev) => [...prev, botMessage]);

    const streamResponse = (response: string) => {
      let i = 0;
      const intervalId = setInterval(() => {
        if (i < response.length) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === botMessage.id ? { ...msg, text: msg.text + response[i] } : msg
            )
          );
          i++;
        } else {
          clearInterval(intervalId);
          setIsStreaming(false);
        }
      }, 30);
    };

    setTimeout(() => streamResponse(botResponse), 500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-16 h-16 bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
        >
          <MessageSquare size={24} />
        </Button>
      )}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 flex flex-col h-[500px]">
          <div className="flex justify-between items-center p-4 bg-blue-500 text-white rounded-t-lg">
            <h3 className="font-semibold">Gaming Support</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-600 rounded-full"
            >
              <X size={20} />
            </Button>
          </div>
          <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isStreaming && <div className="text-gray-500 animate-pulse">Bot is typing...</div>}
          </ScrollArea>
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex space-x-2"
            >
              <Input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" disabled={isStreaming}>
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotPopup;