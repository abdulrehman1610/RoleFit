<div align="center">

# 🎯 RoleFit
### **Smart Matches. Better Opportunities.**
**Evidence-Grounded AI Resume Tailoring, Semantic Gap Analysis & ATS Diagnostics**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Groq](https://img.shields.io/badge/Groq-LPU_Inference-F55036?logo=speedtest&logoColor=white)](https://groq.com/)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

<p align="center">
  <a href="#-key-features">Key Features</a> •
  <a href="#-architecture--tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-privacy--zero-storage-guarantee">Privacy</a> •
  <a href="#-contributing">Contributing</a>
</p>

</div>

---

## 📖 Overview

Most applicant tracking systems (ATS) silently drop qualified candidates due to keyword misalignment, non-standard formatting, or unquantified achievements. Standard LLMs often invent fake metrics that crumble under recruiter scrutiny.

**RoleFit** solves this with **deterministic, evidence-grounded AI analysis**. It evaluates candidate resumes against target job descriptions, identifies critical skill gaps, audits ATS and EEOC compliance, and generates **STAR-methodology bullet points strictly anchored in real candidate experience**.

---

## ✨ Key Features

### 1. 🔍 Semantic Gap & Readiness Analysis
* **Readiness Tier Grading:** Classifies candidate fit (*Top Tier, Strong Match, Moderate Gap, or High Risk*) with clear qualitative rationale.
* **Skill Matrix Extraction:** Identifies exact keyword matches and highlights missing technical and domain capabilities.
* **Seniority Calibration:** Compares candidate scope against required role seniority (*Junior, Mid-Level, Senior, Lead, Overqualified*).

### 2. ⚡ Evidence-Grounded STAR Bullet Optimizer
* **STAR Framework Refactoring:** Restructures weak, task-oriented bullets into quantified **Situation, Task, Action, Result** achievements.
* **Grounding Confidence Score:** Every suggested bullet point is assigned an anti-hallucination score (e.g. `HIGH GROUNDING (95%)`) to verify that metrics and achievements reflect real candidate experience.
* **Granular Checkbox Selection:** Select or deselect specific AI suggestions to control exactly what gets merged into the final resume.

### 3. 🛡️ ATS Formatting & EEOC Compliance Diagnostics
* **ATS Compatibility Checks:** Tests against parsing rules for enterprise platforms including **Workday, Greenhouse, Lever, Taleo, and iCIMS**.
* **Anti-Bias Scanner:** Detects EEOC protected-class cues (e.g., graduation year age giveaways, marital disclosures) to safeguard candidate screening.
* **Search Indexing Multipliers:** Recommends safe keyword frequency targets (`TARGET +1-2X`) to maximize recruiter search discovery without keyword stuffing.

### 4. 📄 Multi-Format Document Parsing
* Built-in client/server extraction for **PDF, DOCX, TXT, Markdown, and RTF** documents.
* Automatic text sanitization, token length safeguards, and dual upload/paste workflows.

### 5. 📥 Interactive Export Hub
* **One-Click Tailored CV:** Instantly exports your customized resume with selected STAR improvements in `.txt` or `.md` format.
* **Audit Telemetry Report:** Download complete structured match data, ATS warnings, and latency logs as JSON.

### 6. 🎨 Warm Editorial Design System
* Curated light & dark palette inspired by modern print typography (`Instrument Serif` & `Inter`).
* Responsive, fluid layout featuring dynamic gauges, status indicators, and collapsible dialogs.

---

## 🛠️ Architecture & Tech Stack

```
RoleFit/
├── src/
│   ├── components/            # UI components (Hero, Inputs, Dashboard, Tabs, Modals)
│   │   ├── AnalysisDashboard.tsx
│   │   ├── AtsDiagnosticsTab.tsx
│   │   ├── BulletOptimizerTab.tsx
│   │   ├── GapAnalysisTab.tsx
│   │   ├── ExportHubTab.tsx
│   │   ├── HeroBanner.tsx
│   │   ├── InputSection.tsx
│   │   ├── Navbar.tsx
│   │   └── QuickOverviewGrid.tsx
│   ├── services/              # AI inference, fallback pipelines, document parsers
│   │   ├── aiService.ts
│   │   └── documentParser.ts
│   ├── data/                  # Pre-configured sample profiles & mock fixtures
│   ├── types.ts               # Core TypeScript definitions & schemas
│   └── index.css              # Design tokens, typography & Tailwind styling
├── server.ts                  # Production Express API gateway with healthchecks
└── vite.config.ts             # Vite build & bundler configuration
```

* **Frontend:** React 18, TypeScript, Tailwind CSS v4, Lucide React
* **AI Providers:** Google Gemini API (`gemini-2.5-flash`, `gemini-2.0-flash`), Groq SDK (`openai/gpt-oss-120b`, `llama-3.3-70b`)
* **Document Processing:** PDF.js (`pdfjs-dist`), Mammoth.js (`mammoth`)
* **Tooling:** Vite, Node.js, TSX, Express

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (version 18.0 or higher)
* [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### 1. Clone the Repository
```bash
git clone https://github.com/abdulrehman1610/RoleFit.git
cd RoleFit
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```bash
cp .env.example .env
```

Add your API keys (optional — RoleFit includes instant mock mode and shared fallback):
```env
GEMINI_API_KEY=your_gemini_api_key_here
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to launch RoleFit.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 🔒 Privacy & Zero-Storage Guarantee

* **Zero Persistent Storage:** Resumes and job descriptions are processed transiently in-memory and are never stored in databases or serialized to disk.
* **BYOK Security:** User-provided API keys are kept in browser `localStorage` and sent only to official model provider endpoints over HTTPS.
* **Anti-Scraping:** Raw candidate personal details are filtered before telemetry generation.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the Apache-2.0 License. See the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Built with ❤️ for job seekers and career switchers worldwide.</sub>
</div>
