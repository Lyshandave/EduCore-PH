import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore, useUIStore } from '@/stores';
import { SIDEBAR_MENU } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LayoutDashboard,
  Users,
  UserCog,
  UserPlus,
  CreditCard,
  GraduationCap,
  FileCheck,
  Calendar,
  MessageSquare,
  Megaphone,
  ClipboardList,
  Settings,
  CheckSquare,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  School,
  X,
  Building2,
  BookOpen,
  Star,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  UserCog,
  UserPlus,
  CreditCard,
  GraduationCap,
  FileCheck,
  Calendar,
  MessageSquare,
  Megaphone,
  ClipboardList,
  Settings,
  CheckSquare,
  User,
  FileText,
  Building2,
  BookOpen,
  Star,
};

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();

  const role = user?.role || 'student';
  const menuItems = SIDEBAR_MENU[role as keyof typeof SIDEBAR_MENU] || [];

  const handleNavigation = (path: string) => {
    navigate(path);
    onMobileClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600">
            <School className="h-6 w-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                EduCore
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                PH
              </span>
            </div>
          )}
        </div>
        
        {/* Mobile Close Button */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Desktop Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 text-slate-500" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-500" />
          )}
        </button>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const active = isActive(item.path);

            return sidebarCollapsed ? (
              <TooltipProvider key={item.path} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={cn(
                        'flex w-full items-center justify-center rounded-xl p-3 transition-all duration-200',
                        active
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </ScrollArea>

    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 hidden h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-950 lg:flex print:hidden',
          sidebarCollapsed ? 'w-20' : 'w-72'
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 lg:hidden print:hidden',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
