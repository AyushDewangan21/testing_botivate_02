'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Edit, Save, X } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface GoldRate {
  id: string;
  buyRate: string;
  sellRate: string;
  isActive: boolean;
  createdAt: string;
  createdBy?: string;
}

export default function GoldRatesTab() {
  const [currentRate, setCurrentRate] = useState<GoldRate | null>(null);
  const [rateHistory, setRateHistory] = useState<GoldRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newBuyRate, setNewBuyRate] = useState('');
  const [newSellRate, setNewSellRate] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const fetchCurrentRate = async () => {
    try {
      const response = await fetch(`${API_URL}/gold/rates/current`);
      const data = await response.json();
      if (data.success) {
        setCurrentRate(data.data);
        setNewBuyRate(data.data.buyRate);
        setNewSellRate(data.data.sellRate);
      }
    } catch (error) {
      console.error('Error fetching current rate:', error);
    }
  };

  const fetchRateHistory = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_URL}/gold/rates/history?limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setRateHistory(data.data);
      }
    } catch (error) {
      console.error('Error fetching rate history:', error);
    }
  };

  const handleUpdateRate = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (!newBuyRate || !newSellRate) {
        setError('Both buy and sell rates are required');
        return;
      }

      if (parseFloat(newBuyRate) <= 0 || parseFloat(newSellRate) <= 0) {
        setError('Rates must be positive numbers');
        return;
      }

      const token = getAuthToken();
      const response = await fetch(`${API_URL}/gold/rates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          buyRate: newBuyRate,
          sellRate: newSellRate
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Gold rates updated successfully');
        setEditing(false);
        await fetchCurrentRate();
        await fetchRateHistory();
      } else {
        setError(data.message || 'Failed to update rates');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to update rates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentRate();
    fetchRateHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Current Rates Card */}
      <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Current Gold Rates</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#3D3066] dark:bg-[#4D3F7F] text-white rounded-lg hover:bg-[#5C4E7F] transition-colors"
            >
              <Edit className="w-4 h-4" />
              Update Rates
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleUpdateRate}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setNewBuyRate(currentRate?.buyRate || '');
                  setNewSellRate(currentRate?.sellRate || '');
                  setError('');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-400 text-sm">{success}</p>
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Buy Rate */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">Buy Rate</span>
            </div>
            {editing ? (
              <input
                type="number"
                value={newBuyRate}
                onChange={(e) => setNewBuyRate(e.target.value)}
                step="0.01"
                className="text-3xl font-bold text-green-900 dark:text-green-100 w-full bg-gray-50 dark:bg-neutral-700 px-3 py-2 rounded-lg border-2 border-green-300 dark:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="6245.50"
              />
            ) : (
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                ₹{parseFloat(currentRate?.buyRate || '0').toFixed(2)}
              </p>
            )}
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">per gram (24K)</p>
          </div>

          {/* Sell Rate */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-6 border-2 border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Sell Rate</span>
            </div>
            {editing ? (
              <input
                type="number"
                value={newSellRate}
                onChange={(e) => setNewSellRate(e.target.value)}
                step="0.01"
                className="text-3xl font-bold text-orange-900 dark:text-orange-100 w-full bg-gray-50 dark:bg-neutral-700 px-3 py-2 rounded-lg border-2 border-orange-300 dark:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="6145.50"
              />
            ) : (
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                ₹{parseFloat(currentRate?.sellRate || '0').toFixed(2)}
              </p>
            )}
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">per gram (24K)</p>
          </div>
        </div>
      </div>

      {/* Rate History */}
      <div className="bg-gray-50 dark:bg-neutral-800 rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Rate History</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-neutral-700">
                <th className="text-left text-gray-600 dark:text-neutral-400 py-3 px-2 font-medium">Date & Time</th>
                <th className="text-right text-gray-600 dark:text-neutral-400 py-3 px-2 font-medium">Buy Rate</th>
                <th className="text-right text-gray-600 dark:text-neutral-400 py-3 px-2 font-medium">Sell Rate</th>
                <th className="text-center text-gray-600 dark:text-neutral-400 py-3 px-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rateHistory.map((rate) => (
                <tr key={rate.id} className="border-b border-gray-100 dark:border-neutral-700/50">
                  <td className="text-gray-700 dark:text-neutral-300 py-3 px-2">{formatDate(rate.createdAt)}</td>
                  <td className="text-right text-green-700 dark:text-green-400 font-medium py-3 px-2">
                    ₹{parseFloat(rate.buyRate).toFixed(2)}
                  </td>
                  <td className="text-right text-orange-700 dark:text-orange-400 font-medium py-3 px-2">
                    ₹{parseFloat(rate.sellRate).toFixed(2)}
                  </td>
                  <td className="text-center py-3 px-2">
                    {rate.isActive ? (
                      <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                        Active
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-neutral-400 text-xs font-medium rounded-full">
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
