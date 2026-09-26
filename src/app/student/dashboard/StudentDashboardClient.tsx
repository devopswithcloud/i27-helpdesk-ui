"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import Toast from "@/components/ui/Toast";
import { SkeletonBlock } from "@/components/ui/LoadingSkeleton";
import { PlusCircle, Eye, Ticket } from "lucide-react";

export default function StudentDashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const [tickets, setTickets] = useState<any[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  const ticketCreated = searchParams.get("created");

  /* 🔐 AUTH GUARD */
  useEffect(() => {
    if (loading) return;

    if (!user || !user.roles?.includes("USER")) {
      router.replace("/student/login");
    }
  }, [loading, user, router]);

  /* 📥 LOAD TICKETS */
  useEffect(() => {
    if (loading || !user) return;

    api
      .get("/tickets/me")
      .then((res) => setTickets(res.data || []))
      .catch(() => setTickets([]))
      .finally(() => setDataLoading(false));
  }, [loading, user]);

  /* 🎉 SUCCESS TOAST */
  useEffect(() => {
    if (ticketCreated) {
      setShowToast(true);
      const timer = setTimeout(() => {
        router.replace("/student/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [ticketCreated, router]);

  const handleCloseToast = useCallback(() => setShowToast(false), []);

  if (loading || !user) {
    return (
      <DashboardLayout pageTitle="My Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card p-5">
              <SkeletonBlock lines={3} />
            </div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      pageTitle="My Dashboard"
      subtitle={`You have ${tickets.length} tickets`}
    >
      {/* Toast */}
      {showToast && (
        <Toast
          message="Ticket created successfully! 🎉"
          type="success"
          onClose={handleCloseToast}
        />
      )}

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">My Tickets</h2>
        <button
          className="btn-primary"
          onClick={() => router.push("/student/tickets/create")}
        >
          <PlusCircle size={18} />
          Create Ticket
        </button>
      </div>

      {/* Loading */}
      {dataLoading && (
        <div className="grid grid-cols-1 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card p-5">
              <SkeletonBlock lines={3} />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!dataLoading && tickets.length === 0 && (
        <div className="card py-20 text-center">
          <Ticket size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No tickets yet
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            You haven&apos;t raised any tickets yet. Click below to create
            your first one.
          </p>
          <button
            className="btn-primary mx-auto"
            onClick={() => router.push("/student/tickets/create")}
          >
            <PlusCircle size={18} />
            Create Ticket
          </button>
        </div>
      )}

      {/* Tickets Grid */}
      {!dataLoading && tickets.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="card-hover p-5 cursor-pointer group"
              onClick={() => router.push(`/student/tickets/${ticket.id}`)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                      {ticket.title}
                    </h3>
                    <StatusBadge status={ticket.status || "OPEN"} />
                  </div>
                  <p className="text-sm text-gray-500 truncate mb-2">
                    {ticket.description}
                  </p>
                  <span className="text-xs text-gray-400">
                    Ticket #{ticket.id}
                  </span>
                </div>

                <button className="btn-ghost text-sm opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <Eye size={15} />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
