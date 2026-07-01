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

});

win.on('load', function() {

    $('#preloader').addClass('hide');

    // load functions
    grid();

});

win.on('resize', function() {

    // viewport dimensions
    ww = win.width();
    wh = win.height();

    // load functions
    grid();
    

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

    var container = $('.grid');

    for (var i = 0; i < container.length; i++) {
        var active_container = $(container[i]);
        var container_width = active_container.width();

        var items = active_container.find('.entry');

        var cols = parseInt(active_container.data('cols'), 10);
        var margin = parseInt(active_container.data('margin'), 10);
        var height = parseFloat(active_container.data('height'));
        var double_height = parseFloat(active_container.data('double-height'));

        if (!margin) margin = 0;
        if (!double_height) double_height = 2;

        // set margins to the container
        active_container.css('margin', -Math.floor(margin / 2) + 'px');

        if (ww >= 1000) {
            if (!cols) cols = 3;
        } else if (ww >= 700) {
            if (cols !== 1) cols = 2;
        } else {
            cols = 1;
        }

        var items_width = Math.floor((container_width / cols) - margin);
        var items_height = Math.floor(items_width * height);
        var items_double_height = items_height * double_height;
        var items_margin = Math.floor(margin / 2);

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
            transitionDuration: '.2s',
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
   Miles Redemption Scroll Story
   ============================================================ */
(function () {
  "use strict";

  if (!document.getElementById("mr-stage")) return;

  var SCREEN_IMAGES = [
    "img/krisshop-australia/KSO_AU_Homepage.png",
    "img/krisshop-australia/KSO_AU_CampaignPage.png",
    "img/krisshop-australia/KSO_AU_PDP.jpg",
    "img/krisshop-australia/KSO_AU_Bag.jpg"
  ];

  function mountScreens() {
    SCREEN_IMAGES.forEach(function (src, i) {
      var slot = document.getElementById("mr-screen-" + i);
      if (slot) {
        var img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.style.cssText = "width:393px;height:852px;object-fit:cover;display:block;";
        slot.appendChild(img);
      }
    });
  }

  var stage = document.getElementById("mr-stage");
  var phoneScale = document.getElementById("mrPhoneScale");
  var navButtons = Array.prototype.slice.call(stage.querySelectorAll(".step-btn"));
  var drivers = Array.prototype.slice.call(stage.querySelectorAll(".driver"));
  var current = 0;

  function setStep(i) {
    if (i === current) return;
    current = i;
    stage.style.setProperty("--step", i);
    navButtons.forEach(function (b, n) {
      b.classList.toggle("is-active", n === i);
    });
  }

  function computeScale() {
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
})();
