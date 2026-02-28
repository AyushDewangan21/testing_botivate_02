import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Wallet,
  MapPin,
  Banknote,
  User,
  Plus,
  Coins,
  Target,
  Gift,
  X,
  Menu,
} from "lucide-react";
import { HomeTab } from "./tabs/HomeTab";
import { WalletTab } from "./tabs/WalletTab";
import { PartnersTab } from "./tabs/PartnersTab";
import { LoansTab } from "./tabs/LoansTab";
import { ProfileTab } from "./tabs/ProfileTab";
import { UsersTab } from "./tabs/UsersTab";
import { BuySellFlow } from "./flows/BuySellFlow";
import { ManageSIPPage } from "./ManageSIPPage";
import { JewelleryFlow } from "./JewelleryPage";
import { SIPCalculator } from "./SIPCalculator";
import { ReferralProgram } from "./ReferralProgram";
import { GiftGold } from "./GiftGold";
import { AuspiciousDays } from "./AuspiciousDays";
import { GoldGoals } from "./GoldGoals";
import { ApplyLoan } from "./ApplyLoan";
import { ApplyLoanPage } from "./ApplyLoanPage";


type Tab = "home" | "wallet" | "partners" | "loans" | "profile" | "users";

interface MainAppProps {
  user: any;
}

export function MainApp({ user }: MainAppProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [showBuyFlow, setShowBuyFlow] = useState(false);
  const [showSellFlow, setShowSellFlow] = useState(false);
  type MetalType = "gold" | "silver";
  type ActionType = "buy" | "sell";
  const [tradeMetal, setTradeMetal] = useState<MetalType>("gold");
  const [tradeAction, setTradeAction] = useState<ActionType>("buy");
  const [showManageSIP, setShowManageSIP] = useState(false);
  const [showJewellery, setShowJewellery] = useState(false);
  const [showSIPCalculator, setShowSIPCalculator] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const [showGiftGold, setShowGiftGold] = useState(false);
  const [showAuspiciousDays, setShowAuspiciousDays] = useState(false);
  const [showGoldGoals, setShowGoldGoals] = useState(false);
  const [showApplyLoan, setShowApplyLoan] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showApplyLoanPage, setShowApplyLoanPage] = useState(false);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [isHomeTabLoading, setIsHomeTabLoading] = useState(true);

  // Check for desktop viewport
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
      setIsLoading(false); // Set loading to false after initial check
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  // Sync active tab with URL hash so refresh preserves selected tab
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash.replace("#", "");
    if (
      hash === "home" ||
      hash === "wallet" ||
      hash === "partners" ||
      hash === "loans" ||
      hash === "profile"
    ) {
      setActiveTab(hash as Tab);
    } else {
      // ensure starting page is home
      window.location.hash = "home";
      setActiveTab("home");
    }
  }, []);

  const goToTab = (tab: Tab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      try {
        window.history.replaceState(null, "", `#${tab}`);
      } catch (e) {
        window.location.hash = tab;
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("appState");
    router.push("/onboarding");
  };

  if (showBuyFlow || showSellFlow) {
    return (
      <BuySellFlow
        defaultMetal={tradeMetal}
        defaultAction={tradeAction}
        onClose={() => { setShowBuyFlow(false); setShowSellFlow(false); }}
      />
    );
  }
  if (showManageSIP) {
    return <ManageSIPPage onClose={() => setShowManageSIP(false)} />;
  }
  if (showJewellery) {
    return <JewelleryFlow onClose={() => setShowJewellery(false)} />;
  }



  // Show loading skeleton while checking viewport
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-neutral-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#3D3066] border-t-transparent"></div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeTab
            isLoading={isHomeTabLoading}
            onLoadingComplete={() => setIsHomeTabLoading(false)}
            onBuyGold={() => { setTradeMetal("gold"); setTradeAction("buy"); setShowBuyFlow(true); }}
            onSellGold={() => { setTradeMetal("gold"); setTradeAction("sell"); setShowSellFlow(true); }}
            onBuySilver={() => { setTradeMetal("silver"); setTradeAction("buy"); setShowBuyFlow(true); }}
            onSellSilver={() => { setTradeMetal("silver"); setTradeAction("sell"); setShowSellFlow(true); }}
            onJewellery={() => setShowJewellery(true)}
            onOpenSIPCalculator={() => setShowSIPCalculator(true)}
            onOpenReferral={() => setShowReferral(true)}
            onOpenGiftGold={() => setShowGiftGold(true)}
            onOpenAuspiciousDays={() => setShowAuspiciousDays(true)}
            onOpenGoldGoals={() => setShowGoldGoals(true)}
            onOpenWalletDetails={() => setShowWalletDetails(true)}
          />
        );
      case "wallet":
        return <WalletTab onOpenManageSIP={() => setShowManageSIP(true)} />;
      case "partners":
        return <PartnersTab isLoading={false} />;
      case "loans":
        return (
          <LoansTab
            isLoading={false}
            onOpenApplyLoan={() => setShowApplyLoan(true)}
            onOpenPartners={() => goToTab("partners")}
            onOpenApplyLoanpage={() => setShowApplyLoanPage(true)}
          />
        );
      case "profile":
        return <ProfileTab user={user} onLogout={handleLogout} />;
      case "users":
        return <UsersTab />;
      default:
        return null;
    }
  };

  const renderDesktopSidebar = () => (
    <div
      className={`fixed top-0 left-0 hidden h-full min-h-screen flex-col border-r border-gray-200 bg-gray-50 transition-all duration-300 lg:flex dark:border-neutral-700 dark:bg-neutral-800 ${sidebarCollapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Sidebar Header */}
      <div className="border-b border-gray-200 p-6 dark:border-neutral-700">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3D3066] dark:bg-[#4D3F7F]">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                Gold Wallet
              </h1>
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                Digital Gold Platform
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3D3066] dark:bg-[#4D3F7F]">
              <Coins className="h-6 w-6 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-4 custom_scrollbar">
        {[
          { id: "home", icon: Home, label: "Home" },
          { id: "wallet", icon: Wallet, label: "Wallet" },
          { id: "partners", icon: MapPin, label: "Partners" },
          { id: "loans", icon: Banknote, label: "Loans" },
          { id: "profile", icon: User, label: "Profile" },
          ...(user?.role === 'ADMIN' ? [{ id: "users", icon: User, label: "Users" }] : []),
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => goToTab(item.id as Tab)}
            className={`flex w-full items-center gap-3 rounded-lg p-3 transition-colors ${activeTab === item.id
              ? "bg-[#cebcf1] text-[#3D3066] dark:bg-neutral-700 dark:text-white"
              : "text-gray-700 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-700/50"
              }`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="font-medium">{item.label}</span>
            )}
          </button>
        ))}
      </nav>

      {/* Quick Actions in Sidebar - Always visible in both collapsed and expanded states */}
      <div className="border-t border-gray-200 p-4 dark:border-neutral-700">
        {!sidebarCollapsed && (
          <h3 className="mb-3 text-xs font-semibold text-gray-500 uppercase dark:text-white">
            Quick Actions
          </h3>
        )}
        <div className="space-y-2">
          <button
            onClick={() => { setTradeMetal("gold"); setTradeAction("buy"); setShowBuyFlow(true); }}
            className={`flex w-full items-center ${!sidebarCollapsed ? "gap-3" : "justify-center"} rounded-lg bg-[#3D3066] p-3 text-white transition-colors hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E9F]`}
            title="Buy Gold"
          >
            <Coins className="h-5 w-5" />
            {!sidebarCollapsed && <span className="font-medium">Buy Gold</span>}
          </button>
          <button
            onClick={() => setShowGoldGoals(true)}
            className={`flex w-full items-center ${!sidebarCollapsed ? "gap-3" : "justify-center"} rounded-lg border border-gray-300 p-3 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:hover:bg-neutral-700/50`}
            title="Create Goal"
          >
            <Target className="h-5 w-5 text-black dark:text-white" />
            {!sidebarCollapsed && (
              <span className="font-medium text-black dark:text-white">
                Create Goal
              </span>
            )}
          </button>
          <button
            onClick={() => setShowGiftGold(true)}
            className={`flex w-full items-center ${!sidebarCollapsed ? "gap-3" : "justify-center"} rounded-lg border border-gray-300 p-3 transition-colors hover:bg-gray-50 dark:border-neutral-600 dark:hover:bg-neutral-700/50`}
            title="Gift Gold"
          >
            <Gift className="h-5 w-5 text-black dark:text-white" />
            {!sidebarCollapsed && (
              <span className="font-medium text-black dark:text-white">
                Gift Gold
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar Toggle */}
      <div className="border-t border-gray-200 p-4 dark:border-neutral-700">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex w-full items-center justify-center gap-3 rounded-lg p-3 text-gray-600 transition-colors hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-700/50"
        >
          <Menu className="h-5 w-5" />
          {!sidebarCollapsed && (
            <span className="font-medium">Collapse Menu</span>
          )}
        </button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="flex min-h-screen dark:bg-neutral-900">
        {renderDesktopSidebar()}

        {/* Main content area - Full width for desktop */}
        <div
          className="min-h-screen flex-1 overflow-y-auto bg-gray-50 transition-all duration-300 dark:bg-neutral-900"
          style={{ marginLeft: sidebarCollapsed ? "5rem" : "16rem" }}
        >
          {/* Remove max-width constraint to use full width */}
          <div className="w-full px-3">{renderTabContent()}</div>
        </div>

        {/* Modals for Desktop */}
        {showSIPCalculator && (
          <SIPCalculator onClose={() => setShowSIPCalculator(false)} />
        )}
        {showReferral && (
          <ReferralProgram onClose={() => setShowReferral(false)} />
        )}
        {showGiftGold && <GiftGold onClose={() => setShowGiftGold(false)} />}
        {showAuspiciousDays && (
          <AuspiciousDays onClose={() => setShowAuspiciousDays(false)} />
        )}
        {showGoldGoals && (
          <GoldGoals
            onClose={() => setShowGoldGoals(false)}
            mode="view"
            onBuyGold={() => { setTradeMetal("gold"); setTradeAction("buy"); setShowBuyFlow(true); }}
          />
        )}
        {showApplyLoan && (
          <ApplyLoan
            isOpen={showApplyLoan}
            onClose={() => setShowApplyLoan(false)}
            eligibleGold={10.547}
            maxLoanAmount={47463}
            interestRate={9.5}
          />
        )}
        {showApplyLoanPage && (
          <ApplyLoanPage
            onBack={() => setShowApplyLoanPage(false)}
            goldPledged={10.547}
            loanAmount={47463}
            interestRate={9.5}
            tenureMonths={6}
          />
        )}
        {showWalletDetails && (
          <WalletTab onBack={() => setShowWalletDetails(false)} />
        )}
      </div>
    );
  }

  // Mobile/Tablet View with Dark Mode - Fixed full width issue
  return (
    <div className="min-h-screen bg-gray-50 pb-20 dark:bg-neutral-900">
      {/* Main Content - Removed max-width constraint for mobile */}
      <div className="w-full">
        {renderTabContent()}
      </div>

      {/* Modals */}
      {showSIPCalculator && (
        <SIPCalculator onClose={() => setShowSIPCalculator(false)} />
      )}
      {showReferral && (
        <ReferralProgram onClose={() => setShowReferral(false)} />
      )}
      {showGiftGold && <GiftGold onClose={() => setShowGiftGold(false)} />}
      {showAuspiciousDays && (
        <AuspiciousDays onClose={() => setShowAuspiciousDays(false)} />
      )}
      {showGoldGoals && (
        <GoldGoals
          onClose={() => setShowGoldGoals(false)}
          mode="view"
          onBuyGold={() => { setTradeMetal("gold"); setTradeAction("buy"); setShowBuyFlow(true); }}
        />
      )}
      {showApplyLoan && (
        <ApplyLoan
          isOpen={showApplyLoan}
          onClose={() => setShowApplyLoan(false)}
          eligibleGold={10.547}
          maxLoanAmount={47463}
          interestRate={9.5}
        />
      )}
      {showApplyLoanPage && (
        <ApplyLoanPage
          onBack={() => setShowApplyLoanPage(false)}
          goldPledged={10.547}
          loanAmount={47463}
          interestRate={9.5}
          tenureMonths={6}
        />
      )}
      {showWalletDetails && (
        <WalletTab onBack={() => setShowWalletDetails(false)} />
      )}

      {/* Quick Action Menu */}
      {showQuickMenu && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70"
          onClick={() => setShowQuickMenu(false)}
        >
          <div
            className="absolute right-6 bottom-24 w-64 rounded-2xl bg-gray-50 p-2 shadow-2xl dark:bg-neutral-800 dark:shadow-neutral-900/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setTradeMetal("gold");
                setTradeAction("buy");
                setShowBuyFlow(true);
                setShowQuickMenu(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-neutral-700/50"
            >
              <div className="rounded-lg bg-[#3D3066] p-2 text-white dark:bg-[#4D3F7F]">
                <Coins className="h-5 w-5" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white">Buy Gold</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  Purchase at live rates
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                setShowGoldGoals(true);
                setShowQuickMenu(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-neutral-700/50"
            >
              <div className="rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-2 text-white dark:from-blue-600 dark:to-cyan-600">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white">Create Goal</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  Set savings target
                </p>
              </div>
            </button>

            <button
              onClick={() => {
                setShowGiftGold(true);
                setShowQuickMenu(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-neutral-700/50"
            >
              <div className="rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 p-2 text-white dark:from-pink-600 dark:to-rose-600">
                <Gift className="h-5 w-5" />
              </div>
              <div>
                <p className="text-gray-900 dark:text-white">Gift Gold</p>
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  Send to loved ones
                </p>
              </div>
            </button>

            <div className="my-2 border-t border-gray-200 dark:border-neutral-700"></div>

            <button
              onClick={() => setShowQuickMenu(false)}
              className="flex w-full items-center justify-center gap-2 rounded-xl p-3 text-sm text-gray-600 transition-colors hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-700/50"
            >
              <X className="h-4 w-4" />
              <span>Close</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowQuickMenu(!showQuickMenu)}
        className={`fixed right-6 bottom-24 z-40 rounded-full bg-[#3D3066] p-4 text-white shadow-lg transition-all hover:scale-110 hover:bg-[#5C4E7F] dark:bg-[#4D3F7F] dark:shadow-neutral-900/50 dark:hover:bg-[#5C4E9F] ${showQuickMenu ? "rotate-45" : ""}`}
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Bottom Navigation */}
      <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="w-full px-2 py-2">
          <div className="flex items-center justify-around">
            <button
              onClick={() => goToTab("home")}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors ${activeTab === "home"
                ? "bg-[#F3F1F7] text-[#3D3066] dark:bg-neutral-700 dark:text-white"
                : "text-gray-600 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-700/50"
                }`}
            >
              <Home className="h-6 w-6" />
              <span className="text-xs">Home</span>
            </button>

            <button
              onClick={() => goToTab("wallet")}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors ${activeTab === "wallet"
                ? "bg-[#F3F1F7] text-[#3D3066] dark:bg-neutral-700 dark:text-white"
                : "text-gray-600 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-700/50"
                }`}
            >
              <Wallet className="h-6 w-6" />
              <span className="text-xs">Wallet</span>
            </button>

            <button
              onClick={() => goToTab("partners")}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors ${activeTab === "partners"
                ? "bg-[#F3F1F7] text-[#3D3066] dark:bg-neutral-700 dark:text-white"
                : "text-gray-600 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-700/50"
                }`}
            >
              <MapPin className="h-6 w-6" />
              <span className="text-xs">Partners</span>
            </button>

            <button
              onClick={() => goToTab("loans")}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors ${activeTab === "loans"
                ? "bg-[#F3F1F7] text-[#3D3066] dark:bg-neutral-700 dark:text-white"
                : "text-gray-600 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-700/50"
                }`}
            >
              <Banknote className="h-6 w-6" />
              <span className="text-xs">Loans</span>

            </button>

            <button
              onClick={() => goToTab("profile")}
              className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors ${activeTab === "profile"
                ? "bg-[#F3F1F7] text-[#3D3066] dark:bg-neutral-700 dark:text-white"
                : "text-gray-600 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-700/50"
                }`}
            >
              <User className="h-6 w-6" />
              <span className="text-xs">Profile</span>
            </button>

            {user?.role === 'ADMIN' && (
              <button
                onClick={() => goToTab("users")}
                className={`flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors ${activeTab === "users"
                  ? "bg-[#F3F1F7] text-[#3D3066] dark:bg-neutral-700 dark:text-white"
                  : "text-gray-600 hover:bg-gray-50 dark:text-neutral-400 dark:hover:bg-neutral-700/50"
                  }`}
              >
                <User className="h-6 w-6" />
                <span className="text-xs">Users</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}