import * as THREE from 'three'

export function createHeart() {
    const shape = new THREE.Shape();
    const x = 0, y = 0;

    shape.moveTo(x + 0.25, y + 0.25);
    shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.20, y, x, y);
    shape.bezierCurveTo(x - 0.30, y, x - 0.30, y + 0.35, x - 0.30, y + 0.35);
    shape.bezierCurveTo(x - 0.30, y + 0.55, x - 0.10, y + 0.77, x + 0.25, y + 0.95);
    shape.bezierCurveTo(x + 0.60, y + 0.77, x + 0.80, y + 0.55, x + 0.80, y + 0.35);
    shape.bezierCurveTo(x + 0.80, y + 0.35, x + 0.80, y, x + 0.50, y);
    shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings = {
        depth: 0.2,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.05,
        bevelThickness: 0.05
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    geometry.center();

    geometry.scale(1, 1, 1);
    geometry.rotateZ(Math.PI);

    const material = new THREE.MeshStandardMaterial({ 
        color: 0xff0000,
        roughness: 0.4,
        metalness: 0.1,
        emissive: 0x550000
    })
    
    const heart = new THREE.Mesh(geometry, material)
    return heart
}