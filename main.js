import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { CSG } from 'three-csg-ts';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#door'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(60);

renderer.render(scene, camera);

const floorTexture = new THREE.TextureLoader().load('floor.jpeg');
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xf7c7c7, map: floorTexture });
const floor1 = new THREE.Mesh(new THREE.BoxGeometry(50, 2, 50), floorMaterial);
floor1.position.set(-25, -21, -25);
scene.add(floor1);
const floor2 = new THREE.Mesh(new THREE.BoxGeometry(50, 2, 50), floorMaterial);
floor2.position.set(25, -21, 25);
scene.add(floor2);
const floor3 = new THREE.Mesh(new THREE.BoxGeometry(50, 2, 50), floorMaterial);
floor3.position.set(-25, -21, 25);
scene.add(floor3);
const floor4 = new THREE.Mesh(new THREE.BoxGeometry(50, 2, 50), floorMaterial);
floor4.position.set(25, -21, -25);
scene.add(floor4);

const roofTexture = new THREE.TextureLoader().load('roof.jpg');
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xf7c7c7, map: roofTexture });
const roof = new THREE.Mesh(new THREE.BoxGeometry(100, 2, 100), roofMaterial);
roof.position.set(0, 31, 0);
scene.add(roof);

const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x53c880 });
const wall = new THREE.Mesh(new THREE.BoxGeometry(100, 50, 1), wallMaterial);
wall.position.set(0, 5, 0);
// scene.add(wall);

const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(20.5, 40.5, 1));
doorFrame.position.set(0.1, 0, 0);
wall.updateMatrix();
doorFrame.updateMatrix();
scene.add(CSG.subtract(wall, doorFrame));

const geometry = new THREE.BoxGeometry(20, 40, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x853f02 });
const door = new THREE.Mesh(geometry, material);
// scene.add(door);

const pointLight = new THREE.PointLight(0xfffc95);
pointLight.position.set(20, 20, 20);
// pointLight.intensity = 0.8;
scene.add(pointLight);

const pointLightInner = new THREE.PointLight(0xff5733);
pointLightInner.position.set(20, 10, -20);
// pointLightInner.intensity = 0.7;
scene.add(pointLightInner);

const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.intensity = 0.8;
scene.add(ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
	const geometry = new THREE.SphereGeometry(0.25);
	const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
	const star = new THREE.Mesh(geometry, material);

	const [x, y, z] = Array(3)
		.fill()
		.map(() => THREE.MathUtils.randFloatSpread(100));

	star.position.set(x, y, z);
	scene.add(star);
}

// Array(200).fill().forEach(addStar);

const spaceTexture = new THREE.TextureLoader().load('space.jpeg');
scene.background = spaceTexture;

function addCutout(mesh, shape, x, y, cutX, cutY) {
	const cutout =
		shape === 'circle'
			? new THREE.Mesh(new THREE.CylinderGeometry(x, x, 1, 32, 1))
			: new THREE.Mesh(new THREE.BoxGeometry(x, y, 2));

	cutout.position.set(cutX, cutY, 0);
	// cutout.rotateX(90);
	cutout.rotateX(-Math.PI * 0.5);

	cutout.updateMatrix();
	mesh.updateMatrix();

	return CSG.subtract(mesh, cutout);
}

const result = addCutout(addCutout(door, 'box', 15, 3, 0, -4), 'circle', 6, null, 0, 8);
// const result = addCutout(door, 'box', 15, 3, 0, -4);

const glassMaterial = new THREE.MeshPhysicalMaterial();
glassMaterial.transparent = true;
glassMaterial.opacity = 0.6;
var glass = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 1, 32, 1), glassMaterial);
glass.position.set(0, 8, 0);
glass.rotateX(-Math.PI * 0.5);

scene.add(result);
scene.add(glass);

const doorKnobMaterial = new THREE.MeshStandardMaterial({ color: 0xcdcdcd });
const doorKnob = new THREE.Mesh(new THREE.SphereGeometry(1.5), doorKnobMaterial);
doorKnob.position.set(-7.5, 2, 2.5);
scene.add(doorKnob);
const doorKnobInner = new THREE.Mesh(new THREE.SphereGeometry(1.5), doorKnobMaterial);
doorKnobInner.position.set(-7.5, 2, -2.5);
scene.add(doorKnobInner);
const doorKnobMaterialExt = new THREE.MeshStandardMaterial({ color: 0xdedece });
const doorKnobExt = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 4, 32, 1), doorKnobMaterialExt);
doorKnobExt.position.set(-7.5, 2, 0);
doorKnobExt.rotateX(-Math.PI * 0.5);
scene.add(doorKnobExt);

const doorObj = new THREE.Object3D();
doorObj.add(result, glass, doorKnob, doorKnobExt, doorKnobInner);
scene.add(doorObj);
doorObj.position.x = -10.5;

//Hinges
function addHinge(r, h, x, y, z) {
	const hinge1 = new THREE.Mesh(
		new THREE.CylinderGeometry(r, r, h, 32, 1),
		new THREE.MeshStandardMaterial({ color: 0xffffff })
	);
	hinge1.position.set(x, y, z);
	scene.add(hinge1);
}
const hinge = new THREE.Mesh(
	new THREE.CylinderGeometry(0.5, 0.5, 5, 32, 1),
	new THREE.MeshStandardMaterial({ color: 0xffffff })
);
hinge.position.set(10.5, 0, 0);
hinge.add(doorObj);
scene.add(hinge);
addHinge(0.5, 5, 10.5, -15, 0);
// addHinge(0.5, 5, 10.5, 0, 0);
addHinge(0.5, 5, 10.5, 15, 0);

// function executeDoorMove(func) {
//   setTimeout(func, 0);
// }

// executeDoorMove(()=> {
//   while(true){

// });

var torus = new THREE.Mesh(
	new THREE.TorusGeometry(10, 4, 16, 100),
	new THREE.MeshStandardMaterial({ color: 0xe3eb04 })
);
torus.position.set(-30, -5, -20);
scene.add(torus);

//moon
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(new THREE.SphereGeometry(15, 32, 32), moonMaterial);
moon.position.set(0, 0, -70);
scene.add(moon);
const moonObj = new THREE.Object3D();
moonObj.add(moon);
scene.add(moonObj);

//moon2
const moon2 = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), moonMaterial);
moon2.position.set(0, 0, -120);
scene.add(moon2);
const moonObj2 = new THREE.Object3D();
moonObj2.add(moon2);
scene.add(moonObj2);

//moon3
const moon3 = new THREE.Mesh(new THREE.SphereGeometry(7, 32, 32), moonMaterial);
moon3.position.set(0, 0, -150);
scene.add(moon3);
const moonObj3 = new THREE.Object3D();
moonObj3.add(moon3);
scene.add(moonObj3);

// const doorVector = doorObj.position;
// doorObj.position.set(doorVector.x + 0.2, 0, doorVector.z - 0.4);
// console.log(doorObj.position);
// doorObj.rotateY(-0.05);

// const rotationAngle = 1.2;
// doorObj.rotateY(-rotationAngle);
// const doorVector = doorObj.position;
// const radAngle = 1.5708 - rotationAngle;
// const shiftX = 10 - 10 * Math.sin(radAngle);
// const shiftZ = 10 * Math.cos(radAngle);
// doorObj.position.set(doorObj.position.x + shiftX, 0, doorObj.position.z - shiftZ);
// console.log('shiftX: ', shiftX);
// console.log('shiftZ: ', shiftZ);
// console.log(doorObj.position);

// const vector = new THREE.Vector3(10, 0, 0);
// const vector2 = new THREE.Vector3(10, 10, 0);
// vector.add(vector2);
// vector.normalize();
// vector.applyEuler(new THREE.Euler(10, 0, 0));
// const vector2 = new THREE.Vector3(10, 0, 10);
// vector.applyAxisAngle(vector2, 0);
// var q = new THREE.Quaternion().setFromAxisAngle(vector);

let doorObjRotation = -0.002;

function animate() {
	requestAnimationFrame(animate);

	torus.rotation.x += 0.01;
	torus.rotation.y += 0.005;
	torus.rotation.z += 0.01;

	moon.rotation.x += 0.001;
	moon.rotation.y += 0.005;
	moon.rotation.z += 0.001;

	// moonObj.rotateY(0.005);

	moonObj2.rotateY(0.003);
	// moonObj2.rotateX(0.005);

	moonObj3.rotateY(0.005);
	// moonObj3.rotateZ(0.005);

	//door
	const doorObjPosition = hinge.children[0].getWorldPosition(new THREE.Vector3(0, 0, 0));
	// console.log(doorObjPosition);
	// console.log(doorObjRotation);
	hinge.rotateY(doorObjRotation);
	if (doorObjPosition.x > 10 && doorObjRotation < 0 && doorObjPosition.z < -10) {
		doorObjRotation = 0.002;
	}
	if (doorObjPosition.x > 10 && doorObjRotation > 0 && doorObjPosition.z > 10) {
		doorObjRotation = -0.002;
	}

	//door open
	// const rotationAngle = 0.00005;
	// doorObj.rotateY(-rotationAngle);
	// const doorVector = doorObj.position;
	// // const radAngle = Math.PI / 2 - rotationAngle;
	// const radAngle = rotationAngle;
	// const shiftX = 10 - 10 * Math.cos(radAngle);
	// const shiftZ = 10 * Math.sin(radAngle);
	// doorObj.position.set(doorVector.z + shiftX, 0, doorVector.x - shiftZ);
	// console.log('shiftX: ', shiftX);
	// console.log('shiftZ: ', shiftZ);
	// console.log('X: ', doorVector.x - shiftX);
	// console.log('Z: ', doorVector.z + shiftZ);
	// console.log(doorObj.position);

	// q.setFromAxisAngle(vector, -0.005);
	// doorObj.applyQuaternion(q);
	// doorObj.position.sub(vector);
	// doorObj.position.applyQuaternion(q);
	// doorObj.position.add(vector);

	// doorObj.rotateOnWorldAxis(vector, 0.05);
	// console.log(doorObj.getWorldDirection(vector));

	controls.update();

	renderer.render(scene, camera);
}

animate();
