import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LogOut, User, Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll shadow effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/facilities", label: "Facilities" },
    { to: "/notice", label: "Notice" },
    { to: "/contact", label: "Contact" },
  ];

  const linkBase =
    "px-3 py-2 rounded-md text-sm font-medium transition-all duration-200";
  const linkActive = "bg-white/15 text-white border-b-2 border-accent";
  const linkInactive = "text-white/85 hover:text-white hover:bg-white/10";

  return (
    <nav
      id="main-navbar"
      className={`bg-primary sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-lg" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-white flex items-center justify-center shadow-sm">
              <img
                src="/logo.png"
                alt="JUST Logo"
                className="w-full h-full object-contain p-0.5"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white tracking-tight font-heading group-hover:text-accent transition-colors duration-200">
              JUST HallSync
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`${linkBase} ${
                  isActive(link.to) ? linkActive : linkInactive
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Auth */}
            <div className="ml-4">
              {isAuthenticated() ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    id="profile-dropdown-toggle"
                    onClick={toggleProfileDropdown}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 text-white rounded-full text-sm transition-all duration-200 hover:bg-white/20"
                  >
                    <User size={16} />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50 border border-gray-100 animate-slideDown">
                      <Link
                        to="/user/profile"
                        id="profile-link"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-surface transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                      <button
                        id="logout-button"
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-danger hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  id="login-button"
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 bg-accent text-secondary font-semibold text-sm rounded-lg transition-all duration-200 hover:bg-accent-dark hover:shadow-md"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            id="mobile-menu-toggle"
            onClick={toggleMenu}
            className="lg:hidden text-white hover:text-accent p-2 rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 animate-slideDown border-t border-white/10 mt-1">
            <div className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2.5 rounded-md text-base font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? "bg-white/15 text-white border-l-3 border-accent"
                      : "text-white/85 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Auth — Mobile */}
              <div className="pt-3 mt-2 border-t border-white/15">
                {isAuthenticated() ? (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/user/profile"
                      className="flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-white/10 text-white rounded-lg font-medium text-sm hover:bg-white/20 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={16} />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-danger text-white rounded-lg font-medium text-sm hover:bg-danger-light transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-5 py-2.5 bg-accent text-secondary rounded-lg font-semibold text-sm transition-colors hover:bg-accent-dark"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
