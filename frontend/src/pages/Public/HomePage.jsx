import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  ArrowRight,
  Factory,
  Clock,
  Globe,
  Bus,
  Hotel,
  Camera,
  Target,
  Timer,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Loader,
  Home,
  Bed,
  Shield,
  Wrench,
  Phone,
  Mail,
  FileText,
  Award
} from 'lucide-react';


const HomePage = () => {
  // No complex state needed for hall management homepage
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide for hero images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    {
      icon: <Home className="w-8 h-8" />,
      title: "Room Management",
      description: "Efficient allocation and management of residential facilities for students with modern amenities."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Student Services",
      description: "Comprehensive support services including maintenance, security, and student welfare programs."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security & Safety",
      description: "24/7 security monitoring and emergency response systems to ensure student safety."
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Maintenance",
      description: "Regular maintenance and upkeep of facilities to provide comfortable living environment."
    }
  ];

  const stats = [
    { number: "4", label: "Residential Halls", icon: <Building2 className="w-6 h-6" /> },
    { number: "3000+", label: "Students Capacity", icon: <Users className="w-6 h-6" /> },
    { number: "500+", label: "Rooms Available", icon: <Bed className="w-6 h-6" /> },
    { number: "24/7", label: "Security Service", icon: <Shield className="w-6 h-6" /> },
    // { number: "15+", label: "Years Experience", icon: <Award className="w-6 h-6" /> }
    // { number: "100%", label: "Satisfaction Rate", icon: <CheckCircle2 className="w-6 h-6" /> }
  ];

  const highlights = [
    { text: "Modern residential facilities with Wi-Fi connectivity", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "24/7 security and emergency response services", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "Regular maintenance and cleaning services", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "Student welfare and counseling support", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "Cultural and recreational activities", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "Proximity to academic buildings and facilities", icon: <CheckCircle2 className="w-5 h-5" /> }
  ];

  const heroImages = [
    {
      url: "/api/placeholder/800/600",
      title: "JUST Campus View",
      caption: "Beautiful campus environment"
    },
    {
      url: "/api/placeholder/800/600", 
      title: "Student Residence",
      caption: "Modern residential facilities"
    },
    {
      url: "/api/placeholder/800/600",
      title: "Hall Common Area",
      caption: "Comfortable living spaces"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white h-[100vh]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-2 gap-4 items-center">
            {/* Left Content */}
            <div className="text-center md:text-left space-y-6">
              {/* <div className="inline-block">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                  Hall Management System | JUST
                </span>
              </div>
               */}
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Welcome to
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Hall Management
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-100 max-w-2xl">
                Jashore University of Science and Technology provides modern residential facilities 
                for students with comprehensive hall management services, ensuring a comfortable 
                and secure living environment.
              </p>
              
              {/* <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/login"
                  className="group bg-white text-[#19aaba] px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Student Portal
                  <Users className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div> */}
            </div>

            {/* Right Content - Stats Card */}
            <div className="block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#19aaba] to-[#22c5d7] rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl space-y-6">
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Building2 className="w-6 h-6" />
                      <h3 className="text-xl font-bold">Hall Statistics</h3>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold mb-1">4</div>
                        <p className="text-xs uppercase font-semibold text-white/80">Halls</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold mb-1">3000+</div>
                        <p className="text-xs uppercase font-semibold text-white/80">Students</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold mb-1">500+</div>
                        <p className="text-xs uppercase font-semibold text-white/80">Rooms</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold mb-1 animate-pulse">24/7</div>
                        <p className="text-xs uppercase font-semibold text-white/80">Security</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V320H0V120Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Hall <span className="bg-gradient-to-r from-[#19aaba] to-[#158c99] bg-clip-text text-transparent">Statistics</span>
            </h2>
            <p className="text-lg text-gray-600">Comprehensive overview of our residential facilities</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100"
              >
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-br from-[#19aaba] to-[#158c99] text-white p-3 rounded-xl">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</h3>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hall Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Hall <span className="bg-gradient-to-r from-[#19aaba] to-[#158c99] bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive residential services designed to support student life and academic success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#19aaba]"
              >
                <div className="bg-gradient-to-br from-[#19aaba] to-[#158c99] text-white p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Halls Overview Section */}
      <section className="py-20 bg-gradient-to-br from-[#19aaba]/10 via-[#19aaba]/5 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="bg-gradient-to-r from-[#19aaba] to-[#158c99] bg-clip-text text-transparent">Residential Halls</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Modern residential facilities designed to provide comfortable and secure living environment for students.
            </p>
          </div>

          {/* Male Halls */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Male Halls</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: "Shahid Moushiur Rahman Hall", image: "/SMRH.png" },
                { name: "Munshi Meherullah Hall", image: "" }
              ].map((hall, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#19aaba] cursor-pointer group"
                >
                  <div className="text-center">
                    <img src={hall.image} alt={hall.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">{hall.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Female Halls */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Female Halls</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: "Tapashi Rabeya Hall", image: "" },
                { name: "Bir Protik Taramon Bibi Hall", image: "" }
              ].map((hall, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#19aaba] cursor-pointer group"
                >
                  <div className="text-center">
                    <img src={hall.image} alt={hall.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">{hall.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About <span className="bg-gradient-to-r from-[#19aaba] to-[#158c99] bg-clip-text text-transparent">Hall Management</span>
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Jashore University of Science and Technology's Hall Management System provides 
                comprehensive residential services to support student life and academic excellence. 
                Our modern facilities ensure a safe, comfortable, and conducive environment for learning.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                With 4 residential halls accommodating over 3000+ students, we offer state-of-the-art 
                amenities including Wi-Fi connectivity, 24/7 security, recreational facilities, and 
                dedicated support services to enhance the overall student experience.
              </p>
              <div className="flex items-center gap-4">
                <Building2 className="w-12 h-12 text-[#19aaba]" />
                <div>
                  <p className="font-bold text-gray-900">JUST Hall Management</p>
                  <p className="text-gray-600">Jashore University of Science and Technology</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {highlights.map((highlight, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                >
                  <div className="text-green-500 flex-shrink-0">
                    {highlight.icon}
                  </div>
                  <p className="text-gray-700 font-medium">{highlight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Get in Touch
          </h2>
          <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto">
            Need assistance with hall accommodation, maintenance requests, or have questions about our services? 
            Our dedicated team is here to help you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hall@just.edu.bd"
              className="group bg-white text-[#19aaba] px-10 py-4 rounded-full font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Contact Us
              <Mail className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              to="/rules"
              className="group border-2 border-white text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-[#19aaba] transition-all duration-300 flex items-center justify-center gap-2"
            >
              Hall Rules
              <FileText className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Contact Info
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-gray-200 mb-4">Hall Management Office</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <p className="font-semibold">Email: hall@just.edu.bd</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <p className="font-semibold">Phone: +880 421 62005</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <p className="font-semibold">Location: JUST Campus, Jashore</p>
              </div>
            </div>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
