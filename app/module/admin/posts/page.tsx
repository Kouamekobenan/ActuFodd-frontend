"use client";
import React from "react";
import BarLaterale from "../components/BarLaterale";
import PostAdmin from "../components/Post";

export default function AdminPostsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <BarLaterale />
      <main className="lg:ml-64 pb-24 lg:pb-8">
        <PostAdmin />
      </main>
    </div>
  );
}
