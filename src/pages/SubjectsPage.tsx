import { useState, useEffect } from 'react';
import api from '../lib/axios';
import SubjectCard from '../components/SubjectCard';
import { Search, Filter, ChevronLeft, BookOpen, FileText, Zap, Play, FileDown, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ResourceCard from '../components/ResourceCard';
import { useNavigate } from 'react-router-dom';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [resources, setResources] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('Units');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/subjects').then(res => {
      if (res.data && res.data.length > 0) setSubjects(res.data);
      else setSubjects(['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks', 'Software Engineering']);
    }).catch(() => {
      setSubjects(['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks', 'Software Engineering']);
    });
  }, []);

  const handleSubjectClick = async (sub: string) => {
    setSelectedSubject(sub);
    try {
      const res = await api.get(`/resources?subject=${sub}`);
      if (res.data && res.data.length > 0) {
        setResources(res.data);
      } else {
        setResources(getFallbackResources(sub));
      }
    } catch (error) {
      setResources(getFallbackResources(sub));
    }
  };

  const getFallbackResources = (subject: string) => {
    return [
      { subject, topic: 'Introduction to ' + subject, resource_type: 'Notes', unit: 'Unit 1', rating: 4.5, downloads: 120 },
      { subject, topic: 'Advanced ' + subject, resource_type: 'PPT', unit: 'Unit 2', rating: 4.8, downloads: 85 },
      { subject, topic: subject + ' Previous Year Questions', resource_type: 'PYQ', unit: 'Unit 1', rating: 4.9, downloads: 320 },
      { subject, topic: subject + ' Video Lecture', resource_type: 'Video', unit: 'Unit 3', rating: 4.2, downloads: 150 },
      { subject, topic: 'Important Topics in ' + subject, resource_type: 'Notes', unit: 'Unit 4', rating: 4.7, downloads: 210 },
    ];
  };

  if (selectedSubject) {
    return (
      <div className="space-y-8">
        <button 
          onClick={() => setSelectedSubject(null)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          <ChevronLeft size={20} /> Back to Subjects
        </button>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{selectedSubject}</h1>
            <p className="text-muted-foreground">Browse all academic resources for this subject.</p>
          </div>
          <div className="flex gap-2">
             <button 
               onClick={() => navigate('/upload', { state: { subject: selectedSubject } })}
               className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-border transition-colors"
             >
               <Upload size={16} /> Upload Resource
             </button>
             <button 
               onClick={() => navigate('/exam-mode')}
               className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2"
             >
               <Zap size={16} /> Exam Mode
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border gap-8">
          {['Units', 'Notes', 'PPT', 'PYQ', 'Videos'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'Units' ? (
            // Unit cards
            Array.from(new Set(resources.map(r => r.unit))).map((unit, i) => (
              <div key={i} className="bg-card border border-border p-6 rounded-2xl hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-yellow-50 text-yellow-600 px-2 py-1 rounded">Important</span>
                </div>
                <h4 className="font-bold text-lg mb-1">{unit}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  {resources.filter(r => r.unit === unit).length} Resources
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Notes', 'PYQ', 'PPT'].map(t => (
                    <span key={t} className="text-[10px] font-bold uppercase bg-secondary px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Resource list for other tabs
            resources
              .filter(r => {
                if (activeTab === 'Notes') return r.resource_type === 'Notes';
                if (activeTab === 'PPT') return r.resource_type === 'PPT';
                if (activeTab === 'PYQ') return r.resource_type === 'PYQ';
                if (activeTab === 'Videos') return r.resource_type === 'Video';
                return true;
              })
              .map((res, i) => (
                <ResourceCard key={i} resource={res} />
              ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground">Select a subject to explore its resources.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input 
              type="text" 
              placeholder="Filter subjects..." 
              className="bg-card border border-border rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary"
            />
          </div>
          <button className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((sub, i) => (
          <SubjectCard 
            key={i} 
            name={sub} 
            resourceCount={12} 
            difficulty={i % 3 === 0 ? 'Hard' : i % 3 === 1 ? 'Medium' : 'Easy'} 
            progress={Math.floor(Math.random() * 100)}
            onClick={() => handleSubjectClick(sub)}
          />
        ))}
      </div>
    </div>
  );
}
