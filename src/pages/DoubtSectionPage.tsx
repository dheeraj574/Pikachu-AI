import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, User, Bot, Sparkles, Trash2 } from 'lucide-react';
import { chatWithAI } from '../lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export default function DoubtSectionPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      content: "Hello! I'm your AI Study Buddy. Got a doubt in any subject? Ask me anything, from complex equations to historical dates!",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const aiResponse = await chatWithAI(input, history);
      
      const modelMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: aiResponse || "I'm sorry, I couldn't process that. Could you try rephrasing your doubt?",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([messages[0]]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Doubt Section</h1>
          <p className="text-muted-foreground">Ask questions and get instant AI-powered explanations.</p>
        </div>
        <button
          onClick={clearChat}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
          title="Clear conversation"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-card border border-border rounded-xl shadow-sm flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  message.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  message.role === 'user' ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                )}>
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={cn(
                  "space-y-1",
                  message.role === 'user' ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    message.role === 'user' 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-secondary text-foreground rounded-tl-none border border-border/50"
                  )}>
                    {message.content}
                  </div>
                  <span className="text-[10px] text-muted-foreground px-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex gap-4 mr-auto max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-secondary text-foreground p-4 rounded-2xl rounded-tl-none border border-border/50">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-background/50">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your doubt here..."
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-2 flex items-center justify-center gap-1">
            <Sparkles size={10} />
            Powered by Pikachu AI • Ask anything academic
          </p>
        </div>
      </div>
    </div>
  );
}
