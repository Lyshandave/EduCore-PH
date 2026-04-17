import { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Search, 
  MapPin, 
  CheckCircle, 
  Loader2,
  UserPlus
} from 'lucide-react';
import { useStudentStore, useUIStore } from '@/stores';

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  pending: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
};

export function StudentsPage() {
  const { 
    students, 
    isLoading, 
    fetchStudents, 
    createStudent,
    bulkApproveStudents, 
    setSelectedStudent 
  } = useStudentStore();
  const { addToast } = useUIStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: '',
    courseId: 'BSIT',
    yearLevel: '1st',
    branchId: 'Main Campus' // Simulate current staff branch
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      (student.firstName + ' ' + student.lastName).toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = yearFilter === 'all' || student.yearLevel === yearFilter;
    return matchesSearch && matchesYear;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedStudents(filteredStudents.map(s => s.id));
    else setSelectedStudents([]);
  };

  const handleSelectStudent = (id: string, checked: boolean) => {
    if (checked) setSelectedStudents([...selectedStudents, id]);
    else setSelectedStudents(selectedStudents.filter(sId => sId !== id));
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    await bulkApproveStudents(selectedStudents);
    addToast({ type: 'success', title: 'Action Successful', message: 'Selected students have been approved.' });
    setSelectedStudents([]);
    setIsProcessing(false);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      await createStudent({ ...newStudent, status: 'active' });
      addToast({ type: 'success', title: 'Student Created', message: 'The student has been added to your branch records.' });
      setShowAddDialog(false);
      setNewStudent({ firstName: '', lastName: '', email: '', studentId: '', courseId: 'BSIT', yearLevel: '1st', branchId: 'Main Campus' });
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to create student.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branch Students</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2"><MapPin size={16} /> Main Campus Records</p>
        </div>
        <div className="flex gap-2">
          {selectedStudents.length > 0 && (
            <Button size="sm" onClick={handleApprove} disabled={isProcessing} className="bg-emerald-600">
              <CheckCircle size={16} className="mr-2" /> Approve ({selectedStudents.length})
            </Button>
          )}
          <Button size="sm" onClick={() => setShowAddDialog(true)}>
            <UserPlus size={16} className="mr-2" /> Add Student
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search students..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><Checkbox checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0} onCheckedChange={handleSelectAll} /></TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Course/Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="py-10 text-center"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
            ) : filteredStudents.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="py-10 text-center text-slate-500">No students found.</TableCell></TableRow>
            ) : (
              filteredStudents.map(student => (
                <TableRow key={student.id}>
                  <TableCell><Checkbox checked={selectedStudents.includes(student.id)} onCheckedChange={checked => handleSelectStudent(student.id, checked as boolean)} /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div><p className="text-sm font-semibold">{student.firstName} {student.lastName}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{student.studentId}</TableCell>
                  <TableCell><p className="text-xs font-semibold">{student.courseId}</p><p className="text-[10px] text-slate-500">{student.yearLevel}</p></TableCell>
                  <TableCell><Badge variant="secondary" className={statusColors[student.status] || ''}>{student.status}</Badge></TableCell>
                  <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student)}>Detail</Button></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Quick Register</DialogTitle><DialogDescription>Add a student directly to this branch.</DialogDescription></DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1"><Label>First Name</Label><Input value={newStudent.firstName} onChange={e => setNewStudent({...newStudent, firstName: e.target.value})} required /></div>
              <div className="space-y-1"><Label>Last Name</Label><Input value={newStudent.lastName} onChange={e => setNewStudent({...newStudent, lastName: e.target.value})} required /></div>
            </div>
            <div className="space-y-1"><Label>Email</Label><Input type="email" value={newStudent.email} onChange={e => setNewStudent({...newStudent, email: e.target.value})} required /></div>
            <div className="space-y-1"><Label>Student ID</Label><Input value={newStudent.studentId} onChange={e => setNewStudent({...newStudent, studentId: e.target.value})} required /></div>
            <DialogFooter><Button type="submit" disabled={isProcessing}>{isProcessing ? <Loader2 className="animate-spin" /> : 'Add Student'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
