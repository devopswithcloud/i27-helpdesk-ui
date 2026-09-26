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
  User,
} from "lucide-react";

export default function StudentTicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [ticket, setTicket] = useState<any>(null);
  const [assignedAgent, setAssignedAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [commentUsers, setCommentUsers] = useState<Record<number, any>>({});

  /* 🔐 STUDENT AUTH GUARD */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (!token || !userRaw) { router.replace("/student/login"); return; }
    try {
      const user = JSON.parse(userRaw);
      if (!user.roles?.includes("USER")) router.replace("/");
    } catch { router.replace("/student/login"); }
  }, [router]);

  /* 📥 LOAD TICKET + ASSIGNED AGENT */
  useEffect(() => {
    if (!id) return;
    const loadTicket = async () => {
      try {
        const res = await api.get(`/tickets/${id}`);
        const data = res.data;
        setTicket(data);
        if (data.assignedTo) {
          try {
            const userRes = await api.get(`/auth/users/${data.assignedTo}`);
            setAssignedAgent(userRes.data);
          } catch { setAssignedAgent(null); }
        }
      } finally { setLoading(false); }
    };
    loadTicket();
  }, [id]);

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
        const responses = await Promise.allSettled(missing.map((uid: number) => api.get(`/auth/users/${uid}`)));
        const resolved: Record<number, any> = {};
        responses.forEach((r, i) => { if (r.status === "fulfilled") resolved[missing[i]] = r.value.data; });
        setCommentUsers((prev: any) => ({ ...prev, ...resolved }));
      }
    }).catch(() => { setComments([]); setCommentsError("Comments unavailable"); });
  }, [id]);

  /* ➕ ADD COMMENT */
  const postComment = async () => {
    if (!newComment.trim() || !id) return;
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setPosting(true);
    try {
      const res = await api.post("/comments", {
        ticket_id: Number(id), commented_by: user.userId,
        commented_by_role: "USER", comment: newComment.trim(),
      });
      setComments((prev: any[]) => [...prev, res.data]);
      setNewComment("");
    } finally { setPosting(false); }
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
    <DashboardLayout pageTitle={`Ticket #${ticket.id}`}>
      <button onClick={() => router.push("/student/dashboard")} className="btn-ghost text-sm mb-6 -ml-3">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Ticket Info */}
      <div className="card p-6 mb-6 bg-gradient-to-r from-white to-indigo-50/30">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Ticket #{ticket.id}</p>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{ticket.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{ticket.description}</p>
            <div className="flex items-center gap-2">
              <StatusBadge status={ticket.status || "OPEN"} />
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Assigned To</p>
            <div className="flex items-center gap-2 justify-end">
              <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={14} className="text-gray-500" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {assignedAgent ? (assignedAgent.fullName || assignedAgent.email) : "Not Assigned"}
              </span>
            </div>
          </div>
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
            <p className="text-sm text-gray-400 text-center py-8">No comments yet. Start the conversation!</p>
          )}

          {comments.map((c: any) => {
            const u = commentUsers[c.commented_by];
            const isStaff = c.commented_by_role === "ADMIN" || c.commented_by_role === "AGENT";
            return (
              <div key={c.id} className={`rounded-xl p-4 ${isStaff ? "bg-blue-50/50 border border-blue-100" : "bg-gray-50 border border-gray-100"}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isStaff ? "bg-primary-500 text-white" : "bg-gray-300 text-gray-700"}`}>
                      {u?.fullName?.charAt(0) || "#"}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{u?.fullName || `User #${c.commented_by}`}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isStaff ? "bg-primary-100 text-primary-700" : "bg-gray-200 text-gray-600"}`}>
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
