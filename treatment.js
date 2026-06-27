/* Vestadent — shared behaviour for treatment pages.
   Motion language mirrors the homepage: Lenis smooth scroll, GSAP reveals/parallax,
   SVG path draw, custom cursor, and a lazily-initialised three.js implant model.
   Everything degrades gracefully without JS or with prefers-reduced-motion. */
(function () {
  var de = document.documentElement;
  de.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';

  /* nav background on scroll */
  var nav = document.querySelector('.nav');
  if (nav) addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', scrollY > 40);
  }, { passive: true });

  if (hasGSAP && !reduce && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  /* smooth scroll (Lenis) */
  if (window.Lenis && !reduce) {
    var lenis = new Lenis({ lerp: .1, smoothWheel: true });
    if (hasGSAP && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }

  /* scroll progress bar */
  var prog = document.querySelector('.prog');
  if (prog && hasGSAP && !reduce) {
    gsap.to(prog, { width: '100%', ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .3 } });
  }

  /* reveals */
  var items = [].slice.call(document.querySelectorAll('[data-reveal]'));
  if (reduce || !hasGSAP) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    items.forEach(function (el) {
      gsap.fromTo(el, { y: 34, opacity: 0 }, {
        y: 0, opacity: 1, duration: .9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' },
        onStart: function () { el.classList.add('in'); }
      });
    });
    /* parallax */
    gsap.utils.toArray('[data-parallax]').forEach(function (el) {
      var amt = parseFloat(el.getAttribute('data-parallax')) || 16;
      var host = el.closest('section, header') || el;
      gsap.to(el, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: host, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    /* SVG path draw */
    gsap.utils.toArray('[data-draw]').forEach(function (svg) {
      var shapes = svg.querySelectorAll('path,line,polyline,circle,rect');
      shapes.forEach(function (p) {
        var len = 0; try { len = p.getTotalLength ? p.getTotalLength() : 0; } catch (e) {}
        if (!len) return;
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        gsap.to(p, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', scrollTrigger: { trigger: svg, start: 'top 82%' } });
      });
    });
  }

  /* hero arch motif draw on load */
  var arch = document.querySelector('.viz-arch path');
  if (arch && hasGSAP && !reduce) {
    try {
      var L = arch.getTotalLength();
      gsap.set(arch, { strokeDasharray: L, strokeDashoffset: L });
      gsap.to(arch, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut', delay: .2 });
    } catch (e) {}
  }

  /* custom cursor (fine-pointer devices only) */
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
      document.querySelectorAll('a,button,.rcard,.faq summary,.hero3d').forEach(function (el) {
        el.addEventListener('mouseenter', function () { ring.classList.add('big'); });
        el.addEventListener('mouseleave', function () { ring.classList.remove('big'); });
      });
    }
  }

  /* 3D implant model — lazy init when the hero visual enters the viewport */
  var host = document.querySelector('[data-hero3d]');
  if (host && 'IntersectionObserver' in window) {
    var done = false;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !done) {
          done = true; io.disconnect();
          waitForThree(function () { buildImplant(host, parseInt(host.getAttribute('data-count') || '1', 10), reduce); });
        }
      });
    }, { rootMargin: '300px' });
    io.observe(host);
  }

  function waitForThree(cb, tries) {
    tries = tries || 0;
    if (typeof window.THREE !== 'undefined') return cb();
    if (tries > 60) return; /* give up after ~3s */
    setTimeout(function () { waitForThree(cb, tries + 1); }, 50);
  }

  function buildImplant(host, count, reduce) {
    var fb = host.querySelector('.viz-fallback'); if (fb) fb.style.opacity = 0;
    var w = host.clientWidth, hh = host.clientHeight;
    if (!w || !hh) return;
    var scene = new THREE.Scene();
    var cam = new THREE.PerspectiveCamera(34, w / hh, 0.1, 100);
    cam.position.set(0, 0.3, count > 1 ? 11 : 8.2);
    var rnd = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    rnd.setPixelRatio(Math.min(2, devicePixelRatio)); rnd.setSize(w, hh);
    host.appendChild(rnd.domElement);

    var ti = new THREE.MeshPhongMaterial({ color: 0xC4CAD2, shininess: 130, specular: 0xa9c6de });
    var cer = new THREE.MeshPhongMaterial({ color: 0xF3F7FC, shininess: 70, specular: 0xffffff });

    class Helix extends THREE.Curve {
      constructor(turns, top, bottom, rad) { super(); this.turns = turns; this.top = top; this.bot = bottom; this.rad = rad; }
      getPoint(t) {
        var a = t * this.turns * Math.PI * 2, y = this.top - t * (this.top - this.bot), r = this.rad - 0.06 * t;
        return new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
      }
    }

    function makeImplant() {
      var g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.46, 2.5, 40), ti));
      var tip = new THREE.Mesh(new THREE.ConeGeometry(0.46, 0.7, 40), ti); tip.position.y = -1.6; tip.rotation.x = Math.PI; g.add(tip);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(new Helix(9, 1.15, -1.4, 0.52), 360, 0.07, 8, false), ti));
      var abut = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.5, 0.7, 36), ti); abut.position.y = 1.55; g.add(abut);
      var crown = new THREE.Mesh(new THREE.SphereGeometry(0.66, 36, 28), cer); crown.scale.set(1, 0.78, 1); crown.position.y = 2.4; g.add(crown);
      for (var c = 0; c < 4; c++) {
        var cusp = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 14), cer);
        cusp.position.set(Math.cos(c / 4 * Math.PI * 2) * 0.32, 2.62, Math.sin(c / 4 * Math.PI * 2) * 0.32); g.add(cusp);
      }
      return g;
    }

    var root = new THREE.Group(); scene.add(root);
    if (count <= 1) {
      var one = makeImplant(); one.position.y = -0.4; root.add(one);
    } else {
      var spread = 2.5, n = count;
      for (var i = 0; i < n; i++) {
        var im = makeImplant();
        var f = n > 1 ? (i / (n - 1) - 0.5) : 0;        /* -0.5 .. 0.5 */
        im.scale.setScalar(0.62);
        im.position.set(f * spread * 2, -0.4 - Math.abs(f) * 0.2, -Math.abs(f) * 1.6);  /* gentle arch */
        im.rotation.z = -f * 0.5;
        root.add(im);
      }
      /* faint bridge arc */
      var arcCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(-spread, 1.7, -1.8), new THREE.Vector3(0, 2.3, 0.4), new THREE.Vector3(spread, 1.7, -1.8));
      var bridge = new THREE.Mesh(new THREE.TubeGeometry(arcCurve, 60, 0.12, 8, false),
        new THREE.MeshPhongMaterial({ color: 0xF3F7FC, shininess: 60, transparent: true, opacity: 0.5 }));
      root.add(bridge);
    }

    scene.add(new THREE.AmbientLight(0xacc4dc, 0.85));
    var key = new THREE.DirectionalLight(0xffffff, 0.95); key.position.set(4, 7, 6); scene.add(key);
    var rim = new THREE.PointLight(0x5FC2EC, 1.3, 40); rim.position.set(-6, 1, 4); scene.add(rim);
    var fill = new THREE.PointLight(0xffffff, 0.55, 40); fill.position.set(4, -3, 5); scene.add(fill);

    var tRY = 0.5, tRX = 0, cRY = 0.5, cRX = 0, drag = false, lx = 0, auto = !reduce;
    host.addEventListener('pointerdown', function (e) { drag = true; auto = false; lx = e.clientX; host.style.cursor = 'grabbing'; host.setPointerCapture(e.pointerId); });
    host.addEventListener('pointermove', function (e) {
      if (drag) { tRY += (e.clientX - lx) * 0.01; lx = e.clientX; }
      var r = host.getBoundingClientRect(); tRX = ((e.clientY - r.top) / r.height - 0.5) * 0.5;
    });
    addEventListener('pointerup', function () { drag = false; host.style.cursor = 'grab'; });

    var running = true;
    function frame() {
      if (!running) return;
      requestAnimationFrame(frame);
      if (auto) tRY += 0.004;
      cRY += (tRY - cRY) * 0.08; cRX += (tRX - cRX) * 0.08;
      root.rotation.y = cRY; root.rotation.x = cRX; rnd.render(scene, cam);
    }
    frame();
    if (reduce) { auto = false; rnd.render(scene, cam); }  /* render a single static frame */

    addEventListener('resize', function () {
      w = host.clientWidth; hh = host.clientHeight; if (!w || !hh) return;
      cam.aspect = w / hh; cam.updateProjectionMatrix(); rnd.setSize(w, hh);
    });
    /* pause render loop when offscreen to save battery */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting && !running) { running = true; frame(); } else if (!e.isIntersecting) { running = false; } });
      }, { threshold: 0 }).observe(host);
    }
  }
})();
