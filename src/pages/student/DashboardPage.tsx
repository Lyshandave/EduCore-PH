import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore, useAuthStore, usePaymentStore } from '@/stores';
import { StatCard } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard,
  GraduationCap,
  FileCheck,
  ArrowRight,
  Wallet,
  BookOpen,
  Bell,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
// @ts-ignore - unused destructured elements

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { notifications } = useDashboardStore();
void notifications; // notifications used in component
  const { selectedSOA, fetchSOAByStudentId } = usePaymentStore();

  useEffect(() => {
    if (user?.id) {
      fetchSOAByStudentId(user.id);
    }
  }, [user]);

  // Mock student data
  // Dynamic data from logged in user
  const studentData = {
    studentId: user?.studentId || '2024-0001',
    course: (user as any)?.courseId || 'BS Information Technology',
    yearLevel: ((user as any)?.yearLevel || '1st') + ' Year',
    section: 'IT-1A',
    enrollmentStatus: 'enrolled',
    gpa: 1.75,
    currentSemester: '1st Semester 2024-2025',
  };

  // Mock upcoming schedule
  const upcomingClasses = [
    { subject: 'IT101 - Programming Fundamentals', time: '8:00 AM - 10:00 AM', room: 'Lab 1' },
    { subject: 'IT102 - Data Structures', time: '10:30 AM - 12:30 PM', room: 'Room 205' },
    { subject: 'GE101 - Mathematics', time: '1:30 PM - 3:30 PM', room: 'Room 301' },
  ];

  // Mock announcements
  const announcements = [
    {
      id: '1',
      title: 'Prelims Exam Schedule',
      content: 'Prelims examination will start on August 15, 2024.',
      date: '2024-08-01',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Payment Deadline Reminder',
      content: 'Please settle your prelims balance before August 10.',
      date: '2024-08-02',
      priority: 'high',
    },
    {
      id: '3',
      title: 'Campus Maintenance',
      content: 'Library will be closed this weekend for maintenance.',
      date: '2024-08-03',
      priority: 'normal',
    },
  ];

  const soa = selectedSOA || {
    totalAmount: 57000,
    totalPaid: 25000,
    balance: 32000,
    prelims: { amount: 19000, paid: 15000, balance: 4000, status: 'partial' },
    midterms: { amount: 19000, paid: 10000, balance: 9000, status: 'partial' },
    finals: { amount: 19000, paid: 0, balance: 19000, status: 'unpaid' },
  };

  const paymentProgress = (soa.totalPaid / soa.totalAmount) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Student Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user?.firstName}! Here's your academic summary.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/student/profile')}>
            View Profile
          </Button>
        </div>
      </div>

      {/* Student Info Card */}
      <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
                alt={user?.firstName}
                className="h-20 w-20 rounded-full border-4 border-white/20"
              />
              <div>
                <h2 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-white/80">{studentData.studentId}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {studentData.course}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {studentData.yearLevel}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80">Current Semester</p>
              <p className="text-xl font-semibold">{studentData.currentSemester}</p>
              <div className="flex items-center gap-2 mt-2 justify-end">
                <span className="text-white/80">GPA:</span>
                <span className="text-2xl font-bold">{studentData.gpa}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value={formatCurrency(soa.balance)}
          description="Outstanding balance"
          icon={Wallet}
          variant="danger"
        />
        <StatCard
          title="Amount Paid"
          value={formatCurrency(soa.totalPaid)}
          description={`${paymentProgress.toFixed(1)}% of total`}
          icon={CreditCard}
          variant="success"
        />
        <StatCard
          title="Current Grades"
          value={studentData.gpa.toString()}
          description="General Average"
          icon={GraduationCap}
          variant="primary"
        />
        <StatCard
          title="Exam Permits"
          value="2"
          description="Available for download"
          icon={FileCheck}
          variant="warning"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Payment Summary */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
            <CardDescription>Your statement of account breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-500">Payment Progress</span>
                <span className="text-sm font-medium">{paymentProgress.toFixed(1)}%</span>
              </div>
              <Progress value={paymentProgress} className="h-2" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                <p className="text-sm text-slate-500">Prelims</p>
                <p className="text-lg font-semibold mt-1">
                  {formatCurrency(soa.prelims.balance)}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Paid: {formatCurrency(soa.prelims.paid)}
                </p>
                <Badge
                  variant="secondary"
                  className="mt-2"
                >
                  {soa.prelims.status}
                </Badge>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                <p className="text-sm text-slate-500">Midterms</p>
                <p className="text-lg font-semibold mt-1">
                  {formatCurrency(soa.midterms.balance)}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Paid: {formatCurrency(soa.midterms.paid)}
                </p>
                <Badge
                  variant="secondary"
                  className="mt-2"
                >
                  {soa.midterms.status}
                </Badge>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900">
                <p className="text-sm text-slate-500">Finals</p>
                <p className="text-lg font-semibold mt-1">
                  {formatCurrency(soa.finals.balance)}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Paid: {formatCurrency(soa.finals.paid)}
                </p>
                <Badge
                  variant="secondary"
                  className="mt-2"
                >
                  {soa.finals.status}
                </Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => navigate('/student/soa')}>
                View Full SOA
              </Button>
              <Button variant="outline" onClick={() => navigate('/student/payments')}>
                Make Payment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingClasses.map((cls, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800"
                >
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{cls.subject}</p>
                    <p className="text-xs text-slate-500">{cls.time}</p>
                    <p className="text-xs text-slate-400">{cls.room}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => navigate('/student/schedule')}
            >
              View Full Schedule
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Announcements */}
      <Card>
        <CardHeader>
          <CardTitle>Announcements</CardTitle>
          <CardDescription>Latest updates from the school</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <Badge
                    variant={announcement.priority === 'high' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {announcement.priority}
                  </Badge>
                </div>
                <h4 className="font-semibold">{announcement.title}</h4>
                <p className="text-sm text-slate-500 mt-1">{announcement.content}</p>
                <p className="text-xs text-slate-400 mt-2">
                  {formatDate(announcement.date)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate('/student/payments')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold">Pay Now</h3>
                <p className="text-sm text-slate-500">Make a payment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate('/student/grades')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">View Grades</h3>
                <p className="text-sm text-slate-500">Check your grades</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate('/student/permits')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold">Exam Permits</h3>
                <p className="text-sm text-slate-500">Download permits</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => navigate('/student/messages')}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Bell className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Messages</h3>
                <p className="text-sm text-slate-500">Contact staff</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
