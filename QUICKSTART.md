# GTA Haiku - Quick Start Guide

## Installation & Running (3 steps)

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open browser and navigate to the URL shown (typically http://localhost:5173)
```

The game will be immediately playable in your browser.

## What You Get

✅ **Fully playable 3D city** with procedurally generated buildings, streets, and vehicles
✅ **Walk & Drive gameplay** - start as a pedestrian, enter any parked car to drive
✅ **Mobile touch controls** - virtual joystick, acceleration, brake, and action buttons
✅ **Desktop keyboard support** - WASD to move, E or Space to enter/exit vehicles
✅ **Realistic vehicle physics** - acceleration curves, braking deceleration, drift, momentum
✅ **Third-person chase camera** - smoothly follows your character as you explore
✅ **Zero loading** - all assets generated procedurally in milliseconds
✅ **Production ready** - optimized for both desktop and mobile browsers

## Project Structure

```
src/
├── index.ts                           # Main game loop
├── engine/
│   ├── Renderer.ts                   # Three.js setup
│   ├── SceneManager.ts               # Object management
│   └── AssetManager.ts               # Geometry/material caching
├── world/
│   └── CityGenerator.ts              # Procedural city
├── physics/
│   └── VehiclePhysics.ts             # Vehicle simulation
├── player/
│   ├── Pedestrian.ts                 # Walking character
│   ├── Vehicle.ts                    # Drivable car
│   └── PlayerController.ts           # State transitions
├── camera/
│   └── ChaseCameraController.ts      # Third-person camera
├── input/
│   ├── KeyboardInput.ts              # Desktop controls
│   └── TouchInput.ts                 # Mobile controls
└── ui/
    └── MobileUI.ts                   # HUD display
```

## Desktop Controls

| Action | Key |
|--------|-----|
| Move Forward | W or ↑ |
| Move Backward | S or ↓ |
| Turn Left | A or ← |
| Turn Right | D or → |
| Enter/Exit Vehicle | E or Space |

## Mobile Controls

| Control | Function |
|---------|----------|
| Left Joystick | Steering (pedestrian/vehicle) |
| ACCEL Button | Accelerate (driving only) |
| BRAKE Button | Brake/Reverse (driving only) |
| ACTION Button | Enter/Exit Vehicle |

## Gameplay Instructions

1. **Start in Walking Mode**: You appear as a low-poly pedestrian character in a procedural city
2. **Explore**: Walk around the city using movement controls
3. **Find a Vehicle**: Look for parked cars (colorful low-poly vehicles)
4. **Enter a Car**: Get near a car and press the ACTION button (ACTION prompt appears when nearby)
5. **Drive**: Once inside, use movement controls to steer, ACCEL/BRAKE to control speed
6. **Exit**: Press ACTION again to exit and return to walking mode

## Building for Production

```bash
# Build the optimized production bundle
npm run build

# The dist/ folder contains the ready-to-deploy files
```

## Deploy to GitHub Pages

1. Build the project: `npm run build`
2. Push the `dist/` directory to your GitHub Pages branch
3. Your game will be live at: `https://username.github.io/gta-haiku/`

Note: The `vite.config.ts` is pre-configured with `base: '/gta-haiku/'` for GitHub Pages. Update it if you're deploying to a different path.

## Performance

- **~5MB uncompressed** (478 KB gzipped with Three.js)
- **Runs smoothly** on modern desktop and mobile browsers
- **Zero network requests** for assets (all procedurally generated)
- **Optimized rendering**:
  - Low-poly geometry (no high-res models)
  - Material instancing
  - No shadow mapping on mobile
  - Viewport culling with fog

## Customization Examples

### Increase City Size
Edit `src/world/CityGenerator.ts`:
```typescript
private gridSize: number = 20; // Default: 15 (increases from 15x15 to 20x20)
```

### Adjust Vehicle Top Speed
Edit `src/physics/VehiclePhysics.ts`:
```typescript
private maxSpeed: number = 40; // Default: 30
```

### Change Starting Position
Edit `src/index.ts`:
```typescript
const startPosition = new THREE.Vector3(100, 0, 100); // Default: (0, 0, 0)
```

## Troubleshooting

**Port 5173 already in use?**
```bash
npm run dev -- --port 5174
```

**Want to build with minification?**
Install terser: `npm install --save-dev terser`
Then restore minify option in `vite.config.ts`

**Game runs slowly?**
Reduce the city grid size or disable fog in `src/engine/Renderer.ts`

## Browser Requirements

- Chrome/Edge 90+
- Firefox 88+
- Safari 15+
- Any modern mobile browser (iOS Safari, Chrome Mobile, etc.)

## Features Implemented

✅ Procedural city generation with grid-based building placement
✅ Low-poly vehicle models with realistic physics simulation
✅ Pedestrian character with walking animation
✅ Dual-state gameplay (walking/driving)
✅ Seamless vehicle enter/exit transitions
✅ Custom vector-based vehicle physics with:
   - Realistic acceleration and braking
   - Speed-dependent turning radius
   - Rolling friction and momentum
   - Drift mechanics for sharp turns
✅ Third-person chase camera with smooth interpolation
✅ Mobile touch interface with virtual joystick and buttons
✅ Desktop keyboard support
✅ Real-time HUD showing state, position, and speed
✅ Action prompt system for interactive elements
✅ Memory-safe asset disposal system
✅ TypeScript strict mode compliance
✅ GitHub Pages deployment ready

## What's Next?

Consider adding:
- Traffic AI with pedestrian/vehicle pathfinding
- Building interiors
- More vehicle types
- Environmental effects (weather, day/night)
- Minimap
- Sound effects and music
- Multiplayer support

---

**Enjoy your GTA Haiku prototype!** 🎮
