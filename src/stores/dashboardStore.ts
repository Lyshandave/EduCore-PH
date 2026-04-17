import { create } from 'zustand';
import axios from 'axios';
import type { DashboardStats, Task, Notification } from '@/types';

interface DashboardState {
  // Stats
  stats: DashboardStats | null;
  
  // Tasks
  tasks: Task[];
  pendingTasks: number;
  urgentTasks: number;
  
  // Notifications
  notifications: Notification[];
  unreadNotifications: number;
  
  // Loading
  isLoading: boolean;
  
  // Error
  error: string | null;
  
  // Actions
  fetchDashboardStats: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  
  // Task Actions
  completeTask: (taskId: string) => Promise<void>;
  
  // Notification Actions
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  
  // Error
  clearError: () => void;
}

// Mock Data (Initial fallback)
const mockStats: DashboardStats = {
  totalStudents: 0,
  newStudents: 0,
  returningStudents: 0,
  droppedStudents: 0,
  
  totalEnrollments: 0,
  pendingEnrollments: 0,
  approvedEnrollments: 0,
  rejectedEnrollments: 0,
  
  totalRevenue: 0,
  pendingPayments: 0,
  verifiedPayments: 0,
  rejectedPayments: 0,
  
  prelimsCollection: 0,
  midtermsCollection: 0,
  finalsCollection: 0,
  
  branchStats: [],
  enrollmentTrend: [],
  paymentTrend: [],
  
  pendingTasks: 0,
  urgentTasks: 0,
  completedTasks: 0,
};

const mockTasks: Task[] = [];
const mockNotifications: Notification[] = [];

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial State
  stats: mockStats,
  tasks: mockTasks,
  pendingTasks: 0,
  urgentTasks: 0,
  notifications: mockNotifications,
  unreadNotifications: 0,
  isLoading: false,
  error: null,
  
  // Fetch Dashboard Stats
  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await axios.get('/api/dashboard/stats');
      set({ stats: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch dashboard stats',
        isLoading: false,
      });
    }
  },
  
  // Fetch Tasks
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const pendingTasks = mockTasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
      const urgentTasks = mockTasks.filter(t => t.priority === 'urgent' && (t.status === 'pending' || t.status === 'in_progress')).length;
      
      set({
        tasks: mockTasks,
        pendingTasks,
        urgentTasks,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
        isLoading: false,
      });
    }
  },
  
  // Fetch Notifications
  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const unreadNotifications = mockNotifications.filter(n => !n.read).length;
      
      set({
        notifications: mockNotifications,
        unreadNotifications,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        isLoading: false,
      });
    }
  },
  
  // Complete Task
  completeTask: async (taskId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const { tasks } = get();
      const updatedTasks = tasks.map(t =>
        t.id === taskId
          ? { ...t, status: 'completed' as const, completedAt: new Date().toISOString() }
          : t
      );
      
      const pendingTasks = updatedTasks.filter(t => t.status === 'pending' || t.status === 'in_progress').length;
      const urgentTasks = updatedTasks.filter(t => t.priority === 'urgent' && (t.status === 'pending' || t.status === 'in_progress')).length;
      
      set({ tasks: updatedTasks, pendingTasks, urgentTasks });
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  },
  
  // Mark Notification as Read
  markNotificationAsRead: async (notificationId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const { notifications } = get();
      const updatedNotifications = notifications.map(n =>
        n.id === notificationId
          ? { ...n, read: true, readAt: new Date().toISOString() }
          : n
      );
      
      const unreadNotifications = updatedNotifications.filter(n => !n.read).length;
      
      set({ notifications: updatedNotifications, unreadNotifications });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },
  
  // Mark All Notifications as Read
  markAllNotificationsAsRead: async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const { notifications } = get();
      const updatedNotifications = notifications.map(n =>
        !n.read
          ? { ...n, read: true, readAt: new Date().toISOString() }
          : n
      );
      
      set({ notifications: updatedNotifications, unreadNotifications: 0 });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },
  
  // Clear Error
  clearError: () => {
    set({ error: null });
  },
}));
