import { Search, Bell, Moon, Sun, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-secondary rounded-md text-muted-foreground"
        >
          <Menu size={20} />
        </button>
        <div className="relative group flex-1 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search for subjects, topics, or AI insights..."
            className="w-full bg-secondary border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <button className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-card"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.branch}</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
            {user?.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
