<div align="center">

# 🏥 InsightMed | بصيرة الصحة

### AI-Powered Medical Document Analysis Platform | منصة تحليل الوثائق الطبية بالذكاء الاصطناعي

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-insightmed.lovable.app-00C48C?style=for-the-badge)](https://insightmed.lovable.app)
[![Built with Lovable](https://img.shields.io/badge/Built_with-Lovable-FF6B6B?style=for-the-badge&logo=heart)](https://lovable.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<br/>

> **InsightMed turns complex medical records into simple, understandable health guidance using AI.**
>
> **بصيرة الصحة تحوّل السجلات الطبية المعقدة إلى إرشادات صحية بسيطة ومفهومة باستخدام الذكاء الاصطناعي.**

<br/>

[🇬🇧 English](#-overview) · [🇮🇶 العربية](#-نظرة-عامة)

</div>

---

## 📋 Overview

**InsightMed** is a bilingual (English/Arabic) AI-powered health intelligence platform that helps patients and healthcare consumers understand their medical documents. Upload lab results, prescriptions, discharge summaries, or any medical record — and receive clear, actionable health guidance in your preferred language.

### 🎯 Problem Statement

Millions of patients receive medical documents they don't fully understand. Complex terminology, lab reference ranges, and clinical abbreviations create a barrier between patients and their own health data.

### 💡 Solution

InsightMed bridges this gap by leveraging AI to analyze, classify, and simplify medical documents — delivering personalized health insights that are easy to understand, bilingual, and actionable.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📄 **Document Upload & Analysis** | Upload medical records (PDFs, images) for instant AI-powered analysis |
| 🌐 **Bilingual Support** | Full English & Arabic (RTL) interface and AI responses |
| 🏷️ **Auto Document Classification** | Automatic detection of document type (lab report, prescription, discharge summary, etc.) |
| 🧠 **AI Health Insights** | Plain-language explanations of medical findings with contextual guidance |
| 🔒 **Privacy-First** | Secure document handling with Supabase backend |
| 📱 **Responsive Design** | Optimized for mobile, tablet, and desktop |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **UI Components** | shadcn/ui + Tailwind CSS |
| **Backend / Auth / DB** | Supabase (PostgreSQL + Auth + Storage) |
| **Package Manager** | Bun |
| **Deployment** | Lovable |
| **AI Engine** | LLM-powered document analysis pipeline |

---

## 📂 Project Structure

```
insightmed/
├── public/              # Static assets
├── src/                 # Application source code
│   ├── components/      # Reusable UI components
│   ├── pages/           # Route-level page components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions & API clients
│   ├── types/           # TypeScript type definitions
│   └── integrations/    # Supabase & external service configs
├── supabase/            # Supabase migrations & config
│   └── functions/       # Edge Functions
├── components.json      # shadcn/ui configuration
├── eslint.config.js     # Linting configuration
├── bun.lockb            # Bun lock file
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+) or [Bun](https://bun.sh/)
- [Git](https://git-scm.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/3h0ll7/insightmed.git

# 2. Navigate to the project directory
cd insightmed

# 3. Install dependencies
bun install
# or
npm install

# 4. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 5. Start the development server
bun dev
# or
npm run dev
```

The app will be running at `http://localhost:5173`

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous (public) key |

---

## 🌍 Deployment

### Option 1: Lovable (Recommended)

Visit the [Lovable Project](https://lovable.dev/projects/ae896508-f33a-4b44-a00e-c7519e830e21) and changes will be deployed automatically.

### Option 2: Manual Deployment

```bash
bun run build
# Deploy the `dist/` folder to your hosting provider
```

Compatible with: **Vercel**, **Netlify**, **Cloudflare Pages**, or any static hosting service.

---

## 🗺️ Roadmap

- [x] Document upload & AI analysis
- [x] Bilingual (EN/AR) interface
- [x] Auto document classification
- [ ] Multi-document comparison & trend tracking
- [ ] Medication interaction checker
- [ ] Family health profile management
- [ ] Integration with Iraqi healthcare providers
- [ ] Mobile app (PWA)
- [ ] Voice-based document input

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary. All rights reserved.

---

<div align="center">

## 🇮🇶 نظرة عامة

**بصيرة الصحة** هي منصة ذكاء صحي ثنائية اللغة (العربية/الإنجليزية) مدعومة بالذكاء الاصطناعي، تساعد المرضى على فهم وثائقهم الطبية. ارفع نتائج المختبر، الوصفات الطبية، ملخصات الخروج من المستشفى، أو أي سجل طبي — واحصل على إرشادات صحية واضحة وقابلة للتنفيذ بلغتك المفضلة.

### المميزات الرئيسية

📄 رفع وتحليل الوثائق الطبية بالذكاء الاصطناعي

🌐 واجهة ثنائية اللغة (عربي/إنجليزي) مع دعم كامل للكتابة من اليمين لليسار

🏷️ تصنيف تلقائي لنوع الوثيقة الطبية

🧠 شروحات مبسطة للنتائج الطبية مع إرشادات عملية

🔒 تعامل آمن مع الوثائق مع خصوصية تامة

</div>

---

<div align="center">

**Built with ❤️ by [Hassan Salman](https://github.com/3h0ll7)**

*Empowering patients with AI-driven health literacy*

*تمكين المرضى من خلال الثقافة الصحية المدعومة بالذكاء الاصطناعي*

[![Live Demo](https://img.shields.io/badge/🌐_Try_InsightMed-insightmed.lovable.app-00C48C?style=for-the-badge)](https://insightmed.lovable.app)

</div>
