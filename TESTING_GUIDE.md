# UI/UX Polish - Testing Guide

## 🧪 How to Test the New Features

### 1️⃣ Empty States Testing

#### Test Dashboard Empty State
1. Open the app and connect your wallet
2. Navigate to `/dashboard`
3. If you have NFTs, temporarily clear them or use a fresh wallet
4. **Expected**: See designed empty state with:
   - Sparkles icon
   - "No NFTs yet — mint your first Voxrt asset 🚀"
   - Description text
   - "Mint NFT" button (pink)
   - "Explore NFTs" button (outlined)

#### Test Explore Empty State (No NFTs)
1. Navigate to `/explore`
2. If database has NFTs, temporarily clear them
3. **Expected**: See designed empty state with:
   - Sparkles icon
   - "No NFTs yet — mint your first Voxrt asset 🚀"
   - "Be the first to mint!" message
   - "Mint NFT" and "Refresh" buttons

#### Test Explore Empty State (No Search Results)
1. Navigate to `/explore`
2. Type a search query that returns no results (e.g., "zzzzzzz")
3. **Expected**: See designed empty state with:
   - Search icon
   - "No results found"
   - Description showing your search term
   - "Clear Search" and "Mint NFT" buttons

---

### 2️⃣ Human-Readable Time Testing

#### Test NFT Card Time Display
1. Navigate to `/explore` or `/dashboard`
2. Look at any NFT card
3. Find the "Minted:" field
4. **Expected**: 
   - Shows relative time (e.g., "3 minutes ago", "2 hours ago", "yesterday")
   - Hover over the time
   - Tooltip appears showing exact timestamp (e.g., "Jan 30, 2026, 14:22 UTC")

#### Test NFT Detail Time Display
1. Click on any NFT to open detail page
2. Scroll to "Blockchain Data" section
3. Find the "Minted:" field
4. **Expected**:
   - Shows relative time
   - Hover shows exact timestamp tooltip

---

## ✅ Visual Checklist

### Empty States
- [ ] Icons display correctly (not broken)
- [ ] Text is readable and properly styled
- [ ] Buttons are clickable and navigate correctly
- [ ] Layout is centered and balanced
- [ ] Responsive on mobile (test by resizing browser)
- [ ] No layout shifts when empty state appears

### Time Display
- [ ] All timestamps show relative time (not raw ISO strings)
- [ ] Hover tooltip appears on all time displays
- [ ] Tooltip shows formatted date with timezone
- [ ] Time updates make sense (newer items show "just now", older show "X days ago")
- [ ] No "NaN" or "Invalid Date" errors

---

## 🐛 Common Issues to Check

### Empty States
- ❌ Buttons don't navigate → Check Link `to` props
- ❌ Layout breaks on mobile → Check responsive classes
- ❌ Icon doesn't show → Check lucide-react import

### Time Display
- ❌ Shows "Invalid Date" → Check date format passed to component
- ❌ Tooltip doesn't appear → Check browser console for errors
- ❌ Time is wrong → Check timezone handling in formatExactTime

---

## 📱 Responsive Testing

Test on these viewport sizes:
- **Mobile**: 375px width
- **Tablet**: 768px width
- **Desktop**: 1440px width

### What to Check:
- Empty state buttons stack vertically on mobile
- Time displays don't overflow
- Tooltips position correctly
- Icons scale appropriately

---

## 🎯 Success Criteria

✅ **Empty States**:
- Professional, designed appearance
- Clear call-to-action buttons
- Consistent across all pages
- No generic "No data" messages

✅ **Time Display**:
- All timestamps are human-readable
- Tooltips work on hover
- No raw ISO strings visible
- Time makes logical sense (recent = minutes, old = days/months)

---

## 🔄 Quick Test Flow

1. **Fresh Start**: Clear browser cache and reload
2. **Empty Dashboard**: Connect wallet with no NFTs → Check empty state
3. **Empty Explore**: Clear search or use empty DB → Check empty state
4. **Search Empty**: Search for nonsense → Check search empty state
5. **Time Display**: View any NFT card → Check relative time
6. **Tooltip**: Hover over time → Check exact timestamp appears
7. **NFT Detail**: Open NFT detail → Check time in blockchain section
8. **Mobile**: Resize to 375px → Check all features work

---

## 📸 Screenshots to Take (Optional)

For documentation:
1. Dashboard empty state
2. Explore empty state (no NFTs)
3. Explore empty state (no search results)
4. NFT card with time display
5. Time tooltip on hover
6. NFT detail blockchain section with time

---

## 🚀 Performance Check

- [ ] Page loads without delay
- [ ] No console errors
- [ ] No console warnings
- [ ] Smooth transitions
- [ ] No layout shifts (CLS)
- [ ] Images load properly

---

## ✨ Final Validation

Run through the entire app:
1. Landing page → Check trending NFTs time
2. Explore page → Check all NFT cards time
3. NFT Detail → Check blockchain time
4. Dashboard → Check collection time
5. Empty states → Verify all scenarios

**All good?** ✅ Ship it!
