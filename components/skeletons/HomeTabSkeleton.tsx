import { Skeleton } from "@/components/ui/skeleton";

export function HomeTabSkeleton() {
    return (
        <div className="min-h-screen pb-6 dark:bg-neutral-900">
            {/* Header Skeleton */}
            <div className="rounded-b-3xl bg-neutral-100 px-6 pt-6 pb-8 dark:bg-neutral-800">
                <div className="mb-6 flex items-center justify-between">
                    <Skeleton className="h-8 w-32 animate-pulse" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-9 animate-pulse rounded-full" />
                        <Skeleton className="h-9 w-9 animate-pulse rounded-full" />
                    </div>
                </div>

                {/* Live Gold Rates Skeleton */}
                <div className="animate-pulse rounded-2xl bg-gray-50 p-4 dark:bg-neutral-700">
                    <Skeleton className="mb-3 h-4 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Skeleton className="mb-1 h-3 w-20 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-5 w-24 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        </div>
                        <div>
                            <Skeleton className="mb-1 h-3 w-20 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-5 w-24 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                        <Skeleton className="h-4 w-4 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <Skeleton className="h-3 w-24 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                    </div>
                </div>
            </div>

            <div className="-mt-6 px-6">
                {/* Wallet Summary Card Skeleton */}
                <div className="mb-6 animate-pulse rounded-2xl bg-gray-50 p-6 shadow-lg dark:bg-neutral-800">
                    <div className="mb-4 flex items-center justify-between">
                        <Skeleton className="h-4 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <Skeleton className="h-5 w-5 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                    </div>
                    <div className="mb-2">
                        <Skeleton className="mb-1 h-3 w-16 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <Skeleton className="h-6 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                    </div>
                    <div className="mb-4">
                        <Skeleton className="mb-1 h-3 w-20 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <div className="flex items-baseline gap-2">
                            <Skeleton className="h-6 w-24 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-4 w-12 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-full rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                </div>

                {/* Price Chart Section Skeleton */}
                <div className="mb-6 animate-pulse rounded-2xl bg-gray-50 p-5 shadow-lg dark:bg-neutral-800">
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-5 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        </div>
                        <Skeleton className="h-4 w-16 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                    </div>

                    <div className="mb-4 flex gap-2">
                        <Skeleton className="h-8 w-12 rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <Skeleton className="h-8 w-12 rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <Skeleton className="h-8 w-12 rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <Skeleton className="h-8 w-12 rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                    </div>

                    <Skeleton className="h-48 w-full rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />

                    <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4 dark:border-neutral-700">
                        <div>
                            <Skeleton className="mb-1 h-3 w-12 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-4 w-16 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        </div>
                        <div>
                            <Skeleton className="mb-1 h-3 w-12 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-4 w-16 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        </div>
                        <div>
                            <Skeleton className="mb-1 h-3 w-12 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-4 w-16 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        </div>
                    </div>
                </div>

                {/* Quick Actions Skeleton */}
                <div className="mb-6">
                    <Skeleton className="mb-4 h-6 w-32 animate-pulse" />
                    <div className="space-y-3">
                        <Skeleton className="h-16 w-full animate-pulse rounded-xl bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <Skeleton className="h-16 w-full animate-pulse rounded-xl bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <div className="grid grid-cols-2 gap-3">
                            <Skeleton className="h-24 w-full animate-pulse rounded-xl bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-24 w-full animate-pulse rounded-xl bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="col-span-2 h-24 w-full animate-pulse rounded-xl bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}