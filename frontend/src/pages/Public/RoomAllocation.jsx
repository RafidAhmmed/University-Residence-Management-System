import React, { useState } from 'react';
import {
  Bed,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  FileText,
  Clock,
  MapPin,
  Phone,
  Mail,
  Info,
  Star,
  Home,
  UserCheck
} from 'lucide-react';

const RoomAllocation = () => {
  const [selectedHall, setSelectedHall] = useState('all');

  // Room types data
  const roomTypes = [
    {
      type: 'Double Room',
      icon: Users,
      capacity: 2,
      facilities: ['Shared bathroom', 'Study desks', 'Storage space', 'Wardrobes', 'WiFi', 'Fans'],
      price: '৳ 400/month',
      availability: 'Available'
    },
    {
      type: 'Quadraple Room',
      icon: Users,
      capacity: 4,
      facilities: ['Common bathroom', 'Study desks', 'Storage space', 'Wardrobes', 'WiFi', 'Fans'],
      price: '৳ 200/month',
      availability: 'Available',
    },
    {
      type: 'Gono Room',
      icon: Bed,
      capacity: 8,
      facilities: ['Common bathroom', 'Study desk', 'Wardrobe', 'WiFi', 'Fans'],
      price: '৳ 100/month',
      availability: 'Limited',
    }
  ];

  // Hall data
  const halls = [
    {
      id: 'shahid-moushiur-rahman',
      name: 'Shahid Moushiur Rahman Hall',
      type: 'Boys',
      totalRooms: 80,
      availableRooms: 8,
      occupancy: '90%'
    },
    {
      id: 'munshi-meherullah',
      name: 'Munshi Meherullah Hall',
      type: 'Boys',
      totalRooms: 190,
      availableRooms: 32,
      occupancy: '83%'
    },
    {
      id: 'tapashi-rabeya',
      name: 'Tapashi Rabeya Hall',
      type: 'Girls',
      totalRooms: 70,
      availableRooms: 9,
      occupancy: '87%'
    },
    {
      id: 'bir-protik-taramon-bibi',
      name: 'Bir Protik Taramon Bibi Hall',
      type: 'Girls',
      totalRooms: 145,
      availableRooms: 22,
      occupancy: '85%'
    }
  ];

  // Allocation process steps
  const allocationSteps = [
    {
      step: 1,
      title: 'Online Application',
      description: 'Submit your room allocation application through the online portal with required documents.',
      icon: FileText,
      details: ['Student ID', 'Admission letter', 'Medical certificate', 'Guardian consent']
    },
    {
      step: 2,
      title: 'Document Verification',
      description: 'Hall administration verifies all submitted documents and eligibility criteria.',
      icon: CheckCircle,
      details: ['Academic records', 'Financial status', 'Disciplinary record', 'Medical fitness']
    },
    {
      step: 3,
      title: 'Room Assignment',
      description: 'Based on availability, merit, and preferences, rooms are allocated to eligible students.',
      icon: Home,
      details: ['Room type preference', 'Hall preference', 'Special requirements', 'Batch priority']
    },
    {
      step: 4,
      title: 'Confirmation & Payment',
      description: 'Receive room allocation letter and complete the payment process to confirm your room.',
      icon: UserCheck,
      details: ['Allocation letter', 'Fee payment', 'Room key collection', 'Move-in date']
    }
  ];

  // Important dates
  const importantDates = [
    {
      event: '2025 Application Opens',
      date: 'November 25, 2025',
      status: 'Open'
    },
    {
      event: 'Application Deadline',
      date: 'December 15, 2025',
      status: 'Upcoming'
    },
    {
      event: 'Room Allocation Results',
      date: 'December 20, 2025',
      status: 'Upcoming'
    },
    {
      event: 'Move-in Period',
      date: 'January 1-5, 2026',
      status: 'Upcoming'
    }
  ];

  const filteredHalls = selectedHall === 'all' ? halls : halls.filter(hall => hall.id === selectedHall);

  const RoomTypeCard = ({ room }) => {
    const Icon = room.icon;
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white p-6">
          <div className="flex items-center gap-3 mb-2">
            <Icon size={24} />
            <h3 className="text-xl font-bold">{room.type}</h3>
          </div>
          <div className="flex items-center gap-2 text-cyan-100">
            <Users size={16} />
            <span>Capacity: {room.capacity} student{room.capacity > 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">{room.description}</p>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Facilities:</h4>
            <ul className="space-y-1">
              {room.facilities.map((facility, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                  {facility}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-[#19aaba]">{room.price}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                room.availability === 'Available'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {room.availability}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProcessStep = ({ step, index }) => {
    const Icon = step.icon;
    return (
      <div className="relative">
        {/* Connector Line */}
        {index < allocationSteps.length - 1 && (
          <div className="hidden md:block absolute top-12 left-6 w-full h-0.5 bg-[#19aaba]/30"></div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-[#19aaba] to-[#158c99] rounded-full flex items-center justify-center text-white font-bold">
                {step.step}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={20} className="text-[#19aaba]" />
                <h3 className="text-lg font-bold text-gray-800">{step.title}</h3>
              </div>

              <p className="text-gray-600 mb-3">{step.description}</p>

              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Required:</h4>
                <ul className="space-y-1">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle size={12} className="text-green-500 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Home size={48} className="mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">Room Allocation</h1>
            </div>
            <p className="text-xl md:text-2xl text-cyan-100 max-w-3xl mx-auto">
              Secure your accommodation at Jashore University of Science and Technology
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-[#19aaba] mb-2">
              {halls.reduce((sum, hall) => sum + hall.totalRooms, 0)}
            </div>
            <div className="text-gray-600">Total Rooms</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-500 mb-2">
              {halls.reduce((sum, hall) => sum + hall.availableRooms, 0)}
            </div>
            <div className="text-gray-600">Available Now</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {Math.round(halls.reduce((sum, hall) => sum + parseInt(hall.occupancy), 0) / halls.length)}%
            </div>
            <div className="text-gray-600">Avg. Occupancy</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-500 mb-2">3</div>
            <div className="text-gray-600">Room Types</div>
          </div>
        </div>

        {/* Room Types Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Room Types & Facilities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our range of accommodation options designed to meet different needs and budgets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roomTypes.map((room, index) => (
              <RoomTypeCard key={index} room={room} />
            ))}
          </div>
        </div>

        {/* Hall Availability */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Current Availability</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check room availability across all halls
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Hall Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Total Rooms</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Available</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-800">Occupancy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {halls.map((hall) => (
                    <tr key={hall.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{hall.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          hall.type === 'Boys' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                        }`}>
                          {hall.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{hall.totalRooms}</td>
                      <td className="px-6 py-4 text-sm text-green-600 font-medium">{hall.availableRooms}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{hall.occupancy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Allocation Process */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Allocation Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to secure your room allocation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {allocationSteps.map((step, index) => (
              <ProcessStep key={index} step={step} index={index} />
            ))}
          </div>
        </div>

        {/* Important Dates */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Important Dates</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mark these dates in your calendar for room allocation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {importantDates.map((item, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      item.status === 'Open' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <Calendar size={20} className={item.status === 'Open' ? 'text-green-600' : 'text-blue-600'} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">{item.event}</h3>
                    <p className="text-[#19aaba] font-medium mb-2">{item.date}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === 'Open'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <Info size={24} className="text-[#19aaba]" />
              <h2 className="text-2xl font-bold text-gray-800">Eligibility Criteria</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Academic Requirements:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    Currently enrolled student
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    Minimum CGPA of 2.5
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    No disciplinary issues
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Other Requirements:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    Medical fitness certificate
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    Guardian consent form
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    Financial clearance
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] rounded-xl text-white p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help with Room Allocation?</h2>
          <p className="text-cyan-100 mb-6 max-w-2xl mx-auto">
            Our dedicated team is here to assist you with any questions about the room allocation process
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <Phone size={24} className="mb-2" />
              <div className="font-semibold">Hall Office</div>
              <div className="text-cyan-100">+880 421 714 221</div>
            </div>

            <div className="flex flex-col items-center">
              <Mail size={24} className="mb-2" />
              <div className="font-semibold">Email</div>
              <div className="text-cyan-100">hall.admin@just.edu.bd</div>
            </div>

            <div className="flex flex-col items-center">
              <MapPin size={24} className="mb-2" />
              <div className="font-semibold">Location</div>
              <div className="text-cyan-100">Hall Administration Building</div>
            </div>
          </div>

          <div className="mt-6">
            <button className="bg-white text-[#19aaba] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomAllocation;
