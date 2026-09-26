"use client";

import { useState } from "react";
import { createTicket } from "../../services/ticketService";

export default function SubmitTicket() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{
    ticketCode: string;
    status: string;
  } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!title || !description || !email) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const result = await createTicket({
        title,
        description,
        email,
        priority: "MEDIUM",
      });

      setSuccess(result);
    } catch (err: any) {
      console.error("Create ticket error:", err);
      console.error("Response data:", err?.response?.data);
      console.error("Status:", err?.response?.status);

      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to create ticket. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ✅ SUCCESS STATE */
  if (success) {
    return (
      <div className="alert alert-success mt-3">
        <h6 className="alert-heading mb-2">
          Ticket Created Successfully 🎉
        </h6>

        <p className="mb-1">
          <strong>Ticket ID:</strong>{" "}
          <code>{success.ticketCode}</code>
        </p>

        <p className="mb-0 text-muted">
          Status: {success.status}
        </p>
      </div>
    );
  }

  /* ✅ FORM STATE */
  return (
    <>
      <div className="mb-3">
        <label className="form-label">Issue Title</label>
        <input
          type="text"
          className="form-control"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief summary of the issue"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the problem in detail"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Your Email</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@i27academy.com"
        />
      </div>

      {error && (
        <div className="alert alert-danger py-2">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="btn btn-primary w-100"
      >
        {loading ? "Creating Ticket..." : "Create Ticket"}
      </button>
    </>
  );
}
