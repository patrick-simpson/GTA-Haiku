export class TouchInput {
  private joystickContainer: HTMLElement;
  private joystickThumb: HTMLElement;
  private accelBtn: HTMLElement;
  private brakeBtn: HTMLElement;
  private actionBtn: HTMLElement;

  private joystickActive: boolean = false;
  private joystickX: number = 0;
  private joystickY: number = 0;

  private accelPressed: boolean = false;
  private brakePressed: boolean = false;
  private actionPressed: boolean = false;

  constructor() {
    this.joystickContainer = document.getElementById('joystick-container') || new HTMLElement();
    this.joystickThumb = document.getElementById('joystick-thumb') || new HTMLElement();
    this.accelBtn = document.getElementById('accel-btn') || new HTMLElement();
    this.brakeBtn = document.getElementById('brake-btn') || new HTMLElement();
    this.actionBtn = document.getElementById('action-btn') || new HTMLElement();

    this.setupJoystick();
    this.setupButtons();
  }

  private setupJoystick(): void {
    let touchId: number | null = null;

    this.joystickContainer.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      touchId = touch.identifier;
      this.joystickActive = true;
      this.updateJoystickPosition(touch);
    });

    document.addEventListener('touchmove', (e) => {
      if (!this.joystickActive) return;

      for (let i = 0; i < e.touches.length; i++) {
        if (e.touches[i].identifier === touchId) {
          this.updateJoystickPosition(e.touches[i]);
          break;
        }
      }
    });

    document.addEventListener('touchend', (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          this.joystickActive = false;
          this.joystickX = 0;
          this.joystickY = 0;
          this.resetJoystickPosition();
          touchId = null;
          break;
        }
      }
    });

    this.resetJoystickPosition();
  }

  private updateJoystickPosition(touch: Touch): void {
    const rect = this.joystickContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = rect.width / 2 - 25;

    if (distance > maxDistance) {
      const angle = Math.atan2(dy, dx);
      this.joystickX = Math.cos(angle);
      this.joystickY = Math.sin(angle);
    } else {
      this.joystickX = dx / maxDistance;
      this.joystickY = dy / maxDistance;
    }

    this.updateJoystickThumb();
  }

  private updateJoystickThumb(): void {
    const maxDistance = 35;
    const x = this.joystickX * maxDistance;
    const y = this.joystickY * maxDistance;

    this.joystickThumb.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
  }

  private resetJoystickPosition(): void {
    this.joystickThumb.style.transform = 'translate(-50%, -50%)';
  }

  private setupButtons(): void {
    this.accelBtn.addEventListener('touchstart', () => {
      this.accelPressed = true;
    });

    this.accelBtn.addEventListener('touchend', () => {
      this.accelPressed = false;
    });

    this.brakeBtn.addEventListener('touchstart', () => {
      this.brakePressed = true;
    });

    this.brakeBtn.addEventListener('touchend', () => {
      this.brakePressed = false;
    });

    this.actionBtn.addEventListener('touchstart', () => {
      this.actionPressed = true;
    });

    this.actionBtn.addEventListener('touchend', () => {
      this.actionPressed = false;
    });

    this.actionBtn.addEventListener('mousedown', () => {
      this.actionPressed = true;
    });

    this.actionBtn.addEventListener('mouseup', () => {
      this.actionPressed = false;
    });

    this.accelBtn.addEventListener('mousedown', () => {
      this.accelPressed = true;
    });

    this.accelBtn.addEventListener('mouseup', () => {
      this.accelPressed = false;
    });

    this.brakeBtn.addEventListener('mousedown', () => {
      this.brakePressed = true;
    });

    this.brakeBtn.addEventListener('mouseup', () => {
      this.brakePressed = false;
    });
  }

  getMovementInput(): {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
  } {
    const threshold = 0.3;

    return {
      forward: this.accelPressed,
      backward: this.brakePressed,
      left: this.joystickX < -threshold,
      right: this.joystickX > threshold,
    };
  }

  getActionPressed(): boolean {
    return this.actionPressed;
  }

  getJoystickInput(): { x: number; y: number } {
    return { x: this.joystickX, y: this.joystickY };
  }

  dispose(): void {
    // Cleanup
  }
}
