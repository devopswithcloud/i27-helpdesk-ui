"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/context/AuthContext";
import { Bell } from "lucide-react";
import NotificationsModal from "@/components/NotificationsModal";

interface TopHeaderProps {
    pageTitle: string;
    subtitle?: string;
}

export default function TopHeader({ pageTitle, subtitle }: TopHeaderProps) {
    const { user } = useAuth();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/60">
            <div className="flex items-center justify-between px-6 py-4 lg:px-8">
                {/* Left: Page title */}
                <div className="pl-12 lg:pl-0">
                    <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
                    )}
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <button
                        onClick={() => setIsNotificationsOpen(true)}
                        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {/* User avatar */}
                    <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-gray-200">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-white">
                                {user?.fullName?.charAt(0) || "U"}
                            </span>
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-sm font-medium text-gray-900">
                                {user?.fullName || "User"}
                            </p>
                            <p className="text-xs text-gray-500">
                                {user?.roles?.includes("ADMIN")
                                    ? "Administrator"
                                    : user?.roles?.includes("AGENT")
                                        ? "Support Agent"
                                        : "Student"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {mounted && createPortal(
                <NotificationsModal
                    isOpen={isNotificationsOpen}
                    onClose={() => setIsNotificationsOpen(false)}
                />,
                document.body
            )}
        </header>
    );
}
