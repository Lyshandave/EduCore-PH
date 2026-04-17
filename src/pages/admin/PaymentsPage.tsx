import { useState, useEffect } from 'react';
import { usePaymentStore, useUIStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { formatCurrency, formatDate } from '@/lib/utils';
// @ts-ignore - Unused imports for future use
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  verified: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  rejected: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

const paymentMethodIcons: Record<string, string> = {
  gcash: 'GCash',
  maya: 'Maya',
  bdo: 'BDO',
  cash: 'Cash',
  check: 'Check',
};

export function PaymentsPage() {
  const {
    payments,
    stats,
    isLoading,
    fetchPayments,
    verifyPayment,
    rejectPayment,
    bulkVerifyPayments,
    bulkRejectPayments,
  } = usePaymentStore();
  const { addToast } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showProofDialog, setShowProofDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<typeof payments[0] | null>(null);
  const [verificationRemarks, setVerificationRemarks] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPayments(payments.map((p) => p.id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (paymentId: string, checked: boolean) => {
    if (checked) {
      setSelectedPayments([...selectedPayments, paymentId]);
    } else {
      setSelectedPayments(selectedPayments.filter((id) => id !== paymentId));
    }
  };

  const handleVerify = async () => {
    if (!selectedPayment) return;

    await verifyPayment(selectedPayment.id, verificationRemarks);
    addToast({
      type: 'success',
      title: 'Payment verified',
      message: `OR ${selectedPayment.orNumber} has been verified`,
    });
    setShowVerifyDialog(false);
    setSelectedPayment(null);
    setVerificationRemarks('');
  };

  const handleReject = async () => {
    if (!selectedPayment) return;

    await rejectPayment(selectedPayment.id, verificationRemarks);
    addToast({
      type: 'success',
      title: 'Payment rejected',
      message: `OR ${selectedPayment.orNumber} has been rejected`,
    });
    setShowRejectDialog(false);
    setSelectedPayment(null);
    setVerificationRemarks('');
  };

  const handleBulkVerify = async () => {
    const result = await bulkVerifyPayments(selectedPayments, verificationRemarks);
    if (result.success) {
      addToast({
        type: 'success',
        title: 'Bulk verification successful',
        message: `${result.succeeded} payments verified`,
      });
    }
    setSelectedPayments([]);
  };

  const handleBulkReject = async () => {
    const result = await bulkRejectPayments(selectedPayments, verificationRemarks);
    if (result.success) {
      addToast({
        type: 'success',
        title: 'Bulk rejection successful',
        message: `${result.succeeded} payments rejected`,
      });
    }
    setSelectedPayments([]);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.orNumber.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (payment.referenceNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (filterStatus !== 'all' && payment.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Payments
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and verify student payments
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(stats.verifiedAmount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(stats.pendingAmount)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Today's Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(stats.todayRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by OR number or reference..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions */}
      {selectedPayments.length > 0 && (
        <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <span className="text-sm font-medium">
            {selectedPayments.length} payment(s) selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleBulkVerify}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Verify All
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkReject}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject All
            </Button>
          </div>
        </div>
      )}

      {/* Payments Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedPayments.length === payments.length && payments.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>OR Number</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Reference</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-slate-500">
                  No payments found
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPayments.includes(payment.id)}
                      onCheckedChange={(checked) =>
                        handleSelectPayment(payment.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">{payment.orNumber}</TableCell>
                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {paymentMethodIcons[payment.paymentMethod]}
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.referenceNumber || '-'}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={statusColors[payment.status]}
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(payment.paymentDate)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPayment(payment);
                            setShowProofDialog(true);
                          }}
                        >
                          <ImageIcon className="mr-2 h-4 w-4" />
                          View Proof
                        </DropdownMenuItem>
                        {payment.status === 'pending' && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPayment(payment);
                                setShowVerifyDialog(true);
                              }}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Verify
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPayment(payment);
                                setShowRejectDialog(true);
                              }}
                              className="text-red-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Verify Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to verify payment {selectedPayment?.orNumber}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Remarks (optional)</label>
              <Input
                placeholder="Add verification remarks..."
                value={verificationRemarks}
                onChange={(e) => setVerificationRemarks(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerifyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleVerify} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Payment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject payment {selectedPayment?.orNumber}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Reason for rejection</label>
              <Input
                placeholder="Enter rejection reason..."
                value={verificationRemarks}
                onChange={(e) => setVerificationRemarks(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject Payment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Proof Dialog */}
      <Dialog open={showProofDialog} onOpenChange={setShowProofDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
            <DialogDescription>
              OR Number: {selectedPayment?.orNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedPayment?.proofImageUrl ? (
              <img
                src={selectedPayment.proofImageUrl}
                alt="Payment Proof"
                className="w-full rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <ImageIcon className="h-16 w-16 text-slate-400 mb-4" />
                <p className="text-slate-500">No proof image available</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowProofDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
