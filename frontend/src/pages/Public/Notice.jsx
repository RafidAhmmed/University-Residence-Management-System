import React, { useState } from 'react';
import { Calendar, Clock, User, Search, Filter, Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';

const Notice = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Demo notice data
  const notices = [
    {
      id: 1,
      title: "Hall Admission Notice for 2025",
      content: "All eligible students are requested to complete their hall admission process by March 15, 2025. Late admissions will not be accepted.",
      category: "admission",
      priority: "high",
      date: "2025-11-20",
      time: "10:00 AM",
      author: "Hall Administration",
      attachments: 1
    },
    {
      id: 2,
      title: "Monthly Mess Fee Payment Reminder",
      content: "Mess fees for the month of November must be paid by November 30, 2025. Payment can be made through the online portal or at the hall office.",
      category: "payment",
      priority: "medium",
      date: "2025-11-18",
      time: "2:30 PM",
      author: "Finance Department",
      attachments: 0
    },
    {
      id: 3,
      title: "Emergency Maintenance Work Notice",
      content: "Electrical maintenance work will be conducted in Block A on November 25, 2025, from 9 AM to 5 PM. Power may be interrupted during this period.",
      category: "maintenance",
      priority: "high",
      date: "2025-11-15",
      time: "9:00 AM",
      author: "Maintenance Team",
      attachments: 0
    },
    {
      id: 4,
      title: "Cultural Program Registration Open",
      content: "Registration for the upcoming Inter-Hall Cultural Competition is now open. Interested students can register at the hall office until December 5, 2025.",
      category: "event",
      priority: "low",
      date: "2025-11-12",
      time: "11:00 AM",
      author: "Cultural Committee",
      attachments: 1
    },
    {
      id: 5,
      title: "WiFi Network Upgrade Notice",
      content: "Hall WiFi network will be upgraded on November 28, 2025. Internet services may be intermittent for 2-3 hours during the upgrade.",
      category: "technical",
      priority: "medium",
      date: "2025-11-10",
      time: "4:00 PM",
      author: "IT Department",
      attachments: 0
    },
    {
      id: 6,
      title: "Room Change Application Period",
      content: "Applications for room changes for 2025 are now being accepted. Submit your application with valid reasons by December 10, 2025.",
      category: "admission",
      priority: "medium",
      date: "2025-11-08",
      time: "1:00 PM",
      author: "Hall Administration",
      attachments: 1
    },
    {
      id: 7,
      title: "Health Check-up Camp Schedule",
      content: "Free health check-up camp will be organized on December 2, 2025, from 10 AM to 4 PM in the hall common room. All students are encouraged to participate.",
      category: "health",
      priority: "low",
      date: "2025-11-05",
      time: "3:00 PM",
      author: "Health Committee",
      attachments: 0
    },
    {
      id: 8,
      title: "Security Guidelines Update",
      content: "Updated security guidelines have been implemented. All residents must follow the new check-in/check-out procedures and visitor policies.",
      category: "security",
      priority: "high",
      date: "2025-11-03",
      time: "10:30 AM",
      author: "Security Department",
      attachments: 1
    }
  ];

  const categories = [
    { value: 'all', label: 'All Notices', color: 'bg-gray-100 text-gray-800' },
    { value: 'admission', label: 'Admission', color: 'bg-blue-100 text-blue-800' },
    { value: 'payment', label: 'Payment', color: 'bg-green-100 text-green-800' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'event', label: 'Events', color: 'bg-purple-100 text-purple-800' },
    { value: 'technical', label: 'Technical', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'health', label: 'Health', color: 'bg-red-100 text-red-800' },
    { value: 'security', label: 'Security', color: 'bg-orange-100 text-orange-800' }
  ];

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'medium':
        return <Info size={16} className="text-yellow-500" />;
      case 'low':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Info size={16} className="text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Bell size={48} className="mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">Hall Notices</h1>
            </div>
            <p className="text-xl md:text-2xl text-cyan-100 max-w-3xl mx-auto">
              Stay updated with the latest announcements, important dates, and hall-related information
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter size={20} className="text-gray-600" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent outline-none"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Notices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${getPriorityColor(notice.priority)} overflow-hidden`}
            >
              {/* Notice Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(notice.priority)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      categories.find(cat => cat.value === notice.category)?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {categories.find(cat => cat.value === notice.category)?.label || notice.category}
                    </span>
                  </div>
                  {notice.attachments > 0 && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      📎 {notice.attachments}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                  {notice.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {notice.content}
                </p>

                {/* Notice Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{new Date(notice.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{notice.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    <span>{notice.author}</span>
                  </div>
                </div>
              </div>

              {/* Notice Footer */}
              <div className="px-6 pb-4">
                <button className="w-full bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white py-2 px-4 rounded-lg hover:from-[#158c99] hover:to-[#116d77] transition-all duration-300 text-sm font-medium">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredNotices.length === 0 && (
          <div className="text-center py-12">
            <Bell size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No notices found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Statistics Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Notice Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#19aaba]">{notices.length}</div>
              <div className="text-sm text-gray-600">Total Notices</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500">{notices.filter(n => n.priority === 'high').length}</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-500">{notices.filter(n => n.priority === 'medium').length}</div>
              <div className="text-sm text-gray-600">Medium Priority</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{notices.filter(n => n.priority === 'low').length}</div>
              <div className="text-sm text-gray-600">Low Priority</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notice;
