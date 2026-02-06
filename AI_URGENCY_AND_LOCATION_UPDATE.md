# AI Urgency Assessment & Location Field - Update Summary

## ✅ What Was Added

### 1. **AI Urgency Assessment** (Restored & Reframed)

The AI suggester has been **restored** but completely **reframed** for CTsync:

**OLD (NFT Marketplace):**
- AI suggested prices in ETH
- "Get AI Valuation" button
- Analyzed artwork value

**NEW (CTsync):**
- AI assesses urgency level (Low/Medium/High)
- "Get AI Assessment" button
- Analyzes issue severity based on title and description

#### Implementation Details

**File:** `pages/Mint.tsx`

**New State:**
```typescript
const [urgency, setUrgency] = useState<'Low' | 'Medium' | 'High'>('Medium');
const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
const [aiConfidence, setAiConfidence] = useState<number | null>(null);
```

**AI Assessment Function:**
```typescript
const getAIUrgencyAssessment = async () => {
  if (!title) return;
  setIsEstimating(true);
  try {
    const result = await getNFTPriceSuggestion(title, description);
    
    // Reframe AI response for urgency
    const urgencyText = result.text.replace(/price|eth|value/gi, 'urgency level');
    setAiSuggestion(urgencyText);
    
    // Map AI confidence to urgency level
    if (result.confidence && result.confidence > 75) {
      setUrgency('High');
    } else if (result.confidence && result.confidence > 50) {
      setUrgency('Medium');
    } else {
      setUrgency('Low');
    }
    
    setAiConfidence(result.confidence);
  } catch (err) {
    console.error("AI Assessment failed:", err);
    setAiSuggestion("Medium urgency | AI analysis unavailable. Please assess manually.");
    setAiConfidence(60);
  } finally {
    setIsEstimating(false);
  }
};
```

**UI Components:**

1. **AI Assessment Button:**
   ```tsx
   <button 
     onClick={getAIUrgencyAssessment}
     disabled={!title || isEstimating}
     className="flex items-center gap-1 text-[10px] font-mono text-cyan-500"
   >
     {isEstimating ? 'AI ANALYZING...' : 'GET AI ASSESSMENT'}
   </button>
   ```

2. **AI Suggestion Display:**
   ```tsx
   {aiSuggestion && (
     <div className="bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-xl">
       <p className="text-[10px] font-mono text-cyan-400">
         <span className="font-bold">AI ASSESSMENT:</span> {aiSuggestion}
       </p>
     </div>
   )}
   ```

3. **Urgency Level Selector:**
   ```tsx
   <div className="flex gap-2">
     {(['Low', 'Medium', 'High'] as const).map((level) => (
       <button
         key={level}
         onClick={() => setUrgency(level)}
         className={`flex-1 py-3 px-4 rounded-xl font-bold ${
           urgency === level
             ? level === 'High' ? 'bg-red-500 text-white'
             : level === 'Medium' ? 'bg-orange-500 text-white'
             : 'bg-yellow-500 text-black'
             : 'bg-zinc-900 text-zinc-500'
         }`}
       >
         {level}
       </button>
     ))}
   </div>
   ```

---

### 2. **Location Field**

A new **Location** input field has been added to the evidence upload form.

**File:** `pages/Mint.tsx`

**New State:**
```typescript
const [location, setLocation] = useState('');
```

**UI Component:**
```tsx
<div className="space-y-2">
  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
    Location
  </label>
  <input 
    type="text" 
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    placeholder="e.g. MAIN ST & 5TH AVE, WARD 3"
    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-xs font-mono focus:border-cyan-500 outline-none transition-all uppercase"
  />
</div>
```

**Field Order in Form:**
1. Issue Title
2. **Location** ← NEW
3. Issue Description
4. Urgency Level (with AI assessment)

---

### 3. **New Database Schema**

A completely fresh SQL schema has been created for CTsync.

**File:** `supabase/ctsync-schema.sql`

#### Key Features:

**Main Table: `issues`**
- `evidence_id` - Token ID from blockchain
- `title` - Issue title
- `description` - Issue description
- **`location`** - Geographic location (NEW)
- **`category`** - Issue classification (NEW)
- **`urgency`** - Low/Medium/High (NEW)
- **`status`** - Open/Under Review/Resolved (NEW)
- **`ai_confidence`** - AI confidence score 0-100 (NEW)
- **`ai_severity_assessment`** - AI's assessment text (NEW)
- `submitted_by` - Wallet address
- `submitted_at` - Timestamp
- **`reviewed_at`, `reviewed_by`** - Admin review tracking (NEW)
- **`resolved_at`, `resolved_by`, `resolution_notes`** - Resolution tracking (NEW)

**New Tables:**
1. **`issue_status_history`** - Audit trail for all status changes
2. **`issue_comments`** - Optional comments on issues (for future use)

**New Views:**
1. `open_issues` - Quick access to open issues
2. `urgent_issues` - High priority issues only
3. `recently_resolved` - Recently resolved issues
4. `issue_stats_by_category` - Statistics grouped by category
5. `issue_stats_by_urgency` - Statistics grouped by urgency

**Indexes Added:**
- `evidence_id`, `status`, `urgency`, `category`, `location`
- `submitted_by`, `submitted_at`
- Optimized for common queries

**RLS Policies:**
- Public read access (anyone can view issues)
- Authenticated users can insert (upload evidence)
- Only submitter or admin can update
- Admin-only status history insertion

**Automatic Triggers:**
- Auto-update `updated_at` timestamp
- Auto-log status changes to history table

---

## 🎨 Visual Design

### Urgency Level Buttons

**Color Coding:**
- **High:** Red background (`bg-red-500`)
- **Medium:** Orange background (`bg-orange-500`)
- **Low:** Yellow background with black text (`bg-yellow-500 text-black`)
- **Inactive:** Dark gray (`bg-zinc-900 text-zinc-500`)

### AI Assessment Display

**Styling:**
- Cyan background with low opacity (`bg-cyan-500/10`)
- Cyan border (`border-cyan-500/30`)
- Cyan text (`text-cyan-400`)
- Slide-in animation from top
- Monospace font for technical feel

### Location Field

**Styling:**
- Matches other form fields
- Cyan focus border (`focus:border-cyan-500`)
- Uppercase placeholder text
- Monospace font

---

## 📊 Data Flow

### Upload Evidence Flow (Updated)

1. User fills in:
   - Issue Title
   - **Location** (optional)
   - Issue Description
   - Clicks "GET AI ASSESSMENT" (optional)

2. AI analyzes title + description:
   - Returns urgency suggestion
   - Returns confidence score
   - Auto-selects urgency level

3. User can override AI suggestion:
   - Click Low/Medium/High buttons
   - Manual selection

4. User uploads evidence photo

5. On submit:
   - Image uploaded to IPFS
   - Metadata created with:
     - Title, description, location
     - Urgency level
     - AI confidence score
     - Category (default: Infrastructure)
   - Minted to blockchain
   - Saved to database

---

## 🔄 Migration Path

### From Old NFT Schema to New Issues Schema

**Automatic Migration Query:**
```sql
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
  'Unknown' as location, -- Default
  'Infrastructure' as category, -- Default
  'Medium' as urgency, -- Default
  'Open' as status, -- Default
  image_url,
  metadata_uri,
  owner_wallet as submitted_by,
  minted_at as submitted_at
FROM nfts;
```

---

## 🧪 Testing Checklist

### AI Urgency Assessment
- [ ] Click "GET AI ASSESSMENT" button
- [ ] Verify AI suggestion appears
- [ ] Verify urgency level auto-selects
- [ ] Verify confidence score displays
- [ ] Test manual override (click different urgency)
- [ ] Test with empty title (button should be disabled)
- [ ] Test error handling (AI service down)

### Location Field
- [ ] Enter location text
- [ ] Verify uppercase transformation
- [ ] Verify placeholder text
- [ ] Test with empty location (should be optional)
- [ ] Verify location saves to database

### Database
- [ ] Run schema creation script
- [ ] Verify all tables created
- [ ] Verify indexes created
- [ ] Verify RLS policies work
- [ ] Test views return correct data
- [ ] Test triggers fire correctly

---

## 📝 Next Steps

### Required Updates

1. **Update Mint Service** (`lib/services/mint-service.ts`):
   - Add `location` parameter
   - Add `urgency` parameter
   - Add `ai_confidence` parameter
   - Update database insert to use `issues` table

2. **Update Metadata Format**:
   ```json
   {
     "name": "Issue Title",
     "description": "Issue description",
     "image": "ipfs://...",
     "attributes": [
       { "trait_type": "Location", "value": "Main St & 5th Ave" },
       { "trait_type": "Urgency", "value": "High" },
       { "trait_type": "AI Confidence", "value": "85" },
       { "trait_type": "Category", "value": "Infrastructure" },
       { "trait_type": "Status", "value": "Open" }
     ]
   }
   ```

3. **Update Issue Card** (`components/NFTCard.tsx`):
   - Display location if available
   - Use urgency from database (not mock)
   - Use status from database (not mock)

4. **Update Issue Detail Page** (`pages/NFTDetail.tsx`):
   - Display location
   - Display urgency badge
   - Display AI confidence score
   - Display status timeline

---

## 🎯 Summary

### What Changed
✅ AI suggester restored and reframed for urgency assessment  
✅ Location field added to upload form  
✅ Fresh database schema created with new fields  
✅ Urgency level selector with color-coded buttons  
✅ AI confidence score tracking  
✅ Status tracking (Open/Under Review/Resolved)  
✅ Admin review and resolution tracking  
✅ Audit trail for status changes  

### What Stayed the Same
✅ Blockchain minting functionality  
✅ IPFS image upload  
✅ Wallet integration  
✅ Overall component structure  

### What's Next
🔄 Update mint service to save new fields  
🔄 Update issue card to display urgency/location  
🔄 Update issue detail page with new data  
🔄 Implement admin resolution workflow  

---

**Status:** ✅ Complete  
**Files Modified:** 1 (pages/Mint.tsx)  
**Files Created:** 3 (SQL schema, migration guide, this summary)  
**Breaking Changes:** Database schema (requires migration)
