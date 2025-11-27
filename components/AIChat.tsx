import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { createChatSession, sendMessage } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Chat } from "@google/genai";

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Hello! I am your Kala Verse Advertising Assistant. How can I help you create today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSession = useRef<Chat | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatSession.current) {
      chatSession.current = createChatSession("You are a creative advertising expert and copywriter assisting users on the Kala Verse platform. Be witty, professional, and helpful.");
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession.current) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const response = await sendMessage(chatSession.current, userMsg.text);
    
    const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: response || "I'm thinking...", timestamp: Date.now() };
    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-light-surface dark:bg-dark-surface rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-dark-bg">
            <h2 className="text-xl font-heading font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Bot className="w-6 h-6 text-accent-purple" />
                Advertising Assistant
            </h2>
        </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-accent-pink' : 'bg-accent-purple'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-accent-pink text-white rounded-tr-none' 
                  : 'bg-gray-100 dark:bg-[#333] text-gray-800 dark:text-gray-100 rounded-tl-none'
              }`}>
                {msg.text.split('\n').map((line, i) => (
                    <p key={i} className="mb-1 last:mb-0">{line}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-accent-purple flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-gray-100 dark:bg-[#333]">
                    <Loader2 className="animate-spin w-5 h-5 text-gray-500" />
                </div>
             </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-gray-800">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="Ask for campaign ideas, slogans, or strategy..."
            className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent-purple focus:outline-none resize-none text-gray-800 dark:text-white"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-accent-purple text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};