# Habib-summary — طرح کامل Backend و دیتابیس

> **نسخه:** ۱.۰  
> **تاریخ:** ۱۲ ژوئن ۲۰۲۶  
> **تهیه شده توسط:** Habib Rahman Yonocy  
> **وضعیت:** پیشنهادی برای پیاده‌سازی

---

## فهرست مطالب

1. [معماری کلی](#۱-معماری-کلی)
2. [تکنولوژی‌های پیشنهادی](#۲-تکنولوژی‌های-پیشنهادی)
3. [ساختار پروژه Backend](#۳-ساختار-پروژه-backend)
4. [Database Schema کامل](#۴-database-schema-کامل)
5. [ER Diagram](#۵-er-diagram)
6. [REST API کامل](#۶-rest-api-کامل)
7. [Authentication & Authorization](#۷-authentication--authorization)
8. [پایپلاین پردازش فایل](#۸-پایپلاین-پردازش-فایل)
9. [File Storage Strategy](#۹-file-storage-strategy)
10. [Error Handling](#۱۰-error-handling)
11. [Testing Strategy](#۱۱-testing-strategy)
12. [Deployment با Docker](#۱۲-deployment-با-docker)
13. [CI/CD Pipeline](#۱۳-cicd-pipeline)
14. [برنامه زمان‌بندی پیاده‌سازی](#۱۴-برنامه-زمان‌بندی-پیاده‌سازی)

---

## ۱. معماری کلی

### معماری فعلی (GitHub Pages — سمت کلاینت)

```
[مرورگر] → GitHub Pages (Static)
                ↓
        CDN: PDF.js, Mammoth.js, Tesseract.js
                ↓
        استخراج متن + خلاصه‌سازی Extractive
                ↓
        نمایش نتیجه در مرورگر
```

### معماری پیشنهادی (Backend کامل)

```
                          ┌─────────────────────┐
                          │   Cloudflare DNS     │
                          └─────────┬───────────┘
                                    ↓
                          ┌─────────────────────┐
                          │   Nginx / Caddy      │
                          │   (Reverse Proxy)    │
                          └─────────┬───────────┘
                                    ↓
                    ┌───────────────┴───────────────┐
                    │         API Gateway           │
                    │   Rate Limiter / Auth / Log   │
                    └───────────────┬───────────────┘
                                    ↓
        ┌───────────────────────────┼───────────────────────────┐
        ↓                           ↓                           ↓
┌───────────────┐         ┌───────────────────┐     ┌───────────────────┐
│  User Service │         │   Book Service     │     │  Summary Service  │
│  (Auth/Users) │         │  (CRUD + Upload)   │     │  (AI + Extractive)│
└───────┬───────┘         └─────────┬─────────┘     └─────────┬─────────┘
        │                          │                          │
┌───────┴───────┐         ┌─────────┴─────────┐     ┌─────────┴─────────┐
│  PostgreSQL   │         │  MinIO / S3       │     │  Redis Queue      │
│  (دیتابیس اصلی)│         │  (ذخیره فایل)      │     │  (صف پردازش)      │
└───────────────┘         └───────────────────┘     └───────────────────┘
                                    ↓
                          ┌─────────────────────┐
                          │  Worker (Bull/Celery)│
                          │  استخراج + خلاصه‌سازی│
                          │  AI / LLM           │
                          └─────────────────────┘
```

---

## ۲. تکنولوژی‌های پیشنهادی

### گزینه A: Node.js (توصیه شده)

| لایه | تکنولوژی | دلیل انتخاب |
|------|----------|-------------|
| **Runtime** | Node.js v22+ | هماهنگی با JavaScript فرانت‌اند |
| **Framework** | Express.js یا Fastify | سرعت بالا، community بزرگ |
| **Type Safety** | TypeScript | کاهش باگ‌های runtime |
| **ORM** | Prisma یا Drizzle | type-safe query builder |
| **Validation** | Zod | اعتبارسنجی اسکیماها |
| **Auth** | JWT (jsonwebtoken) + bcrypt | احراز هویت استاندارد |
| **Queue** | Bull (Redis) | صف پردازش async |
| **File Upload** | Multer + Sharp | آپلود و پردازش تصویر |
| **Testing** | Vitest + Supertest | تست واحد و integration |

### گزینه B: Python

| لایه | تکنولوژی |
|------|----------|
| **Framework** | FastAPI (async, auto-docs) |
| **ORM** | SQLAlchemy 2.0 + Alembic |
| **Validation** | Pydantic v2 |
| **Auth** | FastAPI Users / python-jose |
| **Queue** | Celery + Redis |
| **Testing** | pytest + httpx |

### دیتابیس

| دیتابیس | کاربرد |
|---------|--------|
| **PostgreSQL 16** | دیتابیس اصلی (relational data) |
| **Redis 7** | کش، session، صف پردازش |
| **MinIO / S3** | ذخیره فایل‌های آپلودی |

---

## ۳. ساختار پروژه Backend

```
habib-summary-api/
├── src/
│   ├── index.ts                  # ورودی اصلی
│   ├── app.ts                    # کانفیگ Express/Fastify
│   ├── config/
│   │   ├── database.ts           # کانکشن دیتابیس
│   │   ├── redis.ts              # کانکشن Redis
│   │   ├── s3.ts                 # کانکشن MinIO/S3
│   │   └── env.ts                # متغیرهای محیطی (Zod validation)
│   ├── middleware/
│   │   ├── auth.ts               # احراز هویت JWT
│   │   ├── rate-limiter.ts       # محدودیت نرخ درخواست
│   │   ├── upload.ts             # مدیریت آپلود فایل
│   │   ├── error-handler.ts      # مدیریت خطاهای سراسری
│   │   └── logger.ts             # لاگ درخواست‌ها
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.schema.ts    # ZOD validation schemas
│   │   ├── users/
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.routes.ts
│   │   ├── books/
│   │   │   ├── books.controller.ts
│   │   │   ├── books.service.ts
│   │   │   ├── books.routes.ts
│   │   │   └── books.schema.ts
│   │   ├── articles/
│   │   │   ├── articles.controller.ts
│   │   │   ├── articles.service.ts
│   │   │   └── articles.routes.ts
│   │   ├── questions/
│   │   │   ├── questions.controller.ts
│   │   │   ├── questions.service.ts
│   │   │   └── questions.routes.ts
│   │   ├── quiz/
│   │   │   ├── quiz.controller.ts
│   │   │   ├── quiz.service.ts
│   │   │   └── quiz.routes.ts
│   │   ├── upload/
│   │   │   ├── upload.controller.ts
│   │   │   ├── upload.service.ts
│   │   │   └── upload.routes.ts
│   │   ├── summary/
│   │   │   ├── summary.controller.ts
│   │   │   ├── summary.service.ts
│   │   │   ├── summary.routes.ts
│   │   │   └── summarizer.ts     # الگوریتم خلاصه‌سازی
│   │   └── admin/
│   │       ├── admin.controller.ts
│   │       └── admin.routes.ts
│   ├── workers/
│   │   ├── pdf.worker.ts         # پردازش PDF در پس‌زمینه
│   │   ├── ocr.worker.ts         # پردازش OCR در پس‌زمینه
│   │   └── summary.worker.ts     # خلاصه‌سازی AI در پس‌زمینه
│   └── utils/
│       ├── hash.ts               # توابع hashing
│       ├── jwt.ts                # توابع JWT
│       ├── sanitize.ts           # پاکسازی HTML
│       └── helpers.ts            # توابع کمکی
├── prisma/
│   ├── schema.prisma             # اسکیما دیتابیس
│   └── migrations/               # فایل‌های migration
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── .dockerignore
├── scripts/
│   ├── seed.ts                   # دیتای اولیه (10 کتاب، 30 مقاله)
│   └── migrate.ts                # اجرای migrations
├── .env.example
├── .eslintrc.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## ۴. Database Schema کامل

### ۴.۱. جداول اصلی (PostgreSQL)

#### Users

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username        VARCHAR(100) UNIQUE NOT NULL,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(200),
    avatar_url      TEXT,
    role            VARCHAR(20) NOT NULL DEFAULT 'user'
                    CHECK (role IN ('user', 'admin', 'moderator')),
    is_active       BOOLEAN DEFAULT true,
    is_verified     BOOLEAN DEFAULT false,
    last_login      TIMESTAMPTZ,
    refresh_token   TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

#### Books (کتاب‌های پیش‌فرض + آپلودی)

```sql
CREATE TABLE books (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    title           VARCHAR(500) NOT NULL,
    author          VARCHAR(300),
    emoji           VARCHAR(10) DEFAULT '📚',
    color           VARCHAR(50) DEFAULT 'from-blue-500 to-indigo-600',
    summary         TEXT,
    book_type       VARCHAR(20) NOT NULL DEFAULT 'preloaded'
                    CHECK (book_type IN ('preloaded', 'uploaded')),
    file_type       VARCHAR(10) CHECK (file_type IN ('pdf', 'docx', 'jpeg', 'png', 'jpg')),
    file_url        TEXT,
    file_size_bytes BIGINT,
    original_filename VARCHAR(500),
    page_count      INT,
    language        VARCHAR(20) DEFAULT 'persian',
    word_count      INT,
    is_published    BOOLEAN DEFAULT true,
    upload_status   VARCHAR(20) DEFAULT 'completed'
                    CHECK (upload_status IN ('pending', 'processing', 'completed', 'failed')),
    view_count      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_books_user ON books(user_id);
CREATE INDEX idx_books_type ON books(book_type);
CREATE INDEX idx_books_published ON books(is_published);
CREATE INDEX idx_books_created ON books(created_at DESC);
```

#### Book Tags

```sql
CREATE TABLE book_tags (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID REFERENCES books(id) ON DELETE CASCADE,
    tag     VARCHAR(50) NOT NULL,
    UNIQUE(book_id, tag)
);

CREATE INDEX idx_book_tags_tag ON book_tags(tag);
```

#### Articles (مقالات اقتصادی)

```sql
CREATE TABLE articles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id     VARCHAR(50) UNIQUE,
    title           TEXT NOT NULL,
    source          VARCHAR(200),
    url             TEXT,
    published_at    TIMESTAMPTZ,
    summary         TEXT,
    content         TEXT,
    category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
    sentiment       VARCHAR(20) DEFAULT 'neutral'
                    CHECK (sentiment IN ('positive', 'negative', 'neutral')),
    language        VARCHAR(10) DEFAULT 'en',
    is_featured     BOOLEAN DEFAULT false,
    view_count      INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_date ON articles(published_at DESC);
CREATE INDEX idx_articles_sentiment ON articles(sentiment);
CREATE INDEX idx_articles_featured ON articles(is_featured) WHERE is_featured = true;
```

#### Article Tags

```sql
CREATE TABLE article_tags (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id  UUID REFERENCES articles(id) ON DELETE CASCADE,
    tag         VARCHAR(50) NOT NULL,
    UNIQUE(article_id, tag)
);

CREATE INDEX idx_article_tags_tag ON article_tags(tag);
```

#### Categories

```sql
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(100) UNIQUE NOT NULL,
    name        VARCHAR(200) NOT NULL,
    description TEXT,
    icon        VARCHAR(10) DEFAULT '📂',
    sort_order  INT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

#### Questions (سوالات کتاب‌ها)

```sql
CREATE TABLE questions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id     UUID REFERENCES books(id) ON DELETE CASCADE,
    question    TEXT NOT NULL,
    options     JSONB NOT NULL,
    correct     INT NOT NULL CHECK (correct >= 0 AND correct <= 9),
    difficulty  VARCHAR(20) DEFAULT 'medium'
                CHECK (difficulty IN ('easy', 'medium', 'hard')),
    sort_order  INT DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questions_book ON questions(book_id);
CREATE INDEX idx_questions_active ON questions(is_active) WHERE is_active = true;
```

#### Quiz Attempts (تلاش‌های آزمون)

```sql
CREATE TABLE quiz_attempts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(20) NOT NULL
                CHECK (type IN ('single_book', 'mixed', 'custom')),
    book_id     UUID REFERENCES books(id) ON DELETE SET NULL,
    score       INT NOT NULL DEFAULT 0,
    total       INT NOT NULL DEFAULT 0,
    percentage  DECIMAL(5,2),
    time_spent  INT,  -- seconds
    status      VARCHAR(20) DEFAULT 'in_progress'
                CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at  TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE INDEX idx_quiz_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_type ON quiz_attempts(type);
CREATE INDEX idx_quiz_status ON quiz_attempts(status);
```

#### Quiz Answers (پاسخ‌های هر سوال در آزمون)

```sql
CREATE TABLE quiz_answers (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id  UUID REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
    selected    INT,
    is_correct  BOOLEAN,
    answered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(attempt_id, question_id)
);

CREATE INDEX idx_quiz_answers_attempt ON quiz_answers(attempt_id);
```

#### Uploaded Files (فایل‌های آپلودی)

```sql
CREATE TABLE uploaded_files (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id         UUID REFERENCES books(id) ON DELETE SET NULL,
    original_name   VARCHAR(500) NOT NULL,
    storage_path    TEXT NOT NULL,
    mime_type       VARCHAR(100),
    file_size       BIGINT,
    file_hash       VARCHAR(64),   -- SHA-256 برای integrity check
    status          VARCHAR(20) DEFAULT 'pending'
                    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message   TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_uploaded_user ON uploaded_files(user_id);
CREATE INDEX idx_uploaded_status ON uploaded_files(status);
```

#### Extracted Texts (متن استخراج شده)

```sql
CREATE TABLE extracted_texts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id             UUID REFERENCES books(id) ON DELETE CASCADE UNIQUE,
    raw_text            TEXT NOT NULL,
    word_count          INT,
    char_count          INT,
    extraction_method   VARCHAR(50) NOT NULL,
    extraction_time_ms  INT,
    confidence_score    DECIMAL(5,2),  -- برای OCR
    created_at          TIMESTAMPTZ DEFAULT NOW()
);
```

#### Summaries (خلاصه‌ها)

```sql
CREATE TABLE summaries (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id           UUID REFERENCES books(id) ON DELETE CASCADE,
    user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
    short_summary     TEXT,
    medium_summary    TEXT NOT NULL,
    long_summary      TEXT,
    compression_ratio DECIMAL(5,4),
    word_count        INT,
    model_used        VARCHAR(100),
    is_ai_generated   BOOLEAN DEFAULT false,
    language          VARCHAR(20) DEFAULT 'persian',
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_summaries_book ON summaries(book_id);
CREATE INDEX idx_summaries_user ON summaries(user_id);
```

#### Summary Feedback (بازخورد خلاصه)

```sql
CREATE TABLE summary_feedback (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    summary_id  UUID REFERENCES summaries(id) ON DELETE CASCADE,
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    rating      INT CHECK (rating >= 1 AND rating <= 5),
    comment     TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(summary_id, user_id)
);
```

#### Processing Queue (صف پردازش)

```sql
CREATE TABLE processing_queue (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id       UUID REFERENCES books(id) ON DELETE CASCADE UNIQUE,
    priority      INT DEFAULT 0,
    queue_type    VARCHAR(50) NOT NULL
                  CHECK (queue_type IN ('extract_text', 'generate_summary', 'ocr')),
    status        VARCHAR(20) DEFAULT 'queued'
                  CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
    attempt_count INT DEFAULT 0,
    max_attempts  INT DEFAULT 3,
    last_error    TEXT,
    started_at    TIMESTAMPTZ,
    completed_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_queue_status ON processing_queue(status);
CREATE INDEX idx_queue_priority ON processing_queue(priority DESC, created_at ASC);
```

#### User Bookmarks (نشانک‌های کاربر)

```sql
CREATE TABLE user_bookmarks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    book_id     UUID REFERENCES books(id) ON DELETE CASCADE,
    notes       TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, book_id)
);
```

#### User Activity Log (لاگ فعالیت کاربران)

```sql
CREATE TABLE user_activity_log (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id   UUID,
    metadata    JSONB,
    ip_address  VARCHAR(45),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_user ON user_activity_log(user_id);
CREATE INDEX idx_activity_action ON user_activity_log(action);
CREATE INDEX idx_activity_created ON user_activity_log(created_at DESC);
```

---

## ۵. ER Diagram

```
users ────< books ────< questions
  │         │             │
  │         ├───< book_tags
  │         │
  │         ├───< extracted_texts
  │         │
  │         ├───< summaries ────< summary_feedback
  │         │
  │         ├───< uploaded_files
  │         │
  │         └───< processing_queue
  │
  ├───< quiz_attempts ────< quiz_answers
  │         │
  │         └───┐
  │             └─── questions (many-to-many through quiz_answers)
  │
  ├───< user_bookmarks ──── books
  │
  ├───< user_activity_log
  │
  └───< summary_feedback (direct)

categories ────< articles ────< article_tags
```

---

## ۶. REST API کامل

### ۶.۱. Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | ثبت‌نام کاربر جدید | ❌ |
| POST | `/api/v1/auth/login` | ورود و دریافت JWT | ❌ |
| POST | `/api/v1/auth/refresh` | refresh token | ❌ |
| POST | `/api/v1/auth/logout` | خروج و invalidate token | ✅ |
| POST | `/api/v1/auth/forgot-password` | فراموشی رمز | ❌ |
| POST | `/api/v1/auth/reset-password` | تنظیم رمز جدید | ❌ |
| GET  | `/api/v1/auth/verify-email/:token` | تأیید ایمیل | ❌ |
| GET  | `/api/v1/auth/me` | اطلاعات کاربر فعلی | ✅ |

#### Register Request
```json
POST /api/v1/auth/register
{
  "username": "habib",
  "email": "habib@example.com",
  "password": "SecurePass123!",
  "full_name": "Habib Rahman Yonocy"
}
```

#### Register Response
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "username": "habib", "email": "habib@example.com" },
    "access_token": "eyJhbGci...",
    "refresh_token": "eyJhbGci...",
    "expires_in": 3600
  }
}
```

### ۶.۲. Users

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/api/v1/users/:id` | دریافت پروفایل کاربر | ✅ | ❌ |
| PATCH | `/api/v1/users/:id` | بروزرسانی پروفایل | ✅ | ❌ |
| DELETE | `/api/v1/users/:id` | حذف حساب کاربری | ✅ | ❌ |
| GET | `/api/v1/users/:id/stats` | آمار کاربر (quiz scores, bookmarks) | ✅ | ❌ |
| GET | `/api/v1/users` | لیست کاربران (ادمین) | ✅ | ✅ |

### ۶.۳. Books

| Method | Endpoint | Description | Auth | Admin |
|--------|----------|-------------|------|-------|
| GET | `/api/v1/books` | لیست کتاب‌ها (با pagination, search, filter) | ❌ | ❌ |
| GET | `/api/v1/books/:id` | جزئیات کتاب + خلاصه | ❌ | ❌ |
| POST | `/api/v1/books` | ایجاد کتاب جدید | ✅ | ✅ |
| PATCH | `/api/v1/books/:id` | ویرایش کتاب | ✅ | ✅ |
| DELETE | `/api/v1/books/:id` | حذف کتاب | ✅ | ✅ |
| GET | `/api/v1/books/:id/questions` | سوالات کتاب | ❌ | ❌ |

#### List Books Request
```
GET /api/v1/books?page=1&limit=10&type=preloaded&search=habit&sort=created_at
```

#### List Books Response
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "کتاب عادات اتمی (Atomic Habits)",
        "author": "جیمز کلیر",
        "emoji": "⚛️",
        "summary": "کتاب عادات اتمی...",
        "question_count": 5,
        "view_count": 1240
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 10,
      "total_pages": 1
    }
  }
}
```

### ۶.۴. Articles

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/articles` | لیست مقالات (با filter, search, pagination) | ❌ |
| GET | `/api/v1/articles/:id` | جزئیات مقاله | ❌ |
| GET | `/api/v1/articles/categories` | لیست دسته‌بندی‌ها با تعداد | ❌ |
| GET | `/api/v1/articles/featured` | مقالات ویژه | ❌ |

#### Filter Parameters
```
GET /api/v1/articles?category=stock_market&sentiment=positive&search=SpaceX&date_from=2026-01-01&date_to=2026-06-12&sort=published_at&order=desc
```

### ۶.۵. Questions & Quiz

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/books/:id/questions` | سوالات یک کتاب | ❌ |
| POST | `/api/v1/quiz/start` | شروع آزمون جدید | ✅ |
| POST | `/api/v1/quiz/:attempt_id/answer` | ثبت پاسخ | ✅ |
| POST | `/api/v1/quiz/:attempt_id/finish` | پایان آزمون + نتیجه | ✅ |
| GET | `/api/v1/quiz/:attempt_id` | جزئیات آزمون | ✅ |
| GET | `/api/v1/quiz/history` | تاریخچه آزمون‌های کاربر | ✅ |
| GET | `/api/v1/quiz/stats` | آمار کلی آزمون‌ها | ✅ |

#### Start Quiz Request
```json
POST /api/v1/quiz/start
{
  "type": "mixed",
  "book_id": null,
  "question_count": 10
}
```

#### Start Quiz Response
```json
{
  "success": true,
  "data": {
    "attempt_id": "uuid",
    "questions": [
      { "id": "uuid", "question": "...", "options": ["...", "...", "...", "..."], "difficulty": "medium" }
    ],
    "total": 10,
    "time_limit": null
  }
}
```

#### Submit Answer Request
```json
POST /api/v1/quiz/{attempt_id}/answer
{
  "question_id": "uuid",
  "selected": 2
}
```

#### Finish Quiz Response
```json
{
  "success": true,
  "data": {
    "attempt_id": "uuid",
    "score": 7,
    "total": 10,
    "percentage": 70.0,
    "time_spent": 245,
    "answers": [
      {
        "question": "...",
        "selected": 2,
        "correct": 1,
        "is_correct": false,
        "correct_answer": "..."
      }
    ],
    "feedback": "🌟 خوب بود! می‌توانی بهتر هم باشی."
  }
}
```

### ۶.۶. Upload & Summarize

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/upload` | آپلود فایل (PDF/DOCX/Image) | ✅ |
| GET | `/api/v1/upload/:id/status` | وضعیت پردازش | ✅ |
| GET | `/api/v1/upload/:id/summary` | دریافت خلاصه | ✅ |
| DELETE | `/api/v1/upload/:id` | حذف فایل آپلودی | ✅ |

#### Upload Request
```
POST /api/v1/upload
Content-Type: multipart/form-data

file: @example.pdf
language: persian
```

#### Upload Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "pending",
    "file_name": "example.pdf",
    "file_size": 2048576,
    "estimated_time": 30
  }
}
```

### ۶.۷. Summaries

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/summaries/:id` | دریافت خلاصه | ❌ |
| POST | `/api/v1/summaries/:id/feedback` | ثبت بازخورد | ✅ |
| GET | `/api/v1/books/:id/summaries` | تاریخچه خلاصه‌های یک کتاب | ✅ |

### ۶.۸. Bookmarks

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/v1/bookmarks` | لیست نشانک‌های کاربر | ✅ |
| POST | `/api/v1/bookmarks` | افزودن نشانک | ✅ |
| DELETE | `/api/v1/bookmarks/:id` | حذف نشانک | ✅ |
| PATCH | `/api/v1/bookmarks/:id` | ویرایش یادداشت نشانک | ✅ |

### ۶.۹. Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/admin/dashboard` | آمار داشبورد |
| GET | `/api/v1/admin/users` | مدیریت کاربران |
| PATCH | `/api/v1/admin/users/:id/role` | تغییر نقش کاربر |
| POST | `/api/v1/admin/articles` | افزودن مقاله |
| PUT | `/api/v1/admin/articles/:id` | ویرایش مقاله |
| DELETE | `/api/v1/admin/articles/:id` | حذف مقاله |
| POST | `/api/v1/admin/seed` | بارگذاری دیتای اولیه (seed) |
| GET | `/api/v1/admin/logs` | مشاهده لاگ‌های سیستم |

### ۶.۱۰. پاسخ استاندارد API

#### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-06-12T09:00:00Z",
    "request_id": "req-uuid"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "اعتبارسنجی ناموفق",
    "details": [
      { "field": "email", "message": "ایمیل معتبر نیست" }
    ]
  },
  "meta": {
    "timestamp": "2026-06-12T09:00:00Z",
    "request_id": "req-uuid"
  }
}
```

#### Pagination Meta
```json
{
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## ۷. Authentication & Authorization

### ۷.۱. JWT Strategy

```
┌──────────┐         ┌──────────┐         ┌──────────┐
│  Client  │  POST   │  Server  │         │ Database │
│          │────────▶│          │────────▶│          │
│          │ /login  │          │  verify  │          │
│          │         │          │◀────────│          │
│          │◀────────│          │          │          │
│          │ JWT x 2 │          │          │          │
└──────────┘         └──────────┘         └──────────┘
```

**توکن‌ها:**
- **Access Token** (۱۵ دقیقه): در Authorization header
- **Refresh Token** (۷ روز): در HttpOnly Cookie یا body

**Payload Access Token:**
```json
{
  "sub": "user-uuid",
  "role": "user",
  "iat": 1686540000,
  "exp": 1686540900
}
```

### ۷.۲. Role-Based Access Control (RBAC)

| Role | Permissions |
|------|-------------|
| `admin` | دسترسی کامل به تمام endpoints |
| `moderator` | مدیریت مقالات، کتاب‌ها، نظارت بر کاربران |
| `user` | دسترسی به محتوا، آزمون‌ها، آپلود شخصی |

### ۷.۳. Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/auth/login` | ۵ درخواست | ۱۵ دقیقه |
| `/auth/register` | ۳ درخواست | ۱ ساعت |
| `/upload` | ۱۰ درخواست | ۱ ساعت |
| `/quiz/*` | ۶۰ درخواست | ۱ دقیقه |
| عمومی | ۱۰۰ درخواست | ۱ دقیقه |

### ۷.۴. Security Headers

```nginx
# در Nginx/Caddy
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' cdn.jsdelivr.net cdnjs.cloudflare.com
```

---

## ۸. پایپلاین پردازش فایل

### جریان کامل آپلود تا خلاصه

```
  کاربر
    │
    │  POST /api/v1/upload (multipart/form-data)
    ▼
  Upload Controller
    │
    ├── 1. اعتبارسنجی نوع فایل (pdf/docx/jpg/png)
    ├── 2. اعتبارسنجی حجم (max 50MB)
    ├── 3. محاسبه SHA-256 hash
    ├── 4. ذخیره در S3/MinIO
    ├── 5. ایجاد رکورد در uploaded_files (status: pending)
    ├── 6. ایجاد رکورد در processing_queue (status: queued)
    └── 7. پاسخ: { id, status: "pending", estimated_time }
    │
    ▼
  Worker (Bull/Celery)
    │
    ├── Step 1: استخراج متن
    │   ├── PDF  → PDF.js/PyMuPDF
    │   ├── DOCX → Mammoth.js/python-docx
    │   └── Image → Tesseract OCR
    │   ├── ذخیره در extracted_texts
    │   └── بروزرسانی status: "processing"
    │
    ├── Step 2: پیش‌پردازش متن
    │   ├── حذف هدر/فوتر/شماره صفحات
    │   ├── نرمال‌سازی فاصله‌ها
    │   ├── تشخیص زبان
    │   └── تقسیم به پاراگراف‌ها
    │
    ├── Step 3: خلاصه‌سازی
    │   ├── روش A: Extractive (سریع)
    │   │   └── امتیازدهی جملات → انتخاب top-N
    │   ├── روش B: AI Abstractive (کیفی)
    │   │   └── Hugging Face / OpenAI / Claude API
    │   └── روش C: Hybrid (پیشنهادی)
    │       └── Extractive → کاهش به ۳۰٪ → AI → خلاصه نهایی
    │
    ├── Step 4: ذخیره نتیجه
    │   ├── خلاصه در جدول summaries
    │   ├── بروزرسانی books.status = "completed"
    │   └── بروزرسانی processing_queue.status = "completed"
    │
    └── Step 5: Webhook / Notification (اختیاری)
        └── ارسال نوتیفیکیشن به کاربر
```

### دیاگرام زمانی

```
زمان │
     │
     ├─ 0s ──── آپلود فایل توسط کاربر
     ├─ 1s ──── ذخیره در S3 + ایجاد رکورد در DB
     ├─ 2s ──── شروع پردازش توسط Worker
     ├─ 3-30s ─ استخراج متن (بستگی به حجم فایل)
     ├─ 1s ──── پیش‌پردازش متن
     ├─ 5-60s ─ خلاصه‌سازی (AI یا Extractive)
     └─ Done ── ذخیره خلاصه + بروزرسانی وضعیت
```

---

## ۹. File Storage Strategy

### ساختار پوشه‌ها در S3/MinIO

```
habib-summary-files/
├── uploads/
│   ├── {year}/
│   │   ├── {month}/
│   │   │   ├── {user_id}/
│   │   │   │   ├── {uuid}.pdf
│   │   │   │   ├── {uuid}.docx
│   │   │   │   └── {uuid}.png
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── avatars/
│   └── {user_id}.jpg
└── temp/
    └── {uuid}/
```

### قوانین

| آیتم | مقدار |
|------|-------|
| حداکثر حجم فایل | ۵۰ مگابایت |
| فرمت‌های مجاز | PDF, DOCX, DOC, JPEG, PNG |
| نگهداری فایل | ۳۰ روز پس از آخرین دسترسی |
| CDN | Cloudflare / S3 Object Storage |
| Encryption | SSE-S3 در حالت Rest |

---

## ۱۰. Error Handling

### کدهای خطای استاندارد

| کد | HTTP Status | توضیح |
|----|-------------|-------|
| `VALIDATION_ERROR` | ۴۰۰ | خطای اعتبارسنجی ورودی |
| `UNAUTHORIZED` | ۴۰۱ | احراز هویت ناموفق |
| `FORBIDDEN` | ۴۰۳ | دسترسی غیرمجاز |
| `NOT_FOUND` | ۴۰۴ | منبع یافت نشد |
| `CONFLICT` | ۴۰۹ | تداخل (مثلاً ایمیل تکراری) |
| `RATE_LIMITED` | ۴۲۹ | محدودیت نرخ درخواست |
| `FILE_TOO_LARGE` | ۴۱۳ | حجم فایل بیش از حد مجاز |
| `UNSUPPORTED_FORMAT` | ۴۱۵ | فرمت فایل پشتیبانی نمی‌شود |
| `INTERNAL_ERROR` | ۵۰۰ | خطای داخلی سرور |
| `SERVICE_UNAVAILABLE` | ۵۰۳ | سرویس موقتاً در دسترس نیست |

### Global Error Handler

```typescript
// middleware/error-handler.ts
class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    public details?: any[]
  ) {
    super(code);
  }
}

// استفاده:
throw new AppError(404, 'NOT_FOUND', [
  { field: 'book_id', message: 'کتاب مورد نظر یافت نشد' }
]);
```

---

## ۱۱. Testing Strategy

### Unit Tests (Vitest)

```
tests/unit/
├── auth.service.test.ts
├── books.service.test.ts
├── quiz.service.test.ts
├── summarizer.test.ts
├── sanitize.test.ts
└── helpers.test.ts
```

### Integration Tests (Supertest)

```
tests/integration/
├── auth.test.ts
├── books.test.ts
├── articles.test.ts
├── quiz.test.ts
├── upload.test.ts
└── admin.test.ts
```

### E2E Tests (Playwright)

```
tests/e2e/
├── home.spec.ts
├── books.spec.ts
├── quiz.spec.ts
├── upload.spec.ts
└── admin.spec.ts
```

### Coverage Targets

| Type | Target |
|------|--------|
| Unit Tests | ۹۰%+ |
| Integration Tests | ۸۰%+ |
| E2E Tests | سناریوهای اصلی |

---

## ۱۲. Deployment با Docker

### Dockerfile

```dockerfile
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/habib_summary
      - REDIS_URL=redis://redis:6379
      - S3_ENDPOINT=http://minio:9000
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
      - redis
      - minio
    volumes:
      - uploads:/app/uploads

  worker:
    build: .
    command: npm run worker
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/habib_summary
      - REDIS_URL=redis://redis:6379
      - S3_ENDPOINT=http://minio:9000
    depends_on:
      - db
      - redis
      - minio

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: habib_summary
      POSTGRES_USER: user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_PASS}
    volumes:
      - minio-data:/data
    ports:
      - "9000:9000"
      - "9001:9001"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - api

volumes:
  pgdata:
  minio-data:
  uploads:
```

### nginx.conf

```nginx
server {
    listen 80;
    server_name api.habib-summary.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name api.habib-summary.com;

    ssl_certificate /etc/letsencrypt/live/api.habib-summary.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.habib-summary.com/privkey.pem;

    location / {
        proxy_pass http://api:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }

    # Upload limit
    client_max_body_size 60M;
}
```

---

## ۱۳. CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy Backend

on:
  push:
    branches: [main, develop]
    paths:
      - 'habib-summary-api/**'

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run test:e2e

  build-and-deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build Docker image
        run: docker build -t habib-summary-api .
      - name: Push to registry
        run: |
          docker tag habib-summary-api ${{ secrets.REGISTRY_URL }}/habib-summary-api:latest
          docker push ${{ secrets.REGISTRY_URL }}/habib-summary-api:latest
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.DEPLOY_HOST }}
          username: ${{ secrets.DEPLOY_USER }}
          key: ${{ secrets.DEPLOY_KEY }}
          script: |
            cd /opt/habib-summary
            docker compose pull
            docker compose up -d --force-recreate
            docker system prune -f
```

---

## ۱۴. برنامه زمان‌بندی پیاده‌سازی

| فاز | مرحله | توضیح | زمان تخمینی | وابستگی |
|-----|-------|-------|-------------|---------|
| **۱** | راه‌اندازی پروژه | Express/FastAPI + TypeScript + Prisma | ۱ روز | - |
| **۲** | Database Schema | Migration + Seed (۱۰ کتاب، ۳۰ مقاله) | ۱ روز | فاز ۱ |
| **۳** | Auth Module | ثبت‌نام، ورود، JWT, RBAC | ۲ روز | فاز ۲ |
| **۴** | Books API | CRUD کتاب‌ها + جستجو + Pagination | ۱ روز | فاز ۲ |
| **۵** | Articles API | CRUD مقالات + فیلتر + Category | ۱ روز | فاز ۲ |
| **۶** | Questions API | سوالات + Quiz Engine + نمره‌دهی | ۲ روز | فاز ۴ |
| **۷** | Upload Module | آپلود + S3/MinIO + Validation | ۱ روز | فاز ۱ |
| **۸** | Worker Service | پردازش async + استخراج متن | ۲ روز | فاز ۷ |
| **۹** | AI Summarization | یکپارچه‌سازی LLM + Extractive | ۳ روز | فاز ۸ |
| **۱۰** | Admin Panel | Dashboard + مدیریت محتوا | ۱ روز | فاز ۴,۵,۶ |
| **۱۱** | Testing | Unit + Integration + E2E | ۲ روز | فاز ۳-۱۰ |
| **۱۲** | Docker + CI/CD | کانتینرسازی + استقرار | ۱ روز | فاز ۱۱ |
| **۱۳** | Frontend Integration | اتصال فرانت‌اند به API واقعی | ۱ روز | فاز ۳-۱۰ |

**مجموع زمان تخمینی: ~۱۸ روز (با یک توسعه‌دهنده full-stack)**

---

## پیوست: Environment Variables

```env
# .env.example

# Server
NODE_ENV=production
PORT=3000
API_PREFIX=/api/v1

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/habib_summary

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# S3 / MinIO
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_BUCKET=habib-summary-files
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin

# AI / LLM
AI_PROVIDER=openai  # openai | anthropic | huggingface
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
HUGGINGFACE_API_KEY=hf_...

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100

# File Upload
MAX_FILE_SIZE=52428800  # 50MB
ALLOWED_MIME_TYPES=application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png

# CORS
CORS_ORIGIN=https://habibrahmanyonocy786-cmyk.github.io

# Logging
LOG_LEVEL=info
```

---

## پیوست: Prisma Schema (خلاصه)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(uuid())
  username      String   @unique
  email         String   @unique
  passwordHash  String   @map("password_hash")
  fullName      String?  @map("full_name")
  avatarUrl     String?  @map("avatar_url")
  role          String   @default("user")
  isActive      Boolean  @default(true) @map("is_active")
  isVerified    Boolean  @default(false) @map("is_verified")
  lastLogin     DateTime? @map("last_login")
  refreshToken  String?  @map("refresh_token")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  books           Book[]
  uploadedFiles   UploadedFile[]
  summaries       Summary[]
  quizAttempts    QuizAttempt[]
  bookmarks       UserBookmark[]
  activityLogs    UserActivityLog[]
  feedbacks       SummaryFeedback[]

  @@map("users")
}

model Book {
  id              String   @id @default(uuid())
  userId          String?  @map("user_id")
  title           String
  author          String?
  emoji           String   @default("📚")
  color           String   @default("from-blue-500 to-indigo-600")
  summary         String?
  bookType        String   @default("preloaded") @map("book_type")
  fileType        String?  @map("file_type")
  fileUrl         String?  @map("file_url")
  fileSizeBytes   BigInt?  @map("file_size_bytes")
  originalFilename String? @map("original_filename")
  pageCount       Int?     @map("page_count")
  language        String   @default("persian")
  wordCount       Int?     @map("word_count")
  isPublished     Boolean  @default(true) @map("is_published")
  uploadStatus    String   @default("completed") @map("upload_status")
  viewCount       Int      @default(0) @map("view_count")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  user            User?      @relation(fields: [userId], references: [id])
  questions       Question[]
  tags            BookTag[]
  extractedText   ExtractedText?
  summaries       Summary[]
  uploadedFiles   UploadedFile[]
  processingQueue ProcessingQueue?
  quizAttempts    QuizAttempt[]
  bookmarks       UserBookmark[]

  @@map("books")
}

// سایر مدل‌ها ادامه دارند...
```

---

**نتیجه:** این طرح یک نقشه راه کامل برای تبدیل Habib-summary از یک SPA ساده به یک پلتفرم full-stack با backend واقعی، دیتابیس رابطه‌ای، احراز هویت امن، پردازش async، و API استاندارد ارائه می‌دهد.

**تخمین زمان: ۱۸ روز کاری** با یک توسعه‌دهنده full-stack (با کاهش تا ۱۲ روز در صورت استفاده از Supabase + Vercel)
