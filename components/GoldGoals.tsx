

import { useState, useEffect } from 'react';
import { X, Target, TrendingUp, Calendar, Coins, Plus, Edit2, Trash2, Gift, Users, Home as HomeIcon, Sparkles, PartyPopper, Check, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { getAuthHeaders } from '../lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetGrams: number;
  currentGrams: number;
  deadline: string;
  category: 'wedding' | 'festival' | 'emergency' | 'investment' | 'gift' | 'custom';
  icon: string;
  color: string;
  createdAt: string;
  autoAllocate: boolean;
}

interface GoldGoalsProps {
  onClose: () => void;
  mode?: 'create' | 'view' | 'manage';
  onBuyGold?: () => void;
}

export function GoldGoals({ onClose, mode = 'view', onBuyGold }: GoldGoalsProps) {
  const [currentMode, setCurrentMode] = useState(mode);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);


  // Form states for creating new goal
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState(100000);
  const [deadline, setDeadline] = useState('2025-12-31');
  const [category, setCategory] = useState<Goal['category']>('wedding');
  const [autoAllocate, setAutoAllocate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'yearly'>('monthly');

  const goldPrice = 6245.50; // In a real app, this should come from context or API

  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch(`${API_URL}/gold-goals`, {
        headers: getAuthHeaders() as HeadersInit,
      });
      const data = await response.json();
      if (data.success) {
        setGoals(data.data);
      } else {
        toast.error('Failed to fetch goals');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Error fetching goals');
    }
  };

  const goalCategories = [
    { id: 'wedding', name: 'Wedding', icon: '💍', color: 'from-pink-500 to-rose-500' },
    { id: 'festival', name: 'Festival', icon: '🪔', color: 'from-orange-500 to-red-500' },
    { id: 'emergency', name: 'Emergency', icon: '🛡️', color: 'from-blue-500 to-cyan-500' },
    { id: 'investment', name: 'Investment', icon: '📈', color: 'from-green-500 to-emerald-500' },
    { id: 'gift', name: 'Gift', icon: '🎁', color: 'from-purple-500 to-pink-500' },
    { id: 'custom', name: 'Custom', icon: '⭐', color: 'from-indigo-500 to-purple-500' }
  ];

  const handleCreateGoal = async () => {
    if (!goalName || !targetAmount || !deadline) return;
    setIsLoading(true);

    try {
      const selectedCategory = goalCategories.find(c => c.id === category);
      const payload = {
        name: goalName,
        targetAmount,
        deadline,
        category,
        autoAllocate,
        icon: selectedCategory?.icon || '⭐',
        color: selectedCategory?.color || 'from-purple-500 to-pink-500',
      };

      const response = await fetch(`${API_URL}/gold-goals`, {
        method: 'POST',
        headers: getAuthHeaders() as HeadersInit,
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setGoals([data.data, ...goals]);
        toast.success(`Goal "${goalName}" created successfully! 🎯`);
        setCurrentMode('view');

        // Reset form
        setGoalName('');
        setTargetAmount(100000);
        setCategory('wedding');
        setAutoAllocate(false);
      } else {
        toast.error(data.message || 'Failed to create goal');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Error creating goal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/gold-goals/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders() as HeadersInit,
      });
      const data = await response.json();

      if (data.success) {
        setGoals(goals.filter(g => g.id !== id));
        toast.success('Goal deleted successfully');
        setSelectedGoal(null);
      } else {
        toast.error(data.message || 'Failed to delete goal');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Error deleting goal');
    }
  };

  const handleAddMoney = async (goalId: string, amount: number) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const newCurrentAmount = goal.currentAmount + amount;

      const response = await fetch(`${API_URL}/gold-goals/${goalId}`, {
        method: 'PATCH',
        headers: getAuthHeaders() as HeadersInit,
        body: JSON.stringify({ currentAmount: newCurrentAmount }),
      });

      const data = await response.json();

      if (data.success) {
        setGoals(goals.map(g => {
          if (g.id === goalId) {
            return data.data; // Use backend returned updated goal
          }
          return g;
        }));
        // Note: data.data might have strict typing, ensure it matches Goal interface structure roughly
        // or re-fetch goals to be safe, but optimistically using return is faster.

        toast.success(`₹${amount.toLocaleString()} added to your goal! 🎉`);
      } else {
        toast.error(data.message || 'Failed to update goal');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Error updating goal');
    }
  };

  const getProgress = (goal: Goal) => {
    return (goal.currentAmount / goal.targetAmount) * 100;
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const target = new Date(deadline);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getInstallmentAmount = () => {
    const days = getDaysLeft(deadline);
    if (days <= 0) return targetAmount;

    const months = Math.max(1, Math.ceil(days / 30));
    const years = Math.max(1, Math.ceil(days / 365));

    return paymentFrequency === 'monthly'
      ? targetAmount / months
      : targetAmount / years;
  };

  const getTimeLeftBreakdown = () => {
    const today = new Date();
    const target = new Date(deadline);

    if (target <= today) {
      return { months: 0, days: 0, totalDays: 0 };
    }

    let months =
      (target.getFullYear() - today.getFullYear()) * 12 +
      (target.getMonth() - today.getMonth());

    // Adjust if target day is less than today day
    if (target.getDate() < today.getDate()) {
      months -= 1;
    }

    // Calculate remaining days after months
    const tempDate = new Date(today);
    tempDate.setMonth(today.getMonth() + months);

    const diffTime = target.getTime() - tempDate.getTime();
    const days = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const totalDays = Math.ceil(
      (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return { months, days, totalDays };
  };


  const getMilestoneMessage = (progress: number) => {
    if (progress >= 100) return { text: '🎉 Goal Achieved!', color: 'text-green-600 dark:text-green-500' };
    if (progress >= 75) return { text: '💪 Almost there!', color: 'text-orange-600 dark:text-orange-500' };
    if (progress >= 50) return { text: '🔥 Halfway done!', color: 'text-blue-600 dark:text-blue-500' };
    if (progress >= 25) return { text: '🌟 Great start!', color: 'text-purple-600 dark:text-purple-500' };
    return { text: '🚀 Keep going!', color: 'text-gray-600 dark:text-neutral-500' };
  };

  const getMonthsAndYearsLeft = () => {
    const today = new Date();
    const target = new Date(deadline);

    const diffTime = target.getTime() - today.getTime();
    const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const months = Math.max(1, Math.ceil(totalDays / 30));
    const years = Math.max(1, Math.ceil(totalDays / 365));

    return { months, years };
  };

  const getMonthlyAmount = () => {
    const { months } = getMonthsAndYearsLeft();
    return targetAmount / months;
  };

  const getYearlyAmount = () => {
    const { years } = getMonthsAndYearsLeft();
    return targetAmount / years;
  };


  // Create Goal Mode
  if (currentMode === 'create') {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-start justify-center z-50 pt-2">
        <style>{`.zold-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .zold-hide-scrollbar::-webkit-scrollbar{ display:none; }`}</style>
        <div className="bg-white dark:bg-neutral-800 w-full max-w-lg rounded-t-3xl max-h-[90vh]  lg:max-h-[95vh]  overflow-y-auto zold-hide-scrollbar rounded-b-[2rem] ">
          {/* Header */}
          <div className=" z-1 sticky top-0 bg-gradient-to-r from-[#3D3066] to-[#5C4E7F] px-6 py-5 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white">Create Gold Goal</h2>
                  <p className="text-white/80 text-sm">Set your savings target</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                disabled={isLoading}
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="p-6 min-h-[90vh]">
            {/* Goal Name */}
            <div className="mb-5">
              <label className="text-gray-700 dark:text-neutral-300 mb-2 block">Goal Name</label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g., Wedding Jewellery, Diwali Gold"
                className="text-gray-800 w-full px-4 py-3 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-xl focus:outline-none focus:border-[#3D3066] dark:focus:border-[#8B7FA8]"
                disabled={isLoading}
              />
            </div>

            {/* Category Selection */}
            <div className="mb-5">
              <label className="text-gray-700 dark:text-neutral-300 mb-3 block">Goal Category</label>
              <div className="grid grid-cols-3 gap-3">
                {goalCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id as Goal['category'])}
                    className={`p-4 rounded-xl border-2 transition-all ${category === cat.id
                      ? 'border-[#3D3066] dark:border-[#8B7FA8] bg-purple-50 dark:bg-neutral-700'
                      : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                      }`}
                    disabled={isLoading}
                  >
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <p className="text-xs text-gray-700 dark:text-neutral-300">{cat.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Amount */}
            <div className="mb-5">
              <label className="text-gray-700 dark:text-neutral-300 mb-2 block">Target Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-neutral-400">₹</span>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className=" text-gray-800 w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-xl focus:outline-none focus:border-[#3D3066] dark:focus:border-[#8B7FA8]"
                  min="1000"
                  step="1000"
                  disabled={isLoading}
                />
              </div>

              <p className="text-gray-500 dark:text-neutral-500 text-xs mt-1">
                ≈ {(targetAmount / goldPrice).toFixed(3)} grams at current rate
              </p>
            </div>

            {/* Preset Amounts */}
            <div className="grid grid-cols-4 gap-2 mb-5">
              {[50000, 100000, 250000, 500000].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTargetAmount(amount)}
                  className={`py-2 px-3 rounded-lg text-sm transition-all ${targetAmount === amount
                    ? 'bg-[#3D3066] dark:bg-[#4D3F7F] text-white'
                    : 'bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-600'
                    }`}
                  disabled={isLoading}
                >
                  ₹{amount / 1000}k
                </button>
              ))}
            </div>
            {/* Payment Frequency */}
            <div className="mb-5">
              <label className="text-gray-700 dark:text-neutral-300 mb-2 block">
                Contribution Frequency
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentFrequency('monthly')}
                  className={`flex-1 py-3 rounded-xl border ${paymentFrequency === 'monthly'
                    ? 'bg-[#3D3066] text-white border-[#3D3066]'
                    : 'border-gray-300 dark:border-neutral-600 text-gray-700'
                    }`}
                >
                  Monthly
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentFrequency('yearly')}
                  className={`flex-1 py-3 rounded-xl border ${paymentFrequency === 'yearly'
                    ? 'bg-[#3D3066] text-white border-[#3D3066]'
                    : 'border-gray-300 dark:border-neutral-600  text-gray-700'
                    }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Deadline */}
            <div className="mb-5">
              <label className="text-gray-700 dark:text-neutral-300 mb-2 block">Target Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-neutral-500" />
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="text-gray-800 w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white rounded-xl focus:outline-none focus:border-[#3D3066] dark:focus:border-[#8B7FA8]"
                  disabled={isLoading}
                />
              </div>
            </div>
            {/* Installment Breakdown */}
            <div className="mb-6 bg-[#F4F1FA] dark:bg-neutral-700 rounded-xl p-4 border border-[#E0DAF2] dark:border-neutral-600">
              <p className="text-gray-800 dark:text-white mb-2 font-medium">
                Installment Details
              </p>



              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-neutral-400">
                    Monthly Installment:
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    ₹{getMonthlyAmount().toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </span>
                </div>

                {paymentFrequency === "yearly" && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-neutral-400">
                      Yearly Installment:
                    </span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      ₹{getYearlyAmount().toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                )}
                {(() => {
                  const { months, days } = getTimeLeftBreakdown();

                  return (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-neutral-400">
                        Time Remaining:
                      </span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {months} months {days} days
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>


            {/* Auto-Allocate */}
            <div className="mb-6 p-4 bg-purple-50 dark:bg-neutral-700 border-2 border-dashed border-purple-300 dark:border-neutral-600 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#3D3066] dark:text-[#8B7FA8]" />
                  <p className="text-gray-900 dark:text-white">Auto-Allocate Purchases</p>
                </div>
                <button
                  onClick={() => setAutoAllocate(!autoAllocate)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${autoAllocate ? 'bg-[#3D3066] dark:bg-[#4D3F7F]' : 'bg-gray-300 dark:bg-neutral-600'
                    }`}
                  disabled={isLoading}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white dark:bg-neutral-300 rounded-full transition-transform ${autoAllocate ? 'translate-x-7' : ''
                      }`}
                  />
                </button>
              </div>
              <p className="text-gray-600 dark:text-neutral-400 text-xs">
                Automatically add a portion of your gold purchases to this goal
              </p>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-4 mb-6">
              <p className="text-gray-700 dark:text-neutral-300 text-sm mb-3">Goal Summary</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">Target:</span>
                  <span className="text-gray-900 dark:text-white">₹{targetAmount.toLocaleString()} ({(targetAmount / goldPrice).toFixed(3)}g)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">Deadline:</span>
                  <span className="text-gray-900 dark:text-white">{new Date(deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">Days to achieve:</span>
                  <span className="text-gray-900 dark:text-white">{getDaysLeft(deadline)} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-neutral-400">
                    {paymentFrequency === 'monthly'
                      ? 'Monthly contribution:'
                      : 'Yearly contribution:'}
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    ₹{getInstallmentAmount().toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentMode('view')}
                className="flex-1 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 py-4 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGoal}
                disabled={!goalName || isLoading}
                className="flex-2 bg-gradient-to-r from-[#3D3066] to-[#5C4E7F] dark:from-[#4D3F7F] dark:to-[#5C4E7F] text-white py-4 px-6 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                <span>{isLoading ? 'Creating...' : 'Create Goal'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Goal Detail View
  if (selectedGoal) {
    const progress = getProgress(selectedGoal);
    const milestone = getMilestoneMessage(progress);
    const daysLeft = getDaysLeft(selectedGoal.deadline);
    const remainingAmount = selectedGoal.targetAmount - selectedGoal.currentAmount;

    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-start justify-center z-50 pt-2">


        <style>{`.zold-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .zold-hide-scrollbar::-webkit-scrollbar{ display:none; }`}</style>
        <div className="bg-white dark:bg-neutral-800 w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-y-auto zold-hide-scrollbar ">
          {/* Header */}
          <div className={`sticky top-0 bg-gradient-to-r ${selectedGoal.color} px-6 py-5 rounded-t-3xl`}>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSelectedGoal(null)}
                className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white rotate-180" />
              </button>
              <div className="flex items-center gap-2">
                <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors">
                  <Edit2 className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => handleDeleteGoal(selectedGoal.id)}
                  className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="text-5xl">{selectedGoal.icon}</div>
              <div>
                <h2 className="text-white">{selectedGoal.name}</h2>
                <p className="text-white/80 text-sm">{selectedGoal.category.charAt(0).toUpperCase() + selectedGoal.category.slice(1)} Goal</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <p className="text-gray-700 dark:text-neutral-300">Progress</p>
                <p className={`${milestone.color}`}>{milestone.text}</p>
              </div>
              <div className="relative w-full h-4 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden mb-2">
                <div
                  className={`absolute top-0 left-0 h-full bg-gradient-to-r ${selectedGoal.color} transition-all duration-500`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-neutral-400">{progress.toFixed(1)}% completed</span>
                <span className="text-gray-900 dark:text-white">{selectedGoal.currentGrams.toFixed(3)}g / {selectedGoal.targetGrams.toFixed(3)}g</span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-4">
                <p className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Current Value</p>
                <p className="text-gray-900 dark:text-white text-xl">₹{selectedGoal.currentAmount.toLocaleString()}</p>
                <p className="text-gray-500 dark:text-neutral-500 text-xs mt-1">{selectedGoal.currentGrams.toFixed(3)} grams</p>
              </div>
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-4">
                <p className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Target Value</p>
                <p className="text-gray-900 dark:text-white text-xl">₹{selectedGoal.targetAmount.toLocaleString()}</p>
                <p className="text-gray-500 dark:text-neutral-500 text-xs mt-1">{selectedGoal.targetGrams.toFixed(3)} grams</p>
              </div>
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-4">
                <p className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Remaining</p>
                <p className="text-gray-900 dark:text-white text-xl">₹{remainingAmount.toLocaleString()}</p>
                <p className="text-gray-500 dark:text-neutral-500 text-xs mt-1">{((selectedGoal.targetAmount - selectedGoal.currentAmount) / goldPrice).toFixed(3)} grams</p>
              </div>
              <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-4">
                <p className="text-gray-600 dark:text-neutral-400 text-sm mb-1">Days Left</p>
                <p className="text-gray-900 dark:text-white text-xl">{daysLeft}</p>
                <p className="text-gray-500 dark:text-neutral-500 text-xs mt-1">Until {new Date(selectedGoal.deadline).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Quick Add Money */}
            <div className="mb-6">
              <p className="text-gray-700 dark:text-neutral-300 mb-3">Quick Add Money</p>
              <div className="grid grid-cols-4 gap-2">
                {[1000, 5000, 10000, 25000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAddMoney(selectedGoal.id, amount)}
                    className="bg-[#3D3066] dark:bg-[#4D3F7F] text-white py-3 rounded-xl hover:bg-[#5C4E7F] dark:hover:bg-[#5C4E9F] transition-colors"
                  >
                    ₹{amount / 1000}k
                  </button>
                ))}
              </div>
            </div>

            {/* Auto-Allocate Status */}
            <div className={`p-4 rounded-xl mb-6 ${selectedGoal.autoAllocate ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600'}`}>
              <div className="flex items-center gap-2">
                <Sparkles className={`w-5 h-5 ${selectedGoal.autoAllocate ? 'text-green-600 dark:text-green-500' : 'text-gray-400 dark:text-neutral-500'}`} />
                <div className="flex-1">
                  <p className="text-gray-900 dark:text-white text-sm">Auto-Allocate {selectedGoal.autoAllocate ? 'Active' : 'Inactive'}</p>
                  <p className="text-gray-600 dark:text-neutral-400 text-xs">
                    {selectedGoal.autoAllocate
                      ? 'Purchases are automatically allocated to this goal'
                      : 'Enable to auto-allocate purchases'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  onBuyGold?.();
                  onClose();
                }}
                className="flex-1 bg-gradient-to-r from-[#3D3066] to-[#5C4E7F] dark:from-[#4D3F7F] dark:to-[#5C4E7F] text-white py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Coins className="w-5 h-5" />
                <span>Buy Gold for Goal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main View - Goals List
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-start justify-center z-50 pt-2 rounded-b-[2rem]2">


      <style>{`.zold-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .zold-hide-scrollbar::-webkit-scrollbar{ display:none; }`}</style>
      <div className="bg-white dark:bg-neutral-800 w-full max-w-lg rounded-t-3xl min-h-[95vh] overflow-y-auto zold-hide-scrollbar rounded-b-[2rem]">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#3D3066] to-[#5C4E7F] px-6 py-5 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white">My Gold Goals</h2>
                <p className="text-white/80 text-sm">{goals.length} active goals</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Create New Goal Button */}
          <button
            onClick={() => setCurrentMode('create')}
            className="w-full bg-gradient-to-r from-[#3D3066] to-[#5C4E7F] dark:from-[#4D3F7F] dark:to-[#5C4E7F] text-white p-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 mb-6"
          >
            <Plus className="w-5 h-5" />
            <span>Create New Goal</span>
          </button>

          {/* Goals List */}
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = getProgress(goal);
              const milestone = getMilestoneMessage(progress);
              const daysLeft = getDaysLeft(goal.deadline);

              return (
                <button
                  key={goal.id}
                  onClick={() => setSelectedGoal(goal)}
                  className="w-full bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-neutral-700 rounded-xl p-4 hover:border-[#3D3066] dark:hover:border-[#8B7FA8] hover:shadow-lg dark:hover:shadow-neutral-900/50 transition-all text-left"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`bg-gradient-to-br ${goal.color} text-white rounded-xl p-3 text-2xl`}>
                      {goal.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className={`text-xs ${milestone.color} flex-shrink-0`}>{progress.toFixed(0)}%</span>
                      </div>
                      <p className="text-gray-600 dark:text-neutral-400 text-sm mb-2">{goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}</p>

                      {/* Progress Bar */}
                      <div className="relative w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-full overflow-hidden mb-2">
                        <div
                          className={`absolute top-0 left-0 h-full bg-gradient-to-r ${goal.color} transition-all duration-500`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-neutral-400">
                          ₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}
                        </span>
                        <span className="text-gray-500 dark:text-neutral-500">
                          {daysLeft} days left
                        </span>
                      </div>
                    </div>
                  </div>

                  {goal.autoAllocate && (
                    <div className="flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs text-green-700 dark:text-green-400 w-fit">
                      <Sparkles className="w-3 h-3" />
                      <span>Auto-allocate active</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Empty State */}
          {goals.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-gray-900 dark:text-white mb-2">No Goals Yet</h3>
              <p className="text-gray-600 dark:text-neutral-400 text-sm mb-6">
                Create your first gold savings goal and start your journey!
              </p>
              <button
                onClick={() => setCurrentMode('create')}
                className="bg-gradient-to-r from-[#3D3066] to-[#5C4E7F] dark:from-[#4D3F7F] dark:to-[#5C4E7F] text-white px-6 py-3 rounded-xl hover:opacity-90 transition-all"
              >
                Create Your First Goal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}