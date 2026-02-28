import { Skeleton } from "@/components/ui/skeleton";

export function ProfileTabSkeleton() {
    return (
        <div className="min-h-screen pb-6 dark:bg-neutral-900">
            {/* Header */}
            <div className="rounded-b-3xl bg-neutral-100 px-6 pt-6 pb-8 dark:bg-neutral-800">
                <Skeleton className="mb-6 h-8 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />

                {/* User Info Card */}
                <div className="rounded-2xl bg-gray-50 p-5 dark:bg-neutral-700">
                    <div className="mb-4 flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-full bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        <div className="flex-1">
                            <Skeleton className="mb-2 h-5 w-48 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                            <Skeleton className="h-4 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        </div>
                    </div>
                    <Skeleton className="h-12 w-full rounded-lg bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                </div>
            </div>

            <div className="-mt-4 px-6 space-y-4">
                {/* Sections */}
                {[1, 2, 3, 4].map((section) => (
                    <div key={section} className="overflow-hidden rounded-2xl bg-gray-50 shadow-lg dark:bg-neutral-800">
                        <div className="border-b border-gray-100 p-4 dark:border-neutral-700">
                            <Skeleton className="h-5 w-32 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                        </div>
                        <div>
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex items-center justify-between border-t border-gray-100 px-4 py-4 dark:border-neutral-700">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-5 w-5 rounded bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                        <Skeleton className="h-4 w-40 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                    </div>
                                    <Skeleton className="h-5 w-5 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Logout Button */}
                <Skeleton className="h-14 w-full rounded-xl bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />

                {/* Footer */}
                <div className="flex justify-center mt-6">
                    <Skeleton className="h-4 w-48 bg-gradient-to-r from-[#F3F1F7] via-[#E2DFEB] to-[#F3F1F7]" />
                </div>
            </div>
        </div>
    );
}
