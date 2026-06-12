# Habib-summary - ساختار پروژه

> آخرین به‌روزرسانی: ۱۲ ژوئن ۲۰۲۶

```
habib-summary/
│
├── index.html                 # برنامه اصلی (single-page application)
│                              # شامل: Tailwind CSS + PDF.js + Mammoth.js + Tesseract.js
│                              ──── بخش‌ها:
│                              ├── خلاصه ۳ کتاب (Atomic Habits, Rich Dad Poor Dad, 7 Habits)
│                              ├── سوالات چهارگزینه‌ای (۳ سوال برای هر کتاب)
│                              ├── آزمون ترکیبی (۵ سوال تصادفی)
│                              └── آپلود و خلاصه‌سازی (PDF, DOCX, JPEG/PNG)
│
├── PLAN.md                    # پلان دیتابیس و معماری backend
│                              ──── شامل:
│                              ├── دیاگرام معماری کلی
│                              ├── ۶ جدول دیتابیس (Users, Books, ExtractedText, Summaries, Feedback, Queue)
│                              ├── REST API endpoints
│                              ├── پایپلاین خلاصه‌سازی (۳ روش)
│                              ├── فناوری‌های پیشنهادی
│                              └── مراحل پیاده‌سازی
│
├── STRUCTURE.md               # این فایل - ساختار پروژه
│
├── README.md                  # توضیحات پروژه (فارسی)
│
├── _config.yml                # تنظیمات GitHub Pages (غیرفعال کردن Jekyll)
│
└── .git/                      # ریپازیتوری گیت (محلی)
    ├── config                 # تنظیمات remote
    ├── HEAD                   # اشاره‌گر به branch فعلی
    ├── refs/heads/main        # commit hash branch main
    ├── objects/               # آبجکت‌های گیت
    └── hooks/                 # hookهای پیش‌فرض گیت
```

## توضیح فایل‌ها

| فایل | حجم | نقش |
|------|-----|-----|
| `index.html` | ~۵۹KB | تک‌فایل اصلی شامل HTML/CSS/JS + CDN |
| `PLAN.md` | ~۱۱KB | پلان معماری و دیتابیس برای نسخه backend دار |
| `STRUCTURE.md` | ~۲KB | مستند ساختار پروژه (این فایل) |
| `README.md` | ~۱KB | توضیحات پروژه برای GitHub |
| `_config.yml` | ~۱۷۶B | غیرفعال‌سازی Jekyll برای GitHub Pages |
| `.git/` | — | metadata گیت (push نشده به GitHub) |

## وابستگی‌های CDN (خارجی)

| کتابخانه | نسخه | کاربرد |
|----------|------|--------|
| Tailwind CSS | v3 | فریمورک CSS (utility-first) |
| PDF.js | v3.11.174 | استخراج متن از فایل PDF |
| Mammoth.js | v1.6.0 | استخراج متن از فایل Word (DOCX) |
| Tesseract.js | v5 | تشخیص متن از روی تصویر (OCR) |
| Vazirmatn | — | فونت فارسی (Google Fonts) |
| Tabler Icons | — | آیکون‌های SVG |

## وضعیت Deploy

- **Platform:** GitHub Pages
- **Repository:** `habibrahmanyonocy786-cmyk/habib-summary`
- **Branch:** `main` (root)
- **URL:** https://habibrahmanyonocy786-cmyk.github.io/habib-summary/
- **Status:** ✅ Active

## توسعه آینده

مسیرهای توسعه بر اساس PLAN.md:

1. راه‌اندازی Backend (Node.js + Express)
2. پیاده‌سازی دیتابیس (PostgreSQL)
3. احراز هویت کاربران
4. خلاصه‌سازی با AI (Hugging Face / OpenAI)
5. ذخیره و مدیریت کتاب‌های آپلود شده

---

**توسعه‌دهنده:** Habib Rahman Yonocy  
**تماس:** 0784258414
