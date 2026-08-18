import * as THREE from "three";
import { scene, camera, renderer, roadimg, lanes } from "./scene.js";
import { loadAssets } from "./loader.js";
import { createObstacle, updateobstacles, obstacles } from "./obstacles.js";

let dino = null;
let currentlane = 1;
let targetX = 0;
let assets = null;
let gameOver = false;
let obstacletimer = 0;
let nextObstacleTime = 0.4;
let score = 0;
let gameSpeed = 10;

const clock = new THREE.Clock();

const scoreText = document.getElementById("score");
const gameOverScreen = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const restartButton = document.getElementById("restartButton");

loadAssets().then((loadedAssets) => {
    assets = loadedAssets;
    dino = assets.dino.upright;

    dino.scale.set(0.015, 0.015, 0.015);
    dino.rotation.y = Math.PI / 3;

    targetX = lanes[currentlane];
    dino.position.set(targetX, 0, 2);

    scene.add(dino);

    console.log("Dino loaded successfully!");
}).catch((error) => {
    console.error("Failed to load assets:", error);
});

window.addEventListener("keydown", (event) => {
    if(gameOver) return;

    if(event.key === "ArrowLeft") {
        currentlane--;
    }

    if(event.key === "ArrowRight") {
        currentlane++;
    }

    if(currentlane < 0) currentlane = 0;
    if(currentlane > 2) currentlane = 2;

    targetX = lanes[currentlane];
});

function checkCollision() {
    if(!dino) return false;

    const dinoBox = new THREE.Box3().setFromObject(dino);

    for(let i = 0; i < obstacles.length; i++) {
        const obstacleBox = new THREE.Box3().setFromObject(obstacles[i]);

        if(dinoBox.intersectsBox(obstacleBox)) {
            return true;
        }
    }

    return false;
}

function endGame() {
    gameOver = true;

    finalScore.textContent = "Score: " + Math.floor(score);
    gameOverScreen.style.display = "block";
}

restartButton.addEventListener("click", () => {
    location.reload();
});

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    if(gameOver) {
        renderer.render(scene, camera);
        return;
    }

    if(roadimg) {
        roadimg.offset.y -= gameSpeed * delta * 0.006;
    }

    if(dino) {
        dino.position.x += (targetX - dino.position.x) * 0.2;
    }

    if(assets) {
        obstacletimer += delta;

        if(obstacletimer > nextObstacleTime) {
            createObstacle(assets.cacti);

            obstacletimer = 0;
            nextObstacleTime = 0.25 + Math.random() * 0.4;
        }
    }

    updateobstacles(delta);

    score += delta * gameSpeed;

    scoreText.textContent = "Score: " + Math.floor(score);

    gameSpeed += delta * 0.15;

    if(checkCollision()) {
        endGame();
    }

    renderer.render(scene, camera);
}

animate();