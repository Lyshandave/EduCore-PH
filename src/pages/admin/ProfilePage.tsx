import { useState, useRef } from 'react';
import { useAuthStore } from '@/stores';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Camera,
  Trash2,
  Save,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle2,
  User,
  Mail,
  Phone,
} from 'lucide-react';

export function AdminProfilePage() {
  const { user, updateProfile, changePassword } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error('Only JPG and PNG files are allowed');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Profile picture updated!');
    }
  };

  const handleRemoveAvatar = () => {
    setPreviewAvatar(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    toast.success('Profile picture removed');
  };

  const handleSaveProfile = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }
    setIsSaving(true);
    try {
      await updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName || undefined,
        phone: formData.phone || undefined,
        avatar: previewAvatar || user?.avatar,
      });
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsChangingPassword(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success('Password changed successfully!');
    } catch {
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const avatarSrc = previewAvatar || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your admin account information</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => { setIsEditing(false); setFormData({ firstName: user?.firstName || '', middleName: user?.middleName || '', lastName: user?.lastName || '', email: user?.email || '', phone: user?.phone || '' }); }}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Picture Card */}
        <Card className="lg:col-span-1 border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-lg">Profile Picture</CardTitle>
            <CardDescription>Your public avatar</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-xl dark:border-slate-800 ring-4 ring-blue-100 dark:ring-blue-900/30">
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:bg-blue-700"
              >
                <Camera className="h-5 w-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {user?.firstName} {user?.middleName ? `${user.middleName.charAt(0)}.` : ''} {user?.lastName}
              </h3>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                <Shield className="h-3 w-3" />
                Administrator
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1.5">
                <Camera className="h-3.5 w-3.5" />
                Change
              </Button>
              {(previewAvatar || user?.avatar) && (
                <Button variant="ghost" size="sm" onClick={handleRemoveAvatar} className="gap-1.5 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Personal Information
            </CardTitle>
            <CardDescription>Your basic account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">First Name <span className="text-red-500">*</span></Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="disabled:opacity-70 disabled:cursor-default transition-all focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName" className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Middle Name <span className="text-slate-400 text-[10px] normal-case">(optional)</span></Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter middle name"
                  className="disabled:opacity-70 disabled:cursor-default transition-all focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Last Name <span className="text-red-500">*</span></Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="disabled:opacity-70 disabled:cursor-default transition-all focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="disabled:opacity-70 disabled:cursor-default bg-slate-50 dark:bg-slate-900"
                />
                <p className="text-[11px] text-slate-400">Email cannot be changed here. Contact super admin.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5" /> Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="+63 912 345 6789"
                  className="disabled:opacity-70 disabled:cursor-default transition-all focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Role</Label>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2.5 bg-slate-50 dark:bg-slate-900">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-slate-900 dark:text-white capitalize">{user?.role}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Account Status</Label>
                <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2.5 bg-slate-50 dark:bg-slate-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Active</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Password Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-amber-600" />
            Change Password
          </CardTitle>
          <CardDescription>Update your password to keep your account secure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordData.newPassword && passwordData.newPassword.length < 8 && (
                <p className="text-xs text-red-500">Must be at least 8 characters</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleChangePassword}
            disabled={isChangingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            <Lock className="h-4 w-4" />
            {isChangingPassword ? 'Changing...' : 'Update Password'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
