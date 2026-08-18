import * as THREE from "three";
import { scene, lanes } from "./scene.js";

let obstacles = [];
let obstacleSpeed = 15;

function createObstacle(cacti) {
    const randomCactus = Math.floor(
        Math.random() * cacti.length
    );

    const cactus = cacti[randomCactus].clone(true);

    const randomLane = Math.floor(
        Math.random() * lanes.length
    );

    cactus.position.x = lanes[randomLane];
    cactus.position.y = 0;
    cactus.position.z = -25;

    cactus.scale.set(
        0.015,
        0.015,
        0.015
    );

    scene.add(cactus);

    obstacles.push(cactus);
}

function updateobstacles(delta) {
    for(let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];

        obstacle.position.z += obstacleSpeed * delta;

        if(obstacle.position.z > 8) {
            scene.remove(obstacle);
            obstacles.splice(i, 1);
        }
    }

    obstacleSpeed += delta * 0.15;
}

export {
    createObstacle,
    updateobstacles,
    obstacles
};