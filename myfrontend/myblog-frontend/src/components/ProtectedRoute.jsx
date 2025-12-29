import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

/**
 * 🔒 PROTECTED ROUTE COMPONENT
 * 
 * Wraps pages that require authentication
 * If user is not logged in, redirects to login page
 * 
 * Usage:
 * <ProtectedRoute>
 *   <DashboardPage />
 * </ProtectedRoute>
 */

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  
  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If logged in, show the page
  return children;
}

export default ProtectedRoute;
