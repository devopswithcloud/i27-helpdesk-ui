"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    Ticket,
    ListTodo,
    PlusCircle,
    Bell,
    Settings,
    LogOut,
    ChevronLeft,
    Menu,
    Users,
} from "lucide-react";
import { useState } from "react";
import SettingsModal from "@/components/SettingsModal";
import NotificationsModal from "@/components/NotificationsModal";

type NavItem = {
    label: string;
    href: string;
    icon: React.ReactNode;
    roles?: string[];
};

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const isAdmin = user?.roles?.includes("ADMIN");
    const isAgent = user?.roles?.includes("AGENT");
    const isStudent = user?.roles?.includes("USER");

    const rolePrefix = isAdmin ? "/admin" : isAgent ? "/agent" : "/student";

    const navItems: NavItem[] = [
        {
            label: "Dashboard",
            href: `${rolePrefix}/dashboard`,
            icon: <LayoutDashboard size={20} />,
        },
        {
            label: "My Tickets",
            href: isStudent ? `${rolePrefix}/dashboard` : `${rolePrefix}/dashboard`,
            icon: <Ticket size={20} />,
        },
        {
            label: "All Tickets",
            href: `${rolePrefix}/dashboard`,
            icon: <ListTodo size={20} />,
            roles: ["ADMIN"],
        },
        {
            label: "Create Ticket",
            href: "/student/tickets/create",
            icon: <PlusCircle size={20} />,
            roles: ["USER"],
        },
        {
            label: "Manage Users",
            href: "/admin/users",
            icon: <Users size={20} />,
            roles: ["ADMIN"],
        },
        {
            label: "Notifications",
            href: "#",
            icon: <Bell size={20} />,
        },
        {
            label: "Settings",
            href: "#",
            icon: <Settings size={20} />,
        },
    ];

    const filteredItems = navItems.filter((item) => {
        if (!item.roles) return true;
        return item.roles.some((role) => user?.roles?.includes(role));
    });

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const handleNavigate = (label: string, href: string) => {
        if (label === "Settings") {
            setIsSettingsOpen(true);
            return;
        }
        if (label === "Notifications") {
            setIsNotificationsOpen(true);
            return;
        }
        if (href !== "#") router.push(href);
    };

    return (
        <>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} />
            <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
            
            {/* Mobile toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="fixed top-4 left-4 z-50 lg:hidden bg-sidebar text-white p-2.5 rounded-xl shadow-xl border border-white/10 backdrop-blur-sm"
                aria-label="Toggle sidebar"
            >
                <Menu size={20} />
            </button>

            {/* Overlay for mobile */}
            {!collapsed && (
                <div
                    className="fixed inset-0 bg-sidebar/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
                    onClick={() => setCollapsed(true)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 z-40 h-screen text-white shadow-2xl
          flex flex-col transition-all duration-300 ease-in-out
          bg-gradient-to-b from-[#051C36] via-[#07213F] to-[#031326]
          border-r border-white/5
          ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-[88px]" : "translate-x-0 w-[280px]"}
          lg:relative lg:translate-x-0
        `}
            >
                {/* Brand */}
                <div className="flex items-center justify-between px-6 py-8 relative">
                    <div className={`flex items-center gap-3 cursor-default transition-opacity duration-200 ${collapsed ? "lg:justify-center w-full" : ""}`}>
                        {/* Logo Icon */}
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20 shrink-0">
                            <span className="font-bold text-white text-sm">i27</span>
                        </div>
                        <span className={`font-bold text-xl tracking-tight ${collapsed ? "hidden" : "block"}`}>
                            <span className="text-white">i27</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">Helpdesk</span>
                        </span>
                    </div>

                    {/* Collapse button (desktop only) */}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden lg:flex absolute right-[-12px] top-9 items-center justify-center w-6 h-6 rounded-full bg-sidebar border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all shadow-md z-50"
                    >
                        <ChevronLeft
                            size={14}
                            className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {filteredItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (item.href !== "#" && pathname.startsWith(item.href + "/"));

                        return (
                            <button
                                key={item.label}
                                onClick={() => handleNavigate(item.label, item.href)}
                                className={`
                  group w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl
                  text-sm font-medium transition-all duration-300 relative overflow-hidden
                  ${isActive
                                        ? "text-white"
                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                    }
                  ${collapsed ? "lg:justify-center lg:px-0" : ""}
                `}
                                title={collapsed ? item.label : undefined}
                            >
                                {isActive && (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-transparent opacity-100" />
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full shadow-[0_0_10px_rgba(241,94,34,0.5)]" />
                                    </>
                                )}
                                
                                <span className={`flex-shrink-0 z-10 transition-transform duration-300 ${isActive ? "text-primary-400" : "group-hover:scale-110"}`}>
                                    {item.icon}
                                </span>
                                <span className={`z-10 transition-transform duration-300 ${collapsed ? "hidden" : "group-hover:translate-x-1"}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="p-4 mt-auto">
                    <div className={`
                        relative border rounded-2xl p-4
                        transition-all duration-300 ${collapsed ? "lg:p-2 lg:bg-transparent lg:border-transparent" : "bg-white/5 border-white/5 hover:bg-white/10"}
                    `}>
                        {/* User info */}
                        <div className={`flex items-center gap-3 mb-4 ${collapsed ? "lg:justify-center lg:mb-0" : ""}`}>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/30 border border-white/10">
                                <span className="text-sm font-bold text-white">
                                    {user?.fullName?.charAt(0) || "U"}
                                </span>
                            </div>
                            <div className={`min-w-0 flex-1 ${collapsed ? "hidden" : "block"}`}>
                                <p className="text-sm font-semibold text-white truncate">
                                    {user?.fullName || "User"}
                                </p>
                                <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
                            </div>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-sm font-medium text-gray-400
                  hover:bg-red-500/10 hover:text-red-400 transition-all duration-200
                  ${collapsed ? "hidden" : "flex"}
                `}
                            title="Logout"
                        >
                            <LogOut size={18} className="flex-shrink-0" />
                            <span>Logout</span>
                        </button>
                        
                        {/* Compact Logout for collapsed state */}
                        <div className={`hidden ${collapsed ? "lg:flex justify-center mt-3" : ""}`}>
                            <button
                                onClick={handleLogout}
                                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
