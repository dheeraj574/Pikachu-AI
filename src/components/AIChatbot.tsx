import { MessageSquare, Send, X, Minimize2, Brain } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithAI } from '../lib/gemini';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Hello! I am Pikachu AI. How can I help you with your studies today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      // Convert messages to Gemini history format
      const history: { role: 'user' | 'model', parts: { text: string }[] }[] = messages.slice(1).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const response = await chatWithAI(userMsg, history);
      setMessages(prev => [...prev, { role: 'ai', content: response || "I'm sorry, I couldn't process that." }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to AI service. Please check your API key." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-card border border-border shadow-2xl rounded-2xl w-80 sm:w-96 h-[500px] flex flex-col mb-4 overflow-hidden"
          >
            <div className="p-4 border-b border-border bg-primary text-primary-foreground flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Brain size={20} />
                <span className="font-bold">Pikachu AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded transition-colors">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/30">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-card border border-border rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border p-3 rounded-2xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask a doubt..."
                  className="flex-1 bg-secondary border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-primary"
                />
                <button 
                  onClick={handleSend}
                  className="bg-primary text-primary-foreground p-2 rounded-full hover:opacity-90 transition-opacity"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        {isOpen ? <Minimize2 size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}
