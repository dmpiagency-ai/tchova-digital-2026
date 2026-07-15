/**
 * ProtectedRoute — Guards routes that require authentication.
 *
 * Usage:
 *   <Route path="/gsm" element={<ProtectedRoute><GSMTechDashboard /></ProtectedRoute>} />
 *   <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>} />
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { PageLoader } from '@/components/PageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If set, only users with this role can access the route */
  requiredRole?: UserRole;
  /** Where to redirect unauthenticated users (default: /login) */
  redirectTo?: string;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Still checking auth state — show loader, not a flash of login page
  if (isLoading) {
    return <PageLoader />;
  }

  // Not authenticated → redirect to login, preserving the intended destination
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Authenticated but wrong role → redirect to home
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
