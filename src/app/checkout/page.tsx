
import Navbar from "@/components/Navbar";
import CheckoutClient from "@/components/checkout/CheckoutClient";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <CheckoutClient />
      <WhatsAppButton />
    </main>
  );
}
