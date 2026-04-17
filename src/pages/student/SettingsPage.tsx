import { useState } from 'react';
import { useAuthStore, useUIStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  User, 
  Shield} from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuthStore();
  const { addToast } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      addToast({
        type: 'success',
        title: 'Settings saved',
        message: 'Your preferences have been updated successfully.',
      });
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your account preferences and security settings.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Account Settings */}
        <Card border-slate-200 dark:border-slate-800>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <CardTitle>Account Settings</CardTitle>
            </div>
            <CardDescription>Update your basic account information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={user?.email} disabled className="bg-slate-50 dark:bg-slate-900" />
                <p className="text-xs text-slate-500">Email cannot be changed. Contact admin for assistance.</p>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input placeholder="+63 912 345 6789" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card border-slate-200 dark:border-slate-800>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your password and security options.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-slate-500">Secure your account with an extra layer of security.</p>
              </div>
              <Switch defaultChecked={user?.twoFactorEnabled} />
            </div>
            <Separator />
            <div className="space-y-4">
              <Label>Change Password</Label>
              <div className="grid gap-4 md:grid-cols-3">
                <Input type="password" placeholder="Current Password" />
                <Input type="password" placeholder="New Password" />
                <Input type="password" placeholder="Confirm New Password" />
              </div>
              <Button variant="outline" size="sm">Update Password</Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card border-slate-200 dark:border-slate-800>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you receive alerts and updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-500">Receive academic updates via email.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-slate-500">Receive real-time alerts on your device.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
