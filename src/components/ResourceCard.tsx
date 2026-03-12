import { Star, Download, Bookmark, Share2, ShieldCheck } from 'lucide-react';
import { Resource } from '../types';
import { cn } from '../lib/utils';

interface ResourceCardProps {
  resource: Resource;
  onView?: (resource: Resource) => void;
}

export default function ResourceCard({ resource, onView }: ResourceCardProps) {
  return (
    <div className="bg-card border border-border p-5 rounded-xl hover:border-primary/20 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary px-2 py-1 rounded">
          {resource.resource_type}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              window.open('/mock/notes.pdf', '_blank');
            }}
            className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-primary transition-colors"
          >
            <Download size={16} />
          </button>
          <button className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-primary transition-colors">
            <Bookmark size={16} />
          </button>
          <button className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-primary transition-colors">
            <Share2 size={16} />
          </button>
        </div>
      </div>

      <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors cursor-pointer" onClick={() => onView?.(resource)}>
        {resource.topic}
      </h4>
      <p className="text-sm text-muted-foreground mb-4">{resource.subject}</p>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
            <Star size={14} fill="currentColor" />
            {resource.rating}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Download size={14} />
            {resource.downloads}
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-tighter">
          <ShieldCheck size={12} />
          Trust: 98%
        </div>
      </div>
    </div>
  );
}
