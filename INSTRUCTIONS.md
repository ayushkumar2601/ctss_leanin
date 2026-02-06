# 🚀 DEPLOY INSTRUCTIONS - DO THIS NOW

## ONE FILE TO RUN: `DEPLOY_THIS_ONE.sql`

### Step 1: Update Your .env.local
Open `.env.local` and update these lines with your NEW Supabase credentials:
```
VITE_SUPABASE_URL=your_new_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_new_supabase_anon_key_here
```

### Step 2: Deploy Database
1. Go to your NEW Supabase dashboard
2. Click **"SQL Editor"** in left sidebar
3. Click **"New Query"**
4. Open file: `DEPLOY_THIS_ONE.sql`
5. Copy EVERYTHING from that file
6. Paste into Supabase SQL Editor
7. Click **"RUN"** button (or press Ctrl+Enter)
8. Wait for ✅ Success message

### Step 3: Verify It Worked
In the same SQL Editor, run this:
```sql
SELECT * FROM issues LIMIT 1;
```

If you see column names (even with no data) = ✅ SUCCESS!

### Step 4: Test Your App
1. Start dev server: `npm run dev`
2. Open app in browser
3. Connect wallet
4. Go to "Upload Evidence"
5. Upload a test image with:
   - Title: "TEST_ISSUE"
   - Location: "MAIN ST"
   - Description: "Testing"
6. Click "UPLOAD EVIDENCE"
7. Wait for success

If it works = 🎉 EVERYTHING IS WORKING!

## That's It!

Just run `DEPLOY_THIS_ONE.sql` in your NEW Supabase and you're done.

## 🐛 If Something Goes Wrong

**Error: "permission denied"**
- Make sure you're logged into the correct Supabase project

**Error: "relation already exists"**
- The file drops everything first, so this shouldn't happen
- If it does, the tables already exist and you're good!

**App still shows 404 errors**
- Check `.env.local` has correct NEW Supabase URL and key
- Restart your dev server
- Clear browser cache and refresh

**Upload fails at "Saving to database"**
- Check browser console for exact error
- Verify the SQL ran successfully
- Make sure wallet is connected
