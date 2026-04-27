import React, { useState } from 'react';
import {
  Home, Users, Wifi, Zap, Droplets, Shield, Car, Utensils,
  Dumbbell, BookOpen, Heart, Phone, MapPin, Star, CheckCircle
} from 'lucide-react';

const Facilities = () => {
  const [selectedHall, setSelectedHall] = useState('all');

  const halls = [
    {
      id: 'shahid-moushiur-rahman', name: 'Shahid Moushiur Rahman Hall', type: 'boys',
      shortName: 'SMR Hall', capacity: 500, established: 2010,
      image: '/SMRH.png',
      description: 'Named after the brave freedom fighter, this hall provides excellent facilities for male students with modern amenities and a vibrant community atmosphere.',
      location: 'West Campus',
      facilities: [
        { icon: Home, name: 'Accommodation', description: '500 Seats for male students' },
        { icon: Utensils, name: 'Dining Hall', description: 'Modern mess with hygienic food preparation' },
        { icon: BookOpen, name: 'Study Rooms', description: '24/7 study areas with internet access' },
        { icon: Wifi, name: 'WiFi Coverage', description: 'High-speed internet throughout the hall' },
        { icon: Shield, name: 'Security', description: '24/7 security with CCTV surveillance' },
        { icon: Car, name: 'Parking', description: 'Dedicated parking for students and visitors' },
        { icon: Heart, name: 'Medical Room', description: 'Basic healthcare facilities' }
      ],
      highlights: ['First boys hall on campus', 'Central Field for sports', 'Common room with entertainment', 'Prayer room for religious activities']
    },
    {
      id: 'munshi-meherullah', name: 'Munshi Meherullah Hall', type: 'boys',
      shortName: 'MM Hall', capacity: 1000, established: 2024,
      image: '/MMH.png',
      description: 'A modern residential hall dedicated to academic excellence and personal development, providing a conducive environment for focused studies.',
      location: 'Center Campus',
      facilities: [
        { icon: Home, name: 'Accommodation', description: '1000 Seats for male students' },
        { icon: Utensils, name: 'Dining Hall', description: 'Modern mess with hygienic food preparation' },
        { icon: Car, name: 'Parking', description: 'Dedicated parking for students and visitors' },
        { icon: BookOpen, name: 'Study Rooms', description: '24/7 study areas with internet access' },
        { icon: Wifi, name: 'Internet', description: 'Campus-wide network access' },
        { icon: Shield, name: 'Safety', description: 'Round-the-clock security services' },
        { icon: Car, name: 'Transport', description: 'Shuttle service to academic buildings' },
        { icon: Heart, name: 'Health Center', description: 'On-site medical assistance' }
      ],
      highlights: ['Biggest boys hall on campus', 'Academic excellence focus', 'Cultural activities center', 'Prayer room for religious activities']
    },
    {
      id: 'tapashi-rabeya', name: 'Tapashi Rabeya Hall', type: 'girls',
      shortName: 'TR Hall', capacity: 500, established: 2012,
      image: '/TRH.png',
      description: 'A safe and nurturing environment for female students, combining academic rigor with personal growth and community building.',
      location: 'South-West Campus',
      facilities: [
        { icon: Home, name: 'Accommodation', description: '500 Seats for female students' },
        { icon: Utensils, name: 'Dining Services', description: 'Nutritious and hygienic meal services' },
        { icon: BookOpen, name: 'Study Areas', description: 'Quiet study zones and group study rooms' },
        { icon: Shield, name: 'Security', description: 'Enhanced security measures for women' },
        { icon: Dumbbell, name: 'Fitness Center', description: 'Women-only gymnasium facilities' },
        { icon: Wifi, name: 'Connectivity', description: 'High-speed internet and communication' },
        { icon: Car, name: 'Transportation', description: 'Safe transport services' },
        { icon: Heart, name: 'Wellness', description: 'Health and wellness support services' }
      ],
      highlights: ['Women empowerment focus', 'Safe and secure environment', 'Internal cultural programs', 'Community service initiatives']
    },
    {
      id: 'bir-protik-taramon-bibi', name: 'Bir Protik Taramon Bibi Hall', type: 'girls',
      shortName: 'BPTB Hall', capacity: 1000, established: 2024,
      image: '/BPTBH.png',
      description: 'Honoring the brave freedom fighter, this hall inspires courage and determination while providing excellent facilities for academic and personal growth.',
      location: 'South Campus',
      facilities: [
        { icon: Home, name: 'Accommodation', description: '1000 Seats for female students' },
        { icon: Utensils, name: 'Dining Services', description: 'Nutritious and hygienic meal services' },
        { icon: BookOpen, name: 'Learning Spaces', description: 'Dedicated academic support areas' },
        { icon: Wifi, name: 'Technology', description: 'Digital learning and connectivity' },
        { icon: Dumbbell, name: 'Recreation', description: 'Sports and recreational facilities' },
        { icon: Shield, name: 'Protection', description: 'Comprehensive security systems' },
        { icon: Car, name: 'Mobility', description: 'Accessible transportation options' },
        { icon: Heart, name: 'Care', description: 'Holistic health and wellbeing support' }
      ],
      highlights: ['Inspiration from freedom fighters', 'Innovation and creativity focus', 'Environmental sustainability', 'Modern Facilities with a focus on student wellbeing']
    }
  ];

  const filteredHalls = selectedHall === 'all' ? halls : halls.filter(hall => hall.id === selectedHall);

  const FacilityCard = ({ icon: Icon, name, description }) => (
    <div className="bg-surface rounded-lg p-4 border border-gray-100 hover:border-accent transition-colors duration-200">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-accent/30 rounded-lg">
          <Icon size={18} className="text-secondary" />
        </div>
        <h4 className="font-semibold text-primary text-sm">{name}</h4>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  const HallCard = ({ hall }) => (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-100 card-hover">
      {/* Header */}
      <div className="bg-primary text-white p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold font-heading">{hall.name}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
            hall.type === 'boys' ? 'bg-blue-500/20 text-blue-100' : 'bg-pink-500/20 text-pink-100'
          }`}>
            {hall.type === 'boys' ? 'Boys Hall' : 'Girls Hall'}
          </span>
        </div>
        <p className="text-white/60 text-sm">{hall.shortName}</p>
      </div>

      {/* Hall image */}
      {hall.image ? (
        <img src={hall.image} alt={hall.name} className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 bg-gray-100 flex items-center justify-center">
          <Home size={48} className="text-gray-300" />
        </div>
      )}

      {/* Info */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{hall.capacity}</div>
            <div className="text-xs text-gray-500">Capacity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-secondary">{hall.established}</div>
            <div className="text-xs text-gray-500">Established</div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{hall.description}</p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <MapPin size={14} />
          <span>{hall.location}</span>
        </div>

        {/* Facilities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
          {hall.facilities.slice(0, 4).map((facility, i) => (
            <FacilityCard key={i} {...facility} />
          ))}
        </div>

        {/* Highlights */}
        <div className="border-t border-gray-100 pt-4">
          <h4 className="font-semibold text-primary text-sm mb-2 flex items-center gap-2 font-heading">
            <Star size={14} className="text-yellow-500" />
            Key Highlights
          </h4>
          <ul className="space-y-1">
            {hall.highlights.map((highlight, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={13} className="text-secondary flex-shrink-0" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Banner */}
      <div className="page-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <Home size={40} className="mr-3 text-accent" />
            <h1 className="text-3xl sm:text-4xl font-bold font-heading">Hall Facilities</h1>
          </div>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Discover the exceptional residential facilities at Jashore University of Science and Technology
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            <span className="text-gray-600 font-medium text-sm">Filter by Hall:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedHall('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedHall === 'all'
                    ? 'bg-accent text-secondary'
                    : 'bg-surface text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Halls
              </button>
              {halls.map(hall => (
                <button
                  key={hall.id}
                  onClick={() => setSelectedHall(hall.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedHall === hall.id
                      ? 'bg-accent text-secondary'
                      : 'bg-surface text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {hall.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5 text-center border border-gray-100">
            <div className="text-2xl font-bold text-primary mb-1">{halls.length}</div>
            <div className="text-gray-500 text-sm">Total Halls</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 text-center border border-gray-100">
            <div className="text-2xl font-bold text-blue-600 mb-1">{halls.filter(h => h.type === 'boys').length}</div>
            <div className="text-gray-500 text-sm">Boys Halls</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 text-center border border-gray-100">
            <div className="text-2xl font-bold text-pink-500 mb-1">{halls.filter(h => h.type === 'girls').length}</div>
            <div className="text-gray-500 text-sm">Girls Halls</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5 text-center border border-gray-100">
            <div className="text-2xl font-bold text-secondary mb-1">{halls.reduce((s, h) => s + h.capacity, 0)}</div>
            <div className="text-gray-500 text-sm">Total Capacity</div>
          </div>
        </div>

        {/* Halls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredHalls.map(hall => (
            <HallCard key={hall.id} hall={hall} />
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 bg-white rounded-xl shadow-sm p-7 text-center border border-gray-100">
          <h2 className="text-xl font-bold text-primary mb-3 font-heading">Need More Information?</h2>
          <p className="text-gray-600 mb-5 max-w-2xl mx-auto text-sm">
            For detailed information about hall facilities, admission procedures, or to schedule a visit,
            please contact the Hall Administration Office.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Phone size={16} className="text-secondary" />
              <span>+880 421 714 221</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin size={16} className="text-secondary" />
              <span>Jashore University of Science and Technology</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facilities;
