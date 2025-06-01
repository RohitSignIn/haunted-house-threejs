import * as THREE from "three";
// import GUI from "lil-gui";
import { OrbitControls, Sky } from "three/examples/jsm/Addons.js";
import { RectAreaLightHelper } from "three/addons/helpers/RectAreaLightHelper.js";

// const gui = new GUI();
const canvas = document.querySelector(".webgl");

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, sizes.width / sizes.height);
camera.position.x = -1.2;
camera.position.y = 1.8;
camera.position.z = 14;

scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.render(scene, camera);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
// scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

directionalLight.castShadow = true;

// const directionalLightCameraHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );

directionalLight.position.x = 9;
directionalLight.position.y = 12.1;
directionalLight.position.z = -13.4;

directionalLight.rotation.x = -0.5;
directionalLight.rotation.y = 0;
directionalLight.rotation.z = -0.1;

directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 10.5;
directionalLight.shadow.camera.right = 15;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -15.2;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 35.4;

// directionalLight.shadow.camera.updateProjectionMatrix( );
// directionalLightCameraHelper.update();

scene.add(directionalLight);
// scene.add(directionalLightCameraHelper);

const rectAreaLight = new THREE.RectAreaLight(0xff0000, 4, 6, 6);

rectAreaLight.position.y = 2.5;
rectAreaLight.rotation.y = Math.PI;
rectAreaLight.position.z = 3.5 + 0.01;

const helper = new RectAreaLightHelper(rectAreaLight);

// scene.add(helper);
scene.add(rectAreaLight);

// POINTER Light for Door - START

const pointerLight = new THREE.PointLight(0xf4631e, 4);
pointerLight.position.y = 5.9;
pointerLight.position.z = 4.2;
scene.add(pointerLight);
// POINTER Light for Door - END

const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);

sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);

const textureLoader = new THREE.TextureLoader();

// FLOOR - START
const floorAplphaMap = textureLoader.load("./floor/alpha.webp");

const floorColorTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp"
);
const floorARMTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp"
);
const floorNormalTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp"
);
const floorDisplacementTexture = textureLoader.load(
  "./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp"
);

floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;

floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;

floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;

floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(38, 38, 180, 180),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: floorAplphaMap,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    // wireframe: true,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.4,
    displacementBias: -0.1,
    normalMap: floorNormalTexture,
    metalnessMap: floorARMTexture,
    roughnessMap: floorARMTexture,
  })
);

floor.receiveShadow = true;

// gui.add(floor.material, "displacementScale").step(0.1);
// gui.add(floor.material, "displacementBias").step(0.1);

floor.rotation.x = -Math.PI * 0.5;

scene.fog = new THREE.Fog("#04343f", 0.6, 20);
scene.add(floor);
// FLOOR - END

// HOUSE START
const house = new THREE.Group();

// Walls - START
const wallColorTexture = textureLoader.load(
  "./wall/recycled_brick_floor_1k/recycled_brick_floor_diff_1k.webp"
);
const wallARMTexture = textureLoader.load(
  "./wall/recycled_brick_floor_1k/recycled_brick_floor_arm_1k.webp"
);
const wallNormalTexture = textureLoader.load(
  "./wall/recycled_brick_floor_1k/recycled_brick_floor_nor_gl_1k.webp"
);
// const wallDisplacementTexture = textureLoader.load(
//   "./wall/recycled_brick_floor_1k/recycled_brick_floor_disp_1k.webp"
// );

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

const wall = new THREE.Mesh(
  new THREE.BoxGeometry(7, 6, 7),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
);

wall.castShadow = true;
wall.receiveShadow = true;

wall.position.y = 3;

// gui.add(wall.material, "displacementScale").step(0.01);
// gui.add(wall.material, "displacementBias").step(0.01);

house.add(wall);

// Walls - END

// Roof - START

const roofColorTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp"
);
const roofARMTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp"
);
const roofNormalTexture = textureLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp"
);
// const roofDisplacementTexture = textureLoader.load(
//   "./roof/clay_roof_tiles_1k/clay_roof_tiles_disp_1k.webp"
// );

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofColorTexture.wrapS = THREE.RepeatWrapping;

roofARMTexture.repeat.set(3, 1);
roofARMTexture.wrapS = THREE.RepeatWrapping;

roofNormalTexture.repeat.set(3, 1);
roofNormalTexture.wrapS = THREE.RepeatWrapping;

const roof = new THREE.Mesh(
  new THREE.ConeGeometry(7, 4, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);

roof.castShadow = true;

roof.position.y = 6 + 2;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);
// Roof - END

// Door - START
const doorAlphaTexture = textureLoader.load("./door/katsukagi/alpha.webp");
const doorColorTexture = textureLoader.load("./door/katsukagi/color.webp");
const doorARMTexture = textureLoader.load(
  "./door/katsukagi/ambientOcclusion.webp"
);
const doorNormalTexture = textureLoader.load("./door/katsukagi/normal.webp");
const doorDisplacementTexture = textureLoader.load(
  "./door/katsukagi/height.webp"
);

const doorMetalnessTexture = textureLoader.load(
  "../static/door/katsukagi/metalness.webp"
);
const doorRoughnessTexture = textureLoader.load(
  "../static/door/katsukagi/roughness.webp"
);

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

const door = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 5, 80, 80),
  new THREE.MeshStandardMaterial({
    transparent: true,
    alphaMap: doorAlphaTexture,
    map: doorColorTexture,
    // wireframe: true,
    aoMap: doorARMTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    displacementMap: doorDisplacementTexture,
    normalMap: doorNormalTexture,
    displacementScale: 0.16,
    displacementBias: -1,
  })
);

// gui.add(door.material, "displacementScale").step(0.01);
// gui.add(door.material, "displacementBias").step(0.01);

door.position.y = 2.5;
door.position.z = 4.5 + 0.001;
house.add(door);
// Door - END

// BUSH - START

const bushColorTexture = textureLoader.load(
  "./bush/rocky_terrain_02_1k/rocky_terrain_02_diff_1k.webp"
);
const bushARMTexture = textureLoader.load(
  "./bush/rocky_terrain_02_1k/rocky_terrain_02_arm_1k.webp"
);
const bushNormalTexture = textureLoader.load(
  "./bush/rocky_terrain_02_1k/rocky_terrain_02_nor_gl_1k.webp"
);
// const bushDisplacementTexture = textureLoader.load("./bush/rocky_terrain_02_1k/rocky_terrain_02_disp_1k.webp")

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

const bush = new THREE.Group();

const bushSphere1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.6),
  new THREE.MeshStandardMaterial({
    map: bushColorTexture,
    aoMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
  })
);
bushSphere1.position.x = -1;
const bushSphere2 = new THREE.Mesh(
  new THREE.SphereGeometry(1),
  new THREE.MeshStandardMaterial({
    map: bushColorTexture,
    aoMap: bushARMTexture,
    metalnessMap: bushARMTexture,
    roughnessMap: bushARMTexture,
    normalMap: bushNormalTexture,
  })
);

bush.add(bushSphere1, bushSphere2);

bush.position.z = 3.8;
bush.position.x = 2.5;

const bush2 = bush.clone();

bush2.position.z = 4;
bush2.position.x = -2.5;
bush2.rotation.y = -2;

bush.castShadow = true;
bush.receiveShadow = true;

bush2.castShadow = true;
bush2.receiveShadowb = true;

house.add(bush);
house.add(bush2);

// BUSH - END

scene.add(house);
// HOUSE END

// GRAVE - START

const graveColorTexture = textureLoader.load(
  "./grave/dirty_concrete_1k/dirty_concrete_diff_1k.webp"
);
const graveARMTexture = textureLoader.load(
  "./grave/dirty_concrete_1k/dirty_concrete_arm_1k.webp"
);
const graveNormalTexture = textureLoader.load(
  "./grave/dirty_concrete_1k/dirty_concrete_nor_gl_1k.webp"
);
// const graveDisplacementTexture = textureLoader.load(
//   "./grave/dirty_concrete_1k/dirty_concrete_disp_1k.webp"
// );

for (let i = 0; i < 30; i++) {
  // const gravePointLight = new THREE.PointLight(0x0000ff, 2);

  const grave = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 2),
    new THREE.MeshStandardMaterial({
      // color: "#521C0D",
      map: graveColorTexture,
      aoMap: graveARMTexture,
      metalnessMap: graveARMTexture,
      roughnessMap: graveARMTexture,
      normalMap: graveNormalTexture,
    })
  );

  const angle = Math.random() * Math.PI * 24;
  const radius = 8.5 + Math.random() * 4;
  grave.position.x = Math.sin(angle) * radius;
  grave.position.z = Math.cos(angle) * radius;
  grave.position.y = 0.2 + Math.random() - 0.5;

  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  grave.castShadow = true;
  grave.receiveShadow = true;
  scene.add(grave);

  // gravePointLight.position.set(
  //   grave.position.x,
  //   grave.position.y + 2,
  //   grave.position.z
  // );
  // const graveLightHelper = new THREE.PointLightHelper(gravePointLight);
  // scene.add(gravePointLight);
  // scene.add(graveLightHelper);
}

// GRAVE - END

// const ghost1 = new THREE.PointLight("#8800ff", 6);
// const ghost2 = new THREE.PointLight("#ff0000", 6);
// const ghost3 = new THREE.PointLight("#ff0088", 6);

// const timer = new Timer();

// scene.add(ghost1, ghost2, ghost3);

function animate() {
  // timer.update();
  // const elapsedTime = timer.getElapsed();

  // const angle = elapsedTime * 1;

  // ghost1.position.x = Math.cos(angle) * 8;
  // ghost1.position.z = Math.sin(angle) * 8;
  // ghost1.position.y =
  //   Math.sin(angle) * Math.sin(angle * 2.35) * Math.sin(angle * 3.35);

  // ghost2.position.x = Math.sin(angle) * 10;
  // ghost2.position.z = Math.cos(angle) * 10;
  // ghost2.position.y =
  //   Math.sin(angle) * Math.sin(angle * 2.35) * Math.sin(angle * 3.35);

  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(animate);
}

animate();
