import { 
  BookOpen, 
  FileText, 
  Zap, 
  Bookmark, 
  TrendingUp, 
  Clock, 
  Star 
} from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../lib/axios';
import ResourceCard from '../components/ResourceCard';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [recentResources, setRecentResources] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Mocking semester-specific subjects
    const semesterSubjects: Record<number, string[]> = {
      1: ['Mathematics I', 'Physics', 'Programming in C', 'English'],
      2: ['Mathematics II', 'Chemistry', 'Data Structures', 'Electrical Engineering'],
      3: ['Discrete Mathematics', 'Digital Logic', 'OOP with Java', 'Data Communications'],
      4: ['Algorithms', 'Microprocessors', 'Software Engineering', 'Computer Organization'],
      5: ['Theory of Computation', 'Computer Networks', 'Database Systems', 'Web Technologies'],
      6: ['Operating Systems', 'Compiler Design', 'Artificial Intelligence', 'Machine Learning'],
      7: ['Cloud Computing', 'Cyber Security', 'Big Data Analytics', 'Mobile Computing'],
      8: ['Project Work', 'Professional Ethics', 'Elective III', 'Elective IV']
    };

    const currentSemester = 6;
    const subs = semesterSubjects[currentSemester] || ['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks'];
    setSubjects(subs);

    api.get('/resources?limit=4').then(res => {
      if (res.data && res.data.length > 0) setRecentResources(res.data);
      else setRecentResources([
        { subject: 'Operating Systems', topic: 'Process Management', resource_type: 'Notes', rating: 4.5, downloads: 210 },
        { subject: 'Compiler Design', topic: 'Lexical Analysis', resource_type: 'Video', rating: 4.8, downloads: 456 },
        { subject: 'Artificial Intelligence', topic: 'Neural Networks', resource_type: 'PPT', rating: 4.9, downloads: 500 },
        { subject: 'Machine Learning', topic: 'Linear Regression', resource_type: 'Notes', rating: 4.4, downloads: 280 }
      ]);
    }).catch(() => {
      setRecentResources([
        { subject: 'Operating Systems', topic: 'Process Management', resource_type: 'Notes', rating: 4.5, downloads: 210 },
        { subject: 'Compiler Design', topic: 'Lexical Analysis', resource_type: 'Video', rating: 4.8, downloads: 456 },
        { subject: 'Artificial Intelligence', topic: 'Neural Networks', resource_type: 'PPT', rating: 4.9, downloads: 500 },
        { subject: 'Machine Learning', topic: 'Linear Regression', resource_type: 'Notes', rating: 4.4, downloads: 280 }
      ]);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-4">
          <div className="">
            <img 
              src="logo.png" 
              alt="Pikachu AI Logo" 
              className=" h-20 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening in your academic world.</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-primary">6th Semester</p>
          <p className="text-xs text-muted-foreground">Computer Science</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Total Subjects" value={subjects.length} icon={BookOpen} trend="+2 this week" />
        <StatsCard label="Available Resources" value="1,240" icon={FileText} color="bg-blue-50" />
        <StatsCard label="Important Topics" value="48" icon={Zap} color="bg-yellow-50" />
        <StatsCard label="Study Hours" value="120" icon={Clock} color="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Studying */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock size={20} className="text-primary" /> Continue Studying
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {subjects.slice(0, 2).map((sub) => (
                <div 
                  key={sub} 
                  onClick={() => navigate(`/resources?subject=${sub}`)}
                  className="bg-card border border-border p-5 rounded-xl flex justify-between items-center group cursor-pointer hover:border-primary/30 transition-all"
                >
                  <div>
                    <h4 className="font-bold">{sub}</h4>
                    <p className="text-xs text-muted-foreground">Last accessed 2 hours ago</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Zap size={14} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* AI Recommendations */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Star size={20} className="text-yellow-500" /> AI Recommendations
              </h2>
              <button className="text-sm font-bold text-primary hover:underline">View all</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentResources.map((res, i) => (
                <ResourceCard key={i} resource={res} />
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Content */}
        <div className="space-y-8">
          {/* Important Topics Today */}
          <section className="bg-primary text-primary-foreground p-6 rounded-2xl space-y-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[40px] -mr-16 -mt-16" />
            <h2 className="text-xl font-bold flex items-center gap-2 relative z-10">
              <TrendingUp size={20} /> Important Topics Today
            </h2>
            <div className="space-y-4 relative z-10">
              {[
                { topic: 'Normalization in DBMS', weight: 'High' },
                { topic: 'TCP/IP Model Layers', weight: 'Critical' },
                { topic: 'B-Trees Indexing', weight: 'Medium' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm font-medium">{item.topic}</span>
                  <span className="text-[10px] font-bold uppercase bg-white/20 px-2 py-0.5 rounded">{item.weight}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate('/exam-mode')}
              className="w-full bg-white text-primary py-2 rounded-lg font-bold text-sm hover:bg-opacity-90 transition-opacity relative z-10"
            >
              Enter Exam Mode
            </button>
          </section>

          {/* Activity Tracking */}
          <section className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold">Activity Tracking</h2>
            <div className="space-y-4">
              {[
                { label: 'Study Time', value: '4.5 hrs', color: 'bg-blue-500' },
                { label: 'Resources Read', value: '12', color: 'bg-green-500' },
                { label: 'Quiz Score', value: '85%', color: 'bg-yellow-500' },
              ].map((stat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span>{stat.value}</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", stat.color)} style={{ width: '70%' }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
