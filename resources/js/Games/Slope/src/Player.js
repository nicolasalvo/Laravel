import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export function createPlayer() {
  const playerGroup = new THREE.Group();

  const loader = new GLTFLoader();
  loader.load('/models/octane.glb', (gltf) => {
    console.log("Octane loaded!"); // Debug log
    const mesh = gltf.scene;
    mesh.scale.set(0.015, 0.015, 0.015); // Increased scale for visibility check
    mesh.rotation.y = Math.PI / 2;
    playerGroup.add(mesh);
  }, undefined, (error) => {
    console.error("Error loading Octane:", error);
  });

  // Propiedades de juego
  playerGroup.userData = {
    laneX: 0,
    targetX: 0,
    isJumping: false,
    vy: 0,
    groundY: 0.45
  }

  return playerGroup
}