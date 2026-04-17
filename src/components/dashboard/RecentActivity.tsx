import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, formatRelativeTime } from '@/lib/utils';
import {
  UserPlus,
  CreditCard,
  GraduationCap,
  FileCheck,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'enrollment' | 'payment' | 'grade' | 'permit' | 'message' | 'alert' | 'success';
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

interface RecentActivityProps {
  activities: Activity[];
  className?: string;
}

const activityIcons: Record<Activity['type'], LucideIcon> = {
  enrollment: UserPlus,
  payment: CreditCard,
  grade: GraduationCap,
  permit: FileCheck,
  message: MessageSquare,
  alert: AlertCircle,
  success: CheckCircle,
};

const activityColors: Record<Activity['type'], string> = {
  enrollment: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  payment: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  grade: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  permit: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  message: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  alert: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  success: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
};

export function RecentActivity({ activities, className }: RecentActivityProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="space-y-4 p-6 pt-0">
            {activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                <AlertCircle className="h-12 w-12 mb-2 opacity-50" />
                <p>No recent activity</p>
              </div>
            ) : (
              activities.map((activity) => {
                const Icon = activityIcons[activity.type];
                return (
                  <div key={activity.id} className="flex gap-4">
                    <div className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                      activityColors[activity.type]
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {activity.description}
                      </p>
                      <p className="text-xs text-slate-400">
                        {formatRelativeTime(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
