"use client";

import Sidebar from "./Sidebar";
import TopHeader from "./TopHeader";

interface DashboardLayoutProps {
    children: React.ReactNode;
    pageTitle: string;
    subtitle?: string;
}

export default function DashboardLayout({
    children,
    pageTitle,
    subtitle,
}: DashboardLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden bg-surface-secondary">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top header */}
                <TopHeader pageTitle={pageTitle} subtitle={subtitle} />

                {/* Scrollable content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
                </main>
            </div>
        </div>
    );
}
