import * as THREE from 'three';

export interface VehiclePhysicsState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  rotation: number;
  angularVelocity: number;
  acceleration: number;
}

export class VehiclePhysics {
  private maxSpeed: number = 30;
  private acceleration: number = 8;
  private brakingDeceleration: number = 15;
  private rollingFriction: number = 0.95;
  private turningRadius: number = 1;
  private driftFactor: number = 0.15;

  private velocity: THREE.Vector3 = new THREE.Vector3();
  private angularVelocity: number = 0;
  private rotation: number = 0;
  private isBraking: boolean = false;
  private isAccelerating: boolean = false;

  reset(position: THREE.Vector3): void {
    this.velocity.copy(position);
    this.velocity.set(0, 0, 0);
    this.angularVelocity = 0;
    this.rotation = 0;
    this.isBraking = false;
    this.isAccelerating = false;
  }

  setAccelerating(value: boolean): void {
    this.isAccelerating = value;
  }

  setBraking(value: boolean): void {
    this.isBraking = value;
  }

  setSteeringInput(input: number): void {
    const speed = this.velocity.length();
    if (speed > 0.1) {
      const turnFactor = Math.max(0.3, 1 - speed / this.maxSpeed);
      this.angularVelocity = input * this.turningRadius * turnFactor * 2;
    }
  }

  update(deltaTime: number): void {
    const speed = this.velocity.length();

    if (this.isAccelerating) {
      if (speed < this.maxSpeed) {
        const accelFactor = this.acceleration * (1 - speed / this.maxSpeed);
        this.velocity.multiplyScalar(1 + accelFactor * deltaTime / speed || 1);
      }
    } else if (this.isBraking) {
      const brakeFactor = Math.max(0, 1 - this.brakingDeceleration * deltaTime);
      this.velocity.multiplyScalar(brakeFactor);
    }

    this.velocity.multiplyScalar(this.rollingFriction);

    if (speed > 0.1) {
      const driftInfluence = Math.min(this.driftFactor, Math.abs(this.angularVelocity) * 0.05);
      const rotationDelta = this.angularVelocity * deltaTime;
      this.rotation += rotationDelta;

      const cos = Math.cos(this.rotation);
      const sin = Math.sin(this.rotation);

      const vx = this.velocity.x;
      const vz = this.velocity.z;

      this.velocity.x = cos * vx - sin * vz;
      this.velocity.z = sin * vx + cos * vz;

      this.velocity.x = this.velocity.x * (1 - driftInfluence) + cos * speed * driftInfluence;
      this.velocity.z = this.velocity.z * (1 - driftInfluence) + sin * speed * driftInfluence;
    }

    this.angularVelocity *= 0.85;
  }

  getVelocity(): THREE.Vector3 {
    return this.velocity.clone();
  }

  getSpeed(): number {
    return this.velocity.length();
  }

  getRotation(): number {
    return this.rotation;
  }

  getForwardVector(): THREE.Vector3 {
    return new THREE.Vector3(
      Math.sin(this.rotation),
      0,
      Math.cos(this.rotation)
    );
  }

  applyForce(force: THREE.Vector3): void {
    this.velocity.add(force);
  }

  isMoving(): boolean {
    return this.velocity.lengthSq() > 0.01;
  }
}
