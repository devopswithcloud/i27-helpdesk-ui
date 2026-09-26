"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // ⛔ Prevent flicker during hydration
  if (loading) return null;

  const isAdmin = user?.roles?.includes("ADMIN");
  const isAgent = user?.roles?.includes("AGENT");
  const isStudent = user?.roles?.includes("USER");

  return (
    <nav className="nav-bar">
      <div className="nav-inner d-flex justify-content-between align-items-center">

        {/* ✅ LEFT: BRANDING (UNCHANGED) */}
        <div
          className="brand"
          style={{ cursor: "default", fontWeight: 700 }}
        >
          i27<span style={{ color: "#F15E22" }}>Helpdesk</span>
        </div>

        {/* ✅ RIGHT: ACTIONS */}
        <div className="nav-actions d-flex align-items-center gap-3">
          {!user ? (
            <>
              <button
                className="btn btn-outline-primary"
                onClick={() => router.push("/student/login")}
              >
                Student Login
              </button>

              <button
                className="btn btn-primary"
                onClick={() => router.push("/support/login")}
              >
                Agent/Admin Login
              </button>
            </>
          ) : (
            <>
              <span className="fw-semibold">
                {isStudent && <>👋 {user.fullName}</>}
                {isAdmin && <>🛡️ Admin</>}
                {isAgent && <>🎧 Agent</>}
              </span>

              <button
                className="btn btn-outline-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
