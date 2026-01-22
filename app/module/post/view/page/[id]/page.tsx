// src/app/posts/[id]/page.tsx

import Footer from "../../../../../components/features/Footer";
import Header from "../../../../../components/layout/Header";
import DetailPost from "../../components/DetailPost";

export default function PostPage() {
  return (
    <div className="">
      <Header />
      <DetailPost />;
      <Footer />
    </div>
  );
}
