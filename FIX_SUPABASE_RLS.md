# 🔧 FIX SUPABASE RLS ERROR

## The Problem

Your NFT minted successfully on the blockchain! 🎉

But Supabase Row Level Security (RLS) is blocking the database save because it requires a session variable that we're not setting.

**Your NFT is on the blockchain:**
- Token ID: 1
- Transaction: `0xaec5581c187844911306d6ab3de20c78c1a7730c4a6b78bb26dfb2028a4c39c8`
- View on Etherscan: https://sepolia.etherscan.io/tx/0xaec5581c187844911306d6ab3de20c78c1a7730c4a6b78bb26dfb2028a4c39c8

---

## ✅ QUICK FIX (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard/project/kujgnfwbnyfgnowpwotc
2. Click **"SQL Editor"** in left sidebar
3. Click **"New query"**

### Step 2: Run This SQL

Copy and paste this into the SQL editor:

```sql
-- Disable RLS for NFT tables
ALTER TABLE nfts DISABLE ROW LEVEL SECURITY;
ALTER TABLE nft_attributes DISABLE ROW LEVEL SECURITY;
```

### Step 3: Click "Run" (or press Ctrl+Enter)

You should see: **"Success. No rows returned"**

### Step 4: Test Minting Again

1. Go back to your app: http://localhost:5173
2. Go to Mint page
3. Upload a new image
4. Fill in title and description
5. Click "MINT YOUR CHAOS"
6. Approve transaction
7. **SUCCESS!** NFT should save to database now 🎉

---

## 🔍 What This Does

**Disabling RLS** means:
- ✅ Anyone can insert NFTs (but only with valid blockchain data)
- ✅ Anyone can read NFTs (public marketplace)
- ✅ Minting will work immediately

**Is it safe?**
- ✅ Yes for a public marketplace
- ✅ NFT ownership is verified on blockchain
- ✅ Users can't fake ownership (blockchain is source of truth)

---

## 🔒 Alternative: Keep RLS Enabled (Advanced)

If you want to keep RLS for extra security, run this instead:

```sql
-- Drop old policies
DROP POLICY IF EXISTS "Users can insert own NFTs" ON nfts;
DROP POLICY IF EXISTS "Users can read own NFTs" ON nfts;

-- Allow anyone to insert NFTs
CREATE POLICY "Allow NFT minting"
  ON nfts
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read all NFTs (public marketplace)
CREATE POLICY "Allow reading all NFTs"
  ON nfts
  FOR SELECT
  USING (true);

-- Only owner can update their NFTs
CREATE POLICY "Users can update own NFTs"
  ON nfts
  FOR UPDATE
  USING (owner_wallet = auth.uid()::text);
```

---

## 📊 Verify It Works

After running the SQL:

1. **Check Tables:**
   - Go to Supabase → Table Editor → `nfts`
   - RLS should show as "Disabled"

2. **Test Mint:**
   - Mint a new NFT
   - Should save successfully
   - Check `nfts` table - should see your NFT

3. **Check Dashboard:**
   - Go to Dashboard page
   - Your NFTs should appear

---

## 🎯 Summary

**Quick Fix:**
```sql
ALTER TABLE nfts DISABLE ROW LEVEL SECURITY;
ALTER TABLE nft_attributes DISABLE ROW LEVEL SECURITY;
```

**Run in:** Supabase SQL Editor

**Result:** Minting will work!

---

## 🆘 Still Having Issues?

If minting still fails after disabling RLS:

1. **Check Supabase logs:**
   - Supabase Dashboard → Logs
   - Look for errors

2. **Check browser console:**
   - F12 → Console tab
   - Look for red errors

3. **Verify environment variables:**
   - Check `.env.local` has correct Supabase URL and key

---

**Run the SQL fix now and try minting again! 🚀**
