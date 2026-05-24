# Implementation Plan: Convert Hardcoded Portfolio Components to TypeScript

## Context

**The Problem:** Your portfolio site currently has massive code duplication. The same HTML code appears in all 8 pages multiple times:
- The navigation bar (50+ lines)
- The page header/title section (80+ lines on project pages)
- The footer (30+ lines)
- The preloader (loading spinner)
- CSS and script loading instructions
- Metadata sections on project pages

This means any change to the navigation (like adding a new link) requires updating 8 separate HTML files.

**The Goal:** Convert repeated patterns into reusable TypeScript components that are generated dynamically. Instead of copy-pasting HTML, each page will simply call a component function like `createNavigation()` or `createFooter()`. This makes maintenance easier and reduces file sizes.

**Why TypeScript:** TypeScript adds type safety and better IDE support. Instead of guessing what data a component needs, TypeScript tells you exactly what properties are required (e.g., "this header needs a title, subtitle, and description").

---

## Current Duplication Analysis

### What Gets Repeated Across All Pages:
| Content | Appears In | Lines | Frequency |
|---------|-----------|-------|-----------|
| Navigation bar | 8/8 pages | 50+ | Identical on 7 pages, slight variation on 1 |
| Page preloader | 8/8 pages | 5 | Identical |
| CSS/Font loading | 8/8 pages | 20+ | Identical |
| Script loading | 8/8 pages | 30+ | Identical |
| Footer | 7/8 pages | 30 | Identical |
| **Total wasted code** | - | **165+ lines × 8** | **1,320+ lines of duplication** |

### What Gets Repeated on Project Pages Only:
| Content | Pages | Lines | Count |
|---------|-------|-------|-------|
| Project header (title/subtitle) | 4/8 | 80+ | 4 copies |
| Metadata grid (role, duration, etc.) | 4/8 | 60+ | 4 copies |
| Gallery JavaScript logic | Multiple | 100+ | 3 different implementations |

---

## High-Level Approach

### Phase 1: Set Up Build System (Foundation)
Create a system that takes TypeScript files and converts them to HTML that can be served.

**Why this first:** Currently you can't run TypeScript in a browser—we need a build system to convert TypeScript → JavaScript. This is like setting up a factory before manufacturing.

**What will be created:**
- `index.ts` - Main entry point
- `components/` - Folder for all reusable components
- `build.js` - Simple script to convert TypeScript to usable code
- Updated `package.json` - Add build commands

### Phase 2: Extract Components to TypeScript (The Core Work)
Create reusable TypeScript components for all repeated content.

**Components to Create:**
1. **`Navigation.ts`** - Creates the navbar
2. **`Footer.ts`** - Creates the footer
3. **`Preloader.ts`** - Creates the loading spinner
4. **`ProjectHeader.ts`** - Creates project title/subtitle/description
5. **`MetadataGrid.ts`** - Creates the role/duration/skills section
6. **`PageLayout.ts`** - The "wrapper" that includes navigation, preloader, and footer
7. **`Gallery.ts`** - Combines all 3 gallery systems into one reusable component

### Phase 3: Convert Pages to Use Components
Update each HTML file to use the new TypeScript components instead of hardcoded HTML.

**What this means:** Each HTML file becomes much smaller. Instead of 400+ lines of HTML, it becomes 50-100 lines that call component functions.

**Example transformation:**
```html
<!-- BEFORE: Navigation takes 50 lines -->
<nav class="navbar navbar-dark navbar-expand-sm fixed-top">
  <div class="container">
    <a class="navbar-brand" href="/index.html">Tay Yu Qing</a>
    <!-- ... 40 more lines of navbar HTML ... -->
  </div>
</nav>

<!-- AFTER: Navigation in one line -->
<script>createNavigation();</script>
```

### Phase 4: Migrate Data from Hardcoded to Config Files
Move hardcoded data (project titles, metadata, gallery images) into JSON files for easy updates.

**What will be created:**
- `config/projects.json` - All project metadata
- `config/navigation.json` - Navigation structure
- Components will read these files instead of having data hardcoded

### Phase 5: Testing & Validation
Ensure all pages still look and work identically to before.

---

## Detailed Implementation Steps

### Step 1: Understand Current Structure (Already Done ✓)
*Status:* We've mapped all HTML files, CSS, and JavaScript patterns.

---

### Step 2: Set Up TypeScript and Build Tools
**What to do:**
- Install TypeScript compiler: `npm install --save-dev typescript`
- Create `tsconfig.json` - Tells TypeScript how to convert code
- Create `src/` folder for all TypeScript files
- Create `dist/` folder for generated HTML/JavaScript files

**Expected outcome:** Can run `npm run build` and get compiled output.

---

### Step 3: Create Component Foundation (Most Important)
**What to do:**
- Create `src/components/` folder
- Create a base component file: `src/components/BaseComponent.ts`
  - This is a template that all components inherit from
  - Handles common tasks like rendering, adding event listeners
  - Similar to a "blueprint" for all components

**Expected outcome:** A reusable framework for all future components.

---

### Step 4: Create Navigation Component
**What to do:**
- Create `src/components/Navigation.ts`
- Takes input: `{ links: Array<{name: string, href: string}> }`
- Outputs: HTML string of the navbar
- Replaces 50 lines of hardcoded HTML in each file

**Testing:** Run the component, verify navbar looks identical on all pages.

---

### Step 5: Create Footer Component
**What to do:**
- Create `src/components/Footer.ts`
- Takes input: `{ year: number, siteName: string }`
- Outputs: Footer HTML
- Replaces 30 lines in 7 files

**Testing:** Verify footer appears identical on all pages.

---

### Step 6: Create Preloader Component
**What to do:**
- Create `src/components/Preloader.ts`
- Takes input: None (it's always the same)
- Outputs: Preloader HTML
- Replaces 5 lines in 8 files

**Testing:** Verify loading spinner appears and disappears correctly.

---

### Step 7: Create Project Header Component (for Project Pages)
**What to do:**
- Create `src/components/ProjectHeader.ts`
- Takes input: `{ title: string, subtitle: string, description: string }`
- Outputs: Header HTML section
- Replaces 80 lines in 4 project pages

**Example usage:**
```typescript
const header = createProjectHeader({
  title: "Voucher Redemptions",
  subtitle: "PPS Platform",
  description: "Built a system for users to redeem vouchers..."
});
```

**Testing:** Verify headers look identical on all project pages.

---

### Step 8: Create Metadata Grid Component (for Project Pages)
**What to do:**
- Create `src/components/MetadataGrid.ts`
- Takes input: `{ role: string, duration: string, type: string, skills: string[], outcome: string }`
- Outputs: Grid HTML with project information
- Replaces 60 lines in 4 project pages

**Example usage:**
```typescript
const metadata = createMetadataGrid({
  role: "Full Stack Developer",
  duration: "6 months",
  type: "Web App",
  skills: ["React", "Node.js", "PostgreSQL"],
  outcome: "Shipped to production"
});
```

---

### Step 9: Create Gallery Component (Consolidates 3 Systems)
**What to do:**
- Create `src/components/Gallery.ts`
- Consolidates the 3 different gallery implementations into ONE reusable component
- Takes input: `{ images: string[], type: 'carousel' | 'grid' | 'fullscreen', autoplay?: boolean }`
- Replaces 100+ lines scattered across custom.js and HTML files

**Currently there are 3 separate gallery systems:**
1. Gallery with prev/next buttons
2. Gallery with page dots
3. Auto-rotating gallery (3-second rotation)

**After refactoring:** One `Gallery` component handles all 3 via configuration.

---

### Step 10: Create PageLayout Component
**What to do:**
- Create `src/components/PageLayout.ts`
- This is a "wrapper" component that includes navigation, preloader, and footer
- Takes input: `{ content: string, pageType: 'home' | 'about' | 'project' }`
- Outputs: Complete page HTML with all standard sections

**Benefits:**
- Ensures every page has the same structure
- Makes it easy to add global features (e.g., a cookie banner) that appears everywhere
- Any change to page structure updates all pages automatically

---

### Step 11: Create Data Configuration Files
**What to do:**
- Create `src/config/projects.json` - All project metadata
- Create `src/config/navigation.json` - Navigation structure
- Create `src/config/galleries.json` - Gallery image paths

**Example `projects.json`:**
```json
{
  "projects": [
    {
      "id": "pps-voucher",
      "title": "Voucher Redemptions",
      "subtitle": "PPS Platform",
      "description": "Built a system for users to redeem vouchers...",
      "role": "Full Stack Developer",
      "duration": "6 months",
      "type": "Web App",
      "skills": ["React", "Node.js"],
      "outcome": "Shipped to production"
    }
  ]
}
```

**Benefits:**
- Update project details in one place (JSON file) instead of HTML
- Easy to add new projects
- Data is separated from presentation

---

### Step 12: Convert HTML Pages to Use Components
**What to do:**
- For each page (index.html, about.html, pps-voucher.html, etc.):
  1. Keep the page-specific content (unique to that page)
  2. Replace all repeated sections with component function calls
  3. Update page to reference the new config files

**Example: Before and After**

**Before (400+ lines per file):**
```html
<!DOCTYPE html>
<html>
  <head>
    <!-- 40 lines of meta tags -->
    <!-- 20 lines of CSS loading -->
  </head>
  <body>
    <div id="preloader"><div id="loader"></div></div>
    <nav class="navbar..."><!-- 50 lines --></nav>
    <div class="container">
      <!-- Page-specific content -->
    </div>
    <footer><!-- 30 lines --></footer>
    <!-- 30 lines of script loading -->
  </body>
</html>
```

**After (100 lines per file):**
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" href="/dist/styles.css">
  </head>
  <body>
    <div id="app"></div>
    <script src="/dist/app.js"></script>
    <script>
      app.render({
        page: 'project',
        projectId: 'pps-voucher'
      });
    </script>
  </body>
</html>
```

---

### Step 13: Build and Test
**What to do:**
- Run `npm run build` to compile TypeScript → JavaScript
- Open each page in a browser
- Verify:
  - Navigation bar looks correct
  - Footer is correct
  - Project headers/metadata look correct
  - Galleries work (images load, navigation works)
  - Responsive design works on mobile

**Testing checklist:**
- [ ] Navigation on desktop (8+ pixel width)
- [ ] Navigation on mobile (320px width)
- [ ] Footer year is correct
- [ ] All galleries load images
- [ ] All galleries respond to user input (prev/next buttons)
- [ ] Preloader appears then disappears
- [ ] Page loads in under 2 seconds
- [ ] No console errors in browser DevTools

---

### Step 14: Cleanup and Optimization
**What to do:**
- Remove old custom.js file (logic now in TypeScript components)
- Remove any duplicate CSS (components handle styling)
- Update package.json to include build scripts
- Add `.gitignore` entries for compiled code

**Commands to add to package.json:**
```json
{
  "scripts": {
    "build": "tsc && bundler",
    "dev": "tsc --watch",
    "test": "verify all pages load"
  }
}
```

---

## Component Files to Create

| Component | File Path | Responsibility | Replaces |
|-----------|-----------|-----------------|----------|
| Navigation | `src/components/Navigation.ts` | Renders navbar | 50 lines × 8 files |
| Footer | `src/components/Footer.ts` | Renders footer | 30 lines × 7 files |
| Preloader | `src/components/Preloader.ts` | Renders loading spinner | 5 lines × 8 files |
| ProjectHeader | `src/components/ProjectHeader.ts` | Renders project title/description | 80 lines × 4 files |
| MetadataGrid | `src/components/MetadataGrid.ts` | Renders role/skills grid | 60 lines × 4 files |
| Gallery | `src/components/Gallery.ts` | Renders image galleries | 3 separate implementations |
| PageLayout | `src/components/PageLayout.ts` | Wraps all components | Architecture pattern |
| BaseComponent | `src/components/BaseComponent.ts` | Template for all components | Foundation |

---

## Configuration Files to Create

| Config | File Path | Contains |
|--------|-----------|----------|
| Projects | `src/config/projects.json` | All project metadata |
| Navigation | `src/config/navigation.json` | Nav links and structure |
| Galleries | `src/config/galleries.json` | Image paths for galleries |

---

## Verification / Testing Plan

### Before Refactoring:
1. Take screenshots of all 8 pages as they currently look
2. Note loading time (use browser DevTools Performance tab)
3. Check for any console errors (F12 → Console tab)

### After Refactoring:
1. Compare screenshots of each page - should be pixel-perfect identical
2. Verify loading time hasn't increased (target: same or faster)
3. Verify no console errors
4. Test on mobile devices (or browser mobile view)
5. Verify form submissions still work (if any)
6. Verify links still work (navigation between pages)
7. Verify galleries:
   - Previous/Next buttons work
   - Images load
   - Auto-rotate works (if applicable)
8. Run `npm run build` - should complete without errors

### How to Know It's Successful:
- ✅ Site looks and functions identical to before
- ✅ No console errors
- ✅ All components working (nav, footer, galleries)
- ✅ Build completes without errors
- ✅ File sizes reduced (less duplicate code)
- ✅ Making a single change now updates all pages (e.g., change nav in one place = updates all 8 pages)

---

## Critical Files to Modify

**Current structure:**
```
├── index.html
├── about.html
├── pps-voucher.html
├── miles-redemption.html
├── international-delivery.html
├── interlogue.html
├── project-101.html
├── krisshop-australia.html
├── css/
│   ├── tokens.css (design system - KEEP AS IS)
│   ├── custom.css (component styles - refactor)
│   └── style.css (bootstrap - keep)
├── js/
│   └── custom.js (move to TypeScript)
└── package.json (add build scripts)
```

**New structure:**
```
├── src/
│   ├── components/
│   │   ├── BaseComponent.ts (NEW)
│   │   ├── Navigation.ts (NEW)
│   │   ├── Footer.ts (NEW)
│   │   ├── Preloader.ts (NEW)
│   │   ├── ProjectHeader.ts (NEW)
│   │   ├── MetadataGrid.ts (NEW)
│   │   ├── Gallery.ts (NEW)
│   │   └── PageLayout.ts (NEW)
│   ├── config/
│   │   ├── projects.json (NEW)
│   │   ├── navigation.json (NEW)
│   │   └── galleries.json (NEW)
│   └── index.ts (NEW)
├── dist/ (generated by build)
└── (root HTML files remain, but much smaller)
```

---

## Timeline Estimate

- **Phase 1 (Build setup):** 1-2 hours
- **Phase 2 (Components):** 3-4 hours (7 components × 30 min each)
- **Phase 3 (Convert pages):** 1-2 hours (8 pages, quick refactoring)
- **Phase 4 (Config files):** 30 min - 1 hour
- **Phase 5 (Testing):** 1-2 hours (pixel-perfect verification)

**Total: 7-11 hours of focused work**

---

## Success Criteria

When this is complete, you'll have:

1. ✅ **DRY Code** - No more copy-pasted sections across files
2. ✅ **Type Safety** - TypeScript ensures components receive correct data
3. ✅ **Maintainability** - Change navigation once, updates all 8 pages
4. ✅ **Extensibility** - Easy to add new pages and reuse components
5. ✅ **Same User Experience** - Site looks and functions identically
6. ✅ **Reduced Duplication** - 1,300+ lines of duplicate code eliminated
7. ✅ **Better Developer Experience** - IDE autocomplete, error checking

---

## Non-Technical Summary

**What's happening:**

Currently, your portfolio is like having 8 different print shops, each manually replicating the same design elements (header, footer, navigation) on every page. When you want to change the navigation, you have to update 8 separate locations.

**The refactoring:**

We're moving to a factory system where we create reusable "templates" (TypeScript components) for common elements. Each page now just says "use the standard header, footer, and navigation" instead of having its own copy.

**The benefit:**

- **Easier updates:** Change the navigation once, it updates everywhere
- **Less work:** Don't repeat code 8 times
- **Fewer mistakes:** Single source of truth for each element
- **Easier to add features:** Want a new navigation item? Add it once to the template
- **Better for teams:** New developers see clear structure and patterns
