import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Lights
const ambiantLight = new THREE.AmbientLight(0xffffff, 1.4);
scene.add(ambiantLight);
gui.add(ambiantLight.position, "x").min(-10).max(10).step(0.01);
gui.add(ambiantLight.position, "y").min(-10).max(10).step(0.01);
gui.add(ambiantLight.position, "z").min(-10).max(10).step(0.01);
gui.add(ambiantLight, "intensity").min(0).max(10).step(0.01);

const light = new THREE.PointLight(0xffffff, 3.4);
light.position.set(1, 2, 3);
scene.add(light);

gui.add(light.position, "x").min(-10).max(10).step(0.01);
gui.add(light.position, "y").min(-10).max(10).step(0.01);
gui.add(light.position, "z").min(-10).max(10).step(0.01);
gui.add(light, "intensity").min(0).max(10).step(0.01);

const rgbeLoader = new RGBELoader();
// rgbeLoader.load("/textures/sun.hdr", (env) => {
//   env.mapping = THREE.EquirectangularReflectionMapping;
//   scene.background = env;
//   scene.environment = env;
// });

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const toonTexture = textureLoader.load("/textures/matcaps/7.png");
toonTexture.colorSpace = THREE.SRGBColorSpace;

const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

// FONTS
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("veeno", {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelOffset: 0,
    bevelSegments: 4,
    bevelThickness: 0.03,
    bevelSize: 0.02,
  });
  //   textGeometry.computeBoundingBox();
  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x - 0.02) / 2,
  //     -(textGeometry.boundingBox.max.y - 0.02) / 2,
  //     -(textGeometry.boundingBox.max.z - 0.03) / 2
  //   );
  textGeometry.center();
  const material = new THREE.MeshMatcapMaterial();
  material.matcap = matcapTexture;
  const text = new THREE.Mesh(textGeometry, material);

  scene.add(text);

  // TEXTURE
  material.metalness = 0.3;
  material.roughness = 0.2;
  //   material.iridescence = 1;
  //   material.iridescenceIOR = 1;
  //   material.transmission = 1;
  //   material.ior = 1.15;

  const axesHelper = new THREE.AxesHelper();
  scene.add(axesHelper);

  camera.lookAt(text.position);
  const donutGeometry = new THREE.OctahedronGeometry(1, 0);
  const donutMaterial = new THREE.MeshToonMaterial();
  donutMaterial.map = toonTexture;

  for (let i = 0; i < 300; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);

    donut.position.x = (Math.random() - 0.5) * 12;
    donut.position.y = (Math.random() - 0.5) * 12;
    donut.position.z = (Math.random() - 0.5) * 12;
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const random = Math.random();
    donut.scale.set(random, random, random);

    scene.add(donut);
  }
});

/**
 * Object
 */
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial()
);

// scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

const cameraFolder = gui.addFolder("CAMERA");
cameraFolder.add(camera.position, "x").min(-10).max(10).step(0.01);
cameraFolder.add(camera.position, "y").min(-10).max(10).step(0.01);
cameraFolder.add(camera.position, "z").min(-10).max(10).step(0.01);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
