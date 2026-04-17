import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Megaphone, Pin, Clock, MoreHorizontal, CalendarIcon, Send, Globe, Building2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const mockAnnouncements = [
  {
    id: 1,
    title: 'New Enrollment System Guidelines',
    content: 'Please be advised that the new enrollment system will require all branch staff to verify the preliminary forms before generating the student\'s Statement of Account.',
    target: 'All Branches',
    priority: 'High',
    postedBy: 'Admin',
    pinned: true,
    date: 'Yesterday, 10:00 AM',
    scheduled: false,
  },
  {
    id: 2,
    title: 'Final Exam Room Changes – Main Campus',
    content: 'All CC101 classes will be moved to the Gymnasium for the final examinations. Please wait in the lobby before your scheduled time.',
    target: 'Main Campus',
    priority: 'Medium',
    postedBy: 'Admin',
    pinned: false,
    date: '2 hours ago',
    scheduled: false,
  },
  {
    id: 3,
    title: 'Holiday Schedule Reminder',
    content: 'Classes are suspended on December 24-25 for the holiday season. Regular schedule resumes January 2.',
    target: 'All Branches',
    priority: 'Low',
    postedBy: 'Admin',
    pinned: false,
    date: 'Scheduled: Dec 20, 2024 08:00 AM',
    scheduled: true,
  },
];

const priorityColors: Record<string, string> = {
  High: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50',
  Medium: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-900/50',
  Low: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

export function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Announcements
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Create, target, and schedule announcements for all branches
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer */}
        <Card className="lg:col-span-1 h-fit shadow-md border-blue-100 dark:border-blue-900/30">
          <CardHeader className="bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-50 dark:border-blue-900/20">
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Create Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="an-title">Title</Label>
              <Input id="an-title" placeholder="e.g. Schedule Update Notice" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="an-content">Message</Label>
              <Textarea
                id="an-content"
                placeholder="Write your announcement message here..."
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Select target..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches (Global)</SelectItem>
                  <SelectItem value="main">Main Campus Only</SelectItem>
                  <SelectItem value="north">North Branch Only</SelectItem>
                  <SelectItem value="south">South Campus Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Set priority..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">🔴 High (Urgent)</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="low">⚪ Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Schedule Posting (Optional)</Label>
              <Input type="datetime-local" />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 mt-2">
              <Megaphone className="mr-2 h-4 w-4" />
              Publish Announcement
            </Button>
          </CardContent>
        </Card>

        {/* Feed */}
        <div className="lg:col-span-2 space-y-4">
          {mockAnnouncements.map((ann) => (
            <Card key={ann.id} className={`relative overflow-hidden ${ann.pinned ? 'border-blue-200 bg-blue-50/30 dark:border-blue-900/50 dark:bg-blue-900/10' : ''}`}>
              {ann.pinned && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600"></div>}
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    {ann.target === 'All Branches' ? (
                      <Badge variant="default" className="bg-blue-600 text-[10px]"><Globe className="w-3 h-3 mr-1" />Global</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-[10px]"><Building2 className="w-3 h-3 mr-1" />{ann.target}</Badge>
                    )}
                    <Badge variant="outline" className={`text-[10px] ${priorityColors[ann.priority]}`}>{ann.priority} Priority</Badge>
                    {ann.scheduled && <Badge variant="outline" className="text-[10px] border-purple-200 text-purple-600 bg-purple-50"><CalendarIcon className="w-3 h-3 mr-1" />Scheduled</Badge>}
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="h-3 w-3" /> {ann.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {ann.pinned && <Pin className="h-4 w-4 text-blue-600 shrink-0" />}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>{ann.pinned ? 'Unpin' : 'Pin to top'}</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardTitle className="text-lg mt-2">{ann.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 pb-5">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{ann.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
