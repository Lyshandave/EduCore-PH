import { BookOpen } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function TeacherEvaluationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Teacher Evaluation Results
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            View your average ratings and student feedback.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Overall Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">4.8 / 5.0</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Based on 150 student evaluations</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
          Detailed Comments Module
        </h3>
        <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          Detailed student feedback and comments are currently being aggregated. They will be available for viewing soon.
        </p>
      </div>
    </div>
  );
}
