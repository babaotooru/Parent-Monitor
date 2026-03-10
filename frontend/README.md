# ParentCare Frontend

This is a simple React single-page application demonstrating how clients interact with the Supabase backend.

## Setup

1. Install Node.js (>=14)
2. Copy `.env.example` to `.env` and fill in your Supabase project credentials (or use the ones below):
   ```text
   REACT_APP_SUPABASE_URL=https://drodwchxhknxatebdxeg.supabase.co
   REACT_APP_SUPABASE_KEY=sb_publishable_xw9ILEmr_tY_8eZNhW82sg_GSk4EEbT
   ```
3. Install dependencies and start:
   ```bash
   cd frontend
   npm install
   npm start
   ```
4. App will run on http://localhost:3000

## Features

- Fetches user list from Supabase
- Can be extended with login/signup, dashboards, etc.

This is a baseline; mobile apps (React Native or Flutter) would use the same supabase client configuration.
