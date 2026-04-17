import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Star, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export function GradesPage() {
  const academicGrades = [
    { code: 'CC214', subject: 'DATA STRUCTURES AND ALGORITHMS', units: '3.00', grade: '1.50', status: 'PASSED' },
    { code: 'CIS211', subject: 'CISCO 1 - NETWORK FUNDAMENTALS', units: '3.00', grade: '2.00', status: 'PASSED' },
    { code: 'CS212', subject: 'DISCRETE STRUCTURE 2', units: '3.00', grade: '1.50', status: 'PASSED' },
    { code: 'CS213', subject: 'OBJECT-ORIENTED PROGRAMMING', units: '3.00', grade: '1.75', status: 'PASSED' },
    { code: 'GE7', subject: 'SCIENCE, TECHNOLOGY AND SOCIETY', units: '3.00', grade: '2.00', status: 'PASSED' },
    { code: 'GE8', subject: 'ETHICS', units: '3.00', grade: '1.75', status: 'PASSED' },
    { code: 'PATHFIT3', subject: 'DANCE', units: '2.00', grade: '1.75', status: 'PASSED' },
  ];

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 print:p-0 print:max-w-none">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Academic Grades
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Official Rating Report for the current semester
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="bg-white hover:bg-slate-50 border-slate-200">
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
        <Card className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <GraduationCap size={120} />
          </div>
          <CardContent className="p-6 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 backdrop-blur-sm">
                <BookOpen className="text-indigo-400 h-6 w-6" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Enrolled Student</p>
                <h2 className="text-xl font-bold">TOMO LYSHAN DAVE B.</h2>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Student No.</p>
                <p className="font-mono text-lg">241023</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Section</p>
                <p className="font-semibold text-lg uppercase">BS3MA</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">School Year</p>
                <p className="font-semibold text-lg uppercase">2025-2026</p>
              </div>
              <div>
                <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Semester</p>
                <p className="font-semibold text-lg uppercase">3M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-slate-900 border-indigo-100 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center p-6 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-none">
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">GWA Assessment</p>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white">1.75</h2>
          <Badge variant="secondary" className="mt-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-50 dark:bg-indigo-900/40 dark:text-indigo-300 border-none px-3 py-1 font-bold">
            DEAN'S LISTER ELIGIBLE
          </Badge>
        </Card>
      </div>

      {/* Official Rating Report Document */}
      <div className="bg-white dark:bg-slate-950 shadow-2xl rounded-sm border-t-[12px] border-indigo-600 dark:border-indigo-500 print:shadow-none print:border-none print:m-0 flex flex-col min-h-[800px] overflow-hidden">
        {/* Document Header */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4 relative">
          <div className="absolute top-8 left-8 hidden md:block opacity-20">
             <div className="w-12 h-12 border-2 border-indigo-600 rounded-lg transform -rotate-12 flex items-center justify-center font-black text-indigo-600">AICS</div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black tracking-widest text-slate-900 dark:text-white uppercase mb-1">Rating Report</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="h-1 w-8 bg-indigo-600 rounded-full"></span>
              <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase italic">(Finals)</p>
              <span className="h-1 w-8 bg-indigo-600 rounded-full"></span>
            </div>
          </div>
        </div>

        {/* Student Metadata Section */}
        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8">
              <div className="col-span-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Student Name</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white uppercase">TOMO LYSHAN DAVE B.</p>
              </div>
              <div className="col-span-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Student Number</p>
                <p className="text-base font-mono font-bold text-slate-900 dark:text-white">241023</p>
              </div>
              <div className="col-span-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Section</p>
                <p className="text-base font-bold text-slate-900 dark:text-white uppercase">BS3MA</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">School-Year</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">2025-2026</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Semester</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">3M</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Reg. No.</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">000169</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Reg. Date</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">06/10/2025</p>
              </div>
           </div>
        </div>

        {/* Table Section */}
        <div className="flex-grow p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-900">
                <TableHead className="text-white font-bold uppercase tracking-widest text-[10px] h-10 border-r border-slate-700">Code</TableHead>
                <TableHead className="text-white font-bold uppercase tracking-widest text-[10px] h-10 border-r border-slate-700">Subject Description</TableHead>
                <TableHead className="text-white font-bold uppercase tracking-widest text-[10px] h-10 border-r border-slate-700 text-center">Units</TableHead>
                <TableHead className="text-white font-bold uppercase tracking-widest text-[10px] h-10 border-r border-slate-700 text-center">Grade</TableHead>
                <TableHead className="text-white font-bold uppercase tracking-widest text-[10px] h-10 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {academicGrades.map((grade, idx) => (
                <TableRow key={idx} className="border-b border-slate-100 dark:border-slate-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/5 transition-colors">
                  <TableCell className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300 border-r border-slate-50 dark:border-slate-800">{grade.code}</TableCell>
                  <TableCell className="text-sm font-semibold text-slate-900 dark:text-white uppercase">{grade.subject}</TableCell>
                  <TableCell className="text-center font-mono text-sm border-r border-slate-50 dark:border-slate-800">{grade.units}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-lg font-black text-slate-900 dark:text-white">{grade.grade}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center">
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 shadow-none px-3 font-black text-[10px]">
                        {grade.status}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {/* Empty Rows to match document feel */}
              {[...Array(3)].map((_, i) => (
                <TableRow key={`empty-${i}`} className="border-b border-slate-50 dark:border-slate-800/50 opacity-20">
                  <TableCell className="h-10 border-r border-slate-50 dark:border-slate-800"></TableCell>
                  <TableCell className="border-r border-slate-50 dark:border-slate-800"></TableCell>
                  <TableCell className="border-r border-slate-50 dark:border-slate-800"></TableCell>
                  <TableCell className="border-r border-slate-50 dark:border-slate-800"></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer Section */}
        <div className="p-8 mt-auto flex flex-col md:flex-row justify-between items-end gap-8 border-t border-slate-100 dark:border-slate-800">
          <div className="space-y-4 w-full md:w-auto">
            <div className="flex items-center gap-2 text-slate-400">
               <ShieldCheck className="h-4 w-4" />
               <p className="text-[10px] font-bold uppercase tracking-widest">Authentication Summary</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center gap-4">
               <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Date Issued</p>
                  <p className="text-sm font-bold">11/13/2025</p>
               </div>
               <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
               <div>
                  <p className="text-[9px] text-slate-500 font-bold uppercase">Report Status</p>
                  <p className="text-sm font-bold text-emerald-600">CERTIFIED CORRECT</p>
               </div>
            </div>
          </div>

          <div className="text-center w-full md:w-64 space-y-2">
            <div className="h-16 flex items-center justify-center relative">
               {/* Digital Signature Mock */}
               <div className="absolute font-['Alex_Brush',_cursive] text-4xl text-indigo-600/60 transform -rotate-6 select-none leading-none">
                  Registrar
               </div>
               <div className="w-full border-b-2 border-slate-900 dark:border-slate-400 mb-2"></div>
            </div>
            <p className="text-[11px] font-black uppercase text-slate-900 dark:text-white tracking-widest">Official Registrar</p>
            <p className="text-[9px] text-slate-500 font-medium italic">Asian Inst. of Computer Studies</p>
          </div>
        </div>

        {/* Security Watermark */}
        <div className="bg-indigo-600 dark:bg-indigo-500 py-1.5 px-8 flex justify-between items-center text-[8px] font-bold text-white uppercase tracking-[0.2em]">
          <span>Generated via EduCore Cloud Architecture</span>
          <span className="flex items-center gap-1">
             <CheckCircle2 className="h-2 w-2" />
             Cryptographically Verified Document #241023-RATING
          </span>
        </div>
      </div>
    </div>
  );
}
