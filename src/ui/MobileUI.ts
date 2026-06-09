import { PlayerController } from '../player/PlayerController';

export class MobileUI {
  private stateIndicator: HTMLElement;
  private coordsIndicator: HTMLElement;
  private speedIndicator: HTMLElement;
  private actionPrompt: HTMLElement;
  private playerController: PlayerController;

  constructor(playerController: PlayerController) {
    this.playerController = playerController;
    this.stateIndicator = document.getElementById('state-indicator') || new HTMLElement();
    this.coordsIndicator = document.getElementById('coords-indicator') || new HTMLElement();
    this.speedIndicator = document.getElementById('speed-indicator') || new HTMLElement();
    this.actionPrompt = document.getElementById('action-prompt') || new HTMLElement();
  }

  update(): void {
    this.updateState();
    this.updateCoordinates();
    this.updateSpeed();
    this.updateActionPrompt();
  }

  private updateState(): void {
    const state = this.playerController.getState();
    const stateText = state === 'driving' ? 'DRIVING' : 'WALKING';
    this.stateIndicator.textContent = `STATE: ${stateText}`;
  }

  private updateCoordinates(): void {
    const pos = this.playerController.getPlayerPosition();
    const x = Math.round(pos.x);
    const z = Math.round(pos.z);
    this.coordsIndicator.textContent = `X: ${x} Z: ${z}`;
  }

  private updateSpeed(): void {
    let speed = 0;

    if (this.playerController.getState() === 'driving') {
      const vehicle = this.playerController.getCurrentVehicle();
      if (vehicle) {
        speed = Math.round(vehicle.getSpeed() * 3.6);
      }
    }

    const speedDiv = this.speedIndicator.querySelector('div');
    if (speedDiv) {
      speedDiv.textContent = String(speed);
    }
  }

  private updateActionPrompt(): void {
    const state = this.playerController.getState();

    if (state === 'walking') {
      const nearbyVehicle = this.playerController.canEnterVehicle();
      if (nearbyVehicle) {
        this.actionPrompt.textContent = 'PRESS ACTION TO ENTER CAR';
        this.actionPrompt.classList.add('active');
      } else {
        this.actionPrompt.classList.remove('active');
      }
    } else if (state === 'driving') {
      this.actionPrompt.textContent = 'PRESS ACTION TO EXIT CAR';
      this.actionPrompt.classList.add('active');
    }
  }

  showMessage(message: string, duration: number = 3000): void {
    const messageElement = document.createElement('div');
    messageElement.style.cssText = `
      position: absolute;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: rgba(100, 200, 255, 0.9);
      padding: 16px 24px;
      border-radius: 4px;
      font-size: 16px;
      white-space: nowrap;
      z-index: 200;
    `;
    messageElement.textContent = message;

    document.getElementById('ui-container')?.appendChild(messageElement);

    setTimeout(() => {
      messageElement.remove();
    }, duration);
  }
}
