import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Bot } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { useToast } from "@/hooks/use-toast";
import { useQuery } from '@tanstack/react-query';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

interface StarterQuestionsResponse {
  display: string[];
}

const fetchStarterQuestions = async (): Promise<StarterQuestionsResponse> => {
  const response = await fetch('https://www.duppy.io/api/starter-questions');
  if (!response.ok) {
    throw new Error('Failed to fetch starter questions');
  }
  return response.json();
};

const ChatbotPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const { data: starterQuestionsData, isLoading, error } = useQuery<StarterQuestionsResponse>({
    queryKey: ['starterQuestions'],
    queryFn: fetchStarterQuestions,
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (text: string = input) => {
    if (text.trim() === '') return;

    const userMessage: Message = { id: Date.now(), text, isUser: true };
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

  const handleClosePopup = () => {
    setIsOpen(false);
    toast({
      title: "Chat closed",
      description: "You can reopen the chat anytime by clicking the bot icon.",
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
        >
          <Bot size={20} />
        </Button>
      )}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 sm:w-96 flex flex-col h-[500px]">
          <div className="flex justify-between items-center p-3 bg-blue-500 text-white rounded-t-lg">
            <h3 className="font-semibold text-sm flex items-center">
              <Bot size={16} className="mr-2" />
              Gaming Support
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClosePopup}
              className="text-white hover:bg-blue-600 rounded-full h-6 w-6"
            >
              <X size={16} />
            </Button>
          </div>
          <ScrollArea className="flex-grow p-3" ref={scrollAreaRef}>
            {messages.length === 0 && (
              <div className="text-gray-500 text-sm mb-4">
                {isLoading ? (
                  <p>Loading starter questions...</p>
                ) : error ? (
                  <p>Error loading starter questions. Please try again later.</p>
                ) : (
                  <>
                    <p className="mb-2">Here are some questions you can ask:</p>
                    {starterQuestionsData && starterQuestionsData.display.map((question: string, index: number) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="mb-2 w-full justify-start"
                        onClick={() => handleSendMessage(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </>
                )}
              </div>
            )}
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isStreaming && <div className="text-gray-500 animate-pulse text-xs">Bot is typing...</div>}
          </ScrollArea>
          <div className="p-3 border-t">
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
                className="flex-grow text-sm"
              />
              <Button type="submit" disabled={isStreaming} size="sm">
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