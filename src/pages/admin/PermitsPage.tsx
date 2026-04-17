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
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileCheck,
  Search,
  Download,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Lock,
  Unlock,
} from 'lucide-react';

// Mock permit data
const mockPermitData = [
  { id: '2024-001', name: 'Alipio, Juan C.', branch: 'Main Campus', section: 'BSIT-1A', targetExam: 'Midterms', enrollmentPaid: true, prelimsPaid: true, midtermsPaid: false, finalsPaid: false, eligible: true },
  { id: '2024-002', name: 'Santos, Maria B.', branch: 'Main Campus', section: 'BSIT-1A', targetExam: 'Midterms', enrollmentPaid: true, prelimsPaid: false, midtermsPaid: false, finalsPaid: false, eligible: false },
  { id: '2024-003', name: 'Reyes, Jose P.', branch: 'North Branch', section: 'BSIT-2A', targetExam: 'Finals', enrollmentPaid: true, prelimsPaid: true, midtermsPaid: true, finalsPaid: false, eligible: true },
  { id: '2024-004', name: 'Dela Cruz, Ana M.', branch: 'South Campus', section: 'BSCS-1B', targetExam: 'Prelims', enrollmentPaid: false, prelimsPaid: false, midtermsPaid: false, finalsPaid: false, eligible: false },
  { id: '2024-005', name: 'Garcia, Pedro L.', branch: 'Main Campus', section: 'BSIT-1A', targetExam: 'Midterms', enrollmentPaid: true, prelimsPaid: true, midtermsPaid: false, finalsPaid: false, eligible: true },
];

export function PermitsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [sectionFilter, setSectionFilter] = useState('all');

  const filtered = mockPermitData.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.includes(searchTerm);
    const matchesBranch = branchFilter === 'all' || p.branch === branchFilter;
    const matchesSection = sectionFilter === 'all' || p.section === sectionFilter;
    return matchesSearch && matchesBranch && matchesSection;
  });

  const eligibleCount = mockPermitData.filter(p => p.eligible).length;
  const blockedCount = mockPermitData.filter(p => !p.eligible).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Exam Permits
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Validate payment clearance and generate exam permits across all branches
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20">
          <Download className="mr-2 h-4 w-4" />
          Batch Generate (Per Section)
        </Button>
      </div>

      {/* Rules Card */}
      <Card className="bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <p className="font-semibold mb-1">Permit Generation Rules (Sequential Clearance):</p>
            <ul className="list-disc list-inside space-y-1 ml-1 opacity-90">
              <li><strong>Enrollment</strong> must be paid → to take <strong>Prelims</strong></li>
              <li><strong>Prelims</strong> must be paid → to take <strong>Midterms</strong></li>
              <li><strong>Midterms</strong> must be paid → to take <strong>Finals</strong></li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600"><Users className="h-6 w-6" /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Total Students</p>
              <p className="text-2xl font-bold">{mockPermitData.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600"><Unlock className="h-6 w-6" /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Eligible</p>
              <p className="text-2xl font-bold text-green-600">{eligibleCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600"><Lock className="h-6 w-6" /></div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Blocked (Unpaid)</p>
              <p className="text-2xl font-bold text-red-600">{blockedCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search student name or ID..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Branch" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            <SelectItem value="Main Campus">Main Campus</SelectItem>
            <SelectItem value="North Branch">North Branch</SelectItem>
            <SelectItem value="South Campus">South Campus</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sectionFilter} onValueChange={setSectionFilter}>
          <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Section" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sections</SelectItem>
            <SelectItem value="BSIT-1A">BSIT-1A</SelectItem>
            <SelectItem value="BSIT-2A">BSIT-2A</SelectItem>
            <SelectItem value="BSCS-1B">BSCS-1B</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-950">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50 dark:bg-slate-900/50">
                <TableHead>Student</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Target Exam</TableHead>
                <TableHead className="text-center">Enrollment</TableHead>
                <TableHead className="text-center">Prelims</TableHead>
                <TableHead className="text-center">Midterms</TableHead>
                <TableHead className="text-center">Finals</TableHead>
                <TableHead className="text-center">Eligibility</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{record.name}</p>
                      <p className="text-xs text-slate-500">{record.id}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{record.branch}</TableCell>
                  <TableCell><Badge variant="outline" className="font-normal">{record.section}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/30">{record.targetExam}</Badge></TableCell>
                  <TableCell className="text-center">
                    {record.enrollmentPaid ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.prelimsPaid ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.midtermsPaid ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.finalsPaid ? <CheckCircle2 className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-400 mx-auto" />}
                  </TableCell>
                  <TableCell className="text-center">
                    {record.eligible ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30"><Unlock className="w-3 h-3 mr-1" />Eligible</Badge>
                    ) : (
                      <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20"><Lock className="w-3 h-3 mr-1" />Blocked</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      disabled={!record.eligible}
                      className={record.eligible ? 'bg-blue-600 hover:bg-blue-700' : ''}
                      variant={record.eligible ? 'default' : 'secondary'}
                    >
                      {record.eligible ? <><Download className="h-3.5 w-3.5 mr-1.5" />Generate</> : <><Lock className="h-3.5 w-3.5 mr-1.5" />Locked</>}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={10} className="text-center py-12 text-slate-500">No students match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
