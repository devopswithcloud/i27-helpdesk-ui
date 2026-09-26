"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { HelpCircle, ArrowRight } from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /* 🔐 BLOCK LOGIN PAGE FOR ANY LOGGED-IN USER */
  useEffect(() => {
    if (loading) return;
    if (!user) return;

    if (user.roles.includes("USER")) {
      router.replace("/student/dashboard");
    } else if (user.roles.includes("ADMIN")) {
      router.replace("/admin/dashboard");
    } else if (user.roles.includes("AGENT")) {
      router.replace("/agent/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, userId, fullName, roles } = res.data;

      if (!roles.includes("USER")) {
        setError("Students only. Please use Support Login.");
        setSubmitting(false);
        return;
      }

      login(token, { userId, email, fullName, roles });
      router.replace("/student/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4">
      <div className="w-full max-w-[420px] animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <HelpCircle size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Student Login</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Card */}
        <div className="card p-6 lg:p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="input-label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="input-label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Login
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Support staff?{" "}
              <button
                onClick={() => router.push("/support/login")}
                className="text-primary-500 font-medium hover:text-primary-600 transition-colors"
              >
                Agent/Admin Login →
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} i27Academy
        </p>
      </div>
    </div>
  );
}
