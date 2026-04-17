import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Users, MapPin } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SchedulePage() {
  
  const mockTeachingSchedule = [
    { id: 1, subject: 'CC101 - Introduction to Computing', room: 'Lab A', time: '08:00 AM - 10:00 AM', day: 'Monday', section: 'BSIT-1A' },
    { id: 2, subject: 'CC102 - Fundamentals of Programming', room: 'Lab B', time: '10:30 AM - 12:30 PM', day: 'Monday', section: 'BSIT-1B' },
    { id: 3, subject: 'IT103 - Data Structures', room: 'Room 304', time: '01:00 PM - 03:00 PM', day: 'Tuesday', section: 'BSIT-2A' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Schedule
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Manage your daily teaching assignments and consult class schedules.
          </p>
        </div>
      </div>

      <Tabs defaultValue="teaching" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="teaching">My Teaching Schedule</TabsTrigger>
          <TabsTrigger value="class">Branch Class Schedules</TabsTrigger>
        </TabsList>
        <TabsContent value="teaching" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockTeachingSchedule.map(sched => (
              <Card key={sched.id} className="relative overflow-hidden group">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/40 dark:text-blue-400 px-2 py-1 rounded">
                      {sched.day}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sched.time}
                    </span>
                  </div>
                  <CardTitle className="text-base">{sched.subject}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 gap-2">
                      <MapPin className="w-4 h-4" /> {sched.room}
                    </div>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 gap-2">
                      <Users className="w-4 h-4" /> {sched.section}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="class">
          <Card>
            <CardContent className="py-12 flex flex-col items-center justify-center text-slate-500">
              <CalendarIcon className="w-12 h-12 mb-4 text-slate-300 dark:text-slate-700" />
              <p>Select a specific Section to view their full schedule.</p>
              <Button variant="outline" className="mt-4">Browse Sections</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
