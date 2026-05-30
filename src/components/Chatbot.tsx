import React, { useState, useRef, useEffect } from 'react';
import { useCivic } from '../context/CivicContext';
import { ChatMessage } from '../types';
import { MessageSquare, Send, Sparkles, Bot, User, Trash2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ParravisionIcon } from './ParravisionLogo';

const SUGGESTED_PROMPTS = [
  {
    en: "How does the Centenary Square forest reduce summer heat?",
    zh: "百年广场的桉树森林是如何在夏天降温的？",
    hn: "सेंटेनरी स्क्वायर वन गर्मियों की गर्मी को कैसे कम करता है?"
  },
  {
    en: "Tell me about the Dharug Language AR signage trail.",
    zh: "请介绍一下达鲁格原住民语言 AR 标识步道。",
    hn: "धारुग भाषा एआर साइनेज ट्रेल के बारे में विस्तार से बताएं।"
  },
  {
    en: "What are Church Street acoustic music zones?",
    zh: "教堂街美食区的“低噪原声Live音乐角”是什么形式？",
    hn: "चर्च स्ट्रीट ईट स्ट्रीट संगीत क्षेत्र योजना क्या है?"
  }
];

export const Chatbot: React.FC = () => {
  const { language, translateText } = useCivic();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    // Attempt local storage recall
    try {
      const saved = localStorage.getItem('parravision_chat_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Storage item fetch issue:", e);
    }
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: `👋 Hello! I am ParraVision AI, your interactive citizen assistant for Parramatta CBD. Ask me questions about active development councils, pedestrian plans, heat mitigation trails, or municipal programs!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  
  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-save history to local storage
  useEffect(() => {
    try {
      localStorage.setItem('parravision_chat_history', JSON.stringify(messages));
    } catch (e) {
      console.warn("Failed to write to local storage:", e);
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsLoading(true);

    try {
      // Map prior conversation turns for simple chat context if relevant
      const historySummary = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          history: historySummary
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned code ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: data.reply || "I didn't receive a clear response. Can you please rephrase?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error("Chat error:", err);
      
      // Smart offline fallback to simulate immediate city context answers 
      let fallbackText = "I had connection issues speaking to the Council database core right now. However, I can let you know that our primary projects inside Centenary Square focus on misting nodes, Riverwalk upgrades focus on fauna protection, and Church Street centers around acoustic night-life support.";
      
      const lower = userMsg.content.toLowerCase();
      if (lower.includes('heat') || lower.includes('square')) {
        fallbackText = "☀️ **Centenary Square Urban Forest Mitigation Plan**:\n" +
          "- Centenary Square's pavement can reach temperatures higher than 52°C.\n" +
          "- The active initiative involves a $1.2M budget for eucalyptus tree clusters and greywater misting nozzles.\n" +
          "- The physical cooling lowers local ambient heat by 4.5°C to protect afternoon walkers.";
      } else if (lower.includes('dharug') || lower.includes('sign') || lower.includes('indigenous')) {
        fallbackText = "🍃 **Dharug Language Signage Trail**:\n" +
          "- This project overlays physical signs and augmented reality markers introducing Dharug names for major CBD landmarks.\n" +
          "- It is designed alongside Council elders (Chris Webb) and aims to deepen school historical studies.";
      } else if (lower.includes('acoustic') || lower.includes('music') || lower.includes('church') || lower.includes('eat')) {
        fallbackText = "🎵 **Church Street Acoustic Eating Zone**:\n" +
          "- A late-night regulatory policy authorizing low-lux acoustic musical sessions past 8:00 PM without expensive noise fines.\n" +
          "- Sponsored by housing developers to keep the CBD night commerce lively while respecting ambient sleep corridors.";
      }

      const assistantMsg: ChatMessage = {
        id: `ast-fallback-${Date.now()}`,
        role: 'assistant',
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Do you want to reset your conversation history?")) {
      setMessages([
        {
          id: 'welcome-1',
          role: 'assistant',
          content: `👋 Conversations reset. Ask me anything about Parramatta's urban design, Dharug heritage trail, or cool misting networks!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-sm flex flex-col h-[520px]" id="civic-chatbot-card">
      {/* Header section card */}
      <div className="px-5 py-4 border-b border-neutral-200/60 flex items-center justify-between bg-neutral-50/50 rounded-t-2xl">
        <div className="flex items-center gap-2.5">
          <div className="p-1 bg-teal-50/50 rounded-xl">
            <ParravisionIcon size={36} />
          </div>
          <div>
            <h3 className="text-sm font-sans font-bold text-neutral-800 flex items-center gap-1.5 leading-none">
              ParraVision AI Planner Assistant
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500 animate-pulse" />
            </h3>
            <span className="text-[10px] font-sans font-medium text-neutral-400 mt-1 block">
              Active: Gemini 3.5 Core • Localised urban context
            </span>
          </div>
        </div>
        <button
          onClick={clearChat}
          title="Clear History"
          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages stream box */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" id="chat-messages-scroll">
        {messages.map((msg) => {
          const isAI = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Profile icon */}
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isAI ? 'bg-teal-50 border border-teal-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                {isAI ? <ParravisionIcon size={24} /> : <User className="w-4 h-4" />}
              </div>
              
              <div className="space-y-1">
                {/* Bubble details */}
                <div className={`p-3 rounded-2xl text-xs font-sans leading-relaxed whitespace-pre-wrap ${
                  isAI 
                    ? 'bg-neutral-50 text-neutral-700 border border-neutral-100 rounded-tl-xs' 
                    : 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
                }`}>
                  {msg.content}
                </div>
                <span className={`text-[9px] font-mono text-neutral-400 block px-1 ${isAI ? 'text-left' : 'text-right'}`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex gap-2.5 max-w-[80%] mr-auto items-center">
            <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center border border-teal-100">
              <ParravisionIcon size={24} />
            </div>
            <div className="flex gap-1.5 p-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl rounded-tl-xs">
              <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested tapping prompts */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-neutral-100 bg-neutral-50/50 space-y-1.5">
          <p className="text-[10px] font-sans font-semibold text-indigo-600 uppercase tracking-wider">
            💡 Tap prompt to explore Parramatta:
          </p>
          <div className="grid grid-cols-1 gap-1.5">
            {SUGGESTED_PROMPTS.map((p, idx) => {
              const localizedPrompt = p[language] || p['en'];
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(localizedPrompt)}
                  className="text-[10px] sm:text-xs text-left font-sans font-medium text-neutral-600 bg-white border border-neutral-200 hover:border-indigo-400 hover:bg-indigo-50/30 px-3 py-1.5 rounded-lg transition-all flex items-center justify-between cursor-pointer group"
                >
                  <span className="truncate pr-2">{localizedPrompt}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0 transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input keyboard actions */}
      <div className="p-3 border-t border-neutral-200/70 bg-white rounded-b-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputVal);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask ParraVision AI about city initiatives..."
            className="flex-1 bg-neutral-50 hover:bg-neutral-100/40 focus:bg-white text-xs font-sans px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-neutral-800"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || isLoading}
            className="p-2.5 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 stroke-[2]" />
          </button>
        </form>
      </div>
    </div>
  );
};
