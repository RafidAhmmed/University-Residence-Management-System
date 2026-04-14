import React, { useState, useEffect } from 'react';
import {
  Users,
  Mail,
  Shield,
  TrendingUp,
  Loader,
  ArrowRight,
  UserCog,
  MailPlus,
  MessageSquare,
  Bell,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    students: 0,
    recentUsers: 0,
    totalComplaints: 0,
    pendingComplaints: 0,
    resolvedComplaints: 0,
    totalNotices: 0,
    activeNotices: 0
  });
  const [loading, setLoading] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentActivity();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Mock data instead of API call
      const mockStats = {
        totalUsers: 1250,
        admins: 15,
        students: 1235,
        recentUsers: 45,
        totalComplaints: 89,
        pendingComplaints: 23,
        resolvedComplaints: 66,
        totalNotices: 34,
        activeNotices: 12
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    // Mock recent activity data
    const mockActivity = [
      {
        id: 1,
        type: 'complaint',
        title: 'New complaint submitted',
        description: 'Broken light fixture in Room A-101',
        time: '2 hours ago',
        status: 'pending'
      },
      {
        id: 2,
        type: 'notice',
        title: 'Notice published',
        description: 'Maintenance schedule for next week',
        time: '4 hours ago',
        status: 'published'
      },
      {
        id: 3,
        type: 'user',
        title: 'New user registered',
        description: 'John Doe (STU002) joined the system',
        time: '6 hours ago',
        status: 'active'
      },
      {
        id: 4,
        type: 'complaint',
        title: 'Complaint resolved',
        description: 'Wi-Fi issue in Block B resolved',
        time: '1 day ago',
        status: 'resolved'
      }
    ];
    setRecentActivity(mockActivity);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all duration-300" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp size={14} className="text-green-500 mr-1" />
              <span className="text-sm text-green-600">{trend}</span>
            </div>
          )}
        </div>
        <div className="p-4 rounded-full" style={{ backgroundColor: `${color}15` }}>
          <Icon size={28} color={color} />
        </div>
      </div>
    </div>
  );

  const ActionCard = ({ icon: Icon, title, description, color, onClick }) => (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-[#19aaba]"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-4 rounded-xl" style={{ backgroundColor: `${color}15` }}>
          <Icon size={32} color={color} />
        </div>
        <ArrowRight className="text-gray-400 group-hover:text-[#19aaba] group-hover:translate-x-1 transition-all" size={24} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (type) => {
      switch (type) {
        case 'complaint':
          return <MessageSquare size={16} className="text-orange-500" />;
        case 'notice':
          return <Bell size={16} className="text-blue-500" />;
        case 'user':
          return <Users size={16} className="text-green-500" />;
        default:
          return <FileText size={16} className="text-gray-500" />;
      }
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'resolved':
          return 'bg-green-100 text-green-800';
        case 'published':
          return 'bg-blue-100 text-blue-800';
        case 'active':
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div className="p-2 rounded-full bg-gray-100">
          {getActivityIcon(activity.type)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900">{activity.title}</h4>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(activity.status)}`}>
              {activity.status}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} color="#19aaba" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-cyan-100">Welcome back, Admin! Manage your members and send notifications.</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            icon={Users}
            title="Total Users"
            value={stats.totalUsers}
            subtitle="All registered users"
            color="#19aaba"
            trend="+12% this month"
          />
          <StatCard
            icon={Shield}
            title="Admins"
            value={stats.admins}
            subtitle="System administrators"
            color="#f56565"
          />
          <StatCard
            icon={Users}
            title="Students"
            value={stats.students}
            subtitle="Hall residents"
            color="#48bb78"
          />
          <StatCard
            icon={MessageSquare}
            title="Complaints"
            value={stats.totalComplaints}
            subtitle={`${stats.pendingComplaints} pending`}
            color="#ed8936"
          />
          <StatCard
            icon={Bell}
            title="Notices"
            value={stats.totalNotices}
            subtitle={`${stats.activeNotices} active`}
            color="#8b5cf6"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionCard
              icon={UserCog}
              title="Manage Users"
              description="View all users, manage roles, and update member information."
              color="#19aaba"
              onClick={() => navigate('/admin/manage-users')}
            />
            <ActionCard
              icon={MessageSquare}
              title="Manage Complaints"
              description="Review, respond to, and resolve student complaints."
              color="#ed8936"
              onClick={() => navigate('/admin/complaints')}
            />
            <ActionCard
              icon={Bell}
              title="Publish Notice"
              description="Create and publish notices for hall residents."
              color="#8b5cf6"
              onClick={() => navigate('/admin/publish-notice')}
            />
            <ActionCard
              icon={MailPlus}
              title="Send Email"
              description="Send email notifications to all members or selected users."
              color="#10b981"
              onClick={() => navigate('/admin/send-email')}
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="space-y-1">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate('/admin/activity')}
                className="text-[#19aaba] hover:text-[#17a0a8] font-medium flex items-center gap-2"
              >
                View all activity
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Admin Panel Features */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Admin Panel Features</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Users size={20} className="text-[#19aaba]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">User Management</h4>
                  <p className="text-sm text-gray-600">View all registered users, assign or remove admin roles, and monitor user activities.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <MessageSquare size={20} className="text-[#ed8936]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Complaint Management</h4>
                  <p className="text-sm text-gray-600">Review, respond to, and resolve student complaints efficiently.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Bell size={20} className="text-[#8b5cf6]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Notice Publishing</h4>
                  <p className="text-sm text-gray-600">Create and publish important notices for hall residents.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mail size={20} className="text-[#10b981]" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Send bulk emails to all members or target specific users.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Stats Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="text-yellow-500" size={20} />
                  <span className="text-sm font-medium">Pending Complaints</span>
                </div>
                <span className="text-lg font-bold text-yellow-600">{stats.pendingComplaints}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-sm font-medium">Resolved This Month</span>
                </div>
                <span className="text-lg font-bold text-green-600">{stats.resolvedComplaints}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="text-blue-500" size={20} />
                  <span className="text-sm font-medium">Active Notices</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{stats.activeNotices}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-purple-500" size={20} />
                  <span className="text-sm font-medium">New Users (30d)</span>
                </div>
                <span className="text-lg font-bold text-purple-600">{stats.recentUsers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;