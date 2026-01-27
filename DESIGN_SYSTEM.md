# BIO BEATS Design System

## Brand Identity

**Platform:** Management & Booking for Electronic Music Culture  
**Aesthetic:** Dark, minimal, premium, tech-forward

---

## Colors

### Primary Palette

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Accent (Red)** | `#ff0700` | 255, 7, 0 | CTAs, highlights, logo |
| **Accent Hover** | `#cc0600` | 204, 6, 0 | Button hover states |
| **Black** | `#0a0a0a` | 10, 10, 10 | Page background |
| **White** | `#fafafa` | 250, 250, 250 | Primary text, headings |

### Gray Scale

| Name | Hex | Usage |
|------|-----|-------|
| Gray 50 | `#fafafa` | Primary text |
| Gray 100 | `#f5f5f5` | — |
| Gray 200 | `#e5e5e5` | — |
| Gray 300 | `#d4d4d4` | Secondary headings |
| Gray 400 | `#a3a3a3` | Body text, descriptions |
| Gray 500 | `#737373` | Muted text, placeholders |
| Gray 600 | `#525252` | — |
| Gray 700 | `#404040` | Borders (hover) |
| Gray 800 | `#262626` | Borders, input backgrounds |
| Gray 900 | `#171717` | Card backgrounds |

---

## Typography

### Font Family

```
Primary: Inter
Fallback: system-ui, -apple-system, sans-serif
```

**Google Fonts URL:**  
`https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`

### Font Weights

| Weight | Name | Usage |
|--------|------|-------|
| 400 | Regular | Body text |
| 500 | Medium | Buttons, labels |
| 600 | Semibold | Subheadings, card titles |
| 700 | Bold | Page headings |

### Font Sizes (Desktop)

| Element | Size | Line Height |
|---------|------|-------------|
| H1 | 48-60px | 1.2 |
| H2 | 36-40px | 1.2 |
| H3 | 24-30px | 1.2 |
| H4 | 20-24px | 1.3 |
| Body | 16px | 1.6 |
| Small | 14px | 1.5 |
| XSmall | 12px | 1.5 |

---

## Spacing

**Base Unit:** 4px

| Name | Value | Usage |
|------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Icon gaps |
| md | 16px | Element padding |
| lg | 24px | Card padding |
| xl | 32px | Section gaps |
| 2xl | 48px | Large gaps |
| 3xl | 64px | Section padding |
| 4xl | 96px | Hero padding |

---

## Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 8px |
| Cards | 12px |
| Badges | 9999px (pill) |
| Inputs | 8px |
| Images (avatars) | 8px or 50% |

---

## Shadows

Minimal shadows – rely on borders instead.

```css
/* Subtle shadow for elevated elements */
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
```

---

## Components

### Buttons

#### Primary Button
- Background: `#ff0700`
- Text: `#ffffff`
- Padding: 12px 24px
- Border Radius: 8px
- Font Weight: 500
- Hover: `#cc0600`

#### Secondary Button
- Background: `#262626`
- Border: 1px solid `#404040`
- Text: `#fafafa`
- Padding: 12px 24px
- Hover: `#404040` background

#### Ghost Button
- Background: transparent
- Text: `#a3a3a3`
- Hover: `#262626` background, `#fafafa` text

### Cards

- Background: `#171717`
- Border: 1px solid `#262626`
- Border Radius: 12px
- Padding: 24px
- Hover Border: `#404040`

### Inputs

- Background: `#262626`
- Border: 1px solid `#404040`
- Border Radius: 8px
- Padding: 12px 16px
- Text: `#fafafa`
- Placeholder: `#737373`
- Focus Border: `#ff0700`

### Badges

- Background: `#262626`
- Text: `#a3a3a3`
- Padding: 4px 12px
- Border Radius: 9999px
- Font Size: 14px

#### Accent Badge
- Background: `rgba(255, 7, 0, 0.2)`
- Text: `#ff0700`

---

## Layout

### Container Widths

| Name | Max Width |
|------|-----------|
| Narrow | 1024px (64rem) |
| Wide | 1280px (80rem) |

### Grid

- Columns: 12
- Gap: 24px (desktop), 16px (mobile)

### Breakpoints

| Name | Width |
|------|-------|
| Mobile | < 640px |
| Tablet | 640px - 1024px |
| Desktop | > 1024px |

---

## Icons

**Library:** Lucide React  
**Size:** 16px (small), 20px (default), 24px (large)  
**Stroke Width:** 2px

Common icons used:
- ArrowRight, ArrowLeft
- MapPin, Calendar, Users
- Music, Disc3, Sparkles
- Search, Filter, X
- ChevronDown, ChevronUp
- Mail, Phone, Globe
- Instagram, ExternalLink

---

## Logo

**File:** `/public/logo.svg`  
**Color:** `#ff0700`  
**Size in Header:** 32x32px  
**Clear Space:** Minimum 8px around logo

---

## Animation

### Transitions

```css
/* Default transition */
transition: all 0.2s ease;

/* Hover scale */
transform: scale(1.05);
transition: transform 0.5s ease;
```

### Keyframes

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Fade Up */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## Page Templates

### Standard Page Layout

```
┌─────────────────────────────────────┐
│           HEADER (fixed)            │
├─────────────────────────────────────┤
│                                     │
│     HERO SECTION (py-16 to py-20)   │
│     - Gradient background           │
│     - H1 + description              │
│                                     │
├─────────────────────────────────────┤
│                                     │
│     CONTENT SECTIONS (py-16)        │
│     - Alternating bg colors         │
│                                     │
├─────────────────────────────────────┤
│           FOOTER                    │
└─────────────────────────────────────┘
```

---

## Assets Checklist

- [ ] Logo SVG (red)
- [ ] OG Image (1200x630)
- [ ] Favicon SVG
- [ ] Artist photos (square, 1:1)
- [ ] Festival photos (16:9)
- [ ] Hero background (if needed)

---

## File Structure for Design

```
/public
  /artists        → Artist profile images
  /festivals      → Festival hero images
  logo.svg        → Brand logo
  og-image.png    → Social sharing image
  favicon.svg     → Browser favicon
```
