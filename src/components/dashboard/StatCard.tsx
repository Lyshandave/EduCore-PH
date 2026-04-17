import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  variant = 'default',
}: StatCardProps) {
  const variantStyles = {
    default: 'bg-white dark:bg-slate-950',
    primary: 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white',
    success: 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white',
    warning: 'bg-gradient-to-br from-amber-500 to-orange-500 text-white',
    danger: 'bg-gradient-to-br from-red-600 to-rose-600 text-white',
  };

  const isGradient = variant !== 'default';

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={cn(
          'text-sm font-medium',
          isGradient ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
        )}>
          {title}
        </CardTitle>
        <div className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg',
          isGradient ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
        )}>
          <Icon className={cn(
            'h-5 w-5',
            isGradient ? 'text-white' : 'text-slate-600 dark:text-slate-400'
          )} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <div className="flex items-center gap-2 mt-1">
            {trend && (
              <span className={cn(
                'flex items-center text-xs font-medium',
                trend.isPositive
                  ? isGradient ? 'text-white/80' : 'text-emerald-600'
                  : isGradient ? 'text-white/80' : 'text-red-600'
              )}>
                {trend.isPositive ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {trend.value}%
              </span>
            )}
            {description && (
              <p className={cn(
                'text-xs',
                isGradient ? 'text-white/60' : 'text-slate-500 dark:text-slate-400'
              )}>
                {description}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
