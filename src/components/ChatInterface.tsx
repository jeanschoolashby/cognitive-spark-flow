
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Settings, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

type Message = {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
};

type DirectnessLevel = 1 | 2 | 3 | 4 | 5;

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  directnessLevel: DirectnessLevel;
  onDirectnessChange: (level: DirectnessLevel) => void;
  initialQuery?: string;
}

export const ChatInterface = ({ 
  isOpen, 
  onClose, 
  directnessLevel, 
  onDirectnessChange,
  initialQuery 
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      setInputValue(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getDirectnessDescription = (level: DirectnessLevel) => {
    const descriptions = {
      1: "Maximum guidance - Socratic method, questions only",
      2: "High guidance - Hints and leading questions", 
      3: "Moderate - Some direct info with questions",
      4: "Low guidance - Mostly direct with minimal prompting",
      5: "No filtering - Direct answers like standard ChatGPT"
    };
    return descriptions[level];
  };

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = {
      1: "That's an interesting question. What do you think might be the key factors to consider? What have you observed about this topic before?",
      2: "Consider breaking this down into smaller parts. What's the first step you'd take? Think about similar problems you've solved.",
      3: "Here's one approach, but first - what's your initial thought? [Then provides some direct info mixed with questions]",
      4: "The answer involves several factors: [provides most of the answer] But what do you think about the implications?",
      5: `Here's a comprehensive answer to "${userMessage}": [This would be a full, direct response like ChatGPT normally provides, with complete information and minimal prompting for further thought.]`
    };
    
    return responses[directnessLevel];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await simulateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: "assistant", 
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed inset-4 bg-white rounded-lg shadow-2xl flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-500" />
                  Mindguard Chat
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Directness Level {directnessLevel}/5
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          {showSettings && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <label className="text-sm font-medium mb-2 block">
                Response Directness: {directnessLevel}/5
              </label>
              <Slider
                value={[directnessLevel]}
                onValueChange={(value) => onDirectnessChange(value[0] as DirectnessLevel)}
                max={5}
                min={1}
                step={1}
                className="mb-2"
              />
              <p className="text-xs text-gray-600">
                {getDirectnessDescription(directnessLevel)}
              </p>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Bot className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Start your conversation. Mindguard will filter responses based on your directness setting.</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`p-2 rounded-full ${message.sender === "user" ? "bg-blue-500" : "bg-gray-200"}`}>
                    {message.sender === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.sender === "user" 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 text-gray-900"
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === "user" ? "text-blue-100" : "text-gray-500"
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="p-2 rounded-full bg-gray-200">
                  <Bot className="h-4 w-4 text-gray-600" />
                </div>
                <div className="p-3 rounded-lg bg-gray-100">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask your question here..."
                className="resize-none"
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
};
