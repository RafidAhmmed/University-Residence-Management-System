import { useEffect, useState } from 'react';
import { CalendarX2, Trash2, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { mealAPI } from '../../api/mealApi';

const AdminMealClosuresPage = ({ embedded = false }) => {
  const hallOptions = ['ALL', 'SMR Hall', 'MM Hall', 'BPTB Hall', 'TR Hall'];
  const [selectedHall, setSelectedHall] = useState(hallOptions[0]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEndDate, setSelectedEndDate] = useState('');
  const [closures, setClosures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchClosures = async () => {
    try {
      setLoading(true);
      const response = await mealAPI.getMealClosures();
      setClosures(response.data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch meal closures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClosures();
  }, []);

  const handleAddClosure = async () => {
    if (!selectedDate) {
      toast.error('Please select a start date');
      return;
    }

    try {
      setSaving(true);
      await mealAPI.createMealClosure(
        selectedDate,
        selectedEndDate || selectedDate,
        selectedHall
      );
      toast.success('Meal closure saved');
      setSelectedDate('');
      setSelectedEndDate('');
      await fetchClosures();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save closure');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await mealAPI.deleteMealClosure(id);
      toast.success('Meal closure removed');
      await fetchClosures();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to remove closure');
    }
  };

  const content = loading ? (
    <div className="flex flex-col items-center gap-4 py-16">
      <Loader className="w-12 h-12 text-primary animate-spin" />
      <p className="text-slate-600 font-medium">Loading meal closures...</p>
    </div>
  ) : (
    <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <CalendarX2 className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-slate-900">Meal Closures</h1>
          </div>
          <p className="text-slate-600">Stop meal ordering for specific dates and halls</p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-900 font-semibold">Closure Info</p>
            <p className="text-blue-700 text-sm">
              Choose a hall or select ALL to disable ordering across every hall for a date.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Add Closure</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Start Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={saving}
                className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 font-bold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-2">End Date</label>
              <input
                type="date"
                value={selectedEndDate}
                min={selectedDate || undefined}
                onChange={(e) => setSelectedEndDate(e.target.value)}
                disabled={saving}
                className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 font-bold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-2">Hall</label>
              <select
                value={selectedHall}
                onChange={(e) => setSelectedHall(e.target.value)}
                disabled={saving}
                className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 font-bold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
              >
                {hallOptions.map((hall) => (
                  <option key={hall} value={hall}>{hall === 'ALL' ? 'All Halls' : hall}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAddClosure}
                disabled={saving}
                className="w-full bg-primary text-white rounded-lg py-3 font-bold hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Save Closure
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Active Closures</h2>
          {closures.length === 0 ? (
            <p className="text-slate-500">No closures set.</p>
          ) : (
            <div className="space-y-3">
              {closures.map((closure) => (
                <div
                  key={closure._id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-slate-200 rounded-lg p-4"
                >
                  <div>
                    <p className="text-slate-900 font-semibold">
                      {new Date(closure.startDate).toLocaleDateString()} - {new Date(closure.endDate).toLocaleDateString()} — {closure.hall === 'ALL' ? 'All Halls' : closure.hall}
                    </p>
                    <p className="text-sm text-slate-500">
                      Added by {closure.createdBy?.name || 'Admin'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(closure._id)}
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4 md:px-6">
      {content}
    </div>
  );
};

export default AdminMealClosuresPage;
