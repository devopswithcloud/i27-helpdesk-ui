import { Suspense } from "react";
import AdminDashboardClient from "./AdminDashboardClient";

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-5 text-center text-muted">
          Loading admin dashboard...
        </div>
      }
    >
      <AdminDashboardClient />
    </Suspense>
  );
}
