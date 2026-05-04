
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, Play, FileText, CheckSquare, Award, Clock,
  Users, Star, ChevronDown, Lock, Unlock, Target, Search,
  BarChart2, Layers, TrendingUp, Map
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COURSE_DATA, UNITS_DATA } from "@/data/mock-data";

const unitIconMap: Record<string, React.ElementType> = {
  BookOpen, FileText, Target, Search, TrendingUp, Layers, BarChart2, Map,
};

function UnitCard({ unit, index }: { unit: typeof UNITS_DATA[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const Icon = unitIconMap[unit.icon] || BookOpen;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-right"
      >
        <div className="w-10 h-10 rounded-xl bg-[#0A2540] flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-[#FF6B35] font-semibold">الوحدة {unit.order_index}</span>
          </div>
          <div className="font-bold text-[#0A2540] dark:text-white">{unit.title}</div>
          <div className="text-xs text-gray-500 mt-1">
            {unit.lessons_count} درس • {unit.duration}
          </div>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="p-4 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
            {unit.description}
          </div>
          {unit.lessons.map((lesson, i) => (
            <div
              key={lesson.id}
              className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div className="w-7 h-7 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                {lesson.is_free_preview ? (
                  <Play className="w-3 h-3 text-[#FF6B35] fill-[#FF6B35]" />
                ) : (
                  <Lock className="w-3 h-3 text-gray-400" />
                )}
              </div>
              <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{lesson.title}</span>
              <div className="flex items-center gap-2">
                {lesson.is_free_preview && (
                  <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0.5">مجاني</Badge>
                )}
                <span className="text-xs text-gray-400">{lesson.duration}</span>
              </div>
            </div>
          ))}
          <div className="px-5 py-3 flex items-center gap-4 text-xs text-gray-500 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> ملفات PDF</span>
            <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3" /> واجب عملي</span>
            <span className="flex items-center gap-1"><Award className="w-3 h-3" /> كويز</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoursePageClient() {
  const [currency, setCurrency] = useState<"EGP" | "USD">("EGP");

  const price = currency === "EGP" ? COURSE_DATA.price_egp : COURSE_DATA.price_usd;
  const installmentPrice = currency === "EGP" ? COURSE_DATA.installment_price_egp : COURSE_DATA.installment_price_usd;
  const currencySymbol = currency === "EGP" ? "جنيه" : "$";

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="hero-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="bg-[#FF6B35] text-white mb-4">الكورس الأكثر مبيعاً</Badge>
            <h1 className="text-3xl lg:text-4xl font-black mb-4">{COURSE_DATA.title}</h1>
            <p className="text-gray-300 text-lg mb-6">{COURSE_DATA.short_description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="font-bold">{COURSE_DATA.rating}</span>
                <span className="text-gray-400">({COURSE_DATA.reviews_count.toLocaleString("ar-EG")} تقييم)</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{COURSE_DATA.students_count.toLocaleString("ar-EG")} طالب</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{COURSE_DATA.total_hours} ساعة</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-gray-400" />
                <span>{COURSE_DATA.total_lessons} درس</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-black text-[#0A2540] dark:text-white mb-4">ماذا ستتعلم؟</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {COURSE_DATA.what_you_learn?.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Unlock className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                )) ?? [
                  "إنشاء وإدارة حملات إعلانية ناجحة",
                  "تحسين محركات البحث SEO",
                  "تحليل البيانات واتخاذ القرارات",
                  "بناء صفحات هبوط عالية التحويل",
                  "استراتيجية المحتوى الرقمي",
                  "قياس ROI وتحسين الأداء",
                  "بناء خطة تسويقية متكاملة",
                  "إدارة ميزانية الإعلانات بكفاءة",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Unlock className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-black text-[#0A2540] dark:text-white mb-6">محتوى الكورس</h2>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span>8 وحدات</span>
                <span>•</span>
                <span>{COURSE_DATA.total_lessons} درس</span>
                <span>•</span>
                <span>{COURSE_DATA.total_hours} ساعة</span>
              </div>
              <div className="space-y-3">
                {UNITS_DATA.map((unit, index) => (
                  <UnitCard key={unit.id} unit={unit} index={index} />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <img
                  src={COURSE_DATA.thumbnail_url}
                  alt="الكورس"
                  className="w-full aspect-video object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => setCurrency("EGP")}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${currency === "EGP" ? "bg-[#0A2540] text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      جنيه مصري
                    </button>
                    <button
                      onClick={() => setCurrency("USD")}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${currency === "USD" ? "bg-[#0A2540] text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      دولار
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl font-black text-[#0A2540] dark:text-white">
                      {price.toLocaleString("ar-EG")} {currencySymbol}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      أو {installmentPrice} {currencySymbol} × 3 أشهر
                    </div>
                  </div>

                  <Link href="/checkout">
                    <Button className="w-full bg-[#FF6B35] hover:bg-[#e55a25] text-white font-bold py-6 text-lg rounded-xl mb-3">
                      سجل الآن
                    </Button>
                  </Link>
                  <Link href="/free-lesson">
                    <Button variant="outline" className="w-full border-[#0A2540] text-[#0A2540] dark:border-white dark:text-white py-5 rounded-xl">
                      جرب درساً مجانياً
                    </Button>
                  </Link>

                  <div className="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    {[
                      { icon: Clock, text: "وصول مدى الحياة" },
                      { icon: BookOpen, text: `${COURSE_DATA.total_lessons} درس متخصص` },
                      { icon: FileText, text: "ملفات PDF وChecklists" },
                      { icon: Award, text: "شهادة إتمام معتمدة" },
                      { icon: Users, text: "مجموعة واتساب خاصة" },
                    ].map(({ icon: Icon, text }, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-[#FF6B35]" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                    <p className="text-green-700 dark:text-green-400 text-xs font-medium">
                      ✓ ضمان استرداد كامل خلال 14 يوم
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
