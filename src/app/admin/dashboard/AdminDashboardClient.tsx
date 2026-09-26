"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  XCircle,
  Eye,
  Search,
  Users,
  Loader2,
} from "lucide-react";

export default function AdminDashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tickets, setTickets] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [assigningTicketId, setAssigningTicketId] = useState<number | null>(null);

  /* 🔐 ADMIN AUTH GUARD */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");

    if (!token || !userRaw) {
      router.replace("/support/login");
      return;
    }

    const user = JSON.parse(userRaw);
    if (!user.roles?.includes("ADMIN")) {
      router.replace("/");
      return;
    }

    setAuthChecked(true);
  }, [router]);

  /* 📥 LOAD TICKETS */
  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tickets");
      setTickets(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authChecked) loadTickets();
  }, [authChecked]);

  /* 🔁 REFRESH HANDLER */
  useEffect(() => {
    if (searchParams.get("refresh")) {
      loadTickets();
      router.replace("/admin/dashboard");
    }
  }, [searchParams, router]);

  /* 👨‍💼 LOAD AGENTS */
  useEffect(() => {
    api
      .get("/auth/users?role=AGENT")
      .then((res) => setAgents(res.data || []))
      .catch(() => setAgents([]));
  }, []);

  const assignAgent = async (ticketId: number, agentId: number | null) => {
    try {
      setAssigningTicketId(ticketId);
      await api.put(`/tickets/${ticketId}/assign`, { agentId });
      await loadTickets();
    } finally {
      setAssigningTicketId(null);
    }
  };

  const filteredTickets = tickets.filter(
    (t) =>
      t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.createdByName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!authChecked) return null;

  return (
    <DashboardLayout
      pageTitle="Admin Dashboard"
      subtitle="Centralized control for support operations"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Tickets"
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

      {/* Tickets Table Card */}
      <div className="card overflow-hidden">
        {/* Table Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              All Support Tickets
            </h2>
            <p className="text-sm text-gray-500">
              {tickets.length} total tickets
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 flex-1 sm:flex-initial sm:w-64 border border-gray-200 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
              />
            </div>

            <button
              className="btn-secondary text-sm whitespace-nowrap"
              onClick={() => router.push("/admin/users")}
            >
              <Users size={16} />
              Users
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="p-0">
            <table className="w-full">
              <tbody>
                <TableSkeleton rows={5} cols={5} />
              </tbody>
            </table>
          </div>
        )}

        {/* Empty */}
        {!loading && tickets.length === 0 && (
          <div className="py-16 text-center">
            <Ticket size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No tickets available.</p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredTickets.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-6 py-3.5">Ticket</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">Assigned To</th>
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
                    <td className="table-cell relative">
                      {assigningTicketId === ticket.id ? (
                        <div className="flex items-center gap-2 text-sm text-primary-600 font-medium">
                          <Loader2 size={16} className="animate-spin" />
                          <span>Assigning...</span>
                        </div>
                      ) : (
                        <select
                          className="input py-1.5 px-2 text-xs max-w-[180px] disabled:opacity-50"
                          value={ticket.assignedTo ?? ""}
                          disabled={assigningTicketId !== null}
                          onChange={(e) =>
                            assignAgent(
                              ticket.id,
                              e.target.value === ""
                                ? null
                                : Number(e.target.value)
                            )
                          }
                        >
                          <option value="">Unassigned</option>
                          {agents.map((agent) => (
                            <option key={agent.id} value={agent.id}>
                              {agent.fullName}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="table-cell text-right">
                      <button
                        className="inline-flex items-center gap-1.5 text-primary-500 hover:text-primary-700 text-sm font-medium transition-colors"
                        onClick={() =>
                          router.push(`/admin/tickets/${ticket.id}`)
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
