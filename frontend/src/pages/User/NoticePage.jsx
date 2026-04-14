import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, Calendar, User, AlertCircle, Info, CheckCircle, Clock } from 'lucide-react';
import api from '../../api/api';

const NoticePage = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);

  // Fetch notices from API
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await api.get('/notices');
        setNotices(response.data.notices);
      } catch (error) {
        console.error('Error fetching notices:', error);
        // Keep empty array on error
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const getNoticeIcon = (type) => {
    switch (type) {
      case 'maintenance':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'announcement':
        return <Info className="w-5 h-5 text-purple-500" />;
      case 'event':
        return <Calendar className="w-5 h-5 text-green-500" />;
      case 'emergency':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'general':
        return <Bell className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const markAsRead = (noticeId) => {
    setNotices(prev => prev.map(notice =>
      notice.id === noticeId ? { ...notice, isRead: true } : notice
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19aaba]"></div>
            <span className="ml-3 text-gray-600">Loading notices...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#19aaba] text-white p-3 rounded-full">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hall Notices</h1>
              <p className="text-gray-600">Stay updated with important announcements and information</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{notices.length}</div>
              <div className="text-sm text-blue-800">Total Notices</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">
                {notices.filter(n => n.priority === 'high').length}
              </div>
              <div className="text-sm text-red-800">High Priority</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">
                {notices.filter(n => !n.isRead).length}
              </div>
              <div className="text-sm text-yellow-800">Unread</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {notices.filter(n => n.isRead).length}
              </div>
              <div className="text-sm text-green-800">Read</div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Notices List */}
          <div className="lg:col-span-2 space-y-4">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className={`bg-white rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md border-gray-200`}
                onClick={() => setSelectedNotice(notice)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      {getNoticeIcon(notice.type)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">
                          {notice.title}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {notice.publishedBy?.name || 'Admin'}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {formatDate(notice.publishedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getPriorityColor(notice.priority)}`}>
                      {notice.priority.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {notice.content.split('\n')[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Notice Detail Sidebar */}
          <div className="lg:col-span-1">
            {selectedNotice ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {getNoticeIcon(selectedNotice.type)}
                    <h2 className="text-xl font-bold text-gray-900">{selectedNotice.title}</h2>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>Published by: {selectedNotice.publishedBy?.name || 'Admin'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(selectedNotice.publishedAt)}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className={`px-4 py-2 text-sm font-medium rounded-full border ${getPriorityColor(selectedNotice.priority)}`}>
                        {selectedNotice.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
                    <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                      {selectedNotice.content}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Notice</h3>
                <p className="text-gray-600 text-sm">
                  Click on any notice from the list to view its full details here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticePage;