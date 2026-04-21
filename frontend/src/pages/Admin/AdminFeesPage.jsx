import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, CreditCard, Filter, Loader, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { userAPI } from '../../api/userApi';
import { feeAPI } from '../../api/feeApi';
import { authAPI } from '../../api/authApi';

const emptyFeeItem = () => ({
  feeType: 'hostel',
  title: '',
  amount: '',
  lateFee: '',
  dueDate: '',
  notes: '',
});

const AdminFeesPage = () => {
  const [users, setUsers] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [options, setOptions] = useState({ sessions: [], departments: [], halls: [] });
  const [filters, setFilters] = useState({
    role: 'user',
    session: '',
    department: '',
    allocatedHall: '',
    allocatedRoom: '',
  });
  const [batchName, setBatchName] = useState('');
  const [feeItems, setFeeItems] = useState([emptyFeeItem()]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, feesRes, registerOptionsRes] = await Promise.all([
        userAPI.getAllUsers(),
        feeAPI.getAllFees(),
        authAPI.getRegisterOptions(),
      ]);

      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setFees(Array.isArray(feesRes.data?.fees) ? feesRes.data.fees : []);
      setOptions({
        sessions: registerOptionsRes.data?.sessions || [],
        departments: registerOptionsRes.data?.departments || [],
        halls: registerOptionsRes.data?.halls || [],
      });
    } catch (error) {
      console.error('Failed to load fee data:', error);
      toast.error('Failed to load fee management data');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      if (filters.role && filters.role !== 'all' && user.role !== filters.role) return false;
      if (filters.session && user.session !== filters.session) return false;
      if (filters.department && user.department !== filters.department) return false;
      if (filters.allocatedHall && user.allocatedHall !== filters.allocatedHall) return false;
      if (filters.allocatedRoom && String(user.allocatedRoom || '') !== String(filters.allocatedRoom)) return false;

      if (!normalizedSearch) return true;

      return [user.name, user.studentId, user.email, user.department, user.allocatedHall]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(normalizedSearch));
    });
  }, [users, filters, searchTerm]);

  const toggleUser = (userId) => {
    setSelectedUserIds((current) => (
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId]
    ));
  };

  const updateFeeItem = (index, field, value) => {
    setFeeItems((current) => current.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    )));
  };

  const addFeeItem = () => setFeeItems((current) => [...current, emptyFeeItem()]);
  const removeFeeItem = (index) => setFeeItems((current) => current.filter((_, itemIndex) => itemIndex !== index));

  const handleAssignFees = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        batchName,
        filters,
        targetUserIds: selectedUserIds,
        fees: feeItems.map((item) => ({
          ...item,
          amount: Number(item.amount),
          lateFee: item.lateFee === '' ? 0 : Number(item.lateFee),
        })),
      };

      await feeAPI.assignFees(payload);
      toast.success('Fees assigned successfully');
      setSelectedUserIds([]);
      setBatchName('');
      setFeeItems([emptyFeeItem()]);
      await fetchData();
    } catch (error) {
      console.error('Failed to assign fees:', error);
      toast.error(error.response?.data?.error || 'Failed to assign fees');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="mx-auto mb-4 animate-spin text-[#19aaba]" size={40} />
          <p className="text-gray-600">Loading fee management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#19aaba] to-[#158c99] p-6 text-white shadow-xl md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">Fees & Payments</h1>
              <p className="mt-2 text-cyan-100">Assign multiple fee types to filtered users and track mock payments.</p>
            </div>
            <div className="hidden rounded-xl bg-white/15 px-4 py-3 text-sm backdrop-blur sm:block">
              <div className="font-semibold">Assigned Records</div>
              <div>{fees.length} active fee entries</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-[#19aaba]/10 p-3 text-[#19aaba]"><CreditCard size={22} /></div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Assign New Fees</h2>
                  <p className="text-sm text-gray-600">Create one batch with several fee categories and an optional late fee.</p>
                </div>
              </div>

              <form onSubmit={handleAssignFees} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Batch Label</label>
                    <input
                      type="text"
                      value={batchName}
                      onChange={(e) => setBatchName(e.target.value)}
                      placeholder="e.g. Spring semester dues"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#19aaba]"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">Search Users</label>
                    <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-3 focus-within:ring-2 focus-within:ring-[#19aaba]">
                      <Search size={16} className="text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, ID, email"
                        className="w-full border-0 p-0 outline-none focus:ring-0"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="mb-4 flex items-center gap-2 text-gray-700">
                    <Filter size={18} />
                    <span className="font-semibold">Filters</span>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <select value={filters.role} onChange={(e) => setFilters((current) => ({ ...current, role: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-3">
                      <option value="all">All Roles</option>
                      <option value="user">Students</option>
                      <option value="admin">Admins</option>
                    </select>
                    <select value={filters.session} onChange={(e) => setFilters((current) => ({ ...current, session: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-3">
                      <option value="">All Sessions</option>
                      {options.sessions.map((session) => (
                        <option key={session} value={session}>{session}</option>
                      ))}
                    </select>
                    <select value={filters.department} onChange={(e) => setFilters((current) => ({ ...current, department: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-3">
                      <option value="">All Departments</option>
                      {options.departments.map((department) => (
                        <option key={department.name} value={department.name}>{department.name}</option>
                      ))}
                    </select>
                    <select value={filters.allocatedHall} onChange={(e) => setFilters((current) => ({ ...current, allocatedHall: e.target.value }))} className="rounded-lg border border-gray-300 px-3 py-3">
                      <option value="">All Halls</option>
                      {options.halls.map((hall) => (
                        <option key={hall.name} value={hall.name}>{hall.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={filters.allocatedRoom}
                      onChange={(e) => setFilters((current) => ({ ...current, allocatedRoom: e.target.value }))}
                      placeholder="Room number"
                      className="rounded-lg border border-gray-300 px-3 py-3"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Fee Items</h3>
                      <p className="text-sm text-gray-600">Add one or more fee lines to the selected users.</p>
                    </div>
                    <button type="button" onClick={addFeeItem} className="inline-flex items-center gap-2 rounded-lg bg-[#19aaba] px-4 py-2 text-sm font-medium text-white hover:bg-[#158c99]">
                      <Plus size={16} /> Add Fee
                    </button>
                  </div>

                  <div className="space-y-4">
                    {feeItems.map((item, index) => (
                      <div key={`${index}-${item.title}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <p className="font-semibold text-gray-800">Fee #{index + 1}</p>
                          {feeItems.length > 1 && (
                            <button type="button" onClick={() => removeFeeItem(index)} className="text-sm text-red-600 hover:text-red-700">
                              <span className="inline-flex items-center gap-1"><Trash2 size={14} /> Remove</span>
                            </button>
                          )}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          <select value={item.feeType} onChange={(e) => updateFeeItem(index, 'feeType', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-3">
                            <option value="hostel">Hostel Fee</option>
                            <option value="tuition">Tuition Fee</option>
                            <option value="mess">Mess Fee</option>
                            <option value="utility">Utility Fee</option>
                            <option value="library">Library Fine</option>
                            <option value="exam">Exam Fee</option>
                            <option value="other">Other</option>
                          </select>
                          <input type="text" value={item.title} onChange={(e) => updateFeeItem(index, 'title', e.target.value)} placeholder="Fee title" className="rounded-lg border border-gray-300 px-3 py-3" />
                          <input type="number" min="0" value={item.amount} onChange={(e) => updateFeeItem(index, 'amount', e.target.value)} placeholder="Amount" className="rounded-lg border border-gray-300 px-3 py-3" />
                          <input type="number" min="0" value={item.lateFee} onChange={(e) => updateFeeItem(index, 'lateFee', e.target.value)} placeholder="Late fee" className="rounded-lg border border-gray-300 px-3 py-3" />
                          <input type="date" value={item.dueDate} onChange={(e) => updateFeeItem(index, 'dueDate', e.target.value)} className="rounded-lg border border-gray-300 px-3 py-3" />
                          <input type="text" value={item.notes} onChange={(e) => updateFeeItem(index, 'notes', e.target.value)} placeholder="Optional note" className="rounded-lg border border-gray-300 px-3 py-3" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-cyan-50 p-4 text-sm text-cyan-900">
                  <p className="font-semibold">Target preview</p>
                  <p>{selectedUserIds.length > 0 ? `${selectedUserIds.length} manually selected users` : `${filteredUsers.length} users matched by filters`}</p>
                </div>

                <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-xl bg-[#19aaba] px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-[#158c99] disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting ? <Loader size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                  {submitting ? 'Assigning...' : 'Assign Fees'}
                </button>
              </form>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Filtered Users</h2>
                  <p className="text-sm text-gray-600">Choose specific users or rely on the filter rules above.</p>
                </div>
                <button type="button" onClick={() => setSelectedUserIds([])} className="text-sm font-medium text-[#19aaba] hover:text-[#158c99]">Clear selection</button>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredUsers.map((user) => {
                  const selected = selectedUserIds.includes(user.id);

                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleUser(user.id)}
                      className={`rounded-xl border p-4 text-left transition-all ${selected ? 'border-[#19aaba] bg-[#19aaba]/5 shadow-md' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.studentId}</p>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${selected ? 'bg-[#19aaba] text-white' : 'bg-gray-100 text-gray-700'}`}>
                          {selected ? 'Selected' : 'Click to select'}
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-gray-600">{user.department || 'No department'} · {user.allocatedHall || 'No hall'} · {user.allocatedRoom || 'No room'}</p>
                    </button>
                  );
                })}
                {!filteredUsers.length && (
                  <p className="text-sm text-gray-600">No users match the current filters.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Recent Fee Records</h2>
                <button type="button" onClick={fetchData} className="inline-flex items-center gap-2 text-sm font-medium text-[#19aaba] hover:text-[#158c99]">
                  <RefreshCw size={16} /> Refresh
                </button>
              </div>
              <div className="space-y-4">
                {fees.slice(0, 8).map((fee) => (
                  <div key={fee._id} className="rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-gray-900">{fee.title}</p>
                        <p className="text-sm text-gray-600">{fee.user?.name} · {fee.user?.studentId}</p>
                      </div>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${fee.status === 'paid' ? 'bg-green-100 text-green-700' : fee.isOverdue ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {fee.status === 'paid' ? 'Paid' : fee.isOverdue ? 'Overdue' : 'Unpaid'}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p>Due: {new Date(fee.dueDate).toLocaleDateString()}</p>
                      <p>Amount: ৳{fee.amount}</p>
                      {fee.lateFee ? <p>Late fee: ৳{fee.lateFee}</p> : null}
                    </div>
                  </div>
                ))}
                {!fees.length && <p className="text-sm text-gray-600">No fee records yet.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFeesPage;