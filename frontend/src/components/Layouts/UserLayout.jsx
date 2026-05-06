import React, { useEffect, useRef } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { User, LogOut, Home, MessageSquare, Bell, Menu, X, Utensils } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const UserLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const navItems = [
    { path: '/user/profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { path: '/user/meals', label: 'Meals', icon: <Utensils className="w-4 h-4" /> },
    { path: '/user/notices', label: 'Notices', icon: <Bell className="w-4 h-4" /> },
    { path: '/user/complaint', label: 'Submit Complaint', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const previousScrollY = lastScrollYRef.current;
      const delta = currentScrollY - previousScrollY;

      setScrolled(currentScrollY > 10);

      if (currentScrollY <= 10) {
        setIsNavbarVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (delta > 6 && !mobileMenuOpen) {
        setIsNavbarVisible(false);
      } else if (delta < -6) {
        setIsNavbarVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      setIsNavbarVisible(true);
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface">
      {!isNavbarVisible && (
        <div
          className="fixed top-0 left-0 right-0 h-4 z-20"
          onMouseEnter={() => setIsNavbarVisible(true)}
          aria-hidden="true"
        />
      )}

      {/* Navbar */}
      <nav
        onMouseEnter={() => setIsNavbarVisible(true)}
        className={`bg-white border-b border-gray-200 sticky top-0 z-30 transition-all duration-300 ${
          scrolled ? 'shadow-sm' : ''
        } ${isNavbarVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 text-primary hover:text-secondary transition-colors">
                <Home className="w-5 h-5" />
                <span className="font-bold font-heading">JUST HallSync</span>
              </Link>

              {/* Desktop nav */}
              <div className="hidden md:flex gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-accent text-secondary'
                        : 'text-gray-600 hover:text-primary hover:bg-surface'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2">
                <User className="w-4 h-4 text-secondary" />
                <span className="text-sm text-primary font-medium">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X size={22} className="text-primary" /> : <Menu size={22} className="text-primary" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 animate-slideDown border-t border-gray-100 pt-3">
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-accent text-secondary'
                        : 'text-gray-600 hover:text-primary hover:bg-surface'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-danger hover:bg-red-50 rounded-lg transition-colors mt-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <Outlet />
    </div>
  );
};

export default UserLayout;
