"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useExpenses } from "@/lib/useExpenses";

export default function AIAssistant() {
  const { expenses } = useExpenses();
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm your financial AI. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQueries = [
    "How much did I spend this week?",
    "Show my biggest expense",
    "Which category increased most?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: "user", text }]);
    setInput("");
    setIsTyping(true);
    
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, expenses })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }
      
      setMessages(prev => [...prev, { role: "ai", text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I'm having trouble connecting to the network right now." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="glass-card flex flex-col h-[500px] rounded-2xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 p-4 border-b border-[var(--card-border)] bg-[var(--background)]/50">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--ai-glow)] shadow-md shadow-[var(--primary)]/20">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[var(--foreground)] tracking-tight flex items-center gap-1.5">
            EchoLedger Assistant
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--ai-glow)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--ai-glow)]"></span>
            </span>
          </h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            key={i} 
            className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
          >
            <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${msg.role === "ai" ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "bg-[var(--card-border)] text-[var(--foreground)]"}`}>
              {msg.role === "ai" ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
            </div>
            <div className={`p-3 rounded-2xl text-sm ${
              msg.role === "user" 
                ? "bg-[var(--primary)] text-white rounded-tr-sm shadow-md shadow-[var(--primary)]/20" 
                : "bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] rounded-tl-sm shadow-sm"
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 items-center text-[var(--text-muted)] text-xs ml-11">
            <Bot className="h-3 w-3 animate-pulse text-[var(--primary)]" />
            EchoLedger is typing...
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-[var(--card-border)] bg-[var(--background)]/30">
        {messages.length === 1 && (
          <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar snap-x">
            {suggestedQueries.map((q, i) => (
              <button 
                key={i} 
                onClick={() => handleSend(q)}
                className="snap-start flex-shrink-0 text-[11px] font-medium px-3 py-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 text-[var(--primary)] hover:bg-[var(--primary)]/10 transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <div className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Ask anything about your finances..."
            className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--background)] pl-4 pr-12 py-3 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] outline-none transition focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="absolute right-2 p-1.5 rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
