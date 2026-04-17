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
import { useUIStore } from '@/stores';

const initialStaff = [
  { id: 'STF-001', name: 'Maria Santos', role: 'Staff (Branch Admin)', branch: 'Main Campus', status: 'Active', email: 'm.santos@educore.ph', lastLogin: '2 mins ago' },
  { id: 'STF-002', name: 'Juan Dela Cruz', role: 'Staff (Registrar)', branch: 'Main Campus', status: 'Active', email: 'j.delacruz@educore.ph', lastLogin: '1 hour ago' },
  { id: 'STF-003', name: 'Ana Reyes', role: 'Staff (Staff)', branch: 'North Branch', status: 'Inactive', email: 'a.reyes@educore.ph', lastLogin: '5 days ago' },
];

export function StaffPage() {
  const { addToast } = useUIStore();
  const [staffList, setStaffList] = useState(initialStaff);
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter] = useState('all');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'Registrar',
    branch: 'Main Campus'
  });

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const staff = {
      id: `STF-00${staffList.length + 1}`,
      name: newStaff.name,
      role: newStaff.role,
      branch: newStaff.branch,
      status: 'Active',
      email: newStaff.email,
      lastLogin: 'Never'
    };

    setStaffList([staff, ...staffList]);
    setIsAddOpen(false);
    setIsSubmitting(false);
    setNewStaff({ name: '', email: '', role: 'Registrar', branch: 'Main Campus' });
    addToast({ type: 'success', title: 'Staff Added', message: `${staff.name} has been registered as ${staff.role}.` });
  };

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          staff.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === 'all' || staff.branch.toLowerCase().includes(branchFilter.toLowerCase());
    return matchesSearch && matchesBranch;
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
            {filteredStaff.map((staff) => (
              <TableRow key={staff.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback>{staff.name[0]}</AvatarFallback></Avatar>
                    <div><p className="font-medium text-sm">{staff.name}</p><p className="text-[10px] text-slate-500">{staff.id}</p></div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{staff.role}</Badge></TableCell>
                <TableCell><div className="flex items-center gap-1 text-xs"><Building2 size={12}/>{staff.branch}</div></TableCell>
                <TableCell><Badge variant="secondary" className={staff.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100'}>{staff.status}</Badge></TableCell>
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
            ))}
          </TableBody>
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
                <Select value={newStaff.branch} onValueChange={v => setNewStaff({...newStaff, branch: v})}>
                  <SelectTrigger><SelectValue/></SelectTrigger>
                  <SelectContent>
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
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter><Button type="submit" disabled={isSubmitting}>{isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Staff'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
