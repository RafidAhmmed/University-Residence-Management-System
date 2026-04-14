import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Send, AlertTriangle, Wrench, Users, Home, MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../api/api';

const ComplaintPage = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userComplaints, setUserComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
  });

  const complaintCategories = [
    { value: 'maintenance', label: 'Maintenance Issue', icon: <Wrench className="w-4 h-4" />, description: 'Electrical, plumbing, furniture repairs' },
    { value: 'cleaning', label: 'Cleaning Issue', icon: <Home className="w-4 h-4" />, description: 'Room cleaning, common area maintenance' },
    { value: 'facilities', label: 'Facilities Problem', icon: <Home className="w-4 h-4" />, description: 'Common areas, Wi-Fi, water supply' },
    { value: 'security', label: 'Security Concern', icon: <AlertTriangle className="w-4 h-4" />, description: 'Safety and security issues' },
    { value: 'other', label: 'Other', icon: <MessageSquare className="w-4 h-4" />, description: 'Any other complaints' },
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800', description: 'Can wait a few days' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800', description: 'Should be addressed soon' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800', description: 'Needs immediate attention' },
    { value: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800', description: 'Emergency situation' },
  ];

  // Fetch user complaints on component mount
  useEffect(() => {
    const fetchUserComplaints = async () => {
      try {
        const response = await api.get('/complaints/my');
        setUserComplaints(response.data);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        toast.error('Failed to load your complaints');
      } finally {
        setLoadingComplaints(false);
      }
    };

    fetchUserComplaints();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category || !formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const complaintData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
      };

      const response = await api.post('/complaints', complaintData);

      toast.success('Complaint submitted successfully! We will review it within 24 hours.');

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
      });

      // Refresh complaints list
      const complaintsResponse = await api.get('/complaints/my');
      setUserComplaints(complaintsResponse.data);

    } catch (error) {
      console.error('Complaint submission error:', error);
      toast.error(error.response?.data?.error || 'Failed to submit complaint. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 text-red-600 p-3 rounded-full">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Submit a Complaint</h1>
              <p className="text-gray-600">Report issues or concerns about hall facilities and services</p>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Important Information</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• All complaints are reviewed within 24 hours</li>
                  <li>• Urgent issues will be addressed immediately</li>
                  <li>• You will receive updates on your complaint status</li>
                  <li>• False complaints may result in disciplinary action</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Complaint Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Complaint Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {complaintCategories.map((category) => (
                  <label
                    key={category.value}
                    className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.category === category.value
                        ? 'border-[#19aaba] bg-[#19aaba]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={formData.category === category.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        formData.category === category.value
                          ? 'bg-[#19aaba] text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {category.icon}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{category.label}</div>
                        <div className="text-sm text-gray-500">{category.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief summary of your complaint"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-colors"
                required
              />
            </div>

            {/* Priority Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Urgency Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {priorityLevels.map((level) => (
                  <label
                    key={level.value}
                    className={`relative flex items-center p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.priority === level.value
                        ? 'border-[#19aaba] bg-[#19aaba]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={level.value}
                      checked={formData.priority === level.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="text-center">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-1 ${level.color}`}>
                        {level.label}
                      </div>
                      <div className="text-xs text-gray-500">{level.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Please provide detailed information about your complaint. Include when the issue started, how it affects you, and any relevant details that might help resolve it quickly."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-colors resize-vertical"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Be specific and provide as much detail as possible to help us resolve your issue quickly.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-[#19aaba] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#158c99] focus:ring-2 focus:ring-[#19aaba] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Complaint</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Your Complaints */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Complaints</h2>
          {loadingComplaints ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#19aaba] border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Loading complaints...</span>
            </div>
          ) : userComplaints.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">You haven't submitted any complaints yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userComplaints.map((complaint) => {
                const getStatusIcon = (status) => {
                  switch (status) {
                    case 'pending':
                      return <Clock className="w-4 h-4 text-yellow-600" />;
                    case 'in-progress':
                      return <AlertTriangle className="w-4 h-4 text-blue-600" />;
                    case 'resolved':
                      return <CheckCircle className="w-4 h-4 text-green-600" />;
                    case 'closed':
                      return <XCircle className="w-4 h-4 text-gray-600" />;
                    default:
                      return <Clock className="w-4 h-4 text-gray-600" />;
                  }
                };

                const getStatusColor = (status) => {
                  switch (status) {
                    case 'pending':
                      return 'bg-yellow-100 text-yellow-800';
                    case 'in-progress':
                      return 'bg-blue-100 text-blue-800';
                    case 'resolved':
                      return 'bg-green-100 text-green-800';
                    case 'closed':
                      return 'bg-gray-100 text-gray-800';
                    default:
                      return 'bg-gray-100 text-gray-800';
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

                return (
                  <div key={complaint._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getStatusColor(complaint.status).split(' ')[0]}`}>
                        {getStatusIcon(complaint.status)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{complaint.title}</p>
                        <p className="text-sm text-gray-500">
                          Submitted {formatDate(complaint.createdAt)}
                        </p>
                        {complaint.adminResponse && (
                          <p className="text-sm text-blue-600 mt-1">
                            Admin Response: {complaint.adminResponse}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintPage;