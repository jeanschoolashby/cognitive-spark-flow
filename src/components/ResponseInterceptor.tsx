
import { useState, useEffect } from "react";
import { Brain, MessageSquare, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ResponseInterceptorProps {
  isOpen: boolean;
  onClose: () => void;
  onStartThinkBreak: () => void;
  onContinueWithMindguard: (query: string) => void;
  interceptedQuery: string;
  interceptedResponse: string;
}

const TECHNICAL_QUESTIONS = [
  "Explain the difference between TCP and UDP protocols",
  "What happens during a SQL injection attack?",
  "Describe how blockchain consensus mechanisms work",
  "What's the time complexity of QuickSort in the worst case?",
  "How does garbage collection work in memory management?",
  "Explain the CAP theorem in distributed systems",
  "What are the differences between OAuth 2.0 and JWT?",
  "Describe how DNS resolution works step by step"
];

export const ResponseInterceptor = ({
  isOpen,
  onClose,
  onStartThinkBreak,
  onContinueWithMindguard,
  interceptedQuery,
  interceptedResponse
}: ResponseInterceptorProps) => {
  const [randomQuestion, setRandomQuestion] = useState("");

  useEffect(() => {
    if (isOpen) {
      const question = TECHNICAL_QUESTIONS[Math.floor(Math.random() * TECHNICAL_QUESTIONS.length)];
      setRandomQuestion(question);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Mindguard Intercept</h2>
              <p className="text-sm text-gray-600">Cognitive enhancement opportunity detected</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-900 mb-2">Your Query:</h3>
            <p className="text-blue-800 text-sm">{interceptedQuery}</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Direct Answer Available</h3>
            <p className="text-yellow-800 text-sm mb-3">
              I have a complete answer ready, but this might be a good opportunity for deeper learning.
            </p>
            <details className="text-xs">
              <summary className="cursor-pointer text-yellow-700 hover:text-yellow-900">
                Preview answer (click to expand)
              </summary>
              <p className="mt-2 text-yellow-700 italic bg-yellow-100 p-2 rounded">
                {interceptedResponse.substring(0, 200)}...
              </p>
            </details>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-2 hover:border-green-300 transition-colors cursor-pointer group">
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Continue with Mindguard</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Get guided responses that encourage critical thinking
                </p>
                <Button 
                  onClick={() => onContinueWithMindguard(interceptedQuery)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Open Guided Chat
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-orange-300 transition-colors cursor-pointer group">
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold mb-2">Take a Think Break</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Challenge your mind with an unrelated technical question first
                </p>
                <Button 
                  onClick={onStartThinkBreak}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  Start Think Break
                </Button>
              </CardContent>
            </Card>
          </div>

          {randomQuestion && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">🧠 Random Technical Challenge:</h4>
              <p className="text-sm text-gray-700 italic">"{randomQuestion}"</p>
            </div>
          )}

          <div className="flex justify-center gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="text-sm">
              Show Direct Answer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
