import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-gradient-to-r from-[#19aaba] via-[#158c99] to-[#116d77] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shadow-md transform hover:scale-105 transition-transform duration-300 overflow-hidden border-2 border-red-500">
                <img
                  src="/logo.png"
                  alt="JUST Hall Management Logo"
                  className="w-full h-full object-contain p-1"
                />
              </div>
            </div>
            <Link
              to="/"
              className="text-xl sm:text-2xl font-bold text-white tracking-tight hover:text-gray-100 transition-colors duration-200"
            >
              Hall Management
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive("/")
                  ? "bg-white/20 text-white border-b-2 border-white"
                  : "text-white hover:text-gray-100 hover:bg-white/10"
              }`}
            >
              Home
            </Link>
            <Link
              to="/facilities"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive("/facilities")
                  ? "bg-white/20 text-white border-b-2 border-white"
                  : "text-white hover:text-gray-100 hover:bg-white/10"
              }`}
            >
              Facilities
            </Link>
            <Link
              to="/notice"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive("/notice")
                  ? "bg-white/20 text-white border-b-2 border-white"
                  : "text-white hover:text-gray-100 hover:bg-white/10"
              }`}
            >
              Notice
            </Link>
            <Link
              to="/room-allocation"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive("/room-allocation")
                  ? "bg-white/20 text-white border-b-2 border-white"
                  : "text-white hover:text-gray-100 hover:bg-white/10"
              }`}
            >
              Room Allocation
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive("/contact")
                  ? "bg-white/20 text-white border-b-2 border-white"
                  : "text-white hover:text-gray-100 hover:bg-white/10"
              }`}
            >
              Contact
            </Link>

            {/* Auth Buttons */}
            {isAuthenticated() ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:bg-white/20"
                >
                  <User size={16} />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      to="/user/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 xl:px-6 py-2 bg-white text-[#19aaba] rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:bg-gray-100"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 rounded-lg p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 animate-slideDown">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive("/")
                    ? "bg-white/20 text-white border-l-4 border-white"
                    : "text-white hover:text-gray-100 hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/facilities"
                className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive("/facilities")
                    ? "bg-white/20 text-white border-l-4 border-white"
                    : "text-white hover:text-gray-100 hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Facilities
              </Link>
              <Link
                to="/notice"
                className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive("/notice")
                    ? "bg-white/20 text-white border-l-4 border-white"
                    : "text-white hover:text-gray-100 hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Notice
              </Link>
              <Link
                to="/room-allocation"
                className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive("/room-allocation")
                    ? "bg-white/20 text-white border-l-4 border-white"
                    : "text-white hover:text-gray-100 hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Room Allocation
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive("/contact")
                    ? "bg-white/20 text-white border-l-4 border-white"
                    : "text-white hover:text-gray-100 hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {/* Auth Buttons - Mobile */}
              {isAuthenticated() ? (
                <div className="pt-4 border-t border-white/20">
                  <div className="space-y-2">
                    <Link
                      to="/user/profile"
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-white/10 text-white rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:bg-white/20"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={16} />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-red-500 text-white rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:bg-red-600"
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-6 py-3 bg-white text-[#19aaba] rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:bg-gray-100 mt-4"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
