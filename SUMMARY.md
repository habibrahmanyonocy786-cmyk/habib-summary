# Habib-summary - Project Summary

> Last updated: 12 JUNE 2026 (2026-06-12 08:30)

## Overview

A lightweight, responsive, accessible portal for viewing, searching,
and summarizing documents (PDF / DOCX / Image) with full RTL and OCR support.
Currently deployed as a **Single-Page Application** on **GitHub Pages**.

## Features

| Feature | Description |
|---------|-------------|
| **Book Summaries** | Browse summaries of 3 top books |
| **Multiple Choice Q&A** | 3 questions per book + results |
| **Mixed Quiz** | 5 random questions from all books |
| **Upload & Summarize** | Extract text and summarize from PDF, DOCX, JPEG/PNG |
| **Responsive UI** | Mobile, tablet, desktop friendly |
| **RTL Support** | Full Persian language design |

## Architecture

| Layer | Technology | Description |
|-------|-----------|-------------|
| **Presentation** | HTML + Tailwind CSS | Component-based UI |
| **Client Logic** | Vanilla JavaScript | State management, events |
| **Document Processing** | PDF.js / Mammoth.js / Tesseract.js | Text extraction |
| **Summarization** | Extractive Algorithm | Client-side summarization |
| **Hosting** | GitHub Pages | Static site deployment |

## Tech Stack

| Library | Version | Usage |
|---------|---------|-------|
| Tailwind CSS | v3 | CSS framework |
| PDF.js | v3.11.174 | PDF text extraction |
| Mammoth.js | v1.6.0 | DOCX text extraction |
| Tesseract.js | v5 | Image OCR |
| Vazirmatn | - | Persian font |
| Tabler Icons | - | SVG icons |

## Deploy Status

- **Platform:** GitHub Pages
- **Repository:** habibrahmanyonocy786-cmyk/habib-summary
- **Branch:** main (root)
- **URL:** https://habibrahmanyonocy786-cmyk.github.io/habib-summary/
- **Status:** Active

## Future Roadmap

1. Backend (Node.js + Express or Python FastAPI)
2. Database (PostgreSQL)
3. User authentication
4. AI summarization (Hugging Face / OpenAI)
5. Full-text search (Lunr.js / Fuse.js)
6. Server-side OCR
7. Offline mode with Service Worker

---

**Developer:** Habib Rahman Yonocy
**Contact:** 0784258414
