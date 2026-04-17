import { create } from 'zustand';

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Theme
  theme: 'light' | 'dark' | 'system';
  
  // Notifications
  toastQueue: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
  }>;
  
  // Modals
  activeModal: string | null;
  modalData: Record<string, any> | null;
  
  // Loading States
  globalLoading: boolean;
  loadingMessage: string;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Toast Actions
  addToast: (toast: Omit<UIState['toastQueue'][0], 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Modal Actions
  openModal: (modalName: string, data?: Record<string, any>) => void;
  closeModal: () => void;
  
  // Loading Actions
  setGlobalLoading: (loading: boolean, message?: string) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Initial State
  sidebarOpen: true,
  sidebarCollapsed: false,
  theme: 'light',
  toastQueue: [],
  activeModal: null,
  modalData: null,
  globalLoading: false,
  loadingMessage: '',
  
  // Sidebar Actions
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  
  // Theme Actions
  setTheme: (theme) => set({ theme }),
  
  // Toast Actions
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      toastQueue: [...state.toastQueue, { ...toast, id }],
    }));
    
    // Auto remove after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },
  
  removeToast: (id) => {
    set((state) => ({
      toastQueue: state.toastQueue.filter((t) => t.id !== id),
    }));
  },
  
  // Modal Actions
  openModal: (modalName, data) => {
    set({ activeModal: modalName, modalData: data || null });
  },
  
  closeModal: () => {
    set({ activeModal: null, modalData: null });
  },
  
  // Loading Actions
  setGlobalLoading: (loading, message = '') => {
    set({ globalLoading: loading, loadingMessage: message });
  },
}));
