import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Clock, MapPin, UserSquare, RefreshCw } from 'lucide-react';

export function SchedulePage() {
  const weeklyClassSchedule = [
    { day: 'Monday', subject: 'CC225 - Data Structures', time: '08:00 AM - 10:00 AM', room: 'Lab A', teacher: 'Prof. Cruz' },
    { day: 'Tuesday', subject: 'GE101 - Understanding the Self', time: '01:00 PM - 03:00 PM', room: 'Room 302', teacher: 'Dr. Santos' },
    { day: 'Wednesday', subject: 'CC226 - OOP', time: '09:00 AM - 12:00 NN', room: 'Lab B', teacher: 'Prof. Villanueva' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Schedule
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Your weekly class schedule and upcoming exams
          </p>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 dark:bg-indigo-900/20 dark:border-indigo-900/40 flex justify-between items-center text-sm text-indigo-800 dark:text-indigo-300">
        <span className="font-medium flex items-center gap-2">Current Active Section: BSIT-1A</span>
        <span className="text-indigo-600 flex items-center gap-1 opacity-80"><RefreshCw className="h-3 w-3" /> Auto-sync enabled</span>
      </div>

      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3">
        {weeklyClassSchedule.map((sched, idx) => (
          <Card key={idx} className="relative overflow-hidden group border-slate-200 dark:border-slate-800 hover:border-blue-300 transition-colors dark:hover:border-blue-700">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500"></div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                  {sched.day}
                </span>
                <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3" />
                  {sched.time}
                </span>
              </div>
              <CardTitle className="text-lg leading-tight">{sched.subject}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mt-2 space-y-2 border border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center text-sm text-slate-700 dark:text-slate-300 gap-3">
                  <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
                    <UserSquare className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium">{sched.teacher}</span>
                </div>
                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 gap-3">
                  <div className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span>{sched.room}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exam Schedule Missing Data Mock */}
      <h3 className="text-xl font-bold mt-8 mb-4">Exam Schedule</h3>
      <Card className="border-dashed border-2 bg-transparent shadow-none">
        <CardContent className="p-12 text-center flex flex-col items-center">
          <CalendarIcon className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-3" />
          <p className="text-slate-600 font-medium">No impending exams scheduled yet.</p>
          <p className="text-sm text-slate-400 mt-1">Schedules will automatically appear here once posted by the Registrar.</p>
        </CardContent>
      </Card>
    </div>
  );
}
