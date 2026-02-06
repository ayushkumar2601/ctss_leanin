# Frontend Polish - Testing Guide

## 🧪 How to Test the New Features

### 3️⃣ Wallet Address Enhancements

#### Test 1: ENS Resolution
**Goal**: Verify ENS names display when available

1. Connect a wallet with a known ENS name (e.g., vitalik.eth: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045)
2. Check these locations:
   - Navbar wallet button
   - Navbar dropdown
   - Dashboard header
   - NFT Detail page (if you own an NFT)

**Expected**:
- ENS name displays instead of shortened address
- If no ENS, shows shortened address (0xABCD...1234)
- No errors in console

**Note**: ENS lookup uses mainnet, so Sepolia addresses won't have ENS names. This is expected behavior.

---

#### Test 2: Copy to Clipboard (Desktop)
**Goal**: Verify copy functionality works

1. Navigate to any page with wallet address display
2. **Hover** over the wallet address
   - **Expected**: Tooltip shows "Click to copy"
3. **Click** on the wallet address
   - **Expected**: 
     - Address copied to clipboard
     - Icon changes from Copy to Check (green)
     - Tooltip shows "Copied!"
4. **Paste** somewhere (Ctrl+V or Cmd+V)
   - **Expected**: Full wallet address (0x...) is pasted
5. Wait 2 seconds
   - **Expected**: Icon reverts back to Copy icon

**Test Locations**:
- ✅ Navbar wallet button
- ✅ Navbar dropdown (full address)
- ✅ Dashboard header (2 locations)
- ✅ NFT Detail owner section

---

#### Test 3: Copy to Clipboard (Mobile)
**Goal**: Verify tap to copy works on mobile

1. Open app on mobile device or resize browser to mobile width
2. Connect wallet
3. **Tap** on wallet address in Navbar
4. **Tap** on the copy icon
   - **Expected**: Address copied, icon changes to checkmark
5. Paste in notes app
   - **Expected**: Full address pasted

---

#### Test 4: Keyboard Accessibility
**Goal**: Verify keyboard navigation works

1. Connect wallet
2. Press **Tab** repeatedly until wallet address is focused
   - **Expected**: Focus indicator visible
3. Press **Enter** or **Space**
   - **Expected**: Address copied to clipboard
4. Check clipboard
   - **Expected**: Full address copied

---

### 4️⃣ Persistent User Preferences

#### Test 5: Last Page Restoration
**Goal**: Verify last visited page is restored on reload

**Scenario A: Explore Page**
1. Navigate to `/explore`
2. Browse some NFTs
3. **Reload the page** (F5 or Ctrl+R)
   - **Expected**: Returns to `/explore` page

**Scenario B: Mint Page**
1. Navigate to `/mint`
2. **Reload the page**
   - **Expected**: Returns to `/mint` page

**Scenario C: Dashboard Page**
1. Navigate to `/dashboard`
2. **Reload the page**
   - **Expected**: Returns to `/dashboard` page

**Scenario D: NFT Detail Page**
1. Navigate to any NFT detail page (`/nft/:id`)
2. **Reload the page**
   - **Expected**: Stays on landing page (detail pages are not persisted)

**Scenario E: First Visit**
1. Clear localStorage: `localStorage.clear()`
2. Reload page
   - **Expected**: Stays on landing page (no preference stored)

---

#### Test 6: localStorage Verification
**Goal**: Verify data is stored correctly

1. Open browser DevTools (F12)
2. Go to **Application** tab → **Local Storage**
3. Navigate to `/explore`
4. Check localStorage
   - **Expected**: Key `voxrt_last_page` = `"/explore"`
5. Navigate to `/mint`
6. Check localStorage again
   - **Expected**: Key `voxrt_last_page` = `"/mint"`

---

## ✅ Visual Checklist

### Wallet Address Display
- [ ] ENS names display correctly (if available)
- [ ] Shortened addresses display when no ENS
- [ ] Copy icon appears next to addresses
- [ ] Hover tooltip shows "Click to copy"
- [ ] Click copies full address
- [ ] Icon changes to checkmark after copy
- [ ] "Copied!" tooltip appears
- [ ] Icon reverts after 2 seconds
- [ ] Works on mobile (tap to copy)
- [ ] Keyboard accessible (Tab + Enter/Space)

### Page Persistence
- [ ] Explore page persists on reload
- [ ] Mint page persists on reload
- [ ] Dashboard page persists on reload
- [ ] Detail pages don't persist (correct)
- [ ] Landing page is default (correct)
- [ ] localStorage key is set correctly

### Accessibility
- [ ] Screen reader announces addresses
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present

### Mobile
- [ ] Addresses display correctly
- [ ] Tap to copy works
- [ ] No layout breaks
- [ ] Tooltips work or degrade gracefully

---

## 🐛 Common Issues to Check

### ENS Lookup
- ❌ "Cannot read property of undefined" → Check address is not null before passing to useENS
- ❌ ENS not showing → Check if address actually has ENS on mainnet (Sepolia addresses won't)
- ❌ Slow loading → Normal, ENS lookup takes 1-2 seconds on first load

### Copy to Clipboard
- ❌ Copy doesn't work → Check browser permissions for clipboard access
- ❌ Icon doesn't change → Check state management in WalletAddress component
- ❌ Tooltip doesn't show → Check title attribute is set

### Page Persistence
- ❌ Page doesn't restore → Check localStorage is enabled in browser
- ❌ Wrong page restored → Check PERSISTABLE_PAGES array in useLastVisitedPage
- ❌ Restores on every navigation → Should only restore from landing page

---

## 📱 Browser Testing

Test on these browsers:
- **Chrome/Edge**: Latest version
- **Firefox**: Latest version
- **Safari**: Latest version (Mac/iOS)
- **Mobile Chrome**: Android
- **Mobile Safari**: iOS

### What to Check:
- Copy to clipboard works
- ENS resolution works
- localStorage persists
- No console errors
- Smooth animations

---

## 🔍 DevTools Inspection

### Check Console
- No errors related to ENS lookup
- No errors related to localStorage
- No warnings about missing dependencies

### Check Network Tab
- ENS lookups go to Infura mainnet
- Requests are cached (no duplicate lookups)

### Check Application Tab
- localStorage key `voxrt_last_page` exists
- Value is one of: `/explore`, `/mint`, `/dashboard`

---

## 🎯 Success Criteria

✅ **Wallet Addresses**:
- ENS names display when available
- Copy works everywhere (desktop + mobile)
- Tooltips appear on hover
- Keyboard accessible
- No console errors

✅ **Page Persistence**:
- Last visited page restores on reload
- Only main pages persist (not detail pages)
- Works across browser sessions
- No errors or crashes

✅ **Overall**:
- Professional, polished feel
- Smooth interactions
- No breaking changes
- Accessible to all users

---

## 🚀 Quick Test Flow

1. **Connect Wallet** → Check address displays correctly
2. **Copy Address** → Click and verify clipboard
3. **Navigate to Explore** → Reload → Should return to Explore
4. **Navigate to Mint** → Reload → Should return to Mint
5. **Navigate to Dashboard** → Reload → Should return to Dashboard
6. **Click on NFT** → Reload → Should go to Landing (correct)
7. **Test on Mobile** → Resize browser, test tap to copy
8. **Test Keyboard** → Tab to address, press Enter to copy

**All good?** ✅ Ship it!
