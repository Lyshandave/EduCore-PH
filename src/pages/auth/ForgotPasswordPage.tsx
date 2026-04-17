import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useUIStore } from '@/stores';
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

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { addToast } = useUIStore();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = window.setTimeout(() => {
      setCountdown(current => current - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (step === 'verify') {
      codeInputRefs.current[0]?.focus();
    }
  }, [step]);

  const clearMessages = () => {
    setApiError(null);
    setInfoMessage(null);
  };

  const getCodeValue = () => code.join('');

  const validateEmail = () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setEmailError('Please enter your email address.');
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(normalizedEmail)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }

    setEmailError(null);
    return true;
  };

  const validateCode = () => {
    if (getCodeValue().length !== OTP_LENGTH) {
      setCodeError('Please enter the 6-digit code.');
      return false;
    }

    setCodeError(null);
    return true;
  };

  const validatePasswords = () => {
    if (!newPassword) {
      setPasswordError('Please enter a new password.');
      return false;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return false;
    }

    if (!confirmPassword) {
      setPasswordError('Please confirm your new password.');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return false;
    }

    setPasswordError(null);
    return true;
  };

  const handleCodeChange = (index: number, value: string) => {
    const nextDigit = value.replace(/\D/g, '').slice(-1);

    setCode(current => {
      const nextCode = [...current];
      nextCode[index] = nextDigit;
      return nextCode;
    });

    setCodeError(null);
    setApiError(null);

    if (nextDigit && index < OTP_LENGTH - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (code[index]) {
        setCode(current => {
          const nextCode = [...current];
          nextCode[index] = '';
          return nextCode;
        });
      } else if (index > 0) {
        codeInputRefs.current[index - 1]?.focus();
        setCode(current => {
          const nextCode = [...current];
          nextCode[index - 1] = '';
          return nextCode;
        });
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      codeInputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedValue = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);

    if (!pastedValue) return;

    const nextCode = Array(OTP_LENGTH).fill('');
    pastedValue.split('').forEach((digit, index) => {
      nextCode[index] = digit;
    });

    setCode(nextCode);
    setCodeError(null);
    setApiError(null);

    const focusIndex = Math.min(pastedValue.length, OTP_LENGTH - 1);
    codeInputRefs.current[focusIndex]?.focus();
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!validateEmail()) return;

    setIsSendingCode(true);

    try {
      const response = await axios.post('/api/forgot-password/request-code', {
        email: email.trim(),
      });

      setCode(Array(OTP_LENGTH).fill(''));
      setCodeError(null);
      setCountdown(RESEND_SECONDS);
      setInfoMessage(
        response.data?.message ||
          'If an account exists for this email, a verification code has been sent.'
      );
      setStep('verify');

      addToast({
        type: 'success',
        title: 'Verification code sent',
        message:
          response.data?.message ||
          'If an account exists for this email, a verification code has been sent.',
      });
    } catch (error: any) {
      setApiError(
        error?.response?.data?.message ||
          'Unable to send a verification code right now. Please try again.'
      );
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!validateCode()) return;

    setIsVerifyingCode(true);

    try {
      const response = await axios.post('/api/forgot-password/verify-code', {
        email: email.trim(),
        code: getCodeValue(),
      });

      setInfoMessage(response.data?.message || 'Code verified. You can now reset your password.');
      setStep('reset');
    } catch (error: any) {
      setCodeError(
        error?.response?.data?.message || 'Invalid or expired verification code. Please try again.'
      );
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();

    if (!validatePasswords()) return;

    setIsResettingPassword(true);

    try {
      const response = await axios.post('/api/forgot-password/reset-password', {
        email: email.trim(),
        code: getCodeValue(),
        newPassword,
        confirmPassword,
      });

      setInfoMessage(response.data?.message || 'Your password has been reset successfully.');
      setStep('success');

      addToast({
        type: 'success',
        title: 'Password updated',
        message: response.data?.message || 'Your password has been reset successfully.',
      });
    } catch (error: any) {
      setApiError(
        error?.response?.data?.message ||
          'Unable to reset your password right now. Please try again.'
      );
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0 || isResendingCode) return;

    clearMessages();
    setCodeError(null);
    setIsResendingCode(true);

    try {
      const response = await axios.post('/api/forgot-password/request-code', {
        email: email.trim(),
      });

      setCode(Array(OTP_LENGTH).fill(''));
      setCountdown(RESEND_SECONDS);
      setInfoMessage(
        response.data?.message ||
          'If an account exists for this email, a verification code has been sent.'
      );
      codeInputRefs.current[0]?.focus();

      addToast({
        type: 'success',
        title: 'Verification code resent',
        message:
          response.data?.message ||
          'If an account exists for this email, a verification code has been sent.',
      });
    } catch (error: any) {
      setApiError(
        error?.response?.data?.message ||
          'Unable to resend the verification code right now. Please try again.'
      );
    } finally {
      setIsResendingCode(false);
    }
  };

  const handleUseAnotherEmail = () => {
    setStep('email');
    setCode(Array(OTP_LENGTH).fill(''));
    setCountdown(0);
    setCodeError(null);
    setApiError(null);
    setInfoMessage(null);
  };

  const isBusy = isSendingCode || isVerifyingCode || isResettingPassword;

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

              <div className="mt-4 flex items-center gap-2">
                {(['email', 'verify', 'reset', 'success'] as Step[]).map(item => {
                  const order: Step[] = ['email', 'verify', 'reset', 'success'];
                  const activeIndex = order.indexOf(step);
                  const itemIndex = order.indexOf(item);

                  return (
                    <div
                      key={item}
                      className={`h-2 flex-1 rounded-full transition-colors ${
                        itemIndex <= activeIndex ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  );
                })}
              </div>
            </CardHeader>
          )}

          <CardContent className="pt-6">
            {infoMessage && (
              <Alert className="mb-4 border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-100">
                <AlertDescription>{infoMessage}</AlertDescription>
              </Alert>
            )}

            {apiError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            {step === 'email' && (
              <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      setEmailError(null);
                      setApiError(null);
                    }}
                    required
                  />
                  {emailError && <p className="text-sm text-red-600">{emailError}</p>}
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSendingCode}>
                  {isSendingCode ? <Loader2 className="animate-spin" /> : 'Send Reset Code'}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-slate-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
                  >
                    <ArrowLeft size={16} /> Back to Sign In
                  </Link>
                </div>
              </form>
            )}

            {step === 'verify' && (
              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div className="space-y-3">
                  <Label>Verification Code</Label>
                  <div className="flex justify-center gap-2">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => {
                          codeInputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleCodeChange(index, e.target.value)}
                        onKeyDown={e => handleCodeKeyDown(index, e)}
                        onPaste={handleCodePaste}
                        className="w-10 h-12 text-center text-xl font-bold border-2 rounded-lg outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 bg-background"
                        aria-label={`Digit ${index + 1}`}
                      />
                    ))}
                  </div>
                  {codeError && <p className="text-sm text-red-600 text-center">{codeError}</p>}
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={isVerifyingCode}>
                  {isVerifyingCode ? <Loader2 className="animate-spin" /> : 'Verify Code'}
                </Button>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <button
                    type="button"
                    onClick={handleUseAnotherEmail}
                    disabled={isBusy}
                    className="font-medium text-slate-500 hover:text-blue-600 transition-colors disabled:opacity-50"
                  >
                    Use another email
                  </button>

                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={countdown > 0 || isResendingCode}
                    className="font-semibold text-blue-600 disabled:text-slate-400"
                  >
                    {isResendingCode
                      ? 'Resending...'
                      : countdown > 0
                      ? `Resend in ${countdown}s`
                      : 'Resend Code'}
                  </button>
                </div>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => {
                        setNewPassword(e.target.value);
                        setPasswordError(null);
                        setApiError(null);
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-slate-400"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">Password must be at least 8 characters.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => {
                        setConfirmPassword(e.target.value);
                        setPasswordError(null);
                        setApiError(null);
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-slate-400"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled={isResettingPassword}>
                  {isResettingPassword ? <Loader2 className="animate-spin" /> : 'Reset Password'}
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