import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  Users, 
  FileText, 
  MessageSquare, 
  Shield, 
  Trash2, 
  UserCog,
  BarChart3,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

/**
 * 🛡️ ADMIN DASHBOARD
 * 
 * Features:
 * - View statistics (users, posts, comments)
 * - Manage users (view, delete, change roles)
 * - Admin-only access
 */

const API_URL = 'http://localhost:3001/api';

export default function AdminDashboard() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  
  // State
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState(null);

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch data on mount
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchStats();
      fetchUsers();
    }
  }, [user]);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch admin statistics
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/auth/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete "${userName}"? This cannot be undone.`)) {
      return;
    }

    setActionLoading(userId);
    try {
      const response = await fetch(`${API_URL}/auth/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setUsers(users.filter(u => u._id !== userId));
        setNotification({ type: 'success', message: 'User deleted successfully' });
        fetchStats(); // Refresh stats
      } else {
        setNotification({ type: 'error', message: data.message });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to delete user' });
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle user role
  const handleToggleRole = async (userId, currentRole, userName) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    if (!confirm(`Change "${userName}" role to ${newRole}?`)) {
      return;
    }

    setActionLoading(userId);
    try {
      const response = await fetch(`${API_URL}/auth/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await response.json();
      
      if (data.success) {
        setUsers(users.map(u => 
          u._id === userId ? { ...u, role: newRole } : u
        ));
        setNotification({ type: 'success', message: `User role changed to ${newRole}` });
        fetchStats(); // Refresh stats
      } else {
        setNotification({ type: 'error', message: data.message });
      }
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to update role' });
    } finally {
      setActionLoading(null);
    }
  };

  // Don't render if not admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage users, view statistics, and moderate content
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {notification.message}
            </div>
            <button onClick={() => setNotification(null)}>
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Users ({users.length})
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Users */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {stats?.users?.total || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {stats?.users?.admins || 0} admins, {stats?.users?.regular || 0} regular
                </p>
              </div>

              {/* Total Posts */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {stats?.posts || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              {/* Total Comments */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Comments</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {stats?.comments || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                    <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Admins */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {stats?.users?.admins || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                    <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Users
              </h3>
              <div className="space-y-3">
                {stats?.recentUsers?.map((recentUser) => (
                  <div 
                    key={recentUser._id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={recentUser.avatar || '/images/default-avatar.png'} 
                        alt={recentUser.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {recentUser.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {recentUser.email}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      recentUser.role === 'admin'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {recentUser.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                All Users
              </h3>
              <button
                onClick={() => { fetchUsers(); fetchStats(); }}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 dark:bg-slate-700 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="p-8 text-center">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500">Loading users...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="p-8 text-center text-red-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                {error}
              </div>
            )}

            {/* Users Table */}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-slate-700/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((u) => (
                      <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <img 
                              src={u.avatar || '/images/default-avatar.png'} 
                              alt={u.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {u.name}
                              </p>
                              {u._id === user.id && (
                                <span className="text-xs text-blue-500">(You)</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            u.role === 'admin'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {u._id !== user.id && (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleToggleRole(u._id, u.role, u.name)}
                                disabled={actionLoading === u._id}
                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50"
                                title={`Make ${u.role === 'admin' ? 'User' : 'Admin'}`}
                              >
                                <UserCog className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u._id, u.name)}
                                disabled={actionLoading === u._id}
                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
