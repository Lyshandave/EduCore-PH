import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { MainLayout } from '@/components/layouts';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/pages/auth';
import * as AdminPages from '@/pages/admin';
import * as StaffPages from '@/pages/staff';
import * as StudentPages from '@/pages/student';
import { Toaster } from '@/components/ui/sonner';

// Protected Route Component
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <>{children}</>;
}

// Public Route Component (redirects to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminPages.DashboardPage />} />
          <Route path="students" element={<AdminPages.StudentsPage />} />
          <Route path="payments" element={<AdminPages.PaymentsPage />} />
          {/* Real routes for admin pages */}
          <Route path="branches" element={<AdminPages.BranchesPage />} />
          <Route path="staff" element={<AdminPages.StaffPage />} />
          <Route path="enrollments" element={<div className="p-8 text-center text-slate-500">Enrollments - Coming Soon</div>} />
          <Route path="grades" element={<AdminPages.GradesPage />} />
          <Route path="permits" element={<AdminPages.PermitsPage />} />
          <Route path="schedule" element={<AdminPages.SchedulePage />} />
          <Route path="subjects" element={<AdminPages.SubjectsPage />} />
          <Route path="evaluations" element={<AdminPages.TeacherEvaluationsPage />} />
          <Route path="messages" element={<AdminPages.MessagesPage />} />
          <Route path="announcements" element={<AdminPages.AnnouncementsPage />} />
          <Route path="audit-logs" element={<AdminPages.AuditLogsPage />} />
          <Route path="profile" element={<AdminPages.AdminProfilePage />} />
          <Route path="settings" element={<AdminPages.AdminSettingsPage />} />
        </Route>

        {/* Staff Routes */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="dashboard" element={<StaffPages.DashboardPage />} />
          {/* Real routes for staff pages */}
          <Route path="students" element={<StaffPages.StudentsPage />} />
          <Route path="payments" element={<StaffPages.PaymentsPage />} />
          <Route path="grades" element={<StaffPages.GradesPage />} />
          <Route path="permits" element={<StaffPages.PermitsPage />} />
          <Route path="schedule" element={<StaffPages.SchedulePage />} />
          <Route path="subjects" element={<StaffPages.SubjectsPage />} />
          <Route path="evaluations" element={<StaffPages.TeacherEvaluationsPage />} />
          <Route path="messages" element={<StaffPages.MessagesPage />} />
          <Route path="announcements" element={<StaffPages.AnnouncementsPage />} />
          <Route path="tasks" element={<div className="p-8 text-center text-slate-500">Tasks - Coming Soon</div>} />
          <Route path="profile" element={<StaffPages.StaffProfilePage />} />
          <Route path="settings" element={<StaffPages.SettingsPage />} />
        </Route>

        {/* Student Routes */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/student/dashboard" replace />} />
          <Route path="dashboard" element={<StudentPages.DashboardPage />} />
          {/* Placeholder routes for other student pages */}
          <Route path="profile" element={<StudentPages.StudentProfilePage />} />
          {/* Real routes for student pages */}
          <Route path="soa" element={<StudentPages.SOAPage />} />
          <Route path="payments" element={<StudentPages.PaymentsPage />} />
          <Route path="grades" element={<StudentPages.GradesPage />} />
          <Route path="permits" element={<StudentPages.PermitsPage />} />
          <Route path="schedule" element={<StudentPages.SchedulePage />} />
          <Route path="evaluations" element={<StudentPages.TeacherEvaluationsPage />} />
          <Route path="messages" element={<StudentPages.MessagesPage />} />
          <Route path="announcements" element={<StudentPages.AnnouncementsPage />} />
          <Route path="settings" element={<StudentPages.SettingsPage />} />
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  );
}

export default App;
