# 🗄️ Supabase Database Setup Guide

## Complete setup guide for NFT marketplace database integration

---

## 📋 Prerequisites

- Supabase account (free tier works)
- Node.js installed
- NFT marketplace with wallet integration

---

## 🚀 Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Click "New Project"
5. Fill in:
   - **Name**: `neon-chaos-nft` (or your choice)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine
6. Click "Create new project"
7. Wait 2-3 minutes for project to initialize

---

## 🔑 Step 2: Get API Keys

1. In your Supabase project dashboard
2. Click "Settings" (gear icon) in sidebar
3. Click "API" under Project Settings
4. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)

---

## ⚙️ Step 3: Configure Environment Variables

1. Open `.env.local` in your project
2. Add Supabase credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Save the file
4. Restart your dev server: `npm run dev`

---

## 🗃️ Step 4: Create Database Schema

### Option A: Using Supabase SQL Editor (Recommended)

1. In Supabase dashboard, click "SQL Editor" in sidebar
2. Click "New query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the SQL editor
5. Click "Run" (or press Ctrl/Cmd + Enter)
6. Wait for success message: "Success. No rows returned"

### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

---

## ✅ Step 5: Verify Database Setup

### Check Tables Created

1. In Supabase dashboard, click "Table Editor"
2. You should see 3 tables:
   - ✅ `users`
   - ✅ `nfts`
   - ✅ `nft_attributes`

### Check RLS Policies

1. Click on any table
2. Click "RLS" tab at top
3. You should see policies enabled

### Test Query

1. Go to "SQL Editor"
2. Run this test query:

```sql
-- Should return empty result (no NFTs yet)
SELECT * FROM nfts LIMIT 5;

-- Should show table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'nfts';
```

---

## 🧪 Step 6: Test Integration

### Test 1: Wallet Connection

1. Start your app: `npm run dev`
2. Connect your wallet (MetaMask or Phantom)
3. Check Supabase:
   - Go to "Table Editor" → "users"
   - You should see your wallet address

### Test 2: Dashboard Access

1. Navigate to `/dashboard` in your app
2. You should see:
   - "NO NFTS YET" message (if you haven't minted)
   - Your wallet address displayed
   - No errors in console

### Test 3: Mint NFT (When Ready)

1. Mint an NFT through your marketplace
2. After successful mint, check Supabase:
   - Go to "Table Editor" → "nfts"
   - You should see your minted NFT
3. Refresh dashboard - NFT should appear

---

## 🔒 Security: Row Level Security (RLS)

### What is RLS?

RLS ensures users can only access their own NFTs. It's automatically enabled in the schema.

### How it Works

```sql
-- Users can only see NFTs they own
CREATE POLICY "Users can read own NFTs"
  ON nfts
  FOR SELECT
  USING (owner_wallet = current_setting('app.current_wallet', true));
```

### Test RLS

Try this in SQL Editor:

```sql
-- Set your wallet address
SELECT set_config('app.current_wallet', '0xYourWalletAddress', false);

-- Should only return YOUR NFTs
SELECT * FROM nfts;
```

---

## 📊 Database Schema Overview

### Tables

```
users
├── id (uuid)
├── wallet_address (text, unique)
├── wallet_type (enum: metamask | phantom)
├── created_at (timestamp)
└── updated_at (timestamp)

nfts
├── id (uuid)
├── token_id (text)
├── contract_address (text)
├── chain_id (integer)
├── owner_wallet (text)
├── name (text)
├── description (text)
├── image_url (text)
├── metadata_uri (text)
├── mint_tx_hash (text, unique)
├── minted_at (timestamp)
├── created_at (timestamp)
└── updated_at (timestamp)

nft_attributes
├── id (uuid)
├── nft_id (uuid, foreign key)
├── trait_type (text)
├── value (text)
└── created_at (timestamp)
```

### Indexes

- `idx_users_wallet_address` - Fast wallet lookups
- `idx_nfts_owner_wallet` - Fast NFT queries by owner
- `idx_nfts_token_id` - Fast token ID lookups
- `idx_nfts_mint_tx_hash` - Prevent duplicate mints

---

## 🔧 Troubleshooting

### Error: "Missing Supabase environment variables"

**Solution**: 
1. Check `.env.local` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Restart dev server: `npm run dev`

### Error: "relation 'users' does not exist"

**Solution**: 
1. Run the schema SQL in Supabase SQL Editor
2. Verify tables exist in Table Editor

### Error: "new row violates row-level security policy"

**Solution**: 
1. Check RLS policies are created
2. Verify wallet address is set correctly
3. Try disabling RLS temporarily for testing:
   ```sql
   ALTER TABLE nfts DISABLE ROW LEVEL SECURITY;
   ```

### NFTs not showing in dashboard

**Solution**:
1. Check browser console for errors
2. Verify wallet is connected
3. Check Supabase Table Editor - are NFTs there?
4. Try refreshing dashboard

### "Failed to fetch NFTs"

**Solution**:
1. Check Supabase project is running (not paused)
2. Verify API keys are correct
3. Check browser network tab for 401/403 errors
4. Verify RLS policies allow SELECT

---

## 📈 Monitoring & Analytics

### View Database Activity

1. Go to "Database" → "Logs" in Supabase
2. See all queries in real-time
3. Filter by table or operation

### Check API Usage

1. Go to "Settings" → "Usage"
2. Monitor:
   - Database size
   - API requests
   - Bandwidth

### Set Up Alerts

1. Go to "Settings" → "Alerts"
2. Configure alerts for:
   - High database usage
   - API rate limits
   - Error rates

---

## 🚀 Production Checklist

Before going live:

- [ ] Database schema deployed
- [ ] RLS policies enabled and tested
- [ ] Environment variables set in production
- [ ] Indexes created for performance
- [ ] Backup strategy configured
- [ ] Monitoring set up
- [ ] API rate limits understood
- [ ] Database size limits known

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL Indexes](https://www.postgresql.org/docs/current/indexes.html)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

## 🆘 Support

If you encounter issues:

1. Check Supabase status: [status.supabase.com](https://status.supabase.com)
2. Search Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
3. Check GitHub issues: [github.com/supabase/supabase](https://github.com/supabase/supabase)

---

**Setup Complete!** 🎉

Your NFT marketplace now has a production-ready database backend.
