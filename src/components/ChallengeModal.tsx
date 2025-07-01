
import { useState, useEffect } from "react";
import { Brain, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type AssistMode = "enhance" | "protect" | "focus" | "off";

interface ChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  difficulty: number;
  mode: AssistMode;
}

const CHALLENGES = {
  enhance: [
    {
      question: "What concept was just discussed in the previous paragraph?",
      options: ["Neural networks", "Machine learning", "Data processing", "Algorithm design"],
      correct: 0
    },
    {
      question: "How might this information connect to your previous knowledge?",
      options: ["It builds on basics", "It contradicts previous ideas", "It introduces new concepts", "It summarizes everything"],
      correct: 0
    }
  ],
  protect: [
    {
      question: "Does this claim seem supported by evidence?",
      options: ["Yes, well-supported", "Partially supported", "Unsupported claim", "Need more info"],
      correct: 3
    },
    {
      question: "What potential bias might be present in this source?",
      options: ["Commercial bias", "Confirmation bias", "Selection bias", "No obvious bias"],
      correct: 0
    }
  ],
  focus: [
    {
      question: "What is the main point of this section?",
      options: ["Technical details", "Historical context", "Core concept", "Supporting evidence"],
      correct: 2
    },
    {
      question: "Which detail is most important to remember?",
      options: ["First mentioned fact", "Key principle", "Example given", "Statistical data"],
      correct: 1
    }
  ]
};

export const ChallengeModal = ({ isOpen, onClose, onComplete, difficulty, mode }: ChallengeModalProps) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isCorrect, setIsCorrect] = useState(false);

  const challenges = CHALLENGES[mode] || CHALLENGES.enhance;
  const challenge = challenges[currentChallenge];

  useEffect(() => {
    if (isOpen) {
      setCurrentChallenge(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(Math.max(5, 15 - difficulty * 2)); // Adjust time based on difficulty
    }
  }, [isOpen, difficulty]);

  useEffect(() => {
    if (isOpen && !showResult && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmit();
    }
  }, [isOpen, showResult, timeLeft]);

  const handleSubmit = () => {
    const correct = selectedAnswer === challenge.correct;
    setIsCorrect(correct);
    setShowResult(true);
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const getModeColor = (mode: AssistMode) => {
    const colors = {
      enhance: "from-emerald-500 to-teal-600",
      protect: "from-amber-500 to-orange-600", 
      focus: "from-blue-500 to-indigo-600",
      off: "from-gray-400 to-gray-500"
    };
    return colors[mode];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-96 mx-4 shadow-2xl border-0 bg-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${getModeColor(mode)}`}>
                <Brain className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Mindguard Challenge</CardTitle>
                <p className="text-sm text-gray-500 capitalize">{mode} Mode</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-mono">{timeLeft}s</span>
            </div>
          </div>
          <Progress value={(timeLeft / (15 - difficulty * 2)) * 100} className="mt-2" />
        </CardHeader>

        <CardContent>
          {!showResult ? (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">{challenge.question}</h3>
              
              <div className="space-y-2">
                {challenge.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === index ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => setSelectedAnswer(index)}
                  >
                    <span className="font-mono text-xs mr-2">{String.fromCharCode(65 + index)}</span>
                    {option}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                  className={`flex-1 bg-gradient-to-br ${getModeColor(mode)}`}
                >
                  Submit Answer
                </Button>
                <Button variant="outline" onClick={onClose}>
                  Skip
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 py-4">
              {isCorrect ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mx-auto" />
              )}
              
              <div>
                <h3 className="text-lg font-semibold">
                  {isCorrect ? "Excellent!" : "Not quite right"}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {isCorrect 
                    ? "Your cognitive engagement is helping strengthen neural pathways." 
                    : "Consider reviewing the material more carefully. Learning from mistakes strengthens understanding."
                  }
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
