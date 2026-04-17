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
  Save,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Pencil,
  X,
  Building2,
  GraduationCap,
  Calendar,
  Hash,
  Users2,
  BookOpen,
  Upload,
} from 'lucide-react';

export function StudentProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);

  // Mock student-specific data
  const studentData = {
    studentId: user?.studentId || '241023',
    branch: 'Main Campus',
    section: 'BSIT-3A',
    yearLevel: '3rd Year',
    gender: 'Male',
    birthdate: '2003-05-15',
    course: 'BS Information Technology',
    enrollmentStatus: 'Enrolled',
    academicYear: '2025-2026',
  };

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    middleName: user?.middleName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    gender: studentData.gender,
    birthdate: studentData.birthdate,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      toast.success('Profile picture uploaded!');
    }
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
        address: formData.address || undefined,
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      firstName: user?.firstName || '',
      middleName: user?.middleName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      gender: studentData.gender,
      birthdate: studentData.birthdate,
    });
  };

  const formatBirthdate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const avatarSrc = previewAvatar || user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">View and manage your student profile</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit Info
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleCancelEdit} className="gap-1.5">
              <X className="h-4 w-4" />
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
            <CardTitle className="text-lg">Student Photo</CardTitle>
            <CardDescription>Upload your picture</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative group">
              <div className="h-36 w-36 overflow-hidden rounded-full border-4 border-white shadow-xl dark:border-slate-800 ring-4 ring-violet-100 dark:ring-violet-900/30">
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg transition-all hover:bg-violet-700"
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
              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{studentData.studentId}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-1 text-xs font-semibold text-white">
                <GraduationCap className="h-3 w-3" />
                {studentData.course}
              </div>
            </div>

            {/* Upload Picture Button */}
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 w-full mt-2"
            >
              <Upload className="h-4 w-4" />
              Upload Picture
            </Button>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Academic Info */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40">
            <CardContent className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1">
                    <Hash className="h-3 w-3" /> Student ID
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white font-mono text-lg">{studentData.studentId}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> Branch
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white">{studentData.branch}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1">
                    <Users2 className="h-3 w-3" /> Section
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white">{studentData.section}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400 flex items-center gap-1">
                    <BookOpen className="h-3 w-3" /> Year Level
                  </p>
                  <p className="font-bold text-slate-900 dark:text-white">{studentData.yearLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Academic Info */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <User className="h-3 w-3" /> Gender
                  </p>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm font-semibold"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="font-bold text-slate-900 dark:text-white">{formData.gender}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Birthdate
                  </p>
                  {isEditing ? (
                    <Input
                      type="date"
                      name="birthdate"
                      value={formData.birthdate}
                      onChange={handleChange}
                      className="font-semibold"
                    />
                  ) : (
                    <p className="font-bold text-slate-900 dark:text-white">{formatBirthdate(formData.birthdate)}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</p>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{studentData.enrollmentStatus}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-violet-600" />
                Personal Information
              </CardTitle>
              <CardDescription>Your contact details and basic info</CardDescription>
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
                    className="disabled:opacity-70 disabled:cursor-default transition-all"
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
                    className="disabled:opacity-70 disabled:cursor-default transition-all"
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
                    className="disabled:opacity-70 disabled:cursor-default transition-all"
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
                  <p className="text-[11px] text-slate-400">Contact registrar to change email</p>
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
                    className="disabled:opacity-70 disabled:cursor-default transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter your complete address"
                  className="disabled:opacity-70 disabled:cursor-default transition-all"
                />
              </div>
            </CardContent>
            {isEditing && (
              <CardFooter className="justify-end gap-2">
                <Button variant="ghost" onClick={handleCancelEdit}>Cancel</Button>
                <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
                  <Save className="h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
