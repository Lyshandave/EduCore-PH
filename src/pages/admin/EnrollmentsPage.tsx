import { useState, useEffect } from 'react';
import { useStudentStore, useUIStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, CheckCircle, XCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function EnrollmentsPage() {
  const { students, isLoading, fetchStudents, bulkApproveStudents, bulkRejectStudents } = useStudentStore();
  const { addToast } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const pendingEnrollments = students.filter(s => s.enrollmentStatus === 'pending');
  
  const filteredEnrollments = pendingEnrollments.filter(s => 
    s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = async (id: string) => {
    const result = await bulkApproveStudents([id]);
    if (result.success) {
      addToast({ type: 'success', title: 'Enrollment Approved', message: 'The student has been successfully enrolled.' });
    }
  };

  const handleReject = async (id: string) => {
    const result = await bulkRejectStudents([id]);
    if (result.success) {
      addToast({ type: 'success', title: 'Enrollment Rejected', message: 'The enrollment request has been denied.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enrollment Requests</h1>
          <p className="text-slate-500">Review and approve new student registrations.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingEnrollments.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search pending enrollments..." 
            className="pl-9"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                </TableCell>
              </TableRow>
            ) : filteredEnrollments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                  No pending enrollments found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEnrollments.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="font-medium">{student.firstName} {student.lastName}</div>
                    <div className="text-xs text-slate-500">{student.email}</div>
                  </TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.courseId}</Badge>
                  </TableCell>
                  <TableCell>{new Date(student.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleReject(student.id)}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => handleApprove(student.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
