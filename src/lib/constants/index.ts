// ============================================
// EduCore PH - Constants
// ============================================

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
  STUDENT: 'student',
} as const;

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  LOCKED: 'locked',
  SUSPENDED: 'suspended',
} as const;

// Education Levels
export const EDUCATION_LEVELS = {
  SHS: 'shs',
  COLLEGE: 'college',
} as const;

// SHS Strands
export const SHS_STRANDS = {
  STEM: { value: 'stem', label: 'STEM - Science, Technology, Engineering, Mathematics' },
  ABM: { value: 'abm', label: 'ABM - Accountancy, Business, Management' },
  HUMSS: { value: 'humss', label: 'HUMSS - Humanities and Social Sciences' },
  GAS: { value: 'gas', label: 'GAS - General Academic Strand' },
  TVL: { value: 'tvl', label: 'TVL - Technical-Vocational-Livelihood' },
} as const;

// College Courses
export const COLLEGE_COURSES = {
  BSIT: { value: 'bsit', label: 'BS Information Technology' },
  BSCS: { value: 'bscs', label: 'BS Computer Science' },
  BSBA: { value: 'bsba', label: 'BS Business Administration' },
  BSACCOUNTANCY: { value: 'bsaccountancy', label: 'BS Accountancy' },
  BSNURSING: { value: 'bsnursing', label: 'BS Nursing' },
  BSEDUCATION: { value: 'bseducation', label: 'BS Education' },
  BSENGINEERING: { value: 'bsengineering', label: 'BS Engineering' },
} as const;

// Year Levels
export const YEAR_LEVELS = {
  G11: { value: 'g11', label: 'Grade 11', level: 'shs' },
  G12: { value: 'g12', label: 'Grade 12', level: 'shs' },
  FIRST: { value: '1st', label: '1st Year', level: 'college' },
  SECOND: { value: '2nd', label: '2nd Year', level: 'college' },
  THIRD: { value: '3rd', label: '3rd Year', level: 'college' },
  FOURTH: { value: '4th', label: '4th Year', level: 'college' },
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PAID: { value: 'paid', label: 'Paid', color: 'green' },
  PARTIAL: { value: 'partial', label: 'Partial', color: 'yellow' },
  UNPAID: { value: 'unpaid', label: 'Unpaid', color: 'red' },
  OVERDUE: { value: 'overdue', label: 'Overdue', color: 'red' },
  PENDING: { value: 'pending', label: 'Pending', color: 'orange' },
} as const;

// Payment Methods
export const PAYMENT_METHODS = {
  GCASH: { value: 'gcash', label: 'GCash', icon: 'Wallet' },
  MAYA: { value: 'maya', label: 'Maya', icon: 'CreditCard' },
  BDO: { value: 'bdo', label: 'BDO Bank Transfer', icon: 'Building' },
  CASH: { value: 'cash', label: 'Cash', icon: 'Banknote' },
  CHECK: { value: 'check', label: 'Check', icon: 'FileText' },
} as const;

// Payment For
export const PAYMENT_FOR = {
  ENROLLMENT: { value: 'enrollment', label: 'Enrollment Fee' },
  TUITION: { value: 'tuition', label: 'Tuition Fee' },
  MISCELLANEOUS: { value: 'miscellaneous', label: 'Miscellaneous Fee' },
  OTHER: { value: 'other', label: 'Other Fees' },
} as const;

// Payment Terms
export const PAYMENT_TERMS = {
  PRELIMS: { value: 'prelims', label: 'Prelims' },
  MIDTERMS: { value: 'midterms', label: 'Midterms' },
  FINALS: { value: 'finals', label: 'Finals' },
} as const;

// Enrollment Status
export const ENROLLMENT_STATUS = {
  PENDING: { value: 'pending', label: 'Pending', color: 'yellow' },
  UNDER_REVIEW: { value: 'under_review', label: 'Under Review', color: 'orange' },
  APPROVED: { value: 'approved', label: 'Approved', color: 'green' },
  REJECTED: { value: 'rejected', label: 'Rejected', color: 'red' },
  ENROLLED: { value: 'enrolled', label: 'Enrolled', color: 'blue' },
  CANCELLED: { value: 'cancelled', label: 'Cancelled', color: 'gray' },
} as const;

// Permit Status
export const PERMIT_STATUS = {
  GENERATED: { value: 'generated', label: 'Generated', color: 'blue' },
  DOWNLOADED: { value: 'downloaded', label: 'Downloaded', color: 'purple' },
  USED: { value: 'used', label: 'Used', color: 'green' },
  EXPIRED: { value: 'expired', label: 'Expired', color: 'red' },
} as const;

// Message Priority
export const MESSAGE_PRIORITY = {
  LOW: { value: 'low', label: 'Low', color: 'gray' },
  MEDIUM: { value: 'medium', label: 'Medium', color: 'blue' },
  HIGH: { value: 'high', label: 'High', color: 'orange' },
  URGENT: { value: 'urgent', label: 'Urgent', color: 'red' },
} as const;

// Message Status
export const MESSAGE_STATUS = {
  OPEN: { value: 'open', label: 'Open', color: 'blue' },
  IN_PROGRESS: { value: 'in_progress', label: 'In Progress', color: 'yellow' },
  RESOLVED: { value: 'resolved', label: 'Resolved', color: 'green' },
  CLOSED: { value: 'closed', label: 'Closed', color: 'gray' },
} as const;

// Announcement Type
export const ANNOUNCEMENT_TYPE = {
  GLOBAL: { value: 'global', label: 'Global' },
  BRANCH: { value: 'branch', label: 'Branch' },
  COURSE: { value: 'course', label: 'Course' },
  SECTION: { value: 'section', label: 'Section' },
} as const;

// Gender
export const GENDER = {
  MALE: { value: 'male', label: 'Male' },
  FEMALE: { value: 'female', label: 'Female' },
  OTHER: { value: 'other', label: 'Other' },
} as const;

// Civil Status
export const CIVIL_STATUS = {
  SINGLE: { value: 'single', label: 'Single' },
  MARRIED: { value: 'married', label: 'Married' },
  WIDOWED: { value: 'widowed', label: 'Widowed' },
  SEPARATED: { value: 'separated', label: 'Separated' },
} as const;

// Document Types
export const DOCUMENT_TYPES = {
  BIRTH_CERTIFICATE: { value: 'birth_certificate', label: 'Birth Certificate' },
  TRANSCRIPT: { value: 'transcript', label: 'Transcript of Records' },
  ID_PHOTO: { value: 'id_photo', label: 'ID Photo' },
  GOOD_MORAL: { value: 'good_moral', label: 'Certificate of Good Moral' },
  MEDICAL: { value: 'medical', label: 'Medical Certificate' },
  OTHER: { value: 'other', label: 'Other' },
} as const;

// Grade Status
export const GRADE_STATUS = {
  DRAFT: { value: 'draft', label: 'Draft', color: 'gray' },
  SUBMITTED: { value: 'submitted', label: 'Submitted', color: 'blue' },
  VERIFIED: { value: 'verified', label: 'Verified', color: 'green' },
  LOCKED: { value: 'locked', label: 'Locked', color: 'purple' },
} as const;

// Task Status
export const TASK_STATUS = {
  PENDING: { value: 'pending', label: 'Pending', color: 'yellow' },
  IN_PROGRESS: { value: 'in_progress', label: 'In Progress', color: 'blue' },
  COMPLETED: { value: 'completed', label: 'Completed', color: 'green' },
  CANCELLED: { value: 'cancelled', label: 'Cancelled', color: 'gray' },
} as const;

// Notification Type
export const NOTIFICATION_TYPE = {
  INFO: { value: 'info', label: 'Info', color: 'blue' },
  SUCCESS: { value: 'success', label: 'Success', color: 'green' },
  WARNING: { value: 'warning', label: 'Warning', color: 'yellow' },
  ERROR: { value: 'error', label: 'Error', color: 'red' },
} as const;

// Sidebar Menu Items by Role
export const SIDEBAR_MENU = {
  admin: [
    { label: 'Dashboard', icon: 'LayoutDashboard', path: '/admin/dashboard' },
    { label: 'Branches', icon: 'Building2', path: '/admin/branches' },
    { label: 'Students', icon: 'Users', path: '/admin/students' },
    { label: 'Staff', icon: 'UserCog', path: '/admin/staff' },
    { label: 'Payments', icon: 'CreditCard', path: '/admin/payments' },
    { label: 'Grades', icon: 'GraduationCap', path: '/admin/grades' },
    { label: 'Exam Permits', icon: 'FileCheck', path: '/admin/permits' },
    { label: 'Schedule', icon: 'Calendar', path: '/admin/schedule' },
    { label: 'Subjects', icon: 'BookOpen', path: '/admin/subjects' },
    { label: 'Teacher Evaluation', icon: 'Star', path: '/admin/evaluations' },
    { label: 'Messages', icon: 'MessageSquare', path: '/admin/messages' },
    { label: 'Announcements', icon: 'Megaphone', path: '/admin/announcements' },
    { label: 'Audit Logs', icon: 'ClipboardList', path: '/admin/audit-logs' },
  ],
  staff: [
    { label: 'Dashboard', icon: 'LayoutDashboard', path: '/staff/dashboard' },
    { label: 'Students', icon: 'Users', path: '/staff/students' },
    { label: 'Payments', icon: 'CreditCard', path: '/staff/payments' },
    { label: 'Grades', icon: 'GraduationCap', path: '/staff/grades' },
    { label: 'Exam Permits', icon: 'FileCheck', path: '/staff/permits' },
    { label: 'Schedule', icon: 'Calendar', path: '/staff/schedule' },
    { label: 'Subjects', icon: 'BookOpen', path: '/staff/subjects' },
    { label: 'Teacher Evaluation', icon: 'Star', path: '/staff/evaluations' },
    { label: 'Messages', icon: 'MessageSquare', path: '/staff/messages' },
    { label: 'Announcements', icon: 'Megaphone', path: '/staff/announcements' },
    { label: 'Settings', icon: 'Settings', path: '/staff/settings' },
  ],
  student: [
    { label: 'Dashboard', icon: 'LayoutDashboard', path: '/student/dashboard' },
    { label: 'Statement of Account', icon: 'FileText', path: '/student/soa' },
    { label: 'Payments', icon: 'CreditCard', path: '/student/payments' },
    { label: 'Grades', icon: 'GraduationCap', path: '/student/grades' },
    { label: 'Exam Permits', icon: 'FileCheck', path: '/student/permits' },
    { label: 'Schedule', icon: 'Calendar', path: '/student/schedule' },
    { label: 'Teacher Evaluation', icon: 'Star', path: '/student/evaluations' },
    { label: 'Messages', icon: 'MessageSquare', path: '/student/messages' },
    { label: 'Announcements', icon: 'Megaphone', path: '/student/announcements' },
    { label: 'Settings', icon: 'Settings', path: '/student/settings' },
  ],
} as const;

// Pagination Limits
export const PAGINATION_LIMITS = [10, 20, 50, 100] as const;

// File Upload Limits
export const FILE_UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_EXCEL_TYPES: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
} as const;

// API Rate Limits
export const RATE_LIMITS = {
  LOGIN_ATTEMPTS: 5,
  LOGIN_WINDOW_MINUTES: 15,
  API_REQUESTS_PER_MINUTE: 100,
} as const;

// Session Settings
export const SESSION_SETTINGS = {
  ACCESS_TOKEN_EXPIRY: 3600, // 1 hour
  REFRESH_TOKEN_EXPIRY: 604800, // 7 days
  IDLE_TIMEOUT: 1800000, // 30 minutes
} as const;

// Currency Format
export const CURRENCY = {
  CODE: 'PHP',
  SYMBOL: '₱',
  LOCALE: 'en-PH',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  DISPLAY_WITH_TIME: 'MMM DD, YYYY hh:mm A',
  INPUT: 'YYYY-MM-DD',
  ISO: 'YYYY-MM-DDTHH:mm:ss.sssZ',
} as const;
