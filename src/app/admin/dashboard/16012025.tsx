"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";

export default function AdminDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tickets, setTickets] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

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
    } catch {
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authChecked) return;
    loadTickets();
  }, [authChecked]);

  /* 🔄 REFRESH AFTER RETURN FROM DETAILS */
  useEffect(() => {
    if (searchParams.get("refresh")) {
      loadTickets();
      router.replace("/admin/dashboard");
    }
  }, [searchParams, router]);

  /* 👨‍💼 LOAD AGENTS */
  useEffect(() => {
    api.get("/auth/users?role=AGENT")
      .then(res => setAgents(res.data || []))
      .catch(() => setAgents([]));
  }, []);

  /* 🔁 ASSIGN / UNASSIGN */
  const assignAgent = async (
    ticketId: number,
    agentId: number | null
  ) => {
    await api.put(`/tickets/${ticketId}/assign`, {
      agentId: agentId,
    });

    // ✅ Always re-sync from backend
    loadTickets();
  };

  if (!authChecked) return null;

  return (
    <main className="py-4">
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* HEADER + MANAGE USERS */}
        {/* HEADER */}
        <div className="mb-4 d-flex justify-content-between align-items-start">
        <div>
            <h3 className="mb-1">Admin Dashboard</h3>
            <p className="text-muted mb-0">
            Monitor and manage all support tickets
            </p>
        </div>

        {/* 🔐 ADMIN ACTIONS */}
        <div>
            <button
            className="btn btn-outline-secondary me-2"
            onClick={() => router.push("/admin/users")}
            >
            Manage Users
            </button>
        </div>
        </div>


        {/* KPI CARDS */}
        <div className="row g-3 mb-4">
          {[
            { label: "Total", count: tickets.length },
            { label: "Open", count: tickets.filter(t => t.status === "OPEN").length },
            { label: "In Progress", count: tickets.filter(t => t.status === "IN_PROGRESS").length },
            { label: "Closed", count: tickets.filter(t => t.status === "CLOSED").length },
          ].map((kpi, i) => (
            <div className="col-md-3" key={i}>
              <div className="card p-3">
                <h6 className="text-muted mb-1">{kpi.label}</h6>
                <h4 className="mb-0">{kpi.count}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* LOADING / EMPTY */}
        {loading && <p>Loading tickets...</p>}

        {!loading && tickets.length === 0 && (
          <div className="alert alert-info">
            No tickets available.
          </div>
        )}

        {/* TICKET LIST */}
        {!loading && tickets.length > 0 && (
          <div className="d-flex flex-column gap-3">
            {tickets.map(ticket => (
              <div key={ticket.id} className="card p-3 shadow-sm">
                <div className="row align-items-center">

                  {/* LEFT */}
                  <div className="col-md-7">
                    <h6 className="mb-1">{ticket.title}</h6>
                    <p className="text-muted small mb-2">
                      {ticket.description}
                    </p>

                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge bg-light text-dark">
                        {ticket.createdByName}
                      </span>

                      <span className={`badge ${
                        ticket.status === "OPEN"
                          ? "bg-warning text-dark"
                          : ticket.status === "IN_PROGRESS"
                          ? "bg-primary"
                          : "bg-success"
                      }`}>
                        {ticket.status}
                      </span>

                      <span className={`badge ${
                        ticket.priority === "HIGH"
                          ? "bg-danger"
                          : ticket.priority === "MEDIUM"
                          ? "bg-secondary"
                          : "bg-light text-dark"
                      }`}>
                        {ticket.priority}
                      </span>
                    </div>
                  </div>

                  {/* MIDDLE – ASSIGN */}
                  <div className="col-md-3">
                    <div className="mb-1 small text-muted">
                      Assign to Agent
                    </div>

                    <select
                      className="form-select form-select-sm"
                      value={ticket.assignedTo ?? ""}
                      onChange={(e) =>
                        assignAgent(
                          ticket.id,
                          e.target.value === "" ? null : Number(e.target.value)
                        )
                      }
                    >
                      <option value="">Unassigned</option>
                      {agents.map(agent => (
                        <option key={agent.id} value={agent.id}>
                          {agent.full_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* RIGHT */}
                  <div className="col-md-2 text-end">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() =>
                        router.push(`/admin/tickets/${ticket.id}`)
                      }
                    >
                      View
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
