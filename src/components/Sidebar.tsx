import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Zap, 
  Search, 
  FileText, 
  Bookmark, 
  Upload, 
  User, 
  LogOut,
  X,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: BookOpen, label: 'Subjects', path: '/subjects' },
  { icon: Zap, label: 'Exam Mode', path: '/exam-mode' },
  { icon: Search, label: 'PYQ Finder', path: '/pyq-finder' },
  { icon: Sparkles, label: 'AI Summarizer', path: '/summarizer' },
  { icon: MessageSquare, label: 'Doubt Section', path: '/doubts' },
  { icon: FileText, label: 'Resources', path: '/resources' },
  { icon: Upload, label: 'Upload Resource', path: '/upload' },
  { icon: User, label: 'Profile', path: '/profile' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card flex flex-col h-screen transition-transform lg:translate-x-0 lg:static",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-primary group">
            <div className="">
              <img 
                src="./logo.png" 
                alt="Pikachu AI Logo" 
                className="h-20 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight">Pikachu AI</span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">Resource Platform</span>
            </div>
          </Link>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-secondary rounded-md text-muted-foreground"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => onClose()}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                location.pathname === item.path
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-primary"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
