
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoursePageClient from "@/components/course/CoursePageClient";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function CoursePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <CoursePageClient />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
