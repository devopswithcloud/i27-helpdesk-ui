import "./globals.css";
import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "i27Helpdesk — Cloud-Native Support Platform",
  description:
    "Modern enterprise helpdesk for i27Academy. Manage support tickets, track issues, and resolve problems efficiently.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
