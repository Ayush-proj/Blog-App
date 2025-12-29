import { forwardRef } from 'react';

/**
 * 📝 INPUT COMPONENT
 * 
 * Reusable input field with validation support
 * Works with react-hook-form
 * 
 * Props:
 * - label: Input label
 * - error: Error message to display
 * - type: Input type (text, email, password, etc.)
 * - All standard input props
 */

const Input = forwardRef(({ 
  label, 
  error, 
  type = 'text',
  className = '',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Field */}
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-4 py-2.5 rounded-lg border
          bg-white dark:bg-slate-800
          text-gray-900 dark:text-gray-100
          border-gray-300 dark:border-slate-600
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
