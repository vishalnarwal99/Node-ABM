import { World } from './world';

export class Patch {
  public x: number;
  public y: number;
  public variables: Record<string, any>; // Stores 'pcolor', 'state', etc.

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.variables = {
      pcolor: 'black' // Default background color
    };
  }

  // Helper to get a variable safely
  get(key: string): any {
    return this.variables[key];
  }

  // Helper to set a variable
  set(key: string, value: any): void {
    this.variables[key] = value;
  }

  getNeighbors4(world: World): Patch[] {
    const neighbors: Patch[] = [];
    const offsets = [
      { dx: 0, dy: -1 }, // North
      { dx: 0, dy: 1 },  // South
      { dx: 1, dy: 0 },  // East
      { dx: -1, dy: 0 }  // West
    ];

    for (const offset of offsets) {
      const neighbor = world.getPatch(this.x + offset.dx, this.y + offset.dy);
      if (neighbor) neighbors.push(neighbor);
    }
    return neighbors;
  }
}
