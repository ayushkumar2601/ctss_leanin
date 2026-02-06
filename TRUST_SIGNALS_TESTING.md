# Trust Signals - Testing Guide

## 🧪 Quick Test Flow

### Test 1: Sepolia Badge Visibility
**Goal**: Verify badge only shows on Sepolia NFTs

1. Navigate to any NFT detail page
2. Check if NFT is on Sepolia (chainId 11155111)
3. **Expected**: 
   - ✅ Badge appears: "✔ Verified on Sepolia"
   - ✅ Badge is emerald green with shield icon
   - ✅ Badge is below the NFT title

**If NFT is NOT on Sepolia**:
- ❌ Badge should NOT appear

---

### Test 2: Badge Click Behavior
**Goal**: Verify badge opens explorer

1. Find the "Verified on Sepolia" badge
2. **Hover** over badge
   - **Expected**: Tooltip shows "This NFT is verified on Ethereum Sepolia"
3. **Click** on badge
   - **Expected**: 
     - Opens new tab
     - Goes to Sepolia Etherscan
     - Shows transaction page (if txHash available)
     - OR shows contract page (if no txHash)

---

### Test 3: Explorer Quick Links
**Goal**: Verify all explorer links work

1. Look for icon buttons next to NFT title (top-right)
2. **Expected Icons**:
   - 📄 **FileText icon** = View Transaction
   - 📦 **Box icon** = View Contract
   - 🔗 **ExternalLink icon** = View Token

3. **Hover** over each icon
   - **Expected**: Tooltip appears with action description

4. **Click** each icon
   - **Expected**: 
     - Opens new tab
     - Goes to correct Sepolia Etherscan page
     - Transaction link → `/tx/0x...`
     - Contract link → `/address/0x...`
     - Token link → `/token/0x...?a=123`

---

### Test 4: Missing Data Handling
**Goal**: Verify links hide when data is missing

**Scenario A**: NFT with all data
- **Expected**: All 3 icons appear

**Scenario B**: NFT without transaction hash
- **Expected**: Only Contract and Token icons appear

**Scenario C**: NFT without token ID
- **Expected**: Only Transaction and Contract icons appear

---

### Test 5: Mobile Responsiveness
**Goal**: Verify works on mobile

1. Resize browser to mobile width (375px)
2. Navigate to NFT detail page
3. **Check Badge**:
   - [ ] Badge displays correctly
   - [ ] Badge doesn't overflow
   - [ ] Badge is tappable (not too small)
4. **Check Explorer Links**:
   - [ ] Icons are visible
   - [ ] Icons are tappable (40x40px minimum)
   - [ ] Icons don't overlap
   - [ ] Tap opens correct page

---

### Test 6: Keyboard Accessibility
**Goal**: Verify keyboard navigation works

1. Press **Tab** repeatedly
2. **Expected**: 
   - Badge receives focus (visible outline)
   - Each explorer link receives focus
3. Press **Enter** on focused badge
   - **Expected**: Opens explorer
4. Press **Enter** on focused link
   - **Expected**: Opens explorer

---

### Test 7: Screen Reader
**Goal**: Verify screen reader announces correctly

1. Enable screen reader (NVDA, JAWS, VoiceOver)
2. Navigate to badge
   - **Expected**: Announces "Verified on Ethereum Sepolia, button"
3. Navigate to explorer links
   - **Expected**: Announces link purpose (e.g., "View Transaction")

---

## ✅ Visual Checklist

### Sepolia Badge
- [ ] Appears on Sepolia NFTs only
- [ ] Emerald green color (#10b981)
- [ ] Shield check icon visible
- [ ] Text: "Verified on Sepolia"
- [ ] Monospace font
- [ ] Rounded border
- [ ] Hover effect (brightens)
- [ ] Tooltip on hover
- [ ] Clickable
- [ ] Opens explorer on click
- [ ] Accessible (keyboard + screen reader)

### Explorer Links
- [ ] Three icons displayed (when data available)
- [ ] Icons are clear and visible
- [ ] Grouped horizontally
- [ ] Proper spacing between icons
- [ ] Dark background with border
- [ ] Cyan hover effect
- [ ] Tooltips on hover
- [ ] Opens in new tab
- [ ] Correct pages open
- [ ] Mobile tap targets adequate
- [ ] Accessible (keyboard + screen reader)

### Layout
- [ ] No layout shifts
- [ ] Badge below title
- [ ] Links next to title (top-right)
- [ ] Responsive on all screen sizes
- [ ] No overlapping elements
- [ ] Proper spacing

---

## 🐛 Common Issues to Check

### Badge Issues
- ❌ Badge shows on non-Sepolia NFTs → Check `isSepolia()` logic
- ❌ Badge doesn't click → Check `explorerUrl` is not null
- ❌ Wrong page opens → Check URL generation in `getExplorerUrl()`
- ❌ Tooltip doesn't show → Check `title` attribute

### Explorer Link Issues
- ❌ Links don't appear → Check data is available (txHash, contractAddress, tokenId)
- ❌ Wrong page opens → Check URL generation for each type
- ❌ Icons too small on mobile → Check tap target size (min 40x40px)
- ❌ Hover effect doesn't work → Check CSS classes

### Layout Issues
- ❌ Elements overlap → Check responsive breakpoints
- ❌ Layout shifts → Check conditional rendering
- ❌ Badge too large → Check padding and font size

---

## 📱 Browser Testing

Test on:
- **Chrome/Edge**: Latest version
- **Firefox**: Latest version
- **Safari**: Latest version (Mac/iOS)
- **Mobile Chrome**: Android
- **Mobile Safari**: iOS

### What to Check:
- Badge displays correctly
- Links work
- Hover effects work (desktop)
- Tap works (mobile)
- No console errors
- Smooth animations

---

## 🔍 DevTools Inspection

### Check Console
- No errors related to explorer URLs
- No warnings about missing data
- No React warnings

### Check Network Tab
- External links open correctly
- New tabs open (not same tab)
- Correct Etherscan pages load

### Check Elements Tab
- Badge has proper ARIA attributes
- Links have `rel="noopener noreferrer"`
- Tooltips have `title` attributes
- Focus indicators visible

---

## 🎯 Success Criteria

✅ **Badge**:
- Only shows on Sepolia
- Clickable and opens explorer
- Tooltip works
- Accessible

✅ **Explorer Links**:
- All links work correctly
- Open in new tab
- Hide when data missing
- Hover effects work
- Mobile friendly

✅ **Overall**:
- No layout shifts
- No console errors
- Professional appearance
- Enhanced trust signals

---

## 🚀 Quick Verification

1. **Open NFT Detail** → Check badge appears
2. **Click Badge** → Opens Sepolia Etherscan
3. **Click Transaction Icon** → Opens transaction page
4. **Click Contract Icon** → Opens contract page
5. **Click Token Icon** → Opens token page
6. **Test on Mobile** → Resize browser, test taps
7. **Test Keyboard** → Tab to elements, press Enter

**All good?** ✅ Trust signals working perfectly!

---

## 📸 Screenshots to Take (Optional)

For documentation:
1. NFT Detail with badge and links
2. Badge hover state with tooltip
3. Explorer link hover state
4. Mobile view of badge and links
5. Sepolia Etherscan pages opened from links

---

## 🔗 Test URLs

### Sepolia Etherscan Examples
- Transaction: https://sepolia.etherscan.io/tx/0x...
- Contract: https://sepolia.etherscan.io/address/0x...
- Token: https://sepolia.etherscan.io/token/0x...?a=123

### Test with Real Data
Use your deployed NFT contract:
- Contract: `0xf29948652BCC1E9F26a9CE5ab91D7C1ac2c3dB97`
- Check any minted NFT's transaction hash
- Verify links open correct pages

---

## ✨ Final Check

Before marking complete:
- [ ] Badge only on Sepolia ✅
- [ ] Badge clickable ✅
- [ ] All explorer links work ✅
- [ ] Links hide when data missing ✅
- [ ] Mobile responsive ✅
- [ ] Keyboard accessible ✅
- [ ] Screen reader friendly ✅
- [ ] No console errors ✅
- [ ] Build passes ✅

**Ready to ship!** 🚀
