
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQS_DATA } from "@/data/mock-data";

function FAQItem({ faq, isOpen, onToggle }: {
  faq: typeof FAQS_DATA[0];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-right bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
      >
        <span className="font-semibold text-[#0A2540] dark:text-white text-sm md:text-base">
          {faq.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#FF6B35] flex-shrink-0 mr-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-5 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pt-4">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>("faq1");

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[#FF6B35]/10 text-[#FF6B35] font-semibold px-4 py-2 rounded-full text-sm mb-4">
            الأسئلة الشائعة
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-[#0A2540] dark:text-white mb-4">
            هل لديك أسئلة؟
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            إجابات على أكثر الأسئلة شيوعاً من طلابنا
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQS_DATA.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
