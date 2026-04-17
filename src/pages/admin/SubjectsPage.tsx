import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Search, 
  Clock,
  Layout,
  Filter,
  MoreVertical,
  Edit2,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Mock data for Subjects
const initialSubjects = [
  // Senior High School Subjects
  { id: 1, code: 'SHS-CORE-101', name: 'Oral Communication', level: 'SHS', category: 'Core', credits: 3, description: 'Development of listening and speaking skills and strategies for effective communication.' },
  { id: 2, code: 'SHS-CORE-102', name: 'Reading and Writing Skills', level: 'SHS', category: 'Core', credits: 3, description: 'Development of skills in critical reading and writing.' },
  { id: 3, code: 'SHS-ICT-201', name: 'Computer Programming 1', level: 'SHS', category: 'Specialized', credits: 4, description: 'Introduction to basic programming concepts and logic.' },
  { id: 4, code: 'SHS-ICT-202', name: 'Computer Programming 2', level: 'SHS', category: 'Specialized', credits: 4, description: 'Advanced programming techniques and application development.' },
  { id: 5, code: 'SHS-ICT-203', name: 'Computer Systems Servicing', level: 'SHS', category: 'Specialized', credits: 4, description: 'Installation, configuration, and maintenance of computer systems.' },
  { id: 6, code: 'SHS-ICT-204', name: 'Animation 1', level: 'SHS', category: 'Specialized', credits: 4, description: 'Fundamentals of 2D animation and digital character design.' },
  
  // College Subjects (BSIT/BSCS)
  { id: 101, code: 'IT-101', name: 'Introduction to Computing', level: 'College', category: 'Professional', credits: 3, description: 'Fundamental concepts of computer hardware, software, and information systems.' },
  { id: 102, code: 'IT-102', name: 'Computer Programming 1 (Python)', level: 'College', category: 'Professional', credits: 3, description: 'Basic programming using Python language.' },
  { id: 103, code: 'IT-103', name: 'Data Structures and Algorithms', level: 'College', category: 'Professional', credits: 3, description: 'Efficient organization and manipulation of data.' },
  { id: 104, code: 'IT-104', name: 'Database Management Systems 1', level: 'College', category: 'Professional', credits: 3, description: 'Design, implementation, and management of relational databases.' },
  { id: 105, code: 'IT-105', name: 'Web Development', level: 'College', category: 'Professional', credits: 3, description: 'Frontend and backend web development using modern technologies.' },
  { id: 106, code: 'IT-106', name: 'Networking 1', level: 'College', category: 'Professional', credits: 3, description: 'Fundamentals of computer networks and architectures.' },
  { id: 107, code: 'IT-107', name: 'Information Assurance and Security', level: 'College', category: 'Professional', credits: 3, description: 'Protection of information assets and cybersecurity principles.' },
  { id: 108, code: 'IT-108', name: 'Mobile App Development', level: 'College', category: 'Professional', credits: 3, description: 'Creating applications for Android and iOS platforms.' },
];

export function SubjectsPage() {
  const [subjects, setSubjects] = useState(initialSubjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  // New Subject Form State
  const [newSubject, setNewSubject] = useState({
    code: '',
    name: '',
    level: 'SHS',
    category: 'Core',
    credits: 3,
    description: ''
  });

  const handleAddSubject = () => {
    if (!newSubject.code || !newSubject.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    const subject = {
      id: Date.now(),
      ...newSubject
    };

    setSubjects([subject, ...subjects]);
    setIsAddOpen(false);
    setNewSubject({ code: '', name: '', level: 'SHS', category: 'Core', credits: 3, description: '' });
    toast.success('Subject added successfully!');
  };

  const handleDeleteSubject = (id: number) => {
    setSubjects(subjects.filter(s => s.id !== id));
    toast.success('Subject removed');
  };

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'All' || s.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Subjects Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Define and manage curriculum subjects for SHS and College levels.
          </p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>
                Create a new subject for the curriculum. Fill in all details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="code" className="text-right">Code</Label>
                <Input 
                  id="code" 
                  placeholder="e.g. IT-101" 
                  className="col-span-3" 
                  value={newSubject.code}
                  onChange={(e) => setNewSubject({...newSubject, code: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input 
                  id="name" 
                  placeholder="Subject Name" 
                  className="col-span-3" 
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="level" className="text-right">Level</Label>
                <div className="col-span-3">
                  <Select 
                    value={newSubject.level} 
                    onValueChange={(val) => setNewSubject({...newSubject, level: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SHS">Senior High School</SelectItem>
                      <SelectItem value="College">College</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <div className="col-span-3">
                  <Select 
                    value={newSubject.category} 
                    onValueChange={(val) => setNewSubject({...newSubject, category: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Core">Core</SelectItem>
                      <SelectItem value="Applied">Applied</SelectItem>
                      <SelectItem value="Specialized">Specialized</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                      <SelectItem value="General">General Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="credits" className="text-right">Units/Credits</Label>
                <Input 
                  id="credits" 
                  type="number" 
                  className="col-span-3" 
                  value={newSubject.credits}
                  onChange={(e) => setNewSubject({...newSubject, credits: parseInt(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="desc" className="text-right">Description</Label>
                <Input 
                  id="desc" 
                  placeholder="Brief description" 
                  className="col-span-3" 
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit" onClick={handleAddSubject} className="bg-blue-600 hover:bg-blue-700">Save Subject</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search code or name..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Level Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Levels</SelectItem>
              <SelectItem value="SHS">SHS</SelectItem>
              <SelectItem value="College">College</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="overflow-hidden group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex justify-between items-start">
                <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-tight">
                  {subject.code}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Edit2 className="h-3.5 w-3.5" /> Edit Subject
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 gap-2" onClick={() => handleDeleteSubject(subject.id)}>
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardTitle className="text-base mt-2 line-clamp-1">{subject.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Layout className="h-3.5 w-3.5" />
                  Level
                </div>
                <Badge 
                  variant="secondary" 
                  className={subject.level === 'SHS' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}
                >
                  {subject.level}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Filter className="h-3.5 w-3.5" />
                  Category
                </div>
                <span className="font-semibold">{subject.category}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  Credits
                </div>
                <span className="font-semibold">{subject.credits} Units</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                {subject.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
