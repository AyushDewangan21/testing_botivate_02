import { useState, useEffect } from 'react';
import { Gift, Copy, Share2, Users, Coins, CheckCircle, X, Twitter, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getAuthHeaders } from '../lib/auth';

interface ReferralProgramProps {
  onClose: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export function ReferralProgram({ onClose }: ReferralProgramProps) {
  const [copied, setCopied] = useState(false);
  const [referralData, setReferralData] = useState({
    referralCode: 'LOADING...',
    totalReferrals: 0,
    totalEarned: 0,
    pendingReferrals: 0,
    history: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReferralStats();
  }, []);

  const fetchReferralStats = async () => {
    try {
      const response = await fetch(`${API_URL}/referrals/stats`, {
        headers: getAuthHeaders() as HeadersInit,
      });
      const data = await response.json();
      if (data.success) {
        setReferralData({
          referralCode: data.data.referralCode || 'N/A',
          totalReferrals: data.data.stats.totalReferrals,
          totalEarned: data.data.stats.totalEarned,
          pendingReferrals: data.data.stats.pendingReferrals,
          history: data.data.history
        });
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const referralLink = `https://zold.app/ref/${referralData.referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaWhatsApp = () => {
    const message = `Join ZOLD - India's best digital gold platform! Use my code ${referralData.referralCode} and get ₹100 bonus. ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareViaTwitter = () => {
    const message = `Investing in digital gold made easy with @ZoldApp! Use my code ${referralData.referralCode} to get started. ${referralLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-start justify-center z-50 pt-2">
      <style>{`.zold-hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .zold-hide-scrollbar::-webkit-scrollbar{ display:none; }`}</style>
      <div className="bg-gray-50 dark:bg-neutral-800 w-full max-w-lg rounded-t-3xl max-h-[95vh] overflow-y-auto zold-hide-scrollbar rounded-b-[2rem]">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-5 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gray-50/20 backdrop-blur-sm rounded-full p-2">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-white">Referral Program</h2>
                <p className="text-white/80 text-sm">Earn ₹100 per referral</p>
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
          {/* Earnings Summary */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-gradient-to-br from-[#3D3066] to-[#5C4E7F] dark:from-[#4D3F7F] dark:to-[#5C4E7F] rounded-xl p-4 text-white">
              <Users className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-white/80 text-xs mb-1">Total Referrals</p>
              <p className="text-xl">{loading ? '-' : referralData.totalReferrals}</p>
            </div>
            <div className="bg-gradient-to-br from-[#D4AF37] to-[#F4D03F] dark:from-[#B8860B] dark:to-[#D4AF37] rounded-xl p-4 text-white">
              <Coins className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-white/80 text-xs mb-1">Total Earned</p>
              <p className="text-xl">₹{loading ? '-' : referralData.totalEarned}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-400 to-orange-500 dark:from-orange-500 dark:to-orange-600 rounded-xl p-4 text-white">
              <Gift className="w-5 h-5 mb-2 text-white/80" />
              <p className="text-white/80 text-xs mb-1">Pending</p>
              <p className="text-xl">{loading ? '-' : referralData.pendingReferrals}</p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gray-50 dark:bg-neutral-700 rounded-xl p-5 mb-6">
            <h3 className="text-gray-900 dark:text-white mb-3">How it works</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-[#3D3066] dark:bg-[#4D3F7F] text-white rounded-full flex items-center justify-center text-sm">1</div>
                <div>
                  <p className="text-gray-900 dark:text-white text-sm">Share your unique referral code</p>
                  <p className="text-gray-500 dark:text-neutral-400 text-xs mt-1">Send to friends via WhatsApp, Twitter, or any platform</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-[#3D3066] dark:bg-[#4D3F7F] text-white rounded-full flex items-center justify-center text-sm">2</div>
                <div>
                  <p className="text-gray-900 dark:text-white text-sm">Friend signs up & buys gold</p>
                  <p className="text-gray-500 dark:text-neutral-400 text-xs mt-1">They get ₹50 bonus, you get ₹100 gold credit</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-[#3D3066] dark:bg-[#4D3F7F] text-white rounded-full flex items-center justify-center text-sm">3</div>
                <div>
                  <p className="text-gray-900 dark:text-white text-sm">Get rewarded instantly</p>
                  <p className="text-gray-500 dark:text-neutral-400 text-xs mt-1">Bonus added to your wallet automatically</p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Code */}
          <div className="mb-6">
            <h3 className="text-gray-900 dark:text-white mb-3">Your Referral Code</h3>
            <div className="bg-gray-50 dark:bg-neutral-800 border-2 border-dashed border-[#3D3066] dark:border-[#8B7FA8] rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-gray-500 dark:text-neutral-400 text-xs mb-1">Your unique code</p>
                  <div className="flex items-center gap-2">
                    {loading ? (
                      <div className="h-6 w-24 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded"></div>
                    ) : (
                      <p className="text-[#3D3066] dark:text-[#8B7FA8] text-xl tracking-wider font-bold">{referralData.referralCode}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="bg-[#3D3066] dark:bg-[#4D3F7F] text-white px-4 py-2 rounded-lg hover:bg-[#5C4E7F] dark:hover:bg-[#5C4E9F] transition-colors flex items-center gap-2"
                  disabled={loading}
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-neutral-700">
                <p className="text-gray-500 dark:text-neutral-400 text-xs mb-2">Share link</p>
                <p className="text-gray-700 dark:text-neutral-300 text-sm break-all">{loading ? 'Loading...' : referralLink}</p>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="mb-6">
            <h3 className="text-gray-900 dark:text-white mb-3">Share via</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={shareViaWhatsApp}
                className="bg-green-500 text-white p-4 rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                disabled={loading}
              >
                <MessageCircle className="w-5 h-5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={shareViaTwitter}
                className="bg-blue-400 text-white p-4 rounded-xl hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                disabled={loading}
              >
                <Twitter className="w-5 h-5" />
                <span>Twitter</span>
              </button>
              <button
                onClick={copyToClipboard}
                className="bg-gray-700 dark:bg-neutral-700 text-white p-4 rounded-xl hover:bg-gray-800 dark:hover:bg-neutral-600 transition-colors flex items-center justify-center gap-2"
                disabled={loading}
              >
                <Copy className="w-5 h-5" />
                <span>Copy Link</span>
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Join ZOLD',
                      text: `Use my code ${referralData.referralCode} to get ₹50 bonus!`,
                      url: referralLink,
                    });
                  }
                }}
                className="bg-[#3D3066] dark:bg-[#4D3F7F] text-white p-4 rounded-xl hover:bg-[#5C4E7F] dark:hover:bg-[#5C4E9F] transition-colors flex items-center justify-center gap-2"
                disabled={loading}
              >
                <Share2 className="w-5 h-5" />
                <span>More</span>
              </button>
            </div>
          </div>

          {/* Referral History */}
          <div>
            <h3 className="text-gray-900 dark:text-white mb-3">Recent Referrals</h3>
            {loading ? (
              <div className="text-center py-4 text-gray-400">Loading history...</div>
            ) : referralData.history.length === 0 ? (
              <div className="text-center py-4 bg-gray-50 dark:bg-neutral-700 rounded-xl text-gray-500 dark:text-neutral-400">
                No referrals yet. Share your code to start earning!
              </div>
            ) : (
              <div className="space-y-3">
                {referralData.history.map((referral, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-900 dark:text-white">{referral.name}</p>
                      {referral.status === 'completed' ? (
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </span>
                      ) : (
                        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs px-2 py-1 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <p className="text-gray-500 dark:text-neutral-400">{referral.date}</p>
                      {referral.status === 'completed' && (
                        <p className="text-green-600 dark:text-green-500">+₹{referral.earning}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Terms */}
          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <p className="text-yellow-800 dark:text-yellow-300 text-xs">
              <strong>Terms & Conditions:</strong> Referral bonus will be credited after the referred user completes their first gold purchase of minimum ₹500. Bonus expires after 90 days if not used.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}