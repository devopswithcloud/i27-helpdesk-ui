"use client";

import { X, Bell } from "lucide-react";

interface NotificationsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-xl shadow-2xl z-[70] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Bell size={18} className="text-primary-500" />
                        Notifications
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon</h3>
                    <p className="text-sm text-gray-500">
                        Notifications will be implemented in the coming days. Stay tuned for updates!
                    </p>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="btn-primary text-sm px-4 py-2"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </>
    );
}
