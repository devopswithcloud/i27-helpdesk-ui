"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastProps {
    message: string;
    type?: ToastType;
    duration?: number;
    onClose: () => void;
}

const icons = {
    success: <CheckCircle2 size={20} className="text-emerald-500" />,
    error: <XCircle size={20} className="text-red-500" />,
    info: <AlertCircle size={20} className="text-blue-500" />,
};

const borderColors = {
    success: "border-l-emerald-500",
    error: "border-l-red-500",
    info: "border-l-blue-500",
};

export default function Toast({
    message,
    type = "info",
    duration = 4000,
    onClose,
}: ToastProps) {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(onClose, 300);
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="fixed top-6 right-6 z-50">
            <div
                className={`
          flex items-center gap-3 bg-white border border-gray-200 border-l-4
          ${borderColors[type]} rounded-lg shadow-modal px-4 py-3
          min-w-[320px] max-w-[420px]
          ${exiting ? "animate-toast-out" : "animate-toast-in"}
        `}
            >
                {icons[type]}
                <p className="text-sm text-gray-700 flex-1">{message}</p>
                <button
                    onClick={() => {
                        setExiting(true);
                        setTimeout(onClose, 300);
                    }}
                    className="p-1 rounded hover:bg-gray-100 transition-colors"
                >
                    <X size={14} className="text-gray-400" />
                </button>
            </div>
        </div>
    );
}
