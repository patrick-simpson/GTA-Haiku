import * as THREE from 'three';
import { AssetManager } from '../engine/AssetManager';

export interface Building {
  position: THREE.Vector3;
  width: number;
  depth: number;
  height: number;
  color: number;
}

export interface Vehicle {
  position: THREE.Vector3;
  rotation: number;
  color: number;
}

export class CityGenerator {
  private assetManager: AssetManager;
  private gridSize: number = 15;
  private blockSize: number = 60;
  private streetWidth: number = 20;

  constructor(assetManager: AssetManager) {
    this.assetManager = assetManager;
  }

  generate(): { buildings: Building[]; vehicles: Vehicle[] } {
    const buildings: Building[] = [];
    const vehicles: Vehicle[] = [];

    for (let x = -this.gridSize; x <= this.gridSize; x++) {
      for (let z = -this.gridSize; z <= this.gridSize; z++) {
        const blockX = x * (this.blockSize + this.streetWidth);
        const blockZ = z * (this.blockSize + this.streetWidth);

        const buildingsInBlock = this.generateBlockBuildings(blockX, blockZ);
        buildings.push(...buildingsInBlock);

        if (Math.random() < 0.15) {
          const vehicle = this.generateParkedVehicle(blockX, blockZ);
          if (vehicle) vehicles.push(vehicle);
        }
      }
    }

    return { buildings, vehicles };
  }

  private generateBlockBuildings(centerX: number, centerZ: number): Building[] {
    const buildings: Building[] = [];
    const subGridSize = 3;
    const buildingSize = 12;
    const gap = 4;

    for (let x = 0; x < subGridSize; x++) {
      for (let z = 0; z < subGridSize; z++) {
        if (Math.random() > 0.3) {
          const posX =
            centerX -
            (this.blockSize / 2) +
            x * (buildingSize + gap) +
            gap;
          const posZ =
            centerZ -
            (this.blockSize / 2) +
            z * (buildingSize + gap) +
            gap;

          const height = 8 + Math.random() * 24;
          const color = this.getRandomBuildingColor();

          buildings.push({
            position: new THREE.Vector3(posX, 0, posZ),
            width: buildingSize,
            depth: buildingSize,
            height,
            color,
          });
        }
      }
    }

    return buildings;
  }

  private generateParkedVehicle(blockX: number, blockZ: number): Vehicle | null {
    const offset = 10;
    const posX = blockX + (Math.random() - 0.5) * 20;
    const posZ = blockZ + (Math.random() - 0.5) * 20;

    return {
      position: new THREE.Vector3(posX, 0, posZ),
      rotation: Math.random() * Math.PI * 2,
      color: this.getRandomCarColor(),
    };
  }

  private getRandomBuildingColor(): number {
    const colors = [
      0xff6b6b, 0xffa500, 0xffd700, 0xff4500, 0xdc143c,
      0x4169e1, 0x228b22, 0x800080, 0xc0c0c0, 0xa9a9a9,
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private getRandomCarColor(): number {
    const colors = [
      0xff0000, 0x0000ff, 0xffff00, 0xffa500, 0x00ff00,
      0xff1493, 0x00ced1, 0xfffacd, 0x696969,
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  createCityMesh(buildings: Building[]): THREE.Group {
    const group = new THREE.Group();

    buildings.forEach((building) => {
      const geometry = this.assetManager.createBoxGeometry(
        building.width,
        building.height,
        building.depth
      );
      const material = this.assetManager.createMaterial(building.color);
      const mesh = new THREE.Mesh(geometry, material);

      mesh.position.copy(building.position);
      mesh.position.y = building.height / 2;
      mesh.castShadow = false;
      mesh.receiveShadow = false;

      group.add(mesh);

      this.addLampposts(group, building);
    });

    this.createGround(group);
    return group;
  }

  private addLampposts(group: THREE.Group, building: Building): void {
    const lamppositions = [
      new THREE.Vector3(building.position.x - 10, 0, building.position.z - 10),
      new THREE.Vector3(building.position.x + 10, 0, building.position.z + 10),
    ];

    lamppositions.forEach((pos) => {
      const poleGeometry = this.assetManager.createCylinderGeometry(0.3, 0.3, 8, 6);
      const poleMaterial = this.assetManager.createMaterial(0x404040);
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);

      pole.position.copy(pos);
      pole.position.y = 4;
      pole.castShadow = false;
      group.add(pole);

      const lampGeometry = this.assetManager.createSphereGeometry(0.8, 6, 4);
      const lampMaterial = this.assetManager.createMaterial(0xffff00, 0x444400);
      const lamp = new THREE.Mesh(lampGeometry, lampMaterial);

      lamp.position.copy(pos);
      lamp.position.y = 8.5;
      lamp.castShadow = false;
      group.add(lamp);
    });
  }

  private createGround(group: THREE.Group): void {
    const size = 4000;
    const geometry = this.assetManager.createBoxGeometry(size, 1, size);
    const material = this.assetManager.createMaterial(0x4a4a4a);
    const ground = new THREE.Mesh(geometry, material);

    ground.position.y = -0.5;
    ground.receiveShadow = false;
    group.add(ground);
  }
}
