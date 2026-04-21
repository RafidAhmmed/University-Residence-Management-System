import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, Shield, Calendar, Edit, Camera, Phone, MapPin, Home, GraduationCap, Building, Droplet, AlertTriangle, CreditCard, Clock, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { userAPI } from '../../api/userApi';
import { authAPI } from '../../api/authApi';
import { feeAPI } from '../../api/feeApi';

const UserProfile = () => {
  const { user, updateUser, fetchUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    session: '',
    department: '',
    bloodGroup: '',
    homeTown: '',
    allocatedHall: '',
    allocatedRoom: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [fixedOptions, setFixedOptions] = useState({ sessions: [], departments: [], halls: [] });
  const [fees, setFees] = useState([]);
  const [feesLoading, setFeesLoading] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [paying, setPaying] = useState(false);

  // Check if profile is locked (not first-time setup)
  const isProfileLocked = user && (
    user.name &&
    user.studentId &&
    user.email &&
    user.dateOfBirth &&
    user.session &&
    user.department &&
    user.bloodGroup &&
    user.homeTown
  );

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        studentId: user.studentId || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        session: user.session || '',
        department: user.department || '',
        bloodGroup: user.bloodGroup || '',
        homeTown: user.homeTown || '',
        allocatedHall: user.allocatedHall || '',
        allocatedRoom: user.allocatedRoom || '',
      });
      setProfilePicturePreview(user.profilePicture || null);
    }
  }, [user]);

  // Fetch full user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        await fetchUserProfile();
      } catch (error) {
        console.error('Failed to load user profile:', error);
        toast.error('Failed to load profile data');
      }
    };

    if (user && user.id) {
      loadUserProfile();
    }
  }, []);

  useEffect(() => {
    const loadFixedOptions = async () => {
      try {
        const response = await authAPI.getRegisterOptions();
        setFixedOptions({
          sessions: response.data?.sessions || [],
          departments: response.data?.departments || [],
          halls: response.data?.halls || [],
        });
      } catch (error) {
        console.error('Failed to load fixed options:', error);
      }
    };

    loadFixedOptions();
  }, []);

  useEffect(() => {
    const loadFees = async () => {
      if (!user?.id) {
        return;
      }

      setFeesLoading(true);
      try {
        const response = await feeAPI.getMyFees();
        setFees(Array.isArray(response.data?.fees) ? response.data.fees : []);
      } catch (error) {
        console.error('Failed to load user fees:', error);
      } finally {
        setFeesLoading(false);
      }
    };

    loadFees();
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Profile picture must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e) => setProfilePicturePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const unpaidFees = fees.filter((fee) => fee.status !== 'paid');
  const nearestFee = unpaidFees
    .slice()
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0] || null;

  const handleOpenPayment = (fee) => {
    setSelectedFee(fee);
    setPaymentMethod('bkash');
  };

  const handlePayFee = async (e) => {
    e?.preventDefault();
    if (!selectedFee) return;

    setPaying(true);
    try {
      const transactionId = `${paymentMethod.toUpperCase()}-${Date.now()}`;
      await feeAPI.payFee(selectedFee._id, { paymentMethod, transactionId });
      toast.success('Payment completed successfully');
      setSelectedFee(null);
      const response = await feeAPI.getMyFees();
      setFees(Array.isArray(response.data?.fees) ? response.data.fees : []);
    } catch (error) {
      console.error('Fee payment failed:', error);
      toast.error(error.response?.data?.error || 'Failed to process payment');
    } finally {
      setPaying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let profileData;

      if (isProfileLocked) {
        // Only update allowed fields when profile is locked
        profileData = {};
        if (formData.phone !== user.phone) {
          profileData.phone = formData.phone;
        }
        if (formData.email !== user.email) {
          profileData.email = formData.email;
        }
      } else {
        // Allow full update for first-time setup
        profileData = { ...formData };
        // Remove profilePicture from profileData since it's handled as a file upload
        delete profileData.profilePicture;
      }

      // Make API call to update profile
      if (!user || !user.id) {
        throw new Error('User not authenticated');
      }
      const response = await userAPI.updateUserProfile(user.id, profileData, profilePicture);
      const updatedUserData = response.data;

      // Update local state with the response
      updateUser(updatedUserData);
      setIsEditing(false);
      setProfilePicture(null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19aaba] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {nearestFee && (
          <div className={`mb-6 rounded-xl border p-4 shadow-sm ${nearestFee.isOverdue ? 'border-red-200 bg-red-50 text-red-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{nearestFee.isOverdue ? 'Payment overdue' : 'Upcoming payment due'}</p>
                  <p className="text-sm">
                    {nearestFee.title} is due on {new Date(nearestFee.dueDate).toLocaleDateString()}.
                    {nearestFee.isOverdue ? ` Late fee applies: ৳${nearestFee.lateFee || 0}.` : ` Amount due: ৳${nearestFee.amountDue}.`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPayment(nearestFee)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#19aaba] px-4 py-2 text-sm font-medium text-white hover:bg-[#158c99]"
              >
                <CreditCard className="h-4 w-4" />
                Pay now
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => setShowImageModal(true)}>
                  {profilePicturePreview ? (
                    <img
                      src={profilePicturePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-10 h-10 text-[#19aaba]" />
                  )}
                </div>
                {isEditing && (
                  <button
                    onClick={handleProfilePictureClick}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-[#19aaba]" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                <p className="text-[#19aaba] bg-white px-3 py-1 rounded-full text-sm font-medium inline-block mt-2">
                  {user.role === 'admin' ? 'Administrator' : 'Student'}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {isProfileLocked && (
                  <p className="text-sm text-gray-600 mt-1">
                    You can only update your photo, phone number, and email. Contact admin for other changes.
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-[#19aaba] text-white rounded-lg hover:bg-[#158c99] transition-colors"
              >
                <Edit className="w-4 h-4" />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                      required
                      disabled={isProfileLocked}
                    />
                    {isProfileLocked && <p className="text-xs text-gray-500 mt-1">Contact admin to change</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                      required
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Student ID cannot be changed</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                      placeholder="+880 1XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                      disabled={isProfileLocked}
                    />
                    {isProfileLocked && <p className="text-xs text-gray-500 mt-1">Contact admin to change</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent ${isProfileLocked ? 'appearance-none' : ''}`}
                      disabled={isProfileLocked}
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    {isProfileLocked && <p className="text-xs text-gray-500 mt-1">Contact admin to change</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Session
                    </label>
                    <select
                      name="session"
                      value={formData.session}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                      disabled={isProfileLocked}
                    >
                      <option value="">Select Session</option>
                      {fixedOptions.sessions.map((session) => (
                        <option key={session} value={session}>{session}</option>
                      ))}
                    </select>
                    {isProfileLocked && <p className="text-xs text-gray-500 mt-1">Contact admin to change</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                      disabled={isProfileLocked}
                    >
                      <option value="">Select Department</option>
                      {fixedOptions.departments.map((department) => (
                        <option key={department.name} value={department.name}>{department.name}</option>
                      ))}
                    </select>
                    {isProfileLocked && <p className="text-xs text-gray-500 mt-1">Contact admin to change</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Home Town
                    </label>
                    <input
                      type="text"
                      name="homeTown"
                      value={formData.homeTown}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                      placeholder="e.g., Dhaka"
                      disabled={isProfileLocked}
                    />
                    {isProfileLocked && <p className="text-xs text-gray-500 mt-1">Contact admin to change</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allocated Hall
                    </label>
                    <select
                      name="allocatedHall"
                      value={formData.allocatedHall}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                      disabled
                    >
                      <option value="">Select Hall</option>
                      {fixedOptions.halls.map((hall) => (
                        <option key={hall.name} value={hall.name}>{hall.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Contact admin to change hall allocation</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allocated Room
                    </label>
                    <input
                      type="text"
                      name="allocatedRoom"
                      value={formData.allocatedRoom}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                      placeholder="Room number"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Contact admin to change room allocation</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-[#19aaba] text-white rounded-lg hover:bg-[#158c99] disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-900">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Student ID</p>
                      <p className="font-medium text-gray-900">{user.studentId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{user.email || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium text-gray-900">{user.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium text-gray-900">
                        {user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Droplet className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Blood Group</p>
                      <p className="font-medium text-gray-900">{user.bloodGroup || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Session</p>
                      <p className="font-medium text-gray-900">{user.session || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium text-gray-900">{user.department || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Home Town</p>
                      <p className="font-medium text-gray-900">{user.homeTown || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium text-gray-900 capitalize">{user.role}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Home className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Allocated Hall</p>
                      <p className="font-medium text-gray-900">{user.allocatedHall || 'Not allocated'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Home className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Allocated Room</p>
                      <p className="font-medium text-gray-900">{user.allocatedRoom || 'Not allocated'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="font-medium text-gray-900">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">My Fees</h2>
              <p className="text-sm text-gray-600">View your dues and pay with bKash, Nagad, or SSLCommerz mock checkout.</p>
            </div>
            <div className="rounded-full bg-[#19aaba]/10 px-3 py-1 text-sm font-medium text-[#19aaba]">
              {fees.length} fee{fees.length === 1 ? '' : 's'} assigned
            </div>
          </div>

          {feesLoading ? (
            <div className="flex items-center gap-3 text-gray-600">
              <Loader className="h-4 w-4 animate-spin text-[#19aaba]" />
              Loading fees...
            </div>
          ) : fees.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {fees.map((fee) => {
                const statusLabel = fee.status === 'paid' ? 'Paid' : fee.isOverdue ? 'Overdue' : 'Unpaid';
                const statusClass = fee.status === 'paid'
                  ? 'bg-green-100 text-green-700'
                  : fee.isOverdue
                    ? 'bg-red-100 text-red-700'
                    : 'bg-amber-100 text-amber-700';

                return (
                  <div key={fee._id} className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">{fee.title}</p>
                        <p className="text-sm text-gray-600 capitalize">{fee.feeType}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusClass}`}>{statusLabel}</span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Due date</span>
                        <span>{new Date(fee.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Base amount</span>
                        <span>৳{fee.amount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Late fee</span>
                        <span>৳{fee.lateFee || 0}</span>
                      </div>
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-gray-500">Amount due</span>
                        <span>৳{fee.amountDue}</span>
                      </div>
                    </div>

                    {fee.status !== 'paid' && (
                      <button
                        type="button"
                        onClick={() => handleOpenPayment(fee)}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#19aaba] px-4 py-2 text-sm font-medium text-white hover:bg-[#158c99]"
                      >
                        <CreditCard className="h-4 w-4" />
                        Pay with online gateway
                      </button>
                    )}

                    {fee.status === 'paid' && fee.paidAt && (
                      <p className="mt-3 text-xs text-gray-500">
                        Paid on {new Date(fee.paidAt).toLocaleDateString()} via {fee.paymentMethod?.toUpperCase() || 'online'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-gray-600">
              No fee assignments yet.
            </div>
          )}
        </div>
      </div>

      {selectedFee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => !paying && setSelectedFee(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Mock Payment Gateway</h3>
                <p className="text-sm text-gray-600">Choose a gateway and complete the simulated payment.</p>
              </div>
              <button type="button" onClick={() => setSelectedFee(null)} className="text-gray-500 hover:text-gray-800">×</button>
            </div>

            <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">{selectedFee.title}</p>
              <p>Due date: {new Date(selectedFee.dueDate).toLocaleDateString()}</p>
              <p>Amount due: ৳{selectedFee.amountDue}</p>
            </div>

            <form onSubmit={handlePayFee} className="mt-4 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Payment Method</label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {['bkash', 'nagad', 'sslcommerz'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium capitalize transition-all ${paymentMethod === method ? 'border-[#19aaba] bg-[#19aaba]/5 text-[#19aaba]' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <Clock className="h-4 w-4 flex-shrink-0" />
                This is a mock gateway. Payment will be marked successful instantly.
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={paying}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#19aaba] px-4 py-3 font-medium text-white hover:bg-[#158c99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {paying ? <Loader className="h-4 w-4 animate-spin" /> : null}
                  {paying ? 'Processing...' : `Pay with ${paymentMethod}`}
                </button>
                <button
                  type="button"
                  disabled={paying}
                  onClick={() => setSelectedFee(null)}
                  className="rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-md max-h-screen p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-white rounded-lg overflow-hidden shadow-xl">
              {profilePicturePreview ? (
                <img
                  src={profilePicturePreview}
                  alt="Profile"
                  className="w-full h-auto max-h-96 object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <div className="w-64 h-64 bg-gray-100 flex items-center justify-center">
                  <User className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;