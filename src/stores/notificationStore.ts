import { create } from 'zustand';
import type { Notification } from '@/types';

interface NotificationState {
  notifications: Notification[];
  unreadNotifications: number;
  isLoading: boolean;

  // Actions
  fetchNotifications: (role?: string) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
}

// Role-specific mock notifications
const adminNotifications: Notification[] = [
  {
    id: 'admin-1',
    userId: 'admin-1',
    title: 'New Payment Received',
    message: 'A new payment of ₱25,000 has been received from Juan Dela Cruz',
    type: 'success',
    link: '/admin/payments',
    linkText: 'View Payment',
    read: false,
    sourceType: 'payment',
    sourceId: '1',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'admin-2',
    userId: 'admin-1',
    title: 'Enrollment Pending',
    message: '50 new student enrollments are pending approval',
    type: 'warning',
    link: '/admin/students',
    linkText: 'Review Enrollments',
    read: false,
    sourceType: 'enrollment',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'admin-3',
    userId: 'admin-1',
    title: 'Task Assigned',
    message: 'You have been assigned a new high-priority task',
    type: 'info',
    read: true,
    readAt: new Date(Date.now() - 1800000).toISOString(),
    sourceType: 'task',
    sourceId: '2',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'admin-4',
    userId: 'admin-1',
    title: 'System Maintenance',
    message: 'System maintenance scheduled for tonight at 2:00 AM',
    type: 'info',
    read: false,
    sourceType: 'system',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'admin-5',
    userId: 'admin-1',
    title: 'Payment Verification Failed',
    message: 'Payment verification failed for OR-2024-0003. Needs manual review.',
    type: 'error',
    link: '/admin/payments',
    linkText: 'Review Payment',
    read: true,
    readAt: new Date(Date.now() - 3600000).toISOString(),
    sourceType: 'payment',
    sourceId: '3',
    createdAt: new Date(Date.now() - 18000000).toISOString(),
  },
  {
    id: 'admin-6',
    userId: 'admin-1',
    title: 'New Staff Registration',
    message: 'A new staff member Maria Santos has been registered at North Campus',
    type: 'info',
    link: '/admin/staff',
    linkText: 'View Staff',
    read: false,
    sourceType: 'staff',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: 'admin-7',
    userId: 'admin-1',
    title: 'Backup Completed',
    message: 'Automatic system backup was completed successfully at 8:00 AM',
    type: 'success',
    link: '/admin/settings',
    linkText: 'View Backups',
    read: true,
    readAt: new Date(Date.now() - 25200000).toISOString(),
    sourceType: 'system',
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
];

const staffNotifications: Notification[] = [
  {
    id: 'staff-1',
    userId: 'staff-1',
    title: 'New Payment Received',
    message: 'A new payment of ₱25,000 has been received from Juan Dela Cruz',
    type: 'success',
    link: '/staff/payments',
    linkText: 'View Payment',
    read: false,
    sourceType: 'payment',
    sourceId: '1',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'staff-2',
    userId: 'staff-1',
    title: 'Enrollment Pending',
    message: '50 new student enrollments are pending approval',
    type: 'warning',
    link: '/staff/students',
    linkText: 'Review Enrollments',
    read: false,
    sourceType: 'enrollment',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'staff-3',
    userId: 'staff-1',
    title: 'Task Assigned',
    message: 'You have been assigned a new high-priority task',
    type: 'info',
    read: true,
    readAt: new Date(Date.now() - 1800000).toISOString(),
    sourceType: 'task',
    sourceId: '2',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'staff-4',
    userId: 'staff-1',
    title: 'System Maintenance',
    message: 'System maintenance scheduled for tonight at 2:00 AM',
    type: 'info',
    read: false,
    sourceType: 'system',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'staff-5',
    userId: 'staff-1',
    title: 'Grade Submission Deadline',
    message: 'Reminder: Grade submission for Prelims is due in 3 days',
    type: 'warning',
    link: '/staff/grades',
    linkText: 'Submit Grades',
    read: false,
    sourceType: 'grade',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: 'staff-6',
    userId: 'staff-1',
    title: 'Schedule Updated',
    message: 'Your class schedule for Monday has been updated by admin',
    type: 'info',
    link: '/staff/schedule',
    linkText: 'View Schedule',
    read: true,
    readAt: new Date(Date.now() - 36000000).toISOString(),
    sourceType: 'schedule',
    createdAt: new Date(Date.now() - 43200000).toISOString(),
  },
];

const studentNotifications: Notification[] = [
  {
    id: 'student-1',
    userId: 'student-1',
    title: 'Payment Confirmed',
    message: 'Your payment of ₱15,000 for Prelims has been verified and confirmed',
    type: 'success',
    link: '/student/payments',
    linkText: 'View Receipt',
    read: false,
    sourceType: 'payment',
    sourceId: '1',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'student-2',
    userId: 'student-1',
    title: 'Exam Permit Available',
    message: 'Your Prelims exam permit is now available for download',
    type: 'success',
    link: '/student/permits',
    linkText: 'Download Permit',
    read: false,
    sourceType: 'permit',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'student-3',
    userId: 'student-1',
    title: 'Grades Published',
    message: 'Your Prelims grades have been published. Check your grades now.',
    type: 'info',
    link: '/student/grades',
    linkText: 'View Grades',
    read: false,
    sourceType: 'grade',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'student-4',
    userId: 'student-1',
    title: 'Payment Reminder',
    message: 'Your Midterms payment of ₱15,000 is due in 5 days',
    type: 'warning',
    link: '/student/payments',
    linkText: 'Make Payment',
    read: false,
    sourceType: 'payment',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'student-5',
    userId: 'student-1',
    title: 'New Announcement',
    message: 'A new announcement has been posted: "Midterm Exam Schedule Released"',
    type: 'info',
    link: '/student/announcements',
    linkText: 'Read Announcement',
    read: true,
    readAt: new Date(Date.now() - 18000000).toISOString(),
    sourceType: 'announcement',
    createdAt: new Date(Date.now() - 21600000).toISOString(),
  },
  {
    id: 'student-6',
    userId: 'student-1',
    title: 'Schedule Change',
    message: 'Your Wednesday class has been rescheduled to Room 302',
    type: 'warning',
    link: '/student/schedule',
    linkText: 'View Schedule',
    read: true,
    readAt: new Date(Date.now() - 25200000).toISOString(),
    sourceType: 'schedule',
    createdAt: new Date(Date.now() - 28800000).toISOString(),
  },
];

const getNotificationsByRole = (role?: string): Notification[] => {
  switch (role) {
    case 'admin':
      return adminNotifications;
    case 'staff':
      return staffNotifications;
    case 'student':
      return studentNotifications;
    default:
      return adminNotifications;
  }
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadNotifications: 0,
  isLoading: false,

  fetchNotifications: async (role?: string) => {
    set({ isLoading: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const notifications = getNotificationsByRole(role);
      const unreadNotifications = notifications.filter(n => !n.read).length;
      
      set({
        notifications,
        unreadNotifications,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const { notifications } = get();
    const updated = [newNotification, ...notifications];
    const unreadNotifications = updated.filter(n => !n.read).length;

    set({ notifications: updated, unreadNotifications });
  },

  markNotificationAsRead: (notificationId) => {
    const { notifications } = get();
    const updated = notifications.map(n =>
      n.id === notificationId
        ? { ...n, read: true, readAt: new Date().toISOString() }
        : n
    );
    const unreadNotifications = updated.filter(n => !n.read).length;
    set({ notifications: updated, unreadNotifications });
  },

  markAllNotificationsAsRead: () => {
    const { notifications } = get();
    const updated = notifications.map(n =>
      !n.read ? { ...n, read: true, readAt: new Date().toISOString() } : n
    );
    set({ notifications: updated, unreadNotifications: 0 });
  },

  deleteNotification: (notificationId) => {
    const { notifications } = get();
    const updated = notifications.filter(n => n.id !== notificationId);
    const unreadNotifications = updated.filter(n => !n.read).length;
    set({ notifications: updated, unreadNotifications });
  },

  clearAllNotifications: () => {
    set({ notifications: [], unreadNotifications: 0 });
  },
}));
