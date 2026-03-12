import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, Brain, Sparkles, X, Info } from 'lucide-react';
import api from '../lib/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function UploadResourcePage() {
  const location = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    subject: location.state?.subject || '',
    topic: '',
    type: 'Notes',
    description: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    api.get('/subjects').then(res => {
      if (res.data && res.data.length > 0) setSubjects(res.data);
      else setSubjects(['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks', 'Software Engineering']);
    }).catch(() => {
      setSubjects(['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks', 'Software Engineering']);
    });
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !formData.title) return;
    
    setIsProcessing(true);
    
    try {
      // Real API call
      const response = await api.post('/resources', {
        title: formData.title,
        subject: formData.subject,
        topic: formData.topic,
        resource_type: formData.type,
        unit: 'Unit 1',
      });
      
      if (response.status === 201) {
        // Mock AI processing delay for better UX
        setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
        }, 1500);
      }
    } catch (error) {
      console.error('Upload failed', error);
      setIsProcessing(false);
      alert('Upload failed. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto h-[70vh] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-lg">
          <CheckCircle2 size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">Upload Successful!</h2>
          <p className="text-muted-foreground">Your resource has been uploaded and is being indexed by Pikachu AI. It will be visible to others after a quick moderation check.</p>
        </div>
        <div className="bg-secondary p-6 rounded-2xl w-full text-left space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">AI Processing Results</h4>
          <div className="flex flex-wrap gap-2">
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">#AutoTagged</span>
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">#TopicDetected</span>
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">#SummaryGenerated</span>
          </div>
          <p className="text-xs text-muted-foreground">Trust Score assigned: <span className="text-primary font-bold">Pending Verification</span></p>
        </div>
        <button 
          onClick={() => { setIsSuccess(false); setFile(null); }}
          className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
        >
          Upload Another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Resource</h1>
        <p className="text-muted-foreground">Contribute to the academic community. AI will help tag and summarize your content.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Resource Title</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Unit 3 DBMS Normalization Notes" 
              className="w-full bg-card border border-border rounded-xl py-3 px-4 focus:ring-1 focus:ring-primary outline-none"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Subject</label>
              <select 
                required
                className="w-full bg-card border border-border rounded-xl py-3 px-4 focus:ring-1 focus:ring-primary outline-none"
                value={formData.subject}
                onChange={e => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              >
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Type</label>
              <select 
                className="w-full bg-card border border-border rounded-xl py-3 px-4 focus:ring-1 focus:ring-primary outline-none"
                value={formData.type}
                onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="Notes">Notes</option>
                <option value="PPT">PPT</option>
                <option value="PYQ">PYQ</option>
                <option value="Book">Book</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Topic</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Normalization, SQL, Indexing" 
              className="w-full bg-card border border-border rounded-xl py-3 px-4 focus:ring-1 focus:ring-primary outline-none"
              value={formData.topic}
              onChange={e => setFormData(prev => ({ ...prev, topic: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Description</label>
            <textarea 
              rows={4}
              placeholder="Briefly describe what this resource covers..." 
              className="w-full bg-card border border-border rounded-xl py-3 px-4 focus:ring-1 focus:ring-primary outline-none resize-none"
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <button 
            disabled={isProcessing}
            type="submit" 
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                AI is processing...
              </>
            ) : (
              <>
                <Upload size={20} /> Upload Resource
              </>
            )}
          </button>
        </form>

        <div className="space-y-8">
          <div 
            className={`border-2 border-dashed rounded-[32px] p-12 flex flex-col items-center justify-center text-center space-y-4 transition-all ${
              file ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
            }`}
          >
            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center">
              <FileText size={32} className={file ? "text-primary" : "text-muted-foreground"} />
            </div>
            {file ? (
              <div className="space-y-1">
                <p className="font-bold">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button onClick={() => setFile(null)} className="text-red-500 text-xs font-bold uppercase tracking-widest mt-2 hover:underline">Remove File</button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-bold text-lg">Drag & drop your file here</p>
                <p className="text-sm text-muted-foreground">Support for PDF, PPTX, DOCX (Max 20MB)</p>
                <label className="inline-block bg-secondary px-6 py-2 rounded-lg font-bold text-sm cursor-pointer hover:bg-border transition-colors mt-4">
                  Browse Files
                  <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            )}
          </div>

          <div className="bg-secondary/50 p-8 rounded-3xl space-y-6">
            <h3 className="font-bold flex items-center gap-2"><Sparkles size={18} className="text-primary" /> AI Features Enabled</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-card rounded-lg flex items-center justify-center shrink-0"><Brain size={16} /></div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold">Auto Tagging</h4>
                  <p className="text-xs text-muted-foreground">AI automatically identifies key topics and syllabus units.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-card rounded-lg flex items-center justify-center shrink-0"><FileText size={16} /></div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold">Instant Summary</h4>
                  <p className="text-xs text-muted-foreground">A concise summary will be generated for quick revision.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
            <Info className="text-blue-600 shrink-0" size={20} />
            <p className="text-xs text-blue-800 leading-relaxed">By uploading, you agree to our academic integrity guidelines. Resources are ranked based on a community Trust Score.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
