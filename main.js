// ═══════════════════════════════════════
// BAY BUILDERS — CLEAN WORKING JS
// ═══════════════════════════════════════

// LOADER
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }, 1000);
});

// CUSTOM CURSOR
const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursor-follower");

document.addEventListener("mousemove", (e) => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  follower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

// MOBILE MENU
const burger = document.getElementById("navBurger");
const menu = document.getElementById("mobMenu");

burger.addEventListener("click", () => {
  menu.classList.toggle("open");
});

// REVEAL ON SCROLL
const reveals = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");

function revealOnScroll() {
  const trigger = window.innerHeight * 0.85;

  reveals.forEach((el) => {
    const top = el.getBoundingClientRect().top;
    if (top < trigger) {
      el.classList.add("in-view");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

// STATS COUNTER
const stats = document.querySelectorAll(".stat-n");

function animateStats() {
  stats.forEach((stat) => {
    const target = +stat.getAttribute("data-target");
    let count = 0;

    const update = () => {
      count += target / 100;
      if (count < target) {
        stat.innerText = Math.floor(count);
        requestAnimationFrame(update);
      } else {
        stat.innerText = target;
      }
    };

    update();
  });
}

window.addEventListener("scroll", animateStats);

// PROJECT FILTER
const filterBtns = document.querySelectorAll(".pf-btn");
const cards = document.querySelectorAll(".proj-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".pf-btn.active").classList.remove("active");
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    cards.forEach((card) => {
      if (filter === "all" || card.dataset.cat === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// ═══════════════════════════════════════
// 3D HOUSE (WORKING VERSION)
// ═══════════════════════════════════════

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
    new THREE.MeshStandardMaterial({ color: 0x222222 })
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

  // GSAP TIMELINE
  const tl = gsap.timeline({ paused: true });

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

  // RESIZE
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
