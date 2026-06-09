import * as THREE from 'three';
import { Renderer } from './engine/Renderer';
import { SceneManager } from './engine/SceneManager';
import { AssetManager } from './engine/AssetManager';
import { CityGenerator } from './world/CityGenerator';
import { PlayerController } from './player/PlayerController';
import { Vehicle } from './player/Vehicle';
import { ChaseCameraController } from './camera/ChaseCameraController';
import { KeyboardInput } from './input/KeyboardInput';
import { TouchInput } from './input/TouchInput';
import { MobileUI } from './ui/MobileUI';

class Game {
  private renderer: Renderer;
  private sceneManager: SceneManager;
  private assetManager: AssetManager;
  private playerController: PlayerController;
  private cameraController!: ChaseCameraController;
  private keyboardInput!: KeyboardInput;
  private touchInput!: TouchInput;
  private mobileUI!: MobileUI;
  private isRunning: boolean = true;
  private lastFrameTime: number = 0;
  private actionPressed: boolean = false;

  constructor() {
    this.renderer = new Renderer();
    this.sceneManager = new SceneManager(this.renderer);
    this.assetManager = new AssetManager();

    const startPosition = new THREE.Vector3(0, 0, 0);
    this.playerController = new PlayerController(this.assetManager, startPosition);

    this.renderer.addObject(this.playerController.getPedestrian().getMesh());

    this.setupWorld();
    this.setupCamera();
    this.setupInput();
    this.setupUI();

    this.lastFrameTime = performance.now();
    this.gameLoop();
  }

  private setupWorld(): void {
    const cityGenerator = new CityGenerator(this.assetManager);
    const { buildings, vehicles } = cityGenerator.generate();

    const cityMesh = cityGenerator.createCityMesh(buildings);
    this.renderer.addObject(cityMesh);

    vehicles.forEach((vehicleData, index) => {
      const vehicle = new Vehicle(
        this.assetManager,
        vehicleData.position,
        vehicleData.color
      );
      this.playerController.addVehicle(vehicle);
      this.renderer.addObject(vehicle.getMesh());
    });
  }

  private setupCamera(): void {
    this.cameraController = new ChaseCameraController(
      this.renderer.getCamera(),
      this.playerController
    );
  }

  private setupInput(): void {
    this.keyboardInput = new KeyboardInput();
    this.touchInput = new TouchInput();
  }

  private setupUI(): void {
    this.mobileUI = new MobileUI(this.playerController);
  }

  private handleInput(deltaTime: number): void {
    const keyMovement = this.keyboardInput.getMovementInput();
    const touchMovement = this.touchInput.getMovementInput();

    const forward = keyMovement.forward || touchMovement.forward;
    const backward = keyMovement.backward || touchMovement.backward;
    const left = keyMovement.left || touchMovement.left;
    const right = keyMovement.right || touchMovement.right;

    this.playerController.handleMovementInput(
      forward,
      backward,
      left,
      right,
      deltaTime
    );

    const keyAction = this.keyboardInput.getActionPressed();
    const touchAction = this.touchInput.getActionPressed();
    const actionPressed = keyAction || touchAction;

    if (actionPressed && !this.actionPressed) {
      this.onActionPressed();
    }
    this.actionPressed = actionPressed;
  }

  private onActionPressed(): void {
    const state = this.playerController.getState();

    if (state === 'walking') {
      const nearbyVehicle = this.playerController.canEnterVehicle();
      if (nearbyVehicle) {
        this.playerController.enterVehicle(nearbyVehicle);
        this.mobileUI.showMessage('ENTERED VEHICLE');
      }
    } else if (state === 'driving') {
      this.playerController.exitVehicle();
      this.mobileUI.showMessage('EXITED VEHICLE');
    }
  }

  private gameLoop = (): void => {
    if (!this.isRunning) return;

    const currentTime = performance.now();
    const deltaTime = Math.min((currentTime - this.lastFrameTime) / 1000, 0.016);
    this.lastFrameTime = currentTime;

    this.handleInput(deltaTime);
    this.playerController.update(deltaTime);
    this.cameraController.update();
    this.mobileUI.update();

    this.renderer.render();
    this.sceneManager.cleanup();

    requestAnimationFrame(this.gameLoop);
  };

  dispose(): void {
    this.isRunning = false;
    this.keyboardInput.dispose();
    this.touchInput.dispose();
    this.playerController.dispose();
    this.sceneManager.dispose();
    this.assetManager.dispose();
    this.renderer.dispose();
  }
}

let game: Game | null = null;

document.addEventListener('DOMContentLoaded', () => {
  game = new Game();
});

window.addEventListener('beforeunload', () => {
  if (game) {
    game.dispose();
  }
});
