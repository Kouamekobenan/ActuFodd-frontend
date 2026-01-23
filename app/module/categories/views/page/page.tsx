"use client";

import Footer from "../../../../components/features/Footer";
import Header from "../../../../components/layout/Header";
import CategoryTendance from "../components/CategoryTendance";

export default function TendancePage() {
  return (
    <div className="">
      <Header />
      <main className="relative flex flex-col items-center justify-center min-h-screen overflow-x-hidden bg-white p-4 sm:p-8">
        <CategoryTendance />
      </main>
      <Footer />
    </div>
  );
}
