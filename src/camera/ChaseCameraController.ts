import * as THREE from 'three';
import { PlayerController } from '../player/PlayerController';

export class ChaseCameraController {
  private camera: THREE.PerspectiveCamera;
  private playerController: PlayerController;
  private targetPosition: THREE.Vector3 = new THREE.Vector3();
  private currentPosition: THREE.Vector3 = new THREE.Vector3();
  private lookAtPosition: THREE.Vector3 = new THREE.Vector3();

  private pedestrianDistance: number = 15;
  private pedestrianHeight: number = 5;
  private vehicleDistance: number = 12;
  private vehicleHeight: number = 4;
  private smoothingFactor: number = 0.08;

  constructor(camera: THREE.PerspectiveCamera, playerController: PlayerController) {
    this.camera = camera;
    this.playerController = playerController;
    this.currentPosition.copy(camera.position);
  }

  update(): void {
    const playerPos = this.playerController.getPlayerPosition();
    const state = this.playerController.getState();

    if (state === 'walking') {
      const ped = this.playerController.getPedestrian();
      const rotation = ped.getRotation();
      const distance = this.pedestrianDistance;
      const height = this.pedestrianHeight;

      this.targetPosition.set(
        playerPos.x - Math.sin(rotation) * distance,
        playerPos.y + height,
        playerPos.z - Math.cos(rotation) * distance
      );

      this.lookAtPosition.copy(playerPos);
      this.lookAtPosition.y += 1;
    } else if (state === 'driving') {
      const vehicle = this.playerController.getCurrentVehicle();
      if (vehicle) {
        const rotation = vehicle.getRotation();
        const distance = this.vehicleDistance;
        const height = this.vehicleHeight;

        this.targetPosition.set(
          playerPos.x - Math.sin(rotation) * distance,
          playerPos.y + height,
          playerPos.z - Math.cos(rotation) * distance
        );

        this.lookAtPosition.copy(playerPos);
        this.lookAtPosition.y += 0.5;
      }
    }

    this.currentPosition.lerp(this.targetPosition, this.smoothingFactor);
    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.lookAtPosition);
  }
}
