import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Bell, Calendar, User, AlertCircle, CheckCircle, Clock, Home } from 'lucide-react';
import { noticeAPI } from '../../api/noticeApi';

const NoticePage = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [hallView, setHallView] = useState('my');

  const userHall = user?.allocatedHall || '';

  // Fetch notices from API
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await noticeAPI.getAllNotices({
          hall: hallView === 'my' ? userHall : undefined,
        });
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
  }, [hallView, userHall]);

  const getNoticeIcon = (type) => {
    switch (type) {
      case 'maintenance':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
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

  const currentHallLabel = hallView === 'my' && userHall ? userHall : 'All halls';
  const getNoticeHallLabel = (notice) => notice.hall || 'All halls';
  const getHallBadgeClass = (hallName) => {
    const value = String(hallName || 'all-halls').toLowerCase();
    const palette = [
      'bg-accent/20 text-secondary border-accent',
      'bg-emerald-50 text-emerald-700 border-emerald-200',
      'bg-amber-50 text-amber-800 border-amber-200',
      'bg-violet-50 text-violet-700 border-violet-200',
      'bg-rose-50 text-rose-700 border-rose-200',
    ];

    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = (hash * 31 + value.charCodeAt(i)) % palette.length;
    }

    return palette[hash];
  };

  const markAsRead = (noticeId) => {
    setNotices(prev => prev.map(notice =>
      notice.id === noticeId ? { ...notice, isRead: true } : notice
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-600">Loading notices...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary text-white p-3 rounded-full">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hall Notices</h1>
              <p className="text-gray-600">Stay updated with important notices and information</p>
              <p className="text-sm text-gray-500 mt-1">Showing notices for: {currentHallLabel}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Notice scope</label>
            <select
              value={hallView}
              onChange={(e) => setHallView(e.target.value)}
              className="w-full sm:w-72 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="my">My hall only</option>
              <option value="all">All halls</option>
            </select>
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${hallView === 'my' ? 'bg-accent/20 text-secondary border-accent' : 'bg-surface text-gray-600 border-gray-200'}`}>
              {hallView === 'my' ? `Scoped to ${currentHallLabel}` : 'Scoped to every hall'}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{notices.length}</div>
              <div className="text-sm text-blue-800">Total Notices</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">
                {notices.filter(n => n.type === 'emergency').length}
              </div>
              <div className="text-sm text-red-800">Emergency</div>
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
                          <div className="flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            {notice.hall || 'All halls'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getHallBadgeClass(notice.hall)}`}>
                      <Home className="w-3.5 h-3.5" />
                      {getNoticeHallLabel(notice)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {notice.content.split('\n')[0]}
                  </p>

                  {(notice.pdfUrl || notice.googleFormUrl) && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {notice.pdfUrl && (
                        <a
                          href={notice.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs px-2 py-1 rounded bg-accent/20 text-secondary hover:bg-accent/30"
                        >
                          PDF
                        </a>
                      )}
                      {notice.googleFormUrl && (
                        <a
                          href={notice.googleFormUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100"
                        >
                          Form
                        </a>
                      )}
                    </div>
                  )}
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
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Home className="w-4 h-4" />
                      <span>{selectedNotice.hall || 'All halls'}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Details</h3>
                    <div className={`mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${getHallBadgeClass(selectedNotice.hall)}`}>
                      <Home className="w-3.5 h-3.5" />
                      {selectedNotice.hall || 'All halls'}
                    </div>
                    <div className="text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                      {selectedNotice.content}
                    </div>

                    {(selectedNotice.pdfUrl || selectedNotice.googleFormUrl) && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {selectedNotice.pdfUrl && (
                          <a
                            href={selectedNotice.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs px-3 py-2 rounded bg-accent/20 text-secondary hover:bg-accent/30"
                          >
                            View PDF
                          </a>
                        )}
                        {selectedNotice.googleFormUrl && (
                          <a
                            href={selectedNotice.googleFormUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs px-3 py-2 rounded bg-green-50 text-green-700 hover:bg-green-100"
                          >
                            Open Form
                          </a>
                        )}
                      </div>
                    )}
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