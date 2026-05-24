# Approach: How We'll Do This

## High-Level Strategy

We'll convert your static HTML site into a **component-based system** where each repeated section becomes a reusable TypeScript component.

### The 5-Phase Approach

```
Phase 1: Build Setup          Phase 2: Components        Phase 3: Page Updates
┌─────────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│ Install tools   │───▶│ Create 8 components  │───▶│ Update all pages │
│ Create folders  │    │ (Navigation, Footer, │    │ to use components│
│ Setup TypeScript│    │  Preloader, Headers) │    │                  │
└─────────────────┘    └──────────────────────┘    └──────────────────┘
      ↓                        ↓                         ↓
   1-2 hours             3-4 hours                  1-2 hours


Phase 4: Data Config          Phase 5: Testing
┌─────────────────┐    ┌──────────────────────┐
│ Create JSON     │───▶│ Verify everything    │
│ config files    │    │ works identically    │
│ for projects    │    │ Test all pages       │
└─────────────────┘    └──────────────────────┘
   30min-1hr              1-2 hours

Total: 7-11 hours
```

## What Each Phase Does

### Phase 1: Set Up Build System (Foundation)

**What:** Install tools that convert TypeScript code into something browsers can use

**Why first:** Browsers can't run TypeScript directly—we need a "translator"

**Files created:**
- `tsconfig.json` - Instructions for TypeScript translator
- `src/` folder - Where all new TypeScript code goes
- Updated `package.json` - Build commands

**After this phase:** Can run `npm run build` and see it work

---

### Phase 2: Extract Components to TypeScript (Core Work)

**What:** Create 8 reusable TypeScript components

**Components to create:**
1. **Navigation** - The navbar that appears on every page
2. **Footer** - The footer that appears on 7 pages
3. **Preloader** - The loading spinner
4. **ProjectHeader** - Project title/subtitle/description
5. **MetadataGrid** - Role/duration/skills section
6. **PageLayout** - Wrapper for the full page structure
7. **Gallery** - Combines 3 gallery systems into one
8. **BaseComponent** - Blueprint for all components

**After this phase:** All components built and tested individually

---

### Phase 3: Convert Pages to Use Components

**What:** Update each HTML file to use the new components

**Before:**
```html
<nav class="navbar..."><!-- 50 lines of navbar HTML --></nav>
```

**After:**
```html
<script>createNavigation();</script>
```

**Impact:**
- Each page shrinks from 400+ lines to 100-150 lines
- No more copy-pasted sections
- All pages use the same component code

**After this phase:** All 8 pages working with components

---

### Phase 4: Migrate Data to Config Files

**What:** Move hardcoded data into JSON files

**Example:**
- Project titles
- Metadata (role, duration, skills)
- Gallery image paths

Instead of editing HTML and custom.js, you'll edit simple JSON files.

**Benefit:** Easier updates, cleaner separation of code and data

**After this phase:** All project data centralized and easy to update

---

### Phase 5: Testing & Validation

**What:** Verify everything looks and works exactly as before

**Testing:**
- Screenshot comparison (visual check)
- Click all navigation links (functionality)
- Test galleries (images load, buttons work)
- Check on mobile (responsive design)
- Verify no console errors

**After this phase:** Confident the refactoring is complete and correct

---

## Component Architecture

### Component Hierarchy

```
PageLayout (Wrapper)
├── Preloader
├── Navigation
├── Page-specific content
│   ├── ProjectHeader (if project page)
│   ├── MetadataGrid (if project page)
│   ├── Gallery (if project page)
│   └── Other content
└── Footer
```

### How Components Talk to Each Other

**Data flows in:**
```typescript
// Component receives data
createProjectHeader({
  title: "My Project",
  subtitle: "My Company",
  description: "What we built"
})
```

**HTML flows out:**
```html
<!-- Component generates HTML -->
<section class="space-md">
  <h1>My Project</h1>
  <p>My Company</p>
  <p>What we built</p>
</section>
```

---

## Why This Order?

1. **Phase 1 First** - Need build tools before creating components
2. **Phase 2 Second** - Components are reusable blocks
3. **Phase 3 Third** - Pages use the components
4. **Phase 4 Fourth** - Clean up data
5. **Phase 5 Last** - Verify everything works

Skipping this order would be like:
- Building a house without foundation
- Trying to use furniture before building the rooms
- Moving in before testing if walls are sturdy

---

## Key Design Decisions

### 1. TypeScript (Not JavaScript)

**Why:** Type safety prevents bugs
```typescript
// TypeScript knows what it expects
createNavigation({ 
  links: [{name: "Work", href: "/"}]  // ✅ Correct
})

// If you try this:
createNavigation({ 
  links: ["Work", "/"]  // ❌ Error: Expected array of objects
})
```

### 2. Components Return HTML Strings (Not DOM objects)

**Why:** Simpler, easier to test
```typescript
// Component returns HTML as string
function createNavigation() {
  return `<nav>...</nav>`
}

// You inject it into the page
document.getElementById('app').innerHTML = createNavigation();
```

### 3. Single Source of Truth

**Each repeated element has ONE component**
- Don't want 3 different navigation implementations
- Any change updates everywhere automatically

### 4. Keep Existing CSS

**We're not changing styling**
- All existing CSS stays
- Components just generate HTML
- No visual changes, only code structure

### 5. Config Files for Data

**Separate data from code**
```
Code: src/components/ProjectHeader.ts (unchanged)
Data: src/config/projects.json (easy to update)
```

---

## Before and After Comparison

### Before Refactoring

```
8 HTML files × 400+ lines each = 3,200 lines of code
├── Lots of duplication
├── Hard to maintain
├── Error-prone (easy to miss updates on some pages)
└── Adding new pages = lots of copy-paste

1 custom.js file × 380 lines
├── All JavaScript logic in one place
├── 3 different gallery systems (confusing)
└── jQuery selectors throughout
```

### After Refactoring

```
8 HTML files × 100-150 lines each = 800-1,200 lines of code
├── No duplication
├── Easy to maintain
├── Changes apply everywhere
└── Adding new pages = just create new content section

src/components/ folder
├── 8 TypeScript components
├── Each handles one thing
└── Reusable and testable

src/config/ folder
├── projects.json (easy to update)
├── navigation.json
└── galleries.json
```

---

## Success Looks Like

✅ **Same user experience** - Site looks identical  
✅ **Fewer lines of code** - 1,300+ lines eliminated  
✅ **Easier to maintain** - One source of truth for each component  
✅ **Type safe** - TypeScript catches mistakes  
✅ **Easier to extend** - Adding new pages is simple  
✅ **Build system ready** - Foundation for future improvements  

---

**Next:** Read [04-DETAILED-STEPS.md](04-DETAILED-STEPS.md) for step-by-step instructions
