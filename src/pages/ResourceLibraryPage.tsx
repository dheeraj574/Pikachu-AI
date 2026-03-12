import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Search, Filter, Star, Download, Bookmark, Share2, ShieldCheck, Grid, List, Upload } from 'lucide-react';
import ResourceCard from '../components/ResourceCard';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ResourceLibraryPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [filters, setFilters] = useState({
    subject: new URLSearchParams(location.search).get('subject') || '',
    type: '',
    difficulty: '',
    search: ''
  });

  useEffect(() => {
    api.get('/subjects').then(res => {
      if (res.data && res.data.length > 0) setSubjects(res.data);
      else setSubjects(['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks', 'Software Engineering']);
    }).catch(() => {
      setSubjects(['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks', 'Software Engineering']);
    });
    fetchResources();
  }, [filters]);

  const fetchResources = async () => {
    const params = new URLSearchParams();
    if (filters.subject) params.append('subject', filters.subject);
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    
    try {
      const res = await api.get(`/resources?${params.toString()}`);
      if (res.data && res.data.length > 0) {
        setResources(res.data);
      } else {
        setResources(getFallbackResources(filters.subject, filters.type, filters.search));
      }
    } catch (error) {
      setResources(getFallbackResources(filters.subject, filters.type, filters.search));
    }
  };

  const getFallbackResources = (subject: string, type: string, search: string) => {
    const all = [
      { subject: 'Data Structures', topic: 'Linked Lists', resource_type: 'Video', rating: 4.8, downloads: 456 },
      { subject: 'Operating Systems', topic: 'Process Management', resource_type: 'Notes', rating: 4.5, downloads: 210 },
      { subject: 'DBMS', topic: 'Normalization', resource_type: 'PPT', rating: 4.9, downloads: 500 },
      { subject: 'Computer Networks', topic: 'OSI Model', resource_type: 'Notes', rating: 4.4, downloads: 280 },
      { subject: 'Software Engineering', topic: 'Agile Methodology', resource_type: 'Video', rating: 4.1, downloads: 120 }
    ];
    let filtered = all;
    if (subject) filtered = filtered.filter(r => r.subject === subject);
    if (type) filtered = filtered.filter(r => r.resource_type === type);
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(r => 
        r.topic.toLowerCase().includes(s) || 
        r.subject.toLowerCase().includes(s)
      );
    }
    return filtered;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Library</h1>
          <p className="text-muted-foreground">Central repository for all academic materials.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('/upload')}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Upload size={18} /> Upload
          </button>
          <button className="p-2 border border-border rounded-lg bg-card"><Grid size={18} /></button>
          <button className="p-2 border border-border rounded-lg"><List size={18} /></button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-card border border-border p-4 rounded-xl flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text" 
            placeholder="Search resources..." 
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full bg-secondary border-none rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary"
          />
        </div>

        <select 
          className="bg-secondary border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
          value={filters.subject}
          onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
        >
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select 
          className="bg-secondary border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
          value={filters.type}
          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
        >
          <option value="">All Types</option>
          <option value="Notes">Notes</option>
          <option value="PPT">PPT</option>
          <option value="Video">Video</option>
          <option value="Book">Book</option>
          <option value="PYQ">PYQ</option>
        </select>

        <select className="bg-secondary border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none">
          <option value="">Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground">
          <Filter size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {resources.map((res, i) => (
          <ResourceCard key={i} resource={res} />
        ))}
      </div>
    </div>
  );
}
