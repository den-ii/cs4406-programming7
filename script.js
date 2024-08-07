import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ParametricGeometry } from "three/addons/geometries/ParametricGeometry.js";

// Create the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener("mousemove", renderer);

camera.position.z = 5;

// Function Definitions
const coneFunction = (x, y) => x * x + y * y;
const hyperbolicParaboloidFunction = (x, y) => x * x - y * y;

// Parametric Function for ParametricGeometry
const parametricFunction = (u, v, target) => {
  const x = u * 2 - 1; // u ranges from 0 to 1, map it to -1 to 1
  const y = v * 2 - 1; // v ranges from 0 to 1, map it to -1 to 1
  const z = hyperbolicParaboloidFunction(x, y); // or coneFunction(x, y)
  target.set(x, y, z);
};

// Create ParametricGeometry
const parametricGeometry = new ParametricGeometry(parametricFunction, 20, 20);

// Variating Colors
const colors = [];
const color = new THREE.Color();
for (let i = 0; i < parametricGeometry.attributes.position.count; i++) {
  // Assign a color based on the vertex position
  const vertex = parametricGeometry.attributes.position.array.slice(
    i * 3,
    i * 3 + 3
  );
  color.setRGB((vertex[0] + 1) / 2, (vertex[1] + 1) / 2, (vertex[2] + 1) / 2);
  colors.push(color.r, color.g, color.b);
}

// Add the colors to the geometry
parametricGeometry.setAttribute(
  "color",
  new THREE.Float32BufferAttribute(colors, 3)
);

// Create a material that supports vertex colors
const material = new THREE.MeshBasicMaterial({
  vertexColors: true,
  wireframe: false,
});

const mesh = new THREE.Mesh(parametricGeometry, material);
scene.add(mesh);

// Axis Helper and Plane creation
const axisHelper = new THREE.AxesHelper(5);
scene.add(axisHelper);

const planeGeometry = new THREE.PlaneGeometry(5, 5, 15, 15);
const planeMaterial = new THREE.MeshBasicMaterial({
  color: 0xd3d3d3,
  wireframe: true,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

//positioning mesh
mesh.rotation.x = 5;
camera.position.y = 1;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
