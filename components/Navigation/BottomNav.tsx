import {
    Home,
    Wallet,
    User,
    Plus,
    Coins,
    Target,
    Gift,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();
    const [showQuickMenu, setShowQuickMenu] = useState(false);

    const isActive = (path: string) => pathname === path;

    return (
        <>
            {/* ================= QUICK ACTION MENU ================= */}
            {showQuickMenu && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 lg:hidden"
                    onClick={() => setShowQuickMenu(false)}
                >
                    <div
                        className="absolute right-6 bottom-24 w-64 rounded-2xl bg-gray-50 p-2 shadow-2xl dark:bg-neutral-800 dark:shadow-neutral-900/50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Link
                            href="/buy-sell?metal=gold&action=buy"
                            onClick={() => setShowQuickMenu(false)}
                            className="flex w-full items-center gap-3 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-neutral-700/50"
                        >
                            <div className="rounded-lg bg-[#3D3066] p-2 text-white">
                                <Coins className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-gray-900 dark:text-white">Buy Gold</p>
                                <p className="text-xs text-gray-500 dark:text-neutral-400">
                                    Purchase at live rates
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/gold-goals"
                            onClick={() => setShowQuickMenu(false)}
                            className="flex w-full items-center gap-3 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-neutral-700/50"
                        >
                            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-2 text-white">
                                <Target className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-gray-900 dark:text-white">Create Goal</p>
                                <p className="text-xs text-gray-500 dark:text-neutral-400">
                                    Set savings target
                                </p>
                            </div>
                        </Link>

                        <Link
                            href="/gift-gold"
                            onClick={() => setShowQuickMenu(false)}
                            className="flex w-full items-center gap-3 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-neutral-700/50"
                        >
                            <div className="rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 p-2 text-white">
                                <Gift className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-gray-900 dark:text-white">Gift Gold</p>
                                <p className="text-xs text-gray-500 dark:text-neutral-400">
                                    Send to loved ones
                                </p>
                            </div>
                        </Link>

                        <div className="my-2 border-t border-gray-200 dark:border-neutral-700"></div>

                        <button
                            onClick={() => setShowQuickMenu(false)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl p-3 text-sm text-gray-600 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-700/50"
                        >
                            <X className="h-4 w-4" />
                            <span>Close</span>
                        </button>
                    </div>
                </div>
            )}

            {/* ================= FLOATING ACTION BUTTON ================= */}
            <button
                onClick={() => router.push("/buy-sell?metal=gold&action=buy")}
                className="
fixed left-1/2 bottom-8 z-2 -translate-x-1/2
h-13 w-13 rounded-[20px]
flex flex-col items-center justify-center
  bg-gradient-to-b from-white via-[#faf3d6] to-[#f7eac8] border border-[#ead69c] shadow-sm
text-[11px] font-medium tracking-wide text-[#8B4513]/60 
border-2 border-[#8B4513]/10 
lg:hidden shadow-2xl
sm:h-20 sm:w-24 sm:text-medium
"
            >
                <span>BUY</span>
                <span>NOW</span>
            </button>

            {/* ================= BOTTOM NAV ================= */}
            <div className="fixed right-0 bottom-0 left-0 z-1 border-t border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 lg:hidden">
                <div className="w-full px-2 py-1">
                    <div className="flex items-center justify-around">
                        {[
                            { path: "/home", icon: Home, label: "Home" },
                            { path: "/wallet", icon: Wallet, label: "Wallet" },
                            { path: "/gift-gold", icon: Gift, label: "Gift" },
                            { path: "/profile", icon: User, label: "Profile" },
                        ].map((item, index) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors
            ${index === 1 ? "mr-15" : ""}   /* 👈 small space after Wallet */
            ${isActive(item.path)
                                        ? "bg-[#F3F1F7] text-[#3D3066] dark:bg-neutral-700 dark:text-white"
                                        : "text-gray-600 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-700/50"
                                    }`}
                            >
                                <item.icon className="h-4 w-4" />
                                <span className="text-xs">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}