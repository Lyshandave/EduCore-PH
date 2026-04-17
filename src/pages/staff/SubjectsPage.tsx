import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Clock,
  Layout,
  Filter,
  Users
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data
const initialSubjects = [
  { id: 1, code: 'SHS-CORE-101', name: 'Oral Communication', level: 'SHS', category: 'Core', credits: 3, description: 'Development of listening and speaking skills and strategies for effective communication.', sectionCount: 4, studentCount: 160 },
  { id: 2, code: 'SHS-CORE-102', name: 'Reading and Writing Skills', level: 'SHS', category: 'Core', credits: 3, description: 'Development of skills in critical reading and writing.', sectionCount: 3, studentCount: 120 },
  { id: 3, code: 'SHS-ICT-201', name: 'Computer Programming 1', level: 'SHS', category: 'Specialized', credits: 4, description: 'Introduction to basic programming concepts and logic.', sectionCount: 5, studentCount: 200 },
];

export function SubjectsPage() {
  const [subjects] = useState(initialSubjects);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');

  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'All' || s.level === filterLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Assigned Subjects
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            View your assigned subjects, sections, and linked statistics for your branch.
          </p>
        </div>
      </div>

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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="overflow-hidden group hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <Badge variant="outline" className="text-[10px] w-max uppercase font-bold tracking-tight">
                {subject.code}
              </Badge>
              <CardTitle className="text-base mt-2 line-clamp-1">{subject.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Layout className="h-3.5 w-3.5" />
                  Sections
                </div>
                <span className="font-semibold">{subject.sectionCount} Sections</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Users className="h-3.5 w-3.5" />
                  Students
                </div>
                <span className="font-semibold">{subject.studentCount} Enrolled</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  Credits
                </div>
                <span className="font-semibold">{subject.credits} Units</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed border-t border-slate-100 pt-2 dark:border-slate-800">
                {subject.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
