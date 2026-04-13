import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Home, Users, FileText, Calendar } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-[#19aaba] via-[#158c99] to-[#116d77] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg overflow-hidden bg-white">
                <Home className="w-6 h-6 text-[#19aaba]" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Hall Management
              </h2>
            </div>
            <p className="text-cyan-100 mb-4 max-w-md leading-relaxed">
              Jashore University of Science and Technology Hall Management System.
              Providing comprehensive residential services and facilities for students across all four halls.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.just.edu.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="JUST Website"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </a>
              <a
                href="mailto:hall.admin@just.edu.bd"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <FileText size={20} />
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-cyan-100 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Home size={16} />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="text-cyan-100 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Users size={16} />
                  Facilities
                </Link>
              </li>
              <li>
                <Link to="/notice" className="text-cyan-100 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <FileText size={16} />
                  Notice
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-cyan-100 hover:text-white transition-colors duration-200 flex items-center gap-2">
                  <Phone size={16} />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Calendar size={20} />
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/room-allocation" className="text-cyan-100 hover:text-white transition-colors duration-200">
                  Room Allocation
                </Link>
              </li>
              <li>
                <span className="text-cyan-100">Maintenance Request</span>
              </li>
              <li>
                <span className="text-cyan-100">Complaint Portal</span>
              </li>
              <li>
                <span className="text-cyan-100">Student Directory</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Hall Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <h4 className="font-semibold text-white mb-2">Boys Halls</h4>
            <ul className="text-cyan-100 text-sm space-y-1">
              <li>Shahid Moushiur Rahman Hall</li>
              <li>Munshi Meherullah Hall</li>
            </ul>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-white mb-2">Girls Halls</h4>
            <ul className="text-cyan-100 text-sm space-y-1">
              <li>Tapashi Rabeya Hall</li>
              <li>Bir Protik Taramon Bibi Hall</li>
            </ul>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-white mb-2">Contact Info</h4>
            <div className="text-cyan-100 text-sm space-y-1">
              <div className="flex items-center justify-center gap-1">
                <Phone size={14} />
                <span>+880 421 714 220</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <Mail size={14} />
                <span>hall.admin@just.edu.bd</span>
              </div>
            </div>
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-white mb-2">Location</h4>
            <div className="text-cyan-100 text-sm flex items-center justify-center gap-1">
              <MapPin size={14} />
              <span>Jashore University of Science and Technology</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-cyan-100 text-sm text-center md:text-left">
              © {currentYear} Jashore University of Science and Technology. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/contact" className="text-cyan-100 hover:text-white text-sm transition-colors duration-200">
                Support
              </Link>
              <Link to="/facilities" className="text-cyan-100 hover:text-white text-sm transition-colors duration-200">
                Hall Rules
              </Link>
              <Link to="/notice" className="text-cyan-100 hover:text-white text-sm transition-colors duration-200">
                Announcements
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
