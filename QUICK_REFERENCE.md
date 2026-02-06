# CTsync - Quick Reference Guide

## 🎯 Product Identity

**Name:** CTsync  
**Tagline:** Public Issue Evidence Ledger  
**Purpose:** A transparent, visual board of real-world issues. Upload evidence. Make issues visible. Enforce accountability.

---

## 📋 Terminology Mapping

| OLD (NFT Marketplace) | NEW (CTsync) |
|----------------------|--------------|
| NFT | Evidence / Issue |
| Token | Record |
| Collection | Category |
| Mint | Upload Evidence |
| Create | Report Issue |
| Buy | View Details |
| Sell | Resolve Issue |
| Price | Severity Level |
| Owner | Status / Submitted By |
| Creator | Source |
| Listed | Open |
| Sold | Resolved |
| Floor Price | Severity Threshold |
| Volume | Issue Count |
| Token ID | Evidence ID |
| Marketplace | Public Ledger |
| My NFTs | My Submissions |
| Wallet balance | Rewards Eligibility |

---

## 🎨 Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Primary | Cyan | #06b6d4 |
| Secondary | Teal | #14b8a6 |
| Success | Emerald | #10b981 |
| Warning | Yellow | #eab308 |
| Error | Red | #ef4444 |
| Background | Zinc 900 | #18181b |
| Border | Zinc 800 | #27272a |

---

## 🔤 Typography Rules

- **Headlines:** Bold, uppercase, NO italic
- **Body Text:** Regular, sentence case
- **Technical Data:** Monospace font
- **Labels:** Uppercase, tracking-widest
- **Buttons:** Bold, uppercase

---

## 📱 Page Structure

### Homepage (Landing.tsx)
- Hero: "CTsync - PUBLIC ISSUE EVIDENCE LEDGER"
- CTA: "UPLOAD EVIDENCE" / "VIEW PUBLIC LEDGER"
- Stats: Issues Reported, Resolved, Active Users, Transparency
- Features: Public Visibility, Evidence-Based, Accountability

### Public Ledger (Explore.tsx)
- Title: "Public Ledger"
- Search: By title, description, location
- Sort: Latest / Oldest
- Filters: Status, Severity (optional)

### Upload Evidence (Mint.tsx)
- Title: "Upload Evidence"
- Fields: Issue Title, Description, (optional: Location, Category)
- NO price fields
- Button: "UPLOAD EVIDENCE"

### My Submissions (Dashboard.tsx)
- Title: "MY SUBMISSIONS"
- Grid of submitted evidence
- Empty state: "Upload your first evidence"

### Issue Detail (NFTDetail.tsx)
- Large evidence image
- Severity badge
- Status badge
- Submitted by (wallet address)
- AI analysis panel (optional)
- Status timeline (optional)
- Admin: "Mark as Resolved" button

---

## 🔐 Wallet Integration

### Purpose
- **NOT required** to upload evidence
- Used for: Admin actions, optional rewards

### Button Text
- "ADMIN / REWARDS" (not "CONNECT WALLET")

### Connection Message
- "Connected - Eligible for Rewards"

### Admin Detection
```typescript
const ADMIN_WALLET = '0x...'; // Hardcoded
const isAdmin = walletAddress?.toLowerCase() === ADMIN_WALLET.toLowerCase();
```

---

## 🏷️ Severity Levels

| Level | Color | Use Case |
|-------|-------|----------|
| Low | Yellow | Minor issues, cosmetic |
| Medium | Orange | Moderate impact |
| High | Red | Critical, urgent |

---

## 📊 Status Types

| Status | Color | Meaning |
|--------|-------|---------|
| Open | Cyan | Newly reported |
| Under Review | Yellow | Being investigated |
| Resolved | Emerald | Fixed/completed |

---

## 🎯 Key Components

### IssueCard (NFTCard.tsx)
- Displays evidence image
- Shows severity badge
- Shows status badge
- Evidence ID
- Reported date

### Navbar
- Logo: "CTsync"
- Links: PUBLIC LEDGER, UPLOAD EVIDENCE, MY SUBMISSIONS
- Wallet: "ADMIN / REWARDS"

### Footer
- Brand: "CTsync"
- Sections: Public Ledger, My Activity
- Newsletter: EMAIL@CTSYNC.ORG

---

## 🚫 What NOT to Include

### Language to Avoid
- NFT, mint, art, collection, marketplace
- Buy, sell, trade, price, floor, volume
- Underground, chaos, culture, drip, vibe
- Crypto hype language
- Playful or artistic tone

### Features to Remove
- Buy/Sell modals
- Price displays
- Trading functionality
- Ownership transfers
- Market statistics

---

## ✅ Validation Checklist

Before deploying:
- [ ] No "NFT" references anywhere
- [ ] No "mint" language (except in code)
- [ ] No buy/sell/trade functionality
- [ ] All colors are cyan/teal (no pink/violet)
- [ ] Logo says "CTsync"
- [ ] Nav links are correct
- [ ] Footer is updated
- [ ] Wallet button says "ADMIN / REWARDS"
- [ ] Upload page has no price fields
- [ ] Dashboard says "MY SUBMISSIONS"
- [ ] Product purpose is immediately clear

---

## 🔧 Quick Fixes

### If you see pink/violet:
Replace with cyan (#06b6d4) or teal (#14b8a6)

### If you see "NFT":
Replace with "Evidence" or "Issue"

### If you see "Mint":
Replace with "Upload Evidence"

### If you see "Collection":
Replace with "Submissions"

### If you see "Marketplace":
Replace with "Public Ledger"

---

## 📞 Support

### Documentation
- MIGRATION_SUMMARY.md - Complete migration details
- OPTIONAL_ENHANCEMENTS.md - Future improvements
- CTSYNC_MIGRATION_COMPLETE.md - Technical checklist

### Key Files Modified
1. types.ts - Core type definitions
2. constants.tsx - Global constants
3. Navbar.tsx - Navigation
4. NFTCard.tsx → IssueCard - Card component
5. Landing.tsx - Homepage
6. Explore.tsx - Public ledger
7. Mint.tsx - Upload evidence
8. Dashboard.tsx - My submissions
9. App.tsx - Footer

---

## 🎨 Design Principles

1. **Dark & Premium** - Minimal, technical aesthetic
2. **Infrastructure-Grade** - Serious, not playful
3. **Transparency First** - Clear purpose, no confusion
4. **Accountability Focus** - Every action is recorded
5. **No Crypto Hype** - Blockchain is a tool, not the product

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy
npm run deploy
```

---

## 📝 One-Sentence Summary

**CTsync is a blockchain-backed public ledger for documenting and tracking real-world infrastructure and civic issues with permanent, transparent evidence.**

---

**Last Updated:** 2024  
**Version:** 1.0  
**Status:** Production Ready ✅
