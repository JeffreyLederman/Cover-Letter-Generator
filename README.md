# Cover Letter Generator

A beautiful, AI-powered cover letter generator built with Next.js 15, Supabase, and OpenAI.

## Features

- 🔐 Google OAuth authentication
- 📝 AI-powered cover letter generation
- 📄 Multiple beautiful PDF templates
- 💼 Job management
- 📋 Resume parsing (PDF/DOCX)
- 🎨 Modern UI with shadcn/ui

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL schema from `supabase-schema.sql`
   - Enable Google OAuth in Authentication settings
   - Create a storage bucket named `cover-letters` (public)

4. Create `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase credentials.

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy to Vercel with one click. Make sure to add all environment variables in Vercel dashboard.


