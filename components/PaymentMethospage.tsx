"use client";

import {
  ArrowLeft,
  Building,
  Calendar,
  Check,
  CreditCard,
  Edit2,
  Loader2,
  Lock,
  Plus,
  Radio,
  Save,
  Trash2,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentMethod {
  id: string;
  type: "card" | "netbanking" | "wallet";
  name: string;
  lastFour?: string;
  expiryDate?: string;
  bankName?: string;
  walletName?: string;
  isDefault: boolean;
  verified: boolean;
}

interface PaymentMethodsPageProps {
  user: any;
  onClose: () => void;
  isOpen: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export function PaymentMethodsPage({
  user,
  onClose,
  isOpen,
}: PaymentMethodsPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [paymentType, setPaymentType] = useState<
    "card" | "netbanking" | "wallet"
  >("card");
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    bankName: "",
    walletName: "",
    cardholderName: "",
  });

  const getAuthToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/payment-methods`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success && data.data) {
        // Handle both array and object response formats for backward compatibility
        const methods = Array.isArray(data.data)
          ? data.data
          : data.data.paymentMethods || [];

        const transformed = methods.map((m: any) => ({
          id: m.id,
          type: m.type?.toLowerCase() as "card" | "netbanking" | "wallet",
          name:
            m.type === "CARD"
              ? m.provider || "Card"
              : m.type === "NETBANKING"
                ? m.provider || "Net Banking"
                : m.type === "WALLET"
                  ? m.provider || "Wallet"
                  : m.provider || m.type,
          lastFour: m.cardLast4,
          expiryDate:
            m.expiryMonth && m.expiryYear
              ? `${String(m.expiryMonth).padStart(2, "0")}/${String(m.expiryYear).slice(-2)}`
              : undefined,
          bankName: m.provider,
          walletName: m.provider,
          isDefault: m.isPrimary,
          verified: true,
        }));
        setPaymentMethods(transformed);
      }
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPaymentMethods();
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewPaymentMethod = async () => {
    // Validation based on payment type
    if (paymentType === "card") {
      if (
        !formData.cardNumber ||
        !formData.expiryMonth ||
        !formData.expiryYear ||
        !formData.cvv
      ) {
        alert("Please fill in all card details");
        return;
      }
    } else if (paymentType === "netbanking") {
      if (!formData.bankName) {
        alert("Please select bank");
        return;
      }
    } else if (paymentType === "wallet") {
      if (!formData.walletName) {
        alert("Please enter wallet name");
        return;
      }
    }

    try {
      const token = getAuthToken();
      if (!token) return;

      let apiData: any = {
        type: paymentType.toUpperCase(),
      };

      switch (paymentType) {
        case "card":
          apiData = {
            ...apiData,
            cardLast4: formData.cardNumber.slice(-4),
            cardNetwork: "VISA",
            expiryMonth: parseInt(formData.expiryMonth),
            expiryYear: parseInt(formData.expiryYear),
            provider: formData.name || "Card",
          };
          break;
        case "netbanking":
          apiData = {
            ...apiData,
            provider: formData.bankName,
          };
          break;
        case "wallet":
          apiData = {
            ...apiData,
            provider: formData.walletName,
          };
          break;
      }

      const response = await fetch(`${API_URL}/payment-methods`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchPaymentMethods();
        resetForm();
        setIsAddingNew(false);
      } else {
        alert(data.message || "Failed to add payment method");
      }
    } catch (error) {
      console.error("Error adding payment method:", error);
      alert("Error adding payment method");
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(
        `${API_URL}/payment-methods/${paymentMethodId}/set-primary`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();
      if (data.success) {
        await fetchPaymentMethods();
      } else {
        alert(data.message || "Failed to set default");
      }
    } catch (error) {
      console.error("Error setting default:", error);
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    const method = paymentMethods.find((m) => m.id === paymentMethodId);
    if (method?.isDefault) {
      alert(
        "Cannot delete default payment method. Please set another method as default first.",
      );
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(
        `${API_URL}/payment-methods/${paymentMethodId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();
      if (data.success) {
        await fetchPaymentMethods();
      } else {
        alert(data.message || "Failed to delete payment method");
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
    }
  };

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
    setPaymentType(method.type);

    if (method.type === "card") {
      setFormData({
        name: method.name,
        cardNumber: `**** **** **** ${method.lastFour}`,
        expiryMonth: method.expiryDate?.split("/")[0] || "",
        expiryYear: method.expiryDate?.split("/")[1] || "",
        cvv: "",
        bankName: "",
        walletName: "",
        cardholderName: user?.name || "",
      });
    } else if (method.type === "netbanking") {
      setFormData({
        name: "",
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        bankName: method.bankName || "",
        walletName: "",
        cardholderName: "",
      });
    } else if (method.type === "wallet") {
      setFormData({
        name: "",
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        bankName: "",
        walletName: method.walletName || "",
        cardholderName: "",
      });
    }

    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedPaymentMethod) return;

    let updatedMethod: PaymentMethod = { ...selectedPaymentMethod };

    switch (paymentType) {
      case "card":
        updatedMethod = {
          ...updatedMethod,
          name: formData.name || updatedMethod.name,
          lastFour: formData.cardNumber.slice(-4),
          expiryDate: `${formData.expiryMonth}/${formData.expiryYear.slice(-2)}`,
        };
        break;
      case "netbanking":
        updatedMethod = {
          ...updatedMethod,
          name: formData.bankName,
          bankName: formData.bankName,
        };
        break;
      case "wallet":
        updatedMethod = {
          ...updatedMethod,
          name: formData.walletName,
          walletName: formData.walletName,
        };
        break;
    }

    setPaymentMethods((methods) =>
      methods.map((method) =>
        method.id === selectedPaymentMethod.id ? updatedMethod : method,
      ),
    );
    resetEdit();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      bankName: "",
      walletName: "",
      cardholderName: user?.name || "",
    });
    setPaymentType("card");
  };

  const resetEdit = () => {
    setIsEditing(false);
    setSelectedPaymentMethod(null);
    resetForm();
  };

  const handleCancelEdit = () => {
    resetEdit();
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5" />;
      case "netbanking":
        return <Building className="h-5 w-5" />;
      case "wallet":
        return <Wallet className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const getPaymentMethodColor = (type: string) => {
    switch (type) {
      case "card":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "netbanking":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "wallet":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getPaymentMethodLabel = (type: string) => {
    switch (type) {
      case "card":
        return "Credit/Debit Card";
      case "netbanking":
        return "Net Banking";
      case "wallet":
        return "Wallet";
      default:
        return type;
    }
  };

  const banks = [
    "HDFC Bank",
    "ICICI Bank",
    "State Bank of India",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "IndusInd Bank",
  ];

  const wallets = [
    "Paytm",
    "PhonePe",
    "Google Pay",
    "Amazon Pay",
    "MobiKwik",
    "Freecharge",
    "Airtel Money",
    "JioMoney",
  ];

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
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md transform overflow-y-auto bg-gray-50 shadow-2xl transition-all duration-300 ease-in-out dark:bg-neutral-900 ${isOpen ? "translate-x-0" : "translate-x-full"} `}
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
                Payment Methods
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Manage your payment options
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
                onClick={
                  isAddingNew ? () => setIsAddingNew(false) : handleCancelEdit
                }
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={
                  isAddingNew ? handleAddNewPaymentMethod : handleSaveEdit
                }
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                <Save className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Security Info */}
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
            <div className="flex items-start gap-3">
              <Lock className="mt-0.5 h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  Secure Payment Processing
                </p>
                <p className="mt-1 text-sm text-green-700 dark:text-green-400/80">
                  All payment methods are encrypted and stored securely. Your
                  card details are never stored on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {(isAddingNew || isEditing) && (
            <div className="mb-6 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {isEditing ? "Edit Payment Method" : "Add New Payment Method"}
              </h3>

              {/* Payment Type Selection */}
              {!isEditing && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                    Select Payment Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentType("card")}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors ${paymentType === "card"
                          ? "border-[#3D3066] bg-[#3D3066]/10 dark:border-[#8B7FA8] dark:bg-[#3D3066]/20"
                          : "border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                        }`}
                    >
                      <div
                        className={`rounded-full p-2 ${paymentType === "card"
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-400"
                          }`}
                      >
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <span
                        className={`text-xs font-medium ${paymentType === "card"
                            ? "text-[#3D3066] dark:text-[#8B7FA8]"
                            : "text-gray-700 dark:text-neutral-300"
                          }`}
                      >
                        Card
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentType("netbanking")}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors ${paymentType === "netbanking"
                          ? "border-[#3D3066] bg-[#3D3066]/10 dark:border-[#8B7FA8] dark:bg-[#3D3066]/20"
                          : "border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                        }`}
                    >
                      <div
                        className={`rounded-full p-2 ${paymentType === "netbanking"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-400"
                          }`}
                      >
                        <Building className="h-5 w-5" />
                      </div>
                      <span
                        className={`text-xs font-medium ${paymentType === "netbanking"
                            ? "text-[#3D3066] dark:text-[#8B7FA8]"
                            : "text-gray-700 dark:text-neutral-300"
                          }`}
                      >
                        Net Banking
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentType("wallet")}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-colors ${paymentType === "wallet"
                          ? "border-[#3D3066] bg-[#3D3066]/10 dark:border-[#8B7FA8] dark:bg-[#3D3066]/20"
                          : "border-gray-300 bg-gray-50 hover:border-gray-400 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600"
                        }`}
                    >
                      <div
                        className={`rounded-full p-2 ${paymentType === "wallet"
                            ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                            : "bg-gray-100 text-gray-600 dark:bg-neutral-700 dark:text-neutral-400"
                          }`}
                      >
                        <Wallet className="h-5 w-5" />
                      </div>
                      <span
                        className={`text-xs font-medium ${paymentType === "wallet"
                            ? "text-[#3D3066] dark:text-[#8B7FA8]"
                            : "text-gray-700 dark:text-neutral-300"
                          }`}
                      >
                        Wallet
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic Form based on payment type */}
              <div className="space-y-4">
                {paymentType === "card" && (
                  <>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                        Card Number *
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        maxLength={19}
                        placeholder="1234 5678 9012 3456"
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                          Expiry Month *
                        </label>
                        <input
                          type="text"
                          name="expiryMonth"
                          value={formData.expiryMonth}
                          onChange={handleInputChange}
                          maxLength={2}
                          placeholder="MM"
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                          Expiry Year *
                        </label>
                        <input
                          type="text"
                          name="expiryYear"
                          value={formData.expiryYear}
                          onChange={handleInputChange}
                          maxLength={4}
                          placeholder="YYYY"
                          className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                        CVV *
                      </label>
                      <input
                        type="password"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        maxLength={4}
                        placeholder="***"
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleInputChange}
                        placeholder="Name on card"
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                        Nickname (Optional)
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., My Primary Card"
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder-neutral-500 dark:focus:border-[#8B7FA8]"
                      />
                    </div>
                  </>
                )}

                {paymentType === "netbanking" && (
                  <>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                        Select Bank *
                      </label>
                      <select
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#8B7FA8]"
                      >
                        <option value="">Select a bank</option>
                        {banks.map((bank) => (
                          <option key={bank} value={bank}>
                            {bank}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {paymentType === "wallet" && (
                  <>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-neutral-300">
                        Select Wallet *
                      </label>
                      <select
                        name="walletName"
                        value={formData.walletName}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-[#3D3066] focus:ring-2 focus:ring-[#3D3066]/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:focus:border-[#8B7FA8]"
                      >
                        <option value="">Select a wallet</option>
                        {wallets.map((wallet) => (
                          <option key={wallet} value={wallet}>
                            {wallet}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Payment Methods List */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Saved Payment Methods ({paymentMethods.length})
            </h3>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl border border-gray-200 p-4 dark:border-neutral-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-neutral-700" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 rounded bg-gray-200 dark:bg-neutral-700" />
                        <div className="h-3 w-32 rounded bg-gray-200 dark:bg-neutral-700" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : paymentMethods.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center dark:border-neutral-700">
                <CreditCard className="mx-auto h-12 w-12 text-gray-400 dark:text-neutral-500" />
                <p className="mt-2 text-gray-600 dark:text-neutral-400">
                  No payment methods added yet
                </p>
                <button
                  onClick={() => setIsAddingNew(true)}
                  className="mt-4 rounded-lg bg-[#3D3066] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
                >
                  Add Your First Payment Method
                </button>
              </div>
            ) : (
              paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`rounded-xl border p-4 transition-all ${method.isDefault
                      ? "border-[#3D3066] bg-[#3D3066]/5 dark:border-[#8B7FA8] dark:bg-[#3D3066]/10"
                      : "border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-800/50"
                    }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <div
                          className={`rounded-full p-1.5 ${getPaymentMethodColor(method.type)}`}
                        >
                          {getPaymentMethodIcon(method.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {method.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPaymentMethodColor(method.type)}`}
                            >
                              {getPaymentMethodLabel(method.type)}
                            </span>
                            {method.isDefault && (
                              <span className="rounded-full bg-[#3D3066] px-2 py-0.5 text-xs text-white dark:bg-[#8B7FA8]">
                                Default
                              </span>
                            )}
                            {method.verified ? (
                              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                <Check className="mr-1 inline h-3 w-3" />
                                Verified
                              </span>
                            ) : (
                              <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                Pending
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {method.type === "card" && (
                          <>
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-gray-400 dark:text-neutral-500" />
                              <span className="font-mono text-gray-900 dark:text-white">
                                **** **** **** {method.lastFour}
                              </span>
                            </div>
                            {method.expiryDate && (
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-400 dark:text-neutral-500" />
                                <span className="text-sm text-gray-600 dark:text-neutral-400">
                                  Expires {method.expiryDate}
                                </span>
                              </div>
                            )}
                          </>
                        )}

                        {method.type === "netbanking" && method.bankName && (
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-400 dark:text-neutral-500" />
                            <span className="text-gray-900 dark:text-white">
                              {method.bankName}
                            </span>
                          </div>
                        )}

                        {method.type === "wallet" && method.walletName && (
                          <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-gray-400 dark:text-neutral-500" />
                            <span className="text-gray-900 dark:text-white">
                              {method.walletName} Wallet
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col gap-2">
                      <div className="flex gap-1">
                        {method.type !== "netbanking" && (
                          <button
                            onClick={() => handleEditPaymentMethod(method)}
                            className="rounded p-2 hover:bg-gray-100 dark:hover:bg-neutral-700"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4 text-gray-600 dark:text-neutral-400" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePaymentMethod(method.id)}
                          className="rounded p-2 hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>

                      {!method.isDefault && (
                        <button
                          onClick={() => handleSetDefault(method.id)}
                          className="rounded-lg border border-[#3D3066] px-3 py-1 text-xs font-medium text-[#3D3066] transition-colors hover:bg-[#3D3066]/10 dark:border-[#8B7FA8] dark:text-[#8B7FA8] dark:hover:bg-[#8B7FA8]/10"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-8 rounded-lg border border-gray-200 p-4 dark:border-neutral-800">
            <h4 className="mb-2 flex items-center gap-2 font-medium text-gray-900 dark:text-white">
              <Lock className="h-4 w-4" />
              Payment Security
            </h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-neutral-400">
              <li>• All transactions are encrypted with 256-bit SSL</li>
              <li>• Card details are tokenized for security</li>
              <li>• No CVV or full card numbers are stored</li>
              <li>• Regular security audits and compliance checks</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
