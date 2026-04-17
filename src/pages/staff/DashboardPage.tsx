import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore, useAuthStore } from '@/stores';
import { StatCard, ChartCard } from '@/components/dashboard';
import { Card, CardContent } from '@/components/ui/card';
import {
  CreditCard,
  GraduationCap,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
// import { formatCurrency, formatNumber } from '@/lib/utils';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { fetchDashboardStats } = useDashboardStore();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Mock data for staff dashboard
  const staffStats = {
    pendingPayments: 15,
    pendingGrades: 8,
    pendingPermits: 200,
    messages: 5,
  };

  const weeklyTasks = [
    { day: 'Mon', completed: 12, pending: 3 },
    { day: 'Tue', completed: 15, pending: 2 },
    { day: 'Wed', completed: 10, pending: 5 },
    { day: 'Thu', completed: 18, pending: 1 },
    { day: 'Fri', completed: 14, pending: 4 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Staff Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user?.firstName}! Here's your work summary.
          </p>
        </div>
        <div className="flex items-center gap-2">

        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Payments"
          value={staffStats.pendingPayments}
          description="Awaiting verification"
          icon={CreditCard}
          variant="warning"
        />
        <StatCard
          title="Pending Grades"
          value={staffStats.pendingGrades}
          description="From instructors"
          icon={GraduationCap}
          variant="primary"
        />
        <StatCard
          title="Permits to Generate"
          value={staffStats.pendingPermits}
          description="For upcoming exams"
          icon={FileCheck}
          variant="success"
        />
        <StatCard
          title="New Messages"
          value={staffStats.messages}
          description="From students"
          icon={AlertCircle}
          variant="danger"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Workload Chart */}
        <ChartCard
          title="Weekly Workload"
          description="Tasks completed vs pending"
          className="lg:col-span-3"
        >
          <div className="h-[240px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyTasks}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/staff/payments')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Quick Action</p>
                <h3 className="text-lg font-semibold mt-1">Verify Payments</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {staffStats.pendingPayments} pending verifications
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/staff/grades')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Quick Action</p>
                <h3 className="text-lg font-semibold mt-1">Process Grades</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {staffStats.pendingGrades} pending submissions
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/staff/permits')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Quick Action</p>
                <h3 className="text-lg font-semibold mt-1">Generate Permits</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {staffStats.pendingPermits} permits to generate
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
