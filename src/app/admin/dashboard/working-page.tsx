"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // 🔐 ADMIN AUTH GUARD
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

    // ✅ Auth confirmed
    setAuthChecked(true);
  }, [router]);

  // 📥 LOAD ALL TICKETS (ONLY AFTER AUTH)
  useEffect(() => {
    if (!authChecked) return;

    api
      .get("/tickets")
      .then((res) => {
        console.log("✅ Tickets loaded:", res.data);
        setTickets(res.data || []);
      })
      .catch((err) => {
        console.error("❌ Failed to load tickets", err);
        setTickets([]);
      })
      .finally(() => setLoading(false));
  }, [authChecked]);

  if (!authChecked) {
    return null; // ⛔ prevent premature render
  }

return (
  <main className="container py-4">
    {/* HEADER */}
    <div className="mb-4">
      <h3 className="mb-1">Admin Dashboard</h3>
      <p className="text-muted mb-0">
        Monitor and manage all support tickets
      </p>
    </div>

    {/* KPI CARDS */}
    <div className="row g-3 mb-4">
      <div className="col-md-3">
        <div className="card p-3">
          <h6 className="text-muted mb-1">Total Tickets</h6>
          <h4 className="mb-0">{tickets.length}</h4>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3">
          <h6 className="text-muted mb-1">Open</h6>
          <h4 className="mb-0">
            {tickets.filter(t => t.status === "OPEN").length}
          </h4>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3">
          <h6 className="text-muted mb-1">In Progress</h6>
          <h4 className="mb-0">
            {tickets.filter(t => t.status === "IN_PROGRESS").length}
          </h4>
        </div>
      </div>

      <div className="col-md-3">
        <div className="card p-3">
          <h6 className="text-muted mb-1">Closed</h6>
          <h4 className="mb-0">
            {tickets.filter(t => t.status === "CLOSED").length}
          </h4>
        </div>
      </div>
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
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="card p-3 shadow-sm"
          >
            <div className="d-flex justify-content-between align-items-start">
              {/* LEFT */}
              <div>
                <h6 className="mb-1">{ticket.title}</h6>
                <p className="text-muted small mb-2">
                  {ticket.description}
                </p>

                <div className="d-flex gap-2 flex-wrap">
                  <span className="badge bg-light text-dark">
                    User #{ticket.createdBy}
                  </span>

                  <span
                    className={`badge ${
                      ticket.status === "OPEN"
                        ? "bg-warning text-dark"
                        : ticket.status === "IN_PROGRESS"
                        ? "bg-primary"
                        : "bg-success"
                    }`}
                  >
                    {ticket.status}
                  </span>

                  <span
                    className={`badge ${
                      ticket.priority === "HIGH"
                        ? "bg-danger"
                        : ticket.priority === "MEDIUM"
                        ? "bg-secondary"
                        : "bg-light text-dark"
                    }`}
                  >
                    {ticket.priority}
                  </span>

                  {ticket.assignedTo ? (
                    <span className="badge bg-info">
                      Agent #{ticket.assignedTo}
                    </span>
                  ) : (
                    <span className="badge bg-light text-muted">
                      Unassigned
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT */}
              <div>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() =>
                    router.push(`/admin/tickets/${ticket.id}`)
                  }
                >
                  View Ticket
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </main>
);


}
