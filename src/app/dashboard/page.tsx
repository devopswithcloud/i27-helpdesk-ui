"use client";

export default function DashboardPage() {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        Welcome, {user.fullName}
      </h1>

      <p className="text-gray-600 mt-2">
        This is your student dashboard.
      </p>
    </div>
  );
}
