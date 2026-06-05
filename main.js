window.addEventListener("DOMContentLoaded", () => {

  const canvas = document.getElementById("threeCanvas");

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.6, 5);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });

  renderer.setSize(window.innerWidth, window.innerHeight);

  // LIGHTS
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  // FLOOR
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({ color: 0x222222 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // LOAD MODEL
  const loader = new THREE.GLTFLoader();
  let house;

  loader.load("house.glb", (gltf) => {
    house = gltf.scene;
    house.scale.set(1.5, 1.5, 1.5);
    scene.add(house);
  });

  // =========================
  // 🚪 DOOR (CUSTOM)
  // =========================

  const door = new THREE.Mesh(
    new THREE.BoxGeometry(1, 2, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x8B4513 })
  );

  door.position.set(0, 1, 0); // adjust if needed
  scene.add(door);

  let doorOpen = false;

  function toggleDoor() {
    if (doorOpen) {
      gsap.to(door.rotation, { y: 0, duration: 0.5 });
    } else {
      gsap.to(door.rotation, { y: -Math.PI / 2, duration: 0.5 });
    }
    doorOpen = !doorOpen;
  }

  // =========================
  // 🧱 COLLISION WALLS
  // =========================

  const walls = [];

  function addWall(x, z, w, d) {
    const wall = {
      minX: x - w / 2,
      maxX: x + w / 2,
      minZ: z - d / 2,
      maxZ: z + d / 2
    };
    walls.push(wall);
  }

  // Example house boundaries (adjust to your model)
  addWall(0, 0, 6, 6);

  function checkCollision(x, z) {
    for (let wall of walls) {
      if (
        x > wall.minX &&
        x < wall.maxX &&
        z > wall.minZ &&
        z < wall.maxZ
      ) {
        return true;
      }
    }
    return false;
  }

  // =========================
  // 🎮 CONTROLS
  // =========================

  const keys = {};

  document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;

    if (e.key.toLowerCase() === "e") {
      toggleDoor();
    }
  });

  document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
  });

  let yaw = 0;
  let pitch = 0;

  document.body.addEventListener("click", () => {
    document.body.requestPointerLock();
  });

  document.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement === document.body) {
      yaw -= e.movementX * 0.002;
      pitch -= e.movementY * 0.002;

      pitch = Math.max(-Math.PI/2, Math.min(Math.PI/2, pitch));
    }
  });

  const speed = 0.08;

  function move() {
    let moveX = 0;
    let moveZ = 0;

    if (keys["w"]) moveZ -= speed;
    if (keys["s"]) moveZ += speed;
    if (keys["a"]) moveX -= speed;
    if (keys["d"]) moveX += speed;

    const forward = new THREE.Vector3(
      Math.sin(yaw),
      0,
      Math.cos(yaw)
    );

    const right = new THREE.Vector3(
      Math.cos(yaw),
      0,
      -Math.sin(yaw)
    );

    const newX =
      camera.position.x +
      forward.x * moveZ +
      right.x * moveX;

    const newZ =
      camera.position.z +
      forward.z * moveZ +
      right.z * moveX;

    // COLLISION CHECK
    if (!checkCollision(newX, newZ)) {
      camera.position.x = newX;
      camera.position.z = newZ;
    }
  }

  // LOOP
  function animate() {
    requestAnimationFrame(animate);

    move();

    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

    renderer.render(scene, camera);
  }

  animate();

});
