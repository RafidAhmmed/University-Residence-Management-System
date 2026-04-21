import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  Loader,
  ArrowRight,
  MessageSquare,
  Bell,
  UserCog,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { userAPI } from '../../api/userApi';
import { complaintAPI } from '../../api/complaintApi';
import { noticeAPI } from '../../api/noticeApi';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [usersRes, complaintsRes, noticesRes] = await Promise.all([
        userAPI.getAllUsers(),
        complaintAPI.getAllComplaints(),
        noticeAPI.getAllNotices({ page: 1, limit: 100 }),
      ]);

      const users = Array.isArray(usersRes?.data) ? usersRes.data : [];
      const complaints = Array.isArray(complaintsRes?.data?.complaints)
        ? complaintsRes.data.complaints
        : [];
      const notices = Array.isArray(noticesRes?.data?.notices)
        ? noticesRes.data.notices
        : [];

      const now = new Date();
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);

      const admins = users.filter((user) => user.role === 'admin').length;
      const recentUsers = users.filter((user) => user.createdAt && new Date(user.createdAt) >= thirtyDaysAgo).length;
      const pendingComplaints = complaints.filter((complaint) => complaint.status === 'pending').length;
      const resolvedComplaints = complaints.filter((complaint) => complaint.status === 'resolved').length;
      const totalNotices = noticesRes?.data?.total ?? notices.length;
      const activeNotices = totalNotices;

      setStats({
        totalUsers: users.length,
        admins,
        students: users.length - admins,
        recentUsers,
        totalComplaints: complaintsRes?.data?.total ?? complaints.length,
        pendingComplaints,
        resolvedComplaints,
        totalNotices,
        activeNotices,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-all duration-300" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-4 rounded-full" style={{ backgroundColor: `${color}15` }}>
          <Icon size={28} color={color} />
        </div>
      </div>
    </div>
  );

  const ActionCard = ({ icon: Icon, title, description, color, onClick, badge }) => (
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
      {badge && <p className="text-xs text-[#158c99] mt-3 font-medium">{badge}</p>}
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
              <p className="text-cyan-100">Live system overview and quick admin actions.</p>
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
            title="Published Notices"
            value={stats.totalNotices}
            subtitle={`${stats.activeNotices} active`}
            color="#8b5cf6"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
              icon={UserCog}
              title="Manage Users"
              description="Edit user data, update roles, apply filters, and export user lists."
              color="#19aaba"
              onClick={() => navigate('/admin/manage-users')}
              badge={`${stats.totalUsers} total users`}
            />
            <ActionCard
              icon={MessageSquare}
              title="Manage Complaints"
              description="Review, respond to, and resolve student complaints."
              color="#ed8936"
              onClick={() => navigate('/admin/complaints')}
              badge={`${stats.pendingComplaints} pending / ${stats.resolvedComplaints} resolved`}
            />
            <ActionCard
              icon={Bell}
              title="Publish Notice"
              description="Create new notices and review previous publications."
              color="#8b5cf6"
              onClick={() => navigate('/admin/publish-notice')}
              badge={`${stats.totalNotices} total published notices`}
            />
            <ActionCard
              icon={CreditCard}
              title="Manage Fees"
              description="Assign multi-part fees to filtered users and simulate online payments."
              color="#19aaba"
              onClick={() => navigate('/admin/fees')}
              badge="bKash, Nagad, SSLCommerz mock gateway"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;