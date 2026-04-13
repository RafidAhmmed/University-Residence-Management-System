import React, { useState } from 'react';
import {
  Home,
  Users,
  Wifi,
  Zap,
  Droplets,
  Shield,
  Car,
  Utensils,
  Dumbbell,
  BookOpen,
  Heart,
  Phone,
  MapPin,
  Star,
  CheckCircle
} from 'lucide-react';

const Facilities = () => {
  const [selectedHall, setSelectedHall] = useState('all');

  // Hall data
  const halls = [
    {
      id: 'shahid-moushiur-rahman',
      name: 'Shahid Moushiur Rahman Hall',
      type: 'boys',
      shortName: 'SMR Hall',
      capacity: 500,
      established: 2010,
      description: 'Named after the brave freedom fighter, this hall provides excellent facilities for male students with modern amenities and a vibrant community atmosphere.',
      location: 'West Campus',
      image: '/api/placeholder/600/400',
      facilities: [
        { icon: Home, name: 'Accommodation', description: '500 single and double occupancy rooms' },
        { icon: Utensils, name: 'Dining Hall', description: 'Modern mess with hygienic food preparation' },
        { icon: BookOpen, name: 'Study Rooms', description: '24/7 study areas with internet access' },
        { icon: Dumbbell, name: 'Gymnasium', description: 'Fully equipped fitness center' },
        { icon: Wifi, name: 'WiFi Coverage', description: 'High-speed internet throughout the hall' },
        { icon: Shield, name: 'Security', description: '24/7 security with CCTV surveillance' },
        { icon: Car, name: 'Parking', description: 'Dedicated parking for students and visitors' },
        { icon: Heart, name: 'Medical Room', description: 'Basic healthcare facilities' }
      ],
      highlights: [
        'First boys hall on campus',
        'Central Field for sports',
        'Common room with entertainment',
        'Prayer room for religious activities'
      ]
    },
    {
      id: 'munshi-meherullah',
      name: 'Munshi Meherullah Hall',
      type: 'boys',
      shortName: 'MM Hall',
      capacity: 1000,
      established: 2024,
      description: 'A modern residential hall dedicated to academic excellence and personal development, providing a conducive environment for focused studies.',
      location: 'Center Campus',
      image: '/api/placeholder/600/400',
      facilities: [
        { icon: Home, name: 'Accommodation', description: '1000 well-furnished rooms' },
        { icon: Utensils, name: 'Cafeteria', description: 'Multi-cuisine dining options' },
        { icon: BookOpen, name: 'Library Corner', description: 'Reading room with academic resources' },
        { icon: Dumbbell, name: 'Sports Facilities', description: 'Indoor games and outdoor sports' },
        { icon: Wifi, name: 'Internet', description: 'Campus-wide network access' },
        { icon: Shield, name: 'Safety', description: 'Round-the-clock security services' },
        { icon: Car, name: 'Transport', description: 'Shuttle service to academic buildings' },
        { icon: Heart, name: 'Health Center', description: 'On-site medical assistance' }
      ],
      highlights: [
        'Biggest boys hall on campus',
        'Academic excellence focus',
        'Cultural activities center',
        'Green and eco-friendly environment'
      ]
    },
    {
      id: 'tapashi-rabeya',
      name: 'Tapashi Rabeya Hall',
      type: 'girls',
      shortName: 'TR Hall',
      capacity: 500,
      established: 2012,
      description: 'A safe and nurturing environment for female students, combining academic rigor with personal growth and community building.',
      location: 'South-West Campus',
      image: '/api/placeholder/600/400',
      facilities: [
        { icon: Home, name: 'Accommodation', description: '500 comfortable rooms with modern amenities' },
        { icon: Utensils, name: 'Dining Services', description: 'Nutritious and hygienic meal services' },
        { icon: BookOpen, name: 'Study Areas', description: 'Quiet study zones and group study rooms' },
        { icon: Dumbbell, name: 'Fitness Center', description: 'Women-only gymnasium facilities' },
        { icon: Wifi, name: 'Connectivity', description: 'High-speed internet and communication' },
        { icon: Shield, name: 'Security', description: 'Enhanced security measures for women' },
        { icon: Car, name: 'Transportation', description: 'Safe transport services' },
        { icon: Heart, name: 'Wellness', description: 'Health and wellness support services' }
      ],
      highlights: [
        'Women empowerment focus',
        'Safe and secure environment',
        'Leadership development programs',
        'Community service initiatives'
      ]
    },
    {
      id: 'bir-protik-taramon-bibi',
      name: 'Bir Protik Taramon Bibi Hall',
      type: 'girls',
      shortName: 'BPTB Hall',
      capacity: 1000,
      established: 2024,
      description: 'Honoring the brave freedom fighter, this hall inspires courage and determination while providing excellent facilities for academic and personal growth.',
      location: 'South Campus',
      image: '/api/placeholder/600/400',
      facilities: [
        { icon: Home, name: 'Accommodation', description: '1000 modern residential units' },
        { icon: Utensils, name: 'Food Services', description: 'Quality nutrition and dietary services' },
        { icon: BookOpen, name: 'Learning Spaces', description: 'Dedicated academic support areas' },
        { icon: Dumbbell, name: 'Recreation', description: 'Sports and recreational facilities' },
        { icon: Wifi, name: 'Technology', description: 'Digital learning and connectivity' },
        { icon: Shield, name: 'Protection', description: 'Comprehensive security systems' },
        { icon: Car, name: 'Mobility', description: 'Accessible transportation options' },
        { icon: Heart, name: 'Care', description: 'Holistic health and wellbeing support' }
      ],
      highlights: [
        'Inspiration from freedom fighters',
        'Innovation and creativity focus',
        'Environmental sustainability',
        'Cultural heritage preservation'
      ]
    }
  ];

  const filteredHalls = selectedHall === 'all' ? halls : halls.filter(hall => hall.id === selectedHall);

  const FacilityCard = ({ icon: Icon, name, description }) => (
    <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[#19aaba]/10 rounded-lg">
          <Icon size={20} className="text-[#19aaba]" />
        </div>
        <h4 className="font-semibold text-gray-800">{name}</h4>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );

  const HallCard = ({ hall }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
      {/* Hall Header */}
      <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">{hall.name}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            hall.type === 'boys' ? 'bg-blue-500/20 text-blue-100' : 'bg-pink-500/20 text-pink-100'
          }`}>
            {hall.type === 'boys' ? 'Boys Hall' : 'Girls Hall'}
          </span>
        </div>
        <p className="text-cyan-100 text-sm">{hall.shortName}</p>
      </div>

      {/* Hall Image */}
      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <Home size={64} className="text-gray-400" />
      </div>

      {/* Hall Info */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#19aaba]">{hall.capacity}</div>
            <div className="text-sm text-gray-600">Capacity</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#19aaba]">{hall.established}</div>
            <div className="text-sm text-gray-600">Established</div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{hall.description}</p>

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <MapPin size={16} />
          <span>{hall.location}</span>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {hall.facilities.slice(0, 4).map((facility, index) => (
            <FacilityCard key={index} {...facility} />
          ))}
        </div>

        {/* Highlights */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <Star size={16} className="text-yellow-500" />
            Key Highlights
          </h4>
          <ul className="space-y-1">
            {hall.highlights.map((highlight, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Home size={48} className="mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">Hall Facilities</h1>
            </div>
            <p className="text-xl md:text-2xl text-cyan-100 max-w-3xl mx-auto">
              Discover the exceptional residential facilities at Jashore University of Science and Technology
            </p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <span className="text-gray-600 font-medium">Filter by Hall:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedHall('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedHall === 'all'
                    ? 'bg-[#19aaba] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Halls
              </button>
              {halls.map(hall => (
                <button
                  key={hall.id}
                  onClick={() => setSelectedHall(hall.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedHall === hall.id
                      ? 'bg-[#19aaba] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {hall.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#19aaba] mb-2">{halls.length}</div>
            <div className="text-gray-600">Total Halls</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {halls.filter(h => h.type === 'boys').length}
            </div>
            <div className="text-gray-600">Boys Halls</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-pink-500 mb-2">
              {halls.filter(h => h.type === 'girls').length}
            </div>
            <div className="text-gray-600">Girls Halls</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {halls.reduce((sum, hall) => sum + hall.capacity, 0)}
            </div>
            <div className="text-gray-600">Total Capacity</div>
          </div>
        </div>

        {/* Halls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredHalls.map(hall => (
            <HallCard key={hall.id} hall={hall} />
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Need More Information?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            For detailed information about hall facilities, admission procedures, or to schedule a visit,
            please contact the Hall Administration Office.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2 text-gray-600">
              <Phone size={20} />
              <span>+880 421 714 221</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={20} />
              <span>Jashore University of Science and Technology</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facilities;
