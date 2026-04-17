import { useNavigate } from 'react-router-dom';
import { useAuthStore, useNotificationStore } from '@/stores';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatRelativeTime } from '@/lib/utils';
import {
  Menu,
  Bell,
  Settings,
  User,
  LogOut,
  CheckCheck,
  Moon,
  Sun,
  Trash2,
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
  onLogout: () => void;
}

export function Header({ onMenuClick, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    notifications,
    unreadNotifications,
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
  } = useNotificationStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    fetchNotifications(user?.role);
  }, [user?.role]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }
    // Navigate to the correct role-prefixed path
    if (notification.link) {
      const role = user?.role || 'student';
      // If the link already starts with a role prefix, use it directly
      if (notification.link.startsWith(`/${role}/`)) {
        navigate(notification.link);
      } else {
        // Prepend the role prefix
        navigate(`/${role}${notification.link.startsWith('/') ? '' : '/'}${notification.link}`);
      }
    }
  };

  // Determine which dropdown items to show based on role

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 print:hidden">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hidden sm:flex"
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">Notifications</span>
                {unreadNotifications > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllNotificationsAsRead}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 gap-1.5 h-8 text-xs"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Mark all read
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[380px]">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 mb-3">
                      <Bell className="h-8 w-8 opacity-40" />
                    </div>
                    <p className="font-medium">No notifications</p>
                    <p className="text-sm text-slate-400 mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="py-1">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800/50 last:border-0',
                          !notification.read && 'bg-blue-50/60 dark:bg-blue-900/10'
                        )}
                      >
                        {/* Notification dot */}
                        <div className="mt-1.5 flex-shrink-0" onClick={() => handleNotificationClick(notification)}>
                          <div
                            className={cn(
                              'h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900',
                              notification.type === 'success' && 'bg-emerald-500',
                              notification.type === 'error' && 'bg-red-500',
                              notification.type === 'warning' && 'bg-amber-500',
                              notification.type === 'info' && 'bg-blue-500'
                            )}
                          />
                        </div>
                        {/* Content */}
                        <div className="flex-1 min-w-0" onClick={() => handleNotificationClick(notification)}>
                          <div className="flex items-start justify-between gap-2">
                            <p className={cn(
                              'text-sm leading-tight',
                              !notification.read ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'
                            )}>
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <Badge className="flex-shrink-0 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 border-0 text-[10px] px-1.5 py-0 font-semibold">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-snug">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {formatRelativeTime(notification.createdAt)}
                          </p>
                        </div>
                        {/* Delete button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="mt-1 flex-shrink-0 p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                          style={{ opacity: 1 }}
                          title="Delete notification"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden ring-2 ring-transparent hover:ring-slate-100 transition-all">
              <img
                src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`}
                alt={user?.firstName}
                className="h-full w-full object-cover rounded-full"
              />
            </Button>
          </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.firstName} {user?.lastName}</span>
                  <span className="text-xs text-slate-500">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate(`/${user?.role}/profile`)}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/${user?.role}/settings`)}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
