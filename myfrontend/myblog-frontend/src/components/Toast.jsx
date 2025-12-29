import { useEffect } from 'react';
import { useToastStore } from '../../store/toastStore';
import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * 🔔 TOAST COMPONENT
 * 
 * Displays toast notifications at the top-right of the screen
 * Automatically dismisses after duration
 * 
 * Types: success, error, info, warning
 */

const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  // Icon mapping for different toast types
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
  };

  // Color mapping for different toast types
  const colors = {
    success: 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300',
    error: 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-500 dark:text-red-300',
    info: 'bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:border-blue-500 dark:text-blue-300',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-500 dark:text-yellow-300',
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg
            animate-in slide-in-from-right duration-300
            ${colors[toast.type]}
          `}
        >
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {icons[toast.type]}
          </div>

          {/* Message */}
          <p className="flex-1 text-sm font-medium">
            {toast.message}
          </p>

          {/* Close button */}
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
