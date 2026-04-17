import { create } from 'zustand';
import type { Payment, StatementOfAccount, PaymentFilter, BulkOperationResult } from '@/types';

interface PaymentState {
  // Data
  payments: Payment[];
  selectedPayment: Payment | null;
  soas: StatementOfAccount[];
  selectedSOA: StatementOfAccount | null;
  
  // Pagination
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // Filters
  filters: PaymentFilter;
  
  // Loading
  isLoading: boolean;
  isBulkLoading: boolean;
  
  // Stats
  stats: {
    totalRevenue: number;
    pendingAmount: number;
    verifiedAmount: number;
    todayRevenue: number;
  };
  
  // Error
  error: string | null;
  
  // Actions
  fetchPayments: (page?: number, limit?: number) => Promise<void>;
  fetchPaymentById: (id: string) => Promise<void>;
  createPayment: (data: Partial<Payment>) => Promise<void>;
  verifyPayment: (id: string, remarks?: string) => Promise<void>;
  rejectPayment: (id: string, remarks?: string) => Promise<void>;
  
  // SOA Actions
  fetchSOAs: () => Promise<void>;
  fetchSOAByStudentId: (studentId: string) => Promise<void>;
  
  // Bulk Actions
  bulkVerifyPayments: (paymentIds: string[], remarks?: string) => Promise<BulkOperationResult>;
  bulkRejectPayments: (paymentIds: string[], remarks?: string) => Promise<BulkOperationResult>;
  
  // Filters
  setFilters: (filters: PaymentFilter) => void;
  clearFilters: () => void;
  
  // Selection
  setSelectedPayment: (payment: Payment | null) => void;
  
  // Error
  clearError: () => void;
}

// Mock Data
const mockPayments: Payment[] = [];
const mockSOAs: StatementOfAccount[] = [];

export const usePaymentStore = create<PaymentState>((set, get) => ({
  // Initial State
  payments: mockPayments,
  selectedPayment: null,
  soas: mockSOAs,
  selectedSOA: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  },
  filters: {},
  isLoading: false,
  isBulkLoading: false,
  stats: {
    totalRevenue: 0,
    pendingAmount: 0,
    verifiedAmount: 0,
    todayRevenue: 0,
  },
  error: null,
  
  // Fetch Payments
  fetchPayments: async (page = 1, limit = 20) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { filters } = get();
      let filteredPayments = [...mockPayments];
      
      if (filters.status) {
        filteredPayments = filteredPayments.filter(p => p.status === filters.status);
      }
      
      if (filters.paymentMethod) {
        filteredPayments = filteredPayments.filter(p => p.paymentMethod === filters.paymentMethod);
      }
      
      set({
        payments: filteredPayments,
        pagination: {
          page,
          limit,
          total: filteredPayments.length,
          totalPages: Math.ceil(filteredPayments.length / limit),
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch payments',
        isLoading: false,
      });
    }
  },
  
  // Fetch Payment by ID
  fetchPaymentById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const payment = mockPayments.find(p => p.id === id) || null;
      set({ selectedPayment: payment, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch payment',
        isLoading: false,
      });
    }
  },
  
  // Create Payment
  createPayment: async (data) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newPayment: Payment = {
        id: Math.random().toString(36).substring(7),
        orNumber: `OR-2024-${String(mockPayments.length + 1).padStart(4, '0')}`,
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Payment;
      
      mockPayments.push(newPayment);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create payment',
        isLoading: false,
      });
    }
  },
  
  // Verify Payment
  verifyPayment: async (id, remarks) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const index = mockPayments.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPayments[index] = {
          ...mockPayments[index],
          status: 'verified',
          verifiedBy: 'staff-1',
          verifiedAt: new Date().toISOString(),
          verificationRemarks: remarks,
          updatedAt: new Date().toISOString(),
        };
      }
      set({ 
        payments: [...mockPayments],
        isLoading: false 
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to verify payment',
        isLoading: false,
      });
    }
  },
  
  // Reject Payment
  rejectPayment: async (id, remarks) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const index = mockPayments.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPayments[index] = {
          ...mockPayments[index],
          status: 'rejected',
          verifiedBy: 'staff-1',
          verifiedAt: new Date().toISOString(),
          verificationRemarks: remarks,
          updatedAt: new Date().toISOString(),
        };
      }
      set({ 
        payments: [...mockPayments],
        isLoading: false 
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reject payment',
        isLoading: false,
      });
    }
  },
  
  // Fetch SOAs
  fetchSOAs: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ soas: mockSOAs, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch SOAs',
        isLoading: false,
      });
    }
  },
  
  // Fetch SOA by Student ID
  fetchSOAByStudentId: async (studentId) => {
    set({ isLoading: true, error: null });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const soa = mockSOAs.find(s => s.studentId === studentId) || null;
      set({ selectedSOA: soa, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch SOA',
        isLoading: false,
      });
    }
  },
  
  // Bulk Verify Payments
  bulkVerifyPayments: async (paymentIds, remarks) => {
    set({ isBulkLoading: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      paymentIds.forEach(id => {
        const payment = mockPayments.find(p => p.id === id);
        if (payment) {
          payment.status = 'verified';
          payment.verifiedBy = 'staff-1';
          payment.verifiedAt = new Date().toISOString();
          payment.verificationRemarks = remarks;
          payment.updatedAt = new Date().toISOString();
        }
      });
      
      set({ isBulkLoading: false });
      
      return {
        success: true,
        processed: paymentIds.length,
        succeeded: paymentIds.length,
        failed: 0,
        errors: [],
      };
    } catch (error) {
      set({ isBulkLoading: false });
      return {
        success: false,
        processed: paymentIds.length,
        succeeded: 0,
        failed: paymentIds.length,
        errors: [{ row: 0, identifier: 'bulk', error: error instanceof Error ? error.message : 'Bulk verification failed' }],
      };
    }
  },
  
  // Bulk Reject Payments
  bulkRejectPayments: async (paymentIds, remarks) => {
    set({ isBulkLoading: true });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      paymentIds.forEach(id => {
        const payment = mockPayments.find(p => p.id === id);
        if (payment) {
          payment.status = 'rejected';
          payment.verifiedBy = 'staff-1';
          payment.verifiedAt = new Date().toISOString();
          payment.verificationRemarks = remarks;
          payment.updatedAt = new Date().toISOString();
        }
      });
      
      set({ isBulkLoading: false });
      
      return {
        success: true,
        processed: paymentIds.length,
        succeeded: paymentIds.length,
        failed: 0,
        errors: [],
      };
    } catch (error) {
      set({ isBulkLoading: false });
      return {
        success: false,
        processed: paymentIds.length,
        succeeded: 0,
        failed: paymentIds.length,
        errors: [{ row: 0, identifier: 'bulk', error: error instanceof Error ? error.message : 'Bulk rejection failed' }],
      };
    }
  },
  
  // Set Filters
  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },
  
  // Clear Filters
  clearFilters: () => {
    set({ filters: {} });
  },
  
  // Set Selected Payment
  setSelectedPayment: (payment) => {
    set({ selectedPayment: payment });
  },
  
  // Clear Error
  clearError: () => {
    set({ error: null });
  },
}));
