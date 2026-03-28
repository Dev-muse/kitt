<div align="center">
  <img src="./public/logo.png" alt="KittDen Logo" width="200" />

  <h3>AI-Powered Voice Companion for Your Book Library</h3>

  <p>
    Upload your books, choose a voice persona, and have a real-time spoken conversation about any book in your library — powered by Vapi AI.
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=flat-square&logo=tailwind-css" />
    <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb" />
    <img src="https://img.shields.io/badge/Vapi_AI-Voice-8B5CF6?style=flat-square" />
  </p>
</div>

---

## ✨ Features

- 🎙️ **AI Voice Conversations** — Talk to an AI assistant about any book using real-time voice sessions powered by [Vapi AI](https://vapi.ai) and ElevenLabs voices.
- 📚 **Personal Book Library** — Upload and manage your own collection of PDF books.
- 🧠 **Voice Personas** — Assign unique AI voice personas to each book for a tailored conversational experience.
- 💬 **Live Transcripts** — See your conversation transcribed in real time, including streaming partial messages.
- 🔐 **Authentication** — Secure sign-in and sign-up via [Clerk](https://clerk.com).
- 💳 **Subscription Management** — Usage-based session limits tied to billing periods.
- 🖼️ **Cover Uploads** — Upload custom book covers stored via [Vercel Blob](https://vercel.com/docs/storage/vercel-blob).
- 🌗 **Theme Support** — Light and dark mode via `next-themes`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | TypeScript 5 |
| UI | React 19, Tailwind CSS v4, shadcn/ui, Radix UI, Lucide Icons |
| Auth | [Clerk](https://clerk.com) |
| Database | MongoDB + [Mongoose](https://mongoosejs.com) |
| AI Voice | [Vapi AI](https://vapi.ai) + ElevenLabs |
| File Storage | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| PDF Processing | [pdfjs-dist](https://www.npmjs.com/package/pdfjs-dist) |
| Forms | React Hook Form + Zod |
| Notifications | [Sonner](https://sonner.emilkowal.ski) |
| Animations | tw-animate-css |

---

## 📂 Project Structure
```
kitt/
├── app/
│ ├── (root)/
│ │ ├── page.tsx # Book library homepage
│ │ ├── books/
│ │ │ ├── new/page.tsx # Upload a new book
│ │ │ └── [slug]/page.tsx # Book detail + voice controls
│ ├── api/
│ │ └── upload/ # File upload API routes
│ └── layout.tsx
├── components/
│ ├── BookCard.tsx # Library book card
│ ├── HeroSection.tsx # Landing hero
│ ├── VapiControls.tsx # Voice session controls
│ ├── Transcript.tsx # Real-time conversation transcript
│ ├── UploadForm.tsx # Book upload form
│ └── ui/ # Shared UI components (Navbar, Button, etc.)
├── database/
│ └── models/
│ ├── books.model.ts
│ ├── book-segments.model.ts
│ └── voice-sessions.model.ts
├── hooks/
│ └── useVapi.ts # Vapi session lifecycle hook
├── lib/
│ ├── actions/
│ │ ├── book.actions.ts # Book server actions
│ │ └── session.actions.ts # Voice session server actions
│ ├── constants.ts # Voice options, plans, etc.
│ └── subscription-contants.ts # Billing helpers
└── types.d.ts # Global TypeScript types
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 18
- A [MongoDB](https://www.mongodb.com) database (Atlas recommended)
- A [Clerk](https://clerk.com) application
- A [Vapi AI](https://vapi.ai) account
- A [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) store


### 1. Clone the repository

```bash
git clone https://github.com/Dev-muse/kitt.git
cd kitt
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Vapi AI
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_public_key

# Vercel Blob
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage

1. **Sign up / Sign in** using the navbar auth buttons.
2. **Upload a book** via the "Add New" page — provide a title, author, optional voice persona, PDF file, and cover image.
3. **Browse your library** on the homepage and click a book to open it.
4. **Start a voice session** by clicking the microphone button on the book page.
5. **Speak with the AI** about the book — your conversation is transcribed in real time.
6. **End the session** by clicking the mic button again.

---

## 🗃️ Database Models

| Model | Description |
|---|---|
| `IBook` | Stores book metadata, file/cover URLs, voice persona, and slug |
| `IBookSegment` | Stores extracted PDF content segments for AI context |
| `IVoiceSession` | Tracks voice session start/end times and duration for billing |

---

## 📜 License

This project is private and not currently licensed for public use.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/Dev-muse">Dev-muse</a></p>
</div>
```

---

> **Note:** The logo is referenced from `./public/logo.png`. If you'd also like to use the full SVG logo (`./assets/logo-full.svg`) for a crisper render at larger sizes in the README header, simply swap the `src` in the `<img>` tag to `./assets/logo-full.svg`.
