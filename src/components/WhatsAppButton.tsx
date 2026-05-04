
"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const handleClick = () => {
    window.open(
      "https://wa.me/201234567890?text=مرحباً، أريد الاستفسار عن كورس التسويق الرقمي",
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="whatsapp-btn"
      aria-label="تواصل معنا على واتساب"
    >
      <MessageCircle className="w-7 h-7 text-white fill-white" />
    </button>
  );
}
