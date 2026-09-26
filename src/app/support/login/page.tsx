"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Shield, ArrowRight } from "lucide-react";

export default function SupportLoginPage() {
  const router = useRouter();
  const { login, user, loading: authLoading } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || authLoading) return;

    if (user?.roles?.includes("ADMIN")) {
      router.replace("/admin/dashboard");
    } else if (user?.roles?.includes("AGENT")) {
      router.replace("/agent/dashboard");
    }
  }, [mounted, authLoading, user, router]);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, userId, roles, fullName, email: loginEmail } = res.data;

      if (!roles.includes("ADMIN") && !roles.includes("AGENT")) {
        setError("Access denied. Support users only.");
        setSubmitting(false);
        return;
      }

      login(token, { userId, email: loginEmail, fullName, roles });

      if (roles.includes("ADMIN")) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/agent/dashboard");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#051C36] via-[#0a2a4d] to-[#051C36] px-4">
      <div className="w-full max-w-[420px] animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Support Login</h1>
          <p className="text-sm text-gray-400 mt-1">
            Admin & Agent access only
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8 shadow-modal">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                placeholder="support@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
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
            <p className="text-sm text-gray-400">
              Student?{" "}
              <button
                onClick={() => router.push("/student/login")}
                className="text-primary-400 font-medium hover:text-primary-300 transition-colors"
              >
                Student Login →
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          © {new Date().getFullYear()} i27Academy
        </p>
      </div>
    </div>
  );
}
