
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Tag, Shield, Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { COURSE_DATA } from "@/data/mock-data";

const VALID_COUPONS: Record<string, number> = {
  "WELCOME50": 50,
  "DIGITAL30": 30,
  "LAUNCH20": 20,
};

export default function CheckoutClient() {
  const [currency, setCurrency] = useState<"EGP" | "USD">("EGP");
  const [plan, setPlan] = useState<"one_time" | "installment">("one_time");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const basePrice = plan === "one_time"
    ? (currency === "EGP" ? COURSE_DATA.price_egp : COURSE_DATA.price_usd)
    : (currency === "EGP" ? COURSE_DATA.installment_price_egp! : COURSE_DATA.installment_price_usd!);

  const discountAmount = (basePrice * discount) / 100;
  const finalPrice = basePrice - discountAmount;
  const currencySymbol = currency === "EGP" ? "جنيه" : "$";

  const handleApplyCoupon = () => {
    const upperCode = couponCode.toUpperCase();
    if (VALID_COUPONS[upperCode]) {
      setDiscount(VALID_COUPONS[upperCode]);
      setCouponApplied(true);
      toast.success(`تم تطبيق كوبون خصم ${VALID_COUPONS[upperCode]}%!`);
    } else {
      toast.error("كوبون الخصم غير صحيح أو منتهي الصلاحية");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsLoading(false);
    toast.success("تم التسجيل بنجاح! سيتم توجيهك لبوابة الدفع...");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-black text-[#0A2540] dark:text-white mb-2">
          إتمام التسجيل
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          خطوة واحدة تفصلك عن احتراف التسويق الرقمي
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-[#0A2540] dark:text-white mb-4">اختر خطة الدفع</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPlan("one_time")}
                className={`p-4 rounded-xl border-2 text-right transition-all ${plan === "one_time" ? "border-[#FF6B35] bg-orange-50 dark:bg-orange-900/20" : "border-gray-200 dark:border-gray-600"}`}
              >
                <div className="font-bold text-[#0A2540] dark:text-white text-sm">دفعة واحدة</div>
                <div className="text-[#FF6B35] font-black text-lg mt-1">
                  {currency === "EGP" ? `${COURSE_DATA.price_egp.toLocaleString("ar-EG")} جنيه` : `$${COURSE_DATA.price_usd}`}
                </div>
                <div className="text-xs text-green-600 mt-1">وفر 20%</div>
              </button>
              <button
                onClick={() => setPlan("installment")}
                className={`p-4 rounded-xl border-2 text-right transition-all ${plan === "installment" ? "border-[#FF6B35] bg-orange-50 dark:bg-orange-900/20" : "border-gray-200 dark:border-gray-600"}`}
              >
                <div className="font-bold text-[#0A2540] dark:text-white text-sm">تقسيط 3 أشهر</div>
                <div className="text-[#FF6B35] font-black text-lg mt-1">
                  {currency === "EGP" ? `${COURSE_DATA.installment_price_egp?.toLocaleString("ar-EG")} جنيه` : `$${COURSE_DATA.installment_price_usd}`}
                  <span className="text-sm font-normal">/شهر</span>
                </div>
                <div className="text-xs text-gray-500 mt-1">× 3 أشهر</div>
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              {(["EGP", "USD"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currency === c ? "bg-[#0A2540] text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"}`}
                >
                  {c === "EGP" ? "🇪🇬 جنيه مصري" : "🇺🇸 دولار أمريكي"}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-[#0A2540] dark:text-white mb-4">بياناتك الشخصية</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">الاسم الكامل *</Label>
                <Input
                  id="name"
                  placeholder="أدخل اسمك الكامل"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">رقم الهاتف / واتساب</Label>
                <Input
                  id="phone"
                  placeholder="+20 1XX XXX XXXX"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>كوبون الخصم</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    placeholder="أدخل كود الخصم"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied || !couponCode}
                    className="flex-shrink-0"
                  >
                    <Tag className="w-4 h-4 ml-1" />
                    {couponApplied ? "مطبق ✓" : "تطبيق"}
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-1">جرب: WELCOME50 أو DIGITAL30</p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FF6B35] hover:bg-[#e55a25] text-white font-bold py-6 text-lg rounded-xl"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري المعالجة...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    ادفع الآن {finalPrice.toLocaleString("ar-EG")} {currencySymbol}
                    <ChevronLeft className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
            <h2 className="font-bold text-[#0A2540] dark:text-white mb-4">ملخص الطلب</h2>
            <div className="flex gap-3 mb-4">
              <img
                src={COURSE_DATA.thumbnail_url}
                alt="الكورس"
                className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
              />
              <div>
                <div className="font-semibold text-sm text-[#0A2540] dark:text-white leading-tight">
                  {COURSE_DATA.title}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {plan === "one_time" ? "دفعة واحدة" : "تقسيط 3 أشهر"}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">السعر الأصلي</span>
                <span className="font-medium">{basePrice.toLocaleString("ar-EG")} {currencySymbol}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>خصم {discount}%</span>
                  <span>- {discountAmount.toLocaleString("ar-EG")} {currencySymbol}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-lg text-[#0A2540] dark:text-white border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                <span>الإجمالي</span>
                <span className="text-[#FF6B35]">{finalPrice.toLocaleString("ar-EG")} {currencySymbol}</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {[
                "وصول مدى الحياة للكورس",
                "شهادة إتمام معتمدة",
                "ملفات PDF وChecklists",
                "مجموعة واتساب خاصة",
                "ضمان استرداد 14 يوم",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield className="w-4 h-4" />
              <span>دفع آمن ومشفر بـ SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
