# CTsync - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Deploy Database Schema
```bash
# Option A: Supabase Dashboard
# 1. Open Supabase Dashboard → SQL Editor
# 2. Copy contents of supabase/ctsync-schema.sql
# 3. Click "Run"

# Option B: Supabase CLI
supabase db push
```

### 3. Configure Environment
```bash
# .env.local (already configured)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Test the App
- Visit `http://localhost:5173`
- Connect wallet
- Go to "UPLOAD EVIDENCE"
- Fill in form with location
- Click "GET AI ASSESSMENT"
- Upload evidence

---

## 📋 What's New in This Version

### ✅ AI Urgency Assessment
- Analyzes issue title + description
- Suggests urgency level (Low/Medium/High)
- Shows confidence score
- User can override

### ✅ Location Field
- New input field in upload form
- Optional (not required)
- Saves to database
- Displays in issue cards

### ✅ Fresh Database Schema
- `issues` table (replaces `nfts`)
- Status tracking (Open/Under Review/Resolved)
- Admin review tracking
- Audit trail for status changes

---

## 🎯 Key Features

### Upload Evidence
1. Upload photo of issue
2. Enter title (required)
3. Enter location (optional)
4. Enter description (optional)
5. Get AI urgency assessment
6. Submit to blockchain

### Public Ledger
- View all reported issues
- Filter by status/urgency
- Search by location
- See evidence photos

### My Submissions
- View your uploaded evidence
- Track status changes
- See resolution notes

---

## 🎨 Brand Identity

**Name:** CTsync  
**Tagline:** Public Issue Evidence Ledger  
**Colors:** Cyan (#06b6d4) & Teal (#14b8a6)  
**Tone:** Serious, technical, infrastructure-grade

---

## 📊 Database Tables

### issues (main table)
- Evidence records with location, urgency, status
- AI confidence scores
- Admin review tracking

### issue_status_history
- Audit trail for all status changes
- Who changed what and when

### issue_comments (optional)
- Comments on issues
- For future use

---

## 🔐 Admin Setup

### Set Admin Wallet
**File:** `constants.tsx`
```typescript
export const ADMIN_WALLET_ADDRESS = '0xYourAdminWalletHere';
```

### Admin Capabilities
- Mark issues as "Under Review"
- Mark issues as "Resolved"
- Add resolution notes
- All actions are logged

---

## 🧪 Testing Checklist

### Basic Flow
- [ ] Upload evidence with location
- [ ] Use AI assessment
- [ ] View in public ledger
- [ ] View in my submissions

### AI Assessment
- [ ] Click "GET AI ASSESSMENT"
- [ ] Verify suggestion appears
- [ ] Test manual override

### Database
- [ ] Schema deployed
- [ ] Data saves correctly
- [ ] Queries work

---

## 📝 Common Tasks

### Upload Evidence
```
1. Go to /mint
2. Upload photo
3. Fill in title + location
4. Click "GET AI ASSESSMENT"
5. Click "UPLOAD EVIDENCE"
```

### View Public Ledger
```
1. Go to /explore
2. Browse all issues
3. Filter by status/urgency
4. Click issue to see details
```

### Check Your Submissions
```
1. Connect wallet
2. Go to /dashboard
3. View all your submissions
```

---

## 🔧 Troubleshooting

### AI Assessment Not Working
- Check title is not empty
- Verify AI service is running
- Check console for errors

### Database Errors
- Verify schema is deployed
- Check Supabase connection
- Verify RLS policies

### Wallet Issues
- Switch to Sepolia testnet
- Check wallet is connected
- Verify correct network

---

## 📚 Documentation

- **MIGRATION_SUMMARY.md** - Complete migration details
- **DATABASE_MIGRATION_GUIDE.md** - Database setup
- **AI_URGENCY_AND_LOCATION_UPDATE.md** - New features
- **UPLOAD_FORM_REFERENCE.md** - Form specifications
- **QUICK_REFERENCE.md** - Terminology & colors

---

## 🎯 Next Steps

1. ✅ Test upload form with location
2. ✅ Test AI urgency assessment
3. ⏳ Update mint service for new fields
4. ⏳ Update issue card display
5. ⏳ Update issue detail page
6. ⏳ Implement admin resolution workflow

---

## 💡 Tips

- Location is optional but recommended
- AI assessment helps categorize urgency
- All evidence is permanently recorded
- Admin can mark issues as resolved
- Status changes are audited

---

## 🚨 Important Notes

- This is a **frontend-only migration**
- Blockchain functionality is preserved
- Database schema is completely new
- Old NFT data can be migrated
- No breaking changes to smart contracts

---

## ✅ Success Criteria

You'll know it's working when:
- ✅ Upload form shows location field
- ✅ AI assessment button works
- ✅ Urgency buttons are color-coded
- ✅ Evidence saves to database
- ✅ Public ledger displays issues
- ✅ No NFT/marketplace language visible

---

**Status:** Ready to Use  
**Version:** 2.0  
**Last Updated:** 2024

---

## 🆘 Need Help?

Check these files:
- `FINAL_UPDATE_SUMMARY.md` - What changed
- `DATABASE_MIGRATION_GUIDE.md` - Database help
- `UPLOAD_FORM_REFERENCE.md` - Form details
- `QUICK_REFERENCE.md` - Quick lookup

---

**Happy Building! 🚀**
