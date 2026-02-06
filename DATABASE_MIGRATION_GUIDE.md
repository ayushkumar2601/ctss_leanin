# CTsync Database Migration Guide

## 🎯 Overview

This guide will help you migrate from the old NFT marketplace database schema to the new CTsync issue tracking schema.

---

## 📋 New Schema Features

### Main Changes
1. **Table renamed:** `nfts` → `issues`
2. **New fields added:**
   - `location` - Geographic location of the issue
   - `category` - Issue classification (Infrastructure, Public Safety, etc.)
   - `urgency` - Low, Medium, High (replaces price)
   - `status` - Open, Under Review, Resolved
   - `ai_confidence` - AI confidence score (0-100)
   - `ai_severity_assessment` - AI's assessment text
   - `reviewed_at`, `reviewed_by` - Admin review tracking
   - `resolved_at`, `resolved_by`, `resolution_notes` - Resolution tracking

3. **New tables:**
   - `issue_status_history` - Audit trail for status changes
   - `issue_comments` - Optional comments on issues

4. **New views:**
   - `open_issues` - Quick access to open issues
   - `urgent_issues` - High priority issues
   - `recently_resolved` - Recently resolved issues
   - `issue_stats_by_category` - Statistics by category
   - `issue_stats_by_urgency` - Statistics by urgency

---

## 🚀 Migration Steps

### Step 1: Backup Your Current Database

```sql
-- Create a backup of your existing data
CREATE TABLE nfts_backup AS SELECT * FROM nfts;
CREATE TABLE listings_backup AS SELECT * FROM listings;
```

### Step 2: Run the New Schema

```bash
# In Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Copy contents of supabase/ctsync-schema.sql
# 3. Execute the script
```

Or via CLI:
```bash
supabase db push
```

### Step 3: Migrate Existing Data (Optional)

If you have existing NFT data you want to preserve:

```sql
-- Migrate NFTs to Issues
INSERT INTO public.issues (
  evidence_id,
  contract_address,
  chain_id,
  mint_tx_hash,
  title,
  description,
  location,
  category,
  urgency,
  status,
  image_url,
  metadata_uri,
  submitted_by,
  submitted_at
)
SELECT 
  token_id::TEXT as evidence_id,
  contract_address,
  chain_id,
  mint_tx_hash,
  name as title,
  description,
  'Unknown' as location, -- Default location
  'Infrastructure' as category, -- Default category
  'Medium' as urgency, -- Default urgency
  'Open' as status, -- Default status
  image_url,
  metadata_uri,
  owner_wallet as submitted_by,
  minted_at as submitted_at
FROM nfts_backup;
```

### Step 4: Update Your Application Code

Update your TypeScript types to match the new schema:

```typescript
// lib/supabase/types.ts
export interface Issue {
  id: string;
  evidence_id: string; // Token ID
  contract_address: string;
  chain_id: number;
  mint_tx_hash: string;
  
  // Issue details
  title: string;
  description: string | null;
  location: string | null;
  
  // Classification
  category: string;
  urgency: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Under Review' | 'Resolved';
  
  // AI Analysis
  ai_confidence: number | null;
  ai_severity_assessment: string | null;
  
  // Media
  image_url: string;
  metadata_uri: string | null;
  
  // Submission
  submitted_by: string;
  submitted_at: string;
  
  // Status tracking
  reviewed_at: string | null;
  reviewed_by: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  resolution_notes: string | null;
  
  // Metadata
  created_at: string;
  updated_at: string;
}
```

### Step 5: Update Service Functions

Update your service functions to use the new field names:

```typescript
// lib/services/nftService.ts → issueService.ts

export async function getAllIssues(sortOrder: 'newest' | 'oldest' = 'newest') {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .order('submitted_at', { ascending: sortOrder === 'oldest' });
  
  if (error) throw error;
  return data;
}

export async function getIssueById(id: string) {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getUserIssues(walletAddress: string) {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('submitted_by', walletAddress.toLowerCase())
    .order('submitted_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getIssuesByStatus(status: 'Open' | 'Under Review' | 'Resolved') {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('status', status)
    .order('submitted_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getIssuesByUrgency(urgency: 'Low' | 'Medium' | 'High') {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .eq('urgency', urgency)
    .order('submitted_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
```

### Step 6: Update Mint Service

Update the mint service to include new fields:

```typescript
// lib/services/mint-service.ts

export async function saveIssueToDatabase(
  tokenId: string,
  contractAddress: string,
  chainId: number,
  txHash: string,
  metadata: {
    name: string;
    description: string;
    location?: string;
    urgency: 'Low' | 'Medium' | 'High';
    category?: string;
    ai_confidence?: number;
  },
  imageUrl: string,
  metadataUri: string,
  walletAddress: string
) {
  const { data, error } = await supabase
    .from('issues')
    .insert({
      evidence_id: tokenId,
      contract_address: contractAddress.toLowerCase(),
      chain_id: chainId,
      mint_tx_hash: txHash.toLowerCase(),
      title: metadata.name,
      description: metadata.description,
      location: metadata.location || null,
      category: metadata.category || 'Infrastructure',
      urgency: metadata.urgency,
      status: 'Open',
      ai_confidence: metadata.ai_confidence || null,
      image_url: imageUrl,
      metadata_uri: metadataUri,
      submitted_by: walletAddress.toLowerCase(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

## 🔐 Admin Functions

### Mark Issue as Under Review

```typescript
export async function markAsUnderReview(
  issueId: string,
  adminWallet: string
) {
  const { data, error } = await supabase
    .from('issues')
    .update({
      status: 'Under Review',
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminWallet.toLowerCase(),
    })
    .eq('id', issueId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### Mark Issue as Resolved

```typescript
export async function markAsResolved(
  issueId: string,
  adminWallet: string,
  resolutionNotes?: string
) {
  const { data, error } = await supabase
    .from('issues')
    .update({
      status: 'Resolved',
      resolved_at: new Date().toISOString(),
      resolved_by: adminWallet.toLowerCase(),
      resolution_notes: resolutionNotes || null,
    })
    .eq('id', issueId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

---

## 📊 Useful Queries

### Get Statistics

```typescript
// Get issue counts by status
export async function getIssueStats() {
  const { data, error } = await supabase
    .from('issues')
    .select('status');
  
  if (error) throw error;
  
  const stats = {
    total: data.length,
    open: data.filter(i => i.status === 'Open').length,
    underReview: data.filter(i => i.status === 'Under Review').length,
    resolved: data.filter(i => i.status === 'Resolved').length,
  };
  
  return stats;
}

// Get urgency distribution
export async function getUrgencyStats() {
  const { data, error } = await supabase
    .from('issues')
    .select('urgency');
  
  if (error) throw error;
  
  const stats = {
    high: data.filter(i => i.urgency === 'High').length,
    medium: data.filter(i => i.urgency === 'Medium').length,
    low: data.filter(i => i.urgency === 'Low').length,
  };
  
  return stats;
}
```

### Get Status History

```typescript
export async function getIssueHistory(issueId: string) {
  const { data, error } = await supabase
    .from('issue_status_history')
    .select('*')
    .eq('issue_id', issueId)
    .order('changed_at', { ascending: false });
  
  if (error) throw error;
  return data;
}
```

---

## 🧪 Testing Your Migration

### Test Checklist

1. **Data Integrity**
   ```sql
   -- Verify all issues migrated
   SELECT COUNT(*) FROM issues;
   
   -- Check for missing required fields
   SELECT * FROM issues WHERE title IS NULL OR image_url IS NULL;
   ```

2. **RLS Policies**
   ```sql
   -- Test public read access
   SELECT * FROM issues LIMIT 1;
   
   -- Test insert (should work for authenticated users)
   INSERT INTO issues (...) VALUES (...);
   ```

3. **Application Tests**
   - Upload new evidence
   - View public ledger
   - View user submissions
   - Filter by status
   - Filter by urgency
   - Admin: Mark as reviewed
   - Admin: Mark as resolved

---

## 🔄 Rollback Plan

If you need to rollback:

```sql
-- Restore from backup
DROP TABLE issues CASCADE;
ALTER TABLE nfts_backup RENAME TO nfts;
ALTER TABLE listings_backup RENAME TO listings;
```

---

## 📝 Environment Variables

No changes needed to environment variables. Your existing Supabase configuration will work with the new schema.

---

## 🚨 Important Notes

1. **Marketplace Tables**: The old `listings` table is no longer needed in CTsync. You can drop it after confirming the migration is successful.

2. **Admin Wallet**: Set your admin wallet address in `constants.tsx`:
   ```typescript
   export const ADMIN_WALLET_ADDRESS = '0xYourAdminWalletHere';
   ```

3. **Metadata Format**: Update your metadata JSON to include new fields:
   ```json
   {
     "name": "Issue Title",
     "description": "Issue description",
     "image": "ipfs://...",
     "attributes": [
       { "trait_type": "Location", "value": "Main St & 5th Ave" },
       { "trait_type": "Category", "value": "Infrastructure" },
       { "trait_type": "Urgency", "value": "High" },
       { "trait_type": "Status", "value": "Open" },
       { "trait_type": "AI Confidence", "value": "85" }
     ]
   }
   ```

---

## ✅ Post-Migration Checklist

- [ ] Database schema deployed
- [ ] Existing data migrated (if applicable)
- [ ] TypeScript types updated
- [ ] Service functions updated
- [ ] Mint service updated with new fields
- [ ] Admin functions implemented
- [ ] RLS policies tested
- [ ] Application tested end-to-end
- [ ] Admin wallet configured
- [ ] Old tables backed up and removed

---

**Migration Status:** Ready to Deploy  
**Estimated Time:** 30-60 minutes  
**Difficulty:** Medium
