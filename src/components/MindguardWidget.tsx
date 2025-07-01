import { useState, useEffect } from "react";
import { Brain, Settings, X, Zap, Target, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ChallengeModal } from "./ChallengeModal";
import { ChatInterface } from "./ChatInterface";
import { ResponseInterceptor } from "./ResponseInterceptor";

type AssistMode = "enhance" | "protect" | "focus" | "off";
type DirectnessLevel = 1 | 2 | 3 | 4 | 5;

export const MindguardWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMode, setCurrentMode] = useState<AssistMode>("enhance");
  const [isActive, setIsActive] = useState(true);
  const [difficulty, setDifficulty] = useState([3]);
  const [frequency, setFrequency] = useState([5]);
  const [directnessLevel, setDirectnessLevel] = useState<DirectnessLevel>(2);
  
  // Modal states
  const [showChallenge, setShowChallenge] = useState(false);
  const [showChatInterface, setShowChatInterface] = useState(false);
  const [showInterceptor, setShowInterceptor] = useState(false);
  
  // Intercepted data
  const [interceptedQuery, setInterceptedQuery] = useState("");
  const [interceptedResponse, setInterceptedResponse] = useState("");
  
  // Stats
  const [challengesCompleted, setChallengesCompleted] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [interceptsTriggered, setInterceptsTriggered] = useState(0);

  // Simulate session timer
  useEffect(() => {
    if (isActive && currentMode !== "off") {
      const timer = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isActive, currentMode]);

  // Simulate challenge interrupts
  useEffect(() => {
    if (isActive && currentMode !== "off") {
      const intervalTime = (11 - frequency[0]) * 1000; // Convert frequency to ms
      const timer = setInterval(() => {
        setShowChallenge(true);
      }, intervalTime);
      return () => clearInterval(timer);
    }
  }, [isActive, currentMode, frequency]);

  // Simulate AI query interception
  useEffect(() => {
    if (isActive && currentMode !== "off") {
      const interceptTimer = setInterval(() => {
        // Simulate intercepting an AI query
        const sampleQueries = [
          "How do I implement authentication in React?",
          "What's the best way to optimize database queries?",
          "Explain machine learning algorithms",
          "How to deploy a Node.js application?",
          "What are design patterns in software engineering?"
        ];
        
        const sampleResponses = [
          "To implement authentication in React, you typically use libraries like Auth0, Firebase Auth, or implement JWT-based authentication...",
          "Database query optimization involves several strategies including indexing, query analysis, normalization...",
          "Machine learning algorithms can be categorized into supervised, unsupervised, and reinforcement learning...",
          "Deploying Node.js applications can be done through various platforms like Heroku, AWS, Docker containers...",
          "Design patterns are reusable solutions to commonly occurring problems in software design..."
        ];
        
        const randomIndex = Math.floor(Math.random() * sampleQueries.length);
        setInterceptedQuery(sampleQueries[randomIndex]);
        setInterceptedResponse(sampleResponses[randomIndex]);
        setShowInterceptor(true);
        setInterceptsTriggered(prev => prev + 1);
      }, (11 - frequency[0]) * 2000); // Less frequent than challenges
      
      return () => clearInterval(interceptTimer);
    }
  }, [isActive, currentMode, frequency]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeColor = (mode: AssistMode) => {
    const colors = {
      enhance: "bg-gradient-to-br from-emerald-500 to-teal-600",
      protect: "bg-gradient-to-br from-amber-500 to-orange-600", 
      focus: "bg-gradient-to-br from-blue-500 to-indigo-600",
      off: "bg-gradient-to-br from-gray-400 to-gray-500"
    };
    return colors[mode];
  };

  const getModeIcon = (mode: AssistMode) => {
    const icons = {
      enhance: Zap,
      protect: Target,
      focus: Brain,
      off: X
    };
    const Icon = icons[mode];
    return <Icon className="h-4 w-4" />;
  };

  const handleContinueWithMindguard = (query: string) => {
    setShowInterceptor(false);
    setShowChatInterface(true);
  };

  const handleStartThinkBreak = () => {
    setShowInterceptor(false);
    setShowChallenge(true);
  };

  if (!isExpanded) {
    return (
      <>
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsExpanded(true)}
            className={`h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${getModeColor(currentMode)} hover:scale-105`}
          >
            <Brain className="h-6 w-6 text-white" />
          </Button>
          {isActive && currentMode !== "off" && (
            <Badge 
              variant="secondary" 
              className="absolute -top-2 -left-2 bg-white text-xs shadow-md"
            >
              {interceptsTriggered}
            </Badge>
          )}
        </div>

        {/* Modals */}
        <ResponseInterceptor
          isOpen={showInterceptor}
          onClose={() => setShowInterceptor(false)}
          onStartThinkBreak={handleStartThinkBreak}
          onContinueWithMindguard={handleContinueWithMindguard}
          interceptedQuery={interceptedQuery}
          interceptedResponse={interceptedResponse}
        />

        <ChatInterface
          isOpen={showChatInterface}
          onClose={() => setShowChatInterface(false)}
          directnessLevel={directnessLevel}
          onDirectnessChange={setDirectnessLevel}
          initialQuery={interceptedQuery}
        />

        <ChallengeModal
          isOpen={showChallenge}
          onClose={() => setShowChallenge(false)}
          onComplete={() => {
            setChallengesCompleted(prev => prev + 1);
            setShowChallenge(false);
          }}
          difficulty={difficulty[0]}
          mode={currentMode}
        />
      </>
    );
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Card className="w-80 shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${getModeColor(currentMode)}`}>
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Mindguard</CardTitle>
                  <p className="text-sm text-gray-500">AI Response Filter</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status</span>
              <div className="flex items-center gap-2">
                <Switch
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <span className="text-sm text-gray-500">
                  {isActive ? 'Filtering' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Response Directness */}
            {currentMode !== 'off' && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Response Directness: {directnessLevel}/5
                </label>
                <Slider
                  value={[directnessLevel]}
                  onValueChange={(value) => setDirectnessLevel(value[0] as DirectnessLevel)}
                  max={5}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {directnessLevel === 1 ? "Maximum guidance" : 
                   directnessLevel === 5 ? "No filtering" : "Balanced guidance"}
                </p>
              </div>
            )}

            {/* Mode Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Assist Mode</label>
              <div className="grid grid-cols-2 gap-2">
                {(['enhance', 'protect', 'focus', 'off'] as AssistMode[]).map((mode) => (
                  <Button
                    key={mode}
                    variant={currentMode === mode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentMode(mode)}
                    className={`flex items-center gap-2 ${
                      currentMode === mode ? getModeColor(mode) : ''
                    }`}
                  >
                    {getModeIcon(mode)}
                    <span className="capitalize">{mode}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Settings */}
            {currentMode !== 'off' && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Difficulty: {difficulty[0]}/5
                  </label>
                  <Slider
                    value={difficulty}
                    onValueChange={setDifficulty}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Frequency: {frequency[0]}/10
                  </label>
                  <Slider
                    value={frequency}
                    onValueChange={setFrequency}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </>
            )}

            {/* Stats */}
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Intercepts: {interceptsTriggered}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Time: {formatTime(sessionTime)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Challenges: {challengesCompleted}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowChatInterface(true)}
                >
                  Open Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ResponseInterceptor
        isOpen={showInterceptor}
        onClose={() => setShowInterceptor(false)}
        onStartThinkBreak={handleStartThinkBreak}
        onContinueWithMindguard={handleContinueWithMindguard}
        interceptedQuery={interceptedQuery}
        interceptedResponse={interceptedResponse}
      />

      <ChatInterface
        isOpen={showChatInterface}
        onClose={() => setShowChatInterface(false)}
        directnessLevel={directnessLevel}
        onDirectnessChange={setDirectnessLevel}
        initialQuery={interceptedQuery}
      />

      <ChallengeModal
        isOpen={showChallenge}
        onClose={() => setShowChallenge(false)}
        onComplete={() => {
          setChallengesCompleted(prev => prev + 1);
          setShowChallenge(false);
        }}
        difficulty={difficulty[0]}
        mode={currentMode}
      />
    </>
  );
};
