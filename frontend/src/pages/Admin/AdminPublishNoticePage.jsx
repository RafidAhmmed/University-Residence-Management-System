import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Bell, AlertCircle, CheckCircle, Calendar, Send, Save, FileText, Link as LinkIcon, ExternalLink, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { noticeAPI } from '../../api/noticeApi';
import { authAPI } from '../../api/authApi';

const AdminPublishNoticePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'general',
    hall: '',
    isPublished: false,
    googleFormUrl: '',
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [activeTab, setActiveTab] = useState('publish');
  const [previousNotices, setPreviousNotices] = useState([]);
  const [noticesLoading, setNoticesLoading] = useState(true);
  const [hallOptions, setHallOptions] = useState([]);

  useEffect(() => {
    fetchPreviousNotices();
    fetchHallOptions();
  }, []);

  const fetchHallOptions = async () => {
    try {
      const response = await authAPI.getRegisterOptions();
      setHallOptions(response.data?.halls || []);
    } catch (error) {
      console.error('Error loading halls:', error);
      setHallOptions([]);
    }
  };

  const fetchPreviousNotices = async () => {
    setNoticesLoading(true);
    try {
      const response = await noticeAPI.getAllPublishedNotices();
      setPreviousNotices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error loading previous notices:', error);
      setPreviousNotices([]);
      toast.error('Failed to load previous notices');
    } finally {
      setNoticesLoading(false);
    }
  };

  const noticeTypes = [
    { value: 'maintenance', label: 'Maintenance Notice', icon: <AlertCircle className="w-4 h-4" />, color: 'text-orange-600' },
    { value: 'event', label: 'Event Notice', icon: <Calendar className="w-4 h-4" />, color: 'text-green-600' },
    { value: 'emergency', label: 'Emergency Notice', icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-600' },
    { value: 'general', label: 'General Notice', icon: <CheckCircle className="w-4 h-4" />, color: 'text-blue-600' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type
    }));
  };

  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPdfFile(null);
      return;
    }

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed');
      e.target.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('PDF size must be 10MB or smaller');
      e.target.value = '';
      return;
    }

    setPdfFile(file);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a notice title');
      return false;
    }
    if (!formData.content.trim()) {
      toast.error('Please enter notice content');
      return false;
    }

    if (!formData.hall.trim()) {
      toast.error('Please select a hall');
      return false;
    }

    if (!hallOptions.some((hall) => hall.name === formData.hall)) {
      toast.error('Please select a valid hall');
      return false;
    }

    if (formData.googleFormUrl.trim()) {
      try {
        const parsed = new URL(formData.googleFormUrl.trim());
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          toast.error('Google Form link must start with http:// or https://');
          return false;
        }
      } catch {
        toast.error('Please enter a valid Google Form URL');
        return false;
      }
    }

    return true;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Notice saved as draft');
      // Reset form or redirect as needed
    } catch (error) {
      toast.error('Failed to save draft');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const noticeData = {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        hall: formData.hall,
      };
      if (formData.googleFormUrl.trim()) {
        noticeData.googleFormUrl = formData.googleFormUrl.trim();
      }

      const response = await noticeAPI.createNotice(noticeData, pdfFile);

      toast.success('Notice published successfully');
      const publishedNotice = response?.data?.notice;
      if (publishedNotice) {
        setPreviousNotices(prev => [publishedNotice, ...prev]);
      } else {
        fetchPreviousNotices();
      }

      // Reset form
      setFormData({
        title: '',
        content: '',
        type: 'general',
        hall: '',
        isPublished: false,
        googleFormUrl: '',
      });
      setPdfFile(null);
    } catch (error) {
      console.error('Error publishing notice:', error);
      toast.error(error.response?.data?.error || 'Failed to publish notice');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const noticeType = noticeTypes.find(t => t.value === type);
    return noticeType ? noticeType.icon : <Bell className="w-4 h-4" />;
  };

  const getTypeColor = (type) => {
    const noticeType = noticeTypes.find(t => t.value === type);
    return noticeType ? noticeType.color : 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary text-white p-3 rounded-full">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notice Management</h1>
              <p className="text-gray-600">Publish new notices and review previously published ones</p>
            </div>
          </div>

          <div className="inline-flex rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('publish')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'publish'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Publish Notice
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'history'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Previous Notices
            </button>
          </div>
        </div>

        {activeTab === 'publish' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <form className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notice Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter notice title..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Notice Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Notice Type *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {noticeTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => handleTypeChange(type.value)}
                        className={`flex items-center gap-3 p-3 border rounded-lg transition-all ${
                          formData.type === type.value
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={formData.type === type.value ? 'text-primary' : 'text-gray-500'}>
                          {type.icon}
                        </span>
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hall Targeting */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hall Name *
                  </label>
                  <select
                    name="hall"
                    value={formData.hall}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select Hall</option>
                    {hallOptions.map((hall) => (
                      <option key={hall.name} value={hall.name}>{hall.name}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Choose the hall that should receive this notice.</p>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notice Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Enter the full notice content..."
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    You can use line breaks and formatting. This content will be displayed as-is to students.
                  </p>
                </div>

                {/* Optional PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attach PDF (Optional)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload a PDF notice file (max 10MB).
                  </p>
                  {pdfFile && (
                    <p className="text-sm text-primary mt-2">Selected: {pdfFile.name}</p>
                  )}
                </div>

                {/* Optional Google Form Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Form Link (Optional)
                  </label>
                  <input
                    type="url"
                    name="googleFormUrl"
                    value={formData.googleFormUrl}
                    onChange={handleInputChange}
                    placeholder="https://forms.gle/..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={loading}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={handlePublish}
                    disabled={loading}
                    className="flex-1 bg-primary text-white py-3 px-6 rounded-lg hover:bg-[#17a0a8] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Publish Notice
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <button
                  onClick={() => setPreview(!preview)}
                  className="text-sm text-primary hover:text-[#17a0a8]"
                >
                  {preview ? 'Hide' : 'Show'}
                </button>
              </div>

              {preview && (
                <div className="space-y-4">
                  {/* Preview Header */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={getTypeColor(formData.type)}>
                        {getTypeIcon(formData.type)}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">
                          {formData.title || 'Notice Title'}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">Published by: {user?.name || 'Admin'}</span>
                        </div>
                      </div>
                    </div>

                    {formData.hall && (
                      <div className="text-xs font-medium text-primary-light bg-primary/10 px-3 py-1 rounded-full inline-flex">
                        Hall: {formData.hall}
                      </div>
                    )}

                    <div className="text-sm text-gray-700 whitespace-pre-line">
                      {formData.content || 'Notice content will appear here...'}
                    </div>

                    {(pdfFile || formData.googleFormUrl.trim()) && (
                      <div className="mt-4 space-y-2">
                        {pdfFile && (
                          <div className="inline-flex items-center gap-2 text-sm text-primary-light bg-primary/10 px-3 py-1 rounded-full">
                            <FileText className="w-4 h-4" />
                            PDF attached
                          </div>
                        )}
                        {formData.googleFormUrl.trim() && (
                          <div className="inline-flex items-center gap-2 text-sm text-primary-light bg-primary/10 px-3 py-1 rounded-full ml-2">
                            <LinkIcon className="w-4 h-4" />
                            Google Form added
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Publishing Info */}
                  <div className="bg-surface p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Publishing Details</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="capitalize">{formData.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Hall:</span>
                        <span>{formData.hall || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="text-green-600">Ready to publish</span>
                      </div>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Publishing Tips</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Use clear, concise titles</li>
                      <li>• Include specific dates and times</li>
                      <li>• Mention contact information</li>
                      <li>• Select the correct hall before publishing</li>
                    </ul>
                  </div>
                </div>
              )}

              {!preview && (
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-sm">
                    Click "Show" to preview how your notice will appear to students.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Previous Notices</h2>
            <button
              type="button"
              onClick={fetchPreviousNotices}
              className="text-sm text-primary hover:text-primary-light"
            >
              Refresh
            </button>
          </div>

          {noticesLoading && (
            <div className="text-sm text-gray-600 py-4">Loading previous notices...</div>
          )}

          {!noticesLoading && previousNotices.length === 0 && (
            <div className="text-sm text-gray-600 py-4">No notices published yet.</div>
          )}

          {!noticesLoading && previousNotices.length > 0 && (
            <div className="space-y-3">
              {previousNotices.slice(0, 8).map((notice) => (
                <div key={notice._id} className="border border-gray-200 rounded-lg p-4 hover:bg-surface transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1">{notice.content}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(notice.publishedAt || notice.createdAt).toLocaleString()}
                    </span>
                    <span className="capitalize">Type: {notice.type || 'general'}</span>
                    <span>Hall: {notice.hall || '-'}</span>
                  </div>

                  {(notice.pdfUrl || notice.googleFormUrl) && (
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {notice.pdfUrl && (
                        <a
                          href={notice.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-accent/20 text-secondary hover:bg-accent/30"
                        >
                          <FileText className="w-3.5 h-3.5" /> PDF
                        </a>
                      )}
                      {notice.googleFormUrl && (
                        <a
                          href={notice.googleFormUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Form
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default AdminPublishNoticePage;