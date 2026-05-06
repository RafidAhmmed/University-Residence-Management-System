import { useEffect, useState } from 'react';
import { Utensils, Trash2, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { mealAPI } from '../../api/mealApi';

const AdminSpecialMealsPage = ({ embedded = false }) => {
  const hallOptions = ['SMR Hall', 'MM Hall', 'BPTB Hall', 'TR Hall'];
  const [selectedHall, setSelectedHall] = useState(hallOptions[0]);
  const [selectedDate, setSelectedDate] = useState('');
  const [mealType, setMealType] = useState('lunch');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [specials, setSpecials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSpecials = async () => {
    try {
      setLoading(true);
      const response = await mealAPI.getAdminSpecialMeals();
      setSpecials(response.data?.data || []);
    } catch (error) {
      toast.error('Failed to fetch special meals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecials();
  }, []);

  const handleSave = async () => {
    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a menu title');
      return;
    }

    if (price === '' || Number.isNaN(Number(price))) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      setSaving(true);
      await mealAPI.createSpecialMeal({
        date: selectedDate,
        hall: selectedHall,
        mealType,
        title,
        description,
        price: Number(price),
      });
      toast.success('Special meal saved');
      setTitle('');
      setDescription('');
      setPrice('');
      await fetchSpecials();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to save special meal');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await mealAPI.deleteSpecialMeal(id);
      toast.success('Special meal removed');
      await fetchSpecials();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to remove special meal');
    }
  };

  const content = (
    <div className="max-w-5xl mx-auto">
      <style>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Utensils className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold text-slate-900">Special Meals</h1>
        </div>
        <p className="text-slate-600">Add special menus that replace normal meals for a hall</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex gap-2">
        <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-900 font-semibold">Special Meal Info</p>
          <p className="text-blue-700 text-sm">
            When a special meal exists, normal lunch/dinner ordering is disabled for that hall.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Add Special Meal</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
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
                <option key={hall} value={hall}>{hall}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Meal Type</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              disabled={saving}
              className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 font-bold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
            >
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 font-semibold mb-2">Menu Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={saving}
              placeholder="Special menu title"
              className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 font-bold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold mb-2">Price (৳)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={saving}
              min="0"
              className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 font-bold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-slate-700 font-semibold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={saving}
              rows={3}
              className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 font-semibold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <div className="md:col-span-3">
            <button
              onClick={handleSave}
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
                  Save Special Meal
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Active Special Meals</h2>
        {loading ? (
          <div className="flex items-center gap-2 text-slate-500">
            <Loader className="w-5 h-5 animate-spin" />
            Loading...
          </div>
        ) : specials.length === 0 ? (
          <p className="text-slate-500">No special meals set.</p>
        ) : (
          <div className="space-y-3">
            {specials.map((meal) => (
              <div
                key={meal._id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border border-slate-200 rounded-lg p-4"
              >
                <div>
                  <p className="text-slate-900 font-semibold">
                    {new Date(meal.date).toLocaleDateString()} — {meal.hall} — {meal.mealType}
                  </p>
                  <p className="text-sm text-slate-600">{meal.title}</p>
                  {meal.description && <p className="text-xs text-slate-500">{meal.description}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-primary font-bold">৳{meal.price}</span>
                  <button
                    onClick={() => handleRemove(meal._id)}
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
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

export default AdminSpecialMealsPage;
