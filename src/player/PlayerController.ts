import * as THREE from 'three';
import { Pedestrian } from './Pedestrian';
import { Vehicle } from './Vehicle';
import { AssetManager } from '../engine/AssetManager';

export type PlayerState = 'walking' | 'driving';

export class PlayerController {
  private pedestrian: Pedestrian;
  private currentVehicle: Vehicle | null = null;
  private vehicles: Vehicle[] = [];
  private state: PlayerState = 'walking';
  private assetManager: AssetManager;

  constructor(assetManager: AssetManager, startPosition: THREE.Vector3) {
    this.assetManager = assetManager;
    this.pedestrian = new Pedestrian(assetManager, startPosition);
  }

  getState(): PlayerState {
    return this.state;
  }

  getPedestrian(): Pedestrian {
    return this.pedestrian;
  }

  getCurrentVehicle(): Vehicle | null {
    return this.currentVehicle;
  }

  getVehicles(): Vehicle[] {
    return this.vehicles;
  }

  addVehicle(vehicle: Vehicle): void {
    this.vehicles.push(vehicle);
  }

  getPlayerPosition(): THREE.Vector3 {
    if (this.state === 'driving' && this.currentVehicle) {
      return this.currentVehicle.getPosition();
    }
    return this.pedestrian.getPosition();
  }

  canEnterVehicle(): Vehicle | null {
    const pedPos = this.pedestrian.getPosition();
    for (const vehicle of this.vehicles) {
      if (vehicle.isPlayerNearby(pedPos)) {
        return vehicle;
      }
    }
    return null;
  }

  enterVehicle(vehicle: Vehicle): void {
    if (this.state === 'walking') {
      this.pedestrian.stopMoving?.();
      this.currentVehicle = vehicle;
      this.state = 'driving';

      const vehiclePos = vehicle.getPosition();
      this.pedestrian.setPosition(vehiclePos);
    }
  }

  exitVehicle(): void {
    if (this.state === 'driving' && this.currentVehicle) {
      const vehiclePos = this.currentVehicle.getPosition();
      const offset = new THREE.Vector3(0, 0, -4);
      offset.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        this.currentVehicle.getRotation()
      );

      this.pedestrian.setPosition(vehiclePos.clone().add(offset));
      this.pedestrian.setRotation(this.currentVehicle.getRotation());

      this.currentVehicle.setBraking(true);
      setTimeout(() => {
        if (this.currentVehicle) {
          this.currentVehicle.setBraking(false);
        }
      }, 100);

      this.currentVehicle = null;
      this.state = 'walking';
    }
  }

  handleMovementInput(forward: boolean, backward: boolean, left: boolean, right: boolean, deltaTime: number): void {
    if (this.state === 'walking') {
      let moved = false;

      if (forward) {
        this.pedestrian.moveForward();
        moved = true;
      } else if (backward) {
        this.pedestrian.moveBackward();
        moved = true;
      } else {
        this.pedestrian.stopMoving();
      }

      if (left) {
        this.pedestrian.turn(-1);
      } else if (right) {
        this.pedestrian.turn(1);
      }

      this.pedestrian.update();
    } else if (this.state === 'driving' && this.currentVehicle) {
      if (forward) {
        this.currentVehicle.setAccelerating(true);
        this.currentVehicle.setBraking(false);
      } else if (backward) {
        this.currentVehicle.setBraking(true);
        this.currentVehicle.setAccelerating(false);
      } else {
        this.currentVehicle.setAccelerating(false);
        this.currentVehicle.setBraking(false);
      }

      const steering = (left ? 1 : 0) + (right ? -1 : 0);
      this.currentVehicle.setSteering(steering);

      this.currentVehicle.update(deltaTime);
    }
  }

  update(deltaTime: number): void {
    if (this.state === 'driving' && this.currentVehicle) {
      this.currentVehicle.update(deltaTime);
      const vehPos = this.currentVehicle.getPosition();
      this.pedestrian.setPosition(vehPos);
    }
  }

  dispose(): void {
    this.vehicles.forEach((v) => {
      // Cleanup vehicle meshes
    });
    this.vehicles = [];
  }
}
