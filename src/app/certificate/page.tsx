
import Navbar from "@/components/Navbar";
import CertificateClient from "@/components/certificate/CertificateClient";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function CertificatePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <CertificateClient />
      <WhatsAppButton />
    </main>
  );
}
