import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, Search, Filter, Bell, AlertTriangle, FileText, ExternalLink, Home } from 'lucide-react';
import { noticeAPI } from '../../api/noticeApi';

const Notice = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedHall, setSelectedHall] = useState('all');
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatHall = (hall) => (!hall || hall === 'ALL_HALLS' ? 'All Halls' : hall);
  const normalizeNoticeList = (data) => {
    if (Array.isArray(data?.notices)) {
      return data.notices;
    }

    if (Array.isArray(data)) {
      return data;
    }

    return [];
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await noticeAPI.getAllNotices();
        const fetchedNotices = normalizeNoticeList(response.data).map((notice) => ({
          id: notice._id,
          title: notice.title,
          content: notice.content,
          category: notice.type,
          hall: formatHall(notice.hall),
          date: new Date(notice.publishedAt || notice.createdAt || Date.now()).toISOString().split('T')[0],
          time: new Date(notice.publishedAt || notice.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          author: notice.publishedBy?.name || 'Unknown',
          pdfUrl: notice.pdfUrl,
          googleFormUrl: notice.googleFormUrl,
          attachments: [notice.pdfUrl, notice.googleFormUrl].filter(Boolean).length,
        }));
        setNotices(fetchedNotices);
      } catch (err) {
        setError('Failed to load notices');
        console.error('Error fetching notices:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const categories = [
    { value: 'all', label: 'All Notices', color: 'bg-gray-100 text-gray-700' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'event', label: 'Events', color: 'bg-purple-100 text-purple-800' },
    { value: 'emergency', label: 'Emergency', color: 'bg-red-100 text-red-800' },
    { value: 'general', label: 'General', color: 'bg-green-100 text-green-800' }
  ];

  const hallOptions = [
    'all',
    'Shaheed Mashiur Rahman Hall',
    'Munshi Meherullah Hall',
    'Tapashi Rabeya Hall',
    'Bir Protik Taramon Bibi Hall',
  ];

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.hall.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesHall = selectedHall === 'all' || notice.hall === selectedHall;
    return matchesSearch && matchesCategory && matchesHall;
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* Banner */}
      <div className="page-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-3">
            <Bell size={36} className="mr-3 text-accent" />
            <h1 className="text-3xl sm:text-4xl font-bold font-heading">Hall Notices</h1>
          </div>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Stay updated with the latest notices, important dates, and hall-related information
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Loading notices...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <AlertTriangle size={56} className="mx-auto text-danger/40 mb-4" />
            <h3 className="text-lg font-semibold text-danger mb-2 font-heading">Error loading notices</h3>
            <p className="text-gray-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Search & Filter */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-8 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search notices..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-sm"
                  />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Filter size={18} className="text-gray-500" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Home size={18} className="text-gray-500" />
                  <select
                    value={selectedHall}
                    onChange={(e) => setSelectedHall(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none text-sm"
                  >
                    {hallOptions.map((hallName) => (
                      <option key={hallName} value={hallName}>
                        {hallName === 'all' ? 'All Halls' : hallName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Notices Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-accent overflow-hidden border border-gray-100 card-hover"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Bell size={15} className="text-primary" />
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          categories.find(c => c.value === notice.category)?.color || 'bg-gray-100 text-gray-700'
                        }`}>
                          {categories.find(c => c.value === notice.category)?.label || notice.category}
                        </span>
                      </div>
                      {notice.attachments > 0 && (
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                          📎 {notice.attachments}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-primary mb-2 line-clamp-2 font-heading">{notice.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{notice.content}</p>

                    {notice.hall && (
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                          <Home size={12} /> {notice.hall}
                        </span>
                      </div>
                    )}

                    {(notice.pdfUrl || notice.googleFormUrl) && (
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {notice.pdfUrl && (
                          <a href={notice.pdfUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-accent/20 text-secondary hover:bg-accent/40"
                            onClick={(e) => e.stopPropagation()}>
                            <FileText size={12} /> PDF
                          </a>
                        )}
                        {notice.googleFormUrl && (
                          <a href={notice.googleFormUrl} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100"
                            onClick={(e) => e.stopPropagation()}>
                            <ExternalLink size={12} /> Form
                          </a>
                        )}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Calendar size={11} />
                          <span>{new Date(notice.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={11} />
                          <span>{notice.time}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <User size={11} />
                        <span>{notice.author}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-4">
                    <button
                      onClick={() => navigate(`/notice/${notice.id}`)}
                      className="w-full bg-accent text-secondary py-2 px-4 rounded-lg hover:bg-accent-dark transition-colors duration-200 text-sm font-semibold"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredNotices.length === 0 && (
              <div className="text-center py-12">
                <Bell size={56} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-500 mb-2 font-heading">No notices found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your search, category, or hall filter criteria</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notice;
