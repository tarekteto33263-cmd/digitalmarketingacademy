
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Users, Star, Clock, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COURSE_DATA } from "@/data/mock-data";

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {suffix === "/5" ? count.toFixed(1) : count.toLocaleString("ar-EG")}
      {suffix}
    </span>
  );
}

export default function HeroSection() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="hero-gradient text-white py-20 lg:py-28 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-[#FF6B35] blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 rounded-full bg-blue-400 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#FF6B35]/20 border border-[#FF6B35]/30 rounded-full px-4 py-2 mb-6">
              <Star className="w-4 h-4 text-[#FF6B35] fill-[#FF6B35]" />
              <span className="text-sm font-medium text-[#FF6B35]">
                الكورس الأكثر مبيعاً في 2024
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-6">
              احترف{" "}
              <span className="text-[#FF6B35]">التسويق الرقمي</span>
              {" "}والإعلانات الممولة في{" "}
              <span className="text-[#FF6B35]">60 يوم</span>
            </h1>

            <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-lg">
              تعلم من الصفر حتى الاحتراف مع أفضل الخبراء. SEO، إعلانات فيسبوك وجوجل، تحليل البيانات، وبناء Funnels مبيعات ناجحة.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/checkout">
                <Button size="lg" className="bg-[#FF6B35] hover:bg-[#e55a25] text-white font-bold px-8 py-6 text-lg rounded-xl shadow-lg shadow-orange-500/30">
                  سجل الآن
                  <ChevronLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-bold px-8 py-6 text-lg rounded-xl"
                onClick={() => setShowVideo(true)}
              >
                <Play className="w-5 h-5 ml-2 fill-white" />
                شاهد الدرس المجاني
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-black text-[#FF6B35]">
                  <AnimatedCounter target={3847} suffix="+" />
                </div>
                <div className="text-sm text-gray-400 mt-1">طالب مسجل</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[#FF6B35]">
                  <AnimatedCounter target={4.9} suffix="/5" />
                </div>
                <div className="text-sm text-gray-400 mt-1">تقييم الطلاب</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[#FF6B35]">
                  <AnimatedCounter target={40} suffix="+" />
                </div>
                <div className="text-sm text-gray-400 mt-1">ساعة تعليمية</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/40 border border-white/10">
              {showVideo ? (
                <iframe
                  src={COURSE_DATA.intro_video_url}
                  className="w-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative">
                  <img
                    src={COURSE_DATA.thumbnail_url}
                    alt="كورس التسويق الرقمي"
                    className="w-full aspect-video object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button
                      onClick={() => setShowVideo(true)}
                      className="w-20 h-20 rounded-full bg-[#FF6B35] flex items-center justify-center shadow-xl shadow-orange-500/40 hover:scale-110 transition-transform"
                    >
                      <Play className="w-8 h-8 text-white fill-white mr-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-sm">+127 طالب</div>
                <div className="text-xs text-gray-500">انضموا هذا الأسبوع</div>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div>
                <div className="font-bold text-gray-900 dark:text-white text-sm">40+ ساعة</div>
                <div className="text-xs text-gray-500">محتوى تعليمي</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
