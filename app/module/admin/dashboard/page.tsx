"use client";
import React from "react";
import BarLaterale from "../components/BarLaterale";
import Dashboard from "../components/Dashboard";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BarLaterale />
      <main className="lg:ml-64 pb-24 lg:pb-8 px-4 sm:px-6 py-6">
        <Dashboard />
      </main>
    </div>
  );
}
