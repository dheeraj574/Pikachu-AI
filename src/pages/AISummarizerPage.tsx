import React, { useState, useRef } from 'react';
import { FileText, Sparkles, Copy, Check, RotateCcw, Upload } from 'lucide-react';
import { generateSummary } from '../lib/gemini';
import { motion } from 'framer-motion';

export default function AISummarizerPage() {
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContent(text);
    };
    reader.readAsText(file);
  };

  const handleSummarize = async () => {
    if (!content.trim()) return;
    setIsLoading(true);
    try {
      const result = await generateSummary(content);
      setSummary(result || '');
    } catch (error) {
      console.error('Summarization failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setContent('');
    setSummary('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Summarizer</h1>
        <p className="text-muted-foreground">
          Transform long academic papers, notes, or articles into concise, easy-to-read summaries.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Input Section */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-2 text-primary font-semibold">
            <div className="flex items-center gap-2">
              <FileText size={20} />
              <h2>Input Content</h2>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-secondary hover:bg-border rounded-lg transition-colors"
            >
              <Upload size={14} />
              Upload Document
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              accept=".txt,.md,.csv" 
              className="hidden" 
            />
          </div>
          <textarea
            className="w-full h-64 p-4 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
            placeholder="Paste your text here (e.g., lecture notes, textbook chapters, research paper abstracts)..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <button
              onClick={reset}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Clear
            </button>
            <button
              onClick={handleSummarize}
              disabled={isLoading || !content.trim()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              {isLoading ? 'Summarizing...' : 'Summarize Now'}
            </button>
          </div>
        </div>

        {/* Output Section */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Sparkles size={20} className="text-yellow-500" />
                <h2>AI Generated Summary</h2>
              </div>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-secondary rounded-md transition-colors text-muted-foreground hover:text-primary"
                title="Copy to clipboard"
              >
                {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed whitespace-pre-wrap">
              {summary}
            </div>
          </motion.div>
        )}
      </div>

      {/* Features Grid */}
      {!summary && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
          <div className="p-4 rounded-xl border border-border bg-card/50">
            <h3 className="font-semibold mb-1">Concise Points</h3>
            <p className="text-xs text-muted-foreground">Get key takeaways in bullet points for quick revision.</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card/50">
            <h3 className="font-semibold mb-1">Time Saving</h3>
            <p className="text-xs text-muted-foreground">Reduce hours of reading into minutes of focused study.</p>
          </div>
          <div className="p-4 rounded-xl border border-border bg-card/50">
            <h3 className="font-semibold mb-1">Smart Extraction</h3>
            <p className="text-xs text-muted-foreground">AI identifies the most important academic concepts automatically.</p>
          </div>
        </div>
      )}
    </div>
  );
}
