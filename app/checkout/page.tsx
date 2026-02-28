"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { clearCart } from "../../components/store/cartSlice";
import { RootState } from "../../components/store/store";
import Image from "next/image";
import {
    ArrowLeft,
    ShieldCheck,
    CreditCard,
    Smartphone,
    Building2,
    Wallet,
    ChevronRight,
    ChevronDown,
    CheckCircle2,
    Lock,
    Truck,
    Package,
    Sparkles,
    AlertCircle,
    Copy,
    Check,
    MapPin,
    Pencil,
    Plus,
    X,
    Home,
    Briefcase,
} from "lucide-react";

import img1 from "../../components/images/1gmZold.webp";
import img2 from "../../components/images/2gmZold.webp";
import img5 from "../../components/images/5gmZold.webp";
import img10 from "../../components/images/10gmZold.webp";

const coinImages: Record<number, any> = {
    1: img1,
    2: img2,
    5: img5,
    10: img10,
};

type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";
type OrderStep = "address" | "payment" | "confirmation";

const GST_RATE = 3;
const DELIVERY_CHARGE = 50;

const upiApps = [
    { id: "gpay", name: "Google Pay", color: "#4285F4", letter: "G" },
    { id: "phonepe", name: "PhonePe", color: "#5F259F", letter: "P" },
    { id: "paytm", name: "Paytm", color: "#00BAF2", letter: "P" },
    { id: "bharatpe", name: "BharatPe", color: "#E63B2E", letter: "B" },
];

const banks = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
];

const wallets = [
    { id: "paytm-w", name: "Paytm Wallet", color: "#00BAF2" },
    { id: "amazon", name: "Amazon Pay", color: "#FF9900" },
    { id: "mobikwik", name: "MobiKwik", color: "#1A7AFF" },
    { id: "freecharge", name: "Freecharge", color: "#EF5318" },
];

const INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
];

function formatTime(s: number) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ── Address type ──
interface Address {
    id: string;
    label: "Home" | "Work" | "Other";
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    pin: string;
    phone: string;
}

type AddressFormData = Omit<Address, "id">;

const BLANK: AddressFormData = {
    label: "Home",
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pin: "",
    phone: "",
};

// ── Reusable Address Form ──
function AddressForm({
    data,
    errors,
    onChange,
}: {
    data: AddressFormData;
    errors: Partial<Record<keyof AddressFormData, string>>;
    onChange: (d: AddressFormData) => void;
}) {
    const inp = (
        key: keyof AddressFormData,
        placeholder: string,
        type = "text",
    ) => (
        <div>
            <input
                type={type}
                value={data[key]}
                onChange={(e) => onChange({ ...data, [key]: e.target.value })}
                placeholder={placeholder}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm text-gray-800 transition-colors focus:outline-none ${errors[key]
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C]/20"
                    }`}
            />
            {errors[key] && (
                <p className="mt-1 text-xs text-red-500">{errors[key]}</p>
            )}
        </div>
    );

    return (
        <div className="space-y-3">
            {/* Label toggle */}
            <div className="flex gap-2">
                {(["Home", "Work", "Other"] as const).map((lbl) => (
                    <button
                        key={lbl}
                        type="button"
                        onClick={() => onChange({ ...data, label: lbl })}
                        className={`flex-1 rounded-lg border-2 py-1.5 text-xs font-bold transition-all ${data.label === lbl
                            ? "border-[#B8960C] bg-[#B8960C] text-white"
                            : "border-gray-200 text-gray-500 hover:border-gray-300"
                            }`}
                    >
                        {lbl}
                    </button>
                ))}
            </div>

            {inp("name", "Full Name")}
            {inp("phone", "Phone Number", "tel")}
            {inp("line1", "Address Line 1")}
            {inp("line2", "Address Line 2 (optional)")}

            <div className="grid grid-cols-2 gap-2">
                {inp("city", "City")}
                <div>
                    <input
                        type="text"
                        value={data.pin}
                        onChange={(e) =>
                            onChange({
                                ...data,
                                pin: e.target.value.replace(/\D/g, "").slice(0, 6),
                            })
                        }
                        placeholder="PIN Code"
                        className={`w-full rounded-xl border px-3 py-2.5 text-sm text-gray-800 transition-colors focus:outline-none ${errors.pin
                            ? "border-red-400 bg-red-50"
                            : "border-gray-200 focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C]/20"
                            }`}
                    />
                    {errors.pin && (
                        <p className="mt-1 text-xs text-red-500">{errors.pin}</p>
                    )}
                </div>
            </div>

            <div className="relative">
                <select
                    value={data.state}
                    onChange={(e) => onChange({ ...data, state: e.target.value })}
                    className={`w-full appearance-none rounded-xl border px-3 py-2.5 text-sm text-gray-800 transition-colors focus:outline-none ${errors.state
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C]/20"
                        }`}
                >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={14}
                    className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
                />
                {errors.state && (
                    <p className="mt-1 text-xs text-red-500">{errors.state}</p>
                )}
            </div>
        </div>
    );
}

// ── Label badge helper ──
function LabelBadge({ label }: { label: Address["label"] }) {
    const cls =
        label === "Home"
            ? "bg-blue-50 text-blue-600"
            : label === "Work"
                ? "bg-purple-50 text-purple-600"
                : "bg-gray-100 text-gray-500";
    const Icon = label === "Home" ? Home : label === "Work" ? Briefcase : null;
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}
        >
            {Icon && <Icon size={10} />}
            {label}
        </span>
    );
}

// ═══════════════════════════════════════════════════════
//  Main Page
// ═══════════════════════════════════════════════════════
export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { items } = useSelector((state: RootState) => state.cart);

    // ── Timer (carries over from cart — stored in sessionStorage) ──
    const [timeLeft, setTimeLeft] = useState<number>(() => {
        if (typeof window !== "undefined") {
            const saved = sessionStorage.getItem("cartSessionEnd");
            if (saved) {
                const remaining = Math.floor((parseInt(saved) - Date.now()) / 1000);
                return remaining > 0 ? remaining : 0;
            }
        }
        return 300;
    });
    const [sessionExpired, setSessionExpired] = useState(false);

    // ── Checkout state ──
    const [step, setStep] = useState<OrderStep>("address");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
    const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");
    const [upiId, setUpiId] = useState("");
    const [selectedBank, setSelectedBank] = useState(banks[0]);
    const [selectedWallet, setSelectedWallet] = useState(wallets[0].id);
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [cardExpiry, setCardExpiry] = useState("");
    const [cardCvv, setCardCvv] = useState("");
    const [paying, setPaying] = useState(false);
    const [paid, setPaid] = useState(false);
    const [copiedUpi, setCopiedUpi] = useState(false);

    // ── Address state ──
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: "addr-1",
            label: "Home",
            name: "Rahul Sharma",
            line1: "A-12, Sunshine Apartments",
            line2: "Sector 18, Noida",
            city: "Noida",
            state: "Uttar Pradesh",
            pin: "201301",
            phone: "+91 98765 43210",
        },
        {
            id: "addr-2",
            label: "Work",
            name: "Rahul Sharma",
            line1: "Tower B, 5th Floor, Cyber City",
            line2: "DLF Phase 2, Gurugram",
            city: "Gurugram",
            state: "Haryana",
            pin: "122002",
            phone: "+91 98765 43210",
        },
    ]);
    const [selectedAddrId, setSelectedAddrId] = useState("addr-1");
    const [showPanel, setShowPanel] = useState(false);
    // null = no form open; "new" = add-new form; otherwise = id of addr being edited
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<AddressFormData>(BLANK);
    const [formErrors, setFormErrors] = useState<
        Partial<Record<keyof AddressFormData, string>>
    >({});

    const selectedAddr =
        addresses.find((a) => a.id === selectedAddrId) ?? addresses[0];

    // ── Address helpers ──
    const openEdit = (addr: Address) => {
        setEditingId(addr.id);
        setFormData({
            label: addr.label,
            name: addr.name,
            line1: addr.line1,
            line2: addr.line2,
            city: addr.city,
            state: addr.state,
            pin: addr.pin,
            phone: addr.phone,
        });
        setFormErrors({});
    };
    const openAdd = () => {
        setEditingId("new");
        setFormData(BLANK);
        setFormErrors({});
    };
    const cancelForm = () => {
        setEditingId(null);
        setFormErrors({});
    };

    const validate = (): boolean => {
        const e: typeof formErrors = {};
        if (!formData.name.trim()) e.name = "Name is required";
        if (!formData.line1.trim()) e.line1 = "Address line 1 is required";
        if (!formData.city.trim()) e.city = "City is required";
        if (!formData.state) e.state = "State is required";
        if (!/^\d{6}$/.test(formData.pin)) e.pin = "Enter valid 6-digit PIN";
        if (!/^[+\d\s-]{10,}$/.test(formData.phone))
            e.phone = "Enter valid phone number";
        setFormErrors(e);
        return Object.keys(e).length === 0;
    };

    const saveAddress = () => {
        if (!validate()) return;
        if (editingId === "new") {
            const newAddr: Address = { ...formData, id: `addr-${Date.now()}` };
            setAddresses((prev) => [...prev, newAddr]);
            setSelectedAddrId(newAddr.id);
        } else {
            setAddresses((prev) =>
                prev.map((a) => (a.id === editingId ? { ...formData, id: a.id } : a)),
            );
        }
        setEditingId(null);
        setShowPanel(false);
    };

    const deleteAddr = (id: string) => {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        if (selectedAddrId === id) {
            const remaining = addresses.filter((a) => a.id !== id);
            setSelectedAddrId(remaining[0]?.id ?? "");
        }
    };

    // ── Totals ──
    const subtotal = useMemo(
        () => items.reduce((s, i) => s + i.price * i.quantity, 0),
        [items],
    );
    const gst = (subtotal * GST_RATE) / 100;
    const total = subtotal + gst + DELIVERY_CHARGE;
    const totalWeight = items.reduce((s, i) => s + i.weight * i.quantity, 0);

    // ── Timer countdown ──
    useEffect(() => {
        if (timeLeft <= 0) {
            setSessionExpired(true);
            return;
        }
        const t = setInterval(() => {
            setTimeLeft((p) => {
                if (p <= 1) {
                    setSessionExpired(true);
                    return 0;
                }
                return p - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [timeLeft]);

    // ── Clear cart on expire ──
    useEffect(() => {
        if (sessionExpired) {
            dispatch(clearCart());
            sessionStorage.removeItem("cartSessionEnd");
        }
    }, [sessionExpired, dispatch]);

    // ── Redirect if no items ──
    useEffect(() => {
        if (!sessionExpired && items.length === 0) router.push("/buy-coins");
    }, [items, sessionExpired, router]);

    // ── Format card helpers ──
    const formatCard = (v: string) =>
        v
            .replace(/\D/g, "")
            .slice(0, 16)
            .replace(/(.{4})/g, "$1 ")
            .trim();
    const formatExpiry = (v: string) => {
        const d = v.replace(/\D/g, "").slice(0, 4);
        return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
    };

    const handlePay = async () => {
        setPaying(true);
        await new Promise((r) => setTimeout(r, 2000));
        setPaying(false);
        setPaid(true);
        dispatch(clearCart());
        sessionStorage.removeItem("cartSessionEnd");
    };

    const timerColor =
        timeLeft <= 60
            ? "text-red-500"
            : timeLeft <= 120
                ? "text-orange-500"
                : "text-green-600";
    const timerBg =
        timeLeft <= 60
            ? "bg-red-50 border-red-200"
            : timeLeft <= 120
                ? "bg-orange-50 border-orange-200"
                : "bg-green-50 border-green-200";

    // ── SESSION EXPIRED SCREEN ──
    if (sessionExpired) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4">
                <div className="max-w-sm text-center">
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="h-10 w-10 text-red-500" />
                    </div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">
                        Session Expired
                    </h1>
                    <p className="mb-2 text-gray-500">
                        Your 5-minute checkout session has expired and your cart has been
                        cleared for security.
                    </p>
                    <p className="mb-8 text-sm text-gray-400">
                        Please add items to your cart again and complete payment within 5
                        minutes.
                    </p>
                    <button
                        onClick={() => router.push("/buy-coins")}
                        className="w-full rounded-xl bg-gradient-to-r from-[#B8960C] to-[#D4AF37] py-3.5 font-bold text-white shadow-lg transition-all hover:shadow-xl"
                    >
                        Return to Shop
                    </button>
                </div>
            </div>
        );
    }

    // ── PAYMENT SUCCESS SCREEN ──
    if (paid) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#fdfcf5] to-white p-4">
                <div className="w-full max-w-md text-center">
                    <div className="relative mx-auto mb-6 h-24 w-24">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        </div>
                        <Sparkles className="absolute -top-2 -right-2 h-7 w-7 animate-pulse text-yellow-400" />
                    </div>
                    <h1 className="mb-2 text-3xl font-bold text-gray-900">
                        Order Placed! 🎉
                    </h1>
                    <p className="mb-6 text-gray-500">
                        Your gold coins are on their way. You&apos;ll receive a confirmation
                        shortly.
                    </p>

                    <div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-left shadow-lg">
                        <div className="mb-3 flex justify-between text-sm">
                            <span className="text-gray-500">Order ID</span>
                            <span className="font-bold text-gray-800">
                                #ZG{Date.now().toString().slice(-8)}
                            </span>
                        </div>
                        <div className="mb-3 flex justify-between text-sm">
                            <span className="text-gray-500">Total Paid</span>
                            <span className="font-bold text-[#B8960C]">
                                ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Estimated Delivery</span>
                            <span className="font-bold text-gray-800">2–3 Business Days</span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push("/home")}
                        className="w-full rounded-xl bg-gradient-to-r from-[#B8960C] to-[#D4AF37] py-3.5 font-bold text-white shadow-lg transition-all hover:shadow-xl"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f6f6f2]">
            {/* ── Header ── */}
            <div className="sticky top-0 z-30 border-b border-gray-200 bg-gray-50 shadow-sm">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => router.back()}
                            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                        >
                            <ArrowLeft size={20} className="text-gray-600" />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 sm:h-8 sm:w-8 relative overflow-hidden rounded-md  p-[2px]">
                                <Image
                                    src="/02.png"
                                    alt="ZOLD"
                                    fill
                                    sizes="20px"
                                    className="object-contain"
                                />
                            </div>
                            <span className="hidden text-lg font-bold text-[#B8960C] sm:block">
                                ZOLD GOLD
                            </span>
                        </div>
                        <span className="hidden text-sm text-gray-400 sm:block">
                            / Secure Checkout
                        </span>
                    </div>

                    {/* Timer */}
                    <div
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-bold ${timerBg} ${timerColor}`}
                    >
                        <AlertCircle size={14} />
                        <span>Session: {formatTime(timeLeft)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Lock size={12} className="text-green-500" />
                        <span className="hidden sm:block">128-bit SSL</span>
                    </div>
                </div>
            </div>

            {/* ── Step Progress ── */}
            <div className="border-b border-gray-100 bg-gray-50">
                <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 text-xs font-medium">
                    {(["address", "payment", "confirmation"] as OrderStep[]).map(
                        (s, i) => (
                            <div key={s} className="flex items-center gap-2">
                                <div
                                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step === s ? "bg-[#B8960C] text-white" : i < ["address", "payment", "confirmation"].indexOf(step) ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"}`}
                                >
                                    {i < ["address", "payment", "confirmation"].indexOf(step) ? (
                                        <Check size={12} />
                                    ) : (
                                        i + 1
                                    )}
                                </div>
                                <span
                                    className={
                                        step === s
                                            ? "font-bold text-[#B8960C]"
                                            : "text-gray-400 capitalize"
                                    }
                                >
                                    {s}
                                </span>
                                {i < 2 && <ChevronRight size={14} className="text-gray-300" />}
                            </div>
                        ),
                    )}
                </div>
            </div>

            {/* ── Main Layout ── */}
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[1fr_380px]">
                {/* LEFT – Address + Payment */}
                <div className="space-y-4">
                    {/* ════ DELIVERY ADDRESS CARD ════ */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                        {/* Header row */}
                        <div className="flex items-center justify-between border-b border-gray-50 px-5 py-4">
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-[#B8960C]" />
                                <h2 className="font-bold text-gray-800">Delivery Address</h2>
                            </div>
                            <button
                                onClick={() => {
                                    setShowPanel((p) => !p);
                                    setEditingId(null);
                                }}
                                className="flex items-center gap-1.5 text-xs font-semibold text-[#B8960C] hover:underline"
                            >
                                {showPanel ? <X size={13} /> : <Pencil size={13} />}
                                {showPanel ? "Done" : "Change"}
                            </button>
                        </div>

                        {/* ── Collapsed: show selected address summary ── */}
                        {!showPanel && selectedAddr && (
                            <div className="px-5 py-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#faeeb1] text-sm font-bold text-[#B8960C]">
                                        {selectedAddr.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="font-bold text-gray-800">
                                                {selectedAddr.name}
                                            </p>
                                            <LabelBadge label={selectedAddr.label} />
                                        </div>
                                        <p className="mt-0.5 text-sm text-gray-600">
                                            {selectedAddr.line1}
                                            {selectedAddr.line2 ? `, ${selectedAddr.line2}` : ""}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {selectedAddr.city}, {selectedAddr.state} —{" "}
                                            {selectedAddr.pin}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {selectedAddr.phone}
                                        </p>
                                    </div>
                                    {/* Quick-edit the selected address */}
                                    <button
                                        onClick={() => {
                                            setShowPanel(true);
                                            openEdit(selectedAddr);
                                        }}
                                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-[#fdfcf5] hover:text-[#B8960C]"
                                        title="Edit address"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Expanded panel: list + forms ── */}
                        {showPanel && (
                            <div className="space-y-3 px-5 py-4">
                                {/* Saved addresses */}
                                {addresses.map((addr) => (
                                    <div key={addr.id}>
                                        {/* Address card (not in edit mode) */}
                                        {editingId !== addr.id && (
                                            <label
                                                className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all ${selectedAddrId === addr.id
                                                    ? "border-[#B8960C] bg-[#fdfcf5]"
                                                    : "border-gray-100 hover:border-gray-200"
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    checked={selectedAddrId === addr.id}
                                                    onChange={() => setSelectedAddrId(addr.id)}
                                                    className="mt-1 shrink-0 accent-[#B8960C]"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="text-sm font-bold text-gray-800">
                                                            {addr.name}
                                                        </span>
                                                        <LabelBadge label={addr.label} />
                                                    </div>
                                                    <p className="mt-0.5 truncate text-xs text-gray-600">
                                                        {addr.line1}
                                                        {addr.line2 ? `, ${addr.line2}` : ""}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        {addr.city}, {addr.state} — {addr.pin}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-gray-500">
                                                        {addr.phone}
                                                    </p>
                                                </div>

                                                {/* Edit / Delete actions */}
                                                <div className="flex shrink-0 flex-col gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            openEdit(addr);
                                                        }}
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-[#faeeb1] hover:text-[#B8960C]"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={13} />
                                                    </button>
                                                    {addresses.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                deleteAddr(addr.id);
                                                            }}
                                                            className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                                            title="Delete"
                                                        >
                                                            <X size={13} />
                                                        </button>
                                                    )}
                                                </div>
                                            </label>
                                        )}

                                        {/* Inline edit form */}
                                        {editingId === addr.id && (
                                            <div className="space-y-3 rounded-xl border-2 border-[#B8960C] bg-[#fdfcf5] p-4">
                                                <p className="text-sm font-bold text-gray-800">
                                                    Edit Address
                                                </p>
                                                <AddressForm
                                                    data={formData}
                                                    errors={formErrors}
                                                    onChange={setFormData}
                                                />
                                                <div className="flex gap-2 pt-1">
                                                    <button
                                                        onClick={saveAddress}
                                                        className="flex-1 rounded-xl bg-[#B8960C] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#9a7c0a]"
                                                    >
                                                        Save Address
                                                    </button>
                                                    <button
                                                        onClick={cancelForm}
                                                        className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Add new address */}
                                {editingId !== "new" ? (
                                    <button
                                        onClick={openAdd}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 py-3 text-sm font-semibold text-gray-500 transition-all hover:border-[#B8960C] hover:bg-[#fdfcf5] hover:text-[#B8960C]"
                                    >
                                        <Plus size={16} /> Add New Address
                                    </button>
                                ) : (
                                    <div className="space-y-3 rounded-xl border-2 border-[#B8960C] bg-[#fdfcf5] p-4">
                                        <p className="text-sm font-bold text-gray-800">
                                            New Address
                                        </p>
                                        <AddressForm
                                            data={formData}
                                            errors={formErrors}
                                            onChange={setFormData}
                                        />
                                        <div className="flex gap-2 pt-1">
                                            <button
                                                onClick={saveAddress}
                                                className="flex-1 rounded-xl bg-[#B8960C] py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#9a7c0a]"
                                            >
                                                Save Address
                                            </button>
                                            <button
                                                onClick={cancelForm}
                                                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ════ PAYMENT METHODS ════ */}
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-gray-50 px-5 py-4">
                            <Lock size={16} className="text-green-500" />
                            <h2 className="font-bold text-gray-800">Payment Method</h2>
                            <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
                                <ShieldCheck size={12} className="text-green-500" /> Secure
                            </span>
                        </div>

                        <div className="flex overflow-x-auto border-b border-gray-100">
                            {(
                                [
                                    { id: "upi", label: "UPI", icon: Smartphone },
                                    { id: "netbanking", label: "Net Banking", icon: Building2 },
                                ] as { id: PaymentMethod; label: string; icon: any }[]
                            ).map(({ id, label, icon: Icon }) => (
                                <button
                                    key={id}
                                    onClick={() => setPaymentMethod(id)}
                                    className={`flex min-w-[90px] flex-1 flex-col items-center gap-1.5 border-b-2 py-3.5 text-xs font-semibold transition-all ${paymentMethod === id ? "border-[#B8960C] bg-[#fdfcf5] text-[#B8960C]" : "border-transparent text-gray-500 hover:bg-gray-50"}`}
                                >
                                    <Icon size={18} />
                                    <span>{label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="p-5">
                            {/* UPI */}
                            {paymentMethod === "upi" && (
                                <div className="space-y-4">
                                    <p className="mb-3 text-sm font-semibold text-gray-700">
                                        Select UPI App
                                    </p>
                                    <div className="grid grid-cols-4 gap-3">
                                        {upiApps.map((app) => (
                                            <button
                                                key={app.id}
                                                onClick={() => setSelectedUpiApp(app.id)}
                                                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all ${selectedUpiApp === app.id ? "border-[#B8960C] bg-[#fdfcf5]" : "border-gray-100 hover:border-gray-200"}`}
                                            >
                                                <div
                                                    className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white"
                                                    style={{ backgroundColor: app.color }}
                                                >
                                                    {app.letter}
                                                </div>
                                                <span className="text-center text-xs leading-tight font-medium text-gray-600">
                                                    {app.name}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    <div className="mt-4 border-t border-dashed border-gray-200 pt-4">
                                        <p className="mb-2 text-sm font-semibold text-gray-900">
                                            Or enter UPI ID
                                        </p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={upiId}
                                                onChange={(e) => setUpiId(e.target.value)}
                                                placeholder="yourname@upi"
                                                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-black focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C]/30 focus:outline-none"
                                            />
                                            <button className="rounded-xl bg-[#B8960C] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#9a7c0a]">
                                                Verify
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* NET BANKING */}
                            {paymentMethod === "netbanking" && (
                                <div>
                                    <label className="mb-2 block text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                        Select Your Bank
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={selectedBank}
                                            onChange={(e) => setSelectedBank(e.target.value)}
                                            className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-black focus:border-[#B8960C] focus:ring-1 focus:ring-[#B8960C]/30 focus:outline-none"
                                        >
                                            {banks.map((b) => (
                                                <option key={b} value={b}>
                                                    {b}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown
                                            size={16}
                                            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-400"
                                        />
                                    </div>
                                    <p className="mt-3 text-xs text-gray-400">
                                        You will be redirected to your bank&apos;s secure payment
                                        page.
                                    </p>
                                </div>
                            )}

                            {/* WALLET */}
                            {paymentMethod === "wallet" && (
                                <div className="space-y-3">
                                    <p className="mb-3 text-sm font-semibold text-gray-700">
                                        Select Wallet
                                    </p>
                                    {wallets.map((w) => (
                                        <label
                                            key={w.id}
                                            className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-3.5 transition-all ${selectedWallet === w.id ? "border-[#B8960C] bg-[#fdfcf5]" : "border-gray-100 hover:border-gray-200"}`}
                                        >
                                            <input
                                                type="radio"
                                                checked={selectedWallet === w.id}
                                                onChange={() => setSelectedWallet(w.id)}
                                                className="accent-[#B8960C]"
                                            />
                                            <div
                                                className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
                                                style={{ backgroundColor: w.color }}
                                            >
                                                {w.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-semibold text-gray-700">
                                                {w.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Session alert */}
                    {timeLeft <= 60 && (
                        <div className="flex animate-pulse items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>
                                ⚠️ Only <strong>{formatTime(timeLeft)}</strong> left! Complete
                                payment or cart will be cleared.
                            </span>
                        </div>
                    )}
                </div>

                {/* RIGHT – Order Summary */}
                <div className="space-y-4">
                    <div className="sticky top-24 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                        <div className="flex items-center gap-2 border-b border-gray-50 px-5 py-4">
                            <Package size={16} className="text-[#B8960C]" />
                            <h2 className="font-bold text-gray-800">Order Summary</h2>
                            <span className="ml-auto text-xs text-gray-400">
                                {items.reduce((s, i) => s + i.quantity, 0)} items
                            </span>
                        </div>

                        {/* Items */}
                        <div className="max-h-56 space-y-3 overflow-y-auto px-5 py-3">
                            {items.map((item) => (
                                <div key={item.weight} className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50">
                                        <Image
                                            src={coinImages[item.weight]}
                                            alt="Gold"
                                            width={36}
                                            height={36}
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-xs font-bold text-gray-800">
                                            {item.weight}g Gold Bar (24K)
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Qty: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="shrink-0 text-sm font-bold text-gray-800">
                                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="space-y-2.5 border-t border-dashed border-gray-200 px-5 py-4">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal ({totalWeight}g gold)</span>
                                <span>
                                    ₹
                                    {subtotal.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>GST ({GST_RATE}%)</span>
                                <span>
                                    ₹{gst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Delivery</span>
                                <span className="font-semibold text-gray-600">
                                    {DELIVERY_CHARGE}
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold text-gray-900">
                                <span>Total Amount</span>
                                <span className="text-[#B8960C]">
                                    ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {/* Pay button */}
                        <div className="px-5 pb-5">
                            <button
                                onClick={handlePay}
                                disabled={paying || sessionExpired || timeLeft === 0}
                                className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-bold shadow-lg transition-all ${timeLeft === 0 || sessionExpired
                                    ? "cursor-not-allowed bg-gray-200 text-gray-400 shadow-none"
                                    : "bg-gradient-to-r from-[#B8960C] to-[#D4AF37] text-white hover:scale-[1.01] hover:shadow-[#B8960C]/30"
                                    }`}
                            >
                                {paying ? (
                                    <>
                                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Processing...
                                    </>
                                ) : timeLeft === 0 ? (
                                    <>
                                        <Lock size={18} />
                                        Session Expired
                                    </>
                                ) : (
                                    <>
                                        <Lock size={16} />
                                        Pay ₹
                                        {total.toLocaleString("en-IN", {
                                            maximumFractionDigits: 0,
                                        })}
                                    </>
                                )}
                            </button>

                            {/* Trust badges */}
                            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                    <ShieldCheck size={12} className="text-green-500" />
                                    Secure
                                </span>
                                <span className="flex items-center gap-1">
                                    <Lock size={12} className="text-blue-400" />
                                    Encrypted
                                </span>
                                <span className="flex items-center gap-1">
                                    <Truck size={12} className="text-[#B8960C]" />
                                    Insured
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Assurance */}
                    <div className="space-y-2 rounded-2xl border border-[#faeeb1] bg-gradient-to-br from-[#fdfcf5] to-white p-4 text-sm text-gray-600">
                        {[
                            "24K certified gold — 999 purity",
                            "Tamper-proof packaging & insured delivery",
                            "Easy buyback at live market rates",
                            "7-day return & quality guarantee",
                        ].map((t) => (
                            <div key={t} className="flex items-center gap-2">
                                <CheckCircle2 size={14} className="shrink-0 text-green-500" />
                                <span>{t}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
