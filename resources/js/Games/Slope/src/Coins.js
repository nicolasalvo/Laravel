import * as THREE from 'three'

export function createCoin() {
const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 10);
const material = new THREE.MeshStandardMaterial({ color: 0xffcc00, metalness: 0.6, roughness: 0.4 })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = Math.PI / 2;

    mesh.userData = {
        isCollected: false
    }

    return mesh
}