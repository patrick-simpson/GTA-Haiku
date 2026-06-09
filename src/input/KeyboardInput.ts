export class KeyboardInput {
  private keys: Map<string, boolean> = new Map();

  constructor() {
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    window.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      this.keys.set(key, true);
    });

    window.addEventListener('keyup', (event) => {
      const key = event.key.toLowerCase();
      this.keys.set(key, false);
    });

    window.addEventListener('blur', () => {
      this.keys.forEach((_, key) => {
        this.keys.set(key, false);
      });
    });
  }

  isPressed(key: string): boolean {
    return this.keys.get(key.toLowerCase()) ?? false;
  }

  getMovementInput(): {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
  } {
    return {
      forward: this.isPressed('w') || this.isPressed('arrowup'),
      backward: this.isPressed('s') || this.isPressed('arrowdown'),
      left: this.isPressed('a') || this.isPressed('arrowleft'),
      right: this.isPressed('d') || this.isPressed('arrowright'),
    };
  }

  getActionPressed(): boolean {
    return this.isPressed('e') || this.isPressed(' ');
  }

  dispose(): void {
    this.keys.clear();
  }
}
