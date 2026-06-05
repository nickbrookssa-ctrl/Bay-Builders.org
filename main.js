// ═══════════════════════════════════════
// BAY BUILDERS — REAL 3D MODEL VERSION
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

// ─────────────────────────────
// THREE JS SETUP
// ─────────────────────────────

const canvas = document.getElementById("threeCanvas");

const scene = new THREE.Scene();

// CAMERA
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 8);

// RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

// SHADOWS
renderer.shadowMap.enabled = true;

// LIGHTING
const sun = new THREE.DirectionalLight(0xffa07a, 1.2);
sun.position.set(5, 10, 5);
sun.castShadow = true;
scene.add(sun);

const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

// GROUND
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(30, 30),
  new THREE.MeshStandardMaterial({ color: 0x222222 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ─────────────────────────────
// LOAD REAL 3D MODEL
// ─────────────────────────────

const loader = new THREE.GLTFLoader();

let houseModel;

loader.load(
  "house.glb",
  function (gltf) {
    houseModel = gltf.scene;

    houseModel.scale.set(1.5, 1.5, 1.5);
    houseModel.position.set(0, 0, 0);
    houseModel.rotation.y = Math.PI;

    houseModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(houseModel);

    // ANIMATE IN
    gsap.from(houseModel.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 2,
      ease: "power3.out"
    });
  },
  undefined,
  function (error) {
    console.error("Error loading model:", error);
  }
);

// ─────────────────────────────
// SCROLL CAMERA EFFECT
// ─────────────────────────────

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  camera.position.z = 8 - scrollY * 0.01;
  camera.position.y = 2 + scrollY * 0.005;
});

// ─────────────────────────────
// RENDER LOOP
// ─────────────────────────────

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

// ─────────────────────────────
// RESIZE
// ─────────────────────────────

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
