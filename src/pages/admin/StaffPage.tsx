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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  UserPlus, 
  Search, 
  MoreVertical, 
  Building2,
  Loader2
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { useUIStore, useStaffStore } from '@/stores';

export function StaffPage() {
  const { addToast } = useUIStore();
  const { staff: staffList, isLoading, fetchStaff, createStaff } = useStaffStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'Registrar',
    branchId: 'branch-1'
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createStaff({
        ...newStaff,
        position: newStaff.role,
      });
      setIsAddOpen(false);
      setNewStaff({ name: '', email: '', role: 'Registrar', branchId: 'branch-1' });
      addToast({ type: 'success', title: 'Staff Added', message: 'The new staff member has been registered.' });
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: 'Failed to add staff.' });
    }
  };

  const filteredStaff = staffList.filter(staff => {
    const fullName = staff.firstName ? `${staff.firstName} ${staff.lastName}` : (staff.name || '');
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          staff.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (staff.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check both branch name and branchId
    const branchName = staff.branchId === 'branch-1' ? 'Commonwealth' : 
                       staff.branchId === 'branch-2' ? 'Montalban' : 
                       (staff.branchId || '');
                       
    const matchesBranch = branchFilter === 'all' || 
                          branchName.toLowerCase().includes(branchFilter.toLowerCase()) ||
                          (staff.branchId || '').toLowerCase().includes(branchFilter.toLowerCase());
                          
    const matchesStatus = statusFilter === 'all' || 
                          (staff.status || '').toLowerCase() === statusFilter.toLowerCase();
                          
    return matchesSearch && matchesBranch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-slate-500">Manage campus staff accounts and access.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600">
          <UserPlus className="mr-2 h-4 w-4" /> Add Staff
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search staff..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="All Branches" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              <SelectItem value="branch-1">Commonwealth</SelectItem>
              <SelectItem value="branch-2">Montalban</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Staff Member</TableHead>
              <TableHead>Staff Position</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" /><p className="text-sm text-slate-500 mt-2">Loading staff records...</p></TableCell></TableRow>
            ) : filteredStaff.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-12 text-slate-500">No staff members found.</TableCell></TableRow>
            ) : (
              filteredStaff.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{(staff.firstName?.[0] || staff.name?.[0]) || 'S'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {staff.firstName ? `${staff.firstName} ${staff.lastName}` : (staff.name || 'Unknown')}
                      </p>
                      <p className="text-[10px] text-slate-500">{staff.employeeId || staff.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{staff.position || staff.role}</Badge></TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-xs">
                    <Building2 size={12}/>
                    {staff.branchId === 'branch-1' ? 'AICS Commonwealth' : 
                     staff.branchId === 'branch-2' ? 'AICS Montalban' : 
                     (staff.branchId || 'Main Campus')}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary" 
                    className={staff.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100'}
                  >
                    {staff.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical size={16}/></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Disable Account</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              )))}          </TableBody>
        </Table>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Register New Staff</DialogTitle><DialogDescription>Create a new staff account for a branch.</DialogDescription></DialogHeader>
          <form onSubmit={handleAddStaff} className="space-y-4 pt-4">
            <div className="space-y-1"><Label>Full Name</Label><Input value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} required /></div>
            <div className="space-y-1"><Label>Email</Label><Input type="email" value={newStaff.email} onChange={e => setNewStaff({...newStaff, email: e.target.value})} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Staff Position</Label>
                <Select value={newStaff.role} onValueChange={v => setNewStaff({...newStaff, role: v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Staff (Admin)">Branch Admin</SelectItem>
                    <SelectItem value="Staff (Registrar)">Registrar</SelectItem>
                    <SelectItem value="Staff (Standard)">Standard Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Branch</Label>
                <Select value={newStaff.branchId} onValueChange={v => setNewStaff({...newStaff, branchId: v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="branch-1">AICS Commonwealth</SelectItem>
                    <SelectItem value="branch-2">AICS Montalban</SelectItem>
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
              </div>
            </div>
            <DialogFooter><Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="animate-spin" /> : 'Create Staff'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
