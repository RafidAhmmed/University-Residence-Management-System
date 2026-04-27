import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Shield, Edit, Phone, Building, GraduationCap, Home } from 'lucide-react';
import { toast } from 'sonner';
import { userAPI } from '../../api/userApi';
import { authAPI } from '../../api/authApi';

const ADMIN_DESIGNATIONS = [
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Lecturer',
  'Adjunct Faculty',
  'Department Chair',
  'Dean',
  'Proctor',
  'Provost',
  'Registrar',
];

const AdminProfilePage = () => {
  const { user, updateUser, fetchUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fixedOptions, setFixedOptions] = useState({ departments: [] });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    department: '',
    designation: '',
    hall: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        department: user.department || '',
        designation: user.designation || '',
        hall: user.hall || '',
      });
    }
  }, [user]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await fetchUserProfile();
      } catch (error) {
        console.error('Failed to load admin profile:', error);
      }
    };

    if (user?.id) {
      loadProfile();
    }
  }, [user?.id]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const response = await authAPI.getRegisterOptions();
        setFixedOptions({
          departments: response.data?.departments || [],
          halls: response.data?.halls || [],
        });
      } catch (error) {
        console.error('Failed to load department options:', error);
      }
    };

    loadOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.designation.trim()) {
      toast.error('Name, email, phone and designation are required');
      return;
    }

    setSaving(true);
    try {
      const response = await userAPI.updateUserProfile(user.id, {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        gender: formData.gender,
        department: formData.department.trim(),
        designation: formData.designation,
        hall: formData.hall,
      });

      updateUser(response.data);
      setIsEditing(false);
      toast.success('Admin profile updated successfully');
    } catch (error) {
      console.error('Failed to update admin profile:', error);
      toast.error(error.response?.data?.error || 'Failed to update admin profile');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-primary to-primary-light px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-primary bg-white px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-2 mt-2">
                  <Shield className="w-4 h-4" /> Admin
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Admin Profile Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors"
              >
                <Edit className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select department</option>
                    {fixedOptions.departments.map((department) => (
                      <option key={department.name} value={department.name}>{department.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select designation</option>
                    {ADMIN_DESIGNATIONS.map((designation) => (
                      <option key={designation} value={designation}>{designation}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Hall</label>
                  <select
                    name="hall"
                    value={formData.hall}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select hall</option>
                    {(fixedOptions.halls || []).map((hall) => (
                      <option key={hall.name} value={hall.name}>{hall.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-light disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <User className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Full Name</p>
                    <p className="font-semibold text-gray-900">{user.name || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{user.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900">{user.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Building className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="font-semibold text-gray-900">{user.department || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 md:col-span-2">
                  <GraduationCap className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Designation</p>
                    <p className="font-semibold text-gray-900">{user.designation || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 md:col-span-2">
                  <Home className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">Assigned Hall</p>
                    <p className="font-semibold text-gray-900">{user.hall || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
