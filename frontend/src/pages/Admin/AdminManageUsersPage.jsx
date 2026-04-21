import { useEffect, useMemo, useState } from 'react';
import { Users, Search, Filter, Download, Trash2, Shield, User, RefreshCw, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';
import { userAPI } from '../../api/userApi';
import ConfirmModal from '../../components/Common/ConfirmModal';

const AdminManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [hallFilter, setHallFilter] = useState('all');
  const [sessionFilter, setSessionFilter] = useState('all');
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(null);
  const [updatingRoleUserId, setUpdatingRoleUserId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    studentId: '',
    email: '',
    phone: '',
    role: 'user',
    department: '',
    session: '',
    allocatedHall: '',
    allocatedRoom: '',
    homeTown: '',
    bloodGroup: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUsers();
      setUsers(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.error || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const departments = useMemo(
    () => [...new Set(users.map((user) => user.department).filter(Boolean))].sort(),
    [users]
  );
  const halls = useMemo(
    () => [...new Set(users.map((user) => user.allocatedHall).filter(Boolean))].sort(),
    [users]
  );
  const sessions = useMemo(
    () => [...new Set(users.map((user) => user.session).filter(Boolean))].sort(),
    [users]
  );

  const filteredUsers = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        q === '' ||
        user.name?.toLowerCase().includes(q) ||
        user.studentId?.toLowerCase().includes(q) ||
        user.email?.toLowerCase().includes(q) ||
        user.phone?.toLowerCase().includes(q);

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
      const matchesHall = hallFilter === 'all' || user.allocatedHall === hallFilter;
      const matchesSession = sessionFilter === 'all' || user.session === sessionFilter;

      return matchesSearch && matchesRole && matchesDepartment && matchesHall && matchesSession;
    });
  }, [users, searchTerm, roleFilter, departmentFilter, hallFilter, sessionFilter]);

  const stats = {
    total: users.length,
    admins: users.filter((user) => user.role === 'admin').length,
    students: users.filter((user) => user.role === 'user').length,
    filtered: filteredUsers.length,
  };

  const handleRoleChange = async (id, newRole) => {
    setUpdatingRoleUserId(id);
    try {
      const response = await userAPI.updateUser(id, { role: newRole });
      const updated = response.data;

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id || user._id === id
            ? {
                ...user,
                role: updated.role || newRole,
              }
            : user
        )
      );

      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(error.response?.data?.error || 'Failed to update role');
    } finally {
      setUpdatingRoleUserId(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!confirmDeleteUser) return;

    try {
      await userAPI.deleteUser(confirmDeleteUser.id || confirmDeleteUser._id);
      setUsers((prev) => prev.filter((user) => (user.id || user._id) !== (confirmDeleteUser.id || confirmDeleteUser._id)));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || '',
      studentId: user.studentId || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user',
      department: user.department || '',
      session: user.session || '',
      allocatedHall: user.allocatedHall || '',
      allocatedRoom: user.allocatedRoom || '',
      homeTown: user.homeTown || '',
      bloodGroup: user.bloodGroup || '',
    });
  };

  const closeEditModal = () => {
    if (savingEdit) return;
    setEditingUser(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    if (!editForm.name.trim() || !editForm.studentId.trim() || !editForm.email.trim() || !editForm.phone.trim()) {
      toast.error('Name, Student ID, Email and Phone are required');
      return;
    }

    setSavingEdit(true);
    try {
      const userId = editingUser.id || editingUser._id;
      const response = await userAPI.updateUser(userId, {
        name: editForm.name.trim(),
        studentId: editForm.studentId.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        role: editForm.role,
        department: editForm.department.trim(),
        session: editForm.session.trim(),
        allocatedHall: editForm.allocatedHall.trim(),
        allocatedRoom: editForm.allocatedRoom.trim(),
        homeTown: editForm.homeTown.trim(),
        bloodGroup: editForm.bloodGroup.trim(),
      });

      const updatedUser = response.data;
      setUsers((prev) =>
        prev.map((user) => {
          const id = user.id || user._id;
          return id === userId ? { ...user, ...updatedUser } : user;
        })
      );

      toast.success('User updated successfully');
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.error || 'Failed to update user');
    } finally {
      setSavingEdit(false);
    }
  };

  const escapeCsv = (value) => {
    const safe = value === null || value === undefined ? '' : String(value);
    return `"${safe.replace(/"/g, '""')}"`;
  };

  const downloadCsv = () => {
    const headers = [
      'Name',
      'Student ID',
      'Email',
      'Phone',
      'Role',
      'Department',
      'Session',
      'Allocated Hall',
      'Allocated Room',
      'Created At',
    ];

    const rows = filteredUsers.map((user) => [
      user.name,
      user.studentId,
      user.email,
      user.phone,
      user.role,
      user.department,
      user.session,
      user.allocatedHall,
      user.allocatedRoom,
      user.createdAt ? new Date(user.createdAt).toLocaleString() : '',
    ]);

    const csv = [headers, ...rows].map((row) => row.map(escapeCsv).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `users-${stamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19aaba]"></div>
            <span className="ml-3 text-gray-600">Loading users...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#19aaba] text-white p-3 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
                <p className="text-gray-600">Control user roles, filter records, and export data.</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={fetchUsers}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
              <button
                type="button"
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-[#19aaba] text-white rounded-lg hover:bg-[#158c99]"
              >
                <Download className="w-4 h-4" /> Download CSV
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-blue-800">Total Users</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{stats.admins}</div>
              <div className="text-sm text-purple-800">Admins</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{stats.students}</div>
              <div className="text-sm text-green-800">Students</div>
            </div>
            <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
              <div className="text-2xl font-bold text-cyan-600">{stats.filtered}</div>
              <div className="text-sm text-cyan-800">Filtered Result</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="lg:flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, student ID, email or phone"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
              />
            </div>

            <div className="inline-flex items-center gap-2 text-sm text-gray-500 px-2">
              <Filter className="w-4 h-4" /> Filters
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]"
            >
              <option value="all">All Departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <select
              value={hallFilter}
              onChange={(e) => setHallFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]"
            >
              <option value="all">All Halls</option>
              {halls.map((hall) => (
                <option key={hall} value={hall}>
                  {hall}
                </option>
              ))}
            </select>

            <select
              value={sessionFilter}
              onChange={(e) => setSessionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]"
            >
              <option value="all">All Sessions</option>
              {sessions.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">No users found</h3>
              <p className="text-sm text-gray-600 mt-1">Try changing search text or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Academic</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Residence</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredUsers.map((user) => {
                    const userId = user.id || user._id;
                    return (
                      <tr key={userId} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">ID: {user.studentId || 'N/A'}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <p>{user.email || 'N/A'}</p>
                          <p className="text-xs text-gray-500">{user.phone || 'N/A'}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <p>{user.department || 'N/A'}</p>
                          <p className="text-xs text-gray-500">Session: {user.session || 'N/A'}</p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          <p>{user.allocatedHall || 'N/A'}</p>
                          <p className="text-xs text-gray-500">Room: {user.allocatedRoom || 'N/A'}</p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                            }`}>
                              {user.role === 'admin' ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                              {user.role}
                            </span>
                            <select
                              value={user.role}
                              disabled={updatingRoleUserId === userId}
                              onChange={(e) => handleRoleChange(userId, e.target.value)}
                              className="text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-[#19aaba]"
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(user)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-cyan-50 text-cyan-700 rounded hover:bg-cyan-100"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteUser(user)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-700 rounded hover:bg-red-100"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <ConfirmModal
          isOpen={!!confirmDeleteUser}
          onClose={() => setConfirmDeleteUser(null)}
          onConfirm={handleDeleteUser}
          title="Delete User"
          message={
            confirmDeleteUser
              ? `Are you sure you want to delete ${confirmDeleteUser.name} (${confirmDeleteUser.studentId})? This action cannot be undone.`
              : 'Are you sure you want to delete this user?'
          }
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />

        {editingUser && (
          <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Edit User</h3>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input name="name" value={editForm.name} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  <input name="studentId" value={editForm.studentId} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" value={editForm.email} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input name="phone" value={editForm.phone} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select name="role" value={editForm.role} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]">
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input name="department" value={editForm.department} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                  <input name="session" value={editForm.session} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <select name="bloodGroup" value={editForm.bloodGroup} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]">
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allocated Hall</label>
                  <input name="allocatedHall" value={editForm.allocatedHall} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allocated Room</label>
                  <input name="allocatedRoom" value={editForm.allocatedRoom} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Home Town</label>
                  <input name="homeTown" value={editForm.homeTown} onChange={handleEditInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba]" />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={savingEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={savingEdit}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#19aaba] rounded-lg hover:bg-[#158c99] disabled:opacity-60"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManageUsersPage;
