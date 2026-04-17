import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useUIStore } from '@/stores';
import { CreditCard, UploadCloud, Receipt, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function PaymentsPage() {
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    term: '',
    method: '',
    reference: '',
  });

  const [history, setHistory] = useState([
    { id: 'TXN-10023', target: 'Prelims', method: 'GCash', amount: '₱5,000.00', date: 'Sep 25, 2024', status: 'Approved' },
    { id: 'TXN-08991', target: 'Enrollment', method: 'Bank Transfer (BDO)', amount: '₱8,000.00', date: 'Aug 10, 2024', status: 'Approved' },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.term || !formData.method || !formData.reference) {
      addToast({ type: 'warning', title: 'Missing Info', message: 'Please fill in all fields and upload proof.' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newTxn = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      target: formData.term.charAt(0).toUpperCase() + formData.term.slice(1),
      method: formData.method.toUpperCase(),
      amount: '₱5,000.00',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Pending'
    };

    setHistory([newTxn, ...history]);
    setIsLoading(false);
    setFormData({ term: '', method: '', reference: '' });
    
    addToast({
      type: 'success',
      title: 'Payment Submitted',
      message: 'Your payment proof has been uploaded and is awaiting verification.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Payments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Upload proof of payment and track status
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 h-fit shadow-md border-blue-100 dark:border-blue-900/30">
          <CardHeader className="bg-blue-50/50 dark:bg-blue-900/10 border-b border-blue-50 dark:border-blue-900/20">
            <CardTitle className="flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-blue-600" /> Upload Proof
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label>Payment For</Label>
              <Select value={formData.term} onValueChange={v => setFormData({...formData, term: v})}>
                <SelectTrigger><SelectValue placeholder="Select term..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="enrollment">Enrollment</SelectItem>
                  <SelectItem value="prelims">Prelims</SelectItem>
                  <SelectItem value="midterms">Midterms</SelectItem>
                  <SelectItem value="finals">Finals</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Method</Label>
              <Select value={formData.method} onValueChange={v => setFormData({...formData, method: v})}>
                <SelectTrigger><SelectValue placeholder="Select method..." /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="gcash">GCash</SelectItem>
                  <SelectItem value="paymaya">PayMaya</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reference Number</Label>
              <Input 
                placeholder="10 digit Ref #" 
                value={formData.reference} 
                onChange={e => setFormData({...formData, reference: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Proof Receipt</Label>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                <Receipt className="h-8 w-8 mb-2 text-slate-400" />
                <span className="text-sm">Click to upload image</span>
              </div>
            </div>
            <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Submit for Verification'}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2"><Clock className="h-5 w-5 text-slate-500" /> History</h3>
          <div className="flex flex-col gap-3">
            {history.map((txn, idx) => (
              <Card key={idx} className="overflow-hidden">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${txn.status === 'Approved' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                      {txn.status === 'Approved' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <h4 className="font-semibold">{txn.target} Payment</h4>
                      <p className="text-xs text-slate-500">{txn.method} • {txn.id} • {txn.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{txn.amount}</p>
                    <Badge variant="outline" className={txn.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}>{txn.status}</Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
