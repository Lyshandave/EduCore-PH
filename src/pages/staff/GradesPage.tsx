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
import { Search, CheckSquare, GraduationCap, Loader2, Save } from 'lucide-react';
import { useUIStore } from '@/stores';

export function GradesPage() {
  const { addToast } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [grades, setGrades] = useState([
    { id: '2024-001', name: 'Alipio, Juan', subject: 'CC101', midterms: 92, finals: 0, finalGrade: 0, status: 'Draft' },
    { id: '2024-002', name: 'Santos, Maria', subject: 'CC101', midterms: 88, finals: 91, finalGrade: 89.5, status: 'Encoded' },
    { id: '2024-005', name: 'Reyes, Jose', subject: 'CC101', midterms: 75, finals: 78, finalGrade: 76.5, status: 'Submitted to Admin' },
  ]);

  const handleGradeChange = (id: string, field: 'midterms' | 'finals', value: string) => {
    const numValue = parseFloat(value) || 0;
    setGrades(grades.map(g => {
      if (g.id === id) {
        const updated = { ...g, [field]: numValue };
        // Simple 50/50 computation
        updated.finalGrade = (updated.midterms + updated.finals) / 2;
        if (updated.finalGrade > 0) updated.status = 'Encoded';
        return updated;
      }
      return g;
    }));
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    addToast({ type: 'success', title: 'Grades Saved', message: 'Current computation has been saved as draft.' });
    setIsLoading(false);
  };

  const handleSubmitAll = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setGrades(grades.map(g => g.status !== 'Submitted to Admin' ? { ...g, status: 'Submitted to Admin' } : g));
    addToast({ type: 'success', title: 'Submitted', message: 'All grades have been submitted to admin for final approval.' });
    setIsLoading(false);
  };

  const filtered = grades.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Grade Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <GraduationCap className="h-4 w-4" /> Encode, compute, and submit
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveAll} disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" /> Save Draft
          </Button>
          <Button onClick={handleSubmitAll} className="bg-blue-600" disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <CheckSquare className="mr-2 h-4 w-4" />}
            Submit All
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search student..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden dark:border-slate-800 dark:bg-slate-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead className="text-center w-24">Midterms</TableHead>
              <TableHead className="text-center w-24">Finals</TableHead>
              <TableHead className="text-center w-24">Grade</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((grade) => (
              <TableRow key={grade.id}>
                <TableCell>
                  <p className="font-semibold text-sm">{grade.name}</p>
                  <p className="text-xs text-slate-500">{grade.id}</p>
                </TableCell>
                <TableCell>{grade.subject}</TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={grade.midterms || ''} 
                    onChange={e => handleGradeChange(grade.id, 'midterms', e.target.value)}
                    className="w-16 h-8 text-center mx-auto"
                    disabled={grade.status === 'Submitted to Admin'}
                  />
                </TableCell>
                <TableCell>
                  <Input 
                    type="number" 
                    value={grade.finals || ''} 
                    onChange={e => handleGradeChange(grade.id, 'finals', e.target.value)}
                    className="w-16 h-8 text-center mx-auto"
                    disabled={grade.status === 'Submitted to Admin'}
                  />
                </TableCell>
                <TableCell className="text-center font-bold">
                  {grade.finalGrade > 0 ? grade.finalGrade.toFixed(2) : '-'}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    grade.status === 'Submitted to Admin' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }>{grade.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
