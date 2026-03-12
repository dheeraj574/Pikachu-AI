import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { Bookmark, Search, Filter, Trash2 } from 'lucide-react';
import ResourceCard from '../components/ResourceCard';

export default function BookmarkPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    api.get('/subjects').then(res => {
      if (res.data && res.data.length > 0) setSubjects(res.data);
      else setSubjects(['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks']);
    }).catch(() => {
      setSubjects(['Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks']);
    });

    // Mock bookmarks
    api.get('/resources?limit=6').then(res => {
      if (res.data && res.data.length > 0) setBookmarks(res.data);
      else setBookmarks([
        { subject: 'Data Structures', topic: 'Linked Lists', resource_type: 'Video', rating: 4.8, downloads: 456 },
        { subject: 'Operating Systems', topic: 'Process Management', resource_type: 'Notes', rating: 4.5, downloads: 210 },
        { subject: 'DBMS', topic: 'Normalization', resource_type: 'PPT', rating: 4.9, downloads: 500 },
        { subject: 'Computer Networks', topic: 'OSI Model', resource_type: 'Notes', rating: 4.4, downloads: 280 }
      ]);
    }).catch(() => {
      setBookmarks([
        { subject: 'Data Structures', topic: 'Linked Lists', resource_type: 'Video', rating: 4.8, downloads: 456 },
        { subject: 'Operating Systems', topic: 'Process Management', resource_type: 'Notes', rating: 4.5, downloads: 210 }
      ]);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>
          <p className="text-muted-foreground">Your saved notes, topics, and resources for quick access.</p>
        </div>
      </div>

      <div className="bg-card border border-border p-4 rounded-xl flex gap-4 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            type="text" 
            placeholder="Search bookmarks..." 
            className="w-full bg-secondary border-none rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-1 focus:ring-primary"
          />
        </div>

        <select 
          className="bg-secondary border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <button className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground">
          <Filter size={18} />
        </button>
      </div>

      {bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks.map((res, i) => (
            <div key={i} className="relative group">
              <ResourceCard resource={res} />
              <button className="absolute top-4 right-4 p-2 bg-red-50 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[50vh] flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center">
            <Bookmark size={32} className="text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold">No bookmarks yet</h3>
            <p className="text-muted-foreground max-w-xs">Save resources from the library or subject pages to see them here.</p>
          </div>
        </div>
      )}
    </div>
  );
}
