// ═════════════════════════════
// CLEAN BAY BUILDERS 3D MODEL
// ═════════════════════════════

// SAFE LOADER (no crashes)
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");

  if (loader) {
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => loader.style.display = "none", 500);
    }, 1000);
  }
});

// ─────────────────────────────
// THREE JS SETUP
// ─────────────────────────────

const canvas = document.getElementById("threeCanvas");

// STOP if canvas missing
if (!canvas) {
  console.error("Canvas not found");
} else {

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(0, 2, 8);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // LIGHT
  const light = new THREE.DirectionalLight(0xffa07a, 1.2);
  light.position.set(5, 10, 5);
  light.castShadow = true;
  scene.add(light);

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
  // LOAD MODEL
  // ─────────────────────────────

  const loaderGLTF = new THREE.GLTFLoader();

  loaderGLTF.load(
    "house.glb",
    function (gltf) {
      const model = gltf.scene;

      model.scale.set(1.5, 1.5, 1.5);
      model.position.set(0, 0, 0);
      model.rotation.y = Math.PI;

      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      scene.add(model);

      // animate in
      gsap.from(model.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 2,
        ease: "power3.out"
      });
    },
    undefined,
    function (error) {
      console.error("MODEL ERROR:", error);
    }
  );

  // SCROLL CAMERA
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    camera.position.z = 8 - scrollY * 0.01;
    camera.position.y = 2 + scrollY * 0.005;
  });

  // LOOP
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
