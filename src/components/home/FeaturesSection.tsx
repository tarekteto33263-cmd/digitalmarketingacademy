
"use client";

import { motion } from "framer-motion";
import { Search, Target, BarChart2, Layers, FileText, TrendingUp } from "lucide-react";
import { FEATURES_DATA } from "@/data/mock-data";

const iconMap: Record<string, React.ElementType> = {
  Search, Target, BarChart2, Layers, FileText, TrendingUp,
};

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[#FF6B35]/10 text-[#FF6B35] font-semibold px-4 py-2 rounded-full text-sm mb-4">
            ماذا ستتعلم؟
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-[#0A2540] dark:text-white mb-4">
            كل ما تحتاجه لتحترف التسويق الرقمي
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            كورس شامل يغطي جميع جوانب التسويق الرقمي الحديث بأسلوب عملي وتطبيقي
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_DATA.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 card-hover"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} dark:bg-opacity-20 flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="font-bold text-lg text-[#0A2540] dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
