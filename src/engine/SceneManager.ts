import * as THREE from 'three';
import { Renderer } from './Renderer';

export class SceneManager {
  private renderer: Renderer;
  private gameObjects: Map<string, THREE.Object3D> = new Map();
  private disposables: {
    geometry: THREE.BufferGeometry[];
    material: THREE.Material[];
  } = {
    geometry: [],
    material: [],
  };

  constructor(renderer: Renderer) {
    this.renderer = renderer;
  }

  addObject(id: string, object: THREE.Object3D): void {
    if (this.gameObjects.has(id)) {
      this.removeObject(id);
    }
    this.gameObjects.set(id, object);
    this.renderer.addObject(object);
  }

  getObject(id: string): THREE.Object3D | undefined {
    return this.gameObjects.get(id);
  }

  removeObject(id: string): void {
    const obj = this.gameObjects.get(id);
    if (obj) {
      this.disposeObject(obj);
      this.renderer.removeObject(obj);
      this.gameObjects.delete(id);
    }
  }

  private disposeObject(obj: THREE.Object3D): void {
    obj.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) {
          this.disposables.geometry.push(child.geometry);
        }
        if (child.material) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          this.disposables.material.push(...materials);
        }
      }
    });
  }

  getAllObjects(): THREE.Object3D[] {
    return Array.from(this.gameObjects.values());
  }

  cleanup(): void {
    this.disposables.material.forEach((mat) => mat.dispose());
    this.disposables.geometry.forEach((geom) => geom.dispose());
    this.disposables.material = [];
    this.disposables.geometry = [];
  }

  dispose(): void {
    this.gameObjects.forEach((obj) => this.disposeObject(obj));
    this.cleanup();
  }
}
