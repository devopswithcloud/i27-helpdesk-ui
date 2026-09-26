import { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: number | string;
    icon: LucideIcon;
    color: "navy" | "amber" | "emerald" | "gray" | "red";
    trend?: string;
}

const colorMap = {
    navy: {
        iconBg: "bg-blue-50",
        iconText: "text-[#051C36]",
        valueBg: "text-[#051C36]",
    },
    amber: {
        iconBg: "bg-amber-50",
        iconText: "text-amber-600",
        valueBg: "text-amber-700",
    },
    emerald: {
        iconBg: "bg-emerald-50",
        iconText: "text-emerald-600",
        valueBg: "text-emerald-700",
    },
    gray: {
        iconBg: "bg-gray-100",
        iconText: "text-gray-600",
        valueBg: "text-gray-700",
    },
    red: {
        iconBg: "bg-red-50",
        iconText: "text-red-600",
        valueBg: "text-red-700",
    },
};

export default function StatCard({
    label,
    value,
    icon: Icon,
    color,
    trend,
}: StatCardProps) {
    const colors = colorMap[color];

    return (
        <div className="card p-5 hover:shadow-card-hover transition-all duration-200">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                    <p className={`text-3xl font-bold ${colors.valueBg}`}>{value}</p>
                    {trend && (
                        <p className="text-xs text-gray-400 mt-1.5">{trend}</p>
                    )}
                </div>
                <div
                    className={`w-11 h-11 rounded-xl ${colors.iconBg} flex items-center justify-center`}
                >
                    <Icon size={22} className={colors.iconText} />
                </div>
            </div>
        </div>
    );
}
