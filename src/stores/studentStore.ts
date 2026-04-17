import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import type { Student, Enrollment, StudentFilter, BulkOperationResult, UserStatus } from '@/types';

interface StudentState {
  // Data
  students: Student[];
  selectedStudent: Student | null;
  enrollments: Enrollment[];
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Filters
  filters: StudentFilter;
  
  // Loading
  isLoading: boolean;
  isBulkLoading: boolean;
  
  // Error
  error: string | null;
  
  // Actions
  fetchStudents: (page?: number, limit?: number) => Promise<void>;
  fetchStudentById: (id: string) => Promise<void>;
  createStudent: (data: any) => Promise<void>; // Use any for simplicity in mock
  updateStudent: (id: string, data: any) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;
  
  // Bulk Actions
  bulkApproveStudents: (ids: string[], remarks?: string) => Promise<BulkOperationResult>;
  bulkRejectStudents: (ids: string[], remarks?: string) => Promise<BulkOperationResult>;
  bulkEnrollStudents: (file: File) => Promise<BulkOperationResult>;
  
  // Filters
  setFilters: (filters: StudentFilter) => void;
  clearFilters: () => void;
  
  // Selection
  setSelectedStudent: (student: Student | null) => void;
  
  // Error
  clearError: () => void;
}


export const useStudentStore = create<StudentState>()(
  persist(
    (set, get) => ({
      students: [],
      selectedStudent: null,
      enrollments: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
      },
      filters: {},
      isLoading: false,
      isBulkLoading: false,
      error: null,

      fetchStudents: async (page = 1, limit = 20) => {
        set({ isLoading: true });
        try {
          const response = await axios.get('/api/students', {
            params: { page, limit }
          });
          const students = response.data;
          set({
            students,
            pagination: {
              page,
              limit,
              total: students.length,
              totalPages: Math.ceil(students.length / limit),
            },
            isLoading: false,
          });
        } catch (error) {
          set({ error: 'Failed to fetch students', isLoading: false });
        }
      },

      fetchStudentById: async (id) => {
        const student = get().students.find(s => s.id === id) || null;
        set({ selectedStudent: student });
      },

      createStudent: async (data: any) => {
        set({ isLoading: true });
        try {
          const response = await axios.post('/api/students', data);
          set((state) => ({
            students: [...state.students, response.data],
            isLoading: false
          }));
        } catch (error) {
          set({ error: 'Failed to create student', isLoading: false });
        }
      },

      updateStudent: async (id, data) => {
        set((state) => ({
          students: state.students.map(s => s.id === id ? { ...s, ...data, updatedAt: new Date().toISOString() } : s),
        }));
      },

      deleteStudent: async (id) => {
        set((state) => ({
          students: state.students.filter(s => s.id !== id),
        }));
      },

      bulkApproveStudents: async (ids) => {
        set({ isBulkLoading: true });
        await new Promise(resolve => setTimeout(resolve, 800));
        set((state) => ({
          students: state.students.map(s => ids.includes(s.id) ? { 
            ...s, 
            status: 'active' as UserStatus, 
            enrollmentStatus: 'approved' 
          } : s),
          isBulkLoading: false
        }));
        return { success: true, processed: ids.length, succeeded: ids.length, failed: 0, errors: [] };
      },

      bulkRejectStudents: async (ids) => {
        set({ isBulkLoading: true });
        await new Promise(resolve => setTimeout(resolve, 800));
        set((state) => ({
          students: state.students.map(s => ids.includes(s.id) ? { 
            ...s, 
            enrollmentStatus: 'rejected'
          } : s),
          isBulkLoading: false
        }));
        return { success: true, processed: ids.length, succeeded: ids.length, failed: 0, errors: [] };
      },

      bulkEnrollStudents: async () => {
        return { success: true, processed: 0, succeeded: 0, failed: 0, errors: [] };
      },

      setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
      clearFilters: () => set({ filters: {} }),
      setSelectedStudent: (student) => set({ selectedStudent: student }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'educore-students-v2',
    }
  )
);