/** GENERALS */
/** ===================== */

var win = $(window);

// viewport dimensions
var ww = win.width();
var wh = win.height();

$(document).ready(function() {

    // load functions
    imageBG();
    grid();
    watch_grid_width();

});

/**
 * The stylesheets are fetched with rel="preload" and swapped in asynchronously,
 * so the first grid() run can measure the container while Bootstrap's default
 * max-width is still applied and before style.css widens it. Tiles then keep
 * that stale width for the life of the page. Re-layout whenever the width the
 * grid is measured against actually changes — this also covers late font loads.
 */
function watch_grid_width() {

    if (!window.ResizeObserver) return;

    var seen = new WeakMap();

    var observer = new ResizeObserver(function(entries) {
        var changed = false;

        entries.forEach(function(entry) {
            var width = Math.round(entry.contentRect.width);
            if (seen.get(entry.target) !== width) {
                seen.set(entry.target, width);
                changed = true;
            }
        });

        if (changed) grid();
    });

    // observe the parent: grid() sets a negative margin on .grid itself, so
    // observing it directly would feed its own writes back into the observer
    $('.grid').each(function() {
        if (this.parentNode) observer.observe(this.parentNode);
    });

}

win.on('load', function() {

    $('#preloader').addClass('hide');

    // load functions
    grid();

});

var resize_timer;

win.on('resize', function() {

    // viewport dimensions
    ww = win.width();
    wh = win.height();

    // debounce: wait for resizing to settle before re-running layout, so
    // rapid intermediate widths don't race with isotope's async layout
    clearTimeout(resize_timer);
    resize_timer = setTimeout(grid, 150);

});



/** SHOW/HIDE HEADER */
/** ===================== */

function show_hide_header() {

    var last_scroll = 0;

    win.on('scroll', function() {
        if (!$('#about').hasClass('visible')) {
            var scroll = $(this).scrollTop();

            if (scroll > last_scroll) {
                $('#main-header').addClass('hide');
            } else {
                $('#main-header').removeClass('hide');
            }

            last_scroll = scroll;
        }
    });

}



/** BACKGROUND IMAGES */
/** ===================== */

function imageBG() {

    $('.imageBG').each(function() {
        var image = $(this).data('img');

        $(this).css({
            backgroundImage: 'url(' + image + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
        });
    });

}


/** GRID */
/** ===================== */

function grid() {

    // Read the width here rather than trusting the resize handler to have run
    // first. watch_grid_width() calls grid() for things that fire no resize
    // event at all — a late stylesheet, a font swap — and picking the layout
    // from a stale ww would leave the wrong breakpoint's styles applied.
    ww = win.width();
    wh = win.height();

    var container = $('.grid');

    for (var i = 0; i < container.length; i++) {
        var active_container = $(container[i]);

        var items = active_container.find('.entry');

        var cols = parseInt(active_container.data('cols'), 10);
        var margin = parseInt(active_container.data('margin'), 10);
        var height = parseFloat(active_container.data('height'));
        var double_height = parseFloat(active_container.data('double-height'));

        if (!margin) margin = 0;
        if (!double_height) double_height = 2;

        // set margins to the container, then measure — measuring first would give a
        // different (narrower) width on the initial run than on every later run
        active_container.css('margin', -Math.floor(margin / 2) + 'px');
        var container_width = active_container.width();

        if (ww >= 1000) {
            if (!cols) cols = 3;
        } else if (ww >= 700) {
            if (cols !== 1) cols = 2;
        } else {
            cols = 1;
        }

        // Mobile: hand the layout over to CSS + the card deck instead of masonry
        if (cols === 1) {
            // isotope no-ops safely if it was never initialized on this element
            try { active_container.isotope('destroy'); } catch (e) {}
            active_container.addClass('grid-mobile-stack');
            // clear any inline sizing/positioning isotope may have applied
            active_container.css({ margin: '', height: '', position: '' });
            items.css({ width: '', height: '', margin: '', position: '', left: '', top: '', transform: '' });
            deck_init(active_container);
            continue;
        } else {
            active_container.removeClass('grid-mobile-stack');
            deck_teardown(active_container);
        }

        // -1 leaves a pixel of slack per column. Without it cols * (items_width + margin)
        // exactly equals the container width, and any subpixel rounding makes isotope
        // fit one column fewer — collapsing the whole grid into a single column.
        var items_width = Math.floor((container_width / cols) - margin) - 1;
        var items_height = Math.floor(items_width * height);
        var items_double_height = items_height * double_height;
        var items_margin = Math.floor(margin / 2);

        // Rebuild from scratch. Re-passing options to a live instance keeps the old
        // column geometry cached, which strands tiles at the previous breakpoint's
        // offsets when the viewport changes.
        try { active_container.isotope('destroy'); } catch (e) {}

        items.each(function() {
            $(this).css('width', items_width + 'px');
            $(this).css('height', items_height + 'px');
            $(this).css('margin', items_margin + 'px');

            if (!height) $(this).css('height', 'auto');
            if ($(this).hasClass('w2') && ww >= 500) $(this).css('width', (items_width * 2) + (items_margin * 2) + 'px');  /* Add w2 or h2 to the portfolio item for varoius layout sizes */
            if ($(this).hasClass('h2') && ww >= 500) $(this).css('height', items_double_height + (items_margin * 2) + 'px');
        });

        // isotope
        active_container.isotope({
            itemSelector: '.entry',
            // no animated reflow: on resize the tween can be interrupted and leave
            // items stranded mid-transform, stacking them into the first column
            transitionDuration: 0,
            hiddenStyle: {
                opacity: 0
            },
            visibleStyle: {
                opacity: 1
            },
            masonry: {
                columnWidth: items_width + margin

            }
        });

        $('#filters li a').on('click', function(e) {
            e.preventDefault();

            var filter = $(this).attr('href');

            $('#filters li a').removeClass('active');
            $(this).addClass('active');

            active_container.isotope({
                filter: filter
            });
        });
    };

}


/** MOBILE CARD DECK */
/** ===================== */

/**
 * Every card sits stacked in the same square and is placed purely by transform.
 * A card's "slot" is how far back in the deck it currently sits: slot 0 is the
 * front card, 1/2/3 are tucked behind it, and slots wrap around — so the card
 * swiped off the top becomes the last slot and the deck loops forever.
 *
 * `d` is that slot plus the in-progress drag, so it goes fractional while a
 * finger is down and the whole deck interpolates smoothly.
 *
 * This is driven by touch rather than a scroll container: a looping deck has no
 * scroll extent, and we need swipes that start on the card to cycle it while
 * swipes that start beside it still scroll the page.
 */

// how far below the front card each successive card peeks out
function deck_offset(d) {
    if (d < 0) return d * 60;
    return 26 * Math.min(d, 1) +
           22 * Math.max(0, Math.min(d - 1, 1)) +
           16 * Math.max(0, Math.min(d - 2, 1));
}

// cards further back sit slightly smaller, which reads as depth
function deck_scale(d) {
    if (d < 0) return 1;
    return 1 -
           0.05 * Math.min(d, 1) -
           0.05 * Math.max(0, Math.min(d - 1, 1)) -
           0.03 * Math.max(0, Math.min(d - 2, 1));
}

// the outgoing card fades as it leaves; anything past the third is not drawn
function deck_opacity(d) {
    if (d < 0) return Math.max(0, 1 + d * 1.2);
    if (d > 3) return Math.max(0, 1 - (d - 3));
    return 1;
}

function deck_render(el) {

    var cards = el.querySelectorAll('.entry');
    var n = cards.length;
    if (!n) return;

    var active = el.deck_active || 0;
    var progress = el.deck_progress || 0;

    for (var i = 0; i < n; i++) {
        var card = cards[i];

        // wrapping is what makes the deck a loop: once `active` moves past this
        // card, its slot comes out the other end and it sits at the back
        var slot = (((i - active) % n) + n) % n;
        var d = slot - progress;

        // each card keeps its own tilt, exaggerated deeper into the stack
        var tilt = (i % 2 ? 1.4 : -1.4) * (1 + 0.3 * Math.min(Math.max(d, 0), 3));

        card.style.transform =
            'translateY(' + deck_offset(d).toFixed(2) + 'px)' +
            ' scale(' + deck_scale(d).toFixed(3) + ')' +
            ' rotate(' + tilt.toFixed(2) + 'deg)';
        card.style.opacity = deck_opacity(d).toFixed(3);
        card.style.zIndex = d < 0 ? 200 : Math.max(0, 100 - Math.round(d * 10));
        // only the front card takes taps and drags; everything behind it lets
        // touches through to the page so margins still scroll
        card.style.pointerEvents = Math.abs(d) < 0.5 ? '' : 'none';
    }

    // the dot flips as soon as the drag passes halfway, so the indicator keeps
    // up with the finger rather than waiting for the card to land
    var dots = el.deck_dots;
    if (dots) {
        var shown = (((active + Math.round(progress)) % n) + n) % n;
        for (var k = 0; k < dots.children.length; k++) {
            dots.children[k].classList.toggle('is-active', k === shown);
        }
    }

}

// transitions are only on while the deck settles, so a drag tracks the finger
function deck_animate(el, on) {
    var cards = el.querySelectorAll('.entry');
    for (var i = 0; i < cards.length; i++) {
        cards[i].classList.toggle('deck-animate', !!on);
    }
}

function deck_step(el, dir) {
    var n = el.querySelectorAll('.entry').length;
    if (!n) return;
    el.deck_active = (((el.deck_active || 0) + dir) % n + n) % n;
    el.deck_progress = 0;
    deck_animate(el, true);
    deck_render(el);
}

// how far the finger must travel for one full card advance
function deck_travel(el) {
    var card = el.querySelector('.entry');
    return card ? Math.max(60, card.offsetHeight * 0.45) : 140;
}

function deck_bind(el) {

    var dragging = false;
    var start_y = 0;
    var moved = 0;

    // a swipe only belongs to the deck if it began on the front card
    function on_front_card(x, y) {
        var cards = el.querySelectorAll('.entry');
        var front = cards[(el.deck_active || 0) % (cards.length || 1)];
        if (!front) return false;
        var r = front.getBoundingClientRect();
        return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    }

    function finish() {
        if (!dragging) return;
        dragging = false;

        var p = el.deck_progress || 0;
        deck_animate(el, true);

        if (p > 0.25) deck_step(el, 1);
        else if (p < -0.25) deck_step(el, -1);
        else { el.deck_progress = 0; deck_render(el); }
    }

    el.addEventListener('touchstart', function(e) {
        var t = e.touches[0];
        if (!on_front_card(t.clientX, t.clientY)) return;
        dragging = true;
        start_y = t.clientY;
        moved = 0;
        deck_animate(el, false);
    }, { passive: true });

    // not passive: this is the handler that keeps the page still while the
    // deck is being dragged
    el.addEventListener('touchmove', function(e) {
        if (!dragging) return;
        var dy = e.touches[0].clientY - start_y;
        moved = Math.abs(dy);
        e.preventDefault();
        el.deck_progress = Math.max(-1, Math.min(1, -dy / deck_travel(el)));
        deck_render(el);
    }, { passive: false });

    el.addEventListener('touchend', finish);
    el.addEventListener('touchcancel', finish);

    // a drag must not also follow the card's link
    el.addEventListener('click', function(e) {
        if (moved > 10) {
            e.preventDefault();
            e.stopPropagation();
        }
        moved = 0;
    }, true);

    // trackpad / mouse wheel over the card cycles it too, so the deck behaves
    // the same way in a desktop device-emulator
    var wheel_lock = false;
    el.addEventListener('wheel', function(e) {
        if (!on_front_card(e.clientX, e.clientY)) return;
        e.preventDefault();
        if (wheel_lock || Math.abs(e.deltaY) < 8) return;
        wheel_lock = true;
        setTimeout(function() { wheel_lock = false; }, 340);
        deck_step(el, e.deltaY > 0 ? 1 : -1);
    }, { passive: false });

}

/**
 * Page indicator. Built here rather than in the markup so it always matches the
 * number of works, and inserted after the deck so it sits clear of the cards.
 * It is decorative — the cards themselves are the real navigation — so it is
 * hidden from assistive tech.
 */
function deck_dots_build(el) {

    var n = el.querySelectorAll('.entry').length;
    if (!n) return;

    var dots = el.deck_dots;

    if (!dots) {
        dots = document.createElement('div');
        dots.className = 'deck-dots';
        dots.setAttribute('aria-hidden', 'true');
        el.parentNode.insertBefore(dots, el.nextSibling);
        el.deck_dots = dots;
    }

    if (dots.childElementCount !== n) {
        dots.innerHTML = '';
        for (var i = 0; i < n; i++) {
            dots.appendChild(document.createElement('span')).className = 'deck-dot';
        }
    }

}

function deck_init(container) {

    var el = container[0];
    if (!el) return;

    if (el.deck_active == null) el.deck_active = 0;
    el.deck_progress = 0;

    if (!el.deck_bound) {
        el.deck_bound = true;
        deck_bind(el);
    }

    deck_dots_build(el);

    // no animation for the initial placement or a resize reflow
    deck_animate(el, false);
    deck_render(el);

}

function deck_teardown(container) {

    container.find('.entry')
        .removeClass('deck-animate')
        .css({
            transform: '',
            opacity: '',
            zIndex: '',
            pointerEvents: ''
        });

}

// Simple image gallery logic (for research section)
const galleryImages = [
    {
        src: 'img/interlogue/interlogue-cover.avif',
        caption: 'Interlogue Cover'
    },
    {
        src: 'img/interlogue/interlogue-photo.avif',
        caption: 'Interlogue Photo'
    },
    {
        src: 'img/interlogue/interlogue-thumbnail.avif',
        caption: 'Interlogue Thumbnail'
    }
];
let currentIndex = 0;
const galleryImage = document.getElementById('galleryImage');
const galleryCaption = document.getElementById('galleryCaption');
if (galleryImage && galleryCaption) {
    document.getElementById('galleryPrev').onclick = function() {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        galleryImage.src = galleryImages[currentIndex].src;
        galleryCaption.textContent = galleryImages[currentIndex].caption;
    };
    document.getElementById('galleryNext').onclick = function() {
        currentIndex = (currentIndex + 1) % galleryImages.length;
        galleryImage.src = galleryImages[currentIndex].src;
        galleryCaption.textContent = galleryImages[currentIndex].caption;
    };
}

// Gallery text page switching
document.addEventListener('DOMContentLoaded', function() {
    var page1 = document.getElementById('galleryPage1');
    var page2 = document.getElementById('galleryPage2');
    var page3 = document.getElementById('galleryPage3');
    var dot1 = document.getElementById('sliderDot1');
    var dot2 = document.getElementById('sliderDot2');
    var dot3 = document.getElementById('sliderDot3');
    var nextBtn = document.getElementById('galleryNext');
    var prevBtn = document.getElementById('galleryPrev');
    var nextBtnMobile = document.getElementById('galleryNextMobile');
    var prevBtnMobile = document.getElementById('galleryPrevMobile');
    var currentPage = 1;

    function showPage(pageNum) {
        // Hide all pages
        page1.style.display = 'none';
        page2.style.display = 'none';
        page3.style.display = 'none';
        
        // Reset all dots
        dot1.style.background = '#bbb';
        dot2.style.background = '#bbb';
        dot3.style.background = '#bbb';
        
        // Show selected page and highlight dot
        if (pageNum === 1) {
            page1.style.display = '';
            dot1.style.background = '#333';
        } else if (pageNum === 2) {
            page2.style.display = '';
            dot2.style.background = '#333';
        } else if (pageNum === 3) {
            page3.style.display = '';
            dot3.style.background = '#333';
        }
        currentPage = pageNum;
    }

    function nextPage() {
        if (currentPage < 3) {
            showPage(currentPage + 1);
        } else {
            showPage(1); // Loop back to first page
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        } else {
            showPage(3); // Loop to last page
        }
    }

    // Add event listeners only if elements exist
    if(dot1 && dot2 && dot3) {
        dot1.addEventListener('click', () => showPage(1));
        dot2.addEventListener('click', () => showPage(2));
        dot3.addEventListener('click', () => showPage(3));
    }

    if(nextBtn && prevBtn && nextBtnMobile && prevBtnMobile) {
        nextBtn.addEventListener('click', nextPage);
        prevBtn.addEventListener('click', prevPage);
        nextBtnMobile.addEventListener('click', nextPage);
        prevBtnMobile.addEventListener('click', prevPage);
        
        // Set initial state
        showPage(1);
    }
});

// Final Outcome Photo Gallery Logic
const finalGalleryImages = [
    {
        src: 'img/interlogue/interlogue-cover.jpg',
        caption: 'Interlogue Cover'
    },
    {
        src: 'img/interlogue/content testing 02.jpg',
        caption: 'Interlogue Programme in Action'
    },
    {
        src: 'img/interlogue/interlogue-thumbnail.jpg',
        caption: 'Interlogue Activity Book'
    }
];
let finalGalleryIndex = 0;
const finalGalleryImage = document.getElementById('finalGalleryImage');
const finalGalleryCaption = document.getElementById('finalGalleryCaption');
if (finalGalleryImage && finalGalleryCaption) {
    document.getElementById('finalGalleryPrev').onclick = function() {
        finalGalleryIndex = (finalGalleryIndex - 1 + finalGalleryImages.length) % finalGalleryImages.length;
        finalGalleryImage.src = finalGalleryImages[finalGalleryIndex].src;
        finalGalleryCaption.textContent = finalGalleryImages[finalGalleryIndex].caption;
    };
    document.getElementById('finalGalleryNext').onclick = function() {
        finalGalleryIndex = (finalGalleryIndex + 1) % finalGalleryImages.length;
        finalGalleryImage.src = finalGalleryImages[finalGalleryIndex].src;
        finalGalleryCaption.textContent = finalGalleryImages[finalGalleryIndex].caption;
    };
    // Initial display
    finalGalleryImage.src = finalGalleryImages[finalGalleryIndex].src;
    finalGalleryCaption.textContent = finalGalleryImages[finalGalleryIndex].caption;
}

// --- Parallax effect ---
(function() {
    var parallaxEls = document.querySelectorAll('.parallax');
    parallaxEls.forEach(function(img) {
        var container = img.parentElement;
        function parallaxScroll() {
            var rect = container.getBoundingClientRect();
            var windowHeight = window.innerHeight;
            if (rect.bottom > 0 && rect.top < windowHeight) {
                var speed = 0.8;
                var offset = (window.scrollY - container.offsetTop) * speed;
                img.style.transform = 'translateY(' + offset + 'px)';
            }
        }
        window.addEventListener('scroll', parallaxScroll, {passive:true});
        window.addEventListener('resize', parallaxScroll);
        document.addEventListener('DOMContentLoaded', parallaxScroll);
    });
})();

// Content Testing Gallery Auto-Rotation
document.addEventListener('DOMContentLoaded', function() {
    const contentTestingImages = [
        {
            src: "img/interlogue/Content Testing 02.jpg", 
            caption: "Drawing by J (6yo)"
        },
        {
            src: "img/interlogue/Content Testing 03.jpg",
            caption: "Drawing by C (8yo) with grandma"
        },
        {
            src: "img/interlogue/Content Testing 04.jpg",
            caption: "Participants and their grandparents working on the activities in the Gallery"
        },
        {
            src: "img/interlogue/Content Testing 05.jpg",
            caption: "E and his grandpa reading the book to complete the activitiy in the Gallery"
        },
    ];

    let currentContentTestingIndex = 0;
    const contentTestingImg = document.getElementById('contentTestingGalleryImage');
    const contentTestingImgNext = document.getElementById('contentTestingGalleryImageNext');
    const contentTestingCaption = document.getElementById('contentTestingCaption');

    // Only initialize if elements exist (for interlogue.html page)
    if (contentTestingImg && contentTestingImgNext && contentTestingCaption) {
        function updateContentTestingGallery() {
            const nextIndex = (currentContentTestingIndex + 1) % contentTestingImages.length;
            
            // Prepare next image
            contentTestingImgNext.src = contentTestingImages[nextIndex].src;
            contentTestingImgNext.style.opacity = '0';
            
            // Start transition
            requestAnimationFrame(() => {
                contentTestingImgNext.style.opacity = '1';
                setTimeout(() => {
                    // Update current image and reset next image
                    contentTestingImg.src = contentTestingImages[nextIndex].src;
                    contentTestingImgNext.style.opacity = '0';
                    contentTestingCaption.textContent = contentTestingImages[nextIndex].caption;
                    currentContentTestingIndex = nextIndex;
                }, 500);
            });
        }

        // Initial state
        contentTestingImgNext.src = contentTestingImages[0].src;
        
        // Auto rotate every 3 seconds
        setInterval(updateContentTestingGallery, 3000);
    }
});

/* ============================================================
   Scroll Story (Miles Redemption / Seller Ecosystem)
   ============================================================ */
function initScrollStage(stageId, phoneScaleId, screenPrefix, images, screenTransition) {
  "use strict";

  var stage = document.getElementById(stageId);
  if (!stage) return;

  var crossfade = screenTransition === "fade";

  function mountScreens() {
    images.forEach(function (src, i) {
      var slot = document.getElementById(screenPrefix + "-" + i);
      if (slot) {
        var img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.style.cssText = "width:393px;height:852px;object-fit:cover;display:block;";
        slot.appendChild(img);
      }
    });
  }

  var phoneScale = document.getElementById(phoneScaleId);
  var navButtons = Array.prototype.slice.call(stage.querySelectorAll(".step-btn"));
  var drivers = Array.prototype.slice.call(stage.querySelectorAll(".driver"));
  var screenSlots = Array.prototype.slice.call(stage.querySelectorAll(".screen-slot"));
  var current = 0;

  if (crossfade && screenSlots[0]) {
    screenSlots[0].classList.add("is-active");
  }

  function setStep(i) {
    if (i === current) return;
    current = i;
    stage.style.setProperty("--step", i);
    navButtons.forEach(function (b, n) {
      b.classList.toggle("is-active", n === i);
    });
    if (crossfade) {
      screenSlots.forEach(function (s, n) {
        s.classList.toggle("is-active", n === i);
      });
    }
  }

  function computeScale() {
    if (!phoneScale) return;
    var s = Math.min((480 - 48) / 417, (window.innerHeight - 48) / 900);
    phoneScale.style.setProperty("--scale", s);
  }

  navButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var i = parseInt(btn.getAttribute("data-step"), 10);
      var d = drivers[i];
      if (!d) return;
      var scroller = document.scrollingElement || document.documentElement;
      var r = d.getBoundingClientRect();
      var target = scroller.scrollTop + r.top + r.height / 2 - window.innerHeight / 2;
      scroller.scrollTo({ top: target, behavior: "smooth" });
    });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var i = drivers.indexOf(e.target);
        if (i >= 0) setStep(i);
      }
    });
  }, { rootMargin: "-50% 0px -50% 0px", threshold: 0 });
  drivers.forEach(function (d) { io.observe(d); });

  function onScroll() {
    var mid = window.innerHeight / 2;
    var best = 0, bestD = Infinity;
    drivers.forEach(function (d, i) {
      var r = d.getBoundingClientRect();
      var dist = Math.abs(r.top + r.height / 2 - mid);
      if (dist < bestD) { bestD = dist; best = i; }
    });
    setStep(best);
  }
  window.addEventListener("scroll", onScroll, { passive: true, capture: true });
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });
  window.addEventListener("resize", computeScale);

  computeScale();

  // Lazy-load screen images only when the scroll story enters the viewport
  if ('IntersectionObserver' in window) {
    var imgObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          mountScreens();
          imgObserver.disconnect();
        }
      });
    }, { rootMargin: '200px 0px' });
    imgObserver.observe(stage);
  } else {
    mountScreens();
  }
}

initScrollStage("mr-stage", "mrPhoneScale", "mr-screen", [
  "img/krisshop-australia/KSO_AU_Homepage.webp",
  "img/krisshop-australia/KSO_AU_CampaignPage.webp",
  "img/krisshop-australia/KSO_AU_PDP.webp",
  "img/krisshop-australia/KSO_AU_Bag.webp"
]);

initScrollStage("loc-stage", null, null, []);

initScrollStage("sel-stage", "selPhoneScale", "sel-screen", [
  "img/krisshop-australia/seller-ecosystem-00.webp",
  "img/krisshop-australia/seller-ecosystem-01.webp",
  "img/krisshop-australia/seller-ecosystem-02.webp",
  "img/krisshop-australia/seller-ecosystem-03.webp",
  "img/krisshop-australia/seller-ecosystem-04.webp"
], "fade");
