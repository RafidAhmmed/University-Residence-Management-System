import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LogOut,
  LayoutDashboard,
  Home,
  User,
  Menu,
  X,
  UserCog,
  MessageSquare,
  Bell,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import UserAvatar from '../Common/UserAvatar';

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Changed default to false for mobile-first
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  const menuItems = [
    {
      path: '/admin',
      icon: LayoutDashboard,
      label: 'Dashboard',
      exact: true
    },
    {
      header: 'Management',
      items: [
        {
          path: '/admin/complaints',
          icon: MessageSquare,
          label: 'Manage Complaints'
        },
        {
          path: '/admin/publish-notice',
          icon: Bell,
          label: 'Publish Notice'
        },
        {
          path: '/admin/manage-users',
          icon: UserCog,
          label: 'Manage Users'
        },
      ]
    },
    {
      header: 'Fees & Payments',
      items: [
        {
          path: '/admin/fees',
          icon: CreditCard,
          label: 'Manage Fees'
        },
      ]
    },
    {
      header: 'Account',
      items: [
        {
          path: '/admin/profile',
          icon: User,
          label: 'My Profile'
        }
      ]
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-[#19aaba] to-[#158c99] text-white transition-all duration-300 z-40 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } w-64 lg:w-64`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-cyan-600/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutDashboard size={24} />
              <span className="text-xl font-bold">Admin Panel</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map((section) => {
            if (section.path) {
              const Icon = section.icon;
              const active = isActive(section.path, section.exact);

              return (
                <Link
                  key={section.path}
                  to={section.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-white text-[#19aaba] shadow-lg font-semibold'
                      : 'hover:bg-white/10 text-white'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  <span>{section.label}</span>
                </Link>
              );
            }

            return (
              <div key={section.header} className="space-y-2">
                <p className="px-4 pt-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-100/80">
                  {section.header}
                </p>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path, item.exact);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        active
                          ? 'bg-white text-[#19aaba] shadow-lg font-semibold'
                          : 'hover:bg-white/10 text-white'
                      }`}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Back to Site Link */}
        <div className="absolute bottom-20 left-0 right-0 p-4">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-all text-cyan-100 hover:text-white"
          >
            <Home size={20} className="flex-shrink-0" />
            <span>Back to Site</span>
          </Link>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-0 right-0 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 transition-all border border-white/20 hover:border-red-300"
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 w-full transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-64'}`}>
        {/* Top Navigation Bar */}
        <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Mobile Menu Button + Page Title */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Menu size={24} className="text-gray-600" />
                </button>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {location.pathname === '/admin' && 'Dashboard'}
                  {location.pathname === '/admin/manage-users' && 'Manage Users'}
                  {location.pathname === '/admin/fees' && 'Manage Fees'}
                  {location.pathname === '/admin/profile' && 'My Profile'}
                </h2>
              </div>

              {/* User Info */}
              <Link to="/admin/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-gray-800">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-gray-600 uppercase">{user?.role || 'admin'}</p>
                </div>
                <UserAvatar user={user} size="md" showBorder borderColor="border-cyan-200" />
              </Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
