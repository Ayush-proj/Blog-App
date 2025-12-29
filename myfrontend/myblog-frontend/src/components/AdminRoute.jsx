import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * 🛡️ ADMIN ROUTE PROTECTION
 * 
 * Wraps routes that should only be accessible to admins
 * - Redirects to home if not logged in
 * - Redirects to home if not admin
 */

export default function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuthStore();

  // Not logged in - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Not admin - redirect to home
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // User is admin - render the protected content
  return children;
}
