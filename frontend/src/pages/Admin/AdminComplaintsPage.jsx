import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Filter, Search, Eye, Reply } from 'lucide-react';
import { toast } from 'sonner';
import { complaintAPI } from '../../api/complaintApi';

const AdminComplaintsPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [responseText, setResponseText] = useState('');

  // Fetch complaints from API
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await complaintAPI.getAllComplaints();
        setComplaints(response.data.complaints);
      } catch (error) {
        console.error('Error fetching complaints:', error);
        toast.error('Failed to load complaints');
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'in_progress':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      case 'cleanliness':
        return 'bg-blue-100 text-blue-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'facilities':
        return 'bg-purple-100 text-purple-800';
      case 'noise':
        return 'bg-indigo-100 text-indigo-800';
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

  const filteredComplaints = complaints.filter(complaint => {
    const matchesFilter = filter === 'all' || complaint.status === filter;
    const matchesSearch = searchTerm === '' ||
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.user?.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.sourceHall?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.sourceRoom?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateComplaintStatus = async (complaintId, newStatus) => {
    try {
      await complaintAPI.updateComplaintStatus(complaintId, { status: newStatus });
      setComplaints(prev => prev.map(complaint =>
        complaint._id === complaintId ? { ...complaint, status: newStatus } : complaint
      ));
      toast.success(`Complaint status updated to ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Error updating complaint status:', error);
      toast.error('Failed to update complaint status');
    }
  };

  const submitResponse = async (complaintId) => {
    if (!responseText.trim()) {
      toast.error('Please enter a response');
      return;
    }

    try {
      await complaintAPI.updateComplaintStatus(complaintId, {
        status: 'in-progress',
        adminResponse: responseText
      });

      setComplaints(prev => prev.map(complaint =>
        complaint._id === complaintId ? {
          ...complaint,
          adminResponse: responseText,
          responseDate: new Date().toISOString(),
          status: 'in-progress'
        } : complaint
      ));

      setResponseText('');
      toast.success('Response submitted successfully');
    } catch (error) {
      console.error('Error submitting response:', error);
      toast.error('Failed to submit response');
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'pending').length,
    inProgress: complaints.filter(c => c.status === 'in_progress').length,
    resolved: complaints.filter(c => c.status === 'resolved').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19aaba]"></div>
            <span className="ml-3 text-gray-600">Loading complaints...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#19aaba] text-white p-3 rounded-full">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Complaint Management</h1>
              <p className="text-gray-600">Review and manage student complaints</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-800">Total Complaints</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-yellow-800">Pending</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
              <div className="text-sm text-orange-800">In Progress</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-sm text-green-800">Resolved</div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Complaints List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredComplaints.map((complaint) => (
              <div
                key={complaint._id}
                className={`bg-white rounded-lg shadow-sm border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedComplaint?._id === complaint._id ? 'ring-2 ring-[#19aaba]' : 'border-gray-200'
                }`}
                onClick={() => setSelectedComplaint(complaint)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(complaint.status)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{complaint.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{complaint.user?.name || 'Unknown'}</span>
                          <span>ID: {complaint.user?.studentId || 'N/A'}</span>
                          <span>Hall: {complaint.sourceHall || complaint.user?.allocatedHall || 'N/A'}</span>
                          <span>Room: {complaint.sourceRoom || complaint.user?.allocatedRoom || 'N/A'}</span>
                          <span>{formatDate(complaint.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getUrgencyColor(complaint.priority)}`}>
                        {complaint.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(complaint.category)}`}>
                      {complaint.category}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm line-clamp-2">
                    {complaint.description}
                  </p>
                </div>
              </div>
            ))}

            {filteredComplaints.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No complaints found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>

          {/* Complaint Detail Sidebar */}
          <div className="lg:col-span-1">
            {selectedComplaint ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {getStatusIcon(selectedComplaint.status)}
                    <h2 className="text-xl font-bold text-gray-900">{selectedComplaint.title}</h2>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Student:</span>
                        <p className="text-gray-600">{selectedComplaint.user?.name || 'Unknown'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Student ID:</span>
                        <p className="text-gray-600">{selectedComplaint.user?.studentId || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Hall:</span>
                        <p className="text-gray-600">{selectedComplaint.sourceHall || selectedComplaint.user?.allocatedHall || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Room:</span>
                        <p className="text-gray-600">{selectedComplaint.sourceRoom || selectedComplaint.user?.allocatedRoom || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Category:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getCategoryColor(selectedComplaint.category)}`}>
                          {selectedComplaint.category}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Priority:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getUrgencyColor(selectedComplaint.priority)}`}>
                          {selectedComplaint.priority}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <span className={`px-4 py-2 text-sm font-medium rounded-full border ${getStatusColor(selectedComplaint.status)}`}>
                        {selectedComplaint.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {selectedComplaint.description}
                    </p>
                  </div>

                  {/* Status Update Actions */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedComplaint.status !== 'in-progress' && (
                        <button
                          onClick={() => updateComplaintStatus(selectedComplaint._id, 'in-progress')}
                          className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                        >
                          Mark In Progress
                        </button>
                      )}
                      {selectedComplaint.status !== 'resolved' && (
                        <button
                          onClick={() => updateComplaintStatus(selectedComplaint._id, 'resolved')}
                          className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
                        >
                          Mark Resolved
                        </button>
                      )}
                      {selectedComplaint.status !== 'closed' && (
                        <button
                          onClick={() => updateComplaintStatus(selectedComplaint._id, 'closed')}
                          className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                        >
                          Close
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Admin Response */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Admin Response</h3>
                    {selectedComplaint.adminResponse ? (
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-700 text-sm">{selectedComplaint.adminResponse}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Responded on {formatDate(selectedComplaint.responseDate)}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Enter your response..."
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent resize-none"
                          rows="4"
                        />
                        <button
                          onClick={() => submitResponse(selectedComplaint._id)}
                          className="w-full bg-[#19aaba] text-white py-2 px-4 rounded-lg hover:bg-[#17a0a8] transition-colors flex items-center justify-center gap-2"
                        >
                          <Reply className="w-4 h-4" />
                          Submit Response
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a Complaint</h3>
                <p className="text-gray-600 text-sm">
                  Click on any complaint from the list to view its details and manage it.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminComplaintsPage;