import { useState } from "react";
import {
  Calendar,
  Target,
  TrendingUp,
  ChevronLeft,
  Pause,
  Play,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Clock,
  CheckCircle,
  X,
  AlertTriangle,
} from "lucide-react";
import { ZoldLogoHorizontal } from "@/components/ZoldLogo";

interface SIP {
  id: number;
  name: string;
  amount: number;
  frequency: "daily" | "weekly" | "monthly";
  dayOfMonth: number;
  nextDate: string;
  status: "active" | "paused" | "completed";
  startDate: string;
  goldAccumulated: number;
  totalInvested: number;
}

interface ManageSIPPageProps {
  onClose: () => void;
}

export function ManageSIPPage({ onClose }: ManageSIPPageProps) {
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSIP, setSelectedSIP] = useState<SIP | null>(null);

  // Mock SIP data - now state
  const [activeSIPs, setActiveSIPs] = useState<SIP[]>([
    {
      id: 1,
      name: "Regular Gold SIP",
      amount: 5000,
      frequency: "monthly",
      dayOfMonth: 25,
      nextDate: "2025-12-25",
      status: "active",
      startDate: "2025-01-15",
      goldAccumulated: 8.125,
      totalInvested: 55000,
    },
    {
      id: 2,
      name: "Weekly Gold Builder",
      amount: 1000,
      frequency: "weekly",
      dayOfMonth: 1,
      nextDate: "2025-12-15",
      status: "active",
      startDate: "2025-11-01",
      goldAccumulated: 0.325,
      totalInvested: 5000,
    },
  ]);

  const [sipHistory, setSipHistory] = useState<SIP[]>([
    {
      id: 3,
      name: "Festive Gold SIP",
      amount: 3000,
      frequency: "monthly",
      dayOfMonth: 10,
      nextDate: "2025-08-10",
      status: "completed",
      startDate: "2024-06-10",
      goldAccumulated: 5.75,
      totalInvested: 45000,
    },
    {
      id: 4,
      name: "Daily Gold Plan",
      amount: 100,
      frequency: "daily",
      dayOfMonth: 0,
      nextDate: "2025-09-15",
      status: "paused",
      startDate: "2025-07-01",
      goldAccumulated: 0.85,
      totalInvested: 7500,
    },
  ]);

  // Form states
  const [newSIP, setNewSIP] = useState<Partial<SIP>>({
    name: "",
    amount: 1000,
    frequency: "monthly",
    startDate: new Date().toISOString().split('T')[0],
  });

  const handleCreateSIP = () => {
    if (!newSIP.name || !newSIP.amount) return;

    const sip: SIP = {
      id: Math.max(...activeSIPs.map((s) => s.id), ...sipHistory.map((s) => s.id), 0) + 1,
      name: newSIP.name,
      amount: newSIP.amount,
      frequency: newSIP.frequency as "daily" | "weekly" | "monthly" || "monthly",
      dayOfMonth: new Date(newSIP.startDate || Date.now()).getDate(),
      nextDate: newSIP.startDate || new Date().toISOString().split('T')[0],
      status: "active",
      startDate: newSIP.startDate || new Date().toISOString().split('T')[0],
      goldAccumulated: 0,
      totalInvested: 0,
    };

    setActiveSIPs([...activeSIPs, sip]);
    setShowCreateModal(false);
    setNewSIP({
      name: "",
      amount: 1000,
      frequency: "monthly",
      startDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleEditSIP = (sip: SIP) => {
    setSelectedSIP({ ...sip }); // Create a copy to avoid direct mutation
    setShowEditModal(true);
  };

  const handleUpdateSIP = () => {
    if (!selectedSIP) return;

    setActiveSIPs(
      activeSIPs.map((sip) => (sip.id === selectedSIP.id ? selectedSIP : sip))
    );
    setShowEditModal(false);
    setSelectedSIP(null);
  };

  const handlePauseSIP = (sip: SIP) => {
    setSelectedSIP(sip);
    setShowPauseModal(true);
  };

  const handlePauseSIPConfirm = () => {
    if (!selectedSIP) return;

    const updatedStatus = selectedSIP.status === "active" ? "paused" : "active";

    // Update in active list directly for toggle
    const updatedList = activeSIPs.map(s =>
      s.id === selectedSIP.id ? { ...s, status: updatedStatus } : s
    );

    // If it was in history (paused) and we are activating it, we might want to move it back to active? 
    // For now assuming we only pause active SIPs based on UI buttons.
    // If we are pausing, we keep it in active list but status changes. 

    setActiveSIPs(updatedList as SIP[]);
    setShowPauseModal(false);
    setSelectedSIP(null);
  };

  const handleDeleteSIP = (sip: SIP) => {
    setSelectedSIP(sip);
    setShowDeleteModal(true);
  };

  const handleCancelSIPConfirm = () => {
    if (!selectedSIP) return;

    const cancelledSIP = { ...selectedSIP, status: "completed" as const };

    setActiveSIPs(activeSIPs.filter((s) => s.id !== selectedSIP.id));
    setSipHistory([cancelledSIP, ...sipHistory]);

    setShowDeleteModal(false);
    setSelectedSIP(null);
  };

  const getStatusColor = (status: SIP["status"]) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30";
      case "paused":
        return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30";
      case "completed":
        return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/30";
    }
  };

  const getStatusIcon = (status: SIP["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "paused":
        return <Pause className="h-4 w-4" />;
      case "completed":
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatFrequency = (frequency: SIP["frequency"]) => {
    switch (frequency) {
      case "daily":
        return "Daily";
      case "weekly":
        return "Weekly";
      case "monthly":
        return "Monthly";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-50 dark:bg-neutral-900 dark:text-gray-100">
      {/* Header */}
      <div className="rounded-b-3xl bg-gradient-to-br from-[#3D3066] via-[#5C4E7F] to-[#8B7FA8] px-6 pt-6 pb-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm">Back to Wallet</span>
          </button>
          <img src="02.png" alt="zold logo" className="h-16 rounded-xl" />
        </div>

        <div className="text-center text-white">
          <h1 className="mb-2 text-2xl font-semibold">Manage Your SIPs</h1>
          <p className="text-white/80">
            Systematic Investment Plans for Gold
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-gray-50/10 p-4 backdrop-blur-md dark:bg-gray-50/5">
            <p className="mb-1 text-sm text-white/70">Active SIPs</p>
            <p className="text-xl font-semibold text-white">
              {activeSIPs.length}
            </p>
            <p className="mt-1 text-xs text-white/80">
              Total: ₹{activeSIPs.reduce((sum, sip) => sum + sip.amount, 0).toLocaleString()}/mo
            </p>
          </div>
          <div className="rounded-xl bg-gray-50/10 p-4 backdrop-blur-md dark:bg-gray-50/5">
            <p className="mb-1 text-sm text-white/70">Gold Accumulated</p>
            <p className="text-xl font-semibold text-white">
              {activeSIPs.reduce((sum, sip) => sum + sip.goldAccumulated, 0).toFixed(3)} gm
            </p>
            <p className="mt-1 text-xs text-white/80">
              From SIPs
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Tabs */}
        <div className="-mt-4 mb-6">
          <div className="flex rounded-t-xl bg-gray-50 p-1 dark:bg-neutral-800">
            <button
              onClick={() => setActiveTab("active")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${activeTab === "active"
                ? "bg-[#3D3066] text-white dark:bg-[#4D3F7F]"
                : "text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                }`}
            >
              Active SIPs ({activeSIPs.length})
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${activeTab === "history"
                ? "bg-[#3D3066] text-white dark:bg-[#4D3F7F]"
                : "text-gray-600 hover:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                }`}
            >
              History ({sipHistory.length})
            </button>
          </div>
        </div>

        {/* Create SIP Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 text-white transition-transform hover:scale-[1.02] dark:from-purple-600 dark:to-pink-600"
        >
          <Plus className="h-5 w-5" />
          Create New SIP
        </button>

        {/* SIP Cards */}
        <div className="space-y-4">
          {(activeTab === "active" ? activeSIPs : sipHistory).map((sip) => (
            <div
              key={sip.id}
              className="overflow-hidden rounded-2xl bg-gray-50 shadow-lg dark:bg-neutral-800 dark:shadow-neutral-900/50"
            >
              <div className="p-5">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {sip.name}
                      </h3>
                      <span
                        className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${getStatusColor(
                          sip.status
                        )}`}
                      >
                        {getStatusIcon(sip.status)}
                        {sip.status.charAt(0).toUpperCase() + sip.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      Started on {new Date(sip.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      ₹{sip.amount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-neutral-400">
                      {formatFrequency(sip.frequency)}
                    </p>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="mb-4 grid grid-cols-2 gap-3 rounded-lg bg-gray-50 p-3 dark:bg-neutral-700">
                  <div>
                    <p className="mb-1 text-xs text-gray-500 dark:text-neutral-500">
                      Next Deduction
                    </p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-[#3D3066] dark:text-[#8B7FA8]" />
                      <p className="text-sm text-gray-900 dark:text-white">
                        {new Date(sip.nextDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-gray-500 dark:text-neutral-500">
                      Gold Accumulated
                    </p>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-[#3D3066] dark:text-[#8B7FA8]" />
                      <p className="text-sm text-gray-900 dark:text-white">
                        {sip.goldAccumulated.toFixed(3)} gm
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-gray-500 dark:text-neutral-500">
                      Total Invested
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      ₹{sip.totalInvested.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-gray-500 dark:text-neutral-500">
                      Avg. Price/Gram
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      ₹{(sip.totalInvested / sip.goldAccumulated).toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {activeTab === "active" && (sip.status === "active" || sip.status === "paused") && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSIP(sip)}
                      className="flex-1 rounded-lg border border-[#3D3066] px-4 py-2 text-sm text-[#3D3066] hover:bg-[#3D3066] hover:text-white dark:border-[#8B7FA8] dark:text-[#8B7FA8] dark:hover:bg-[#8B7FA8] dark:hover:text-white"
                    >
                      <Edit2 className="mr-2 inline h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handlePauseSIP(sip)}
                      className="flex-1 rounded-lg border border-yellow-500 px-4 py-2 text-sm text-yellow-600 hover:bg-yellow-500 hover:text-white dark:border-yellow-600 dark:text-yellow-400 dark:hover:bg-yellow-600"
                    >
                      {sip.status === "paused" ? (
                        <>
                          <Play className="mr-2 inline h-4 w-4" />
                          Resume
                        </>
                      ) : (
                        <>
                          <Pause className="mr-2 inline h-4 w-4" />
                          Pause
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteSIP(sip)}
                      className="flex-1 rounded-lg border border-red-500 px-4 py-2 text-sm text-red-600 hover:bg-red-500 hover:text-white dark:border-red-600 dark:text-red-400 dark:hover:bg-red-600"
                    >
                      <Trash2 className="mr-2 inline h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Educational Section */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 dark:from-blue-900/30 dark:to-indigo-900/30">
          <div className="mb-3 flex items-start gap-3">
            <TrendingUp className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h4 className="mb-1 font-medium text-gray-900 dark:text-white">
                Benefits of Gold SIP
              </h4>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-neutral-400">
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  Rupee cost averaging reduces market timing risk
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  Disciplined approach to gold investment
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  Start with as low as ₹100 per day
                </li>
              </ul>
            </div>
          </div>
          <button className="mt-3 w-full rounded-lg border border-blue-600 px-4 py-2 text-sm text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white">
            Learn More About Gold SIP
          </button>
        </div>
      </div>

      {/* Create SIP Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-gray-50 p-6 dark:bg-neutral-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New SIP
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Add form fields for creating SIP here */}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-700 dark:text-neutral-300">
                  SIP Name
                </label>
                <input
                  type="text"
                  value={newSIP.name}
                  onChange={(e) => setNewSIP({ ...newSIP, name: e.target.value })}
                  className="text-black w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                  placeholder="e.g., Monthly Gold Savings"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-700 dark:text-neutral-300">
                  Investment Amount (₹)
                </label>
                <input
                  type="number"
                  value={newSIP.amount}
                  onChange={(e) => setNewSIP({ ...newSIP, amount: Number(e.target.value) })}
                  className="text-black w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                  placeholder="e.g., 5000"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-700 dark:text-neutral-300">
                  Frequency
                </label>
                <select
                  value={newSIP.frequency}
                  onChange={(e) => setNewSIP({ ...newSIP, frequency: e.target.value as any })}
                  className="text-black w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-700 dark:text-neutral-300">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newSIP.startDate}
                  onChange={(e) => setNewSIP({ ...newSIP, startDate: e.target.value })}
                  className="text-black w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSIP}
                className="flex-1 rounded-lg bg-[#3D3066] px-4 py-2 text-white hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E7F]"
              >
                Create SIP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit SIP Modal */}
      {showEditModal && selectedSIP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-gray-50 p-6 dark:bg-neutral-800">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit SIP
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-700 dark:text-neutral-300">
                  SIP Name
                </label>
                <input
                  type="text"
                  value={selectedSIP.name}
                  onChange={(e) => setSelectedSIP({ ...selectedSIP, name: e.target.value })}
                  className="text-black w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-700 dark:text-neutral-300">
                  Investment Amount (₹)
                </label>
                <input
                  type="number"
                  value={selectedSIP.amount}
                  onChange={(e) => setSelectedSIP({ ...selectedSIP, amount: Number(e.target.value) })}
                  className="text-black w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-700 dark:text-neutral-300">
                  Frequency
                </label>
                <select
                  value={selectedSIP.frequency}
                  onChange={(e) => setSelectedSIP({ ...selectedSIP, frequency: e.target.value as any })}
                  className="text-black w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-700 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSIP}
                className="flex-1 rounded-lg bg-[#3D3066] px-4 py-2 text-white hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E7F]"
              >
                Update SIP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pause SIP Modal */}
      {showPauseModal && selectedSIP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-gray-50 p-6 dark:bg-neutral-800">
            <div className="mb-4 text-center">
              <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-yellow-500" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Pause SIP
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Are you sure you want to pause "{selectedSIP.name}"?
                <br />
                You can resume it anytime.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPauseModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={handlePauseSIPConfirm}
                className="flex-1 rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
              >
                {selectedSIP.status === 'paused' ? 'Resume SIP' : 'Pause SIP'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete SIP Modal */}
      {showDeleteModal && selectedSIP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-gray-50 p-6 dark:bg-neutral-800">
            <div className="mb-4 text-center">
              <AlertCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Cancel SIP
              </h3>
              <p className="text-sm text-gray-600 dark:text-neutral-400">
                Are you sure you want to cancel "{selectedSIP.name}"?
                <br />
                This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-neutral-400 dark:hover:bg-neutral-700"
              >
                Keep SIP
              </button>
              <button
                onClick={handleCancelSIPConfirm}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Cancel SIP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}