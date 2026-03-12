import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Zap, ShieldCheck, Clock, Download, FileText, Brain, ChevronRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getImportantQuestions, generateSummary } from '../lib/gemini';
import { useNavigate } from 'react-router-dom';

export default function ExamModePage() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [resources, setResources] = useState<any[]>([]);
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [importantQuestions, setImportantQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/subjects').then(res => {
      if (res.data && res.data.length > 0) setSubjects(res.data);
      else setSubjects(['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks']);
    }).catch(() => {
      setSubjects(['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks']);
    });
  }, []);

  const handleSubjectSelect = async (sub: string) => {
    setLoading(true);
    setSelectedSubject(sub);
    try {
      const [resData, pyqData] = await Promise.all([
        api.get(`/resources?subject=${sub}`),
        api.get(`/pyq?subject=${sub}`)
      ]);
      
      let finalResources = resData.data;
      let finalPyqs = pyqData.data;

      if (!finalResources || finalResources.length === 0) {
        finalResources = [
          { subject: sub, topic: 'Process Scheduling', resource_type: 'Notes', unit: 'Unit 1', rating: 4.5, downloads: 210 },
          { subject: sub, topic: 'Memory Management', resource_type: 'PPT', unit: 'Unit 2', rating: 4.8, downloads: 180 },
          { subject: sub, topic: 'Deadlocks', resource_type: 'Notes', unit: 'Unit 3', rating: 4.9, downloads: 320 },
          { subject: sub, topic: 'File Systems', resource_type: 'Video', unit: 'Unit 4', rating: 4.2, downloads: 150 },
          { subject: sub, topic: 'I/O Systems', resource_type: 'Notes', unit: 'Unit 5', rating: 4.7, downloads: 210 },
        ];
      }

      setResources(finalResources);
      setPyqs(finalPyqs);
      
      const topics = Array.from(new Set(finalResources.map((r: any) => r.topic))).slice(0, 5) as string[];
      const questions = await getImportantQuestions(sub, topics);
      setImportantQuestions(questions.length > 0 ? questions : [
        'Explain the difference between paging and segmentation.',
        'What are the necessary conditions for a deadlock?',
        'Describe the various process states with a diagram.',
        'Compare preemptive and non-preemptive scheduling.',
        'What is a virtual memory? Explain demand paging.'
      ]);
    } catch (error) {
      setResources([
        { subject: sub, topic: 'Process Scheduling', resource_type: 'Notes', unit: 'Unit 1', rating: 4.5, downloads: 210 },
        { subject: sub, topic: 'Memory Management', resource_type: 'PPT', unit: 'Unit 2', rating: 4.8, downloads: 180 },
      ]);
      setImportantQuestions([
        'Explain the difference between paging and segmentation.',
        'What are the necessary conditions for a deadlock?'
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Zap className="text-primary" /> Exam Mode
          </h1>
          <p className="text-muted-foreground">Emergency preparation mode. High-yield content only.</p>
        </div>
        
        <select 
          className="bg-card border border-border rounded-lg px-4 py-2 text-sm font-bold focus:ring-1 focus:ring-primary outline-none"
          value={selectedSubject}
          onChange={(e) => handleSubjectSelect(e.target.value)}
        >
          <option value="">Select Subject</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {!selectedSubject ? (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-4 bg-secondary/20 rounded-3xl border-2 border-dashed border-border">
          <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center shadow-sm">
            <Zap size={32} className="text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Ready for Revision?</h3>
            <p className="text-muted-foreground max-w-xs">Select a subject from the dropdown to instantly surface high-weightage topics and resources.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Important Topics */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-card border border-border rounded-2xl overflow-hidden">
               <div className="p-6 border-b border-border bg-secondary/50 flex justify-between items-center">
                 <h3 className="font-bold flex items-center gap-2"><ShieldCheck size={18} className="text-primary" /> High Weightage Topics</h3>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Top 20% Priority</span>
               </div>
               <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {resources.slice(0, 10).map((res, i) => (
                   <div key={i} className="p-4 bg-secondary/30 rounded-xl border border-transparent hover:border-primary/20 transition-all group cursor-pointer">
                     <div className="flex justify-between items-start mb-2">
                       <h4 className="font-bold group-hover:text-primary transition-colors">{res.topic}</h4>
                       <span className="text-[10px] font-bold uppercase text-red-600">95% Freq</span>
                     </div>
                     <p className="text-xs text-muted-foreground">Unit: {res.unit}</p>
                   </div>
                 ))}
               </div>
            </section>

            <section className="bg-card border border-border rounded-2xl overflow-hidden">
               <div className="p-6 border-b border-border bg-secondary/50">
                 <h3 className="font-bold flex items-center gap-2"><FileText size={18} className="text-primary" /> Quick Revision Resources</h3>
               </div>
               <div className="divide-y divide-border">
                 {resources.filter(r => r.resource_type === 'Notes' || r.resource_type === 'PPT').slice(0, 5).map((res, i) => (
                   <div key={i} className="p-4 flex justify-between items-center hover:bg-secondary/30 transition-colors group cursor-pointer">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                         <FileText size={18} />
                       </div>
                       <div>
                         <h4 className="font-bold text-sm">{res.topic}</h4>
                         <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{res.resource_type}</p>
                       </div>
                     </div>
                     <div className="flex gap-2">
                       <button className="p-2 hover:bg-primary hover:text-primary-foreground rounded-lg transition-all"><Download size={16} /></button>
                       <button className="p-2 hover:bg-primary hover:text-primary-foreground rounded-lg transition-all"><ChevronRight size={16} /></button>
                     </div>
                   </div>
                 ))}
               </div>
            </section>
          </div>

          {/* AI Insights Sidebar */}
          <div className="space-y-6">
            <div className="bg-primary text-primary-foreground p-8 rounded-3xl space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] -mr-16 -mt-16" />
              <h3 className="text-xl font-bold flex items-center gap-2 relative z-10">
                <Brain size={20} /> Important Questions
              </h3>
              <div className="space-y-4 relative z-10">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-white/10 rounded w-full" />)}
                  </div>
                ) : (
                  importantQuestions.map((q, i) => (
                    <div key={i} className="flex gap-3 text-sm group cursor-pointer">
                      <span className="font-bold opacity-50">0{i+1}</span>
                      <p className="group-hover:translate-x-1 transition-transform">{q}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-card border border-border p-8 rounded-3xl space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Clock size={18} className="text-primary" /> Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/resources')}
                  className="p-4 bg-secondary rounded-xl flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <Download size={20} />
                  <span className="text-[10px] font-bold uppercase">All Notes</span>
                </button>
                <button 
                  onClick={() => navigate('/summarizer')}
                  className="p-4 bg-secondary rounded-xl flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <Zap size={20} />
                  <span className="text-[10px] font-bold uppercase">AI Summary</span>
                </button>
                <button 
                  onClick={() => navigate('/pyq-finder')}
                  className="p-4 bg-secondary rounded-xl flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <FileText size={20} />
                  <span className="text-[10px] font-bold uppercase">View PYQ</span>
                </button>
                <button 
                  onClick={() => navigate('/doubts')}
                  className="p-4 bg-secondary rounded-xl flex flex-col items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all group"
                >
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-bold uppercase">Practice</span>
                </button>
              </div>
            </div>

            <div className="p-6 bg-orange-50 border border-orange-100 rounded-2xl flex gap-4">
              <AlertCircle className="text-orange-600 shrink-0" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-orange-900">Exam Tip</h4>
                <p className="text-xs text-orange-800 leading-relaxed">Focus on Unit 3 and 5 as they carry 45% of the total weightage this year.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
