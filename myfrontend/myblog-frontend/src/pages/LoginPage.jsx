import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../store/toastStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

/**
 * 🔐 LOGIN PAGE
 * 
 * Allows users to login with email and password
 * - Form validation
 * - Error handling
 * - Loading state
 * - Redirects to dashboard after login
 */

function LoginPage() {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  // Get login function from auth store
  const { login, loading } = useAuthStore();
  
  // Get toast function for notifications
  const toast = useToastStore();
  
  // For navigation after login
  const navigate = useNavigate();

  /**
   * Validate form fields
   * Returns true if valid, false if errors
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Check email
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Check password
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      // Call login function from authStore
      await login({ email, password });
      
      // Show success message
      toast.success('Login successful! Welcome back!');
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      // Show error message
      toast.error(error.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link 
              to="/register" 
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Input */}
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="john@example.com"
              required
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label 
                htmlFor="remember-me" 
                className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a 
                href="#" 
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            loading={loading}
            className="w-full"
            variant="primary"
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
