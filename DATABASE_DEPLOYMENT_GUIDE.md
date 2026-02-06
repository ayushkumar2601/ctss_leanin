# 🚀 Database Deployment Guide - Fix 404 Errors

## Current Issue
Your app is getting 404 errors because the database doesn't have the required tables yet. The code references `nfts` table but it doesn't exist in Supabase.

## ✅ Solution: Deploy CTsync Schema

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase dashboard: https://mlhqiqspmoqgwnbhdiwn.supabase.co
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"** button

### Step 2: Deploy the Schema
1. Open the file: `supabase/ctsync-schema.sql`
2. Copy the **entire contents** of the file
3. Paste it into the Supabase SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter)
5. Wait for the success message

### Step 3: Verify Deployment
After running the schema, verify these tables exist:
- ✅ `issues` - Main table for evidence records
- ✅ `issue_status_history` - Audit trail for status changes
- ✅ `issue_comments` - Comments on issues (future use)
- ✅ `nft_attributes` - Attributes for backward compatibility
- ✅ `nfts` - VIEW that maps to issues table (backward compatibility)

To verify, run this query in SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('issues', 'nfts', 'nft_attributes');
```

You should see all three names in the results.

### Step 4: Test Upload Evidence
1. Go to your app
2. Connect your wallet
3. Try uploading evidence with:
   - Title
   - Description
   - Location (new field!)
   - Image
4. The AI should suggest urgency level
5. Submit and verify it appears in the Public Ledger

## 🔧 What the Schema Does

### Backward Compatibility
The schema includes a `nfts` VIEW that maps to the `issues` table:
- Your existing code can keep using `nfts` table queries
- They automatically read from the `issues` table
- No code changes needed immediately

### New Features Enabled
- ✅ Location field for issues
- ✅ Urgency levels (Low/Medium/High)
- ✅ Status tracking (Open/Under Review/Resolved)
- ✅ AI confidence scores
- ✅ Resolution tracking (who closed it, when, notes)
- ✅ Audit trail for status changes

### Field Mapping
| Old NFT Field | New Issues Field |
|--------------|------------------|
| token_id | evidence_id |
| name | title |
| owner_wallet | submitted_by |
| minted_at | submitted_at |

## 🐛 Troubleshooting

### Error: "relation already exists"
If you see this error, it means tables already exist. You have two options:

**Option A: Drop and recreate (DELETES ALL DATA)**
```sql
DROP TABLE IF EXISTS public.issue_comments CASCADE;
DROP TABLE IF EXISTS public.issue_status_history CASCADE;
DROP TABLE IF EXISTS public.nft_attributes CASCADE;
DROP TABLE IF EXISTS public.issues CASCADE;
DROP VIEW IF EXISTS public.nfts CASCADE;
```
Then run the full schema again.

**Option B: Keep existing data**
Skip the deployment and check if your tables are already correct.

### Error: "permission denied"
Make sure you're logged into Supabase with the correct project.

### Still getting 404 errors after deployment
1. Check if the `nfts` view exists:
   ```sql
   SELECT * FROM public.nfts LIMIT 1;
   ```
2. Verify RLS policies are enabled:
   ```sql
   SELECT tablename, policyname 
   FROM pg_policies 
   WHERE schemaname = 'public' 
   AND tablename IN ('issues', 'nfts');
   ```
3. Check your `.env.local` file has correct Supabase credentials

## 📝 Next Steps After Deployment

1. **Test the upload flow** - Make sure evidence uploads work
2. **Test the close issue flow** - Verify only submitters can close their issues
3. **Check the AI urgency assessment** - Ensure it's giving professional responses
4. **Verify location field** - Make sure location is saved and displayed

## 🔄 Future Migration (Optional)

Once everything is working, you can optionally update your service files to use `issues` table directly instead of the `nfts` view. This is not urgent - the view works fine for now.

Files to update later:
- `lib/supabase/nft-service.ts`
- `lib/services/nftService.ts`

Change all references from `'nfts'` to `'issues'` and update field names.
