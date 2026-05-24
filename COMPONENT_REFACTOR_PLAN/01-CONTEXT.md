# Context: Why We're Doing This

## The Problem

Your portfolio site currently has **massive code duplication**. The same HTML code appears in all 8 pages multiple times:

- **Navigation bar** - 50+ lines, identical in 7 pages
- **Page preloader** - 5 lines, identical in all 8 pages
- **CSS/Font loading** - 20+ lines, identical in all 8 pages
- **Script loading** - 30+ lines, identical in all 8 pages
- **Footer** - 30 lines, identical in 7 pages

**On project pages only:**
- **Project header** (title/subtitle) - 80+ lines, repeated 4 times
- **Metadata grid** (role/duration/skills) - 60+ lines, repeated 4 times
- **Gallery JavaScript logic** - 100+ lines, 3 different implementations

### The Cost of This Duplication

**Problem:** Want to change the navigation?
- Currently: Edit 8 separate HTML files
- Risk: Forget to update one page, introduce inconsistencies
- Time: 15-30 minutes of manual work

**Problem:** Add a new project page?
- Currently: Copy-paste 400+ lines of HTML boilerplate
- Risk: Copy old project info by mistake
- Maintenance burden: Now 9 pages to keep in sync

**Problem:** Update the footer year?
- Currently: Find and update 7 separate files
- Risk: Miss one file, site looks broken on some pages

## The Goal

Convert repeated patterns into **reusable TypeScript components** that are generated dynamically.

### What This Means

Instead of:
```html
<!-- Navigation appears in index.html -->
<nav class="navbar navbar-dark navbar-expand-sm fixed-top">
  <div class="container">
    <a class="navbar-brand" href="/index.html">Tay Yu Qing</a>
    <!-- 40 more lines of navbar code -->
  </div>
</nav>

<!-- And AGAIN in about.html -->
<nav class="navbar navbar-dark navbar-expand-sm fixed-top">
  <div class="container">
    <a class="navbar-brand" href="/index.html">Tay Yu Qing</a>
    <!-- 40 more lines of navbar code -->
  </div>
</nav>

<!-- And AGAIN in pps-voucher.html -->
<nav class="navbar navbar-dark navbar-expand-sm fixed-top">
  <!-- etc. -->
</nav>
```

Each page will call:
```html
<script>createNavigation();</script>
```

### One Source of Truth

When you want to change the navigation:
1. Edit **one TypeScript component** (`Navigation.ts`)
2. Run the build
3. **All 8 pages automatically update**

No more manual synchronization across multiple files.

## Why TypeScript?

**Type Safety:** TypeScript ensures components receive the correct data
```typescript
// TypeScript knows exactly what data this needs
createProjectHeader({
  title: "Voucher Redemptions",      // ✅ Must be a string
  subtitle: "PPS Platform",           // ✅ Must be a string  
  description: "Built a system...",   // ✅ Must be a string
  // If you forget one: TypeScript error ❌
})
```

**IDE Autocomplete:** As you type `createNavigation(`, your editor suggests what to pass in

**Fewer Bugs:** Catch errors before running the code

**Better Developer Experience:** Clear expectations for each component

## The Outcome

After this refactoring, you'll have:

✅ **DRY Code** - No more copy-pasted sections  
✅ **Maintainability** - Change once, updates everywhere  
✅ **Type Safety** - IDE catches mistakes  
✅ **Extensibility** - Easy to add new pages  
✅ **Same User Experience** - Site looks identical  
✅ **1,300+ lines eliminated** - Less code to manage  

---

**Next:** Read [02-CURRENT-STATE.md](02-CURRENT-STATE.md) to see exactly what's duplicated
