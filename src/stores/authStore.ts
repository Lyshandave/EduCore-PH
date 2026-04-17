import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import type { User, AuthTokens, LoginCredentials } from '@/types';

interface AuthState {
  // State
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Session
  loginHistory: Array<{
    id: string;
    ipAddress: string;
    deviceType: string;
    browser: string;
    os: string;
    location?: string;
    createdAt: string;
  }>;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
  
  // Session management
  fetchLoginHistory: () => Promise<void>;
  terminateSession: (sessionId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      tokens: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      loginHistory: [],
      
      // Login Action
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await axios.post('/api/auth/login', credentials);
          const { user, tokens } = response.data;
          
          set({
            user,
            tokens,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          });
        }
      },
      
      // Logout Action
      logout: () => {
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          loginHistory: [],
        });
      },
      
      // Refresh Token
      refreshToken: async () => {
        const { tokens } = get();
        if (!tokens) return;
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newTokens: AuthTokens = {
            accessToken: 'new-mock-access-token',
            refreshToken: tokens.refreshToken,
            expiresIn: 3600,
          };
          
          set({ tokens: newTokens });
        } catch (error) {
          // If refresh fails, logout
          get().logout();
        }
      },
      
      // Update Profile
      updateProfile: async (data) => {
        const { user } = get();
        if (!user) return;
        
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          set({
            user: { ...user, ...data, updatedAt: new Date().toISOString() },
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Update failed',
            isLoading: false,
          });
        }
      },
      
      // Change Password
      changePassword: async (_currentPassword, _newPassword) => {
        set({ isLoading: true });
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Password change failed',
            isLoading: false,
          });
        }
      },
      
      // Clear Error
      clearError: () => set({ error: null }),
      
      // Fetch Login History
      fetchLoginHistory: async () => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const mockHistory = [
            {
              id: '1',
              ipAddress: '192.168.1.1',
              deviceType: 'Desktop',
              browser: 'Chrome',
              os: 'Windows 11',
              location: 'Manila, Philippines',
              createdAt: new Date().toISOString(),
            },
            {
              id: '2',
              ipAddress: '192.168.1.2',
              deviceType: 'Mobile',
              browser: 'Safari',
              os: 'iOS 17',
              location: 'Cebu, Philippines',
              createdAt: new Date(Date.now() - 86400000).toISOString(),
            },
          ];
          
          set({ loginHistory: mockHistory });
        } catch (error) {
          console.error('Failed to fetch login history:', error);
        }
      },
      
      // Terminate Session
      terminateSession: async (sessionId) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          const { loginHistory } = get();
          set({
            loginHistory: loginHistory.filter(s => s.id !== sessionId),
          });
        } catch (error) {
          console.error('Failed to terminate session:', error);
        }
      },
    }),
    {
      name: 'educore-auth',
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
