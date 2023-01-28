import * as THREE from 'three'; // ThreeJS
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // Orbit controls
// import * as dat from 'dat.gui' // Interface controller
// import gsap from 'gsap' // Animation library
import image from '/assets/images/image.avif'; // Texture
import vertex from './shaders/vertex.glsl'; // A shader that handles the processing of individual vertices
import fragment from './shaders/fragment.glsl'; // A shader that handles the processing of colors
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';

class webGL {
    constructor(options) {
        /** Setup a scene */
        this.scene = new THREE.Scene();

        /** Create a renderer */
        this.renderer = new THREE.WebGL1Renderer({
            canvas: document.getElementById('canvas'),
            antialias: false,
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Set device pixel ratio
        this.renderer.setSize(window.innerWidth, window.innerHeight); // Resize renderer
        this.renderer.setClearColor('#fff', 1); // WebGL background color
        this.renderer.physicallyCorrectLights = true; // Use physically correct lighting mode
        this.renderer.outputEncoding = THREE.sRGBEncoding; // Output encoding

        /** Setup a perspective camera */
        this.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        );
        this.camera.position.set(0, 0, 2);
        /** Setup an orthographic camera */
        // this.frustum = 3;
        // this.aspect = window.innerWidth / window.innerHeight;
        // this.camera = new THREE.OrthographicCamera(
        //     (this.frustum * this.aspect) / -2,
        //     (this.frustum * this.aspect) / 2,
        //     this.frustum / 2,
        //     this.frustum / -2,
        //     0.001,
        //     1000
        // );
        // this.camera.position.set(0, 0, 2);

        /** Get mouse position */
        // window.addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
        //   // From -1 to 1
        //   data.mouse.x = x / window.innerWidth * 2 - 1
        //   data.mouse.y = y / window.innerHeight * 2 - 1
        //   // From 0 to 1
        //   data.mouse.x = x / window.innerWidth
        //   data.mouse.y = y / window.innerHeight
        // })

        /** Create an interface controller */
        // const gui = new dat.GUI({ closed: true });
        const data = {
            mouse: { x: 0, y: 0, k: 0.01 },
            progress: 0,
            speed: 0.05,
        };
        // gui.add(data, 'progress', 0, 1, 0.01)

        this.time = 0;

        this.addObjects();
        this.resize();
        this.setupResize();
        this.controls();
        this.render();
    }

    addObjects() {
        /** Generate Geometry */
        this.geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

        /** Load a texture */
        this.texture = new THREE.TextureLoader().load(image, (t) => {});
        this.texture.minFilter = THREE.LinearFilter; // Prevent image resizing

        /** Create a material rendered with custom shaders */
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: '#extention GL_OES_standard_derivatives : enable',
            },
            uniforms: {
                uAspectRatio: { value: new THREE.Vector2(1, 1) },
                // uResolution: { value: new THREE.Vector2(0,0),
                // uMouse:       { value: new THREE.Vector2(data.mouse.x, data.mouse.y) },
                // uProgress:    { value: data.progress },
                uTexture: { value: this.texture },
                uTime: { value: 0 },
            },
            side: THREE.DoubleSide,
            // wireframe: true,
            // transparent: true,
            vertexShader: vertex,
            fragmentShader: fragment,
        });
        /** Setup a  Mesh */
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.scene.add(this.mesh);

        // postprocessing

        // this.composer = new EffectComposer(this.renderer);
        // this.composer.addPass(new RenderPass(this.scene, this.camera));

        // this.glitchPass = new GlitchPass();
        // this.composer.addPass(this.glitchPass);
    }

    resize() {
        /** Window resize event handler */
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // this.composer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        // this.camera.fov = 2 * (180 / Math.PI) * Math.atan(1 / (2 * camera.position.z)) // Move the camera to fit a mesh to the screen
        // this.camera.fov = 2 * Math.atan((window.innerHeight / 2) / camera.position.z) * (180 / Math.PI) // Make the dimensions of the canvas the same as the document (1 === 1px)
        this.camera.updateProjectionMatrix();

        /** Scale the mesh to fit the screen */
        // if (window.innerWidth / window.innerHeight > 1) {
        //     this.mesh.scale.x = this.camera.aspect;
        // } else {
        //     this.mesh.scale.y = 1 / this.camera.aspect;
        // }

        /** Scale the mesh to fit the screen */
        // if (window.innerWidth / window.innerHeight > 1) {
        //     this.mesh.scale.x = this.mesh.scale.y =
        //         window.innerWidth / window.innerHeight;
        // }

        /** Calculate aspect ratio */
        // this.imageAspectRatio = 1080 / 1920; // this.texture.image.width / this.texture.image.height
        // if (window.innerHeight / window.innerWidth > this.imageAspectRatio) {
        //     this.material.uniforms.uAspectRatio.value.x =
        //         (window.innerWidth / window.innerHeight) *
        //         this.imageAspectRatio;
        //     this.material.uniforms.uAspectRatio.value.y = 1;
        // } else {
        //     this.material.uniforms.uAspectRatio.value.x = 1;
        //     this.material.uniforms.uAspectRatio.value.y =
        //         window.innerHeight / window.innerWidth / this.imageAspectRatio;
        // }
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    controls() {
        /** Setup a camera controller */
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.01;
        this.controls.update();
    }

    render() {
        this.time += 0.05;
        this.controls.update();
        // this.material.uniforms.time.value = this.time;

        /** Update uniform values */
        // this.material.uniforms.uTime.value += data.speed;
        // this.material.uniforms.uProgress.value = data.progress
        // this.material.uniforms.uMouse.value.x += (data.mouse.x - material.uniforms.uMouse.value.x) * data.mouse.k
        // this.material.uniforms.uMouse.value.y += (data.mouse.y - material.uniforms.uMouse.value.y) * data.mouse.k

        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
        // this.composer.render(this.scene, this.camera);
    }
}

new webGL();
