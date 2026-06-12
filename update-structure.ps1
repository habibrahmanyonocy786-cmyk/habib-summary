# Habib-summary - Structure Generator
# Run this script after any changes to update STRUCTURE.md

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$files = Get-ChildItem -Path $root -Recurse -Depth 3 -Force | Where-Object { !$_.PSIsContainer -and $_.FullName -notmatch '\\.git\\' }

$content = @"
# Habib-summary - ساختار پروژه

> آخرین به‌روزرسانی: $(Get-Date -Format 'dd MMMM yyyy - HH:mm')

"@

$tree = @"
```
habib-summary/
│
├── index.html                 # برنامه اصلی (single-page application)
│                              # شامل: Tailwind CSS + PDF.js + Mammoth.js + Tesseract.js
│                              ──── بخش‌ها:
│                              ├── خلاصه ۳ کتاب
│                              ├── سوالات چهارگزینه‌ای
│                              ├── آزمون ترکیبی
│                              └── آپلود و خلاصه‌سازی
│
├── PLAN.md                    # پلان دیتابیس و معماری backend
├── STRUCTURE.md               # این فایل - ساختار پروژه
├── README.md                  # توضیحات پروژه
├── _config.yml                # تنظیمات GitHub Pages
└── .git/                      # ریپازیتوری گیت
```

## توضیح فایل‌ها

| فایل | حجم | نقش |
|------|-----|-----|
"@

$files | ForEach-Object {
    $sizeKB = [math]::Round($_.Length / 1024, 1)
    $relPath = $_.FullName.Substring($root.Length + 1)
    $tree += "| \`"$relPath\`" | ${sizeKB}KB | — |`n"
}

$tree += @"
| `.git/` | — | metadata گیت |

## وابستگی‌های CDN

"@

$content += $tree

$content += @"
- Tailwind CSS v3
- PDF.js v3.11.174
- Mammoth.js v1.6.0
- Tesseract.js v5
- Vazirmatn (Google Font)

## Status
- URL: https://habibrahmanyonocy786-cmyk.github.io/habib-summary/
- Status: ✅ Active

**Habib Rahman Yonocy | 0784258414**
"@

$content | Out-File -FilePath (Join-Path $root "STRUCTURE.md") -Encoding UTF8
Write-Output "✅ STRUCTURE.md updated"
