import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Search, Filter, TrendingUp, Star, ChevronRight, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../lib/utils';

const mockTrendData = [
  { name: '2020', freq: 4 },
  { name: '2021', freq: 7 },
  { name: '2022', freq: 5 },
  { name: '2023', freq: 9 },
  { name: '2024', freq: 12 },
  { name: '2025', freq: 15 },
];

export default function PYQFinderPage() {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [pyqs, setPyqs] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMarks, setSelectedMarks] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.get('/subjects').then(res => {
      if (res.data && res.data.length > 0) setSubjects(res.data);
      else setSubjects(['DBMS', 'Data Structures', 'Operating Systems']);
    }).catch(() => {
      setSubjects(['DBMS', 'Data Structures', 'Operating Systems']);
    });

    fetchPYQs();
  }, []);

  const fetchPYQs = async (subject = '', year = '', marks: number | null = null) => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (subject) params.append('subject', subject);
    if (year) params.append('year', year);
    if (marks) params.append('marks', marks.toString());

    try {
      const res = await api.get(`/pyq?${params.toString()}`);
      if (res.data && res.data.length > 0) {
        setPyqs(res.data);
      } else {
        setPyqs(getFallbackPYQs(subject));
      }
    } catch (error) {
      setPyqs(getFallbackPYQs(subject));
    } finally {
      setIsLoading(false);
    }
  };

  const getFallbackPYQs = (subject: string) => {
    const all = [
      { subject: 'DBMS', topic: 'ER Model', year: 2024, marks: 8, question_type: 'Theory', difficulty: 'Easy', importance_score: 0.96 },
      { subject: 'DBMS', topic: 'Normalization', year: 2021, marks: 12, question_type: 'Problem', difficulty: 'Medium', importance_score: 0.71 },
      { subject: 'Data Structures', topic: 'Linked Lists', year: 2023, marks: 10, question_type: 'Theory', difficulty: 'Medium', importance_score: 0.85 },
      { subject: 'Operating Systems', topic: 'Process Management', year: 2022, marks: 15, question_type: 'Long Answer', difficulty: 'Hard', importance_score: 0.92 }
    ];
    let filtered = all;
    if (subject) filtered = filtered.filter(p => p.subject === subject);
    return filtered;
  };

  const handleApplyFilters = () => {
    fetchPYQs(selectedSubject, selectedYear, selectedMarks);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PYQ Finder</h1>
          <p className="text-muted-foreground">Discover previous year questions sorted by topic and importance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="bg-card border border-border p-6 rounded-2xl space-y-6 h-fit sticky top-24">
          <h3 className="font-bold flex items-center gap-2"><Filter size={18} /> Filters</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Subject</label>
              <select 
                className="w-full bg-secondary border-none rounded-lg p-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Year</label>
              <select 
                className="w-full bg-secondary border-none rounded-lg p-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">All Years</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
              </select>
            </div>
          </div>

          <button 
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Apply Filters'}
          </button>
        </div>

        {/* Results Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Trend Graph */}
          <section className="bg-card border border-border p-6 rounded-2xl space-y-4">
            <h3 className="font-bold flex items-center gap-2"><TrendingUp size={18} /> Topic Frequency Trend</h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTrendData}>
                  <defs>
                    <linearGradient id="colorFreq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="freq" stroke="#0f172a" fillOpacity={1} fill="url(#colorFreq)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* PYQ Cards */}
          <div className="grid grid-cols-1 gap-4">
            {pyqs.map((pyq, i) => (
              <div key={i} className="bg-card border border-border p-6 rounded-2xl hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary px-2 py-1 rounded">{pyq.year}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-primary text-primary-foreground px-2 py-1 rounded">{pyq.marks} Marks</span>
                    {parseFloat(pyq.importance_score) > 0.8 && (
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-yellow-50 text-yellow-600 px-2 py-1 rounded flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> Important
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{pyq.subject}</span>
                </div>
                
                <h4 className="text-lg font-bold mb-4 group-hover:text-primary transition-colors leading-relaxed">
                  Explain the concept of {pyq.topic} with a suitable example and diagram.
                </h4>

                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><FileText size={14} /> {pyq.question_type}</span>
                    <span className="flex items-center gap-1">Difficulty: {pyq.difficulty}</span>
                  </div>
                  <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
                    View Solution <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
