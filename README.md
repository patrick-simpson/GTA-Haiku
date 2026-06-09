# GTA Haiku - Mobile WebGL Prototype

A complete, mobile-optimized 3D city exploration game built with Three.js, TypeScript, and Vite. Features procedural city generation, realistic vehicle physics, and seamless pedestrian-to-driver state transitions.

## Features

- **Procedural World Generation**: Dynamically generated low-poly city with buildings, streets, and parked vehicles
- **Dual Control States**: Walk as a pedestrian or drive vehicles with realistic physics
- **Mobile-First Design**: Full touch controls with on-screen joystick and action buttons
- **Chase Camera**: Third-person camera that smoothly follows the player
- **Vehicle Physics**: Custom acceleration, braking, turning, and drift mechanics
- **Zero Dependencies**: All assets generated procedurally—no external models or textures
- **GitHub Pages Ready**: Pre-configured for direct deployment

## Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

### Desktop Controls

- **WASD or Arrow Keys**: Movement
- **E or Space**: Enter/Exit Vehicle

### Mobile Controls

- **Left Joystick**: Steering (pedestrian/vehicle)
- **ACCEL Button**: Accelerate (driving only)
- **BRAKE Button**: Brake/Reverse (driving only)
- **ACTION Button**: Enter/Exit Vehicle

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

## Deployment to GitHub Pages

1. Update the `base` path in `vite.config.ts` if needed
2. Build the project: `npm run build`
3. Deploy the `dist/` directory to GitHub Pages

## Project Structure

```
src/
├── index.ts                 # Main game loop and initialization
├── engine/
│   ├── Renderer.ts         # Three.js rendering setup
│   ├── SceneManager.ts     # Object management
│   └── AssetManager.ts     # Geometry/material caching
├── world/
│   └── CityGenerator.ts    # Procedural city generation
├── physics/
│   └── VehiclePhysics.ts   # Custom vehicle physics engine
├── player/
│   ├── Pedestrian.ts       # Player character model
│   ├── Vehicle.ts          # Vehicle model and physics
│   └── PlayerController.ts # State management (walking/driving)
├── camera/
│   └── ChaseCameraController.ts # Third-person camera
├── input/
│   ├── KeyboardInput.ts    # Keyboard handling
│   └── TouchInput.ts       # Touch/mobile controls
└── ui/
    └── MobileUI.ts         # HUD and UI updates
```

## Performance Optimization

- **Low-poly Assets**: All objects built from Three.js primitives
- **Material Reuse**: Geometry and material instancing via AssetManager
- **No Shadows**: Shadow mapping disabled for mobile performance
- **Viewport Clipping**: Built-in fog and camera culling
- **Memory Management**: Automatic cleanup of disposed geometries and materials
- **Mobile Pixel Ratio**: Capped at 2x for optimal performance

## Customization

### Adjust Vehicle Physics
Edit `src/physics/VehiclePhysics.ts`:
- `maxSpeed`: Top speed limit
- `acceleration`: Acceleration rate
- `brakingDeceleration`: Braking force
- `turningRadius`: Turning responsiveness

### Modify City Generation
Edit `src/world/CityGenerator.ts`:
- `gridSize`: City grid dimensions
- `blockSize`: Size of city blocks
- `streetWidth`: Width of streets

### Change Control Sensitivity
Edit `src/input/TouchInput.ts` or `src/input/KeyboardInput.ts` to adjust input response curves.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Credits

Built as a demonstration of modern WebGL game development with procedural generation and mobile-optimized physics simulation.
