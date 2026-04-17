import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  UserSquare,
  Plus,
  AlertTriangle,
  GripVertical,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock schedule data
const mockScheduleData = [
  { id: 1, subject: 'CC225 - Data Structures', teacher: 'Prof. Cruz', room: 'Lab A', time: '08:00 AM - 10:00 AM', day: 'Monday', section: 'BSIT-1A', branch: 'Main Campus', shift: 'Morning' },
  { id: 2, subject: 'CC226 - OOP', teacher: 'Prof. Villanueva', room: 'Lab B', time: '10:30 AM - 12:30 PM', day: 'Monday', section: 'BSIT-1A', branch: 'Main Campus', shift: 'Morning' },
  { id: 3, subject: 'IT103 - Networking', teacher: 'Prof. Santos', room: 'Room 304', time: '01:00 PM - 03:00 PM', day: 'Tuesday', section: 'BSIT-2A', branch: 'North Branch', shift: 'Afternoon' },
  { id: 4, subject: 'GE101 - Understanding Self', teacher: 'Dr. Reyes', room: 'Room 201', time: '08:00 AM - 10:00 AM', day: 'Wednesday', section: 'BSCS-1B', branch: 'South Campus', shift: 'Morning' },
  { id: 5, subject: 'CC101 - Intro Computing', teacher: 'Prof. Gonzales', room: 'Lab C', time: '03:30 PM - 05:30 PM', day: 'Thursday', section: 'BSIT-1A', branch: 'Main Campus', shift: 'Afternoon' },
];

const dayColors: Record<string, string> = {
  Monday: 'bg-blue-600',
  Tuesday: 'bg-green-600',
  Wednesday: 'bg-purple-600',
  Thursday: 'bg-orange-600',
  Friday: 'bg-pink-600',
  Saturday: 'bg-teal-600',
};

export function SchedulePage() {
  const [branchFilter, setBranchFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');

  const filtered = mockScheduleData.filter(s => {
    const matchesBranch = branchFilter === 'all' || s.branch === branchFilter;
    const matchesSection = sectionFilter === 'all' || s.section === sectionFilter;
    return matchesBranch && matchesSection;
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Schedule Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Drag & drop scheduler with conflict detection across all branches
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Plus className="mr-2 h-4 w-4" />
          Add Schedule Entry
        </Button>
      </div>

      {/* Conflict Warning */}
      <Card className="bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-900 dark:text-amber-200">
            <p className="font-semibold mb-1">Conflict Detection Active</p>
            <p className="opacity-90">The system automatically checks for teacher, room, and time conflicts before saving any schedule entry. Section shift changes (morning ↔ evening) auto-update all related fields.</p>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Branch" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            <SelectItem value="Main Campus">Main Campus</SelectItem>
            <SelectItem value="North Branch">North Branch</SelectItem>
            <SelectItem value="South Campus">South Campus</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sectionFilter} onValueChange={setSectionFilter}>
          <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Section" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            <SelectItem value="BSIT-1A">BSIT-1A</SelectItem>
            <SelectItem value="BSIT-2A">BSIT-2A</SelectItem>
            <SelectItem value="BSCS-1B">BSCS-1B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Schedule View */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="grid">Weekly Grid</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
            {days.map(day => {
              const daySchedule = filtered.filter(s => s.day === day);
              return (
                <Card key={day} className="overflow-hidden">
                  <CardHeader className={`${dayColors[day]} text-white py-3 px-4`}>
                    <CardTitle className="text-base font-semibold">{day}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {daySchedule.length > 0 ? (
                      <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {daySchedule.map(sched => (
                          <div key={sched.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-grab flex gap-3">
                            <GripVertical className="h-5 w-5 text-slate-300 dark:text-slate-700 mt-0.5 shrink-0" />
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-slate-900 dark:text-white">{sched.subject}</p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><UserSquare className="w-3 h-3" />{sched.teacher}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{sched.room}</span>
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{sched.time}</span>
                              </div>
                              <div className="flex gap-1.5 mt-2">
                                <Badge variant="outline" className="text-[10px] h-5">{sched.section}</Badge>
                                <Badge variant="outline" className="text-[10px] h-5">{sched.shift}</Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center text-slate-400 text-sm">No classes scheduled</div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Day</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Subject</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Teacher</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Room</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Time</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Section</th>
                    <th className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Branch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map(sched => (
                    <tr key={sched.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <td className="px-4 py-3 font-medium">{sched.day}</td>
                      <td className="px-4 py-3">{sched.subject}</td>
                      <td className="px-4 py-3">{sched.teacher}</td>
                      <td className="px-4 py-3">{sched.room}</td>
                      <td className="px-4 py-3 text-slate-500">{sched.time}</td>
                      <td className="px-4 py-3"><Badge variant="outline" className="font-normal">{sched.section}</Badge></td>
                      <td className="px-4 py-3 text-slate-500">{sched.branch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
