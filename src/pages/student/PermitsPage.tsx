import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, Download, AlertTriangle, Lock, Unlock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function PermitsPage() {
  const permitStatus = [
    { targetExam: 'Prelims', isPaid: true, downloadReady: true },
    { targetExam: 'Midterms', isPaid: false, downloadReady: false },
    { targetExam: 'Finals', isPaid: false, downloadReady: false },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Exam Permits
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Download your examination permits
          </p>
        </div>
      </div>

      <div className="bg-blue-50 text-blue-800 p-4 border border-blue-200 rounded-lg dark:bg-blue-900/10 dark:border-blue-900/30 dark:text-blue-200 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5 text-blue-600" />
        <div className="text-sm">
          <p className="font-semibold mb-1">Permit Generation Rules:</p>
          <ul className="list-disc list-inside opacity-90 space-y-1">
            <li>You cannot download an exam permit if your specified term balance is unpaid.</li>
            <li>Permits are generated sequentially (Enrollment clearance ➔ Prelims ➔ Midterms ➔ Finals).</li>
          </ul>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {permitStatus.map((permit, idx) => (
          <Card key={idx} className={`relative overflow-hidden ${permit.downloadReady ? 'border-green-200 dark:border-green-900/50' : 'border-slate-200 dark:border-slate-800'}`}>
            {permit.downloadReady && <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>}
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>{permit.targetExam}</CardTitle>
                {permit.downloadReady ? (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20"><Unlock className="w-3 h-3 mr-1"/> Cleared</Badge>
                ) : (
                  <Badge variant="outline" className="text-slate-500 bg-slate-50 dark:bg-slate-900/50"><Lock className="w-3 h-3 mr-1"/> Locked</Badge>
                )}
              </div>
              <CardDescription>
                {permit.downloadReady ? 'Ready for printing' : 'Pending payment clearance'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col items-center pb-6">
              <div className={`h-20 w-20 rounded-full flex items-center justify-center mb-4 transition-colors ${
                permit.downloadReady 
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30' 
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800'
              }`}>
                <FileCheck className="h-8 w-8" />
              </div>
              
              <Button 
                className={`w-full mt-2 ${permit.downloadReady ? 'bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20' : ''}`}
                variant={permit.downloadReady ? 'default' : 'secondary'}
                disabled={!permit.downloadReady}
              >
                {permit.downloadReady ? (
                  <><Download className="h-4 w-4 mr-2" /> Download Permit</>
                ) : (
                  <><Lock className="h-4 w-4 mr-2" /> Unpaid Term</>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
