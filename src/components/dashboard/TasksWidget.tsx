import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useDashboardStore } from '@/stores';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';

interface TasksWidgetProps {
  className?: string;
}

const priorityColors = {
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  medium: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  high: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  urgent: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

export function TasksWidget({ className }: TasksWidgetProps) {
  const { tasks, completeTask, isLoading } = useDashboardStore();

  const pendingTasks = tasks.filter(
    (t) => t.status === 'pending' || t.status === 'in_progress'
  );

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Pending Tasks</CardTitle>
        <Badge variant="secondary">{pendingTasks.length}</Badge>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="space-y-3 p-6 pt-0">
            {pendingTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                <CheckCircle2 className="h-12 w-12 mb-2 text-emerald-500" />
                <p>All tasks completed!</p>
              </div>
            ) : (
              pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-6 w-6 mt-0.5"
                    onClick={() => completeTask(task.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-slate-400 hover:text-emerald-500" />
                    )}
                  </Button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          'text-xs',
                          priorityColors[task.priority]
                        )}
                      >
                        {priorityLabels[task.priority]}
                      </Badge>
                      {task.dueDate && (
                        <span className="flex items-center text-xs text-slate-400">
                          <Clock className="mr-1 h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
