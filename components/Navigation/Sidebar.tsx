import {
  Home,
  Wallet,
  MapPin,
  Banknote,
  User,
  Coins,
  Target,
  Gift,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setRole(user.role);
      } catch (e) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);

  const navItems = [
    { path: "/home", icon: Home, label: "Home" },
    { path: "/wallet", icon: Wallet, label: "Wallet" },
    { path: "/partners", icon: MapPin, label: "Partners" },
    // Loan Section is Diable for now ,  SERVICE UNDER DEVELOPMENT  
    // { path: "/loans", icon: Banknote, label: "Loans" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  if (role === "ADMIN") {
    navItems.push({ path: "/users", icon: User, label: "Users" });
  }

  return (
    <div
      className={`fixed top-0 left-0 hidden h-full min-h-screen flex-col border-r border-gray-200  bg-gray-50 transition-all duration-300 lg:flex dark:border-neutral-700 dark:bg-neutral-800 ${collapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Sidebar Header */}
      <div className="border-b border-gray-200 p-6 dark:border-neutral-700">
        {!collapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F2EAD3]">
              <Coins className="h-6 w-6 text-[#1a1a2e]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Zold Wallet
              </h1>
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                Digital Gold Platform
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEC762]">
              <Coins className="h-6 w-6 text-[#1a1a2e]" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      {navItems.map((item) => {
        const isDisabled = false;

        return isDisabled ? (
          <div
            key={item.path}
            title="Coming soon"
            className="flex w-full cursor-not-allowed items-center gap-3 rounded-lg p-3 text-gray-400 opacity-60"
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && (
              <span className="font-medium">{item.label}</span>
            )}
          </div>
        ) : (
          <Link
            key={item.path}
            href={item.path}
            className={`group flex w-full items-center gap-3 rounded-lg px-4 py-3 
transition-all duration-200 ease-in-out
  ${isActive(item.path)
                ? " bg-gradient-to-r from-white via-[#f6e8bd] to-[#f1dda5] text-gray-900 shadow-md scale-[1.02] dark:from-[#F4C430]/30 dark:to-[#E6B800]/20 dark:text-[#FFD54F]"
                : "text-gray-700 hover:bg-gray-100 hover:shadow-sm dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
          >
            <item.icon
              className={`h-5 w-5 shrink-0 transition-all duration-200 ${isActive(item.path)
                ? "text-[#8B6B00] dark:text-[#FFD54F]"
                : "group-hover:text-gray-900 dark:group-hover:text-white"
                }`}
            />

            {!collapsed && (
              <span
                className={`transition-all duration-200 ${isActive(item.path)
                  ? "font-semibold tracking-wide"
                  : "font-medium"
                  }`}
              >
                {item.label}
              </span>
            )}
          </Link>
        );
      })}


      {/* Quick Actions in Sidebar */}
      <div className="border-t border-gray-200 p-4 dark:border-neutral-700">
        {!collapsed && (
          <h3 className="mb-3 text-xs font-semibold text-gray-500 uppercase dark:text-white">
            Quick Actions
          </h3>
        )}
        <div className="space-y-2">
          <Link
            href="/buy-sell?metal=gold&action=buy"
            className={`flex w-full items-center bg-gradient-to-r from-[#F5D97A] to-[#D4AF37] ${!collapsed ? "gap-3" : "justify-center"
              } rounded-lg bg-[#FCDE5B] p-3 font-semibold text-[#1a1a2e] shadow-md transition-all hover:bg-[#f5d347] hover:shadow-lg`}
            title="Buy Gold"
          >
            <Coins className="h-5 w-5" />
            {!collapsed && <span className="font-medium">Buy Gold</span>}
          </Link>
          <Link
            href="/gold-goals"
            className={`flex w-full items-center ${!collapsed ? "gap-3" : "justify-center"
              } rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-[#B8860B] hover:bg-[#FCDE5B]/5 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:border-[#FCDE5B]`}
            title="Create Goal"
          >
            <Target className="h-5 w-5 text-gray-600 dark:text-neutral-300" />
            {!collapsed && (
              <span className="font-medium text-gray-700 dark:text-white">
                Create Goal
              </span>
            )}
          </Link>
          <Link
            href="/gift-gold"
            className={`flex w-full items-center ${!collapsed ? "gap-3" : "justify-center"
              } rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:border-[#B8860B] hover:bg-[#FCDE5B]/5 dark:border-neutral-600 dark:bg-neutral-800 dark:hover:border-[#FCDE5B]`}
            title="Gift Gold"
          >
            <Gift className="h-5 w-5 text-gray-600 dark:text-neutral-300" />
            {!collapsed && (
              <span className="font-medium text-gray-700 dark:text-white">
                Gift Gold
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Sidebar Toggle */}
      <div className="border-t border-gray-200 p-3 dark:border-neutral-700">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center gap-3 rounded-lg p-2 text-gray-900 transition-colors bg-transparent
  hover:bg-gradient-to-r
  hover:from-[#EEC762]
  hover:to-[#C89E3D]
  transition-all duration-300  dark:text-neutral-400 dark:hover:bg-neutral-700/50"
        >
          <Menu className="h-5 w-5" />
          {!collapsed && <span className="font-medium">Collapse Menu</span>}
        </button>
      </div>
    </div>
  );
}
