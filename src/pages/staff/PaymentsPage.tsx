import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Search, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const mockPaymentStudents = [
  { id: '2024-001', name: 'Alipio, Juan', term: 'Prelims', status: 'Paid', balance: '₱0.00' },
  { id: '2024-002', name: 'Santos, Maria', term: 'Prelims', status: 'Unpaid', balance: '₱4,500.00' },
  { id: '2024-005', name: 'Reyes, Jose', term: 'Enrollment', status: 'Partial', balance: '₱2,000.00' },
];

export function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockPaymentStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Payment Status
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            View-only access for students in Main Campus
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-slate-50 dark:bg-slate-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" /> Fully Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold block mb-1">125 Students</div>
            <span className="text-xs text-slate-500">Cleared for current term</span>
          </CardContent>
        </Card>
        <Card className="bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-500 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Unpaid / With Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 block mb-1">42 Students</div>
            <span className="text-xs text-red-500/80">Pending payment for clearance</span>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search student to check status..." 
          className="pl-9 max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Current Term</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.term}</TableCell>
                <TableCell className={student.balance !== '₱0.00' ? 'text-red-500 font-medium' : ''}>
                  {student.balance}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={
                      student.status === 'Paid' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                        : student.status === 'Partial'
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30'
                    }
                  >
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" disabled>
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <p className="text-xs text-slate-500 flex items-center justify-center gap-2 py-4">
        <AlertTriangle className="h-3 w-3" />
        Note: Staff roles cannot approve payments. Please direct students to the Cashier/Admin.
      </p>
    </div>
  );
}
