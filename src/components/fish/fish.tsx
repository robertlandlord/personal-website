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
    requestAnimationFrame(animate);
  
    // Rotate the cube
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  
    // Render the scene
    renderer.render(scene, camera);
    };
    // Start the animation loop
    animate();
}