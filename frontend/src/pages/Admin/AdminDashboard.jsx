import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Shield, 
  TrendingUp, 
  Loader,
  ArrowRight,
  UserCog,
  MailPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, admins: 0, users: 0, recentUsers: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Mock data instead of API call
      const mockStats = {
        total: 1250,
        admins: 15,
        users: 1235,
        recentUsers: 45
      };
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-shadow duration-300" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} title="Total Members" value={stats.total} color="#19aaba" />
          <StatCard icon={Shield} title="Admins" value={stats.admins} color="#f56565" />
          <StatCard icon={Users} title="Users" value={stats.users} color="#48bb78" />
          <StatCard icon={TrendingUp} title="Recent (30d)" value={stats.recentUsers} color="#ed8936" />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ActionCard
              icon={UserCog}
              title="Manage Users"
              description="View all users, manage roles, and update member information."
              color="#19aaba"
              onClick={() => navigate('/admin/manage-users')}
            />
            <ActionCard
              icon={MailPlus}
              title="Send Email"
              description="Send email notifications to all members or selected users."
              color="#ed8936"
              onClick={() => navigate('/admin/send-email')}
            />
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Admin Panel Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Mail size={20} className="text-[#ed8936]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Email Notifications</h4>
                <p className="text-sm text-gray-600">Send bulk emails to all members or target specific users with announcements and updates.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield size={20} className="text-[#48bb78]" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Role Management</h4>
                <p className="text-sm text-gray-600">Promote users to admins or revoke admin privileges with a single click.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">Statistics</h4>
                <p className="text-sm text-gray-600">Track total users, admin count, and recent registrations to monitor growth.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
