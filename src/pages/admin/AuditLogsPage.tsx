import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ClipboardList,
  Search,
  ShieldCheck,
  LogIn,
  UserPlus,
  FileEdit,
  CreditCard,
  Trash2,
  Eye,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock audit log data
const mockAuditLogs = [
  { id: 1, user: 'Admin User', role: 'Admin', action: 'Approved payment', target: 'Alipio, Juan (TXN-10023)', icon: 'CreditCard', timestamp: '2024-10-15 10:30:22 AM', ip: '192.168.1.101' },
  { id: 2, user: 'Prof. Cruz', role: 'Staff', action: 'Submitted grades', target: 'Section BSIT-1A, CC225', icon: 'FileEdit', timestamp: '2024-10-15 09:45:12 AM', ip: '192.168.1.55' },
  { id: 3, user: 'Admin User', role: 'Admin', action: 'Added new staff', target: 'Prof. Villanueva (STF-006)', icon: 'UserPlus', timestamp: '2024-10-14 04:20:00 PM', ip: '192.168.1.101' },
  { id: 4, user: 'Admin User', role: 'Admin', action: 'Deleted student record', target: 'Doe, John (2024-099)', icon: 'Trash2', timestamp: '2024-10-14 02:10:05 PM', ip: '192.168.1.101' },
  { id: 5, user: 'Prof. Santos', role: 'Staff', action: 'Generated exam permit', target: 'Section BSIT-2A (Batch)', icon: 'ShieldCheck', timestamp: '2024-10-14 11:00:50 AM', ip: '192.168.1.78' },
  { id: 6, user: 'Santos, Maria', role: 'Student', action: 'Uploaded payment proof', target: 'Midterms - GCash', icon: 'CreditCard', timestamp: '2024-10-13 03:15:33 PM', ip: '10.0.0.42' },
  { id: 7, user: 'Admin User', role: 'Admin', action: 'Changed branch settings', target: 'North Branch - Tuition Updated', icon: 'FileEdit', timestamp: '2024-10-13 01:05:00 PM', ip: '192.168.1.101' },
];

const mockLoginHistory = [
  { id: 1, user: 'Admin User', role: 'Admin', loginTime: '2024-10-15 08:00:01 AM', logoutTime: '2024-10-15 05:30:00 PM', ip: '192.168.1.101', status: 'Success' },
  { id: 2, user: 'Prof. Cruz', role: 'Staff', loginTime: '2024-10-15 07:45:22 AM', logoutTime: '2024-10-15 04:00:00 PM', ip: '192.168.1.55', status: 'Success' },
  { id: 3, user: 'Unknown', role: '-', loginTime: '2024-10-15 03:21:10 AM', logoutTime: '-', ip: '203.177.88.12', status: 'Failed' },
  { id: 4, user: 'Santos, Maria', role: 'Student', loginTime: '2024-10-14 09:00:00 AM', logoutTime: '2024-10-14 11:30:00 AM', ip: '10.0.0.42', status: 'Success' },
  { id: 5, user: 'Unknown', role: '-', loginTime: '2024-10-14 01:15:44 AM', logoutTime: '-', ip: '45.33.12.99', status: 'Failed' },
];

const iconMap: Record<string, React.ElementType> = {
  CreditCard,
  FileEdit,
  UserPlus,
  Trash2,
  ShieldCheck,
  Eye,
  LogIn,
};

export function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || log.role.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredLogins = mockLoginHistory.filter(log => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm);
    const matchesRole =
      roleFilter === 'all' ||
      (roleFilter === 'failed' ? log.status === 'Failed' : log.role.toLowerCase() === roleFilter);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Audit Logs
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          Track every action performed in the system — who did what, and when
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600"><ClipboardList className="h-6 w-6" /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Actions</p>
              <p className="text-2xl font-bold">{mockAuditLogs.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600"><LogIn className="h-6 w-6" /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Successful Logins</p>
              <p className="text-2xl font-bold text-green-600">{mockLoginHistory.filter(l => l.status === 'Success').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600"><ShieldCheck className="h-6 w-6" /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Failed Attempts</p>
              <p className="text-2xl font-bold text-red-600">{mockLoginHistory.filter(l => l.status === 'Failed').length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search user, action, or target..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Filter by role" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="staff">Staff</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="failed">Failed Logins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="actions" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="actions">Action Logs</TabsTrigger>
          <TabsTrigger value="logins">Login History</TabsTrigger>
        </TabsList>

        <TabsContent value="actions">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-950">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50 dark:bg-slate-900/50">
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target / Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>IP Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => {
                    const Icon = iconMap[log.icon] || ClipboardList;
                    return (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-slate-100 text-slate-600 dark:bg-slate-800 text-xs">{log.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm text-slate-900 dark:text-white">{log.user}</p>
                              <Badge variant="outline" className="text-[9px] h-4 px-1 py-0">{log.role}</Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-slate-400" />
                            <span className="font-medium text-sm">{log.action}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 dark:text-slate-400 max-w-[200px] truncate">{log.target}</TableCell>
                        <TableCell className="text-xs text-slate-500 whitespace-nowrap">{log.timestamp}</TableCell>
                        <TableCell className="font-mono text-xs text-slate-400">{log.ip}</TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredLogs.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-500">No audit records match your filters.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="logins">
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-950">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50 dark:bg-slate-900/50">
                    <TableHead>User</TableHead>
                    <TableHead>Login Time</TableHead>
                    <TableHead>Logout Time</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogins.map((log) => (
                    <TableRow key={log.id} className={log.status === 'Failed' ? 'bg-red-50/50 dark:bg-red-900/5' : ''}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={`text-xs ${log.status === 'Failed' ? 'bg-red-100 text-red-600 dark:bg-red-900/30' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'}`}>
                              {log.user.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{log.user}</p>
                            <Badge variant="outline" className="text-[9px] h-4 px-1 py-0">{log.role}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-slate-500 whitespace-nowrap">{log.loginTime}</TableCell>
                      <TableCell className="text-xs text-slate-500 whitespace-nowrap">{log.logoutTime}</TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">{log.ip}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className={
                          log.status === 'Success'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }>
                          {log.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredLogins.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-500">No login records match your filters.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
