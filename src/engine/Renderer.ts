import * as THREE from 'three';

export class Renderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private width: number;
  private height: number;

  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 500, 1500);

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.width / this.height,
      0.1,
      2000
    );
    this.camera.position.set(0, 10, 20);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      precision: 'lowp',
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = false;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    const canvas = this.renderer.domElement;
    canvas.style.display = 'block';
    document.body.appendChild(canvas);

    this.setupLighting();
    this.setupEventListeners();
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 100);
    directionalLight.castShadow = false;
    this.scene.add(directionalLight);
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private onWindowResize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  getScene(): THREE.Scene {
    return this.scene;
  }

  getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  addObject(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  removeObject(object: THREE.Object3D): void {
    this.scene.remove(object);
  }
}
