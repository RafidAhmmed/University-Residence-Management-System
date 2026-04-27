import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Bell, AlertTriangle, FileText, ExternalLink } from 'lucide-react';
import { noticeAPI } from '../../api/noticeApi';

const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await noticeAPI.getNoticeById(id);
        setNotice(response.data);
      } catch (err) {
        setError('Failed to load notice details');
        console.error('Error fetching notice:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [id]);

  const categories = [
    { value: 'maintenance', label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'event', label: 'Events', color: 'bg-purple-100 text-purple-800' },
    { value: 'emergency', label: 'Emergency', color: 'bg-red-100 text-red-800' },
    { value: 'general', label: 'General', color: 'bg-green-100 text-green-800' }
  ];

  const hallLabel = !notice?.hall || notice.hall === 'ALL_HALLS' ? 'All Halls' : notice.hall;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading notice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle size={56} className="mx-auto text-danger/40 mb-4" />
          <h3 className="text-lg font-semibold text-danger mb-2 font-heading">Error loading notice</h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/notice')}
            className="bg-accent text-secondary px-5 py-2 rounded-lg hover:bg-accent-dark transition-colors font-medium text-sm"
          >
            Back to Notices
          </button>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Bell size={56} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-500 mb-2 font-heading">Notice not found</h3>
          <button
            onClick={() => navigate('/notice')}
            className="mt-3 bg-accent text-secondary px-5 py-2 rounded-lg hover:bg-accent-dark transition-colors font-medium text-sm"
          >
            Back to Notices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-primary text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/notice')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4 text-sm"
          >
            <ArrowLeft size={18} />
            Back to Notices
          </button>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Bell size={28} className="mr-3 text-accent" />
              <h1 className="text-2xl sm:text-3xl font-bold font-heading">Notice Details</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border-l-4 border-l-accent border border-gray-100 overflow-hidden">
          <div className="p-7 sm:p-8">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-primary" />
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  categories.find(c => c.value === notice.type)?.color || 'bg-gray-100 text-gray-700'
                }`}>
                  {categories.find(c => c.value === notice.type)?.label || notice.type}
                </span>
              </div>
              <div className="text-right text-sm text-gray-400">
                <div className="flex items-center gap-1 mb-1">
                  <Calendar size={13} />
                  <span>{new Date(notice.publishedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={13} />
                  <span>{new Date(notice.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 font-heading">{notice.title}</h2>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <User size={15} />
              <span>Published by: {notice.publishedBy?.name || 'Unknown'}</span>
            </div>

            <div className="mb-6">
              <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-blue-50 text-blue-700">
                Hall: {hallLabel}
              </span>
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{notice.content}</p>
            </div>

            {(notice.pdfUrl || notice.googleFormUrl) && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-base font-semibold text-primary mb-3 font-heading">Additional Resources</h3>
                <div className="flex flex-wrap gap-3">
                  {notice.pdfUrl && (
                    <a href={notice.pdfUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/20 text-secondary hover:bg-accent/40 transition-colors font-medium text-sm">
                      <FileText size={16} /> View PDF
                    </a>
                  )}
                  {notice.googleFormUrl && (
                    <a href={notice.googleFormUrl} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors font-medium text-sm">
                      <ExternalLink size={16} /> Open Google Form
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;