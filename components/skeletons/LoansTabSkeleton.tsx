import { Skeleton } from "@/components/ui/skeleton";

export function LoansTabSkeleton() {
    return (
        <div className="min-h-screen pb-6 dark:bg-neutral-900">
            {/* Header */}
            <div className="rounded-b-3xl bg-neutral-100 px-6 pt-6 pb-8 dark:bg-neutral-800">
                <Skeleton className="mb-4 h-8 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />

                {/* Hero Banner */}
                <div className="rounded-2xl bg-gray-50 p-6 dark:bg-neutral-700">
                    <div className="mb-4 flex items-start justify-between">
                        <div>
                            <Skeleton className="mb-2 h-4 w-48 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="mb-2 h-6 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-4 w-40 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        </div>
                        <Skeleton className="h-12 w-12 rounded bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                    </div>
                    <Skeleton className="h-10 w-32 rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                </div>
            </div>

            <div className="-mt-4 px-6">
                {/* Tab Selector */}
                <Skeleton className="mb-6 h-12 w-full rounded-xl bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />

                <div className="space-y-6">
                    {/* Apply Options */}
                    <div>
                        <Skeleton className="mb-4 h-6 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <div className="space-y-3">
                            {[1, 2].map((i) => (
                                <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-700 dark:bg-neutral-800">
                                    <div className="mb-4 flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-2 flex items-center gap-2">
                                                <Skeleton className="h-5 w-5 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                                <Skeleton className="h-5 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                            </div>
                                            <Skeleton className="mb-3 h-4 w-full bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                            <div className="mb-4 space-y-2">
                                                <Skeleton className="h-4 w-full bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                                <Skeleton className="h-4 w-full bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                            </div>
                                        </div>
                                    </div>
                                    <Skeleton className="h-12 w-full rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Calculator Skeleton */}
                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 dark:border-neutral-700 dark:bg-neutral-800">
                        <Skeleton className="mb-4 h-6 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <div className="space-y-4">
                            <Skeleton className="h-16 w-full rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-16 w-full rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-32 w-full rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-12 w-full rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
