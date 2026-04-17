import { create } from 'zustand';
import axios from 'axios';
import type { Staff } from '@/types';

interface StaffState {
  staff: Staff[];
  isLoading: boolean;
  error: string | null;
  
  fetchStaff: () => Promise<void>;
  createStaff: (data: any) => Promise<void>;
  updateStaff: (id: string, data: any) => Promise<void>;
  deleteStaff: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useStaffStore = create<StaffState>((set, _get) => ({
  staff: [],
  isLoading: false,
  error: null,

  fetchStaff: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/staff');
      set({ staff: response.data, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch staff', isLoading: false });
    }
  },

  createStaff: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/staff', data);
      set((state) => ({ staff: [response.data, ...state.staff], isLoading: false }));
    } catch (error) {
      set({ error: 'Failed to create staff', isLoading: false });
    }
  },

  updateStaff: async (id, data) => {
    // Implement API call later if needed
    set((state) => ({
      staff: state.staff.map(s => s.id === id ? { ...s, ...data } : s)
    }));
  },

  deleteStaff: async (id) => {
    // Implement API call later if needed
    set((state) => ({
      staff: state.staff.filter(s => s.id !== id)
    }));
  },

  clearError: () => set({ error: null }),
}));
