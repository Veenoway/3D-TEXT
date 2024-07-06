import GUI from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

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

const params = {
  text: "veeno",
  size: 0.5,
  depth: 0.2,
  curveSegments: 5,
  bevelEnabled: true,
  bevelOffset: 0,
  bevelSegments: 4,
  bevelThickness: 0.03,
  bevelSize: 0.02,
};

let textMesh;
let storedFont;
const fontLoader = new FontLoader();
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  console.log(font, "IM FONT");
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
  //   textGeometry.deleteAttribute("normal");
  //   textGeometry = mergeVertices(textGeometry, 1e-3);
  //   textGeometry.computeVertexNormals();
  textMesh = new THREE.Mesh(textGeometry, material);
  storedFont = font;
  scene.add(textMesh);

  // TEXTURE
  material.metalness = 0.3;
  material.roughness = 0.2;
  //   material.iridescence = 1;
  //   material.iridescenceIOR = 1;
  //   material.transmission = 1;
  //   material.ior = 1.15;

  //   const axesHelper = new THREE.AxesHelper();
  //   scene.add(axesHelper);

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

const textGeometryFolder = gui.addFolder("TextGeometry");
textGeometryFolder.add(params, "text").onChange(updateTextGeometry);
textGeometryFolder.add(params, "size", 0.1, 10).onChange(updateTextGeometry);
textGeometryFolder.add(params, "depth", 0.1, 10).onChange(updateTextGeometry);
textGeometryFolder
  .add(params, "curveSegments", 1, 20)
  .onChange(updateTextGeometry);
textGeometryFolder.add(params, "bevelEnabled").onChange(updateTextGeometry);
textGeometryFolder
  .add(params, "bevelThickness", 0.01, 1)
  .onChange(updateTextGeometry);
textGeometryFolder
  .add(params, "bevelSize", 0.01, 1)
  .onChange(updateTextGeometry);
textGeometryFolder
  .add(params, "bevelOffset", 0, 1)
  .onChange(updateTextGeometry);
textGeometryFolder
  .add(params, "bevelSegments", 1, 20)
  .onChange(updateTextGeometry);

function updateTextGeometry() {
  if (textMesh) {
    scene.remove(textMesh);
    textMesh.geometry.dispose();
  }

  const newTextGeometry = new TextGeometry("veeno", {
    font: storedFont,
    size: params.size,
    depth: params.depth,
    curveSegments: params.curveSegments,
    bevelEnabled: params.bevelEnabled,
    bevelThickness: params.bevelThickness,
    bevelSize: params.bevelSize,
    bevelOffset: params.bevelOffset,
    bevelSegments: params.bevelSegments,
  });
  textMesh = new THREE.Mesh(newTextGeometry, new THREE.MeshMatcapMaterial());
  newTextGeometry.center();
  newTextGeometry.deleteAttribute("normal");
  newTextGeometry = mergeVertices(newTextGeometry, 1e-3);
  newTextGeometry.computeVertexNormals();
  textMesh.matcap = matcapTexture;
  camera.lookAt(textMesh.position);
  scene.add(textMesh);
}

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

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

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

  camera.position.x = Math.sin(cursor.x * (Math.PI - 1)) * 2;
  camera.position.z = Math.cos(cursor.x * (Math.PI - 1)) * 2;
  camera.position.y = cursor.y * 3;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
