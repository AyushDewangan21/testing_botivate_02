"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Copy,
  Check,
  Building,
  CreditCard,
  User
} from "lucide-react";

interface BankAccount {
  id: string;
  accountNumber: string;
  accountHolderName: string;
  bankName: string;
  ifscCode: string;
  accountType: string;
  isPrimary: boolean;
  isVerified: boolean;
  branch?: string;
}

interface BankAccountsPageProps {
  user: any;
  onClose: () => void;
  isOpen: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export function BankAccountsPage({ user, onClose, isOpen }: BankAccountsPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<BankAccount | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);

  const [formData, setFormData] = useState({
    accountNumber: "",
    accountHolderName: "",
    bankName: "",
    ifscCode: "",
    accountType: "SAVINGS",
    branch: ""
  });

  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };

  const fetchBankAccounts = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/bank-accounts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      if (data.success) {
        setBankAccounts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchBankAccounts();
    }
  }, [isOpen]);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAddNewAccount = async () => {
    if (!formData.accountNumber || !formData.bankName || !formData.ifscCode || !formData.accountHolderName) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/bank-accounts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        await fetchBankAccounts();
        setFormData({
          accountNumber: "",
          accountHolderName: "",
          bankName: "",
          ifscCode: "",
          accountType: "SAVINGS",
          branch: ""
        });
        setIsAddingNew(false);
      } else {
        alert(data.message || 'Failed to add account');
      }
    } catch (error) {
      console.error('Error adding account:', error);
      alert('Error adding bank account');
    }
  };

  const handleSetPrimary = async (accountId: string) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/bank-accounts/${accountId}/set-primary`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        await fetchBankAccounts();
      } else {
        alert(data.message || 'Failed to set primary account');
      }
    } catch (error) {
      console.error('Error setting primary:', error);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    const account = bankAccounts.find(acc => acc.id === accountId);
    if (account?.isPrimary) {
      alert("Cannot delete primary account. Please set another account as primary first.");
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/bank-accounts/${accountId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) {
        await fetchBankAccounts();
      } else {
        alert(data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const handleEditAccount = (account: BankAccount) => {
    setSelectedAccount(account);
    setFormData({
      accountNumber: account.accountNumber,
      accountHolderName: account.accountHolderName,
      bankName: account.bankName,
      ifscCode: account.ifscCode,
      accountType: account.accountType,
      branch: account.branch || ""
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedAccount) return;

    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/bank-accounts/${selectedAccount.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        await fetchBankAccounts();
        setIsEditing(false);
        setSelectedAccount(null);
        setFormData({
          accountNumber: "",
          accountHolderName: "",
          bankName: "",
          ifscCode: "",
          accountType: "SAVINGS",
          branch: ""
        });
      } else {
        alert(data.message || 'Failed to update account');
      }
    } catch (error) {
      console.error('Error updating account:', error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedAccount(null);
    setFormData({
      accountNumber: "",
      accountHolderName: "",
      bankName: "",
      ifscCode: "",
      accountType: "SAVINGS",
      branch: ""
    });
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "savings":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "current":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "salary":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Side Panel */}
      <div
        className={`
          fixed inset-y-0 right-0 z-50 w-full max-w-md transform overflow-y-auto bg-gray-50 shadow-2xl
          transition-all duration-300 ease-in-out dark:bg-neutral-900
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-black dark:text-white" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Bank Accounts
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Manage your linked bank accounts
              </p>
            </div>
          </div>

          {!isAddingNew && !isEditing && (
            <button
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-2 rounded-lg bg-[#3D3066] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
            >
              <Plus className="h-4 w-4" />
              Add New
            </button>
          )}

          {(isAddingNew || isEditing) && (
            <div className="flex gap-2">
              <button
                onClick={isAddingNew ? () => setIsAddingNew(false) : handleCancelEdit}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={isAddingNew ? handleAddNewAccount : handleSaveEdit}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Info Message */}
          <div className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Your bank accounts are securely encrypted. Primary account is used for all transactions by default.
            </p>
          </div>

          {/* Add/Edit Form */}
          {(isAddingNew || isEditing) && (
            <div className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {isEditing ? "Edit Bank Account" : "Add New Bank Account"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Bank Name *
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                    placeholder="Enter bank name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                    placeholder="Enter account holder name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Account Number *
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                    placeholder="Enter account number"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    name="ifscCode"
                    value={formData.ifscCode}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                    placeholder="Enter IFSC code"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Account Type
                  </label>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#8B7FA8]"
                  >
                    <option value="savings">Savings Account</option>
                    <option value="current">Current Account</option>
                    <option value="salary">Salary Account</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Bank Accounts List */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Linked Accounts ({bankAccounts.length})
            </h3>

            {bankAccounts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-neutral-700">
                <Building className="mx-auto h-12 w-12 text-gray-400 dark:text-neutral-500" />
                <p className="mt-2 text-gray-600 dark:text-neutral-400">
                  No bank accounts added yet
                </p>
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="mt-4 rounded-lg bg-[#3D3066] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
                >
                  Add Your First Account
                </button>
              </div>
            ) : (
              bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className={`rounded-xl border p-4 transition-all ${account.isPrimary
                      ? "border-[#3D3066] bg-[#3D3066]/5 dark:border-[#8B7FA8] dark:bg-[#3D3066]/10"
                      : "border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/50"
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Building className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {account.bankName}
                        </h4>
                        {account.isPrimary && (
                          <span className="rounded-full bg-[#3D3066] px-2 py-0.5 text-xs text-white dark:bg-[#8B7FA8]">
                            Primary
                          </span>
                        )}
                        {account.isVerified ? (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Verified
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                            Pending
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-neutral-400">
                            Account Number
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-gray-900 dark:text-white">
                              {account.accountNumber}
                            </span>
                            <button
                              onClick={() => handleCopyToClipboard(account.accountNumber, `acc-${account.id}`)}
                              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-neutral-700"
                            >
                              {copiedField === `acc-${account.id}` ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-neutral-400">
                            Account Holder
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {account.accountHolderName}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-neutral-400">
                            IFSC Code
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-gray-900 dark:text-white">
                              {account.ifscCode}
                            </span>
                            <button
                              onClick={() => handleCopyToClipboard(account.ifscCode, `ifsc-${account.id}`)}
                              className="rounded p-1 hover:bg-gray-100 dark:hover:bg-neutral-700"
                            >
                              {copiedField === `ifsc-${account.id}` ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-neutral-400">
                            Account Type
                          </span>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getAccountTypeColor(account.accountType)}`}>
                            {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      {!account.isPrimary && (
                        <button
                          onClick={() => handleSetPrimary(account.id)}
                          className="rounded-lg border border-[#3D3066] px-3 py-1 text-xs font-medium text-[#3D3066] transition-colors hover:bg-[#3D3066]/10 dark:border-[#8B7FA8] dark:text-[#8B7FA8] dark:hover:bg-[#8B7FA8]/10"
                        >
                          Set Primary
                        </button>
                      )}
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEditAccount(account)}
                          className="rounded p-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
                        >
                          <Edit2 className="h-4 w-4 text-gray-600 dark:text-neutral-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteAccount(account.id)}
                          className="rounded p-2 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Security Note */}
          <div className="mt-8 rounded-lg border border-gray-200 p-4 dark:border-neutral-800">
            <h4 className="mb-2 flex items-center gap-2 font-medium text-gray-900 dark:text-white">
              <CreditCard className="h-4 w-4" />
              Security Information
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-neutral-400">
              <li>• Bank details are encrypted and stored securely</li>
              <li>• Only last 4 digits of account numbers are shown</li>
              <li>• You can have one primary account at a time</li>
              <li>• Verification may take 1-2 business days</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}