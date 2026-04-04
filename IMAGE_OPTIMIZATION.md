# Image Optimization Guide

## Overview
This guide covers optimizing image delivery for your portfolio site to improve load times and performance.

## 1. **Lazy Loading** ✓ (Implemented)
All images now include `loading="lazy"` attribute, which defers image loading until they're about to enter the viewport.

### Benefit
- Reduces initial page load time
- Decreases bandwidth usage
- Improved Core Web Vitals

## 2. **Image Format Optimization**

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

## 3. **Responsive Images**

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

## 4. **Browser Caching** (Server Configuration)

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

## 5. **Content Delivery Network (CDN)**

Consider using:
- **Cloudflare** (free tier available)
- **AWS CloudFront**
- **Fastly**

Benefits:
- Serves images from edge locations closer to users
- Automatic format optimization
- On-the-fly image resizing

## 6. **Image Optimization Tools**

### Free Online Tools:
- [TinyPNG](https://tinypng.com) - Already set up
- [Squoosh](https://squoosh.app) - Multiple formats
- [ImageOptim](https://imageoptim.com) - macOS tool
- [JPEG-XL](https://jpegxl.info) - Next-gen format

### Compare File Sizes:
```bash
ls -lh img/**/*.{jpg,png,gif}
```

## 7. **Performance Metrics to Monitor**

After implementation, check:
- **LCP** (Largest Contentful Paint) - Should be < 2.5s
- **CLS** (Cumulative Layout Shift) - Should be < 0.1
- **FID** (First Input Delay) - Should be < 100ms

Use [PageSpeed Insights](https://pagespeed.web.dev/) to measure.

## 8. **Quick Wins (Already Done)**

✓ Lazy loading implemented on all images
✓ TinyPNG compression script set up
✓ Modern image formats supported (.webp)

## 9. **Next Steps**

1. Convert JPG/PNG to WebP where possible
2. Test with PageSpeed Insights
3. Consider CDN deployment
4. Monitor Core Web Vitals
