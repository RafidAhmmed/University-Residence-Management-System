import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  CheckCircle2, 
  Home,
  Bed,
  Shield,
  Wrench,
  Mail,
  FileText,
  ArrowRight
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <Home className="w-7 h-7" />,
      title: "Room Management",
      description: "Efficient allocation and management of residential facilities for students with modern amenities."
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: "Student Services",
      description: "Comprehensive support services including maintenance, security, and student welfare programs."
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: "Security & Safety",
      description: "24/7 security monitoring and emergency response systems to ensure student safety."
    },
    {
      icon: <Wrench className="w-7 h-7" />,
      title: "Maintenance",
      description: "Regular maintenance and upkeep of facilities to provide comfortable living environment."
    }
  ];

  const stats = [
    { number: "4", label: "Residential Halls", icon: <Building2 className="w-6 h-6" /> },
    { number: "3000+", label: "Students Capacity", icon: <Users className="w-6 h-6" /> },
    { number: "500+", label: "Rooms Available", icon: <Bed className="w-6 h-6" /> },
    { number: "24/7", label: "Security Service", icon: <Shield className="w-6 h-6" /> },
  ];

  const highlights = [
    "Modern residential facilities with Wi-Fi connectivity",
    "24/7 security and emergency response services",
    "Regular maintenance and cleaning services",
    "Student welfare and counseling support",
    "Cultural and recreational activities",
    "Proximity to academic buildings and facilities"
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* ===== Hero Section ===== */}
      <section className="relative bg-primary text-white overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div className="text-center lg:text-left space-y-6 animate-slideUp">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight font-heading">
                Welcome to
                <span className="block text-accent mt-1">JUST HallSync</span>
              </h1>
              
              <p className="text-lg text-white/75 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Jashore University of Science and Technology provides modern residential facilities 
                for students with comprehensive hall management services, ensuring a comfortable 
                and secure living environment.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-2">
                <Link
                  to="/facilities"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-secondary font-semibold rounded-lg hover:bg-accent-dark transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Explore Facilities
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/25 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right — Stats Card */}
            <div className="animate-slideUp delay-200">
              <div className="bg-white/8 backdrop-blur-sm rounded-2xl p-7 border border-white/10 shadow-2xl">
                <div className="text-center mb-5">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Building2 className="w-5 h-5 text-accent" />
                    <h3 className="text-lg font-bold font-heading">Hall Statistics</h3>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold mb-0.5">{stat.number}</div>
                      <p className="text-xs uppercase font-semibold text-white/65 tracking-wide">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L60 52C120 44 240 28 360 22C480 16 600 20 720 28C840 36 960 48 1080 52C1200 56 1320 52 1380 50L1440 48V100H0V60Z" fill="#f1faee"/>
          </svg>
        </div>
      </section>

      {/* ===== Stats Section ===== */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3 font-heading">
              Hall <span className="text-secondary">Statistics</span>
            </h2>
            <p className="text-gray-600 max-w-lg mx-auto">Comprehensive overview of our residential facilities</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 text-center border border-gray-100 card-hover"
              >
                <div className="flex justify-center mb-3">
                  <div className="bg-primary text-white p-3 rounded-lg">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-primary mb-1">{stat.number}</h3>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Services Section ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3 font-heading">
              Hall <span className="text-secondary">Services</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive residential services designed to support student life and academic success.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i}
                className="bg-surface rounded-xl p-7 border border-gray-100 hover:border-accent transition-all duration-300 card-hover group"
              >
                <div className="bg-primary text-white p-3.5 rounded-xl w-14 h-14 flex items-center justify-center mb-5 group-hover:bg-secondary transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-primary mb-2 font-heading">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Halls Overview ===== */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-3 font-heading">
              Our <span className="text-secondary">Residential Halls</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Modern residential facilities designed to provide comfortable and secure living environment for students.
            </p>
          </div>

          {/* Male Halls */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-primary mb-5 text-center font-heading">Male Halls</h3>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { name: "Shahid Moushiur Rahman Hall", image: "/SMRH.png" },
                { name: "Munshi Meherullah Hall", image: "/MMH.png" }
              ].map((hall, i) => (
                <div 
                  key={i}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-accent card-hover"
                >
                  <div className="text-center">
                    {hall.image ? (
                      <img src={hall.image} alt={hall.name} className="w-full h-44 object-cover rounded-lg mb-4" />
                    ) : (
                      <div className="w-full h-44 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-primary font-heading">{hall.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Female Halls */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-5 text-center font-heading">Female Halls</h3>
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { name: "Tapashi Rabeya Hall", image: "/TRH.png" },
                { name: "Bir Protik Taramon Bibi Hall", image: "/BPTBH.png" }
              ].map((hall, i) => (
                <div 
                  key={i}
                  className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-accent card-hover"
                >
                  <div className="text-center">
                    {hall.image ? (
                      <img src={hall.image} alt={hall.name} className="w-full h-44 object-cover rounded-lg mb-4" />
                    ) : (
                      <div className="w-full h-44 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                        <Building2 className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-primary font-heading">{hall.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== About Section ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-6 font-heading">
                About <span className="text-secondary">JUST HallSync</span>
              </h2>
              <p className="text-gray-700 text-base leading-relaxed mb-5">
                Jashore University of Science and Technology's Hall Management System provides 
                comprehensive residential services to support student life and academic excellence. 
                Our modern facilities ensure a safe, comfortable, and conducive environment for learning.
              </p>
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                With 4 residential halls accommodating over 3000+ students, we offer state-of-the-art 
                amenities including Wi-Fi connectivity, 24/7 security, recreational facilities, and 
                dedicated support services to enhance the overall student experience.
              </p>
              <div className="flex items-center gap-4">
                <Building2 className="w-10 h-10 text-secondary flex-shrink-0" />
                <div>
                  <p className="font-bold text-primary font-heading">JUST HallSync</p>
                  <p className="text-gray-500 text-sm">Jashore University of Science and Technology</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {highlights.map((text, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 bg-surface p-4 rounded-lg border border-gray-100 hover:border-accent transition-colors duration-200"
                >
                  <CheckCircle2 className="w-5 h-5 text-secondary flex-shrink-0" />
                  <p className="text-gray-700 text-sm font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-5 font-heading">Get in Touch</h2>
          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Need assistance with hall accommodation, maintenance requests, or have questions about our services? 
            Our dedicated team is here to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=rafidahmmed00@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-accent text-secondary font-bold rounded-lg shadow-xl hover:bg-accent-dark hover:shadow-2xl transition-all duration-200"
            >
              Contact Us
              <Mail className="w-5 h-5" />
            </a>
            <Link
              to="/notice"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-white/25 text-white font-bold rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              View Notices
              <FileText className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
