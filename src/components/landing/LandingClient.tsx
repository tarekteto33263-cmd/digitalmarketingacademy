
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock, Users, Star, CheckCircle, ChevronLeft,
  Phone, Mail, User, MessageCircle, Zap, Award, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function CountdownTimer() {
  const [time, setTime] = useState({ hours: 5, minutes: 47, seconds: 33 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) return { hours: 5, minutes: 59, seconds: 59 };
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-2 justify-center">
      {[
        { value: pad(time.hours), label: "ساعة" },
        { value: pad(time.minutes), label: "دقيقة" },
        { value: pad(time.seconds), label: "ثانية" },
      ].map(({ value, label }, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="bg-[#0A2540] text-white rounded-xl px-4 py-3 text-center min-w-[60px]">
            <div className="text-2xl font-black">{value}</div>
            <div className="text-xs text-gray-400">{label}</div>
          </div>
          {i < 2 && <span className="text-[#FF6B35] font-black text-2xl">:</span>}
        </div>
      ))}
    </div>
  );
}

export default function LandingClient() {
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("يرجى ملء الاسم والبريد الإلكتروني");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
    toast.success("تم التسجيل! سنتواصل معك قريباً 🎉");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="hero-gradient text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-red-400 fill-red-400" />
              <span className="text-sm font-bold text-red-300">عرض محدود - ينتهي قريباً!</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">
              احترف{" "}
              <span className="text-[#FF6B35]">التسويق الرقمي</span>
              <br />
              في 60 يوم فقط
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              انضم لأكثر من 3,847 طالب غيّروا مساراتهم المهنية. الكورس الأكثر شمولاً في التسويق الرقمي والإعلانات الممولة.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
              {[
                { icon: Star, text: "4.9/5 تقييم" },
                { icon: Users, text: "3,847+ طالب" },
                { icon: Award, text: "شهادة معتمدة" },
                { icon: TrendingUp, text: "40+ ساعة محتوى" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-300">
                  <Icon className="w-4 h-4 text-[#FF6B35]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 inline-block">
              <p className="text-sm text-gray-300 mb-3 font-medium">⏰ العرض ينتهي خلال:</p>
              <CountdownTimer />
              <p className="text-xs text-red-300 mt-3">تبقى 23 مقعداً فقط بهذا السعر!</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-2xl font-black text-[#0A2540] dark:text-white mb-6">
              ماذا ستحصل عليه؟
            </h2>
            <div className="space-y-4">
              {[
                { title: "80+ درس متخصص", desc: "فيديوهات عالية الجودة مع شرح تفصيلي" },
                { title: "8 وحدات شاملة", desc: "من الأساسيات حتى الاحتراف الكامل" },
                { title: "واجبات عملية", desc: "تطبيق فوري على مشاريع حقيقية" },
                { title: "شهادة معتمدة", desc: "شهادة إتمام باسمك قابلة للمشاركة" },
                { title: "مجموعة واتساب", desc: "تواصل مع المدرب والطلاب مباشرة" },
                { title: "وصول مدى الحياة", desc: "تحديثات مجانية مستمرة للمحتوى" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[#0A2540] dark:text-white text-sm">{item.title}</div>
                    <div className="text-gray-500 text-xs">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-[#0A2540] rounded-2xl text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm line-through">السعر الأصلي: 4,999 جنيه</span>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">خصم 40%</span>
              </div>
              <div className="text-4xl font-black text-[#FF6B35]">2,999 جنيه</div>
              <div className="text-gray-400 text-sm mt-1">أو 1,200 جنيه × 3 أشهر</div>
            </div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700"
            >
              {!isSubmitted ? (
                <>
                  <h3 className="text-2xl font-black text-[#0A2540] dark:text-white mb-2 text-center">
                    سجل الآن
                  </h3>
                  <p className="text-gray-500 text-sm text-center mb-6">
                    احجز مقعدك قبل انتهاء العرض
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="land-name">الاسم الكامل *</Label>
                      <div className="relative mt-1">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="land-name"
                          placeholder="أدخل اسمك الكامل"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="pr-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="land-email">البريد الإلكتروني *</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="land-email"
                          type="email"
                          placeholder="example@email.com"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="pr-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="land-whatsapp">رقم واتساب</Label>
                      <div className="relative mt-1">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="land-whatsapp"
                          placeholder="+20 1XX XXX XXXX"
                          value={form.whatsapp}
                          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                          className="pr-10"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#FF6B35] hover:bg-[#e55a25] text-white font-black py-6 text-lg rounded-xl shadow-lg shadow-orange-500/30"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          احجز مقعدك الآن
                          <ChevronLeft className="w-5 h-5 mr-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    <span>ضمان استرداد 14 يوم • دفع آمن</span>
                  </div>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-black text-[#0A2540] dark:text-white mb-2">
                    تم التسجيل بنجاح!
                  </h3>
                  <p className="text-gray-500 mb-6">
                    سنتواصل معك على واتساب خلال 24 ساعة لإتمام التسجيل
                  </p>
                  <Link href="/checkout">
                    <Button className="bg-[#FF6B35] hover:bg-[#e55a25] text-white font-bold px-8 py-5 rounded-xl">
                      أكمل الدفع الآن
                    </Button>
                  </Link>
                  <div className="mt-4">
                    <a
                      href="https://wa.me/201234567890"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-green-600 text-sm font-medium hover:underline"
                    >
                      <MessageCircle className="w-4 h-4" />
                      تواصل معنا على واتساب
                    </a>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
