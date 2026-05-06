import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  Utensils,
  CreditCard,
  Plus,
  X,
  Loader,
  CheckCircle,
  AlertCircle,
  Wallet,
  History,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';
import { mealAPI } from '../../api/mealApi';
import { QRCodeCanvas } from 'qrcode.react';

const StudentMealPage = () => {
  const { user } = useAuth();
  const [mealPrices, setMealPrices] = useState({ lunch: null, dinner: null });
  const [specialMeals, setSpecialMeals] = useState({ lunch: null, dinner: null });
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [deposit, setDeposit] = useState(null);
  const [mealOrders, setMealOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOrderingDisabled, setIsOrderingDisabled] = useState(false);
  const [orderingError, setOrderingError] = useState('');
  const [selectedHall, setSelectedHall] = useState('');
  const formatDateInput = (date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  };

  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatDateInput(tomorrow);
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('deposit');
  const [depositAmount, setDepositAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDepositDetails, setShowDepositDetails] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getHallOptions = () => {
    const maleHalls = ['SMR Hall', 'MM Hall'];
    const femaleHalls = ['BPTB Hall', 'TR Hall'];

    if (user?.gender === 'male') return maleHalls;
    if (user?.gender === 'female') return femaleHalls;
    return [...maleHalls, ...femaleHalls];
  };

  useEffect(() => {
    const hallOptions = getHallOptions();
    if (!hallOptions.length) return;
    const preferredHall = hallOptions.includes(user?.allocatedHall)
      ? user.allocatedHall
      : hallOptions[0];

    if (preferredHall && preferredHall !== selectedHall) {
      setSelectedHall(preferredHall);
    }
  }, [user?.gender, user?.allocatedHall]);

  useEffect(() => {
    if (!selectedHall) return;
    fetchData(selectedDate, selectedHall);
  }, [selectedDate, selectedHall]);

  const getDateBounds = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);
    return {
      min: formatDateInput(minDate),
      max: formatDateInput(maxDate),
    };
  };

  const fetchData = async (targetDate, hall) => {
    try {
      setLoading(true);
      const [pricesRes, depositRes, canOrderRes, ordersRes, specialsRes] = await Promise.all([
        mealAPI.getMealPrices(targetDate, hall),
        mealAPI.getStudentDeposit(),
        mealAPI.canOrderMeals(targetDate, hall),
        mealAPI.getStudentMealOrders(),
        mealAPI.getSpecialMeals(targetDate, hall),
      ]);

      setMealPrices(pricesRes.data?.data || { lunch: null, dinner: null });
      setSpecialMeals(specialsRes.data?.data || { lunch: null, dinner: null });
      setDeposit(depositRes.data?.data || null);
      setMealOrders(ordersRes.data?.data || []);
      const canOrderData = canOrderRes.data || {};
      setIsOrderingDisabled(!canOrderData.canOrder);

      let orderMessage = canOrderData.message || '';
      if (canOrderData.deadline) {
        const deadlineLabel = new Date(canOrderData.deadline).toLocaleString();
        orderMessage = `${orderMessage} (Order by ${deadlineLabel})`;
      }
      setOrderingError(orderMessage);
    } catch (error) {
      toast.error('Failed to load meal data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentMonthOrders = mealOrders.filter((order) => {
    const orderDate = new Date(order.mealDate);
    const now = new Date();
    return orderDate.getFullYear() === now.getFullYear() && orderDate.getMonth() === now.getMonth();
  });

  const visibleOrders = showAllHistory ? mealOrders : currentMonthOrders;

  const addMealToCart = (mealType, mealOption) => {
    const price = mealOption === 'special'
      ? specialMeals[mealType]?.price
      : mealPrices[mealType]?.[mealOption];
    if (price === undefined || price === null) {
      toast.error('Price not available for this meal');
      return;
    }

    const mealId = `${mealType}-${mealOption}-${Date.now()}`;
    setSelectedMeals([
      ...selectedMeals,
      {
        id: mealId,
        mealType,
        mealOption,
        price,
      },
    ]);

    toast.success(`${mealType.toUpperCase()} - ${mealOption.toUpperCase()} added to cart`);
  };

  const removeMealFromCart = (mealId) => {
    setSelectedMeals(selectedMeals.filter((m) => m.id !== mealId));
  };

  const getTotalPrice = () => {
    return selectedMeals.reduce((sum, meal) => sum + meal.price, 0);
  };

  const handlePaymentSubmit = async () => {
    if (selectedMeals.length === 0) {
      toast.error('Please select at least one meal');
      return;
    }

    if (paymentMethod === 'deposit') {
      const totalPrice = getTotalPrice();
      if ((deposit?.remainingBalance || 0) < totalPrice) {
        toast.error(
          `Insufficient deposit balance. You need ${totalPrice - (deposit?.remainingBalance || 0)} more`
        );
        return;
      }
    }

    try {
      setIsProcessing(true);

      const mealData = selectedMeals.map((meal) => ({
        mealType: meal.mealType,
        mealOption: meal.mealOption,
      }));

      const response = await mealAPI.createMealOrder({
        meals: mealData,
        paymentMethod,
        mealDate: selectedDate,
        hall: selectedHall,
      });

      toast.success('Meal order placed successfully!');
      setShowPaymentModal(false);
      setSelectedMeals([]);
      setPaymentMethod('deposit');

      // Refresh deposit and orders
      await fetchData(selectedDate, selectedHall);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to place meal order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddDeposit = async () => {
    if (!depositAmount || depositAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      setIsProcessing(true);
      await mealAPI.addDeposit(parseFloat(depositAmount), paymentMethod);
      toast.success(`Deposit of ${depositAmount} added successfully!`);
      setShowDepositModal(false);
      setDepositAmount('');
      await fetchData(selectedDate, selectedHall);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add deposit');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-primary animate-spin" />
          <p className="text-slate-600 font-medium">Loading meal system...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4 md:px-6">
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Utensils className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold text-slate-900">Meal Management</h1>
          </div>
          <p className="text-slate-600">Order meals up to 2 days in advance</p>
        </div>

        {/* Hall Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Select Hall</h2>
              <p className="text-slate-600 text-sm">Hall options are limited by your profile.</p>
            </div>
            <div className="min-w-[220px]">
              <select
                value={selectedHall}
                onChange={(e) => {
                  setSelectedHall(e.target.value);
                  setSelectedMeals([]);
                }}
                disabled={isProcessing}
                className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 text-lg font-bold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
              >
                {getHallOptions().map((hall) => (
                  <option key={hall} value={hall}>{hall}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Select Meal Date</h2>
              <p className="text-slate-600 text-sm">
                Choose a date from tomorrow up to 2 days ahead. Orders close at 12:00 AM on the meal date.
              </p>
            </div>
            <div className="min-w-[220px]">
              <input
                type="date"
                value={selectedDate}
                min={getDateBounds().min}
                max={getDateBounds().max}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedMeals([]);
                }}
                disabled={isProcessing}
                className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 text-lg font-bold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Ordering Status Alert */}
        {isOrderingDisabled && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-900 font-semibold">Meal ordering is closed</p>
              <p className="text-amber-700 text-sm">{orderingError}</p>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Meal Selection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Lunch Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                  🍽️
                </span>
                Lunch
              </h2>

              {specialMeals.lunch ? (
                <div className="border-2 border-amber-200 rounded-lg p-4 bg-amber-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{specialMeals.lunch.title}</h3>
                      <p className="text-slate-600 text-sm">{specialMeals.lunch.description || 'Special menu'}</p>
                    </div>
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ৳{specialMeals.lunch.price}
                    </span>
                    <button
                      onClick={() => addMealToCart('lunch', 'special')}
                      disabled={isOrderingDisabled}
                      className="bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Chicken */}
                  <div className="border-2 border-slate-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Chicken Lunch</h3>
                        <p className="text-slate-600 text-sm">Grilled chicken with rice</p>
                      </div>
                      <span className="text-2xl">🍗</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ৳{mealPrices.lunch?.chicken || 'N/A'}
                      </span>
                      <button
                        onClick={() => addMealToCart('lunch', 'chicken')}
                        disabled={isOrderingDisabled}
                        className="bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>

                  {/* Fish */}
                  <div className="border-2 border-slate-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Fish Lunch</h3>
                        <p className="text-slate-600 text-sm">Fried fish with rice</p>
                      </div>
                      <span className="text-2xl">🐟</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ৳{mealPrices.lunch?.fish || 'N/A'}
                      </span>
                      <button
                        onClick={() => addMealToCart('lunch', 'fish')}
                        disabled={isOrderingDisabled}
                        className="bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Dinner Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  🌙
                </span>
                Dinner
              </h2>

              {specialMeals.dinner ? (
                <div className="border-2 border-amber-200 rounded-lg p-4 bg-amber-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{specialMeals.dinner.title}</h3>
                      <p className="text-slate-600 text-sm">{specialMeals.dinner.description || 'Special menu'}</p>
                    </div>
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      ৳{specialMeals.dinner.price}
                    </span>
                    <button
                      onClick={() => addMealToCart('dinner', 'special')}
                      disabled={isOrderingDisabled}
                      className="bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Chicken */}
                  <div className="border-2 border-slate-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Chicken Dinner</h3>
                        <p className="text-slate-600 text-sm">Grilled chicken with rice</p>
                      </div>
                      <span className="text-2xl">🍗</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ৳{mealPrices.dinner?.chicken || 'N/A'}
                      </span>
                      <button
                        onClick={() => addMealToCart('dinner', 'chicken')}
                        disabled={isOrderingDisabled}
                        className="bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>

                  {/* Fish */}
                  <div className="border-2 border-slate-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Fish Dinner</h3>
                        <p className="text-slate-600 text-sm">Fried fish with rice</p>
                      </div>
                      <span className="text-2xl">🐟</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ৳{mealPrices.dinner?.fish || 'N/A'}
                      </span>
                      <button
                        onClick={() => addMealToCart('dinner', 'fish')}
                        disabled={isOrderingDisabled}
                        className="bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Cart and Deposit */}
          <div className="space-y-6">
            {/* Shopping Cart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Your Cart
              </h3>

              {selectedMeals.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No meals selected</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {selectedMeals.map((meal) => (
                      <div
                        key={meal.id}
                        className="flex items-center justify-between bg-slate-50 rounded-lg p-3"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900 capitalize">
                            {meal.mealType} - {meal.mealOption}
                          </p>
                          <p className="text-sm text-slate-600">৳{meal.price}</p>
                        </div>
                        <button
                          onClick={() => removeMealFromCart(meal.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 pt-4 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-slate-700 font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-primary">
                        ৳{getTotalPrice()}
                      </span>
                    </div>

                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full bg-primary text-white rounded-lg py-3 font-bold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      disabled={isOrderingDisabled || selectedMeals.length === 0}
                    >
                      <CreditCard className="w-5 h-5" />
                      Proceed to Payment
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Deposit Display */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-primary" />
                  Deposit
                </h3>
                <button
                  onClick={() => setShowDepositDetails(!showDepositDetails)}
                  className="text-primary hover:text-primary-dark text-sm font-semibold"
                >
                  {showDepositDetails ? 'Hide' : 'Details'}
                </button>
              </div>

              <div className="mb-4">
                <p className="text-slate-600 text-sm mb-1">Total Paid:</p>
                <p className="text-2xl font-bold text-slate-900">
                  ৳{deposit?.totalPaid || 0}
                </p>
              </div>

              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-slate-600 text-sm mb-1">Available Balance:</p>
                <p className="text-3xl font-bold text-green-600">
                  ৳{deposit?.remainingBalance || 0}
                </p>
              </div>

              <button
                onClick={() => setShowDepositModal(true)}
                className="w-full bg-primary text-white rounded-lg py-3 font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Funds
              </button>

              {showDepositDetails && deposit?.transactionHistory && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Recent Transactions
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {deposit.transactionHistory.slice(-5).map((tx, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-sm bg-slate-50 p-2 rounded"
                      >
                        <span className="text-slate-600 capitalize">{tx.type}</span>
                        <span className={`font-semibold ${
                          tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {tx.type === 'deposit' ? '+' : '-'}৳{tx.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order History */}
        {mealOrders.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <History className="w-6 h-6 text-primary" />
                Recent Orders
              </h3>
              <button
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="text-primary hover:text-primary-dark font-semibold"
              >
                {showAllHistory ? 'Show Current Month' : 'Show All History'}
              </button>
            </div>

            {visibleOrders.length === 0 ? (
              <p className="text-slate-500">No orders for the current month.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {visibleOrders.slice(0, 6).map((order) => (
                  <div
                    key={order._id}
                    className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-primary uppercase">
                        {order.status}
                      </span>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>

                    <div className="space-y-2 mb-3">
                      {order.meals.map((meal, idx) => (
                        <p key={idx} className="text-sm text-slate-700">
                          <span className="font-semibold capitalize">{meal.mealType}</span> -{' '}
                          <span className="capitalize">{meal.mealOption}</span>
                        </p>
                      ))}
                    </div>

                    <div className="border-t border-slate-200 pt-3">
                      <p className="text-lg font-bold text-primary">৳{order.totalPrice}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(order.mealDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-slate-500">Hall: {order.hall || 'N/A'}</p>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="mt-3 inline-flex items-center justify-center rounded-md bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors"
                      >
                        Bill Info
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          totalPrice={getTotalPrice()}
          onClose={() => setShowPaymentModal(false)}
          onProceed={handlePaymentSubmit}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          depositBalance={deposit?.remainingBalance || 0}
          isProcessing={isProcessing}
        />
      )}

      {/* Deposit Modal */}
      {showDepositModal && (
        <DepositModal
          onClose={() => setShowDepositModal(false)}
          onSubmit={handleAddDeposit}
          amount={depositAmount}
          setAmount={setDepositAmount}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          isProcessing={isProcessing}
        />
      )}

      {selectedOrder && (
        <BillInfoModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

const BillInfoModal = ({ order, onClose }) => {
  const payloadForMeal = (meal) => JSON.stringify({
    orderId: order._id,
    token: meal.token,
    mealType: meal.mealType,
    mealOption: meal.mealOption,
    mealDate: order.mealDate,
    hall: order.hall,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Bill Info</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-slate-600">Meal Date: {new Date(order.mealDate).toLocaleDateString()}</p>
          <p className="text-slate-600">Hall: {order.hall}</p>
          <p className="text-slate-600">Total: ৳{order.totalPrice}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {order.meals.map((meal, idx) => (
            <div key={idx} className="border border-slate-200 rounded-lg p-4">
              <p className="font-semibold text-slate-900 mb-2 capitalize">
                {meal.mealType} - {meal.mealOption}
              </p>
              <div className="flex items-center gap-4">
                <QRCodeCanvas value={payloadForMeal(meal)} size={120} />
                <div>
                  <p className="text-sm text-slate-600">Token:</p>
                  <p className="text-xs font-mono break-all text-slate-800">{meal.token}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Payment Modal Component
const PaymentModal = ({
  totalPrice,
  onClose,
  onProceed,
  paymentMethod,
  setPaymentMethod,
  depositBalance,
  isProcessing,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Payment Method</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-slate-600 mb-4">Choose a payment method:</p>

          {/* Deposit Option */}
          <label className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-primary transition-all mb-3">
            <input
              type="radio"
              value="deposit"
              checked={paymentMethod === 'deposit'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4 text-primary"
            />
            <div className="ml-4 flex-1">
              <p className="font-semibold text-slate-900">Deposit Balance</p>
              <p className="text-sm text-slate-600">
                Available: ৳{depositBalance}
                {depositBalance < totalPrice && (
                  <span className="block text-red-600 text-xs mt-1">
                    Insufficient balance
                  </span>
                )}
              </p>
            </div>
          </label>

          {/* Mobile Banking Options */}
          {['bkash', 'nagad', 'rocket'].map((method) => (
            <label
              key={method}
              className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-primary transition-all mb-3"
            >
              <input
                type="radio"
                value={method}
                checked={paymentMethod === method}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <div className="ml-4 flex-1">
                <p className="font-semibold text-slate-900 uppercase">{method}</p>
                <p className="text-sm text-slate-600">Pay via {method}</p>
              </div>
              <Phone className="w-5 h-5 text-slate-400" />
            </label>
          ))}
        </div>

        <div className="bg-slate-100 rounded-lg p-4 mb-6">
          <p className="text-slate-600 text-sm mb-1">Total Amount:</p>
          <p className="text-3xl font-bold text-primary">৳{totalPrice}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 border-2 border-slate-300 text-slate-700 rounded-lg py-3 font-bold hover:border-slate-400 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            disabled={isProcessing}
            className="flex-1 bg-primary text-white rounded-lg py-3 font-bold hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Deposit Modal Component
const DepositModal = ({
  onClose,
  onSubmit,
  amount,
  setAmount,
  paymentMethod,
  setPaymentMethod,
  isProcessing,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Add Deposit</h2>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-slate-700 font-semibold mb-2">Amount (৳)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={isProcessing}
            className="w-full border-2 border-slate-300 rounded-lg px-4 py-3 font-semibold disabled:opacity-50 focus:border-primary focus:outline-none transition-colors"
            min="1"
            step="100"
          />
        </div>

        <div className="mb-6">
          <p className="text-slate-600 font-semibold mb-3">Payment Method:</p>

          <div className="space-y-2">
            {['bkash', 'nagad', 'rocket'].map((method) => (
              <label
                key={method}
                className="flex items-center p-3 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-primary transition-all"
              >
                <input
                  type="radio"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="ml-3 font-semibold text-slate-900 uppercase">{method}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 border-2 border-slate-300 text-slate-700 rounded-lg py-3 font-bold hover:border-slate-400 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isProcessing || !amount}
            className="flex-1 bg-primary text-white rounded-lg py-3 font-bold hover:bg-primary-dark disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                Add Funds
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentMealPage;
