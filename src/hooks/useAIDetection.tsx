import { useState, useEffect } from "react";

const AI_CHAT_INDICATORS = [
  // ChatGPT
  'chat.openai.com',
  'chatgpt.com',
  // Claude
  'claude.ai',
  // Gemini
  'gemini.google.com',
  'bard.google.com',
  // Perplexity
  'perplexity.ai',
  // Other AI chats - DOM selectors
  '[data-testid*="chat"]',
  '[class*="chat-input"]',
  '[class*="message-input"]',
  '[placeholder*="message"]',
  '[placeholder*="chat"]',
  '[placeholder*="ask"]'
];

export const useAIDetection = () => {
  const [isAIChatDetected, setIsAIChatDetected] = useState(false);
  const [detectedPlatform, setDetectedPlatform] = useState<string>("");

  useEffect(() => {
    const detectAIChat = () => {
      // Check URL-based detection
      const currentUrl = window.location.hostname.toLowerCase();
      const urlMatch = AI_CHAT_INDICATORS.find(indicator => 
        !indicator.startsWith('[') && currentUrl.includes(indicator)
      );

      if (urlMatch) {
        setIsAIChatDetected(true);
        setDetectedPlatform(urlMatch);
        return;
      }

      // Check DOM-based detection
      const domSelectors = AI_CHAT_INDICATORS.filter(indicator => 
        indicator.startsWith('[')
      );

      const domMatch = domSelectors.some(selector => {
        try {
          return document.querySelector(selector) !== null;
        } catch {
          return false;
        }
      });

      if (domMatch) {
        setIsAIChatDetected(true);
        setDetectedPlatform('AI Chat Interface');
        return;
      }

      // Check for common AI chat UI patterns
      const hasAIIndicators = [
        // Look for AI/bot related text in the page
        document.querySelector('[class*="assistant"]'),
        document.querySelector('[class*="bot"]'),
        document.querySelector('[data-testid*="bot"]'),
        // Look for message/chat containers
        document.querySelector('[class*="conversation"]'),
        document.querySelector('[class*="messages"]') && document.querySelector('textarea'),
        // Look for regenerate/thumbs up buttons (common in AI chats)
        document.querySelector('[aria-label*="regenerate"]'),
        document.querySelector('[aria-label*="thumbs"]')
      ].some(Boolean);

      if (hasAIIndicators) {
        setIsAIChatDetected(true);
        setDetectedPlatform('AI Assistant');
      } else {
        setIsAIChatDetected(false);
        setDetectedPlatform('');
      }
    };

    // Initial detection
    detectAIChat();

    // Re-check periodically for dynamic content
    const interval = setInterval(detectAIChat, 3000);

    // Also check on DOM changes
    const observer = new MutationObserver(detectAIChat);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true 
    });

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  return { isAIChatDetected, detectedPlatform };
};
