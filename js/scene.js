import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080b12);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 2.5, 6);
camera.lookAt(0, 0.8, 0);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(
    0xffffff,
    0.8
);

scene.add(light);

const sunlight = new THREE.DirectionalLight(
    0xffffff,
    1.2
);

sunlight.position.set(5, 12, 5);
sunlight.castShadow = true;

scene.add(sunlight);

const textureLoader = new THREE.TextureLoader();

const roadimg = textureLoader.load(
    "./assets/road.png"
);

roadimg.wrapS = THREE.RepeatWrapping;
roadimg.wrapT = THREE.RepeatWrapping;
roadimg.repeat.set(1, -20);

const material = new THREE.MeshStandardMaterial({
    map: roadimg
});

const road = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 120),
    material
);

road.rotation.x = -Math.PI / 2;
road.position.y = -0.01;

road.receiveShadow = true;

scene.add(road);

const lanes = [-2, 0, 2];

const lineGeometry = new THREE.BoxGeometry(
    0.05,
    0.02,
    120
);

const lineMaterial = new THREE.MeshStandardMaterial({
    color: 0xffcc00
});

const leftLine = new THREE.Mesh(
    lineGeometry,
    lineMaterial
);

leftLine.position.set(-1, 0, 0);

scene.add(leftLine);

const rightLine = new THREE.Mesh(
    lineGeometry,
    lineMaterial
);

rightLine.position.set(1, 0, 0);

scene.add(rightLine);

export {
    scene,
    camera,
    renderer,
    road,
    roadimg,
    lanes
};