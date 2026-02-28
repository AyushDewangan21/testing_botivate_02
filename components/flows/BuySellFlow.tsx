"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import MetalAnimatedBackground from "../MetalAnimatedBackground";
import {
    X,
    Coins,
    CheckCircle,
    Info,
    Sparkles,
    Clock,
    Wallet as WalletIcon,
    Plus,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Shield,
    CreditCard,
    ArrowLeft,
} from "lucide-react";
import { io, Socket } from "socket.io-client";
import router from "next/router";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api";

// ─────────────────────────────────────────
//  Types
// ─────────────────────────────────────────
type Metal = "gold" | "silver";
type Action = "buy" | "sell";
type BuyStep = "amount" | "checkout" | "success";
type SellStep = "amount" | "checkout" | "success";
type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

interface Transaction {
    id: string;
    goldGrams: number;
    ratePerGram: number;
    totalAmount: number;
    gst: number;
    finalAmount: number;
    status: string;
    createdAt: string;
}

interface BuySellFlowProps {
    onClose: () => void;
    /** Which metal to open on by default */
    defaultMetal?: Metal;
    /** Which action (buy/sell) to open on by default */
    defaultAction?: Action;
}

// ─────────────────────────────────────────
//  Silver placeholder prices (mock)
// ─────────────────────────────────────────
const SILVER_BUY_PRICE = 89.5;
const SILVER_SELL_PRICE = 87.0;

// ─────────────────────────────────────────
//  Helper
// ─────────────────────────────────────────
function getAuthToken() {
    if (typeof window !== "undefined") return localStorage.getItem("token");
    return null;
}

function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

// ══════════════════════════════════════════════════════
//  CHECKOUT panel (shared for Buy & Sell)
// ══════════════════════════════════════════════════════
function CheckoutPanel({
    metal,
    grams,
    amount,
    gstRate,
    onClose,
    onConfirm,
    onBack,
    isProcessing,
}: {
    metal: "gold" | "silver";
    grams: number;
    amount: number;
    gstRate: number;
    onClose: () => void;
    onConfirm: (paymentMethod: PaymentMethod) => Promise<void>;
    onBack: () => void;
    isProcessing: boolean;
}) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
    const [upiId, setUpiId] = useState("");
    const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
    const [processing, setProcessing] = useState(false);
    const [copiedUpi, setCopiedUpi] = useState(false);

    const [selectedBank, setSelectedBank] = useState("");
    const isGold = metal === "gold";
    const accentColor = isGold ? "#EEC762" : "#9EA8B7";
    const gst = (amount * gstRate) / 100;
    const totalAmount = amount + gst;

    const upiApps = [
        { id: "gpay", name: "Google Pay", color: "#4285F4", letter: "G" },
        { id: "phonepe", name: "PhonePe", color: "#5F259F", letter: "P" },
        { id: "paytm", name: "Paytm", color: "#00BAF2", letter: "P" },
        { id: "bharatpe", name: "BharatPe", color: "#E63B2E", letter: "B" },
    ];

    const handleConfirm = async () => {
        setProcessing(true);
        await onConfirm(paymentMethod);
        setProcessing(false);
    };

    const copyUpi = () => {
        navigator.clipboard.writeText(upiId || "9876543210@okhdfcbank");
        setCopiedUpi(true);
        setTimeout(() => setCopiedUpi(false), 2000);
    };

    return (
        <div>
            {/* Order Summary */}
            <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:rounded-2xl sm:p-6 dark:border-neutral-700 dark:bg-neutral-800">
                <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
                    Order Summary
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-neutral-400">
                            {isGold ? "Gold" : "Silver"} ({grams.toFixed(3)}g)
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                            ₹{amount.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-neutral-400">
                            GST ({gstRate}%)
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                            ₹{gst.toFixed(2)}
                        </span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 dark:border-neutral-700">
                        <div className="flex justify-between">
                            <span className="font-bold text-gray-900 dark:text-white">
                                Total Amount
                            </span>
                            <span
                                className="text-lg font-bold"
                                style={{ color: accentColor }}
                            >
                                ₹{totalAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Method Selection */}
            <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:rounded-2xl sm:p-6 dark:border-neutral-700 dark:bg-neutral-800">
                <h3 className="mb-4 text-sm font-bold text-gray-900 dark:text-white">
                    Choose Payment Method
                </h3>

                {/* UPI */}
                <div className="mb-4">
                    <button
                        onClick={() => setPaymentMethod("upi")}
                        className={`w-full rounded-lg border-2 p-3 text-left transition-all ${paymentMethod === "upi"
                            ? "border-[#B8960C] bg-[#B8960C]/10"
                            : "border-gray-200"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white"
                                style={{ backgroundColor: "#4285F4" }}
                            >
                                U
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    UPI
                                </p>
                                <p className="text-xs text-gray-500 dark:text-neutral-400">
                                    Google Pay, PhonePe, Paytm
                                </p>
                            </div>
                        </div>
                    </button>

                    {paymentMethod === "upi" && (
                        <div className="mt-3 space-y-3 rounded-lg border border-gray-100 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 dark:text-neutral-400">
                                    UPI Apps
                                </label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {upiApps.map((app) => (
                                        <button
                                            key={app.id}
                                            onClick={() => setSelectedUpiApp(app.id)}
                                            className={`rounded-lg px-3 py-2 text-xs font-semibold transition-all ${selectedUpiApp === app.id
                                                ? "text-white"
                                                : "bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300"
                                                }`}
                                            style={{
                                                backgroundColor:
                                                    selectedUpiApp === app.id ? app.color : undefined,
                                            }}
                                        >
                                            {app.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 dark:text-neutral-400">
                                    Or Enter UPI ID
                                </label>
                                <div className="relative mt-2">
                                    <input
                                        type="text"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        placeholder="user@okhdfcbank"
                                        className="text-gray-700 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                                    />
                                    <button
                                        onClick={copyUpi}
                                        className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-neutral-500"
                                    >
                                        {copiedUpi ? "✓" : <CreditCard size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                /* Net Banking */
                <div className="mb-4 text-black">
                    <button
                        onClick={() => setPaymentMethod("netbanking")}
                        className={`w-full rounded-lg border-2 p-3 text-left transition-all ${paymentMethod === "netbanking"
                            ? "border-[#B8960C] bg-[#B8960C]/10"
                            : "border-gray-200"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white"
                                style={{ backgroundColor: "#367AFF" }}
                            >
                                🏦
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                    Net Banking
                                </p>
                                <p className="text-xs text-gray-500 dark:text-neutral-400">
                                    All major banks
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Dropdown - Show only if Netbanking selected */}
                    {paymentMethod === "netbanking" && (
                        <div className="mt-3">
                            <select
                                className="w-full rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-sm focus:border-yellow-50 focus:outline-none focus:ring-2 focus:ring-[#B8960C]/30 dark:bg-neutral-800 dark:border-neutral-600 dark:text-white"
                                value={selectedBank}
                                onChange={(e) => setSelectedBank(e.target.value)}
                            >
                                <option value="">Select Your Bank</option>
                                <option value="sbi">State Bank of India</option>
                                <option value="hdfc">HDFC Bank</option>
                                <option value="icici">ICICI Bank</option>
                                <option value="axis">Axis Bank</option>
                                <option value="kotak">Kotak Mahindra Bank</option>
                                <option value="pnb">Punjab National Bank</option>
                                <option value="bob">Bank of Baroda</option>
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {/* Security Info */}
            <div className="mb-6 rounded-lg bg-blue-50 p-3 sm:rounded-xl sm:p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-start gap-2 sm:gap-3">
                    <Shield className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 sm:h-5 sm:w-5 dark:text-blue-400" />
                    <div className="text-xs sm:text-sm">
                        <p className="mb-1 font-semibold text-blue-900 dark:text-blue-300">
                            Your payment is secure
                        </p>
                        <p className="text-blue-700 dark:text-blue-400">
                            All transactions are encrypted and verified by payment gateway
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:gap-4">
                <button
                    onClick={handleConfirm}
                    disabled={processing || isProcessing}
                    className="w-full rounded-lg py-3.5 text-base font-bold text-[#1a1a2e] shadow-lg transition-all hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:py-4 sm:text-lg"
                    style={{ backgroundColor: accentColor }}
                >
                    {processing ? "Processing..." : `Pay ₹${totalAmount.toFixed(2)}`}
                </button>
                <button
                    onClick={onBack}
                    disabled={processing || isProcessing}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70 sm:py-4 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                    Back
                </button>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════
//  BUY panel (shared for Gold & Silver)
// ══════════════════════════════════════════════════════
function BuyPanel({
    metal,
    buyPrice,
    walletBalance,
    onAddCredits,
    loading,
    transactions,
    onBuy,
    onClose,
    onViewWallet,
}: {
    metal: Metal;
    buyPrice: number;
    walletBalance: number;
    onAddCredits: () => void;
    loading: boolean;
    transactions: Transaction[];
    onBuy: (inr: number, grams: number) => Promise<boolean>;
    onClose: () => void;
    onViewWallet: () => void;
}) {
    const [targetAmount, setTargetAmount] = useState(1000);
    const [targetGrams, setTargetGrams] = useState(1000 / buyPrice);
    const handleAmountChange = (amount: number) => {
        setTargetAmount(amount);
        setTargetGrams(amount / buyPrice);
    };

    const handleGramsChange = (grams: number) => {
        setTargetGrams(grams);
        setTargetAmount(grams * buyPrice);
    };

    const handleSwap = () => {
        const a = targetAmount;
        const g = targetGrams;
        setTargetAmount(g * buyPrice);
        setTargetGrams(a / buyPrice);
    };

    // Maximum and Minimum amount of Gold and Silver  controller
    // Maximum and Minimum amount of Gold and Silver  controller
    // Maximum and Minimum amount of Gold and Silver  controller
    const MIN_PURCHASE = 1000;
    const MAX_PURCHASE = 100000;
    const [rangeError, setRangeError] = useState("");
    useEffect(() => {
        if (!targetAmount) {
            setRangeError("");
            return;
        }

        if (targetAmount < MIN_PURCHASE) {
            setRangeError("Minimum purchase amount is ₹1,000");
        } else if (targetAmount > MAX_PURCHASE) {
            setRangeError("Maximum purchase allowed is ₹1,00,000");
        } else {
            setRangeError("");
        }
    }, [targetAmount]);

    const [step, setStep] = useState<BuyStep>("amount");
    const [amountInr, setAmountInr] = useState("100");
    const [amountGm, setAmountGm] = useState((100 / buyPrice).toFixed(3));
    const [timeLeft, setTimeLeft] = useState(300);
    const [buying, setBuying] = useState(false);
    const [error, setError] = useState("");

    const isGold = metal === "gold";
    const accentColor = isGold ? "#EEC762" : "#9EA8B7";
    const accentDark = isGold ? "#C89E3D" : "#6B7280";
    const labelColor = isGold ? "text-[#1a1a2e]" : "text-gray-700";
    const gstRate = 3;

    useEffect(() => {
        if (timeLeft > 0) {
            const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
            return () => clearInterval(t);
        }
    }, [timeLeft]);

    const onInrChange = (v: string) => {
        if (Number(v) < 0) return;
        setAmountInr(v);
        setAmountGm(v ? (Number(v) / buyPrice).toFixed(3) : "0");
    };

    const onGmChange = (v: string) => {
        if (Number(v) < 0) return;
        setAmountGm(v);
        setAmountInr(v ? (Number(v) * buyPrice).toFixed(2) : "0");
    };

    const rupees = parseFloat(amountInr) || 0;
    const grams = parseFloat(amountGm) || 0;
    const gst = rupees * (gstRate / 100);
    const totalAmount = targetAmount + (targetAmount * gst) / 100;
    const isInsufficient = rupees > walletBalance;

    // Validation rules for gold
    const isGoldValid = isGold ? targetAmount > 1000 && targetGrams >= 1 : true;

    // Validation rules for silver
    const isSilverValid = !isGold ? true : false; // No specific validation for silver yet

    const handleBuy = async () => {
        setBuying(true);
        setError("");
        const ok = await onBuy(rupees, grams);
        setBuying(false);
        if (ok) setStep("checkout");
        else setError("Purchase failed. Please try again.");
    };

    const handleCheckoutConfirm = async (paymentMethod: PaymentMethod) => {
        // Simulate payment processing
        await new Promise((r) => setTimeout(r, 2000));
        setStep("success");
    };

    if (step === "checkout") {
        return (
            <CheckoutPanel
                metal={metal}
                grams={grams}
                amount={targetAmount}
                gstRate={gstRate}
                onClose={onClose}
                onConfirm={handleCheckoutConfirm}
                onBack={() => setStep("amount")}
                isProcessing={false}
            />
        );
    }

    if (step === "success") {
        return (
            <div className="mx-auto max-w-md text-center">
                <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-6 sm:mb-6 sm:rounded-2xl sm:p-8 dark:border-neutral-700 dark:bg-neutral-800">
                    <div className="relative mx-auto mb-4 h-20 w-20 rounded-full bg-green-100 p-5 sm:mb-6 sm:h-24 sm:w-24 sm:p-6 dark:bg-green-900/30">
                        <CheckCircle className="absolute inset-0 m-auto h-10 w-10 text-green-600 sm:h-12 sm:w-12 dark:text-green-500" />
                        <Sparkles
                            className="absolute -top-1 -right-1 h-5 w-5 animate-pulse sm:-top-2 sm:-right-2 sm:h-6 sm:w-6"
                            style={{ color: accentColor }}
                        />
                    </div>
                    <h1 className="mb-2 text-xl font-bold text-gray-900 sm:mb-3 sm:text-2xl dark:text-white">
                        Purchase Successful!
                    </h1>
                    <p className="mb-4 text-sm text-gray-600 sm:mb-6 dark:text-neutral-400">
                        You have successfully purchased{" "}
                        <span className="font-bold" style={{ color: accentColor }}>
                            {grams.toFixed(3)} grams
                        </span>{" "}
                        of {isGold ? "Gold" : "Silver"}
                    </p>
                    <div
                        className="mb-4 rounded-lg p-4 sm:mb-6 sm:rounded-xl sm:p-5"
                        style={{
                            backgroundColor: `${accentColor}18`,
                            border: `1px solid ${accentColor}40`,
                        }}
                    >
                        <p className="mb-0.5 text-xs text-gray-600 sm:mb-1 sm:text-sm dark:text-neutral-400">
                            Remaining wallet balance
                        </p>
                        <p className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                            ₹{walletBalance.toFixed(2)}
                        </p>
                    </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                    <button
                        onClick={() => {
                            router.push("/wallet")
                        }}
                        className="w-full rounded-lg py-3.5 text-base font-bold text-[#1a1a2e] transition-all sm:rounded-xl sm:py-4 sm:text-lg"
                        style={{ backgroundColor: accentColor }}
                    >
                        View Wallet
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:rounded-xl sm:py-4 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Live Rate */}
            <div className="rounded-xl bg-gray-50 sm:mb-6 sm:rounded-2xl dark:border-neutral-700 dark:bg-neutral-800">
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                    <div>
                        <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
                            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500 sm:h-2.5 sm:w-2.5" />
                            <p className="text-xs font-medium text-gray-600 sm:text-sm dark:text-neutral-400">
                                Live {isGold ? "Gold" : "Silver"} Rate{" "}
                                {isGold ? "(24K)" : "(999)"}
                            </p>
                        </div>
                        <p className="text-lg font-semibold text-gray-700 sm:text-2xl dark:text-white">
                            ₹{buyPrice.toFixed(2)}
                            <span className="text-sm font-normal text-gray-500 sm:text-base">
                                /gram
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end sm:gap-0">
                        <div className="flex items-center gap-1.5 text-green-600 sm:mb-1 dark:text-green-400">
                            <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            <span className="text-sm font-semibold">+1.2%</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-2 py-1 text-[10px] text-orange-700 sm:px-3 sm:py-1.5 sm:text-xs dark:bg-orange-900/30 dark:text-orange-400">
                            <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            <span>Valid for {formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Amount Inputs */}
            <div className="mt-5 mb-4 rounded-xl bg-gray-50 p-2 sm:mb-6 sm:rounded-2xl sm:p-6 dark:border-neutral-700 dark:bg-neutral-800">
                <label className="mb-2 block text-sm text-gray-700 dark:text-neutral-300">
                    Enter Amount
                </label>

                <div className="flex items-center gap-2">
                    {/* Amount */}
                    <div className="relative flex-1">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-gray-500">
                            ₹
                        </span>
                        <input
                            type="number"
                            value={targetAmount.toFixed(2)}
                            onChange={(e) => handleAmountChange(Number(e.target.value))}
                            className="w-full rounded-xl border py-2.5 pr-4 pl-8 text-xs font-normal text-gray-700 dark:bg-neutral-900 dark:text-white"
                        ></input>
                    </div>

                    {/* Swap */}
                    <button
                        onClick={handleSwap}
                        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full shadow"
                        style={{ backgroundColor: accentColor }}
                    >
                        ⇆
                    </button>

                    {/* Grams */}
                    <div className="relative flex-1">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-xs text-gray-500">
                            g
                        </span>
                        <input
                            type="number"
                            value={targetGrams.toFixed(3)}
                            onChange={(e) => handleGramsChange(Number(e.target.value))}
                            className="w-full rounded-xl border py-2.5 pr-4 pl-8 text-xs font-normal text-gray-700 dark:bg-neutral-900 dark:text-white"
                        />
                    </div>
                </div>

                {/* Preset Amount - Gold/Silver amounts */}
                <div className="mt-4 grid grid-cols-4 gap-2">
                    {[1000, 5000, 25000, 100000].map((amount) => (
                        <button
                            key={amount}
                            onClick={() => handleAmountChange(amount)}
                            className={`rounded-lg px-3 py-2 text-sm transition-all ${Math.abs(targetAmount - amount) < 100
                                ? "text-white"
                                : "bg-gray-100 text-gray-700"
                                }`}
                            style={{
                                backgroundColor:
                                    Math.abs(targetAmount - amount) < 100 ? accentColor : "",
                            }}
                        >
                            {amount >= 100000
                                ? `₹${amount / 100000}L`
                                : amount >= 1000
                                    ? `₹${amount / 1000}k`
                                    : `₹${amount}`}
                        </button>
                    ))}
                </div>

                {/* Preset grams - Gold specific (1g, 2g, 5g, 10g) */}
                <div className="mt-3 grid grid-cols-4 gap-2">
                    {[1, 2, 5, 10].map((g) => (
                        <button
                            key={g}
                            onClick={() => handleGramsChange(g)}
                            className={`rounded-lg px-3 py-2 text-sm transition-all ${Math.abs(targetGrams - g) < 0.1
                                ? "text-white"
                                : "bg-gray-100 text-gray-700"
                                }`}
                            style={{
                                backgroundColor:
                                    Math.abs(targetGrams - g) < 0.1 ? accentColor : "",
                            }}
                        >
                            {g}g
                        </button>
                    ))}
                </div>
                {rangeError && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                        {rangeError}
                    </div>
                )}
            </div>

            {/* Insufficient balance */}
            {isInsufficient && (
                <div className="mt-2 mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                    Insufficient wallet balance. Available: ₹{walletBalance.toFixed(2)}
                </div>
            )}

            {/* Price Breakdown */}
            {amountInr && (
                <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-2 sm:mb-6 sm:rounded-2xl sm:p-6 dark:border-neutral-700 dark:bg-neutral-800">
                    <h3 className="sm:text-normal mb-3 text-xs font-bold text-gray-600 sm:mb-4 dark:text-white">
                        Price Breakdown
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-xs text-gray-600 sm:text-xs dark:text-neutral-400">
                                {isGold ? "Gold" : "Silver"} Value ({targetGrams.toFixed(3)}g)
                            </span>
                            <span className="text-xs font-medium text-gray-900 sm:text-sm dark:text-white">
                                ₹{targetAmount.toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-xs text-gray-600 dark:text-neutral-400">
                                GST ({gstRate}%)
                            </span>
                            <span className="text-xs font-medium text-gray-900 sm:text-sm dark:text-white">
                                ₹{((targetAmount * gstRate) / 100).toFixed(2)}
                            </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-3 dark:border-neutral-700">
                            <span className="text-xs font-bold text-gray-600 sm:text-sm dark:text-white">
                                Total Amount
                            </span>
                            <span className="sm:text-md text-sm font-bold text-[#1a1a2e] dark:text-[#FCDE5B]">
                                ₹{(targetAmount + (targetAmount * gstRate) / 100).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
            {/* 24K Purity Section - Always visible for gold */}
            {isGold && (
                <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 sm:mb-6 sm:rounded-2xl dark:border-yellow-800 dark:bg-yellow-900/20">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-200 dark:bg-yellow-800">
                            <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
                                24K
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-300">
                                24 Carat Gold (99.9% Purity)
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                Hallmarked & BIS certified
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Info Box */}
            <div className="mb-4 rounded-lg bg-blue-50 p-3 sm:mb-6 sm:rounded-xl sm:p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-start gap-2 sm:gap-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 sm:h-5 sm:w-5 dark:text-blue-400" />
                    <div className="text-xs sm:text-xs">
                        <p className="mb-0.5 font-medium text-blue-900 sm:mb-1 dark:text-blue-300">
                            {isGold ? "Purity: 24K / 999" : "Purity: 999 Fine Silver"}
                        </p>
                        <p className="text-blue-700 dark:text-blue-400">
                            Stored securely in Zold Vault with AT Plus Jewellers
                        </p>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                </div>
            )}

            {/* Buy Button */}
            <div className="flex justify-center">
                <button
                    onClick={handleBuy}
                    disabled={
                        !!rangeError || totalAmount > walletBalance || loading || buying
                    }
                    className="h-[46px] w-[160px] rounded-lg text-sm font-semibold text-[#1a1a2e]/70 shadow-lg transition-all hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 sm:h-[56px] sm:w-[260px]"
                    style={{ backgroundColor: accentColor }}
                >
                    {buying
                        ? "Processing..."
                        : totalAmount > walletBalance
                            ? "Insufficient Balance"
                            : `Buy ${isGold ? "Gold" : "Silver"} • ₹${totalAmount.toFixed(2)}`}
                </button>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════
//  SELL panel (shared for Gold & Silver)
// ══════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════
//  SELL panel (shared for Gold & Silver)
// ══════════════════════════════════════════════════════
function SellPanel({
    metal,
    sellPrice,
    buyPrice,
    goldBalance,
    onClose,
    onSell,
    onViewWallet,
}: {
    metal: Metal;
    sellPrice: number;
    buyPrice: number;
    goldBalance: number;
    onClose: () => void;
    onSell: (grams: number) => Promise<boolean>;
    onViewWallet: () => void;
}) {
    const router = useRouter();
    const isGold = metal === "gold";
    const accentColor = isGold ? "#FCDE5B" : "#9EA8B7";
    const gstRate = 3;
    const [step, setStep] = useState<SellStep>("amount");
    const [gramsValue, setGramsValue] = useState("0.5");
    const [rupeesValue, setRupeesValue] = useState((0.5 * sellPrice).toFixed(2));
    const [isProceedChecked, setIsProceedChecked] = useState(false);
    const [selling, setSelling] = useState(false);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(300);
    const [showSettlementPopup, setShowSettlementPopup] = useState(false);

    const priceDifference = buyPrice - sellPrice;
    const spreadPercentage = ((priceDifference / buyPrice) * 100).toFixed(2);

    useEffect(() => {
        if (timeLeft > 0) {
            const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
            return () => clearInterval(t);
        }
    }, [timeLeft]);

    const handleGramsChange = (val: string) => {
        setGramsValue(val);
        const g = parseFloat(val || "0");
        setRupeesValue(val ? (g * sellPrice).toFixed(2) : "0");
    };

    const handleRupeesChange = (val: string) => {
        setRupeesValue(val);
        const r = parseFloat(val || "0");
        setGramsValue(val ? (r / sellPrice).toFixed(3) : "0");
    };

    const grams = parseFloat(gramsValue || "0");
    const rupees = parseFloat(rupeesValue || "0");
    const gst = rupees * (gstRate / 100);
    const netAmount = rupees;
    const isValidAmount = grams > 0 && grams <= goldBalance && grams >= 0.01;
    const isInsufficientGold = grams > goldBalance;

    const handleSell = async () => {
        setSelling(true);
        setError("");
        const ok = await onSell(grams);
        setSelling(false);
        if (ok) {
            // Show settlement popup instead of going to checkout
            setShowSettlementPopup(true);
        } else {
            setError("Sale failed. Please try again.");
        }
    };

    const handleSettlementConfirm = () => {
        setShowSettlementPopup(false);
        setStep("success");
    };

    if (step === "success") {
        return (
            <div className="mx-auto max-w-md text-center">
                <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-xl sm:mb-6 sm:rounded-2xl sm:p-8 dark:border-neutral-700 dark:bg-neutral-800">
                    <div className="relative mx-auto mb-4 h-20 w-20 rounded-full bg-green-100 p-5 sm:mb-6 sm:h-24 sm:w-24 sm:p-6 dark:bg-green-900/30">
                        <CheckCircle className="absolute inset-0 m-auto h-10 w-10 text-green-600 sm:h-12 sm:w-12 dark:text-green-500" />
                        <Sparkles
                            className="absolute -top-1 -right-1 h-5 w-5 animate-pulse sm:-top-2 sm:-right-2 sm:h-6 sm:w-6"
                            style={{ color: accentColor }}
                        />
                    </div>
                    <h1 className="mb-2 text-xl font-bold text-gray-900 sm:mb-3 sm:text-2xl dark:text-white">
                        Sale Request Submitted!
                    </h1>
                    <p className="mb-4 text-sm text-gray-600 sm:mb-6 dark:text-neutral-400">
                        You have successfully sold{" "}
                        <span className="font-bold" style={{ color: accentColor }}>
                            {grams.toFixed(3)} grams
                        </span>{" "}
                        of {isGold ? "Gold" : "Silver"}
                    </p>

                    {/* Settlement Info */}
                    <div className="mb-4 rounded-lg bg-blue-50 p-4 sm:mb-6 dark:bg-blue-900/20">
                        <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            <div className="text-left">
                                <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                                    Settlement in Progress
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-400">
                                    The amount will be reflected in your account within 24 hours.
                                    If not credited by then, please contact our support team.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="mb-4 rounded-lg p-4 sm:mb-6"
                        style={{
                            backgroundColor: `${accentColor}18`,
                            border: `1px solid ${accentColor}40`,
                        }}
                    >
                        <p className="mb-1 text-xs text-gray-600 dark:text-neutral-400">
                            Total Amount to be Received
                        </p>
                        <p className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                            ₹{netAmount.toFixed(2)}
                        </p>
                    </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                    <button
                        onClick={() => {
                            router.push("/wallet");
                        }}
                        className="w-full rounded-lg py-3.5 text-base font-bold text-[#1a1a2e] shadow-lg transition-all sm:rounded-xl sm:py-4 sm:text-lg"
                        style={{ backgroundColor: accentColor }}
                    >
                        View Wallet
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 sm:rounded-xl sm:py-4 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Settlement Popup */}
            {showSettlementPopup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-neutral-800"
                    >
                        <div className="text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                                Sale Initiated Successfully!
                            </h3>
                            <p className="mb-4 text-sm text-gray-600 dark:text-neutral-400">
                                Your {isGold ? "gold" : "silver"} sale request has been submitted.
                            </p>
                            <div className="mb-6 rounded-lg bg-blue-50 p-4 text-left dark:bg-blue-900/20">
                                <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                                    ⏱️ Settlement Timeline
                                </p>
                                <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                                    The amount will be reflected in your account within 24 hours.
                                    If not credited within this timeframe, please contact our support
                                    team at support@zold.com or call +91-XXXXXXXXXX.
                                </p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleSettlementConfirm}
                                    className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                                >
                                    Got it, continue
                                </button>
                                <button
                                    onClick={() => {
                                        setShowSettlementPopup(false);
                                        onClose();
                                    }}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Live Rate */}
            <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500" />
                            <p className="text-xs font-medium text-gray-600 sm:text-sm dark:text-neutral-400">
                                Live Sell Rate {isGold ? "(24K)" : "(999 Silver)"}
                            </p>
                        </div>
                        <p className="text-lg font-semibold text-gray-700 sm:text-2xl dark:text-white">
                            ₹{sellPrice.toFixed(2)}
                            <span className="text-base font-normal text-gray-500">/gram</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                        <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                            <TrendingDown className="h-3 w-3" />
                            <span className="text-xs font-semibold">
                                -{spreadPercentage}%
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Valid for {formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Gold/Silver Balance */}
            <div
                className="mb-2 rounded-xl p-4 sm:mb-2 sm:rounded-2xl sm:p-5"
                style={{ background: "linear-gradient(135deg, #2e2e48, #24345c)" }}
            >
                <div className="flex flex-col gap-3 text-white sm:flex-row sm:items-center sm:justify-between sm:gap-0">
                    <div>
                        <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
                            <Coins
                                className="h-4 w-4 sm:h-5 sm:w-5"
                                style={{ color: accentColor }}
                            />
                            <span
                                className="text-xs font-medium sm:text-sm"
                                style={{ color: accentColor }}
                            >
                                Available to Sell
                            </span>
                        </div>
                        <p className="text-2xl font-bold sm:text-3xl">
                            {goldBalance.toFixed(3)}g
                        </p>
                        <p className="mt-0.5 text-[10px] text-white/70 sm:mt-1 sm:text-xs">
                            ≈ ₹{(goldBalance * sellPrice).toFixed(2)}
                        </p>
                    </div>
                    <div
                        className="flex items-center gap-2 rounded-xl px-3 py-2 sm:px-4"
                        style={{ backgroundColor: `${accentColor}30` }}
                    >
                        <Shield className="h-4 w-4" style={{ color: accentColor }} />
                        <span
                            className="text-xs font-medium sm:text-sm"
                            style={{ color: accentColor }}
                        >
                            Zold Vault
                        </span>
                    </div>
                </div>
            </div>

            {/* Amount Inputs */}
            <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-2 sm:p-6 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="folt-bold mt-2 text-sm font-semibold text-gray-800/50">
                    Enter grams
                </div>
                <div className="flex items-center gap-3">
                    {/* Grams */}
                    <div className="relative flex-1">
                        <span className="absolute top-1/2 right-3 -translate-y-1/2 text-sm font-semibold text-gray-500">
                            gm
                        </span>
                        <input
                            type="number"
                            min="0"
                            step="0.0001"
                            value={gramsValue}
                            onChange={(e) => handleGramsChange(e.target.value)}
                            className="w-full rounded-xl border px-2 py-2 pr-12 text-xs font-normal text-gray-600"
                        />
                    </div>

                    {/* Swap (decorative) */}
                    <button
                        className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold shadow"
                        style={{ backgroundColor: accentColor }}
                    >
                        ⇆
                    </button>
                    {/* Rupees */}
                    <div className="relative flex-1">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm font-semibold text-gray-500">
                            ₹
                        </span>
                        <input
                            type="number"
                            min="0"
                            step="1"
                            value={rupeesValue}
                            onChange={(e) => handleRupeesChange(e.target.value)}
                            className="w-full rounded-xl border px-6 py-2 text-xs font-normal text-black"
                        />
                    </div>
                </div>
                {isInsufficientGold && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-normal text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                        Insufficient {isGold ? "Gold" : "Silver"}. Available:{" "}
                        {goldBalance.toFixed(3)}g
                    </div>
                )}
                {/* Quick amounts tab - Silver specific */}
                <div className="mt-4 mb-4 grid grid-cols-4 gap-2 sm:mb-6 sm:gap-3">
                    {[1000, 5000, 25000, 100000].map((amount) => {
                        const isActive = Math.abs(rupees - amount) < 1;

                        return (
                            <button
                                key={amount}
                                onClick={() => handleRupeesChange(amount.toString())}
                                className={`rounded-lg px-3 py-2 text-sm transition-all ${isActive ? "text-white" : "bg-gray-100 text-gray-700"
                                    }`}
                                style={{
                                    backgroundColor: isActive ? accentColor : "",
                                }}
                            >
                                {amount >= 100000
                                    ? `₹${amount / 100000}L`
                                    : amount >= 1000
                                        ? `₹${amount / 1000}k`
                                        : `₹${amount}`}
                            </button>
                        );
                    })}
                </div>

                {/* Quick grams tab - Gold specific (1g, 2g, 5g, 10g) */}
                <div className="mb-4 grid grid-cols-4 gap-2 sm:mb-6 sm:gap-3">
                    {[1, 2, 5, 10].map((g) => {
                        const isActive = Math.abs(grams - g) < 0.0001;

                        return (
                            <button
                                key={g}
                                onClick={() => handleGramsChange(g.toString())}
                                className={`rounded-lg px-3 py-2 text-sm transition-all ${isActive ? "text-white" : "bg-gray-100 text-gray-700"
                                    }`}
                                style={{
                                    backgroundColor: isActive ? accentColor : "",
                                }}
                            >
                                {g}g
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Price Breakdown */}
            {gramsValue && isValidAmount && (
                <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-4 sm:mb-6 sm:rounded-2xl sm:p-6 dark:border-neutral-700 dark:bg-neutral-800">
                    <h3 className="mb-3 text-sm font-bold text-gray-900 sm:mb-4 sm:text-base dark:text-white">
                        Estimated Proceeds
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                        <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-600 dark:text-neutral-400">
                                {isGold ? "Gold" : "Silver"} Value ({grams.toFixed(3)}g)
                            </span>
                            <span className="font-medium text-gray-900 dark:text-white">
                                ₹{rupees.toFixed(2)}
                            </span>
                        </div>

                        <div className="flex justify-between border-t border-gray-100 pt-2 sm:pt-3 dark:border-neutral-700">
                            <span className="text-sm font-bold text-gray-900 sm:text-base dark:text-white">
                                Total Amount
                            </span>
                            <span className="text-sm font-bold text-green-600 sm:text-base dark:text-green-400">
                                ₹{netAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* 24K Purity Section - Always visible for gold in sell as well */}
            {isGold && (
                <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 sm:mb-6 sm:rounded-2xl dark:border-yellow-800 dark:bg-yellow-900/20">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-200 dark:bg-yellow-800">
                            <span className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
                                24K
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-300">
                                24 Carat Gold (99.9% Purity)
                            </p>
                            <p className="text-xs text-yellow-700 dark:text-yellow-400">
                                Hallmarked & BIS certified
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Important Notes */}
            <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-3 sm:mb-6 sm:rounded-2xl sm:p-4 dark:border-orange-800 dark:bg-orange-900/20">
                <div className="flex items-start gap-2 sm:gap-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 text-orange-600 sm:h-5 sm:w-5 dark:text-orange-400" />
                    <div className="text-xs sm:text-sm">
                        <p className="mb-1 font-semibold text-orange-900 dark:text-orange-300">
                            Important Notes
                        </p>
                        <ul className="space-y-0.5 text-orange-800 sm:space-y-1 dark:text-orange-400">
                            <li>• GST @{gstRate}% will be deducted from the proceeds</li>

                            <li>• Amount will be credited within 24 hours</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Proceed checkbox (only show on storage step — simplified here) */}
            {step === "amount" && isValidAmount && (
                <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                    <div className="flex items-start gap-3">
                        <input
                            type="checkbox"
                            id="proceedConfirm"
                            checked={isProceedChecked}
                            onChange={(e) => setIsProceedChecked(e.target.checked)}
                            className="mt-1"
                        />
                        <div>
                            <label
                                htmlFor="proceedConfirm"
                                className="text-sm text-gray-900 dark:text-white"
                            >
                                I understand that by proceeding, I am selling {grams.toFixed(3)}{" "}
                                grams of {isGold ? "gold" : "silver"}
                            </label>
                            <p className="mt-1 text-xs text-gray-600 dark:text-neutral-400">
                                This action is irreversible. Your {isGold ? "gold" : "silver"}{" "}
                                will be deducted from your vault balance and amount will be credited within 24 hours.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                    {error}
                </div>
            )}

            {/* Sell Button */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={handleSell}
                    disabled={!isValidAmount || !isProceedChecked || selling}
                    className="h-[46px] w-[160px] rounded-lg text-sm font-semibold text-[#1a1a2e]/70 shadow-lg transition-all hover:shadow-xl active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                    style={{ backgroundColor: accentColor }}
                >
                    {selling
                        ? "Processing..."
                        : `Sell ${isGold ? "Gold" : "Silver"} • ₹${netAmount.toFixed(3)}`}
                </button>
            </div>
        </div>
    );
}

// ══════════════════════════════════════════════════════
//  MAIN: BuySellFlow
// ══════════════════════════════════════════════════════
export function BuySellFlow({
    onClose,
    defaultMetal = "gold",
    defaultAction = "buy",
}: BuySellFlowProps) {
    const router = useRouter();
    const [metal, setMetal] = useState<Metal>(defaultMetal);
    const [action, setAction] = useState<Action>(defaultAction);

    // ── Gold state ──
    const [goldBuyPrice, setGoldBuyPrice] = useState(6245.5);
    const [goldSellPrice, setGoldSellPrice] = useState(6180.75);
    const [walletBalance, setWalletBalance] = useState(0);
    const [goldBalance, setGoldBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);

    // ── Silver state (mock prices — replace with API when ready) ──
    const [silverBuyPrice] = useState(SILVER_BUY_PRICE);
    const [silverSellPrice] = useState(SILVER_SELL_PRICE);
    const [silverBalance] = useState(0);

    const isGold = metal === "gold";

    const fetchTestWallet = useCallback(async () => {
        try {
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/gold/test-wallet`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (data.success) setWalletBalance(parseFloat(data.data.virtualBalance));
        } catch (e) {
            console.error(e);
        }
    }, []);

    const fetchGoldData = useCallback(async () => {
        try {
            const token = getAuthToken();
            const [ratesRes, balanceRes, txRes] = await Promise.allSettled([
                fetch(`${API_URL}/gold/rates/current`).then((r) => r.json()),
                fetch(`${API_URL}/gold/wallet/balance`, {
                    headers: { Authorization: `Bearer ${token}` },
                }).then((r) => r.json()),
                fetch(`${API_URL}/gold/transactions?limit=10`, {
                    headers: { Authorization: `Bearer ${token}` },
                }).then((r) => r.json()),
            ]);
            if (ratesRes.status === "fulfilled" && ratesRes.value.success) {
                setGoldBuyPrice(parseFloat(ratesRes.value.data.buyRate));
                setGoldSellPrice(parseFloat(ratesRes.value.data.sellRate));
            }
            if (balanceRes.status === "fulfilled" && balanceRes.value.success) {
                setGoldBalance(parseFloat(balanceRes.value.data.goldBalance) || 0);
            }
            if (txRes.status === "fulfilled" && txRes.value.success) {
                setTransactions(txRes.value.data);
            }
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        fetchTestWallet();
        fetchGoldData();

        const socket: Socket = io(
            process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
            "http://localhost:3005",
            { transports: ["websocket", "polling"], reconnection: true },
        );
        socket.on(
            "goldPriceUpdate",
            (data: { buyRate: number; sellRate: number }) => {
                setGoldBuyPrice(data.buyRate);
                setGoldSellPrice(data.sellRate);
            },
        );
        return () => {
            socket.disconnect();
        };
    }, [fetchTestWallet, fetchGoldData]);

    const addTestCredits = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/gold/test-wallet/add-credits`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: 10000 }),
            });
            const data = await res.json();
            if (data.success) setWalletBalance(parseFloat(data.data.virtualBalance));
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const handleBuyGold = async (
        inr: number,
        grams: number,
    ): Promise<boolean> => {
        try {
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/gold/buy`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amountInRupees: inr,
                    goldGrams: grams,
                    storageType: "vault",
                }),
            });
            const data = await res.json();
            if (data.success) {
                await fetchTestWallet();
                await fetchGoldData();
                return true;
            }
        } catch (e) {
            console.error(e);
        }
        return false;
    };

    const handleSellGold = async (grams: number): Promise<boolean> => {
        try {
            const token = getAuthToken();
            const res = await fetch(`${API_URL}/gold/sell`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ goldGrams: grams }),
            });
            const data = await res.json();
            if (data.success) {
                await fetchGoldData();
                return true;
            }
        } catch (e) {
            console.error(e);
        }
        return false;
    };

    // Silver: mock handlers (show alert for now)
    const handleBuySilver = async (
        _inr: number,
        _grams: number,
    ): Promise<boolean> => {
        await new Promise((r) => setTimeout(r, 1000));
        return true; // mock success
    };
    const handleSellSilver = async (_grams: number): Promise<boolean> => {
        await new Promise((r) => setTimeout(r, 1000));
        return true; // mock success
    };

    const currentBuyPrice = isGold ? goldBuyPrice : silverBuyPrice;
    const currentSellPrice = isGold ? goldSellPrice : silverSellPrice;
    const currentBalance = isGold ? goldBalance : silverBalance;

    // ── Gradient colours per metal ──
    const headerGradient = isGold
        ? "from-[#f6e8bd] to-[#f1dda5]"
        : "from-[#d7dde6] to-[#b0b8c6]";
    const actionActiveGold = "bg-[#EEC762] text-[#1a1a2e]";
    const actionActiveSilver = "bg-[#9EA8B7] text-white";
    const actionActive = isGold ? actionActiveGold : actionActiveSilver;

    return (
        <div
            className={`fixed relative inset-0 z-50 flex min-h-screen flex-col overflow-y-auto ${metal === "gold"
                ? "bg-[#fff9e6]/50 dark:bg-[#1b1a14]" // goldish
                : "bg-[#f4f6f8] dark:bg-[#16181c]" // silveric
                }`}
        >
            {/* Animated Metal Background */}
            <MetalAnimatedBackground metal={metal} />

            {/* ── Header ── */}
            <div
                className={`sticky top-0 z-10 bg-gradient-to-r ${headerGradient} relative pt-2 shadow-lg`}
            >
                {/* TOP ROW */}
                <div className="mx-auto flex w-full items-center justify-between px-4 sm:px-2">
                    {/* BACK BUTTON */}
                    <button
                        onClick={onClose}
                        className="rounded-full bg-gray-900 p-1 transition-colors hover:bg-black/10 sm:ml-5"
                    >
                        <ArrowLeft className="h-4 w-4 rounded-xl text-white sm:h-5 sm:w-5" />
                    </button>

                    {/* GOLD | SILVER - CENTERED */}
                    <div className="flex items-center gap-10 sm:gap-70">
                        {/* GOLD */}
                        <button
                            onClick={() => setMetal("gold")}
                            className={`relative px-5 py-1 text-sm font-bold tracking-wide transition-all sm:text-lg ${metal === "gold"
                                ? "text-[#1a1a2e]"
                                : "text-[#1a1a2e]/40 hover:text-[#1a1a2e]/60"
                                }`}
                        >
                            GOLD
                            {metal === "gold" && (
                                <motion.div
                                    layoutId="metalUnderline"
                                    className="absolute right-0 -bottom-1 left-0 h-[2px] rounded-full bg-[#1a1a2e]/70"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>

                        {/* SILVER */}
                        <button
                            onClick={() => setMetal("silver")}
                            className={`relative px-5 py-1 text-sm font-bold tracking-wide transition-all sm:text-lg ${metal === "silver"
                                ? "text-[#1a1a2e]"
                                : "text-[#1a1a2e]/40 hover:text-[#1a1a2e]/60"
                                }`}
                        >
                            SILVER
                            {metal === "silver" && (
                                <motion.div
                                    layoutId="metalUnderline"
                                    className="absolute right-0 -bottom-1 left-0 h-[2px] rounded-full bg-[#1a1a2e]/70"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </button>
                    </div>

                    {/* Empty div for flex spacing balance */}
                    <div className="w-8 sm:w-10" />
                </div>

                {/* BUY | SELL action tabs */}
                <div className="relative mx-auto mt-2 w-full max-w-xs px-4 pb-2">
                    {/* Tabs */}
                    <div className="flex">
                        <button
                            onClick={() => setAction("buy")}
                            className={`flex-1 py-1 text-xs font-semibold transition-all sm:text-sm ${action === "buy"
                                ? "text-[#1a1a2e]"
                                : "text-[#1a1a2e]/40 hover:text-[#1a1a2e]/60"
                                }`}
                        >
                            Buy
                        </button>

                        <button
                            onClick={() => setAction("sell")}
                            className={`flex-1 py-1 text-xs font-semibold transition-all sm:text-sm ${action === "sell"
                                ? "text-[#1a1a2e]"
                                : "text-[#1a1a2e]/40 hover:text-[#1a1a2e]/60"
                                }`}
                        >
                            Sell
                        </button>
                    </div>

                    {/* BASE FULL LINE */}
                    <div className="absolute right-0 bottom-0 left-0 h-[1px] bg-[#1a1a2e]/20" />

                    {/* ACTIVE INDICATOR */}
                    <motion.div
                        layout
                        className="absolute bottom-0 h-[2px] rounded-full bg-[#1a1a2e]/60"
                        style={{
                            width: "50%",
                            left: action === "buy" ? "0%" : "50%",
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                </div>
            </div>
            {/* ── Content ── */}
            <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-4 pb-24 sm:px-6 sm:py-6">
                {action === "buy" ? (
                    <BuyPanel
                        metal={metal}
                        buyPrice={currentBuyPrice}
                        walletBalance={walletBalance}
                        onAddCredits={addTestCredits}
                        loading={loading}
                        transactions={transactions}
                        onBuy={isGold ? handleBuyGold : handleBuySilver}
                        onClose={onClose}
                        onViewWallet={() => {
                            onClose();
                            router.push("/wallet");
                        }}
                    />
                ) : (
                    <SellPanel
                        metal={metal}
                        sellPrice={currentSellPrice}
                        buyPrice={currentBuyPrice}
                        goldBalance={currentBalance}
                        onClose={onClose}
                        onSell={isGold ? handleSellGold : handleSellSilver}
                        onViewWallet={() => {
                            onClose();
                            router.push("/wallet");
                        }}
                    />
                )}
            </div>
        </div>
    );
}
