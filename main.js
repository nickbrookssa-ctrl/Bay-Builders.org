// ═══════════════════════════════════════
// BAY BUILDERS — MAIN JS (FIXED VERSION)
// ═══════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {

  // ─────────────────────────────────────
  // LOADER
  // ─────────────────────────────────────
  const loader = document.getElementById("loader");
  const pct = document.getElementById("loaderPct");
  const bar = document.getElementById("loaderBarFill");

  let load = 0;
  const interval = setInterval(() => {
    load++;
    pct.textContent = load + "%";
    bar.style.width = load + "%";

    if (load >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add("hidden");
      }, 500);
    }
  }, 20);

  // ─────────────────────────────────────
  // CUSTOM CURSOR
  // ─────────────────────────────────────
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

    follower.style.left = e.clientX + "px";
    follower.style.top = e.clientY + "px";
  });

  // ─────────────────────────────────────
  // NAV SCROLL
  // ─────────────────────────────────────
  const nav = document.getElementById("nav");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  // ─────────────────────────────────────
  // MOBILE MENU
  // ─────────────────────────────────────
  const burger = document.getElementById("navBurger");
  const menu = document.getElementById("mobMenu");

  burger.addEventListener("click", () => {
    burger.classList.toggle("open");
    menu.classList.toggle("open");
  });

  // ─────────────────────────────────────
  // REVEAL ON SCROLL
  // ─────────────────────────────────────
  const reveals = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add("in-view");
        }, delay * 1000);
      }
    });
  }, { threshold: 0.2 });

  reveals.forEach(el => observer.observe(el));

  // ─────────────────────────────────────
  // STATS COUNTER
  // ─────────────────────────────────────
  const counters = document.querySelectorAll(".stat-n");

  const countUp = (el) => {
    const target = +el.getAttribute("data-target");
    let count = 0;

    const update = () => {
      count += target / 50;
      if (count < target) {
        el.textContent = Math.floor(count);
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    };

    update();
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        countUp(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(c => statsObserver.observe(c));

  // ─────────────────────────────────────
  // PROJECT FILTER
  // ─────────────────────────────────────
  const filterBtns = document.querySelectorAll(".pf-btn");
  const projects = document.querySelectorAll(".proj-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelector(".pf-btn.active").classList.remove("active");
      btn.classList.add("active");

      const filter = btn.dataset.filter;

      projects.forEach(p => {
        if (filter === "all" || p.dataset.cat === filter) {
          p.classList.remove("hidden");
        } else {
          p.classList.add("hidden");
        }
      });
    });
  });

  // ─────────────────────────────────────
  // PARTICLES (HERO)
  // ─────────────────────────────────────
  const particleContainer = document.getElementById("heroParticles");

  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");

    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * 100 + "%";

    p.style.setProperty("--dx", Math.random() * 100 + "px");
    p.style.setProperty("--dy", Math.random() * 150 + "px");
    p.style.setProperty("--dur", 3 + Math.random() * 3 + "s");
    p.style.setProperty("--delay", Math.random() * 5 + "s");

    particleContainer.appendChild(p);
  }

  // ─────────────────────────────────────
  // MEASURING TAPE SCROLL
  // ─────────────────────────────────────
  const tape = document.getElementById("measureTape");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const height = document.body.scrollHeight - window.innerHeight;

    const progress = scrollY / height;

    if (progress > 0.1) {
      tape.classList.add("visible");
    }

    const tapeHeight = progress * 400;
    document.querySelector(".mt-body").style.height = tapeHeight + "px";
  });

  // ─────────────────────────────────────
// CINEMATIC 3D HOUSE BUILD
// ─────────────────────────────────────

const canvas = document.getElementById("threeCanvas");

if (canvas && window.THREE) {

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  camera.position.set(0, 2, 8);

  // LIGHTING
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  // MATERIAL
  const material = new THREE.MeshStandardMaterial({
    color: 0xD6815E,
    roughness: 0.6
  });

  // GROUND
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ color: 0xeeeeee })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // FOUNDATION
  const foundation = new THREE.Mesh(
    new THREE.BoxGeometry(4, 0.3, 4),
    material
  );
  foundation.position.y = 0.15;
  foundation.scale.set(0, 1, 0);
  scene.add(foundation);

  // WALLS
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4, 2, 4),
    material
  );
  walls.position.y = 1.2;
  walls.scale.set(0, 1, 0);
  scene.add(walls);

  // ROOF
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3, 1.5, 4),
    material
  );
  roof.position.y = 3;
  roof.rotation.y = Math.PI / 4;
  roof.scale.set(0, 0, 0);
  scene.add(roof);

  // ANIMATION TIMELINE
  const tl = gsap.timeline({
    paused: true
  });

  tl.to(foundation.scale, { x: 1, z: 1, duration: 1 })
    .to(walls.scale, { x: 1, z: 1, duration: 1 })
    .to(roof.scale, { x: 1, y: 1, z: 1, duration: 1 })
    .to(camera.position, { z: 5, y: 3, duration: 1 }, 0);

  // SCROLL CONTROL
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const height = document.body.scrollHeight - window.innerHeight;
    const progress = scrollY / height;

    tl.progress(progress);
  });

  // RENDER LOOP
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();

  // RESPONSIVE
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
