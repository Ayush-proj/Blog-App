import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useToastStore } from '../store/toastStore';
import Button from '../src/components/ui/Button.jsx';
import { HoverDropdown, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '../src/components/ui/dropdown-menu.jsx';
import { 
  ChevronDown, User, Settings, LogOut, FileText, LayoutDashboard, 
  PenSquare, BookOpen, Video, MessageSquare, Laptop, Palette, 
  Briefcase, TrendingUp, Globe
} from 'lucide-react';

/**
 * 🧭 ENHANCED NAVBAR COMPONENT
 * 
 * Advanced navigation bar with multiple hover dropdowns
 * This is an example showing all the possibilities!
 * 
 * Features:
 * - User account dropdown
 * - Blog categories dropdown
 * - Resources dropdown
 * - Responsive design
 * - Dark mode support
 */

function NavbarEnhanced() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const toast = useToastStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 backdrop-blur-sm bg-white/95 dark:bg-slate-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MyBlog
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {/* Home Link */}
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              Home
            </Link>
            
            {/* 📚 Blog Categories Dropdown */}
            <HoverDropdown
              align="center"
              trigger={
                <div className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  <span>Categories</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              }
            >
              <DropdownMenuLabel>Browse by Category</DropdownMenuLabel>
              
              <DropdownMenuItem asChild>
                <Link to="/category/technology" className="flex items-center w-full">
                  <Laptop className="w-4 h-4 mr-2 text-blue-500" />
                  Technology
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/category/design" className="flex items-center w-full">
                  <Palette className="w-4 h-4 mr-2 text-purple-500" />
                  Design
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/category/business" className="flex items-center w-full">
                  <Briefcase className="w-4 h-4 mr-2 text-green-500" />
                  Business
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/category/trending" className="flex items-center w-full">
                  <TrendingUp className="w-4 h-4 mr-2 text-orange-500" />
                  Trending
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem asChild>
                <Link to="/categories" className="flex items-center w-full text-blue-600 dark:text-blue-400 font-medium">
                  View All Categories →
                </Link>
              </DropdownMenuItem>
            </HoverDropdown>

            {/* 📖 Resources Dropdown */}
            <HoverDropdown
              align="center"
              trigger={
                <div className="flex items-center space-x-1 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                  <span>Resources</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              }
            >
              <DropdownMenuLabel>Learning Resources</DropdownMenuLabel>
              
              <DropdownMenuItem asChild>
                <Link to="/tutorials" className="flex items-center w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Tutorials
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/documentation" className="flex items-center w-full">
                  <FileText className="w-4 h-4 mr-2" />
                  Documentation
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/videos" className="flex items-center w-full">
                  <Video className="w-4 h-4 mr-2" />
                  Video Courses
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuLabel>Community</DropdownMenuLabel>
              
              <DropdownMenuItem asChild>
                <Link to="/forum" className="flex items-center w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Forum
                </Link>
              </DropdownMenuItem>
            </HoverDropdown>

            {/* Contact Link */}
            <Link 
              to="/contact" 
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
            >
              Contact
            </Link>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 dark:bg-slate-700 mx-2" />

            {/* Auth Section */}
            {isAuthenticated ? (
              <>
                {/* Create Post Button */}
                <Link to="/create-post">
                  <Button variant="primary" size="sm" className="flex items-center">
                    <PenSquare className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </Link>
                
                {/* 👤 User Account Dropdown */}
                <HoverDropdown
                  align="end"
                  trigger={
                    <div className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden md:block">
                        {user?.name}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                  }
                >
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="font-semibold">{user?.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                        {user?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  
                  <DropdownMenuSeparator />
                  
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
                    <Link to="/my-posts" className="flex items-center w-full">
                      <FileText className="w-4 h-4 mr-2" />
                      My Posts
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 focus:bg-red-50 dark:focus:bg-red-900/20"
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

export default NavbarEnhanced;
