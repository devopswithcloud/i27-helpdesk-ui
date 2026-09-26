"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Shield, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, roles, fullName } = res.data;

      if (!roles || !roles.includes("ADMIN")) {
        setError("Access denied. Admins only.");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email, fullName, roles }));
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid admin credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#051C36] via-[#0a2a4d] to-[#051C36] px-4">
      <div className="w-full max-w-[420px] animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-sm text-gray-400 mt-1">Administrator access only</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8 shadow-modal">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg px-4 py-3 text-sm mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
              {loading ? "Signing in..." : <>Login as Admin <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-6">
          © {new Date().getFullYear()} i27Academy
        </p>
      </div>
    </div>
  );
}
