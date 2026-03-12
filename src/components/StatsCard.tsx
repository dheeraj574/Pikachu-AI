import React from 'react';
import { cn } from '../lib/utils';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  color?: string;
}

export default function StatsCard({ label, value, icon: Icon, trend, color }: StatsCardProps) {
  return (
    <div className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-lg", color || "bg-secondary")}>
          <Icon size={20} className="text-primary" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  );
}
