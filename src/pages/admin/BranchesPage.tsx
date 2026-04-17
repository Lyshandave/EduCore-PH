import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Building2, 
  Plus, 
  Search, 
  MapPin,
  Users,
  GraduationCap,
  Settings,
  MoreVertical,
  Banknote
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// Real AICS Branches data
const initialBranches = [
  { id: 1, name: 'AICS Commonwealth', location: 'Quezon City, Metro Manila', status: 'Active', admin: 'Maria Santos', metrics: { students: 0, revenue: '₱0M', passingRate: '92%' } },
  { id: 2, name: 'AICS Montalban', location: 'Rodriguez, Rizal', status: 'Active', admin: 'Juan Dela Cruz', metrics: { students: 0, revenue: '₱0M', passingRate: '88%' } },
  { id: 3, name: 'AICS Taytay', location: 'Taytay, Rizal', status: 'Active', admin: 'Ana Reyes', metrics: { students: 0, revenue: '₱0M', passingRate: '95%' } },
  { id: 4, name: 'AICS Tanay', location: 'Tanay, Rizal', status: 'Active', admin: 'Jose Rizal', metrics: { students: 0, revenue: '₱0M', passingRate: '85%' } },
  { id: 5, name: 'AICS Meycauayan', location: 'Meycauayan, Bulacan', status: 'Active', admin: 'Liza Soberano', metrics: { students: 0, revenue: '₱0M', passingRate: '89%' } },
  { id: 6, name: 'AICS Tarlac', location: 'Tarlac City', status: 'Active', admin: 'Enrique Gil', metrics: { students: 0, revenue: '₱0M', passingRate: '82%' } },
  { id: 7, name: 'AICS Bacoor', location: 'Bacoor, Cavite', status: 'Active', admin: 'Coco Martin', metrics: { students: 0, revenue: '₱0M', passingRate: '91%' } },
  { id: 8, name: 'AICS Batangas', location: 'Batangas City', status: 'Active', admin: 'Dingdong Dantes', metrics: { students: 0, revenue: '₱0M', passingRate: '87%' } },
  { id: 9, name: 'AICS Bicutan', location: 'Parañaque City', status: 'Active', admin: 'Marian Rivera', metrics: { students: 0, revenue: '₱0M', passingRate: '93%' } },
  { id: 10, name: 'AICS GMA', location: 'GMA, Cavite', status: 'Active', admin: 'Kathryn Bernardo', metrics: { students: 0, revenue: '₱0M', passingRate: '84%' } },
  { id: 11, name: 'AICS Lipa', location: 'Lipa, Batangas', status: 'Active', admin: 'Daniel Padilla', metrics: { students: 0, revenue: '₱0M', passingRate: '90%' } },
];

export function BranchesPage() {
  const [branches, setBranches] = useState(initialBranches);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newBranch, setNewBranch] = useState({
    name: '',
    location: '',
    admin: '',
  });

  const handleAddBranch = () => {
    if (!newBranch.name || !newBranch.location || !newBranch.admin) {
      toast.error('Please fill in all fields');
      return;
    }

    const branch = {
      id: Date.now(),
      name: `AICS ${newBranch.name}`,
      location: newBranch.location,
      status: 'Active',
      admin: newBranch.admin,
      metrics: {
        students: 0,
        revenue: '₱0M',
        passingRate: '0%',
      },
    };

    setBranches([branch, ...branches]);
    setIsAddOpen(false);
    setNewBranch({ name: '', location: '', admin: '' });
    toast.success('Branch added successfully!');
  };
  
  const filteredBranches = branches.filter((b) => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Branches
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manage campus locations, performance, and branch settings.
          </p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Branch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Branch</DialogTitle>
              <DialogDescription>
                Register a new AICS campus location.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right text-xs font-semibold uppercase text-slate-500 tracking-wider">Branch Name</Label>
                <div className="col-span-3 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">AICS </span>
                  <Input 
                    id="name" 
                    placeholder="e.g. Davao" 
                    className="pl-[48px]"
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="loc" className="text-right text-xs font-semibold uppercase text-slate-500 tracking-wider">Location</Label>
                <Input 
                  id="loc" 
                  placeholder="Address / City" 
                  className="col-span-3"
                  value={newBranch.location}
                  onChange={(e) => setNewBranch({...newBranch, location: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="admin" className="text-right text-xs font-semibold uppercase text-slate-500 tracking-wider">Admin Name</Label>
                <Input 
                  id="admin" 
                  placeholder="Appointed Head" 
                  className="col-span-3"
                  value={newBranch.admin}
                  onChange={(e) => setNewBranch({...newBranch, admin: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddBranch} className="bg-blue-600 hover:bg-blue-700">Create Branch</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search branches..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBranches.map((branch) => (
          <Card key={branch.id} className="overflow-hidden group">
            <CardHeader className="pb-4 relative">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{branch.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {branch.location}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>Assign Staff/Admin</DropdownMenuItem>
                    <DropdownMenuItem>Branch Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Edit Branch</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Delete Branch</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Badge 
                variant="secondary" 
                className="absolute top-4 right-14 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              >
                {branch.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 font-medium">Branch Admin</span>
                  <span className="font-semibold">{branch.admin}</span>
                </div>
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <Users className="h-4 w-4 text-blue-600 mb-1" />
                    <span className="text-xs text-slate-500 mb-1">Students</span>
                    <span className="font-bold text-sm">{branch.metrics.students.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <Banknote className="h-4 w-4 text-green-600 mb-1" />
                    <span className="text-xs text-slate-500 mb-1">Revenue</span>
                    <span className="font-bold text-sm">{branch.metrics.revenue}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <GraduationCap className="h-4 w-4 text-purple-600 mb-1" />
                    <span className="text-xs text-slate-500 mb-1">Passing</span>
                    <span className="font-bold text-sm">{branch.metrics.passingRate}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-2 font-medium">
                  <Settings className="mr-2 h-4 w-4 text-slate-500" />
                  Branch Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredBranches.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No branches found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
