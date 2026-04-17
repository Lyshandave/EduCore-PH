import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Printer, Download, Receipt, Calendar, Info, CheckCircle2 } from 'lucide-react';

export function SOAPage() {
  const { user } = useAuthStore();
  
  const paymentColumns = [
    { label: 'ENROLLMENT', tuition: 3650.00, payments: 3650.00, balance: 0.00, dueDate: '08/12/2024', status: 'PAID' },
    { label: 'PRELIMS', tuition: 3650.00, payments: 3650.00, balance: 0.00, dueDate: '09/13/2024', status: 'PAID' },
    { label: 'MID-TERM', tuition: 3650.00, payments: 3650.00, balance: 0.00, dueDate: '10/15/2024', status: 'PAID' },
    { label: 'FINALS', tuition: 3650.00, payments: 0.00, balance: 3650.00, dueDate: '11/15/2024', status: 'UNPAID', overdue: 5 },
  ];

  const totals = {
    tuition: 14600.00,
    payments: 10950.00,
    balance: 3650.00
  };

  const handlePrint = () => window.print();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 print:p-0 print:max-w-none">
      {/* Action Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Statement of Account
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            Official financial statement and payment timeline
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="bg-white hover:bg-slate-50 border-slate-200 shadow-sm">
            <Printer className="mr-2 h-4 w-4" />
            Print SOA
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200 dark:shadow-none">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Main Document Container */}
      <div className="bg-white dark:bg-slate-950 shadow-2xl rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 print:shadow-none print:border-none print:m-0">
        
        {/* Document Header Section */}
        <div className="flex flex-col md:flex-row border-b border-slate-200 dark:border-slate-800">
           {/* Left Header - Document Type */}
           <div className="p-8 md:w-1/2 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
              <div className="border-4 border-slate-900 dark:border-slate-100 p-4 inline-block mb-6">
                <h2 className="text-2xl font-black tracking-[0.2em] text-slate-900 dark:text-white uppercase leading-none">Statement of Account</h2>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Student Name</p>
                <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  {user?.firstName} {user?.lastName || 'TOMO LYSHAN DAVE B.'}
                </p>
              </div>
           </div>

           {/* Right Header - School Info */}
           <div className="p-8 md:w-1/2 text-right flex flex-col justify-between bg-white dark:bg-slate-950">
              <div className="space-y-1">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase leading-tight">Asian Inst. of Computer Studies</h3>
                 <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">AICS BLDG. DON ANTONIO, COMM., Q.C.</p>
                 <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Telephone: 952-0308 / 430-46</p>
              </div>
              <div className="mt-8">
                 <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mb-1">Reporting Date</p>
                 <p className="text-lg font-mono font-bold text-slate-900 dark:text-white underline underline-offset-4 decoration-indigo-200">11/20/2024</p>
              </div>
           </div>
        </div>

        {/* Basic Info Bar */}
        <div className="grid grid-cols-2 md:grid-cols-7 border-b border-slate-200 dark:border-slate-800">
          {[
            { label: 'Student Number', value: '241023' },
            { label: 'Section', value: 'BS1AA' },
            { label: 'School-Year', value: '24-25' },
            { label: 'Sem', value: '1A' },
            { label: 'Reg. No.', value: '000024' },
            { label: 'Reg. Date', value: '06/13/2024' },
            { label: 'Stat', value: 'NEW' },
          ].map((item, i) => (
            <div key={i} className={`p-4 ${i !== 6 ? 'border-r border-slate-100 dark:border-slate-800' : ''} bg-white dark:bg-slate-950`}>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">{item.label}</p>
              <p className="text-xs font-bold text-slate-900 dark:text-white uppercase">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Financial Table - The Core Grid */}
        <div className="overflow-x-auto">
          <Table className="border-collapse">
            <TableHeader>
              <TableRow className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-900">
                <TableHead className="w-48 text-white font-bold h-12 border-r border-slate-700"></TableHead>
                {paymentColumns.map((col, i) => (
                  <TableHead key={i} className="text-white font-black uppercase text-[10px] tracking-widest text-center border-r border-slate-700">
                    {col.label}
                  </TableHead>
                ))}
                <TableHead className="text-indigo-400 font-black uppercase text-[10px] tracking-widest text-center h-12 bg-indigo-950/30">
                  TOTAL
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-transparent">
                <TableCell className="font-bold text-slate-900 dark:text-white uppercase text-[11px] border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">Tuition Fee -</TableCell>
                {paymentColumns.map((col, i) => (
                  <TableCell key={i} className="text-right font-mono text-xs border-r border-slate-100 dark:border-slate-800">
                    {col.tuition.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                ))}
                <TableCell className="text-right font-mono text-xs font-bold bg-indigo-50/30 dark:bg-indigo-900/10">
                  {totals.tuition.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-transparent">
                <TableCell className="font-bold text-slate-900 dark:text-white uppercase text-[11px] border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">Payments -</TableCell>
                {paymentColumns.map((col, i) => (
                  <TableCell key={i} className="text-right font-mono text-xs border-r border-slate-100 dark:border-slate-800">
                    {col.payments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                ))}
                <TableCell className="text-right font-mono text-xs font-bold bg-indigo-50/30 dark:bg-indigo-900/10">
                  {totals.payments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>

              <TableRow className="bg-slate-50/50 dark:bg-slate-900/20 hover:bg-slate-50/50">
                <TableCell className="font-black text-slate-900 dark:text-white uppercase text-[11px] border-r border-slate-100 dark:border-slate-800">BALANCE -</TableCell>
                {paymentColumns.map((col, i) => (
                  <TableCell key={i} className={`text-right font-mono text-xs font-bold border-r border-slate-100 dark:border-slate-800 ${col.balance > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                    {col.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </TableCell>
                ))}
                <TableCell className="text-right font-mono text-sm font-black text-indigo-600 bg-indigo-100/20">
                  {totals.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-transparent">
                <TableCell className="font-bold text-slate-900 dark:text-white uppercase text-[11px] border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">DUE DATE -</TableCell>
                {paymentColumns.map((col, i) => (
                  <TableCell key={i} className="text-center font-mono text-[10px] text-slate-500 border-r border-slate-100 dark:border-slate-800">
                    {col.dueDate}
                  </TableCell>
                ))}
                <TableCell className="bg-slate-900 dark:bg-slate-800 p-0 overflow-hidden" rowSpan={2}>
                   <div className="h-full flex flex-col items-center justify-center p-2 text-center">
                      <p className="text-[8px] text-indigo-300 font-bold uppercase tracking-tighter mb-1">BALANCE DUE</p>
                      <p className="text-lg font-black text-white bg-indigo-600 px-3 py-1 rounded shadow-inner">
                        ₱{totals.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                   </div>
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-transparent">
                <TableCell className="font-bold text-slate-900 dark:text-white uppercase text-[11px] border-r border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">Overdue Days -</TableCell>
                {paymentColumns.map((col, i) => (
                  <TableCell key={i} className="text-center font-mono text-[10px] border-r border-slate-100 dark:border-slate-800">
                    {col.overdue ? (
                       <span className="text-red-500 font-black uppercase text-[10px]">{col.overdue} days</span>
                    ) : ''}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Footer Notes & Security */}
        <div className="p-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row gap-8 justify-between">
            <div className="flex-1 space-y-4">
               <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                  <Info className="h-4 w-4" />
                  <p className="text-xs font-black uppercase tracking-widest">DEAR PARENTS/GUARDIANS:</p>
               </div>
               <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">
                 Please settle the BALANCE with overdue DAYS right away. The Due Date for each period is provided above to remind you when payment is due.
               </p>
            </div>
            <div className="md:w-64 flex flex-col justify-end text-right">
                <div className="mb-4">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2">Authenticated By</p>
                  <div className="h-10 flex items-center justify-end relative">
                     <span className="absolute font-['Alex_Brush',_cursive] text-2xl text-slate-900/40 transform -rotate-3 select-none">AICS Management</span>
                     <div className="w-32 border-b border-slate-300"></div>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-1">AICS MANAGEMENT</p>
                </div>
            </div>
          </div>
        </div>

        {/* Security / System Footer */}
        <div className="bg-slate-900 dark:bg-indigo-950 py-3 px-8 flex flex-col sm:flex-row justify-between items-center text-[9px] font-bold text-slate-400 dark:text-indigo-300 uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <span>© 2024 EDUCORE PHILIPPINES</span>
            <span className="hidden sm:inline opacity-30">|</span>
            <span>SYSTEM-GENERATED DOCUMENT</span>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0 text-indigo-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>ID: SOA-2024-000024-VERIFIED</span>
          </div>
        </div>
      </div>

      {/* Payment Options (Browser Only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
         <Card className="border-indigo-100 bg-indigo-50/30 dark:bg-indigo-900/10 dark:border-indigo-900/50">
            <CardContent className="p-6">
               <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-2 flex items-center gap-2">
                 <Calendar className="h-4 w-4" /> Upcoming Exam Period
               </h3>
               <p className="text-sm text-indigo-700/70 dark:text-indigo-300/70">
                 The FINAL EXAMINATIONS are scheduled for Nov 20-22, 2024. Please ensure your balance is settled to generate your Exam Permit.
               </p>
            </CardContent>
         </Card>
         <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6 flex items-center justify-between">
               <div>
                 <h3 className="font-bold text-slate-900 dark:text-white mb-1">Need Payment Assistance?</h3>
                 <p className="text-xs text-slate-500">Contact the cashier's office for installment plans.</p>
               </div>
               <Button variant="link" className="text-indigo-600 font-bold p-0">Contact Support</Button>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
