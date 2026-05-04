
import Navbar from "@/components/Navbar";
import DashboardClient from "@/components/dashboard/DashboardClient";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <DashboardClient />
      <WhatsAppButton />
    </main>
  );
}
