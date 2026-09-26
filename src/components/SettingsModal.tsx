"use client";

import { X, User, Mail, Shield } from "lucide-react";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

export default function SettingsModal({ isOpen, onClose, user }: SettingsModalProps) {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 z-[60]" onClick={onClose} />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-2xl z-[70] overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="space-y-6">
                        {/* User Profile Section */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-4">Profile Details</h3>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <User size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Full Name</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {user?.fullName || "Not available"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Email Address</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {user?.email || "Not available"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Shield size={20} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Role</p>
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {user?.roles?.join(", ") || "USER"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                            <p className="text-sm text-orange-800">
                                More settings will be available in future updates.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="btn-primary text-sm px-4 py-2"
                    >
                        Close
                    </button>
                </div>
            </div>
        </>
    );
}
