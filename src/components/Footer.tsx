
import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A2540] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#FF6B35] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">أكاديمية التسويق الرقمي</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
              منصة تعليمية متخصصة في التسويق الرقمي والإعلانات الممولة. نساعدك على احتراف التسويق الرقمي وبناء مسيرة مهنية ناجحة.
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF6B35]" />
                <span>info@digitalmarketing-academy.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF6B35]" />
                <span>+20 123 456 7890</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF6B35]" />
                <span>القاهرة، مصر</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {[
                { href: "/", label: "الرئيسية" },
                { href: "/course", label: "الكورس" },
                { href: "/free-lesson", label: "درس مجاني" },
                { href: "/checkout", label: "سجل الآن" },
                { href: "/dashboard", label: "لوحة التحكم" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-[#FF6B35] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">الدعم</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              {[
                { href: "/", label: "الأسئلة الشائعة" },
                { href: "/", label: "سياسة الخصوصية" },
                { href: "/", label: "شروط الاستخدام" },
                { href: "/", label: "سياسة الاسترداد" },
                { href: "/", label: "تواصل معنا" },
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="hover:text-[#FF6B35] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2024 أكاديمية التسويق الرقمي. جميع الحقوق محفوظة.</p>
          <p>صُنع بـ ❤️ لمساعدتك على النجاح</p>
        </div>
      </div>
    </footer>
  );
}
