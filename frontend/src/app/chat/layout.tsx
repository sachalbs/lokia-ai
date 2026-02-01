"use client";

import { AuthProvider } from "@/context/AuthContext";
import Sidebar from "@/components/layout/Sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </AuthProvider>
  );
}
