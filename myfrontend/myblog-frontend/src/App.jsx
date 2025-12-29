import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from "../components/Navbar.jsx";
import HomePage from "../components/HomePage.jsx";
import BlogDetail from "../components/BlogDetail.jsx";
import DashboardPage from "../components/DashboardPage.jsx";
import ProfilePage from '../components/ProfilePage.jsx';
import BlogPostPage from "../components/BlogPostPage.jsx"
import Contact from "../components/Contact.jsx";
import { Footer } from '../components/Footer.jsx';
import Toast from './components/Toast.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import AdminDashboard from '../components/AdminDashboard.jsx';
import { useThemeStore } from '../store/themeStore.js';
import './styles/globals.css';
import CreatePostPage from './pages/CreatePost.jsx';
import EditPostPage from '../components/EditPost.jsx';

/**
 * 🎯 MAIN APP COMPONENT
 * 
 * Sets up routing for the entire application
 * - Public routes (anyone can access)
 * - Protected routes (requires login)
 */

function App() {
  const { isDarkMode } = useThemeStore();

  // Initialize theme on app load
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
        <Navbar />
        {/* <ParallaxHero /> */}
        <main className="flex-1">
          <Routes>
            {/* PUBLIC ROUTES - Anyone can access */}
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogDetail />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />

            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
            path='/edit-post/:id'
            element={
            <ProtectedRoute>
              <EditPostPage />
              </ProtectedRoute>
              }
            />

            <Route
            path='/create-post'
            element={
              <ProtectedRoute>
                <CreatePostPage />
              </ProtectedRoute>
            }
            
            />
            
            {/* PROTECTED ROUTES - Requires login */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />

            {/* ADMIN ROUTES - Requires admin role */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            
            {/* CATCH ALL - Redirect to home if route doesn't exist */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
        
        {/* Toast Notifications */}
        <Toast />
      </div>
    </BrowserRouter>
  );
}

export default App;
