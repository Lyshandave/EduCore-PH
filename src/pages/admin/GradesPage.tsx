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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  GraduationCap,
  Search,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  Eye,
  MoreVertical,
  FileText,
  ShieldCheck,
  Award,
  AlertTriangle,
} from 'lucide-react';
import { useUIStore } from '@/stores';

// Mock grade data
const initialGradeRecords = [
  { id: '2024-001', name: 'Alipio, Juan C.', branch: 'Main Campus', section: 'BSIT-1A', subject: 'CC225', midterms: 92, finals: 95, finalGrade: 1.25, status: 'Approved', submittedBy: 'Prof. Cruz' },
  { id: '2024-002', name: 'Santos, Maria B.', branch: 'Main Campus', section: 'BSIT-1A', subject: 'CC225', midterms: 88, finals: 85, finalGrade: 1.5, status: 'Pending Approval', submittedBy: 'Prof. Cruz' },
  { id: '2024-003', name: 'Reyes, Jose P.', branch: 'North Branch', section: 'BSIT-2A', subject: 'IT103', midterms: 72, finals: 68, finalGrade: 2.75, status: 'Approved', submittedBy: 'Prof. Villanueva' },
  { id: '2024-004', name: 'Dela Cruz, Ana M.', branch: 'South Campus', section: 'BSCS-1B', subject: 'CC101', midterms: 60, finals: 55, finalGrade: 5.0, status: 'Pending Approval', submittedBy: 'Prof. Gonzales' },
  { id: '2024-005', name: 'Garcia, Pedro L.', branch: 'Main Campus', section: 'BSIT-1A', subject: 'CC225', midterms: 95, finals: 98, finalGrade: 1.0, status: 'Approved', submittedBy: 'Prof. Cruz' },
];

export function GradesPage() {
  const { addToast } = useUIStore();
  const [grades, setGrades] = useState(initialGradeRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [sectionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof initialGradeRecords[0] | null>(null);

  const filtered = grades.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchTerm.toLowerCase()) || g.id.includes(searchTerm);
    const matchesBranch = branchFilter === 'all' || g.branch === branchFilter;
    const matchesSection = sectionFilter === 'all' || g.section === sectionFilter;
    const matchesStatus = statusFilter === 'all' || g.status === statusFilter;
    return matchesSearch && matchesBranch && matchesSection && matchesStatus;
  });

  const handleApprove = (id: string, subject: string) => {
    setGrades(grades.map(g => (g.id === id && g.subject === subject) ? { ...g, status: 'Approved' } : g));
    addToast({ type: 'success', title: 'Grade Approved', message: 'The student grade has been officially recorded.' });
  };

  const handleReject = (id: string, subject: string) => {
    setGrades(grades.map(g => (g.id === id && g.subject === subject) ? { ...g, status: 'Rejected' } : g));
    addToast({ type: 'warning', title: 'Grade Rejected', message: 'The submission has been sent back for correction.' });
  };

  const topStudents = [...grades].sort((a, b) => a.finalGrade - b.finalGrade).slice(0, 3);
  const failedStudents = grades.filter(g => g.finalGrade >= 5.0);
  const pendingApproval = grades.filter(g => g.status === 'Pending Approval');

  const getGradeColor = (grade: number) => {
    if (grade <= 1.5) return 'text-green-600 dark:text-green-400';
    if (grade <= 2.5) return 'text-blue-600 dark:text-blue-400';
    if (grade < 5.0) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grades Management</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <GraduationCap className="h-4 w-4" /> View, approve, and analyze grades
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-green-50 text-green-700 border-green-200"><FileSpreadsheet className="mr-2 h-4 w-4" /> Export CSV</Button>
          <Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Transcripts</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-emerald-600 text-white"><CardContent className="p-5 flex justify-between"><div><p className="text-xs">Top Students</p><p className="text-2xl font-bold">{topStudents.length}</p></div><Award size={32} opacity={0.5}/></CardContent></Card>
        <Card className="bg-rose-600 text-white"><CardContent className="p-5 flex justify-between"><div><p className="text-xs">Failed</p><p className="text-2xl font-bold">{failedStudents.length}</p></div><AlertTriangle size={32} opacity={0.5}/></CardContent></Card>
        <Card className="bg-orange-600 text-white"><CardContent className="p-5 flex justify-between"><div><p className="text-xs">Pending</p><p className="text-2xl font-bold">{pendingApproval.length}</p></div><ShieldCheck size={32} opacity={0.5}/></CardContent></Card>
        <Card className="bg-blue-600 text-white"><CardContent className="p-5 flex justify-between"><div><p className="text-xs">Total Records</p><p className="text-2xl font-bold">{grades.length}</p></div><GraduationCap size={32} opacity={0.5}/></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search student..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Branch" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Branches</SelectItem>
            <SelectItem value="Commonwealth">AICS Commonwealth</SelectItem>
            <SelectItem value="Montalban">AICS Montalban</SelectItem>
            <SelectItem value="Taytay">AICS Taytay</SelectItem>
            <SelectItem value="Tanay">AICS Tanay</SelectItem>
            <SelectItem value="Meycauayan">AICS Meycauayan</SelectItem>
            <SelectItem value="Tarlac">AICS Tarlac</SelectItem>
            <SelectItem value="Bacoor">AICS Bacoor</SelectItem>
            <SelectItem value="Batangas">AICS Batangas</SelectItem>
            <SelectItem value="Bicutan">AICS Bicutan</SelectItem>
            <SelectItem value="GMA">AICS GMA</SelectItem>
            <SelectItem value="Lipa">AICS Lipa</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Pending Approval">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="text-center">Mid</TableHead>
              <TableHead className="text-center">Fin</TableHead>
              <TableHead className="text-center">Grade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((record) => (
              <TableRow key={record.id + record.subject}>
                <TableCell><p className="font-medium text-sm">{record.name}</p><p className="text-[10px] text-slate-500">{record.id}</p></TableCell>
                <TableCell className="text-xs">{record.branch}</TableCell>
                <TableCell className="font-mono text-xs">{record.subject}</TableCell>
                <TableCell className="text-center text-sm">{record.midterms}</TableCell>
                <TableCell className="text-center text-sm">{record.finals}</TableCell>
                <TableCell className={`text-center font-bold ${getGradeColor(record.finalGrade)}`}>{record.finalGrade.toFixed(2)}</TableCell>
                <TableCell><Badge variant="secondary" className={record.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-amber-100'}>{record.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical size={16}/></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setSelectedStudent(record); setViewDialogOpen(true); }}><Eye className="mr-2 h-4 w-4" /> Details</DropdownMenuItem>
                      {record.status === 'Pending Approval' && (
                        <>
                          <DropdownMenuItem className="text-green-600" onClick={() => handleApprove(record.id, record.subject)}><CheckCircle2 className="mr-2 h-4 w-4" /> Approve</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleReject(record.id, record.subject)}><XCircle className="mr-2 h-4 w-4" /> Reject</DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Grade Breakdown</DialogTitle></DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-slate-500">Name</span><p className="font-bold">{selectedStudent.name}</p></div>
                <div><span className="text-slate-500">ID</span><p className="font-bold">{selectedStudent.id}</p></div>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg flex justify-around text-center border">
                <div><p className="text-xs text-slate-500">Midterms</p><p className="text-xl font-bold">{selectedStudent.midterms}</p></div>
                <div><p className="text-xs text-slate-500">Finals</p><p className="text-xl font-bold">{selectedStudent.finals}</p></div>
                <div><p className="text-xs text-slate-500">GPA</p><p className="text-xl font-bold text-blue-600">{selectedStudent.finalGrade.toFixed(2)}</p></div>
              </div>
            </div>
          )}
          <DialogFooter><Button onClick={() => setViewDialogOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
