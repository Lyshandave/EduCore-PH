import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardStore, useAuthStore } from '@/stores';
import { StatCard, ChartCard, RecentActivity, TasksWidget } from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  CreditCard,
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { formatCurrency, formatNumber } from '@/lib/utils';

// Chart colors
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { stats, fetchDashboardStats } = useDashboardStore();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Mock activities
  const activities = [
    {
      id: '1',
      type: 'enrollment' as const,
      title: 'New Student Enrollment',
      description: 'Juan Dela Cruz enrolled in BSIT - 1st Year',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      type: 'payment' as const,
      title: 'Payment Verified',
      description: '₱25,000 payment verified for OR-2024-0001',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: '3',
      type: 'grade' as const,
      title: 'Grades Submitted',
      description: 'Prelims grades submitted for IT101',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
    },
    {
      id: '4',
      type: 'permit' as const,
      title: 'Exam Permits Generated',
      description: '200 exam permits generated for Prelims',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: '5',
      type: 'alert' as const,
      title: 'Payment Overdue',
      description: '15 students have overdue payments',
      timestamp: new Date(Date.now() - 18000000).toISOString(),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back, {user?.firstName}! Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/students')}>
            <Users className="mr-2 h-4 w-4" />
            View Students
          </Button>

        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Students"
          value={formatNumber(stats.totalStudents)}
          description={`+${formatNumber(stats.newStudents)} new this year`}
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
          variant="primary"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          description="For current academic year"
          icon={CreditCard}
          trend={{ value: 8.2, isPositive: true }}
          variant="success"
        />
        <StatCard
          title="Pending Payments"
          value={formatCurrency(stats.pendingPayments)}
          description="Verification needed"
          icon={AlertCircle}
          variant="danger"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="branches">Branches</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Enrollment Trend"
              description="Student enrollments over time"
            >
              <div className="h-[300px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.enrollmentTrend} margin={{ left: 10, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis width={45} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Payment Collection"
              description="Revenue by month"
            >
              <div className="h-[300px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.paymentTrend} margin={{ left: 16, right: 10, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis
                      width={68}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(value: number) => {
                        if (value >= 1_000_000) return `₱${(value / 1_000_000).toFixed(1)}M`;
                        if (value >= 1_000) return `₱${(value / 1_000).toFixed(0)}K`;
                        return `₱${value}`;
                      }}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* Bottom Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            <RecentActivity activities={activities} className="lg:col-span-2" />
            <TasksWidget />
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Payment Distribution"
              description="Breakdown by payment term"
            >
              <div className="h-[300px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Prelims', value: stats.prelimsCollection },
                        { name: 'Midterms', value: stats.midtermsCollection },
                        { name: 'Finals', value: stats.finalsCollection },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[stats.prelimsCollection, stats.midtermsCollection, stats.finalsCollection].map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard
              title="Student Status"
              description="Current enrollment status"
            >
              <div className="h-[300px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Enrolled', value: stats.totalEnrollments },
                        { name: 'Pending', value: stats.pendingEnrollments },
                        { name: 'Dropped', value: stats.droppedStudents },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        stats.totalEnrollments,
                        stats.pendingEnrollments,
                        stats.droppedStudents,
                      ].map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="branches" className="space-y-6">
          <ChartCard
            title="Branch Comparison"
            description="Performance across all branches"
          >
            <div className="h-[400px] p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.branchStats} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
                  <XAxis type="number" />
                  <YAxis dataKey="branchName" type="category" width={100} />
                  <Tooltip
                    formatter={(value: number, name: string) => {
                      if (name === 'revenue') return formatCurrency(value);
                      return formatNumber(value);
                    }}
                  />
                  <Legend />
                  <Bar dataKey="studentCount" name="Students" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          {/* Branch Stats Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-500">Branch</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-500">Students</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-500">Revenue</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-500">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {stats.branchStats.map((branch) => (
                  <tr key={branch.branchId} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-4 py-3 text-sm font-medium">{branch.branchName}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatNumber(branch.studentCount)}</td>
                    <td className="px-4 py-3 text-sm text-right">{formatCurrency(branch.revenue)}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      <Badge variant={branch.pendingPayments > 5000000 ? 'destructive' : 'secondary'}>
                        {formatCurrency(branch.pendingPayments)}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
