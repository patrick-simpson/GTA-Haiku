import * as THREE from 'three';
import { AssetManager } from '../engine/AssetManager';
import { VehiclePhysics } from '../physics/VehiclePhysics';

export class Vehicle {
  private mesh: THREE.Group;
  private physics: VehiclePhysics;
  private position: THREE.Vector3 = new THREE.Vector3();
  private color: number;
  private interactionRadius: number = 3;

  constructor(
    assetManager: AssetManager,
    position: THREE.Vector3,
    color: number
  ) {
    this.position.copy(position);
    this.color = color;
    this.physics = new VehiclePhysics();
    this.physics.reset(position);
    this.mesh = this.createMesh(assetManager);
    this.mesh.position.copy(this.position);
  }

  private createMesh(assetManager: AssetManager): THREE.Group {
    const group = new THREE.Group();

    const bodyGeometry = assetManager.createBoxGeometry(2, 1.2, 4.5);
    const bodyMaterial = assetManager.createMaterial(this.color);
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    group.add(body);

    const cabinGeometry = assetManager.createBoxGeometry(1.8, 0.8, 1.8);
    const cabinMaterial = assetManager.createMaterial(this.color);
    const cabin = new THREE.Mesh(cabinGeometry, cabinMaterial);
    cabin.position.set(0, 1.5, -0.8);
    group.add(cabin);

    this.addWheels(group, assetManager);
    this.addWindows(group, assetManager);

    return group;
  }

  private addWheels(group: THREE.Group, assetManager: AssetManager): void {
    const wheelRadius = 0.5;
    const wheelGeometry = assetManager.createCylinderGeometry(
      wheelRadius,
      wheelRadius,
      0.4,
      6
    );
    const wheelMaterial = assetManager.createMaterial(0x1a1a1a);

    const wheelPositions = [
      new THREE.Vector3(-1.1, 0.5, 1),
      new THREE.Vector3(1.1, 0.5, 1),
      new THREE.Vector3(-1.1, 0.5, -1.2),
      new THREE.Vector3(1.1, 0.5, -1.2),
    ];

    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.copy(pos);
      wheel.rotation.z = Math.PI / 2;
      group.add(wheel);
    });
  }

  private addWindows(group: THREE.Group, assetManager: AssetManager): void {
    const windowGeometry = assetManager.createBoxGeometry(1.6, 0.6, 0.1);
    const windowMaterial = assetManager.createMaterial(0x87ceeb, 0x000033);

    const frontWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    frontWindow.position.set(0, 1.5, -0.3);
    group.add(frontWindow);

    const rearWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    rearWindow.position.set(0, 1.5, 0.5);
    group.add(rearWindow);
  }

  getMesh(): THREE.Group {
    return this.mesh;
  }

  getPosition(): THREE.Vector3 {
    return this.position.clone();
  }

  getRotation(): number {
    return this.physics.getRotation();
  }

  getSpeed(): number {
    return this.physics.getSpeed();
  }

  getPhysics(): VehiclePhysics {
    return this.physics;
  }

  setAccelerating(value: boolean): void {
    this.physics.setAccelerating(value);
  }

  setBraking(value: boolean): void {
    this.physics.setBraking(value);
  }

  setSteering(input: number): void {
    this.physics.setSteeringInput(input);
  }

  update(deltaTime: number): void {
    this.physics.update(deltaTime);

    const velocity = this.physics.getVelocity();
    this.position.add(velocity.multiplyScalar(deltaTime));

    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = this.physics.getRotation();
  }

  isPlayerNearby(playerPos: THREE.Vector3): boolean {
    const distance = this.position.distanceTo(playerPos);
    return distance <= this.interactionRadius;
  }

  respawn(position: THREE.Vector3): void {
    this.position.copy(position);
    this.physics.reset(position);
    this.mesh.position.copy(this.position);
    this.mesh.rotation.y = 0;
  }
}
