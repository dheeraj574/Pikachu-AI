import { BookOpen, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface SubjectCardProps {
  name: string;
  resourceCount: number;
  difficulty: string;
  progress: number;
  onClick?: () => void;
}

export default function SubjectCard({ name, resourceCount, difficulty, progress, onClick }: SubjectCardProps) {
  return (
    <div 
      onClick={onClick}
      className="bg-card border border-border p-6 rounded-2xl hover:border-primary/30 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <BookOpen size={24} />
        </div>
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded",
          difficulty === 'Hard' ? "bg-red-50 text-red-600" : 
          difficulty === 'Medium' ? "bg-orange-50 text-orange-600" : 
          "bg-green-50 text-green-600"
        )}>
          {difficulty}
        </span>
      </div>

      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground mb-6">{resourceCount} Resources available</p>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-muted-foreground">Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex items-center text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
        View Details <ChevronRight size={16} />
      </div>
    </div>
  );
}
