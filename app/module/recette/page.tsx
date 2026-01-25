"use client";

import { TrendingUp } from "lucide-react";
import Footer from "../../components/features/Footer";
import Header from "../../components/layout/Header";
import CategoryName from "../categories/views/components/FindByNameCat";

export default function PagePortrait() {
  return (
    <div className="">
      <Header />
      <main className="relative flex flex-col items-center justify-center min-h-screen overflow-x-hidden bg-white p-4 sm:p-8">
        <div className="inline-flex items-center justify-center p-3 bg-orange-100 rounded-full mb-4">
          <TrendingUp className="w-8 h-8 text-orange-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Les Recettes
        </h1>
        <CategoryName catName="Recette" />
      </main>
      <Footer />
    </div>
  );
}
