# update-project-files.ps1
# ============================================================
# Auto-update script for SUMMARY.md and STRUCTURE.md
# Run: .\update-project-files.ps1
# ============================================================

$r = if ($PSScriptRoot) { $PSScriptRoot } else { Split-Path -Parent $MyInvocation.MyCommand.Path }
$now = Get-Date -Format "yyyy-MM-dd HH:mm"
$persianDate = (Get-Date -Format "dd MMMM yyyy")

# -----------------------------------------------------------
# 1. Generate STRUCTURE.md — file and folder structure
# -----------------------------------------------------------
function Generate-StructureMd {
    param([string]$RootPath, [string]$Now)

    $lines = @()
    $lines += "# Habib-summary - Project Structure"
    $lines += ""
    $lines += "> Last updated: $persianDate ($now)"
    $lines += ""

    $allFiles = Get-ChildItem -LiteralPath $RootPath -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' }

    $lines += '```'
    $lines += "habib-summary/"

    foreach ($f in $allFiles) {
        $rel = $f.FullName.Substring($RootPath.Length).TrimStart('\')
        $depth = ($rel.ToCharArray() | Where-Object {$_ -eq '\'} | Measure-Object).Count
        $fileName = $rel.Split('\')[-1]
        $indent = "    " * $depth
        $size = [math]::Round($f.Length / 1KB, 1)
        $lines += "$indent+-- $fileName ($size KB)"
    }

    $lines += '```'

    $lines += ""
    $lines += "## File Details"
    $lines += ""
    $lines += "| File | Size (KB) | Description |"
    $lines += "|------|-----------|-------------|"

    $descriptions = @{
        "index.html" = "Main SPA app"
        "SUMMARY.md" = "Project summary"
        "STRUCTURE.md" = "File structure doc"
        "PLAN.md" = "Database & backend plan"
        "README.md" = "Project README"
        "_config.yml" = "GitHub Pages config"
        "update-structure.ps1" = "Legacy structure script"
        "update-project-files.ps1" = "Combined structure + summary updater"
    }

    foreach ($f in $allFiles) {
        $rel = $f.FullName.Substring($RootPath.Length).TrimStart('\')
        $size = [math]::Round($f.Length / 1KB, 1)
        $desc = if ($descriptions.ContainsKey($f.Name)) { $descriptions[$f.Name] } else { "-" }
        $lines += "| $rel | $size | $desc |"
    }

    $lines += ""
    $lines += "---"
    $lines += ""
    $lines += "**Developer:** Habib Rahman Yonocy"
    $lines += "**Contact:** 0784258414"

    return $lines -join "`n"
}

# -----------------------------------------------------------
# 2. Generate SUMMARY.md — project overview
# -----------------------------------------------------------
function Generate-SummaryMd {
    param([string]$Now)

    $lines = @()
    $lines += "# Habib-summary - Project Summary"
    $lines += ""
    $lines += "> Last updated: $persianDate ($now)"
    $lines += ""
    $lines += "## Overview"
    $lines += ""
    $lines += "A lightweight, responsive, accessible portal for viewing, searching,"
    $lines += "and summarizing documents (PDF / DOCX / Image) with full RTL and OCR support."
    $lines += "Currently deployed as a **Single-Page Application** on **GitHub Pages**."
    $lines += ""
    $lines += "## Features"
    $lines += ""
    $lines += "| Feature | Description |"
    $lines += "|---------|-------------|"
    $lines += "| **Book Summaries** | Browse summaries of 3 top books |"
    $lines += "| **Multiple Choice Q&A** | 3 questions per book + results |"
    $lines += "| **Mixed Quiz** | 5 random questions from all books |"
    $lines += "| **Upload & Summarize** | Extract text and summarize from PDF, DOCX, JPEG/PNG |"
    $lines += "| **Responsive UI** | Mobile, tablet, desktop friendly |"
    $lines += "| **RTL Support** | Full Persian language design |"
    $lines += ""
    $lines += "## Architecture"
    $lines += ""
    $lines += "| Layer | Technology | Description |"
    $lines += "|-------|-----------|-------------|"
    $lines += "| **Presentation** | HTML + Tailwind CSS | Component-based UI |"
    $lines += "| **Client Logic** | Vanilla JavaScript | State management, events |"
    $lines += "| **Document Processing** | PDF.js / Mammoth.js / Tesseract.js | Text extraction |"
    $lines += "| **Summarization** | Extractive Algorithm | Client-side summarization |"
    $lines += "| **Hosting** | GitHub Pages | Static site deployment |"
    $lines += ""
    $lines += "## Tech Stack"
    $lines += ""
    $lines += "| Library | Version | Usage |"
    $lines += "|---------|---------|-------|"
    $lines += "| Tailwind CSS | v3 | CSS framework |"
    $lines += "| PDF.js | v3.11.174 | PDF text extraction |"
    $lines += "| Mammoth.js | v1.6.0 | DOCX text extraction |"
    $lines += "| Tesseract.js | v5 | Image OCR |"
    $lines += "| Vazirmatn | - | Persian font |"
    $lines += "| Tabler Icons | - | SVG icons |"
    $lines += ""
    $lines += "## Deploy Status"
    $lines += ""
    $lines += "- **Platform:** GitHub Pages"
    $lines += "- **Repository:** habibrahmanyonocy786-cmyk/habib-summary"
    $lines += "- **Branch:** main (root)"
    $lines += "- **URL:** https://habibrahmanyonocy786-cmyk.github.io/habib-summary/"
    $lines += "- **Status:** Active"
    $lines += ""
    $lines += "## Future Roadmap"
    $lines += ""
    $lines += "1. Backend (Node.js + Express or Python FastAPI)"
    $lines += "2. Database (PostgreSQL)"
    $lines += "3. User authentication"
    $lines += "4. AI summarization (Hugging Face / OpenAI)"
    $lines += "5. Full-text search (Lunr.js / Fuse.js)"
    $lines += "6. Server-side OCR"
    $lines += "7. Offline mode with Service Worker"
    $lines += ""
    $lines += "---"
    $lines += ""
    $lines += "**Developer:** Habib Rahman Yonocy"
    $lines += "**Contact:** 0784258414"

    return $lines -join "`n"
}

# -----------------------------------------------------------
# Execute
# -----------------------------------------------------------
$structureMd = Generate-StructureMd -RootPath $r -Now $now
$summaryMd = Generate-SummaryMd -Now $now

$structureMd | Out-File (Join-Path $r "STRUCTURE.md") -Encoding UTF8
$summaryMd | Out-File (Join-Path $r "SUMMARY.md") -Encoding UTF8

Write-Output "STRUCTURE.md updated"
Write-Output "SUMMARY.md updated"
Write-Output "Timestamp: $now"