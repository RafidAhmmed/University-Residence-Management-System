import { useState, useEffect } from 'react';
import { Settings, Save, Loader, AlertCircle, CheckCircle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { mealAPI } from '../../api/mealApi';

const AdminMealPricePage = ({ embedded = false }) => {
  const hallOptions = ['SMR Hall', 'MM Hall', 'BPTB Hall', 'TR Hall'];
  const [selectedHall, setSelectedHall] = useState(hallOptions[0]);
  const [lunchPrices, setLunchPrices] = useState({
    chicken: '',
    fish: '',
  });
  const [dinnerPrices, setDinnerPrices] = useState({
    chicken: '',
    fish: '',
  });
  const [lunchEffectiveFrom, setLunchEffectiveFrom] = useState('');
  const [dinnerEffectiveFrom, setDinnerEffectiveFrom] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState({
    lunch: null,
    dinner: null,
  });

  const formatDateInput = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  };

  // Fetch current meal prices
  useEffect(() => {
    fetchMealPrices();
  }, [selectedHall]);

  const fetchMealPrices = async () => {
    try {
      setLoading(true);
      const response = await mealAPI.getMealPrices(null, selectedHall);
      const prices = response.data?.data || {};

      if (prices.lunch) {
        setLunchPrices({
          chicken: prices.lunch.chicken || '',
          fish: prices.lunch.fish || '',
        });
        setLunchEffectiveFrom(formatDateInput(prices.lunch.effectiveFrom));
        setLastUpdated((prev) => ({
          ...prev,
          lunch: prices.lunch.updatedAt,
        }));
      }

      if (prices.dinner) {
        setDinnerPrices({
          chicken: prices.dinner.chicken || '',
          fish: prices.dinner.fish || '',
        });
        setDinnerEffectiveFrom(formatDateInput(prices.dinner.effectiveFrom));
        setLastUpdated((prev) => ({
          ...prev,
          dinner: prices.dinner.updatedAt,
        }));
      }
    } catch (error) {
      toast.error('Failed to fetch meal prices');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrices = async (mealType) => {
    const prices = mealType === 'lunch' ? lunchPrices : dinnerPrices;
    const effectiveFrom = mealType === 'lunch' ? lunchEffectiveFrom : dinnerEffectiveFrom;

    // Validate prices
    if (!prices.chicken || !prices.fish) {
      toast.error(`Please enter both chicken and fish prices for ${mealType}`);
      return;
    }

    if (!effectiveFrom) {
      toast.error(`Please choose the effective date for ${mealType}`);
      return;
    }

    if (parseFloat(prices.chicken) < 0 || parseFloat(prices.fish) < 0) {
      toast.error('Prices cannot be negative');
      return;
    }

    try {
      setSaving(true);
      await mealAPI.updateMealPrices(
        mealType,
        parseFloat(prices.chicken),
        parseFloat(prices.fish),
        effectiveFrom,
        selectedHall
      );

      toast.success(`${mealType.charAt(0).toUpperCase() + mealType.slice(1)} prices updated successfully`);
      setLastUpdated((prev) => ({
        ...prev,
        [mealType]: new Date(),
      }));
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to update prices');
    } finally {
      setSaving(false);
    }
  };

  const content = loading ? (
    <div className="flex flex-col items-center gap-4 py-16">
      <Loader className="w-12 h-12 text-primary animate-spin" />
      <p className="text-slate-600 font-medium">Loading meal prices...</p>
    </div>
  ) : (
    <>
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-slate-900">Meal Price Management</h1>
          </div>
          <p className="text-slate-600">Set and manage meal prices for students</p>
          <div className="mt-4 max-w-sm">
            <label className="block text-slate-700 font-semibold mb-2">Select Hall</label>
            <select
              value={selectedHall}
              onChange={(e) => setSelectedHall(e.target.value)}
              className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 font-bold focus:border-primary focus:outline-none transition-colors"
            >
              {hallOptions.map((hall) => (
                <option key={hall} value={hall}>{hall}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Info Alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 flex items-gap-2">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-900 font-semibold">Price Management Notice</p>
            <p className="text-blue-700 text-sm">
              These prices will be used for meal orders. Students can purchase meals before 12:00 PM for the next day.
            </p>
          </div>
        </div>

        {/* Price Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lunch Prices */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
                🍽️
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Lunch</h2>
                <p className="text-slate-600 text-sm">Set meal prices for lunch</p>
              </div>
            </div>

            {lastUpdated.lunch && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Last updated: {new Date(lastUpdated.lunch).toLocaleString()}
                </p>
              </div>
            )}

            <div className="space-y-6">
              {/* Chicken Price */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">🍗</span>
                    Chicken Price (৳)
                  </span>
                </label>
                <input
                  type="number"
                  value={lunchPrices.chicken}
                  onChange={(e) =>
                    setLunchPrices({
                      ...lunchPrices,
                      chicken: e.target.value,
                    })
                  }
                  placeholder="Enter chicken price"
                  disabled={saving}
                  className="w-full border-2 border-slate-300 rounded-lg px-4 py-4 text-lg font-bold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
                  min="0"
                  step="10"
                />
                <p className="text-sm text-slate-500 mt-2">
                  Current: ৳<span className="font-bold">{lunchPrices.chicken || 'Not set'}</span>
                </p>
              </div>

              {/* Fish Price */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">🐟</span>
                    Fish Price (৳)
                  </span>
                </label>
                <input
                  type="number"
                  value={lunchPrices.fish}
                  onChange={(e) =>
                    setLunchPrices({
                      ...lunchPrices,
                      fish: e.target.value,
                    })
                  }
                  placeholder="Enter fish price"
                  disabled={saving}
                  className="w-full border-2 border-slate-300 rounded-lg px-4 py-4 text-lg font-bold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
                  min="0"
                  step="10"
                />
                <p className="text-sm text-slate-500 mt-2">
                  Current: ৳<span className="font-bold">{lunchPrices.fish || 'Not set'}</span>
                </p>
              </div>

              {/* Effective From */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  Effective From
                </label>
                <input
                  type="date"
                  value={lunchEffectiveFrom}
                  onChange={(e) => setLunchEffectiveFrom(e.target.value)}
                  disabled={saving}
                  className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 text-lg font-bold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
                />
                <p className="text-sm text-slate-500 mt-2">
                  New rates apply from this date.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSavePrices('lunch')}
              disabled={saving}
              className="w-full mt-8 bg-primary text-white rounded-lg py-4 font-bold hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-lg"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Lunch Prices
                </>
              )}
            </button>
          </div>

          {/* Dinner Prices */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                🌙
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Dinner</h2>
                <p className="text-slate-600 text-sm">Set meal prices for dinner</p>
              </div>
            </div>

            {lastUpdated.dinner && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-slate-600 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Last updated: {new Date(lastUpdated.dinner).toLocaleString()}
                </p>
              </div>
            )}

            <div className="space-y-6">
              {/* Chicken Price */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">🍗</span>
                    Chicken Price (৳)
                  </span>
                </label>
                <input
                  type="number"
                  value={dinnerPrices.chicken}
                  onChange={(e) =>
                    setDinnerPrices({
                      ...dinnerPrices,
                      chicken: e.target.value,
                    })
                  }
                  placeholder="Enter chicken price"
                  disabled={saving}
                  className="w-full border-2 border-slate-300 rounded-lg px-4 py-4 text-lg font-bold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
                  min="0"
                  step="10"
                />
                <p className="text-sm text-slate-500 mt-2">
                  Current: ৳<span className="font-bold">{dinnerPrices.chicken || 'Not set'}</span>
                </p>
              </div>

              {/* Fish Price */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  <span className="flex items-center gap-2">
                    <span className="text-2xl">🐟</span>
                    Fish Price (৳)
                  </span>
                </label>
                <input
                  type="number"
                  value={dinnerPrices.fish}
                  onChange={(e) =>
                    setDinnerPrices({
                      ...dinnerPrices,
                      fish: e.target.value,
                    })
                  }
                  placeholder="Enter fish price"
                  disabled={saving}
                  className="w-full border-2 border-slate-300 rounded-lg px-4 py-4 text-lg font-bold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
                  min="0"
                  step="10"
                />
                <p className="text-sm text-slate-500 mt-2">
                  Current: ৳<span className="font-bold">{dinnerPrices.fish || 'Not set'}</span>
                </p>
              </div>

              {/* Effective From */}
              <div>
                <label className="block text-slate-700 font-bold mb-2">
                  Effective From
                </label>
                <input
                  type="date"
                  value={dinnerEffectiveFrom}
                  onChange={(e) => setDinnerEffectiveFrom(e.target.value)}
                  disabled={saving}
                  className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 text-lg font-bold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
                />
                <p className="text-sm text-slate-500 mt-2">
                  New rates apply from this date.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSavePrices('dinner')}
              disabled={saving}
              className="w-full mt-8 bg-primary text-white rounded-lg py-4 font-bold hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-lg"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Dinner Prices
                </>
              )}
            </button>
          </div>
        </div>

        {/* Price Summary Card */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-primary" />
            Price Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lunch Summary */}
            <div className="border border-slate-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Lunch Prices</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">🍗 Chicken</span>
                  <span className="text-lg font-bold text-primary">
                    ৳{lunchPrices.chicken || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">🐟 Fish</span>
                  <span className="text-lg font-bold text-primary">
                    ৳{lunchPrices.fish || '-'}
                  </span>
                </div>
              </div>
            </div>

            {/* Dinner Summary */}
            <div className="border border-slate-200 rounded-lg p-6">
              <h4 className="text-lg font-bold text-slate-900 mb-4">Dinner Prices</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">🍗 Chicken</span>
                  <span className="text-lg font-bold text-primary">
                    ৳{dinnerPrices.chicken || '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-700">🐟 Fish</span>
                  <span className="text-lg font-bold text-primary">
                    ৳{dinnerPrices.fish || '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
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

export default AdminMealPricePage;
