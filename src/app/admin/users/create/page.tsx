"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Mail, User, Lock, Shield, ArrowLeft, Loader2, Save } from "lucide-react";

export default function CreateUserPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    password: "",
    role: "USER",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.post("/auth/admin/users", form);
      router.push("/admin/users");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Failed to create user. Please check the details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      pageTitle="Create User"
      subtitle="Add a new user to the helpdesk system"
    >
      <div className="max-w-2xl">
        <div className="mb-6">
          <button
            onClick={() => router.push("/admin/users")}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Users
          </button>
        </div>

        <div className="card overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-900">User Details</h2>
            <p className="text-sm text-gray-500 mt-1">
              Enter the credentials and assign a role to the new user.
            </p>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm flex items-start gap-3">
                <Shield className="flex-shrink-0 mt-0.5" size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input pl-10 w-full"
                    placeholder="e.g. name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="input pl-10 w-full"
                    placeholder="e.g. John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Temporary Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input pl-10 w-full"
                    placeholder="Enter a secure password"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">System Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Shield size={18} />
                  </div>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="input pl-10 w-full appearance-none"
                  >
                    <option value="USER">Student (USER)</option>
                    <option value="AGENT">Support Agent (AGENT)</option>
                    <option value="ADMIN">Administrator (ADMIN)</option>
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  This determines what actions the user can perform in the system.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => router.push("/admin/users")}
                  className="btn-ghost"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Create User
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
