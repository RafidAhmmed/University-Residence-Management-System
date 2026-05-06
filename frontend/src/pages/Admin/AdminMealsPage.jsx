import { useState } from 'react';
import AdminMealPricePage from './AdminMealPricePage';
import AdminMealClosuresPage from './AdminMealClosuresPage';
import AdminSpecialMealsPage from './AdminSpecialMealsPage';

const AdminMealsPage = () => {
  const tabs = [
    { key: 'prices', label: 'Meal Prices' },
    { key: 'closures', label: 'Meal Closures' },
    { key: 'specials', label: 'Special Meals' },
  ];
  const [activeTab, setActiveTab] = useState('prices');

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  activeTab === tab.key
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'prices' && <AdminMealPricePage embedded />}
        {activeTab === 'closures' && <AdminMealClosuresPage embedded />}
        {activeTab === 'specials' && <AdminSpecialMealsPage embedded />}
      </div>
    </div>
  );
};

export default AdminMealsPage;
