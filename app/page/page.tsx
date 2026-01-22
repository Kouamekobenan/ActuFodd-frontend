"use client";

import NewInfo from "../components/features/Actu";
import Footer from "../components/features/Footer";
import { Info } from "../components/features/Info";
import Presentation from "../components/features/Presnetation";
import Header from "../components/layout/Header";


export default function Home() {
  return (
    <div className="">
      <Header />
      <main className="relative flex flex-col items-center justify-center min-h-screen overflow-x-hidden bg-white p-4 sm:p-8">
        <Presentation />
        <Info />
        <NewInfo />
      </main>
      <Footer />
    </div>
  );
}
