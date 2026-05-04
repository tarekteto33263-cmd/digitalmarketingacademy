
import Navbar from "@/components/Navbar";
import LessonClient from "@/components/lesson/LessonClient";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function LessonPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <LessonClient />
      <WhatsAppButton />
    </main>
  );
}
