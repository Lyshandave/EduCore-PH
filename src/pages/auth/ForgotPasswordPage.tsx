import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUIStore, useStudentStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

type Step = 'email' | 'verify' | 'reset' | 'success';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const { students } = useStudentStore();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) codeInputRefs.current[index + 1]?.focus();
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  // MOCK: Handle Send Code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if email belongs to a student or is a known mock user
    const studentExists = students.some(s => s.email.toLowerCase() === email.toLowerCase());
    const isMockStaff = email.toLowerCase() === 'staff@educore.ph';
    const isMockAdmin = email.toLowerCase() === 'admin@educore.ph';

    if (studentExists || isMockStaff || isMockAdmin) {
      setStep('verify');
      setCountdown(60);
      addToast({
        type: 'success',
        title: 'Verification code sent!',
        message: `We've sent a 6-digit code to ${email} (Mock: 123456)`,
      });
    } else {
      setError('Email address not found in our records.');
    }
    setIsLoading(false);
  };

  // MOCK: Verify Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock verification: any code works for this demo, but let's check for '123456'
    if (fullCode === '123456') {
      setStep('reset');
    } else {
      setError('Invalid verification code. Please try again.');
    }
    setIsLoading(false);
  };

  // MOCK: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, we'd update the password in the store here
    setStep('success');
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          {step !== 'success' && (
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">
                {step === 'email' && 'Forgot Password'}
                {step === 'verify' && 'Verify Email'}
                {step === 'reset' && 'Create New Password'}
              </CardTitle>
              <CardDescription>
                {step === 'email' && 'Enter your email to receive a reset code'}
                {step === 'verify' && `Enter the code sent to ${email}`}
                {step === 'reset' && 'Enter a secure password for your account'}
              </CardDescription>
            </CardHeader>
          )}

          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 'email' && (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input 
                    type="email" 
                    placeholder="yourname@gmail.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Send Reset Code'}
                </Button>
                <div className="text-center">
                  <Link to="/login" className="text-sm text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1">
                    <ArrowLeft size={16} /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}

            {step === 'verify' && (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="flex justify-center gap-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => { codeInputRefs.current[index] = el; }}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleCodeChange(index, e.target.value)}
                      onKeyDown={e => handleCodeKeyDown(index, e)}
                      className="w-10 h-12 text-center text-xl font-bold border-2 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  ))}
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  Verify Code
                </Button>
                <div className="text-center">
                  <button 
                    type="button" 
                    onClick={() => setCountdown(60)} 
                    disabled={countdown > 0}
                    className="text-sm font-semibold text-blue-600 disabled:text-slate-400"
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                  </button>
                </div>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input 
                      type={showNewPassword ? 'text' : 'password'} 
                      value={newPassword} 
                      onChange={e => setNewPassword(e.target.value)}
                      required 
                    />
                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-2.5 text-slate-400">
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)}
                    required 
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  Reset Password
                </Button>
              </form>
            )}

            {step === 'success' && (
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="text-green-600 h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Password Reset Successful!</h2>
                <p className="text-slate-500 mb-8">You can now sign in with your new password.</p>
                <Button onClick={() => navigate('/login')} className="w-full bg-blue-600 hover:bg-blue-700">
                  Return to Sign In
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
