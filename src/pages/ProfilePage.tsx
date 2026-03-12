import { useAuth } from '../context/AuthContext';
import { User, Mail, BookOpen, Clock, Award, TrendingUp, Calendar, MapPin, Bookmark, Zap, ChevronRight, Save, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState } from 'react';

const studyData = [
  { name: 'Mon', hours: 2.5 },
  { name: 'Tue', hours: 4.0 },
  { name: 'Wed', hours: 3.2 },
  { name: 'Thu', hours: 5.5 },
  { name: 'Fri', hours: 2.8 },
  { name: 'Sat', hours: 6.0 },
  { name: 'Sun', hours: 4.2 },
];

const COLORS = ['#0f172a', '#334155', '#475569', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    branch: user?.branch || '',
    semester: user?.semester || '',
  });

  const handleSave = () => {
    if (setUser) {
      setUser({ ...user, ...formData });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="flex gap-6 items-center">
          <div className="w-24 h-24 bg-primary text-primary-foreground rounded-3xl flex items-center justify-center text-4xl font-bold shadow-xl">
            {formData.name.charAt(0)}
          </div>
          <div className="space-y-1">
            {isEditing ? (
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="text-3xl font-bold tracking-tight bg-secondary border-none rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-primary/20"
              />
            ) : (
              <h1 className="text-3xl font-bold tracking-tight">{formData.name}</h1>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mail size={14} /> {user?.email}</span>
              <span className="flex items-center gap-1"><MapPin size={14} /> GITAM University</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> Joined March 2024</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(false)}
                className="bg-secondary px-4 py-2 rounded-lg font-bold text-sm hover:bg-border transition-colors flex items-center gap-2"
              >
                <X size={16} /> Cancel
              </button>
              <button 
                onClick={handleSave}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Save size={16} /> Save Changes
              </button>
            </>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-secondary px-6 py-2 rounded-lg font-bold text-sm hover:bg-border transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info & Achievements */}
        <div className="space-y-8">
          <section className="bg-card border border-border p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2"><User size={18} /> Academic Info</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Branch</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.branch}
                    onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
                    className="text-sm font-bold bg-secondary border-none rounded px-2 py-1 outline-none text-right"
                  />
                ) : (
                  <span className="text-sm font-bold">{formData.branch}</span>
                )}
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Semester</span>
                {isEditing ? (
                  <input 
                    type="text" 
                    value={formData.semester}
                    onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                    className="text-sm font-bold bg-secondary border-none rounded px-2 py-1 outline-none text-right"
                  />
                ) : (
                  <span className="text-sm font-bold">{formData.semester}</span>
                )}
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-muted-foreground">Student ID</span>
                <span className="text-sm font-bold">2024CS0124</span>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2"><Award size={18} /> Achievements</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-secondary rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp size={20} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">7 Day Streak</p>
              </div>
              <div className="p-4 bg-secondary rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <BookOpen size={20} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">50+ Resources</p>
              </div>
              <div className="p-4 bg-secondary rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <Clock size={20} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">120 Study Hrs</p>
              </div>
              <div className="p-4 bg-secondary rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <Zap size={20} />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Top Contributor</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column: Analytics */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-card border border-border p-8 rounded-3xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold flex items-center gap-2"><TrendingUp size={20} /> Learning Analytics</h3>
              <select className="bg-secondary border-none rounded-lg px-3 py-1 text-xs font-bold outline-none">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]}>
                    {studyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-border">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Study Time</p>
                <p className="text-2xl font-bold">28.2 hrs</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subjects Accessed</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Topics Covered</p>
                <p className="text-2xl font-bold">142</p>
              </div>
            </div>
          </section>

          <section className="bg-card border border-border p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold">Recent Activity</h3>
            <div className="space-y-4">
              {[
                { action: 'Accessed DBMS Normalization Notes', time: '2 hours ago', icon: BookOpen },
                { action: 'Bookmarked TCP/IP Layers PYQ', time: '5 hours ago', icon: Bookmark },
                { action: 'Uploaded OS Scheduling PPT', time: 'Yesterday', icon: Award },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-secondary/50 rounded-2xl transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                    <activity.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
