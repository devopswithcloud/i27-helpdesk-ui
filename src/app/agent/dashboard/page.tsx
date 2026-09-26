"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/ui/StatCard";
import StatusBadge from "@/components/ui/StatusBadge";
import PriorityBadge from "@/components/ui/PriorityBadge";
import { TableSkeleton, SkeletonCard } from "@/components/ui/LoadingSkeleton";
import {
  Ticket,
  AlertCircle,
  Clock,
  CheckCircle2,
  Eye,
  Search,
} from "lucide-react";

export default function AgentDashboardPage() {
  const router = useRouter();

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* 🔐 AGENT AUTH GUARD */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      router.replace("/support/login");
      return;
    }

    const user = JSON.parse(userRaw);
    if (!user.roles?.includes("AGENT")) {
      router.replace("/");
      return;
    }

    setAuthChecked(true);
  }, [router]);

  /* 📥 LOAD ASSIGNED TICKETS */
  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tickets/assigned-to-me");
      setTickets(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authChecked) loadTickets();
  }, [authChecked]);

  const filteredTickets = tickets.filter((t) =>
    t.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!authChecked) return null;

  return (
    <DashboardLayout
      pageTitle="Agent Dashboard"
      subtitle="Tickets assigned to you"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              label="My Tickets"
              value={tickets.length}
              icon={Ticket}
              color="navy"
            />
            <StatCard
              label="Open"
              value={tickets.filter((t) => t.status === "OPEN").length}
              icon={AlertCircle}
              color="amber"
            />
            <StatCard
              label="In Progress"
              value={tickets.filter((t) => t.status === "IN_PROGRESS").length}
              icon={Clock}
              color="navy"
            />
            <StatCard
              label="Closed"
              value={tickets.filter((t) => t.status === "CLOSED").length}
              icon={CheckCircle2}
              color="emerald"
            />
          </>
        )}
      </div>

      {/* Tickets Table */}
      <div className="card overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              My Assigned Tickets
            </h2>
            <p className="text-sm text-gray-500">
              {tickets.length} tickets assigned
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-full sm:w-64 border border-gray-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
            />
          </div>
        </div>

        {loading && (
          <table className="w-full">
            <tbody>
              <TableSkeleton rows={5} cols={4} />
            </tbody>
          </table>
        )}

        {!loading && tickets.length === 0 && (
          <div className="py-16 text-center">
            <Ticket size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tickets assigned to you.</p>
          </div>
        )}

        {!loading && filteredTickets.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-6 py-3.5">Ticket</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">
                        {ticket.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {ticket.createdByName}
                      </div>
                    </td>
                    <td className="table-cell">
                      <StatusBadge status={ticket.status} />
                    </td>
                    <td className="table-cell">
                      <PriorityBadge priority={ticket.priority} />
                    </td>
                    <td className="table-cell text-right">
                      <button
                        className="inline-flex items-center gap-1.5 text-primary-500 hover:text-primary-700 text-sm font-medium transition-colors"
                        onClick={() =>
                          router.push(`/agent/tickets/${ticket.id}`)
                        }
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
