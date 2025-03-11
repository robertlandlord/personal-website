import { useEffect } from 'react'
import './App.css'
import * as THREE from 'three'
import * as transformUtils from '@utils/fish/transformSvg'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Flow } from 'three/examples/jsm/modifiers/CurveModifier.js' // takes a mesh and flows it along a curve

const initScene = () => { 

    // Setting up the scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("lightblue")

    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight)

    document.body.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.01, 200) // giving the camera ratio; 0.01 - distance of closest thing, 200 is distance of furthest thing that will be rendered
    camera.position.set(0,1,2)
    camera.lookAt(0,0,0)

    scene.add(camera)

    const ambientLight = new THREE.AmbientLight(0xffffff, .2) // 2 is strength of light. 
    scene.add(ambientLight)

    const hLight = new THREE.HemisphereLight(0xffffff, 0x080820, 10);
    scene.add(hLight);

    let fish: any; // ??? its an object but also a scene
    let flow: any;
    let pointCount = 100;
    const animate = () => {
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
        flow?.moveAlongCurve(0.0005)
    }

    const loader = new GLTFLoader();

    loader.load("https://assets.codepen.io/5946/fish_1.glb", (gltf) => {
        fish = gltf.scene
        const svgPath = document.getElementById("circle")!; // we want to get points on the svg
        const originalPts: THREE.Vector3[] = getCenteredSVGPoints(svgPath, .007); // the scale is really big at 1 so we have to descale.
        const fishPts = getFishPointsFromPoints(originalPts)
        showLineFromPoints(fishPts, 0xffffff)
        const fishCurve = new THREE.CatmullRomCurve3(fishPts, true)
        followPts(fishCurve)
    });

    const followPts = (fishCurve: THREE.CatmullRomCurve3) => {
        flow = new Flow(fish)
        flow.updateCurve(0, fishCurve) // 0 is how far along curve you want it to go.
        scene.add(flow.object3D)
    }

    const getFishPointsFromPoints = (pts: THREE.Vector3[]) => {
        const fishPts = [];
        const curve = new THREE.CatmullRomCurve3(pts) // make a curve so that we can sample points from the curve.
        for (let i=0; i < pointCount; i++) {
            const t = i / pointCount;
            const frequency = 10;
            const amplitude = .09;
            const angle = (i / (pointCount / frequency)) % 1;
            const displacement = Math.sin(Math.PI * 2 * angle) * amplitude
            let pt = curve.getPoint(t)
            const tangent = curve.getTangent(t)
            const normal = tangent.clone().cross(new THREE.Vector3(0,1,0))
            pt = pt.add(normal.multiplyScalar(displacement))
            fishPts.push(pt)
        }
        return fishPts
    }

    const showLineFromPoints = (points: THREE.Vector3[], color: number) => {
        const line = new THREE.LineLoop(
            new THREE.BufferGeometry().setFromPoints(points), 
            new THREE.LineBasicMaterial({ color })
        );
        line.geometry.center()

        scene.add(line)
    }
    
    const getCenteredSVGPoints = (svg: HTMLElement, scale: number): THREE.Vector3[] => {
        const viewBox = svg.getAttribute('viewBox')!.split(' ')
        const width = parseFloat(viewBox[2]) // see below, viewBox is "0 0 350 358", 350 is the width, 358 is the height
        const height = parseFloat(viewBox[3])
        const path = svg.querySelector('path')!.getAttribute('d')!
        const shape = transformUtils.transformSVGPath(path)
        return shape.getPoints(pointCount).map(pt => {
            let v = new THREE.Vector3(pt.x - width/2, pt.y - height/2) // left and up transform by half viewbox width 
            v = v.multiplyScalar(scale)
            return v
        });
    };
    animate();
}

function FishView() {

    useEffect(() => {
        initScene();
        return () => {

        };
    }, []);
    return (
        <div id="canvas-container">
            {/* <svg id="circle" width="350" height="358" viewBox="0 0 350 358" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M350 179C350 277.859 271.65 358 175 358C78.3502 358 0 277.859 0 179C0 80.141 78.3502 0 175 0C271.65 0 350 80.141 350 179Z" fill="#D9D9D9"/>
            </svg> */}
            <svg id="circle" width="640" height="304" viewBox="0 0 640 304" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 72C307 -44 459 23 467 35C475 47 819 324 511 302C203 280 9 333 85 189C161 45 -18 42 202 1" stroke="black"/>
            </svg>
        </div>
    )
}

export default FishView
