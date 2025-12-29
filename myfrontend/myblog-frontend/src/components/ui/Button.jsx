import { Loader2 } from 'lucide-react';

/**
 * 🔘 BUTTON COMPONENT
 * 
 * Reusable button with loading state
 * 
 * Props:
 * - variant: 'primary', 'secondary', 'danger', 'ghost'
 * - size: 'sm', 'md', 'lg'
 * - loading: Show loading spinner
 * - disabled: Disable button
 * - children: Button content
 */

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  // Variant styles
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white border-transparent',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white border-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600',
  };

  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg border
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {/* Loading Spinner */}
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      
      {children}
    </button>
  );
};

export default Button;
