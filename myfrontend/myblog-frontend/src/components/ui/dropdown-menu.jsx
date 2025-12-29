import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';

/**
 * 🎯 DROPDOWN MENU COMPONENT
 * 
 * A hover-activated dropdown menu with smooth animations
 * Built with shadcn/ui styling principles
 */

// Individual menu item
export const DropdownMenuItem = ({ 
  children, 
  onClick, 
  className,
  asChild = false 
}) => {
  const baseClasses = cn(
    "relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm w-full",
    "outline-none transition-colors",
    "hover:bg-gray-100 dark:hover:bg-slate-700",
    "focus:bg-gray-100 dark:focus:bg-slate-700",
    "text-gray-700 dark:text-gray-200",
    className
  );

  if (asChild) {
    // When asChild is true, clone the child and merge classes
    return React.cloneElement(children, {
      className: cn(baseClasses, children.props.className)
    });
  }

  return (
    <button onClick={onClick} className={baseClasses} type="button">
      {children}
    </button>
  );
};

// Separator between menu items
export const DropdownMenuSeparator = ({ className }) => {
  return (
    <div 
      className={cn(
        "my-1 h-px bg-gray-200 dark:bg-slate-700",
        className
      )} 
    />
  );
};

// Label for menu sections
export const DropdownMenuLabel = ({ children, className }) => {
  return (
    <div 
      className={cn(
        "px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400",
        className
      )}
    >
      {children}
    </div>
  );
};

// Wrapper for hover functionality
export const HoverDropdown = ({ trigger, children, align = "center" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {trigger}
      
      {/* Dropdown Content */}
      {isOpen && (
        <div
          className={`absolute z-50 min-w-[12rem] overflow-hidden rounded-md border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200 mt-2 ${alignmentClasses[align]}`}
        >
          <div className="p-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
