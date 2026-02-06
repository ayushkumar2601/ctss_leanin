# CTsync Upload Evidence Form - Visual Reference

## 📋 Form Layout

```
┌─────────────────────────────────────────────────────────────┐
│                    UPLOAD EVIDENCE                          │
│  Document real-world issues for public accountability       │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────┐  ┌──────────────────────────────────┐
│                      │  │  ISSUE TITLE                     │
│                      │  │  ┌────────────────────────────┐  │
│   [EVIDENCE PHOTO]   │  │  │ e.g. POTHOLE_MAIN_ST       │  │
│                      │  │  └────────────────────────────┘  │
│   Drag & Drop        │  │                                  │
│   Evidence Photo     │  │  LOCATION                        │
│                      │  │  ┌────────────────────────────┐  │
│   PNG, JPG, GIF      │  │  │ e.g. MAIN ST & 5TH AVE...  │  │
│   (MAX 100MB)        │  │  └────────────────────────────┘  │
│                      │  │                                  │
└──────────────────────┘  │  ISSUE DESCRIPTION               │
                          │  ┌────────────────────────────┐  │
                          │  │ DESCRIBE THE ISSUE IN...   │  │
                          │  │                            │  │
                          │  │                            │  │
                          │  └────────────────────────────┘  │
                          │                                  │
                          │  URGENCY LEVEL  [GET AI ASSESS]  │
                          │                                  │
                          │  ┌──────────────────────────┐    │
                          │  │ AI ASSESSMENT: High      │    │
                          │  │ urgency based on...      │    │
                          │  └──────────────────────────┘    │
                          │                                  │
                          │  ┌──────┐ ┌──────┐ ┌──────┐    │
                          │  │ LOW  │ │MEDIUM│ │ HIGH │    │
                          │  └──────┘ └──────┘ └──────┘    │
                          │                                  │
                          │  ┌────────────────────────────┐  │
                          │  │   UPLOAD EVIDENCE    ⚡    │  │
                          │  └────────────────────────────┘  │
                          └──────────────────────────────────┘
```

---

## 🎨 Field Details

### 1. Issue Title
```
Label: ISSUE TITLE
Type: Text input
Placeholder: e.g. POTHOLE_MAIN_ST
Required: Yes
Style: Uppercase, monospace font
Border: Cyan on focus
```

### 2. Location (NEW)
```
Label: LOCATION
Type: Text input
Placeholder: e.g. MAIN ST & 5TH AVE, WARD 3
Required: No (optional)
Style: Uppercase, monospace font
Border: Cyan on focus
```

### 3. Issue Description
```
Label: ISSUE DESCRIPTION
Type: Textarea (4 rows)
Placeholder: DESCRIBE THE ISSUE IN DETAIL...
Required: No
Style: Uppercase, monospace font
Border: Cyan on focus
```

### 4. Urgency Level (NEW)
```
Label: URGENCY LEVEL
Type: Button group (Low/Medium/High)
Default: Medium
AI Assisted: Yes
Button: GET AI ASSESSMENT

Colors:
- Low: Yellow background, black text
- Medium: Orange background, white text
- High: Red background, white text
- Inactive: Dark gray
```

### 5. AI Assessment Display (NEW)
```
Appears when: User clicks "GET AI ASSESSMENT"
Style: Cyan background (10% opacity)
Border: Cyan (30% opacity)
Text: Cyan, monospace
Animation: Slide in from top

Example:
┌────────────────────────────────────────┐
│ AI ASSESSMENT: High urgency based on   │
│ critical infrastructure damage         │
└────────────────────────────────────────┘
```

---

## 🔘 Button States

### GET AI ASSESSMENT Button

**Idle State:**
```
┌──────────────────────┐
│ ⚡ GET AI ASSESSMENT │
└──────────────────────┘
Color: Cyan text
Hover: Lighter cyan
```

**Loading State:**
```
┌──────────────────────┐
│ ✨ AI ANALYZING...   │
└──────────────────────┘
Color: Cyan text
Icon: Spinning sparkles
Disabled: Yes
```

**Disabled State:**
```
┌──────────────────────┐
│ ⚡ GET AI ASSESSMENT │
└──────────────────────┘
Color: Gray text (50% opacity)
Cursor: Not allowed
Condition: Title is empty
```

---

### Urgency Level Buttons

**Low (Selected):**
```
┌──────────┐
│   LOW    │
└──────────┘
Background: Yellow (#eab308)
Text: Black
Border: 2px yellow
```

**Medium (Selected):**
```
┌──────────┐
│  MEDIUM  │
└──────────┘
Background: Orange (#f97316)
Text: White
Border: 2px orange
```

**High (Selected):**
```
┌──────────┐
│   HIGH   │
└──────────┘
Background: Red (#ef4444)
Text: White
Border: 2px red
```

**Inactive:**
```
┌──────────┐
│   LOW    │
└──────────┘
Background: Dark gray (#18181b)
Text: Gray (#71717a)
Border: 2px dark gray
Hover: Lighter border
```

---

### Upload Evidence Button

**Idle State:**
```
┌────────────────────────────────┐
│   UPLOAD EVIDENCE    ⚡        │
└────────────────────────────────┘
Background: White
Text: Black
Hover: Cyan background, scale up
```

**Uploading State:**
```
┌────────────────────────────────┐
│   UPLOADING...                 │
└────────────────────────────────┘
Background: Dark gray
Text: Gray
Disabled: Yes
```

**Disabled State:**
```
┌────────────────────────────────┐
│   UPLOAD EVIDENCE    ⚡        │
└────────────────────────────────┘
Background: White (50% opacity)
Text: Gray
Cursor: Not allowed
Conditions:
- No image uploaded
- No title entered
- Wallet not connected
- Wrong network
```

---

## 📊 Form Validation

### Required Fields
- ✅ Evidence Photo (image file)
- ✅ Issue Title (text)

### Optional Fields
- ⭕ Location (text)
- ⭕ Issue Description (text)
- ⭕ Urgency Level (defaults to Medium)

### Validation Rules
```typescript
const isValid = 
  file !== null &&           // Image uploaded
  title.trim() !== '' &&     // Title not empty
  walletAddress !== null &&  // Wallet connected
  chainId === 11155111;      // Correct network (Sepolia)
```

---

## 🎯 User Flow

### Standard Flow
1. User uploads evidence photo
2. User enters issue title
3. User enters location (optional)
4. User enters description (optional)
5. User clicks "GET AI ASSESSMENT"
6. AI suggests urgency level
7. User can override if needed
8. User clicks "UPLOAD EVIDENCE"
9. Success screen shows Evidence ID

### Quick Flow (No AI)
1. User uploads evidence photo
2. User enters issue title
3. User manually selects urgency
4. User clicks "UPLOAD EVIDENCE"
5. Success screen shows Evidence ID

---

## 🔄 AI Assessment Flow

```
User clicks "GET AI ASSESSMENT"
         ↓
Button shows "AI ANALYZING..."
         ↓
AI analyzes title + description
         ↓
AI returns:
- Urgency suggestion (Low/Medium/High)
- Confidence score (0-100)
- Assessment text
         ↓
UI updates:
- Shows AI assessment box
- Auto-selects urgency button
- Displays confidence score (if HUD available)
         ↓
User can override by clicking different urgency
```

---

## 💾 Data Saved to Blockchain

### Metadata JSON
```json
{
  "name": "POTHOLE_MAIN_ST",
  "description": "Large pothole causing traffic hazard",
  "image": "ipfs://Qm...",
  "attributes": [
    {
      "trait_type": "Location",
      "value": "Main St & 5th Ave, Ward 3"
    },
    {
      "trait_type": "Urgency",
      "value": "High"
    },
    {
      "trait_type": "AI Confidence",
      "value": "85"
    },
    {
      "trait_type": "Category",
      "value": "Infrastructure"
    },
    {
      "trait_type": "Status",
      "value": "Open"
    },
    {
      "trait_type": "Submitted By",
      "value": "0x742d35Cc..."
    },
    {
      "trait_type": "Timestamp",
      "value": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 💾 Data Saved to Database

### Issues Table Insert
```sql
INSERT INTO issues (
  evidence_id,        -- Token ID from blockchain
  title,              -- "POTHOLE_MAIN_ST"
  description,        -- "Large pothole causing..."
  location,           -- "Main St & 5th Ave, Ward 3"
  urgency,            -- "High"
  category,           -- "Infrastructure"
  status,             -- "Open"
  ai_confidence,      -- 85
  image_url,          -- "ipfs://Qm..."
  metadata_uri,       -- "ipfs://Qm..."
  submitted_by,       -- "0x742d35cc..."
  submitted_at        -- NOW()
)
```

---

## 🎨 Color Reference

### Urgency Colors
```css
Low:    #eab308 (Yellow)
Medium: #f97316 (Orange)
High:   #ef4444 (Red)
```

### UI Colors
```css
Primary:    #06b6d4 (Cyan)
Secondary:  #14b8a6 (Teal)
Background: #18181b (Zinc 900)
Border:     #27272a (Zinc 800)
Text:       #ffffff (White)
Muted:      #71717a (Zinc 500)
```

---

## 📱 Responsive Behavior

### Desktop (>768px)
- Two-column layout
- Image upload on left
- Form fields on right
- Full-width buttons

### Mobile (<768px)
- Single-column layout
- Image upload on top
- Form fields below
- Full-width buttons
- Stacked urgency buttons

---

## ✅ Accessibility

- All inputs have labels
- Placeholder text is descriptive
- Buttons have clear text
- Color contrast meets WCAG AA
- Keyboard navigation supported
- Focus states visible (cyan border)
- Error messages are clear

---

**Last Updated:** 2024  
**Component:** pages/Mint.tsx  
**Status:** ✅ Complete
