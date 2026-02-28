import { Skeleton } from "@/components/ui/skeleton";

export function PartnersTabSkeleton() {
    return (
        <div className="min-h-screen pb-6 dark:bg-neutral-900">
            {/* Header */}
            <div className="rounded-b-3xl bg-neutral-100 px-6 pt-6 pb-6 dark:bg-neutral-800">
                <Skeleton className="mb-4 h-8 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />

                {/* Search Bar */}
                <Skeleton className="mb-4 h-12 w-full rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />

                {/* View Toggle */}
                <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                    <Skeleton className="h-10 flex-1 rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                </div>
            </div>

            <div className="mt-4 px-6 space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-700 dark:bg-neutral-800">
                        <div className="mb-3 flex items-start justify-between">
                            <div className="flex-1">
                                <Skeleton className="mb-2 h-5 w-48 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                <div className="mb-2 flex items-center gap-1">
                                    <Skeleton className="h-4 w-4 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                    <Skeleton className="h-4 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-6 w-12 rounded bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                    <Skeleton className="h-4 w-20 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                </div>
                            </div>
                        </div>

                        {/* Services */}
                        <div className="mb-3 flex gap-2">
                            <Skeleton className="h-6 w-16 rounded bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-6 w-20 rounded bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-6 w-12 rounded bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        </div>

                        {/* Button */}
                        <Skeleton className="h-10 w-full rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                    </div>
                ))}
            </div>
        </div>
    );
}
