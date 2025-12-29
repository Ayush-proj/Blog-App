import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import { useThemeStore } from '../store/themeStore';
import Button from '../src/components/ui/Button.jsx';
import { HoverDropdown, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '../src/components/ui/dropdown-menu.jsx';
import { ChevronDown, User, LogOut, FileText, LayoutDashboard, PenSquare, Moon, Sun, Shield } from 'lucide-react';

/**
 * 🧭 NAVBAR COMPONENT
 * 
 * Navigation bar with authentication-aware menu
 * - Shows different options for logged in vs logged out users
 * - Uses React Router for navigation
 * - Features hover dropdowns for better UX
 */

function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const toast = useToastStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              MyBlog
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2"
            >
              Home
            </Link>
            
             <Link 
              to="/blog" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2 transition-colors"
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-3 py-2"
            >
              Contact
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {/* Show different options based on auth status */}
            {isAuthenticated ? (
              <>
                {/* ✅ Create Post Button */}
                <Link to="/create-post">
                  <Button variant="primary" size="sm">
                    <PenSquare className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </Link>
                
                {/* 🎯 User Dropdown Menu */}
                <HoverDropdown
                  align="end"
                  trigger={
                    <div className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                        {user?.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          user?.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user?.name}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                  }
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center w-full">
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center w-full">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/create-post" className="flex items-center w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      My Posts
                    </Link>
                  </DropdownMenuItem>
                  
                  {/* 🛡️ Admin Dashboard Link - Only for admins */}
                  {user?.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center w-full text-red-600 dark:text-red-400">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  <DropdownMenuSeparator />
                  
                  {/* <DropdownMenuItem asChild>
                    <div className="flex items-center w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </div>
                  </DropdownMenuItem> */}
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </HoverDropdown>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
