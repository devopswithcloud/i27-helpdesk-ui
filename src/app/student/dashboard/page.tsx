import { Suspense } from "react";
import StudentDashboardClient from "./StudentDashboardClient";
//import StudentDashboardClient from "./StudentDashboardClient";

export default function StudentDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-5 text-center text-muted">
          Loading student dashboard...
        </div>
      }
    >
      <StudentDashboardClient />
    </Suspense>
  );
}
