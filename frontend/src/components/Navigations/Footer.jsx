import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Home, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/facilities', label: 'Facilities' },
    { to: '/notice', label: 'Notice board' },
    { to: '/contact', label: 'Contact' },
    { to: '/notice', label: 'Announcements' },
  ];

  const contactItems = [
    { icon: <Phone size={13} />, label: 'Phone', value: '+880 421 714 220' },
    { icon: <Mail size={13} />, label: 'Email', value: 'hall.admin@just.edu.bd' },
    { icon: <MapPin size={13} />, label: 'Location', value: 'Jashore University of Science and Technology' },
  ];

  return (
    <footer
      className="text-white"
      style={{ background: 'linear-gradient(135deg, #0e7a87 0%, #0d6b77 50%, #0a5c68 100%)' }}
    >
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32 pt-10 sm:pt-12 lg:pt-16">

        {/* Top grid — 1 col → 2 col → 3 col */}
        <div className="
          grid gap-8 lg:gap-12 xl:gap-16
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-[2fr_1fr_1fr]
          pb-8 sm:pb-10 lg:pb-14
          border-b border-white/20
        ">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-5">
              <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-14 lg:h-14 rounded-full bg-white/15 border border-white/28 flex items-center justify-center shrink-0">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 text-white" />
              </div>
              <div>
                <p className="text-[15px] sm:text-[16px] lg:text-[22px] xl:text-[24px] font-medium text-white m-0 leading-tight">
                  Hall Management
                </p>
                <p className="text-[10px] sm:text-[11px] lg:text-[13px] text-white/50 tracking-widest m-0">
                  JUST · Est. 2009
                </p>
              </div>
            </div>
            <p className="text-[12px] sm:text-[13px] lg:text-[15px] xl:text-[16px] text-white/70 leading-relaxed mb-5 lg:mb-7 max-w-sm lg:max-w-[340px] xl:max-w-[380px]">
              Comprehensive residential services and facilities for students across all halls at Jashore University of Science and Technology.
            </p>
            <div className="flex gap-2 lg:gap-3">
              <a
                href="https://www.just.edu.bd"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="JUST Website"
              >
                <Globe className="w-[13px] h-[13px] sm:w-[15px] sm:h-[15px] lg:w-[18px] lg:h-[18px] text-white/85" />
              </a>
              <a
                href="mailto:hall.admin@just.edu.bd"
                className="w-8 h-8 sm:w-9 sm:h-9 lg:w-11 lg:h-11 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-[13px] h-[13px] sm:w-[15px] sm:h-[15px] lg:w-[18px] lg:h-[18px] text-white/85" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] sm:text-[11px] lg:text-[13px] font-medium text-white/50 tracking-widest uppercase mb-3 sm:mb-4 lg:mb-5">
              Navigation
            </p>
            <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3.5 list-none p-0 m-0">
              {navLinks.map(({ to, label }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-[12px] sm:text-[13px] lg:text-[15px] xl:text-[16px] text-white/80 hover:text-white transition-colors flex items-center gap-2 lg:gap-3 no-underline"
                  >
                    <span className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-white/35 shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] sm:text-[11px] lg:text-[13px] font-medium text-white/50 tracking-widest uppercase mb-3 sm:mb-4 lg:mb-5">
              Contact
            </p>
            <div className="space-y-3 sm:space-y-3.5 lg:space-y-5">
              {contactItems.map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-2.5 lg:gap-3.5">
                  <div className="w-7 h-7 sm:w-[30px] sm:h-[30px] lg:w-9 lg:h-9 rounded-md lg:rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-white/80">
                    <span className="scale-100 lg:scale-125">{icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] lg:text-[12px] text-white/48 m-0 mb-0.5">{label}</p>
                    <p className="text-[12px] sm:text-[13px] lg:text-[15px] xl:text-[16px] text-white/85 m-0 leading-snug">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 py-4 sm:py-5 lg:py-6">
          <p className="text-[11px] sm:text-[12px] lg:text-[14px] text-white/42 m-0">
            © {currentYear} Jashore University of Science and Technology. All rights reserved.
          </p>
          <div className="flex gap-5 sm:gap-6 lg:gap-8">
            <Link
              to="/contact"
              className="text-[11px] sm:text-[12px] lg:text-[14px] text-white/48 hover:text-white/80 transition-colors no-underline"
            >
              Support
            </Link>
            <Link
              to="/notice"
              className="text-[11px] sm:text-[12px] lg:text-[14px] text-white/48 hover:text-white/80 transition-colors no-underline"
            >
              Announcements
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;