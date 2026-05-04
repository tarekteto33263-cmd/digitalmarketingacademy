
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen, CheckCircle, Clock, Award, Play, Download,
  MessageSquare, Upload, ChevronLeft, BarChart2, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UNITS_DATA, MOCK_USER, MOCK_PROGRESS } from "@/data/mock-data";

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
      <div
        className="progress-bar h-full rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function DashboardClient() {
  const [activeTab, setActiveTab] = useState<"lessons" | "assignments" | "resources">("lessons");

  const completedLessons = Object.values(MOCK_PROGRESS).filter(Boolean).length;
  const totalLessons = UNITS_DATA.reduce((acc, u) => acc + u.lessons.length, 0);
  const progressPercent = Math.round((completedLessons / totalLessons) * 100);

  const lastLesson = (() => {
    for (const unit of UNITS_DATA) {
      for (const lesson of unit.lessons) {
        if (!MOCK_PROGRESS[lesson.id]) {
          return { lesson, unit };
        }
      }
    }
    return null;
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="bg-[#0A2540] rounded-2xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={MOCK_USER.avatar_url}
                alt={MOCK_USER.full_name}
                className="w-14 h-14 rounded-full border-2 border-[#FF6B35]"
              />
              <div>
                <h1 className="text-xl font-black">مرحباً، {MOCK_USER.full_name}! 👋</h1>
                <p className="text-gray-400 text-sm">استمر في التعلم، أنت على الطريق الصحيح</p>
              </div>
            </div>
            {lastLesson && (
              <Link href={`/lesson/${lastLesson.lesson.id}`}>
                <Button className="bg-[#FF6B35] hover:bg-[#e55a25] text-white">
                  <Play className="w-4 h-4 ml-2 fill-white" />
                  استكمل من حيث توقفت
                  <ChevronLeft className="w-4 h-4 mr-1" />
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">تقدمك في الكورس</span>
              <span className="text-[#FF6B35] font-bold">{progressPercent}%</span>
            </div>
            <ProgressBar value={progressPercent} />
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-400" />
                {completedLessons} درس مكتمل
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-blue-400" />
                {totalLessons - completedLessons} درس متبقي
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: BookOpen, label: "الوحدات", value: "8", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { icon: CheckCircle, label: "مكتمل", value: `${completedLessons}`, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
          { icon: BarChart2, label: "التقدم", value: `${progressPercent}%`, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
          { icon: Award, label: "الشهادة", value: progressPercent >= 100 ? "جاهزة" : "قريباً", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
        ].map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div className="text-2xl font-black text-[#0A2540] dark:text-white">{value}</div>
            <div className="text-xs text-gray-500 mt-1">{label}</div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: "lessons", label: "الدروس", icon: BookOpen },
          { id: "assignments", label: "الواجبات", icon: Upload },
          { id: "resources", label: "الملفات", icon: Download },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? "border-[#FF6B35] text-[#FF6B35]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === "lessons" && (
        <div className="space-y-4">
          {UNITS_DATA.map((unit, unitIndex) => (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: unitIndex * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                <div className="w-8 h-8 rounded-lg bg-[#0A2540] flex items-center justify-center text-white text-sm font-bold">
                  {unit.order_index}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-[#0A2540] dark:text-white text-sm">{unit.title}</div>
                  <div className="text-xs text-gray-500">{unit.lessons_count} درس</div>
                </div>
                <div className="text-xs text-[#FF6B35] font-medium">
                  {unit.lessons.filter((l) => MOCK_PROGRESS[l.id]).length}/{unit.lessons.length}
                </div>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {unit.lessons.map((lesson) => {
                  const isCompleted = MOCK_PROGRESS[lesson.id];
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lesson/${lesson.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCompleted ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-700"
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Play className="w-3 h-3 text-gray-400" />
                        )}
                      </div>
                      <span className={`flex-1 text-sm ${isCompleted ? "text-gray-400 line-through" : "text-gray-700 dark:text-gray-300"}`}>
                        {lesson.title}
                      </span>
                      <span className="text-xs text-gray-400">{lesson.duration}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === "assignments" && (
        <div className="space-y-4">
          {UNITS_DATA.map((unit) => (
            <div key={unit.id} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[#0A2540] dark:text-white text-sm">
                  واجب الوحدة {unit.order_index}: {unit.title}
                </h3>
                <Badge className={unit.order_index <= 1 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
                  {unit.order_index <= 1 ? "مسلّم" : "معلق"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                قم بتطبيق ما تعلمته في هذه الوحدة على مشروع حقيقي وأرسل نتائجك.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs">
                  <Download className="w-3 h-3 ml-1" />
                  تحميل التعليمات
                </Button>
                {unit.order_index > 1 && (
                  <Button size="sm" className="bg-[#FF6B35] hover:bg-[#e55a25] text-white text-xs">
                    <Upload className="w-3 h-3 ml-1" />
                    تسليم الواجب
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "resources" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "دليل التسويق الرقمي الشامل", type: "PDF", size: "2.4 MB", unit: "الوحدة 1" },
            { title: "قالب Content Calendar", type: "Excel", size: "1.1 MB", unit: "الوحدة 2" },
            { title: "Checklist إعلانات فيسبوك", type: "PDF", size: "0.8 MB", unit: "الوحدة 3" },
            { title: "قالب تقرير Google Analytics", type: "PDF", size: "1.5 MB", unit: "الوحدة 7" },
            { title: "نموذج خطة تسويقية كاملة", type: "Word", size: "1.2 MB", unit: "الوحدة 8" },
            { title: "Checklist SEO الشامل", type: "PDF", size: "0.9 MB", unit: "الوحدة 5" },
          ].map((resource, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm text-[#0A2540] dark:text-white">{resource.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{resource.type} • {resource.size} • {resource.unit}</div>
              </div>
              <Button size="sm" variant="outline" className="flex-shrink-0 text-xs">
                <Download className="w-3 h-3 ml-1" />
                تحميل
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
