# ⚡ START HERE - QUICK SETUP

## You Have New Supabase Keys? Follow These 3 Steps:

---

## 📝 STEP 1: Update .env.local (30 seconds)

Open `.env.local` file and change these two lines:

```bash
VITE_SUPABASE_URL=YOUR_NEW_URL_HERE
VITE_SUPABASE_ANON_KEY=YOUR_NEW_KEY_HERE
```

Save the file.

---

## 🗄️ STEP 2: Run ONE SQL File (2 minutes)

1. Go to your Supabase dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Open the file: **`DEPLOY_THIS_ONE.sql`**
5. Copy ALL the text from that file
6. Paste into Supabase SQL Editor
7. Click **RUN**
8. Wait for success ✅

**That's it! Database is ready.**

---

## ✅ STEP 3: Test It (2 minutes)

1. Run: `npm run dev`
2. Open app in browser
3. Connect wallet
4. Upload test evidence:
   - Add any image
   - Title: "TEST"
   - Location: "MAIN ST"
   - Click "UPLOAD EVIDENCE"
5. Wait for success screen

**If you see success = Everything works! 🎉**

---

## 📁 Files You Need:

- ✅ `DEPLOY_THIS_ONE.sql` ← Run this in Supabase
- ✅ `.env.local` ← Update with new keys
- ✅ `INSTRUCTIONS.md` ← Detailed guide if needed

## 🚫 Files You DON'T Need:

- ❌ `QUICK_FIX_SCHEMA.sql` (old, ignore)
- ❌ `supabase/ctsync-schema.sql` (old, ignore)

---

## That's All!

Just update `.env.local` and run `DEPLOY_THIS_ONE.sql` in Supabase.

Everything else is already done in the code.
