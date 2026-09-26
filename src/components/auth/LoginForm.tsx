"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, userId, fullName, roles } = res.data;

      // ✅ Store unified auth
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId,
          email,
          fullName,
          roles,
        })
      );

      // ✅ Route based on role
      if (roles.includes("ADMIN")) {
        router.push("/admin/dashboard");
      } else if (roles.includes("AGENT")) {
        router.push("/agent/dashboard");
      } else {
        router.push("/student/dashboard");
      }

    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Login
      </h2>

      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-3 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <p className="text-red-600 text-sm mb-2">
          {error}
        </p>
      )}

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-[#051C36] text-white py-2 rounded hover:bg-[#0a2a4a]"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
