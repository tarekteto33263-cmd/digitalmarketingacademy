
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/course", label: "الكورس" },
  { href: "/free-lesson", label: "درس مجاني" },
  { href: "/landing", label: "عرض خاص" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 dark:bg-[#0A2540]/95 backdrop-blur-md border-b border-gray-100 dark:border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B35] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-[#0A2540] dark:text-white">
              أكاديمية التسويق الرقمي
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-[#FF6B35] dark:hover:text-[#FF6B35] font-medium transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth">
              <Button variant="outline" size="sm" className="border-[#0A2540] text-[#0A2540] dark:border-white dark:text-white hover:bg-[#0A2540] hover:text-white">
                تسجيل الدخول
              </Button>
            </Link>
            <Link href="/checkout">
              <Button size="sm" className="bg-[#FF6B35] hover:bg-[#e55a25] text-white">
                سجل الآن
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-[#0A2540] border-t border-gray-100 dark:border-white/10"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-gray-600 dark:text-gray-300 hover:text-[#FF6B35] font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 dark:border-white/10">
                <Link href="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full border-[#0A2540] text-[#0A2540] dark:border-white dark:text-white">
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link href="/checkout" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-[#FF6B35] hover:bg-[#e55a25] text-white">
                    سجل الآن
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
