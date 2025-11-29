# Setup Instructions

## Prerequisites

- Node.js 18+ installed
- A Supabase account
- An OpenAI API key (users will provide their own)

## Step 1: Clone and Install

```bash
npm install
```

## Step 2: Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run the contents of `supabase-schema.sql`
3. Go to Storage and create a new bucket:
   - Name: `cover-letters`
   - Public: Yes
   - File size limit: 10MB
4. Go to Authentication > Providers and enable Google OAuth:
   - Add your Google OAuth credentials
   - Set redirect URL to: `http://localhost:3000/api/auth/callback` (for local dev)
   - For production, add: `https://yourdomain.com/api/auth/callback`

## Step 3: Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Important:** 
- Never commit `.env.local` to git
- For Vercel deployment, add these as environment variables in the Vercel dashboard
- The `SUPABASE_SERVICE_ROLE_KEY` should only be used server-side

## Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 5: First Time Setup (After Login)

1. Sign in with Google
2. Go to Profile & API Key
3. Add your OpenAI API key (get it from https://platform.openai.com/api-keys)
4. Upload your resume (PDF or DOCX)
5. Add at least:
   - 1 intro paragraph
   - 1+ experience paragraphs
   - 1 conclusion paragraph
6. Add a job posting
7. Generate your first cover letter!

## Deployment to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel dashboard
4. Update Google OAuth redirect URL to your Vercel domain
5. Deploy!

## Troubleshooting

### "OpenAI API key not configured"
- Make sure you've added your API key in the Profile page
- Check that the key is valid and has credits

### "Failed to upload PDF"
- Ensure the `cover-letters` bucket exists in Supabase Storage
- Check that the bucket is set to public

### "Unauthorized" errors
- Verify your Supabase environment variables are correct
- Check that RLS policies are set up correctly (they should be from the schema)

### Resume upload fails
- Make sure the file is PDF or DOCX format
- Check file size (should be under 10MB)
- Verify the file isn't corrupted


