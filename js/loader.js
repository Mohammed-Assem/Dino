import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const path = "./assets/3d designs.glb";

function centerAsset(group) {
    const box = new THREE.Box3().setFromObject(group);

    if(box.isEmpty()) return;

    const center = box.getCenter(
        new THREE.Vector3()
    );

    group.children.forEach((child) => {
        child.position.x -= center.x;
        child.position.y -= box.min.y;
        child.position.z -= center.z;
    });
}

export async function loadAssets() {
    const loader = new GLTFLoader();

    const gltf = await loader.loadAsync(
        path
    );

    const keys = [
        "dino_upright",
        "dino_jump",
        "dino_duck",
        "dino_dead",
        "bird",
        "cactus1",
        "cactus2",
        "cactus3",
        "cactus4"
    ];

    const extracted = {};

    keys.forEach((key) => {
        extracted[key] = new THREE.Group();
        extracted[key].name = key;
    });

    gltf.scene.traverse((child) => {
        if(!child.isMesh) return;

        child.castShadow = true;
        child.receiveShadow = true;

        for(const key of keys) {
            if(child.name.startsWith(key)) {
                extracted[key].add(child.clone(true));
                break;
            }
        }
    });

    Object.values(extracted).forEach((group) => {
        centerAsset(group);
    });

    return {
        dino: {
            upright: extracted["dino_upright"],
            jump: extracted["dino_jump"],
            duck: extracted["dino_duck"],
            dead: extracted["dino_dead"]
        },

        bird: extracted["bird"],

        cacti: [
            extracted["cactus1"],
            extracted["cactus2"],
            extracted["cactus3"],
            extracted["cactus4"]
        ]
    };
}