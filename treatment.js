/* Vestadent — shared behaviour for treatment pages.
   Lightweight, no external deps: nav state, scroll reveal, custom cursor. */
(function () {
  var de = document.documentElement;
  de.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* nav background on scroll */
  var nav = document.querySelector('.nav');
  if (nav) addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', scrollY > 40);
  }, { passive: true });

  /* reveal on scroll */
  var items = [].slice.call(document.querySelectorAll('[data-reveal]'));
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* custom cursor (pointer devices only) */
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    var cur = document.querySelector('.cursor'), ring = document.querySelector('.cursor-r');
    if (cur && ring) {
      var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
      addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        cur.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      });
      (function loop() {
        rx += (mx - rx) * .16; ry += (my - ry) * .16;
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
        requestAnimationFrame(loop);
      })();
      document.querySelectorAll('a,button,.rcard,.faq summary').forEach(function (el) {
        el.addEventListener('mouseenter', function () { ring.classList.add('big'); });
        el.addEventListener('mouseleave', function () { ring.classList.remove('big'); });
      });
    }
  }
})();
