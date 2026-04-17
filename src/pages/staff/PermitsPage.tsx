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
import { Search, FileCheck, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const mockPermits = [
  { id: '2024-001', name: 'Alipio, Juan', targetExam: 'Midterms', paymentClear: true, status: 'Eligible' },
  { id: '2024-002', name: 'Santos, Maria', targetExam: 'Midterms', paymentClear: false, status: 'Not Eligible (Missing Prelims Payment)' },
  { id: '2024-005', name: 'Reyes, Jose', targetExam: 'Finals', paymentClear: false, status: 'Not Eligible (Missing Midterms Payment)' },
];

export function PermitsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockPermits.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Exam Permit Validation
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Validate student exam eligibility based on payment logic
          </p>
        </div>
      </div>

      <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <p className="font-semibold mb-1">Validation Rules Engine:</p>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li>Enrollment must be paid to take <b>Prelims</b></li>
              <li>Prelims must be paid to take <b>Midterms</b></li>
              <li>Midterms must be paid to take <b>Finals</b></li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input 
          placeholder="Search student to validate..." 
          className="pl-9"
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
              <TableHead>Target Exam</TableHead>
              <TableHead>Payment Cleared?</TableHead>
              <TableHead>System Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((permit) => (
              <TableRow key={permit.id}>
                <TableCell className="font-medium">{permit.id}</TableCell>
                <TableCell>{permit.name}</TableCell>
                <TableCell>{permit.targetExam}</TableCell>
                <TableCell>
                  {permit.paymentClear ? (
                    <div className="flex items-center gap-1.5 text-green-600 font-medium">
                      <CheckCircle2 className="h-4 w-4" /> Yes
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-red-600 font-medium">
                      <XCircle className="h-4 w-4" /> No
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="outline"
                    className={
                      permit.paymentClear 
                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20'
                        : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20'
                    }
                  >
                    {permit.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant={permit.paymentClear ? 'default' : 'secondary'} 
                    size="sm"
                    disabled={!permit.paymentClear}
                    className={permit.paymentClear ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    {permit.paymentClear ? 'Generate Permit' : 'Locked'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
