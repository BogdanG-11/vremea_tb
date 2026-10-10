"use client";

import React, { useRef, useEffect, useState } from 'react';
import Button from '../ui/Button';
import { ChatMessage, ChatContext } from '@/lib/types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onQuickReply: (content: string) => void;
  context: ChatContext;
}

/**
 * Chatbot interface for conversing with the Weather Guide.
 */
export default function ChatPanel({ messages, onSendMessage, onQuickReply, context }: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const quickReplies = [
    "What's the weather like?",
    "Any quests nearby?",
    "Tell me a weather joke",
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 absolute inset-0 pt-safe">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10 shadow-md">
        <h2 className="font-bold text-white flex items-center gap-2">
          <span>🧙‍♂️</span> Weather Guide
        </h2>
        {context.place?.name && (
          <p className="text-xs text-slate-400">Current Area: {context.place.name}</p>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            <span className="text-4xl mb-3 block">🔮</span>
            The Weather Guide awaits your inquiry...
          </div>
        )}
        
        {messages.map((msg) => {
          const isGuide = msg.role === 'guide';
          return (
            <div key={msg.id} className={`flex flex-col max-w-[85%] ${isGuide ? 'items-start' : 'items-end self-end ml-auto'}`}>
              <span className="text-[10px] font-medium text-slate-500 mb-1 ml-1">
                {isGuide ? 'Weather Guide' : 'You'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className={`p-3 rounded-2xl ${
                isGuide 
                  ? 'bg-purple-600/20 border border-purple-500/30 text-slate-200 rounded-tl-sm' 
                  : 'bg-blue-600 text-white rounded-tr-sm'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={endOfMessagesRef} className="h-1" />
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-800 bg-slate-900 p-4 pb-safe">
        {/* Quick Replies */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-1 no-scrollbar">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => onQuickReply(reply)}
              className="whitespace-nowrap px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-full border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask the Guide..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
          <Button type="submit" variant="primary" disabled={!inputValue.trim()} className="!px-5 rounded-xl">
            ➤
          </Button>
        </form>
      </div>
    </div>
  );
}
