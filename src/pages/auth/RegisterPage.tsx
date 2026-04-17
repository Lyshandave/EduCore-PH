import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUIStore, useStudentStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  UserPlus,
} from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const { createStudent } = useStudentStore();

  const [studentId, setStudentId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gmail, setGmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [branch, setBranch] = useState('');
  const [course, setCourse] = useState('');
  const [yearLevel, setYearLevel] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isStudentIdValid = /^\d{6}$/.test(studentId);
  const isGmailValid = /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(gmail);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isStudentIdValid) {
      setError('Student ID must be exactly 6 digits');
      return;
    }

    if (!isGmailValid) {
      setError('Please use a valid Gmail address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!branch || !course || !yearLevel) {
      setError('Required: Branch, Course, and Year Level');
      return;
    }

    setIsLoading(true);

    try {
      await createStudent({
        studentId,
        firstName,
        lastName,
        middleName,
        email: gmail,
        password,
        branchId: branch,
        courseId: course,
        yearLevel: yearLevel as any,
        status: 'active',
      });

      addToast({
        type: 'success',
        title: 'Success!',
        message: 'Account pending approval. Redirecting...',
      });

      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-xl">
        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
              <UserPlus className="text-white h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Student Registration</CardTitle>
            <CardDescription>Enter your details below to create an account</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Student ID</Label>
                  <Input 
                    value={studentId} 
                    onChange={e => setStudentId(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="6-digit ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gmail</Label>
                  <Input 
                    type="email" 
                    value={gmail} 
                    onChange={e => setGmail(e.target.value)}
                    placeholder="name@gmail.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 text-left">
                  <Label>First Name</Label>
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} required />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Middle Name</Label>
                  <Input value={middleName} onChange={e => setMiddleName(e.target.value)} />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Last Name</Label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} required />
                </div>
              </div>

              {/* Academic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 text-left">
                  <Label>Branch</Label>
                  <Select value={branch} onValueChange={setBranch}>
                    <SelectTrigger><SelectValue placeholder="Branch" /></SelectTrigger>
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
                <div className="space-y-2 text-left">
                  <Label>Course</Label>
                  <Select value={course} onValueChange={setCourse}>
                    <SelectTrigger><SelectValue placeholder="Course" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BSIT">BS Information Technology</SelectItem>
                      <SelectItem value="BSCS">BS Computer Science</SelectItem>
                      <SelectItem value="BSCrim">BS Criminology</SelectItem>
                      <SelectItem value="BSBA">BS Business Administration</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-left">
                  <Label>Year Level</Label>
                  <Select value={yearLevel} onValueChange={setYearLevel}>
                    <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st">1st Year</SelectItem>
                      <SelectItem value="2nd">2nd Year</SelectItem>
                      <SelectItem value="3rd">3rd Year</SelectItem>
                      <SelectItem value="4th">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label>Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPassword ? 'text' : 'password'} 
                      value={password} 
                      onChange={e => setPassword(e.target.value)}
                      required 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <Label>Confirm</Label>
                  <div className="relative">
                    <Input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      value={confirmPassword} 
                      onChange={e => setConfirmPassword(e.target.value)}
                      required 
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-slate-400">
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 h-11" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Register Now'}
              </Button>

              <div className="text-center text-sm">
                Already have an account? <Link to="/login" className="text-blue-600 font-bold">Sign in</Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
