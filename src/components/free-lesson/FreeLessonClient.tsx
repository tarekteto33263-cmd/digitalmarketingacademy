
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Lock, Mail, User, ChevronLeft, CheckCircle, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const FREE_LESSONS = [
  { id: "fl1", title: "مقدمة في التسويق الرقمي", duration: "25 دقيقة", isUnlocked: true },
  { id: "fl2", title: "الفرق بين التسويق التقليدي والرقمي", duration: "20 دقيقة", isUnlocked: false },
  { id: "fl3", title: "قنوات التسويق الرقمي", duration: "30 دقيقة", isUnlocked: false },
];

export default function FreeLessonClient() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeLesson, setActiveLesson] = useState(FREE_LESSONS[0]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error("يرجى ملء جميع الحقول");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setIsRegistered(true);
    toast.success("تم التسجيل! يمكنك الآن مشاهدة الدرس المجاني 🎉");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="hero-gradient text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 bg-[#FF6B35]/20 border border-[#FF6B35]/30 rounded-full px-4 py-2 mb-6">
              <Gift className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-sm font-medium text-[#FF6B35]">درس مجاني 100%</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black mb-4">
              ابدأ رحلتك مع{" "}
              <span className="text-[#FF6B35]">درس مجاني</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              سجل بريدك الإلكتروني واحصل على وصول فوري لأول درس من كورس التسويق الرقمي مجاناً
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-black rounded-2xl overflow-hidden aspect-video">
              {isRegistered ? (
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0A2540] to-[#1a4a8a]">
                  <div className="w-20 h-20 rounded-full bg-[#FF6B35]/20 border-2 border-[#FF6B35] flex items-center justify-center mb-4">
                    <Play className="w-8 h-8 text-[#FF6B35] fill-[#FF6B35] mr-1" />
                  </div>
                  <p className="text-white font-semibold">سجل للمشاهدة المجانية</p>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <h2 className="font-bold text-[#0A2540] dark:text-white mb-4">الدروس المجانية</h2>
              <div className="space-y-2">
                {FREE_LESSONS.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => isRegistered && lesson.isUnlocked && setActiveLesson(lesson)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-right transition-colors ${
                      activeLesson.id === lesson.id
                        ? "bg-orange-50 dark:bg-orange-900/20 border border-[#FF6B35]/30"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      lesson.isUnlocked ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-700"
                    }`}>
                      {lesson.isUnlocked ? (
                        <Play className="w-3 h-3 text-green-600 fill-green-600" />
                      ) : (
                        <Lock className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{lesson.title}</div>
                      <div className="text-xs text-gray-400">{lesson.duration}</div>
                    </div>
                    {!lesson.isUnlocked && (
                      <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        مدفوع
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {!isRegistered ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-24"
              >
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center mx-auto mb-3">
                    <Gift className="w-7 h-7 text-[#FF6B35]" />
                  </div>
                  <h3 className="font-black text-[#0A2540] dark:text-white text-xl">احصل على درسك المجاني</h3>
                  <p className="text-gray-500 text-sm mt-1">سجل الآن ومشاهدة فورية</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <Label htmlFor="free-name">الاسم الكامل</Label>
                    <div className="relative mt-1">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="free-name"
                        placeholder="أدخل اسمك"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="free-email">البريد الإلكتروني</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="free-email"
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pr-10"
                        required
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#FF6B35] hover:bg-[#e55a25] text-white font-bold py-5 rounded-xl"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        شاهد الدرس المجاني
                        <ChevronLeft className="w-4 h-4 mr-2" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-4 space-y-2">
                  {["وصول فوري للدرس المجاني", "لا يوجد بطاقة ائتمان", "محتوى حصري ومميز"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 sticky top-24"
              >
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">🎉</div>
                  <h3 className="font-black text-[#0A2540] dark:text-white text-xl">مرحباً بك!</h3>
                  <p className="text-gray-500 text-sm mt-1">يمكنك الآن مشاهدة الدرس المجاني</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 mb-4 text-center">
                  <p className="text-sm text-[#FF6B35] font-medium">
                    هل أعجبك الدرس؟ سجل الآن للوصول لكامل الكورس
                  </p>
                </div>
                <Link href="/checkout">
                  <Button className="w-full bg-[#FF6B35] hover:bg-[#e55a25] text-white font-bold py-5 rounded-xl">
                    سجل في الكورس الكامل
                    <ChevronLeft className="w-4 h-4 mr-2" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
