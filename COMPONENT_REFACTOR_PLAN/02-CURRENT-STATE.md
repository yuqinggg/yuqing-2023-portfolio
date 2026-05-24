# Current State: What Gets Duplicated

## Duplication Across All Pages (8/8 files)

| Content | Appears In | Lines | Frequency |
|---------|-----------|-------|-----------|
| Navigation bar | 8/8 pages | 50+ | Identical on 7 pages |
| Page preloader | 8/8 pages | 5 | Identical |
| CSS/Font loading | 8/8 pages | 20+ | Identical |
| Script loading | 8/8 pages | 30+ | Identical |
| Footer | 7/8 pages | 30 | Identical |

### Total Wasted Code
- **165+ lines × 8 files = 1,320+ lines of duplication**

## Duplication on Project Pages (4/8 files)

| Content | Pages | Lines | Count |
|---------|-------|-------|-------|
| Project header (title/subtitle) | 4 | 80+ | 4 copies |
| Metadata grid (role/duration, etc.) | 4 | 60+ | 4 copies |
| Gallery JavaScript logic | Multiple | 100+ | 3 different implementations |

## Breakdown by Page

### index.html (Portfolio Homepage)
- Navigation ✓
- Preloader ✓
- CSS/Font loading ✓
- Script loading ✓
- Footer ✓
- **Total duplicated: 135+ lines**

### about.html (About/Resume)
- Navigation ✓
- Preloader ✓
- CSS/Font loading ✓
- Script loading ✓
- Footer ✓
- **Total duplicated: 135+ lines**

### pps-voucher.html (Project Page)
- Navigation ✓
- Preloader ✓
- CSS/Font loading ✓
- Script loading ✓
- Footer ✓
- Project header ✓
- Metadata grid ✓
- Gallery code ✓
- **Total duplicated: 300+ lines**

### miles-redemption.html (Project Page)
- Navigation ✓
- Preloader ✓
- CSS/Font loading ✓
- Script loading ✓
- Footer ✓
- Project header ✓
- Metadata grid ✓
- Gallery code ✓
- **Total duplicated: 300+ lines**

### international-delivery.html (Project Page)
- Navigation ✓
- Preloader ✓
- CSS/Font loading ✓
- Script loading ✓
- Footer ✓
- Project header ✓
- Metadata grid ✓
- Gallery code ✓
- **Total duplicated: 300+ lines**

### interlogue.html (Project Page)
- Navigation ✓
- Preloader ✓
- CSS/Font loading ✓
- Script loading ✓
- Footer ✓
- Project header ✓
- Metadata grid ✓
- Gallery code ✓
- **Total duplicated: 300+ lines**

### project-101.html (Placeholder)
- Navigation ✓
- Preloader ✓
- CSS/Font loading ✓
- Script loading ✓
- Footer ✓
- **Total duplicated: 135+ lines**

### krisshop-australia.html (Empty)
- Navigation ✓
- Preloader ✓
- CSS/Font loading ✓
- Script loading ✓
- **Total duplicated: 105+ lines** (no footer)

## What's Repeated Across All 8 Pages

### 1. Navigation Bar (50+ lines)
Location: Same HTML in every file
```html
<nav class="navbar navbar-dark navbar-expand-sm fixed-top">
  <div class="container">
    <a class="navbar-brand" href="/index.html">Tay Yu Qing</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
        <a class="nav-link" href="/index.html">Work</a>
        <a class="nav-link" href="/about.html">About</a>
      </div>
    </div>
  </div>
</nav>
```

**Can be replaced with:** One TypeScript function that generates this HTML

### 2. Preloader (5 lines)
Location: Same div in every file
```html
<div id="preloader">
  <div id="loader"></div>
</div>
```

**Can be replaced with:** One-line function call

### 3. CSS/Font Loading (20+ lines)
Location: In `<head>` of every file
```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/..." rel="preload">

<!-- Line Awesome Icons -->
<link rel="preload" href="..." as="style" onload="this.onload=null;this.rel='stylesheet'">

<!-- Custom CSS -->
<link rel="preload" href="/css/tokens.css" as="style" onload="...">
```

**Can be replaced with:** Component that injects these into the head

### 4. Script Loading (30+ lines)
Location: At bottom of `<body>` in every file
```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/jquery-easing@1.4.1/jquery.easing.min.js" defer></script>
<script src="https://unpkg.com/isotope-layout@3/dist/isotope.pkgd.min.js" defer></script>
<script src="/js/custom.js" defer></script>
```

**Can be replaced with:** Component that injects these

### 5. Footer (30 lines)
Location: Same HTML in 7 files
```html
<footer class="space-md bg-light">
  <div class="container">
    <p class="text-center text-muted">© 2026 tayyuqing.com</p>
  </div>
</footer>
```

**Can be replaced with:** One TypeScript function

## What's Repeated on Project Pages Only

### 1. Project Header (80+ lines, 4 copies)
Location: `pps-voucher.html`, `miles-redemption.html`, `international-delivery.html`, `interlogue.html`

**Example:**
```html
<section class="space-md">
  <div class="container">
    <div class="row">
      <div class="col-md-5">
        <h1 class="headline-title">Voucher Redemptions</h1>
        <p class="headline-subtitle">PPS Platform</p>
        <p class="lead">Built a system for users to redeem vouchers...</p>
      </div>
    </div>
  </div>
</section>
```

**Can be replaced with:** `createProjectHeader({title, subtitle, description})`

### 2. Metadata Grid (60+ lines, 4 copies)
Location: Same structure in all project pages

**Example structure:**
```html
<section class="space-md bg-light">
  <div class="container">
    <div class="row">
      <!-- Column 1: My Role -->
      <div class="col-md-4">
        <h5>My Role</h5>
        <ul class="unstyled-list">
          <li>Full Stack Developer</li>
        </ul>
      </div>
      <!-- Column 2: Duration -->
      <div class="col-md-4">
        <h5>Duration</h5>
        <ul class="unstyled-list">
          <li>6 months</li>
        </ul>
      </div>
      <!-- Column 3: More Info -->
      <div class="col-md-4">
        <h5>Project Type</h5>
        <ul class="unstyled-list">
          <li>Web Application</li>
        </ul>
      </div>
    </div>
  </div>
</section>
```

**Can be replaced with:** `createMetadataGrid({role, duration, type, skills, outcome})`

### 3. Gallery Systems (3 different implementations, 100+ lines total)
Location: In `js/custom.js` and scattered across project pages

Currently there are 3 separate gallery systems:
1. **Gallery with prev/next buttons** (pps-voucher)
2. **Gallery with page dots navigation** (miles-redemption)
3. **Auto-rotating gallery** (interlogue - rotates every 3 seconds)

**Can be replaced with:** One `Gallery` component with configuration options

---

## Technology Stack

### Current
- HTML5
- CSS3 (with CSS custom properties)
- Vanilla JavaScript (no TypeScript)
- jQuery (for DOM manipulation)
- Bootstrap 4 (for grid/layout)

### Strong Foundation
- Design tokens already exist in `css/tokens.css`
- CSS custom properties defined (colors, typography, spacing, motion)
- Responsive design patterns in place
- Build tools already set up (package.json exists)

---

## Key Metrics

- **Total Lines in HTML Files:** 2,000+ (highly repetitive)
- **Total Lines in custom.js:** 380 lines
- **CSS Custom Properties:** 40+ tokens
- **Active Project Pages:** 4
- **Gallery Systems:** 3 distinct implementations
- **Directories:** 9 project-specific image directories

---

**Next:** Read [03-APPROACH.md](03-APPROACH.md) to learn the strategy
