interface StatusBadgeProps {
    status: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    OPEN: {
        label: "Open",
        className: "bg-status-open-bg text-amber-700 border-amber-200",
    },
    IN_PROGRESS: {
        label: "In Progress",
        className: "bg-status-progress-bg text-blue-700 border-blue-200",
    },
    RESOLVED: {
        label: "Resolved",
        className: "bg-status-resolved-bg text-emerald-700 border-emerald-200",
    },
    CLOSED: {
        label: "Closed",
        className: "bg-status-closed-bg text-gray-600 border-gray-200",
    },
};

const dotColor: Record<string, string> = {
    OPEN: "bg-status-open",
    IN_PROGRESS: "bg-status-progress",
    RESOLVED: "bg-status-resolved",
    CLOSED: "bg-status-closed",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.OPEN;
    const dot = dotColor[status] || dotColor.OPEN;

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
            {config.label}
        </span>
    );
}
