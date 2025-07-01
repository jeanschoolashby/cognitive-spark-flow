
import { useState, useEffect } from "react";
import { Brain, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AIDetectionBannerProps {
  onOpenMindguardChat: () => void;
  onDismiss: () => void;
}

export const AIDetectionBanner = ({ onOpenMindguardChat, onDismiss }: AIDetectionBannerProps) => {
  return (
    <Card className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 w-96 shadow-lg border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500 rounded-full flex-shrink-0">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-blue-900 text-sm mb-1">
              AI Chat Detected
            </h3>
            <p className="text-blue-800 text-xs mb-3 leading-relaxed">
              Mindguard can help you get more thoughtful responses. Continue this conversation with cognitive enhancement?
            </p>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={onOpenMindguardChat}
                className="bg-blue-600 hover:bg-blue-700 text-xs px-3 py-1 h-7"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Use Mindguard
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={onDismiss}
                className="text-xs px-3 py-1 h-7"
              >
                Dismiss
              </Button>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
