import { useState, useEffect } from 'react';
import { useStudentStore, useUIStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import {
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Download,
  Upload,
  Eye,
  Trash2,
  Loader2,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  pending: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  locked: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

const paymentStatusColors: Record<string, string> = {
  paid: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  partial: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  unpaid: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  overdue: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

export function StudentsPage() {
  const {
    students,
    isLoading,
    fetchStudents,
    createStudent,
    bulkApproveStudents,
    bulkRejectStudents,
    setSelectedStudent,
  } = useStudentStore();
  const { addToast } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [showBulkActionDialog, setShowBulkActionDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<'approve' | 'reject' | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPaymentStatus] = useState<string>('all');
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    courseId: 'BSIT',
    yearLevel: '1st',
    branchId: 'Main Campus'
  });

  useEffect(() => {
    fetchStudents();
  }, []);


  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(students.map((s) => s.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents([...selectedStudents, studentId]);
    } else {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    }
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedStudents.length === 0) return;
    let result;
    if (bulkAction === 'approve') {
      result = await bulkApproveStudents(selectedStudents);
    } else {
      result = await bulkRejectStudents(selectedStudents);
    }
    if (result.success) {
      addToast({
        type: 'success',
        title: `Bulk ${bulkAction} successful`,
        message: `${result.succeeded} students processed`,
      });
    }
    setSelectedStudents([]);
    setShowBulkActionDialog(false);
    setBulkAction(null);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStudent({ ...newStudentData, status: 'active' });
      addToast({ type: 'success', title: 'Student Added', message: 'The student has been successfully added.' });
      setShowAddDialog(false);
      setNewStudentData({ firstName: '', lastName: '', email: '', studentId: '', courseId: 'BSIT', yearLevel: '1st', branchId: 'Main Campus' });
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to add student.' });
    }
  };

  const filteredStudents = students.filter((student) => {
    const search = searchQuery.toLowerCase();
    const matchesSearch = 
      student.firstName.toLowerCase().includes(search) ||
      student.lastName.toLowerCase().includes(search) ||
      student.studentId.toLowerCase().includes(search) ||
      student.email.toLowerCase().includes(search);
    
    if (!matchesSearch) return false;
    if (filterStatus !== 'all' && student.status !== filterStatus) return false;
    if (filterPaymentStatus !== 'all' && student.paymentStatus !== filterPaymentStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Students</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage student records and enrollments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export</Button>
          <Button variant="outline"><Upload className="mr-2 h-4 w-4" /> Import</Button>
          <Button onClick={() => setShowAddDialog(true)}><UserPlus className="mr-2 h-4 w-4" /> Add Student</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Total Students</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{students.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-emerald-600">{students.filter(s => s.status === 'active').length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Pending</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-amber-600">{students.filter(s => s.enrollmentStatus === 'pending').length || 0}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">With Balance</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{students.filter(s => s.totalBalance > 0).length}</div></CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Search students..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="pending">Pending</SelectItem></SelectContent>
        </Select>
      </div>

      {selectedStudents.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <span className="text-sm font-medium">{selectedStudents.length} selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => { setBulkAction('approve'); setShowBulkActionDialog(true); }}>Approve</Button>
            <Button size="sm" variant="outline" onClick={() => { setBulkAction('reject'); setShowBulkActionDialog(true); }}>Reject</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><Checkbox checked={selectedStudents.length === students.length && students.length > 0} onCheckedChange={handleSelectAll} /></TableHead>
              <TableHead>Student</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Course/Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></TableCell></TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-slate-500">No students found</TableCell></TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell><Checkbox checked={selectedStudents.includes(student.id)} onCheckedChange={(checked) => handleSelectStudent(student.id, checked as boolean)} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.id}`} alt={student.firstName} className="h-10 w-10 rounded-full" />
                      <div><p className="font-medium">{student.firstName} {student.lastName}</p><p className="text-sm text-slate-500">{student.email}</p></div>
                    </div>
                  </TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell><div className="flex flex-col"><span className="text-sm">{student.courseId}</span><span className="text-xs text-slate-500">{student.yearLevel}</span></div></TableCell>
                  <TableCell><Badge variant="secondary" className={statusColors[student.status] || ''}>{student.status}</Badge></TableCell>
                  <TableCell><Badge variant="secondary" className={paymentStatusColors[student.paymentStatus] || ''}>{student.paymentStatus}</Badge></TableCell>
                  <TableCell><span className={student.totalBalance > 0 ? 'text-red-600 font-medium' : ''}>{formatCurrency(student.totalBalance)}</span></TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedStudent(student)}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Student Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Add New Student</DialogTitle><DialogDescription>Create a new student record manually.</DialogDescription></DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>First Name</Label><Input value={newStudentData.firstName} onChange={e => setNewStudentData({...newStudentData, firstName: e.target.value})} required /></div>
              <div className="space-y-2"><Label>Last Name</Label><Input value={newStudentData.lastName} onChange={e => setNewStudentData({...newStudentData, lastName: e.target.value})} required /></div>
            </div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={newStudentData.email} onChange={e => setNewStudentData({...newStudentData, email: e.target.value})} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Student ID</Label><Input value={newStudentData.studentId} onChange={e => setNewStudentData({...newStudentData, studentId: e.target.value})} required /></div>
              <div className="space-y-2"><Label>Branch</Label><Select value={newStudentData.branchId} onValueChange={v => setNewStudentData({...newStudentData, branchId: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
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
              </SelectContent></Select></div>
            </div>
            <DialogFooter className="pt-4"><Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button><Button type="submit">Create Student</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={showBulkActionDialog} onOpenChange={setShowBulkActionDialog}>
        <DialogContent><DialogHeader><DialogTitle>{bulkAction === 'approve' ? 'Approve' : 'Reject'} Students</DialogTitle></DialogHeader><DialogFooter><Button onClick={handleBulkAction}>Confirm</Button></DialogFooter></DialogContent>
      </Dialog>
    </div>
  );
}
