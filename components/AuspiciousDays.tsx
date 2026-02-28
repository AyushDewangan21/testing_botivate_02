import { useState } from 'react';
import { Calendar, Star, Bell, Coins, TrendingDown, X, Check, ChevronRight, Clock, Sparkles, Gift } from 'lucide-react';
import { toast } from 'sonner';

interface AuspiciousDaysProps {
  onClose: () => void;
}

export function AuspiciousDays({ onClose }: AuspiciousDaysProps) {
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [autoBuyAmount, setAutoBuyAmount] = useState(5000);
  const [enableAutoBuy, setEnableAutoBuy] = useState(false);
  const [activeTab, setActiveTab] = useState<'monthly' | 'festivals'>('monthly');

  const auspiciousDays = [
    {
      id: 1,
      name: 'Akshaya Tritiya',
      date: '2025-04-30',
      month: 'April',
      day: 30,
      significance: 'Most auspicious day to buy gold. Believed to bring prosperity and good fortune.',
      discount: 15,
      benefits: ['0% making charges', '15% off on all gold purchases', 'Free storage for 1 year', 'Extra 0.5g bonus on 10g+'],
      image: '🪔',
      color: 'from-yellow-500 to-orange-500',
      status: 'upcoming',
      type: 'festival'
    },
    {
      id: 2,
      name: 'Dhanteras',
      date: '2025-10-29',
      month: 'October',
      day: 29,
      significance: 'Festival of wealth. Buying gold on this day is considered highly auspicious.',
      discount: 12,
      benefits: ['0% making charges', '12% cashback', 'Free coin on every purchase', 'Lucky draw entry'],
      image: '🎆',
      color: 'from-orange-500 to-red-500',
      status: 'upcoming',
      type: 'festival'
    },
    {
      id: 3,
      name: 'Diwali',
      date: '2025-11-01',
      month: 'November',
      day: 1,
      significance: 'Festival of lights and prosperity. Ideal time for gold investment.',
      discount: 10,
      benefits: ['10% instant discount', 'Free delivery', 'Gift vouchers worth ₹500', 'Priority jewellery conversion'],
      image: '🪔',
      color: 'from-purple-500 to-pink-500',
      status: 'upcoming',
      type: 'festival'
    },
    {
      id: 4,
      name: 'Gudi Padwa',
      date: '2025-03-30',
      month: 'March',
      day: 30,
      significance: 'Marathi and Konkani New Year. Auspicious for new beginnings.',
      discount: 8,
      benefits: ['8% off on gold', 'Free insurance for 6 months', 'Referral bonus 2x', 'Early bird offers'],
      image: '🎊',
      color: 'from-green-500 to-teal-500',
      status: 'upcoming',
      type: 'festival'
    },
    {
      id: 5,
      name: 'Ugadi',
      date: '2025-03-30',
      month: 'March',
      day: 30,
      significance: 'Telugu and Kannada New Year. Perfect for gold purchases.',
      discount: 8,
      benefits: ['8% discount', 'Free storage', 'Bonus gold on SIP', 'Special partner offers'],
      image: '🌸',
      color: 'from-pink-500 to-rose-500',
      status: 'upcoming',
      type: 'festival'
    },
    {
      id: 6,
      name: 'Navratri (Day 1)',
      date: '2025-09-22',
      month: 'September',
      day: 22,
      significance: '9-day festival celebrating divine feminine. Auspicious for investments.',
      discount: 5,
      benefits: ['5% off daily', 'Special Navratri offers', 'Buy today, pay later', 'Gold coins giveaway'],
      image: '🕉️',
      color: 'from-red-500 to-orange-500',
      status: 'upcoming',
      type: 'festival'
    },
    {
      id: 7,
      name: 'Makar Sankranti',
      date: '2026-01-14',
      month: 'January',
      day: 14,
      significance: 'Harvest festival. Traditional time for gold buying.',
      discount: 6,
      benefits: ['6% cashback', 'Free gold coin', 'No transaction fees', 'Festival special rates'],
      image: '🪁',
      color: 'from-blue-500 to-cyan-500',
      status: 'upcoming',
      type: 'festival'
    },
    // Monthly Auspicious Days (Pushya Nakshatra & Shubh Muhurat)
    {
      id: 101,
      name: 'Pushya Nakshatra',
      date: '2024-12-17',
      month: 'December',
      day: 17,
      significance: 'Most auspicious nakshatra for wealth accumulation and gold purchases.',
      discount: 5,
      benefits: ['5% instant discount', 'Free storage for 3 months', 'Auto-buy available', 'Special muhurat timing'],
      image: '⭐',
      color: 'from-indigo-500 to-purple-500',
      status: 'upcoming',
      type: 'monthly'
    },
    {
      id: 102,
      name: 'Shubh Muhurat',
      date: '2025-01-04',
      month: 'January',
      day: 4,
      significance: 'Highly favorable time for starting new investments and buying gold.',
      discount: 4,
      benefits: ['4% off on gold', 'No processing fees', 'Free delivery', 'Extended auto-buy slots'],
      image: '🌟',
      color: 'from-amber-500 to-yellow-500',
      status: 'upcoming',
      type: 'monthly'
    },
    {
      id: 103,
      name: 'Pushya Nakshatra',
      date: '2025-01-13',
      month: 'January',
      day: 13,
      significance: 'Most auspicious nakshatra for wealth accumulation and gold purchases.',
      discount: 5,
      benefits: ['5% instant discount', 'Free storage for 3 months', 'Auto-buy available', 'Special muhurat timing'],
      image: '⭐',
      color: 'from-indigo-500 to-purple-500',
      status: 'upcoming',
      type: 'monthly'
    },
    {
      id: 104,
      name: 'Shubh Muhurat',
      date: '2025-02-09',
      month: 'February',
      day: 9,
      significance: 'Highly favorable time for starting new investments and buying gold.',
      discount: 4,
      benefits: ['4% off on gold', 'No processing fees', 'Free delivery', 'Extended auto-buy slots'],
      image: '🌟',
      color: 'from-amber-500 to-yellow-500',
      status: 'upcoming',
      type: 'monthly'
    },
    {
      id: 105,
      name: 'Pushya Nakshatra',
      date: '2025-02-10',
      month: 'February',
      day: 10,
      significance: 'Most auspicious nakshatra for wealth accumulation and gold purchases.',
      discount: 5,
      benefits: ['5% instant discount', 'Free storage for 3 months', 'Auto-buy available', 'Special muhurat timing'],
      image: '⭐',
      color: 'from-indigo-500 to-purple-500',
      status: 'upcoming',
      type: 'monthly'
    },
    {
      id: 106,
      name: 'Shubh Muhurat',
      date: '2025-03-08',
      month: 'March',
      day: 8,
      significance: 'Highly favorable time for starting new investments and buying gold.',
      discount: 4,
      benefits: ['4% off on gold', 'No processing fees', 'Free delivery', 'Extended auto-buy slots'],
      image: '🌟',
      color: 'from-amber-500 to-yellow-500',
      status: 'upcoming',
      type: 'monthly'
    },
    {
      id: 107,
      name: 'Pushya Nakshatra',
      date: '2025-03-09',
      month: 'March',
      day: 9,
      significance: 'Most auspicious nakshatra for wealth accumulation and gold purchases.',
      discount: 5,
      benefits: ['5% instant discount', 'Free storage for 3 months', 'Auto-buy available', 'Special muhurat timing'],
      image: '⭐',
      color: 'from-indigo-500 to-purple-500',
      status: 'upcoming',
      type: 'monthly'
    },
    {
      id: 108,
      name: 'Shubh Muhurat',
      date: '2025-04-05',
      month: 'April',
      day: 5,
      significance: 'Highly favorable time for starting new investments and buying gold.',
      discount: 4,
      benefits: ['4% off on gold', 'No processing fees', 'Free delivery', 'Extended auto-buy slots'],
      image: '🌟',
      color: 'from-amber-500 to-yellow-500',
      status: 'upcoming',
      type: 'monthly'
    },
    {
      id: 109,
      name: 'Pushya Nakshatra',
      date: '2025-05-03',
      month: 'May',
      day: 3,
      significance: 'Most auspicious nakshatra for wealth accumulation and gold purchases.',
      discount: 5,
      benefits: ['5% instant discount', 'Free storage for 3 months', 'Auto-buy available', 'Special muhurat timing'],
      image: '⭐',
      color: 'from-indigo-500 to-purple-500',
      status: 'upcoming',
      type: 'monthly'
    },
    {
      id: 110,
      name: 'Shubh Muhurat',
      date: '2025-05-30',
      month: 'May',
      day: 30,
      significance: 'Highly favorable time for starting new investments and buying gold.',
      discount: 4,
      benefits: ['4% off on gold', 'No processing fees', 'Free delivery', 'Extended auto-buy slots'],
      image: '🌟',
      color: 'from-amber-500 to-yellow-500',
      status: 'upcoming',
      type: 'monthly'
    },
    {
      id: 111,
      name: 'Pushya Nakshatra',
      date: '2025-06-27',
      month: 'June',
      day: 27,
      significance: 'Most auspicious nakshatra for wealth accumulation and gold purchases.',
      discount: 5,
      benefits: ['5% instant discount', 'Free storage for 3 months', 'Auto-buy available', 'Special muhurat timing'],
      image: '⭐',
      color: 'from-indigo-500 to-purple-500',
      status: 'upcoming',
      type: 'monthly'
    },
  ];

  const handleSetAutoBuy = () => {
    if (!selectedDay) return;

    setEnableAutoBuy(true);
    toast.success(`Auto-buy scheduled for ${selectedDay.name}! ₹${autoBuyAmount} will be auto-invested.`);
  };

  const getDaysUntil = (dateStr: string) => {
    const eventDate = new Date(dateStr);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (selectedDay) {
    return (
      <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-end justify-center z-50">
        <div className="bg-gray-50 dark:bg-neutral-800 w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className={`sticky top-0 bg-gradient-to-r ${selectedDay.color} px-6 py-5 rounded-t-3xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-5xl">{selectedDay.image}</div>
                <div>
                  <h2 className="text-white">{selectedDay.name}</h2>
                  <p className="text-white/80 text-sm">{selectedDay.month} {selectedDay.day}, 2025</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="bg-gray-50/20 backdrop-blur-sm rounded-full p-2 hover:bg-gray-50/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Days Until */}
            <div className="bg-gradient-to-br from-[#3D3066] to-[#5C4E7F] dark:from-[#4D3F7F] dark:to-[#5C4E9F] rounded-2xl p-5 mb-6 text-white text-center">
              <p className="text-white/80 text-sm mb-1">Countdown</p>
              <p className="text-4xl mb-1">{getDaysUntil(selectedDay.date)}</p>
              <p className="text-white/90 text-sm">days remaining</p>
            </div>

            {/* Significance */}
            <div className="mb-6">
              <h3 className="text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#D4AF37]" />
                Significance
              </h3>
              <p className="text-gray-600 dark:text-neutral-400 text-sm">{selectedDay.significance}</p>
            </div>

            {/* Special Offer */}
            <div className={`bg-gradient-to-br ${selectedDay.color} rounded-2xl p-5 mb-6 text-white`}>
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-6 h-6" />
                <h3>Special Offer</h3>
              </div>
              <p className="text-3xl mb-2">{selectedDay.discount}% OFF</p>
              <p className="text-white/90 text-sm">Exclusive discount on this auspicious day</p>
            </div>

            {/* Benefits */}
            <div className="mb-6">
              <h3 className="text-gray-900 dark:text-white mb-3">Special Benefits</h3>
              <div className="space-y-2">
                {selectedDay.benefits.map((benefit: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-neutral-300 text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-Buy Setup */}
            <div className="bg-gray-50 dark:bg-neutral-700 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-[#3D3066] dark:text-[#8B7FA8]" />
                <h3 className="text-gray-900 dark:text-white">Setup Auto-Buy</h3>
              </div>

              <p className="text-gray-600 dark:text-neutral-400 text-sm mb-4">
                Automatically purchase gold on {selectedDay.name} at the best rates. Set it and forget it!
              </p>

              {/* Amount Selection */}
              <div className="mb-4">
                <label className="text-gray-700 dark:text-neutral-300 text-sm mb-2 block">Auto-Buy Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-neutral-500">₹</span>
                  <input
                    type="number"
                    value={autoBuyAmount}
                    onChange={(e) => setAutoBuyAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white rounded-xl focus:outline-none focus:border-[#3D3066] dark:focus:border-[#8B7FA8]"
                    min="500"
                    step="100"
                  />
                </div>
                <p className="text-gray-500 dark:text-neutral-500 text-xs mt-1">
                  Approx. {(autoBuyAmount / 6245.50).toFixed(3)} grams at current rate
                </p>
              </div>

              {/* Preset Amounts */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[1000, 2500, 5000, 10000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setAutoBuyAmount(amount)}
                    className={`py-2 px-3 rounded-lg text-sm transition-all ${autoBuyAmount === amount
                      ? 'bg-[#3D3066] dark:bg-[#4D3F7F] text-white'
                      : 'bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:border-[#3D3066] dark:hover:border-[#8B7FA8]'
                      }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              {/* Auto-Buy Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg border-2 border-dashed border-[#3D3066] dark:border-[#8B7FA8]">
                <div>
                  <p className="text-gray-900 dark:text-white text-sm">Enable Auto-Buy</p>
                  <p className="text-gray-500 dark:text-neutral-500 text-xs">Purchase automatically on the day</p>
                </div>
                <button
                  onClick={() => setEnableAutoBuy(!enableAutoBuy)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${enableAutoBuy ? 'bg-[#3D3066] dark:bg-[#4D3F7F]' : 'bg-gray-300 dark:bg-neutral-600'
                    }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-gray-50 dark:bg-neutral-300 rounded-full transition-transform ${enableAutoBuy ? 'translate-x-7' : ''
                      }`}
                  />
                </button>
              </div>
            </div>

            {/* Notification Reminder */}
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-900 dark:text-blue-300 text-sm mb-1">Get Notified</p>
                  <p className="text-blue-700 dark:text-blue-400 text-xs">
                    We'll send you a reminder 1 day before {selectedDay.name} with special offers and muhurat timings.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedDay(null)}
                className="flex-1 bg-gray-100 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 py-4 rounded-xl hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSetAutoBuy}
                className={`flex-2 bg-gradient-to-r ${selectedDay.color} text-white py-4 px-6 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2`}
              >
                <Check className="w-5 h-5" />
                <span>Schedule Auto-Buy</span>
              </button>
            </div>

            {enableAutoBuy && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl">
                <div className="flex items-center gap-2 text-green-800 dark:text-green-300">
                  <Check className="w-5 h-5" />
                  <p className="text-sm">
                    Auto-buy scheduled! ₹{autoBuyAmount} will be invested on {selectedDay.name}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-end justify-center z-50">
      <div className="bg-gray-50 dark:bg-neutral-800 w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] px-6 py-5 rounded-t-3xl z-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 ">
              <div className="bg-gray-50/20 backdrop-blur-sm rounded-full p-2">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white">Auspicious Days</h2>
                <p className="text-white/80 text-sm">शुभ मुहूर्त for Gold Purchase</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-50/20 backdrop-blur-sm rounded-full p-2 hover:bg-gray-50/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Info Banner */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-purple-900 dark:text-purple-300 text-sm mb-1">Smart Gold Buying</p>
                <p className="text-purple-700 dark:text-purple-400 text-xs">
                  Schedule auto-buy on auspicious days and get exclusive discounts + bonuses automatically!
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setActiveTab('monthly')}
              className={`py-2 px-4 rounded-lg text-sm transition-all ${activeTab === 'monthly'
                ? 'bg-[#3D3066] dark:bg-[#4D3F7F] text-white'
                : 'bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:border-[#3D3066] dark:hover:border-[#8B7FA8]'
                }`}
            >
              Monthly Auspicious Days
            </button>
            <button
              onClick={() => setActiveTab('festivals')}
              className={`py-2 px-4 rounded-lg text-sm transition-all ${activeTab === 'festivals'
                ? 'bg-[#3D3066] dark:bg-[#4D3F7F] text-white'
                : 'bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-700 dark:text-neutral-300 hover:border-[#3D3066] dark:hover:border-[#8B7FA8]'
                }`}
            >
              Festival Days
            </button>
          </div>

          {/* Upcoming Days */}
          <div className="mb-4">
            <h3 className="text-gray-900 dark:text-white mb-3">Upcoming Auspicious Days</h3>
            <div className="space-y-3">
              {auspiciousDays
                .filter(day => day.type === activeTab)
                .map((day) => (
                  <button
                    key={day.id}
                    onClick={() => setSelectedDay(day)}
                    className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 hover:border-[#3D3066] dark:hover:border-[#8B7FA8] hover:shadow-md dark:hover:shadow-neutral-900/50 transition-all text-left"
                  >
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className={`bg-gradient-to-br ${day.color} text-white rounded-xl px-4 py-3 text-center flex-shrink-0`}>
                        <p className="text-2xl mb-1">{day.image}</p>
                        <p className="text-xs opacity-80">{day.month}</p>
                        <p className="text-xl">{day.day}</p>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-gray-900 dark:text-white">{day.name}</h4>
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full flex-shrink-0">
                            {day.discount}% OFF
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-neutral-400 text-xs mb-2 line-clamp-2">{day.significance}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-500">
                            <Clock className="w-3 h-3" />
                            <span>{getDaysUntil(day.date)} days left</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 dark:text-neutral-600" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Why Buy on Auspicious Days */}
          <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-5 mb-4">
            <h3 className="text-gray-900 dark:text-white mb-3">Why Buy Gold on Shubh Muhurat?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 dark:text-white text-sm mb-1">Traditional Auspiciousness</p>
                  <p className="text-gray-600 dark:text-neutral-400 text-xs">Buying gold on these days is believed to bring prosperity and good fortune</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 dark:text-white text-sm mb-1">Exclusive Discounts</p>
                  <p className="text-gray-600 dark:text-neutral-400 text-xs">Get special offers and discounts available only on auspicious days</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Coins className="w-5 h-5 text-[#3D3066] dark:text-[#8B7FA8] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-900 dark:text-white text-sm mb-1">Auto-Buy Convenience</p>
                  <p className="text-gray-600 dark:text-neutral-400 text-xs">Set once and let ZOLD automatically buy gold on the special day</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}