
"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Award, GraduationCap, CheckCircle, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MOCK_USER, COURSE_DATA } from "@/data/mock-data";

export default function CertificateClient() {
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    toast.success("جاري تحميل الشهادة...");
  };

  const handleShare = () => {
    toast.success("تم نسخ رابط الشهادة!");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-full px-4 py-2 mb-4">
          <Award className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
            مبروك! أتممت الكورس بنجاح 🎉
          </span>
        </div>
        <h1 className="text-3xl font-black text-[#0A2540] dark:text-white mb-2">
          شهادة الإتمام
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          شهادتك جاهزة للتحميل والمشاركة
        </p>
      </motion.div>

      <motion.div
        ref={certRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#0A2540] mb-8"
        style={{ aspectRatio: "1.414" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A2540] via-[#0d3060] to-[#1a4a8a]" />
        <div className="absolute inset-4 border-2 border-[#FF6B35]/30 rounded-2xl" />
        <div className="absolute inset-8 border border-white/10 rounded-xl" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6B35] flex items-center justify-center mb-4">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>

          <div className="text-sm font-medium text-[#FF6B35] tracking-widest uppercase mb-2">
            أكاديمية التسويق الرقمي
          </div>

          <div className="text-lg text-gray-300 mb-4">تشهد بأن</div>

          <div className="text-4xl font-black text-white mb-4 border-b-2 border-[#FF6B35] pb-4 px-8">
            {MOCK_USER.full_name}
          </div>

          <div className="text-gray-300 mb-2">قد أتم بنجاح كورس</div>

          <div className="text-2xl font-black text-[#FF6B35] mb-6 max-w-md leading-tight">
            {COURSE_DATA.title}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-400 mb-6">
            <div className="text-center">
              <div className="text-white font-bold">{COURSE_DATA.total_hours}+</div>
              <div>ساعة تعليمية</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-white font-bold">{COURSE_DATA.total_lessons}</div>
              <div>درس متخصص</div>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <div className="text-white font-bold">8</div>
              <div>وحدات</div>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            رقم الشهادة: DMA-2024-{Math.random().toString(36).substr(2, 8).toUpperCase()} • تاريخ الإصدار: {new Date().toLocaleDateString("ar-EG")}
          </div>
        </div>
      </motion.div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          onClick={handleDownload}
          className="bg-[#FF6B35] hover:bg-[#e55a25] text-white font-bold px-8 py-5 rounded-xl"
        >
          <Download className="w-5 h-5 ml-2" />
          تحميل الشهادة PDF
        </Button>
        <Button
          onClick={handleShare}
          variant="outline"
          className="border-[#0A2540] text-[#0A2540] dark:border-white dark:text-white font-bold px-8 py-5 rounded-xl"
        >
          <Share2 className="w-5 h-5 ml-2" />
          مشاركة الرابط
        </Button>
        <Button
          variant="outline"
          className="border-blue-600 text-blue-600 font-bold px-8 py-5 rounded-xl"
          onClick={() => toast.success("جاري الإضافة إلى LinkedIn...")}
        >
          <Linkedin className="w-5 h-5 ml-2" />
          إضافة إلى LinkedIn
        </Button>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: CheckCircle, title: "شهادة موثقة", desc: "برقم تسلسلي فريد قابل للتحقق" },
          { icon: Share2, title: "قابلة للمشاركة", desc: "شاركها على LinkedIn وجميع المنصات" },
          { icon: Award, title: "معترف بها", desc: "في سوق العمل والمشاريع المهنية" },
        ].map(({ icon: Icon, title, desc }, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <Icon className="w-8 h-8 text-[#FF6B35] mx-auto mb-2" />
            <div className="font-bold text-[#0A2540] dark:text-white text-sm">{title}</div>
            <div className="text-xs text-gray-500 mt-1">{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
