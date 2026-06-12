# Habib-summary - پلان دیتابیس و معماری سیستم

## نمای کلی

سیستم آپلود فایل و خلاصه‌سازی هوشمند برای کتاب‌ها. کاربران می‌توانند فایل‌های PDF، Word (DOCX) و تصویر (JPEG/PNG) را آپلود کنند و سیستم با توجه به حجم کتاب، یک خلاصه هوشمند تولید می‌کند.

> **توجه:** این پلان برای پیاده‌سازی در محیط تولید با backend واقعی طراحی شده است. نسخه فعلی GitHub Pages از کتابخانه‌های سمت کلاینت (PDF.js, Mammoth.js, Tesseract.js) برای استخراج متن و الگوریتم خلاصه‌سازی extractive استفاده می‌کند.

---

## ۱. معماری کلی

```
[مرورگر کاربر] → (آپلود فایل) → [GitHub Pages / Static Host]
                          ↓
               [CDN Libraries: PDF.js / Mammoth.js / Tesseract.js]
                          ↓
                 [استخراج متن از فایل]
                          ↓
               [الگوریتم خلاصه‌سازی Extractive]
                          ↓
                 [نمایش خلاصه به کاربر]
```

### معماری پیشنهادی برای نسخه کامل (با Backend)

```
[مرورگر کاربر] → [API Gateway] → [Backend Server (Node.js/Python)]
                          ↓                    ↓
                 [ذخیره فایل در Cloud Storage]  [پردازش با LLM / AI]
                          ↓                    ↓
                 [ذخیره در دیتابیس] ← [متن استخراج‌شده + خلاصه]
                          ↓
                 [نمایش نتیجه به کاربر]
```

---

## ۲. دیتابیس (PostgreSQL / MongoDB)

### جدول Users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);
```

### جدول Books (کتاب‌های آپلود شده)

```sql
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500),
    author VARCHAR(300),
    file_type VARCHAR(10) CHECK (file_type IN ('pdf', 'docx', 'jpeg', 'png', 'jpg')),
    file_url TEXT NOT NULL,          -- لینک فایل در Cloud Storage
    file_size_bytes BIGINT,
    original_filename VARCHAR(500),
    page_count INT,
    language VARCHAR(20) DEFAULT 'persian',
    upload_date TIMESTAMP DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending'  -- pending, processing, completed, failed
);
```

### جدول ExtractedText (متن استخراج شده)

```sql
CREATE TABLE extracted_text (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE UNIQUE,
    raw_text TEXT NOT NULL,           -- متن کامل استخراج شده
    word_count INT,                   -- تعداد کلمات
    char_count INT,                   -- تعداد کاراکترها
    extraction_method VARCHAR(50),    -- pdfjs, mammoth, tesseract
    extraction_time_ms INT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### جدول Summaries (خلاصه‌ها)

```sql
CREATE TABLE summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    short_summary TEXT NOT NULL,       -- خلاصه کوتاه (۲-۳ جمله)
    medium_summary TEXT NOT NULL,      -- خلاصه متوسط (۱ پاراگراف)
    long_summary TEXT NOT NULL,        -- خلاصه بلند (۳-۵ پاراگراف)
    compression_ratio DECIMAL(5,2),    -- نسبت فشرده‌سازی (مثلاً ۰.۱۵ یعنی ۱۵٪ متن اصلی)
    model_used VARCHAR(100),           -- مدل استفاده شده (bart, gpt, custom)
    created_at TIMESTAMP DEFAULT NOW()
);
```

### جدول SummaryFeedback (بازخورد کاربران)

```sql
CREATE TABLE summary_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    summary_id UUID REFERENCES summaries(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### جدول ProcessingQueue (صف پردازش)

```sql
CREATE TABLE processing_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE UNIQUE,
    priority INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'queued',  -- queued, processing, done, error
    attempt_count INT DEFAULT 0,
    last_error TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## ۳. دیاگرام روابط دیتابیس

```
users ────< books ────< extracted_text
  │           │
  │           └───────< summaries ────< summary_feedback
  │
  └───────────────────< summary_feedback
```

---

## ۴. API طراحی (RESTful)

### ۴.۱. آپلود فایل

```
POST /api/upload
Content-Type: multipart/form-data

Parameters:
  - file: (pdf|docx|jpeg|png)
  - language: (persian|english) optional

Response:
{
  "book_id": "uuid",
  "status": "pending",
  "file_name": "example.pdf",
  "file_size": 2048576,
  "estimated_time": 30
}
```

### ۴.۲. دریافت وضعیت پردازش

```
GET /api/books/{book_id}/status

Response:
{
  "book_id": "uuid",
  "status": "processing|completed|failed",
  "progress": 65,
  "stage": "extracting_text"
}
```

### ۴.۳. دریافت خلاصه

```
GET /api/books/{book_id}/summary?length=medium

Response:
{
  "book_id": "uuid",
  "title": "کتاب نمونه",
  "author": "نویسنده",
  "summary": {
    "short": "...",
    "medium": "...",
    "long": "..."
  },
  "stats": {
    "original_words": 45000,
    "summary_words": 2250,
    "compression_ratio": 0.05
  }
}
```

### ۴.۴. ثبت بازخورد

```
POST /api/summary/{summary_id}/feedback

Body:
{
  "rating": 4,
  "comment": "خلاصه بسیار خوب بود"
}
```

### ۴.۵. دریافت کتاب‌های کاربر

```
GET /api/users/{user_id}/books?page=1&limit=10

Response:
{
  "books": [...],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

---

## ۵. پایپلاین خلاصه‌سازی

### مرحله ۱: استخراج متن
| نوع فایل | کتابخانه | توضیح |
|----------|----------|-------|
| PDF | PDF.js / PyMuPDF | استخراج متن با حفظ پاراگراف‌ها |
| DOCX | Mammoth.js / python-docx | استخراج متن از Word |
| JPEG/PNG | Tesseract.js / Tesseract OCR | تشخیص متن از روی تصویر |

### مرحله ۲: پیش‌پردازش متن
- حذف هدر و فوتر
- حذف اعداد صفحه
- نرمال‌سازی فاصله‌ها
- تشخیص زبان متن
- تقسیم به پاراگراف و جمله

### مرحله ۳: خلاصه‌سازی (۳ روش)

#### روش A: Extractive (سبک - سمت کلاینت)
- امتیازدهی جملات بر اساس: فراوانی کلمات کلیدی، position جملات، شباهت به عنوان
- انتخاب top-N جمله با بالاترین امتیاز
- مزیت: سریع، بدون نیاز به API

#### روش B: Abstractive با AI (پیشنهادی - سمت سرور)
- استفاده از مدل BART-large یا GPT برای خلاصه‌سازی
- تنظیم length با توجه به حجم کتاب
- خلاصه به زبان اصلی کتاب (فارسی یا انگلیسی)

#### روش C: Hybrid
-先用 extractive برای کاهش متن به ۳۰٪
- سپس abstractive برای تولید خلاصه نهایی

### مرحله ۴: تنظیم طول خلاصه بر اساس حجم کتاب

| حجم کتاب (کلمه) | خلاصه کوتاه | خلاصه متوسط | خلاصه بلند |
|-----------------|-------------|-------------|------------|
| < 1000 | ۵۰ کلمه | ۱۰۰ کلمه | ۲۰۰ کلمه |
| 1000 - 10000 | ۱۰۰ کلمه | ۳۰۰ کلمه | ۵۰۰ کلمه |
| 10000 - 50000 | ۲۰۰ کلمه | ۵۰۰ کلمه | ۱۰۰۰ کلمه |
| > 50000 | ۳۰۰ کلمه | ۷۰۰ کلمه | ۱۵۰۰ کلمه |

---

## ۶. فناوری‌های پیشنهادی

### Frontend (GitHub Pages - فعلی)
- **HTML/CSS/JS** با Tailwind CSS
- **PDF.js** برای استخراج متن از PDF
- **Mammoth.js** برای استخراج متن از DOCX
- **Tesseract.js** برای OCR تصاویر
- **Web Workers** برای پردازش سنگین در پس‌زمینه

### Backend (برای نسخه کامل)
- **Node.js** (Express/Fastify) یا **Python** (FastAPI/Flask)
- **PostgreSQL** یا **MongoDB** برای دیتابیس
- **Redis** برای صف پردازش و کش
- **MinIO / AWS S3** برای ذخیره فایل‌ها
- **Celery / Bull** برای پردازش async

### AI/ML
- **Hugging Face Transformers** (BART, PEGASUS, mT5)
- **OpenAI GPT / Claude API** برای خلاصه‌سازی حرفه‌ای
- **LangChain** برای مدیریت پایپلاین

---

## ۷. امنیت

- محدودیت حجم فایل: ۵۰MB
- محدودیت نوع فایل: pdf, docx, jpeg, png
- اسکن فایل‌ها برای بدافزار
- rate limiting بر اساس IP
- احراز هویت با JWT
- ذخیره رمز عبور با bcrypt
- HTTPS اجباری

---

## ۸. استقرار (Deployment)

### نسخه فعلی (GitHub Pages)
✅ Static hosting
✅ بدون نیاز به سرور
❌ فقط پردازش سمت کلاینت
❌ محدودیت در قدرت پردازش

### نسخه کامل (پیشنهادی)
- Backend: **Railway / Render / VPS**
- Storage: **AWS S3 / Cloudflare R2**
- Database: **Supabase / Railway PostgreSQL**
- Queue: **Redis Cloud**
- Domain: **habib-summary.com**

---

## ۹. مراحل پیاده‌سازی

| مرحله | توضیح | زمان |
|-------|-------|------|
| ۱ | پیاده‌سازی سمت کلاینت (PDF.js, Mammoth.js, Tesseract.js) | ✅ انجام شد |
| ۲ | الگوریتم Extractive Summarization سمت کلاینت | ✅ انجام شد |
| ۳ | راه‌اندازی Backend (Node.js + Express) | ~۲ روز |
| ۴ | طراحی دیتابیس و migrations | ~۱ روز |
| ۵ | API آپلود و پردازش فایل | ~۲ روز |
| ۶ | یکپارچه‌سازی AI برای خلاصه‌سازی | ~۳ روز |
| ۷ | احراز هویت و پروفایل کاربری | ~۱ روز |
| ۸ | تست و استقرار نسخه کامل | ~۱ روز |

---

**تاریخ:** ۱۲ ژوئن ۲۰۲۶  
**تهیه شده توسط:** Habib Rahman Yonocy
