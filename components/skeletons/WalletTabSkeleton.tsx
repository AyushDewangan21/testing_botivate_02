import { Skeleton } from "@/components/ui/skeleton";

export function WalletTabSkeleton() {
    return (
        <div className="min-h-screen pb-6 dark:bg-neutral-900">
            {/* Header */}
            <div className="rounded-b-3xl bg-neutral-100 px-6 pt-6 pb-8 dark:bg-neutral-800">
                <div className="mb-6 flex items-center gap-4">
                    <Skeleton className="h-8 w-32 animate-pulse" />
                </div>

                {/* Wallet Overview */}
                <div className="rounded-2xl bg-gray-50 p-6 dark:bg-neutral-700">
                    <div className="mb-6">
                        <Skeleton className="mb-2 h-4 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <Skeleton className="mb-2 h-8 w-48 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <Skeleton className="h-4 w-24 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <Skeleton className="mb-1 h-3 w-24 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-5 w-28 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        </div>
                        <div>
                            <Skeleton className="mb-1 h-3 w-20 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <div className="flex items-center gap-1">
                                <Skeleton className="h-4 w-4 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                <Skeleton className="h-4 w-20 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            </div>
                        </div>
                    </div>

                    {/* Period Selector */}
                    <div className="mb-4 flex gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-8 w-12 rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        ))}
                    </div>

                    {/* Graph Placeholder */}
                    <Skeleton className="h-32 w-full rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                </div>
            </div>

            <div className="-mt-4 px-6">
                {/* Breakdown Section */}
                <div className="mb-6 rounded-2xl bg-gray-50 p-4 shadow-lg dark:bg-neutral-800">
                    <Skeleton className="mb-4 h-6 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-neutral-700">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                    <div>
                                        <Skeleton className="mb-1 h-4 w-24 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                        <Skeleton className="h-3 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                    </div>
                                </div>
                                <Skeleton className="h-5 w-16 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* SIP Status */}
                <Skeleton className="mb-6 h-28 w-full rounded-xl bg-gradient-to-r from-[#c  6b1f2] via-[#e5defc] to-[#F3F1F7]" />

                {/* Transactions */}
                <div className="rounded-2xl bg-gray-50 p-4 shadow-lg dark:bg-neutral-800">
                    <div className="mb-4 flex items-center justify-between">
                        <Skeleton className="h-6 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <Skeleton className="h-5 w-24 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                    </div>

                    {/* Search Bar */}
                    <Skeleton className="mb-4 h-10 w-full rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />

                    {/* Filter Tabs */}
                    <div className="mb-4 flex gap-2 overflow-hidden">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-8 w-20 rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        ))}
                    </div>

                    {/* Transaction List */}
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between rounded-lg p-2">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-10 w-10 rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                    <div>
                                        <Skeleton className="mb-1 h-4 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                        <Skeleton className="h-3 w-24 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <Skeleton className="mb-1 h-4 w-20 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                    <Skeleton className="h-3 w-16 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
