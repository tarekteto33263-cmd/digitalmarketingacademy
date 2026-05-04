
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-20 hero-gradient text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl lg:text-5xl font-black mb-6">
            ابدأ رحلتك نحو{" "}
            <span className="text-[#FF6B35]">الاحتراف</span>
            {" "}اليوم
          </h2>
          <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto">
            انضم لأكثر من 3,847 طالب غيّروا مساراتهم المهنية. الكورس متاح الآن بسعر خاص لفترة محدودة.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/checkout">
              <Button size="lg" className="bg-[#FF6B35] hover:bg-[#e55a25] text-white font-bold px-10 py-6 text-lg rounded-xl shadow-lg shadow-orange-500/30">
                سجل الآن - 2,999 جنيه
                <ArrowLeft className="w-5 h-5 mr-2" />
              </Button>
            </Link>
            <Link href="/free-lesson">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold px-10 py-6 text-lg rounded-xl">
                جرب درساً مجانياً
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span>ضمان استرداد 14 يوم</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>وصول مدى الحياة</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span>شهادة معتمدة</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
