
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Play, CheckCircle, ChevronLeft, ChevronRight,
  MessageSquare, Download, Send, ThumbsUp, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { UNITS_DATA, MOCK_PROGRESS } from "@/data/mock-data";

const MOCK_COMMENTS = [
  {
    id: "c1",
    user: "محمد أحمد",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&q=80",
    content: "شرح ممتاز جداً! استفدت كثيراً من هذا الدرس",
    time: "منذ ساعتين",
    likes: 12,
  },
  {
    id: "c2",
    user: "سارة محمود",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&q=80",
    content: "سؤال: هل يمكن تطبيق هذا على المشاريع الصغيرة؟",
    time: "منذ 5 ساعات",
    likes: 5,
  },
];

export default function LessonClient() {
  const [comment, setComment] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const currentUnit = UNITS_DATA[0];
  const currentLesson = currentUnit.lessons[2];

  const completedCount = Object.values(MOCK_PROGRESS).filter(Boolean).length;
  const totalLessons = UNITS_DATA.reduce((acc, u) => acc + u.lessons.length, 0);
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const handleMarkComplete = () => {
    setIsCompleted(true);
    toast.success("تم تحديد الدرس كمكتمل! 🎉");
  };

  const handleSubmitComment = () => {
    if (!comment.trim()) return;
    toast.success("تم إرسال تعليقك بنجاح!");
    setComment("");
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    const score = 80;
    if (score >= 70) {
      toast.success(`أحسنت! حصلت على ${score}% في الاختبار 🎉`);
    } else {
      toast.error(`حصلت على ${score}%. تحتاج 70% للنجاح. حاول مرة أخرى`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-black rounded-2xl overflow-hidden aspect-video">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-[#FF6B35] font-semibold mb-1">
                  الوحدة {currentUnit.order_index}: {currentUnit.title}
                </div>
                <h1 className="text-xl font-black text-[#0A2540] dark:text-white">
                  {currentLesson.title}
                </h1>
                <p className="text-gray-500 text-sm mt-1">{currentLesson.duration}</p>
              </div>
              <Button
                onClick={handleMarkComplete}
                disabled={isCompleted}
                className={`flex-shrink-0 ${isCompleted ? "bg-green-500 hover:bg-green-500" : "bg-[#FF6B35] hover:bg-[#e55a25]"} text-white`}
              >
                <CheckCircle className="w-4 h-4 ml-2" />
                {isCompleted ? "مكتمل ✓" : "تحديد كمكتمل"}
              </Button>
            </div>

            <div className="flex gap-3 mt-4">
              <Button variant="outline" size="sm" className="text-xs">
                <Download className="w-3 h-3 ml-1" />
                تحميل PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => setShowQuiz(!showQuiz)}
              >
                <Award className="w-3 h-3 ml-1" />
                اختبار الوحدة
              </Button>
            </div>
          </div>

          {showQuiz && !quizSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-[#FF6B35]/30"
            >
              <h2 className="font-black text-[#0A2540] dark:text-white text-lg mb-6">
                🎯 اختبار الوحدة الأولى
              </h2>
              <div className="space-y-6">
                {[
                  { q: "ما هو الفرق الرئيسي بين التسويق الرقمي والتقليدي؟", options: ["التكلفة فقط", "إمكانية القياس والاستهداف الدقيق", "الوصول للجمهور", "جميع ما سبق"] },
                  { q: "ما هو اختصار KPI؟", options: ["Key Performance Indicator", "Key Product Index", "Key Process Integration", "Key Profit Index"] },
                  { q: "ما هو Customer Journey Map؟", options: ["خريطة جغرافية للعملاء", "رحلة العميل من الوعي حتى الشراء", "قائمة بأسماء العملاء", "تقرير مبيعات شهري"] },
                ].map((q, qi) => (
                  <div key={qi}>
                    <p className="font-semibold text-[#0A2540] dark:text-white mb-3 text-sm">
                      {qi + 1}. {q.q}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => (
                        <label key={oi} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer hover:border-[#FF6B35] transition-colors">
                          <input
                            type="radio"
                            name={`q${qi}`}
                            value={opt}
                            onChange={() => setQuizAnswers({ ...quizAnswers, [`q${qi}`]: opt })}
                            className="accent-[#FF6B35]"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleSubmitQuiz}
                className="mt-6 bg-[#FF6B35] hover:bg-[#e55a25] text-white w-full"
              >
                تسليم الاختبار
              </Button>
            </motion.div>
          )}

          {quizSubmitted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800 text-center"
            >
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-black text-green-700 dark:text-green-400 text-xl mb-2">أحسنت!</h3>
              <p className="text-green-600 dark:text-green-500">حصلت على 80% في اختبار الوحدة الأولى</p>
              <div className="mt-4">
                <Progress value={80} className="h-3" />
              </div>
            </motion.div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-[#0A2540] dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#FF6B35]" />
              التعليقات والأسئلة
            </h2>

            <div className="space-y-4 mb-6">
              {MOCK_COMMENTS.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <img src={c.avatar} alt={c.user} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                      <div className="font-semibold text-sm text-[#0A2540] dark:text-white mb-1">{c.user}</div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{c.content}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>{c.time}</span>
                      <button className="flex items-center gap-1 hover:text-[#FF6B35]">
                        <ThumbsUp className="w-3 h-3" />
                        {c.likes}
                      </button>
                      <button className="hover:text-[#FF6B35]">رد</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Textarea
                placeholder="اكتب سؤالك أو تعليقك هنا..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1 resize-none"
                rows={3}
              />
              <Button
                onClick={handleSubmitComment}
                className="bg-[#FF6B35] hover:bg-[#e55a25] text-white self-end"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24 overflow-hidden">
            <div className="p-4 bg-[#0A2540] text-white">
              <div className="text-sm font-semibold mb-2">تقدمك في الكورس</div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">{progressPercent}% مكتمل</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div className="progress-bar h-2 rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {UNITS_DATA.slice(0, 3).map((unit) => (
                <div key={unit.id}>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900/50 text-xs font-bold text-gray-500 border-b border-gray-100 dark:border-gray-700">
                    الوحدة {unit.order_index}: {unit.title}
                  </div>
                  {unit.lessons.map((lesson) => {
                    const done = MOCK_PROGRESS[lesson.id];
                    return (
                      <Link
                        key={lesson.id}
                        href={`/lesson/${lesson.id}`}
                        className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 border-b border-gray-50 dark:border-gray-700/50 transition-colors"
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-green-100" : "bg-gray-100 dark:bg-gray-700"}`}>
                          {done ? (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          ) : (
                            <Play className="w-2.5 h-2.5 text-gray-400" />
                          )}
                        </div>
                        <span className={`text-xs flex-1 leading-tight ${done ? "text-gray-400 line-through" : "text-gray-700 dark:text-gray-300"}`}>
                          {lesson.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="w-full text-xs">
                  عرض كل الدروس
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <Button variant="outline" className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4" />
          الدرس السابق
        </Button>
        <Button className="bg-[#FF6B35] hover:bg-[#e55a25] text-white flex items-center gap-2">
          الدرس التالي
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
