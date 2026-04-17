import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Database,
  Download,
  Upload,
  HardDrive,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileArchive,
  RefreshCw,
  Shield,
  Loader2,
} from 'lucide-react';

interface BackupEntry {
  id: string;
  name: string;
  date: string;
  size: string;
  type: 'auto' | 'manual';
  status: 'completed' | 'failed';
}

const mockBackups: BackupEntry[] = [
  { id: '1', name: 'Full Backup', date: '2026-04-16 08:00 AM', size: '256 MB', type: 'auto', status: 'completed' },
  { id: '2', name: 'Full Backup', date: '2026-04-15 08:00 AM', size: '254 MB', type: 'auto', status: 'completed' },
  { id: '3', name: 'Manual Backup', date: '2026-04-14 03:22 PM', size: '253 MB', type: 'manual', status: 'completed' },
  { id: '4', name: 'Full Backup', date: '2026-04-14 08:00 AM', size: '251 MB', type: 'auto', status: 'completed' },
  { id: '5', name: 'Full Backup', date: '2026-04-13 08:00 AM', size: '248 MB', type: 'auto', status: 'failed' },
];

export function AdminSettingsPage() {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [backups, setBackups] = useState<BackupEntry[]>(mockBackups);

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    // Simulate backup creation
    await new Promise(resolve => setTimeout(resolve, 2500));
    const newBackup: BackupEntry = {
      id: Date.now().toString(),
      name: 'Manual Backup',
      date: new Date().toLocaleString('en-US', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: true,
      }),
      size: '257 MB',
      type: 'manual',
      status: 'completed',
    };
    setBackups(prev => [newBackup, ...prev]);
    setIsBackingUp(false);
    toast.success('Backup created successfully!', {
      description: 'Your data has been safely backed up.',
    });
  };

  const handleRestore = async (backup: BackupEntry) => {
    if (backup.status === 'failed') {
      toast.error('Cannot restore from a failed backup');
      return;
    }
    setIsRestoring(true);
    setRestoringId(backup.id);
    // Simulate restore
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsRestoring(false);
    setRestoringId(null);
    toast.success('System restored successfully!', {
      description: `Restored from backup: ${backup.date}`,
    });
  };

  const handleDownloadBackup = (backup: BackupEntry) => {
    if (backup.status === 'failed') {
      toast.error('Cannot download a failed backup');
      return;
    }
    toast.success('Download started!', {
      description: `Downloading ${backup.name} (${backup.size})`,
    });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">System configuration and data management</p>
      </div>

      {/* Backup Overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 dark:bg-blue-500/20">
                <HardDrive className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Backups</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{backups.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600/10 dark:bg-emerald-500/20">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Successful</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{backups.filter(b => b.status === 'completed').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600/10 dark:bg-amber-500/20">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Last Backup</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{backups[0]?.date || 'Never'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup & Restore */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                Backup & Restore
              </CardTitle>
              <CardDescription className="mt-1">Create backups and restore your system data</CardDescription>
            </div>
            <Button
              onClick={handleCreateBackup}
              disabled={isBackingUp}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/20"
            >
              {isBackingUp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <FileArchive className="h-4 w-4" />
                  Create Backup Now
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Backup Progress */}
          {isBackingUp && (
            <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/40">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                <span className="font-medium text-blue-700 dark:text-blue-300">Creating backup...</span>
              </div>
              <div className="h-2 w-full rounded-full bg-blue-200 dark:bg-blue-800 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" style={{ width: '75%' }} />
              </div>
              <p className="text-xs text-blue-500 mt-2">Please wait, this may take a few moments...</p>
            </div>
          )}

          {/* Backup List */}
          <div className="space-y-3">
            {backups.map((backup) => (
              <div
                key={backup.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4 transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    backup.status === 'completed'
                      ? 'bg-emerald-100 dark:bg-emerald-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {backup.status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 dark:text-white">{backup.name}</p>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        backup.type === 'auto'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                      }`}>
                        {backup.type === 'auto' ? 'Automatic' : 'Manual'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {backup.date} • {backup.size}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadBackup(backup)}
                    disabled={backup.status === 'failed'}
                    className="gap-1.5 text-xs"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore(backup)}
                    disabled={isRestoring || backup.status === 'failed'}
                    className="gap-1.5 text-xs text-amber-600 border-amber-200 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-900/20"
                  >
                    {restoringId === backup.id ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Restoring...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-3.5 w-3.5" />
                        Restore
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Shield className="h-4 w-4" />
            <span>Backups are encrypted and stored securely. Automatic backups run daily at 8:00 AM.</span>
          </div>
        </CardFooter>
      </Card>

      {/* Restore from File */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-amber-600" />
            Restore from File
          </CardTitle>
          <CardDescription>Upload a backup file to restore your system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 text-center transition-colors hover:border-blue-400 dark:hover:border-blue-600">
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                <Upload className="h-8 w-8 text-slate-400" />
              </div>
              <div>
                <p className="font-medium text-slate-700 dark:text-slate-300">Drop your backup file here, or click to browse</p>
                <p className="text-sm text-slate-400 mt-1">Supports .sql, .zip backup files up to 500MB</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  toast.info('File browser opened', { description: 'Select a backup file to restore' });
                }}
                className="mt-2 gap-2"
              >
                <Upload className="h-4 w-4" />
                Browse Files
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
