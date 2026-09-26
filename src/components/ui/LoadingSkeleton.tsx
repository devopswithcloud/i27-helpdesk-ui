export function SkeletonRow({ cols = 5 }: { cols?: number }) {
    return (
        <tr className="border-b border-gray-100">
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="skeleton h-4 w-full max-w-[120px] rounded" />
                </td>
            ))}
        </tr>
    );
}

export function SkeletonCard() {
    return (
        <div className="card p-5">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="skeleton h-3 w-20 rounded mb-2" />
                    <div className="skeleton h-8 w-16 rounded" />
                </div>
                <div className="skeleton w-11 h-11 rounded-xl" />
            </div>
        </div>
    );
}

export function SkeletonBlock({ lines = 3 }: { lines?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={`skeleton h-4 rounded ${i === lines - 1 ? "w-2/3" : "w-full"
                        }`}
                />
            ))}
        </div>
    );
}

export function TableSkeleton({
    rows = 5,
    cols = 5,
}: {
    rows?: number;
    cols?: number;
}) {
    return (
        <div className="animate-fade-in">
            {Array.from({ length: rows }).map((_, i) => (
                <SkeletonRow key={i} cols={cols} />
            ))}
        </div>
    );
}
