"use client";
import React from "react";
import BarLaterale from "../components/BarLaterale";
import PostAdmin from "../components/Post";
export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <BarLaterale />
      <main className="lg:ml-64 pb-20 lg:pb-0 p-6">
        <PostAdmin />
      </main>
    </div>
  );
}
