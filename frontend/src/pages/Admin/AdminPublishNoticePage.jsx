import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Bell, AlertCircle, Info, CheckCircle, Calendar, Send, Save } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/api';

const AdminPublishNoticePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'announcement',
    priority: 'medium',
    isPublished: false,
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);

  const noticeTypes = [
    { value: 'announcement', label: 'General Announcement', icon: <Info className="w-4 h-4" />, color: 'text-purple-600' },
    { value: 'maintenance', label: 'Maintenance Notice', icon: <AlertCircle className="w-4 h-4" />, color: 'text-orange-600' },
    { value: 'event', label: 'Event Notice', icon: <Calendar className="w-4 h-4" />, color: 'text-green-600' },
    { value: 'emergency', label: 'Emergency Notice', icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-600' },
    { value: 'general', label: 'General Notice', icon: <CheckCircle className="w-4 h-4" />, color: 'text-blue-600' },
  ];

  const priorities = [
    { value: 'low', label: 'Low Priority', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800' },
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

  const handlePriorityChange = (priority) => {
    setFormData(prev => ({
      ...prev,
      priority
    }));
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
        priority: formData.priority,
      };

      await api.post('/notices', noticeData);

      toast.success('Notice published successfully');
      // Reset form
      setFormData({
        title: '',
        content: '',
        type: 'announcement',
        priority: 'medium',
        isPublished: false,
      });
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

  const getPriorityColor = (priority) => {
    const prio = priorities.find(p => p.value === priority);
    return prio ? prio.color : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#19aaba] text-white p-3 rounded-full">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Publish Notice</h1>
              <p className="text-gray-600">Create and publish notices for hall residents</p>
            </div>
          </div>
        </div>

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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
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
                            ? 'border-[#19aaba] bg-[#19aaba]/5 text-[#19aaba]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={formData.type === type.value ? 'text-[#19aaba]' : 'text-gray-500'}>
                          {type.icon}
                        </span>
                        <span className="text-sm font-medium">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Priority Level *
                  </label>
                  <div className="flex gap-3">
                    {priorities.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        onClick={() => handlePriorityChange(priority.value)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                          formData.priority === priority.value
                            ? 'border-[#19aaba] bg-[#19aaba]/5 text-[#19aaba]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent resize-vertical"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    You can use line breaks and formatting. This content will be displayed as-is to students.
                  </p>
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
                    className="flex-1 bg-[#19aaba] text-white py-3 px-6 rounded-lg hover:bg-[#17a0a8] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
                  className="text-sm text-[#19aaba] hover:text-[#17a0a8]"
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
                          <span className={`px-2 py-1 text-xs font-medium rounded ${getPriorityColor(formData.priority)}`}>
                            {formData.priority.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-700 whitespace-pre-line">
                      {formData.content || 'Notice content will appear here...'}
                    </div>
                  </div>

                  {/* Publishing Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Publishing Details</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Type:</span>
                        <span className="capitalize">{formData.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Priority:</span>
                        <span className="capitalize">{formData.priority}</span>
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
                      <li>• Set appropriate priority levels</li>
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
      </div>
    </div>
  );
};

export default AdminPublishNoticePage;