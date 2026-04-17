import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Megaphone, Pin, Clock, MoreHorizontal } from 'lucide-react';

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
            Create and manage announcements for your branch students
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Post Announcement</CardTitle>
            <CardDescription>Visible only to Main Campus students.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="e.g. Schedule Change Updates" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Message</Label>
              <Textarea 
                id="content" 
                placeholder="Write your announcement details here..."
                className="min-h-[120px]"
              />
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Megaphone className="mr-2 h-4 w-4" />
              Publish to Branch
            </Button>
          </CardContent>
        </Card>

        {/* Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Admin Global Announcement (Example) */}
          <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900/50 dark:bg-blue-900/10">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-blue-600">Global Admin</Badge>
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Yesterday
                  </span>
                </div>
                <Pin className="h-4 w-4 text-blue-600" />
              </div>
              <CardTitle className="text-xl mt-2">New Enrollment System Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                Please be advised that the new enrollment system will require all branch staff to verify the preliminary forms before generating the student's Statement of Account.
              </p>
            </CardContent>
          </Card>

          {/* Branch Level Announcement */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Main Campus
                  </Badge>
                  <span className="text-sm text-slate-500">You • 2 hours ago</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <CardTitle className="text-lg mt-2">Room Changes for Final Exams</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-300">
                All CC101 classes will be moved to the Gymnasium for the final examinations. Please inform your students regarding this change immediately.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
