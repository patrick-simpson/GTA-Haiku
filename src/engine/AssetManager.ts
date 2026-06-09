import * as THREE from 'three';

export class AssetManager {
  private geometries: Map<string, THREE.BufferGeometry> = new Map();
  private materials: Map<string, THREE.Material> = new Map();

  createBoxGeometry(
    width: number,
    height: number,
    depth: number
  ): THREE.BoxGeometry {
    const key = `box_${width}_${height}_${depth}`;
    if (!this.geometries.has(key)) {
      const geometry = new THREE.BoxGeometry(width, height, depth);
      this.geometries.set(key, geometry);
    }
    return this.geometries.get(key) as THREE.BoxGeometry;
  }

  createCylinderGeometry(
    radiusTop: number,
    radiusBottom: number,
    height: number,
    segments: number = 8
  ): THREE.CylinderGeometry {
    const key = `cyl_${radiusTop}_${radiusBottom}_${height}_${segments}`;
    if (!this.geometries.has(key)) {
      const geometry = new THREE.CylinderGeometry(
        radiusTop,
        radiusBottom,
        height,
        segments
      );
      this.geometries.set(key, geometry);
    }
    return this.geometries.get(key) as THREE.CylinderGeometry;
  }

  createSphereGeometry(
    radius: number,
    widthSegments: number = 8,
    heightSegments: number = 6
  ): THREE.SphereGeometry {
    const key = `sphere_${radius}_${widthSegments}_${heightSegments}`;
    if (!this.geometries.has(key)) {
      const geometry = new THREE.SphereGeometry(
        radius,
        widthSegments,
        heightSegments
      );
      this.geometries.set(key, geometry);
    }
    return this.geometries.get(key) as THREE.SphereGeometry;
  }

  createMaterial(color: number, emissive: number = 0x000000): THREE.MeshStandardMaterial {
    const key = `mat_${color}_${emissive}`;
    if (!this.materials.has(key)) {
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive,
        roughness: 0.7,
        metalness: 0.2,
      });
      this.materials.set(key, material);
    }
    return this.materials.get(key) as THREE.MeshStandardMaterial;
  }

  createFlatMaterial(color: number): THREE.MeshBasicMaterial {
    const key = `flat_${color}`;
    if (!this.materials.has(key)) {
      const material = new THREE.MeshBasicMaterial({ color });
      this.materials.set(key, material);
    }
    return this.materials.get(key) as THREE.MeshBasicMaterial;
  }

  dispose(): void {
    this.geometries.forEach((geo) => geo.dispose());
    this.materials.forEach((mat) => mat.dispose());
    this.geometries.clear();
    this.materials.clear();
  }
}
