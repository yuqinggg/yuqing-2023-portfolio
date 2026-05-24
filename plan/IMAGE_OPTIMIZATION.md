# Image Optimization Guide

## Overview
This guide covers optimizing image delivery for your portfolio site to improve load times and performance.

## 1. **Lazy Loading** ✓ (Implemented)
All images now include `loading="lazy"` attribute, which defers image loading until they're about to enter the viewport.

### Benefit
- Reduces initial page load time
- Decreases bandwidth usage
- Improved Core Web Vitals

## 2. **Render Blocking Resource Optimization** ✓ (Implemented)
Eliminated render blocking CSS and JavaScript to improve First Contentful Paint (FCP) and Largest Contentful Paint (LCP).

### CSS Optimization
- **Critical CSS**: Bootstrap and theme styles load synchronously for immediate rendering
- **Non-critical CSS**: Icon fonts and custom styles use `preload` with `onload` to load asynchronously
- **Fallback**: `<noscript>` tags ensure CSS loads even with JavaScript disabled

### JavaScript Optimization
- **Defer attribute**: All non-critical JavaScript files now use `defer` to prevent render blocking
- **Load order**: Scripts execute after HTML parsing completes
- **Module scripts**: Lottie animations (where used) remain as ES modules for proper dependency handling

### Implementation Details
```html
<!-- Asynchronous CSS loading -->
<link rel="preload" href="css/custom.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="css/custom.css"></noscript>

<!-- Deferred JavaScript -->
<script src="js/custom.js" defer></script>
```

### Files Optimized
- `index.html` ✓
- `about.html` ✓
- `miles-redemption.html` ✓
- `International-delivery.html` ✓
- `interlogue.html` ✓
- `pps-voucher.html` ✓
- `project-101.html` ✓

### Benefit
- Faster First Contentful Paint (FCP)
- Improved Core Web Vitals scores
- Better user experience with immediate visual feedback

## 3. **Image Format Optimization**

### Using TinyPNG for Compression
Run this command before adding images to the site:
```bash
npm run compress
```

This reduces file sizes by 10-90% depending on the image.

### Converting to WebP (Recommended)
WebP format can reduce file sizes by 25-35% compared to JPEG.

#### Convert images to WebP:
```bash
# Install webp converter (macOS)
brew install webp

# Convert a single image
cwebp img/miles-redemption/miles-redemption-cover.jpg -o img/miles-redemption/miles-redemption-cover.webp

# Convert all JPG files in a directory
for f in img/miles-redemption/*.jpg; do cwebp "$f" -o "${f%.jpg}.webp"; done
```

#### Use WebP with Fallback (Picture Element):
```html
<picture>
  <source srcset="img/example.webp" type="image/webp">
  <img src="img/example.jpg" alt="Description" class="img-fluid" loading="lazy">
</picture>
```

## 4. **Responsive Images**

### Using srcset for Different Screen Sizes:
If you create small, medium, and large versions:
```html
<img 
  src="img/miles-redemption/miles-redemption-cover.jpg"
  srcset="
    img/miles-redemption/miles-redemption-cover-small.jpg 480w,
    img/miles-redemption/miles-redemption-cover-medium.jpg 800w,
    img/miles-redemption/miles-redemption-cover.jpg 1200w"
  sizes="(max-width: 480px) 100vw, (max-width: 800px) 80vw, 90vw"
  alt="Miles Redemption Cover"
  class="img-fluid"
  loading="lazy"
>
```

## 5. **Browser Caching** (Server Configuration)

Add this to your `.htaccess` file (if using Apache):
```apache
<IfModule mod_expire.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
</IfModule>
```

Or for Next.js/Node.js servers, add cache headers:
```javascript
res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
```

## 6. **Content Delivery Network (CDN)**

Consider using:
- **Cloudflare** (free tier available)
- **AWS CloudFront**
- **Fastly**

Benefits:
- Serves images from edge locations closer to users
- Automatic format optimization
- On-the-fly image resizing

## 7. **Image Optimization Tools**

### Free Online Tools:
- [TinyPNG](https://tinypng.com) - Already set up
- [Squoosh](https://squoosh.app) - Multiple formats
- [ImageOptim](https://imageoptim.com) - macOS tool
- [JPEG-XL](https://jpegxl.info) - Next-gen format

### Compare File Sizes:
```bash
ls -lh img/**/*.{jpg,png,gif}
```

## 8. **Performance Metrics to Monitor**

After implementation, check:
- **LCP** (Largest Contentful Paint) - Should be < 2.5s
- **CLS** (Cumulative Layout Shift) - Should be < 0.1
- **FID** (First Input Delay) - Should be < 100ms

Use [PageSpeed Insights](https://pagespeed.web.dev/) to measure.

## 9. **Quick Wins (Already Done)**

✓ Lazy loading implemented on all images
✓ Render blocking resources optimized (CSS preload + JS defer)
✓ TinyPNG compression script set up
✓ Modern image formats supported (.webp)

## 10. **Next Steps**

1. Convert JPG/PNG to WebP where possible
2. Test with PageSpeed Insights
3. Consider CDN deployment
4. Monitor Core Web Vitals
