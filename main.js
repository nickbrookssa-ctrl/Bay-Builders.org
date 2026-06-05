// ═══════════════════════════════════════
// BAY BUILDERS — CINEMATIC EXPERIENCE
// ═══════════════════════════════════════

// LOADER FIX
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => loader.style.display = "none", 500);
  }, 800);
});

// ─────────────────────────────────────
// BASIC UI
// ─────────────────────────────────────

// CURSOR
const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursor-follower");

document.addEventListener("mousemove", (e) => {
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  follower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
});

// MOBILE MENU
document.getElementById("navBurger").onclick = () => {
  document.getElementById("mobMenu").classList.toggle("open");
};

// SCROLL REVEAL
const reveals = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");

window.addEventListener("scroll", () => {
  const trigger = window.innerHeight * 0.85;

  reveals.forEach((el) => {
    if (el.getBoundingClientRect().top < trigger) {
      el.classList.add("in-view");
    }
  });
});

// ─────────────────────────────────────
// 3D SCENE
// ─────────────────────────────────────

const canvas = document.getElementById("threeCanvas");

if (canvas && window.THREE) {

  const scene = new THREE.Scene();

  // CAMERA
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 100);
  camera.position.set(0, 2, 8);

  // RENDERER
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // LIGHTING (SUNSET STYLE)
  const sun = new THREE.DirectionalLight(0xffa07a, 1.2);
  sun.position.set(5, 10, 5);
  scene.add(sun);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  // GROUND
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // ─────────────────────────
  // HOUSE
  // ─────────────────────────

  const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
  const accentMat = new THREE.MeshStandardMaterial({ color: 0xD6815E });

  const foundation = new THREE.Mesh(
    new THREE.BoxGeometry(5, 0.3, 5),
    accentMat
  );
  foundation.position.y = 0.15;
  foundation.scale.set(0,1,0);
  scene.add(foundation);

  const house = new THREE.Mesh(
    new THREE.BoxGeometry(4.5, 2.5, 4.5),
    wallMat
  );
  house.position.y = 1.5;
  house.scale.set(0,1,0);
  scene.add(house);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.8, 4),
    roofMat
  );
  roof.position.y = 3.3;
  roof.rotation.y = Math.PI/4;
  roof.scale.set(0,0,0);
  scene.add(roof);

  // DOOR
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(0.8,1.5,0.1),
    accentMat
  );
  door.position.set(0,0.9,2.3);
  door.scale.set(0,1,1);
  scene.add(door);

  // WINDOWS
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x87CEEB,
    emissive: 0x222222
  });

  const w1 = new THREE.Mesh(new THREE.BoxGeometry(0.8,0.8,0.1), windowMat);
  w1.position.set(-1.2,1.8,2.3);
  w1.scale.set(0,1,1);
  scene.add(w1);

  const w2 = w1.clone();
  w2.position.set(1.2,1.8,2.3);
  scene.add(w2);

  // ─────────────────────────
  // CRANE
  // ─────────────────────────

  const crane = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.3,3,0.3),
    accentMat
  );
  base.position.y = 1.5;

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(4,0.2,0.2),
    accentMat
  );
  arm.position.set(2,3,0);

  crane.add(base);
  crane.add(arm);
  crane.position.set(-6,0,0);
  scene.add(crane);

  // ─────────────────────────
  // WORKER
  // ─────────────────────────

  const worker = new THREE.Mesh(
    new THREE.BoxGeometry(0.3,0.6,0.3),
    new THREE.MeshStandardMaterial({ color: 0xffff00 })
  );
  worker.position.set(0,0.5,2.5);
  scene.add(worker);

  // ─────────────────────────
  // ANIMATION TIMELINE
  // ─────────────────────────

  const tl = gsap.timeline({ paused: true });

  tl.to(foundation.scale, { x:1, z:1, duration:1 })
    .to(house.scale, { x:1, z:1, duration:1 })
    .to(roof.scale, { x:1, y:1, z:1, duration:1 })
    .to(door.scale, { x:1, duration:0.5 })
    .to(w1.scale, { x:1, duration:0.5 })
    .to(w2.scale, { x:1, duration:0.5 })

    // CRANE MOVE
    .to(crane.rotation, { y: Math.PI * 0.5, duration:2 }, 0)

    // WORKER CLIMB
    .to(worker.position, { y:2, duration:2 }, 1)

    // CAMERA MOVE
    .to(camera.position, { z:5, y:3, duration:2 }, 0);

  // SCROLL CONTROL
  window.addEventListener("scroll", () => {
    const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
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
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
