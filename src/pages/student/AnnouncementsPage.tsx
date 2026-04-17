import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Pin, Clock, BookOpen } from 'lucide-react';

export function AnnouncementsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Announcements & Updates
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Important bulletins from Global Admins and your Local Branch Staff
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Admin Global Announcement */}
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50/80 to-white dark:border-blue-900/50 dark:from-blue-900/10 dark:to-slate-950 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>
          <CardHeader className="pb-3 border-b border-blue-100 dark:border-blue-900/30">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/50">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="default" className="bg-blue-600 text-[10px] px-1.5 py-0">Global Message</Badge>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3" /> Yesterday, 10:00 AM
                    </span>
                  </div>
                  <CardTitle className="text-lg text-blue-950 dark:text-blue-100">New Enrollment System Guidelines</CardTitle>
                </div>
              </div>
              <Pin className="h-4 w-4 text-blue-600 shrink-0" />
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-5">
            <p className="text-slate-700 leading-relaxed dark:text-slate-300">
              Please be advised that the new enrollment system will require all branch staff to verify the preliminary forms before generating the student's Statement of Account. Make sure your previous balance is cleared.
            </p>
          </CardContent>
        </Card>

        {/* Branch Level Announcement */}
        <Card className="shadow-sm">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 dark:bg-indigo-900/50">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] px-1.5 py-0 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800">
                      Main Campus Staff
                    </Badge>
                    <span className="text-xs text-slate-500 font-medium">2 hours ago</span>
                  </div>
                  <CardTitle className="text-lg">Room Changes for Final Exams</CardTitle>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 pb-5">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[15px]">
              All CC101 classes will be moved to the Gymnasium for the final examinations. Please wait in the lobby before your scheduled time. Do not forget your exam permits!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
