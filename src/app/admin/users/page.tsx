"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Modal from "@/components/ui/Modal";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";
import { ArrowLeft, UserPlus, KeyRound, Users } from "lucide-react";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  // 🔐 ADMIN GUARD
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (!token || !userRaw) { router.replace("/support/login"); return; }
    const user = JSON.parse(userRaw);
    if (!user.roles?.includes("ADMIN")) { router.replace("/"); return; }

    api.get("/auth/admin/users")
      .then(res => setUsers(res.data || []))
      .finally(() => setLoading(false));
  }, [router]);

  const resetPassword = async () => {
    if (!password || password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      await api.put(`/auth/users/${selectedUser.id}/reset-password`, { password });
      alert("Password reset successfully");
      setSelectedUser(null);
      setPassword("");
    } finally { setSaving(false); }
  };

  return (
    <DashboardLayout pageTitle="User Management" subtitle="Manage system users and access">
      <button onClick={() => router.push("/admin/dashboard")} className="btn-ghost text-sm mb-6 -ml-3">
        <ArrowLeft size={16} /> Back to Dashboard
      </button>

      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">{users.length} users total</p>
        </div>
        <button className="btn-primary" onClick={() => router.push("/admin/users/create")}>
          <UserPlus size={16} /> Create User
        </button>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        {loading && (
          <table className="w-full"><tbody><TableSkeleton rows={5} cols={5} /></tbody></table>
        )}

        {!loading && users.length === 0 && (
          <div className="py-16 text-center">
            <Users size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No users found</p>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="table-header">
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="table-row">
                    <td className="table-cell font-medium text-gray-900">{u.fullName}</td>
                    <td className="table-cell text-gray-500">{u.email}</td>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${u.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${u.status === "ACTIVE" ? "bg-emerald-500" : "bg-gray-400"}`} />
                        {u.status}
                      </span>
                    </td>
                    <td className="table-cell text-right">
                      <button
                        className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                        onClick={() => setSelectedUser(u)}
                      >
                        <KeyRound size={14} /> Reset Password
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      <Modal
        title={`Reset Password — ${selectedUser?.fullName || ""}`}
        isOpen={!!selectedUser}
        onClose={() => { setSelectedUser(null); setPassword(""); }}
      >
        <div className="space-y-4">
          <div>
            <label className="input-label">New Password</label>
            <input
              type="password"
              className="input"
              placeholder="Enter new password (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              className="btn-danger flex-1"
              disabled={saving}
              onClick={resetPassword}
            >
              <KeyRound size={16} />
              {saving ? "Resetting..." : "Reset Password"}
            </button>
            <button
              className="btn-secondary"
              onClick={() => { setSelectedUser(null); setPassword(""); }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
