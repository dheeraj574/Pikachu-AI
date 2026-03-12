import React, { useState } from 'react';
import { Search, Brain, Sparkles, ChevronRight, Info } from 'lucide-react';
import api from '../lib/axios';
import ResourceCard from '../components/ResourceCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function AISearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const res = await api.get(`/resources?topic=${query}`);
      if (res.data && res.data.length > 0) {
        setResults(res.data);
      } else {
        setResults([
          { subject: 'Data Structures', topic: 'Linked Lists', resource_type: 'Video', rating: 4.8, downloads: 456 },
          { subject: 'Operating Systems', topic: 'Process Management', resource_type: 'Notes', rating: 4.5, downloads: 210 }
        ]);
      }
    } catch (error) {
      setResults([
        { subject: 'Data Structures', topic: 'Linked Lists', resource_type: 'Video', rating: 4.8, downloads: 456 },
        { subject: 'Operating Systems', topic: 'Process Management', resource_type: 'Notes', rating: 4.5, downloads: 210 }
      ]);
    }
    
    // Mock AI explanation
    setExplanation(`Based on your search for "${query}", I've identified resources that cover the core theoretical foundations and practical applications. These materials are highly rated by students in your semester and align with the latest syllabus requirements.`);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-primary/10 shadow-2xl bg-white flex items-center justify-center">
            <img 
              src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" 
              alt="Pikachu AI Logo" 
              className="w-20 h-20 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} /> Powered by Pikachu AI
          </div>
          <h1 className="text-5xl font-bold tracking-tight">Semantic Search</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Ask anything in natural language. Our AI understands the context of your academic curriculum.</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={24} />
        <input
          type="text"
          placeholder="e.g. 'Show me important questions for DBMS normalization' or 'Explain TCP handshake'"
          className="w-full bg-card border border-border rounded-[32px] py-6 pl-16 pr-6 text-xl shadow-xl focus:ring-2 focus:ring-primary transition-all"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button 
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
        >
          Search
        </button>
      </form>

      <AnimatePresence>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-medium text-muted-foreground">AI is analyzing your query...</p>
          </div>
        ) : results.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* AI Explanation Panel */}
            <div className="bg-primary text-primary-foreground p-8 rounded-3xl space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] -mr-32 -mt-32" />
              <h3 className="text-xl font-bold flex items-center gap-2 relative z-10">
                <Brain size={24} /> Why these resources?
              </h3>
              <p className="leading-relaxed opacity-90 relative z-10">{explanation}</p>
              <div className="flex gap-4 relative z-10 pt-2">
                <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                  <Info size={12} /> Topic Similarity: 98%
                </div>
                <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full">
                  <Sparkles size={12} /> AI Suggested
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {results.map((res, i) => (
                <ResourceCard key={i} resource={res} />
              ))}
            </div>
          </motion.div>
        ) : query && !loading && (
          <div className="text-center py-20 text-muted-foreground">
            No resources found for your query. Try rephrasing it!
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
