# Bookmarks App

A minimal **Next.js + Supabase + TailwindCSS** app to manage **private bookmarks** with **Google OAuth login**, deployed on **Vercel**.

https://bookmarkssupabase.vercel.app/

# Features
- Google OAuth login  
- Private bookmarks per user  
- Realtime updates using Supabase subscriptions  
- Add & delete bookmarks  
- Dark-themed responsive UI  

# Challenges & Learnings
- Configuring **Google OAuth** for local and Vercel deployment  
- Managing **private user data** securely  
- Implementing **realtime updates** with Supabase  
- Handling **environment variables** safely (`.env`)

# Getting Started

1. Clone the repo:
  git clone https://github.com/R-Syed-Suffiyan/Bookmarks---Supabase.git
  cd bookmark-app

2. Install Dependencies:
  npm install

3. Add .env.local file with following:
  NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>

4. Run on local:
  npm run dev

check: http://localhost:3000
