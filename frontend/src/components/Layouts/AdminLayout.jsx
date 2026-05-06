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
  CreditCard,
  Utensils
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import UserAvatar from '../Common/UserAvatar';

const AdminLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        { path: '/admin/complaints', icon: MessageSquare, label: 'Manage Complaints' },
        { path: '/admin/publish-notice', icon: Bell, label: 'Publish Notice' },
        { path: '/admin/manage-users', icon: UserCog, label: 'Manage Users' },
      ]
    },
    {
      header: 'Fees & Payments',
      items: [
        { path: '/admin/fees', icon: CreditCard, label: 'Manage Fees' },
      ]
    },
    {
      header: 'Meals',
      items: [
        { path: '/admin/meals', icon: Utensils, label: 'Meals' },
      ]
    },
    {
      header: 'Account',
      items: [
        { path: '/admin/profile', icon: User, label: 'My Profile' }
      ]
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-primary text-white transition-transform duration-300 z-40 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } w-64`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayoutDashboard size={22} />
              <span className="text-lg font-bold font-heading">Admin Panel</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-hidden hover:overflow-y-auto px-4 py-4 space-y-1.5">
          {menuItems.map((section) => {
            if (section.path) {
              const Icon = section.icon;
              const active = isActive(section.path, section.exact);

              return (
                <Link
                  key={section.path}
                  to={section.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                    active
                      ? 'bg-accent text-secondary font-semibold shadow-md'
                      : 'hover:bg-white/10 text-white/85'
                  }`}
                >
                  <Icon size={18} className="shrink-0" />
                  <span>{section.label}</span>
                </Link>
              );
            }

            return (
              <div key={section.header} className="space-y-1.5">
                <p className="px-4 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
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
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                        active
                          ? 'bg-accent text-secondary font-semibold shadow-md'
                          : 'hover:bg-white/10 text-white/85'
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="px-4 pb-4 pt-4 border-t border-white/10 space-y-3">
          <Link
            to="/"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/10 transition-all text-white/65 hover:text-white text-sm"
          >
            <Home size={18} className="shrink-0" />
            <span>Back to Site</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-danger/20 transition-all border border-white/15 hover:border-danger/50 text-sm"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 w-full transition-all duration-300 lg:ml-64">
        {/* Top Bar */}
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Menu size={22} className="text-primary" />
                </button>
                <h2 className="text-base sm:text-lg font-bold text-primary font-heading">
                  {location.pathname === '/admin' && 'Dashboard'}
                  {location.pathname === '/admin/manage-users' && 'Manage Users'}
                  {location.pathname === '/admin/fees' && 'Manage Fees'}
                  {location.pathname === '/admin/profile' && 'My Profile'}
                  {location.pathname === '/admin/complaints' && 'Manage Complaints'}
                  {location.pathname === '/admin/publish-notice' && 'Publish Notice'}
                </h2>
              </div>

              <Link to="/admin/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-primary">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-secondary uppercase">{user?.role || 'admin'}</p>
                </div>
                <UserAvatar user={user} size="md" showBorder borderColor="border-accent" />
              </Link>
            </div>
          </div>
        </nav>

        <main className="min-h-[calc(100vh-3.5rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
