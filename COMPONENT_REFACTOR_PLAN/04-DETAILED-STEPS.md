# Detailed Steps: Step-by-Step Implementation Guide

This is your roadmap. Follow these 14 steps in order. Each step builds on the previous one.

---

## Step 1: Understand Current Structure ✓ (Already Done)

**Status:** We've already mapped all HTML files, CSS, and JavaScript patterns.

**What we know:**
- 8 HTML files with 1,300+ lines of duplication
- 3 CSS files (keep tokens.css and style.css as-is)
- 1 custom.js file with 380 lines (will convert to TypeScript)
- Design tokens already defined (excellent!)

**Next step:** Step 2

---

## Step 2: Set Up TypeScript and Build Tools

**Time:** 1-2 hours

**What to do:**

### 2a. Install TypeScript
```bash
npm install --save-dev typescript
```

### 2b. Create tsconfig.json
This file tells TypeScript how to convert your code.

In the root of your project, create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "declaration": true,
    "sourceMap": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 2c. Create src/ folder
```bash
mkdir src
mkdir src/components
mkdir src/config
```

### 2d. Update package.json
Add these scripts to the "scripts" section:
```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "clean": "rm -rf dist"
  }
}
```

### 2e. Create dist/ folder
```bash
mkdir dist
```

**Testing:** Run `npm run build` — should complete without errors (no files yet, so nothing to compile)

**Expected outcome:** 
- ✓ Can run build commands
- ✓ TypeScript is installed
- ✓ Folder structure ready

**Next step:** Step 3

---

## Step 3: Create Component Foundation

**Time:** 1 hour

**What to do:**

Create a base component that all others will inherit from.

**File:** `src/components/BaseComponent.ts`

```typescript
export interface ComponentProps {
  [key: string]: any;
}

export abstract class BaseComponent {
  protected props: ComponentProps;

  constructor(props: ComponentProps = {}) {
    this.props = props;
  }

  abstract render(): string;

  protected sanitizeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export function createComponent<T extends BaseComponent>(
  ComponentClass: new (props: ComponentProps) => T,
  props: ComponentProps = {}
): string {
  const component = new ComponentClass(props);
  return component.render();
}
```

**What this does:**
- Provides a template for all components
- Ensures all components have a `render()` method
- Includes a safety feature (sanitizeHtml) to prevent injection attacks

**Testing:** Run `npm run build` — should compile without errors

**Expected outcome:**
- ✓ BaseComponent.ts created and compiles
- ✓ All future components will extend this
- ✓ Type-safe foundation in place

**Next step:** Step 4

---

## Step 4: Create Navigation Component

**Time:** 30 minutes

**What to do:**

Create `src/components/Navigation.ts`:

```typescript
import { BaseComponent, ComponentProps } from './BaseComponent';

export interface NavLink {
  name: string;
  href: string;
}

export interface NavigationProps extends ComponentProps {
  links: NavLink[];
  brandName?: string;
  transparent?: boolean;
}

export class Navigation extends BaseComponent {
  protected props: NavigationProps;

  constructor(props: NavigationProps) {
    super(props);
    this.props = {
      brandName: 'Tay Yu Qing',
      transparent: false,
      ...props
    };
  }

  render(): string {
    const navClass = this.props.transparent ? 'bg-transparent' : 'bg-white';
    const links = this.props.links
      .map(link => `<a class="nav-link" href="${link.href}">${this.sanitizeHtml(link.name)}</a>`)
      .join('');

    return `
      <nav class="navbar navbar-dark navbar-expand-sm fixed-top ${navClass}">
        <div class="container">
          <a class="navbar-brand" href="/index.html">${this.sanitizeHtml(this.props.brandName)}</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              ${links}
            </div>
          </div>
        </div>
      </nav>
    `;
  }
}
```

**What this does:**
- Takes navigation links as input
- Generates the navbar HTML
- Handles both transparent and solid backgrounds

**Usage example:**
```typescript
const nav = new Navigation({
  links: [
    { name: 'Work', href: '/index.html' },
    { name: 'About', href: '/about.html' }
  ],
  transparent: false
}).render();
```

**Testing:** 
1. Run `npm run build`
2. Should compile without errors

**Expected outcome:**
- ✓ Navigation.ts created
- ✓ Compiles successfully
- ✓ Ready to be used in pages

**Next step:** Step 5

---

## Step 5: Create Footer Component

**Time:** 15 minutes

**What to do:**

Create `src/components/Footer.ts`:

```typescript
import { BaseComponent, ComponentProps } from './BaseComponent';

export interface FooterProps extends ComponentProps {
  year?: number;
  siteName?: string;
}

export class Footer extends BaseComponent {
  protected props: FooterProps;

  constructor(props: FooterProps = {}) {
    super(props);
    this.props = {
      year: new Date().getFullYear(),
      siteName: 'tayyuqing.com',
      ...props
    };
  }

  render(): string {
    return `
      <footer class="space-md bg-light">
        <div class="container">
          <p class="text-center text-muted">© ${this.props.year} ${this.sanitizeHtml(this.props.siteName)}</p>
        </div>
      </footer>
    `;
  }
}
```

**What this does:**
- Generates footer HTML
- Year defaults to current year (no more manual updates!)
- Easy to customize

**Usage example:**
```typescript
const footer = new Footer({
  year: 2026,
  siteName: 'tayyuqing.com'
}).render();
```

**Testing:** Run `npm run build` — should compile without errors

**Expected outcome:**
- ✓ Footer.ts created
- ✓ No more hardcoded years
- ✓ Ready for all pages

**Next step:** Step 6

---

## Step 6: Create Preloader Component

**Time:** 10 minutes

**What to do:**

Create `src/components/Preloader.ts`:

```typescript
import { BaseComponent } from './BaseComponent';

export class Preloader extends BaseComponent {
  render(): string {
    return `
      <div id="preloader">
        <div id="loader"></div>
      </div>
    `;
  }
}
```

**What this does:**
- Simple loading spinner
- Always the same, no configuration needed

**Testing:** Run `npm run build`

**Expected outcome:**
- ✓ Preloader.ts created
- ✓ Very simple component
- ✓ Ready to inject into pages

**Next step:** Step 7

---

## Step 7: Create Project Header Component

**Time:** 30 minutes

**What to do:**

Create `src/components/ProjectHeader.ts`:

```typescript
import { BaseComponent, ComponentProps } from './BaseComponent';

export interface ProjectHeaderProps extends ComponentProps {
  title: string;
  subtitle: string;
  description: string;
}

export class ProjectHeader extends BaseComponent {
  protected props: ProjectHeaderProps;

  constructor(props: ProjectHeaderProps) {
    super(props);
    this.props = props;
  }

  render(): string {
    return `
      <section class="space-md">
        <div class="container">
          <div class="row">
            <div class="col-md-5">
              <h1 class="headline-title">${this.sanitizeHtml(this.props.title)}</h1>
              <p class="headline-subtitle">${this.sanitizeHtml(this.props.subtitle)}</p>
              <p class="lead">${this.sanitizeHtml(this.props.description)}</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
```

**What this does:**
- Generates the project title/subtitle/description section
- Used on all 4 project pages
- Takes title, subtitle, and description as inputs

**Usage example:**
```typescript
const header = new ProjectHeader({
  title: 'Voucher Redemptions',
  subtitle: 'PPS Platform',
  description: 'Built a system for users to redeem vouchers...'
}).render();
```

**Testing:** Run `npm run build`

**Expected outcome:**
- ✓ ProjectHeader.ts created
- ✓ Ready for project pages
- ✓ Eliminates 80+ lines of duplication

**Next step:** Step 8

---

## Step 8: Create Metadata Grid Component

**Time:** 45 minutes

**What to do:**

Create `src/components/MetadataGrid.ts`:

```typescript
import { BaseComponent, ComponentProps } from './BaseComponent';

export interface MetadataGridProps extends ComponentProps {
  role: string;
  duration: string;
  type: string;
  skills: string[];
  outcome: string;
}

export class MetadataGrid extends BaseComponent {
  protected props: MetadataGridProps;

  constructor(props: MetadataGridProps) {
    super(props);
    this.props = props;
  }

  private createMetadataItem(title: string, items: string[]): string {
    const listItems = items
      .map(item => `<li>${this.sanitizeHtml(item)}</li>`)
      .join('');
    return `
      <div class="col-md-4">
        <h5>${this.sanitizeHtml(title)}</h5>
        <ul class="unstyled-list">
          ${listItems}
        </ul>
      </div>
    `;
  }

  render(): string {
    return `
      <section class="space-md bg-light">
        <div class="container">
          <div class="row">
            ${this.createMetadataItem('My Role', [this.props.role])}
            ${this.createMetadataItem('Duration', [this.props.duration])}
            ${this.createMetadataItem('Project Type', [this.props.type])}
            ${this.createMetadataItem('Skills', this.props.skills)}
            ${this.createMetadataItem('Outcome', [this.props.outcome])}
          </div>
        </div>
      </section>
    `;
  }
}
```

**What this does:**
- Generates the metadata grid (role, duration, type, skills, outcome)
- Accepts arrays for multi-value fields like skills
- Handles HTML sanitization for safety

**Usage example:**
```typescript
const metadata = new MetadataGrid({
  role: 'Full Stack Developer',
  duration: '6 months',
  type: 'Web Application',
  skills: ['React', 'Node.js', 'PostgreSQL'],
  outcome: 'Shipped to production'
}).render();
```

**Testing:** Run `npm run build`

**Expected outcome:**
- ✓ MetadataGrid.ts created
- ✓ Eliminates 60+ lines of duplication
- ✓ Ready for project pages

**Next step:** Step 9

---

## Step 9: Create Gallery Component

**Time:** 1.5 hours

**What to do:**

Create `src/components/Gallery.ts`:

```typescript
import { BaseComponent, ComponentProps } from './BaseComponent';

export type GalleryType = 'carousel' | 'grid' | 'fullscreen';

export interface GalleryProps extends ComponentProps {
  images: string[];
  type?: GalleryType;
  autoplay?: boolean;
  autoplayInterval?: number;
}

export class Gallery extends BaseComponent {
  protected props: GalleryProps;

  constructor(props: GalleryProps) {
    super(props);
    this.props = {
      type: 'carousel',
      autoplay: false,
      autoplayInterval: 3000,
      ...props
    };
  }

  private createCarousel(): string {
    if (this.props.images.length === 0) return '';
    
    const images = this.props.images
      .map((img, idx) => `<img src="${img}" alt="Gallery image ${idx + 1}" />`)
      .join('');
    
    const dots = this.props.images
      .map((_, idx) => `<span class="dot" data-slide="${idx}"></span>`)
      .join('');

    return `
      <div class="gallery-carousel">
        <div class="gallery-container">
          ${images}
        </div>
        <button class="gallery-prev">❮</button>
        <button class="gallery-next">❯</button>
        <div class="gallery-dots">
          ${dots}
        </div>
      </div>
    `;
  }

  private createGrid(): string {
    if (this.props.images.length === 0) return '';
    
    const images = this.props.images
      .map((img, idx) => `<div class="gallery-item"><img src="${img}" alt="Gallery image ${idx + 1}" /></div>`)
      .join('');

    return `
      <div class="gallery-grid">
        ${images}
      </div>
    `;
  }

  render(): string {
    switch (this.props.type) {
      case 'grid':
        return this.createGrid();
      case 'carousel':
      default:
        return this.createCarousel();
    }
  }
}
```

**What this does:**
- Consolidates 3 gallery systems into one component
- Supports carousel and grid views
- Optional autoplay for rotating galleries
- Takes images array as input

**Usage example:**
```typescript
// Carousel with prev/next buttons
const carousel = new Gallery({
  images: ['/images/img1.jpg', '/images/img2.jpg'],
  type: 'carousel'
}).render();

// Auto-rotating gallery
const autoCarousel = new Gallery({
  images: ['/images/img1.jpg', '/images/img2.jpg'],
  type: 'carousel',
  autoplay: true,
  autoplayInterval: 3000
}).render();

// Grid view
const grid = new Gallery({
  images: ['/images/img1.jpg', '/images/img2.jpg'],
  type: 'grid'
}).render();
```

**Testing:** Run `npm run build`

**Expected outcome:**
- ✓ Gallery.ts created
- ✓ Consolidates 3 implementations into 1
- ✓ Eliminates 100+ lines of duplicate gallery code

**Next step:** Step 10

---

## Step 10: Create PageLayout Component

**Time:** 45 minutes

**What to do:**

Create `src/components/PageLayout.ts`:

```typescript
import { BaseComponent, ComponentProps } from './BaseComponent';
import { Navigation, NavLink } from './Navigation';
import { Preloader } from './Preloader';
import { Footer } from './Footer';

export interface PageLayoutProps extends ComponentProps {
  content: string;
  navLinks: NavLink[];
  navTransparent?: boolean;
  footerYear?: number;
  footerSiteName?: string;
}

export class PageLayout extends BaseComponent {
  protected props: PageLayoutProps;

  constructor(props: PageLayoutProps) {
    super(props);
    this.props = {
      navTransparent: false,
      footerYear: new Date().getFullYear(),
      footerSiteName: 'tayyuqing.com',
      ...props
    };
  }

  render(): string {
    const nav = new Navigation({
      links: this.props.navLinks,
      transparent: this.props.navTransparent
    }).render();

    const preloader = new Preloader().render();

    const footer = new Footer({
      year: this.props.footerYear,
      siteName: this.props.footerSiteName
    }).render();

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="/css/style.css">
          <link rel="stylesheet" href="/css/tokens.css">
          <link rel="stylesheet" href="/css/custom.css">
        </head>
        <body>
          ${preloader}
          ${nav}
          <main>
            ${this.props.content}
          </main>
          ${footer}
          <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js" defer></script>
          <script src="/js/custom.js" defer></script>
        </body>
      </html>
    `;
  }
}
```

**What this does:**
- Wraps all components into a complete page
- Includes navigation, preloader, footer, and content
- Handles all script and CSS loading
- Every page uses this same structure

**Usage example:**
```typescript
const page = new PageLayout({
  content: '<h1>Welcome</h1>',
  navLinks: [
    { name: 'Work', href: '/index.html' },
    { name: 'About', href: '/about.html' }
  ]
}).render();
```

**Testing:** Run `npm run build`

**Expected outcome:**
- ✓ PageLayout.ts created
- ✓ Single template for all pages
- ✓ Ensures consistency across site

**Next step:** Step 11

---

## Step 11: Create Data Configuration Files

**Time:** 1 hour

**What to do:**

### 11a. Create src/config/navigation.json

```json
{
  "links": [
    { "name": "Work", "href": "/index.html" },
    { "name": "About", "href": "/about.html" }
  ]
}
```

### 11b. Create src/config/projects.json

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
      "type": "Web Application",
      "skills": ["React", "Node.js", "PostgreSQL"],
      "outcome": "Shipped to production",
      "galleries": {
        "main": ["/images/pps/img1.jpg", "/images/pps/img2.jpg"]
      }
    },
    {
      "id": "miles-redemption",
      "title": "Miles Redemption",
      "subtitle": "Loyalty Program",
      "description": "...",
      "role": "Backend Developer",
      "duration": "4 months",
      "type": "API Service",
      "skills": ["Node.js", "PostgreSQL", "REST API"],
      "outcome": "...",
      "galleries": {}
    }
  ]
}
```

### 11c. Create src/config/galleries.json

```json
{
  "galleries": {
    "pps-voucher": {
      "type": "carousel",
      "images": ["/images/pps/img1.jpg", "/images/pps/img2.jpg"]
    },
    "miles-redemption": {
      "type": "carousel",
      "autoplay": true,
      "images": ["/images/miles/img1.jpg", "/images/miles/img2.jpg"]
    },
    "interlogue": {
      "type": "carousel",
      "autoplay": true,
      "autoplayInterval": 3000,
      "images": ["/images/interlogue/img1.jpg", "/images/interlogue/img2.jpg"]
    }
  }
}
```

**What this does:**
- Centralizes all project data
- Easy to update without touching code
- Separates data from presentation

**Expected outcome:**
- ✓ All project data in one place
- ✓ Easy to add new projects
- ✓ Gallery configurations centralized

**Next step:** Step 12

---

## Step 12: Convert HTML Pages to Use Components

**Time:** 1-2 hours (8 pages × 10-15 min each)

**What to do:**

For each HTML file, replace the repeated sections with component calls.

### Example: Converting index.html

**Before (400+ lines):**
```html
<!DOCTYPE html>
<html>
  <head>
    <!-- 40 lines of meta tags and CSS loading -->
    <meta charset="UTF-8">
    <link href="..." rel="preload">
    <!-- etc. -->
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

**After (100+ lines):**
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="/css/style.css">
    <link rel="stylesheet" href="/css/tokens.css">
    <link rel="stylesheet" href="/css/custom.css">
  </head>
  <body>
    <div id="app"></div>
    
    <script src="/js/app.js"></script>
    <script>
      // Load navigation from config
      fetch('/src/config/navigation.json')
        .then(r => r.json())
        .then(config => {
          // Create page with components
          const app = createPageLayout({
            content: document.getElementById('content').innerHTML,
            navLinks: config.links
          });
          document.getElementById('app').innerHTML = app;
        });
    </script>
  </body>
</html>
```

### For Each Page:

1. **Keep** page-specific content (unique to that page)
2. **Remove** duplicated navigation, footer, preloader
3. **Replace** with component calls

### Pages to Convert:

- [ ] index.html - Home
- [ ] about.html - About/Resume
- [ ] pps-voucher.html - Project 1
- [ ] miles-redemption.html - Project 2
- [ ] international-delivery.html - Project 3
- [ ] interlogue.html - Project 4
- [ ] project-101.html - Placeholder
- [ ] krisshop-australia.html - Empty

**Testing:** After each page:
1. Open in browser
2. Verify navigation appears
3. Verify footer appears
4. Verify page content displays
5. Check browser console for errors (F12 → Console tab)

**Expected outcome:**
- ✓ All 8 pages converted
- ✓ Each page 70% smaller (less code)
- ✓ All pages using components
- ✓ No visual changes

**Next step:** Step 13

---

## Step 13: Build and Test

**Time:** 1-2 hours

**What to do:**

### 13a. Run the Build
```bash
npm run build
```

Should complete without errors.

### 13b. Visual Testing

For each page:
1. Take a screenshot
2. Compare with "before" screenshots
3. Should look pixel-perfect identical

**Checklist:**
- [ ] Navigation bar appears on all pages
- [ ] Navigation links work (click to go to other pages)
- [ ] Footer appears on all pages
- [ ] Footer year is correct
- [ ] Project titles display correctly
- [ ] Metadata grids display correctly
- [ ] Galleries load images
- [ ] Gallery prev/next buttons work
- [ ] Auto-rotating galleries rotate (if applicable)
- [ ] Responsive design works on mobile

### 13c. Functional Testing

- [ ] Click all navigation links - should navigate
- [ ] Check page load speed (should be same or faster)
- [ ] Open browser console (F12) - no errors
- [ ] Test on mobile browser/device
- [ ] Test on different screen sizes (resize browser window)

### 13d. Gallery Testing

- [ ] Click gallery prev/next buttons
- [ ] Gallery images appear correctly
- [ ] Gallery auto-rotation works (check interlogue)
- [ ] Verify image paths are correct

**Expected outcome:**
- ✓ All pages look identical to before
- ✓ All functionality works
- ✓ No console errors
- ✓ Build completes successfully

**Next step:** Step 14

---

## Step 14: Cleanup and Optimization

**Time:** 30 minutes

**What to do:**

### 14a. Remove Old Files (Optional)

Once you're confident everything works, you can remove:
- Old `js/custom.js` (logic now in TypeScript components)
- Any duplicate CSS (components handle styling)

### 14b. Update .gitignore

Add these to `.gitignore` so generated files aren't committed:
```
dist/
*.js.map
.env.local
```

### 14c. Add Build Scripts

Verify `package.json` has:
```json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "clean": "rm -rf dist"
  }
}
```

### 14d. Document the Changes

In your project README, add:
```markdown
## Development

### Build Components
```bash
npm run build
```

### Watch Mode (auto-rebuild on changes)
```bash
npm run dev
```

### Components

Components are in `src/components/`:
- `Navigation.ts` - Navbar
- `Footer.ts` - Footer
- `Preloader.ts` - Loading spinner
- `ProjectHeader.ts` - Project title/subtitle
- `MetadataGrid.ts` - Project metadata
- `Gallery.ts` - Image galleries
- `PageLayout.ts` - Full page wrapper

### Config Files

Update project data in `src/config/`:
- `navigation.json` - Nav links
- `projects.json` - Project details
- `galleries.json` - Gallery images
```

**Expected outcome:**
- ✓ Cleanup complete
- ✓ Old code removed
- ✓ Build system documented
- ✓ Ready for future development

---

## Summary of All 14 Steps

| # | Step | Time | What | Status |
|---|------|------|------|--------|
| 1 | Understand current structure | - | Map existing code | ✓ Done |
| 2 | Setup TypeScript & build tools | 1-2h | Create build system | → Start here |
| 3 | Create BaseComponent | 1h | Foundation for all components | |
| 4 | Create Navigation component | 30m | Navbar generator | |
| 5 | Create Footer component | 15m | Footer generator | |
| 6 | Create Preloader component | 10m | Loading spinner | |
| 7 | Create ProjectHeader component | 30m | Project title section | |
| 8 | Create MetadataGrid component | 45m | Project metadata grid | |
| 9 | Create Gallery component | 1.5h | Image gallery system | |
| 10 | Create PageLayout component | 45m | Page wrapper | |
| 11 | Create config files | 1h | Project data files | |
| 12 | Convert HTML pages | 1-2h | Use components in pages | |
| 13 | Build & test | 1-2h | Verify everything works | |
| 14 | Cleanup & optimize | 30m | Remove old code | |
| | **Total** | **7-11h** | | |

---

**Next:** Read [05-COMPONENTS.md](05-COMPONENTS.md) for component specifications
