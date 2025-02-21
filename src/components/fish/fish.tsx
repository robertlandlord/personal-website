class Fish {
    constructor() {

    }

    // Creates the mesh of the fish
    Mesh() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        return new THREE.Mesh(geometry, material);
    }
    // Creates the per-frame animation for the mesh
    Animate() {

    }
}
function initScene() {
  
    // Create a cube
    
  
  
    // Create an animation loop
    const animate = () => {

    };
    // Start the animation loop
    animate();
}