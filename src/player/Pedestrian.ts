import * as THREE from 'three';
import { AssetManager } from '../engine/AssetManager';

export class Pedestrian {
  private mesh: THREE.Group;
  private position: THREE.Vector3 = new THREE.Vector3();
  private velocity: THREE.Vector3 = new THREE.Vector3();
  private rotation: number = 0;
  private speed: number = 0.15;
  private maxSpeed: number = 0.15;

  constructor(assetManager: AssetManager, position: THREE.Vector3) {
    this.position.copy(position);
    this.mesh = this.createMesh(assetManager);
    this.mesh.position.copy(this.position);
  }

  private createMesh(assetManager: AssetManager): THREE.Group {
    const group = new THREE.Group();

    const bodyGeometry = assetManager.createBoxGeometry(0.6, 1.2, 0.4);
    const bodyMaterial = assetManager.createMaterial(0xff6b6b);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    group.add(body);

    const headGeometry = assetManager.createSphereGeometry(0.35, 8, 6);
    const headMaterial = assetManager.createMaterial(0xfdbcb4);
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    group.add(head);

    const legGeometry = assetManager.createBoxGeometry(0.25, 0.7, 0.25);
    const legMaterial = assetManager.createMaterial(0x2c3e50);

    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.15, 0.35, 0);
    group.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.15, 0.35, 0);
    group.add(rightLeg);

    return group;
  }

  getMesh(): THREE.Group {
    return this.mesh;
  }

  getPosition(): THREE.Vector3 {
    return this.position.clone();
  }

  getRotation(): number {
    return this.rotation;
  }

  setPosition(position: THREE.Vector3): void {
    this.position.copy(position);
    this.mesh.position.copy(position);
  }

  setRotation(rotation: number): void {
    this.rotation = rotation;
    this.mesh.rotation.y = rotation;
  }

  moveForward(): void {
    this.velocity.x = Math.sin(this.rotation) * this.maxSpeed;
    this.velocity.z = Math.cos(this.rotation) * this.maxSpeed;
  }

  moveBackward(): void {
    this.velocity.x = Math.sin(this.rotation) * -this.maxSpeed * 0.5;
    this.velocity.z = Math.cos(this.rotation) * -this.maxSpeed * 0.5;
  }

  stopMoving(): void {
    this.velocity.multiplyScalar(0.85);
  }

  turn(direction: number): void {
    this.rotation += direction * 0.05;
  }

  update(): void {
    this.position.add(this.velocity);
    this.mesh.position.copy(this.position);
  }

  isMoving(): boolean {
    return this.velocity.lengthSq() > 0.0001;
  }
}
