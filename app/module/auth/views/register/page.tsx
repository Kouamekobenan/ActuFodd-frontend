"use client";
import React from "react";
import BarLaterale from "../../../admin/components/BarLaterale";
import RegisterForm from "../components/Register";

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <BarLaterale />

      {/* Container principal avec marge pour la sidebar */}
      <main className="lg:ml-64">
        {/* Padding interne pour le contenu */}
        <div className="p-4 sm:p-6 lg:p-8">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
}
