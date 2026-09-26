interface PriorityBadgeProps {
    priority: string;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
    HIGH: {
        label: "High",
        className: "bg-priority-high-bg text-red-700 border-red-200",
    },
    MEDIUM: {
        label: "Medium",
        className: "bg-priority-medium-bg text-amber-700 border-amber-200",
    },
    LOW: {
        label: "Low",
        className: "bg-priority-low-bg text-emerald-700 border-emerald-200",
    },
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
    const config = priorityConfig[priority] || priorityConfig.MEDIUM;

    return (
        <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}
        >
            {priority === "HIGH" && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2L10 10H2L6 2Z" fill="currentColor" opacity="0.7" />
                </svg>
            )}
            {config.label}
        </span>
    );
}
