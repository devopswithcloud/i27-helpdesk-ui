"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatusBadge from "@/components/ui/StatusBadge";
import PriorityBadge from "@/components/ui/PriorityBadge";
import { SkeletonBlock } from "@/components/ui/LoadingSkeleton";
import {
  ArrowLeft,
  Send,
  MessageSquare,
  Activity,
  CircleDot,
  RefreshCcw,
  Zap,
} from "lucide-react";

export default function AgentTicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [ticket, setTicket] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [commentUsers, setCommentUsers] = useState<Record<number, any>>({});

  /* 🔐 AGENT AUTH GUARD */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (!token || !userRaw) { router.replace("/support/login"); return; }
    try {
      const user = JSON.parse(userRaw);
      if (!user.roles?.includes("AGENT")) router.replace("/");
    } catch { router.replace("/support/login"); }
  }, [router]);

  /* 📥 LOAD TICKET */
  useEffect(() => {
    if (!id) return;
    const loadTicket = async () => {
      try {
        const ticketRes = await api.get(`/tickets/${id}`);
        const ticketData = ticketRes.data;
        let createdByName = `User #${ticketData.createdBy}`;
        try {
          const userRes = await api.get(`/auth/users/${ticketData.createdBy}`);
          createdByName = userRes.data.fullName || userRes.data.email || createdByName;
        } catch { }
        setTicket({ ...ticketData, createdByName });
      } catch { setTicket(null); } finally { setLoading(false); }
    };
    loadTicket();
  }, [id]);

  /* 🕒 LOAD ACTIVITIES */
  const loadActivities = async () => {
    if (!id) return;
    try {
      const res = await api.get(`/tickets/${id}/activities`);
      setActivities(res.data || []);
    } catch { setActivities([]); }
  };

  useEffect(() => { loadActivities(); }, [id]);

  /* 💬 LOAD COMMENTS + USERS */
  useEffect(() => {
    if (!id) return;
    api.get(`/comments/${id}`).then(async (res) => {
      const data = res.data || [];
      setComments(data);
      setCommentsError(null);
      const userIds: number[] = Array.from(new Set<number>(data.map((c: any) => Number(c.commented_by))));
      const missing: number[] = userIds.filter((uid: number) => !commentUsers[uid]);
      if (missing.length > 0) {
        const responses = await Promise.allSettled(
          missing.map((uid: number) => api.get(`/auth/admin/users/${uid}`).catch(() => api.get(`/auth/users/${uid}`)))
        );
        const resolved: Record<number, any> = {};
        responses.forEach((r, i) => { if (r.status === "fulfilled") resolved[missing[i]] = r.value.data; });
        setCommentUsers((prev: any) => ({ ...prev, ...resolved }));
      }
    }).catch(() => { setComments([]); setCommentsError("Comments service unavailable"); });
  }, [id]);

  /* 🔁 UPDATE TICKET */
  const updateTicket = async (updates: any) => {
    if (!id) return;
    setSaving(true);
    try {
      await api.put(`/tickets/${id}`, updates);
      const res = await api.get(`/tickets/${id}`);
      setTicket((prev: any) => ({ ...res.data, createdByName: prev?.createdByName }));
      await loadActivities();
    } finally { setSaving(false); }
  };

  /* ➕ ADD COMMENT */
  const postComment = async () => {
    if (!newComment.trim() || !id) return;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setPosting(true);
    try {
      const res = await api.post("/comments", {
        ticket_id: Number(id), commented_by: user.userId,
        commented_by_role: "AGENT", comment: newComment.trim(),
      });
      setComments((prev: any[]) => [...prev, res.data]);
      setNewComment("");
    } finally { setPosting(false); }
  };

  const actionIcon = (action: string) => {
    switch (action) {
      case "CREATED": return <CircleDot size={14} className="text-emerald-500" />;
      case "STATUS_CHANGED": return <RefreshCcw size={14} className="text-blue-500" />;
      case "PRIORITY_CHANGED": return <Zap size={14} className="text-amber-500" />;
      default: return <Activity size={14} className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout pageTitle="Ticket Details">
        <div className="space-y-5">
          <div className="card p-6"><SkeletonBlock lines={4} /></div>
          <div className="card p-6"><SkeletonBlock lines={6} /></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <DashboardLayout pageTitle="Ticket Details">
        <div className="card py-20 text-center"><p className="text-gray-500">Ticket not found</p></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle={`Ticket #${ticket.id}`} subtitle={`Created by ${ticket.createdByName}`}>
      <button onClick={() => router.push("/agent/dashboard")} className="btn-ghost text-sm mb-6 -ml-3">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Header */}
      <div className="card p-6 mb-6 bg-gradient-to-r from-white to-blue-50/50">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{ticket.title}</h2>
        <p className="text-sm text-gray-500 mb-4">{ticket.description}</p>
        <div className="flex items-center gap-2 mb-4">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>

        {/* Status / Priority Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div>
            <label className="input-label">Status</label>
            <select className="input" value={ticket.status} disabled={saving}
              onChange={(e) => updateTicket({ status: e.target.value })}>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="CLOSED">CLOSED</option>
            </select>
          </div>
          <div>
            <label className="input-label">Priority</label>
            <select className="input" value={ticket.priority} disabled={saving}
              onChange={(e) => updateTicket({ priority: e.target.value })}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="card p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity size={16} className="text-primary-500" /> Activity Timeline
        </h3>
        <div className="space-y-3 border-l-2 border-gray-100 pl-4">
          {activities.map((a: any) => (
            <div key={a.id} className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">{actionIcon(a.action)}</div>
              <div>
                <p className="text-sm text-gray-700">{a.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(a.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
          {activities.length === 0 && <p className="text-sm text-gray-400">No activity yet</p>}
        </div>
      </div>

      {/* Comments */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <MessageSquare size={18} className="text-gray-500" />
          <h3 className="text-base font-semibold text-gray-900">Comments</h3>
          <span className="text-xs text-gray-400 ml-auto">{comments.length}</span>
        </div>

        <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
          {commentsError && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-4 py-3 text-sm">{commentsError}</div>
          )}

          {comments.length === 0 && !commentsError && (
            <p className="text-sm text-gray-400 text-center py-8">No comments yet</p>
          )}

          {comments.map((c: any) => {
            const u = commentUsers[c.commented_by];
            const isAgent = c.commented_by_role === "AGENT";
            return (
              <div key={c.id} className={`rounded-xl p-4 ${isAgent ? "bg-blue-50/50 border border-blue-100" : "bg-gray-50 border border-gray-100"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isAgent ? "bg-primary-500 text-white" : "bg-gray-300 text-gray-700"}`}>
                      {u?.fullName?.charAt(0) || "#"}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{u?.fullName || `User #${c.commented_by}`}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isAgent ? "bg-primary-100 text-primary-700" : "bg-gray-200 text-gray-600"}`}>
                      {c.commented_by_role}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-700 pl-9">{c.comment}</p>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex gap-3">
            <textarea
              className="input flex-1 min-h-[80px] resize-none"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
            />
            <button className="btn-primary self-end" disabled={posting || !newComment.trim()} onClick={postComment}>
              <Send size={16} /> {posting ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
