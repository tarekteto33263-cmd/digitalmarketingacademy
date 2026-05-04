
import Navbar from "@/components/Navbar";
import FreeLessonClient from "@/components/free-lesson/FreeLessonClient";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function FreeLessonPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <FreeLessonClient />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
