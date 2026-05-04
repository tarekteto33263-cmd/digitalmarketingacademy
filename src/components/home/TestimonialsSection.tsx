
"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS_DATA } from "@/data/mock-data";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block bg-[#FF6B35]/10 text-[#FF6B35] font-semibold px-4 py-2 rounded-full text-sm mb-4">
            آراء الطلاب
          </span>
          <h2 className="text-3xl lg:text-4xl font-black text-[#0A2540] dark:text-white mb-4">
            ماذا يقول طلابنا؟
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            أكثر من 3,847 طالب غيّروا مساراتهم المهنية بعد إتمام الكورس
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS_DATA.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 relative card-hover"
            >
              <Quote className="w-8 h-8 text-[#FF6B35]/20 absolute top-4 left-4" />
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={testimonial.avatar_url}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-[#0A2540] dark:text-white text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.job_title}
                  </div>
                </div>
              </div>
              <StarRating rating={testimonial.rating} />
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-3">
                {testimonial.content}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-[#0A2540] rounded-2xl p-8 text-white text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "4.9/5", label: "متوسط التقييم" },
              { value: "98%", label: "نسبة الرضا" },
              { value: "3,847+", label: "طالب مسجل" },
              { value: "1,243+", label: "تقييم موثق" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl font-black text-[#FF6B35]">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
