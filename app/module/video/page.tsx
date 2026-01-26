import React from "react";
import Header from "../../components/layout/Header";
import PostTypeComponent from "../../components/features/PostType";
import { MediaType } from "../post/domain/enums/media-type";
import Footer from "../../components/features/Footer";

export default function VideoPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header fixe en haut */}
      <Header />
      <main className="flex-grow">
        <PostTypeComponent type={MediaType.VIDEO} />
      </main>
      {/* Footer en bas */}
      <Footer />
    </div>
  );
}
