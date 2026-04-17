// ============================================
// EduCore PH - Enterprise School System
// Type Definitions
// ============================================

// User Roles
export type UserRole = 'admin' | 'staff' | 'student';

// User Status
export type UserStatus = 'active' | 'inactive' | 'pending' | 'locked' | 'suspended';

// Education Levels
export type EducationLevel = 'shs' | 'college';

// SHS Strands
export type SHSStrand = 'stem' | 'abm' | 'humss' | 'gas' | 'tvl';

// College Courses
export type CollegeCourse = 'bsit' | 'bscs' | 'bsba' | 'bsaccountancy' | 'bsnursing' | 'bseducation' | 'bsengineering';

// Year Levels
export type YearLevel = 'g11' | 'g12' | '1st' | '2nd' | '3rd' | '4th';

// Payment Status
export type PaymentStatus = 'paid' | 'partial' | 'unpaid' | 'overdue' | 'pending';

// Payment Methods
export type PaymentMethod = 'gcash' | 'maya' | 'bdo' | 'cash' | 'check';

// Permit Status
export type PermitStatus = 'generated' | 'downloaded' | 'used' | 'expired';

// Message Priority
export type MessagePriority = 'low' | 'medium' | 'high' | 'urgent';

// Message Status
export type MessageStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

// Announcement Type
export type AnnouncementType = 'global' | 'branch' | 'course' | 'section';

// ============================================
// BASE USER INTERFACE
// ============================================
export interface User {
  id: string;
  email: string;
  studentId?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  address?: string;
  branchId: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
}

// ============================================
// BRANCH INTERFACE
// ============================================
export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  province: string;
  zipCode: string;
  phone: string;
  email: string;
  principalName?: string;
  status: 'active' | 'inactive';
  maxStudents: number;
  currentStudents: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// ACADEMIC YEAR INTERFACE
// ============================================
export interface AcademicYear {
  id: string;
  yearStart: number;
  yearEnd: number;
  label: string;
  status: 'upcoming' | 'active' | 'completed';
  enrollmentStartDate: string;
  enrollmentEndDate: string;
  semesterStartDate: string;
  semesterEndDate: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// COURSE/STRAND INTERFACE
// ============================================
export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  educationLevel: EducationLevel;
  strand?: SHSStrand;
  courseCode?: CollegeCourse;
  durationYears: number;
  status: 'active' | 'inactive';
  tuitionFeePerUnit: number;
  miscellaneousFee: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// SECTION INTERFACE
// ============================================
export interface Section {
  id: string;
  name: string;
  code: string;
  courseId: string;
  yearLevel: YearLevel;
  academicYearId: string;
  branchId: string;
  adviserId?: string;
  maxStudents: number;
  currentStudents: number;
  room?: string;
  schedule?: string;
  status: 'active' | 'inactive' | 'full';
  createdAt: string;
  updatedAt: string;
}

// ============================================
// STUDENT INTERFACE
// ============================================
export interface Student extends User {
  studentId: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  civilStatus: 'single' | 'married' | 'widowed' | 'separated';
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  
  // Academic Info
  educationLevel: EducationLevel;
  courseId: string;
  yearLevel: YearLevel;
  sectionId?: string;
  academicYearId: string;
  
  // Previous School
  previousSchool?: string;
  previousSchoolAddress?: string;
  
  // Documents
  documents?: StudentDocument[];
  
  // Enrollment Status
  enrollmentStatus: 'pending' | 'approved' | 'rejected' | 'enrolled' | 'dropped' | 'graduated';
  enrollmentDate?: string;
  
  // Payment Info
  paymentStatus: PaymentStatus;
  totalBalance: number;
  
  // Guardian Info
  guardianName?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  guardianRelation?: string;
}

// ============================================
// STUDENT DOCUMENT INTERFACE
// ============================================
export interface StudentDocument {
  id: string;
  studentId: string;
  name: string;
  type: 'birth_certificate' | 'transcript' | 'id_photo' | 'good_moral' | 'medical' | 'other';
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
}

// ============================================
// STAFF INTERFACE
// ============================================
export interface Staff extends User {
  name: string;
  employeeId: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  department: string;
  position: string;
  hireDate: string;
  
  // Permissions
  permissions: StaffPermission[];
  
  // Work Schedule
  workSchedule?: WorkSchedule;
  
  // Performance
  performanceRating?: number;
  
  // Supervisor
  supervisorId?: string;
}

// ============================================
// STAFF PERMISSION INTERFACE
// ============================================
export interface StaffPermission {
  id: string;
  module: string;
  actions: ('view' | 'create' | 'edit' | 'delete' | 'approve' | 'export')[];
}

// ============================================
// WORK SCHEDULE INTERFACE
// ============================================
export interface WorkSchedule {
  id: string;
  staffId: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isWorkingDay: boolean;
}

// ============================================
// ADMIN INTERFACE
// ============================================
export interface Admin extends User {
  employeeId: string;
  department: string;
  position: string;
  hireDate: string;
  
  // Super Admin Flag
  isSuperAdmin: boolean;
  
  // Permissions
  permissions: AdminPermission[];
  
  // Managed Branches (for non-super admins)
  managedBranchIds?: string[];
}

// ============================================
// ADMIN PERMISSION INTERFACE
// ============================================
export interface AdminPermission {
  id: string;
  module: string;
  actions: ('view' | 'create' | 'edit' | 'delete' | 'approve' | 'export' | 'configure')[];
}

// ============================================
// ENROLLMENT INTERFACE
// ============================================
export interface Enrollment {
  id: string;
  studentId: string;
  academicYearId: string;
  courseId: string;
  yearLevel: YearLevel;
  sectionId?: string;
  branchId: string;
  
  // Enrollment Details
  enrollmentType: 'new' | 'transfer' | 'returning';
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'enrolled' | 'cancelled';
  
  // Dates
  applicationDate: string;
  reviewDate?: string;
  approvalDate?: string;
  enrollmentDate?: string;
  
  // Reviewer
  reviewedBy?: string;
  approvedBy?: string;
  
  // Remarks
  remarks?: string;
  
  // Documents Submitted
  documentsSubmitted: string[];
  
  // Payment
  enrollmentFee: number;
  enrollmentFeePaid: boolean;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// PAYMENT INTERFACE
// ============================================
export interface Payment {
  id: string;
  studentId: string;
  orNumber: string;
  
  // Payment Details
  amount: number;
  paymentMethod: PaymentMethod;
  paymentFor: 'enrollment' | 'tuition' | 'miscellaneous' | 'other';
  paymentTerm?: 'prelims' | 'midterms' | 'finals';
  
  // Reference
  referenceNumber?: string;
  
  // Proof
  proofImageUrl?: string;
  
  // Status
  status: 'pending' | 'verified' | 'rejected';
  
  // Verification
  verifiedBy?: string;
  verifiedAt?: string;
  verificationRemarks?: string;
  
  // Dates
  paymentDate: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// STATEMENT OF ACCOUNT INTERFACE
// ============================================
export interface StatementOfAccount {
  id: string;
  studentId: string;
  academicYearId: string;
  
  // Fees
  enrollmentFee: number;
  tuitionFee: number;
  miscellaneousFee: number;
  otherFees: number;
  totalAmount: number;
  
  // Payments
  totalPaid: number;
  totalDiscount: number;
  balance: number;
  
  // Term Breakdown
  prelims: TermPayment;
  midterms: TermPayment;
  finals: TermPayment;
  
  // Status
  status: PaymentStatus;
  
  // Due Dates
  prelimsDueDate: string;
  midtermsDueDate: string;
  finalsDueDate: string;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// TERM PAYMENT INTERFACE
// ============================================
export interface TermPayment {
  amount: number;
  paid: number;
  balance: number;
  dueDate: string;
  status: PaymentStatus;
}

// ============================================
// EXAM PERMIT INTERFACE
// ============================================
export interface ExamPermit {
  id: string;
  studentId: string;
  permitNumber: string;
  
  // Exam Details
  examType: 'prelims' | 'midterms' | 'finals' | 'special';
  academicYearId: string;
  courseId: string;
  
  // Generation
  generatedAt: string;
  generatedBy: string;
  
  // Validity
  validFrom: string;
  validUntil: string;
  
  // QR Code
  qrCodeData: string;
  
  // Status
  status: PermitStatus;
  
  // Usage
  usedAt?: string;
  usedBy?: string;
  
  // Requirements
  paymentPercentageRequired: number;
  paymentPercentageMet: boolean;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// GRADE INTERFACE
// ============================================
export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  academicYearId: string;
  
  // Grades
  prelimGrade?: number;
  midtermGrade?: number;
  finalGrade?: number;
  
  // Computed
  computedGrade?: number;
  equivalentGrade?: number;
  remarks?: string;
  
  // Status
  status: 'draft' | 'submitted' | 'verified' | 'locked';
  
  // Audit
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  lockedBy?: string;
  lockedAt?: string;
}

// ============================================
// SUBJECT INTERFACE
// ============================================
export interface Subject {
  id: string;
  code: string;
  name: string;
  description: string;
  units: number;
  lectureHours: number;
  labHours: number;
  
  // Assignment
  courseIds: string[];
  yearLevels: YearLevel[];
  
  // Prerequisites
  prerequisiteIds?: string[];
  
  // Status
  status: 'active' | 'inactive';
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// SCHEDULE INTERFACE
// ============================================
export interface Schedule {
  id: string;
  subjectId: string;
  sectionId: string;
  instructorId: string;
  academicYearId: string;
  branchId: string;
  
  // Schedule
  dayOfWeek: number; // 0-6
  startTime: string;
  endTime: string;
  room: string;
  
  // Type
  scheduleType: 'lecture' | 'laboratory' | 'seminar';
  
  // Status
  status: 'active' | 'cancelled' | 'rescheduled';
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// MESSAGE INTERFACE
// ============================================
export interface Message {
  id: string;
  ticketNumber: string;
  
  // Participants
  senderId: string;
  senderRole: UserRole;
  recipientId?: string;
  recipientRole?: UserRole;
  
  // Content
  subject: string;
  content: string;
  attachments?: MessageAttachment[];
  
  // Categorization
  category: 'general' | 'payment' | 'grades' | 'enrollment' | 'schedule' | 'complaint';
  priority: MessagePriority;
  
  // Status
  status: MessageStatus;
  
  // Assignment
  assignedTo?: string;
  assignedAt?: string;
  
  // Branch
  branchId: string;
  
  // Replies
  replies: MessageReply[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
}

// ============================================
// MESSAGE REPLY INTERFACE
// ============================================
export interface MessageReply {
  id: string;
  messageId: string;
  senderId: string;
  senderRole: UserRole;
  content: string;
  attachments?: MessageAttachment[];
  createdAt: string;
}

// ============================================
// MESSAGE ATTACHMENT INTERFACE
// ============================================
export interface MessageAttachment {
  id: string;
  name: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

// ============================================
// ANNOUNCEMENT INTERFACE
// ============================================
export interface Announcement {
  id: string;
  title: string;
  content: string;
  
  // Type
  type: AnnouncementType;
  
  // Target
  branchId?: string;
  courseId?: string;
  sectionId?: string;
  
  // Author
  authorId: string;
  authorRole: UserRole;
  
  // Scheduling
  publishedAt: string;
  scheduledAt?: string;
  expiresAt?: string;
  
  // Status
  status: 'draft' | 'scheduled' | 'published' | 'archived';
  
  // Tracking
  readBy: string[];
  readCount: number;
  
  // Attachments
  attachments?: MessageAttachment[];
  
  // Priority
  priority: 'low' | 'normal' | 'high';
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// AUDIT LOG INTERFACE
// ============================================
export interface AuditLog {
  id: string;
  userId: string;
  userRole: UserRole;
  
  // Action
  action: string;
  module: string;
  description: string;
  
  // Details
  entityType: string;
  entityId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  
  // Metadata
  ipAddress: string;
  userAgent: string;
  
  // Timestamp
  createdAt: string;
}

// ============================================
// LOGIN LOG INTERFACE
// ============================================
export interface LoginLog {
  id: string;
  userId: string;
  
  // Login Details
  ipAddress: string;
  userAgent: string;
  deviceType: string;
  browser: string;
  os: string;
  
  // Location
  location?: string;
  
  // Status
  status: 'success' | 'failed' | 'locked';
  failureReason?: string;
  
  // Session
  sessionToken?: string;
  logoutAt?: string;
  
  // Timestamp
  createdAt: string;
}

// ============================================
// NOTIFICATION INTERFACE
// ============================================
export interface Notification {
  id: string;
  userId: string;
  
  // Content
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  
  // Link
  link?: string;
  linkText?: string;
  
  // Status
  read: boolean;
  readAt?: string;
  
  // Source
  sourceType?: string;
  sourceId?: string;
  
  // Timestamp
  createdAt: string;
}

// ============================================
// DASHBOARD STATS INTERFACE
// ============================================
export interface DashboardStats {
  // Students
  totalStudents: number;
  newStudents: number;
  returningStudents: number;
  droppedStudents: number;
  
  // Enrollments
  totalEnrollments: number;
  pendingEnrollments: number;
  approvedEnrollments: number;
  rejectedEnrollments: number;
  
  // Payments
  totalRevenue: number;
  pendingPayments: number;
  verifiedPayments: number;
  rejectedPayments: number;
  
  // Collections by Term
  prelimsCollection: number;
  midtermsCollection: number;
  finalsCollection: number;
  
  // Branch Comparison
  branchStats: BranchStat[];
  
  // Trends
  enrollmentTrend: TrendData[];
  paymentTrend: TrendData[];
  
  // Tasks
  pendingTasks: number;
  urgentTasks: number;
  completedTasks: number;
}

// ============================================
// BRANCH STAT INTERFACE
// ============================================
export interface BranchStat {
  branchId: string;
  branchName: string;
  studentCount: number;
  enrollmentCount: number;
  revenue: number;
  pendingPayments: number;
}

// ============================================
// TREND DATA INTERFACE
// ============================================
export interface TrendData {
  date: string;
  value: number;
  label: string;
}

// ============================================
// TASK INTERFACE
// ============================================
export interface Task {
  id: string;
  title: string;
  description: string;
  
  // Assignment
  assignedTo: string;
  assignedBy: string;
  
  // Priority
  priority: MessagePriority;
  
  // Status
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  
  // Due Date
  dueDate?: string;
  completedAt?: string;
  
  // Related Entity
  relatedType?: string;
  relatedId?: string;
  
  // Branch
  branchId: string;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// SYSTEM SETTINGS INTERFACE
// ============================================
export interface SystemSettings {
  id: string;
  
  // School Info
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  schoolEmail: string;
  schoolLogo?: string;
  
  // Academic Settings
  currentAcademicYearId: string;
  enrollmentOpen: boolean;
  
  // Payment Settings
  paymentMethods: PaymentMethod[];
  gcashNumber?: string;
  mayaNumber?: string;
  bdoAccountNumber?: string;
  
  // Permit Settings
  permitPaymentPercentage: number;
  
  // Late Fee Settings
  lateFeeEnabled: boolean;
  lateFeeAmount: number;
  lateFeeAfterDays: number;
  
  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  
  // Maintenance
  maintenanceMode: boolean;
  maintenanceMessage?: string;
  
  updatedAt: string;
  updatedBy: string;
}

// ============================================
// API RESPONSE INTERFACES
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ============================================
// FILTER INTERFACES
// ============================================
export interface StudentFilter {
  search?: string;
  branchId?: string;
  courseId?: string;
  yearLevel?: YearLevel;
  status?: UserStatus | Enrollment['status'];
  paymentStatus?: PaymentStatus;
  enrollmentStatus?: Enrollment['status'];
  academicYearId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface PaymentFilter {
  search?: string;
  branchId?: string;
  status?: Payment['status'];
  paymentMethod?: PaymentMethod;
  paymentFor?: Payment['paymentFor'];
  dateFrom?: string;
  dateTo?: string;
  amountMin?: number;
  amountMax?: number;
}

export interface AuditLogFilter {
  userId?: string;
  action?: string;
  module?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================
// AUTH INTERFACES
// ============================================
export interface LoginCredentials {
  email?: string;
  studentId?: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ============================================
// BULK OPERATION INTERFACES
// ============================================
export interface BulkOperationResult {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  errors: BulkOperationError[];
}

export interface BulkOperationError {
  row: number;
  identifier: string;
  error: string;
}

export interface BulkApprovalRequest {
  ids: string[];
  action: 'approve' | 'reject';
  remarks?: string;
}

export interface BulkPaymentVerification {
  paymentIds: string[];
  action: 'verify' | 'reject';
  remarks?: string;
}

// ============================================
// FILE UPLOAD INTERFACES
// ============================================
export interface FileUploadResult {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  error?: string;
}

export interface ExcelImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: BulkOperationError[];
  warnings: string[];
}
